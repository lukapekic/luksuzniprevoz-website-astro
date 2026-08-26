# Airport Transportation — Acceptance Contract

Status: **Required completion gate**  
Route key: `airportTransportation`

The page is not approved until every applicable item passes.

---

# 1. Authority

- [ ] `AGENTS.md` read.
- [ ] `DESIGN.md` read.
- [ ] shared agent foundation read.
- [ ] component reuse registry read.
- [ ] Airport blueprint read.
- [ ] Airport wireframe read.
- [ ] shared service contracts read.
- [ ] `.skills/functional-ui.md` read.
- [ ] matching required skills loaded.
- [ ] `pnpm design:context site/luksuzni-prevoz` ran successfully before UI work.

---

# 2. Shared reuse

Reused:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `OpenSplitSection`
- [ ] `FAQ`
- [ ] `FinalCTA`
- [ ] `Section`
- [ ] `PageContainer`
- [ ] `ReadingContainer`
- [ ] `SectionHeading`
- [ ] `Link`
- [ ] `Button`
- [ ] `Field/Input/Select` if real fields are activated
- [ ] `BaseLayout`
- [ ] `SiteHeader`
- [ ] `SiteFooter`
- [ ] existing CTA/routing helpers

No Airport-local clone substitutes for these.

---

# 3. New-component budget

Expected:

```text
AirportTransportationPage.astro
AirportBookingBlock.astro
```

Infrastructure change:

```text
ContentPageRenderer.astro mapping
```

- [ ] Every additional component is reported.
- [ ] Every additional component has a semantic/structural justification.
- [ ] No Airport-specific wrapper simply renames a shared primitive.
- [ ] No `ArrivalHandling.astro` exists without explicit justification.
- [ ] No `PrivateAviationFeature.astro` exists without explicit justification.
- [ ] No Airport-specific field/control family exists.

---

# 4. Renderer / dispatcher

- [ ] Airport no longer renders through generic prose-only `LeafPage`.
- [ ] `AirportTransportationPage` exists.
- [ ] Existing `ContentPageRenderer` is reused.
- [ ] Dispatcher includes `airportTransportation`.
- [ ] Private Chauffeur mapping remains intact if already implemented.
- [ ] Other unimplemented pages still fall back to `LeafPage`.
- [ ] No second dispatcher exists.
- [ ] No duplicate route conditionals were added to locale catch-all files.
- [ ] No manual localized path construction exists.

---

# 5. Page order

Exact visible order:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `AirportBookingBlock`
- [ ] Arrival Handling & Flight Tracking
- [ ] Private Aviation / FBO
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `FAQ`
- [ ] `FinalCTA`

Global:

- [ ] approved `SiteHeader`
- [ ] approved `SiteFooter`

Must not appear:

- [ ] no booking form in Hero
- [ ] no reviews carousel
- [ ] no client-logo strip
- [ ] no Homepage TrustStrip
- [ ] no separate Airport pricing table
- [ ] no separate Private Aviation service page
- [ ] no duplicate closing CTA
- [ ] no unrelated service-card grid

---

# 6. Hero

- [ ] Shared `ServiceHero`.
- [ ] Variant is `contained`.
- [ ] Remains contained at mobile/tablet/desktop.
- [ ] Exactly one H1.
- [ ] Primary Airport booking CTA.
- [ ] Secondary quote CTA when authored.
- [ ] No calculator/form.
- [ ] No fare.
- [ ] No fleet specs.
- [ ] No rating.
- [ ] No trust chips.
- [ ] Airport/chauffeur image remains transportation-led.
- [ ] Crop/scrim reviewed at all responsive states.

---

# 7. Overview

- [ ] Shared `ServiceOverview`.
- [ ] Uses divider-led facts rather than cards.
- [ ] Editorial body comes from content.
- [ ] Capability truth comes from `services.ts`.
- [ ] No unsupported Airport feature appears.
- [ ] No duplicated factual literals in component code.

Verified state can include only supported facts such as:

- [ ] Belgrade Nikola Tesla scope
- [ ] one-way capability
- [ ] return capability
- [ ] point-to-point standard stops
- [ ] meet & greet
- [ ] flight tracking
- [ ] luggage assistance
- [ ] name sign
- [ ] waiting allowance

---

# 8. Airport pricing — hard rejection gate

All must be true:

- [ ] no fixed Airport fare value
- [ ] no estimated Airport fare value
- [ ] no "from" Airport fare
- [ ] no per-km-derived Airport fare
- [ ] no hourly-derived Airport fare
- [ ] no EUR inference
- [ ] no RSD inference
- [ ] no currency symbol inference
- [ ] no fake zero price
- [ ] no placeholder price
- [ ] no copied old-site Airport price
- [ ] no duplicated excluded spreadsheet value

