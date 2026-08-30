# Luxury Transportation — Pricing Page Package

Status: **DESIGN + CONTENT HANDOFF**
Route key: `pricing`
Target site: `site/luksuzni-prevoz`
Prepared: 2026-08-30
Source digest for EN/RU content: `efbdb5a9f5bbdc38`

This package defines the complete Pricing page direction **Platinum Tariff Ledger**.

## Package contents

```text
pricing-page-package/
├── README.md
├── MANIFEST.md
├── data-contract.md
├── shared-ui-additions.md
├── blueprint.md
├── implementation.md
├── acceptance.md
├── wireframe.html
├── content/
│   ├── pricing.sr.md
│   ├── pricing.en.md
│   └── pricing.ru.md
└── ui-additions/
    ├── sr.json
    ├── en.json
    └── ru.json
```

## Installation targets

```text
content/pricing.*.md
→ site/luksuzni-prevoz/src/content/pages/pricing/

ui-additions/*.json
→ merge into site/luksuzni-prevoz/src/content/ui/<locale>.json

blueprint.md
implementation.md
acceptance.md
wireframe.html
data-contract.md
shared-ui-additions.md
→ recommended repository location:
  site/luksuzni-prevoz/src/docs/pricing/
```

## Mandatory repository authority

Implementation MUST follow:

```text
root AGENTS.md
DESIGN.md
this blueprint
active Theme V2 JSON
existing reviewed shared components
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

## Publication blocker

`pricing.ts` currently encodes `currency: "EUR"` only for `airportTransfer`.

Hourly, half-day and full-day numeric values do not carry canonical currency metadata.

The coding agent MUST keep the authored Pricing entries `draft` + `noindex: true` and the route `availability: "scaffold"` until the currency for published chauffeur fares is confirmed and represented in canonical typed pricing data.

The agent MUST NOT infer currency from the airport fare field or from presentation context.

After that data fact is confirmed, implementation follows the publication transition in `implementation.md`.
