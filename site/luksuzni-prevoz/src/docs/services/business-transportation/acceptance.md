# Business Transportation — Acceptance Contract

Status: **Required completion gate**  
Route key: `businessTransportation`  
Page type: `hub`

Do not approve the implementation until every applicable item passes.

---

# 1. Authority

- [ ] `AGENTS.md` read.
- [ ] `DESIGN.md` read.
- [ ] shared agent foundation read.
- [ ] reuse registry read.
- [ ] Business blueprint read.
- [ ] Business wireframe read.
- [ ] shared service contracts read.
- [ ] `.skills/functional-ui.md` read.
- [ ] matching required skills loaded.
- [ ] `pnpm design:context site/luksuzni-prevoz` ran successfully.

---

# 2. Hub identity

- [ ] Renderer treats `businessTransportation` as `hub`.
- [ ] Content uses `pageType: hub`.
- [ ] Hub is not treated as a direct service.
- [ ] Child capabilities are resolved from child service entries.
- [ ] No hub component literal duplicates child-service facts.
- [ ] No generic service-page schema is used in place of hub schema.

---

# 3. Shared reuse

Reused:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `ServiceCard`
- [ ] `OpenSplitSection`
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `FAQ`
- [ ] `FinalCTA`
- [ ] `Section`
- [ ] `PageContainer`
- [ ] `ReadingContainer`
- [ ] `SectionHeading`
- [ ] `Link`
- [ ] `Button`
- [ ] `BaseLayout`
- [ ] `SiteHeader`
- [ ] `SiteFooter`
- [ ] route/CTA helpers

No Business-local clone substitutes for them.

---

# 4. New-component budget

Expected:

```text
BusinessTransportationPage.astro
BusinessServiceSelector.astro
BusinessCommercialPaths.astro
```

- [ ] Every extra component is reported.
- [ ] Every extra component is justified.
- [ ] No `BusinessCoordination.astro` without explicit need.
- [ ] No `TrustedClients.astro` without explicit need.
- [ ] No Business-specific ServiceCard clone.
- [ ] No Business-specific FinalCTA/FAQ/Fleet clone.
- [ ] No wrapper exists only to rename Section/container.

---

# 5. Dispatcher

- [ ] Dedicated Business renderer exists.
- [ ] Shared `ContentPageRenderer` is reused.
- [ ] Business mapping added.
- [ ] Private mapping preserved if present.
- [ ] Airport mapping preserved if present.
- [ ] Other unimplemented routes retain `LeafPage` fallback.
- [ ] No duplicate dispatcher.
- [ ] No duplicate locale route conditions.
- [ ] No manual localized URLs.

---

# 6. Page order

Exact visible order:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `BusinessServiceSelector`
- [ ] One-off vs Recurring
- [ ] Coordination / Multi-Vehicle
- [ ] Trusted Clients when safe/displayable
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `FAQ`
- [ ] `FinalCTA`

Global:

- [ ] approved `SiteHeader`
- [ ] approved `SiteFooter`

Must not appear:

- [ ] no reviews carousel
- [ ] no Homepage TrustStrip
- [ ] no business pricing grid
- [ ] no form in Hero
- [ ] no unrelated fourth child-service card
- [ ] no security-service block
- [ ] no duplicate closing CTA
- [ ] no generic process section

---

# 7. Hero

- [ ] shared `ServiceHero`.
- [ ] variant `contained`.
- [ ] remains contained at all responsive states.
- [ ] exactly one H1.
- [ ] concise Business proposition.
- [ ] primary business inquiry/booking action.
- [ ] secondary quote action when authored.
- [ ] no client logos.
- [ ] no rate grid.
- [ ] no form.
- [ ] no fleet specs.
- [ ] image remains transportation-led.
- [ ] no generic office-only stock treatment.

---

# 8. Service Overview

- [ ] shared `ServiceOverview`.
- [ ] explains coordinated Business capability.
- [ ] hub facts come from `services.ts`.
- [ ] outside-normal-coverage quote behavior comes from data.
- [ ] does not flatten every child capability into badges.
- [ ] divider-led presentation.
- [ ] no feature-card grid.
- [ ] no factual literals copied into component code.

---

# 9. Business child-service parity — hard gate

Canonical children from `services.ts` are:

- [ ] `corporateTransportation`
- [ ] `delegationTransportation`
- [ ] `conferenceCongressTransportation`

Implementation:

- [ ] reads canonical children from hub service data.
- [ ] does not hardcode the child array in the component.
- [ ] indexes content items by route key.
- [ ] every canonical child has exactly one localized item.
- [ ] no unrelated route appears in `childServices.items`.
- [ ] render order follows canonical service order.
- [ ] parity mismatch fails/reports blocker instead of silently rendering drift.

