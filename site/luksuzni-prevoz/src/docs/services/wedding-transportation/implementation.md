# Wedding Transportation — Implementation V2

**Status:** READY FOR IMPLEMENTATION  
**Target:** `weddingTransportation`

## 1. Preflight

Read root `AGENTS.md`, `DESIGN.md`, this directory's blueprint/wireframe/acceptance, configured Theme V2 JSON, and matching design, component, imagery, typography, responsive, accessibility, functional-UI and multilingual-routing skills.

Inspect consumers before modifying approved shared components. Run `git status`.

## 2. Install content first

Replace the three scaffold files under:

```text
src/content/pages/wedding-transportation/
```

with the packaged locale files.

Merge `ui-additions.*.json` into the matching existing locale UI files. Never replace the complete UI files.

No page-schema expansion is required.

Run:

```bash
pnpm content:sync-digests
pnpm types:generate
pnpm content:validate
```

Validation MUST pass before assembly.

## 3. Renderer wiring

Create:

```text
src/components/services/wedding-transportation/WeddingTransportationPage.astro
```

Wire `weddingTransportation` through `src/components/site/ContentPageRenderer.astro`.

Do not modify route generation or manually concatenate localized URLs.

## 4. Shared occasion-service layer

Create only stable components already known to be required by Wedding and Prom:

```text
src/components/services/occasion-transportation/
├── OccasionServiceDefinition.astro
├── OccasionScope.astro
├── OccasionStandards.astro
└── OccasionProcessSteps.astro
```

`OccasionServiceDefinition`: overview + exactly three concise principles; open/divider-led; no page-specific logic.

`OccasionScope`: principal vehicle vs coordinated transport; authored items + active translated capability labels; no Wedding/Prom branch.

`OccasionStandards`: typed already-gated rows; caller owns business logic.

`OccasionProcessSteps`: exactly three authored steps in one shared light strip.

Do NOT create `WeddingPromPage.astro`, `OccasionPage.astro`, or a generic mega component.

## 5. Wedding-local components

Create:

```text
src/components/services/wedding-transportation/
├── WeddingTransportationPage.astro
├── WeddingDayStory.astro
├── WeddingGuestTransport.astro
└── WeddingPresentation.astro
```

Reuse shared `OpenSplitSection` where its contract fits.

## 6. Hero

Use existing ServiceHero:

```text
variant="full-bleed"
BaseLayout overHero={true}
```

Import:

```ts
import weddingHeroImage from "../../../assets/shared/other/weeding-day-kissing.webp";
```

Image is decorative. Use localized eyebrow/trust markers from `content/ui`.

Primary CTA → booking flow. Secondary → quote flow.

## 7. Service Definition

Render `data.overview` through `OccasionServiceDefinition`.

Require `overview.items.length === 3`.

## 8. Canonical capability adapter

Read:

```ts
const wedding = getService("weddingTransportation");
```

Map active capabilities:

```text
multipleVehicles → occasion.capability.multipleVehicles
mixedVehicleClasses → occasion.capability.mixedVehicleClasses
returnPossible → occasion.capability.returnPossible
waitingPossible === "custom-quote" → occasion.capability.waitingByAgreement
customPresentationRequest → occasion.capability.presentationRequest
pricingMode includes "quote" → occasion.capability.individualQuote
```

## 9. Service Scope

Lookup `sections[key=serviceScope]`. Require three items. Render through `OccasionScope`.

## 10. Wedding-Day Story

Lookup `sections[key=weddingDay]`. Require five items.

Import:

```ts
import weddingDayImage from "../../../assets/shared/other/e-class-outside-weeding-day.webp";
```

Render through page-local `WeddingDayStory`. Use semantic ordered sequence. Mobile stages precede image.

## 11. Fleet

Reuse `VehicleRecommendations`.

Request exactly:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Map suitability via `wedding.vehicleRole.*`.

All vehicle facts/media stay canonical.

## 12. Guest Transportation

Lookup `sections[key=guestTransport]`. Require three items.

Require canonical:

```text
wedding.coupleTransport === true
wedding.guestTransport === true
```

Import:

```ts
import weddingGuestImage from "../../../assets/shared/other/v-class-outisde-weeding-day.webp";
```

Render page-local `WeddingGuestTransport`. Do not repeat capacity/spec UI.

## 13. Presentation

Lookup `sections[key=presentation]`.

Render only if `wedding.customPresentationRequest === true`.

Import:

```ts
import weddingPresentationImage from "../../../assets/shared/other/s-class-with-flowers-special-occasion.webp";
```

Visible localized copy MUST clarify that requests are reviewed individually and decoration is not automatically included.

Resolve section CTA through booking flow.

## 14. Standards adapter

Lookup `sections[key=standards]`.

Build rows in page caller:

```text
professional chauffeur
→ operations.chauffeurs.dressCode === "suit-and-tie"

prepared vehicle
→ operations.vehicles.cleanlinessStandard === "highest-standard"
  && operations.vehicles.preTripInspectionForImportantTrips === true

multi-vehicle
→ wedding.multipleVehicles === true

waiting/return
→ wedding.returnPossible === true
  || wedding.waitingPossible === "custom-quote"

presentation
→ wedding.customPresentationRequest === true

manual confirmation
→ canonical booking/contact confirmation mode
```

Pass rows to `OccasionStandards`.

## 15. Process

Lookup `sections[key=process]`. Require three items. Render `OccasionProcessSteps`.

## 16. FAQ

Reuse existing FAQ. Require six items. Same validated array feeds visible FAQ and FAQ structured data.

## 17. Final CTA

Reuse shared FinalCTA. Pass localized actions plus verified phone/email from canonical contact data. Use approved FinalCTA media, not Wedding Hero.

## 18. Image delivery

All contextual assets use `astro:assets`.

Hero owns LCP priority. Below-fold images lazy-load. Preserve intrinsic dimensions/responsive sources. No raw `<img>`.

## 19. Responsive implementation

Viewports:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

Mobile:
- full-bleed Hero;
- definition/scope stack;
- editorial sections content-first;
- wedding-day sequence before image;
- fleet keeps approved mobile behavior;
- standards one column;
- process stacked;
- zero overflow.

768 portrait:
- content-first;
- Hero crop preserves wedding + vehicle;
- process stacked.

1024+:
- approved 7/5 or 6/6 editorial splits;
- standards 3×2 if readable;
- process three columns.

Wide desktop:
- no extra columns;
- active containers cap expansion.

## 20. Tests

Cover:
- dedicated Wedding renderer;
- locales no longer scaffolds;
- full-bleed Hero / over-Hero;
- exact Hero asset;
- capability gating;
- exact four Fleet IDs;
- five Wedding-day items;
- guest section requires canonical support;
- presentation gates on `customPresentationRequest`;
- no decoration-included claim;
- six FAQs;
- manual confirmation;
- no overflow.

## 21. Verification

```bash
pnpm content:sync-digests
pnpm types:generate
pnpm content:validate
pnpm routes:validate
pnpm theme:sync:check
pnpm theme:validate
pnpm components:check
pnpm lint
pnpm check
pnpm quality:fast
pnpm build
pnpm verify:ui
pnpm test:a11y
pnpm test:e2e
pnpm format:check
```

Any failed gate blocks completion.

## 22. Completion report

Report exact files changed, shared occasion components, Wedding-local components, reused components, content/UI changes, images, tests, commands and unresolved blockers.
