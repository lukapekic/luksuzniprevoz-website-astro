# Luxury Transportation — Component Reuse Registry

Status: **Shared agent decision reference**

Purpose: tell implementation agents what the current reviewed components own, where they should be reused, what they must not be stretched into, and which documented service contracts still need implementation when a locked blueprint requires them.

This registry is procedural guidance. The real component source/API and locked blueprints remain authoritative.

---

## 1. Reuse classes

Use these classifications:

```text
GLOBAL / FOUNDATION
  normal reusable infrastructure across the site

SITE-SHARED PATTERN
  reviewed reusable Luxury Transportation component/pattern

MECHANICAL PRIMITIVE
  reusable mechanics/composition without page semantics

PAGE-SPECIFIC
  intentionally tied to one page identity; do not generalize by default

DOCUMENTED SHARED CONTRACT
  approved cross-service architecture that may still require implementation

GENERIC RENDERER
  appropriate for generic content routes, not a replacement for locked dedicated pages
```

---

## 2. Foundation layout and UI

### `Section`

Class: **GLOBAL / FOUNDATION**

Owns:

- vertical page-section rhythm;
- approved semantic section surface treatment.

Current semantic axes:

```text
spacing: compact | standard | feature
surface: open-dark | contained-dark | elevated | light
```

Does not own:

- horizontal gutter;
- page max-width;
- page-specific copy;
- page-specific grid/composition.

Reuse when:

- creating almost any normal page section.

Do not:

- reproduce section vertical padding/surface/radius locally;
- use class passthrough to create a second visual variant system.

Compose with a container inside it.

---

### `PageContainer`

Class: **GLOBAL / FOUNDATION**

Owns:

- broad page-content width;
- fluid horizontal gutter;
- centering.

Use for:

- page-wide rows;
- multi-column page sections;
- service overview grids;
- vehicle recommendations;
- standards;
- feature compositions.

Does not own:

- surface;
- vertical section rhythm.

Do not replace with local `max-w-* + px-*` combinations.

---

### `ReadingContainer`

Class: **GLOBAL / FOUNDATION**

Owns:

- narrower readable content measure;
- horizontal gutter;
- centering.

Use for:

- FAQ;
- prose-heavy sections;
- compact explanatory content;
- compact functional/form regions where the blueprint supports it.

Do not use as the default container for page-wide grids.

---

### `SectionHeading`

Class: **GLOBAL / FOUNDATION**

Owns:

- reusable H2/H3 section-heading identity;
- optional concise description;
- optional restrained accent rule;
- dark/light text treatment.

Public intent:

```text
heading
optional description
level 2 | 3
on dark | light
optional accent
id
```

Reuse for standard section headings.

Do not:

- create page-local H2 visual systems;
- add arbitrary center/right/eyebrow variants unless a locked contract changes;
- treat wireframe uppercase helper labels as production eyebrow components.

---

### `Link`

Class: **GLOBAL / FOUNDATION**

Owns:

- internal-route resolution;
- external-link safety behavior;
- approved link/CTA visual variants;
- focus behavior.

Current visual roles include:

```text
default
nav
cta
button
```

Use `to: RouteKey` / routing infrastructure for internal destinations.

Do not manually construct localized hrefs.

Do not create one-off anchor-button CSS per section.

---

### `Button` and form-control primitives

Class: **GLOBAL / FOUNDATION**

Own:

- control identity;
- target size;
- focus/disabled/interaction states;
- approved control radius/typography.

Reuse for functional UI.

Before adding a new control, inspect the existing field/input/dialog/control family under `src/foundation/ui/`.

Do not let booking/pricing pages invent a separate control design system.

---

### `Breadcrumbs`

Class: **GLOBAL / FOUNDATION**

Owns:

- breadcrumb semantics;
- localized route linking.

Reuse where page hierarchy/blueprint calls for breadcrumbs.

Do not hand-build breadcrumb URLs.

---

### `Page`

Class: **GLOBAL / FOUNDATION**

Owns:

- document/head integration;
- global page-level infrastructure expected by repository rules.

Normally consumed through layout architecture rather than directly from individual service sections.

Do not emit competing `<head>` ownership elsewhere.

