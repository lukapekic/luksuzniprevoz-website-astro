---
name: component-architecture
description: Use when creating, extracting, refactoring, or changing Astro components, variants, primitives, controls, and page composition. Enforces ownership, API, consumer-impact, and data boundaries.
source-of-truth: AGENTS.md
---

# Component Architecture

## Authority

`AGENTS.md` owns architecture and primitive rules. The locked blueprint owns page structure. Reviewed component contracts own approved shared APIs and identity.

## Selection order

1. Use a reviewed shared component when its contract matches.
2. Add an approved variant when the same semantic object needs a bounded difference.
3. Create a page-local component for page-specific composition.
4. Create a shared component only when multiple verified consumers share a stable semantic contract.

Do not abstract merely to shorten a file or make unrelated sections visually identical.

## Contract requirements

Every component must have one clear semantic responsibility, typed props, authoritative data/content inputs, explicit slot and class-passthrough ownership, semantic HTML, complete interaction states, explicit responsive behavior, and no hidden route/theme/locale fallback.

Variants describe meaning or behavior, not arbitrary styling requests. Primitive class passthrough is layout-only unless the reviewed contract broadens it.

## Shared changes

Before editing an approved shared component, run `pnpm components:check` and the `component` verification profile. Inspect every consumer reported by the impact gate. Preserve compatibility or document and implement the migration. A page-scoped task cannot silently change unrelated consumers.

## Stop conditions

Stop if ownership is ambiguous, the change duplicates authoritative data, a requested variant is actually a redesign, or consumer impact cannot be verified.
