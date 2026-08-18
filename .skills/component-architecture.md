---
name: component-architecture
description: >
  Governs Astro component design architecture for Luxury Transportation. Use when
  creating, extracting, refactoring, reviewing, or selecting reusable UI components,
  variants, section primitives, form controls, carousels, or page-local compositions.
---

# Luxury Transportation — Component Architecture

## 0. Mission

Create a component system that is:

- reusable;
- semantically clear;
- intentionally small;
- blueprint-driven;
- design-token driven;
- accessible;
- easy for future agents to understand.

Avoid both:

```text
one-off component explosion
```

and:

```text
universal mega-component explosion
```

## 1. Reuse decision order

Before creating anything:

1. Can an existing approved component solve it unchanged?
2. Can an approved documented variant solve it?
3. Can a low-level existing primitive compose it?
4. Is the pattern page-local?
5. Does the blueprint justify a new reusable component?
6. Does repeated use across pages justify extraction?

Reuse first.

Modify second.

Create third.

## 2. Blueprint drives component need

A new component or visual variant requires a real blueprint use case.

Do not create variants in anticipation of hypothetical future pages.

Do not create a "flexible" API merely because it might be useful later.

## 3. Small APIs

Prefer:

```ts
variant?: 'dark' | 'light'
```

over:

```ts
backgroundColor
textColor
radius
shadow
padding
headingColor
imagePosition
imageSize
border
```

Components consume semantic design tokens.

Do not expose raw styling knobs.

## 4. Default + legitimate alternate

Preferred component family:

```text
one default
+
one legitimate alternate
```

not:

```text
17 visual variants
```

Variants should preserve:

- structure;
- semantic role;
- spacing;
- typography;
- accessibility;
- responsive behavior;

unless blueprint documentation explicitly requires structural change.

## 5. When a separate component is better than a variant

Create a separate component when the element's **identity and structure** differ.

Example:

```text
ServiceCard
```

versus homepage:

```text
ServiceShowcase
```

The homepage composition is not merely:

```text
<ServiceCard variant="mosaic" />
```

if its image/content relationship and layout are fundamentally different.

Similarly:

```text
HomepageHero
ServiceHero
FinalCTA
```

should not automatically collapse into one generic:

```text
<ImageTextPanel type="..." />
```

## 6. Component identity

A component is defined by:

- semantic purpose;
- content structure;
- visual role;
- responsive behavior;
- interaction model.

Not merely by shared CSS.

Two sections can share grid primitives without being the same component.

## 7. Composition vs primitive

Prefer layered architecture.

Example:

```text
WhyChooseUs
  └─ TrustStrip
       └─ TrustItem
```

or:

```text
GoogleReviews
  └─ HorizontalCarousel
       └─ ReviewCard
```

The page section owns semantics.

The primitive owns reusable mechanics.

## 8. Avoid semantic over-abstraction

Do not create:

```text
AirportInclusionItem
ArrivalHandlingItem
ServiceStandardItem
```

when these are structurally identical low-level rows.

Consider a primitive such as:

```text
InfoRow
DividerList
InfoItem
```

while page-level sections retain semantic names.

## 9. Avoid mega-primitives

Do not create:

```astro
<InfoGrid
  columns={4}
  dark
  icons
  divided
  compact
  imageLeft
  outlined
  horizontalOnTablet
  ...
/>
```

to support unrelated patterns.

If the API needs many booleans to describe appearance, boundaries are probably wrong.

## 10. Page-local compositions

Not every section deserves global extraction.

Keep a composition page-local when:

- it appears once;
- it is blueprint-specific;
- its structure is unlikely to repeat;
- extraction would create an abstraction without semantic reuse.

Page-local does not mean hardcoded design values.

It still uses:

- tokens;
- primitives;
- approved controls;
- shared layout utilities.

## 11. Promote repeated patterns deliberately

Promote a page-local composition to shared component only after:

- another page genuinely needs it;
- semantics align;
- responsive behavior aligns;
- visual role aligns.

Do not generalize based on superficial similarity.

## 12. Global primitives we expect

Likely project-wide primitives/components include:

```text
PageContainer
ReadingContainer
Section
SectionHeading
Button
Breadcrumbs
Header
Footer
FAQ
FinalCTA
HorizontalCarousel
```

Potentially:

```text
InfoRow / DividerList
FormField family
ContextNotice
```

