# Luxury Transportation — Booking Page Blueprint V1

Status: **LOCKED FOR IMPLEMENTATION**  
Route key: `booking`  
Delivery phase: **public validation-only page; submission deferred**

This blueprint owns the required page regions, form behavior, commercial-result behavior, responsive topology, CTA roles, and the public-testing release posture. Root `AGENTS.md`, `DESIGN.md`, canonical data, and the active theme remain higher authorities in their respective domains.

## 1. Product objective

Create one localized, first-class booking/request planner that:

- accepts entry from generic booking and quote CTAs;
- accepts a small, validated handoff from a concrete service page;
- progressively collects only the facts needed for the selected service;
- shows fixed, calculated, estimated, or quote-required commercial context without implying confirmation;
- remains usable as a public test page before server submission exists;
- provides a verified direct-contact recovery path while online submission is unavailable.

The page is not checkout, payment, instant confirmation, a public dispatch manifest, or a general pricing table.

## 2. Locked page identity

The design direction is **Service-First Concierge / Platinum Concierge Split**.

The page has no marketing Hero, FAQ, reviews, fleet carousel, FinalCTA, or public tariff table. Functional clarity is the page identity.

Required page order:

1. reviewed `SiteHeader`;
2. compact booking introduction and passive four-step progress;
3. one four-step booking form with work area and request summary;
4. compact operational assurance row;
5. reviewed `SiteFooter`.

One H1 appears in the booking introduction. Step headings use H2.

## 3. Canonical sources

```text
services.ts    service capabilities and package rules
pricing.ts     tariffs and currency
fleet.ts       vehicle identities and passenger capacity
contact.ts     minimum lead time, Europe/Belgrade time zone, manual confirmation, contacts
operations.ts  verified operational capabilities
routes.ts      localized booking paths
flows.ts       booking/quote destinations and intent vocabulary
content/pages  localized editorial content
content/ui     localized form, status, error, and action strings
```

Components must not own prices, formulas, localized URLs, contact facts, capacities, lead-time values, or translations.

## 4. Route, flow, and query handoff

Localized route contract:

```text
sr  /rezervacija/
en  /en/booking/
ru  /ru/bronirovanie/
```

The route is a published top-level page, `noindex`, and excluded from the sitemap during the public-testing phase. Existing SEO helpers own the exact noindex metadata behavior.

Both canonical flows target `booking`:

```text
booking -> booking?intent=booking
quote   -> booking?intent=quote
```

All internal URLs use `getPath()`, `<Link>`, or the approved flow resolver.

### Contextual CTA rules

- Header and hub-level booking/quote CTAs remain generic and send only `intent`.
- A CTA on a concrete service page adds that canonical service key as `service`.
- The existing Airport booking-start form sends `intent=booking`, `service=airportTransportation`, and any valid Airport start values.
- No CTA serializes customer contact data, addresses, notes, prices, or opaque form state.

### Query whitelist

The browser controller parses only:

```text
intent
service
flightNumber
date
time
```

Rules:

- `intent` must be `booking` or `quote`;
- `service` must be an approved concrete booking service key;
- a valid concrete service opens Step 02 with Step 01 complete;
- missing or invalid service opens Step 01;
- `flightNumber`, `date`, and `time` apply only to a valid Airport handoff;
- invalid or unknown values are ignored;
- query values never choose a price or pricing-result state;
- handoff is consumed once, then removed with `history.replaceState()` without adding history;
- `intent=quote` keeps the final intended CTA as Request quote even when a preview amount exists;
- `intent=booking` may still become Request quote when the resolver returns `quote-required`.

The static Astro page never reads request-time query state during build.

## 5. Form and state architecture

Use one semantic `<form>` and one DOM tree. A small page-local TypeScript controller is justified for branching, progress, validation, pricing refresh, focus, and safe draft recovery. Do not add a UI framework or dependency.

Required state layers:

```text
BookingDraft          partial customer-entered state
BookingRequest        complete validated domain request
BookingPricingResult  derived result, or null while the draft is incomplete
```

An incomplete draft is not `unavailable`. Customer input never supplies an authoritative amount, trusted distance, or provider qualification flag.

The four steps are exactly:

```text
01 Service
02 Journey
03 Vehicle
04 Review & contact
```

