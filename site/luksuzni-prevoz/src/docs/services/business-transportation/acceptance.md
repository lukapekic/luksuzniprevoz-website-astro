# Business Transportation Hub — Acceptance V2

**Status:** LOCKED BINARY ACCEPTANCE  
**Target:** `businessTransportation`

Every applicable item MUST pass.

## A. Structure

- [ ] Header → Hero → Proposition → Services → Engagement → Coordination → Client Proof when eligible → Fleet → Standards → Process → FAQ → Final CTA → Footer.
- [ ] No locked region is silently removed, merged, or reordered.
- [ ] FAQ is the only large light region.
- [ ] Final CTA retains approved medium-height geometry.

## B. Content parity

- [ ] Serbian, English, and Russian entries use the same structural shape.
- [ ] All three validate against the updated schema.
- [ ] EN and RU carry `sourceLocale: sr`.
- [ ] `pnpm content:sync-digests` produces current EN/RU source digests.
- [ ] All three remain reviewed after final translation review.
- [ ] Astro page components contain no production copy literals.

## C. Hero

- [ ] Shared `ServiceHero / full-bleed` renders as the first page region.
- [ ] `BaseLayout overHero={true}` enables the approved transparent Header state.
- [ ] H1 comes from localized page content.
- [ ] Primary CTA targets `#business-services`.
- [ ] Secondary CTA uses quote flow.
- [ ] Eyebrow resolves from `business.hero.eyebrow`.
- [ ] Exactly three passive trust markers render from `content/ui`.
- [ ] Trust markers contain no unsupported universal multi-vehicle claim.

## D. Proposition

- [ ] `overview.body` renders.
- [ ] Exactly three `overview.items` render.
- [ ] Principles use open/divider-led grouping.
- [ ] Principles are not detached dashboard cards.

## E. Business Services

- [ ] Exactly three cards render in Corporate → Delegation → Conference order.
- [ ] Every destination uses a route key.
- [ ] Every card renders media, index, title, body, capability labels, and CTA.
- [ ] Essential content is visible without hover.
- [ ] Each card exposes one route link.
- [ ] Focus state is clearly visible.

### Corporate

- [ ] `supportsOneOff` drives `business.commercial.oneOff`.
- [ ] `supportsRecurringContracts` drives `business.commercial.recurring`.
- [ ] `supportsInvoicing` drives `business.capability.invoicing`.
- [ ] `supportsNegotiatedPricing` drives `business.capability.negotiatedPricing`.
- [ ] Hourly, half-day, full-day, and Roadshow chips do not render.

### Delegation

- [ ] `multipleVehicles` drives `business.coordination.multipleVehicles`.
- [ ] `mixedVehicleClasses` drives `business.coordination.mixedVehicleClasses`.
- [ ] `dedicatedCoordinator` drives `business.coordination.dedicatedCoordinator`.
- [ ] Airport, private-aviation, security, and protection chips do not render.
- [ ] `securityService = false` produces no security/protection wording.

### Conference & Congress

- [ ] `airportArrivals` drives `business.coordination.airportArrivals`.
- [ ] `hotelTransfers` drives `business.coordination.hotelTransfers`.
- [ ] `venueShuttles` drives `business.coordination.venueShuttles`.
- [ ] `multiVehicleSchedules` drives `business.coordination.multiVehicleSchedules`.

## F. Engagement

- [ ] Source is `sections[key=engagementModel]`.
- [ ] One-off and recurring paths both render.
- [ ] Recurring/invoicing/negotiated-term claims identify Corporate Transportation.
- [ ] Contextual CTA routes to `corporateTransportation`.
- [ ] Section remains dark.

## G. Coordination

- [ ] Source is `sections[key=coordination]`.
- [ ] Exactly five timeline entries render in authored order.
- [ ] Timeline remains semantic text.
- [ ] Mobile narrative/timeline precede media.
- [ ] Same-chauffeur wording is gated by Corporate capability.
- [ ] Generic Business flight tracking does not render.

## H. Client Proof

- [ ] Canonical Business placement is checked.
- [ ] No `logoAsset: null` record renders as a logo.
- [ ] No non-approved logo renders.
- [ ] Exactly four approved logos render: President Palace, Hyatt Regency, Qatar Airways, and Square Nine.
- [ ] Chinese Embassy does not render.
- [ ] Zero approved logos would remove the entire region.
- [ ] No fake logo, placeholder brand tile, testimonial, or endorsement renders.

