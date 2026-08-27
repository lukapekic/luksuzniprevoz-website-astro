# Luxury Transportation — Shared Service Component Builder

Status: **Shared execution prompt**

Use this prompt to implement or revise the four approved cross-service contracts:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
```

This is the only prompt that grants normal authority to create these service-shared components.

Mandatory base files:

```text
site/luksuzni-prevoz/src/docs/agent-prompts/00-service-agent-foundation.md
site/luksuzni-prevoz/src/docs/agent-prompts/component-reuse-registry.md
site/luksuzni-prevoz/src/docs/services/shared/
```

---

## Invocation inputs

```text
TARGET_SHARED_COMPONENTS:
ALLOWED_FILES_OR_DIRECTORY:
OPTIONAL_DEPENDENT_PAGES:
OPTIONAL_IMPLEMENTATION_NOTES:
```

`TARGET_SHARED_COMPONENTS` may be one or more of the four approved contracts.

---

## 1. Mission

Turn the locked shared service documentation into a **small, reusable Astro contract** that all relevant service pages can consume without page-specific forks.

These components are shared because their semantic role repeats across the service-page family—not because they happen to use similar CSS.

Do not build page-specific sections under this prompt.

---

## 2. Mandatory reading

Before editing, read:

```text
AGENTS.md
DESIGN.md
00-service-agent-foundation.md
component-reuse-registry.md
src/docs/services/shared/00-system-rules.md
src/docs/services/shared/01-token-contract.md
src/docs/services/shared/02-service-hero.md
src/docs/services/shared/03-service-overview.md
src/docs/services/shared/04-vehicle-recommendations.md
src/docs/services/shared/05-service-standards.md
src/docs/services/shared/06-responsive-rules.md
src/docs/services/shared/07-wireframe-rules.md
```

Also inspect all three service blueprints to understand the real consumers:

```text
private-chauffeur/blueprint.md
airport-transportation/blueprint.md
business-transportation/blueprint.md
```

Inspect the real APIs of reused primitives/patterns before implementation.

Run:

```bash
pnpm design:context --target <exact-component-file> --surface <surface-id>
```

---

## 3. Location and ownership

Follow existing repository organization first.

If no service namespace exists and the component is truly shared only by service pages, prefer a clear service-shared location such as:

```text
src/components/services/shared/
```

Do not move existing reviewed components merely to make the directory tree symmetrical.

Each shared service component owns only the semantic role documented in its contract.

---

## 4. Reuse requirements per contract

### ServiceHero

Purpose: service-page cinematic entrance.

Required documented variants only:

```text
contained
responsive-split
```

Consumers:

```text
contained        → Airport, Business
responsive-split → Private Chauffeur
```

Must preserve:

- exactly one H1 supplied by content;
- concise supporting proposition;
- primary action;
- secondary action when supplied/required;
- optional quiet contextual line only;
- approved media/scrim behavior;
- responsive transformation defined by the shared contract.

Do not add:

```text
pricing
fleet specs
trust badges
ratings
booking form
arbitrary layout ratios
```

Reuse existing Link/CTA routing behavior and existing layout/theme primitives where compatible.

Do not collapse HomepageHero and ServiceHero into one universal hero.

### ServiceOverview

Purpose: explain what the service is + standard inclusions/facts.

Default identity:

```text
open dark
5/7 desktop composition
heading/explanation | divider-led facts
```

Prefer composition from:

```text
Section
PageContainer
SectionHeading
semantic divider/fact rows
```

Do not create feature cards for each fact.

Keep editorial explanation external and facts/data external.

### VehicleRecommendations

Purpose: small service-relevant fleet subset.

Must NOT become Homepage `FleetShowcase` or the full Fleet page.

Reuse:

```text
Section
PageContainer
SectionHeading
Link
```

and existing image/card/carousel mechanics only if the locked recommendation contract genuinely needs them.

Data contract:

```text
page content → vehicle IDs / localized suitability copy
fleet.ts     → canonical vehicle identity/capacity/facts
```

No pricing inside this component.

Missing imagery uses the approved neutral asset-gap behavior, not a redesign.

### ServiceStandards

Purpose: operational confidence near page end.

Must NOT reuse Homepage Trust identity.

Default identity:

```text
open dark
heading/statement | divider-led operational standards
```

Sources:

```text
operations.ts
+ verified service-specific capability flags from services.ts
```

No floating trust cards/badge wall.

No security/bodyguard claims where data does not support them.

---

## 5. API rules

Keep each API small and semantic.

Good inputs:

```text
localized heading/description
verified normalized items
vehicle IDs/view models
RouteKey-based actions
approved semantic variant
imported image metadata
locale
```

Reject raw styling knobs such as:

```text
backgroundColor
headingColor
padding
radius
shadow
columns
mobileColumns
imageWidth
accentColor
```

Do not create a giant universal props object to support all possible service pages.

If two pages need structurally different content, use slots/composition or page-local sections rather than bloating the shared API.

---

## 6. Data/content boundary

Shared components are presentation/composition layers.

They must not own:

```text
localized page copy
pricing tables
contact details
fleet database
service capability database
route path strings
client data
FAQ content
```

Prefer canonical types imported from content/data schemas when a stable shared type already exists.

Do not duplicate canonical data types just to make props convenient.

---

## 7. Responsive and accessibility ownership

A shared service component owns its normal responsive behavior.

Verify:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop sanity
```

Interactive elements must meet repository accessibility requirements.

Media alt decisions come from the caller/content contract; do not auto-copy headings into alt text.

Reduced motion must be respected wherever motion exists.

Do not add client-side JS unless behavior genuinely requires it.

---

## 8. Change restrictions

Do not modify:

```text
SiteHeader
SiteFooter
FinalCTA
FAQ
Homepage components
active theme token values
business data
routing architecture
```

unless the assigned shared service component exposes a proven integration defect that cannot be solved locally. If so, stop and report a shared-infrastructure blocker before broadening scope.

Do not assemble full service pages under this prompt except for minimal test/demo integration explicitly requested by the task.

---

## 9. Validation

At minimum run:

```bash
pnpm verify:ui --target <exact-component-file> --surface <surface-id> --change component
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

If theme/generated sources were intentionally touched—which should be unusual for this task—also run the theme/design governance gates required by `AGENTS.md`.

---

## 10. Required completion report

```text
SHARED CONTRACTS IMPLEMENTED
- ...

EXISTING COMPONENTS/PRIMITIVES REUSED
- ...

FILES CREATED/MODIFIED
- ...

PUBLIC API SUMMARY
- <component>: <small semantic API>

NEW LOW-LEVEL PRIMITIVES
- None
or
- <name>: <why existing primitives were insufficient>

PAGE-SPECIFIC LOGIC INTRODUCED
- None expected
or
- <explain and justify>

VALIDATION
- <command>: PASS/FAIL/NOT RUN

BLOCKERS / DEVIATIONS
- None
or
- ...
```
