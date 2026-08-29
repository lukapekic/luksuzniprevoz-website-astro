# Conference / Congress Transportation v1 — Acceptance Contract

Status: **RELEASE GATE / PASS-FAIL**

Route key: `conferenceCongressTransportation`

Every item below is mandatory unless explicitly marked as a publication-only check.

---

# A. Repository authority

- [ ] Root `AGENTS.md` was read and followed.
- [ ] `DESIGN.md` was read and followed.
- [ ] The `conference-congress-transportation` surface resolves through `design:context` and the configured active-theme design snapshot is current.
- [ ] `compliance-matrix.md` exists and maps every blueprint section to source data, component and validation evidence.
- [ ] No production decision contradicts current canonical data.

---

# B. Route and renderer

- [ ] `conferenceCongressTransportation` remains a child of `businessTransportation`.
- [ ] Existing localized slugs remain unchanged.
- [ ] No route path is hardcoded in Conference components/content.
- [ ] `ContentPageRenderer.astro` dispatches `conferenceCongressTransportation` to the dedicated Conference renderer when content is `pageType: service`.
- [ ] No new dispatcher exists.
- [ ] Publication remains gated until all implementation acceptance checks pass.

---

# C. Canonical service facts

The page renderer fails loud unless all are true:

- [ ] `pricingMode` is exactly quote-only.
- [ ] `airportArrivals === true`.
- [ ] `hotelTransfers === true`.
- [ ] `venueShuttles === true`.
- [ ] `multiVehicleSchedules === true`.
- [ ] `individualExecutiveTransfers === true`.
- [ ] `groupTransport === true`.
- [ ] `vehicleRoles.individualExecutive` is exactly S-Class then E-Class.
- [ ] `vehicleRoles.smallerGroup` is exactly V-Class 7+1 Extra Long.
- [ ] `vehicleRoles.largerGroup` is exactly Sprinter.
- [ ] Page components obtain these relationships from `services.ts`, not Markdown, UI JSON or page-local constants.
- [ ] manual confirmation is asserted from canonical contact data.
- [ ] specific confirmed-model wording is backed by canonical operations data.

Forbidden-claim checks:

- [ ] No SR copy promises airport departure or airport return.
- [ ] No EN copy promises airport departure or airport return.
- [ ] No RU copy promises airport departure or airport return.
- [ ] No copy promises multi-day event support.
- [ ] No copy promises several hotels in one event.
- [ ] No copy promises a dedicated Conference coordinator.
- [ ] No copy promises live tracking, dispatch status or automatic confirmation.
- [ ] No copy markets security/protection/escort as part of this service.
- [ ] No copy guarantees vehicle quantity or unlimited fleet availability.

---

# D. Localized content

- [ ] SR content is installed as the source locale.
- [ ] EN content is installed and semantically aligned with SR.
- [ ] RU content is installed in natural Cyrillic and semantically aligned with SR.
- [ ] All three content entries use `pageType: service`.
- [ ] All three remain `status: in-review` during implementation.
- [ ] All three remain `noindex: true` during implementation.
- [ ] EN/RU source digests were generated through the repository sync command.
- [ ] No hand-authored stale digest remains.
- [ ] Content validation passes.

Exact content shape:

- [ ] Hero has primary booking CTA and secondary quote CTA.
- [ ] Overview exists.
- [ ] Sections exist in exact key order: `audience`, `eventJourney`, `passengerMovement`, `multiVehicle`.
- [ ] Audience has exactly 5 items.
- [ ] Event Journey has exactly 6 items.
- [ ] Event Journey item 6 is the locale-equivalent of **Final transfer**.
- [ ] Passenger Movement has exactly 2 items.
- [ ] Multi Vehicle has exactly 3 items and a booking CTA.
- [ ] Vehicle Recommendations has exactly 4 locked vehicle IDs.
- [ ] FAQ has exactly 9 questions.
- [ ] Final CTA has booking + quote actions.

---

# E. UI dictionaries

