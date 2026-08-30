# VIP Transportation — Implementation V1

**Status:** IMPLEMENTED — VERIFIED
**Target:** `vipTransportation`  
**Prepared:** 2026-08-30

Every step below is mandatory. The coding agent MUST use current repository contracts as the implementation baseline and MUST stop on contradictions rather than invent production behavior.

## 0. Ordered execution plan

1. **Preflight** — load root authorities, VIP blueprint/wireframe, active theme, current Wedding/Prom implementations and applicable skills.
2. **Governance** — register the VIP surface, refresh a stale design snapshot only when preflight requires it, and run planned-target context before creating production UI.
3. **Stage localized content/UI** — keep all three complete VIP entries `in-review` and `noindex: true`; merge UI keys and validate without exposing an unfinished page.
4. **Assembler and dispatch** — create `VipTransportationPage.astro`, add explicit renderer dispatch and strict content/capability guards.
5. **VIP-local editorial components** — implement Service Definition, Discretion, Aviation and Itinerary without forking shared Occasion contracts.
6. **Shared integrations** — reuse Scope, Fleet, Standards, Process, FAQ and FinalCTA through their complete current APIs.
7. **Responsive/image hardening** — verify all five governed viewports, long Russian copy, crop, loading, focus, target size and overflow.
8. **Automated acceptance** — add VIP smoke coverage and run the repository verification stack while content remains non-indexable.
9. **Atomic publication** — only after renderer dispatch and page gates pass, set content `published`/`noindex: false` and route availability `published`, then rerun route/content/SEO/build verification.
10. **Handoff** — reconcile `acceptance.md`; completion requires all applicable checks to pass.

Expected production file map:

```text
src/components/services/vip-transportation/
├── VipTransportationPage.astro
├── VipServiceDefinition.astro
├── VipDiscretion.astro
├── VipAviation.astro
└── VipItinerary.astro

src/components/site/ContentPageRenderer.astro
src/content/pages/vip-transportation/
├── vip-transportation.sr.md
├── vip-transportation.en.md
└── vip-transportation.ru.md

src/content/ui/{sr,en,ru}.json
src/data/routes.ts
.design/config.json
tests/smoke/vip-transportation.spec.ts
```

No page schema change is required.

## 1. Preflight

Read:

```text
AGENTS.md
DESIGN.md
site/luksuzni-prevoz/foundation.config.ts
site/luksuzni-prevoz/src/docs/services/vip-transportation/*
site/luksuzni-prevoz/src/docs/services/wedding-transportation/*
site/luksuzni-prevoz/src/docs/services/prom-transportation/*
site/luksuzni-prevoz/src/data/services.ts
site/luksuzni-prevoz/src/data/routes.ts
site/luksuzni-prevoz/src/data/operations.ts
site/luksuzni-prevoz/src/data/contact.ts
site/luksuzni-prevoz/src/content/schemas/pages.ts
site/luksuzni-prevoz/src/content/schemas/shared.ts
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/imagery-art-direction.md
.skills/responsive-images-performance.md
.skills/multilingual-routing.md
.skills/design-review.md
.skills/technical-page-review.md
```

Run:

```bash
git status
pnpm design:sync:check
pnpm design:context --planned --target site/luksuzni-prevoz/src/components/services/vip-transportation/VipTransportationPage.astro --surface vip-transportation
pnpm components:check
```

The `vip-transportation` design surface MUST exist in `.design/config.json` before UI implementation begins.

Wedding and Prom are architectural references for shared Occasion contracts. They are not templates to copy wholesale.

## 2. Verify locked assets

Resolve these exact files before code:

```text
src/assets/pages/vip-transportation/hero.png
src/assets/shared/other/passenger-experience-alternate.webp
src/assets/shared/other/s-class-hotel-front-winter.webp
src/assets/shared/other/mercedes-sprint-next-to-private-jet.webp
src/assets/shared/other/private-jet-parked-outside-of-hangar.webp
src/assets/final-cta-bg.webp
```

If any locked asset is missing, STOP. Do not substitute unrelated Wedding/Prom imagery or an unverified vehicle.

## 3. Install content pack

Replace:

```text
src/content/pages/vip-transportation/vip-transportation.sr.md
src/content/pages/vip-transportation/vip-transportation.en.md
src/content/pages/vip-transportation/vip-transportation.ru.md
```

with the files from `redesign-content-pack/`.

Merge UI additions into:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Strict merge rule:

```text
missing key → add
existing identical key → keep
existing different key → STOP and reconcile
```

Do not manually author `sourceDigest`.

After installation run:

```bash
pnpm content:sync-digests
pnpm types:generate
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
```

Keep the staged entries `status: in-review` and `noindex: true`. Route publication is the final atomic step after the renderer, smoke test, site check/build and UI verification pass. The generic `LeafPage` MUST never be used as an interim VIP renderer.

## 4. Renderer dispatch

Create:

```text
src/components/services/vip-transportation/VipTransportationPage.astro
```

Update `src/components/site/ContentPageRenderer.astro`:

```text
import VipTransportationPage
routeKey === "vipTransportation" → VipTransportationPage
```

Do not modify route generation, locale prefix logic, canonical URL logic or hreflang logic.

## 5. Page assembler invariants

`VipTransportationPage.astro` MUST reject incompatible content at build time/runtime:

```text
routeKey === "vipTransportation"
content.data.pageType === "service"
content.data.routeKey === "vipTransportation"
hero exists
vehicleRecommendations exists
faq exists
```

Require exact authored cardinalities:

```text
overview.items        → exactly 3
serviceScope.items    → exactly 3
discretion.items      → exactly 3
aviation.items        → exactly 3
itinerary.items       → exactly 5
process.items         → exactly 3
faq.items             → exactly 8
```

Require section keys:

```text
serviceScope
discretion
aviation
itinerary
standards
process
```

Require `aviation.cta`.

## 6. Canonical VIP capability guard

Read:

```ts
const vip = getService("vipTransportation");
```

Fail loud unless the current contract includes:

```text
pricingMode includes "quote"
discretion === true
privacy === true
commercialAviation === true
privateAviation === true
multiVehicle === true
dedicatedCoordinatorForComplexBookings === true
customDecorationPositioning === false
securityService === false
```

Do not infer unsupported capabilities from copy or imagery.

## 7. Hero

Use:

```text
ServiceHero variant="full-bleed"
BaseLayout overHero={true}
```

Import:

```ts
import heroImage from "../../../assets/pages/vip-transportation/hero.png";
```

Resolve localized eyebrow, Hero title/description, booking CTA, quote CTA and exactly three UI trust markers:

```text
vip.hero.trust.discretion
vip.hero.trust.privateItinerary
vip.hero.trust.coordinatedService
```

Hero image is decorative. Use current shared ServiceHero scrim/crop behavior first. Do not patch shared internals from page CSS.

## 8. VIP Service Definition

Create `VipServiceDefinition.astro`.

Source: `data.overview`.

Require exactly three overview strings. Import:

```ts
import passengerImage from "../../../assets/shared/other/passenger-experience-alternate.webp";
```

Composition requirements:

- open, divider-led dark section;
- section label + heading + intro + body;
- exactly three numbered/divided principles;
- passenger image as editorial media;
- content-first DOM order;
- no feature-card grid;
- no vehicle-spec copy.

Use reviewed primitives such as `Section`, `PageContainer`, `SectionHeading` or `OpenSplitSection` only where their current contracts fit.

## 9. Service Scope capability adapter

Build labels in this exact order:

```text
pricingMode includes "quote"
→ occasion.capability.individualQuote

commercialAviation
→ vip.capability.commercialAviation

privateAviation
→ vip.capability.privateAviation

multiVehicle
→ vip.capability.multiVehicle

dedicatedCoordinatorForComplexBookings
→ vip.capability.dedicatedCoordinator
```

Exactly five labels render for current canonical data. No inactive label renders.

Render `sections[key=serviceScope]` through shared `OccasionScope` with exactly three authored items.

## 10. Discretion & Privacy

Create `VipDiscretion.astro`.

Source: `sections[key=discretion]`.

Import:

```ts
import discretionImage from "../../../assets/shared/other/s-class-hotel-front-winter.webp";
```