---

## 3. Site chrome

### `SiteHeader`

Class: **SITE-SHARED PATTERN / GLOBAL CHROME**

Owns the reviewed Luxury Transportation header/navigation identity.

Reuse on production pages.

Do not:

- create a service-page header clone;
- restore legacy generic header paths;
- locally redesign navigation for one service.

For over-hero behavior, use the existing documented layout/header contract rather than duplicating transparent/sticky logic.

---

### `SiteFooter`

Class: **SITE-SHARED PATTERN / GLOBAL CHROME**

Owns the reviewed compact site-ending identity and canonical contact/navigation integration.

Reuse unchanged visually.

Do not create page-local footer variants.

---

### `BaseLayout`

Class: **GLOBAL LAYOUT**

Owns the normal non-home production chrome path:

```text
Page
+ SiteHeader
+ main slot
+ SiteFooter
```

Use where its header/hero integration matches the target page.

Current `overHero` support exists for pages whose first region needs approved over-hero header behavior.

Do not create another parallel production chrome layout without a proven architectural need.

---

## 4. Reviewed site-shared components

### `FinalCTA`

Class: **SITE-SHARED PATTERN**

Owns the entire reviewed closing conversion composition:

- contained architectural panel;
- content/media relationship;
- primary/secondary CTA hierarchy;
- restrained tertiary phone/email row;
- right-zone vehicle/contextual image behavior;
- responsive identity.

Inputs include localized heading/description, actions, verified contacts, image, locale.

Reuse on service pages as the final conversion section.

Do not:

- wrap it in a competing closing panel;
- create page-local gradients/radii/layout variants;
- add WhatsApp into this component contrary to its contract;
- turn it into Hero #2.

Page-specific work supplies content/data, not visual redesign.

---

### `FAQ`

Class: **SITE-SHARED PATTERN**

Owns:

- divider-based FAQ rows;
- native details/summary interaction;
- row accessibility;
- dark/light row treatment.

Does not own:

- page Section;
- container;
- FAQ heading;
- JSON-LD emission.

Compose:

```text
Section
  ReadingContainer
    SectionHeading
    FAQ
```

Use canonical FAQ content items.

Do not create floating FAQ cards or duplicate accordion JS.

---

### `OpenSplitSection`

Class: **MECHANICAL PRIMITIVE / SITE-SHARED COMPOSITION**

Owns only:

- responsive two-column content/media composition;
- approved desktop ratios `5-7 | 6-6 | 7-5`;
- visual direction `content-image | image-content`;
- mobile stacking contract;
- contextual media frame.

Does not own:

- outer Section;
- page surface;
- container;
- section heading/copy/CTA semantics.

Use for page-specific open split sections such as:

- Private Chauffeur availability/flexibility;
- Airport arrival handling;
- Business coordination/multi-vehicle capability;

when the locked blueprint geometry matches.

Compose:

```text
Section
  PageContainer
    OpenSplitSection
      content slot
```

Do not create `AirportSplit`, `BusinessSplit`, etc. for identical geometry.

Do not mutate this component into a universal content API with dozens of text props.

---

### `ServiceCard`

Class: **SITE-SHARED PATTERN**

Semantic role:

- image-led service navigation/discovery card.

Owns:

- full-card media identity;
- bottom scrim;
- title/supporting sentence/explicit CTA anatomy;
- one interactive CTA rather than whole-card invisible linking;
- neutral placeholder behavior for missing imagery.

Use when a page needs the approved service-navigation identity.

Known compatible service-page use:

- Business `BusinessServiceSelector` for child services, when the blueprint's content/data maps cleanly to the API.

Do not:

- use it as a universal content card;
- use it for fleet/reviews/standards;
- convert the entire card into an ambiguous click overlay;
- replace Homepage `ServiceShowcase` with it if that homepage pattern has a separately locked identity.

---

### `HorizontalCarousel`

Class: **MECHANICAL PRIMITIVE**

Owns:

- horizontal overflow viewport;
- scroll snapping;
- prev/next controls;
- responsive item sizing;
- instance isolation;
- progressive enhancement;
- reduced motion.

Does not know semantic item types.

