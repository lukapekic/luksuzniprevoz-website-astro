---
name: astro-architecture
description: Use whenever changing project architecture, components, data flow, dependencies, TypeScript types/config, folder structure, or refactoring anything across the Astro Foundation monorepo. Covers the static-first Astro model, folder ownership, primitives, generated artifacts, and the enforced ESLint contract.
workstream: architecture
applies-to: "packages/, examples/, scripts/, foundation.config.ts, astro.config.mjs, tsconfig.json"
source-of-truth: AGENTS.md
---

# Astro Architecture

## Goal & end result
A change that fits the foundation's static-first, config-driven, type-safe model — using existing primitives and helpers, no new duplication, no weakened guardrails — and passes `pnpm quality:page` (or `quality:release` for foundation/core changes). End result: working feature, build clean, all gates green, architecture no more complex than before.

## When to use
- Adding or changing components, layouts, primitives, or pages.
- Touching TypeScript types, `foundation.config.ts`, `astro.config.mjs`, or `tsconfig.json`.
- Adding, upgrading, or removing dependencies.
- Any refactor, dependency-graph change, or folder restructure.
- Wiring data flow, content collections, or foundation helpers.

## When NOT to use
- Pure content edits in `src/content/pages/*.md` (use the routing/content skills only).
- Pure SEO metadata or structured-data work (use `technical-seo` / `structured-data`).
- A single a11y or responsive fix that changes no architecture (use those skills; reach for this one if it touches primitives or hydration).

## Fixed context (non-negotiable truths of this repo)
- **Monorepo, pnpm 10 workspace.** Run every script with `pnpm`, never `npm`/`yarn`. `packageManager: pnpm@10.14.0`.
  - `packages/astro-foundation/` → `@astro-foundation/core` (i18n, seo, theme, core).
  - `packages/eslint-plugin-astro-foundation/` → 9 enforced lint rules.
  - `packages/create-astro-foundation/` → scaffolding CLI.
  - `examples/reference-site/` → reference implementation (consumer of core).
  - `scripts/` → validators/generators (doctor, types, theme, routes, content, seo, og, redirects, traceability, waivers, secret-scan).
- **Static output.** `output: "static"` in `astro.config.mjs`. No SSR, no server endpoints, no per-request state. `build.format: "directory"`. This is load-bearing: the whole-build validation and generated-artifact drift checks depend on it.
- **Folder ownership.** Each folder owns one concern: `foundation/` (primitives), `components/` (composition), `content/` (Markdown + UI strings), `data/` (route map, navigation, business), `theme/` (tokens + generated CSS), `pages/` (routes). Don't mix concerns across owners.
- **Generated files are machine-owned — DO NOT EDIT.**
  - `src/theme/generated/theme.css` (from `pnpm theme:sync`, wrapped in `@layer theme` — FND-CSS-04).
  - Generated `types.ts` (from `pnpm types:generate`, incl. `RouteKey` and `UiStringKey` unions — FND-TYPE-02).
  - Drift is enforced: `quality:page` runs `git diff --exit-code` over generated artifacts; uncommitted drift fails the gate.
- **Primitives** (from `@astro-foundation/core/ui`):
  - `Page` — OWNS `<head>`. No other component emits head tags. Sets `lang`/`dir`. Emits `structuredData` JSON-LD scripts.
  - `Container` — layout with max-width variants. `main` gets `id="main-content"`.
  - `Section` — wraps `<section>` with `aria-labelledby`.
  - `NavList`, `Link` (resolves via `getPath()`, external links get `noopener noreferrer`), `LanguageSwitcher`, `Breadcrumbs` (`<nav aria-label="Breadcrumb">` + JSON-LD), `SkipLink` (focus-only → `#main-content`, 44×44), `Header`, `Footer`.
- **TypeScript: strictest practical.** No implicit `any`; explicit `any` needs justification. Typed props/helpers/validators. Never suppress type/lint failures (no `// @ts-ignore`, no `eslint-disable` to silence a real violation).
- **Config variants** (FND-META-08): `minimum` (sr,en / home,airport,about) and `full`/representative (sr,en,ru / 8 routes). Switch with `pnpm swap-config minimum|full`. Both must pass CI.
- **Scale envelope** (FND-SCALE-02): ≤30 routes/locale (FND-SCALE-01, enforced), 2–6 locales, ≤~20–50 pages/locale, single static site. Pagination, SSR/endpoints, CMS, auth, and site search are **out of scope by design**.

