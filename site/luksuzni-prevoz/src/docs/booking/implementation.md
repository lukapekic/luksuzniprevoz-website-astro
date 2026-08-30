# Booking Page V1 — Codebase-First Implementation Plan

Status: **READY FOR IMPLEMENTATION**  
Current release: **published validation-only page**  
Deferred release: **Cloudflare submission**

This plan supersedes the earlier endpoint-first handoff. The current repository is the source of truth for routes, content, components, static rendering, design tokens, and validation.

## 1. Locked decisions

| Decision | Implementation consequence |
| --- | --- |
| Booking time zone is `Europe/Belgrade` | Add it to canonical lead-time data; parse and validate customer date/time against that IANA zone, never browser local time. |
| Airport area is required | Use the typed customer choice `belgrade-city | other`; never infer it from an address string. |
| Publish now for testing | Register a published, noindex booking route and content in all locales. The wizard works through review, but does not submit. |
| All booking/quote CTAs move now | Retarget both flows atomically with route publication. Generic CTAs send intent; concrete service pages also send service context. |
| Cloudflare comes later | No action, method, fetch, Turnstile, success claim, or active final submit in this phase. Provide direct contact recovery. |

## 2. Entry and governance

Before production UI edits:

1. Run `pnpm design:context --target <exact-booking-target> --surface booking`.
2. Read the authorities returned by the command.
3. Build the compliance matrix: requirement → authority → data source → component → responsive states → verification.
4. Run `pnpm components:check` before changing any reviewed shared primitive.
5. If the design snapshot is stale, run `pnpm design:sync`; never repair generated output manually.

The registered `booking` surface covers `src/components/booking/`, booking content, booking docs, and localized route names.

## 3. Delivery sequence

Implement in the following bounded order. Do not retarget live CTAs until the booking route renders successfully in all locales.

### Phase 1 — Canonical data and domain types

1. Extend `src/data/pricing.ts` with one canonical `PricingCurrency` and a top-level currency on every vehicle tariff. Preserve all existing numbers.
2. Keep `contact.bookingLeadTime.timeZone = "Europe/Belgrade"` as the single time-zone fact.
3. Add `src/data/booking.ts` for booking vocabulary only:
   - approved concrete booking service keys;
   - `BookingIntent`;
   - step ids;
   - service-family discriminants;
   - `AirportScope = "belgrade-city" | "other"`;
   - partial `BookingDraft`;
   - complete discriminated `BookingRequest`;
   - pricing-result and reason unions.
4. Reuse `services.ts`, `fleet.ts`, `operations.ts`, `contact.ts`, and `pricing.ts`; do not duplicate their facts.

Domain invariants:

- passenger count exists only in the shared Step 03 request facts;
- recommend-vehicle is a real preference, not a missing value;
- customer state does not contain trusted distance, fare qualification, amount, or provider output;
- incomplete draft resolves to `null`, not unavailable.

### Phase 2 — Pure query, validation, pricing, and storage modules

Create or extend:

```text
src/lib/booking/booking-handoff.ts
src/lib/booking/booking-validation.ts
src/lib/booking/booking-pricing.ts
src/lib/booking/booking-storage.ts
```

Keep the existing `src/lib/booking/airport-booking-intent.ts` behavior by reusing or adapting it behind the canonical handoff helper. Avoid two independent parsers.

`booking-handoff.ts`:

- reads `URLSearchParams` only in the browser;
- whitelists `intent`, `service`, `flightNumber`, `date`, and `time`;
- validates stable enums and date/time shapes;
- applies Airport details only when Airport service is valid;
- returns a typed patch plus initial step;
- never returns price or trusted facts;
- supports one-time cleanup through `history.replaceState()`.

`booking-validation.ts`:

- validates each step and converts a complete draft to `BookingRequest`;
- uses native control validity where it matches the domain;
- returns field errors plus an ordered summary;
- converts local booking date/time in `Europe/Belgrade` to an instant before lead-time comparison;
- owns daylight-saving edge handling deterministically;
- never accepts browser-local-zone semantics.

`booking-pricing.ts` exposes one pure resolver:

```ts
resolveBookingPricing(
  request: BookingRequest,
  context: BookingPricingContext,
): BookingPricingResult
```

`BookingPricingContext` may contain canonical pricing/service data and optional trusted distance-provider output. It does not contain customer-owned qualification flags.

