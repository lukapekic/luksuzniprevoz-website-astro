---
name: design-foundation-governance
description: >
  Mandatory Luxury Transportation design-foundation enforcement. Use whenever creating,
  editing, reviewing, or reasoning about visible UI, page composition, typography,
  surfaces, spacing, radius, motion, grid/container behavior, or design tokens.
---

# Luxury Transportation — Design Foundation Governance

## 0. Mission

Protect the active design system from agent drift.

Current production direction is **Black & Platinum**.

The project must feel:

- premium;
- professional;
- sharp;
- calm;
- contemporary;
- discreet;
- operationally confident.

It must not drift into:

- generic black/gold limousine styling;
- newspaper/editorial-serif styling;
- soft SaaS/dashboard UI;
- blue/silver corporate templates;
- excessive card grids;
- excessive rounding;
- decorative animation;
- generic AI landing-page aesthetics.

This skill governs process and enforcement. It does not store a second copy of raw theme values.

## 1. Mandatory files to inspect

For visual work read:

```text
AGENTS.md
DESIGN.md
site/luksuzni-prevoz/foundation.config.ts
site/luksuzni-prevoz/src/theme/versions/<activeThemeVersion>/
```

Inspect the relevant JSON files for the task:

```text
manifest.json
palette.json
typography.json
spacing.json
radii.json
motion.json
layout.json
```

If the task is page-specific, read the locked page blueprint before changing composition.

If there is an approved shared component involved, inspect its current verified source/API before redesigning it.

## 2. Authority

Use the design hierarchy defined in `DESIGN.md`.

A skill never overrides:

```text
locked page blueprint
DESIGN.md
configured active theme JSON
validated shared component contract
```

Do not reopen locked decisions silently.

## 3. Current active-theme contract

The site config selects the raw token source. It currently selects Theme V2; do not encode that current selection into shared tooling.

Current type roles:

```text
Headings     → Inter Tight
Body / UI    → Manrope
BrandLockup  → Cormorant Garamond Italic
```

Current visual direction:

```text
near-black / graphite surfaces
+
off-white text
+
restrained platinum accent
+
light-neutral functional surfaces where semantically useful
```

Do not reintroduce Fraunces, Instrument Serif, gold-first styling, or old warm-charcoal values.

## 4. Token governance

Components consume semantic tokens.

Do not:

- hardcode palette values in components;
- create page-local token sets;
- copy raw configured-theme values into skills/page docs;
- invent new spacing/radius/color values because an approximation looks close;
- manually edit generated `theme.css`.

If a global token must change:

```text
configured active theme JSON
→ theme validation/sync
→ generated CSS
→ implementation review
```

## 5. Platinum restraint

Platinum is an accent, not a theme fill.

Suitable uses include:

- important action treatment where component rules call for it;
- focus/selected states;
- short rules/dividers/details;
- small high-value emphasis.

Do not use platinum for:

- every icon;
- body text;
- every heading;
- every border;
- large decorative backgrounds;
- chrome/metallic effects.

A premium result should still work primarily through graphite surfaces, off-white text, spacing, imagery, and hierarchy.

## 6. Surface hierarchy

Use semantic roles intentionally:

```text
background
surface
surfaceElevated
surfaceLight
inputSurface
```

### Open section

Content sits naturally on the page canvas.

### Contained feature panel

Use only when the blueprint/component gives the section a contained identity.

### Light surface

Use for readability or function, such as:

- forms;
- calculators;
- pricing;
- FAQ/reading;
- blueprint-approved contrast moments.

Do not alternate dark/light sections mechanically.

## 7. Same-surface adjacency

Separate adjacent dark sections through:

- spacing rhythm;
- composition;
- imagery;
- heading hierarchy;
- contained/open topology.

Do not automatically solve adjacency with:

- accent borders;
- large shadows;
- random surface changes;
- arbitrary radius changes.

## 8. Card philosophy

Cards must not become dashboard cards.

Default priorities:

```text
surface contrast
spacing
content hierarchy
image role
```

before:

```text
border
shadow
decoration
```

Do not put every information group inside a rounded container.

## 9. Nested-card warning

Avoid card-inside-card compositions unless a real interaction/data hierarchy requires them.

Before nesting, ask whether:

- a divider;
- open layout;
- typography;
- spacing;
- a single parent surface;

would communicate structure better.

## 10. Radius system

Use the configured active theme's semantic radius tokens.

Role hierarchy:

```text
control
card/media
section/major panel
```

Do not substitute arbitrary `rounded-*` values across similar components.

Do not inflate radius to create artificial softness.

## 11. Spacing tiers

Page rhythm uses the configured active theme's section spacing tiers:

```text
compact
standard
feature
```

Choose by section role and blueprint.

