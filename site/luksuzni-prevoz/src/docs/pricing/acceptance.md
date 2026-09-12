# Luxury Transportation — Pricing Page Acceptance v1.2

**Status:** LOCKED BINARY ACCEPTANCE
**Target:** `pricing`

Every applicable item MUST pass.

## A. Authority and preflight

- [ ] Root `AGENTS.md` was read.
- [ ] `DESIGN.md` was read.
- [ ] Pricing blueprint/data/shared-UI docs were read.
- [ ] Required Pricing/design/functional/a11y/SEO/i18n skills were loaded.
- [ ] The theme configured by `foundation.config.ts` resolves consistently through generated CSS and `.design/system.json`.
- [ ] `pnpm design:context` resolves the Pricing surface.
- [ ] `pnpm components:check` ran before any shared-component edit.

## B. Public catalogue scope

- [ ] Page exposes only supported service-catalogue pricing.
- [ ] Airport Transportation has public numeric fares.
- [ ] Private Chauffeur has hourly public fares.
- [ ] Private Chauffeur has half-day public fares.
- [ ] Private Chauffeur has full-day public fares.
- [ ] `perKm` is not rendered publicly.
- [ ] `PUTEVI IZ BEOGRADA` is not rendered.
- [ ] No city-to-city destination fare appears anywhere.
- [ ] No unsupported overage/surcharge formula appears.
- [ ] No fabricated event package or numeric `from` price appears.

## C. Currency data invariant

- [ ] Airport fare currency comes from `airportTransfer.currency`.
- [ ] Hourly currency comes from `VehiclePricing.currency`.
- [ ] Half-day currency comes from `VehiclePricing.currency`.
- [ ] Full-day currency comes from `VehiclePricing.currency`.
- [ ] Currency is not stored in Markdown.
- [ ] Currency is not stored in UI JSON.
- [ ] Currency symbol/code is not hardcoded in Pricing components.
- [ ] Missing currency for a published-pricing vehicle fails loudly and blocks publication.

## D. Content

- [ ] SR/EN/RU are full `pageType: pricing` entries.
- [ ] No Pricing locale remains `pageType: scaffold` after content installation.
- [ ] Supplied editorial structure is preserved.
- [ ] Serbian is the source locale.
- [ ] EN/RU carry current Serbian source digest.
- [ ] Content structural parity passes.
- [ ] No numeric fare is duplicated in content.
- [ ] No vehicle capacity is duplicated in content.
- [ ] No raw internal URL is authored in content.
- [ ] No production copy is hardcoded in Astro components.

## E. Localized UI

- [ ] All new page-local strings come from `pricing.*` UI keys or existing canonical UI/navigation labels.
- [ ] UI additions were merged for SR/EN/RU.
- [ ] No conflicting key was silently overwritten.
- [ ] Data-derived hour/km templates interpolate canonical service data.
- [ ] All service pricing-status labels are localized.

## F. Structure

- [ ] Visible order is Header → full-bleed Hero → Intro/Index → dark Published Prices heading → light Airport panel → dark Private Chauffeur heading → independent light Chauffeur panel → Individual Pricing → light Pricing Models panel → dark Confirmation → contained light FAQ section → FinalCTA → Footer.
- [ ] No visible region is silently removed.
- [ ] No required region is merged into another.
- [ ] Airport and Private Chauffeur use independent contained light pricing surfaces.
- [ ] Published Prices and Private Chauffeur headings/descriptions remain open on the dark page canvas.
- [ ] Pricing Models, Confirmation and FAQ remain separate semantic regions with independent surface ownership.
- [ ] Confirmation heading/copy renders directly on the dark page canvas.
- [ ] FAQ heading and rows render together in one independent contained light section.
- [ ] Confirmation and FAQ align to `container.main`; neither is capped by `ReadingContainer`.
- [ ] Confirmation and FAQ remain adjacent semantic sections with independent surface ownership.
- [ ] No unapproved visible region is inserted.
- [ ] FinalCTA remains medium-height.
- [ ] Published Pricing is the dominant functional region.

