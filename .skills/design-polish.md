---
name: design-polish
source-of-truth: DESIGN.md
description: Final bounded visual refinement pass after implementation, audit, and critique. Preserves the approved design world.
---

# Design Polish

## Preconditions

- implementation is complete;
- blueprint structure is present;
- P0/P1 technical findings are already resolved;
- no unresolved product-data blocker is being hidden by styling.

Load `.skills/design-craft-floor.md` immediately before editing.

## Process

1. Inspect mobile, tablet portrait, tablet landscape, desktop, and wide desktop together.
2. Make one batched correction pass for:
   - spacing rhythm;
   - type hierarchy;
   - alignment;
   - image crop/position;
   - CTA emphasis;
   - border/radius/shadow consistency;
   - localized text fit.
3. Re-render once.
4. Fix only remaining clear regressions.
5. Stop.

## Completion

```bash
pnpm design:detect <target>
pnpm check
```

Use the page-specific gates required by `AGENTS.md`.

Polish is not permission to add new effects, replace component identity, or change page structure.
