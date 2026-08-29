# Wedding Transportation — Acceptance V2

**Status:** LOCKED BINARY ACCEPTANCE  
**Target:** `weddingTransportation`

Every applicable item MUST pass.

## A. Structure
- [ ] Header → Hero → Definition → Scope → Wedding-Day Story → Fleet → Guest Transport → Presentation → Standards → Process → FAQ → Final CTA → Footer.
- [ ] No region is silently removed/merged/reordered.
- [ ] Hero is full-bleed.
- [ ] FAQ is the only large light reading region.
- [ ] FinalCTA remains medium-height.

## B. Content
- [ ] SR/EN/RU are full `pageType: service` entries.
- [ ] No Wedding locale remains a scaffold.
- [ ] Locale structural parity passes.
- [ ] EN/RU use `sourceLocale: sr`.
- [ ] Digests are synchronized before validation.
- [ ] No localized production copy lives in Astro components.
- [ ] No hardcoded pricing/contact facts.

## C. Hero
- [ ] Shared ServiceHero full-bleed variant.
- [ ] `BaseLayout overHero={true}`.
- [ ] Exactly one H1 from localized content.
- [ ] Exact Hero asset: `assets/shared/other/weeding-day-kissing.webp`.
- [ ] Crop preserves wedding + vehicle context.
- [ ] Primary booking flow; secondary quote flow.
- [ ] Eyebrow + exactly three trust markers from UI.
- [ ] Hero image not reused elsewhere prominently.

## D. Definition
- [ ] Overview heading/body + exactly three items render.
- [ ] Service is understandable before later sections.
- [ ] No detached dashboard cards.

## E. Scope
- [ ] `sections[key=serviceScope]`.
- [ ] Exactly three items.
- [ ] `OccasionScope` reused.
- [ ] Multiple vehicles/mixed classes/return/waiting are capability-gated.
- [ ] Quote mode is not presented as fixed pricing.

## F. Wedding-Day Story
- [ ] `sections[key=weddingDay]`.
- [ ] Exactly five stages.
- [ ] Exact asset: `assets/shared/other/e-class-outside-weeding-day.webp`.
- [ ] Astro asset pipeline.
- [ ] Semantic stages.
- [ ] Actual plan described as schedule-dependent.
- [ ] Mobile stages precede image.
- [ ] No stage presented as mandatory.

## G. Fleet
- [ ] Exactly four locked vehicle IDs.
- [ ] Facts only from fleet data.
- [ ] Wedding role labels from UI.
- [ ] No duplicated capacities/luggage/equipment/pricing.
- [ ] Canonical fleet media.
- [ ] Route-helper Fleet CTA.

## H. Couple & Guest Transport
- [ ] `sections[key=guestTransport]`.
- [ ] Exactly three groups.
- [ ] Couple/guest claims gate against canonical capability.
- [ ] Multi-vehicle/mixed-class claims gated.
- [ ] Exact asset: `assets/shared/other/v-class-outisde-weeding-day.webp`.
- [ ] Narrative is about people/organisation, not specs.
- [ ] Mobile copy before media.

## I. Presentation
- [ ] `sections[key=presentation]`.
- [ ] Renders only when `customPresentationRequest` is true.
- [ ] Exact asset: `assets/shared/other/s-class-with-flowers-special-occasion.webp`.
- [ ] Copy states requests are individually reviewed.
- [ ] Decoration is not promised as included.
- [ ] No invented flowers/ribbons/champagne/gifts package.
- [ ] CTA uses booking flow.

## J. Standards
- [ ] `sections[key=standards]`.
- [ ] `OccasionStandards` reused.
- [ ] Professional chauffeur/prepared vehicle/multi-vehicle/waiting-return/presentation/manual-confirmation rows are data-gated.
- [ ] No security/close-protection claims.
- [ ] No SaaS card grid.

## K. Process
- [ ] `sections[key=process]`.
- [ ] Exactly three steps.
- [ ] `OccasionProcessSteps` reused.
- [ ] Heading stays dark; steps one light strip.
- [ ] 320/768 stack with horizontal internal dividers.
- [ ] 1024+ three columns with vertical internal dividers.
- [ ] No instant confirmation implication.

## L. FAQ
- [ ] Exactly six localized FAQs.
- [ ] FAQ is only large light reading region.
- [ ] Guest/multi-vehicle/waiting/presentation answers match canonical capability.
- [ ] Decoration not automatically included.
- [ ] Manual confirmation stated.
- [ ] No unsupported fixed lead time.
- [ ] Keyboard accessible.

## M. Final CTA
- [ ] Existing FinalCTA reused.
- [ ] Wedding request primary; quote secondary.
- [ ] Verified phone/email from canonical data.
- [ ] Not Hero #2.
- [ ] Hero image not reused.

## N. Shared Architecture
- [ ] `OccasionServiceDefinition`, `OccasionScope`, `OccasionStandards`, `OccasionProcessSteps` are content-agnostic.
- [ ] No shared Occasion component contains Wedding/Prom branching.
- [ ] Wedding Day Story/Guest Transport/Presentation stay page-local.
- [ ] No monolithic Wedding/Prom abstraction.
- [ ] Existing shared components reused where contracts fit.

## O. Theme
- [ ] Inter Tight headings, Manrope body/UI.
- [ ] Theme V2 semantic tokens only.
- [ ] No raw design scales.
- [ ] No wedding-specific UI palette/script/floral decoration.
- [ ] No gold-first/glow/chrome/metallic gradients.

## P. Imagery
- [ ] Hero: `weeding-day-kissing.webp`.
- [ ] Story: `e-class-outside-weeding-day.webp`.
- [ ] Guest: `v-class-outisde-weeding-day.webp`.
- [ ] Presentation: `s-class-with-flowers-special-occasion.webp`.
- [ ] Astro assets.
- [ ] No major photo reuse.
- [ ] Focal subjects survive all crops.
- [ ] Below-fold images lazy.
- [ ] Hero follows LCP strategy.

## Q. Responsive
- [ ] 320×568 passes.
- [ ] 768×1024 passes.
- [ ] 1024×768 passes.
- [ ] 1440×900 passes.
- [ ] 1920×1080 passes.
- [ ] Mobile editorial regions content-first.
- [ ] Process only becomes 3-column at desktop threshold.
- [ ] Wide desktop contained.
- [ ] No horizontal overflow.

## R. Accessibility
- [ ] One H1.
- [ ] Logical headings.
- [ ] 44×44 targets.
- [ ] Keyboard operability.
- [ ] Visible focus.
- [ ] No hover-only information.
- [ ] Correct image alt.
- [ ] Reduced motion.
- [ ] Logical CSS.

## S. SEO
- [ ] Unique localized metadata.
- [ ] Page indexable after approval.
- [ ] Canonical/hreflang through existing architecture.
- [ ] Service/Breadcrumb structured data only.
- [ ] No fake price/review/rating/Event schema.
- [ ] Canonical internal routing.

## T. Verification
- [ ] `pnpm content:sync-digests`
- [ ] `pnpm types:generate`
- [ ] `pnpm content:validate`
- [ ] `pnpm routes:validate`
- [ ] `pnpm theme:sync:check`
- [ ] `pnpm theme:validate`
- [ ] `pnpm components:check`
- [ ] `pnpm lint`
- [ ] `pnpm check`
- [ ] `pnpm quality:fast`
- [ ] `pnpm build`
- [ ] relevant `pnpm verify:ui`
- [ ] `pnpm test:a11y`
- [ ] relevant E2E
- [ ] `pnpm format:check`
