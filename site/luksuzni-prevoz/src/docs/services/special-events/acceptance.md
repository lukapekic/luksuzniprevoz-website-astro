# Special Events Hub — Acceptance V2

**Status:** LOCKED BINARY ACCEPTANCE  
**Target:** `specialEvents`

Every applicable item MUST pass.

## A. Structure

- [ ] Header → Hero → Proposition → Event Services → Other Occasions → Service Scope → Event Coordination → Fleet → Standards → Process → FAQ → Final CTA → Footer.
- [ ] No locked region is silently removed, merged, or reordered.
- [ ] FAQ is the only large light page region.
- [ ] Process contains only one bounded light inner panel.
- [ ] Final CTA retains approved medium-height geometry.

## B. Content parity

- [ ] Serbian, English, and Russian entries use the same structural shape.
- [ ] All three validate against the existing hub schema with no schema broadening.
- [ ] EN and RU carry `sourceLocale: sr`.
- [ ] `pnpm content:sync-digests` produces current EN/RU source digests.
- [ ] All three remain reviewed after final translation review.
- [ ] Final installed entries do not retain the old work-in-progress `noindex: true` flag.
- [ ] Astro page components contain no production copy literals.

## C. Assets

- [ ] Required assets exist under `src/assets/shared/other/` using the normalized names from `README.md`.
- [ ] Hero uses `s-class-driving-forest.webp`.
- [ ] Wedding card uses `e-class-outside-wedding-day.webp`.
- [ ] Prom card uses temporary `v-class-interior.webp` until a dedicated Prom asset is supplied.
- [ ] VIP card uses `s-class-interior-driver-side.webp`.
- [ ] Event Coordination uses `v-class-outside-wedding-day.webp`.
- [ ] `s-class-wedding-flower-detail.webp` does not render on the hub.
- [ ] `wedding-couple-vehicle.webp` does not render on the hub.
- [ ] No high-prominence hub image is reused in another hub region.
- [ ] All locked hub photographs are decorative with correct empty-alt treatment.

## D. Hero

- [ ] Shared `ServiceHero / full-bleed` renders as the first page region.
- [ ] `BaseLayout overHero={true}` enables the approved transparent Header state.
- [ ] H1 comes from localized page content.
- [ ] Primary CTA targets `#event-services`.
- [ ] Secondary CTA uses quote flow.
- [ ] Eyebrow resolves from `specialEvents.hero.eyebrow`.
- [ ] Exactly three passive trust markers render from `content/ui`.
- [ ] Trust markers use professional chauffeur, event-plan, and manual-confirmation meanings.
- [ ] Hero remains neutral across Wedding, Prom, VIP, and other occasions.
- [ ] No wedding-specific Hero copy or imagery renders.
- [ ] Hero scrim preserves WCAG text contrast without creating a green alternate theme.

## E. Proposition

- [ ] `overview.body` renders.
- [ ] Exactly three `overview.items` render.
- [ ] Principles express principal passenger/couple, guests/groups, and one agreed schedule.
- [ ] Principles use open/divider-led grouping.
- [ ] Principles are not detached dashboard cards.

## F. Event Services

- [ ] Section id is `event-services`.
- [ ] Exactly three cards render in Wedding → Prom → VIP order.
- [ ] Every destination uses a route key resolved through project routing.
- [ ] Every card renders media, index, title, body, exactly three capability labels, and CTA.
- [ ] Essential commercial content is visible without hover.
- [ ] Each card exposes one clear route link.
- [ ] No nested interactive controls exist.
- [ ] Focus state is clearly visible.

### Wedding

- [ ] `coupleTransport` drives `specialEvents.capability.coupleTransport`.
- [ ] `guestTransport` drives `specialEvents.capability.guestTransport`.
- [ ] `multipleVehicles` drives `specialEvents.capability.multipleVehicles`.
- [ ] No decoration/gift/champagne inclusion claim renders.
- [ ] No unlimited waiting claim renders.

### Prom

- [ ] `individualAndGroup` drives `specialEvents.capability.individualAndGroup`.
- [ ] `multipleVehicles` drives `specialEvents.capability.multipleVehicles`.
- [ ] `returnPossible` drives `specialEvents.capability.returnByAgreement`.
- [ ] Temporary image is exactly `v-class-interior.webp` while the fallback is active.
- [ ] Prom card contains no wedding-couple, flower-decoration, nightlife, alcohol, or party-limousine imagery.

