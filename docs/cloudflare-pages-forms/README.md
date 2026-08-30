# Cloudflare Pages Forms Deployment Runbook

This runbook explains how to deploy the Luxury Transportation Astro site to
Cloudflare Pages and activate the Contact and Booking forms with Cloudflare
Pages Functions, Turnstile, D1, edge rate limiting, and Brevo transactional
email.

The repository implementation is complete. Cloudflare and Brevo account
provisioning is intentionally not stored in source control and still has to be
performed by an account owner.

Last infrastructure and free-plan review: **2026-08-30**.

## 1. What is already implemented

The production site remains a statically generated Astro application. Only the
two form endpoints run server-side:

```text
Browser
  |
  | POST JSON + Turnstile token
  v
Cloudflare Pages Function
  |-- verify request host, method, content type, and body size
  |-- verify Turnstile token, action, and hostname
  |-- run canonical server-side form validation
  |-- claim the submission ID in D1
  |-- send the office notification through Brevo
  |-- update D1 with delivery status and Brevo message ID
  v
202 Accepted + human-readable request reference
```

Implemented endpoints:

| Form    | Endpoint                  | Maximum request body | Turnstile action |
| ------- | ------------------------- | -------------------: | ---------------- |
| Contact | `POST /api/forms/contact` |               16 KiB | `contact_submit` |
| Booking | `POST /api/forms/booking` |               64 KiB | `booking_submit` |

Key repository locations:

| Purpose                             | Location                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pages Functions                     | [`functions/`](../../functions/)                                                                                                                                               |
| Shared validation/delivery pipeline | [`functions/_shared/submission-pipeline.ts`](../../functions/_shared/submission-pipeline.ts)                                                                                   |
| D1 ledger implementation            | [`functions/_shared/submission-ledger.ts`](../../functions/_shared/submission-ledger.ts)                                                                                       |
| Brevo adapter                       | [`functions/_shared/brevo.ts`](../../functions/_shared/brevo.ts)                                                                                                               |
| Turnstile verification              | [`functions/_shared/turnstile.ts`](../../functions/_shared/turnstile.ts)                                                                                                       |
| Initial D1 migration                | [`migrations/0001_form_submission_ledger.sql`](../../migrations/0001_form_submission_ledger.sql)                                                                               |
| Detailed implementation contract    | [`site/luksuzni-prevoz/src/docs/forms/cloudflare-pages-brevo-implementation-plan.md`](../../site/luksuzni-prevoz/src/docs/forms/cloudflare-pages-brevo-implementation-plan.md) |
| General deployment contract         | [`docs/deployment.md`](../deployment.md)                                                                                                                                       |

## 2. Do we really need a database?

### Short answer

Email can technically be sent without a database, but **this implementation
requires D1 and fails closed when the `FORM_DB` binding is missing**. D1 provides
the durable idempotency and delivery ledger that an email-only endpoint cannot
provide safely.

### What problem D1 solves

Browsers, mobile networks, users, and reverse proxies can retry the same form
request. Two identical requests can also arrive concurrently. Without durable
state, each Pages Function invocation has no reliable way to know that another
invocation already sent the email.

D1 gives the pipeline:

- a unique submission ID supplied by the browser and reused on retry;
- one stable support reference such as `LP-20260830-12AB34CD`;
- a durable `processing`, `accepted`, or `failed` delivery state;
- an attempt counter and controlled retry path;
- the Brevo message ID needed to correlate a request with Brevo logs;
- protection against common double-click, browser retry, and concurrent-request
  duplicate emails;
- operational evidence when the visitor saw an error but Brevo may have
  accepted the message.

This is a delivery ledger, not a CRM and not a backup of the inquiry. Exactly-once
email delivery cannot be mathematically guaranteed across every possible
network/provider failure, so the office should still use the stable request
reference to recognize a rare duplicate.

### What D1 stores

The current table is deliberately metadata-only:

