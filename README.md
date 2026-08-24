# Astro Foundation Template

A production-ready, opinionated Astro 5 template implementing a comprehensive web Foundation specification. Built for multilingual (i18n), accessible (a11y), and performant static sites.

## Prerequisites

| Requirement | Version |
-------------|---------|
| Node.js | ≥ 20 LTS (22 LTS recommended) |
| pnpm | ≥ 10 |

Install the correct Node.js version:

```bash
nvm install 22   # 20 LTS is also supported
nvm use 22
```

## Quick Start

### Option A: `create-astro-foundation` (recommended)

```bash
npx create-astro-foundation@latest my-site
cd my-site
pnpm install
```

### Option B: `degit`

```bash
degit astro-foundation/astro-foundation my-site
cd my-site
pnpm install
```

## Configuration

1. **Edit `foundation.config.ts`** — set your site URL, brand, and locales
2. **Replace theme tokens** in `src/theme/versions/version-1/`
3. **Replace brand data** in `src/data/business.ts`
4. **Write content** in `src/content/pages/`

See `docs/init-checklist.md` for the complete bootstrap checklist.

## Development

```bash
# Start dev server (from the reference site)
cd examples/reference-site && pnpm dev

# Validate everything
pnpm quality:fast

# Generate theme CSS from tokens
pnpm theme:sync

# Generate TypeScript types from config
pnpm types:generate
```

## Monorepo Structure

```
astro-foundation/
├── packages/
│   ├── astro-foundation/         # Core library (@astro-foundation/core)
│   │   ├── src/
│   │   │   ├── core/             # Config schema, errors, types
│   │   │   ├── i18n/             # Routing, helpers, path resolution
│   │   │   ├── theme/            # Token schema, loader, CSS generator
│   │   │   ├── seo/              # SEO validation, redirects, OG, JSON-LD
│   │   │   ├── content/          # Content schemas, frontmatter parsing
│   │   │   ├── ui/               # Variant utility, SEO data helpers
│   │   │   └── validators/       # Route, content, SEO validators
│   │   └── tests/unit/           # 244 unit tests
│   │
│   ├── eslint-plugin-astro-foundation/  # Custom ESLint rules
│   │   └── src/rules/             # 9 rules, 78 tests
│   │
│   └── create-astro-foundation/  # Scaffold CLI (degit template)
│
├── examples/
│   └── reference-site/           # Working reference implementation
│       ├── foundation.config.ts  # Site configuration
│       ├── src/
│       │   ├── content/
│       │   │   ├── pages/          # Markdown content files
│       │   │   └── ui/             # UI strings JSON per locale
│       │   ├── data/              # Routes, business data
│       │   ├── theme/             # Theme tokens & generated CSS
│       │   └── generated/         # Auto-generated types
│       └── astro.config.mjs
│
├── scripts/                      # CLI scripts (doctor, validators, generators)
├── tests/fixtures/               # Shared test fixtures
├── docs/                          # Documentation
├── foundation.config.ts          # Root config (re-exports reference site)
└── package.json                   # Monorepo root
```

## Scripts Quick Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (0 errors target) |
| `pnpm format` | Prettier formatting |
| `pnpm format:check` | Check formatting without writing |
| `pnpm foundation:doctor` | Validate config, dependencies, versions |
| `pnpm types:generate` | Generate TypeScript types from config |
| `pnpm theme:sync` | Generate CSS from theme tokens |
| `pnpm theme:validate` | Validate theme token files |
| `pnpm routes:validate` | Validate route definitions (slugs, uniqueness, ceiling) |
| `pnpm content:validate` | Validate content files (frontmatter, route binding, parity) |
| `pnpm seo:validate` | Validate SEO data (titles, descriptions, hreflang, structured data) |
| `pnpm og:generate` | Generate OG images |
| `pnpm generate:redirects` | Generate redirect rules from previousSlugs |
| `pnpm test:unit` | Run all unit tests (322 tests) |
| `pnpm quality:fast` | Doctor + types + theme + routes + content + SEO + lint + tests |
| `pnpm quality:page` | quality:fast + build + artifact drift check |
| `pnpm quality:release` | quality:page + e2e + a11y + lighthouse |

## Quality Gates

The template enforces quality through layered gates:

