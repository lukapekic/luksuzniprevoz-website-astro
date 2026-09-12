# Cloudflare Pages, Turnstile, D1, and Brevo Forms Implementation Plan

> Implementation status (2026-08-30): repository phases for the shared Pages
> Functions pipeline, D1 migration, Brevo adapter, Turnstile integration,
> localized Contact/Booking states, CSP, and unit/browser contracts are
> implemented. Cloudflare Pages/D1/Turnstile/WAF provisioning, Brevo sender
> verification, live Preview acceptance, and production activation remain
> external rollout gates. See `docs/deployment.md` for the binding checklist.

Status: **READY FOR PHASED IMPLEMENTATION — infrastructure not provisioned**

Scope: production submission for both the general Contact question form and the
Booking/quote request form while preserving static Astro output, the locked page
structures, manual confirmation, localization, accessibility, and the current
Black & Platinum visual system.

This plan supersedes the deferred-submission notes only after Phase 0 updates the
Contact and Booking blueprints and acceptance contracts. Until then, both forms
remain validation-only and must not claim that a request was sent.

## 1. Authority and applied procedures

Implement beneath, in order:

1. root `AGENTS.md`;
2. `DESIGN.md`;
3. the Contact and Booking blueprints and acceptance contracts;
4. canonical site data and existing validation/pricing contracts;
5. `.skills/astro-architecture.md`;
6. `.skills/functional-ui.md`;
7. `.skills/accessibility-wcag.md`;
8. `.skills/multilingual-routing.md`;
9. `.skills/technical-page-review.md`.

The integration is an explicitly authorized runtime boundary. It does not
authorize Astro SSR, a CMS, authentication, checkout, payment, instant booking
confirmation, or unrelated shared-component redesign.

## 2. Locked implementation decisions

| Concern | Decision |
| --- | --- |
| Hosting | Cloudflare Pages with Git integration |
| Rendering | Keep Astro `output: "static"` |
| Runtime | Same-origin Cloudflare Pages Functions |
| Endpoints | `POST /api/forms/contact` and `POST /api/forms/booking` |
| Bot prevention | Cloudflare Managed Turnstile plus edge rate limiting |
| Local bot heuristics | No honeypot and no client timestamp trap |
| Email provider | Brevo transactional email REST API |
| Recipient | Verified office inbox configured outside source control |
| Sender | Verified domain sender; customer email is `replyTo`, never `From` |
| Persistence | D1 metadata/idempotency ledger in V1; no form PII in D1 |
| Confirmation | `202 Accepted`, request pending manual review |
| Customer email | Out of scope for V1; office notification only |
| Locale support | Serbian Latin, English, and Russian with no fallback |
| Secrets | Cloudflare encrypted runtime secrets only |

The D1 V1 decision is intentionally privacy-minimal. It stores a request
reference, form kind, locale, timestamps, status, attempt count, and Brevo
message ID/error category. It does not store names, contact details, addresses,
flight numbers, notes, schedules, or other submitted form content. Brevo is the
approved message-delivery system; its retention configuration must be reviewed
before production.

If durable PII recovery is required later, that is a separate architecture and
data-retention decision requiring a fixed retention period, access rules,
deletion automation, privacy-copy review, and a migration. Do not silently add
full form payloads to D1.

## 3. Reuse boundary

### Reuse from the current repository

- Contact normalization and validation from
  `src/components/contact/contact-form-validation.ts`.
- Contact touched/dirty/error behavior from
  `src/components/contact/contact-form-controller.ts`.
- Booking domain types from `src/data/booking.ts`.
- Booking lead-time, vehicle-capacity, request-building, and pricing contracts
  from `src/lib/booking/*`.
- Canonical service, fleet, pricing, operations, and contact facts from
  `src/data/*`.
- Existing SR/EN/RU booking submission state strings.
- Reviewed `Button`, `Field`, `Input`, `Textarea`, and `FormStatus` primitives.
- Existing no-JavaScript direct-contact recovery paths.
- Existing booking rule that session storage never receives free text or PII.

### Adapt from `transferi-website-astro-backup` `origin/master`

