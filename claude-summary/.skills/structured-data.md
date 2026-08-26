---
name: structured-data
description: Use when generating or reviewing JSON-LD structured data (Organization, WebSite, WebPage, BreadcrumbList, LocalBusiness, FAQ, Service). Covers the typed builders, route-derived URLs, visible-content alignment, and Google's spam/manual-action boundaries.
workstream: structured-data
applies-to: "src/lib/seo.ts (structuredData), src/foundation/ui/Breadcrumbs.astro, Page.astro (JSON-LD emission), foundation.config.ts (capabilities.structuredData)"
source-of-truth: AGENTS.md
---

# Structured Data (JSON-LD)

## Goal & end result
Schema that is a true, specific description of the real entity on the page — built with typed helpers, URLs derived from the route registry, matching the visible content — emitted as JSON-LD via the `Page` primitive. End result: `pnpm seo:validate` + `pnpm quality:page` green; no fabricated fields; no duplicate equivalent schemas.

## When to use
- Adding JSON-LD for a page (organization, website, breadcrumbs, local business, FAQ, service).
- Reviewing whether a page should carry schema and which type.
- Wiring schema into `buildPageSeo`'s `structuredData` array.

## When NOT to use
- Changing title/description/canonical/hreflang (use `technical-seo`).
- Adding a generic `<script type="application/ld+json">` by hand outside the `Page` primitive (the `Page` primitive owns `<head>` emission).

## Fixed context (non-negotiable truths of this repo)
- **Prefer JSON-LD.** Emitted by the `Page` primitive from `seo.structuredData` (`Page.astro` renders `<script type="application/ld+json" set:html={JSON.stringify(data)} />`). Do not emit JSON-LD from other components.
- **Typed builders** (from `@astro-foundation/core/seo` / `@astro-foundation/core`):
  - `buildOrganization({ ... })`, `buildWebSite({ site, name, locale? })`, `buildBreadcrumbList(items: {name,url}[])`, `buildLocalBusiness(...)`.
  - Schemas: `OrganizationSchema`, `WebSiteSchema`, `BreadcrumbListSchema`, `FaqPageSchema`, `LocalBusinessSchema` (via `StructuredDataSchemas`).
  - `composeTitle` for the title template.
- **URLs are route-derived and absolute.** Every URL in schema = `${config.site}${getPath(...)}` (or the canonical). Breadcrumb URLs come from `getBreadcrumbs(...)`. Never invent or hardcode URLs.
- **Capability-gated.** `foundation.config.ts` → `capabilities.structuredData` lists which schema types the project opts into (e.g. `["Organization", "WebSite"]`). Archetypes may supply sensible defaults, but final selection is reviewable per page.
- **`seo:validate`** checks schema against the configured/allowed types and alignment rules (FND-SEO-08…FND-SEO-14).

### Google's 2026 boundaries (what makes schema safe vs. a manual action)
- **Must match visible content.** Schema describes what users actually see; marking up hidden/invisible content is a violation.
- **No fabricated data.** Never invent ratings, reviews, prices, availability, addresses, or claims. Fake or self-written reviews are an explicit spam-policy violation that removes rich-result eligibility.
- **Be specific and complete.** Use the most specific applicable schema.org type; include all required properties and as many recommended properties as are true.
- **No misleading markup.** Don't mark up a non-product as a product, a promotion as an event, or aggregate unrelated items into one element.
- **Syntactically valid ≠ eligible.** Bad quality (mismatch, fabrication) blocks rich results even when the JSON-LD parses.

## Procedure
1. **Decide if schema is warranted.** Only emit schema when the page genuinely represents that entity. Don't emit a type just because a builder exists.
2. **Pick the most specific type** that matches the real entity (e.g. `LocalBusiness` over generic `Organization` when address/hours are real).
3. **Use the typed builder**, not hand-written objects, so required properties and shapes are enforced.
4. **Derive every URL** from `getPath`/`getBreadcrumbs` + `config.site` (absolute, trailing slash, matching canonical/hreflang exactly).
5. **Mirror visible content:** BreadcrumbList must match the visible breadcrumb hierarchy; FAQ schema must mirror visible FAQ content; nothing in schema may exceed what's on the page.
6. **Pass via `buildPageSeo({ structuredData: [...] })`** so the `Page` primitive emits it in `<head>`.
7. **Avoid duplicates:** don't emit two equivalent schemas for the same entity on the same page.
8. **Validate** with `pnpm seo:validate` and the page gate.

## Verify
- `pnpm seo:validate` · `pnpm quality:page`
- Release: `pnpm quality:release`
- Manual: confirm emitted JSON-LD matches the rendered HTML and the real entity (Google Rich Results Test / Schema Markup Validator).

## Definition of done
- Schema type is the most specific true match for the page's real entity.
- All URLs are route-derived, absolute, and consistent with canonical/hreflang.
- Schema mirrors visible content exactly; no fabricated fields.
- No duplicate equivalent schemas on the same page.
- Emitted only via the `Page` primitive.
- `seo:validate` + `quality:page` green.

## Never do (banned patterns)
- Invent ratings, reviews, prices, availability, addresses, opening hours, or any claim not true on the page.
- Mark up hidden or invisible content.
- Emit a schema type just because a builder/helper exists.
- Hardcode URLs in schema — always route-derived.
- Emit JSON-LD outside the `Page` primitive's `<head>`.
- Duplicate equivalent schemas (e.g. two Organization blocks).
- Mark up a non-X as X (non-product as Product, promo as Event, aggregate as single).
- Leave required properties empty to "satisfy" a builder.

## Escalation triggers
- A page needs a schema type **not** in `capabilities.structuredData` → escalate (add the capability + validator coverage first; don't emit ungated schema).
- A required schema property has no real value on the page (e.g. no genuine address for `LocalBusiness`) → don't fabricate; use a less specific type or omit schema; escalate if a richer type is demanded.
- Two entity types seem equally valid → escalate the type choice rather than guessing.
- Emitted schema validates but misrepresents the entity (rich-result risk) → escalate before shipping.
