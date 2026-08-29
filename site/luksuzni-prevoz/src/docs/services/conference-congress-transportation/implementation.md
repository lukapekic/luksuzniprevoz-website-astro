# Conference / Congress Transportation v1 — Implementation Contract

Status: **IMPLEMENTATION-READY / STRICT**

Route: `conferenceCongressTransportation`

---

# 1. Mandatory authority

Read before editing:

```text
AGENTS.md
DESIGN.md
src/docs/services/conference-congress-transportation/MANIFEST.md
blueprint.md
wireframe.html
implementation.md
acceptance.md
content-contract.md
asset-contract.md
agent-handoff.md
current shared service docs
required .skills
```

Run the repository design-context workflow required by `AGENTS.md` before visible UI changes.

Create `compliance-matrix.md` before production edits.

---

# 2. Current repository state

Current canonical route:

```text
routeKey: conferenceCongressTransportation
kind: service
availability: scaffold
parent: businessTransportation
```

Canonical slugs remain owned by `routes.ts`.

Current Conference content entries are scaffolds.

`ContentPageRenderer.astro` already dispatches other dedicated service pages including Corporate and Delegation. Conference currently has no dedicated mapping.

Do NOT create a second dispatcher.

Current Delegation production contains `DelegationMovementSequence.astro`, which is the approved source for the shared Business movement-sequence extraction in this task.

---

# 3. Production content integration

Replace the three current Conference scaffold entries with the supplied content pack:

```text
src/docs/services/conference-congress-transportation/content/
  conference-congress-transportation.sr.md
  conference-congress-transportation.en.md
  conference-congress-transportation.ru.md
```

Target production paths remain the existing Conference content directory under `src/content/pages/`.

Keep:

```text
status: in-review
translationState: reviewed
noindex: true
```

Merge `ui-additions/*.json` into the existing SR/EN/RU UI dictionaries.

Rules:

```text
merge only
do not replace dictionaries
do not delete keys
keep exact key parity across SR/EN/RU
use existing business.* keys where blueprint says to reuse them
```

After content installation, run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

Use generator output for EN/RU source digests. Never hand-author the digest.

---

# 4. Required architecture

Create exactly these Conference-local production components unless a locked requirement cannot be expressed without an additional component:

```text
src/components/services/conference-congress-transportation/
  ConferenceCongressTransportationPage.astro
  ConferencePassengerMovement.astro
  ConferenceMultiVehicleSchedule.astro
```

Perform the locked shared extraction:

```text
src/components/services/shared/BusinessMovementSequence.astro
```

Source:

```text
src/components/services/delegation-transportation/DelegationMovementSequence.astro
```

Audience remains direct page composition.

Do not create local clones of Hero, Overview, Vehicles, Standards, FAQ or FinalCTA.

---

# 5. Shared movement-sequence extraction

This extraction is part of the locked plan and does not require a blocker report.

## Required transformation

Move the presentation contract of `DelegationMovementSequence.astro` into:

```text
BusinessMovementSequence.astro
```

Neutral props:

```ts
interface Stage {
  title: string;
  text: string;
}

interface Props {
  headingId: string;
  heading: string;
  intro: string;
  body: string;
  label: string;
  exampleLabel: string;
  stages: readonly [Stage, Stage, Stage, Stage, Stage, Stage];
  image: ImageMetadata;
}
```

Requirements:

```text
preserve current section spacing/surface
preserve 7 / 5 desktop layout
preserve six-stage list and connectors
preserve lazy responsive image behavior
remove delegation-specific heading id
no service copy inside shared component
no route/data imports inside shared component
no JavaScript
```

Migrate `DelegationTransportationPage.astro` to import and call the shared component with:

```text
headingId="delegation-movement-heading"
```

Conference calls it with:

```text
headingId="conference-event-journey-heading"
```

After migration, delete `DelegationMovementSequence.astro` only when no references remain.