- [ ] Conference UI additions are merged into SR dictionary.
- [ ] Conference UI additions are merged into EN dictionary.
- [ ] Conference UI additions are merged into RU dictionary.
- [ ] Key parity is exact across SR/EN/RU.
- [ ] Existing dictionary keys were not removed or replaced.
- [ ] Existing `business.*`, `fleet.*` and shared standard keys are reused where blueprint requires reuse.
- [ ] User-visible component strings do not bypass approved content/UI sources.

---

# F. Visible section order

Exactly:

- [ ] Header.
- [ ] Full-bleed Hero.
- [ ] Four-fact Overview.
- [ ] Five-item Audience rail.
- [ ] Event Journey.
- [ ] Passenger Movement comparison.
- [ ] Multi-Vehicle Event Schedule.
- [ ] Vehicle Recommendations.
- [ ] Service Standards.
- [ ] FAQ.
- [ ] Final CTA.
- [ ] Footer.

Absent:

- [ ] No reviews section.
- [ ] No client-logo section.
- [ ] No pricing table/card.
- [ ] No related-services grid.
- [ ] No generic process section.
- [ ] No gallery.
- [ ] No extra CTA strip.

---

# G. Hero

- [ ] Uses shared `ServiceHero`.
- [ ] Uses `variant="full-bleed"`.
- [ ] BaseLayout uses `overHero=true`.
- [ ] Exact image is `src/assets/shared/other/s-class-hotel-entrance-night.webp`.
- [ ] Image uses empty alt/presentation semantics.
- [ ] No Conference-specific duplicate dark overlay was added.
- [ ] Eyebrow comes from Conference UI key.
- [ ] Exactly three trust markers render.
- [ ] Trust markers concisely cover airport/hotel/event locations, individual/group transport and a multi-vehicle schedule, backed by canonical assertions.
- [ ] Primary CTA resolves through booking flow.
- [ ] Secondary CTA resolves through quote flow.
- [ ] Hero contains no price.
- [ ] Hero crop keeps hotel/arrival context and vehicle legible at all reference widths.
- [ ] H1 and CTA contrast passes WCAG AA over the final crop.

---

# H. Overview

- [ ] Shared `ServiceOverview` is reused.
- [ ] Variant is `numbered-divider-facts`.
- [ ] Surface is `open-dark`.
- [ ] Exactly four facts render in locked order.
- [ ] Desktop topology is 5 / 7.
- [ ] No cards/icons/prices were added.

---

# I. Audience

- [ ] Audience is direct Conference composition, not a speculative shared family component.
- [ ] Exactly five items render in source order.
- [ ] Uses divider-led editorial treatment.
- [ ] No raised cards.
- [ ] No icons.
- [ ] No image.
- [ ] Mobile is one sequence.
- [ ] `md` uses a deliberate two-column layout.
- [ ] `xl` uses three columns.
- [ ] `2xl` uses five segments.

---

# J. BusinessMovementSequence extraction

- [ ] `BusinessMovementSequence.astro` exists under `src/components/services/shared/`.
- [ ] It is derived from the current Delegation movement component rather than reimplemented independently.
- [ ] It accepts a caller-provided unique heading ID.
- [ ] It contains no Delegation-specific strings/data/routes.
- [ ] It requires exactly six stages.
- [ ] It remains static Astro/CSS with no JavaScript.
- [ ] Conference uses it for Event Journey.
- [ ] Delegation uses it after migration.
- [ ] Obsolete `DelegationMovementSequence.astro` is removed when no references remain.
- [ ] Delegation regression check passes visually, semantically and responsively.
- [ ] `components:check` ran before the shared edit and all reported consumers were reviewed.
- [ ] The new shared component has a reviewed contract/registry entry and generated component metadata is synchronized.
- [ ] Exact-target `verify:ui --change component` passes for the shared component.

---

# K. Event Journey

- [ ] Uses the localized `eventJourney` heading and concise introduction; optional body copy does not create repetition.
- [ ] Uses exactly six authored stage items.
- [ ] Uses Conference section label + example label from UI.
- [ ] Exact image is `src/assets/fleet/original/sprinter/interior-entrance.webp`.
- [ ] Image is decorative.
- [ ] Desktop remains 7 / 5.
- [ ] Desktop image height matches the adjacent stepped sequence and is not enlarged by the portrait asset's intrinsic ratio.
- [ ] Conference uses the contained graphite open-split/default treatment without changing Delegation.
- [ ] The sequence explicitly reads as an example/organisation principle, not a fixed route.
- [ ] No time/status/tracking/map UI exists.
- [ ] Final stage is **Final transfer**, not airport departure.

