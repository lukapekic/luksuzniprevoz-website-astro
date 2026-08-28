# Luxury Transportation — Contact Page Blueprint v1

Status: **Locked structural blueprint — published visual-review implementation**

Purpose: Source of truth for the Contact page structure, contact-data presentation,
question-form behavior, responsive topology, accessibility, and deferred Cloudflare
integration.

## 1. Authority

Apply this blueprint beneath root `AGENTS.md` and `DESIGN.md`. The active theme and
reviewed shared-component contracts own visual tokens and primitive behavior. The
contact wireframe defines structure only.

## 2. Goal

Give visitors two clear ways to ask a general question:

1. use a verified direct contact channel;
2. prepare a short question in a simple contact form.

The form is not a booking, availability, itinerary, or quote form.

## 3. Locked page order

1. reviewed `SiteHeader`;
2. breadcrumbs;
3. H1 and concise page introduction;
4. Concierge Split contact region;
5. reviewed `SiteFooter`.

Do not add a Hero, map embed, image region, FAQ, FinalCTA, floating messaging
control, or additional promotional section.

## 4. Concierge Split

The contact region uses one semantic DOM tree in this order:

1. contact details;
2. question form.

At the active theme `lg` threshold, the region becomes the approved 5/7 desktop
composition: contact details occupy five columns and the form occupies seven.
Below `lg`, the regions stack without CSS reordering.

### Contact details

- Sit directly on the open-dark page canvas.
- Use typography and quiet dividers instead of individual cards.
- Render phone, email, address, and response/office information from
  canonical contact data.
- Render a channel only when `isVerified()` returns true.
- Render the office only when its verification status and address are valid.
- Phone uses `tel:` and email uses `mailto:`.
- Address uses semantic `<address>` markup.
- A directions link is allowed only when a verified map URL exists.

### Question form

- Use one contained `surfaceLight` functional panel.
- Use reviewed `Field`, `Input`, `Textarea`, `Button`, and `FormStatus`
  primitives.
- Required fields: full name, email, message.
- Optional field: phone.
- Do not add date, time, pickup, destination, passengers, vehicle, flight,
  price, availability, or booking-confirmation fields.
- Persistent labels are required; placeholders never replace labels.
- The validation-only implementation has no action, method, request, submit
  handler, success state, or failure state.
- Its primary action is visibly unavailable and cannot submit.
- Do not imply that a question has been sent.

## 5. Validation contract

Client validation is a usability layer, not bot prevention or a security
boundary. The same pure validation contract is intended for later reuse by the
Cloudflare handler.

### Full name

- Normalize with Unicode NFKC.
- Trim and collapse whitespace.
- Require two name parts and a bounded length.
- Support Serbian Latin, English, Russian Cyrillic, combining marks,
  apostrophes, periods, and hyphens.
- Reject digits and unrelated symbols.

### Email

- Use native `type="email"` plus the approved bounded practical validator.
- Enforce local-part and total-length limits before regex evaluation.

### Phone

- Optional.
- Accept international `+` and `00` prefixes plus common local form.
- Accept spaces, parentheses, periods, and hyphens as presentation characters.
- Enforce 7–15 significant digits.

### Message

- Trim input.
- Require a bounded non-empty question.
- Accept normal Unicode prose and punctuation.

## 6. Validation states

Implemented now:

- initial;
- focused;
- filled;
- touched;
- dirty;
- invalid;
- disabled;
- unavailable.

Deferred until a real endpoint exists:

- submitting;
- success;
- server failure;
- Turnstile expired/error/retry.

Fields validate on blur. Once invalid, a field revalidates on input. Errors are
localized, programmatically associated, non-color-only, and announced. Values
remain intact.

## 7. Cloudflare boundary

This version adds documentation comments only. It does not add a Worker, Pages
Function, Turnstile widget/script/key, CSP allowance, honeypot, timestamp, rate
limit, or message-delivery provider.

The future integration must add an isolated POST endpoint, server-side
Turnstile Siteverify, repeated server validation, endpoint rate limiting,
request bounds, secret storage, CSP review, delivery/retention decisions, and
complete submitting/success/failure recovery states.

## 8. Content and data ownership

- Page H1, introduction, form heading, and form introduction come from the
  localized Contact page entry.
- Reusable field/channel labels, hints, validation errors, and unavailable
  status come from the localized UI dictionaries.
- Phone, email, address, office hours, and verification status come
  from `src/data/contact.ts`.
- Internal URLs come from the route map and approved helpers.
- Contact details visible on the page must remain aligned with structured data.

The production route is published in every configured locale with provisional
content authorized for visual review. A later SEO/content pass may refine the
copy without changing this locked structure or the verified operational facts.

## 9. Responsive acceptance

### Mobile — 320 CSS px

- One column: introduction, contact details, form.
- Contact rows and controls use the full available inline size.
- No horizontal overflow.
- Focus order follows DOM order.

### Tablet portrait — 768 CSS px

- Contact details may use a two-column internal matrix.
- Form remains below the details at full available width.
- No page-level split.

### Tablet landscape — 1024 CSS px

- The active theme `lg` threshold produces the 5/7 split.
- Contact details remain first in DOM and visual reading order.

### Desktop — 1440 CSS px

- Preserve the 5/7 split inside `PageContainer`.
- Keep form text and controls at a readable measure.

### Wide desktop — 1920 CSS px

- Preserve the main-container cap.
- Do not stretch either region merely to fill the viewport.

All states preserve 44×44 targets, visible focus, localized text growth, zoom,
logical CSS, and zero accidental horizontal overflow.

## 10. Typography and surfaces

- H1/H2 use `font-heading`.
- Body, labels, controls, contact facts, hints, and errors use `font-body`.
- `font-brand` remains exclusive to `BrandLockup` in shared chrome.
- The page canvas and contact-details region are open-dark.
- The form is the sole light functional panel.
- Platinum remains restrained to the primary-action treatment, focus, and small
  structural emphasis.
- No raw design values or page-local token scale may be introduced.

## 11. Accessibility

- One H1 and non-skipping H2 hierarchy.
- Correct breadcrumbs, main landmark, sections, and `<address>` semantics.
- Persistent programmatic labels and required-state communication.
- Stable hint/error IDs with `aria-describedby` and `aria-invalid`.
- Error messages remain non-color-only and available to assistive technology.
- The unavailable form action is both visually and programmatically disabled.
- Keyboard, text zoom, spacing overrides, forced colors, and all configured
  locales must remain usable.

## 12. Completion boundary

The validation-only implementation is complete only when:

- the page contract and responsive states are implemented on the published
  review route;
- shared primitive extensions are backward compatible;
- validation behavior and accessibility pass automated/manual checks;
- no interaction can issue a contact network request;
- the production Contact route is published with locale parity;
- Cloudflare work exists only as the approved structural TODO contract.

## 13. Shared-control compatibility decision

The contact implementation extends reviewed controls without changing existing
call sites:

- `Input` adds optional native `readonly`, length, pattern, input-mode,
  capitalization, and spellcheck props;
- `Textarea` adds optional native `readonly`, length, capitalization, and
  spellcheck props;
- `Field` keeps the error target mounted and hidden until an error exists so a
  validation controller can update it without DOM replacement;
- `FormStatus` adds an optional `id` and an explicit dark/light informational
  treatment.

All additions are optional. Existing consumers retain their previous defaults,
control sizes, visual variants, and required/error behavior; no migration is
required.
