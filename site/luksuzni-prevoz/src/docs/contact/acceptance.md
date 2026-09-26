# Contact form submission acceptance

Apply with the locked Contact blueprint and `docs/cloudflare-pages-forms/README.md`.
Repository checks and live Cloudflare checks are separate evidence.

## Repository

- [ ] Serbian Latin, English, and Russian show approved labels, errors, and status copy.
- [ ] Required name, email, and message; optional phone; normalized client and server validation agree.
- [ ] Invalid fields have associated errors and a focusable summary.
- [ ] The server-rendered submit button is disabled; without JavaScript, no GET request can expose form data in a URL and verified direct contact remains available.
- [ ] Turnstile renders before submission is enabled; expiry, timeout, errors, and retry preserve entered values.
- [ ] An unchanged retry reuses its request ID; an edit starts a new ID.
- [ ] Successful acceptance clears every field and validation error, hides the
  public reference, emphasizes confirmation for 10 seconds, and keeps readable
  confirmation text afterward until the next edit/submission. A new question
  gets a new request ID. Failures preserve entered values.
- [ ] Contact Turnstile uses flexible size at container widths of at least 300
  CSS px and compact below; crossing the threshold refreshes the widget/token
  without horizontal overflow. Booking retains its existing compact default.
- [ ] A duplicate `processing` request cannot show a received state; changed content under one ID is rejected.
- [ ] Mobile, tablet portrait, tablet landscape, desktop, and wide desktop preserve the locked split, keyboard order, 44×44 targets, and zero overflow.

## Cloudflare Preview and Production

- [ ] The exact Pages host, Function route manifest, D1 migrations/binding, encrypted secrets, and WAF rule are verified.
- [ ] Siteverify accepts only the configured host and `contact_submit` action; expired and replayed tokens fail.
- [ ] A real Contact request returns a reference, D1 records `accepted`, and the approved office inbox receives one Brevo notification with the verified sender and Reply-To.
- [ ] Invalid input, bot failure, provider failure, D1 failure, and ambiguous delivery do not claim that a question was received.
- [ ] CSP is enforced after clean Preview evidence, and no submitted content or secret appears in URLs, D1, logs, or build output.
