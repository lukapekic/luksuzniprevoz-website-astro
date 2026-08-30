# Pricing Page — Shared/UI Additions Contract

Status: **LOCKED COMPONENT + LOCALIZATION CONTRACT**

## 1. Shared components reused unchanged

Pricing V1 MUST reuse these reviewed contracts where their current APIs fit:

```text
foundation/ui/PageContainer.astro
foundation/ui/Section.astro
foundation/ui/SectionHeading.astro
foundation/ui/Link.astro
components/services/shared/ServiceHero.astro
components/shared/FAQ.astro
components/shared/FinalCTA.astro
components/site/SiteHeader.astro
components/site/SiteFooter.astro
```

No shared API change is authorized by this package.

If integration exposes a proven shared-component defect, run `pnpm components:check`, inspect all consumers, and follow the component verification profile before editing shared code.

## 2. Hero reuse

Use:

```text
ServiceHero
variant="responsive-split"
```

The component name is service-oriented, but its current typed API is generic enough for this page:

```text
title
description
eyebrow
primaryAction
secondaryAction
locale
image
imageAlt
```

Pricing V1 reuses the component without modifying it.

Hero image contract:

```text
src/assets/s-class-wheel-interior.webp
```

Role:

```text
decorative cinematic context
```

Use empty alt text. Do not duplicate the image elsewhere prominently on this page.

If the asset is already committed to another prominent page role in the implementation branch, use a neutral placeholder and report an asset blocker. Do not fetch stock photography.

## 3. Page-local components

Create under:

```text
src/components/pricing/
```

Required file map:

```text
PricingPage.astro
PricingIndex.astro
PricingPublishedRates.astro
PricingRateGroup.astro
PricingCustomServices.astro
PricingModels.astro
```

Responsibilities:

### `PricingPage.astro`

Owns page assembly, content lookups, authoritative data adapters, route/flow resolution, schema input and section order.

### `PricingIndex.astro`

Owns the three in-page anchor links:

```text
airport
private-chauffeur
individual-pricing
```

Native anchor navigation only. No hydration.

### `PricingPublishedRates.astro`

Owns the light pricing canvas and the two public tariff families:

```text
Airport Transportation
Private Chauffeur
```

It receives already-resolved typed display rows.

### `PricingRateGroup.astro`

Owns one tariff mode:

```text
heading/fact
vehicle rows
localized unit label
```

It is page-local because its semantic contract exists only inside Pricing V1.

### `PricingCustomServices.astro`

Owns the dark individually-priced catalogue region.

It derives child services from the canonical Business and Special Events hubs rather than hardcoding child lists.

### `PricingModels.astro`

Owns the three explanatory pricing-model columns from `sections[key=pricingModels]`.

## 4. Forbidden components/patterns

Do not add:

```text
ServiceCard
TrustStrip
HorizontalCarousel
pricing cards
plan cards
comparison table
tabs that hide canonical pricing
client-side pricing calculator
floating sticky quote card
dashboard panels
badge clouds
```

The rate ledger is divider-led and open.

## 5. UI additions

Merge `ui-additions/<locale>.json` into:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Merge rule:

```text
missing key → add
existing identical key → keep
existing different key → STOP and reconcile
```

Every new key is prefixed:

```text
pricing.*
```

No existing key is intentionally replaced.

## 6. Content vs UI ownership

Markdown owns:

```text
SEO title/description
Hero proposition
editorial intro
custom-pricing explanation
pricing-model explanation
FAQ
Final CTA copy
```

UI JSON owns:

```text
section labels
in-page navigation labels
rate-mode labels
data-derived fact templates
price status labels
compact operational notes
contextual action labels
```

Typed data owns:

```text
amounts
currency
vehicle names/IDs
hire limits
pricing modes
service relationships
route availability
```
