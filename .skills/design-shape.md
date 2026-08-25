---
name: design-shape
description: Plans a new page or major UI section before implementation. Produces topology, component mapping, data mapping, and responsive behavior; does not write production code.
---

# Design Shape

Use for a new page or major section before implementation.

## Inputs

1. `pnpm design:context <target-or-surface>`
2. locked blueprint
3. relevant wireframe
4. relevant shared component contracts
5. authoritative data/content modules

## Output

Produce only:

- section order;
- component reuse/new-component decision;
- semantic surface role per section;
- desktop topology;
- mobile/tablet transformation;
- CTA roles;
- imagery role;
- authoritative data source per factual block;
- explicit unresolved/data-gated items;
- implementation file map.

## Rules

- Do not invent visual tokens.
- Do not redesign reviewed global components.
- Do not treat wireframe pixels as production values.
- Prefer existing primitives/compositions when their identity matches.
- Do not create a generic abstraction for a one-page section merely because it looks reusable.
- If the blueprint conflicts with current product truth, flag the conflict before implementation.
