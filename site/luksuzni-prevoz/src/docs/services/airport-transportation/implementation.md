# Airport Transportation — Implementation Contract v3

Status: **Implementation-ready page packet — v3.2 wireframe-aligned**
Route key: `airportTransportation`
Page type: `service`
Blueprint: `src/docs/services/airport-transportation/blueprint.md`
Wireframe: `src/docs/services/airport-transportation/wireframe (2).html`

This file fully replaces the previous Airport implementation contract. Obsolete contained-Hero and non-interactive `details we need` behavior is no longer authoritative.

When sources conflict, follow the repository precedence in `AGENTS.md`.

---

# 1. Required authority stack

Read before implementation:

```text
AGENTS.md
DESIGN.md

site/luksuzni-prevoz/src/docs/agent-prompts/
  00-service-agent-foundation.md
  component-reuse-registry.md
  01-reuse-first-component-builder.md
  03-page-specific-section-builder.md
  04-service-page-assembler.md
  05-data-content-integration.md
  06-responsive-a11y-imagery.md
  07-validation-review-handoff.md

site/luksuzni-prevoz/src/docs/services/shared/
  00-system-rules.md
  01-token-contract.md
  02-service-hero.md
  03-service-overview.md
  04-vehicle-recommendations.md
  05-service-standards.md
  06-responsive-rules.md
  07-wireframe-rules.md

site/luksuzni-prevoz/src/docs/services/airport-transportation/
  blueprint.md
  wireframe (2).html
  implementation.md
  acceptance.md
```

Mandatory skills (all required; no substitute bundle):

```text
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/functional-ui.md
.skills/imagery-art-direction.md
.skills/responsive-images-performance.md
.skills/technical-seo.md
.skills/structured-data.md
.skills/multilingual-routing.md
.skills/technical-page-review.md
```

Before editing:

```bash
pnpm design:context site/luksuzni-prevoz
```

---

# 2. Design delta from v2

The following previous decisions are explicitly retired:

```text
ServiceHero / contained
AirportBookingBlock details-list + quote-result panel
Arrival generic divider rows
FBO padded image card
VehicleRecommendations equal static cards/row
ServiceStandards long divider list
```

The required v3 replacements are:

```text
ServiceHero / full-bleed
grouped icon ServiceOverview
compact real booking-start form
vertical arrival timeline
open cinematic FBO split with portrait media
Homepage carousel mechanics with full-image vehicle cards
one divided standards panel with four groups
  heading-led sections without visible numbering
```

Do not preserve obsolete v2 visual behavior as a fallback.

---

# 3. Authoritative data

Use `src/data/services.ts`.

Current Airport service contract includes:

```text
routeKey                              airportTransportation
kind                                  service
pricingMode                           fixed-when-calculable + quote
airports                              belgrade-nikola-tesla
oneWay                                true
return                                true
standardStops                         point-to-point
flightTracking                        true
meetAndGreet                          true
luggageAssistance                     true
nameSign                              true
standardWaitingMinutesAfterLanding    60
commercialAviation                    true
privateAviation                       true
fboCoordination                       true
relatedRoutes                         privateChauffeur
                                      vipTransportation
```

Use:

```text
operations.ts → operational standards
fleet.ts      → vehicle facts
contact.ts    → contact/booking policy
business.ts   → business/booking policy
routes.ts     → localized routes
```

No component or localized Markdown may become a second factual source.

---

# 4. Airport pricing contract

Airport fares are vehicle-specific. Numeric values, currency, status, and unit
metadata come exclusively from the shared pricing source. Every current fleet
vehicle has an owner-supplied EUR fare for Belgrade Airport ↔ Belgrade city
locations. The typed source is authoritative and the page must not derive or
duplicate values.

Hard reject:

- price literals in components, content, or UI dictionaries;
- deriving Airport fare from hourly or per-kilometre values;
- any currency other than the typed EUR value;
- fake zero/placeholder amount;
- price schema that is not identical to visible validated pricing.

---

# 5. Shared component contract updates required

Airport v3 requires these approved shared contracts:

```text
ServiceHero
  + variant="full-bleed"

ServiceOverview
  + variant="grouped-icons"

VehicleRecommendations
  + Homepage HorizontalCarousel mechanics
  + full-image background cards
  + vehicle-specific shared fare state

ServiceStandards
  + divided-panel behavior
```

