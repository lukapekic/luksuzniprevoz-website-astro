# VIP Transportation — Acceptance V1

**Status:** IMPLEMENTED — VERIFIED; ENVIRONMENT GAPS DOCUMENTED
**Target:** `vipTransportation`  
**Prepared:** 2026-08-30

Every applicable item MUST pass. Keep every item unchecked until there is concrete implementation/test evidence.

## A. Structure

- [x] Header → Hero → Definition → Scope → Discretion → Aviation → Fleet → Itinerary → Standards → Process → FAQ → Final CTA → Footer.
- [x] No locked region is removed, merged or reordered.
- [x] Hero is full-bleed.
- [x] FAQ is the only large light reading region.
- [x] FinalCTA remains subordinate to Hero scale.

## B. Content and publication

- [x] SR/EN/RU are complete `pageType: service` entries.
- [x] No VIP locale remains scaffold.
- [x] Structural locale parity passes.
- [x] EN/RU use `sourceLocale: sr` and repository-generated current digests.
- [x] All three entries are `published`, reviewed and `noindex: false` only after actual editorial installation/review.
- [x] Complete locale content stays `in-review` and `noindex: true` until dedicated renderer verification passes.
- [x] Content publication and route availability are flipped atomically after renderer, tests, check/build and UI verification pass.
- [x] VIP never renders through generic `LeafPage`; every locale has exactly one non-empty Hero H1.
- [x] Astro components contain no localized production copy.
- [x] No hardcoded price/contact/vehicle facts exist.
- [x] No raw localized internal URLs are authored.

## C. Canonical VIP contract

- [x] Pricing remains quote-only.
- [x] `discretion === true` gates discretion claims.
- [x] `privacy === true` gates privacy claims.
- [x] `commercialAviation === true` gates commercial aviation claims.
- [x] `privateAviation === true` gates private aviation claims.
- [x] `multiVehicle === true` gates multi-vehicle claims.
- [x] `dedicatedCoordinatorForComplexBookings === true` gates dedicated-coordination claims.
- [x] `securityService === false` explicitly gates the no-security/close-protection contract.
- [x] `customDecorationPositioning === false` is not contradicted by UI/copy.
- [x] No security or close-protection service is implied.

## D. Shared architecture

- [x] `OccasionScope`, `OccasionStandards` and `OccasionProcessSteps` are reused.
- [x] `ServiceHero`, `VehicleRecommendations`, `FAQ` and `FinalCTA` are reused.
- [x] No duplicate VIP copies of shared Occasion components exist.
- [x] Shared components contain no VIP-specific branching.
- [x] No shared API was changed; Wedding and Prom therefore require no migration.
- [x] `VipServiceDefinition`, `VipDiscretion`, `VipAviation` and `VipItinerary` remain page-local.
- [x] No monolithic multi-service component is introduced.

## E. Hero

- [x] Shared ServiceHero full-bleed variant renders first.
- [x] BaseLayout uses `overHero={true}`.
- [x] Exactly one H1 renders from localized Hero content.
- [x] Hero uses page-specific `src/assets/pages/vip-transportation/hero.png`.
- [x] Crop preserves chauffeur/passenger context and usable copy space.
- [x] Approved dark scrim maintains WCAG contrast.
- [x] Image colors do not create new UI accent colors.
- [x] Primary CTA uses VIP booking/request flow.
- [x] Secondary CTA uses quote flow.
- [x] Exactly three trust markers render from `content/ui`.
- [x] Hero image is not reused as another major image.

## F. Service Definition

- [x] Source is `overview`.
- [x] Heading, intro, body and exactly three principles render.
- [x] `VipServiceDefinition` uses open/divider-led composition, not detached feature cards.
- [x] Asset is `passenger-experience-alternate.webp`.
- [x] Copy explains service organisation rather than vehicle equipment.
- [x] No laptop/onboard-office/seat-feature promise is inferred from imagery.
- [x] Mobile content precedes media.

## G. Service Scope

- [x] Source is `sections[key=serviceScope]`.
- [x] Exactly three authored items render.
- [x] Shared `OccasionScope` is reused.
- [x] Exactly five active capability labels render in the locked order.
- [x] Individual quote label is gated by quote pricing.
- [x] Commercial/private aviation labels are independently gated.
- [x] Multi-vehicle and dedicated-coordinator labels are independently gated.
- [x] Capability labels wrap without narrow-screen horizontal overflow.
- [x] Section is not a configurator or pricing tool.

