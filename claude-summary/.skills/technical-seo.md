---
name: technical-seo
description: Use for indexability, metadata (title/description/canonical/OG), hreflang, sitemaps, robots, internal links, mobile/desktop content parity, and Core Web Vitals-related SEO. Covers the route-registry-derived SEO model and Google's 2026 expectations.
workstream: technical-seo
applies-to: "src/content/pages/ frontmatter, src/lib/seo.ts, src/data/routes.ts (noindex/sitemap/previousSlugs), foundation.config.ts (site/brand), robots.txt, sitemap generation"
source-of-truth: AGENTS.md
---

# Technical SEO

## Goal & end result
Every indexable page is fully crawlable, correctly described, and correctly clustered across locales: unique title, useful description, self-canonical, reciprocal hreflang, sitemap inclusion, correct robots, one meaningful H1, crawlable internal links, OG metadata, and mobile/desktop content parity. End result: `pnpm seo:validate` + `pnpm routes:validate` + `pnpm quality:page` green; Lighthouse SEO ≥ 0.95.

## When to use
- Setting or editing page SEO (`seoTitle`, `seoDescription`, `noindex`, `ogImage`, `h1`) in content frontmatter.
- Changing canonical, hreflang, sitemap inclusion, or robots behavior.
- Adding/removing routes (affects sitemap + redirects via `previousSlugs`).
- Adding internal links, breadcrumbs, or OG images.
- Diagnosing indexability or locale-clustering problems.

## When NOT to use
- Authoring JSON-LD structured data (use `structured-data`; but the two overlap — SEO owns *what* is indexed, structured-data owns *how entities are described*).
- Pure performance tuning with no SEO metadata change (use `responsive-images-performance`).

## Fixed context (non-negotiable truths of this repo)
- **URLs are route-registry-derived.** Canonical, hreflang, sitemap entries, and internal links all come from `getPath`/`buildHreflangSet` over `src/data/routes.ts`. `config.site` is the origin; canonical = `${config.site}${getPath(...)}`. Never string-build.
- **`trailingSlash: "always"`** (FND-I18N-04) — every URL ends with `/`. Canonical, hreflang, and sitemap must agree byte-for-byte (protocol, host, trailing slash) or Google sees no return reference.
- **Title template** `"{title} | {brand}"` (FND-SEO-13, via `composeTitle`); `brand` from `config`.
- **Lengths are guidance, not rigid legacy limits.** `seoTitle` 30–60 chars, `seoDescription` 50–160 chars are quality targets, not hard cut-offs — write for usefulness, not character count.
- **Sitemap** is generated from validated routes; routes with `noindex: true` or `sitemap.include: false` (e.g. `legal`) are excluded. Served at `/sitemap-index.xml`.
- **Robots** (`src/pages/robots.txt.ts` or equivalent): allow on production, disallow staging/dev paths (`/drafts/`, `/api/`), reference the sitemap. Disallow-all on preview deploys.
- **`previousSlugs`** in route defs generate redirects (`pnpm generate:redirects`) — the post-redirect, canonical URL is what hreflang/sitemap must reference.
- **OG images:** 1200×630; `ogImages` capability is `"static"` (replace placeholders) or `"generated"` (`pnpm og:generate`); per-locale font-script coverage (FND-SEO-07).
- **Enforced:** `no-manual-internal-url` (FND-I18N-03) — crawlable `<a href>` internal links via `getPath`/`<Link>`, never JS-only or string-built navigation.

### What Google actually requires in 2026 (anchor your decisions here)
- **Hreflang:** reciprocal + self-referencing are mandatory; a missing return tag makes the whole cluster unverified. Absolute, fully-qualified URLs only. `x-default` is **optional** — add only when there's a genuine locale-neutral page; this repo emits it solely when a locale has `isXDefault`. Each localized page **self-canonicalizes**; never canonicalize all locales to the default.
- **Core Web Vitals (p75 field data):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. A single amber metric fails the URL. INP (not FID) is the responsiveness metric since March 2024.
- **Structured data:** must match visible content; fabricated/fake data (reviews, prices, ratings, availability) triggers manual actions that remove rich-result eligibility (see `structured-data` skill).
- **Mobile/desktop content parity:** meaningful content must not be hidden on mobile (Google indexes mobile-first; hiding mobile content also hides it from indexing).

