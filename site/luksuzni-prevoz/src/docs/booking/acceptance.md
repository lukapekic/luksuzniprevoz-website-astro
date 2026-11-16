# Booking page — production acceptance contract

Status: **CHECKLIST FOR THE DEPLOYED REQUEST FLOW AND FUTURE CHANGES**

Route key: `booking`

Use this checklist for the affected scope of a future change. It is not a claim that a new check ran during documentation upkeep. The deployed two-hour release passed its focused verification, required PR checks and post-merge Release on 2026-11-15.

## A. Authority and governance

- [ ] root `AGENTS.md`, `DESIGN.md`, blueprint, wireframe, data contract, and theme contract reviewed
- [ ] mandatory new-page, functional UI, routing, accessibility, responsive, typography, component, and Tailwind procedures applied
- [ ] `booking` resolves through `.design/config.json`
- [ ] `design:context` ran before production UI edits
- [ ] blueprint compliance matrix maps every region, source, component, viewport, and check
- [ ] shared-component impact procedure runs before any shared primitive change

## B. Route, content, and SEO

- [ ] `booking` is a published top-level page route
- [ ] paths are `/rezervacija/`, `/en/booking/`, and `/ru/bronirovanie/`
- [ ] route has `noindex: true` and is excluded from sitemap
- [ ] route content exists and is published for SR, EN, and RU
- [ ] booking content archetype and renderer dispatch exist
- [ ] page metadata follows the current noindex SEO helper behavior
- [ ] page and UI content parity passes all configured locales
- [ ] no user-visible strings live in production components

## C. CTA and query handoff

- [ ] booking and quote flows resolve to the localized booking route
- [ ] Header and hub CTAs send only valid `intent`
- [ ] concrete service-page CTAs also send their canonical `service` key
- [ ] Airport start form sends hidden `intent=booking` and `service=airportTransportation`
- [ ] Airport form preserves valid `flightNumber`, `date`, and `time`
- [ ] one client helper whitelists only `intent`, `service`, `flightNumber`, `date`, and `time`
- [ ] invalid/unknown query data is ignored and cannot influence price
- [ ] Airport-only fields are ignored for non-Airport services
- [ ] valid direct-service handoff opens Journey; generic entry opens Service
- [ ] consumed handoff is removed with `history.replaceState()`
- [ ] no internal URL is manually locale-concatenated

## D. Exact page and form structure

- [ ] page order is SiteHeader → intro/progress → wizard → assurance → SiteFooter
- [ ] no Hero, FinalCTA, FAQ, reviews, marketing fleet carousel, or tariff table is added
- [ ] exactly one H1 and non-skipping step headings
- [ ] exactly four steps: Service, Journey, Vehicle, Review & contact
- [ ] one semantic form owns one DOM tree
- [ ] current progress uses `aria-current="step"`; completed steps are navigable and future steps cannot bypass validation
- [ ] inactive panels use `hidden`
- [ ] Back/Edit buttons preserve valid state
- [ ] passenger count is collected only in Step 03

## E. Service and journey branching

- [ ] native radio fieldsets expose Private Chauffeur, Airport, Business, and Special Events
- [ ] Business resolves to Corporate, Delegation, or Conference & Congress
- [ ] Special Events resolves to Wedding, Prom, VIP, or Other Special Event
- [ ] canonical service keys, not labels or pathnames, control branches
- [ ] Private Chauffeur modes and package facts derive from `services.ts`
- [ ] Airport direction is required
- [ ] Airport area is required and typed as `belgrade-city | other`
- [ ] free-text locations never determine fixed-fare qualification
- [ ] Corporate remains quote-required without an invented formula
- [ ] Delegation, Conference, Wedding, Prom, VIP, and Other Event remain quote-required
- [ ] no public operational manifest is requested

## F. Time and lead-time rules

- [ ] `contact.bookingLeadTime.timeZone` is `Europe/Belgrade`
- [ ] all entered dates/times are visibly described and interpreted in that time zone
- [ ] browser/device time zone does not change the requested instant
- [ ] the rolling two-hour minimum derives from `contact.ts`; the server clock is authoritative
- [ ] localized lead-time errors interpolate the canonical number
- [ ] query and persisted state cannot bypass lead-time validation
- [ ] browser and server reject under-two-hour, invalid and ambiguous/nonexistent DST instants
- [ ] earliest guidance rounds upward to a selectable minute and refreshes when editing resumes
- [ ] same-day/sub-24-hour request-only notices appear at schedule and review in SR/EN/RU
- [ ] final submission revalidates every step and server schedule rejection preserves values

## G. Passenger and vehicle behavior

- [ ] passenger count is required and positive
- [ ] luggage and child-seat request are optional
- [ ] child-seat capability comes from `operations.ts`
- [ ] vehicle identities and capacities come from `fleet.ts`
- [ ] known-capacity vehicles below passenger count are unavailable with text explanation
- [ ] no luggage capacity is invented
- [ ] Recommend a vehicle is a valid first option
- [ ] Recommend a vehicle produces `quote-required: vehicle-recommendation`, not unavailable
- [ ] multiple vehicles are allowed only by canonical capability and remain quote-required
- [ ] every vehicle preference remains subject to manual confirmation

## H. Pricing and commercial states