| Column                     | Purpose                                    | Contains form PII? |
| -------------------------- | ------------------------------------------ | ------------------ |
| `submission_id`            | Browser-generated UUID and idempotency key | No                 |
| `reference`                | Short support correlation reference        | No                 |
| `form_kind`                | `contact` or `booking`                     | No                 |
| `locale`                   | `sr`, `en`, or `ru`                        | No                 |
| `status`                   | `processing`, `accepted`, or `failed`      | No                 |
| `attempt_count`            | Number of claimed delivery attempts        | No                 |
| `brevo_message_id`         | Brevo delivery correlation ID              | No                 |
| `last_error_code`          | Safe internal failure category             | No                 |
| `created_at`, `updated_at` | Millisecond timestamps                     | No                 |

It does **not** store names, email addresses, phone numbers, route addresses,
dates, passenger information, flight details, notes, or message content. Those
values are sent to Brevo only after validation.

Do not add full form payloads to D1 without a separate privacy and data-retention
decision covering access control, retention duration, deletion automation, and
privacy-copy changes.

### Why D1 instead of another store

| Option                 | Advantages                                                                     | Disadvantages                                                     | Decision                             |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------ |
| No database            | Fewest resources                                                               | No durable idempotency, status, or provider correlation           | Rejected for the production pipeline |
| Cloudflare D1          | SQL uniqueness, same-account binding, scale-to-zero, small operational surface | Requires schema/migrations and quota monitoring                   | Selected                             |
| Cloudflare KV          | Simple key/value storage                                                       | A weaker fit for atomic uniqueness and status transitions         | Not selected                         |
| Durable Objects        | Strong per-object coordination                                                 | More code and operational complexity than this small ledger needs | Not selected                         |
| External database/SaaS | May provide richer dashboards or CRM behavior                                  | Another vendor, credentials, network dependency, and cost model   | Not needed for V1                    |

### Why separate Preview and Production databases

Create two databases, for example:

```text
luksuzni-prevoz-forms-preview
luksuzni-prevoz-forms-production
```

Separate databases prevent test submissions and schema experiments from
polluting production delivery history. They also allow migrations to be proven
in Preview before Production. Both can use the same binding name, `FORM_DB`,
because Cloudflare resolves the binding per environment.

## 3. Does D1 fit on Cloudflare's Free plan?

Yes. For the expected traffic and metadata-only schema, the Free plan has a
large safety margin.

Current official Free limits:

| Resource                         |     Free allowance | Fit for this site                                              |
| -------------------------------- | -----------------: | -------------------------------------------------------------- |
| D1 databases                     |     10 per account | Two databases use 2 of 10                                      |
| Maximum size per D1 database     |             500 MB | Metadata-only rows should remain small                         |
| Total D1 storage                 |   5 GB per account | Shared by all D1 databases in the account                      |
| D1 rows read                     |  5,000,000 per day | Far above normal form volume                                   |
| D1 rows written                  |    100,000 per day | Far above normal form volume                                   |
| D1 Time Travel                   |             7 days | Useful recovery window on Free                                 |
| Pages Functions/Workers requests |    100,000 per day | Each form request consumes one invocation                      |
| Static Pages requests            | Free and unlimited | Normal page and asset traffic does not use the Functions quota |
| Turnstile verification           |  Unlimited on Free | Appropriate for production use                                 |
| Turnstile widgets                |     20 per account | One or two widgets are sufficient                              |
| Turnstile hostnames              |      10 per widget | Enough for production plus a stable preview hostname           |
| Pages builds                     |      500 per month | Usually sufficient with sensible branch controls               |

An accepted first-time submission performs an insert, a primary-key lookup, and
a status update. D1 also meters writes to indexes. A conservative planning
estimate is roughly **6–10 written rows and a few read rows per successful new
submission**. At that estimate, the 100,000-row daily write allowance still
supports roughly 10,000 successful submissions per day before retries or manual
database work—orders of magnitude above the expected business volume. Use the
D1 dashboard's actual Row Metrics rather than treating this estimate as billing
data.

Free D1 limits reset at `00:00 UTC`. If the account reaches a daily read/write
limit, D1 queries fail until reset, and the forms return a safe server error. If
the storage limit is reached, new writes and schema changes stop until stale
data is deleted or the account is upgraded. D1 has no separate data-transfer or
idle-compute fee.

Cloudflare quotas are account-wide where noted. Other Workers and D1 projects in
the same account consume the same allowances. Brevo has its own independent
transactional-email quota; verify that quota in the Brevo account before launch.

Official references:

- [D1 pricing and daily allowances](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 platform limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Pages platform limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)

## 4. Required accounts and decisions