These are deliberate shared-contract evolutions, not page-local hacks.

If the actual component API does not yet support them, update the shared component through the normal reuse-first workflow, then review affected consumers.

Do not create Airport-local clones of shared components to avoid the contract update.

---

# 6. Target architecture

Preferred:

```text
src/components/
├── site/
│   └── ContentPageRenderer.astro
│
└── services/
    ├── shared/
    │   ├── ServiceHero.astro
    │   ├── ServiceOverview.astro
    │   ├── VehicleRecommendations.astro
    │   └── ServiceStandards.astro
    │
    └── airport-transportation/
        ├── AirportTransportationPage.astro
        ├── AirportBookingBlock.astro
        └── AirportArrivalTimeline.astro
```

Justified Airport-specific components:

### `AirportTransportationPage`

Page renderer/assembler.

### `AirportBookingBlock`

Owns the compact form, validation and booking-state handoff.

### `AirportArrivalTimeline`

Owns Airport-specific capability-to-timeline mapping and semantic timeline markup.

Private Aviation/FBO remains direct page composition unless implementation proves a component extraction is materially clearer.

---

# 7. Dispatcher

Reuse the single:

```text
src/components/site/ContentPageRenderer.astro
```

Mapping:

```text
airportTransportation → AirportTransportationPage
```

Preserve existing Private/Business mappings where present.

No second dispatcher.
No duplicate locale route conditions.
No manual localized path concatenation.

---

# 8. BaseLayout / header / Hero integration

Airport v3 uses the same conceptual full-bleed entrance behavior as the Homepage, without cloning Homepage Hero internals.

Use:

```text
ServiceHero
variant="full-bleed"
```

and the verified over-Hero header behavior.

The page renderer should request the existing `BaseLayout` header-over-Hero mode if its API supports it.

Hard requirements:

- full viewport-width Hero;
- no outer Hero radius;
- no parent PageContainer constraining the media surface;
- inner content aligned to semantic container/grid;
- header remains readable over media;
- language switcher/dropdowns remain above Hero layers;
- Hero scrim supports WCAG AA;
- one H1 only;
- no form in Hero.

Do not import/copy `HomepageHero.astro` as the service Hero implementation.

---

# 8A. Repo surface contract — v3.2

Use semantic roles from the configured active theme rather than version names
or duplicated raw values.

Required surface mapping:

```text
Overview
  open-dark outer rhythm
  → no enclosing architectural panel
  → standard section rhythm

Arrival
  open-dark outer rhythm
  → contained-dark architectural panel
  → OpenSplit-like 7/5 composition
  → contextual image uses card/media radius

Booking
  open-dark outer rhythm
  → contained light architectural panel
  → form controls directly in the light panel
  → NO nested white result/form card

Private Aviation / FBO
  → open-dark feature rhythm
  → content 7 / portrait media 5
  → media is one card/media surface, not nested in another panel

VehicleRecommendations
  open-dark outer rhythm
  → shared Homepage HorizontalCarousel mechanics
  → full-image cards use the Homepage service-card visual language
  → fare data comes from shared pricing

ServiceStandards
  open-dark outer rhythm
  → one contained-dark divided panel
  → four groups separated by rules, not cards
  → do not render the entire operations.ts truth set

FAQ
  open-dark outer rhythm
  → contained light reading panel

FinalCTA
  existing shared FinalCTA panel unchanged
```

Do not invent new radius values.
Do not increase section height simply to make the page feel more luxurious.

# 9. Content contract

Canonical entries:

```text
src/content/pages/airport-transportation/
  airport-transportation.sr.md
  airport-transportation.en.md
  airport-transportation.ru.md
```

Use `servicePageSchema`.

Expected editorial keys:

```text
hero
overview
sections.booking
sections.arrivalHandling
sections.privateAviationFbo
vehicleRecommendations
faq
finalCta
```

V3 content change:

- `booking` no longer needs `details we need` items;
- booking heading/body introduces the compact booking-start form;
- arrival timeline labels are data/UI driven rather than ordered editorial fact cards;
- Private Aviation copy is elevated to stronger VIP/FBO coordination language.

---

# 10. Page-level eyebrow system

