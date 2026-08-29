# Hub Development Contract — Business + Special Events

Status: **Implementation guidance / shared strategy**  
Scope: `businessTransportation` and `specialEvents`

## 1. Goal

Make the two hub pages cheaper and safer to build by sharing **approved primitives and data conventions**, without prematurely inventing a generic hub framework.

## 2. Reuse-first rule

The following shared layer is already sufficient for most hub UI:

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

Do not create replacements.

## 3. Do not create up front

Do not begin with:

```text
HubPage.astro
HubHero.astro
HubOverview.astro
HubFleet.astro
HubStandards.astro
HubFAQ.astro
HubFinalCTA.astro
```

These would duplicate reviewed contracts.

Do not create a shared `HubServiceSelector` before two production consumers prove the contract.

This follows `.skills/component-architecture.md`:

1. reviewed shared component
2. approved variant
3. page-local component
4. shared extraction only after multiple verified consumers

## 4. Page-local components allowed

### Business

Existing implementation contract already justifies:

```text
services/business-transportation/
  BusinessTransportationPage.astro
  BusinessServiceSelector.astro
  BusinessCommercialPaths.astro
```

Coordination and client evidence should first be composed from existing primitives/data rather than extracted automatically.

### Special Events

Recommended initial structure:

```text
services/special-events/
  SpecialEventsPage.astro
  SpecialEventServiceSelector.astro
```

Keep Event Coordination and Other Occasions directly composed from `OpenSplitSection`, `Section`, and semantic lists unless implementation proves a separate component has a stable responsibility.

## 5. Potential later extraction

After both pages pass design review, compare:

```text
BusinessServiceSelector
SpecialEventServiceSelector
```

Extract:

```text
services/shared/HubServiceSelector.astro
```

**only if all are true**:

- same semantic responsibility
- same DOM topology
- same responsive topology
- same `ServiceCard` composition
- same route-resolution behavior
- same heading/content API
- no `business` / `events` styling branch required
- differences are entirely caller data/images

Suggested stable API only after validation:

```ts
interface HubServiceSelectorProps {
  heading: SectionHeadingData;
  items: Array<{
    routeKey: RouteKey;
    title: string;
    description: string;
    ctaLabel: string;
    image?: ImageMetadata;
    imageAlt: string;
  }>;
  locale: LocaleCode;
  index?: string;
  label?: string;
}
```

If extraction requires a `variant="business" | "events"` just to make the pages visually different, keep the selectors page-local.

## 6. Shared content/data behavior

Both hub renderers should:

- require `pageType === "hub"`
- require matching `routeKey`
- resolve child routes from authoritative data
- assert authored child-service entries match the canonical hub children
- use localized route helpers
- resolve CTA targets through existing CTA helpers
- get operational facts from `services.ts`, `operations.ts`, `fleet.ts`, client/business data as applicable
- never move business truth into component literals

## 7. Shared hero decision

Both hubs should use:

```text
ServiceHero / contained
```

Reasons:

- consistent service-family identity
- avoids repeating Homepage/Airport full-bleed authority
- gives category pages a calmer entrance
- works with current header behavior (`overHero = false`)
- already approved by the locked Business blueprint

Special Events may feel more visual through image selection and downstream image footprint, not by inventing a new hero component.

## 8. Shared child-service discovery

Use `ServiceCard`.

Desktop:

- approved `4/4/4` composition
- three equal child routes
- image-led
- explicit visible CTA

Tablet:

- preserve readable card proportions
- do not force a cramped 3-column layout if the component/container width does not support it
- choose a deterministic topology during implementation review

Mobile:

- stack
- no horizontal clipping
- CTA remains 44×44 minimum target
- no hover-only copy

## 9. Visual differentiation without a second design system

### Business

Emphasis:

- operational confidence
- schedules
- recurring arrangements
- multiple vehicles
- proof/client evidence
- structured functional contrast

Use:

- restrained executive/corporate transport imagery
- stronger information density
- optional approved light functional surface for commercial paths
- client evidence when policy permits

### Special Events

Emphasis:

- occasion
- arrival
- principal passenger + guests
- timing
- presentation
- flexible group composition

Use:

- more cinematic event-context imagery
- larger image role in the coordination section
- warmer copy, not warmer theme
- a compact "other occasions" region instead of client evidence/commercial path UI

Do not alter Theme V2.

## 10. Common SEO behavior

Both hubs:

- one H1 via `ServiceHero`
- canonical + hreflang from existing SEO helpers
- hub-level Service/WebPage semantics per existing repository policy
- BreadcrumbList through existing route/breadcrumb system
- internal links to every hub child
- no invented prices
- no fake aggregate ratings
- no fake client claims

## 11. Mandatory implementation skills

Per root `AGENTS.md`, new/major pages must load:

```text
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Also load:

- imagery skill for these image-bearing pages
- responsive images/performance
- multilingual routing when route/content/link work is touched
- technical SEO / structured data for final technical review
- functional UI for Business commercial paths

## 12. Required compliance matrix

Before implementation, build:

```text
requirement | authority | data source | component | responsive states | verification
```

No production editing before this matrix is prepared.

## 13. Verification

At minimum:

```bash
pnpm design:context --target <page-or-assembler> --surface <surface-id>
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
pnpm theme:validate
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
```

Plus repository UI/component/build verification commands required by the current agent context.

Never report a gate as passed unless it actually ran.
