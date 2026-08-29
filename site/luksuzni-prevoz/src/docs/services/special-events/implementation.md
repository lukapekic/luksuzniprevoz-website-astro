# Special Events Hub — Implementation V2

**Status:** READY FOR IMPLEMENTATION  
**Target:** `specialEvents`

## 1. Preflight

Read:

- `/AGENTS.md`;
- `/DESIGN.md`;
- this directory's `blueprint.md`, `wireframe.md`, and `acceptance.md`;
- configured active Theme V2 JSON;
- `.skills/design-foundation-governance.md`;
- `.skills/blueprint-to-ui.md`;
- `.skills/component-architecture.md`;
- `.skills/high-value-visual-execution.md`;
- `.skills/typography-system.md`;
- `.skills/imagery-art-direction.md`;
- `.skills/responsive-layout.md`;
- `.skills/responsive-ui.md`;
- `.skills/tailwind-v4.md`;
- `.skills/accessibility-wcag.md`;
- `.skills/functional-ui.md` for CTA/flow behavior;
- current Special Events implementation;
- current Business Transportation V2 implementation for approved hub maturity patterns only;
- canonical `services.ts`, `operations.ts`, `fleet.ts`, `contact.ts`, routes, and localization helpers.

Run `git status` before edits and preserve unrelated work.

The current Special Events implementation is not a visual reference. It can be inspected for data wiring, route resolution, existing shared-component APIs, and proven technical behavior only.

## 2. Install and normalize assets first

The supplied binary assets are external to this text package. Install them under:

`src/assets/shared/other/`

with these exact normalized target names:

```text
s-class-driving-forest.webp
  ← s-class-driving-forest-intheback.webp

e-class-outside-wedding-day.webp
  ← e-class-outside-weeding-day.webp

v-class-interior.webp
  ← v-class-interior.webp

s-class-interior-driver-side.webp
  ← s-class-interior-driver-side.webp

v-class-outside-wedding-day.webp
  ← v-class-outisde-weeding-day.webp

s-class-wedding-flower-detail.webp
  ← s-class-with-flowers-special-occasion.webp

wedding-couple-vehicle.webp
  ← weeding-day-kissing.webp
```

The last two assets are reserved for the Wedding child page and MUST NOT be imported by the Special Events hub.

If any of the five hub-required assets is absent, stop image-bearing implementation for the affected region. Do not silently substitute another photo.

The only authorized temporary substitution is already locked: `v-class-interior.webp` serves as the Prom card until a dedicated Prom/event-arrival asset is supplied.

## 3. Install content before page assembly

Replace:

```text
src/content/pages/special-events/special-events.sr.md
src/content/pages/special-events/special-events.en.md
src/content/pages/special-events/special-events.ru.md
```

with the three files from `redesign-content-pack/`.

Merge the matching `ui-additions.*.json` object into:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Rules:

- merge additions only;
- preserve every existing key;
- do not create duplicate JSON keys;
- do not move canonical business facts into page content;
- do not manually edit generated UI key types.

No content-schema change is required.

Run immediately after installation:

```bash
pnpm content:sync-digests
pnpm content:validate
```

Content validation MUST pass before page assembly.

## 4. Dedicated renderer

Retain the existing dedicated Special Events routing through:

`src/components/site/ContentPageRenderer.astro`

The final route dispatch remains conceptually:

```text
scaffold → ScaffoldPage
airportTransportation → AirportTransportationPage
businessTransportation → BusinessTransportationPage
specialEvents → SpecialEventsPage
privateChauffeur → PrivateChauffeurPage
contact → ContactPage
other supported content → existing renderer
```

Do not modify route generation, locale prefixing, canonical/hreflang logic, or route-map ownership.

## 5. Page component ownership

Rewrite the existing page composition in:

`src/components/services/special-events/SpecialEventsPage.astro`

Use page-local components only for real semantic regions:

```text
SpecialEventsPage.astro
├─ SpecialEventServiceGrid.astro
│  └─ SpecialEventServiceCard.astro
├─ SpecialEventOtherOccasions.astro
├─ SpecialEventServiceScope.astro
├─ SpecialEventCoordinationStory.astro
│  └─ SpecialEventFlow.astro
├─ SpecialEventStandards.astro
└─ SpecialEventProcessSteps.astro
```

Reuse existing shared/foundation components where their contracts fit:

```text
BaseLayout
Section
PageContainer
ReadingContainer
SectionHeading
Link
ServiceHero
ServiceOverview
VehicleRecommendations
FAQ
FinalCTA
OpenSplitSection where its current contract matches the locked coordination geometry
```

Do not create a generic `HubPage.astro`.

Do not import Business page-local components into Special Events.

Do not refactor Business merely to share a component unless actual duplication cannot be expressed cleanly with already approved foundation/shared primitives.

## 6. Hero

Use shared `ServiceHero` with:

```text
variant="full-bleed"
BaseLayout overHero={true}
```

Image:

`src/assets/shared/other/s-class-driving-forest.webp`

Render:

- eyebrow from `specialEvents.hero.eyebrow`;
- localized H1 and description from page content;
- primary anchor CTA;
- secondary quote CTA;
- exactly three passive trust markers.

Trust markers:

```text
specialEvents.hero.trust.professionalChauffeur
specialEvents.hero.trust.eventPlan
specialEvents.hero.trust.manualConfirmation
```

The primary CTA resolves to `#event-services` through the existing CTA resolver.

Do not add client JavaScript for anchor navigation.

Use the existing Hero layer model. Adjust image focal/crop behavior in the caller or bounded ServiceHero API only if the current shared contract already supports such control or can receive one minimal general-purpose extension without changing reviewed Hero identity.

Do not put wedding copy into the Hero.

## 7. Proposition

Reuse `ServiceOverview` if its current `numbered-divider-facts`/equivalent contract satisfies the blueprint.

Render:

- `overview.heading.title`;
- `overview.heading.intro`;
- `overview.body`;
- exactly three `overview.items`.

Use generated `01`, `02`, `03` markers if the selected shared variant owns numbering.

No detached cards.

## 8. Event-service capability adapters

Resolve child routes through `resolveHubChildItems(routeKey, data.childServices.items)`.

Assert exact authored/canonical order:

```text
weddingTransportation
promTransportation
vipTransportation
```

Build card data from localized content plus canonical service capabilities.

### Wedding

Read `getService("weddingTransportation")`.

Capability mapping:

```text
coupleTransport
→ specialEvents.capability.coupleTransport

guestTransport
→ specialEvents.capability.guestTransport

multipleVehicles
→ specialEvents.capability.multipleVehicles
```

Media:

`e-class-outside-wedding-day.webp`

### Prom

Read `getService("promTransportation")`.

Capability mapping:

```text
individualAndGroup
→ specialEvents.capability.individualAndGroup

multipleVehicles
→ specialEvents.capability.multipleVehicles

returnPossible
→ specialEvents.capability.returnByAgreement
```

Media:

`v-class-interior.webp`

This is an explicitly temporary asset mapping. Keep it in one obvious page-local asset map so it can be replaced without touching card/component logic.

### VIP

Read `getService("vipTransportation")`.

Capability mapping:

```text
privacy
→ specialEvents.capability.privacy

discretion
→ specialEvents.capability.discretion

pricingMode.includes("quote")
→ specialEvents.capability.individualQuote
```

Media:

`s-class-interior-driver-side.webp`

Never infer or render security/protection services.

## 9. Event Services component

Replace the current generic `HubServiceSelector` usage for this page with `SpecialEventServiceGrid` because the V2 blueprint requires:

- visible generated indices;
- locked dedicated media per child service;
- exactly three canonical capability labels;
- event-specific image prominence;
- full commercial copy at rest;
- 768 px first-card-span topology.

`SpecialEventServiceGrid` owns section id:

`event-services`

`SpecialEventServiceCard` owns card composition, not data truth.

Every card has exactly one localized route-map-driven link. Avoid nested links/buttons.

No hover-only body/capability reveal.

## 10. Other Occasions

Lookup `sections[key=otherOccasions]`.

Read `getService("specialEvents").generalUseCases`.

Map only canonical values:

```text
birthdays → specialEvents.occasion.birthdays
private-parties → specialEvents.occasion.privateParties
galas → specialEvents.occasion.galas
other-special-events → specialEvents.occasion.other
```

Render:

- section label;
- heading;
- intro/body;
- localized authored CTA;
- canonical localized occasion list.

At desktop use an explanatory/list split inside one dark elevated region.

At mobile DOM order is copy → CTA → occasion list.

Do not use imagery or icons.

## 11. Service Scope

Lookup `sections[key=serviceScope]`.

Require exactly two items.

Render one open-dark section:

- label/heading/intro/body first;
- two numbered divided rows second.

At `lg` and above switch to 5/7 split.

Do not create a light panel or two separate cards.

## 12. Event Coordination Story

Lookup `sections[key=eventCoordination]`.

Require exactly five items.

Use:

`src/assets/shared/other/v-class-outside-wedding-day.webp`

Render a semantic ordered event flow through page-local `SpecialEventFlow`.

At mobile:

```text
heading
intro/body
flow
media
```

At `lg` and above use 7/5 content/media split.

Media is decorative, lazy, and rendered through Astro's asset pipeline with `object-fit: cover` and semantic radius.

Do not overlay text on the image.

Do not convert the flow into an interactive diagram or horizontally scrolling timeline.

## 13. Fleet roles

Reuse `VehicleRecommendations` and request exactly:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Read canonical vehicle facts through `getVehicle` and the existing fleet-media infrastructure.

Map role labels:

```text
mercedes-s-class
→ specialEvents.vehicleRole.mercedesSClass

mercedes-e-class
→ specialEvents.vehicleRole.mercedesEClass

mercedes-v-class-7-plus-1-extra-long
→ specialEvents.vehicleRole.mercedesVClassExtraLong

mercedes-sprinter
→ specialEvents.vehicleRole.mercedesSprinter
```

Role labels are suitability copy only. Do not duplicate capacities/specifications.

## 14. Event Standards adapter

Lookup `sections[key=standards]`.

Build rows from canonical gates.

### Professional chauffeur

Gate against canonical chauffeur/operations state that proves professional dress/service.

UI:

```text
specialEvents.standard.professionalChauffeur.title
specialEvents.standard.professionalChauffeur.text
```

### Discretion

Gate against canonical chauffeur discretion training or VIP `discretion` capability.

UI:

```text
specialEvents.standard.discretion.title
specialEvents.standard.discretion.text
```

### Multi-vehicle organisation

Gate when any relevant child capability is active:

```text
wedding.multipleVehicles
OR prom.multipleVehicles
OR vip.multiVehicle
```

UI:

```text
specialEvents.standard.multiVehicle.title
specialEvents.standard.multiVehicle.text
```

### Arranged waiting and return

Gate only from Wedding/Prom return/waiting capabilities.

UI:

```text
specialEvents.standard.waitingReturn.title
specialEvents.standard.waitingReturn.text
```

The rendered text explicitly states that waiting/return is arranged and confirmed, not automatically included.

### Manual confirmation

Gate against canonical manual confirmation state in `contact.ts`.

UI:

```text
specialEvents.standard.manualConfirmation.title
specialEvents.standard.manualConfirmation.text
```

At `lg` and above use 5/7 explanatory-content/divided-list composition.

Do not render five detached cards.

## 15. How Booking Works

