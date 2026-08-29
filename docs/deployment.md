# Deployment Guide (FND-ENV-01)

This document records the deployment contract for the production Luxury Transportation site.

## Verified production facts

| Item                  | Current contract                                                  |
| --------------------- | ----------------------------------------------------------------- |
| Production site       | `https://luksuzniprevoz.rs`                                       |
| Application           | `site/luksuzni-prevoz`                                            |
| Site package          | `@luksuzni-prevoz/site`                                           |
| Framework             | Astro, static output                                              |
| Package manager       | pnpm                                                              |
| Node                  | version from `.nvmrc`                                             |
| CI                    | GitHub Actions under `.github/workflows/`                         |
| Active theme selector | `site/luksuzni-prevoz/foundation.config.ts -> activeThemeVersion` |

The final hosting product/account/plan is operational infrastructure and should be recorded here when it is fixed in repository/deployment configuration. Do not invent a provider-specific deployment contract merely because DNS or redirects are managed through that provider.

## Build and quality gates

Install dependencies from the repository root:

```bash
pnpm install --frozen-lockfile
```

Build the production site explicitly when needed:

```bash
pnpm --filter @luksuzni-prevoz/site build
```

Before committing, refresh the generated contracts and run the same static page gate used by
GitHub:

```bash
pnpm quality:prepare
pnpm quality:page
```

GitHub runs `quality:page` without writing files. A stale generated contract therefore fails rather
than being silently repaired in CI.

For design-sensitive changes, the governance layer must also be green:

```bash
pnpm design:sync:check
pnpm design:doctor
pnpm design:detect
```

or the repository's combined gate when available:

```bash
pnpm design:guard
```

Automated browser testing is optional for focused investigations. Responsive layout, image crops,
keyboard behavior, and rendered visual quality remain part of the required manual review described
by the applicable page contract.

Never deploy from an obsolete example/reference application. Production commands and CI must target `@luksuzni-prevoz/site`.

## Theme generation

The site chooses its active theme only through:

```text
site/luksuzni-prevoz/foundation.config.ts
→ activeThemeVersion
```

Before deploying a theme-system change:

```bash
pnpm theme:sync
pnpm theme:validate
pnpm design:sync
pnpm design:doctor
pnpm design:detect
```

A missing or invalid configured theme must fail. No package-level fallback to an older theme is permitted.

## Build output

The production Astro build output is:

```text
site/luksuzni-prevoz/dist/
```

Only generated production output should be deployed. Do not publish repository docs, source Markdown, local design-governance caches, test artifacts, or secrets.

## Redirects (FND-ENV-10)

Localized routes and previous slugs are data-driven. Generate redirects with the repository's redirect command rather than hand-maintaining duplicate localized redirect lists.

```bash
pnpm generate:redirects
```

Use the supported format/target required by the selected host. Verify generated redirects after any route/slug migration and before removing the old WordPress deployment.

Internal application navigation must continue to use route keys/helpers; redirects are an edge/deployment concern, not a substitute for correct internal routing.

## Security headers (FND-ENV-08)

At the hosting edge, maintain at minimum a reviewed policy for:

