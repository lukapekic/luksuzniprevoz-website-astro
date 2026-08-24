---
name: technical-page-review
description: Use as the final technical gate before declaring a page (or a set of page changes) complete. Aggregates all workstreams — architecture, routing/i18n, SEO, structured data, accessibility, responsive, images/performance — and produces a PASS/FAIL verdict.
workstream: page-review
applies-to: "any page-level change before completion; foundation/core or release-affecting changes"
source-of-truth: AGENTS.md
---

# Technical Page Review

## Goal & end result
A single, auditable PASS/FAIL verdict for a completed page change, backed by green gates and a per-dimension review. End result: every hard requirement satisfied, the correct quality gate green, and a written verdict with blocking issues, non-blocking improvements, commands/results, and the files requiring changes.

## When to use
- Before declaring **any page task** complete.
- Before a release or a foundation/core change (use the release gate).
- When a reviewer/second agent needs a structured sign-off.

## When NOT to use
- Mid-task exploration — run `pnpm quality:fast` for a quick loop instead; reserve the full review for completion.
- As a substitute for the workstream skills — this skill **aggregates** them; it does not replace reading them.

## Fixed context (non-negotiable truths of this repo)
- **The gates are the source of truth:**
  - `pnpm quality:fast` → doctor, types:generate, theme:sync, theme:validate, routes:validate, content:validate, seo:validate, lint, test:unit.
  - `pnpm quality:page` → `quality:fast` + `build` + generated-artifact drift (`git diff --exit-code` over `theme/generated/` + generated types).
  - `pnpm quality:release` → `quality:page` + traceability `--check` + parse-waivers + secret-scan + audit:deps + test:e2e + test:a11y + test:lighthouse.
- **Never PASS while a hard requirement fails** — even one blocking issue is FAIL.
- **No silent suppressions:** a green gate achieved by `@ts-ignore`/`eslint-disable`/weakened rules is not a pass.
- **Review dimensions** (each maps to a skill): architecture, routing/i18n, SEO, structured data, accessibility, responsive, images/performance.
- **All scripts run with `pnpm`.**

## Procedure
Run each review dimension (consult the matching skill for specifics), then run the gates and produce the verdict.

1. **Build / type / lint** — `pnpm check` + `pnpm lint`: zero warnings/errors. No suppressions of real violations.
2. **Routing / i18n** — full locale parity; URLs via `getPath`/`<Link>`; hreflang = full reciprocal set from `buildHreflangSet`; valid switch targets; `trailingSlash` honored; content + UI-string parity across locales.
3. **SEO** — unique title, useful description, self-canonical, reciprocal hreflang, correct `htmlLang`, sitemap inclusion matches `noindex`, crawlable `<a href>` internal links, one H1 + logical headings, OG metadata, mobile/desktop content parity.
4. **Structured data** — appropriate type for the real entity, visible-content-aligned, route-derived absolute URLs, no fabricated fields, no duplicates, emitted via `Page`.
5. **Accessibility** — semantics, keyboard, focus (visible + unobscured), labels/errors, alt, contrast, reduced motion, correct language/DIR, targets ≥ 44×44; relevant manual-checklist sections done.
6. **Responsive** — 320/390/768/1024/1440/1920; no overflow/clipping; no lost content on small screens; logical properties; layout-only passthrough.
7. **Images / performance** — correct LCP priority (hero eager + high priority + reserved space), normal images lazy, `<Image>` primitive only, dimensions/srcsets, minimal justified JS, fonts within budget.
8. **Architecture** — foundation helpers reused (no duplicate routing/SEO/schema/i18n/image/theme logic); no generated-file edits; no unnecessary dependencies; scope respected.

Then:
- **Page-level change:** `pnpm quality:fast` then `pnpm quality:page`.
- **Foundation/core or release-affecting change:** `pnpm quality:release`.

## Verify
- `pnpm quality:fast`
- `pnpm quality:page` (page-level completion)
- `pnpm quality:release` (release / foundation changes)
- Capture the actual command output/results in the verdict.

## Definition of done (the verdict)
Produce a written PASS/FAIL:
- **PASS / FAIL**
- **Blocking issues** (each tied to a dimension + rule ID + file:line) — any FAIL reason.
- **Non-blocking improvements** (suggestions, not blockers).
- **Commands run + results** (which gates, green/red).
- **Files requiring changes** (exact paths).
- The matching quality gate is green end-to-end, with no suppressions.

## Never do (banned patterns)
- Declare PASS while any hard requirement or gate fails.
- Declare PASS on a gate made green by suppressing/weakening rules.
- Run a subset of a gate and imply the full gate passed (run the actual `quality:page`/`quality:release`).
- Use `npm`/`yarn` for the gates.
- Skip a dimension because "it wasn't touched" — confirm it, don't assume.
- Leave generated-artifact drift uncommitted and call the page done.
- Omit the rule ID or file:line for a blocking issue ( unverifiable verdict).
- Sign off without recording the commands actually run and their results.

## Escalation triggers
- A gate fails and the cause is unclear or the only fix weakens a rule → escalate (consider a waiver per `docs/exceptions.md`); do not fabricate a PASS.
- A blocking issue maps to a non-waivable rule (e.g. FND-A11Y-01) → FAIL; escalate, do not waive.
- Generated-artifact drift can't be resolved by re-running the generator → escalate (may indicate a non-deterministic build, FND-META-09).
- The change touches `@astro-foundation/core` public API or exceeds the scale envelope → escalate before sign-off.
- A dimension can't be verified because the relevant test/manual step is missing → FAIL that dimension and escalate (don't infer PASS).
