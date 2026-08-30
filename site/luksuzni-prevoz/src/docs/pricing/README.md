# Luxury Transportation — Pricing Page Package

Status: **IMPLEMENTED AND VERIFIED**
Route key: `pricing`
Target site: `site/luksuzni-prevoz`
Prepared: 2026-08-30
Source digest for EN/RU content: `efbdb5a9f5bbdc38`

This package defines the complete Pricing page direction **Platinum Tariff Ledger**.

Blueprint v1.2 preserves that direction while adopting the shared full-bleed
Hero and its integrated header treatment. Airport, Private Chauffeur, Pricing
Models and FAQ each own one purpose-specific contained light surface; the FAQ
heading and divider-led rows share the same light section.

## Package contents

```text
src/docs/pricing/
├── README.md
├── MANIFEST.md
├── data-contract.md
├── shared-ui-additions.md
├── blueprint.md
├── implementation.md
├── acceptance.md
├── compliance-matrix.md
└── wireframe.html
```

## Installation targets

```text
localized page content → site/luksuzni-prevoz/src/content/pages/pricing/
localized UI strings  → site/luksuzni-prevoz/src/content/ui/<locale>.json
page contracts         → site/luksuzni-prevoz/src/docs/pricing/
```

## Mandatory repository authority

Implementation MUST follow:

```text
technical: root AGENTS.md → validated repository configuration/contracts
visual: locked blueprint → DESIGN.md → configured active theme
reviewed shared components
matching .skills procedures
```

The package assumes no change to the Black & Platinum theme.

## Locked public pricing scope

The Pricing page exposes only:

```text
Airport Transportation
→ fixed fare per vehicle for the supported Belgrade Airport ↔ Belgrade scope

Private Chauffeur
→ hourly
→ half-day
→ full-day

Business / Corporate / Delegation / Conference & Congress
→ estimate and/or individual quote according to services.ts

Special Events / Wedding / Prom / VIP
→ individual quote; no fabricated numeric "from" price
```

The page MUST NOT expose:

```text
docs/pricing.csv → PUTEVI IZ BEOGRADA
city-to-city fares
destination fares
per-kilometre pricing as a public Pricing V1 format
unsupported formulas
automatic overage formulas
fake event packages
```

## Publication state

`pricing.ts` already owns typed EUR currency for every numeric pricing record.
The fleet contains eight vehicles: seven are `pricingStatus: "published"` and
Škoda Kodiaq is intentionally `quote-only` with no numeric pricing record.

The route and all three localized content records were published atomically
after implementation and acceptance verification:

```text
route availability: published
SR/EN/RU status: published
SR/EN/RU noindex: false
```
