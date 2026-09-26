# SPEC: Brevo primary delivery with a PHP SMTP standby

Recorded: **2026-09-26 UTC**.

Status: **PROPOSED — documentation only; not implemented or provisioned**.

This specification captures the owner's proposed alternative delivery path.
Brevo remains the first choice for launch. Implementation is deferred until
after project finalization and requires a separate implementation task and
Preview acceptance. This document does not change the current production
contract or claim that PHP delivery is available.

## 1. Authority and scope

Apply root `AGENTS.md`, the repository's `astro-architecture` procedure,
the [current deployment runbook](./README.md), and the
[forms implementation contract](../../site/luksuzni-prevoz/src/docs/forms/cloudflare-pages-brevo-implementation-plan.md).
Reconcile the provider-specific portions of that contract and the Contact and
Booking acceptance documents when implementing this proposal.

The website stays static on Cloudflare Pages. Contact and Booking keep their
existing same-origin endpoints, localized responses, Turnstile verification,
canonical server validation, booking pricing recomputation, and D1 ledger.
Notifications remain office-only and pending manual confirmation.

The existing cPanel host runs a small PHP HTTPS relay. It uses the purchased
mailbox's SMTP service; it does not install or operate a new SMTP server.
There is no new Node service, Astro SSR, public browser-to-PHP submission path,
customer acknowledgement, or separate backup website in this scope.

## 2. Architecture

```text
Browser
  -> Cloudflare Pages Function: Contact or Booking
       -> existing request bounds, origin checks, Turnstile, validation
       -> D1 submission claim and stable request reference
       -> provider selection
            brevo -> existing Brevo REST adapter
            php   -> signed HTTPS request to cPanel PHP relay
                       -> durable relay submission claim
                       -> PHPMailer -> provider SMTP -> office inbox
       -> D1 delivery result
  <- existing pending/error response
```

Cloudflare owns business validation and email rendering. PHP accepts only the
bounded, authenticated relay contract; it does not duplicate booking rules,
prices, localized content, or the browser's form schema. Reuse
`functions/_shared/email-rendering.ts` for both providers.

This is an alternative email delivery path. Both paths still depend on
Cloudflare Pages, Turnstile, and D1; it is not recovery from a Cloudflare outage.

## 3. Provider selection

Proposed Cloudflare runtime setting:

```dotenv
FORM_EMAIL_PROVIDER=brevo
```

| Value | Behavior |
| --- | --- |
| `brevo` | Send through Brevo; default choice for launch |
| `php` | Send through the PHP relay; manually selected standby |

Require an explicit valid value after migration. Configure `brevo` in both
environments before deploying the new code. Missing/unknown values fail closed;
do not silently select a provider because another is misconfigured.
Require credentials for the selected provider, plus the existing mandatory
Turnstile/D1 configuration. A PHP selection must not require a Brevo API key.

The setting is server-only, read from the deployment environment rather than
client input or a browser bundle. The Cloudflare adapter URL is operator-owned
configuration, never derived from submitted content. Preserve HTTPS certificate
validation and reject redirects to avoid forwarding signatures or content.

Changing providers affects only newly claimed or safely retryable submissions.
It never resends an accepted submission or releases an uncertain `processing`
submission. Document and verify the redeployment required for configuration
changes; do not promise an instantaneous dashboard toggle.

### Automatic fallback is deferred

The first implementation is a manual switch. Do not implement an automatic
`brevo-with-php-fallback` mode as part of it.

A future automatic mode needs a separately reviewed failure classification and
tests. Only a proven, eligible non-acceptance may permit another provider to
send. A timeout, connection interruption, malformed acceptance response, or
server error can leave acceptance uncertain. None permits an immediate resend
through PHP. Configuration/authentication errors must remain visible to the
operator rather than being hidden by fallback.

## 4. Configuration and secrets

### Cloudflare runtime

| Proposed setting | Storage/purpose |
| --- | --- |
| `FORM_EMAIL_PROVIDER` | Plain runtime setting: `brevo` or `php` |
| `PHP_RELAY_URL` | Fixed HTTPS endpoint, required for PHP selection |
| `PHP_RELAY_KEY_ID` | Identifier for the active signing key |
| `PHP_RELAY_SIGNING_SECRET` | Encrypted runtime secret, dedicated to this relay |

Keep existing Brevo, Turnstile, and D1 configuration. Separate Preview and
Production signing keys, relay namespaces, and recipient configuration. Do not
reuse `FORM_IDEMPOTENCY_SECRET` as the relay signing key.

### PHP host