## Procedure
1. **Set per-page SEO in frontmatter** of `{routeKey}/{locale}.md` (per-route folder): `seoTitle` (unique, meaningful), `seoDescription` (useful, not keyword-stuffed), `h1` (defaults to `seoTitle`), `noindex` if needed, `ogImage`/`ogImageAlt`.
2. **Translate** `seoTitle` and `seoDescription` per locale — don't copy the source locale.
3. **Canonical/hreflang:** use `buildPageSeo`/`buildHreflangSet` (see `site/luksuzni-prevoz/src/lib/seo.ts`). Confirm the page **self-canonicalizes** and the hreflang set is the full reciprocal cluster.
4. **Sitemap/robots:** confirm the route's `noindex`/`sitemap.include` reflects intent. Don't add `noindex` + keep in sitemap — they must agree.
5. **Internal links:** render navigation/breadcrumbs/CTAs as crawlable `<a href>` via `<Link>`/`getPath`. No JS-only or `<div onclick>` navigation.
6. **Redirects:** if you rename a slug, set `previousSlugs` for every affected locale and run `pnpm generate:redirects` so the old URL 301s to the new one.
7. **OG:** provide `ogImage` (1200×630) + `ogImageAlt`; generate via `pnpm og:generate` if `ogImages: "generated"`.
8. **Validate** SEO, routes, and the page gate.

## Verify
- `pnpm seo:validate` · `pnpm routes:validate` · `pnpm quality:page`
- Release: `pnpm quality:release` (adds Lighthouse: SEO ≥ 0.95, a11y ≥ 0.95, best-practices ≥ 0.90, perf ≥ 0.90)
- Post-deploy: confirm `/robots.txt`, `/sitemap-index.xml`, and a `previousSlug` redirect all serve correctly.

## Definition of done
- Every indexable page: unique title, useful description, self-canonical, full reciprocal hreflang, sitemap inclusion, correct robots, one H1, logical headings, crawlable internal links, OG metadata, mobile/desktop parity.
- Every `noindex`/`sitemap.include=false` route is consistently excluded.
- Renamed slugs have `previousSlugs` redirects generated.
- `seo:validate`, `routes:validate`, `quality:page` green; Lighthouse SEO ≥ 0.95.

## Never do (banned patterns)
- Canonicalize every locale to the default locale (breaks hreflang).
- Emit hreflang for `noindex` routes, or `x-default` without an `isXDefault` locale.
- Use relative URLs in hreflang/canonical — absolute, fully-qualified only.
- Hide meaningful content on mobile that should be indexed.
- Keyword-stuff titles/descriptions or add hidden SEO-only content.
- Keep a page in the sitemap while marking it `noindex` (or vice versa).
- Build internal links without `<a href>` (no `onclick`/`<div>` navigation, no JS-only routing for indexable pages).
- Hand-craft canonical/hreflang strings — derive from the route registry.
- Rename a slug without setting `previousSlugs` (orphaned URLs).
- Fabricate any SEO field (reviews, ratings, prices) — see `structured-data`.

## Escalation triggers
- A `previousSlugs` rename would create a redirect chain or conflict with an existing live URL → escalate (SEO impact).
- A page needs to be `noindex` but is required in navigation/structure (or vice versa) → escalate; don't special-case silently.
- hreflang cluster can't be made reciprocal because a locale genuinely lacks the route → confirm against `parityFloor`/`missingTranslation`; if it can't satisfy the spec, escalate.
- Lighthouse SEO < 0.95 on a release gate and the cause is structural (not a single missing field) → escalate rather than patching fields to game the score.
- A requirement to canonicalize to a different domain or merge locales → escalate (international SEO decision).
