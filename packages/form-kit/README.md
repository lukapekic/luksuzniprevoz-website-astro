# @astro-foundation/form-kit

Small, framework-independent TypeScript helpers extracted from the working Contact/Booking integration. No runtime dependencies, site imports, branding, translations, routes, database, or automatic email retries.

This is a private workspace **source package** for TypeScript-aware bundlers such as Astro/Vite and Wrangler. It is not published to a registry and does not yet provide compiled JavaScript for plain Node installations.

## Entry points

| Import | Purpose | Environment |
| --- | --- | --- |
| `@astro-foundation/form-kit` | Phone shape validation, DD/MM/YYYY conversion, HH:mm validation | Browser/server |
| `@astro-foundation/form-kit/browser` | Turnstile controller and temporary form-control locking | Browser |
| `@astro-foundation/form-kit/turnstile/server` | Token verification with expected action and allowed hostname | Server |
| `@astro-foundation/form-kit/brevo` | Send caller-rendered email once; classify rejected/uncertain outcomes | Server |

Keep server imports out of browser bundles. Browser globals are accessed only when browser functions are called; the pure root entry point does not import widget code.

```ts
import { maskDisplayDate, parseDisplayDate, combineHourMinute, isValidPhoneNumber } from "@astro-foundation/form-kit";

maskDisplayDate("01092026"); // "01/09/2026"; partial input is also masked
parseDisplayDate("31/12/2028"); // "2028-12-31"; impossible dates return null
combineHourMinute("23", "59"); // "23:59"; invalid/incomplete parts return ""
isValidPhoneNumber("060-123-4567"); // true; an empty optional phone is also valid
```

Phone validation is a shape check: `+`/`00` international prefixes or local numbers beginning with `0`, 7–15 dialing digits, maximum 32 displayed characters, common separators. A host project can supply a different policy when needed; this package does not infer national dialing rules or normalize numbers to E.164.

```ts
import { createTurnstileController, lockSubmissionControls } from "@astro-foundation/form-kit/browser";

const widget = createTurnstileController({
  container, siteKey: publicSiteKey, action: "contact_submit", size: "flexible",
});
await widget.render();
// widget.getToken(), widget.reset(), widget.destroy()
const unlock = lockSubmissionControls(form);
try { /* Submit one validated payload. */ } finally { unlock(); }
```

Widget default size remains compact; flexible switches to compact below the provider's minimum width. The host owns CSP, visible error/status messages, token polling, and lifecycle cleanup.

```ts
import { verifyTurnstile } from "@astro-foundation/form-kit/turnstile/server";
import { sendBrevoTransactionalEmail } from "@astro-foundation/form-kit/brevo";

const verified = await verifyTurnstile({
  token, secret: env.TURNSTILE_SECRET_KEY, expectedAction: "contact_submit",
  allowedHosts: ["forms.example.com"],
});
// Validate the body and claim durable idempotency before sending.
const result = await sendBrevoTransactionalEmail({
  apiKey: env.BREVO_API_KEY,
  sender: { email: "office@example.com", name: "Example" },
  to: [{ email: "team@example.com" }],
  replyTo: { email: validatedEmail, name: validatedName },
  subject, text, html, submissionId,
});
```

Examples are fragments: host code supplies all variables, validates recipient/Reply-To values, escapes HTML, and handles `verified === false` before delivery. An `uncertain: true` result can mean the provider accepted the message before the response was interrupted. Preserve a processing ledger entry and reconcile manually; do not blindly resend. A correlation header is not provider idempotency. `ok: true` means provider acceptance, not delivery to an inbox.

## Migration and verification

Existing site/helper import paths remain as compatibility exports. The existing Brevo function remains a site adapter that supplies configuration and renders the branded template. Its payload, timeouts, Reply-To, tags, correlation header, and failure classification are retained. Turnstile's browser action type accepts a host-defined string; the site's server still pins its two approved actions.

Run `pnpm --filter @astro-foundation/form-kit check` and `pnpm --filter @astro-foundation/form-kit test:unit`. Root check/unit scripts include this package. Site tests continue to verify the existing adapters and real consumers.

[Full reusable setup guide](../../docs/cloudflare-pages-forms/reusable-setup.md) describes the Cloudflare, Brevo, DNS, CSP, D1, and application pieces.
