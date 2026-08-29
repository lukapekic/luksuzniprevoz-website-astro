# Prom Transportation — Implementation V2

**Status:** IMPLEMENTED — PAGE VERIFICATION PASSED 2026-08-29  
**Target:** `promTransportation`

The route/content publication and dedicated Prom renderer are complete. The
exact page verification profile passed, and responsive browser review was
completed at all five governed widths.

The localized compatibility `h1` remains in content, but the dedicated renderer
renders only `hero.title` as the page H1.

## Implementation evidence

- `PromTransportationPage.astro` is dispatched explicitly for
  `promTransportation`.
- Shared Occasion, Hero, Fleet, FAQ and Final CTA contracts were reused without
  modifying their APIs or production implementation.
- Prom Arrival, Group Arrival and Presentation remain page-local components.
- Chromium and Firefox passed all 18 Prom smoke tests; WebKit is unavailable on
  this host because its required system libraries are not installed.
- The governance `page` profile passed all 19 gates.

## 0. Ordered execution plan

1. **Preflight and compliance matrix** — resolve the Prom design context,
   record each locked section against its content/data source, component,
   responsive topology and test evidence.
2. **Assembler and dispatch** — create `PromTransportationPage.astro`, add the
   explicit `ContentPageRenderer` branch, validate content cardinalities and
   canonical service gates before rendering.
3. **Shared Occasion integration** — wire Definition, Scope, Standards and
   Process through their existing typed APIs without changing shared code.
4. **Prom-local narrative components** — implement Arrival Story, Group Arrival
   and Presentation as page-local semantic compositions with content-first DOM.
5. **Fleet, FAQ, SEO and Final CTA** — reuse current production contracts,
   canonical data, one FAQ array for visible/schema output, and verified
   contacts.
6. **Responsive and image hardening** — verify all five viewports, long Russian
   copy, text zoom, crop/focal behavior, loading priority, focus order, targets
   and overflow.
7. **Automated acceptance** — add the dedicated Prom smoke spec, run exact
   page/governance/site gates, fix every P0/P1 and unresolved P2.
8. **Handoff** — reconcile the acceptance checklist and report shared changes,
   local components, assets, commands, visual evidence and unresolved items.

Expected production file map:

```text
src/components/services/prom-transportation/
├── PromTransportationPage.astro
├── PromArrivalStory.astro
├── PromGroupArrival.astro
└── PromPresentation.astro

src/components/site/ContentPageRenderer.astro
tests/smoke/prom-transportation.spec.ts
```

## 1. Preflight

Read root project authorities, this package, Wedding locked docs/current Wedding implementation, configured Theme V2 JSON and the matching design/component/imagery/responsive/a11y/functional-ui/multilingual skills.

Run the deterministic page preflight:

```bash
git status
pnpm design:context --target site/luksuzni-prevoz/src/components/services/prom-transportation/PromTransportationPage.astro --surface prom-transportation
pnpm components:check
```

The Prom design surface is registered in `.design/config.json`. Run
`components:check` before changing any approved shared component; a shared
change also requires the component verification profile and Wedding consumer
verification.

Wedding is the reference implementation for shared Occasion contracts, not a page to copy wholesale.

## 2. Verify assets

Resolve:

```text
src/assets/shared/other/prom-holding-flowers-mercedes-bg.webp
src/assets/shared/other/prom-closeup-mercedes-background.webp
src/assets/shared/other/flowers-on-console.webp
src/assets/shared/other/v-class-interior.webp
```

If a Prom-specific filename differs in the working branch, STOP and update the mapping deliberately. Do not fall back to Wedding photography.

## 3. Installed content and publication baseline

The full SR/EN/RU service entries and missing UI keys are already installed.
All entries are `published`, `reviewed`, and `noindex: false`; EN/RU use
the current Serbian source digest. `routes.ts` publishes
`promTransportation`.

Shared `occasion.*` merge rule:

```text
missing key → add
existing identical key → keep
existing different key → STOP and reconcile
```

Before and after page assembly, keep these checks green:

```bash
pnpm content:sync-digests
pnpm types:generate
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
```

No schema expansion is required.

## 4. Renderer

Create:

```text
src/components/services/prom-transportation/PromTransportationPage.astro
```