Do not invent large whitespace to make a page feel premium.

## 12. Content-density proportionality

Section height must correspond to:

- content;
- image role;
- conversion importance;
- blueprint spacing tier.

Examples:

- Trust is compact.
- Footer is compact.
- Final CTA is a medium-height closer.
- Hero is the dominant entrance.
- Reading/functional sections receive the space needed for clarity, not theatrical emptiness.

## 13. Layout system

Use the configured active theme layout JSON for:

- main/reading/narrow containers;
- page gutters;
- responsive grid counts;
- column gaps;
- breakpoints;
- approved composition ratios.

A blueprint may define an explicit exception such as a Homepage service mosaic or full-bleed Hero.

Do not convert every section into a 12-column composition when the component's container width is the real driver.

Use container queries where appropriate.

## 14. Full-bleed vs contained ownership

"Full-bleed" describes the visual/media/surface footprint, not necessarily the text measure.

A full-bleed section may still contain an inner `PageContainer`.

When blueprint says full-bleed Hero:

```text
viewport-width media/surface
+
contained inner content alignment
```

Do not wrap the entire Hero in a main-width container and call the background full bleed.

## 15. Alignment

Strong alignment is a luxury signal.

Prefer:

- consistent container edges;
- deliberate grid starts;
- intentional baseline relationships;
- controlled asymmetry.

Avoid random offsets and decorative overlaps.

## 16. Typography

Typography implementation belongs to `.skills/typography-system.md`.

At design-foundation level:

- page headings use Inter Tight;
- body/UI use Manrope;
- BrandLockup uses Cormorant Garamond Italic only;
- heading scale comes from configured active-theme tokens;
- font loading must be verified in browser.

Do not accept a "similar-looking" fallback.

## 17. Heading decoration

Do not add eyebrow labels/rules to every section.

Use a short accent rule or small label only where it improves hierarchy and the blueprint/component identity supports it.

Decorative platinum details should remain sparse.

## 18. Motion

Use configured active-theme motion tokens.

Motion must be:

- subtle;
- purposeful;
- low-amplitude;
- reduced/disabled under `prefers-reduced-motion`.

Do not add decorative loops, floating cards, glow pulses, or dramatic parallax.

## 19. Borders and shadows

Use borders as quiet separators.

Use shadows rarely.

Before adding either, try:

- spacing;
- surface contrast;
- composition;
- imagery.

## 20. Hover identity

Components remain physically stable unless their approved interaction requires movement.

### Buttons

Use restrained state change.

### Links

Use clear hover/focus indication without decorative motion.

### Images

Subtle image-only brightness/contrast/scale may be allowed by component rules.

Do not make cards jump upward by default.

## 21. Astro scoped-style integration

Visual defects can be integration defects.

If a parent Astro component passes a class into a child component and then styles that class from a scoped `<style>`, verify whether the scoped attribute reaches the child-rendered DOM.

Do not assume it does.

For missing/hidden content diagnose:

```text
DOM ownership
scoped selector match
position
z-index
stacking context
transform/filter/isolation
overflow
container wrapper behavior
```

before redesigning.

## 22. Anti-AI visual patterns

Reject default use of:

- glassmorphism;
- glow;
- gradient text;
- decorative gradient blobs;
- excessive pills;
- giant rounded rectangles;
- strong shadows;
- repeated icon cards;
- fake metrics;
- centered-everything;
- giant empty sections;
- routine zig-zag image/text;
- "luxury" metallic/gold decoration.

## 23. Blueprint exceptions

A page blueprint may authorize exceptions to generic layout rules.

Examples can include:

- full-bleed Hero;
- asymmetric service mosaic;
- intentional light panel;
- restrained Final CTA gradient.

Exceptions are local.

Do not generalize them to unrelated pages.

## 24. Global components

Approved global infrastructure should remain stable.

When it looks wrong in a page, investigate:

```text
prop/data wiring
CSS/scoped-style ownership
stacking context
parent overflow
container ownership
surface inheritance
responsive parent constraints
duplicate/legacy path
```

before changing the component design.

## 25. Final self-check

Before completing visible UI work:

- [ ] Current page blueprint was read.
- [ ] `DESIGN.md` was read.
- [ ] Configured active-theme JSON was inspected.
- [ ] No raw token values were duplicated into the component.
- [ ] Inter Tight/Manrope/Cormorant roles are preserved.
- [ ] Platinum remains restrained.
- [ ] Surface choice is semantic.
- [ ] Radius/spacing use theme roles.
- [ ] No unnecessary cardification was introduced.
- [ ] Full-bleed/contained ownership matches the blueprint.
- [ ] Responsive states preserve hierarchy.
- [ ] Reduced-motion behavior is respected.
- [ ] Shared components were not redesigned without proven root cause.