Lookup `sections[key=process]`.

Require exactly three authored items.

Render the heading/intro on open dark background and all three steps in one bounded light panel.

Below `lg`:

- one column;
- horizontal internal dividers.

At `lg` and above:

- three equal columns;
- vertical internal dividers.

Use generated `01`, `02`, `03` markers.

The process remains static Astro content. No hydration is required.

Do not introduce a form into this section.

## 16. FAQ

Reuse existing FAQ component and FAQPage structured-data builder.

Require exactly six packaged questions.

Keep FAQ as the only large light region.

Do not add `Event` schema.

## 17. Final CTA

Reuse shared `FinalCTA`.

Map localized heading/text and authored primary/secondary CTAs.

Pass verified `contact.phone` and `contact.email` through the existing contacts API.

Do not author contact details inside page content.

The Final CTA remains the booking handoff and must not become a second Hero.

## 18. Booking/quote flow behavior

Continue using the existing `booking` and `quote` flow targets.

Do not create a temporary page-local form, route, wizard, or client state.

The current resolver may hand unresolved flows to localized Contact. Preserve that canonical behavior.

## 19. Indexability

The packaged V2 content intentionally omits the old `noindex: true` work-in-progress flag.

Do not restore it after the V2 page passes implementation and acceptance.

If the page is deployed before acceptance is complete, deployment/release process must prevent public indexing through the project's existing release mechanism rather than rewriting the locked final content package.

## 20. Responsive implementation

Governed states:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

### 320

- full-bleed Hero;
- event cards one column;
- Other Occasions stacked;
- Service Scope stacked;
- Event Coordination text/flow before image;
- Event Standards stacked explanatory/list;
- process light panel stacked.

### 768

- Wedding card spans first service row;
- Prom/VIP share second row;
- do not force 3 columns;
- Service Scope, Event Coordination, Standards, and Process retain their tablet-specific stacked topology from the wireframe.

### 1024+

- three event-service columns;
- Other Occasions explanatory/list split;
- Service Scope 5/7;
- Event Coordination 7/5;
- Standards 5/7;
- process one light three-column row.

Wide desktop remains container-capped.

## 21. Styling and imagery

Use active semantic tokens only.

`Section` owns vertical rhythm. `PageContainer` owns horizontal containment. Use logical CSS properties.

Photography rules:

- one locked image per prominent role;
- no repeated hub image reuse;
- no text over uncontrolled detail except Hero with approved scrim;
- no image effects used to create quality;
- no floral overlays;
- no warm/gold alternate theme;
- no routine card lift;
- no dramatic image zoom;
- no parallax.

Reduced motion removes non-essential transitions.

## 22. Test additions

Add or update coverage for:

- dedicated Special Events renderer selection;
- exact service order;
- Hero primary anchor resolution to `#event-services`;
- exact service-card capability gating;
- VIP quote-only label;
- no security/protection wording;
- canonical general-use-case rendering;
- exact two Service Scope items;
- exact five Event Coordination flow items;
- exact four fleet IDs;
- data-gated standards;
- exact three process steps;
- exactly six FAQs;
- no `Event` schema;
- no old `noindex` in final installed content;
- no page-level overflow at governed viewports;
- correct 768 px service-card topology.

## 23. Verification

Run:

```bash
pnpm content:sync-digests
pnpm content:validate
pnpm routes:validate
pnpm theme:sync:check
pnpm theme:validate
pnpm lint
pnpm check
pnpm quality:fast
pnpm build
pnpm verify:ui
pnpm test:a11y
pnpm test:e2e
pnpm format:check
```

A failed applicable gate blocks completion.

## 24. Completion report

Report exactly:

- files changed;
- production assets installed/renamed;
- shared components reused;
- page-local components created;
- content/UI files installed;
- tests added/updated;
- commands run and exact pass/fail status;
- unresolved blockers;
- whether the temporary Prom asset remains active.
