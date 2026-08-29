# Prom Transportation — Acceptance V2

**Status:** IMPLEMENTED — ACCEPTANCE RECONCILED 2026-08-29  
**Target:** `promTransportation`

Every applicable item MUST pass.

## A. Structure

- [x] Header → Hero → Definition → Planning Scope → Arrival Story → Fleet → Group Arrival → Presentation → Standards → Process → FAQ → Final CTA → Footer.
- [x] No locked region is removed, merged or reordered.
- [x] Hero is full-bleed.
- [x] FAQ is the only large light reading region.
- [x] FinalCTA remains medium-height.

## B. Content

- [x] SR/EN/RU are full `pageType: service` entries.
- [x] No Prom locale remains scaffold.
- [x] Structural locale parity passes.
- [x] EN/RU use `sourceLocale: sr` and regenerated digests.
- [x] All three entries are `published`, reviewed and `noindex: false`.
- [x] The route map publishes `promTransportation`.
- [x] Astro components contain no localized production copy.
- [x] No hardcoded price/contact/vehicle facts exist.

## C. Shared architecture

- [x] Wedding-proven Occasion components are reused.
- [x] No duplicate Prom copies of Occasion components exist.
- [x] Shared Occasion components contain no Wedding/Prom branching.
- [x] Any shared API change has been reviewed against Wedding.
- [x] PromArrivalStory, PromGroupArrival and PromPresentation remain page-local.
- [x] No monolithic Wedding/Prom page component exists.

## D. Hero

- [x] Shared ServiceHero full-bleed variant renders first.
- [x] BaseLayout uses `overHero={true}`.
- [x] One H1 comes from localized content.
- [x] Hero uses `prom-holding-flowers-mercedes-bg.webp`.
- [x] Crop preserves formal-event and Mercedes context.
- [x] Dark scrim maintains contrast.
- [x] Photograph colors do not create new UI accent colors.
- [x] Primary CTA uses Prom booking/request flow.
- [x] Secondary CTA uses quote flow.
- [x] Exactly three trust markers render from `content/ui`.
- [x] Hero image is not reused as another major image.

## E. Definition

- [x] `overview.heading`, `overview.body` and exactly three items render.
- [x] Shared `OccasionServiceDefinition` is reused.
- [x] Visitor understands vehicle + chauffeur, individual/group support and agreed pickup/return.
- [x] No feature-card grid is used.

## F. Planning Scope

- [x] Source is `sections[key=serviceScope]`.
- [x] Exactly three authored items render.
- [x] Shared `OccasionScope` is reused.
- [x] Individual/group, multi-vehicle, return and waiting wording is capability-gated.
- [x] Exactly six active capability labels render in canonical order, including individual quote.
- [x] Presentation request does not duplicate itself in Planning Scope.
- [x] Section is not an embedded form/configurator.

## G. Arrival Story

- [x] Source is `sections[key=arrivalStory]`.
- [x] Exactly four stages render.
- [x] Asset is `prom-closeup-mercedes-background.webp`.
- [x] Astro asset pipeline is used.
- [x] Stages are semantic text and precede media on mobile.
- [x] No celebrity/red-carpet/priority-access claim appears.
- [x] Return is described only when arranged.

## H. Fleet

- [x] Exactly four locked vehicle IDs are requested.
- [x] Canonical Fleet facts/media are reused.
- [x] Prom role labels come from `content/ui`.
- [x] No capacities/prices/features are duplicated.
- [x] Fleet CTA uses canonical routing.

## I. Individual / Group Arrival

- [x] Source is `sections[key=groupArrival]`.
- [x] Exactly three groups render.
- [x] `individualAndGroup` is required.
- [x] Multi-vehicle/mixed-class wording is gated.
- [x] Asset is `v-class-interior.webp`.
- [x] Section focuses on passenger arrangement, not specs.
- [x] Mobile content precedes media.

## J. Presentation