---

# 10. BusinessServiceSelector

- [ ] page-specific selector exists.
- [ ] shared `ServiceCard` is used for each child.
- [ ] no Business card visual system exists.
- [ ] image-led composition preserved.
- [ ] title comes from localized content.
- [ ] description comes from localized content.
- [ ] CTA label comes from localized content.
- [ ] route target comes from canonical child relationship.
- [ ] CTA is card's only interactive element.
- [ ] entire card is not an ambiguous click target.
- [ ] no manually authored href.
- [ ] missing image uses ServiceCard placeholder contract.
- [ ] no remote/fake stock URL added.

---

# 11. One-off vs Recurring

- [ ] `BusinessCommercialPaths` exists.
- [ ] one light functional parent.
- [ ] two paths separated structurally.
- [ ] not two floating pricing cards.

## One-off

- [ ] derives support from `corporateTransportation.supportsOneOff`.
- [ ] does not display a numeric estimate without approved estimator.
- [ ] inquiry/estimate wording is localized.

## Recurring

- [ ] contracts claim requires `supportsRecurringContracts`.
- [ ] invoicing claim requires `supportsInvoicing`.
- [ ] negotiated pricing claim requires `supportsNegotiatedPricing`.
- [ ] dedicated chauffeur claim requires canonical support.
- [ ] no public discount/rate invented.
- [ ] no automatic contract approval claim.
- [ ] no instant account setup claim.

CTA hierarchy:

- [ ] page's primary conversion remains dominant.
- [ ] recurring/quote action remains appropriately secondary unless blueprint/content explicitly directs otherwise.

---

# 12. Business pricing — hard rejection gate

- [ ] no public Business fare number.
- [ ] no ad-hoc per-km multiplication.
- [ ] no locally implemented estimator.
- [ ] no inferred currency.
- [ ] no fake Estimated result.
- [ ] no public negotiated rate.
- [ ] no "from" amount invented.
- [ ] complex/multi-vehicle work routes to quote.
- [ ] outside-normal-coverage work routes to quote.

Fail if numeric commercial results were created without an approved calculation contract.

---

# 13. Coordination / Multi-Vehicle

- [ ] direct composition uses `OpenSplitSection`.
- [ ] desktop media 7 / copy 5.
- [ ] mobile copy first / media second.
- [ ] multiple vehicles fact comes from Delegation data.
- [ ] mixed classes fact comes from Delegation data.
- [ ] dedicated coordinator fact comes from Delegation data.
- [ ] airport arrivals fact comes from Conference data where shown.
- [ ] hotel transfers fact comes from Conference data where shown.
- [ ] venue shuttles fact comes from Conference data where shown.
- [ ] multi-vehicle schedules fact comes from Conference data where shown.
- [ ] individual executive transfers fact comes from Conference data where shown.
- [ ] group transport fact comes from Conference data where shown.
- [ ] no new Business-specific split primitive.

---

# 14. Security hard gate

Current canonical state:

```text
delegationTransportation.securityService = false
```

All must remain absent:

- [ ] no security service
- [ ] no bodyguard
- [ ] no close protection
- [ ] no security driver
- [ ] no protective transport
- [ ] no armed protection
- [ ] no unarmed protection
- [ ] no VIP protection claim

Professional chauffeurs/discretion/coordination are not described as security.

---

# 15. Trusted Clients — route policy

- [ ] `shouldDisplayClientsOn("businessTransportation")` is checked.
- [ ] roster comes from `clients.ts`.
- [ ] client names are not hardcoded.
- [ ] proper names are not translated.
- [ ] client count is not hardcoded.
- [ ] layout handles current eligible count.

---

# 16. Trusted Clients — logo policy hard gate

Before any logo renders:

- [ ] real `logoAsset` exists.
- [ ] public logo permission policy is satisfied.
- [ ] logo status is safe under current repository rules.
- [ ] no web-downloaded logo substitutes for missing asset.
- [ ] no generated fake logo.
- [ ] no text styled to impersonate a logo.
- [ ] no production dashed wireframe placeholder.

Current live-repo expectation:

- [ ] no logo renders while all `logoAsset` values are null.

---

# 17. Trusted Clients — safe fallback

If route policy allows roster display but logos are unavailable:

- [ ] restrained text-name rendering is used only if current policy permits.
- [ ] canonical `displayName` values used.
- [ ] no endorsement text invented.
- [ ] no relationship claim invented.
- [ ] Qatar Airways context is not broadened beyond canonical private-flight-related transport.
- [ ] section omitted cleanly if public name display is considered blocked.
- [ ] any omission is reported as a Client Display Blocker.

No empty Trusted Clients shell should ship.

---

# 18. Vehicle Recommendations

- [ ] shared `VehicleRecommendations`.
- [ ] IDs come from localized page content.
- [ ] canonical facts come from `fleet.ts`.
- [ ] capacity shown only from canonical data.
- [ ] vehicle class localized via approved UI strings.
- [ ] no Business fare.
- [ ] no invented luggage/equipment facts.
- [ ] no Homepage FleetShowcase clone.
- [ ] full Fleet CTA uses route helpers.

---

# 19. Service Standards

- [ ] shared `ServiceStandards`.
- [ ] general standards from `operations.ts`.
- [ ] business supplements from verified service data only.
- [ ] does not duplicate Coordination section.
- [ ] no trust-card grid.
- [ ] no badge wall.
- [ ] no security claim.
- [ ] no internal enum values shown directly.

---

# 20. FAQ

- [ ] shared `FAQ`.
- [ ] page owns Section/container/heading.
- [ ] `ReadingContainer` used.
- [ ] content supplies FAQ.
- [ ] visible FAQ and structured FAQ use same array.
- [ ] no duplicate FAQ data.
- [ ] no second accordion.
- [ ] keyboard accessible.

---

# 21. Final CTA

- [ ] shared `FinalCTA`.
- [ ] no Business-specific visual variant.
- [ ] no new gradient/radius/media architecture.
- [ ] no second Hero.
- [ ] primary inquiry path clear.
- [ ] quote path available for complex/recurring work.
- [ ] CTA resolution uses shared helpers.

---

# 22. Content

Expected locale entries:

- [ ] Serbian Business content
- [ ] English Business content
- [ ] Russian Business content

Each:

- [ ] `routeKey: businessTransportation`
- [ ] `pageType: hub`
- [ ] valid locale/lifecycle
- [ ] valid SEO
- [ ] Hero
- [ ] overview
- [ ] childServices
- [ ] oneOffRecurring section
- [ ] coordination section
- [ ] trustedClients section copy when used
- [ ] vehicle recommendations
- [ ] FAQ
- [ ] Final CTA

Content does not duplicate:

- [ ] child relationships
- [ ] child capability booleans
- [ ] pricing values
- [ ] currency
- [ ] client identities
- [ ] fleet capacity
- [ ] operational facts
- [ ] contact data
- [ ] route URLs

If content is not included in the implementation task, report blocker rather than inventing it.

---

# 23. UI strings

- [ ] existing reusable labels reused.
- [ ] new business labels added only when needed.
- [ ] locale parity maintained.
- [ ] no hardcoded English in reusable/page components.
- [ ] no agent-invented Serbian/Russian translations.
- [ ] data controls state; translations control presentation wording.

---

# 24. CTA / routing

- [ ] `resolveCtaHref()` reused where appropriate.
- [ ] internal routes use `RouteKey`/`Link`/`getPath()`.
- [ ] no `/en/` manual path.
- [ ] no `/ru/` manual path.
- [ ] no Business-local CTA resolver.
- [ ] no new booking route invented.
- [ ] child ServiceCards use canonical route targets.

---

# 25. SEO

- [ ] existing SEO builder reused.
- [ ] one H1 only.
- [ ] no component `<head>`.
- [ ] localized SEO title.
- [ ] localized SEO description.
- [ ] canonical intact.
- [ ] hreflang intact.
- [ ] lifecycle/noindex intact.
- [ ] no raw localized URLs.

---

# 26. Structured data

- [ ] approved builders reused.
- [ ] FAQ schema equals visible FAQ.
- [ ] no invented Business price.
- [ ] no invented client endorsement.
- [ ] no security-service schema.
- [ ] no duplicated route URL.
- [ ] no duplicated business facts.
- [ ] no ad-hoc schema helper where approved helper exists.

---

# 27. Theme / CSS

- [ ] active theme resolved from site config.
- [ ] no theme fallback added.
- [ ] no raw colors.
- [ ] no local palette.
- [ ] no local spacing scale.
- [ ] no local radius scale.
- [ ] no local breakpoint system.
- [ ] no copied wireframe CSS.
- [ ] no Tailwind v3 regression.
- [ ] no gold-first aesthetic.
- [ ] no glass.
- [ ] no glow.
- [ ] no dashboard shadow system.
- [ ] no routine hover lift.
- [ ] commercial light section uses semantic on-light tokens.