## G. Hero

- [ ] `ServiceHero` is reused unchanged.
- [ ] `variant="full-bleed"`.
- [ ] `BaseLayout overHero={true}` integrates the header with the Hero.
- [ ] Hero is full-bleed and reuses the shared variant without page-local layering overrides.
- [ ] Exactly one H1 comes from localized content.
- [ ] Hero primary action uses booking flow.
- [ ] Hero secondary action uses quote flow.
- [ ] Hero eyebrow comes from UI localization.
- [ ] `content.data.hero.supportText` is rendered through the existing support-text contract.
- [ ] Hero image is `src/assets/s-class-wheel-interior.webp` or an explicitly reported neutral placeholder blocker.
- [ ] Hero image is decorative with empty alt.
- [ ] No trust-marker badge row was added.

## H. Pricing Index

- [ ] Exactly three anchor destinations: Airport, Private Chauffeur, Individual Pricing.
- [ ] Native `<nav>` semantics.
- [ ] Localized `aria-label`.
- [ ] No pills/cards.
- [ ] 44×44 minimum targets.
- [ ] Visible focus.
- [ ] Sticky-header anchor offset works.

## I. Airport Pricing

- [ ] Section id is `airport`.
- [ ] Source is `pricing[vehicleId].airportTransfer`.
- [ ] Scope is verified as `belgrade-airport-to-belgrade-city`.
- [ ] Rows contain all and only canonical `pricingStatus: published` vehicles.
- [ ] Quote-only vehicles receive no numeric fallback.
- [ ] Fleet order follows canonical fleet order.
- [ ] Vehicle names come from fleet data.
- [ ] Amount/currency come from pricing data.
- [ ] Per-vehicle meaning is visible.
- [ ] One service CTA appears after/with the section.
- [ ] No row-level CTAs.
- [ ] No table/card grid.
- [ ] Published Prices heading and description are outside the Airport light panel.

## J. Private Chauffeur Pricing

- [ ] Wrapper id is `private-chauffeur`.
- [ ] Exactly three tariff groups render.
- [ ] Hourly amount source is canonical.
- [ ] Hourly minimum is read from service data.
- [ ] No hourly kilometre limit is invented.
- [ ] Half-day amount source is canonical.
- [ ] Half-day hours/km come from service data.
- [ ] Full-day amount source is canonical.
- [ ] Full-day hours/km come from service data.
- [ ] Each group contains all and only canonical `pricingStatus: published` vehicles.
- [ ] Quote-only vehicles receive no numeric fallback.
- [ ] `perKm` is absent.
- [ ] One Private Chauffeur route CTA appears after all groups.
- [ ] No row-level CTA.
- [ ] Private Chauffeur heading, label and note are outside its light panel.
- [ ] Hourly, Half Day and Full Day share one panel with quiet internal dividers.

## K. Individual Pricing

- [ ] Section id is `individual-pricing`.
- [ ] Business family begins from `businessTransportation`.
- [ ] Business children come from `services.ts`.
- [ ] Special Events family begins from `specialEvents`.
- [ ] Special Events children come from `services.ts`.
- [ ] Child arrays are not duplicated in page components.
- [ ] Pricing status comes from each service's `pricingMode`.
- [ ] Estimate+quote and quote-only states are distinct.
- [ ] Special Events `"from"` does not display a numeric starting price.
- [ ] Published service routes are canonical links.
- [ ] Scaffold service routes are not linked.
- [ ] One quote CTA follows the service families.
- [ ] No cards.

## L. Pricing Models

- [ ] Exactly three explanatory items.
- [ ] Desktop uses three semantic columns with internal dividers.
- [ ] Small states stack with internal horizontal dividers.
- [ ] No icons are required for comprehension.
- [ ] No outer card border.
- [ ] No new pricing facts are introduced.
- [ ] All three models remain groups inside one parent light surface, not detached cards.

## M. Confirmation

