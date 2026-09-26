# Reusable forms: small package and full setup guide

Updated: 2026-09-26. This guide separates reusable code from the account provisioning and application decisions needed for a complete form service.

## 1. What was extracted now

[`packages/form-kit`](../../packages/form-kit/) is a private TypeScript workspace source package named `@astro-foundation/form-kit`. It has no runtime dependencies and no imports from this website, Astro, Cloudflare bindings, business data, translations, or theme tokens.

| Entry point | Extracted responsibility |
| --- | --- |
| Package root | Optional-phone shape validation; strict DD/MM/YYYY ↔ YYYY-MM-DD conversion; 24-hour HH:mm validation |
| `/browser` | Turnstile script/widget lifecycle, responsive widget sizing, token reset, temporary submission-control locking |
| `/turnstile/server` | Siteverify request, expected action/hostname check, fail-closed timeout/error handling |
| `/brevo` | One transactional HTTP send with caller-rendered text/HTML and Reply-To; accepted/rejected/uncertain result |

Existing site import paths remain compatibility exports. The existing Brevo adapter renders the site's branded notification and supplies its sender, recipients, tags, and environment. Contact and Booking still use their existing validators/controllers and server pipeline. No schema, endpoint, form layout, copy, credentials, or account settings change as part of extraction.

The browser controller accepts an application-defined action string. The host's server must still match the exact expected action. Generic root helpers do not load browser/provider code. Email delivery and Turnstile server verification have separate entry points to keep secrets and transport out of browser bundles.

## 2. Reuse in another project

For another TypeScript-aware pnpm workspace:

1. Copy `packages/form-kit/` and include it in the workspace's package globs.
2. Its tsconfig currently extends the repository root config. In the destination, provide an equivalent strict ES2022/bundler config with DOM Web API types, `noEmit`, and `allowImportingTsExtensions`, or adapt that extends path.
3. Add `"@astro-foundation/form-kit": "workspace:*"` to the consuming site's dependencies and the server-host package's dependencies.
4. Run `pnpm install`, then the package check/unit tests.
5. Import only the entry points needed by each environment; see the [package README](../../packages/form-kit/README.md).

For a separate repository without a workspace, a local `file:` dependency or vendored source can be bundled by the host. This package exports TypeScript source, following the repository's existing convention. Plain Node consumers and registry publication require a compiled JavaScript/declaration distribution; that build/release work is deferred. No registry package has been published.

The extracted phone policy is deliberately small: an optional blank value; `+` or `00` international prefix or a local leading `0`; 7–15 dialing digits; common separators; at most 32 displayed characters. It is not a universal national-number library. Another site's different country policy should be supplied by that application.

## 3. What stays in the application

| Keep local | Why |
| --- | --- |
| Field labels, error/success text, localization | Product copy and accessibility belong to the host |
| Form markup, wizard branches, progress and summaries | Different websites have different forms |
| Required fields, name/email policy, business rules | These depend on the form's purpose |
| Booking services, prices, capacity, lead time, timezone | Verified operational facts belong to this site |
| CTA URLs and handoff whitelist | Route and privacy contracts differ |
| Email HTML renderer and brand tokens | The package accepts already-rendered email |
| Pages endpoints and request envelope | Host owns routing, body limits and supported locales |
| D1 claim/digest/status workflow | Current types are coupled to Contact/Booking and manual confirmation |
| WAF/rate limiting, secrets and DNS | Infrastructure configuration, not a JavaScript library |

A future generic submission engine would need injected validators, renderer, ledger, reference factory, locale policy, and digest serialization. That is useful later but exceeds this small extraction. Queues, automatic retries, provider switching, CRM integrations, retention automation and an admin reconciliation interface are also deferred.

## 4. Full service flow to preserve

```text
Static form + local validation
  → POST JSON { submissionId, locale, turnstileToken, payload }
  → check request method, same origin/host, content type and bounded body
  → verify Turnstile token, hostname and action
  → validate the payload again on the server
  → bind submission ID to form/locale/payload with an HMAC digest
  → atomically claim the ID in a durable ledger
  → render escaped HTML + plain text
  → send once through Brevo
  → record provider acceptance/message ID
  → return pending manual confirmation
```

Client validation improves feedback; the server remains authoritative. Price/result fields supplied by a browser are untrusted. Changing input after a failed send starts a new submission ID; retrying the same payload retains its ID.

The package alone does not implement this complete service. Reuse the existing host integration as a reference:

- [`functions/_shared/submission-pipeline.ts`](../../functions/_shared/submission-pipeline.ts)
- [`functions/_shared/validation.ts`](../../functions/_shared/validation.ts)
- [`functions/_shared/http.ts`](../../functions/_shared/http.ts)
- [`functions/_shared/submission-ledger.ts`](../../functions/_shared/submission-ledger.ts)
- [`functions/_shared/email-rendering.ts`](../../functions/_shared/email-rendering.ts)
- [`functions/api/forms/`](../../functions/api/forms/)

These files still import this site's domain/content types and must be adapted rather than copied unchanged into another product.

## 5. Cloudflare Pages and Functions

