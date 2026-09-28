# Luksuzni prevoz website

The live multilingual website for **Luksuzni prevoz**, built with Astro 7 in a pnpm workspace. The site is static; Cloudflare Pages Functions handle form submissions and the retired component-preview URL.

## Production status

Verified on **2026-09-28**:

| Environment | Branch    | URL                                                                                                       | Indexing                                                        |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Production  | `master`  | [luksuzniprevoz.rs](https://luksuzniprevoz.rs/)                                                           | Crawlable; sitemap contains 42 published URLs                   |
| Preview     | `staging` | [staging.luksuzniprevoz-website-astro.pages.dev](https://staging.luksuzniprevoz-website-astro.pages.dev/) | `noindex` headers, disallowing `robots.txt`, and empty sitemaps |

Cloudflare Pages deploys from GitHub. The `www` host redirects to the production apex. Serbian Latin is the default locale; English and Russian use `/en/` and `/ru/`. Contact and booking forms are owner-confirmed as working. The removed `/dev/ui/` page returns `410 Gone` with `no-store` and `noindex` in both environments.

Legal and privacy pages are planned separately and have not yet been published. Do not treat that pending content as complete.

## Local development

Use Node **22.22.2** (`.nvmrc`) and pnpm **10.14.0** (`packageManager` in `package.json`). Use pnpm for this repository.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Local builds default to Preview indexing. To check the same production mode used by the `master` Cloudflare deployment:

```bash
CF_PAGES_BRANCH=master SITE_ENVIRONMENT=production pnpm quality:release
```

`pnpm quality:release` runs generated-contract checks, governance and design checks, route/content/SEO validation, lint, type checks, unit tests, the site build, a production-output secret scan, and a dependency audit. Run `pnpm quality:prepare` only when generated contracts need to be refreshed; generated files must not be edited by hand. See [AGENTS.md](AGENTS.md) for technical rules and [DESIGN.md](DESIGN.md) for visual authority.

## Cloudflare Pages configuration

| Setting                            | Value                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Pages project                      | `luksuzniprevoz-website-astro`                                           |
| Production branch                  | `master`                                                                 |
| Preview branch used for acceptance | `staging`                                                                |
| Project root                       | Repository root                                                          |
| Build command                      | `pnpm types:generate:check && pnpm --filter @luksuzni-prevoz/site build` |
| Build output                       | `site/luksuzni-prevoz/dist`                                              |
| Node / pnpm build versions         | `22.22.2` / `10.14.0`                                                    |

Cloudflare supplies `CF_PAGES_BRANCH` during builds. The build rejects `SITE_ENVIRONMENT=preview` on `master` and `SITE_ENVIRONMENT=production` on another Cloudflare branch. An unset local value defaults to Preview. `PROD_ROBOTS` is obsolete.

Configure the following bindings **separately** in Cloudflare Pages Preview and Production. The names and the two environment-mode values were verified through the Cloudflare API on 2026-09-28; secret values are intentionally omitted.

| Binding                     | Type                        | Preview                   | Production                   |
| --------------------------- | --------------------------- | ------------------------- | ---------------------------- |
| `SITE_ENVIRONMENT`          | Plain-text build variable   | `preview`                 | `production`                 |
| `FORM_ENVIRONMENT`          | Plain-text runtime variable | `preview`                 | `production`                 |
| `NODE_VERSION`              | Plain-text build variable   | `22.22.2`                 | `22.22.2`                    |
| `PNPM_VERSION`              | Plain-text build variable   | `10.14.0`                 | `10.14.0`                    |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plain-text build variable   | Preview widget key        | Production widget key        |
| `TURNSTILE_SECRET_KEY`      | Encrypted secret            | Matching Preview secret   | Matching Production secret   |
| `TURNSTILE_ALLOWED_HOSTS`   | Plain-text runtime variable | Exact Preview hostnames   | Exact Production hostnames   |
| `FORM_IDEMPOTENCY_SECRET`   | Encrypted secret            | Unique Preview value      | Unique Production value      |
| `BREVO_API_KEY`             | Encrypted secret            | Preview transactional key | Production transactional key |
| `BREVO_SENDER_EMAIL`        | Plain-text runtime variable | Verified sender           | Verified sender              |
| `BREVO_SENDER_NAME`         | Plain-text runtime variable | Approved sender name      | Approved sender name         |
| `BREVO_TO_EMAIL`            | Encrypted secret            | Internal recipients       | Internal recipients          |
| `FORM_DB`                   | D1 database binding         | Preview database          | Production database          |

Use distinct Turnstile and idempotency secrets and separate D1 databases for the two environments. `TURNSTILE_ALLOWED_HOSTS` takes exact hostnames without schemes. The same-origin Pages Functions are `/api/forms/contact` and `/api/forms/booking`; their secrets and D1 data must remain outside the repository and built assets. A local `.env` may contain operator credentials such as `CLOUDFLARE_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; those are for administration, not Pages deployment bindings. Never commit their values.

See [deployment requirements](docs/deployment.md) and the [forms runbook](docs/cloudflare-pages-forms/README.md) for setup, migrations, security, and rollback details.

## Release and verification

1. Push the reviewed change to `staging` and verify its Cloudflare Preview deployment.
2. Open a pull request from `staging` to `master`. The required GitHub checks are `quality-fast` (which runs `pnpm quality:release`) and `a11y-chromium`.
3. Merge after the required checks pass. Cloudflare deploys `master` to Production; the separate Release workflow runs the release gate and cross-browser accessibility checks.
4. Wait for the Cloudflare production deployment to succeed. Check the live homepage and localized routes, `robots.txt`, sitemaps, redirects, security headers, and form behavior. Purge Cloudflare cache when a deployment serves stale content.

The old component-preview asset remained cached at the exact custom-domain URL after removal and a full zone purge. A narrowly routed Pages Function now returns `410 Gone` for that URL. Keep its `_routes.json` entry while old Pages assets can still be served from cache.

## Repository map

| Path                         | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `site/luksuzni-prevoz/`      | Product site, localized content, route map, theme, and static build |
| `functions/`                 | Cloudflare Pages form handlers and retired-URL response             |
| `packages/astro-foundation/` | Reusable foundation library                                         |
| `packages/form-kit/`         | Form validation and delivery helpers                                |
| `scripts/`                   | Generators, validators, and governance checks                       |
| `.skills/`                   | Task procedures governed by `AGENTS.md`                             |
| `docs/`                      | Deployment, content, design, and operational records                |

This is a private repository.