Before provisioning, confirm:

- access to the Cloudflare account that owns or will own
  `luksuzniprevoz.rs`;
- access to the GitHub repository and permission to install the Cloudflare
  Pages Git integration;
- a Brevo account with a site-specific transactional API key;
- a Brevo sender/domain that can be authenticated with DNS records;
- the production office recipient address;
- a separate Preview/test recipient address;
- who owns D1 monitoring, Brevo delivery review, secret rotation, and metadata
  retention.

Never use the production office recipient for routine Preview testing.

## 5. Provision Cloudflare Pages

In Cloudflare, open **Workers & Pages**, create a Pages application, and connect
the Git repository.

Use these settings:

| Pages setting          | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Production branch      | `master`                                                                 |
| Root directory         | Repository root; leave the advanced path empty                           |
| Framework preset       | None/custom                                                              |
| Build command          | `pnpm types:generate:check && pnpm --filter @luksuzni-prevoz/site build` |
| Build output directory | `site/luksuzni-prevoz/dist`                                              |
| Functions directory    | Root `functions/`, discovered automatically                              |

The repository root must remain the Pages root. Pointing Pages directly at
`site/luksuzni-prevoz` would hide the workspace packages and root `functions/`
directory from the build/deployment contract.

Add these build variables to both Preview and Production:

| Variable                    | Value                         | Reason                                               |
| --------------------------- | ----------------------------- | ---------------------------------------------------- |
| `NODE_VERSION`              | `22.22.2`                     | Matches `.nvmrc` and satisfies the repository engine |
| `PNPM_VERSION`              | `10.14.0`                     | Matches `packageManager` in root `package.json`      |
| `PUBLIC_TURNSTILE_SITE_KEY` | Environment's public site key | Activates the form UI at build time                  |

`PUBLIC_TURNSTILE_SITE_KEY` is intentionally public. It is embedded in the
generated site. The matching Turnstile secret must never be a build variable or
committed file.

Cloudflare Pages supports `.nvmrc`, but explicit version variables make the
dashboard contract visible and reduce surprises when build images change.

## 6. Establish a stable Preview environment

Use a dedicated branch such as `staging` for acceptance testing. Pages creates
a stable branch alias:

```text
staging.<cloudflare-project-name>.pages.dev
```

Each commit also receives a hash-based preview URL. This repository performs an
exact hostname check after Turnstile verification, so use the stable branch
alias for acceptance tests and list that exact hostname in
`TURNSTILE_ALLOWED_HOSTS`.

Recommended branch controls:

- `master` is Production;
- `staging` is the persistent Preview acceptance environment;
- limit automatic preview builds if unrelated branches would consume the
  500-build monthly allowance;
- optionally protect Preview deployments with Cloudflare Access;
- confirm Preview responses carry `X-Robots-Tag: noindex`.

## 7. Create and configure Turnstile

Create a **Managed** Turnstile widget in the Cloudflare dashboard.

Suggested hostname entries:

```text
luksuzniprevoz.rs
<cloudflare-project-name>.pages.dev
```

Adding a hostname to Turnstile also authorizes its subdomains, so the
`pages.dev` project hostname covers stable branch and hash-based preview
subdomains at the widget layer. The application allowlist is stricter and still
requires each actually used hostname to be listed exactly.

Use separate Preview and Production widgets if you want completely independent
keys and analytics. One widget can also cover both environments if its hostname
list and secret handling are acceptable. Separate widgets are easier to rotate
and safer during testing, and the Free plan supports up to 20.

Record the following without committing them:

```text
PUBLIC_TURNSTILE_SITE_KEY   public site key
TURNSTILE_SECRET_KEY        encrypted secret
```

Production must use a real Managed widget. The server explicitly refuses
Cloudflare's always-pass testing secret when `FORM_ENVIRONMENT=production`.

## 8. Create and migrate D1

Create the two D1 databases in the Cloudflare account:

```text
luksuzni-prevoz-forms-preview
luksuzni-prevoz-forms-production
```

Apply the initial schema to Preview first:

1. Open **Storage & Databases > D1** in Cloudflare.
2. Select the Preview database.
3. Open its SQL Console.
4. Paste and execute the contents of
   [`migrations/0001_form_submission_ledger.sql`](../../migrations/0001_form_submission_ledger.sql).
