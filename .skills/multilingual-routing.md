---
name: multilingual-routing
description: Use for locales, the route map, translated slugs, URL building, hreflang, language switching, breadcrumbs, static path generation, and per-locale content/UI-string parity. Covers the config-driven, route-registry-derived URL model.
workstream: i18n-routing
applies-to: "src/data/routes.ts, src/data/navigation.ts, src/content/pages/, src/content/ui/, foundation.config.ts (locales), any code that builds or links to an internal URL"
source-of-truth: docs/AGENTS.md
---

# Multilingual Routing & i18n

## Goal & end result
Every logical page has one stable `routeKey`, a localized slug for **every** configured locale, content for every locale, and URLs/hreflang/breadcrumbs derived — never stored or string-built. End result: full locale parity, `pnpm routes:validate` + `pnpm content:validate` + `pnpm quality:page` green, language switching correct on every page.

## When to use
- Adding/removing a route or a locale.
- Changing slugs, route hierarchy (`parent`), or navigation.
- Building any internal link, hreflang set, breadcrumb, or alternate URL.
- Authoring/translating page content or UI strings.
- Touching `foundation.config.ts` locale settings (`missingTranslation`, `parityFloor`, `isXDefault`).

## When NOT to use
- Pure visual/styling work that changes no URLs or locale content (use `responsive-ui`).
- Pure SEO metadata values in frontmatter (use `technical-seo`; but hreflang/canonical URLs still belong here).

## Fixed context (non-negotiable truths of this repo)
- **Locales are config-driven** in `foundation.config.ts` → `locales.locales[]`: `code`, `htmlLang`, `hreflang`, `label`, `dir`, `isDefault` (exactly one), `isXDefault` (at most one), `intl`. **2–6 locales** (schema-enforced). `missingTranslation`: `"omit"` (skip missing) or `"fallback"` (use `fallbackLocale`). `parityFloor` sets minimum locale coverage.
- **URL format.** `trailingSlash: "always"` (FND-I18N-04, in `astro.config.mjs`) — every emitted path ends with `/`. Default locale is **unprefixed**; other locales are `/locale/slug/`. Home has slug `""` in every locale.
- **Routes** (`src/data/routes.ts`, typed `RouteDef`):
  ```
  { key, slugs: Record<LocaleCode, string>, parent?, noindex?, sitemap?: {include?, priority?}, previousSlugs?: Record<LocaleCode, string[]> }
  ```
  - One stable `key` per logical page; `RouteKey` is generated from keys.
  - Nested routes store **only `parent` + own localized segment**; full URLs are derived.
  - `previousSlugs` powers generated redirects (`pnpm generate:redirects`).
- **Real helpers** (from `@astro-foundation/core/i18n` / `@astro-foundation/core`). Signatures are exact — don't invent others:
  - `getPath(routeKey, locale, routes, defaultLocale): string` — derives a path with trailing slash. **This is the only correct way to build an internal URL.**
  - `buildHreflangSet(routeKey, currentLocale, routes, locales, defaultLocale): HreflangLink[]` — full reciprocal set incl. self-reference; **excludes `noindex` routes**; emits `x-default` **only if a locale has `isXDefault`** (opt-in).
  - `getBreadcrumbs(routes, routeKey, locale, defaultLocale, uiStrings: Map<string,string>): BreadcrumbItem[]` — root ancestor first; cycle detection (FND-SEO-11); uses UI-string labels.
  - `resolveAllPaths(routes, locales, defaultLocale): Map<path, {routeKey, locale, path}>`.
  - `isDefaultLocale(locale, locales): boolean`.
- **Site-level helpers** (in the consuming site, e.g. `src/lib/i18n.ts`):
  - `t(key: UiStringKey, locale): string` — UI string lookup; key is a generated union, so typos are compile errors (FND-TYPE-02). Falls back to default locale.
  - `getUiStrings(locale): Record<string,string>`.
- **Content layout is FLAT** in `src/content/pages/`:
  - Pages: `{routeKey}.{locale}.md` (e.g. `about.en.md`, `home.sr.md`). **Not** per-page folders.
  - Frontmatter: `routeKey`, `locale`, `status` (`draft`|`in-review`|`published`), `translationState?` (`missing`|`draft`|`reviewed`), `seoTitle` (30–60), `seoDescription` (50–160), `ogImage?`, `ogImageAlt?`, `noindex?`, `h1?`, `reviewedOn?`.
  - UI strings: `src/content/ui/{locale}.json`, flat dot-notation keys (e.g. `nav.home`, `form.submit`). **All locales must share the same key set** (FND-I18N-08, enforced by `content:validate`).
