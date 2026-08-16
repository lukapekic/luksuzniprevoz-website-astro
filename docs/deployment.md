# Deployment Guide (FND-ENV-01)

Document your deployment configuration here. The fields below cover all deployment aspects required by the Foundation Template spec.

---

## Host & Plan

| Field | Value |
|-------|-------|
| Hosting provider | _e.g. Cloudflare Pages, Vercel, Netlify, Fly.io_ |
| Plan/tier | _e.g. Pro, Hobby, Starter_ |
| Region(s) | _e.g. eu-west-1, us-east-1_ |
| Edge functions | _yes/no_ |

## Build Command

```bash
pnpm build
```

The build command runs from the **reference-site directory** (or your project root if it is a standalone Astro site):

```bash
# In the monorepo:
cd examples/reference-site && pnpm build

# Or if using the root-level build script:
pnpm build
```

Build output is written to `examples/reference-site/dist/`.

## Environments

| Environment | URL | Notes |
|-------------|-----|-------|
| Production | _e.g. https://mysite.com_ | |
| Staging | _e.g. https://staging.mysite.com_ | Mirror of production |
| Preview | _Auto-generated per PR_ | |

### Environment Variables

| Variable | Production | Staging | Description |
|----------|-----------|---------|-------------|
| `SITE_URL` | `https://mysite.com` | `https://staging.mysite.com` | Overrides `site` in config |

> **Note**: The Foundation Template reads configuration from `foundation.config.ts` at build time. Runtime environment variables are only needed if your deployment platform requires them.

## Redirect Mechanism (FND-ENV-10)

The template generates redirect rules from `previousSlugs` in route definitions.

| Platform | File | Command |
|----------|------|--------|
| Cloudflare Pages | `_redirects` in `dist/` | `pnpm generate:redirects --format=cloudflare` |
| Vercel | `vercel.json` in `dist/` | `pnpm generate:redirects --format=vercel` |
| Generic | `redirects.json` in `dist/` | `pnpm generate:redirects --format=json` |

For Astro's built-in redirects, add them to `astro.config.mjs`:

```js
export default defineConfig({
  redirects: {
    '/old-path': '/new-path',
  },
});
```

For programmatic redirects based on `previousSlugs`, run `pnpm generate:redirects` and deploy the generated file alongside your build output.

## Header Mechanism (FND-ENV-08)

Security headers are set per platform:

| Header | Value | Notes |
|--------|-------|-------|
| `X-Content-Type-Options` | `nosniff` | |
| `X-Frame-Options` | `DENY` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Adjust as needed |
| `Content-Security-Policy` | See CSP Note below | **Start in report-only mode** |

### CSP Note (Open Item #2)

> **Important**: Start with `Content-Security-Policy-Report-Only` to collect violations without breaking anything. Only promote to `Content-Security-Policy` after reviewing reports and resolving all legitimate violations.

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; report-uri /csp-report
```

## CI System

| Field | Value |
|-------|-------|
| CI provider | _e.g. GitHub Actions, GitLab CI_ |
| Config file | _e.g. `.github/workflows/ci.yml`_ |
| Runner | _e.g. ubuntu-latest_ |
| Node version | 22 (per `.nvmrc`) |
| Package manager | pnpm |

### CI Pipeline

```yaml
# Example GitHub Actions workflow
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm quality:release
```

## Deploy Trigger

| Trigger | Action |
|---------|--------|
| Push to `main` | Deploy to production |
| Push to PR branch | Deploy to preview URL |
| Manual trigger | Available via platform UI |

### Deploy Gate

Deployment only proceeds if:

1. `pnpm quality:fast` passes (all checks green)
2. `pnpm test:unit` passes (all tests green)
3. `pnpm lint` passes (zero errors)

## Rollback Procedure

1. **Identify the last known-good deploy** in your hosting platform's deploy log
2. **Roll back** using the platform's rollback feature:
   - **Cloudflare Pages**: Deployments → Select previous deployment → Rollback
   - **Vercel**: Deployments → Select previous → Promote to Production
   - **Netlify**: Deploys → Select previous → Deploy this again
3. **Verify** the rollback by:
   - Loading the site and checking key pages
   - Running `foundation:doctor` against the rolled-back code
4. **Root cause analysis**: Create an issue documenting what broke and why

## DNS & TLS

| Field | Value |
|-------|-------|
| Domain | _e.g. mysite.com_ |
| DNS provider | _e.g. Cloudflare, Route 53_ |
| TLS mode | _Full (strict)_ |
| Certificate | _Auto-managed by host_ |
| HSTS | _Enable after first successful production deploy_ |

### DNS Records

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` or `www` | _e.g. your-site.pages.dev_ |
| TXT | `@` | SPF / verification records |

## Cache Policy

