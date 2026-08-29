# Hub Page Primitives — Implementation Specification

**Project:** Luxury Transportation (`luksuzniprevoz.rs`)  
**Purpose:** Shared implementation contract for the Business Transportation Hub and Special Events Hub.  
**Audience:** Coding agent working inside the existing Astro project.  
**Important:** The project already contains the authoritative design system, Theme V2, tokens, typography, spacing, responsive rules, shared site chrome, CTA patterns, and accessibility conventions. Reuse those. Do not invent a parallel visual system.

---

## 1. Objective

Create a small set of reusable Astro primitives that can support both hub pages without turning them into a single over-configurable "mega component".

The target is approximately **65–75% shared structural implementation** between:

- Business Transportation Hub
- Special Events Hub

The two pages must still feel distinct through:

- content
- photography
- section ordering where useful
- density
- trust/evidence treatment
- editorial emphasis

Prefer composition over condition-heavy abstractions.

---

## 2. Architectural Principles

### Required

- Astro-first implementation.
- Reuse existing project layout, containers, typography, buttons, image handling, utilities, motion patterns, and data conventions.
- Mobile-first.
- WCAG 2.2 AA minimum.
- Semantic HTML.
- Server-rendered content by default.
- Use content/data objects rather than hardcoded repeated markup where that is already the project convention.
- Preserve existing locale architecture and route conventions.
- Keep all reusable components content-agnostic.
- All text supplied to primitives must be renderable per locale.
- Avoid client-side JS unless there is a genuine interaction requirement.
- Use `astro:assets` / project image handling conventions.
- Respect `prefers-reduced-motion`.

### Avoid

- No monolithic `HubPage.astro`.
- No separate visual system for hubs.
- No generic icon-card SaaS aesthetic.
- No excessive borders or card nesting.
- No gold-heavy limousine styling.
- No arbitrary new spacing/radius/color values if an existing token can be used.
- No large animation libraries for simple reveal effects.
- No carousel for the three primary hub services unless the current project already uses an accessible equivalent and there is a compelling mobile reason. Stacked content is preferred.

---

# 3. Proposed Shared Components

Use names consistent with the project's component naming conventions. The names below are conceptual.

## 3.1 `HubHero.astro`

### Responsibility

Render the opening section for a category/hub page.

### Supported content

- eyebrow / category label
- H1
- short supporting paragraph
- primary CTA
- optional secondary CTA
- media
- optional compact proof/support line

### Suggested interface

```ts
type HubHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  media: ImageMetadata;
  mediaAlt: string;
  proofItems?: string[];
};
```

Adapt to the repository's established types/data conventions rather than forcing this exact syntax.

### Requirements

- Exactly one page-level H1.
- Hero copy must remain readable over/alongside photography at all breakpoints.
- Do not place long paragraphs in the hero.
- Mobile CTA targets must meet touch-size requirements.
- Image cropping must be intentional across mobile/tablet/desktop.
- If overlay treatment is used, follow existing Theme V2 contrast conventions.
- No decorative text baked into images.

---

## 3.2 `HubServiceSelector.astro`

### Responsibility

Primary navigation from the hub into its three child service pages.

This is the most important shared hub primitive and should become the visual signature of both hubs.

### Content model per item

```ts
type HubServiceItem = {
  index?: string;
  title: string;
  description: string;
  href: string;
  image: ImageMetadata;
  imageAlt: string;
  meta?: string[];
  ctaLabel?: string;
};
```

### Required visual direction

Do **not** render as generic small cards with icons.

Use a larger editorial treatment:

- section number / index
- prominent service name
- substantial photography
- concise description
- optional short use-case/meta line
- clear text CTA

Desktop may use:

- 3-column editorial panels, or
- one large lead + two supporting panels,
  provided all three remain clearly equal navigation choices.

Mobile:

- stack vertically
- preserve full readable copy
- do not hide descriptions behind hover interactions

### Interaction

- Entire visual surface may be clickable if semantics remain correct.
- Visible text CTA should remain.
- Keyboard focus state must be obvious.
- Hover motion should be subtle.
- No critical information on hover only.

---

## 3.3 `HubCapability.astro`

### Responsibility

Explain the operational breadth of the hub.

The structural shell is shared, but Business and Special Events supply different content.

### Possible content

- eyebrow
- heading
- supporting copy
- image
- 2–4 short capability items
- optional route/timeline/list visualization
- optional CTA

### Variants

A minimal variant prop is acceptable, e.g.:

```ts
variant?: "business" | "events";
```

Only use the variant for meaningful layout differences. Do not use it to branch every class.

### Business use

Communicate:

- one executive to coordinated fleets
- airport → hotel → office → venue → dinner
- multiple cars and changing schedules

### Events use

Communicate:

- principal guest/couple + guest transport
- multiple vehicles
- ceremony/venue/event timing
- group transfers

---

## 3.4 `HubEditorialFeature.astro`

### Responsibility

Large 50/50 or editorial image/text module for one important narrative.

### Business example

Roadshows / transport built around the working day.

### Events example

Transport built around the timing of the occasion.

### Requirements

- Reusable image-left/image-right orientation.
- Short copy.
- Optional bullet list only if content benefits from it.
- Optional inline CTA.
- Must not become a generic text dump.

---

## 3.5 `FleetPreview`

### Responsibility

Reuse the project's existing fleet preview if one exists.

