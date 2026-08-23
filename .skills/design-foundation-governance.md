---
name: design-foundation-governance
description: >
  Mandatory Luxury Transportation design-foundation enforcement. Use whenever creating,
  editing, reviewing, or reasoning about visual UI, page composition, section surfaces,
  typography usage, spacing, radius, motion, grid/container behavior, or design tokens.
---

# Luxury Transportation — Design Foundation Governance

## 0. Mission

Protect the locked visual foundation from agent drift.

The project must feel:

- luxury;
- professional;
- sharp;
- calm;
- contemporary;
- editorial;
- operationally confident.

It must not drift into:

- generic black/gold limousine cliché;
- soft SaaS/dashboard UI;
- silver/blue corporate styling;
- excessive card grids;
- excessive rounding;
- decorative animation;
- generic AI landing-page aesthetics.

This skill governs visual-system decisions.

It does not replace:
- page blueprints;
- component architecture;
- Tailwind v4 rules;
- accessibility rules;
- content/SEO rules.

## 1. Mandatory files to inspect

When available, read:

```text
design-system.v1.md
design-system.v1.json
design-decisions.md
components-rules.v1.md
palette.v1.json
typography.v1.json
spacing.v1.json
radii.v1.json
motion.v1.json
layout.v1.json
```

If the task is page-specific, also read the page blueprint before changing composition.

## 2. Authority

Use this order:

1. explicit task instruction;
2. locked page blueprint;
3. locked design decisions;
4. approved component rules;
5. design-system/token sources;
6. product foundation;
7. wireframe structural intent;
8. existing approved production components;
9. external references;
10. model preference.

Do not reopen locked decisions silently.

## 3. Visual direction

Default direction:

```text
Warm charcoal
+
cream
+
restrained muted gold
+
editorial serif headings
+
clean sans-serif operational UI
+
contained cinematic photography
+
controlled whitespace
+
modular grid
```

Default page balance is approximately:

```text
70–80% dark
20–30% light
```

This is not a quota.

Surface choice must be semantic.

## 4. Palette governance

Locked semantic roles include:

```text
background       #171310
surface          #211B17
surfaceElevated  #2A221D
surfaceLight     #F3EDE3
inputSurface     #FAF6F0
accent           #C49A58
accentHover      #D2AA68
textPrimary      #F5EFE6
textMuted        #C8BCAF
textOnLight      #211B17
borderSubtle     #3A302A
inputBorder      #87776A
divider          #332A24
focusDark        #E0B86F
focusLight       #7A5525
```

Components consume semantic tokens.

Do not hardcode these values inside components.

Do not create a parallel palette.

## 5. Gold scarcity rule

Gold is an accent, not a theme fill.

Approved uses:

- primary CTA;
- selected state;
- focus state where accessible;
- short heading accent rule;
- a restrained number of icons/details.

Do not use gold for:

- body text;
- every icon;
- every heading;
- large decorative backgrounds;
- borders around every card;
- generic "luxury" decoration.

Dark text is required on gold CTA backgrounds.

## 6. Surface hierarchy

Use:

```text
background
surface
surfaceElevated
surfaceLight
```

with purpose.

### Open section

Content sits naturally on the page canvas.

### Contained feature panel

Use only where the blueprint/component gives the section a contained visual identity.

### Light surface

Use for readability/function such as:

- pricing;
- forms;
- calculator;
- FAQ;
- long reading;
- intentional How It Works panel.

Do not mechanically alternate dark/light sections.

## 7. Same-surface adjacency

If two adjacent sections use the same elevated surface, separate them through:

- surrounding page canvas;
- approved section rhythm;
- composition;
- heading hierarchy.

Do not automatically solve adjacency with:

- gold borders;
- large shadows;
- random surface changes;
- arbitrary radius changes.

## 8. Card philosophy

Cards must not become dashboard cards.

Default:

- surface contrast rather than border;
- no obvious shadow;
- no heavy elevation;
- restrained radius;
- no physical hover movement.

Before creating a card ask:

> Does this content actually represent a bounded reusable item?

Do not make every content cluster a card.

## 9. Nested-card warning

Whenever a contained section contains multiple inner cards, check for:

```text
BIG CARD
  ├─ CARD
  ├─ CARD
  └─ CARD
```

If the visual hierarchy becomes dashboard-like:

- reduce inner surface strength;
- remove unnecessary borders/shadows;
- let imagery/dividers/spacing define items;
- preserve semantic grouping without stacking surfaces.

Nested surfaces require justification.

## 10. Radius system

Locked defaults:

```text
section/hero/feature panel  1rem / 16px
card/image panel            0.75rem / 12px
controls                    0.5rem / 8px
```

Do not introduce:

```text
1.5rem
2rem
3rem
```