| Resource | Cache | Max-Age | Notes |
|----------|-------|---------|-------|
| HTML pages | No cache (or short) | 0 or 60s | Ensures content updates are immediate |
| CSS/JS (hashed) | Immutable | 1 year | Filenames include content hash |
| Fonts | Immutable | 1 year | |
| Images (optimized) | Long | 30 days | Via Astro's image optimization |
| OG images | Long | 7 days | |
| `_redirects` / redirects | No cache | 0 | Must be fresh on every request |
| `robots.txt` | Short | 1 hour | |
| `sitemap.xml` | Short | 1 hour | |

### Cache Headers (Platform-Specific)

For Cloudflare Pages, configure via `_headers` file in `public/`:

``nolang
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: no-cache
```

---

## Post-Deploy Verification

After every deploy, verify:

- [ ] Site loads at the production URL
- [ ] HTTPS is active (no mixed content warnings)
- [ ] `robots.txt` is served at `/robots.txt` (disallow-all on preview, allow + sitemap on prod)
- [ ] `sitemap.xml` is served at `/sitemap-index.xml`
- [ ] Language switching works for all locales
- [ ] All redirect rules are active (test a `previousSlug` URL)
- [ ] Lighthouse scores meet the performance budget thresholds

---

## Consent Banner (FND-SCOPE / FND-ENV-09)

The Foundation Template does **not** ship a consent-banner component. Setting
`capabilities.consentBanner: true` in `foundation.config.ts` is a **flag that
implies a reviewed third-party decision** — it does not produce any UI.

### Why no banner ships by default

- A consent banner is a legal/compliance decision (GDPR/ePrivacy scope, regional
  enforcement, consent-string vendor choice) that varies per project and
  jurisdiction. A generic banner would be wrong for most consumers.
- Every banner adds a third-party script and a JS island, which conflicts with
  the template's performance budget (FND-PERF-03) and the "simple, high-value"
  goal.

### What to do when `consentBanner: true`

1. **Select a reviewed consent vendor** (or build a minimal in-house banner) and
   record the decision here — name, purpose, script weight, and the
   `thirdParty[]` entry it maps to in `foundation.config.ts`.
2. **Lazy-load the banner script** (FND-PERF-06) and gate every third-party
   script on consent before it loads.
3. **Block third-party scripts by default** in CSP; allow them only after
   consent (the banner sets the necessary CSP exceptions per-vendor).
4. **Provide a re-consent UI** in the footer so users can withdraw consent.

Record the vendor decision in the table below (template projects start empty):

| Vendor | Purpose | Script weight | Loaded when | FND-ENV-09 mitigation |
|--------|---------|---------------|-------------|------------------------|
| _e.g. Cookiebot_ | _Consent management_ | _KB_ | _After consent_ | _Gated in CSP_ |

---

## Form Handling (FND-A11Y-10 / FND-PERF-06 / FND-ENV-06/09)

The template ships form *primitives* (`Field`, `Input`, `Select`, `Textarea`,
`Checkbox`, `FormStatus`) but **no form-handling endpoint**. Wiring a form is a
per-project decision. Record it here so the choice is auditable.

### Decision record

| Decision | Option chosen | Notes |
|----------|---------------|-------|
| Submission endpoint | _e.g. Astro SSR action / serverless function / third-party form service_ | _Where does the POST go?_ |
| Spam mitigation | _e.g. Honeypot field / Turnstile / hCaptcha_ | _Must be accessible (FND-A11Y-10): no CAPTCHA-only gate that a screen reader can't pass_ |
| PII in query strings | _Never_ | Form data must be POST-body, never in the URL (FND-ENV-06) |
| Privacy statement | _Link to /privacy/ before submission_ | _Required where personal data is collected_ |
| Success/error feedback | `FormStatus` + `aria-live` region | _Already provided by the primitive_ |
| Secrets | `astro:env` server-side schema | _Endpoint keys live in server env, never in `dist/` (verified by `secret-scan`)_ |

### Requirements any form must meet

- **Accessible spam mitigation (FND-A11Y-10):** a honeypot or a token-based
  challenge (Turnstile/hCaptcha) is preferred over a visual CAPTCHA. If a
  CAPTCHA is unavoidable, provide an audio alternative.
- **No PII in query strings (FND-ENV-06):** form submissions are `POST`; the
  secret-scan gate additionally rejects any secret pattern in `dist/`.
- **Privacy statement:** link to a legal/privacy page before the submit button
  where personal data is collected.
- **Per-locale labels (FND-ARCH-03):** all field labels, errors, and the
  success message come from the UI dictionary (`form.error.*`, `form.success`).

### Per-locale 404 (FND-ENV-04)

The template emits both a root `404.astro` (the host fallback, default locale)
and per-locale `404` pages at `/sr/404/`, `/en/404/`, `/ru/404/`. Configure
your host to serve the locale-specific 404 based on the path prefix:

| Host | Rule |
|------|------|
| Cloudflare Pages | `_redirects`: `/*/404 /:locale/404/ 404` (or a Cloudflare Worker) |
| Netlify | `netlify.toml`: a `404` redirect per locale prefix |
| Vercel | `vercel.json`: `cleanUrls` + a custom 404 route |