### VIP

- [ ] `privacy` drives `specialEvents.capability.privacy`.
- [ ] `discretion` drives `specialEvents.capability.discretion`.
- [ ] `pricingMode.includes("quote")` drives `specialEvents.capability.individualQuote`.
- [ ] VIP remains quote-only.
- [ ] No security, bodyguard, close-protection, escort, or guard claim renders.

## G. Other Occasions

- [ ] Source is `sections[key=otherOccasions]` plus canonical `specialEvents.generalUseCases`.
- [ ] Birthdays render only from canonical use-case data.
- [ ] Private parties/celebrations render only from canonical use-case data.
- [ ] Galas render only from canonical use-case data.
- [ ] Other special occasions render only from canonical use-case data.
- [ ] Authored CTA uses the general event-request flow.
- [ ] Region is compact and dark/elevated rather than a large light section.
- [ ] No icon grid or decorative event imagery renders.

## H. Service Scope

- [ ] Source is `sections[key=serviceScope]`.
- [ ] Exactly two items render in authored order.
- [ ] Item 01 communicates one important arrival.
- [ ] Item 02 communicates coordinated event transport.
- [ ] Section does not imply multiple vehicles are required for every event.
- [ ] At 320 and 768 px, explanatory content precedes both rows.
- [ ] At 1024 px and above, the section uses the locked 5/7 split.
- [ ] Rows remain dark and divider-led; no detached cards or large light panel.

## I. Event Coordination

- [ ] Source is `sections[key=eventCoordination]`.
- [ ] Exactly five event phases render in authored order.
- [ ] Flow remains semantic text.
- [ ] Mobile narrative/flow precedes media.
- [ ] `v-class-outside-wedding-day.webp` renders through Astro's asset pipeline.
- [ ] Media uses an intentional `object-cover` crop and semantic radius.
- [ ] Media has no text overlay or surrounding card.
- [ ] Arranged waiting is not presented as automatic/unlimited waiting.
- [ ] Sequence does not imply a universal event timetable.

## J. Fleet

- [ ] Exactly four locked vehicle IDs are requested.
- [ ] Vehicle facts come from canonical fleet data.
- [ ] Event-role labels come from `content/ui`.
- [ ] Role-label keys have SR/EN/RU parity.
- [ ] No page-local capacity, luggage, class, pricing, or equipment data exists.
- [ ] Role copy does not guarantee a model before confirmation.

## K. Standards

- [ ] Source is `sections[key=standards]`.
- [ ] Five rows render when all canonical gates are active.
- [ ] Professional chauffeur is data-gated.
- [ ] Discretion is data-gated.
- [ ] Multi-vehicle organisation is data-gated.
- [ ] Waiting/return is data-gated and explicitly described as arranged/confirmed.
- [ ] Manual confirmation follows canonical booking-confirmation state.
- [ ] Generic luxury amenity marketing does not render.
- [ ] Standards are not five floating dashboard cards.
- [ ] At 1024 px and above, Standards use the locked 5/7 split.

## L. Process

- [ ] Source is `sections[key=process]`.
- [ ] Exactly three steps render in authored order.
- [ ] Section remains dark and compact.
- [ ] Heading/intro remain on the open dark background.
- [ ] Steps render inside one shared light panel, not individual cards.
- [ ] At 320 and 768 px, the panel uses one column and horizontal internal dividers.
- [ ] At 1024 px and above, the panel uses three equal columns and vertical internal dividers.
- [ ] Process states that basic event details are enough to start.
- [ ] Process does not require the visitor to know vehicle count before enquiry.
- [ ] No instant-confirmation wording exists.

## M. FAQ

- [ ] Exactly six localized questions render.
- [ ] FAQ is the only large light region.
- [ ] FAQ covers service selection, multi-vehicle organisation, guest/group transport, waiting/return, schedule changes, and manual confirmation.
- [ ] Multi-vehicle answers remain capability-specific.
- [ ] Waiting/return answers state that they require arrangement/confirmation.
- [ ] Accordion remains keyboard accessible.
- [ ] Visible FAQ items and FAQPage structured data use the same validated source array.
- [ ] No `Event` schema is emitted.