Fail immediately if any unsupported price appears.

---

# 9. AirportBookingBlock — current repository mode

- [ ] Component exists as the page-specific functional composition.
- [ ] Uses one coherent light functional parent.
- [ ] Does not resemble a dashboard.
- [ ] Communicates trip-detail categories the team needs.
- [ ] Communicates current booking/quote commercial path.
- [ ] Communicates manual confirmation quietly and clearly.
- [ ] Uses existing authored booking/quote CTAs.
- [ ] Uses `resolveCtaHref()`.
- [ ] Does not label current state Fixed.
- [ ] Does not label current state Estimated.
- [ ] Does not display a fare.

## Dead-control hard gate

Unless a real state-preserving booking handoff has been implemented and validated:

- [ ] no pickup input
- [ ] no drop-off input
- [ ] no date input
- [ ] no time input
- [ ] no vehicle select
- [ ] no one-way/return interactive control
- [ ] no submit button for a non-submitting form
- [ ] no localStorage handoff
- [ ] no sessionStorage handoff
- [ ] no invented query-string handoff
- [ ] no client-side calculator state

The production page must not collect data it cannot carry forward.

---

# 10. Future-field activation gate

If real fields are present because repository capabilities changed:

- [ ] validated booking handoff exists.
- [ ] receiving flow preserves submitted selection.
- [ ] `Field` reused.
- [ ] `Input` reused.
- [ ] `Select` reused.
- [ ] approved `Button` reused.
- [ ] every field has a real label.
- [ ] placeholder is not the label.
- [ ] errors are textual and not color-only.
- [ ] result follows required inputs on mobile.
- [ ] Fixed state has authoritative Airport price data.
- [ ] Quote state remains distinct.
- [ ] Estimated exists only if newly supported by authoritative data.
- [ ] manual confirmation remains explicit.
- [ ] no Airport-specific control clone exists.

---

# 11. Arrival Handling & Flight Tracking

- [ ] Direct composition uses `OpenSplitSection`.
- [ ] Desktop media 7 / content 5.
- [ ] Mobile content first / media second.
- [ ] `flightTracking` from `services.ts`.
- [ ] `meetAndGreet` from `services.ts`.
- [ ] `luggageAssistance` from `services.ts`.
- [ ] `nameSign` from `services.ts`.
- [ ] waiting minutes read from `services.ts`.
- [ ] "60" is not hardcoded as a component fact.
- [ ] no unlimited-wait claim.
- [ ] no guarantee beyond verified data.
- [ ] no Arrival feature cards.
- [ ] no Airport-specific split component.

---

# 12. Private Aviation / FBO

- [ ] Direct composition uses existing Section/container/split primitives.
- [ ] Contained/elevated feature remains subordinate to main Airport service.
- [ ] `privateAviation` fact comes from `services.ts`.
- [ ] `commercialAviation` fact comes from `services.ts`.
- [ ] `fboCoordination` fact comes from `services.ts`.
- [ ] No security/bodyguard claim.
- [ ] No guaranteed apron/private-terminal access claim.
- [ ] No aviation operations claim.
- [ ] No new service page was created.
- [ ] Quote CTA reuses existing page CTA contract where used.
- [ ] VIP relationship uses approved route helpers when shown.

---

# 13. Vehicle Recommendations

- [ ] Shared `VehicleRecommendations`.
- [ ] IDs come from page content.
- [ ] Canonical facts come from `fleet.ts`.
- [ ] capacity shown only from canonical data.
- [ ] class labels localized through approved UI strings.
- [ ] no Airport fare.
- [ ] no invented luggage capacity.
- [ ] no invented vehicle feature.
- [ ] no Homepage FleetShowcase clone.
- [ ] missing image state follows shared placeholder contract.
- [ ] Fleet CTA uses route helpers.

---

# 14. Service Standards

- [ ] Shared `ServiceStandards`.
- [ ] General facts come from `operations.ts`.
- [ ] Airport supplements come from verified `services.ts`.
- [ ] Does not duplicate the full Arrival Handling section.
- [ ] No cards/badge wall.
- [ ] No internal enum values displayed directly.
- [ ] No security-service marketing.

---

# 15. FAQ

- [ ] Existing shared `FAQ`.
- [ ] Page owns Section/container/heading.
- [ ] `ReadingContainer` used.
- [ ] Content supplies FAQ.
- [ ] Visible FAQ and FAQ schema use same array.
- [ ] No duplicate FAQ data.
- [ ] No second accordion.
- [ ] Keyboard accessible.

---

# 16. Final CTA

- [ ] Existing shared `FinalCTA`.
- [ ] No Airport visual variant.
- [ ] No second-Hero scale.
- [ ] No page-local gradient.
- [ ] No page-local radius.
- [ ] Contact channels remain verification-gated.
- [ ] CTA targets use existing routing/flow behavior.