- Pages file-routing concept from `functions/api/booking.ts`.
- Direct Brevo REST call rather than adding the Brevo SDK.
- Verified sender plus office recipient plus customer `replyTo` message shape.
- Plain-text and escaped-HTML notification bodies.
- Turnstile explicit-render lifecycle, token reset, expiry, timeout, and retry
  concepts.
- Production/preview environment-variable checklist and same-origin request
  flow.

### Do not reuse

- The old Booking form markup, theme classes, data model, or Zod schema.
- The honeypot or timestamp trap. The server trap rejects normal submissions
  taking longer than sixty seconds and conflicts with the current blueprint.
- The always-pass Turnstile secret fallback in production.
- The old `success === true`-only Siteverify check.
- Email-only boolean delivery results that discard Brevo message IDs/errors.
- The generic error response for every client failure.
- Fake lead-confirmation UI in the old pricing calculator.
- Old deployment commands using npm or a single-package repository layout.

## 4. Target architecture

```text
ContactForm                       BookingWizard
    |                                  |
    | JSON POST                        | JSON POST
    v                                  v
/api/forms/contact              /api/forms/booking
    |                                  |
    +------------ shared pipeline -----+
                         |
                         +-- method/content-type/body/host checks
                         +-- Managed Turnstile Siteverify
                         +-- canonical server validation
                         +-- booking lead-time/pricing recomputation
                         +-- D1 idempotency/status record
                         +-- Brevo office notification
                         +-- safe structured response/logging
```

Pages Functions remain isolated from Astro page rendering. They may import only
pure TypeScript validators/data helpers from the site; they must not import
Astro components, generated browser bundles, or DOM-dependent controllers.

Use two public endpoints with one shared internal pipeline. Separate endpoints
keep schemas, form actions, rate-limit observability, and email templates
unambiguous while avoiding duplicate security/provider code.

## 5. Public request contracts

Both requests use `Content-Type: application/json` and include:

```ts
interface FormRequestEnvelope<TPayload> {
  submissionId: string; // browser-generated UUID, reused for retries
  locale: "sr" | "en" | "ru";
  turnstileToken: string;
  payload: TPayload;
}
```

Rules:

- Reject non-POST requests without processing a body.
- Reject unsupported media types with `415`.
- Reject a declared or streamed body over the endpoint limit with `413`.
- Accept only known top-level and payload fields.
- Bound every string before expensive normalization/validation.
- Never accept a client price, trusted distance, qualification result,
  confirmation flag, Brevo recipient, sender, or email subject.
- The server derives form kind from the endpoint, never the request body.
- The server derives operational labels/facts from canonical data.

### Contact payload

Use the existing `ContactFormValues` fields only:

```text
fullName
email
phone (optional)
message
```

Run `normalizeContactValues()` and `validateContactForm()` on the server. Send
only the returned normalized values to the email renderer.

### Booking payload

Submit the complete current `BookingDraft`, excluding presentation-only price
text and controller state. The endpoint must:

1. decode untrusted JSON into a strict bounded draft;
2. resolve canonical service and vehicle references;
3. run `validateBookingDraft(..., includeContact: true)`;
4. repeat `Europe/Belgrade` minimum-lead-time validation using server time;
5. call `buildBookingRequest()`;
6. recompute `BookingPricingResult` from canonical data/context;
7. ignore any client commercial result;
8. create an office email from validated contact data, request, and recomputed
   commercial state.

Before activating submission, extend current booking validation so all free
text, phone, notes, counts, and conditional fields have explicit server bounds
and matching client attributes/messages.

## 6. Response contract

Use one discriminated JSON response family:

```ts
type FormResponse =
  | { ok: true; status: "pending"; reference: string }
  | { ok: false; code: "bad_request" }
  | { ok: false; code: "validation"; fields: Record<string, string> }
  | { ok: false; code: "bot_verification" }
  | { ok: false; code: "rate_limited"; retryAfterSeconds?: number }
  | { ok: false; code: "service_unavailable" }
  | { ok: false; code: "server_error" };
```

Status mapping:

| HTTP | Meaning |
| --- | --- |
| `202` | Saved in the idempotency ledger and accepted by Brevo; pending manual review |
| `400` | Malformed JSON/envelope |
| `403` | Turnstile failed, expired, replayed, wrong action, or wrong hostname |
| `413` | Body too large |
| `415` | Unsupported media type |
| `422` | Canonical field/domain validation failed |
| `429` | Edge/application rate limit |
| `503` | Delivery dependency unavailable; safe to retry with the same submission ID |
| `500` | Unexpected server failure |