- [ ] Manual confirmation is explicit.
- [ ] Request submission is not presented as confirmed booking.
- [ ] No unsupported response-time promise.
- [ ] Region is open/reading-width, not a card.
- [ ] Region uses the dark page canvas rather than a light continuation panel.
- [ ] Region uses regular page/grid width while paragraph copy retains semantic body measure.
- [ ] No extra CTA is inserted.

## N. FAQ

- [ ] Exactly eight localized questions.
- [ ] Existing `FAQ.astro` is reused.
- [ ] FAQ heading and rows share one contained light section; individual items are not cards.
- [ ] FAQ section uses `PageContainer`, matching the reviewed `/dev/ui` light FAQ composition.
- [ ] `SectionHeading` and `FAQ` both use their light-surface contracts.
- [ ] No FAQ intro is fabricated while the approved content model has no intro field.
- [ ] Same validated FAQ array feeds visible FAQ and FAQ schema.
- [ ] No numeric fares are duplicated in FAQ.
- [ ] No Private Chauffeur service-limit numbers are duplicated in FAQ copy.
- [ ] FAQ states per-kilometre pricing is outside Pricing V1.
- [ ] Keyboard interaction passes.
- [ ] Focus is visible.

## O. Final CTA

- [ ] Existing `FinalCTA.astro` is reused.
- [ ] Primary action is booking.
- [ ] Secondary action is quote.
- [ ] Contact facts come from canonical contact data.
- [ ] Hero image is not reused.
- [ ] FinalCTA uses `final-cta-bg.webp`, decorative alt, cover fit and integrated media treatment.
- [ ] FinalCTA preserves its reviewed 62/38 layout from `lg`.
- [ ] FinalCTA is not Hero #2.

## P. Theme and visual system

- [ ] Inter Tight headings.
- [ ] Manrope body/UI.
- [ ] Cormorant Garamond remains brand-lockup only.
- [ ] Configured active-theme semantic tokens only.
- [ ] No raw palette values in production components.
- [ ] No new spacing/radius/type scale.
- [ ] Independent Airport, Chauffeur, Pricing Models and FAQ panels use semantic light-surface roles.
- [ ] Surface contrast and whitespace lead; borders/dividers remain restrained.
- [ ] Monetary values use an existing semantic text role and are slightly more prominent than row metadata.
- [ ] Platinum is restrained.
- [ ] No gold-first styling.
- [ ] No metallic gradient.
- [ ] No glow.
- [ ] No strong shadow.
- [ ] No SaaS/dashboard cardification.
- [ ] Wireframe loads the shared `wireframe-base.css` and `wireframe-responsive.js` from the intended repository location.
- [ ] Wireframe/page-local structural CSS uses configured semantic variables only; no local palette, font scale, spacing scale, radius scale, or raw breakpoint values.
- [ ] Pricing ledger split uses an approved 5/7 composition, not 4/8.

## Q. Responsive

- [ ] 320 width passes.
- [ ] 768 width passes.
- [ ] 1024 width passes.
- [ ] 1440 width passes.
- [ ] 1920 width passes.
- [ ] Chosen ledger split breakpoint is tokenized and documented.
- [ ] Both sides of the ledger split breakpoint were reviewed.
- [ ] Intro/Index activates 5/7 at `lg`.
- [ ] Numeric ledgers and custom families activate their desktop splits at `xl`.
- [ ] Pricing Models and FinalCTA use their reviewed `lg` states.
- [ ] Mobile preserves content-first DOM order.
- [ ] Vehicle names can wrap without detaching from price.
- [ ] Custom families stack in correct order.
- [ ] Wide desktop remains capped by main container.
- [ ] No accidental horizontal overflow.

## R. Accessibility

- [ ] Exactly one H1.
- [ ] Logical heading hierarchy.
- [ ] Native semantic lists/nav/links used.
- [ ] 44×44 targets.
- [ ] Keyboard-only flow passes.
- [ ] Visible focus on dark and light surfaces.
- [ ] No hover-only information.
- [ ] Price unit/status is not communicated by color alone.
- [ ] 200% text zoom passes.
- [ ] Reduced motion passes.
- [ ] No duplicated breakpoint DOM.

## S. SEO / structured data

