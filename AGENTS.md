# AGENTS.md

> **Source of truth:** `docs/AGENTS.md` is the authoritative rulebook (rule IDs,
> primitives, config variants, quality gates, Lighthouse thresholds, CSP). The
> skills below are the per-area quick-reference; when a skill and `docs/AGENTS.md`
> disagree, `docs/AGENTS.md` wins. Traceability is enforced: `docs/rule-traceability.md`
> maps every `FND-*` rule to its enforcer; `pnpm traceability --check` fails on drift.

## Always-on contract
- **Run everything with `pnpm`** (never `npm`/`yarn`). `packageManager: pnpm@10.14.0`.
- Static-first Astro unless runtime rendering is explicitly required (`output: "static"`).
- Never weaken or bypass TypeScript, lint, accessibility, SEO, route, theme, or quality rules.
- Never edit generated files manually (`theme/generated/theme.css`, generated `types.ts`).
- Never manually concatenate localized internal URLs — use `getPath()` / `<Link>`.
- All user-visible strings come from the UI dictionary via `t()` (FND-ARCH-03).
- Reuse foundation helpers before creating duplicate routing, SEO, schema, i18n, image, or validation logic.
- Prefer native semantic HTML before ARIA or abstraction.
- Avoid unnecessary client-side JavaScript and dependencies (`client:*` requires a `// island:` comment).
- Do not refactor unrelated stable code during scoped tasks.
- Every configured locale is required for every page (no optional locale pages, no silent fallback).
- Run the relevant quality gate before declaring completion.

## Quality gates
- `pnpm quality:fast` — during dev (doctor, types, theme:sync, theme:validate, routes, content, seo, lint, unit).
- `pnpm quality:page` — before declaring any page task complete (`quality:fast` + build + generated-artifact drift).
- `pnpm quality:release` — before a deploy or foundation/core change (`quality:page` + traceability, waivers, secret-scan, audit:deps, e2e, a11y, Lighthouse).

## Read the matching skill before changing that area
- `.skills/astro-architecture.md` — architecture, components, types, dependencies, refactors.
- `.skills/multilingual-routing.md` — locales, route map, hreflang, breadcrumbs, content/UI-string parity.
- `.skills/technical-seo.md` — indexability, metadata, canonical, hreflang, sitemaps, robots, Core Web Vitals.
- `.skills/structured-data.md` — JSON-LD generation and review.
- `.skills/responsive-images-performance.md` — images, fonts, LCP/INP/CLS, client-JS budget.
- `.skills/responsive-ui.md` — responsive layout, breakpoints, overflow, logical properties, target size.
- `.skills/accessibility-wcag.md` — WCAG 2.2 AA, semantics, keyboard, focus, contrast, forms, motion, language/DIR.
- `.skills/technical-page-review.md` — the final technical gate before a page is complete.

## Scale envelope (don't bend silently)
- ≤ 30 routes per locale, 2–6 locales, ≤ ~20–50 pages/locale, single static site.
- Pagination, SSR/endpoints, CMS, auth, and site search are out of scope by design
  (`docs/scale-envelope.md`). If a project needs several of these, escalate — don't
  quietly exceed the limits the validators enforce.

## Exceptions
- Any deviation from an `FND-*` rule requires a documented waiver in
  `docs/exceptions.md` (FND-META-10). Non-waivable rules (e.g. FND-A11Y-01) cannot be waived.
