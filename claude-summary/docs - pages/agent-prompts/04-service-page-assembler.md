# Luxury Transportation — Service Page Assembler

Status: **Shared execution prompt**

Use this prompt for the page-owning agent that assembles a dedicated service renderer from approved shared service components and page-specific sections.

Mandatory base files:

```text
00-service-agent-foundation.md
component-reuse-registry.md
```

This prompt is for assembly/integration. It is not permission to redesign shared components.

---

## Invocation inputs

```text
TARGET_PAGE:
TARGET_ROUTE_KEY:
TARGET_BLUEPRINT_DIR:
TARGET_WIREFRAME:
ALLOWED_FILES_OR_DIRECTORY:
IMPLEMENTED_SHARED_COMPONENTS:
IMPLEMENTED_PAGE_SPECIFIC_SECTIONS:
OPTIONAL_IMPLEMENTATION_NOTES:
```

---

## 1. Mission

Produce the dedicated final Astro renderer for the assigned service page by composing approved components in the exact locked blueprint order, wiring canonical localized content/data/routing, and preserving reviewed shared contracts.

The assembler should create very little new visual component code.

If assembly reveals missing implementation, use existing primitives/page-local composition where appropriate or report a blocker. Do not casually modify shared internals.

---

## 2. Mandatory preparation

Before editing:

1. Read `AGENTS.md`.
2. Read `DESIGN.md`.
3. Read `00-service-agent-foundation.md`.
4. Read `component-reuse-registry.md`.
5. Read the target blueprint in full.
6. Read every file under the target blueprint's referenced `../shared/` contracts.
7. Read the target wireframe for geometry/order only.
8. Inspect the real APIs of all components being assembled.
9. Inspect current routing/page-renderer architecture and content schemas.
10. Run:

```bash
pnpm design:context site/luksuzni-prevoz
```

Do not reuse `LeafPage` as the final renderer for Private Chauffeur, Airport Transportation, or Business Transportation.

Do not turn `LeafPage` into a service-page mega-renderer.

---

## 3. Locked page orders

Unless the blueprint has been explicitly revised, preserve these orders.

### Private Chauffeur

```text
SiteHeader / layout chrome
ServiceHero — responsive-split
ServiceOverview
PrivateChauffeurOptions
Availability & Flexibility
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
SiteFooter / layout chrome
```

### Airport Transportation

```text
SiteHeader / layout chrome
ServiceHero — contained
ServiceOverview
AirportBookingBlock
Arrival Handling & Flight Tracking
Private Aviation / FBO
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
SiteFooter / layout chrome
```

### Business Transportation

```text
SiteHeader / layout chrome
ServiceHero — contained
ServiceOverview
BusinessServiceSelector
One-off vs Recurring Arrangements
Coordination / Multi-Vehicle Capability
Trusted Clients
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
SiteFooter / layout chrome
```

The layout may own header/footer rather than the page renderer. Do not duplicate chrome if `BaseLayout` already provides it.

---

## 4. Layout/chrome rule

Prefer the existing production chrome path.

Inspect `BaseLayout` and its `overHero` contract before creating any new layout.

Use `BaseLayout` when it can satisfy the target hero/header integration correctly.

Do not create a new service layout merely to avoid understanding `BaseLayout`.

If a locked ServiceHero mode proves structurally incompatible with `BaseLayout`, diagnose and document the exact issue before proposing another layout path.

Do not duplicate `Page`, `SiteHeader`, `SiteFooter`, skip-link, SEO head, locale, or global CSS ownership.

---

## 5. Assembly-only reuse rule

The assembler should primarily import and compose:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
page-specific sections/components
FAQ
FinalCTA
Section / containers where the page itself owns small composition
Breadcrumbs where required
```

Do not create:

```text
ServicePageSection
UniversalServicePage
ServicePageBuilder
DynamicSectionRenderer
PageBlocksRenderer
```

merely to represent the blueprint as a generic schema.

The three major pages are allowed to have explicit renderer composition. Clarity is more important than abstracting section order into a configuration engine.

---

## 6. Shared-component immutability during assembly

Treat reviewed shared components as read-only unless a defect is proven inside their contract.

If an API is insufficient, first attempt:

```text
correct props
correct slot composition
correct Section/container ownership
correct data adapter
correct image choice/crop input
correct routing action shape
```

If still blocked, report:

```text
SHARED COMPONENT BLOCKER
Component:
Current API:
Required blueprint capability:
Why existing composition cannot satisfy it:
Minimal proposed change:
Cross-page consumers affected:
```

Do not silently patch the shared component while assembling one page.

---

## 7. Data/content integration

The page renderer orchestrates canonical sources; it does not become a data store.

Use:

```text
content collections / localized page content
services.ts
operations.ts
fleet.ts
pricing.ts only where valid
clients.ts only where policy allows
contact.ts
routes/getPath/Link routing helpers
```

Keep business facts out of markup constants.

Use route keys/approved helpers for internal navigation.

Do not invent missing translations or business facts.

---

## 8. SEO / structured data / breadcrumbs

Follow existing page/SEO architecture rather than creating page-local `<head>` logic.

Ensure:

- correct route key/locale is passed into layout/SEO helpers;
- H1 exists exactly once in the ServiceHero;
- FAQ structured data uses the same visible canonical FAQ content where the existing architecture supports it;
- breadcrumbs/internal links use route helpers;
- no locale URL concatenation.

If the current dedicated-renderer architecture needs an adapter to existing SEO builders, keep it small and reusable rather than duplicating SEO logic.

---

## 9. Hero/header integration

Hero behavior must follow the target shared contract:

```text
Private → responsive-split
Airport → contained
Business → contained
```

Do not choose a different hero because another page already implements it.

Header integration must use the existing SiteHeader/BaseLayout contract.

Do not copy Homepage hero/header scoped CSS into service pages.

---

## 10. Assembly acceptance

Before completion confirm:

```text
[ ] exact blueprint section order
[ ] dedicated renderer used
[ ] no duplicated global chrome
[ ] no generic LeafPage final rendering
[ ] shared components reused unchanged unless separately justified
[ ] page-specific sections are bounded
[ ] no hardcoded business data
[ ] no manual localized URLs
[ ] one H1
[ ] FAQ + FinalCTA use reviewed components
[ ] no wireframe CSS copied into production
[ ] no new theme/breakpoint system
```

---

## 11. Verification

For a completed dedicated page, run at minimum:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

When content/routes/SEO are changed, also run the matching repository validators required by `AGENTS.md`, for example:

```bash
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
```

Do not claim viewport visual acceptance here unless a browser review was actually performed.

---

## 12. Required completion report

```text
TARGET PAGE
- ...

FINAL SECTION ORDER
1. ...

LAYOUT/CHROME PATH
- ...

SHARED COMPONENTS REUSED
- ...

PAGE-LOCAL COMPONENTS/COMPOSITIONS
- ...

NEW COMPONENTS CREATED DURING ASSEMBLY
- None expected
or
- <name>: <justification>

SHARED COMPONENTS MODIFIED
- None expected
or
- <component>: <proven defect + impact>

DATA/CONTENT/ROUTING SOURCES
- ...

FILES CHANGED
- ...

VALIDATION
- <command>: PASS/FAIL/NOT RUN

BLOCKERS / BLUEPRINT DEVIATIONS
- None
or
- ...
```
