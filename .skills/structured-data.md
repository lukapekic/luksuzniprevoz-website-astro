---
name: structured-data
description: Use when adding or reviewing JSON-LD/schema. Enforces typed builders, eligibility, visible-content alignment, route-derived URLs, deduplication, and truthful entity data.
source-of-truth: AGENTS.md
---

# Structured Data

## Authority

Structured-data capabilities come from `foundation.config.ts`. Real entity facts come from verified data/content. URLs come from route helpers. `Page` is the only emitter. Search-engine examples are not permission to claim unsupported facts.

## Rules

- Add a schema type only when it is eligible, useful, and supported by visible page content.
- Use approved typed builders and absolute route-derived URLs.
- Keep names, descriptions, breadcrumbs, FAQs, images, contact data, prices, service areas, reviews, and dates aligned with authoritative visible content.
- Do not invent ratings, offers, availability, addresses, business types, service areas, or organization relationships.
- Emit one canonical representation of each entity; link related nodes with stable identifiers rather than duplicating them.
- Exclude noindex, unpublished, gated, or unverified claims as required by the content model.
- Keep localized schema in the page locale and preserve reciprocal route semantics.
- JSON serialization must be safe and performed through the reviewed `Page` contract.

## Verification

Run `pnpm seo:validate site/luksuzni-prevoz`, unit tests for the relevant builder/schema, and the applicable `verify:ui` profile. Compare built JSON-LD with visible content and authoritative data. Validation success alone does not prove factual eligibility.
