---
name: multilingual-routing
description: Use for routes, locales, translated slugs, internal URLs, hreflang, language switching, breadcrumbs, navigation, static paths, and localized content/UI parity.
source-of-truth: AGENTS.md
---

# Multilingual Routing

## Authority

`foundation.config.ts` owns locale configuration. `src/data/routes.ts` owns route keys, localized slugs, hierarchy, sitemap intent, and previous slugs. Localized content and UI sources own visible strings. Folder names do not define URLs.

## Rules

- Give every logical page one stable route key.
- Resolve internal paths with `getPath()`, `<Link>`, or approved helpers.
- Keep the default locale unprefixed and all internal paths trailing-slash compliant.
- Never concatenate locale prefixes, slugs, or internal paths manually.
- Use ASCII-transliterated localized slugs according to the validated route contract.
- Maintain content/UI parity for every configured locale; no silent page-content fallback.
- Build navigation, language switching, breadcrumbs, canonical, hreflang, sitemap, and redirects from the same route data.
- Preserve route hierarchy and cycle safety.
- Use logical CSS for direction-sensitive behavior even when current locales are LTR.
- Organize page sources as `{surface}/{surface}.{locale}.md`; identity remains frontmatter `routeKey` and `locale`.

## Verification

Run content, routes, SEO, generated-type checks, and the applicable `verify:ui` profile. Exercise every route/locale pair plus language switching from the current page. Missing locale content, dead alternates, duplicate paths, and manual URL construction are blocking.
