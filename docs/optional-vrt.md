# Optional: Visual Regression Testing (VRT)

> **Status: optional / opt-in.** The Foundation Template does **not** ship a VRT
> pipeline by default. This document describes the recommended recipe for teams
> that decide the trade-off is worth it for their project.

## Why VRT is optional by default

The spec originally proposed a containerized, exhaustive VRT suite
(FND-UI-08 through FND-UI-12) as a default quality gate. On a typical
20-page multilingual template site, that trade-off is poor:

- **Flake cost dominates signal.** A full `allCombinations()` enumeration over
  variant × size × tone × locale produces hundreds of snapshots. Sub-pixel
  rendering differences, font-hinting variance, and timing-driven layout shifts
  produce false failures far more often than they catch real regressions.
- **Humans catch visual drift faster.** A reviewer clicking through the site
  in two browsers notices an unintended visual change in minutes; chasing a
  flaky snapshot diff costs hours per release.
- **Template goal is "simple, high value."** The default gates (unit, e2e,
  a11y, Lighthouse, content-lifecycle) already cover the defect classes that
  scale with a template. VRT adds cost without proportionate value at this
  scale.

Instead, the template enforces a **manual visual-review checklist** item
(FND-THEME-10, reclassified `auto:test` → `review`) — see
`docs/a11y-manual-checklist.md` §10 and `docs/spec-amendments.md`.

## When to opt in

Consider enabling VRT when **all** of these hold:

- The site grows beyond ~50 distinct page templates × locale combinations.
- Visual consistency is a contractual or brand requirement with sign-off.
- The team can pin a single rendering environment (see below) to remove the
  flake sources.

## Recommended recipe (if you opt in)

### 1. Pin the rendering environment

Use a **single** containerized Chromium to eliminate cross-engine and
font-hinting variance. Do not run VRT across Firefox/WebKit — those engines
are covered by the functional e2e suite (FND-COMPAT-03), not VRT.

```dockerfile
# Dockerfile.vrt
FROM mcr.microsoft.com/playwright:v1.55.0-jammy
ENV VRT=1
```

Pin the Playwright/Chromium version in `package.json` and in the image tag.
A version bump of Playwright invalidates **all** snapshots by design.

### 2. Gate the gallery route behind `VRT=1`

Expose the exhaustive-variant gallery (every primitive rendered in every
`allCombinations()` variant) at a route like `/__vrt/` that is **only**
mounted when `import.meta.env.VRT === "1"`. This keeps it out of production
builds and sitemaps.

```ts
// astro.config.mjs — illustrative
if (process.env.VRT === "1") {
  // inject the __vrt gallery integration
}
```

The gallery enumerates primitives via `allCombinations()` (see the `variants()`
helper). Keep the enumeration to **≤3 axes** (variant / size / tone) — do not
add a fourth axis, or the snapshot count explodes combinatorially.

### 3. Snapshot discipline

- **Snapshot only the gallery route**, not arbitrary live pages. The gallery is
  deterministic by construction; live pages depend on content that changes.
- **Update snapshots deliberately.** A `--update-snapshots` run must be
  reviewed in the PR diff, never run blindly in CI.
- **Set a pixel-diff threshold** (e.g. `0.1%`) below which diffs are ignored.
  Tune upward only if flake persists.
- **No animations in snapshots.** Disable motion (`prefers-reduced-motion:
  reduce` + `motion: none`) so frames are deterministic.

### 4. Wire it as a separate gate, not part of `quality:release`

If enabled, run VRT in its own job (`test:visual`) that is **optional** —
failing it should not block a release unless your team explicitly opts in to
that policy. Do **not** add `test:visual` to `quality:release` in
`package.json`; keep it as a standalone `pnpm test:visual` invocation.

## What VRT does not replace

Even with VRT enabled, it does **not** cover:

- **Functional correctness** — covered by e2e (Playwright, 3 engines).
- **Accessibility** — covered by axe-core + the manual a11y checklist.
- **Performance** — covered by Lighthouse CI.
- **Content lifecycle correctness** — covered by the source-digest staleness
  check (FND-LIFE-07).

VRT is purely a visual-diff safety net on top of those.

## Spec references

- `FND-THEME-10` — reclassified `auto:test` → `review` (see
  `docs/spec-amendments.md`).
- `FND-UI-08`, `FND-UI-09`, `FND-UI-10`, `FND-UI-11`, `FND-UI-12` —
  reclassified to `guidance` for the default template (opt-in via this
  document).