Require exactly three principles. Render a cinematic dark editorial split with content-first DOM order.

The section MUST NOT create absolute privacy claims. The photograph is decorative.

No interactive behavior belongs in this section.

## 11. Arrivals & Aviation

Create `VipAviation.astro`.

Source: `sections[key=aviation]`.

Require:

```text
vip.commercialAviation === true
vip.privateAviation === true
aviation.items.length === 3
aviation.cta exists
```

Import:

```ts
import aviationPrimaryImage from "../../../assets/shared/other/mercedes-sprint-next-to-private-jet.webp";
import aviationSupportingImage from "../../../assets/shared/other/private-jet-parked-outside-of-hangar.webp";
```

Resolve the CTA through the booking flow helper.

Render one primary media region and one visually subordinate supporting image. Do not create a flight-search widget or fake aviation status UI.

Visible copy and component labels MUST NOT claim tarmac/airside access, FBO access or aircraft-side pickup as a guaranteed standard service.

## 12. Fleet by VIP role

Reuse `VehicleRecommendations`.

Require exact IDs/order:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Fail if content differs.

Build recommendation objects from canonical Fleet data and canonical Fleet media. Use role keys:

```text
vip.vehicleRole.mercedesSClass
vip.vehicleRole.mercedesEClass
vip.vehicleRole.mercedesVClassExtraLong
vip.vehicleRole.mercedesSprinter
```

Use a unique `carouselId="vip-vehicles"`.

Pass the complete current adapter contract:

```text
cta target asserted as route:fleet
locale
fleet.passengers
all fleet class labels
fleet carousel aria/previous/next labels
vip.section.vehicles
carouselId="vip-vehicles"
```

Do not use the uploaded Maybach-looking highway photograph in this section.

## 13. Complex Itinerary & Coordination

Create `VipItinerary.astro`.

Source: `sections[key=itinerary]`.

Require exactly five stages and canonical gates:

```text
vip.multiVehicle === true
vip.dedicatedCoordinatorForComplexBookings === true
```

Render semantic ordered content. Below `lg` it is one vertical sequence. At `lg` and above it is a deterministic theme-approved `4/4/4` first row followed by `6/6`; DOM order remains linear in every state.

This is static explanation, not an interactive timeline, live map or booking control.

## 14. Standards adapter

Source: `sections[key=standards]`.

Build exactly six rows in this order:

```text
1 professional chauffeur
  gate: operations.chauffeurs.dressCode === "suit-and-tie"
  keys: occasion.standard.professionalChauffeur.title/text

2 prepared vehicle
  gate: operations.vehicles.cleanlinessStandard === "highest-standard"
        AND operations.vehicles.preTripInspectionForImportantTrips === true
  keys: occasion.standard.preparedVehicle.title/text

3 discretion and privacy
  gate: vip.discretion === true AND vip.privacy === true
  keys: vip.standard.discretion.title/text

4 dedicated coordination
  gate: vip.dedicatedCoordinatorForComplexBookings === true
  keys: vip.standard.coordination.title/text

5 multi-vehicle coordination
  gate: vip.multiVehicle === true
  keys: occasion.standard.multiVehicle.title/text

6 manual confirmation
  gate: contact.bookingLeadTime.confirmationMode === "manual"
  keys: occasion.standard.manualConfirmation.title/text
```

Fail unless all six canonical gates are active for the current service contract.

Reuse `OccasionStandards`.

## 15. Process

Source: `sections[key=process]`.

Require exactly three items and reuse `OccasionProcessSteps`.

Preserve the existing shared light-strip geometry. The third step must describe manual confirmation, not instant booking.

## 16. FAQ and structured data

Require exactly eight FAQ items.

Reuse existing `FAQ` visible component and pass the same validated array to `buildFaqPage`.

Compose FAQ inside the current light `Section` + `ReadingContainer` + `SectionHeading` contract; `FAQ` owns rows only.

Add no duplicate FAQ copy in component code.

The explicit security question MUST state that VIP Transportation is a chauffeur/transport coordination service and does not include security or close protection.

## 17. Final CTA

Reuse shared `FinalCTA` with the approved shared final-CTA image.

