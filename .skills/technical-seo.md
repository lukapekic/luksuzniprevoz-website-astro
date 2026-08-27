---
name: technical-seo
description: Use for metadata, canonical/indexability, hreflang, sitemaps, robots, internal links, headings, Open Graph, redirects, and technical search behavior.
source-of-truth: AGENTS.md
---

# Technical SEO

## Authority

Site identity and locales come from `foundation.config.ts`; paths and relationships come from the route map; page SEO content comes from localized content; `Page` owns emitted head markup. Do not duplicate these sources.

## Indexable-page contract

- Unique useful title and description from approved localized content.
- Exactly one meaningful H1 with logical headings.
- Self-canonical absolute URL derived from the route map.
- Complete reciprocal hreflang set, including configured x-default behavior.
- Correct `htmlLang`, trailing slash, sitemap inclusion, and robots behavior.
- Crawlable internal links using approved routing helpers.
- Open Graph values aligned with visible content and verified assets.
- Redirects generated from approved previous slugs.
- Mobile and desktop expose equivalent meaningful content.

Noindex, unpublished, or unavailable pages must not leak into sitemap or hreflang clusters. Do not fabricate location/service claims, schema fields, reviews, or dates.

## Verification

Run `pnpm seo:validate site/luksuzni-prevoz`, `pnpm routes:validate site/luksuzni-prevoz`, and the applicable `verify:ui` profile. Confirm the validator reports non-zero discovered and validated page counts. Inspect built head output for representative route/locale pairs and verify status codes/redirects where applicable.