- [x] Source is `sections[key=presentation]`.
- [x] Section gates on `customPresentationRequest`.
- [x] Asset is `flowers-on-console.webp`.
- [x] Copy says requests are reviewed individually.
- [x] Copy says decorative styling is not automatically included.
- [x] No flowers/champagne/red-carpet/gift package is invented.
- [x] CTA uses booking flow.

## K. Standards

- [x] Shared `OccasionStandards` is reused.
- [x] Professional chauffeur and prepared vehicle are operational-data-gated.
- [x] Individual/group and multi-vehicle standards are Prom-capability-gated.
- [x] Waiting/return is capability-gated.
- [x] Manual confirmation uses canonical model.
- [x] No party/nightlife amenity list is introduced.

## L. Process

- [x] Source is `sections[key=process]`.
- [x] Exactly three steps render.
- [x] Shared `OccasionProcessSteps` is reused.
- [x] One light strip; stacked at 320/768, three columns at 1024+.
- [x] No instant-confirmation wording.

## M. FAQ

- [x] Exactly six localized questions.
- [x] FAQ is the only large light reading region.
- [x] Capability-sensitive answers remain accurate.
- [x] Waiting/return does not imply automatic inclusion.
- [x] Presentation avoids included-decoration claims.
- [x] Manual confirmation is explicit.
- [x] No unsupported age/guardian/school/alcohol claim exists.
- [x] Keyboard behavior passes.

## N. Final CTA

- [x] Existing FinalCTA is reused.
- [x] Primary uses Prom booking/request flow.
- [x] Secondary uses quote flow.
- [x] Verified phone/email come from canonical contact data.
- [x] Hero image is not reused.
- [x] FinalCTA does not reach Hero scale.

## O. Theme

- [x] Inter Tight for H1/H2 and Manrope for body/UI.
- [x] Semantic Theme V2 tokens only.
- [x] No magenta/red UI accent derived from imagery.
- [x] No neon/glow/party treatment or script event typography.
- [x] No raw page-local theme values.

## P. Imagery

- [x] Hero: `prom-holding-flowers-mercedes-bg.webp`.
- [x] Arrival: `prom-closeup-mercedes-background.webp`.
- [x] Group: `v-class-interior.webp`.
- [x] Presentation: `flowers-on-console.webp`.
- [x] No Wedding contextual image is substituted.
- [x] All use Astro assets; major regions do not reuse one photograph.
- [x] Focal subjects survive governed crops.
- [x] Below-fold images lazy-load.

## Q. Responsive / accessibility

- [x] 320×568, 768×1024, 1024×768, 1440×900 and 1920×1080 all pass topology, crop, CTA, focus, targets and overflow.
- [x] Below `md`, standards are one column; from `md` to below `lg`, they are two columns; at `lg+`, they are 3×2.
- [x] Process is stacked below `lg` and three equal columns at `lg+`.
- [x] At `lg+`, Arrival and Group are content 7/media 5; Presentation is media 5/content 7.
- [x] Editorial mobile order remains content-first.
- [x] Wide desktop respects containers.
- [x] Exactly one H1 and logical heading order.
- [x] 44×44 targets, keyboard use, visible focus, correct alt behavior, reduced motion and logical CSS properties pass.

## R. SEO

- [x] Unique localized title/description.
- [x] Published preview is indexable in SR/EN/RU.
- [x] Canonical/hreflang generated through existing architecture.
- [x] Service/Breadcrumb schema follows repository convention.
- [x] No fake price/review/rating.
- [x] No Event schema implying the company organizes the prom.

## S. Verification

- [x] content digests/types/content/routes/theme/component checks
- [x] lint/check/quality/build
- [x] `verify:ui --target site/luksuzni-prevoz/src/components/services/prom-transportation/PromTransportationPage.astro --surface prom-transportation --change page`
- [ ] accessibility and E2E — Chromium/Firefox pass; WebKit is blocked by missing host libraries.
- [ ] format check — the workspace does not currently provide the Astro Prettier parser.

All page-level product, design, routing, content and available-engine criteria
pass. The two unchecked items are environment/tooling blockers rather than
known Prom page defects.
