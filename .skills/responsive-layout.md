---
name: responsive-layout
description: Use for responsive composition of pages, sections, grids, splits, images, carousels, forms, and navigation. Requires explicit topology and acceptance at every repository viewport state.
source-of-truth: AGENTS.md
---

# Responsive Layout

## Authority

The blueprint defines responsive structural intent. Active semantic layout and breakpoint tokens define implementation thresholds. `.governance/viewports.json` defines mandatory review states; it does not replace token-owned breakpoints.

## Required contract

For mobile, tablet portrait, tablet landscape, desktop, and wide desktop, document topology, logical content/DOM order, width and measure constraints, image behavior, CTA placement, interaction behavior, overflow, and keyboard/focus order.

Use the repository reference widths as five distinct evidence points:

```text
320   mobile
768   tablet portrait
1024  tablet landscape
1440  desktop
1920  wide desktop
```

The locked contract must state the exact tokenized threshold for every topology
change. If a component changes at a threshold between two reference widths,
verify the computed topology on both sides of that threshold as well as at the
five reference widths.

Every transition must have a deterministic condition. Do not use “when space allows,” “roughly desktop,” or other untestable language in a locked contract.

## Implementation rules

- Start from the logical mobile structure, then add complexity when the tokenized layout contract permits it.
- Keep meaningful content present unless the blueprint authorizes omission.
- Preserve DOM order; do not use CSS reordering that breaks reading or focus order.
- Keep one semantic DOM tree when a composition changes from image-backed to split, or from stacked to columns.
- Use logical properties and semantic container/gutter/spacing roles.
- Cap wide layouts with approved container and measure roles.
- Treat tablet portrait and landscape as different acceptance states.
- Verify that component-scoped styles own the actual grid/flex DOM node. A class passed through a child component is not evidence that the parent scoped selector can style the child's rendered DOM.
- Do not hide real overflow with clipping or global overflow suppression.
- Maintain 44×44 targets and perceivable focus at every state.

## Exit

Run the applicable `verify:ui` profile and responsive Playwright coverage. Record manual evidence for intent that automation cannot prove.
