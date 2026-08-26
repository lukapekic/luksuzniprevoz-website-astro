# Private Chauffeur Feature — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

This is the Homepage-specific composition of the shared `OpenSplitSection` pattern.

Use:

```text
AGENTS.md
DESIGN.md
active Theme V2
Homepage Blueprint
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/imagery-art-direction.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Theme values are consumed semantically; do not duplicate palette/radius/type values here.

## Section

- open dark section;
- uses the blueprint-approved `feature` section rhythm;
- no outer panel or enclosing text card;
- content and image remain visually distinct through layout, not cardification.

## Desktop composition

Locked content/image relationship:

```text
5fr 7fr
```

- content left;
- contextual image right;
- align the two regions so the copy remains readable and the image remains visually dominant;
- use Theme V2 grid/gutter spacing rather than introducing a second spacing scale.

## Tablet

Stack when the 5/7 split makes copy, package summary or CTA cramped.

The decision should follow available component/container width, not a forced desktop assumption.

## Mobile

- single column;
- content first;
- image second;
- no horizontal overflow;
- CTA retains accessible target sizing.

## Content stack

Order:

1. restrained accent rule
2. H2
3. concise body copy
4. package summary
5. one service-level CTA

All internal gaps use the active Theme V2 spacing scale. Do not preserve old literal gap values as a second design system.

## Accent rule

The rule is a small visual accent only:

- use the semantic `accent` role (Platinum in Theme V2);
- keep it restrained;
- do not use raw accent hex values;
- do not turn it into a decorative gold motif.

## Package summary

Purpose: communicate the three service modes without creating a pricing UI.

Desktop:

```text
Hourly | Half Day | Full Day
```

- three equal informational columns;
- structural separators use the semantic `divider` role;
- spacing comes from Theme V2;
- no individual cards, pills or boxes.

Mobile:

- one column;
- horizontal dividers between items;
- no card boxes.

## Data ownership

Package labels/details come from canonical localized Homepage/service data.

Numeric prices, allowances or operational limits must come from the validated pricing/service data sources when they are intentionally shown.

Never hardcode business facts inside this visual composition.

## Image

- contextual chauffeur/S-Class image;
- preserve the blueprint's approximate 4:3 image relationship;
- image/media radius uses the Theme V2 semantic `card` role;
- cover behavior with explicit focal positioning;
- responsive crop must be reviewed at mobile, tablet portrait, tablet landscape and desktop.

## Typography / colors

Use semantic roles only:

```text
heading / labels     → textPrimary
body / support       → textMuted
accent detail        → accent
structural separator → divider
```

Typography:

```text
heading → Inter Tight through font-heading
body/UI → Manrope through font-body
```

## Forbidden

- three pricing cards;
- duplicated pricing table;
- enclosing text-side card;
- raw theme values;
- old V1 gold/Fraunces assumptions;
- decorative zig-zag reversal not authorized by the blueprint.