---

# L. Passenger Movement

- [ ] `ConferencePassengerMovement.astro` exists.
- [ ] It is page-local.
- [ ] It renders exactly two roles.
- [ ] It renders no role imagery.
- [ ] It renders no closing shared event-schedule label or flanking rules.
- [ ] Executive vehicle-role label is S-Class · E-Class.
- [ ] Group vehicle-role label is V-Class · Sprinter.
- [ ] Both labels are checked against `conference.vehicleRoles` before render.
- [ ] No prices appear.
- [ ] No capacity value is hardcoded in Markdown/UI/component CSS/markup.
- [ ] If capacities render, they come from `fleet.ts`.
- [ ] Both roles remain vertically stacked at every breakpoint.
- [ ] The light treatment is a contained editorial section.
- [ ] Role items have no outer borders; one horizontal divider separates 01 and 02.
- [ ] Fact spacing remains generous and comfortable without resembling cards.
- [ ] A standard semantic gap separates the contained Journey and Passenger surfaces.
- [ ] Mobile DOM order is logical and stacked.

---

# M. Multi-Vehicle Event Schedule

- [ ] `ConferenceMultiVehicleSchedule.astro` exists.
- [ ] It is page-local.
- [ ] It uses an open-dark editorial treatment.
- [ ] Desktop is 5 / 7.
- [ ] Exactly three movement-role nodes render.
- [ ] The three nodes bind in order to `individualExecutive`, `smallerGroup` and `largerGroup` from `conference.vehicleRoles`.
- [ ] One event-schedule outcome renders as the destination of three divider-led movement lanes, not as a dashboard box.
- [ ] Quiet CTA resolves to booking flow.
- [ ] Connectors are static CSS only.
- [ ] Text remains understandable with connectors removed.
- [ ] No live dots, clocks, driver names, plates, availability indicators, tracking or map controls exist.
- [ ] No dedicated Conference coordinator claim exists.

---

# N. Fleet

Exact vehicle IDs/order:

- [ ] `mercedes-s-class`.
- [ ] `mercedes-e-class`.
- [ ] `mercedes-v-class-7-plus-1-extra-long`.
- [ ] `mercedes-sprinter`.

- [ ] Shared `VehicleRecommendations` is reused.
- [ ] Fleet data/media come from canonical sources.
- [ ] Current canonical passenger capacities resolve as 3 / 3 / 7 / 19 when displayed.
- [ ] Capacity values are not duplicated in page content/UI.
- [ ] Fleet CTA resolves to canonical fleet route.
- [ ] No fare/estimate appears.

---

# O. Standards

- [ ] Shared `ServiceStandards` is reused.
- [ ] Variant is `numbered-matrix`.
- [ ] Surface is `contained-dark`.
- [ ] `buildServiceStandardGroups(locale)` is the source.
- [ ] Exactly 4 groups render.
- [ ] Exactly 3 facts render per group.
- [ ] No Conference-specific standards clone exists.
- [ ] No unsupported staffing/security claim appears.

---

# P. FAQ and structured data

- [ ] FAQ surface is light.
- [ ] `ReadingContainer` is used.
- [ ] Exactly nine questions render.
- [ ] Operational answers use asserted canonical tokens.
- [ ] Visible FAQ receives the resolved `faqItems` array.
- [ ] `buildFaqPage()` receives the exact same resolved `faqItems` array.
- [ ] FAQ keyboard interaction remains accessible.
- [ ] No airport-departure question/answer exists.

---

# Q. Final CTA

- [ ] Shared `FinalCTA` is reused.
- [ ] Exact image is `src/assets/shared/other/v-class-parked-outside.webp`.
- [ ] Image is decorative.
- [ ] Integrated media treatment is used.
- [ ] Primary action is booking.
- [ ] Secondary action is quote.
- [ ] Verified contact data follows the existing shared page pattern.
- [ ] Copy does not imply file upload.
- [ ] Final CTA remains visually subordinate to Hero.