5. Verify the table and index:

```sql
SELECT name, type
FROM sqlite_schema
WHERE name LIKE 'form_submissions%'
ORDER BY type, name;
```

Expected objects include the `form_submissions` table and
`form_submissions_status_updated_idx`. SQLite may also show automatic indexes
for the primary-key and unique-reference constraints.

After Preview acceptance, repeat the same migration against Production. The
current migration uses `IF NOT EXISTS`, so repeating it is safe, but every
execution still consumes a small amount of D1 usage.

The repository intentionally does not yet contain a Wrangler configuration
with invented account/database IDs. If infrastructure is later managed from the
CLI, first add a reviewed, pinned Wrangler dependency and configuration using
the real resource identifiers, then use Cloudflare's D1 migration workflow.

## 9. Bind D1 to Pages

For each environment:

1. Open **Workers & Pages** and select the Pages project.
2. Go to **Settings > Bindings**.
3. Add a **D1 database binding**.
4. Set the variable name to exactly `FORM_DB`.
5. Select the Preview database for Preview and the Production database for
   Production.
6. Save and redeploy so the binding is available to the Function.

Do not use one shared database for both environments, and do not rename the
binding without changing the server contract.

## 10. Configure Brevo

Brevo is the email delivery provider; Cloudflare is the host, validation edge,
and small state ledger. This repository already implements and tests the Brevo
REST adapter, so Brevo remains the recommended V1 delivery provider.

Cloudflare now also offers **Email Sending Beta**. General outbound sending is
currently listed as a Workers Paid feature, while sending to verified
destination addresses is available free on any plan. That makes Cloudflare
Email Service a credible future alternative for fixed office notifications,
but it is not a configuration-only replacement: this repository would need a
new delivery adapter, binding or REST credentials, error mapping, message-ID
handling, tests, and a new Preview acceptance cycle.

| Concern             | Brevo (current implementation)                 | Cloudflare Email Service (possible future adapter)                        |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| Repository work     | Implemented and tested                         | New implementation and tests required                                     |
| Account readiness   | Existing API key                               | Domain onboarding and Email Service setup required                        |
| Delivery operations | Mature transactional logs and provider tooling | Newer Email Sending product, currently Beta                               |
| Free-plan relevance | Controlled by the Brevo account plan           | Verified-destination sending can be free; general sending is Workers Paid |
| Vendor count        | Adds Brevo as an email processor               | Consolidates more infrastructure in Cloudflare                            |
| Migration risk      | Lowest for V1                                  | Requires a deliberate provider migration                                  |

Recommendation: launch V1 with Brevo, then reassess Cloudflare Email Service
after production requirements and the Email Sending product's maturity are
clear. Do not provision and operate both providers without a documented
failover/idempotency design; automatic fallback between providers can create
duplicate notifications.

Before production:

1. Authenticate the sending domain in Brevo and add the required DNS records.
2. Verify the sender address used by `BREVO_SENDER_EMAIL`.
3. Create a dedicated API key for this site instead of reusing a broad key.
4. Set the customer's validated email only as `Reply-To`, never as `From`.
5. Confirm the Production recipient and a separate Preview recipient.
6. Review Brevo transactional-log and message-content-preview retention.
7. Decide whether Brevo click/open tracking should remain disabled for these
   operational messages.

The implementation sends both escaped HTML and plain-text bodies. It tags
messages by form kind and environment and records Brevo's returned message ID
in D1. V1 sends an office notification only; it does not send a customer
acknowledgement.

Brevo plan limits are independent of Cloudflare. If the Brevo quota is
exhausted, the endpoint marks the attempt failed and returns a retryable service
error; D1 capacity does not increase the Brevo allowance.

Official Cloudflare email references:

- [Cloudflare Email Service availability](https://developers.cloudflare.com/email-service/)
- [Cloudflare Workers email API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Email sending to verified destinations](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)

## 11. Configure runtime variables and secrets

Configure values separately for Preview and Production under the Pages
project's **Settings > Variables and Secrets**. Encrypt API keys and tokens.

| Name                      | Type               | Preview example               | Production example                                            |
| ------------------------- | ------------------ | ----------------------------- | ------------------------------------------------------------- |
| `FORM_ENVIRONMENT`        | Plain variable     | `preview`                     | `production`                                                  |
| `TURNSTILE_ALLOWED_HOSTS` | Plain variable     | `staging.<project>.pages.dev` | `luksuzniprevoz.rs,www.luksuzniprevoz.rs,<project>.pages.dev` |
| `TURNSTILE_SECRET_KEY`    | Encrypted secret   | Preview widget secret         | Production widget secret                                      |
| `BREVO_API_KEY`           | Encrypted secret   | Site-specific Brevo key       | Site-specific Brevo key                                       |
| `BREVO_SENDER_EMAIL`      | Plain or encrypted | Verified sender               | Verified sender                                               |
| `BREVO_SENDER_NAME`       | Plain variable     | Approved brand name           | Approved brand name                                           |
| `BREVO_TO_EMAIL`          | Prefer encrypted   | Test recipient                | Office recipient(s)                                           |
| `FORM_DB`                 | D1 binding         | Preview database              | Production database                                           |

`BREVO_TO_EMAIL` accepts comma-separated recipients. Hostname values never
include schemes, ports, paths, or wildcards.

The function returns `503 service_unavailable` if any required runtime value is
missing. Changing a binding, runtime variable, secret, or public build variable
requires a new deployment before the change is available everywhere.

## 12. Add the production rate-limiting rule

Turnstile and rate limiting solve different problems. Turnstile checks whether
the interaction is likely legitimate; rate limiting caps repeated traffic from
one source before it can consume excessive Function, D1, or Brevo capacity.

On the Cloudflare Free WAF plan there is one rate-limiting rule. Free rules can
match the request path and count by IP, but cannot match HTTP method. Use the
single rule for both form paths:

```text
(http.request.uri.path eq "/api/forms/contact") or
(http.request.uri.path eq "/api/forms/booking")
```

A reasonable starting point is **10 requests per 10 seconds per IP**, with a
10-second block/mitigation period. This is an initial operational value, not a
permanent product requirement. Test it with mobile/shared-network traffic and
adjust it based on real abuse and false positives.

Because Method is unavailable in the Free rule expression, all requests to
these exact paths count. The application itself accepts only `POST` and returns
`405` for other methods. Do not broaden the expression to all `/api/*` paths.

The zone WAF protects the proxied custom production domain. A raw `pages.dev`
Preview deployment may not receive the same zone rule, so protect Preview with
Turnstile, a stable allowlisted hostname, branch controls, and optionally
Cloudflare Access.

Official reference: [Cloudflare rate-limiting plan capabilities](https://developers.cloudflare.com/waf/rate-limiting-rules/).

## 13. Deployment order

Follow this order so each irreversible external step is proven in isolation:

1. Run repository verification locally.
2. Create the Pages project with Git integration.
3. Establish the stable `staging` Preview alias.
4. Create the Preview Turnstile widget/key.
5. Create and migrate the Preview D1 database.
6. Configure Preview variables, encrypted secrets, and `FORM_DB` binding.
7. Configure a Preview-only Brevo recipient.
8. Deploy Preview and complete the acceptance checklist.
9. Create/migrate the Production D1 database.
10. Configure Production keys, exact hosts, office recipient, and binding.
11. Attach and verify the production custom domain and TLS.
12. Add/test the WAF rate-limiting rule.
13. Deploy Production.
14. Submit one real Contact request and one real Booking request.
15. Confirm UI reference, D1 row, Brevo message ID, sender authentication, inbox
    receipt, and `Reply-To` all agree.
16. Review CSP report-only evidence before changing CSP to enforcement.

## 14. Local and repository verification

From the repository root, use pnpm only:

```bash
pnpm install --frozen-lockfile
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site test:unit
pnpm --filter @luksuzni-prevoz/site build
```

For the complete page gate:

```bash
pnpm quality:page
```

The existing unit suite tests the shared form runtime with fake D1 and provider
adapters. A real end-to-end Functions/D1/Turnstile/Brevo test belongs in the
Pages Preview environment because the repository does not yet contain real
Cloudflare resource bindings or secrets.

## 15. Preview acceptance checklist

### Platform and static site

- [ ] Build uses Node `22.22.2` and pnpm `10.14.0`.
- [ ] Serbian, English, and Russian routes load.
- [ ] Static assets, fonts, redirects, sitemap, and robots behavior are correct.
- [ ] Preview has `X-Robots-Tag: noindex`.
- [ ] Browser console contains no blocked Turnstile, CSP, or mixed-content
      errors.
- [ ] Direct phone/email recovery remains available if JavaScript is disabled.

### Function and security behavior

- [ ] `GET /api/forms/contact` returns `405` with `Allow: POST`.
- [ ] `GET /api/forms/booking` returns `405` with `Allow: POST`.
- [ ] Missing/invalid runtime configuration returns `503` and sends no email.
- [ ] Wrong request hostname is rejected.
- [ ] Expired/invalid Turnstile tokens are rejected.
- [ ] Correct tokens require the exact Contact or Booking action.
- [ ] Oversized and malformed JSON requests are rejected.
- [ ] API responses use `Cache-Control: no-store`.
- [ ] No raw provider/database error or submitted PII appears in the browser
      response or Function logs.

### Successful delivery

- [ ] Contact returns `202`, shows a request reference, and sends one email.
- [ ] Booking returns `202`, shows a request reference, and sends one email.
- [ ] The email states that the request is pending manual review.
- [ ] The From address is the verified Brevo sender.
- [ ] Reply-To is the customer's validated address.
- [ ] D1 contains the matching reference, `accepted` status, and Brevo message
      ID.
- [ ] D1 contains no form content or customer PII.
- [ ] Repeating the same browser submission ID returns the same reference and
      does not normally create a second message.

### Failure and recovery

- [ ] Brevo rejection/outage produces a recoverable error without clearing the
      user's fields.
- [ ] A retry reuses the same submission ID and reference.
- [ ] Turnstile expiry/reset does not lose entered data.
- [ ] D1 unavailability fails safely and does not send an untracked email.
- [ ] Rate-limit behavior is understandable to the user; note that an edge WAF
      response may be handled as a generic send failure if it does not return
      the application's JSON response format.

## 16. Monitoring and operations

### D1

Review the Preview and Production D1 dashboards after launch:

- Row Metrics for daily reads and writes;
- database storage size;
- failed/overloaded queries;
- unexpected growth in `processing` or `failed` statuses;
- account-wide D1 usage from other projects.

Useful privacy-safe operational queries:

```sql
SELECT form_kind, status, COUNT(*) AS count
FROM form_submissions
GROUP BY form_kind, status
ORDER BY form_kind, status;
```

```sql
SELECT reference, form_kind, locale, status, attempt_count,
       brevo_message_id, last_error_code, created_at, updated_at
FROM form_submissions
ORDER BY created_at DESC
LIMIT 50;
```

Timestamps are stored as Unix milliseconds. Do not add submitted form values to
diagnostic queries or logs.

### Retention

Even though the ledger contains no submitted PII, define an operational
retention period. A reasonable starting decision is 90–180 days, long enough
for delivery/support investigation without accumulating unnecessary metadata.
That period is not yet automated or locked in the repository.

After approving a retention period, deletion can be run with a reviewed cutoff:

```sql
DELETE FROM form_submissions
WHERE created_at < ?;
```

Do not paste an unverified timestamp into Production. Preview the count with the
same predicate first, record the cutoff, and remember that deleting rows also
consumes the D1 write allowance. If scheduled cleanup is desired, that requires
an explicit Worker/Cron architecture change.

### Brevo

Monitor:

- transactional quota and rate limits;
- authentication, rejection, bounce, and spam events;
- sender-domain authentication status;
- message IDs correlated with D1 references;
- transactional-log and content-preview retention settings.

Do not treat open/click tracking as proof that the office processed a booking.

### Cloudflare

Monitor:

- Pages build failures and monthly build count;
- Workers/Pages Functions daily requests;
- Function errors and latency;
- Turnstile challenge outcomes and hostname/action failures;
- WAF rate-limit events and false positives.

## 17. Troubleshooting

| Symptom                                           | Likely cause                                                  | Check                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Submit button remains unavailable                 | Public site key absent at build time                          | `PUBLIC_TURNSTILE_SITE_KEY`, then redeploy                                    |
| Every request returns `503`                       | Missing runtime configuration/binding                         | All required values and `FORM_DB` in the correct environment                  |
| Turnstile widget does not render                  | Wrong site key, hostname, or CSP                              | Widget hostnames, build variable, browser console, `_headers`                 |
| Turnstile succeeds visually but API returns `403` | Secret mismatch, exact host/action mismatch, or expired token | Widget pair, `TURNSTILE_ALLOWED_HOSTS`, action, Turnstile analytics           |
| API returns `400` only on Preview                 | Preview alias not in exact application allowlist              | `TURNSTILE_ALLOWED_HOSTS`                                                     |
| D1 errors after deployment                        | Missing binding, migration not applied, or quota reached      | Pages bindings, D1 schema, Row Metrics                                        |
| UI reports success but inbox is empty             | Filtering/delay after Brevo accepted the message              | D1 message ID, Brevo transactional log, spam/quarantine                       |
| Brevo returns auth/validation failures            | Bad API key or unverified sender                              | Brevo key scope, sender/domain status                                         |
| Production receives Preview messages              | Wrong environment recipient                                   | Preview `BREVO_TO_EMAIL` and environment separation                           |
| Duplicate message is reported                     | Retry/provider ambiguity                                      | Compare stable reference, submission ID, attempt count, and Brevo message IDs |
| WAF blocks legitimate shared-network users        | Threshold too strict for IP counting                          | Rate-limit events and threshold                                               |

## 18. Security and privacy rules

- Never commit Cloudflare account IDs, database IDs, Brevo API keys, Turnstile
  secrets, `.env`, or `.dev.vars` files without an approved configuration need.
- Use Cloudflare encrypted secrets for API keys and Turnstile secrets.
- Rotate a leaked Brevo key and Turnstile secret immediately, then redeploy.
- Never put the visitor's email in the Brevo From address; use Reply-To.
- Keep form endpoints same-origin and do not add permissive CORS.
- Keep Turnstile token, raw IP address, request payload, and provider error body
  out of D1 and logs.
- Keep the CSP restricted to the reviewed Turnstile origins. Do not add wildcard
  script/frame sources.
- A `202 Accepted` response means the office notification was accepted for
  manual review. It is not a booking confirmation.
- Review the site's privacy/legal copy and Brevo retention before Production.

## 19. Rollback and incident response

For a bad site deployment, use Cloudflare Pages rollback to restore the last
known-good deployment. Do not edit generated files on the host.

For a form-specific incident:

1. Preserve D1 and Brevo evidence; do not delete the database.
2. If a secret leaked, revoke/rotate it before any redeployment.
3. To stop outbound email immediately, revoke the site-specific Brevo key. The
   form then fails closed with a service error.
4. Roll back Pages to the last known-good deployment.
5. Verify direct phone/email contact remains visible.
6. Confirm no PII entered application logs or D1.
7. Correct the issue in source, run repository gates, deploy Preview, and repeat
   acceptance before Production.

Database schema rollback should be forward-migrated where possible. Do not drop
the Production ledger or run destructive SQL without an explicit backup,
verified target, and reviewed recovery plan.

## 20. Launch record

Complete this table when provisioning is finished:

| Decision                     | Final value                          |
| ---------------------------- | ------------------------------------ |
| Cloudflare Pages project     | TBD                                  |
| Production Pages hostname    | TBD                                  |
| Stable Preview hostname      | TBD                                  |
| Production branch            | `master`                             |
| Preview branch               | TBD, recommended `staging`           |
| Preview D1 database          | TBD                                  |
| Production D1 database       | TBD                                  |
| D1 binding                   | `FORM_DB`                            |
| Turnstile widget strategy    | TBD: separate or shared              |
| Production allowed hosts     | TBD                                  |
| Preview Brevo recipient      | TBD                                  |
| Production Brevo recipient   | TBD                                  |
| Brevo sender/domain verified | TBD                                  |
| WAF threshold/action         | TBD after Preview test               |
| Ledger retention period      | TBD                                  |
| Brevo log/content retention  | TBD                                  |
| CSP enforcement date         | TBD after clean report-only evidence |
| Operational owner            | TBD                                  |
| Production smoke-test date   | TBD                                  |

## 21. External documentation

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/)
- [Pages Functions bindings and encrypted secrets](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages build image and version variables](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Cloudflare Turnstile widget management](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)
- [Cloudflare Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
- [Cloudflare WAF rate-limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