- **Missing translation is a build error**, not a silent fallback (within the chosen strategy). No optional locale pages.

### Enforced contract
- `no-manual-internal-url` (FND-I18N-03) — internal URLs must use `getPath()`/`<Link>`.
- `no-hardcoded-ui-string` (FND-ARCH-03/FND-I18N-08) — UI strings via `t()`.
- `no-physical-direction-property` (FND-I18N-13) — logical properties only (matters for `dir`/RTL).

## Procedure
1. **Add a route:** add an entry to `src/data/routes.ts` with a slug for **every** configured locale. Set `parent` for nesting, `sitemap` for inclusion/priority, `noindex` if it must be excluded.
2. **Add content for every locale:** create `{routeKey}.{locale}.md` in `src/content/pages/` for each locale. Translate `seoTitle`/`seoDescription` and body — don't copy the source locale.
3. **Add UI strings** used by the page to **every** `src/content/ui/{locale}.json` (same keys, translated values).
4. **Build URLs with helpers only:** `getPath(routeKey, locale, routes, defaultLocale)` in TS; `<Link to="routeKey">` in markup. Never concatenate locale + slug.
5. **Hreflang:** call `buildHreflangSet(...)`; it produces the reciprocal, self-referencing set automatically. Do not hand-build `<link rel="alternate">`.
6. **Breadcrumbs:** `getBreadcrumbs(routes, routeKey, locale, defaultLocale, labelMap)` where `labelMap` is built from UI strings (e.g. `${route.key}.title`).
7. **Language switching** = linking to the same `routeKey` in the target locale via `getPath`. The switcher uses `hreflang`/`lang` attributes.
8. **Validate parity:** `pnpm routes:validate` (keys, exact locale set, no slash/whitespace in segments, parent exists, no cycles, no duplicate/sibling-collision full URLs, valid nav refs) and `pnpm content:validate` (route binding, content parity, UI-string key parity, staleness).
9. **Adding a locale:** add to `foundation.config.ts`; add slugs for the new locale in **every** route; create content + UI-string files for all routes; write per-locale 404; create legal pages if `legalPages` capability is on; run `pnpm quality:fast`.

## Verify
- `pnpm routes:validate` · `pnpm content:validate` · `pnpm seo:validate`
- Full gate: `pnpm quality:page` (build + generated drift too)
- For release/locale changes: `pnpm quality:release` (adds e2e incl. language-switch tests)

## Definition of done
- Every route has a slug and content for every configured locale.
- All internal URLs come from `getPath`/`<Link>`; hreflang is the full reciprocal set from `buildHreflangSet`; breadcrumbs from `getBreadcrumbs`.
- UI-string key sets are identical across locales; no hardcoded strings.
- `trailingSlash` is honored (every path ends `/`); default locale unprefixed.
- `routes:validate`, `content:validate`, `seo:validate`, and `quality:page` all green.
- Language switching verified for every route × locale.

## Never do (banned patterns)
- Store full localized URLs in the route map or content (derive them).
- Build URLs by string concatenation (`"/" + locale + "/" + slug`) — use `getPath`/`<Link>`.
- Invent helpers named `routePath`, `getAlternates`, `switchLocale`, `getHreflang` — they don't exist; use `getPath` / `buildHreflangSet` / same-`routeKey` `getPath`.
- Use per-page content folders (`home/home.en.md`) — content is flat (`home.en.md`).
- Hand-craft `<link rel="alternate" hreflang="...">` — use `buildHreflangSet`.
- Canonicalize every locale to the default locale — each localized page self-canonicalizes.
- Emit `x-default` unconditionally — it is opt-in, tied to `isXDefault`.
- Hardcode UI strings or copy a source locale's `seoTitle`/`seoDescription` instead of translating.
- Use physical CSS direction properties (breaks RTL/`dir`).
- Leave a route without a slug or content for any configured locale (build error).

## Escalation triggers
- A new locale would push the count **above 6** → outside schema/envelope; escalate.
- Route count would exceed **30 per locale** (FND-SCALE-01) → escalate.
- A `previousSlugs` redirect conflict or sibling-slug collision can't be resolved without changing an existing live URL → escalate (SEO/redirect impact).
- `missingTranslation` strategy change (`omit` ↔ `fallback`) for an existing site → escalate (affects parity floor and live URLs).
- A requirement to omit a locale for a specific route while others include it → confirm it satisfies `parityFloor` and `content:validate`; if not, escalate before special-casing.