## H. Discretion & Privacy

- [x] Source is `sections[key=discretion]`.
- [x] Exactly three principles render.
- [x] Asset is `s-class-hotel-front-winter.webp`.
- [x] Content-first DOM order is preserved.
- [x] The section communicates low-profile professional service without absolute confidentiality guarantees.
- [x] No NDA, encryption, anonymity, data-deletion, security-screening or background-check promise is invented.
- [x] No large overlay obscures the road/passenger image focal area.
- [x] Image is delivered through the approved Astro asset pipeline.

## I. Arrivals & Aviation

- [x] Source is `sections[key=aviation]`.
- [x] Exactly three authored items render.
- [x] `commercialAviation` and `privateAviation` are required by the assembler.
- [x] Primary asset is `mercedes-sprint-next-to-private-jet.webp`.
- [x] Supporting asset is `private-jet-parked-outside-of-hangar.webp`.
- [x] Supporting image remains visually subordinate.
- [x] Section CTA resolves through booking flow.
- [x] No tarmac/airside/FBO/aircraft-side access is promised without canonical support.
- [x] Page remains clearly a ground-transport service, not private-jet charter.

## J. Fleet

- [x] Exactly four locked vehicle IDs are requested in the locked order.
- [x] Canonical Fleet facts and media are reused.
- [x] VIP role labels come from `content/ui`.
- [x] No capacities, luggage values, prices, features or availability are duplicated in page content.
- [x] Fleet CTA uses canonical routing.
- [x] Neither `s-class-move-highway.webp` nor `s-class-move-highway-2.webp` is used to imply Maybach availability.

## K. Complex Itinerary & Coordination

- [x] Source is `sections[key=itinerary]`.
- [x] Exactly five stages render.
- [x] `multiVehicle` gates multi-vehicle stage language.
- [x] `dedicatedCoordinatorForComplexBookings` gates coordinator language.
- [x] Changes remain subject to confirmed engagement/resources/availability.
- [x] Itinerary is semantic static explanation, not a fake live tracker/map/form.
- [x] Mobile sequence is vertical and content order is logical.
- [x] Desktop sequence survives long Russian copy without overlap or clipping.
- [x] Below `lg` the sequence is vertical; at `lg+` it is exactly `4/4/4` then `6/6`.

## L. Standards

- [x] Shared `OccasionStandards` is reused.
- [x] Exactly six rows render.
- [x] Professional chauffeur row is operational-data-gated.
- [x] Prepared vehicle row is operational-data-gated.
- [x] Discretion/privacy row is VIP-capability-gated.
- [x] Dedicated coordination row is VIP-capability-gated.
- [x] Multi-vehicle row is VIP-capability-gated.
- [x] Manual confirmation row uses canonical contact/booking model.
- [x] No generic luxury amenity/icon grid is introduced.

## M. Process

- [x] Source is `sections[key=process]`.
- [x] Exactly three steps render.
- [x] Shared `OccasionProcessSteps` is reused.
- [x] Process is one light inner strip on dark.
- [x] Process stacks below `lg` and uses three equal columns at `lg+`.
- [x] Manual confirmation is explicit; no instant-confirmation wording exists.

## N. FAQ

- [x] Exactly eight localized questions render.
- [x] FAQ is the only large light reading region.
- [x] Visible FAQ and FAQ JSON-LD use the same validated array.
- [x] One answer explicitly excludes security/close protection.
- [x] Aviation answers avoid airside/tarmac guarantees.
- [x] Quote pricing is explicit.
- [x] Manual confirmation is explicit.
- [x] Keyboard interaction passes.

## O. Final CTA

- [x] Existing FinalCTA is reused.
- [x] Primary CTA uses VIP booking/request flow.
- [x] Secondary CTA uses quote flow.
- [x] Verified phone/email come from canonical contact data.
- [x] Approved FinalCTA media is used; Hero image is not reused.
- [x] FinalCTA does not reach Hero scale.

## P. Theme and visual language

- [x] Inter Tight renders heading roles and Manrope renders body/UI roles through active theme.
- [x] Semantic active-theme tokens only.
- [x] No gold-first or aviation-blue theme is introduced.
- [x] No neon/glow/red-carpet/celebrity/security styling exists.
- [x] No raw page-local literal colors/spacing/radii replace semantic tokens.
- [x] Photography color remains editorial and does not become interface color.

