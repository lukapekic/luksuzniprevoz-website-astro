# VIP Transportation — Acceptance V1

**Status:** IMPLEMENTATION PENDING  
**Target:** `vipTransportation`  
**Prepared:** 2026-08-30

Every applicable item MUST pass. Keep every item unchecked until there is concrete implementation/test evidence.

## A. Structure

- [ ] Header → Hero → Definition → Scope → Discretion → Aviation → Fleet → Itinerary → Standards → Process → FAQ → Final CTA → Footer.
- [ ] No locked region is removed, merged or reordered.
- [ ] Hero is full-bleed.
- [ ] FAQ is the only large light reading region.
- [ ] FinalCTA remains subordinate to Hero scale.

## B. Content and publication

- [ ] SR/EN/RU are complete `pageType: service` entries.
- [ ] No VIP locale remains scaffold.
- [ ] Structural locale parity passes.
- [ ] EN/RU use `sourceLocale: sr` and repository-generated current digests.
- [ ] All three entries are `published`, reviewed and `noindex: false` only after actual editorial installation/review.
- [ ] `vipTransportation` route availability is `published` only after all locale content validates.
- [ ] Astro components contain no localized production copy.
- [ ] No hardcoded price/contact/vehicle facts exist.
- [ ] No raw localized internal URLs are authored.

## C. Canonical VIP contract

- [ ] Pricing remains quote-only.
- [ ] `discretion === true` gates discretion claims.
- [ ] `privacy === true` gates privacy claims.
- [ ] `commercialAviation === true` gates commercial aviation claims.
- [ ] `privateAviation === true` gates private aviation claims.
- [ ] `multiVehicle === true` gates multi-vehicle claims.
- [ ] `dedicatedCoordinatorForComplexBookings === true` gates dedicated-coordination claims.
- [ ] `customDecorationPositioning === false` is not contradicted by UI/copy.
- [ ] No security or close-protection service is implied.

## D. Shared architecture

- [ ] `OccasionScope`, `OccasionStandards` and `OccasionProcessSteps` are reused.
- [ ] `ServiceHero`, `VehicleRecommendations`, `FAQ` and `FinalCTA` are reused.
- [ ] No duplicate VIP copies of shared Occasion components exist.
- [ ] Shared components contain no VIP-specific branching.
- [ ] Any shared API change has consumer-impact verification against Wedding and Prom.
- [ ] `VipServiceDefinition`, `VipDiscretion`, `VipAviation` and `VipItinerary` remain page-local.
- [ ] No monolithic multi-service component is introduced.

## E. Hero

- [ ] Shared ServiceHero full-bleed variant renders first.
- [ ] BaseLayout uses `overHero={true}`.
- [ ] Exactly one H1 renders from localized Hero content.
- [ ] Hero uses `hero-chauffeur-wheel.webp`.
- [ ] Crop preserves chauffeur/passenger context and usable copy space.
- [ ] Approved dark scrim maintains WCAG contrast.
- [ ] Image colors do not create new UI accent colors.
- [ ] Primary CTA uses VIP booking/request flow.
- [ ] Secondary CTA uses quote flow.
- [ ] Exactly three trust markers render from `content/ui`.
- [ ] Hero image is not reused as another major image.

## F. Service Definition

- [ ] Source is `overview`.
- [ ] Heading, intro, body and exactly three principles render.
- [ ] `VipServiceDefinition` uses open/divider-led composition, not detached feature cards.
- [ ] Asset is `passenger-experience-alternate.webp`.
- [ ] Copy explains service organisation rather than vehicle equipment.
- [ ] No laptop/onboard-office/seat-feature promise is inferred from imagery.
- [ ] Mobile content precedes media.

## G. Service Scope

- [ ] Source is `sections[key=serviceScope]`.
- [ ] Exactly three authored items render.
- [ ] Shared `OccasionScope` is reused.
- [ ] Exactly five active capability labels render in the locked order.
- [ ] Individual quote label is gated by quote pricing.
- [ ] Commercial/private aviation labels are independently gated.
- [ ] Multi-vehicle and dedicated-coordinator labels are independently gated.
- [ ] Capability labels wrap without narrow-screen horizontal overflow.
- [ ] Section is not a configurator or pricing tool.