Wire `promTransportation` through `ContentPageRenderer.astro`.

Use the existing explicit dispatcher pattern:

```text
import PromTransportationPage
routeKey === "promTransportation" → PromTransportationPage
```

Do not modify route generation or duplicate SEO/hreflang logic.

## 5. Reuse shared Occasion components

Inspect and reuse the shared Wedding-proven semantic equivalents of:

```text
OccasionServiceDefinition.astro
OccasionScope.astro
OccasionStandards.astro
OccasionProcessSteps.astro
```

Do not copy these into the Prom directory.

Only modify a shared API when Prom exposes a stable requirement that remains valid for both Wedding and Prom. Any shared change requires consumer-impact review.

## 6. Prom-local components

Create only page-specific compositions:

```text
PromTransportationPage.astro
PromArrivalStory.astro
PromGroupArrival.astro
PromPresentation.astro
```

Reuse `OpenSplitSection`, `Section`, `PageContainer`, `SectionHeading` and other reviewed primitives where their contracts fit.

## 7. Hero

Use:

```text
ServiceHero variant="full-bleed"
BaseLayout overHero={true}
```

Import:

```ts
import promHeroImage from "../../../assets/shared/other/prom-holding-flowers-mercedes-bg.webp";
```

Resolve localized eyebrow, H1, description, booking CTA, quote CTA and three trust markers.

Trust keys:

```text
prom.hero.trust.professionalChauffeur
prom.hero.trust.manualConfirmation
prom.hero.trust.plannedPickup
```

Use approved scrim/layering. Do not derive UI colors from the photograph.

## 8. Service Definition

Render `data.overview` through shared `OccasionServiceDefinition`.

Require exactly three overview items.

## 9. Canonical Prom capability adapter

Read:

```ts
const prom = getService("promTransportation");
```

Build the Planning Scope capability list in this exact order:

```text
individualAndGroup → occasion.capability.individualAndGroup
multipleVehicles → occasion.capability.multipleVehicles
mixedVehicleClasses → occasion.capability.mixedVehicleClasses
returnPossible → occasion.capability.returnPossible
waitingPossible === "custom-quote" → occasion.capability.waitingByAgreement
pricingMode includes "quote" → occasion.capability.individualQuote
```

Exactly six labels render for the current canonical data. No inactive label
renders. `customPresentationRequest` gates the dedicated Presentation section
and does not duplicate itself in Planning Scope.

## 10. Planning Scope

Lookup `sections[key=serviceScope]` and require exactly three authored items.

Render through shared `OccasionScope`.

Pass the existing typed contract: heading, optional intro, required body,
localized label, exactly three authored items, and the six-string capability
list.

## 11. Arrival Story

Lookup `sections[key=arrivalStory]` and require exactly four items.

Import:

```ts
import promArrivalImage from "../../../assets/shared/other/prom-closeup-mercedes-background.webp";
```

Render page-local `PromArrivalStory` using a semantic ordered stage list.

Mobile order:

```text
label → heading → intro/body → stages → image
```

No horizontally scrolling timeline.

## 12. Fleet

Reuse `VehicleRecommendations`.

Request exactly:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Use Prom suitability keys from `content/ui`. All model facts/images remain canonical.

Follow the current shared API: resolve canonical recommendation objects in the
page assembler, pass a route-based Fleet CTA, localized fleet/class/carousel
labels, and a unique `carouselId="prom-vehicles"`.

## 13. Individual / Group Arrival

Lookup `sections[key=groupArrival]`, require exactly three items and require `prom.individualAndGroup === true`.

Gate multi-vehicle/mixed-class claims with the corresponding canonical flags.

Import:

```ts
import promGroupImage from "../../../assets/shared/other/v-class-interior.webp";
```

Render page-local `PromGroupArrival`. Do not duplicate capacities.

## 14. Presentation

Lookup `sections[key=presentation]` and render only when `prom.customPresentationRequest === true`.

Import:

```ts
import promPresentationImage from "../../../assets/shared/other/flowers-on-console.webp";
```

Render page-local `PromPresentation`.

Visible localized copy MUST state that special presentation requests are reviewed individually and decorative details are not automatically included.

