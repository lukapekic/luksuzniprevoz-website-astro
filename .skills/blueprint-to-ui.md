---
name: blueprint-to-ui
description: Use to implement a locked page blueprint or major page section. Converts required structure into production Astro UI without wireframe copying, omissions, CTA drift, or unauthorized redesign.
source-of-truth: AGENTS.md
---

# Blueprint to UI

## Authority

The locked blueprint owns required regions, order, relationships, factual content roles, and explicit exceptions. `DESIGN.md` and active semantic tokens own visual execution. The wireframe owns structural intent only.

## Before editing

1. Run `pnpm design:context --target <page-or-assembler> --surface <surface-id>`.
2. Read the returned blueprint, relevant contracts, target implementation, data modules, and content sources.
3. Build a compliance matrix: `requirement | authority | data source | component | responsive states | verification`.
4. Mark missing facts/assets as blocked or gated. Never fill them speculatively.

## Build rules

- Preserve required region order and CTA roles unless the blueprint explicitly permits variation.
- Reuse reviewed shared components when their contracts fit.
- Diagnose props, slots, scoped-style ownership, overflow, stacking, container ownership, and surface inheritance before changing a shared component.
- Build one bounded region at a time from authoritative content/data.
- Map geometry to semantic tokens and actual Astro components; never copy wireframe CSS into production.
- Keep logical DOM and focus order aligned across responsive states.
- Record every new component or variant and why existing contracts were insufficient.

## Responsive acceptance

For every required state in `.governance/viewports.json`, verify topology, content order, width constraints, image behavior, CTA placement, overflow, and keyboard/focus order. Phrases such as “when space allows” are not acceptance criteria.

## Exit

Reconcile every compliance-matrix row, run independent design review, then run `pnpm verify:ui --target <page-or-assembler> --surface <surface-id> --change page`. Any omitted blueprint region or undocumented deviation is blocking.