## H. Discretion & Privacy

- [ ] Source is `sections[key=discretion]`.
- [ ] Exactly three principles render.
- [ ] Asset is `schedule-backseat-view.webp`.
- [ ] Content-first DOM order is preserved.
- [ ] The section communicates low-profile professional service without absolute confidentiality guarantees.
- [ ] No NDA, encryption, anonymity, data-deletion, security-screening or background-check promise is invented.
- [ ] No large overlay obscures the road/passenger image focal area.
- [ ] Image is delivered through the approved Astro asset pipeline.

## I. Arrivals & Aviation

- [ ] Source is `sections[key=aviation]`.
- [ ] Exactly three authored items render.
- [ ] `commercialAviation` and `privateAviation` are required by the assembler.
- [ ] Primary asset is `mercedes-sprint-next-to-private-jet.webp`.
- [ ] Supporting asset is `private-jet-parked-outside-of-hangar.webp`.
- [ ] Supporting image remains visually subordinate.
- [ ] Section CTA resolves through booking flow.
- [ ] No tarmac/airside/FBO/aircraft-side access is promised without canonical support.
- [ ] Page remains clearly a ground-transport service, not private-jet charter.

## J. Fleet

- [ ] Exactly four locked vehicle IDs are requested in the locked order.
- [ ] Canonical Fleet facts and media are reused.
- [ ] VIP role labels come from `content/ui`.
- [ ] No capacities, luggage values, prices, features or availability are duplicated in page content.
- [ ] Fleet CTA uses canonical routing.
- [ ] `s-class-move-highway(1).webp` is not used to imply Maybach availability.

## K. Complex Itinerary & Coordination

- [ ] Source is `sections[key=itinerary]`.
- [ ] Exactly five stages render.
- [ ] `multiVehicle` gates multi-vehicle stage language.
- [ ] `dedicatedCoordinatorForComplexBookings` gates coordinator language.
- [ ] Changes remain subject to confirmed engagement/resources/availability.
- [ ] Itinerary is semantic static explanation, not a fake live tracker/map/form.
- [ ] Mobile sequence is vertical and content order is logical.
- [ ] Desktop sequence survives long Russian copy without overlap or clipping.

## L. Standards

- [ ] Shared `OccasionStandards` is reused.
- [ ] Exactly six rows render.
- [ ] Professional chauffeur row is operational-data-gated.
- [ ] Prepared vehicle row is operational-data-gated.
- [ ] Discretion/privacy row is VIP-capability-gated.
- [ ] Dedicated coordination row is VIP-capability-gated.
- [ ] Multi-vehicle row is VIP-capability-gated.
- [ ] Manual confirmation row uses canonical contact/booking model.
- [ ] No generic luxury amenity/icon grid is introduced.

## M. Process

- [ ] Source is `sections[key=process]`.
- [ ] Exactly three steps render.
- [ ] Shared `OccasionProcessSteps` is reused.
- [ ] Process is one light inner strip on dark.
- [ ] Process stacks below `lg` and uses three equal columns at `lg+`.
- [ ] Manual confirmation is explicit; no instant-confirmation wording exists.

## N. FAQ

- [ ] Exactly eight localized questions render.
- [ ] FAQ is the only large light reading region.
- [ ] Visible FAQ and FAQ JSON-LD use the same validated array.
- [ ] One answer explicitly excludes security/close protection.
- [ ] Aviation answers avoid airside/tarmac guarantees.
- [ ] Quote pricing is explicit.
- [ ] Manual confirmation is explicit.
- [ ] Keyboard interaction passes.

## O. Final CTA

- [ ] Existing FinalCTA is reused.
- [ ] Primary CTA uses VIP booking/request flow.
- [ ] Secondary CTA uses quote flow.
- [ ] Verified phone/email come from canonical contact data.
- [ ] Approved FinalCTA media is used; Hero image is not reused.
- [ ] FinalCTA does not reach Hero scale.

