---
name: design-adapt
description: Responsive adaptation workflow using the project's tokenized breakpoints and explicit device-state acceptance model.
---

# Design Adapt

Do not treat responsive work as desktop shrinking.

## Required states

Use the active theme breakpoint tokens and `DESIGN.md` acceptance model:

- mobile;
- tablet portrait;
- tablet landscape;
- desktop;
- wide desktop.

## For each section verify

- content order;
- column topology;
- image role/crop;
- CTA placement;
- container/gutter role;
- text measure;
- touch targets;
- overflow;
- spacing rhythm;
- whether asymmetry should collapse or remain.

## Rules

- Breakpoint values come from the active theme; do not hard-code parallel breakpoints.
- A static wireframe does not override responsive behavior defined by the blueprint/component contract.
- Tablet portrait and tablet landscape are separate acceptance states.
- Preserve component identity when topology changes.