Resolver rules:

- recommend vehicle → quote-required / `vehicle-recommendation`;
- Airport fixed → single direction + `belgrade-city` + concrete vehicle;
- Airport `other` → quote-required / outside scope;
- Airport return → quote-required until a rule exists;
- Hourly → validated whole hours × canonical hourly tariff;
- Half/Full Day + trusted distance within included limit → calculated package;
- Half/Full Day without trusted distance → estimate/base package;
- trusted distance over included limit → quote-required;
- quote-only/complex/multi-day/international/multiple-vehicle branches → quote-required;
- impossible canonical combination only → unavailable.

`booking-storage.ts` uses a versioned, expiring `sessionStorage` record. Persist only structured intent/service/modes/dates/times/booleans/counts/vehicle/Airport area. Explicitly omit all location text, stops, flight number, schedule/reference text, company/contact fields, notes, provider data, and security tokens.

Add unit tests for every parser, validation, resolver, and storage boundary before UI wiring.

### Phase 3 — Route, schema, and content rendering

Update:

```text
src/data/routes.ts
src/content/schemas/pages.ts
src/components/site/ContentPageRenderer.astro
src/content/pages/booking/booking.{sr,en,ru}.md
src/content/ui/{sr,en,ru}.json
```

Route definition:

```ts
booking: {
  kind: "page",
  availability: "published",
  parent: null,
  slugs: { sr: "rezervacija", en: "booking", ru: "bronirovanie" },
  noindex: true,
  sitemap: { include: false, priority: 0 },
}
```

Add a strict booking page archetype matching the existing content model style. Do not turn the schema into one large optional object. Add one dedicated booking dispatch in `ContentPageRenderer.astro`.

Set all three booking entries to published in the same bounded change as route/schema/renderer support. Regenerate types; do not edit generated `types.ts` manually.

Follow the current noindex SEO helper. Do not add Product/Offer price schema or page-local head markup.

### Phase 4 — Shared primitive compatibility, only where proven

Inspect current contracts before editing:

- Extend `Input.astro` backward-compatibly with optional native `min`, `max`, and `step` passthrough if booking controls require them.
- Extend `Link.astro` backward-compatibly with optional `aria-current` support so the Book navigation action can identify the booking page.
- Use existing Field, Input, Select, Textarea, Checkbox, Button, and FormStatus primitives.
- Build page-local native radio rows for service and vehicle choice. Do not create a shared Radio primitive from one consumer.
- Do not nest `Section` inside the wizard as a card; use an outer `Section`/`PageContainer` and a page-local light work surface.

Any shared primitive edit requires component preflight, consumer review, component-profile verification, and a compatibility note.

### Phase 5 — Booking page composition

Create page-local components with one responsibility each:

```text
src/components/booking/BookingPage.astro
src/components/booking/BookingWizard.astro
src/components/booking/BookingProgress.astro
src/components/booking/BookingServiceStep.astro
src/components/booking/BookingJourneyStep.astro
src/components/booking/BookingVehicleStep.astro
src/components/booking/BookingReviewStep.astro
src/components/booking/BookingSummary.astro
src/components/booking/BookingAssurance.astro
src/components/booking/booking-controller.ts
```

`BookingPage.astro` composes reviewed SiteHeader/SiteFooter through the current page/layout system and owns no client state. It receives localized content plus prepared canonical view models.

`BookingWizard.astro` renders one form and one DOM tree. It owns step panels, progress, navigation controls, error summary, status region, summary placement, and the page-local controller hook. Service-specific markup stays in step components.

`booking-controller.ts` is justified because native navigation alone cannot satisfy conditional branches, pricing preview, safe handoff consumption, cross-step validation, review editing, focus movement, and draft recovery. Keep it framework-free and dependency-free.

Controller flow:

```text
render server-authored Step 01 baseline
→ parse approved handoff
→ recover valid structured session draft
→ apply handoff precedence
→ show initial step
→ on field mutation update draft and derived result
→ on Continue validate current step
→ on success hide current panel, show next, update progress, focus H2
→ on failure render summary, associate errors, focus summary
→ on Edit return to owning panel without clearing state
```

Use `hidden` for inactive panels and one `aria-live` region for concise state changes. Do not duplicate form DOM for responsive layouts.

### Phase 6 — Responsive and visual implementation

