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

Every transition must have a deterministic condition. Do not use “when space allows,” “roughly desktop,” or other untestable language in a locked contract.

## Implementation rules

- Start from the logical mobile structure, then add complexity when the tokenized layout contract permits it.
- Keep meaningful content present unless the blueprint authorizes omission.
- Preserve DOM order; do not use CSS reordering that breaks reading or focus order.
- Use logical properties and semantic container/gutter/spacing roles.
- Cap wide layouts with approved container and measure roles.
- Treat tablet portrait and landscape as different acceptance states.
- Do not hide real overflow with clipping or global overflow suppression.
- Maintain 44×44 targets and perceivable focus at every state.

## Exit

Run the applicable `verify:ui` profile and responsive Playwright coverage. Record manual evidence for intent that automation cannot prove.