Create a Pages project for the static site. Build the host site with its actual public Turnstile site key. Keep Functions under the deployment root's `functions/`, even when the site's built assets are in a nested directory. Configure route inclusion for the intended API paths; this repository generates a `dist/_routes.json` for its form endpoints.

The current endpoints are `POST /api/forms/contact` (16 KiB maximum body) and `POST /api/forms/booking` (64 KiB). These are host choices, not package defaults. Both reject unsupported methods, missing runtime configuration, malformed bodies, wrong origin/host, invalid bot verification, and invalid payloads.

Preview and Production bindings/variables are configured separately. Follow [Cloudflare Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/) and [Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/).

Use one stable preview hostname, such as `staging.example-project.pages.dev`. Every hostname must be allowed by both the Turnstile widget and the host endpoint. A working stable alias does not authorize every immutable deployment hostname. The earlier hash-host failure for this website was resolved by using its allowed stable staging alias.

## 6. Turnstile

Create separate Preview and Production widgets where practical. Copy each widget's public site key to the corresponding build environment and its private secret to the corresponding Functions runtime environment.

- Browser action: a stable identifier such as `contact_submit` or `booking_submit`.
- Server: compare the successful token's action and hostname with the application's expected values.
- Widget lifecycle: obtain a fresh token, reset after sending, and recover from expiration/load failure.
- Never put the secret in an Astro `PUBLIC_*` variable.
- Test keys belong to local/automated tests; the current pipeline refuses known test secrets in Production.