Required regression: Delegation must preserve its current movement section structure, semantics, responsive topology and visual output.

---

# 6. Shared component blocker protocol

For any shared edit beyond the explicitly authorized movement-sequence extraction, stop and report:

```text
SHARED COMPONENT BLOCKER

Component:
Current behavior:
Locked Conference requirement:
Why caller composition cannot satisfy it:
Smallest compatible shared change:
Affected consumers:
Cross-page verification required:
```

No silent shared API expansion.

---

# 7. Conference page renderer guard

`ConferenceCongressTransportationPage.astro` props:

```ts
interface Props {
  routeKey: "conferenceCongressTransportation";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

Fail unless:

```text
routeKey matches
content.data.routeKey matches
pageType === service
```

Require:

```text
hero + secondary CTA
vehicleRecommendations
faq
finalCta + secondary CTA
sections:
  audience
  eventJourney
  passengerMovement
  multiVehicle
```

Required authored counts:

```text
audience.items.length === 5
eventJourney.items.length === 6
passengerMovement.items.length === 2
multiVehicle.items.length === 3
faq.items.length === 9
```

Missing locked content throws during build/dev.

---

# 8. Canonical service assertions

Resolve:

```ts
const conference = getService(routeKey);
```

Assert:

```text
pricingMode.length === 1
pricingMode[0] === "quote"
airportArrivals === true
hotelTransfers === true
venueShuttles === true
multiVehicleSchedules === true
individualExecutiveTransfers === true
groupTransport === true
```

Do not infer an airport-departure/return capability from Airport Transportation or another service.

If the canonical Conference contract changes before implementation, compare it against this blueprint and stop on semantic conflict.

---

# 9. Operations/contact assertions

Before rendering operational FAQ/standards claims, assert the current facts required by those claims.

At minimum:

```text
contact.bookingLeadTime.confirmationMode === "manual"
operations.vehicles.requestedConfirmedModelGuaranteed === true
```

Also assert every operation consumed by `buildServiceStandardGroups(locale)` through the established shared service-standard path, matching existing Corporate/Delegation patterns.

Failed canonical fact = build failure. Do not silently hide a locked fact or keep stale UI copy.

---

# 10. CTA contract

Require:

```text
hero.primaryCta     → booking flow
hero.secondaryCta   → quote flow
multiVehicle.cta    → booking flow
finalCta.primaryCta → booking flow
finalCta.secondary  → quote flow
```

Resolve every CTA with the existing canonical CTA resolver.

Do not construct URLs, locale prefixes, contact paths or `intent` query strings inside the page.

---

# 11. Hero implementation

Import:

```text
src/assets/shared/other/s-class-hotel-entrance-night.webp
```

Render:

```astro
<ServiceHero
  ...
  eyebrow={ui("conferenceCongressTransportation.hero.eyebrow")}
  trustMarkers={[
    ui("business.coordination.airportArrivals"),
    ui("business.coordination.multiVehicleSchedules"),
    ui("business.coordination.groupTransport"),
  ]}
  variant="full-bleed"
  image={heroImage}
  imageAlt=""
/>
```

`BaseLayout` uses:

```text
overHero=true
```

Do not add a Conference-specific overlay. Shared `ServiceHero` owns the filter/scrim.

Do not add `supportText`.

---

# 12. Overview implementation

Build exactly four groups:

```text
01 airport arrivals
02 hotel and event locations
03 individual and group transportation
04 multi-vehicle schedules
```

Use shared:

```text
ServiceOverview
variant="numbered-divider-facts"
surface="open-dark"
```

Sources:

```text
01 title → business.coordination.airportArrivals
01 text  → conferenceCongressTransportation.overview.airportArrivals.text

02 title → conferenceCongressTransportation.overview.hotelVenue.title
02 text  → conferenceCongressTransportation.overview.hotelVenue.text

03 title → conferenceCongressTransportation.overview.individualGroup.title
03 text  → conferenceCongressTransportation.overview.individualGroup.text