---

# 17. Contact / booking policy

Where relevant:

- [ ] public minimum lead-time truth comes from `contact.ts`.
- [ ] no last-minute marketing claim.
- [ ] no public 24/7 support claim.
- [ ] no instant confirmation claim.
- [ ] office/support claims come from canonical data.
- [ ] verified phone/email only are rendered.
- [ ] no fake WhatsApp link exists when value is null.

---

# 18. Content

Expected locale content:

- [ ] Serbian Airport content entry
- [ ] English Airport content entry
- [ ] Russian Airport content entry

Each:

- [ ] `routeKey: airportTransportation`
- [ ] `pageType: service`
- [ ] valid locale/lifecycle
- [ ] valid SEO
- [ ] Hero
- [ ] overview
- [ ] `booking` section
- [ ] `arrivalHandling` section
- [ ] `privateAviationFbo` section
- [ ] vehicle recommendations
- [ ] FAQ
- [ ] Final CTA

Content must not duplicate:

- [ ] Airport capabilities
- [ ] waiting minutes
- [ ] Airport fare
- [ ] currency
- [ ] fleet capacity
- [ ] contact data
- [ ] lead time
- [ ] route URLs

If approved content is not included in implementation, declare it as a blocker.

---

# 19. UI strings

- [ ] Existing reusable labels reused first.
- [ ] New Airport labels added only when needed.
- [ ] All configured locales have parity.
- [ ] No hardcoded English in reusable/page components.
- [ ] No agent-invented Serbian/Russian translation.
- [ ] Data controls state; UI strings only control presentation wording.

---

# 20. CTA / routing

- [ ] `resolveCtaHref()` reused.
- [ ] Internal routes use `RouteKey`/`Link`/`getPath()`.
- [ ] No `/en/` string construction.
- [ ] No `/ru/` string construction.
- [ ] No new booking route invented.
- [ ] No Airport-local CTA resolver.
- [ ] Current booking/quote flows still use supported interim handoff.

---

# 21. SEO

- [ ] Existing SEO builder reused.
- [ ] One H1 only.
- [ ] No component emits `<head>`.
- [ ] SEO title localized.
- [ ] SEO description localized.
- [ ] canonical intact.
- [ ] hreflang intact.
- [ ] lifecycle/noindex intact.
- [ ] no raw localized URLs.

---

# 22. Structured data

- [ ] Approved builders reused.
- [ ] FAQ schema equals visible FAQ.
- [ ] no invented Airport price in schema.
- [ ] no invented currency in schema.
- [ ] no duplicated route URL.
- [ ] no duplicated Airport operational facts.
- [ ] no ad-hoc schema object where approved helper exists.

---

# 23. Theme / CSS

- [ ] active theme resolved through site config.
- [ ] no theme fallback added.
- [ ] no raw color literals.
- [ ] no local palette.
- [ ] no local spacing scale.
- [ ] no local radius scale.
- [ ] no local breakpoint system.
- [ ] no wireframe CSS copied.
- [ ] no Tailwind v3 regression.
- [ ] no gold-first luxury styling.
- [ ] no glass.
- [ ] no glow.
- [ ] no dashboard shadow system.
- [ ] no routine hover lift.
- [ ] functional block uses semantic light/input tokens.

---

# 24. Typography

Computed browser verification:

- [ ] H1 approved heading font.
- [ ] H2 approved heading font.
- [ ] body approved body font.
- [ ] controls approved UI/body font if functional controls exist.
- [ ] navigation approved.
- [ ] CTA approved.
- [ ] brand font does not leak into page typography.

---

# 25. Accessibility

- [ ] WCAG 2.2 AA baseline.
- [ ] one H1.
- [ ] heading hierarchy.
- [ ] semantic sections.
- [ ] 44×44 target minimum.
- [ ] visible focus.
- [ ] no horizontal overflow.
- [ ] reduced motion.
- [ ] image alt semantics correct.
- [ ] light surface contrast compliant.
- [ ] FAQ keyboard accessible.
- [ ] result state has textual meaning, not color-only.
- [ ] if fields exist, every control is labelled.
- [ ] if fields exist, errors are associated and textual.
- [ ] no ARIA replacement for native semantics.

---

# 26. Responsive review

Review independently:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

## Mobile

- [ ] contained Hero works.
- [ ] Hero CTAs stack cleanly.
- [ ] AirportBookingBlock stacks detail requirements → state → actions.
- [ ] no dead-control UI.
- [ ] Arrival copy comes before media.
- [ ] FBO feature remains compact/subordinate.
- [ ] vehicle names wrap.
- [ ] FAQ summaries wrap.
- [ ] no horizontal overflow.