- **`quality:fast`** — Runs on every push. ~15 seconds.
- **`quality:page`** — Adds build and artifact drift check.
- **`quality:release`** — Full validation including e2e, a11y, and Lighthouse.

All gates must pass (exit code 0) before deployment.

## Out of Scope

This template is a **starting point for marketing/company sites**, not a
kitchen-sink framework. The following are deliberately **not** included — add
them per project if needed (see `docs/scale-envelope.md` for the architecture
boundaries that keep this list intentional):

- **Blogs / content-heavy publishing** (pagination, taxonomies, RSS) — the
  content model is for a small set of localized pages, not high-volume posts.
- **Authentication & user accounts** — no auth, sessions, or user data.
- **E-commerce** — no cart, checkout, or payment integration.
- **SSR / server endpoints** — the template is `output: "static"`; dynamic
  features require moving a route to SSR yourself.
- **CMS integration** — content is authored as Markdown in the repo.
- **Site search** — out of scope for a ~20-page site.
- **Visual Regression Testing (VRT)** — optional; see
  `docs/optional-vrt.md`. The default gates use manual visual review
  (`docs/a11y-manual-checklist.md` §10).
- **Consent banner component** — `capabilities.consentBanner` is a config flag
  that implies a reviewed third-party decision; no banner ships by default
  (see `docs/deployment.md`).

If a project needs several of these, reconsider whether this template is the
right starting point — the scale envelope assumes ≤30 routes per locale.

## Releasing & Versioning

The publishable workspace packages (`@astro-foundation/core`,
`eslint-plugin-astro-foundation`, `create-astro-foundation`) are versioned
with [Changesets](https://github.com/changesets/changesets) and published with
`access: "public"`.

```bash
pnpm changeset          # describe a change; creates a .changeset entry
pnpm changeset version  # consume entries → bump package versions + changelog
pnpm release            # changeset publish (publishes to npm @latest)
pnpm release:next      # changeset publish --tag next (pre-release dist-tag)
```

**`next` dist-tag flow:** for pre-release iteration, publish with
`pnpm release:next` so consumers opt in via `npm install
@astro-foundation/core@next` without affecting `@latest`. Merge to `main` and
run `pnpm release` only for a stable release. The `foundationVersion` field in
`foundation.config.ts` tracks which spec version a project conforms to — it
is independent of the package semver.

### Release gate

`pnpm quality:release` runs the full chain before a publish:

1. `quality:fast` — doctor, types, theme/routes/content/seo validation, lint, unit tests
2. `build` — production build + generated-artifact drift checks (theme CSS, types)
3. `traceability --check` (FND-META-09) — every cited `FND-*` rule has an enforcer; the matrix is drift-checked
4. `parse-waivers` (FND-META-10) — `docs/exceptions.md` waivers are valid, unexpired, and never waive `FND-A11Y-01`
5. `secret-scan` (FND-ENV-06) — no secret patterns in `dist/`
6. `audit:deps` (FND-ENV-07) — `pnpm audit --prod` surfaces advisories
7. `test:e2e` / `test:a11y` / `test:lighthouse` — real Playwright (3 engines), axe-core, Lighthouse CI

The gate runs in `.github/workflows/release.yml` on every push to `main`.

## Documentation

| Document | Description |
|----------|-------------|
| `docs/init-checklist.md` | Bootstrap checklist for new projects (FND-META-07) |
| `docs/a11y-manual-checklist.md` | Manual accessibility testing guide (FND-A11Y-09) |
| `docs/deployment.md` | Deployment configuration guide (FND-ENV-01) |
| `docs/exceptions.md` | Waiver tracking (FND-META-10) |
| `docs/content-authoring.md` | Content authoring and translation guide |
| `docs/scale-envelope.md` | Architecture boundaries & in-memory/whole-build rationale (FND-SCALE-02) |
| `docs/optional-vrt.md` | Optional Visual Regression Testing recipe (FND-UI-08..12) |
| `docs/rule-traceability.md` | Generated rule → enforcer matrix (FND-META-09, auto-generated) |
| `docs/spec-amendments.md` | Spec reclassifications & decision log (FND-THEME-10, FND-UI-08..12) |
| `AGENTS.md` | AI agent development guidelines |

## License

Private — not for redistribution without permission.