## I. Fleet

- [ ] Exactly four locked vehicle IDs are requested.
- [ ] Vehicle facts come from fleet data.
- [ ] Business-role labels come from `content/ui`.
- [ ] Role-label keys have SR/EN/RU parity.
- [ ] No page-local capacity, luggage, class, pricing, or equipment data exists.

## J. Standards

- [ ] Source is `sections[key=standards]`.
- [ ] Six rows render when all gates are active.
- [ ] Professional chauffeur is data-gated.
- [ ] Discretion is data-gated.
- [ ] Multi-vehicle coordination is data-gated.
- [ ] Mixed vehicle classes is data-gated.
- [ ] Schedule continuity is gated by `dedicatedChauffeurAcrossStops`.
- [ ] Manual confirmation follows the existing request-confirmation model.
- [ ] Flight tracking does not render as a Business standard.
- [ ] Standards are not six floating dashboard cards.

## K. Process

- [ ] Source is `sections[key=process]`.
- [ ] Exactly three steps render in authored order.
- [ ] Section remains dark and compact.

## L. FAQ

- [ ] Six localized questions render.
- [ ] FAQ is the only large light region.
- [ ] Multi-vehicle answers identify service context.
- [ ] Same-chauffeur answers identify Corporate Transportation.
- [ ] Recurring/invoicing answers identify Corporate Transportation.
- [ ] No generic Business flight-tracking claim appears.
- [ ] Accordion remains keyboard accessible.

## M. Final CTA

- [ ] Existing FinalCTA is reused.
- [ ] Primary CTA uses business/booking flow.
- [ ] Secondary CTA uses Request a Quote.
- [ ] Verified phone/email come from canonical contact data as tertiary contacts.
- [ ] Contact details are absent from page content.
- [ ] Final CTA does not reach hero scale.

## N. Theme

- [ ] H1/H2 computed font resolves to Inter Tight.
- [ ] Body/UI computed font resolves to Manrope.
- [ ] Styling consumes semantic Theme V2 tokens.
- [ ] No raw page-local palette, spacing scale, radius scale, or type scale exists.
- [ ] No gold-first, blue-corporate, glow, chrome, or metallic-gradient treatment exists.

## O. Responsive

- [ ] 320×568 passes topology, content order, image behavior, CTA placement, overflow, focus order, and target size.
- [ ] 768×1024 passes the same assertions.
- [ ] At 768 px, service card 01 spans the row and 02/03 share the second row.
- [ ] 1024×768 passes the same assertions.
- [ ] At 1024 px and above, services/process use three columns, standards use 3×2, and client proof uses four columns.
- [ ] 1440×900 passes the same assertions.
- [ ] 1920×1080 passes the same assertions.
- [ ] No accidental page-level horizontal overflow exists.

## P. Accessibility

- [ ] One H1 exists.
- [ ] Heading order is logical.
- [ ] All interactive targets meet 44×44 CSS px.
- [ ] All controls are keyboard operable.
- [ ] Focus-visible treatment is clear on dark and light surfaces.
- [ ] No essential information depends on hover.
- [ ] Image alt behavior is correct.
- [ ] Reduced motion removes non-essential motion.
- [ ] Direction-sensitive CSS uses logical properties.

## Q. Architecture

- [ ] Dedicated Business renderer is wired through `ContentPageRenderer`.
- [ ] Shared primitives are reused when their contracts fit.
- [ ] No generic `HubPage` abstraction is introduced.
- [ ] `actionTargetSchema` supports validated anchor targets.
- [ ] CTA resolver supports anchor targets.
- [ ] Hub overview supports optional principle items.
- [ ] Editorial sections support an optional CTA.
- [ ] No generated file is manually edited.
- [ ] No manual localized URL construction exists.
- [ ] No unnecessary dependency or client island is added.

## R. Verification

- [ ] `pnpm content:sync-digests`
- [ ] `pnpm content:validate`
- [ ] `pnpm routes:validate`
- [ ] `pnpm theme:sync:check`
- [ ] `pnpm theme:validate`
- [ ] `pnpm lint`
- [ ] `pnpm check`
- [ ] `pnpm quality:fast`
- [ ] `pnpm build`
- [ ] relevant `pnpm verify:ui`
- [ ] `pnpm test:a11y`
- [ ] relevant E2E tests
- [ ] `pnpm format:check`
