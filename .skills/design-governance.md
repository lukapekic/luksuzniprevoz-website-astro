---
name: design-governance
source-of-truth: AGENTS.md
description: Routes UI work through the repository's deterministic context, design detector, doctor, and focused design skills. Use for any production visual/UI task.
---

# Luxury Transportation — Design Governance

## Purpose

This skill does not define the visual language. `DESIGN.md`, the active theme, locked blueprints, and reviewed component contracts do that.

This skill defines how an agent enters and exits UI work without drifting.

## Before editing UI

Run:

```bash
pnpm design:context --target <exact-file> --surface <surface-id>
```

Read the returned authorities. Do not expand scope into unrelated documents.

If `.design/system.json` is missing or stale:

```bash
pnpm design:sync
```

## Choose one focused workflow

- new page/major section planning → `.skills/design-shape.md`
- technical/measurable quality → `.skills/design-audit.md`
- visual/UX judgment → `.skills/design-critique.md`
- final shipping refinement → `.skills/design-polish.md`
- edge cases / i18n / failures → `.skills/design-harden.md`
- responsive adaptation → `.skills/design-adapt.md`

Existing specialized skills remain authoritative for their domain, including `blueprint-to-ui`, `component-architecture`, `responsive-layout`, `tailwind-v4`, `accessibility-wcag`, and `design-review`.

## Before declaring completion

Run at minimum:

```bash
pnpm verify:ui --target <exact-file> --surface <surface-id> --change <profile>
```

For major/page work also run the existing required project gates from `AGENTS.md`.

## Core doctrine

**Refinement preserves. Redesign replaces.**

A cleanup, bug fix, responsive fix, accessibility fix, token migration, or component refactor is not permission to reinterpret the approved visual direction.

If a task requires replacing a reviewed component identity or locked blueprint structure, stop and treat that as a design-direction change under `AGENTS.md`.