04 title → business.coordination.multiVehicleSchedules
04 text  → conferenceCongressTransportation.overview.multiVehicle.text
```

No icons/prices/cards.

---

# 13. Audience implementation

Directly compose from:

```text
Section
PageContainer
SectionHeading
```

Content source:

```text
audience
```

Exactly five items.

Follow the divider-led rail specified by blueprint:

```text
1 column mobile
2 columns md
3 columns xl
5 columns 2xl
```

The section owns local decorative markers 01–05.

Do not extract a family audience component in this task.

---

# 14. Event Journey implementation

Use shared extracted:

```text
BusinessMovementSequence
```

Pass:

```text
headingId="conference-event-journey-heading"
heading/intro/body from eventJourney
label from conferenceCongressTransportation.section.eventJourney
exampleLabel from conferenceCongressTransportation.eventJourney.exampleLabel
stages from eventJourney.items
image from src/assets/shared/other/v-class-on-the-move.webp
```

Cast/validate stages only after exact length assertion.

Do not transform the final authored item into an airport departure.

---

# 15. ConferencePassengerMovement

Create page-local:

```text
ConferencePassengerMovement.astro
```

Props should remain presentation-focused. Recommended inputs:

```ts
heading
intro
body
label
items: readonly [Item, Item]
sharedScheduleLabel
executiveVehicleLabel
groupVehicleLabel
executiveImage
groupImage
```

Do not import service copy or locale dictionaries inside the component.

The page resolves UI strings and passes them down.

Images:

```text
executive → s-class-interior-2.webp
group     → v-class-interior.webp
```

Surface:

```text
light
```

Desktop uses balanced 6 / 6 comparison. Mobile remains one logical sequence.

If capacity is displayed, the PAGE resolves it from `getVehicle()` and passes it. The component never hardcodes capacity.

Do not display capacity unless it improves the section; it is not required by this contract.

---

# 16. ConferenceMultiVehicleSchedule

Create page-local:

```text
ConferenceMultiVehicleSchedule.astro
```

Inputs:

```text
heading
intro
body
label
three authored items
three role labels
outcome label
resolved quiet action
locale
```

Surface:

```text
elevated
```

Desktop:

```text
copy 5 | model 7
```

Right-side structure:

```text
01 Individual movement   S-Class · E-Class
02 Smaller group         V-Class
03 Larger group          Sprinter
              ↓
One event transportation schedule
```

Use static CSS connectors only.

No JS, times, live status, vehicle assignment, driver names, tracking, map, availability state or dedicated coordinator wording.

Quiet CTA comes from localized `multiVehicle.cta` and points to the resolved booking URL.

---

# 17. Vehicle recommendations

Locked IDs/order:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Fail if content order differs.

Require vehicle CTA target:

```text
route → fleet
```

Resolve each vehicle from:

```text
getVehicle(id)
homepageFleetEntries
homepageFleetMedia
```

Suitability labels:

```text
business.vehicleRole.mercedesSClass
business.vehicleRole.mercedesEClass
business.vehicleRole.mercedesVClassExtraLong
business.vehicleRole.mercedesSprinter
```

Pass canonical passenger capacity according to the existing `VehicleRecommendations` contract. Never author numbers in page copy.

No price.

---

# 18. Service Standards

Build:

```ts
const standards = buildServiceStandardGroups(locale).map(...marker 01–04)
```

Assert:

```text
standards.length === 4
each group.items.length === 3
```

Render shared:

```text
ServiceStandards
variant="numbered-matrix"
surface="contained-dark"
```

Heading/intro/label from Conference UI keys.

---

# 19. FAQ interpolation

Build token map:

```text
airportArrivalsAnswer
hotelVenueAnswer
multiVehicleAnswer
individualGroupAnswer
quoteAnswer
vehicleAnswer
confirmationAnswer
```

Use established `interpolateTokens()` pattern.

Resolve only after canonical assertions.

Create one `faqItems` array and pass it to both:

```text
<FAQ items={faqItems} ... />
buildFaqPage(faqItems)
```

FAQ section uses light surface and `ReadingContainer`.

---

# 20. Final CTA

Import:

```text
src/assets/shared/other/v-class-parked-outside.webp
```

Render existing `FinalCTA` with:

```text
primary resolved booking action
secondary resolved quote action
verified phone/email contacts through existing pattern
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