Private configuration contains the allowed signing keys, SMTP host/port/TLS
mode, username/password, fixed sender/name, fixed recipient allowlist, and
database credentials. Store it outside the public document root with restricted
permissions. If environment variables are unavailable on cPanel, use a private
configuration file loaded by PHP. Never commit credentials or publish them in
errors, logs, or a diagnostics page.

The owner supplied SMTP settings for `mail.luksuzniprevoz.rs`, port `465`,
implicit TLS, and authenticated mailbox access. Treat those as deployment
inputs to reverify; the screenshot does not prove PHP connectivity. Sender and
recipient addresses remain verified private configuration rather than literals
in application components. See [mail configuration history](./mail-service.md).

## 5. Relay authentication and API

Use one dedicated HTTPS POST endpoint on a host/subdomain selected during
provisioning. It is reachable for Cloudflare's outbound HTTPS calls but requires
authentication on every request. Endpoint obscurity and CORS are not security
boundaries. Do not expose a public browser submission API or allow anonymous
health checks to send mail.

Version the request schema. Proposed JSON body fields:

```text
version: 1
environment: preview | production
submissionId: existing browser UUID, validated by Cloudflare
reference: existing stable request reference
kind: contact | booking
locale: configured form locale
subject: rendered subject
text: rendered plain-text body
html: rendered escaped HTML body
replyTo: { email, name }
```

Do not accept sender, recipients, arbitrary mail headers, attachments, SMTP
options, or transport URLs in this body. PHP validates exact allowed fields,
types, enums, UTF-8, UUID/reference format, field lengths, and header-injection
characters. Bound the streamed request before decoding; define a maximum of
128 KiB for the rendered relay envelope and ensure all valid existing form
payloads fit that limit in tests.

Proposed request headers:

```text
Content-Type: application/json
X-Relay-Key-Id: <configured key identifier>
X-Relay-Timestamp: <Unix seconds>
X-Relay-Signature: <lowercase hex HMAC-SHA256>
```

Sign the UTF-8 bytes of `timestamp + "\n" + exact raw JSON body`. Verify the
signature with a constant-time comparison and reject timestamps outside a
five-minute clock-skew window. Authenticate before interpreting content beyond
the bounded body and required authentication headers. Durable submission
identity checks provide replay/deduplication protection within that window.
Use separate secrets and an agreed rotation procedure; never log signatures.

Successful response: HTTP `200` with a versioned JSON result containing
`status: accepted` and the stable relay message ID. Here `accepted` means SMTP
accepted the message, not that it reached the inbox. An identical accepted
retry returns the original result without sending again.

Define machine-readable, bounded failure responses distinguishing definitive
pre-delivery rejection, in-progress/uncertain delivery, and submission identity
conflict. Do not classify safety solely by HTTP status. A missing, invalid, or
unverifiable response is uncertain after a send may have started. Internal SMTP
diagnostics and credentials are never returned. Responses use `no-store` and
`nosniff`. Set bounded connection/SMTP/request timeouts and test their ordering;
timeouts do not authorize a resend.

## 6. Durable identity and delivery state

### Cloudflare D1

Preserve the existing keyed payload digest, atomic submission claim, stable
reference, concurrent-request exclusion, and metadata-only persistence.
Add provider-neutral tracking through an additive migration:

- provider selected for each claimed attempt;
- provider message ID or relay correlation ID;
- safe provider-qualified error category;
- sufficient attempt history to reconcile a provider switch.

Existing accepted Brevo rows remain accepted. Preserve/backfill the existing
`brevo_message_id` without destructive migration; update types, ledger queries,
test doubles, and operational documentation together. A PHP correlation ID is
not a Brevo ID or proof of inbox delivery.

### PHP relay

Use a durable database with a unique `(environment, submissionId)` identity
and atomic claim. Select MySQL or SQLite after checking hosting capabilities.
Bind identity to a keyed digest of the immutable email payload, excluding the
per-attempt timestamp/signature. Reject the same ID with different content.
Persist metadata only: identity, keyed digest, reference, timestamps, status,
attempt count, correlation ID, and safe error category. Never persist message
content, Reply-To, credentials, or raw submitted PII in the relay ledger/logs.

Generate and persist a stable SMTP Message-ID before sending. It aids
correlation but is not itself duplicate prevention. Do not hold an open database
transaction across the SMTP network call.

| State/result | Retry behavior |
| --- | --- |
| Accepted | Return stored result; never send again |
| Processing or uncertain | Do not send again; require operator reconciliation |
| Proven failure before SMTP acceptance | Permit an atomic controlled retry |
| Same identity, different payload | Reject; never send |

SMTP disconnects during/after final message submission, process crashes after
acceptance, or failed accepted-state writes leave uncertainty. Retain the claim
for reconciliation; do not expire it into a resend automatically. Cloudflare
must retain its own uncertain claim even if the provider setting changes.
Exactly-once delivery cannot be guaranteed across all network/process failures.

