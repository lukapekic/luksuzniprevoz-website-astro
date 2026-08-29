# Astro Foundation Template

A production-ready, opinionated Astro 5 template implementing a comprehensive web Foundation specification. Built for multilingual (i18n), accessible (a11y), and performant static sites.

## Prerequisites

| Requirement | Version                       |
| ----------- | ----------------------------- |
| Node.js     | ≥ 20 LTS (22 LTS recommended) |
| pnpm        | ≥ 10                          |

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
# Start dev server (production site)
pnpm dev

# Refresh generated contracts before committing
pnpm quality:prepare

# Run the complete static page gate used by GitHub
pnpm quality:page
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
│   │   └── tests/unit/           # Unit tests
│   │
│   ├── eslint-plugin-astro-foundation/  # Custom ESLint rules
│   │   └── src/rules/             # Enforced lint rules
│   │
│   └── create-astro-foundation/  # Scaffold CLI (degit template)
│
├── site/
│   └── luksuzni-prevoz/          # Production site
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
├── foundation.config.ts          # Root config (re-exports production site)
└── package.json                   # Monorepo root
```

## Scripts Quick Reference

| Script                    | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                | Start dev server                                                    |
| `pnpm build`              | Production build                                                    |
| `pnpm lint`               | ESLint (0 errors target)                                            |
| `pnpm format`             | Prettier formatting                                                 |
| `pnpm format:check`       | Check formatting without writing                                    |
| `pnpm foundation:doctor`  | Validate config, dependencies, versions                             |
| `pnpm types:generate`     | Generate TypeScript types from config                               |
| `pnpm theme:sync`         | Generate CSS from theme tokens                                      |
| `pnpm theme:validate`     | Validate theme token files                                          |
| `pnpm routes:validate`    | Validate route definitions (slugs, uniqueness, ceiling)             |
| `pnpm content:validate`   | Validate content files (frontmatter, route binding, parity)         |
| `pnpm seo:validate`       | Validate SEO data (titles, descriptions, hreflang, structured data) |
| `pnpm og:generate`        | Generate OG images                                                  |
| `pnpm generate:redirects` | Generate redirect rules from previousSlugs                          |
| `pnpm generated:sync`     | Refresh types, theme, component, traceability, and design contracts |
| `pnpm generated:check`    | Check generated contracts without writing                           |
| `pnpm quality:prepare`    | Local alias for generated:sync                                      |
| `pnpm test:unit`          | Run foundation, ESLint-plugin, and site unit tests                  |
| `pnpm quality:fast`       | Generated, design, content, SEO, type, lint, and unit checks        |
| `pnpm quality:page`       | quality:fast plus the production site build                         |
| `pnpm quality:release`    | quality:page plus dist secret scan and dependency audit             |

## Quality Gates

The template enforces quality through layered gates:

- **`quality:prepare`** — Refreshes machine-owned contracts locally before committing.
- **`quality:fast`** — Read-only static governance, validation, typing, lint, and unit checks.
- **`quality:page`** — The GitHub pull-request gate; adds the production build.
- **`quality:release`** — Adds production-output secret scanning and dependency reporting.

Browser-based responsive, keyboard, and visual review remains a deliberate manual step. The
configured Playwright and Lighthouse commands remain available for focused use but are not part of
the automatic GitHub gate.

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

1. `generated:check` — types, theme CSS, component registry, design snapshot, and traceability are current
2. Static governance — foundation/theme/design doctor and strict design detection
3. Content contracts — routes, localized content, SEO, and waiver validation
4. Code quality — lint, Astro/TypeScript checks, and unit tests
5. `build` — production static-site build
6. `secret-scan` (FND-ENV-06) — no secret patterns in `dist/`
7. `audit:deps` (FND-ENV-07) — `pnpm audit --prod` surfaces advisories

The gate runs in `.github/workflows/release.yml` on every push to `master`.

## Documentation

| Document                        | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `docs/init-checklist.md`        | Bootstrap checklist for new projects (FND-META-07)                       |
| `docs/a11y-manual-checklist.md` | Manual accessibility testing guide (FND-A11Y-09)                         |
| `docs/deployment.md`            | Deployment configuration guide (FND-ENV-01)                              |
| `docs/exceptions.md`            | Waiver tracking (FND-META-10)                                            |
| `docs/content-authoring.md`     | Content authoring and translation guide                                  |
| `docs/scale-envelope.md`        | Architecture boundaries & in-memory/whole-build rationale (FND-SCALE-02) |
| `docs/optional-vrt.md`          | Optional Visual Regression Testing recipe (FND-UI-08..12)                |
| `docs/rule-traceability.md`     | Generated rule → enforcer matrix (FND-META-09, auto-generated)           |
| `docs/spec-amendments.md`       | Spec reclassifications & decision log (FND-THEME-10, FND-UI-08..12)      |
| `AGENTS.md`                     | AI agent development guidelines                                          |

## License

Private — not for redistribution without permission.