## Tablet portrait

- [ ] Booking block does not mimic dense desktop grid.
- [ ] Arrival split transforms intentionally.
- [ ] FBO feature remains readable.
- [ ] vehicle section does not become cramped.

## Tablet landscape

- [ ] booking zones use width sensibly.
- [ ] Arrival 7/5 intent emerges cleanly.
- [ ] no awkward empty surface regions.

## Desktop

- [ ] Hero contained.
- [ ] Booking functional composition is coherent, not dashboard-like.
- [ ] Arrival media 7 / copy 5.
- [ ] FBO feature remains secondary.
- [ ] no unsupported calculator state.

## Wide desktop

- [ ] semantic containers cap content.
- [ ] media remains controlled.
- [ ] text measure stays readable.
- [ ] functional panel does not become excessively wide/sparse.

---

# 27. Image / performance

- [ ] approved Astro image pipeline.
- [ ] Hero image appropriate for LCP.
- [ ] image dimensions/aspects avoid CLS.
- [ ] responsive image delivery where applicable.
- [ ] focal points honored.
- [ ] no remote random stock.
- [ ] no redesign due missing assets.
- [ ] no unnecessary client JS.

---

# 28. JavaScript / functional behavior

Current handoff mode:

- [ ] zero unnecessary client JS.
- [ ] no fake calculator.
- [ ] no fake loading state.
- [ ] no dead form.
- [ ] no local client-side storage scheme.

If functional mode was legitimately activated:

- [ ] state architecture documented.
- [ ] validation documented.
- [ ] result-state transitions documented.
- [ ] booking handoff documented.
- [ ] pending-confirmation behavior documented.
- [ ] `client:*` justification present when required.
- [ ] reduced motion respected.

---

# 29. Automated validation

Minimum:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm design:guard
```

Run additional required project gates as scope/policy requires:

```bash
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm test:a11y
```

Record actual results.

---

# 30. Manual visual review

Record:

```text
mobile              PASS / FAIL / NOT RUN
tablet portrait     PASS / FAIL / NOT RUN
tablet landscape    PASS / FAIL / NOT RUN
desktop             PASS / FAIL / NOT RUN
wide desktop        PASS / FAIL / NOT RUN

font verification   PASS / FAIL / NOT RUN
keyboard review     PASS / FAIL / NOT RUN
focus review        PASS / FAIL / NOT RUN
image crop review   PASS / FAIL / NOT RUN
overflow review     PASS / FAIL / NOT RUN
functional review   PASS / FAIL / NOT RUN
```

---

# 31. Immediate rejection conditions

Reject if any is true:

- Airport still uses generic `LeafPage`.
- shared service components were cloned.
- an Airport fare was fabricated.
- currency was inferred.
- pricing was derived from `pricing.ts` chauffeur values.
- dead form fields were shipped.
- collected values are discarded during handoff.
- fake Fixed/Estimated state exists.
- waiting allowance is hardcoded in component logic.
- Airport capabilities are copied into component literals.
- last-minute/24-7/instant-confirmation claim appears.
- Arrival split was reinvented.
- Private Aviation became a separate page without blueprint change.
- FBO copy implies security/aviation access beyond verified capability.
- localized routes are string-built.
- page-specific controls duplicate foundation primitives.
- raw theme values were introduced.
- wireframe CSS was copied.
- responsive review was skipped.
- blockers were hidden.

---

# 32. Required completion report

```text
AIRPORT TRANSPORTATION IMPLEMENTATION REPORT

STATUS:
PASS / PARTIAL / BLOCKED

FILES CREATED:
-

FILES MODIFIED:
-

REUSED SHARED COMPONENTS:
-

NEW COMPONENTS:
-

WHY EACH NEW COMPONENT WAS REQUIRED:
-

PAGE-LOCAL COMPOSITIONS:
-

NEW SHARED VARIANTS:
-

DATA SOURCES USED:
-

AIRPORT PRICING STATE:
-

BOOKING HANDOFF STATE:
-

FUNCTIONAL UI MODE:
handoff-only / validated-interactive

CONTENT / UI STRING STATUS:
-

RESPONSIVE REVIEW:
mobile:
tablet portrait:
tablet landscape:
desktop:
wide desktop:

ACCESSIBILITY REVIEW:
-

COMMANDS RUN:
command → result

DESIGN DETECTOR:
-

SITE CHECK:
-

SITE BUILD:
-

BLUEPRINT DEVIATIONS / DATA-GATED ADAPTATIONS:
-

SHARED COMPONENT BLOCKERS:
-

FUNCTIONAL BLOCKERS:
-

CONTENT BLOCKERS:
-

KNOWN TODOs:
-
```

A generic "done" response is not an acceptable handoff.