The page renderer owns the stable sequence:

```text
01 Pregled
02 Dolazak
03 Rezervacija
04 Privatna avijacija
05 Vozila
06 Standardi
07 Česta pitanja
```

Localized labels come from approved UI strings. Labels remain normal title case; avoid uppercase-eyebrow treatment on every section.

Render visually as:

```text
01  PREGLED
```

or locale equivalent.

The numeric index is structural/presentational and does not need to be localized.

Use one semantic eyebrow pattern throughout the page.

---

# 11. ServiceOverview view model

Use shared:

```text
ServiceOverview
variant="grouped-icons"
```

Build exactly four Airport groups from canonical data.

## Group 1 — Transfer

Source:

```text
standardStops
oneWay
return
```

These must appear as one customer-facing row/group.

## Group 2 — Arrival

Source:

```text
flightTracking
meetAndGreet
standardWaitingMinutesAfterLanding
```

Interpolate the waiting minutes from canonical data.

## Group 3 — Assistance

Source:

```text
luggageAssistance
nameSign
```

## Group 4 — Aviation

Source:

```text
commercialAviation
privateAviation
fboCoordination
```

Each group view model should contain:

```ts
{
  key: string;
  icon: approved semantic icon id;
  title: localized string;
  text: localized string;
}
```

Icon choice is presentation, not business data.

Icons must be `aria-hidden` when adjacent text already carries the meaning.

Do not show the old one-boolean-per-line notebook list.

---

# 12. AirportBookingBlock — functional contract

The previous informational two-zone block is retired.

V3 renders one compact booking-start form.

Desktop:

```text
editorial heading/copy 5 | form 7
```

Approved controls:

```text
flightNumber
date
time
```

The section may show a quiet secondary quote action below the primary Continue action.

## Required field behavior

Use existing approved:

```text
Field
Input
Button
```

and native date/time behavior where appropriate.

Every field has a visible label.

Do not use placeholder-only labelling.

## Booking intent

The form represents:

```ts
interface AirportBookingIntent {
  service: "airportTransportation";
  flightNumber?: string;
  date: string;
  time: string;
}

The canonical implementation is `src/lib/booking/airport-booking-intent.ts`.
It owns field names, ISO date and `HH:mm` validation, query serialization, and
query parsing. Both the current GET form and the future booking page MUST use
that module; neither may redefine the contract.

Form states are explicitly limited to `idle`, `invalid`, `submitting`,
`handoff`, `error`, and `unavailable`. Native browser validation remains the
first line of defense; errors require visible text, `aria-invalid`, and an
associated description. The current static form does not invent a success
state: it hands off to the booking route with the serialized intent.
```

The receiving detailed booking form must receive and prefill these values.

The exact transport mechanism belongs in one shared booking-flow helper/contract, not inside `AirportBookingBlock`.

Preferred resolution order:

1. reuse an existing booking-intent/state handoff if one exists;
2. otherwise add one small site-level booking-intent helper;
3. the helper resolves the localized detailed booking destination using route/flow infrastructure;
4. it serializes only the approved initial fields;
5. the detailed form parses/validates and uses them as initial values.

Do not:

- concatenate localized paths manually;
- invent localStorage/sessionStorage state inside the Airport component;
- collect fields and discard them;
- redirect to a page that cannot consume them.

The future booking route is a route-map entry. Query parameters must not create
indexable duplicate pages; the receiving page owns canonical/noindex handling.

## Visual state

Light functional surface.

Primary action must have clear contrast against the light background.

Explicitly reject:

```text
white button on white background
```

Focus, hover, disabled and error states must all remain perceivable.

No price/result panel exists in v3.

---

# 13. Arrival timeline

Use:

```text
AirportArrivalTimeline
```

inside the 7/5 Arrival split.

Timeline steps are assembled from canonical capability state plus localized wording.

Preferred semantic sequence:

```text
flightTracking
meetAndGreet
luggageAssistance
standardStops: point-to-point
```

Waiting allowance may appear within the flight/arrival step, using the canonical numeric value.

Do not invent a step for an unsupported capability.

Markup should be a semantic ordered list.

Visual:

- one vertical line;
- compact node/icon;
- title + short text;
- no cards around individual steps.

The timeline remains understandable with CSS/motion disabled.

---