---

# R. Responsive review

Manual review completed at:

- [ ] 320px.
- [ ] 768px portrait.
- [ ] 1024px landscape.
- [ ] 1440px desktop.
- [ ] 1920px wide desktop.
- [ ] Both sides of every applicable `md`, `lg`, `xl` and `2xl` topology transition.

At every state:

- [ ] No horizontal overflow.
- [ ] No clipped text.
- [ ] No orphaned CTA outside its intended section.
- [ ] No unreadable image crop.
- [ ] No excessive empty gap caused by fixed height.
- [ ] No tiny forced columns.
- [ ] Logical DOM/focus order is preserved.
- [ ] Audience topology matches Corporate: 1 default, 2 at `md`, 3 at `xl`, 5 at `2xl`.
- [ ] `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- [ ] CTA destination and placement remain correct.
- [ ] Images have reserved geometry and their intended crop/loading behavior.
- [ ] Long Russian content was checked at 320px and every topology transition.

---

# S. Accessibility

- [ ] Exactly one H1.
- [ ] Heading hierarchy is valid.
- [ ] All actions are keyboard reachable.
- [ ] Focus indication is visible.
- [ ] Interactive targets meet minimum 44×44 requirement.
- [ ] Text/background contrast meets WCAG 2.2 AA.
- [ ] Decorative images use empty alt.
- [ ] No information relies only on colour, line or animation.
- [ ] Reduced-motion behavior remains correct.
- [ ] No inappropriate ARIA duplicates native semantics.

---

# T. Visual/design acceptance

- [ ] Page is unmistakably part of the configured Black & Platinum design system.
- [ ] No arbitrary palette colours were introduced.
- [ ] No new fonts were introduced.
- [ ] Computed H1/H2 use `font-heading`, body/UI/controls use `font-body`, and only `BrandLockup` uses `font-brand` in SR/EN/RU.
- [ ] No card-wall/dashboard aesthetic appears.
- [ ] No glow, glassmorphism or metallic-gradient effect appears.
- [ ] Photography has explicit semantic roles.
- [ ] Conference does not look like a relabelled Corporate page.
- [ ] Conference does not look like a relabelled Delegation page.
- [ ] Event Journey, passenger comparison and multi-vehicle schedule create the page's signature identity.
- [ ] Hero remains the strongest visual moment.
- [ ] Final CTA does not compete with Hero.
- [ ] Hero retains the shared likely-LCP eager/high-priority path; non-Hero editorial media is lazy.
- [ ] Generated image sources and intrinsic dimensions are present, with no avoidable CLS.
- [ ] No page client island was introduced and configured route/image/font/CSS/JS budgets remain satisfied.

---

# U. SEO and technical validation

- [ ] Existing SEO builder is used.
- [ ] Localized title/description come from content.
- [ ] No raw canonical URL is hardcoded.
- [ ] FAQPage is the only page-specific structured-data addition required by this contract.
- [ ] No invented Offer/Product/Event schema exists.
- [ ] Content validation passes.
- [ ] Route validation passes.
- [ ] SEO validation passes.
- [ ] Lint passes.
- [ ] Unit/targeted tests pass.
- [ ] Production build passes.
- [ ] Repository governance/design checks required by `AGENTS.md` pass.

---

# V. Cross-page regression

Because this task extracts a Delegation component:

- [ ] Delegation page still renders.
- [ ] Delegation movement content is unchanged.
- [ ] Delegation movement responsive topology is unchanged.
- [ ] Delegation accessibility semantics are unchanged or improved without content change.
- [ ] Delegation route/SEO/content validation still passes.
- [ ] Corporate page is visually and technically unaffected.
- [ ] Business Hub is unaffected.

---

# W. Publication gate

Implementation is complete before publication only when A–V pass.

For release:

- [ ] Owner manually approves final visual result.
- [ ] Translation/content review is complete.
- [ ] Route availability is explicitly changed from scaffold to published.
- [ ] `noindex`/status are changed only according to repository publication rules.
- [ ] Full validation/build is re-run after publication-state changes.

Any failed checkbox blocks publication.