---

# 28. Typography

Computed browser verification:

- [ ] H1 approved heading stack.
- [ ] H2 approved heading stack.
- [ ] body approved body stack.
- [ ] navigation approved.
- [ ] CTA approved.
- [ ] commercial-path UI typography approved.
- [ ] brand font does not leak into page headings/body.

---

# 29. Accessibility

- [ ] WCAG 2.2 AA baseline.
- [ ] exactly one H1.
- [ ] logical heading hierarchy.
- [ ] semantic sections.
- [ ] ServiceCard CTA is explicit/accessible.
- [ ] card itself not ambiguous interactive target.
- [ ] 44×44 target minimum.
- [ ] visible focus.
- [ ] FAQ keyboard accessible.
- [ ] no horizontal overflow.
- [ ] reduced motion respected.
- [ ] image alt semantics correct.
- [ ] client names remain real text in text fallback.
- [ ] no fake-logo image alt.
- [ ] light section contrast compliant.

---

# 30. Responsive review

Review:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

## Mobile

- [ ] Hero contained and readable.
- [ ] Service selector stacks cleanly.
- [ ] ServiceCard image-led identity preserved.
- [ ] commercial paths stack with divider.
- [ ] Coordination copy precedes media.
- [ ] Trusted Clients names/logos wrap without overflow.
- [ ] vehicle names wrap.
- [ ] FAQ wraps.
- [ ] Final CTA stays medium-height.
- [ ] no horizontal overflow.

## Tablet portrait

- [ ] selector is not forced into 3 cramped columns.
- [ ] commercial paths remain clearly distinct.
- [ ] Coordination ordering intentional.
- [ ] Trusted Clients handles variable count.
- [ ] no dashboard density.

## Tablet landscape

- [ ] selector approaches desktop composition naturally.
- [ ] commercial paths balance correctly.
- [ ] Coordination 7/5 relationship works.
- [ ] no giant empty gaps.

## Desktop

- [ ] 3 child ServiceCards present.
- [ ] one-off/recurring reads as one functional composition.
- [ ] Coordination media 7 / copy 5.
- [ ] Trusted Clients is restrained, not billboard-like.
- [ ] no generic SaaS appearance.

## Wide desktop

- [ ] semantic containers cap width.
- [ ] card/media sizes remain controlled.
- [ ] text measure readable.
- [ ] client layout adapts without stretched logo/name gaps.

---

# 31. Image / performance

- [ ] approved Astro image pipeline.
- [ ] Hero LCP handling appropriate.
- [ ] explicit media sizing avoids CLS.
- [ ] responsive image delivery where applicable.
- [ ] ServiceCard images use approved contract.
- [ ] no random remote stock.
- [ ] no web-downloaded client logos.
- [ ] missing assets use approved placeholder behavior.
- [ ] no unnecessary client JS.

---

# 32. Automated validation

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

Additional project gates as required:

```bash
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm test:a11y
```

Record actual results.

---

# 33. Manual visual review

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
client-policy review PASS / FAIL / NOT RUN
```

---

# 34. Immediate rejection conditions

Reject if any is true:

- Business still uses generic `LeafPage`.
- page is treated as direct service rather than hub.
- child list is hardcoded in component code.
- content can inject unrelated routes into child selector.
- `ServiceCard` was cloned.
- numeric Business price was fabricated.
- page-local estimator was invented.
- currency was inferred.
- recurring capabilities were asserted without Corporate data.
- multi-vehicle claims were asserted without child data.
- security/bodyguard language appears.
- client logos were faked/downloaded/rendered without policy.
- production wireframe placeholders are shown as client logos.
- exact client count is baked into layout.
- localized routes are string-built.
- raw theme values introduced.
- wireframe CSS copied.
- responsive review skipped.
- blockers hidden.

---

# 35. Required completion report

```text
BUSINESS TRANSPORTATION IMPLEMENTATION REPORT

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

HUB CHILD PARITY:
-

PAGE-LOCAL COMPOSITIONS:
-

NEW SHARED VARIANTS:
-

DATA SOURCES USED:
-

BUSINESS PRICING STATE:
-

CLIENT DISPLAY STATE:
text-only / approved-logos / omitted / blocked

CLIENT POLICY NOTES:
-

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

BLUEPRINT DEVIATIONS / POLICY-GATED ADAPTATIONS:
-

SHARED COMPONENT BLOCKERS:
-

CLIENT DISPLAY BLOCKERS:
-

CONTENT BLOCKERS:
-

KNOWN TODOs:
-
```

A generic "done" response is not an acceptable handoff.