Do not build a new enquiry widget.

---

# 21. Renderer wiring

After production content is no longer scaffold-shaped, import:

```text
ConferenceCongressTransportationPage
```

Add one branch in existing `ContentPageRenderer.astro`:

```text
routeKey === "conferenceCongressTransportation"
```

Pass literal route key plus current locale/content.

Do not change dispatch order unnecessarily.

---

# 22. Route publication

Do not publish the Conference route as part of the first implementation pass.

Keep:

```text
availability: scaffold
noindex: true
```

Use the existing development/review workflow to inspect the dedicated page while gated.

After acceptance and owner review, make a separate explicit release change:

```text
routes.ts availability → published
content noindex → false only when publication rules require it
status → repository-approved publish state
```

Never couple publication to a component refactor commit without review.

---

# 23. Styling rules

All production CSS uses active Theme V2 tokens.

Required:

```text
no hardcoded palette values
no custom font family
no random spacing literals when a token exists
no glow
no metallic gradient
no glassmorphism
no border-heavy dashboard
no card wall
```

Use section surfaces semantically:

```text
Hero                 full bleed dark
Overview             open dark
Audience             open dark
Event Journey        elevated dark (shared sequence)
Passenger Movement   light
Multi Vehicle        elevated graphite
Vehicles             shared behavior
Standards            contained dark
FAQ                  light
Final CTA             shared integrated treatment
```

---

# 24. Responsive implementation

Verify at exact reference widths:

```text
320
768
1024
1440
>= 1600 sanity check
```

Required:

```text
no horizontal overflow
no clipped H1/CTA
no image-only meaning
no forced tiny multi-column layout
no CSS reordering that changes interactive reading order
all grid children use min-inline-size: 0 where needed
```

Hero asset crop receives special review at every state.

---

# 25. Accessibility

Mandatory:

```text
one H1
semantic H2/H3 hierarchy
ordered lists for audience/journey where sequence matters
44×44 interactive target minimum
visible focus
keyboard accessibility
AA contrast
empty alt for locked decorative images
connectors not sole carrier of meaning
prefers-reduced-motion honored by shared Hero
```

Do not add ARIA that duplicates native semantics.

---

# 26. SEO

Use existing:

```text
buildPageSeo
buildFaqPage
```

Requirements:

```text
localized SEO copy from content
canonical route resolver
FAQ schema from visible resolved FAQ array
no raw URLs
no Offer/Product/Event schema inventions
noindex during implementation
```

---

# 27. Required tests and validation

At minimum add/extend tests to cover:

```text
SR/EN/RU content parses
required section keys and exact item counts
CTA flow roles
quote-only canonical assertion
four Overview facts
five audience items
six Event Journey stages
Final transfer remains final journey stage
no airport departure claim in all three locales
two passenger roles
three multi-vehicle roles
four locked vehicle IDs including Sprinter
FAQ length = 9
visible FAQ and JSON-LD use same resolved data
renderer dispatch
Hero image asset import
responsive no-overflow smoke coverage
```

Cross-page regression is mandatory for Delegation after `BusinessMovementSequence` extraction.

Run the repository validators/checks required by root `AGENTS.md`, including content validation, route validation, SEO validation, lint, tests and production build.

---

# 28. Completion report

Return the report format from `agent-handoff.md`.

A failed canonical assertion, asset mismatch, translation parity issue, shared-component regression or accessibility blocker prevents publication.