- [ ] exposed tariff currency exists in `pricing.ts`; UI does not hardcode it
- [ ] pricing resolver is pure and outside Astro components
- [ ] `BookingDraft`, validated `BookingRequest`, and derived `BookingPricingResult | null` are distinct
- [ ] incomplete drafts do not return unavailable
- [ ] fixed, calculated, estimate, quote-required, and unavailable are discriminated states
- [ ] fixed Airport fare requires single direction, Belgrade-city area, and concrete vehicle
- [ ] Airport return and other destination are quote-required
- [ ] Hourly uses canonical whole-hour minimum and tariff
- [ ] Half/Full Day use canonical package facts
- [ ] unknown package distance is estimate; excess trusted distance is quote-required
- [ ] `/km` is not customer-selectable or used without an approved applicability contract
- [ ] trusted distance/provider facts live in resolver context, never customer request/query state
- [ ] quote-required has no fake amount; unavailable includes recovery

## I. Review, intent, and current action state

- [ ] review shows service, schedule/time zone, journey, passengers, vehicle, commercial result, and contact
- [ ] Edit actions return to the owning step
- [ ] full name and email are required; phone and notes are optional
- [ ] company is conditional for applicable business branches
- [ ] incoming `intent=quote` preserves Request quote even with an amount preview
- [ ] `intent=booking` switches to Request quote when pricing is quote-required
- [ ] no Pay or Confirm booking action exists
- [ ] the guarded submit action sends JSON to `/api/forms/booking` with Managed Turnstile
- [ ] normal action copy says Send transfer request; quote branches retain Request quote
- [ ] missing configuration, bot failure and service failure remain truthful and recoverable
- [ ] an active verified direct-contact recovery action is present
- [ ] a genuine accepted response is required before claiming request receipt
- [ ] no UI state implies confirmed reservation, fare or vehicle availability
- [ ] success retains requested date/time/timezone/reference after reset and moves focus to feedback
- [ ] accepted retries preserve original validation clock/digest and never duplicate notifications

## J. Draft recovery and privacy

- [ ] storage is versioned, short-lived `sessionStorage`
- [ ] only intent, service, modes, dates/times, booleans, counts, vehicle preference, and Airport area persist
- [ ] pickup, destination, stops, flight number, schedule, reference, company, contact fields, and notes do not persist
- [ ] invalid, expired, or wrong-version data is discarded
- [ ] query handoff wins over conflicting stored structured values
- [ ] no PII, addresses, flight number, or notes enter analytics

## K. Accessibility and no-JavaScript

- [ ] native controls, fieldsets, legends, persistent labels, help, and associated errors are used
- [ ] step transition focuses the new H2; invalid transition focuses the error summary
- [ ] every interactive target is at least 44×44 CSS px
- [ ] focus remains visible on dark and light surfaces
- [ ] status never relies on color; relevant changes are announced
- [ ] reduced-motion behavior is immediate
- [ ] source, reading, and keyboard order remain logical
- [ ] SR Latin, EN, and RU Cyrillic do not clip at zoom/text enlargement
- [ ] no-JavaScript state explains the limitation and exposes direct contact
- [ ] no fake wizard or nonfunctional submit appears without JavaScript

## L. Responsive contract

- [ ] 320: one column, progress/work/summary/actions fit without overflow
- [ ] 768: one column, readable measure, deterministic bounded field rows
- [ ] 1024: centered bounded panel; compact summary remains inside the work surface
- [ ] 1440: capped centered panel and clear action ownership
- [ ] 1920: capped measure and no inflated spacing
- [ ] Steps 02–03 show the compact summary disclosure; Service and final review hide it
- [ ] Step 04 uses complete in-panel review and hides the duplicate compact summary
- [ ] native date/time controls, errors, and vehicle choices fit every state
- [ ] no accidental horizontal page overflow at any state

## M. Visual/system compliance

- [ ] configured active theme resolves without fallback
- [ ] semantic tokens own colors, spacing, radius, type, motion, containers, and breakpoints
- [ ] H1/H2 compute to Inter Tight; body/UI/controls compute to Manrope
- [ ] BrandLockup is the only general brand-font use
- [ ] one light functional work surface sits on the dark-first page
- [ ] summary remains operational, not a dashboard card stack
- [ ] reviewed SiteHeader/SiteFooter identities remain unchanged
- [ ] no copied wireframe CSS or raw theme values enter production

## N. Verification for the affected release scope

- [ ] route, content, SEO, type-generation, theme, and design-governance checks pass
- [ ] site Astro check and build pass
- [ ] relevant unit tests cover handoff parsing, validation, pricing, storage, and intent/action logic
- [ ] accessibility automation passes and manual keyboard/focus review is recorded
- [ ] responsive browser evidence covers 320, 768, 1024, 1440, and 1920
- [ ] booking `verify:ui` page profile passes with no unresolved P0/P1 finding
- [ ] component impact/profile passes for every changed shared primitive

## O. Existing production submission

- [ ] same-origin Cloudflare Pages Functions preserve bounded envelopes and safe errors
- [ ] Managed Turnstile pins hostname and action and rejects production test secrets
- [ ] server schema, two-hour rule and pricing are authoritative
- [ ] D1 form/locale/payload identity prevents duplicate sends and altered accepted retries
- [ ] escaped HTML/plain-text staff notifications retain manual-review and urgency language
- [ ] uncertain provider acceptance is reconciled without blind resend
- [ ] local interception is not reported as provider or inbox acceptance
- [ ] deployed health probes do not send valid customer requests or staff email
- [ ] required PR CI, Cloudflare deployment and post-merge Release have terminal results recorded

An unresolved P0/P1 finding blocks the affected publication. New UI work also
requires the independent review and applicable governance evidence in `AGENTS.md`.