Use for carousel mechanics when the blueprint calls for a horizontal carousel.

Known consumers/patterns:

- fleet carousel mechanics;
- review carousel mechanics.

Do not:

- create a second carousel engine per page;
- add autoplay/loop/dots/speed/drag tuning just for visual novelty;
- force `FleetCard` and `ReviewCard` into one visual card component.

Service `VehicleRecommendations` is not automatically a carousel; follow its shared contract/blueprint.

---

### `TrustStrip`

Class: **SITE-SHARED PATTERN**

Semantic role:

- compact four-item confidence checkpoint with a locked responsive divider structure.

Important constraint:

- the reviewed component intentionally expects exactly four items.

Use only where the product/design contract calls for this trust identity.

Do not use as `ServiceStandards` merely because both communicate confidence. The service contract explicitly requires a different divider-led operational identity.

---

### `ReviewCard`

Class: **SITE-SHARED PATTERN**

Owns normalized review-card presentation only.

Consumes normalized review view-model fields, not raw Google Places API fields.

Use in the reviewed reviews composition.

Do not use for testimonials/client logos/service standards or generic quote cards.

---

## 5. Generic renderer boundary

### `LeafPage`

Class: **GENERIC RENDERER**

Owns a shared breadcrumb + heading + rich-text shell for generic non-home content routes.

Good for:

- generic prose/content pages that do not have a locked dedicated architecture.

Not acceptable as the final renderer for the locked major service pages:

```text
Private Chauffeur
Airport Transportation
Business Transportation
```

Their blueprints explicitly require dedicated renderers.

Do not solve the service-page task by adding enough conditionals/props to make `LeafPage` a universal page builder.

---

## 6. Homepage-specific boundary

Components under homepage-specific architecture are **PAGE-SPECIFIC unless their source contract explicitly says otherwise**.

Do not generalize based on appearance.

Explicit service-page exclusions from current locked docs:

```text
Homepage FleetShowcase
  ≠ VehicleRecommendations

Homepage Trust identity / TrustStrip use
  ≠ ServiceStandards

Homepage Hero
  ≠ ServiceHero

Homepage ServiceShowcase
  ≠ automatically ServiceCard or BusinessServiceSelector
```

A service page may reuse the same low-level primitives/mechanics, but not silently inherit unrelated homepage semantic identity.

---

## 7. Documented shared service contracts

These are approved cross-service architectural contracts. Implement them as shared components when a current service-page task requires them and no verified implementation exists yet.

### `ServiceHero`

Class: **DOCUMENTED SHARED CONTRACT**

Purpose:

- cinematic, low-density service entrance;
- one H1;
- concise proposition;
- primary action;
- secondary action where blueprint requires;
- at most one quiet contextual line.

Variants:

```text
contained
  → Airport Transportation
  → Business Transportation

responsive-split
  → Private Chauffeur
  desktop content 5 / media 7
  tablet/mobile becomes contained image-backed hero
```

Must not contain:

- pricing;
- booking form;
- fleet specifications;
- ratings;
- trust-chip rows.

Do not merge it with HomepageHero or FinalCTA just because all may contain imagery + text.

---

### `ServiceOverview`

Class: **DOCUMENTED SHARED CONTRACT**

Purpose:

- explain what the service is;
- communicate standard inclusions before deeper commercial/operational details.

Default identity:

```text
open dark section
5 / 7 desktop relationship
heading + concise explanation | divider-led fact/inclusion rows
```

Rules:

- no enclosing card by default;
- no image unless blueprint explicitly changes the contract;
- facts from verified data;
- explanation from localized content.

Do not create separate `AirportOverview`, `BusinessOverview`, `ChauffeurOverview` components when the shared contract is sufficient.

---

### `VehicleRecommendations`

Class: **DOCUMENTED SHARED CONTRACT**

Purpose:

- show a small service-relevant fleet subset without duplicating Homepage fleet identity or the full Fleet page.

Default behavior:

- open dark section;
- contextual heading/copy;
- approximately three recommendations when content supplies them;
- canonical vehicle facts from `fleet.ts`;
- suitability copy from localized content;
- `View Full Fleet` contextual action.

Do not:

- reuse Homepage `FleetShowcase` as the section identity;
- duplicate pricing here;
- hardcode vehicle capacity/specifications;
- redesign because imagery is missing—use approved neutral placeholder behavior.

---

### `ServiceStandards`

Class: **DOCUMENTED SHARED CONTRACT**

Purpose:

- operational confidence near the end of service pages.

Default identity:

```text
open dark
5 / 7 desktop relationship
heading + statement | divider-led standards rows/grid
```

Data:

- primarily `operations.ts`;
- supplemented only by verified service capability flags.

Do not:

- use Homepage TrustStrip as a substitute;
- create badge walls/floating trust cards;
- introduce security/bodyguard claims when service data does not support them.

---

## 8. Page-specific compositions that should remain page-specific by default

These are blueprint-defined semantic sections. Build them from primitives/shared patterns, but do not automatically promote them to global components.

### Private Chauffeur

```text
PrivateChauffeurOptions
Availability & Flexibility
```

Recommended reuse:

- `Section` + container + shared controls/links for options;
- `OpenSplitSection` for Availability & Flexibility if geometry matches blueprint.

Do not build three floating pricing cards.

---

### Airport Transportation

```text
AirportBookingBlock
Arrival Handling & Flight Tracking
Private Aviation / FBO feature
```

Recommended reuse:

- existing form/control family for functional UI;
- `OpenSplitSection` for Arrival Handling;
- `Section`, containers, `SectionHeading`, links/buttons for contained FBO feature.

Do not invent airport fares when the authoritative pricing source does not provide them.

Do not create a separate Private Aviation page from this blueprint.

---

### Business Transportation

```text
BusinessServiceSelector
One-off vs Recurring Arrangements
Coordination / Multi-Vehicle Capability
Trusted Clients
```

Recommended reuse:

- `ServiceCard` inside the service selector where API/content fit;
- `Section` + semantic dividers for one-off/recurring;
- `OpenSplitSection` for coordination;
- `clients.ts` display policy for Trusted Clients.

Do not hardcode child services or client count.

Do not create fake logos when usage permission/assets are unavailable.

---

## 9. New-component decision table

| Situation | Default decision |
|---|---|
| Existing component solves it unchanged | Reuse it |
| Existing approved variant solves it | Reuse variant |
| Same geometry, different page semantics | Compose shared primitive; keep page section semantic/local |
| Same semantic role across multiple locked service pages | Consider/implement documented shared contract |
| Looks similar but content structure/interaction/responsive identity differs | Separate component or page-local composition |
| Appears once and is blueprint-specific | Keep page-local |
| Needs many visual booleans/style props | Architecture is wrong; stop and redesign boundary |
| Missing asset/data | Preserve component contract and use approved gating/placeholder; do not redesign |

---

## 10. Rejected reuse patterns

Reject:

```text
<ServicePageSection type="hero|overview|fleet|faq|pricing|standards" ... />
```

Reject:

```text
<UniversalPanel
  imageLeft
  dark
  rounded
  split="5/7"
  pricing
  trust
  faq
/>
```

Reject page-local clones such as:

```text
AirportFAQ
BusinessFinalCTA
PrivateFooter
AirportCarousel
BusinessSplit
```

when the existing shared component already owns the same identity/mechanics.

Reject visual-prop APIs such as:

```text
backgroundColor
headingColor
radius
shadow
padding
imageSize
scrimColor
```

when semantic tokens/contracts already own those decisions.

---

## 11. Required agent reuse report

For every major service-page implementation, report:

```text
REUSED GLOBAL / FOUNDATION:
REUSED SITE-SHARED:
IMPLEMENTED DOCUMENTED SHARED CONTRACTS:
PAGE-LOCAL COMPOSITIONS:
NEW REUSABLE COMPONENTS:
NEW VARIANTS:
REJECTED/AVOIDED DUPLICATION:
WHY EACH NEW ABSTRACTION WAS NECESSARY:
```

If a new reusable component appears without a clear entry in one of these categories, review the architecture before completion.

---

## 12. Core rule

```text
Component identity is defined by semantic purpose
+ content structure
+ responsive behavior
+ interaction model,
not by visual resemblance alone.
```