Never send raw provider errors, stack traces, Turnstile error codes, database
details, or email addresses to the browser. Field errors map to stable codes;
localized strings remain in the approved UI dictionaries.

## 7. Turnstile and abuse prevention

### Widget contract

- Create a Managed Turnstile widget for production hostnames.
- Use action `contact_submit` on Contact and `booking_submit` on Booking.
- Use the public site key at build/client time only.
- Render within the existing light functional surfaces without changing page
  topology.
- Handle ready, verified, expired, timeout, unsupported, and error states.
- Reset or execute a fresh challenge after a failed/retried submission.
- Never store a Turnstile token in session storage, analytics, D1, or logs.

### Server Siteverify contract

- Require the runtime secret; production startup/request handling fails closed
  when it is absent.
- Submit token, Cloudflare client IP when available, and a generated Siteverify
  idempotency key.
- Require `success === true`.
- Require the expected `action` for the endpoint.
- Require `hostname` in the environment-specific allowlist.
- Treat timeout/duplicate and provider/network failures as verification
  failures with safe browser errors.
- Use Cloudflare testing keys only in automated/local environments selected
  explicitly; no fallback is permitted.

### Rate limiting

- Add a Cloudflare WAF rate-limiting rule matching POST requests to
  `/api/forms/*`.
- Start with a documented conservative threshold after confirming the account
  plan and expected shared/mobile-network traffic.
- Return/verify `429` and `Retry-After` behavior where the Cloudflare product
  permits configuration.
- Turnstile and WAF are complementary; neither removes server validation or
  idempotency.
- Do not persist raw IP addresses in D1 or application logs.

Do not use the old honeypot or client-clock heuristic. The current Contact
contract explicitly assigns bot verification to Cloudflare.

## 8. D1 idempotency and status ledger

Binding name: `FORM_DB`.

Initial migration concept:

```sql
CREATE TABLE form_submissions (
  submission_id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  form_kind TEXT NOT NULL CHECK (form_kind IN ('contact', 'booking')),
  locale TEXT NOT NULL CHECK (locale IN ('sr', 'en', 'ru')),
  status TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  brevo_message_id TEXT,
  last_error_code TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

The final migration must add indexes required by actual operational queries and
must remain free of submitted PII.

Delivery sequence:

1. Validate request and Turnstile.
2. Insert `submission_id` plus a generated human-safe reference.
3. If the ID exists, return the existing successful/pending result or resume a
   retryable failed attempt without creating a second notification.
4. Send Brevo with the same submission ID as its idempotency key.
5. Save Brevo message ID and `accepted` status.
6. Return `202 pending`.

Use an atomic status transition/lease so concurrent retries cannot send twice.
Do not expose the UUID; expose the shorter generated reference. The reference
is for support correlation and is not a booking confirmation.

## 9. Brevo delivery adapter

Use `fetch()` directly against Brevo's transactional endpoint; do not add the
SDK unless the REST contract becomes insufficient.

Required runtime configuration:

```text
BREVO_API_KEY          encrypted secret
BREVO_SENDER_EMAIL     verified domain sender
BREVO_SENDER_NAME      approved display name
BREVO_TO_EMAIL         verified office destination
```

Adapter requirements:

- Fail configuration validation when required values are absent.
- Use a separate Brevo API key for this site.
- Set the customer email/name only in `replyTo`.
- Send both escaped HTML and plain-text bodies.
- Tag messages by `contact-form` or `booking-form` and environment.
- Pass the submission UUID as Brevo idempotency metadata/header.
- Set an outbound request timeout.
- Parse and return Brevo message ID on `201`.
- Classify authentication, validation, quota/rate, transient, and network
  failures without logging the submitted body.
- Never retry a non-idempotent send with a new submission ID.

Contact notification includes normalized contact fields and locale. Booking
notification includes the request reference, intent, canonical service,
schedule/time zone, journey, passenger/vehicle selection, recomputed commercial
state, contact fields, and optional notes. It must state that the request is
pending manual confirmation.

V1 sends no acknowledgement to the customer. A later acknowledgement requires
approved localized email copy, unsubscribe/legal classification review where
applicable, delivery-event handling, and a separate acceptance update.

Before production, configure Brevo domain authentication and review Brevo
transactional-log/content-preview retention. Do not rely on Brevo open/click
tracking for form operations.

## 10. Contact form activation

Target files:

```text
src/components/contact/ContactForm.astro
src/components/contact/contact-form-controller.ts
src/components/contact/contact-form-validation.ts
src/components/contact/contact-form.types.ts
src/content/ui/{sr,en,ru}.json
tests/unit/contact-form-validation.test.ts
tests/smoke/contact.spec.ts
```

Required states:

```text
initial -> invalid -> ready -> verifying/submitting
        -> pending success
        -> validation/bot/rate/provider/server failure -> retry