SaaS-style rounding by default.

Blueprint-specific exceptions must be documented.

## 11. Spacing tiers

Approved section-separation tiers:

```text
compact   clamp(3rem, 5vw, 4rem)
standard  clamp(4rem, 7vw, 6rem)
feature   clamp(5rem, 9vw, 8rem)
```

These represent page-level rhythm.

They are **not** universal internal component gaps.

Do not use section spacing for:

- field gaps;
- card padding;
- heading-to-description gap;
- icon-to-title gap.

Use the existing internal spacing scale/Tailwind tokens for component internals.

If the project lacks an internal spacing token for a repeated relationship, propose one rather than abusing section spacing.

## 12. Content-density proportionality

Whitespace must correspond to content role.

Do not create huge empty vertical regions merely because the project is premium.

A compact footer stays compact.

A Final CTA remains medium-height.

A trust section stays compact.

Luxury spacing means deliberate hierarchy, not maximum empty space.

## 13. Layout system

Main page container:

```text
~1280px max
```

Reading width:

```text
~920px max
```

Grid:

```text
mobile   4 columns
tablet   8 columns
desktop 12 columns
```

Approved desktop compositions:

```text
12
6/6
5/7
7/5
4/4/4
8/4
3/3/3/3 sparingly
```

Other compositions require blueprint approval.

## 14. Alignment

Left alignment is the default.

Centered alignment is reserved for intentionally singular compositions such as:

- selected Final CTA treatment;
- Google Reviews heading if blueprint calls for it;
- short trust statement;
- selected How It Works intro.

Do not center everything because it looks "luxury."

## 15. Heading decoration

Avoid uppercase eyebrow labels.

Approved default major-heading decoration:

```text
short muted-gold accent rule
```

aligned left.

Sequence numbers such as:

```text
01 / 02 / 03
```

are reserved for genuinely sequential content.

Wireframe labels are not production eyebrows.

## 16. Motion

Motion is sparse.

Approved:

- gentle one-time hero copy entrance;
- extremely slow hero image zoom/pan;
- selected key-section soft reveal;
- subtle button color transition;
- subtle link underline/color transition;
- restrained image brightness/contrast hover;
- understated carousel transitions.

Forbidden by default:

- bounce;
- spring;
- jumping cards;
- routine scale-on-hover;
- exaggerated parallax;
- autoplay hero video;
- animation on every section.

Reduced motion is mandatory.

## 17. Borders and shadows

Prefer surface contrast and spacing.

Borders/dividers are appropriate when they improve comprehension, especially:

- FAQ rows;
- pricing rows;
- form controls;
- navigation/footer;
- dense lists.

Avoid decorative borders around ordinary sections/cards.

Avoid obvious shadows.

## 18. Component hover identity

Default:

### Buttons
- same-hue brightness/color shift;
- no scale;
- no jump.

### Links
- subtle color/underline transition;
- no positional movement.

### Images
- brightness/contrast shift;
- no scale unless a documented component exception exists.

## 19. Anti-AI visual patterns

Do not default to:

- gradient blobs;
- glassmorphism;
- glowing CTA buttons;
- gradient text;
- excessive pills;
- every section in a rounded box;
- huge rounded corners;
- arbitrary overlapping blobs;
- icon/title/body card grids repeated everywhere;
- constant alternating image/text zig-zags;
- fake metrics;
- excessive decorative separators;
- strong card hover elevation;
- image zoom everywhere;
- identical section treatment repeated down the page.

## 20. Blueprint exceptions

A page blueprint may explicitly override a generic rule.

Examples:

- homepage ServiceShowcase uses asymmetric 35/30/35-style mosaic;
- homepage ServiceShowcase uses full-card imagery instead of generic ServiceCard structure;
- Final CTA may use restrained warm-charcoal → warm-brown gradient;
- homepage How It Works is intentionally light.

Do not generalize a page exception to unrelated pages.

## 21. Global components

Global components such as:

```text
Header
Footer
Button
Breadcrumbs
FAQ
FinalCTA
```

should be reused.

A page implementation agent must not redesign them locally unless the task explicitly changes the global component.

## 22. Final self-check

Before completing design work:

- [ ] palette uses semantic tokens;
- [ ] gold remains scarce;
- [ ] light surfaces are semantic;
- [ ] radius system preserved;
- [ ] section rhythm uses approved tiers;
- [ ] internal spacing is not using section tokens;
- [ ] no dashboard/card-grid drift;
- [ ] no generic AI visual effects;
- [ ] left alignment preserved unless intentionally overridden;
- [ ] motion remains sparse;
- [ ] same-surface sections remain distinct without decoration hacks;
- [ ] blueprint exceptions remain page-specific;
- [ ] global components were reused rather than reinterpreted.