## 7. Hosting, mail, and privacy prerequisites

Before implementation/deployment, verify:

- available maintained PHP version compatible with the selected PHPMailer
  release, OpenSSL, and the chosen database driver;
- upload method, document root, HTTPS certificate, private configuration path,
  durable database, and maintenance/backup ownership;
- permission to send through authenticated SMTP, timeouts, provider quota,
  and delivery-log access;
- current provider SPF/DKIM alignment for the configured sender and coexistence
  with Brevo; preserve existing mailbox hosting and authentication records;
- mail DNS points directly to the provider independently of the website domain
  during any website DNS migration;
- fixed metadata-retention period and deletion procedure for both ledgers,
  preserving unresolved delivery identities until reconciliation;
- privacy/processor documentation and the hosting provider's email/log
  retention, since form PII now passes through another delivery path.

Deploy PHPMailer with locked dependencies; dependencies can be packaged before
upload if Composer is unavailable on cPanel. Keep SMTP debug output disabled in
production and restrict access to logs. cPanel already executes PHP on demand;
no additional daemon is required.

The relay subdomain may use Cloudflare's HTTP proxy, but that is not a substitute
for request authentication. Confirm any bot/WAF policy permits the authenticated
Function call without a browser challenge. SMTP's hostname stays DNS-only.

No additional subscription is expected if existing hosting/mailbox quotas are
sufficient. This is an expectation to confirm with the provider, not an
unlimited/free-service guarantee.

## 8. Implementation sequence and acceptance

1. Confirm hosting prerequisites and select the relay deployment location.
2. Reconcile the current forms contract and acceptance documents with this
   provider alternative; preserve page/UI behavior and all configured locales.
3. Implement the provider adapter interface and explicit environment selector.
4. Add additive D1 tracking and migration/backward-compatibility tests.
5. Implement PHP authentication, bounded schema, durable ledger, and SMTP send.
6. Write deployment, key rotation, monitoring, retention, switching, and
   reconciliation instructions. Package private configuration examples without
   credentials.
7. Prove both providers in controlled Preview before enabling PHP in Production.
8. Keep Production on Brevo until the standby passes acceptance; switch back to
   Brevo as rollback without deleting ledger records or resetting identities.

Required automated cases include invalid/missing provider configuration,
signatures, expired timestamps, oversized/malformed bodies, fixed recipient
enforcement, concurrent and repeated submissions, changed-content conflicts,
SMTP rejection, ambiguous acceptance, crashes/failed ledger writes, provider
switches with accepted/uncertain records, and legacy D1 rows. PHP integration
tests must run against a test SMTP service without sending real customer mail.

Live Preview acceptance must separately demonstrate:

- Contact and Booking in every configured locale preserve the current API
  response and manual-confirmation semantics;
- Brevo remains functional with `FORM_EMAIL_PROVIDER=brevo`;
- PHP SMTP delivers one notification with the stable reference, correct sender,
  and customer Reply-To;
- unauthorized calls and identical retries send no extra messages;
- provider switching does not resend accepted or uncertain submissions;
- secrets/content are absent from public output and operational logs;
- provider DNS/authentication, quota, and private configuration are verified.

At implementation time run the applicable repository gates, including lint,
unit tests, site check/build, migrations against a separate Preview database,
and PHP checks/tests. Apply `verify:ui` and the required independent review only
if production UI/page contracts are changed. Report automated evidence and live
delivery/inbox confirmation separately; neither is established by this SPEC.

## 9. Open deployment decisions

- Relay hostname/document root and deployment access.
- Actual PHP version/extensions and database availability.
- Fixed Preview/Production recipients and SMTP credentials.
- Signing-key rotation and deployment procedure.
- Ledger retention, monitoring owner, and reconciliation process.
- Provider email limits, SMTP connectivity, and inbox placement.

## 10. References

- [Cloudflare outbound HTTPS Fetch](https://developers.cloudflare.com/workers/runtime-apis/fetch/)
- [Cloudflare Pages environment variables and encrypted secrets](https://developers.cloudflare.com/pages/functions/bindings/)
- [PHPMailer SMTP and deployment documentation](https://github.com/PHPMailer/PHPMailer)
- [cPanel PHP version configuration](https://docs.cpanel.net/cpanel/software/multiphp-manager-for-cpanel/)
- [cPanel outgoing mail limits](https://docs.cpanel.net/knowledge-base/email/how-to-set-email-send-limits/)
- [Cloudflare mail DNS guidance](https://developers.cloudflare.com/dns/troubleshooting/email-issues/)