# 14. Private Aviation / FBO

Render only when verified service flags permit it.

Desktop structure:

```text
content 7 | media 5
```

Use an open feature section. The media column uses `private-flight.jpg` as an
optimized local Astro asset with the approved portrait crop, semantic
card/media radius, and no nested image surface.

Content should emphasize:

- discreet pre-arrival coordination;
- itinerary coordination with passenger/assistant/company;
- FBO/handler-aware pickup procedures;
- smooth continuation from arrival to vehicle/onward schedule;
- custom handling for complex VIP transportation requests.

Do not imply security service, bodyguard service, protected transport, apron guarantee, or aviation operations.

A contextual `vipTransportation` link is allowed via route helpers.

---

# 15. VehicleRecommendations

Reuse the Homepage `HorizontalCarousel` mechanics unchanged. Airport vehicle
cards use full-image backgrounds, a restrained directional scrim, and overlaid
copy in the same visual family as Homepage service cards without reusing their
route-card semantics.

Required:

- content-supplied vehicle IDs;
- canonical vehicle facts from `fleet.ts`;
- dominant active recommendation;
- visible next recommendation/peek at the defined responsive states;
- previous/next controls;
- active index counter;
- mobile touch/scroll behavior;
- no autoplay;
- keyboard-safe controls;
- vehicle-specific Airport fare from shared pricing data when validated;
- no pending fare state is permitted for a vehicle rendered by this contract;
  missing data fails validation.

Do not reuse Homepage `FleetShowcase` markup/CSS wholesale.

---

# 16. ServiceStandards

Use shared:

```text
ServiceStandards
variant="divided-panel"
```

The Airport page must show four visible groups maximum inside one divided panel.

Recommended deterministic groups:

### Professional chauffeur

May select verified facts such as:

- professional dress;
- English-speaking standard;
- minimum driving experience.

### Prepared vehicle

May select:

- cleanliness;
- approved maintenance;
- pre-trip inspection / backup behavior.

### Passenger care

May select:

- door opening;
- luggage assistance;
- passenger insurance.

### Comfort & journey

May select:

- climate control;
- bottled water;
- Wi-Fi/chargers;
- child seat on request where appropriate.

Keep each panel concise. Do not dump every true `operations.ts` field.

Do not duplicate the Airport arrival timeline inside Standards.

---

# 17. FAQ

Reuse the existing shared FAQ.

Page-level composition may add only the approved heading and description; it
must not add visible section numbers or a second accordion state owner.

The FAQ component remains the single accordion owner.

Visible questions and structured FAQ data use the same validated array.

---

# 18. FinalCTA

Reuse shared `FinalCTA`.

No Airport-specific clone.
No second Hero.
No duplicate booking form.

---

# 19. UI strings

V3 requires approved strings in all configured locales for:

```text
airport.section.*
airport.overview.*
airport.booking.form.*
airport.timeline.*
serviceStandards.group.*
```

The supplied UI patch accompanies this contract.

Existing Airport capability and operations labels may remain for other consumers; v3 does not require deleting valid shared keys merely because the old Airport layout no longer displays them.

Maintain exact SR/EN/RU key parity.

---

# 20. Interaction / motion

Required functional interaction:

- Airport booking-start form;
- vehicle carousel;
- FAQ.

Allowed restrained polish:

- icon-group hover/focus;
- CTA arrow translation;
- timeline progressive reveal;
- subtle media scale/crop transition.

Prefer CSS/native/shared behavior.

Any new client JS must be justified and respect reduced motion.

No autoplay carousel.
No scroll-jacking.
No decorative motion required for understanding.

---

# 21. Accessibility

WCAG 2.2 AA minimum.

Verify:

- one H1;
- Hero/header contrast;
- 44×44 targets;
- visible focus;
- full keyboard navigation;
- form labels;
- associated errors;
- native date/time accessibility;
- no white-on-white action;
- carousel control names;
- no focus trap;
- decorative SVGs hidden from AT;
- timeline semantic ordered list;
- FAQ keyboard behavior;
- reduced motion;
- no horizontal overflow.

---

# 22. Responsive behavior

Review and record evidence at:

```text
320
768
1024
1440
1920
```

## Hero

Always full bleed.

## Overview

Open 5/7 on desktop; mobile and tablet portrait use one clear vertical sequence.