## N. Final CTA

- [ ] Existing `FinalCTA` is reused.
- [ ] Primary CTA uses event/booking flow.
- [ ] Secondary CTA uses Request a Quote.
- [ ] Verified phone/email come from canonical contact data as tertiary contacts.
- [ ] Contact details are absent from page content.
- [ ] CTA copy explains that date, locations, approximate timing, passenger count, and event type are enough to start.
- [ ] Visitor is not required to choose a vehicle before initial enquiry.
- [ ] Final CTA does not reach Hero scale.

## O. Booking-flow architecture

- [ ] Existing `booking` and `quote` flow targets are preserved.
- [ ] No page-local booking form is created.
- [ ] No temporary booking route is created.
- [ ] No duplicated form state or client island is introduced.
- [ ] Existing canonical unresolved-flow behavior remains intact until the real booking workflow exists.

## P. Theme

- [ ] H1/H2 computed font resolves to Inter Tight.
- [ ] Body/UI computed font resolves to Manrope.
- [ ] Styling consumes semantic Theme V2 tokens.
- [ ] No raw page-local palette, spacing scale, radius scale, or type scale exists.
- [ ] No gold-first, floral-theme, blue-corporate, glow, chrome, or metallic-gradient treatment exists.
- [ ] Photography does not create an alternate wedding color theme.

## Q. Responsive

- [ ] 320×568 passes topology, content order, image behavior, CTA placement, overflow, focus order, and target size.
- [ ] 768×1024 passes the same assertions.
- [ ] At 768 px, Wedding spans the first service row and Prom/VIP share the second row.
- [ ] At 768 px, Service Scope, Event Coordination, Standards, and Process preserve tablet-specific stacked topology.
- [ ] 1024×768 passes the same assertions.
- [ ] At 1024 px and above, services use three columns, Scope uses 5/7, Coordination uses 7/5, Standards use 5/7, and Process uses one three-column light strip.
- [ ] 1440×900 passes the same assertions.
- [ ] 1920×1080 passes the same assertions.
- [ ] Wide desktop remains container-capped.
- [ ] No accidental page-level horizontal overflow exists.

## R. Accessibility

- [ ] Exactly one H1 exists.
- [ ] Heading order is logical.
- [ ] All interactive targets meet 44×44 CSS px.
- [ ] All controls/links are keyboard operable.
- [ ] Focus-visible treatment is clear on dark and light surfaces.
- [ ] No essential information depends on hover.
- [ ] Decorative image alt behavior is correct.
- [ ] Event flow is available as semantic text.
- [ ] Reduced motion removes non-essential motion.
- [ ] Direction-sensitive CSS uses logical properties.

## S. Architecture

- [ ] Existing Special Events renderer remains wired through `ContentPageRenderer`.
- [ ] Shared primitives are reused when their contracts fit.
- [ ] Page-local components represent real semantic regions only.
- [ ] Business page-local components are not imported into Special Events.
- [ ] Business V2 is not refactored merely to force shared abstraction.
- [ ] No generic `HubPage` abstraction is introduced.
- [ ] Existing hub/content schema is used unchanged.
- [ ] No generated file is manually edited.
- [ ] No manual localized URL construction exists.
- [ ] No unnecessary dependency or client island is added.

## T. SEO/indexability

- [ ] Localized title/description are unique for Special Events.
- [ ] Wedding, Prom, and VIP links are crawlable localized internal links.
- [ ] Fleet CTA is a localized internal link.
- [ ] Canonical/hreflang behavior remains foundation-owned.
- [ ] No fake offers, prices, reviews, ratings, or event listings are emitted.
- [ ] No old `noindex: true` remains in final installed V2 content.

## U. Verification

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

## V. Prom temporary asset handoff

- [ ] Completion report explicitly states whether `v-class-interior.webp` remains the temporary Prom card asset.
- [ ] Future Prom asset replacement is isolated to the Prom media mapping.
- [ ] Replacing the Prom asset does not alter copy, capability data, layout, CTA, or responsive behavior.