Resolve the section CTA through the existing booking flow.

## 15. Standards adapter

Lookup `sections[key=standards]`.

Build rows in the page/caller and pass them to shared `OccasionStandards`.

Gates:

```text
professional chauffeur
→ operations.chauffeurs.dressCode === "suit-and-tie"

prepared vehicle
→ cleanlinessStandard === "highest-standard"
  AND preTripInspectionForImportantTrips === true

individual/group
→ prom.individualAndGroup === true

multi-vehicle
→ prom.multipleVehicles === true

waiting/return
→ prom.returnPossible === true
  OR prom.waitingPossible === "custom-quote"

manual confirmation
→ canonical booking confirmation model
```

Do not render irrelevant amenity/icon grids.

## 16. Process

Lookup `sections[key=process]`, require exactly three items and reuse `OccasionProcessSteps`.

Preserve the Wedding-approved shared light-strip geometry.

## 17. FAQ

Reuse existing FAQ and require exactly six items.

Feed the same validated array into visible FAQ and FAQ structured data.

## 18. Final CTA

Reuse shared FinalCTA.

Pass localized resolved actions plus one verified
`contacts: { phone?, email? }` object. Use the approved shared Final CTA media
contract; do not reuse the Prom Hero image.

## 19. Image delivery

All contextual Prom assets use `astro:assets`.

Hero follows existing LCP strategy. Below-fold images lazy-load. No raw `<img>`.

Start with the current shared full-bleed Hero focal/scrim behavior. If rendered
crop or contrast fails, do not patch shared internals from Prom CSS. Propose a
typed, page-neutral focal-point contract, run `components:check`, verify every
ServiceHero consumer, and run the component profile before adopting it.

`flowers-on-console.webp` is portrait. The page-local Presentation component
must define intentional object-cover geometry that preserves the flowers and
console at all governed states without implying that decoration is included.

## 20. Responsive verification

Review:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

At every state verify Hero crop, readable measure, CTA visibility, content order, image focal point, Fleet behavior, process topology, FAQ, focus order, 44×44 targets and zero page overflow.

Deterministic topology:

```text
below md        → standards 1 column; editorial sections stacked
md to below lg  → standards 2 columns; editorial sections stacked
below lg        → process stacked
lg and above    → arrival/group content 7 + media 5
                  presentation media 5 + content 7
                  standards 3×2
                  process 3 equal columns
```

DOM order remains content-first for all editorial regions, including
Presentation where CSS places media first at `lg+`.

## 21. Tests

Create `site/luksuzni-prevoz/tests/smoke/prom-transportation.spec.ts`, based
on the current Wedding smoke contract, with coverage for:

- dedicated Prom renderer;
- all locales are full service entries;
- exact Hero/media asset mapping;
- full-bleed Hero;
- capability gating;
- exact four Fleet IDs;
- exactly four arrival stages;
- group section requires `individualAndGroup`;
- presentation requires `customPresentationRequest`;
- no decoration-included wording;
- six FAQ items;
- manual confirmation;
- shared Occasion components reused, not duplicated;
- governed viewport overflow checks.
- canonical/hreflang/robots behavior for all three published locales;
- exact section `aria-labelledby` order;
- visible FAQ and FAQ JSON-LD identity;
- eager/high-priority Hero and lazy below-fold images;
- computed Inter Tight/Manrope roles;
- Axe WCAG 2.2 and minimum-target checks.

## 22. Verification

Run:

```bash
pnpm content:sync-digests
pnpm types:generate
pnpm types:generate:check
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm theme:sync:check
pnpm theme:validate site/luksuzni-prevoz
pnpm components:check
pnpm lint
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm verify:ui --target site/luksuzni-prevoz/src/components/services/prom-transportation/PromTransportationPage.astro --surface prom-transportation --change page
pnpm quality:fast
pnpm test:a11y
pnpm --filter @luksuzni-prevoz/site exec playwright test tests/smoke/prom-transportation.spec.ts
pnpm format:check
```

Any failed gate blocks completion.

## 23. Completion report

Report exact files changed, shared Occasion components reused/changed, Prom-local components, installed content/UI files, images, tests, commands and unresolved issues.

Do not claim completion until responsive browser review passes.
