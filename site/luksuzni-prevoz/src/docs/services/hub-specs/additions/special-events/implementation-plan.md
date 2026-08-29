# Special Events Hub — Implementation Plan

Status: **Implementation-ready after blueprint lock + content prerequisite**  
Route key: `specialEvents`  
Current route availability: `scaffold`  
Current content: scaffold in SR / EN / RU  
Target page type: `hub`

## 1. Authority stack

Before implementation read:

```text
AGENTS.md
DESIGN.md

src/docs/services/special-events/
  blueprint.md
  wireframe.html
  implementation-plan.md
  acceptance.md

src/docs/services/shared/
  00-system-rules.md
  01-token-contract.md
  02-service-hero.md
  03-service-overview.md
  04-vehicle-recommendations.md
  05-service-standards.md
  06-responsive-rules.md
  07-wireframe-rules.md

.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/imagery-art-direction.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/responsive-images-performance.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/multilingual-routing.md
.skills/technical-seo.md
.skills/structured-data.md
```

Use the smallest complete bundle required by current `AGENTS.md`.

## 2. Critical content prerequisite

The current files:

```text
src/content/pages/special-events/special-events.sr.md
src/content/pages/special-events/special-events.en.md
src/content/pages/special-events/special-events.ru.md
```

are scaffold entries with:

- `pageType: scaffold`
- `targetPageType: hub`
- `translationState: missing`
- `noindex: true`

The coding agent must **not invent production translations**.

Two safe implementation paths:

### Path A — preferred for publication

Approved content agent/human authors complete SR/EN/RU `hubPageSchema` entries first. Then implement and switch route availability to `published` only after validation/review.

### Path B — UI work before content

Build the dedicated component against typed fixtures/dev preview while leaving the production route scaffold/noindex. Do not publish the page until approved localized content exists.

Do not silently change scaffold content into invented production copy.

## 3. No content-schema expansion required by default

Existing `hubPageSchema` already supports:

```yaml
hero
overview
childServices
sections
vehicleRecommendations
faq
finalCta
```

Use `sections` keys for:

```text
eventCoordination
otherOccasions
```

Do not change `pages.ts` unless implementation proves a genuine missing semantic requirement.

## 4. Target file architecture

Create:

```text
src/components/services/special-events/
  SpecialEventsPage.astro
  SpecialEventServiceSelector.astro
```

Do not create by default:

```text
SpecialEventsHero.astro
SpecialEventsOverview.astro
EventCoordination.astro
OtherOccasions.astro
SpecialEventsVehicles.astro
SpecialEventsStandards.astro
SpecialEventsFAQ.astro
SpecialEventsFinalCTA.astro
```

Compose those regions from reviewed shared primitives first.

## 5. Shared component reuse

Required candidates:

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

Do not fork shared components for visual convenience.

## 6. Dispatcher integration

Use existing:

```text
src/components/site/ContentPageRenderer.astro
```

When production content is hub-ready, add:

```text
specialEvents → SpecialEventsPage
```

Preserve:

```text
scaffold → ScaffoldPage
```

If production content is still scaffold, do not force `SpecialEventsPage` for that scaffold data.

No route logic should be duplicated in catch-all route files.

## 7. Dedicated renderer contract

Create:

```text
SpecialEventsPage.astro
```

Props:

