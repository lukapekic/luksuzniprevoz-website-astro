# Spec Amendments & Decision Log

This file records deviations from, and reclassifications of, the
"Astro Foundation Rules Working Specification" (the `FND-*` rule set). The
spec is the source of truth; this log records where the template's default
behavior intentionally diverges, with rationale.

Amendments here are reflected in the generated traceability matrix
(`docs/rule-traceability.md`, produced by `scripts/traceability.ts`).

---

## [A-001] VRT reclassified to optional (2026-08-16)

**Affected rules:**

| Rule | Original enforcer | New enforcer |
|------|-------------------|--------------|
| `FND-THEME-10` | `auto:test` | `review` |
| `FND-UI-08` | `test:visual` | `guidance` (optional, see `docs/optional-vrt.md`) |
| `FND-UI-09` | `test:visual` | `guidance` (optional, see `docs/optional-vrt.md`) |
| `FND-UI-10` | `test:visual` | `guidance` (optional, see `docs/optional-vrt.md`) |
| `FND-UI-11` | `test:visual` | `guidance` (optional, see `docs/optional-vrt.md`) |
| `FND-UI-12` | `test:visual` | `guidance` (optional, see `docs/optional-vrt.md`) |

**Rationale:** A containerized, exhaustive VRT suite (hundreds of snapshots
across variant × size × tone × locale) has the worst cost/benefit ratio on a
~20-page template site: flake cost dominates signal, and a human reviewer
catches visual drift faster. The template targets "simple, high value," so
the default gates (unit, e2e, a11y, Lighthouse, content-lifecycle) cover the
defect classes that scale; VRT is offered as an opt-in upgrade.

**What replaces the automated enforcement:**

- `FND-THEME-10` (visual changes create a new theme version) is enforced by a
  **manual visual-review checklist** item — see
  `docs/a11y-manual-checklist.md` §10. The intent (any unintended visual
  change → new theme version) is preserved; only the automation is removed.
- `FND-UI-08`…`FND-UI-12` (exhaustive visual enumeration / snapshot
  discipline) are documented as an **optional recipe** in
  `docs/optional-vrt.md`. Teams may opt in; the default template does not run
  them and `quality:release` does not reference `test:visual`.

**Effect on gates:** `quality:release` does **not** invoke `test:visual`.
The functional e2e suite still runs across Chromium / Firefox / WebKit
(FND-COMPAT-03) — that requirement is unchanged; only the *visual snapshot*
suite is optional.

**Not waivable:** This amendment does not weaken `FND-A11Y-01` (non-waivable)
or any a11y rule. VRT was never an a11y enforcer; it was a visual-diff net.

---

## How to add an amendment

1. Add a numbered section `## [A-NNN] <title> (<date>)`.
2. List every affected rule with old → new enforcer.
3. State the rationale and what (if anything) replaces the automated
   enforcement.
4. State the effect on the quality gates.
5. Ensure `scripts/traceability.ts` and `docs/rule-traceability.md` reflect
   the new enforcers (the traceability check fails on drift).
