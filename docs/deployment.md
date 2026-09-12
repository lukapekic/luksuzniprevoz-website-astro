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

The form runtime is implemented in the repository and is ready for Cloudflare
account provisioning. The architecture and security contract are documented in
[`site/luksuzni-prevoz/src/docs/forms/cloudflare-pages-brevo-implementation-plan.md`](../site/luksuzni-prevoz/src/docs/forms/cloudflare-pages-brevo-implementation-plan.md).
The account-owner setup, D1/free-plan explanation, deployment sequence,
acceptance checks, monitoring, and rollback procedure are in the
[`Cloudflare Pages Forms Deployment Runbook`](cloudflare-pages-forms/README.md).
It keeps Astro static, uses same-origin Cloudflare Pages Functions, Managed
Turnstile, a D1 metadata/idempotency ledger, and Brevo office notifications for
both Contact and Booking. The UI activates when `PUBLIC_TURNSTILE_SITE_KEY` is
present at build time; without it, submission fails closed and the direct
contact channels remain available.

Implemented repository contracts:

- `POST /api/forms/contact` and `POST /api/forms/booking` under root `functions/`;
- mandatory server-side Turnstile Siteverify with exact action and allowed-host checks;
- shared server validation, bounded JSON bodies, same-origin enforcement, and no-store responses;
- D1 migration `migrations/0001_form_submission_ledger.sql`, storing metadata only;
- Brevo REST delivery with Reply-To, provider message ID capture, and stable submission idempotency;
- localized accessible form errors, pending states, failure recovery, and request references.

### Cloudflare Pages project configuration

Use the repository root as the Pages root so both `functions/` and the monorepo
build are visible.

| Setting                | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Production branch      | `master` (confirm before connecting Git)                                 |
| Build command          | `pnpm types:generate:check && pnpm --filter @luksuzni-prevoz/site build` |
| Build output directory | `site/luksuzni-prevoz/dist`                                              |
| Node version           | `.nvmrc`                                                                 |
| D1 binding name        | `FORM_DB`                                                                |

Configure these separately for Preview and Production. Secrets must use encrypted
bindings rather than plaintext repository files.

| Binding / variable          | Kind             | Required value                              |
| --------------------------- | ---------------- | ------------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | build variable   | matching Turnstile widget site key          |
| `FORM_ENVIRONMENT`          | runtime variable | `preview` or `production`                   |
| `TURNSTILE_ALLOWED_HOSTS`   | runtime variable | comma-separated exact hostnames, no schemes |
| `TURNSTILE_SECRET_KEY`      | encrypted secret | matching widget secret                      |
| `BREVO_API_KEY`             | encrypted secret | site-specific Brevo transactional key       |
| `BREVO_SENDER_EMAIL`        | runtime variable | verified Brevo sender address               |
| `BREVO_SENDER_NAME`         | runtime variable | approved sender display name                |
| `BREVO_TO_EMAIL`            | runtime variable | comma-separated internal recipients         |

Create Preview and Production D1 databases, bind each as `FORM_DB`, then apply
`migrations/0001_form_submission_ledger.sql` to Preview first and Production only
after Preview acceptance. Do not place database IDs in the repository until the
actual account resources exist.

Create a Cloudflare WAF rate-limit rule for POST requests to
`/api/forms/contact` and `/api/forms/booking`. Select and test the threshold in
the actual account plan; do not emulate this with a client-side timer. Production
must use Managed Turnstile keys and must not use Cloudflare's always-pass test key.

Before enabling production traffic, verify the Brevo sender/domain, decide the
transactional-log/content-preview retention setting, and run real delivery tests
for both form types. A `202` response means accepted for manual review, never an
instant confirmed booking.

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

| Decision                      | Value                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| Hosting provider / plan       | Cloudflare Pages approved; exact account plan/provisioning still pending |
| Production deploy trigger     | Pages Git integration from `master`; external connection not configured  |
| Preview/staging URL strategy  | Planned Pages branch previews; hostname policy still pending             |
| Form submission endpoint      | Implemented same-origin `/api/forms/contact` and `/api/forms/booking`    |
| Spam mitigation               | Managed Turnstile implemented; external WAF rate-limit rule pending      |
| Form delivery provider        | Brevo adapter implemented; production sender not yet verified            |
| Form persistence              | D1 metadata/idempotency migration implemented; databases not provisioned |
| Consent implementation/vendor | TBD if required                                                          |
| CSP reporting endpoint        | TBD if used                                                              |

Unknown operational facts are better marked TBD than invented.
