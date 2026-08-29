# Conference and Congress Transportation — implementation compliance matrix

Status: implementation baseline, 2026-08-29

This matrix binds the locked blueprint and implementation contract to production ownership and verification evidence. The blueprint remains the page-specific authority; this file is an execution record, not a second design source.

The status column records the pre-edit baseline. All listed implementation requirements were completed and verified in the result record below.

| Priority | Locked requirement | Production owner | Planned verification | Status |
| --- | --- | --- | --- | --- |
| P0 | Route/content guard: matching route key, `service` page type, complete hero/vehicle/FAQ/final CTA data | `ConferenceCongressTransportationPage.astro` | Astro check/build plus negative unit/source assertions where applicable | Planned |
| P0 | Exactly four required sections with complete localized copy and item counts `5 / 6 / 2 / 3`; FAQ count `9` | page renderer guard | content validation, Astro build | Planned |
| P0 | Canonical service capabilities and vehicle-role relationships come from `services.ts` | page renderer + `getService()` | unit test and build-time assertions | Planned |
| P0 | Booking/quote/fleet CTA roles resolve through canonical CTA/routing helpers | page renderer | route/content validation and Astro build | Planned |
| P0 | Visible order is Hero → Overview → Audience → Event Journey → Passenger Movement → Multi-Vehicle Schedule → Vehicles → Standards → FAQ → Final CTA | page renderer | blueprint review and rendered-page inspection | Planned |
| P0 | Hero is full-bleed, uses the locked night hotel image, business trust markers, no support text, and `overHero=true` | shared `ServiceHero` caller | UI verification and visual review | Planned |
| P0 | Overview is the four-fact numbered divider treatment | shared `ServiceOverview` caller | UI verification and visual review | Planned |
| P0 | Audience follows the verified Corporate business-family rail: 1 column mobile, 2 at `md`, 3 at `xl`, 5 at `2xl`; fifth item spans only the two-column final row | direct page composition | responsive review at 320/768/1024/1440/1920 and threshold edges | Planned |
| P0 | Event Journey reuses the extracted six-stage business movement sequence and retains authored final-transfer semantics | `BusinessMovementSequence.astro` | shared component verification plus Conference/Delegation consumer checks | Planned |
| P0 | Passenger Movement is page-local, light, executive then group in DOM order, one column below `md`, balanced 6/6 from `md`; vehicle relationships supplied by canonical data | `ConferencePassengerMovement.astro` | component/page check, responsive and keyboard-order review | Planned |
| P0 | Multi-Vehicle Schedule is page-local, elevated, copy/model 5/7 from `lg`, three ordered roles feeding one schedule, static connectors and no live-state implication | `ConferenceMultiVehicleSchedule.astro` | component/page check and responsive review | Planned |
| P0 | Vehicle recommendations use the locked four canonical IDs/order, canonical media/capacity, fleet route CTA, and localized suitability labels | shared `VehicleRecommendations` caller | build-time assertions, route validation, rendered-page review | Planned |
| P0 | Standards use the canonical 4×3 builder and numbered-matrix shared variant | shared `ServiceStandards` caller | build-time assertions and rendered-page review | Planned |
| P0 | One interpolated FAQ array feeds both visible FAQ and FAQ schema | page renderer + shared `FAQ` | SEO validation and rendered structured-data check | Planned |
| P0 | Final CTA uses the locked V-Class image, booking/quote hierarchy and verified contact channels | shared `FinalCTA` caller | UI verification and visual review | Planned |
| P0 | Page remains `in-review`, `noindex`, and route availability remains `scaffold`; implementation does not publish it | content/routes | route, content and SEO validation | Planned |
| P1 | Semantic H1/H2/H3 hierarchy; heading/body roles remain Inter Tight/Manrope; decorative media has empty alt | page and shared components | Astro check, accessibility review, computed-style browser review | Planned |
| P1 | Logical CSS, 44×44 interactive targets, visible focus, reduced-motion preservation and no accidental horizontal overflow | page-local components and shared contracts | UI verification and responsive browser review | Planned |
| P1 | Hero is the only eager/LCP image; below-fold imported images are lazy with responsive Astro image delivery | shared/page-local image components | built-output inspection and browser review | Planned |
| P1 | No client island or new dependency | page implementation | source review and Astro build | Planned |

## Confirmed family-pattern decision

Corporate Transportation is the matching business-page precedent for the five-item audience region. Its production topology is `1 → 2 → 3 → 5` columns at the `base → md → xl → 2xl` thresholds, with the fifth item spanning the remaining two-column row only at `md`. Delegation Transportation uses a different image/content split and therefore is not the Conference audience contract.

## Required completion evidence

- design context for the exact Conference page target and Conference surface;
- shared component registry synchronization and component-profile verification for `BusinessMovementSequence`;
- Conference page `verify:ui` page profile;
- content, routes, SEO, type generation, lint, unit tests, Astro check and site build;
- responsive browser inspection at 320, 768, 1024, 1440 and 1920 CSS px, plus both sides of applicable topology thresholds, including long Russian content;
- manual accessibility, typography, image and structured-data review.

## Implementation result — 2026-08-29

- `BusinessMovementSequence` was extracted with a caller-owned heading ID; the Delegation consumer was migrated without changing its structure or responsive behavior. The component profile passed 13 gates.
- The Conference renderer, page-local passenger comparison and page-local multi-vehicle schedule were implemented in the locked order and wired into `ContentPageRenderer`.
- Vehicle-role relationships are read from the typed Conference contract in `services.ts`; fleet identity and capacity remain owned by `fleet.ts`.
- The page profile passed 19 ordered governance, foundation, theme, content, routing, SEO, traceability, type, lint, unit-test and build gates.
- Browser review passed for Serbian, English and Russian. Russian was checked at 320, 768, 1024, 1440 and 1920 CSS px and on both sides of the `md` and `lg` topology thresholds. No accidental page overflow or sub-44px visible interactive target remained.
- Automated Axe review reported zero WCAG 2.2/best-practice violations at 320 and 1440 CSS px. Computed typography resolved to Inter Tight for H1/H2 and Manrope for body/UI copy.
- The hero is the only eager, high-priority image; all eight below-fold images are lazy. Decorative page imagery uses empty alt text.
- One interpolated FAQ array feeds both visible FAQ rows and `buildFaqPage()`. While the page remains `noindex`, the canonical SEO helper intentionally suppresses JSON-LD output; it will emit when the page is explicitly published and made indexable.
- Publication was not performed: content remains `in-review` and `noindex`, route availability remains `scaffold`, and the production build correctly omits the route.
