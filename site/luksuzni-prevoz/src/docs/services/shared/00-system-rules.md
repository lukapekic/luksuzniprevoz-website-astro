# Service Page System — Shared Rules

Status: **Locked shared service-page contract**

These rules apply to Private Chauffeur, Airport Transportation, and Business Transportation unless a page blueprint explicitly defines a structural exception.

## 1. Sources of truth

Read before implementation:

```text
AGENTS.md
DESIGN.md
page blueprint
active theme tokens
approved shared components
matching .skills procedures
```

Do not create page-local palette, type scale, spacing scale, radii, shadows, breakpoint system, route data, pricing data, fleet data, client data, contact data, or operational facts.

## 2. Global components

Use verified production components:

```text
SiteHeader
SiteFooter
FinalCTA
FAQ
Button / Link
Section
PageContainer / ReadingContainer
```

A service-page task does not authorize redesigning these components.

## 3. Shared service compositions

Preferred shared service contracts:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
```

Page-specific sections remain page-specific unless repetition later proves a reusable contract.

## 4. Surface roles

Use semantic surface roles only:

```text
open dark      → background
contained dark → surface / surfaceElevated
functional     → surfaceLight / inputSurface
full elevated  → full-width surfaceElevated signature band
full light     → full-width surfaceLight editorial band
```

Surface choice follows purpose and page rhythm. Do not alternate dark/light mechanically.

## 5. Geometry

Use active semantic roles:

```text
container → main / reading / narrow
spacing   → compact / standard / feature
radius    → section / card / control
grid      → active theme grid and approved compositions
```

Do not duplicate numeric values in blueprints or production components.

## 6. Typography

Blueprints specify semantic roles only:

```text
page heading
section heading
body
UI / metadata
brand lockup
```

The active theme determines the fonts and sizes.

## 7. CTA hierarchy

```text
Primary    → booking / main conversion
Secondary  → Request a Quote
Section    → contextual navigation/action
Contextual → related service
Tertiary   → verified contact channel
```

Do not make all actions visually equal.

## 8. Data boundaries

Use authoritative sources:

```text
services.ts   → service capabilities / pricing modes / relationships
operations.ts → operating standards
fleet.ts      → vehicle facts
pricing.ts    → supported chauffeur pricing facts only
clients.ts    → client roster + display/permission policy
contact.ts    → verified contact channels / office / lead-time facts
routes.ts     → route keys / localized paths
content       → localized editorial copy / FAQs / page text
```

Never infer missing facts to complete a design.

## 9. Shared design principles

- dark-first, not dark-only;
- premium through hierarchy, spacing, imagery, and restraint;
- no cardification;
- no decorative metallic/glow effects;
- no arbitrary asymmetry;
- no routine hover lift;
- use contextual imagery only when it supports the section role;
- WCAG 2.2 AA minimum;
- no accidental horizontal overflow;
- reduced-motion support where motion exists.