If a new shared preview is required, create only one canonical implementation.

### Requirements

- Pull from central fleet data.
- Treat current fleet models as provisional until final fleet data is supplied.
- Do not duplicate vehicle truth inside hub files.
- Support page-specific intro copy.
- Link to Fleet page.
- Avoid publishing unsupported capacities/features.

---

## 3.6 `ProcessSteps`

### Responsibility

Shared 3–4 step booking/coordination explanation.

### Content model

```ts
type ProcessStep = {
  number?: string;
  title: string;
  description: string;
};
```

### Requirements

- Keep steps short.
- Do not imply instant confirmation.
- Booking remains manually confirmed.
- For complex transport, emphasize coordination after enquiry.

---

## 3.7 `RelatedServices`

### Responsibility

Cross-link to relevant services without duplicating the primary three-service selector.

Examples:

Business Hub:

- Airport Transfer
- Private Chauffeur

Special Events Hub:

- Private Chauffeur
- Airport Transfer where relevant

### Requirements

- Internal links must use canonical locale-aware route helpers if the project provides them.
- Avoid SEO keyword stuffing.
- Do not repeat the same three child pages already shown in the main selector unless needed for end-of-page navigation.

---

## 3.8 `FinalCTA`

Reuse the existing global Final CTA component unless its API genuinely cannot support hub-specific content.

Do not fork it.

---

# 4. Shared Page Skeleton

Recommended baseline:

```txt
Site Header
Hub Hero
Hub Service Selector
Hub Capability
Hub Editorial Feature
Fleet Preview
Process / How It Works
Optional trust/proof section
Related Services
Final CTA
Site Footer
```

Business and Events may reorder or omit optional sections.

---

# 5. Data Structure

Prefer page data that clearly separates:

- SEO/meta
- hero
- service selector
- capability
- editorial section
- process
- related services
- FAQ if added later
- CTA

Example conceptual shape:

```ts
type HubPageContent = {
  seo: {...};
  hero: {...};
  services: HubServiceItem[];
  capability: {...};
  editorial: {...};
  process: ProcessStep[];
  relatedServices: {...}[];
};
```

Do not invent translations in component files.

Follow the repository's established i18n/content loading pattern.

---

# 6. SEO Requirements

Each hub page must have:

- unique localized `<title>`
- unique localized meta description
- canonical URL
- hreflang alternates following project convention
- exactly one H1
- logical H2/H3 hierarchy
- meaningful internal links to all child services
- links to relevant sibling/related services
- breadcrumb schema if the project already supports breadcrumbs
- Service / WebPage / BreadcrumbList structured data only where consistent with the project's SEO conventions

Do not add fake aggregate ratings, review counts, prices, awards, or unsupported organization claims.

The hub should target category-level intent, while child pages target specific service intent.

---

# 7. Accessibility Requirements

- Correct landmarks.
- Descriptive alt text.
- Decorative images use empty alt where appropriate.
- Keyboard-accessible links/buttons.
- Visible focus indicators.
- No interaction based solely on hover.
- Touch targets suitable for mobile.
- Text contrast meets WCAG AA.
- Motion respects `prefers-reduced-motion`.
- DOM order must match reading order.
- Avoid heading-level jumps.
- If a visual route/timeline is decorative, provide equivalent readable text.

---

# 8. Responsive Requirements

Follow the project's mobile-first and Tailwind/container-query conventions.

### Mobile

- single-column reading flow
- service selector stacks vertically
- no horizontally clipped copy
- CTA buttons remain easy to tap
- image crops prioritize vehicle/subject
- avoid overly tall media before users understand page purpose

### Tablet

- introduce split layouts only when content remains comfortable
- service selector can remain stacked or move to asymmetric grid

### Desktop

- editorial composition
- generous whitespace
- avoid stretching paragraph widths
- use existing max-content widths
- keep hierarchy obvious even on large displays

---

# 9. Performance Requirements

- Use optimized project image pipeline.
- Correct width/height/aspect information to avoid CLS.
- Lazy-load below-the-fold images where appropriate.
- Hero media may preload only if consistent with current site strategy.
- No unnecessary hydration.
- No third-party libraries for layouts that CSS can handle.

---

# 10. Acceptance Criteria

The shared primitive work is complete when:

- [ ] Both hub pages can be assembled from the same primitive set.
- [ ] Neither hub requires a monolithic special-case component.
- [ ] Service selector cleanly supports exactly three primary child services.
- [ ] Business and Events have visibly different personalities despite shared implementation.
- [ ] Mobile layout is fully usable without horizontal scrolling.
- [ ] Keyboard/focus behavior is complete.
- [ ] Reduced-motion mode is respected.
- [ ] No duplicate fleet/business truth is introduced.
- [ ] Existing global header/footer/CTA/layout components are reused.
- [ ] Locale architecture is respected.
- [ ] SEO metadata and internal links are implemented.
- [ ] No unsupported commercial claims or invented translations are added.

---

# 11. Implementation Strategy

Recommended sequence:

1. Audit current reusable page components first.
2. Reuse before creating new primitives.
3. Build the minimal shared hub primitives.
4. Implement Business Hub.
5. Implement Special Events Hub using the same primitives.
6. Compare both pages visually and structurally.
7. Refactor only after both real pages expose genuine duplication.
8. Document any new shared component APIs.

Do not prematurely abstract every section.
