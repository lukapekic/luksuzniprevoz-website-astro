# Astro Foundation — Agent Guide (FND-AGENT-01)

## Repository Structure

This is a pnpm workspace monorepo using pnpm 10.

- `packages/astro-foundation/` — Core library (`@astro-foundation/core`)
- `packages/eslint-plugin-astro-foundation/` — ESLint rules for Foundation projects
- `packages/create-astro-foundation/` — Scaffolding CLI (degit-based)
- `examples/reference-site/` — Reference implementation
- `scripts/` — CLI scripts (doctor, validators, generators)
- `tests/` — Shared test fixtures
- `docs/` — Documentation

## Key Commands

| Command                   | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `pnpm foundation:doctor`  | Validate config and environment (FND-DX-01)        |
| `pnpm types:generate`     | Generate types from config (FND-TYPE-02)           |
| `pnpm theme:validate`     | Validate theme tokens (FND-THEME-06)               |
| `pnpm theme:sync`         | Generate theme CSS (FND-THEME-07)                  |
| `pnpm routes:validate`    | Validate route map                                 |
| `pnpm content:validate`   | Validate content frontmatter                       |
| `pnpm seo:validate`       | Validate SEO metadata                              |
| `pnpm lint`               | ESLint                                             |
| `pnpm format`             | Prettier                                           |
| `pnpm format:check`       | Prettier check                                     |
| `pnpm test:unit`          | Run unit tests (core + eslint plugin)              |
| `pnpm test:e2e`           | Run E2E tests (Playwright)                         |
| `pnpm test:a11y`          | Run accessibility tests                            |
| `pnpm test:lighthouse`    | Run Lighthouse CI                                  |
| `pnpm quality:fast`       | Fast quality gate (runs during dev)                |
| `pnpm quality:page`       | Page quality gate (before declaring task complete) |
| `pnpm quality:release`    | Release quality gate (before production deploy)    |
| `pnpm swap-config`        | Switch between minimum/full configs for CI         |
| `pnpm og:generate`        | Generate OG images                                 |
| `pnpm generate:redirects` | Generate redirect files                            |

## Quality Gates (§16)

### `quality:fast` — Runs continuously during dev

1. `foundation:doctor` — validate config
2. `types:generate` — generate types
3. `theme:validate` — validate theme tokens
4. `routes:validate` — validate route map
5. `content:validate` — validate content frontmatter
6. `seo:validate` — validate SEO metadata
7. `lint` — ESLint
8. `test:unit` — unit tests

### `quality:page` — Before declaring any page task complete

1. All of `quality:fast`
2. `build` — build the site
3. Check for generated artifact drift (theme CSS, types)

### `quality:release` — Before production deploy

1. All of `quality:page`
2. `test:e2e` — Playwright E2E tests
3. `test:a11y` — accessibility tests
4. `test:lighthouse` — Lighthouse CI

## Agent Contract Rules (§20)

### 1. Code Style Rules

- **Rule IDs** follow `FND-{AREA}-{NN}` pattern
- **FND-ARCH-03**: All user-visible strings MUST come from UI strings dictionary
- **FND-I18N-03**: URLs MUST come from the route map (via `getPath()`), never from folder names
- **FND-I18N-04**: `trailingSlash` is always `"always"` — all paths end with `/`
- **FND-UI-06**: Class passthrough on primitives MUST be layout-only (margin, grid/flex, width, order)
- **FND-I18N-13**: CSS MUST use logical properties only (no `left`, `right`, `padding-left`, etc.)
- **FND-A11Y-05**: Interactive elements MUST meet minimum 44×44 target size
- **FND-CSS-04**: Theme CSS MUST use `@layer theme`
- **FND-RESP-03**: No horizontal overflow — `overflow-x: hidden` on `html, body`

### 2. File Conventions

- Theme CSS: `src/theme/generated/theme.css` — auto-generated, DO NOT EDIT
- Foundation CSS: `src/theme/foundation.css` — safeguards only, unlayered
- Content: `src/content/pages/{routeKey}/{locale}.md` — per-route folder, one file per locale; frontmatter with `routeKey`, `locale`, `status` (identity is the frontmatter, never the path)
- UI strings: `src/content/ui/{locale}.json` — flat key-value dictionary
- Routes: `src/data/routes.ts` — typed route map
- Navigation: `src/data/navigation.ts` — nav items with `routeKey` + `labelKey`

### 3. Primitives

- **Page** — OWNS `<head>`. No other component emits head tags. Sets `lang`/`dir`.
- **Container** — Layout with max-width variants. `main` gets `id="main-content"`.
- **Section** — Wraps `<section>` with `aria-labelledby` support.
- **NavList** — Navigation links using `Link`, marks current with `aria-current="page"`.
- **LanguageSwitcher** — Links to other locales with `hreflang`/`lang` attributes.
- **Breadcrumbs** — `<nav aria-label="Breadcrumb">` with JSON-LD.
- **Link** — Resolves paths via `getPath()`. External links get `noopener noreferrer`.
- **SkipLink** — Focus-only link to `#main-content`. 44×44 min size.
- **Header** — Brand + NavList + LanguageSwitcher. Responsive hamburger.
- **Footer** — Brand, copyright, NavList. Responsive.

### 4. Config Variants (FND-META-08)

- **Minimum config**: 2 locales (sr, en), 3 routes (home, airport, about)
- **Representative config**: 3 locales (sr, en, ru), 8 routes (home, airport, about, contact, services, pricing, faq, legal)
- Use `pnpm swap-config minimum` or `pnpm swap-config full` to switch

### 5. Testing

- Unit tests: `vitest` in `packages/astro-foundation/tests/unit/`
- E2E tests: `playwright` in `examples/reference-site/tests/smoke/`
- E2E runs on 3 engines: Chromium, Firefox, WebKit (FND-COMPAT-03)
- Responsive tests at: 320, 768, 1024, 1440, 1920px (FND-RESP-06)

### 6. Lighthouse CI (FND-PERF-03)

- Config: `.lighthouserc.json`
- Thresholds: accessibility ≥ 0.95, SEO ≥ 0.95, best-practices ≥ 0.90, performance ≥ 0.90
- Throttling: 150ms RTT, 1638.4 kbps throughput, 4× CPU slowdown

### 7. CSP (FND-ENV-05)

- Report-only CSP in `examples/reference-site/public/_headers`
- Additional security headers: X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS

### 8. What NOT to do

- Do NOT hardcode UI strings in components (FND-ARCH-03)
- Do NOT build URLs from folder names (FND-I18N-03)
- Do NOT use physical CSS direction properties (FND-I18N-13)
- Do NOT emit `<head>` tags outside of Page primitive
- Do NOT edit generated files (`theme.css`, `types.ts`)
- Do NOT use `client:*` directives without `// island: justification` comment
