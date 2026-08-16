# Scale Envelope (FND-SCALE-02)

This document records the architecture boundaries the Foundation Template is
designed for, and **why** the implementation choices (in-memory route maps,
whole-build validation, no pagination/SSR) are correct *within* those
boundaries. It exists so a team can decide, before bending a boundary, whether
this template is still the right tool.

## The envelope

The template is designed for:

- **≤ 30 routes per locale** (enforced by `routes:validate`, FND-SCALE-01).
- **2–6 locales** (enforced by the config schema, `.min(2).max(6)`).
- **≤ ~20–50 pages per locale** of Markdown content.
- **Static output** (`output: "static"`), built in full at build time.
- **A single deployable site** (no sub-sites / multi-tenant).

Within this envelope the template's quality bars (unit, e2e, a11y, Lighthouse,
content-lifecycle, lint) hold and the build stays fast.

## Why in-memory route maps & whole-build validation

Routing, hreflang, parity, and staleness are all computed from **in-memory**
copies of the route map, locale config, and content collection loaded at build
time. There is no database, no incremental index, no per-page lookup.

This is deliberate and correct *within the envelope*:

- **Whole-build is the only way to enforce reciprocity and parity.** hreflang
  reciprocity (FND-I18N-11) and locale parity (FND-LIFE-03) require comparing
  every locale's version of every route against every other. That is an
  O(routes × locales²) check that only makes sense over the full set — there is
  no useful "incremental" version of it. At 30 routes × 6 locales that is
  ~540 comparisons; trivial in memory.
- **Content-lifecycle staleness (FND-LIFE-07)** recomputes a source digest and
  compares it against every translation — again, a whole-build cross-product,
  not a per-file check.
- **Determinism.** A static build with the entire route/content set in memory
  produces identical output on every run; there is no cached index to drift.
  This is what makes the generated-types and generated-theme-CSS drift checks
  (`quality:page`) meaningful.

The cost is O(n) memory and build time, which is fine at ≤30 routes × ≤6
locales. Beyond that, the build stays correct but slow; that is the signal to
reconsider the architecture, not to add an index.

## What this rules out (and why)

| Feature | Why it's out of scope at this scale |
|---------|-------------------------------------|
| Pagination | Adds a second axis (route × page) to every cross-locale check; the envelope assumes a bounded page set. |
| SSR / server endpoints | Breaks the "whole-build in memory" model and the static-output drift checks. |
| CMS / live content | Content is repo Markdown so the build is deterministic and reviewable; a CMS reintroduces an external index. |
| Auth / user data | No per-request state; the template is stateless static. |
| Site search | A ~20-page site doesn't justify an index; add a client-side solution per project. |
| VRT (default) | Hundreds of snapshots for a 20-page site cost more in flake than they catch; see `docs/optional-vrt.md`. |

## When to step outside the envelope

If a project needs **several** of the items above, or exceeds **>30 routes per
locale** or **>6 locales**, treat it as a signal that this template's
architecture no longer fits. At that point the right move is to fork the
architecture deliberately (e.g. move to SSR, add a content index) — not to
quietly exceed the limits the validators enforce, which will degrade build
performance and the meaning of the drift checks.