```

Implementation rules:

- Replace the unavailable control only when the endpoint, Turnstile, CSP,
  rate-limit, secret, and delivery gates are complete.
- Preserve the existing field set and page structure.
- Add localized Submit, Submitting, Success, Try again, verification,
  rate-limit, service-unavailable, and server-error copy.
- Add a useful validation summary on submit while retaining field errors.
- Disable duplicate submission while a request is in flight.
- Preserve all entered values on every failure.
- Clear values only after `202` success.
- Announce status changes through `FormStatus` and move focus only when needed
  for recovery.
- Keep direct phone/email as the no-JavaScript and failure fallback.

## 11. Booking form activation

Target files:

```text
src/components/booking/BookingWizard.astro
src/components/booking/booking-controller.ts
src/lib/booking/booking-validation.ts
src/data/booking.ts
src/content/ui/{sr,en,ru}.json
tests/unit/booking.test.ts
tests/smoke/booking.spec.ts
```

Implementation rules:

- Preserve the exact four-step topology, source order, review, Edit behavior,
  summary ownership, and CTA-intent rules.
- Change the final control to a real submit only after all server gates exist.
- Serialize the current draft, not rendered summary text.
- Revalidate the complete draft including contact fields before requesting a
  Turnstile token/submitting.
- Never send or trust the displayed price/commercial state.
- Map server field codes back to the existing error summary and controls.
- Display the localized request reference only after `202`.
- Keep entered PII/free text in the form after failure; do not add it to the
  existing session-storage draft.
- Reset the Turnstile token on retry while preserving booking state.
- Continue to describe every result as pending manual confirmation.
- Retain direct-contact/no-JavaScript recovery.

## 12. Planned server file layout

From repository root:

```text
functions/
  _shared/
    brevo.ts
    email-rendering.ts
    environment.ts
    http.ts
    submission-ledger.ts
    submission-pipeline.ts
    turnstile.ts
    types.ts
  api/
    forms/
      booking.ts
      contact.ts
migrations/
  0001_form_submission_ledger.sql
tests/
  functions/
    booking-handler.test.ts
    contact-handler.test.ts
    brevo.test.ts
    turnstile.test.ts
    submission-ledger.test.ts
