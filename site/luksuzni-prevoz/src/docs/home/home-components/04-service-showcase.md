# ServiceShowcase — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

This document defines Homepage-specific composition only.

Use:

```text
AGENTS.md
DESIGN.md
active Theme V2
Homepage Blueprint
Homepage Wireframe
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Theme values are not redefined here. Read colors, spacing, radii, typography, layout and breakpoints from the active Theme V2 sources.

## Section

- open dark Homepage section;
- section rhythm uses the blueprint-approved semantic spacing tier;
- heading remains left aligned;
- heading measure uses the appropriate Theme V2 content measure;
- no outer panel around the service mosaic.

## Desktop composition

Use the locked Homepage-specific asymmetric mosaic:

```text
35fr 30fr 35fr
```

The final region contains Business and Special Events stacked vertically.

All four regions resolve into one coherent overall rectangular footprint.

DOM/content order remains:

1. Private Chauffeur
2. Airport Transportation
3. Business Transportation
4. Special Events

Private Chauffeur is dominant by footprint only. Do not add a Featured badge.

## Tablet portrait

- switch to a clean `2 × 2` layout;
- allow card height to become content/container appropriate;
- do not preserve desktop asymmetry when it compromises readability;
- do not use orientation-specific hacks when the standard responsive system can express the layout.

## Tablet landscape

Re-enable the asymmetric mosaic only when the available container width supports the intended proportions without cramped labels or controls.

## Mobile

- one service per row;
- use the Theme V2 card gap/section rhythm;
- do not preserve the desktop masonry proportions;
- no horizontal page overflow.

## Heading

- H2 uses the semantic heading system (`font-heading` → Inter Tight);
- supporting copy uses the semantic body system (`font-body` → Manrope);
- colors use Theme V2 `textPrimary` / `textMuted` roles;
- supporting line should remain concise.

## Cards

Use the approved ServiceCard contract.

Service imagery fills each card edge-to-edge. Title and CTA sit over the internal readability scrim.

Do not add:

- an outer Services panel;
- visible production borders for decoration;
- heavy shadows;
- per-card pricing;
- extra badges or icon rows;
- Homepage-local raw color/radius values.

## Ownership

`ServiceShowcase` owns:

- Homepage mosaic topology;
- card placement;
- responsive topology;
- section-level heading/CTA composition when required by the implementation.

`ServiceCard` owns:

- individual card media;
- internal scrim;
- card content placement;
- card interaction state.

The page assembly must not duplicate those responsibilities.