Progress is a passive ordered list. The active item uses `aria-current="step"`. Back and Edit are real buttons. Only the active panel is exposed; inactive panels use `hidden`. On successful step movement, focus the next H2 with `tabindex="-1"`. Invalid movement focuses a localized error summary, then preserves logical field order.

## 6. Step 01 — Service

The first choice is grouped into four customer-facing categories: Private Chauffeur, Airport Transportation, Business Transportation, and Special Events.

Business reveals Corporate Transportation, Delegation Transportation, and Conference & Congress Transportation. Special Events reveals Wedding Transportation, Prom Transportation, VIP Transportation, and Other Special Event.

Use native fieldsets, legends, labels, and radios. Categories are organizational; a concrete canonical service key drives the domain branch. A prefilled direct service remains changeable.

## 7. Step 02 — Journey

All branches collect the requested date and start time. These values are interpreted in `contact.bookingLeadTime.timeZone`, locked to `Europe/Belgrade`, never in the browser's local time zone. A localized note exposes the time-zone name.

### Private Chauffeur

Collect hire mode (Hourly, Half Day, or Full Day), hours for Hourly, pickup, destination, optional planned stops, multi-day flag, and international flag. Package hours, included kilometres, and hourly minimum come from `services.ts`.

### Airport Transportation

Collect direction, required typed fare area (`belgrade-city` or `other`), pickup, destination, optional flight number, and return request with conditional return date/time.

The fixed Airport fare is eligible only for a single direction, `belgrade-city`, and a concrete selected vehicle. `other` always becomes quote-required. Do not infer scope from free-text addresses. Return pricing remains quote-required until a canonical return rule exists.

### Corporate Transportation

Collect one-off/recurring arrangement, date/time, basic locations, schedule outline, and optional invoice/reference note. V1 remains quote-required because no canonical public formula exists.

### Delegation / Conference & Congress

Collect date/time, locations, schedule outline, multiple-location flag, and possible multiple-vehicle flag. Passenger count is not collected here; it belongs only to Step 03.

### Wedding / Prom / VIP / Other Special Event

Collect date/time, venue or primary destination, pickup, waiting request, schedule outline, and possible multiple-vehicle flag. Passenger count is not collected here; it belongs only to Step 03.

## 8. Step 03 — Passengers and vehicle

Collect passenger count once, optional luggage count, optional child-seat request, and vehicle preference.

Vehicle options come from `fleet.ts`. Known-capacity vehicles below passenger count are disabled or excluded with a localized explanation. Unknown capacity remains eligible for manual review. Luggage capacity is not inferred.

The first vehicle option is **Recommend a vehicle**. It is a valid selection and produces `quote-required` with reason `vehicle-recommendation`; it is not unavailable. A concrete vehicle remains subject to availability and manual confirmation. A permitted multiple-vehicle request is quote-required in V1.

## 9. Step 04 — Review and contact

Show a complete review of service, schedule and time-zone context, journey, passengers, vehicle preference, commercial result, and contact details. Each owned group has an Edit button returning to its source step without discarding valid state.

Collect full name and email as required. Phone and notes are optional. Company/organization is required only for business-service branches where the canonical content contract requires it.

## 10. Commercial result contract

The resolver returns one of five discriminated states only after enough validated facts exist:

```text
fixed
calculated
estimate
quote-required
unavailable
```

- `fixed`: canonical single-direction Airport fare inside typed Belgrade-city scope with a concrete vehicle.
- `calculated`: canonical hourly or package arithmetic with all prerequisites satisfied.
- `estimate`: canonical base package fare where route distance is not trusted; manual review remains explicit.
- `quote-required`: no amount; includes multi-day, international, outside-airport-scope, Airport return, undefined business policy, multiple vehicles, complex itinerary, quote-only service, and vehicle recommendation.
- `unavailable`: a canonical fact makes the current combination impossible or temporarily unavailable and the UI supplies recovery.

Trusted provider outputs belong to a resolver context, never `BookingRequest`. Customer input cannot set distance qualification or Airport fare eligibility. No formula appears inside Astro components.

## 11. Intent and action behavior

The future final primary action label is Request quote when incoming intent is `quote`, Request quote when result is `quote-required`, and Request booking otherwise. There is never Pay or Confirm booking copy.