Use active semantic tokens and statically detectable Tailwind v4 utilities. Do not copy `wireframe.html` CSS.

Structure:

```text
dark page canvas
  intro + passive progress
  work/summary composition
    one light functional work surface
    open dark operational summary
  compact assurance row
```

Deterministic topology:

| Width | Required state |
| --- | --- |
| 320 | One column. Steps 01–03: work → summary → actions. Step 04: in-work review → disabled final action; duplicate summary hidden. |
| 768 | Same order with constrained measure; bounded paired fields only where the component contract permits. |
| 1024 | Active `lg` token enables 7/5 work/summary split; Step 04 still hides duplicate summary. |
| 1440 | Capped 7/5 layout, actions in work column, calm open summary. |
| 1920 | Same capped topology and measure; no stretched form or inflated spacing. |

Verify topology immediately below and above the resolved `lg` token as well as the five widths. Preserve source order, 44×44 targets, visible focus, logical properties, reduced motion, text zoom, native control fit, and zero accidental page overflow.

### Phase 7 — Public-testing action state

The current page intentionally does not submit.

Implementation requirements:

- omit form `action` and `method`;
- prevent Enter from causing an unintended navigation/submission at the final phase while preserving expected control behavior within earlier steps;
- render the intended Request booking or Request quote control as disabled `type="button"`;
- show localized `booking.status.submissionUnavailable` near the final action;
- expose an active verified contact action using canonical contact/route helpers;
- never render Turnstile, submitting, success, request reference, or delivery claims;
- keep the action label logic ready for later activation without coupling it to pricing arithmetic.

No-JavaScript output shows the Step 01 baseline, localized limitation text, and the same verified contact recovery path.

### Phase 8 — Atomic CTA migration and publication

After all three booking pages build locally:

1. Change `src/data/flows.ts` so booking and quote target route key `booking`.
2. Extend `resolveFlowHref()`/`resolveCtaHref()` with an optional typed context containing a canonical concrete `service` key. Keep generic callers source-compatible.
3. Update each concrete service page caller to pass its own service key for flow CTAs.
4. Keep Home, Header, Business hub, Special Events hub, and other generic surfaces context-free.
5. Add hidden `intent=booking` to `AirportBookingBlock.astro`; keep its hidden service and validated start fields.
6. Verify every booking/quote CTA in SR, EN, and RU resolves to the booking route with trailing slash and only approved query fields.
7. Confirm Book navigation current-state behavior on the booking route.

This migration is one release unit. Do not leave published CTAs pointing to a missing or non-rendering route.

## 4. Test plan

### Unit coverage

- every valid/invalid query parameter and Airport-only gating;
- one-time URL cleanup;
- draft → request validation for every service family;
- `Europe/Belgrade` lead-time behavior, including DST boundary fixtures;
- every pricing-result branch and recommendation behavior;
- quote-intent action precedence;
- storage whitelist, expiry, invalid version, and query precedence;
- CTA context serialization without manual route construction.

### Browser/manual coverage

- keyboard-only four-step flow, Back/Edit, error recovery, and focus movement;
- no-JavaScript recovery;
- direct generic and concrete-service entries;
- Airport prefill and invalid query handling;
- refresh recovery without free-text/PII persistence;
- disabled final action and direct-contact fallback;
- SR/EN/RU wrapping, native controls, zoom, reduced motion, and all five responsive states.

### Required commands

Run the applicable repository gates, including:

```text
pnpm components:check
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
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
pnpm verify:ui --target <booking-page-target> --surface booking --change page
```

If shared primitives change, also run the component verification profile against each exact shared target and verify reported consumers.

## 5. Deferred Cloudflare implementation

Do not implement this phase now. When separately authorized, add a same-origin Cloudflare Pages Function/Worker without changing Astro to SSR. The server phase must own schema validation, `Europe/Belgrade` lead-time enforcement, reference validation, pricing recomputation, Turnstile Siteverify, origin/host checks, body limit, rate limiting, safe logging, approved delivery/storage, duplicate prevention, pending-confirmation response, and recoverable failure states.

The client amount, trusted-distance claim, Airport qualification, and confirmation status are never authoritative.

## 6. Completion report

Report exact files changed, new page-local components and rationale, any shared API changes and consumers, commands actually run, automated results, manual responsive/accessibility evidence, placeholder or unresolved facts, blueprint deviations, and confirmation that online submission remains intentionally disabled.