## P. Theme and visual language

- [ ] Inter Tight renders heading roles and Manrope renders body/UI roles through active theme.
- [ ] Semantic active-theme tokens only.
- [ ] No gold-first or aviation-blue theme is introduced.
- [ ] No neon/glow/red-carpet/celebrity/security styling exists.
- [ ] No raw page-local literal colors/spacing/radii replace semantic tokens.
- [ ] Photography color remains editorial and does not become interface color.

## Q. Imagery

- [ ] Hero → `hero-chauffeur-wheel.webp`.
- [ ] Definition → `passenger-experience-alternate.webp`.
- [ ] Discretion → `schedule-backseat-view.webp`.
- [ ] Aviation primary → `mercedes-sprint-next-to-private-jet.webp`.
- [ ] Aviation supporting → `private-jet-parked-outside-of-hangar.webp`.
- [ ] Canonical Fleet media remains responsible for vehicle recommendations.
- [ ] Shared FinalCTA media remains responsible for final CTA.
- [ ] All contextual images use the approved Astro asset pipeline.
- [ ] Hero follows existing eager/LCP strategy; below-fold media follows lazy-loading contract.
- [ ] Focal subjects survive every governed crop.

## R. Responsive / accessibility

- [ ] 320×568 passes topology, crop, CTA, focus, targets and overflow.
- [ ] 768×1024 passes topology, crop, CTA, focus, targets and overflow.
- [ ] 1024×768 passes topology, crop, CTA, focus, targets and overflow.
- [ ] 1440×900 passes topology, crop, CTA, focus, targets and overflow.
- [ ] 1920×1080 passes topology, crop, CTA, focus, targets and overflow.
- [ ] 200% text zoom causes no clipping/loss of content.
- [ ] Long Russian content causes no overlap or horizontal scroll.
- [ ] Standards: 1 column below `md`, 2 columns `md..<lg`, 3×2 at `lg+`.
- [ ] Process: stacked below `lg`, 3 equal columns at `lg+`.
- [ ] Editorial mobile order remains content-first.
- [ ] Wide desktop respects container caps.
- [ ] Exactly one H1 and logical heading order.
- [ ] 44×44 targets, keyboard use, visible focus, reduced motion and logical CSS properties pass.

## S. SEO / routing

- [ ] Unique localized title/description for SR/EN/RU.
- [ ] Route remains scaffold until all three service entries validate.
- [ ] Published route becomes indexable in all three locales.
- [ ] Canonical/hreflang/sitemap/robots behavior is generated through existing architecture.
- [ ] Existing service/Breadcrumb/FAQ schema conventions are followed.
- [ ] No fake price, rating or review structured data.
- [ ] No Event/Flight/Airline/Security schema misrepresents the service.

## T. Verification

- [ ] `pnpm content:sync-digests`
- [ ] `pnpm types:generate`
- [ ] `pnpm types:generate:check`
- [ ] `pnpm content:validate site/luksuzni-prevoz`
- [ ] `pnpm routes:validate site/luksuzni-prevoz`
- [ ] `pnpm seo:validate site/luksuzni-prevoz`
- [ ] `pnpm theme:sync:check`
- [ ] `pnpm theme:validate site/luksuzni-prevoz`
- [ ] `pnpm components:check`
- [ ] `pnpm lint`
- [ ] `pnpm --filter @luksuzni-prevoz/site check`
- [ ] `pnpm --filter @luksuzni-prevoz/site build`
- [ ] `pnpm verify:ui --target site/luksuzni-prevoz/src/components/services/vip-transportation/VipTransportationPage.astro --surface vip-transportation --change page`
- [ ] `pnpm quality:fast`
- [ ] `pnpm test:a11y`
- [ ] `pnpm --filter @luksuzni-prevoz/site exec playwright test tests/smoke/vip-transportation.spec.ts`
- [ ] `pnpm format:check`

Completion is prohibited while an applicable page-level criterion remains unchecked because of a known implementation defect. Environment/tooling blockers must remain explicitly unchecked and documented.