### Enforced ESLint contract (`eslint . --max-warnings=0`)
These hard-fail the gate. Every architecture change must keep them green:
| Rule | ID | What it enforces |
|------|----|------------------|
| `no-client-directive-without-justification` | FND-ARCH-01 | `client:*` requires a `// island: <reason>` comment |
| `no-hardcoded-ui-string` | FND-ARCH-03 / FND-I18N-08 / FND-UI-07 | user-visible strings come from the UI dictionary via `t()` |
| `no-manual-internal-url` | FND-I18N-03 | internal URLs via `getPath()` or `<Link>`, never string-built |
| `no-appearance-class-passthrough` | FND-UI-06 | class passthrough on primitives is layout-only (margin, grid/flex, width, order) |
| `no-dynamic-variant-class` | FND-UI-05 | no dynamic classes in variant definitions |
| `no-physical-direction-property` | FND-I18N-13 | logical CSS properties only (no `left`/`right`/`padding-left`) |
| `no-raw-design-value` | FND-THEME-09 | use theme tokens, not raw colors/spacing |
| `no-raw-img-element` | FND-IMG-01 / FND-IMG-08 | use the `<Image>` primitive, never raw `<img>`/`<picture>` |
| `no-legacy-collection` | FND-DATA-06 | no legacy collection definitions |

## Procedure
1. **Read the area first.** Confirm the target folder, primitive, or helper actually exists in this repo (don't assume a generic Astro API). Cross-check against `AGENTS.md`.
2. **Reuse before creating.** Look for a foundation helper or primitive that already centralizes the needed behavior (routing, SEO, schema, i18n, image, theme). Only add new code when reuse would not centralize correctness or remove meaningful duplication.
3. **Keep it static.** Reach for an island (`client:*`) only for genuine client-side interaction, and add the `// island: <reason>` comment. Prefer server-rendered-at-build-time, zero-JS output.
4. **Keep folders owned.** Put primitives in `foundation/`, composition in `components/`, data in `data/`. Don't leak one concern into another's owner.
5. **Never touch generated files by hand.** If `theme.css` or `types.ts` needs to change, change the source (theme tokens / `types-generate`) and re-run the generator. Commit the regenerated artifact in the same change.
6. **Type everything.** New helpers/props/validators must be typed; leverage generated unions (`RouteKey`, `UiStringKey`) so typos are compile errors.
7. **Run the matching gate** (see Verify) before declaring done. If it fails, fix the root cause — never weaken or disable a rule.
8. **Stay in scope.** Don't refactor unrelated stable code during a scoped task. If you spot something, note it; don't bundle it.

## Verify
- During dev / page-level change: `pnpm quality:page`
- Foundation/core or release-affecting change: `pnpm quality:release`
- Fast feedback loop: `pnpm quality:fast` (doctor, types, theme:sync, theme:validate, routes, content, seo, lint, unit)
- Type check only: `pnpm check` · Lint only: `pnpm lint`

## Definition of done
- Requested functionality works in the running site (`pnpm dev` or `pnpm build`).
- `pnpm quality:page` (or `quality:release` where applicable) is green end-to-end.
- No generated-artifact drift left uncommitted.
- No new dependency unless justified; no unused dependency left behind.
- No guardrail weakened, suppressed, or bypassed.
- Architecture is no more complex than before the change.

## Never do (banned patterns)
- Use `npm` or `yarn` instead of `pnpm`.
- Add SSR, server endpoints, pagination, CMS, auth, or site search without escalating (outside the scale envelope).
- Use `client:*` without a `// island:` justification comment.
- Edit `theme/generated/theme.css` or generated `types.ts` by hand.
- Hardcode user-visible strings in components (use `t()` + UI dictionary).
- Build internal URLs by string concatenation (use `getPath()` / `<Link>`).
- Use physical CSS direction properties (`left`, `right`, `padding-left`, `margin-right`, …).
- Pass appearance classes (color, typography, border, shadow) through primitives; passthrough is layout-only.
- Use raw `<img>`/`<picture>` or raw design values (colors/spacing outside tokens).
- Suppress type or lint errors to make a gate pass (`@ts-ignore`, `eslint-disable` on a real violation).
- Add a dependency for something the platform/foundation already does.
- Refactor unrelated stable code during a scoped task.
- Inline business copy inside a reusable technical primitive.

## Escalation triggers (stop and ask / log a waiver before proceeding)
- The work requires **SSR, a server endpoint, pagination, a CMS, auth, or search** → outside the scale envelope; do not improvise, escalate.
- Route count would exceed **30 per locale**, or locales would exceed **6** → architecture may no longer fit; escalate.
- A gate fails and the only clear fix would **weaken or disable an enforced rule** → escalate; consider a documented waiver (see `docs/exceptions.md`) instead.
- You need to **change a `@astro-foundation/core` public API** → escalate (consumers depend on it).
- You need to **add a runtime dependency** → justify it against the performance budget (`maxJsKb`, `maxIslandsPerRoute`) and the third-party/consent model first.
- A requirement conflicts with `AGENTS.md` or a non-waivable rule (e.g. FND-A11Y-01) → do not proceed silently; log a waiver or escalate.
