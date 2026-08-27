---
name: tailwind-v4
description: Use for Tailwind CSS v4 or production CSS changes. Enforces the repository's CSS-first setup, semantic tokens, static class detection, scoped-style ownership, and anti-regression rules.
source-of-truth: AGENTS.md
---

# Tailwind CSS v4

## Authority

`AGENTS.md` owns architecture and non-waivable CSS rules. `DESIGN.md`, the active theme selected by the site configuration, and the locked blueprint own visual decisions. This skill only defines implementation procedure.

## Required procedure

1. Run `pnpm design:context --target <exact-file> --surface <surface-id>`.
2. Inspect the global CSS entry, active generated theme output, and the component that owns the rendered DOM.
3. Use semantic project utilities or CSS variables already generated from the active theme.
4. Keep utility class names statically detectable. Map runtime variants to complete class strings.
5. Use logical properties for direction-sensitive layout.
6. Run `pnpm verify:ui --target <target> --surface <surface> --change <profile>`.

## Hard constraints

- Keep the CSS-first Tailwind v4 entry declared in `AGENTS.md`.
- Do not add v3 directives or a v3-style configuration file unless the task is an approved migration.
- Do not assume a CSS custom property automatically creates a utility.
- Use `@source` only for legitimate sources automatic detection cannot inspect.
- Use `@reference` in scoped CSS only when that stylesheet needs Tailwind theme or utility resolution.
- Parent Astro scoped selectors do not own arbitrary child-component DOM. Change the child contract or style the actual owner.
- Do not introduce raw palette, spacing, radius, font, motion, container, or breakpoint values when the design system owns the role.
- Arbitrary values require a structural need absent from the token system and an approved exception.
- Class passthrough on primitives remains layout-only unless its reviewed contract broadens it.
- Never suppress overflow to conceal a layout defect.

## Stop conditions

Stop and update the authority or token source before implementation if the requested value has no semantic role, the target surface cannot be resolved, the blueprint conflicts with the theme, or a shared-component change would alter unrelated consumers.