Cloudflare requires server-side verification; tokens expire after five minutes and are single-use. See [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Retain an explicit CSP allowance for `https://challenges.cloudflare.com` in the directives required by the widget. Inspect the host's actual generated headers and Cloudflare's current [Turnstile CSP guidance](https://developers.cloudflare.com/turnstile/reference/content-security-policy/). Keep the other existing CSP/header rules; do not use wildcard allowances to fix a blocked widget.

## 7. Brevo sender, DNS and API key

1. Create/choose the Brevo transactional account and verify the sending domain/sender.
2. Add exactly the domain-verification and DKIM records generated by that account for that domain. Names/values are not reusable constants.
3. Review the domain's single existing DMARC record and add the requested reporting destination without replacing provider mail settings blindly.
4. Preserve the existing MX, mail hostname, SPF and provider DKIM records when the provider continues hosting mailboxes. Adding a transactional sender does not require moving those mailboxes.
5. Confirm Brevo domain authentication and sender readiness before live sending.
6. Create a dedicated API key, store it as a runtime secret, and configure allowed-IP settings consistently with the deployment's egress model if that account restricts API access.
7. Use a verified office sender; set the validated visitor address as Reply-To. Send Preview notifications to the intended test recipient(s).

The package posts caller-rendered HTML/plain text to Brevo's transactional endpoint. A provider message ID establishes API acceptance; inbox arrival must be checked separately. See [Brevo transactional API](https://developers.brevo.com/docs/send-a-transactional-email).

For this website's actual DNS backups and authentication changes, consult [mail-service.md](mail-service.md). Do not copy its Brevo verification token or DKIM targets into another domain's zone.

## 8. D1 ledger

The existing application requires a `FORM_DB` D1 binding and fails closed without it. The extracted transport can technically send without D1, but any complete reusable endpoint still needs a durable duplicate-send strategy.

Create separate Preview/Production databases. Apply both migrations in order to a new database:

1. [`0001_form_submission_ledger.sql`](../../migrations/0001_form_submission_ledger.sql)
2. [`0002_form_submission_digest.sql`](../../migrations/0002_form_submission_digest.sql)

Bind the proper database to `FORM_DB` in each environment. The second migration adds the digest column; it is not optional. Use D1 migration history for upgrades, rather than blindly reapplying SQL against an existing database. See [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/).

The ledger stores metadata/digests/status, not the full personal message. Preserve atomic submission-ID claims, digest identity checks, processing/accepted/failed states, and provider-message IDs when adapting it.

## 9. Runtime/build configuration

| Setting | Location | Purpose |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | Public widget key compiled into the browser |
| `FORM_ENVIRONMENT` | Runtime variable | `preview`, `production`, or `local` |
| `TURNSTILE_ALLOWED_HOSTS` | Runtime variable | Comma-separated exact hostnames; no scheme, path or wildcard |
| `TURNSTILE_SECRET_KEY` | Runtime secret | Private verification key |
| `FORM_IDEMPOTENCY_SECRET` | Runtime secret | Independent 32+ character HMAC secret per environment |
| `BREVO_API_KEY` | Runtime secret | Transactional API credential |
| `BREVO_SENDER_EMAIL` | Runtime configuration | Verified sender address |
| `BREVO_SENDER_NAME` | Runtime configuration | Host-owned public brand |
| `BREVO_TO_EMAIL` | Runtime configuration | Comma-separated intended recipients |
| `FORM_DB` | D1 binding | Correct database for that environment |

The standalone helpers accept explicit inputs, not these env-variable names. The names above belong to the current host pipeline. After changing keys, build variables, runtime settings or bindings, deploy a fresh build and verify the active environment.

Keep secrets out of Git, static HTML, logs, screenshots, example files and browser bundles. Local runtime secrets can live in ignored `.dev.vars`; public build configuration belongs to the host's normal environment mechanism.

## 10. Submission, failure and abuse behavior

Keep a duplicate-submit lock and restore each control's previous disabled state afterward. Required/optional fields and localized errors stay with the form. Reset user data only after genuine server acceptance; preserve it on recoverable failures. Communicate pending manual confirmation without claiming a completed booking.

| Result | Host behavior |
| --- | --- |
| Validation or bot verification failure | Explain the issue, preserve data, obtain a fresh token |
| Brevo 429 rejection | Record failure; allow a controlled retry using the same payload identity |
| Brevo 5xx, network interruption, unreadable/missing success ID | Keep processing/uncertain state; reconcile before resending |
| Brevo API acceptance | Record message ID and stable reference; repeated submission ID must not send again |
| D1 update failure after send | Preserve duplicate protection and reconcile the accepted provider message |

These outcome classes describe the existing implementation's conservative policy. They are not a generic guarantee that every provider failure is safe to retry. An `X-Submission-Id` email header helps correlation; it does not replace the ledger.

Configure edge rate limiting for the actual form paths on the deployed hostname and test rejection/recovery. The current pipeline does not implement a general application rate limiter; WAF rules are account configuration and must be reviewed for each deployment.

## 11. Acceptance before using another site

- Package check/unit tests and host lint/types/build pass.
- HTML/build output contains no private keys.
- Hostname/action mismatch fails verification.
- Server rejects invalid payloads regardless of client validation.
- Duplicate and concurrent request IDs send at most once; edited payloads cannot reuse an old ID.
- Return/past/lead-time scheduling rules use the host's explicit timezone.
- Narrow-screen widget, keyboard focus, localized errors and all responsive states are reviewed.
- Wrong method/body/origin and provider failure paths recover correctly.
- A live Preview submission reaches the expected inbox and Reply-To works.
- Sender/domain authentication, rate limiting and D1 binding/schema are confirmed.
- Production uses its own keys, database, hosts and recipients; release only after the host's required review gates.

## 12. Larger extraction deferred

| Future option | Required work |
| --- | --- |
| Complete generic server pipeline | Inject validators/locale/reference/digest policy and ledger/renderer adapters; migrate existing integration tests |
| Generic D1 adapter | Remove Contact/Booking/locale coupling, define portable schema/version/retention contracts |
| Shared form controller | Separate UI/error mapping, wizard state and transport without losing accessibility/recovery |
| Portable email themes | Define a caller-owned token/template contract and mail-client acceptance |
| Published package | Compile JS/declarations, export compatibility, version/release policy, standalone installation tests |
| Delivery queue/reconciliation UI | Define operational retries, privacy/retention and failure ownership |

The current extraction intentionally stops at small stable utilities and transports. This document records the remaining complete service setup and later options.

## 13. Verification record

Authority: root AGENTS.md and `.skills/astro-architecture.md`, with the existing functional form contracts. Compatibility paths and site adapters are retained. No visible UI or localization changes, new third-party runtime dependency, schema change, or infrastructure provisioning is required for this extraction.

Verification on 2026-09-26:

| Command / check | Result |
| --- | --- |
| `pnpm --filter @astro-foundation/form-kit check` | Passed |
| `pnpm --filter @astro-foundation/form-kit test:unit` | 6 tests passed through the package's public exports |
| Site unit tests | 53 tests passed |
| `pnpm check` and `pnpm lint` | Passed |
| `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA pnpm build` | Passed; local testing artifact only |
| Chromium: `booking.spec.ts`, `contact.spec.ts`, `forms-audit.spec.ts` | 34 tests passed, with mocked widget/provider submissions |
| `pnpm dlx wrangler@4.75.0 pages functions build functions --outfile /tmp/lp-form-kit-functions.js` | Worker compiled successfully |
| `git diff --check` | Passed |

The extraction also passed all 15 static gates with `DESIGN_GOVERNANCE_BASE=44dacd4 pnpm verify:ui --target site/luksuzni-prevoz/src/lib/forms/turnstile-client.ts --surface contact --change foundation --scope-complete`. This ran in an isolated checkout containing only the extraction, because unrelated working-tree route changes made the main checkout's design snapshot stale. Its generated evidence is `/tmp/lp-form-kit-review/.design/.cache/verify-ui-1790425087740.json`; it records automated static verification, not independent visual approval.

Changed files comprise the new `packages/form-kit/` source, tests and README; root/site manifests and workspace lockfile; four compatibility exports under the site's `src/lib/`; the Functions Brevo/Turnstile adapters and result type; this guide and the forms documentation index. There is no shared presentation component/API change, blueprint deviation, new placeholder or missing asset.

No live email was sent and no deployment, DNS, secret, D1 or account setting was changed. No new manual visual review was performed for this behavior-preserving extraction. Existing Firefox/WebKit runtime limitations and independent UI review requirements still apply to any UI release; the static foundation gate does not waive them. Registry publishing and the larger extractions in section 12 remain future work.