```ts
interface Props {
  routeKey: "specialEvents";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

Fail loud unless:

```text
routeKey === specialEvents
content.data.pageType === hub
content.data.routeKey === specialEvents
```

Require:

- hero
- childServices
- eventCoordination section
- otherOccasions section
- vehicleRecommendations if blueprint/content locks it
- FAQ if blueprint/content locks it
- finalCta

## 8. Hub + child data resolution

Resolve:

```ts
const hub = getService("specialEvents");
```

Canonical children:

```text
weddingTransportation
promTransportation
vipTransportation
```

For each child, resolve the service record and route.

Authored `childServices.items` must be matched by `routeKey`.

Do not rely on arbitrary user-authored ordering without checking canonical children.

Guard:

- exact child set
- duplicates
- missing children
- unknown route
- route/service kind mismatch (global guard already helps; page can still fail on content mismatch)

## 9. CTA resolution

Use:

```text
resolveCtaHref
Link / getPath
```

Do not concatenate:

```text
/en/
ru/
slug strings
```

Primary hub CTA:
booking/enquiry flow.

Secondary:
quote flow where content provides it.

VIP remains quote-only at child service level.

## 10. Hero

Use:

```text
ServiceHero variant="contained"
```

`BaseLayout`:

```text
overHero = false
```

Use category-neutral event image.

If correct media is unavailable, use the component's approved neutral placeholder behavior rather than redesign.

Hero should not mimic Airport full-bleed.

## 11. Overview view model

Use `ServiceOverview`.

Possible grouped facts should be derived from actual hub/child capabilities and approved UI strings, e.g.:

- principal/individual transport
- guest/group support
- multiple vehicles
- timing/return/waiting subject to selected service and quote

Do not write these labels inside the Astro component if localization source does not exist.

Add UI keys through established UI content architecture if needed.

## 12. `SpecialEventServiceSelector.astro`

Responsibility:

- render canonical three child services
- match localized authored card content to canonical routes
- map approved images/placeholders
- pass `RouteKey` to `ServiceCard`
- preserve heading hierarchy and responsive composition

No hub business facts inside it.

Suggested props:

```ts
interface Props {
  heading: {
    title: string;
    intro?: string;
  };
  items: Array<{
    routeKey: RouteKey;
    title: string;
    text: string;
    ctaLabel: string;
  }>;
  locale: LocaleCode;
  images?: Partial<Record<RouteKey, ImageMetadata>>;
}
```

Adapt exact types to existing content types; avoid duplicate type definitions if a shared type already exists.

### Image mapping

Prefer a route-key → imported asset map in the page module or a canonical media registry if one exists.

Do not put image filenames in localized Markdown unless the repository's image-reference contract already intends that.

## 13. Event Coordination section

Find:

```text
sections[key=eventCoordination]
```

Compose with:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Build capability items from verified child data.

Examples of capability checks:

```text
wedding.multipleVehicles
wedding.mixedVehicleClasses
wedding.guestTransport
prom.multipleVehicles
prom.individualAndGroup
vip.multiVehicle
vip.dedicatedCoordinatorForComplexBookings
```

Do not present every boolean as a UI fact. Aggregate into meaningful human-facing roles using approved localized labels.

### Waiting/return wording

Wedding/Prom:

- returnPossible true
- waitingPossible custom-quote

Therefore content/UI must not say waiting is automatically included.

Use quote/arrangement language.

## 14. Other Special Occasions

Find:

```text
sections[key=otherOccasions]
```

Source semantic use cases from:

```text
hub.generalUseCases
```

Current enum values require localized display strings.

Recommended implementation:

- map enum → UI string key
- render divider-led list
- optional quote/enquiry CTA

Do not duplicate the enum list as English literals in markup.

Do not make a 4-card icon grid.

## 15. Vehicle recommendations

Use:

```text
VehicleRecommendations
```

Resolve content vehicle IDs via:

```text
getVehicle
getPricing
```

only as required by the shared component contract.

No new event-specific vehicle facts.

If pricing display is not verified/appropriate, follow existing shared component handling; do not invent "from" amounts.

## 16. Standards

Use `ServiceStandards`.

Build groups from:

```text
operations.ts
```

plus only relevant verified service capabilities.

Recommended content categories:

- chauffeur
- vehicle
- passenger care
- discretion/coordination

VIP privacy/discretion can inform the view model, but do not make the whole Events hub sound like VIP-only service.

## 17. FAQ + structured data

Use shared `FAQ`.

If content provides FAQ:

```text
buildFaqPage(data.faq.items)
```

through the foundation SEO helper, consistent with Airport.

Use `buildPageSeo`.

Do not hand-author JSON-LD.

Do not use `Event` schema for this transport service category.

## 18. FinalCTA

Reuse shared `FinalCTA`.

Resolve:

- final primary/secondary CTA with `resolveCtaHref`
- contact data only through verified contact gating
- existing FinalCTA media behavior

No Special Events fork.

## 19. Imagery

Asset needs:

```text
hero: category-neutral special event arrival
wedding selector: wedding context, restrained
prom selector: formal/prom arrival, restrained
vip selector: discreet premium arrival
coordination: multiple passengers/vehicles or guest-transport context
```

If unavailable:

- use approved neutral placeholders
- record asset blocker
- do not substitute unrelated Homepage/Airport imagery indiscriminately

Use Astro image pipeline.

## 20. Route publication

Only after:

- SR content approved
- EN translation reviewed
- RU translation reviewed
- `pageType: hub`
- noindex removed according to lifecycle rules
- route availability changed from `scaffold` to `published`
- route/content parity validates

Do not publish only one locale when project parity requires all configured locales.

## 21. Potential selector extraction after both hubs

After Business + Special Events pass production review:

Compare:

```text
BusinessServiceSelector
SpecialEventServiceSelector
```

If semantic/DOM/responsive API is genuinely identical, extract to:

```text
services/shared/HubServiceSelector.astro
```

Run:

```text
pnpm components:check
```

and inspect all consumers.

Do not extract if differences require styling variants tied to page category.

## 22. Compliance matrix

Required rows:

- route/content lifecycle
- hero
- overview
- Wedding link
- Prom link
- VIP link
- event coordination
- waiting/return conditional language
- other occasion enum mapping
- vehicles
- standards
- FAQ
- Final CTA
- SEO
- hreflang/routing
- mobile
- tablet portrait
- tablet landscape
- desktop
- wide desktop
- keyboard/focus
- reduced motion
- image performance
- horizontal overflow

## 23. Verification

Before editing:

```bash
pnpm design:context --target <special events target> --surface <surface-id>
```

After implementation use relevant current repo commands, including:

```bash
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
pnpm theme:validate
pnpm theme:sync
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
```

Also run current:

- component impact checks when shared components change
- UI verification
- design review
- technical page review
- build
- any route-local tests

Never claim a check passed unless it ran.

## 24. Completion report

Agent must report:

- files created
- files modified
- shared components reused
- new page-local components
- whether any shared extraction occurred and why
- content lifecycle status
- routes changed
- SEO/schema changes
- images used/placeholders remaining
- commands run + results
- unresolved blockers
