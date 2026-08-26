# Luxury Transportation — Service Data & Content Integration

Status: **Shared execution prompt**

Use this prompt whenever service-page implementation requires wiring localized copy, business facts, routing, pricing state, fleet recommendations, client display, contact channels, or FAQ/SEO content.

This prompt is a data/content ownership gate. It is not permission to invent missing business information.

Mandatory base files:

```text
00-service-agent-foundation.md
component-reuse-registry.md
```

---

## Invocation inputs

```text
TARGET_PAGE:
TARGET_ROUTE_KEY:
TARGET_INTEGRATION_SCOPE:
TARGET_BLUEPRINT:
ALLOWED_FILES_OR_DIRECTORY:
VERIFIED_NEW_FACTS_SUPPLIED_BY_USER: none | <list/source>
OPTIONAL_IMPLEMENTATION_NOTES:
```

---

## 1. Mission

Make the target page consume the repository's canonical data/content correctly so visual components remain presentation-only and facts exist in one authoritative location.

Prefer adapters/view models over copying facts into markup.

Do not mutate canonical data just to satisfy a visual placeholder.

---

## 2. Inspect canonical sources first

Before editing, inspect the current schemas/types and real exported shapes for the relevant sources.

Expected ownership includes:

```text
foundation.config.ts
  site identity, locales, capabilities, active theme, performance budget

src/data/routes.ts
  route map / localized paths

src/data/navigation.ts
  navigation relationships

src/data/services.ts
  service capabilities, relationships, pricing modes, operational service flags

src/data/operations.ts
  site-wide operational standards

src/data/fleet.ts
  canonical vehicle identity/capacity/verified fleet facts

src/data/pricing.ts
  only pricing facts actually represented/validated there

src/data/clients.ts
  client roster + asset/display/permission policy

src/data/contact.ts
  verified contact channels, office/lead-time facts where represented

src/content/pages/*
  localized editorial/page copy

src/content/ui/*
  localized UI strings
```

Actual repository schemas/types win over this summary if they differ.

---

## 3. Canonical fact rule

For every visible fact, identify exactly one owner.

Examples:

```text
vehicle capacity        → fleet.ts
hour/km package limits  → services.ts and/or validated pricing source according to current schema
airport fare            → NOT pricing.ts unless a validated Airport source is added
waiting allowance       → verified airport/service/operations source
client logo permission  → clients.ts policy
phone/email             → contact.ts
service child routes    → services/routes relationships
localized paragraph     → content collection
```

Do not mirror the same fact into a page component constant.

---

## 4. Missing or unverified data

When a fact is absent or not verified:

```text
DO NOT infer it
DO NOT estimate it from another service
DO NOT copy it from an old website/screenshot
DO NOT hardcode a placeholder as if factual
```

Instead choose the safe behavior authorized by the blueprint:

```text
omit unsupported fact
show quote-required state
use neutral asset placeholder
preserve pending/manual-confirmation wording
report a data blocker/TODO
```

Business completeness is not more important than factual correctness.

---

## 5. Pricing rules

Treat pricing as high-risk factual data.

Before rendering a price verify:

- the pricing source actually models the target service;
- currency/display format is authoritative;
- fixed vs estimated vs quote semantics are supported;
- the value is appropriate for the selected vehicle/service state;
- the blueprint permits displaying it in that section.

Airport-specific rule from the locked blueprint:

```text
pricing.ts intentionally does not authorize Airport Transfer fares.
```

Therefore do not calculate/infer/hardcode Airport fares until a validated source exists.

Unsupported pricing states must remain unreachable—not visually mocked.

---

## 6. Fleet integration

Service-page content may reference recommended vehicle IDs.

Resolve canonical facts through `fleet.ts`.

Do not duplicate:

```text
display name
capacity
vehicle class
fleet specs
```

inside localized page content unless the content schema intentionally stores editorial suitability copy.

Recommended pattern:

```text
localized content
  → vehicle id + localized suitability sentence
fleet.ts
  → canonical vehicle facts
adapter/view model
  → VehicleRecommendations props
```

---

## 7. Client integration

For Business Trusted Clients:

- use `clients.ts`;
- obey route/display policy;
- obey asset availability and usage-permission gates;
- let approved count be data-driven;
- do not create fake text logos;
- do not hardcode an exact logo count into layout assumptions;
- omit/gate unavailable clients rather than inventing assets.

Client roster existence is not automatically permission to publicly render a logo.

---

## 8. Contact integration

Use canonical contact values only.

Respect the consuming component contract:

- `FinalCTA` currently supports its documented phone/email tertiary row;
- do not force additional channels into it;
- SiteFooter/contact surfaces may have different approved channel support;
- do not construct a second contact database in page content.

External contact hrefs may be derived from verified canonical values; internal navigation still uses route helpers.

---

## 9. Routing/localization

Internal URLs must use route infrastructure:

```text
RouteKey
getPath()
<Link>
approved routing helpers
```

Never:

```text
`/${locale}/...`
manual translated slugs
folder-name inference
string concatenation
```

All configured locales must use validated content according to repository rules.

Do not silently fall back to Serbian/English copy when a required locale entry is missing.

Do not invent translations during implementation.

---

## 10. FAQ and structured data

Visible FAQ content comes from canonical localized content.

Do not maintain one FAQ set for markup and another for schema.

Use the repository's existing FAQ structured-data architecture so visible Q/A and JSON-LD remain aligned.

Do not emit JSON-LD directly from `FAQ` if current architecture assigns schema/head ownership elsewhere.

---

## 11. Content schema changes

Do not add a new content field merely because it is convenient for one component.

Before changing schemas:

1. inspect current archetype/page schemas;
2. check whether an existing structured field already represents the need;
3. distinguish business data from editorial content;
4. evaluate all locale entries affected;
5. keep the schema semantic rather than styling-driven.

Rejected schema fields:

```text
heroPadding
headingColor
cardColumns
sectionBackground
mobileImageOrder
```

Those belong to blueprint/component contracts, not content authors.

---

## 12. Adapter/view-model rule

A small adapter is preferred when components need normalized data from multiple canonical sources.

Adapters may:

```text
join IDs to canonical records
filter by permission/availability
resolve approved CTA route shapes
normalize display-ready non-factual formatting
```

Adapters must not:

```text
invent missing facts
become a second data store
hide hardcoded business constants
manually build locale URLs
```

Keep adapters close to the relevant page/data architecture following current repo conventions.

---

## 13. Validation

If content/data/routing/SEO changed, run the relevant gates:

```bash
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Also run design detection when UI integration changed:

```bash
pnpm design:detect site/luksuzni-prevoz
```

Do not modify generated files manually; regenerate through the repository command when required.

---

## 14. Required completion report

```text
INTEGRATION SCOPE
- ...

CANONICAL SOURCES USED
- <fact/content> → <source>

ADAPTERS / VIEW MODELS ADDED
- None
or
- ...

SCHEMA CHANGES
- None
or
- <change + why existing schema was insufficient>

UNVERIFIED / MISSING DATA
- None
or
- <missing fact + safe UI behavior>

HARDCODED BUSINESS FACTS ADDED
- None expected

FILES CHANGED
- ...

VALIDATION
- ...

BLOCKERS / TODOs
- None
or
- ...
```