For the current public-testing phase:

- the form has no `action` and no submission `method`;
- no network request is made;
- the intended final primary action is rendered as `type="button"` and disabled;
- a localized status states that online sending is not yet enabled;
- a verified direct contact route/channel is available as the active recovery action.

Validation, review, edit, pricing preview, query handoff, and draft recovery remain fully testable.

## 12. Lead time and confirmation

The current minimum lead time comes from `contact.bookingLeadTime.publicMinimumHours`. Client validation computes the requested instant in `Europe/Belgrade`; the future server repeats the same check authoritatively. A query string cannot bypass the rule.

All copy states that a future submission creates a request pending manual confirmation. No vehicle, fare, or booking is guaranteed by the client UI.

## 13. Draft persistence and privacy

Use versioned `sessionStorage` with a short expiry. Persist only structured, non-free-text planning choices:

```text
intent
service
hire/direction/engagement modes
dates and times
booleans
passenger and luggage counts
vehicle preference
airport scope
```

Never persist pickup, destination, stop text, flight number, schedule outline, invoice/reference text, company, full name, email, phone, notes, trusted provider data, or a Turnstile token.

Invalid, expired, or wrong-version state is discarded. Query handoff wins over conflicting persisted structured values for the current entry.

## 14. No-JavaScript behavior

Without JavaScript, render the introduction, Step 01 service choices, a localized explanation that the planner requires JavaScript, and a verified direct-contact path. Do not expose a fake multi-step experience or a nonfunctional submit button.

## 15. Responsive contract

DOM and focus order remain progress → work → summary → actions. CSS must not reorder meaningful content.

### Mobile — 320

- one column;
- progress remains readable without horizontal page overflow;
- work surface fills the content width;
- on Steps 01–03 the persistent summary follows the work surface and precedes navigation actions;
- on Step 04 the complete review lives inside the work surface and the duplicate persistent summary is hidden;
- native date/time controls and all actions fit; all targets are at least 44×44.

### Tablet portrait — 768

- one column with constrained readable measure;
- same source and focus order as mobile;
- fields may use bounded two-column rows only where labels and localized values fit without reordering;
- persistent summary behavior matches mobile.

### Tablet landscape — 1024

- switch at the active `lg` design token to the 7/5 work/summary split;
- progress spans the container;
- summary is sticky only if it remains fully reachable at zoom and does not hide focused content;
- Step 04 hides the duplicate summary.

### Desktop — 1440

- capped PageContainer;
- 7/5 split with one dominant light work surface and an open dark summary region;
- actions stay owned by the work column;
- no dashboard-card repetition.

### Wide desktop — 1920

- same capped topology as desktop;
- no uncontrolled measure growth or inflated whitespace;
- header, form, summary, and footer remain visually connected.

At every state: no accidental horizontal overflow, no clipped SR/EN/RU strings, logical properties for direction-sensitive styling, visible focus, and reduced-motion support.

## 16. Visual contract

Use the configured active theme, reviewed shared chrome, and semantic tokens only: dark-first page canvas, one light functional work surface, Inter Tight headings, Manrope body/UI, restrained platinum selected/focus accents, and semantic geometry roles.

No gold, blue corporate palette, glow, glass, metallic gradients, dashboard cards, or decorative motion. The wireframe owns geometry only and is not production CSS or a shared-component mock.

## 17. Deferred Cloudflare submission phase

The following are intentionally outside this implementation phase:

- same-origin Cloudflare Pages Function/Worker endpoint;
- Managed Turnstile and server Siteverify;
- server schema validation and pricing recomputation;
- body limits, origin checks, rate limiting, and delivery/storage integration;
- submitting, success, failure, and request-reference UI states;
- analytics for completed submission.

When authorized, these requirements are added without converting the static site to SSR and without trusting client amounts or client qualification flags.

## 18. Release posture

V1 is allowed to publish for public testing only when the route, localized content, all booking/quote CTA handoffs, query handling, validation, pricing-result behavior, direct-contact fallback, accessibility, responsive states, and noindex posture pass acceptance.

Cloudflare submission is a separate follow-up release gate. The public-testing page must not imply that its disabled final action sent or reserved anything.