```

Add `@cloudflare/workers-types` and a pinned compatible Wrangler version as
root development dependencies only if needed for typing/local integration.
Do not add a server framework or Brevo SDK for two endpoints.

## 13. Cloudflare Pages and monorepo configuration

Use the repository root as the Pages project root so pnpm workspace packages,
root Functions, and generated checks are available.

```text
Production branch:       master
Root directory:          repository root
Build command:           pnpm quality:page
Build output directory:  site/luksuzni-prevoz/dist
Node version:            .nvmrc (must satisfy >=22.19)
```

After creating the Pages project through Git integration, download its current
configuration with Wrangler and review it before committing a Wrangler config.
Do not invent account IDs, D1 IDs, project names, or compatibility settings.
Once committed, the Wrangler file becomes deployment configuration authority
and must match the dashboard.

Bindings/variables must be configured independently for Preview and Production:

```text
FORM_DB                     D1 binding
PUBLIC_TURNSTILE_SITE_KEY   public build variable
TURNSTILE_SECRET_KEY        encrypted runtime secret
TURNSTILE_ALLOWED_HOSTS     environment variable
BREVO_API_KEY               encrypted runtime secret
BREVO_SENDER_EMAIL          environment variable or secret
BREVO_SENDER_NAME           environment variable
BREVO_TO_EMAIL              secret if operational policy requires
FORM_ENVIRONMENT            production | preview | local
```

Preview must not email the production office inbox by accident. Use a separate
test destination or an explicitly injected non-delivery adapter for automated
tests. Production must reject test Turnstile keys and non-production delivery
mode.

## 14. Headers, CSP, routes, and caching

- Convert `site/luksuzni-prevoz/public/_headers` from JSON to Cloudflare Pages'
  plain-text `_headers` syntax.
- Preserve the existing minimum security headers.
- Add only the Turnstile origins required by its official CSP contract.
- Keep CSP report-only during the new third-party rollout, inspect violations,
  then enforce it before declaring production complete.
- Add `Cache-Control: no-store` to every API response.
- Set `X-Content-Type-Options: nosniff` on Function responses because Pages
  `_headers` rules do not cover Function-generated responses.
- Keep form endpoints same-origin; do not add permissive CORS.
- Ensure Pages Functions invoke only `/api/*` and static pages/assets remain
  static via the generated/reviewed `_routes.json` behavior.
- Keep internal application routes trailing-slash compliant; API endpoints are
  platform routes and are not added to localized route maps, sitemap, or
  navigation.

## 15. Implementation phases

### Phase 0 — Contract activation

1. Update Contact/Booking blueprint statuses from validation-only to an
   authorized submission phase without changing locked page structure.
2. Move deferred Cloudflare acceptance items into active blocking gates.
3. Create/update Contact submission acceptance coverage.
4. Record Cloudflare Pages, Managed Turnstile, D1 metadata ledger, and Brevo in
   `docs/deployment.md` as approved targets, clearly marked unprovisioned until
   dashboard resources exist.
5. Record the Brevo retention/content-preview decision before production.

### Phase 1 — Platform-neutral contracts

1. Add strict request decoders and stable error codes.
2. Extend booking bounds and contact reuse for authoritative server validation.
3. Add pure email renderers.
4. Add unit fixtures for every service family and Contact edge case.

### Phase 2 — Shared server pipeline

1. Implement HTTP guards and safe responses.
2. Implement full Siteverify response validation.
3. Implement D1 idempotency/status transitions.
4. Implement the Brevo adapter and message-ID capture.
5. Add Contact and Booking endpoint adapters.
6. Add isolated unit tests with injected/mock fetch and D1 behavior.

### Phase 3 — Cloudflare configuration

1. Create the Pages project and D1 database in the user's Cloudflare account.
2. Download/review the generated Pages Wrangler configuration.
3. Apply the D1 migration to preview first.
4. Configure preview variables, test Turnstile, and non-production email
   destination.
5. Add the WAF rate-limiting rule.
6. Verify Functions routing and static-route exclusions.

This phase changes external infrastructure and requires the exact Cloudflare
project/account selections. Do not guess those identifiers.

### Phase 4 — Contact UI

1. Run design preflight for exact Contact targets/surface.
2. Add localized submission/error states and Turnstile widget.
3. Connect the existing validation controller to the Contact endpoint.
4. Add keyboard, error-summary, retry, and no-JavaScript tests.
5. Run the Contact UI verification profile and accessibility review.

### Phase 5 — Booking UI

1. Run design preflight for exact Booking targets/surface.
2. Add explicit free-text/contact bounds and localized errors.
3. Enable the final action and connect complete-draft submission.
4. Add Turnstile, reference, pending, and recovery behavior.
5. Verify all service, price-result, locale, focus, and storage branches.
6. Run the Booking UI verification profile and accessibility review.

### Phase 6 — Preview burn-in and production rollout

1. Deploy Preview with production-equivalent CSP/routing and isolated secrets.
2. Exercise successful, invalid, expired-token, duplicate, rate-limited,
   Brevo-failure, and D1-failure paths.
3. Confirm actual receipt, sender authentication, Reply-To, message ID, and no
   PII in logs/D1.
4. Review Brevo logs/retention and Cloudflare Function logs.
5. Apply production D1 migration and secrets.
6. Deploy production and submit one Contact and one Booking smoke request.
7. Verify the office receives both and references match the API/UI ledger.
8. Enforce CSP only after report-only evidence is clean.

## 16. Test and verification matrix

### Server unit tests

- only POST and JSON accepted;
- body limit enforced before full processing;
- unknown/malformed fields rejected;
- Contact normalization exactly matches browser validation;
- every Booking service branch decodes and validates;
- server time-zone/DST/lead-time behavior;
- client price/qualification fields ignored or rejected;
- Turnstile success, failure, timeout/duplicate, wrong hostname, wrong action,
  network error, and missing secret;
- D1 first insert, duplicate success, concurrent retry, retryable failure, and
  message-ID update;
- Brevo request escaping, Reply-To, tags, idempotency, success parsing, timeout,
  auth, validation, rate, and transient failure;
- no response/log fixture contains submitted PII.

### Browser/accessibility tests

- SR/EN/RU Contact and Booking success/failure states;
- keyboard-only form completion and retry;
- useful field errors plus error summary;
- focus after invalid submission, server failure, and success;
- status announcements and non-color-only feedback;
- token expiry/reset without data loss;
- double-click/Enter duplicate prevention;
- no-JavaScript direct-contact recovery;
- booking session storage still excludes PII/free text/token;
- 320, 768, 1024, 1440, and 1920 widths with no overflow and 44x44 targets.

### Required repository gates

```bash
pnpm design:context --target site/luksuzni-prevoz/src/components/contact/ContactForm.astro --surface contact
pnpm design:context --target site/luksuzni-prevoz/src/components/booking/BookingWizard.astro --surface booking
pnpm components:check
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate:check
pnpm theme:validate site/luksuzni-prevoz
pnpm theme:sync:check
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm lint
pnpm test:unit
pnpm test:a11y
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm verify:ui --target site/luksuzni-prevoz/src/components/contact/ContactForm.astro --surface contact --change page
pnpm verify:ui --target site/luksuzni-prevoz/src/components/booking/BookingWizard.astro --surface booking --change page
pnpm quality:release
```

Add a deterministic Functions build/typecheck and Functions unit-test command to
the root quality gate before deployment. Never claim Pages runtime behavior is
covered by Astro build alone.

## 17. Deployment rollback

Code rollback:

1. Roll Pages back to the last known-good deployment.
2. The previous UI must retain direct-contact recovery.
3. Keep D1 migration backward compatible during the initial rollout.
4. Disable the endpoint/WAF rule only after the old UI no longer submits to it.

Provider incident recovery:

- Preserve form values and show the localized retry/direct-contact state.
- Do not switch to a different email provider automatically.
- Use D1 references and Brevo message IDs for diagnosis without logging form
  content.
- A provider change requires an explicit adapter/configuration change and a
  preview test.

## 18. External prerequisites and unresolved decisions

The following cannot be completed from source inspection alone:

- Cloudflare account/project name and production branch confirmation;
- whether apex and `www` are both accepted production hostnames;
- Cloudflare plan/WAF rate-limit capability and final threshold;
- D1 database creation and binding IDs;
- Turnstile widget creation and site/secret keys;
- Brevo verified sender/domain state;
- production and preview destination inboxes;
- Brevo transactional-log/content-preview retention decision;
- whether a customer acknowledgement email is desired in a later phase;
- legal/privacy-copy confirmation for form processing and third parties.

These are production provisioning gates, not permission to invent values or
weaken local validation/security.

## 19. Definition of done

The integration is complete only when:

- both endpoints pass all server/security tests;
- both forms expose complete localized pending/failure/retry states;
- Turnstile action and hostname checks are verified in Preview and Production;
- the WAF rate-limit rule is active and tested;
- D1 contains metadata only and duplicate requests do not duplicate email;
- Brevo delivers both form types with verified sender and functional Reply-To;
- no secret or submitted PII appears in `dist`, source, logs, URLs, analytics,
  D1, screenshots, or test artifacts;
- Contact and Booking retain manual-confirmation language and direct fallback;
- CSP is reviewed and enforced without blocked production assets;
- all repository, UI, accessibility, Functions, and production smoke gates pass;
- exact Cloudflare/Brevo configuration and rollback instructions are recorded
  in `docs/deployment.md`.
