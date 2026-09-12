# Booking Page V1 — Acceptance Contract

Status: **HARD PASS/FAIL GATE FOR PUBLIC VALIDATION-ONLY RELEASE**  
Route key: `booking`

Every applicable item must pass. Deferred Cloudflare submission requirements are listed separately and do not block this public-testing release.

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
- [ ] passive ordered progress uses `aria-current="step"`
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
- [ ] current minimum lead time derives from `contact.ts`
- [ ] localized lead-time errors interpolate the canonical number
- [ ] query and persisted state cannot bypass lead-time validation
- [ ] future server enforcement is documented but not falsely claimed as implemented

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
- [ ] current form has no action, no submission method, and makes no network request
- [ ] intended final Request booking/Request quote control is `type="button"` and disabled
- [ ] localized submission-unavailable status is visible
- [ ] an active verified direct-contact recovery action is present
- [ ] UI never implies request receipt, reservation, fare, or vehicle confirmation

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
- [ ] 1024: active `lg` token produces 7/5 work/summary split
- [ ] 1440: capped 7/5 composition and clear action ownership
- [ ] 1920: capped measure and no inflated spacing
- [ ] Steps 01–03 show persistent summary after work and before actions below `lg`
- [ ] Step 04 uses complete in-work review and hides duplicate persistent summary
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

## N. Verification for public testing

- [ ] route, content, SEO, type-generation, theme, and design-governance checks pass
- [ ] site Astro check and build pass
- [ ] relevant unit tests cover handoff parsing, validation, pricing, storage, and intent/action logic
- [ ] accessibility automation passes and manual keyboard/focus review is recorded
- [ ] responsive browser evidence covers 320, 768, 1024, 1440, and 1920
- [ ] booking `verify:ui` page profile passes with no unresolved P0/P1 finding
- [ ] component impact/profile passes for every changed shared primitive

## Deferred Cloudflare submission gate

These do not block the validation-only public page. They become mandatory only when online submission is authorized:

- [ ] same-origin Cloudflare Pages Function/Worker POST endpoint
- [ ] Managed Turnstile with server Siteverify, hostname, and action checks
- [ ] authoritative server schema, lead-time, reference, and pricing recomputation
- [ ] origin/host checks, body-size limit, rate limit, safe logging, and safe errors
- [ ] approved request delivery/storage integration
- [ ] submitting, duplicate-prevention, pending-confirmation success, failure, recovery, and reference states
- [ ] no client amount or client qualification flag is trusted

Any unchecked public-testing P0/P1 item blocks publishing. Deferred items must not be represented as working in copy, controls, tests, or completion reports.