Pass verified canonical contacts, locale, `imageFit="cover"` and `mediaTreatment="integrated"` through the current shared API.

Resolve:

- primary booking flow;
- secondary quote flow;
- verified canonical phone/email through `contact` + `isVerified`.

Do not reuse the Hero image.

## 18. Image delivery

All contextual VIP assets use `astro:assets` imports.

- Hero follows existing LCP/eager strategy.
- Below-fold editorial images lazy-load according to existing component behavior.
- No raw `<img>` where repository rules require the Astro asset pipeline.
- No one photograph is reused across multiple major VIP sections.

Crop review is required at all five governed viewports.

## 19. Responsive topology

Verify:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

Deterministic topology:

```text
below md
→ standards 1 column
→ editorial regions stacked
→ itinerary vertical

md to below lg
→ standards 2 columns
→ editorial regions remain stacked/content-first
→ process stacked

lg and above
→ Definition editorial split
→ Discretion cinematic split
→ Aviation editorial media composition
→ Standards 3×2
→ Process 3 equal columns
→ Itinerary uses a deterministic 3+2 sequence (`4/4/4` then `6/6`)
```

At every viewport verify Hero crop, text measure, CTA visibility, image focal points, Fleet behavior, focus order, 44×44 targets and zero page overflow.

Run 200% text zoom and long Russian content review.

## 20. Design governance

Register/confirm `.design/config.json` surface:

```text
vip-transportation
```

with matches for:

```text
vip-transportation
vipTransportation
vip-prevoz
vip-transfer
```

Blueprint:

```text
site/luksuzni-prevoz/src/docs/services/vip-transportation/blueprint.md
```

Contracts:

```text
site/luksuzni-prevoz/src/docs/services/shared
site/luksuzni-prevoz/src/docs/services/vip-transportation
```

Run the exact page profile after implementation.

## 21. Tests

Create:

```text
site/luksuzni-prevoz/tests/smoke/vip-transportation.spec.ts
```

Cover:

- dedicated VIP renderer dispatch;
- no generic `LeafPage` fallback and one non-empty Hero H1;
- all three locales are complete service entries;
- route/content remain non-indexable until renderer verification, then publish atomically;
- full-bleed Hero and page-specific Hero asset;
- exactly three trust markers;
- exact service-capability contract;
- exact five scope capability labels and order;
- discretion section exact asset/cardinality;
- aviation section two exact assets and canonical gates;
- no airside/tarmac guarantee wording;
- exact four Fleet IDs/order;
- exact five itinerary stages;
- multi-vehicle/coordinator gates;
- exactly six standards rows;
- exactly three process steps;
- exactly eight FAQ items;
- explicit no-security/close-protection answer;
- visible FAQ and FAQ JSON-LD identity;
- manual confirmation;
- canonical/hreflang/robots for SR/EN/RU;
- no raw localized URLs;
- no duplicate shared Occasion components;
- Hero eager/high-priority and below-fold image loading contract;
- governed viewport overflow checks;
- computed Inter Tight/Manrope roles;
- Axe WCAG 2.2 checks and minimum target checks.

Before the final verification stack, publish atomically:

```text
content status: in-review → published
content noindex: true → false
route availability: scaffold → published
```

## 22. Verification

Run from repository root:

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
pnpm verify:ui --target site/luksuzni-prevoz/src/components/services/vip-transportation/VipTransportationPage.astro --surface vip-transportation --change page
pnpm quality:fast
pnpm test:a11y
pnpm --filter @luksuzni-prevoz/site exec playwright test tests/smoke/vip-transportation.spec.ts
pnpm format:check
```

Any repository gate failure blocks completion. Environment/tooling failures MUST be reported explicitly and MUST NOT be converted into a false pass.

## 23. Completion report

Report:

- exact files changed;
- content/UI files installed;
- digest/publication state;
- shared components reused;
- any shared components modified and consumer verification performed;
- VIP-local components created;
- image mapping;
- test file created;
- commands run and results;
- governed viewport review results;
- unresolved blockers.

Do not mark `acceptance.md` complete until implementation, browser review and applicable automated gates have actually passed.