## Q. Imagery

- [x] Hero → page-specific `hero.png`.
- [x] Definition → `passenger-experience-alternate.webp`.
- [x] Discretion → `s-class-hotel-front-winter.webp`.
- [x] Aviation primary → `mercedes-sprint-next-to-private-jet.webp`.
- [x] Aviation supporting → `private-jet-parked-outside-of-hangar.webp`.
- [x] Canonical Fleet media remains responsible for vehicle recommendations.
- [x] Shared FinalCTA media remains responsible for final CTA.
- [x] All contextual images use the approved Astro asset pipeline.
- [x] Hero follows existing eager/LCP strategy; below-fold media follows lazy-loading contract.
- [x] Focal subjects survive every governed crop.

## R. Responsive / accessibility

- [x] 320×568 passes topology, crop, CTA, focus, targets and overflow.
- [x] 768×1024 passes topology, crop, CTA, focus, targets and overflow.
- [x] 1024×768 passes topology, crop, CTA, focus, targets and overflow.
- [x] 1440×900 passes topology, crop, CTA, focus, targets and overflow.
- [x] 1920×1080 passes topology, crop, CTA, focus, targets and overflow.
- [x] 200% text zoom causes no clipping/loss of content.
- [x] Long Russian content causes no overlap or horizontal scroll.
- [x] Standards: 1 column below `md`, 2 columns `md..<lg`, 3×2 at `lg+`.
- [x] Process: stacked below `lg`, 3 equal columns at `lg+`.
- [x] Editorial mobile order remains content-first.
- [x] Wide desktop respects container caps.
- [x] Exactly one H1 and logical heading order.
- [x] 44×44 targets, keyboard use, visible focus, reduced motion and logical CSS properties pass.

## S. SEO / routing

- [x] Unique localized title/description for SR/EN/RU.
- [x] Route remains scaffold and content remains `in-review`/`noindex` until the dedicated renderer and page gates pass.
- [x] Published route becomes indexable in all three locales.
- [x] Canonical/hreflang/sitemap/robots behavior is generated through existing architecture.
- [x] Global Organization/WebSite and page FAQPage conventions are followed; no unsupported Service or BreadcrumbList schema is invented page-locally.
- [x] No fake price, rating or review structured data.
- [x] No Event/Flight/Airline/Security schema misrepresents the service.

## T. Verification

- [x] `pnpm content:sync-digests`
- [x] `pnpm types:generate`
- [x] `pnpm types:generate:check`
- [x] `pnpm content:validate site/luksuzni-prevoz`
- [x] `pnpm routes:validate site/luksuzni-prevoz`
- [x] `pnpm seo:validate site/luksuzni-prevoz`
- [x] `pnpm theme:sync:check`
- [x] `pnpm theme:validate site/luksuzni-prevoz`
- [x] `pnpm components:check`
- [x] `pnpm lint`
- [x] `pnpm --filter @luksuzni-prevoz/site check`
- [x] `pnpm --filter @luksuzni-prevoz/site build`
- [x] `pnpm verify:ui --target site/luksuzni-prevoz/src/components/services/vip-transportation/VipTransportationPage.astro --surface vip-transportation --change page`
- [x] `pnpm quality:fast`
- [ ] `pnpm test:a11y` — Chromium and Firefox pass all 16 tests; WebKit cannot launch because the host lacks `libicu74` and `libjpeg-turbo8`.
- [ ] `pnpm --filter @luksuzni-prevoz/site exec playwright test tests/smoke/vip-transportation.spec.ts` — Chromium and Firefox pass all 16 tests; the same WebKit host dependency gap blocks the unfiltered command.
- [ ] `pnpm format:check` — task-owned VIP files pass targeted Prettier; the repository-wide command reports 50 pre-existing/unrelated files, including machine-generated registry output.

Completion is prohibited while an applicable page-level criterion remains unchecked because of a known implementation defect. Environment/tooling blockers must remain explicitly unchecked and documented.

No unchecked item above represents a known VIP implementation defect. The
browser-specific coverage gaps are reproducible host limitations, and the
repository-wide formatting baseline was preserved rather than rewriting
unrelated user work.