Final names should follow repository conventions.

## 13. Button architecture

Button system must encode:

```text
primary
secondary
```

and possibly a clearly justified compact/text action treatment.

Do not create one-off button styles per section.

Button component owns:

- typography;
- height/padding;
- radius;
- hover;
- active;
- focus-visible;
- disabled;
- optional icon spacing.

CTA **meaning** still comes from page blueprint.

## 14. SectionHeading architecture

A reusable heading primitive should stabilize:

- H2/H3 visual scale;
- optional description;
- optional approved accent rule;
- alignment;
- max text measure;
- spacing.

Do not expose random visual props.

Wireframe uppercase labels are not eyebrow props.

## 15. Layout primitives

Prefer canonical layout primitives/utilities for:

```text
page container
reading container
section spacing
feature panel
```

Avoid every section independently declaring:

```text
max-w-7xl
max-w-[1280px]
px-4 md:px-8
```

## 16. Carousel architecture

Fleet and Reviews share low-level mechanics:

- horizontal track;
- overflow viewport;
- touch/swipe;
- keyboard controls;
- accessible labels;
- no autoplay;
- reduced motion;
- partial-next-item affordance.

Prefer one low-level carousel primitive.

Do not force FleetCard and ReviewCard into one visual card component.

## 17. Form/control architecture

Functional pages should reuse a family of controls:

```text
FormField
SelectField
DateTimeField
SegmentedControl
FieldHint
FieldError
ContextNotice
PriceResult
```

Exact boundaries depend on implementation.

Do not let every calculator/booking page invent controls.

## 18. Content ownership

Reusable components receive content through props/data.

Do not embed:

- localized marketing copy;
- FAQ content;
- pricing;
- route values;
- service relations;
- contact details;

inside reusable visual components.

## 19. Data ownership

Pricing/calculator/booking share validated data.

Fleet recommendations come from structured data.

Routes/locale paths come from routing/data infrastructure.

Components render data; they do not become data sources.

## 20. Static Tailwind variant maps

For visual variants use complete static class strings.

Example:

```ts
const variants = {
  dark: "...",
  light: "...",
} as const;
```

Do not generate dynamic Tailwind fragments.

Follow the Tailwind v4 skill.

## 21. Accessibility ownership

A reusable interactive component owns its accessibility contract.

Examples:

### Accordion
- button semantics;
- expanded state;
- controlled region;
- keyboard behavior.

### Carousel
- labelled controls;
- keyboard operability;
- reduced motion.

### Button
- focus-visible;
- disabled semantics.

Do not delegate accessibility to every page.

## 22. Responsive ownership

Reusable components own their normal responsive behavior.

Page blueprints may authorize documented exceptions.

A static page wireframe does not redefine the global component every time.

## 23. Global component immutability

Page agents reuse:

```text
Header
Footer
Button
FAQ
FinalCTA
```

instead of locally rewriting them.

If a page requires a global-component change:

1. identify it explicitly;
2. verify cross-page impact;
3. modify the shared component;
4. review affected pages.

## 24. Creation checklist

Before creating a component:

- [ ] existing component searched;
- [ ] existing variant searched;
- [ ] blueprint justifies need;
- [ ] semantic purpose defined;
- [ ] component identity distinct;
- [ ] API small;
- [ ] no raw design props;
- [ ] content stays external;
- [ ] data stays external;
- [ ] mobile behavior defined;
- [ ] tablet behavior defined;
- [ ] focus/keyboard behavior defined if interactive;
- [ ] localization expansion considered;
- [ ] reduced motion considered;
- [ ] no unnecessary dependency introduced.

## 25. Review rejection patterns

Reject:

```text
<Button gold rounded="xl" shadow />
```

Reject:

```text
<Card variant="airport-arrival-trust-dark-compact" />
```

Reject:

```text
<UniversalSection imageLeft dark split="5/7" faqMode ... />
```

Reject duplicated carousel implementations.

Reject one-off controls that duplicate established form primitives.

Reject page-local copies of global Header/Footer/FinalCTA.

## 26. Completion report

Report:

```text
REUSED COMPONENTS:
NEW COMPONENTS:
PAGE-LOCAL COMPOSITIONS:
NEW VARIANTS:
WHY EACH NEW ABSTRACTION IS JUSTIFIED:
GLOBAL IMPACT:
```
