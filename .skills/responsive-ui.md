---
name: responsive-ui
description: Use for technical responsive correctness, including overflow, intrinsic sizing, logical CSS, touch targets, focus visibility, containers, wrapping, and viewport verification.
source-of-truth: AGENTS.md
---

# Responsive UI

## Authority

`AGENTS.md` owns non-waivable responsive requirements. `.governance/viewports.json` owns the review matrix. The active theme owns breakpoints, containers, gutters, and spacing values.

## Technical checks

- No accidental horizontal page overflow at any required viewport.
- No overflow suppression used to conceal the source of overflow.
- Grid/flex children use correct intrinsic constraints.
- Long localized content, unbroken data, controls, media, tables, and carousels remain contained.
- Direction-sensitive layout uses logical properties.
- DOM, reading, and keyboard order remain logical.
- Visible interactive targets meet 44×44 CSS px.
- Focus indicators remain visible and unclipped.
- Content is not removed solely to make a smaller viewport fit.
- Images have reserved geometry and intentional responsive behavior.

Diagnose the actual overflowing node and ownership chain before editing CSS.

## Verification

Use browser tests for overflow and targets at all five states. Manually verify topology, content order, image behavior, CTA placement, keyboard order, zoom, and long localized strings. Complete with the applicable `verify:ui` profile.

At minimum, responsive browser evidence records for each required width:

- `document.documentElement.scrollWidth <= document.documentElement.clientWidth`;
- one logical heading/landmark order with no duplicated responsive DOM;
- computed grid/flex topology for every breakpoint-changing component;
- loaded image dimensions and reserved media geometry;
- rendered CTA destinations, including the absence of empty or unresolved links;
- keyboard focus order and 44×44 target measurements for visible controls.

Run long reviewed locale content at the narrowest state and at every topology
transition. A short default-locale screenshot alone does not prove responsive
correctness.