## Booking

Desktop uses 5/7 editorial/form columns. Tablet portrait uses a single
balanced form row when the measured container cannot preserve both columns;
tablet landscape re-evaluates the same constraint rather than inheriting the
desktop split. Mobile is a single column. At every state, fields retain their
labels, 44px targets, logical reading order, and no horizontal overflow.

## Arrival

Desktop media 7 / timeline 5.
Mobile timeline first, media second.

## FBO

Desktop content 7 / portrait media 5. Mobile and tablet portrait place content
first; tablet landscape receives an intentional split only when both regions
retain readable measure.

## Vehicles

Carousel must not create page overflow.

## Standards

4-across only if readable; otherwise 2×2 / 1-column, with dividers adapting to
the row/column topology.

---

# 23. SEO / structured data

Reuse existing builders.

Hero title is the single H1.

Preserve:

- localized SEO title/description;
- canonical;
- hreflang;
- lifecycle/noindex;
- FAQ schema parity.

No price/currency in structured data without validated Airport pricing that is
also visible on the page.

---

# 24. Imagery

Roles:

```text
Hero                    cinematic Airport/chauffeur context
Arrival                 airport/meet-and-greet/interior context
Private Aviation/FBO    premium cockpit/FBO/private-flight transport context
Vehicles                canonical vehicle media
FinalCTA                shared closer media
```

Private Aviation uses `src/assets/private-flight.jpg` as open-section portrait
media, not a padded image nested inside another card.

Do not fetch random remote stock imagery during implementation.

---

# 25. Allowed scope

Expected:

```text
src/components/services/shared/ServiceHero.astro
src/components/services/shared/ServiceOverview.astro
src/components/services/shared/VehicleRecommendations.astro
src/components/services/shared/ServiceStandards.astro

src/components/services/airport-transportation/
  AirportTransportationPage.astro
  AirportBookingBlock.astro
  AirportArrivalTimeline.astro

src/components/site/ContentPageRenderer.astro
  only if Airport mapping/integration requires it

src/lib/
  only a shared booking-intent helper if no existing equivalent exists

src/content/pages/airport-transportation/*
src/content/ui/{sr,en,ru}.json

tests/*
  only direct shared-variant/Airport/booking-handoff coverage
```

Do not refactor unrelated pages.

---

# 26. Implementation sequence

```text
1. pnpm design:context site/luksuzni-prevoz
2. Read v3 blueprint + wireframe + shared v2 contracts.
3. Inspect current shared components before editing.
4. Inspect booking flow and identify the detailed booking receiver.
5. Build/verify state-preserving booking-intent handoff.
6. Add ServiceHero full-bleed variant.
7. Add ServiceOverview grouped-icons variant.
8. Update VehicleRecommendations to Homepage-carousel/full-image-card contract.
9. Update ServiceStandards to the divided-panel contract.
10. Update Airport page composition.
11. Implement AirportBookingBlock mini form.
12. Implement AirportArrivalTimeline.
13. Recompose Private Aviation/FBO as an open portrait-media feature.
14. Integrate revised localized content/UI strings.
15. Review responsive states.
16. Review WCAG/focus/contrast.
17. Run design review/detector.
18. Run validation/check/build.
19. Complete acceptance contract.
```

---

# 27. Definition of done

Airport v3 is complete only when:

- the Hero is full bleed and the header integrates safely over it;
- Overview uses four grouped icon concepts rather than a blunt fact list;
- transfer/one-way/return are visually consolidated;
- the booking section contains a real compact form with state-preserving continuation;
- no entered mini-form state is discarded;
- Airport fare is vehicle-specific shared data and is never invented;
- Arrival uses a semantic vertical timeline;
- Private Aviation media fills its column with no padded image card;
- Private Aviation copy/presentation reads as a premium VIP capability without security claims;
- VehicleRecommendations is an accessible Homepage-mechanics carousel with full-image cards;
- ServiceStandards shows four concise groups in one divided panel;
- every section has a heading and no visible section-number eyebrows;
- localized UI/content is complete in SR/EN/RU;
- data/content separation remains intact;
- responsive states pass;
- WCAG 2.2 AA passes;
- SEO/FAQ structured data remain correct;
- project validation/check/build pass.