- [ ] Unique localized SEO titles.
- [ ] Unique localized SEO descriptions.
- [ ] Canonical comes from route architecture.
- [ ] Reciprocal hreflang passes.
- [ ] Internal links use route helpers.
- [ ] No city-to-city pricing keywords/content are inserted.
- [ ] Draft/scaffold route is absent from sitemap/hreflang where current validators require.
- [ ] After approval, route is published and sitemap includes it.
- [ ] After approval, content `noindex` is false.
- [ ] FAQ schema matches visible FAQ.
- [ ] No Offer/AggregateOffer/Product/priceRange/review/rating schema is added.

## T. Architecture

- [ ] Dedicated `src/components/pricing/PricingPage.astro` exists.
- [ ] `ContentPageRenderer.astro` dispatches `pricing` explicitly.
- [ ] `PricingPage.astro` uses `BaseLayout`, `buildPageSeo` and `overHero={true}`.
- [ ] Page-local components match `shared-ui-additions.md`.
- [ ] No unnecessary shared component was created.
- [ ] No existing reviewed shared component was redesigned.
- [ ] `pricing.csv` is not parsed at runtime.
- [ ] No numeric fallback lives in a presentation component.
- [ ] Static-first Astro is preserved.
- [ ] No client hydration is added for Pricing V1.

## U. Publication transition

- [ ] Fleet/pricing/currency consistency invariants pass.
- [ ] SR/EN/RU content validation passed.
- [ ] Page acceptance passed.
- [ ] `routes.ts` Pricing availability changed from `scaffold` to `published`.
- [ ] SR/EN/RU `status` changed to `published`.
- [ ] SR/EN/RU `noindex` changed to `false`.
- [ ] Sitemaps/alternates regenerate through existing architecture.
- [ ] No generated output was hand-edited.

## V. Tests

- [ ] Pricing smoke test exists.
- [ ] All three locales are exercised.
- [ ] Airport rows are asserted against the canonical published-pricing roster.
- [ ] Three chauffeur groups asserted.
- [ ] Chauffeur rows are asserted against the canonical published-pricing roster.
- [ ] Quote-only numeric fallback is rejected.
- [ ] No per-km public rate asserted.
- [ ] No city-to-city content asserted.
- [ ] Custom status behavior asserted.
- [ ] CTA destinations asserted.
- [ ] Draft/noindex behavior is covered before publication through validators/dev preview.
- [ ] Published/indexable behavior is covered in production E2E.
- [ ] Responsive overflow coverage asserted.

## W. Verification commands

- [ ] `pnpm content:sync-digests` only if Serbian editorial source changed.
- [ ] `pnpm types:generate` only if authoritative route/UI keys changed; otherwise `pnpm types:generate:check`.
- [ ] `pnpm foundation:doctor site/luksuzni-prevoz`
- [ ] `pnpm theme:sync:check`
- [ ] `pnpm theme:validate site/luksuzni-prevoz`
- [ ] `pnpm routes:validate site/luksuzni-prevoz`
- [ ] `pnpm content:validate site/luksuzni-prevoz`
- [ ] `pnpm seo:validate site/luksuzni-prevoz`
- [ ] `pnpm components:check`
- [ ] `pnpm lint`
- [ ] `pnpm test:unit`
- [ ] `pnpm --filter @luksuzni-prevoz/site check`
- [ ] `pnpm --filter @luksuzni-prevoz/site build`
- [ ] Pricing `verify:ui` page profile
- [ ] Pricing smoke/E2E
- [ ] accessibility browser coverage
- [ ] independent design review
- [ ] technical page review

## X. Completion report

- [ ] Exact files changed are listed.
- [ ] Canonical fleet/pricing eligibility and currency behavior are described.
- [ ] Shared-component changes are listed; expected value is none.
- [ ] Content digest is reported.
- [ ] Commands actually run are listed with results.
- [ ] Responsive evidence is reported.
- [ ] Accessibility evidence is reported.
- [ ] SEO evidence is reported.
- [ ] No unresolved P0/P1 remains.
