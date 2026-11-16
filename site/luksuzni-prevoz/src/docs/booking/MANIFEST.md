# Booking page — source manifest

Status: **DEPLOYED PRODUCTION CONTRACT**

Read root `AGENTS.md`, `DESIGN.md`, the current [blueprint](blueprint.md),
[data contract](data-contract.md), [theme contract](theme-contract.md) and
applicable repository procedures before changing the corresponding surface.
`foundation.config.ts` selects the active theme; generated theme/governance files
remain machine-owned.

## Canonical owners

| Concern                                                     | Source                                                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Service vocabulary and request types                        | `src/data/booking.ts`                                                                        |
| Two-hour minimum, Belgrade timezone and manual confirmation | `src/data/contact.ts`                                                                        |
| Service options and commercial facts                        | `src/data/services.ts`, `src/data/pricing.ts`, `src/data/fleet.ts`, `src/data/operations.ts` |
| Routes and booking/quote links                              | `src/data/routes.ts`, `src/data/flows.ts`                                                    |
| Localized content                                           | `src/content/pages/booking/`, `src/content/ui/{sr,en,ru}.json`                               |
| Pure portable schedule/date/phone mechanisms                | `packages/form-kit/src/` at repository root                                                  |

## Existing page and browser integration

Paths below are relative to `site/luksuzni-prevoz/`:

```text
src/components/booking/BookingPage.astro
src/components/booking/BookingWizard.astro
src/components/booking/BookingProgress.astro
src/components/booking/BookingScheduleControls.astro
src/components/booking/booking-controller.ts
src/lib/booking/booking-validation.ts
src/lib/booking/booking-pricing.ts
src/lib/booking/booking-date-policy.ts
src/lib/booking/booking-date-time.ts
src/lib/booking/booking-schedule-controls.ts
src/lib/booking/booking-handoff.ts
src/lib/booking/booking-storage.ts
src/lib/booking/airport-booking-intent.ts
src/lib/booking/airport-booking-controller.ts
```

The current wizard keeps its step markup in `BookingWizard.astro`; separate
ServiceStep/JourneyStep/VehicleStep/ReviewStep/Summary components are not required
or present. Preserve the reviewed single-panel composition and existing primitives.

## Existing server integration

Repository-root paths:

```text
functions/api/forms/booking.ts
functions/_shared/validation.ts
functions/_shared/submission-pipeline.ts
functions/_shared/submission-ledger.ts
functions/_shared/email-rendering.ts
functions/_shared/brevo.ts
functions/_shared/turnstile.ts
migrations/0001_form_submission_ledger.sql
migrations/0002_form_submission_digest.sql
```

The live endpoint uses Managed Turnstile, authoritative validation, a D1
metadata/idempotency ledger and Brevo office notifications. Form-kit `0.2.0`
provides the shared pure scheduling mechanism; host code owns policy, locales,
pricing, routes, ledger, branding and delivery. These capabilities are implemented,
not deferred work.

## Preservation requirements

Keep currency/capacity facts and pricing qualification in their canonical owners;
retain quote-required states for unsupported arithmetic, manual confirmation,
whitelisted handoffs, privacy-safe draft storage, two-hour server enforcement,
localized pending notices, stable accepted receipts and non-duplicating retries.
Verification and recovery requirements are in [acceptance.md](acceptance.md) and
the [forms runbook](../../../../../docs/cloudflare-pages-forms/README.md).