- `X-Content-Type-Options: nosniff`;
- clickjacking protection (`frame-ancestors` in CSP, with `X-Frame-Options` only where useful for compatibility);
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Content-Security-Policy`.

CSP must be based on the actual production asset/script requirements. Start a materially new CSP in report-only mode when needed, review violations, then enforce it. Do not copy a generic CSP that breaks Astro assets, analytics, maps, consent tooling, or form providers.

Do not add `'unsafe-inline'`, new third-party origins, or wildcard sources without a documented requirement.

## Third-party/consent handling (FND-ENV-09)

`foundation.config.ts` may declare third-party capabilities, but a capability flag does not itself implement legal consent UX.

For every production third party:

1. record the purpose and origin;
2. load it according to the configured strategy;
3. keep non-essential scripts blocked until consent where legally required;
4. reflect allowed origins in CSP deliberately;
5. provide a way to revisit consent if a consent system is used;
6. verify performance impact against the production budget.

Do not fabricate a consent vendor in this document. Record the selected implementation once confirmed.

## Forms (FND-A11Y-10, FND-ENV-06, FND-ENV-09)

The site has form capability, but the submission endpoint/provider is an explicit production decision.

Any deployed form must:

- submit personal data via POST/body, never query strings;
- keep endpoint secrets server-side/out of `dist/`;
- use accessible labels, errors, status feedback, and autocomplete tokens;
- use accessible spam mitigation;
- link the appropriate privacy/legal information where required;
- localize reusable field/status strings through the UI dictionary;
- gate third-party form/anti-spam scripts according to consent/CSP requirements.

Record the final endpoint, spam mitigation, and data-retention/provider decision when implemented.

## Cache policy

Recommended default for a static Astro deployment:

| Resource                            | Policy                                                      |
| ----------------------------------- | ----------------------------------------------------------- |
| Hashed CSS/JS/assets                | Long-lived immutable cache                                  |
| Fonts with content-hashed filenames | Long-lived immutable cache                                  |
| Optimized/hash-addressed images     | Long-lived cache appropriate to generated filename strategy |
| HTML                                | Short/no-cache policy according to host deploy semantics    |
| Redirect configuration              | Must refresh with each deploy                               |
| `robots.txt` / sitemap              | Short cache; must reflect current release                   |

Do not cache mutable HTML or redirect files for a year simply because static assets use immutable caching.

## DNS/TLS

Production requirements:

- [ ] `luksuzniprevoz.rs` resolves to the current production deployment.
- [ ] HTTPS is mandatory.
- [ ] Certificate renewal is automated by the selected host/edge where possible.
- [ ] HTTP redirects to HTTPS.
- [ ] `www`/apex canonicalization matches SEO configuration.
- [ ] HSTS is enabled only after HTTPS/canonical routing is stable and recovery implications are understood.

## CI/release expectations

GitHub Actions is the repository CI system. CI must target the production site and shared foundation packages that remain part of the codebase.

The release pipeline should cover, as applicable:

- install with frozen lockfile;
- generated types/theme synchronization and drift checks;
- route/content/SEO validation;
- lint/type checking;
- unit tests;
- rule traceability + waiver parsing;
- secret/dependency checks;
- production-site build;
- E2E/accessibility tests;
- Lighthouse/performance checks;
- design-governance gate for production UI/theme changes.

If CI configuration still names a removed `reference-site`, treat that as a blocking stale reference and update it before release.

## Rollback

1. Identify the last known-good production deployment/commit.
2. Roll the host back or redeploy that exact commit/artifact.
3. Verify critical localized routes, booking/contact paths, theme assets, redirects, and SEO endpoints.
4. Record the regression and root cause before re-releasing.
5. Re-run the applicable quality/governance gates on the corrective change.

Do not "fix forward" by manually editing generated production files at the host.

## Post-deploy verification

After a production deploy, verify at minimum:

- [ ] HTTPS/canonical host works.
- [ ] Serbian default routes work without an unintended locale prefix.
- [ ] `/en` and `/ru` route behavior and language switching work.
- [ ] Representative service/hub/page routes render correctly.
- [ ] 404 behavior works for relevant locale paths.
- [ ] Redirects from migrated/previous slugs work.
- [ ] `robots.txt` and sitemap endpoints are correct for production.
- [ ] No preview/noindex behavior leaked into production.
- [ ] Forms/booking/contact actions behave as designed.
- [ ] No mixed content, CSP, console, or blocked-asset errors.
- [ ] Theme output matches the configured active theme.
- [ ] Lighthouse/performance remains within the configured budget.

## Deployment decisions still requiring an explicit record

Keep these fields updated once infrastructure is finalized:

| Decision                      | Value                       |
| ----------------------------- | --------------------------- |
| Hosting provider / plan       | TBD until encoded/confirmed |
| Production deploy trigger     | TBD until finalized         |
| Preview/staging URL strategy  | TBD until finalized         |
| Form submission endpoint      | TBD until implemented       |
| Spam mitigation               | TBD until implemented       |
| Consent implementation/vendor | TBD if required             |
| CSP reporting endpoint        | TBD if used                 |

Unknown operational facts are better marked TBD than invented.
