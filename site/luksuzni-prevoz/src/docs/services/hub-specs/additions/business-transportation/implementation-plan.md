# Business Transportation — Current-State Implementation Plan

Status: **Ready for coding**  
Route: `businessTransportation`  
Existing blueprint status: **locked**  
Existing content status: **published/reviewed**  
Current production renderer status: **dedicated hub renderer not yet wired**

## 1. Why this plan exists

The repository already contains a much larger authoritative `implementation.md`.

This file is a short execution delta for the current `master` state so a coding agent can move quickly without re-planning the page.

If this file conflicts with the repo's locked blueprint or full implementation contract, the repo authority wins.

## 2. Current gap

`ContentPageRenderer.astro` currently dispatches:
- scaffold → `ScaffoldPage`
- airportTransportation → `AirportTransportationPage`
- otherwise → `LeafPage`

Business Transportation is already authored as `pageType: hub`, but no dedicated renderer is selected.

### Required integration

Add:
```text
businessTransportation → BusinessTransportationPage
```

to the existing dispatcher.

Do not create a second dispatcher.

## 3. Target page-local files

Follow the existing implementation contract:

```text
src/components/services/business-transportation/
  BusinessTransportationPage.astro
  BusinessServiceSelector.astro
  BusinessCommercialPaths.astro
```

Do not create local copies of shared service components.

## 4. Components to reuse

```text
BaseLayout
ServiceHero
ServiceOverview
ServiceCard
OpenSplitSection
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
Section
PageContainer
ReadingContainer
SectionHeading
Link
```

## 5. Data/content sources

### Editorial
```text
src/content/pages/business-transportation/
  business-transportation.sr.md
  business-transportation.en.md
  business-transportation.ru.md
```

Content is already authored/reviewed.

### Operational/business truth
```text
src/data/services.ts
src/data/business.ts
src/data/clients.ts
src/data/operations.ts
src/data/fleet.ts
src/data/fleet-media.ts
src/data/pricing.ts
src/data/contact.ts
src/data/routes.ts
```

Only use each source for the facts it owns.

## 6. Renderer responsibilities

`BusinessTransportationPage.astro` should:

1. narrow:
   - routeKey === businessTransportation
   - content.data.pageType === hub
   - content.data.routeKey === businessTransportation

2. resolve:
   - hub service entry
   - canonical child service entries
   - authored child-service copy
   - CTA hrefs
   - SEO
   - vehicle recommendation view models
   - service standard view model
   - allowed client evidence

3. assemble the locked section order.

4. fail loud on missing required authored sections rather than silently reordering/omitting them.

## 7. Child-service integrity

Canonical child order comes from route/service authority:

```text
corporateTransportation
delegationTransportation
conferenceCongressTransportation
```

The authored `childServices.items` should be matched by `routeKey`, not array-position assumptions alone.

Guard against:
- unknown authored child
- missing canonical child
- duplicate child
- route/service drift

Use `<Link to={routeKey}>` or existing route helpers.

No manual localized href construction.

## 8. Service selector

Create page-local:

```text
BusinessServiceSelector.astro
```

Use three `ServiceCard` instances.

Do not:
- make the whole card clickable
- invent a new card style
- create a carousel for three items
- hardcode locale URLs
- hardcode child copy

Use approved contextual imagery if available; otherwise use the built-in neutral `ServiceCard` placeholder contract.

### Responsive intent

Mobile:
- stacked cards

Tablet:
- deterministic readable topology; do not squeeze text into three narrow columns

Desktop:
- 4/4/4 within the approved 12-column system

## 9. One-off vs Recurring

Create page-local:

```text
BusinessCommercialPaths.astro
```

This is a **commercial path explanation**, not pricing UI.

One-off capability can derive from Corporate:
- supportsOneOff

Recurring path can derive from:
- supportsRecurringContracts
- supportsInvoicing
- supportsNegotiatedPricing
- dedicatedChauffeurAcrossStops

Do not publish numeric business pricing unless a validated estimator contract exists.

Use the blueprint-approved light functional surface.

Prefer divider structure over two floating dashboard cards.

## 10. Coordination section

Compose directly inside the page using:
- `Section`
- `PageContainer`
- `OpenSplitSection`
- `SectionHeading`
- semantic list/dividers

Data may aggregate verified facts from:
- Delegation
- Conference/Congress

Must explicitly respect:
```text
securityService = false
```

No bodyguard/security wording.

## 11. Trusted clients

Evaluate `clients.ts` policy before rendering.

Requirements:
- approved public display only
- real assets only
- no fixed count
- omit entire section when no safe public set is available
- no fake logos/placeholders in production
- no endorsement language beyond actual data

Do not create a reusable `TrustedClients` component unless current repo architecture already provides one or another verified consumer justifies extraction.

## 12. Vehicle recommendations

Reuse `VehicleRecommendations`.

Content already supplies vehicle IDs.

Resolve vehicle/fleet/pricing display data through existing helpers/data.

No duplicated vehicle specs.

## 13. Standards

Reuse `ServiceStandards`.

Build groups from `operations.ts` + valid business-related facts.

Do not hardcode operational facts in JSX/Astro markup.

## 14. FAQ + SEO

Reuse `FAQ`.

Build SEO with existing `buildPageSeo` pattern.

If FAQ schema is used in the repo's current SEO convention, generate structured FAQ data through the foundation helper rather than hand-written JSON-LD.

No fake ratings/prices.

## 15. Final CTA

Reuse `FinalCTA`.

Resolve:
- booking/quote actions through `resolveCtaHref`
- verified contact channels through contact gating

Do not fork FinalCTA.

## 16. Header behavior

Use `BaseLayout` with the contained service-family header behavior.

Business is **not** a Homepage/Airport full-bleed-over-header hero.

Expected:
```text
overHero = false
```

unless the existing full implementation contract says otherwise.

## 17. Compliance matrix minimum rows

Before edit, cover:
- hero
- overview
- 3 child routes
- one-off path
- recurring path
- coordination
- trusted client gating
- vehicles
- standards
- FAQ
- Final CTA
- SEO
- locale routing
- responsive states
- a11y
- image performance

## 18. Verification

Run current repo-required checks, including at minimum:

```bash
pnpm design:context --target <business page target> --surface <surface-id>
pnpm components:check
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
pnpm theme:validate
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
```

Then run page/UI/build review commands required by the current skill context.

## 19. Done definition

Business is done only when:
- dedicated renderer is dispatched
- locked page order is preserved
- all three child routes work in SR/EN/RU
- no hardcoded business truth is added
- no security claim exists
- client evidence is correctly gated
- all responsive states are manually reviewed
- keyboard/focus/44px targets pass
- no horizontal overflow
- relevant validators/build pass
