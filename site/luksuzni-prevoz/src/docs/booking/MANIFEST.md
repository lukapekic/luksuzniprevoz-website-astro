# Booking Page — Manifest

## Authorities

Mandatory before implementation:

```text
AGENTS.md
DESIGN.md
site/luksuzni-prevoz/foundation.config.ts
site/luksuzni-prevoz/src/theme/versions/version-2/*
.design/system.json

.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/functional-ui.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/multilingual-routing.md
.skills/technical-seo.md
```

## Canonical data inputs

```text
src/data/services.ts
src/data/pricing.ts
src/data/fleet.ts
src/data/contact.ts
src/data/operations.ts
src/data/routes.ts
src/data/flows.ts
src/docs/pricing.csv
```

## New production files expected

Exact final names may follow repository conventions, but ownership must remain equivalent:

```text
src/data/booking.ts
src/lib/booking/booking-pricing.ts
src/lib/booking/booking-validation.ts

src/components/booking/
  BookingPage.astro
  BookingWizard.astro
  BookingProgress.astro
  BookingServiceStep.astro
  BookingJourneyStep.astro
  BookingVehicleStep.astro
  BookingReviewStep.astro
  BookingSummary.astro
  booking-controller.ts

src/content/pages/booking/
  booking.sr.md
  booking.en.md
  booking.ru.md
```

## Existing files expected to change

```text
src/data/routes.ts
src/data/flows.ts
src/content/schemas/pages.ts
src/components/site/ContentPageRenderer.astro
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

The current public-testing phase does not add a submission handler. The form is
validation-only, the intended final action is disabled, and a verified direct
contact path remains active.

## Public-testing release dependencies

The booking page is not public-test-ready until:

```text
currency metadata exists for every exposed fare type
per-km applicability remains hidden or is explicitly defined
half/full-day excess-km behavior is explicit
Airport return pricing is explicit or routes to quote
manual confirmation copy is present
canonical public lead-time rule is enforced
Europe/Belgrade owns entered date/time interpretation
typed Airport area is required
all booking/quote CTAs target the rendered Booking route
query handoff is whitelist-validated and consumed once
no action, method, or network submission exists
disabled final action and direct-contact recovery are explicit
```

## Deferred Cloudflare dependencies

Same-origin submission, Managed Turnstile/Siteverify, server validation,
rate limiting, request delivery/storage, and submitting/success/failure states
are a separate authorized phase. They do not block the validation-only public
page and must not be represented as already implemented.
