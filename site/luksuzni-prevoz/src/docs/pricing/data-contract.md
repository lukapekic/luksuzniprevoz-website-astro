# Pricing Page — Authoritative Data Contract

Status: **LOCKED DATA CONTRACT**

This file prevents the Pricing page from becoming a second pricing database.

## 1. Canonical owners

### Numeric fare facts

```text
site/luksuzni-prevoz/src/data/pricing.ts
```

Numeric amounts MUST be read from this module.

### Service eligibility and pricing behavior

```text
site/luksuzni-prevoz/src/data/services.ts
```

The page MUST use this module for:

```text
pricingMode
Private Chauffeur minimum hours
Private Chauffeur half-day hours / included km
Private Chauffeur full-day hours / included km
hub child-service relationships
quote vs estimate behavior
```

### Fleet identity

```text
site/luksuzni-prevoz/src/data/fleet.ts
```

Vehicle names and IDs MUST come from fleet data.

Numeric ledgers contain all and only vehicles whose canonical
`pricingStatus === "published"`, in fleet declaration order. Quote-only
vehicles have no numeric fallback. The current fleet contains eight vehicles;
seven are published-pricing and Škoda Kodiaq is quote-only.

### Route labels / destination URLs

```text
src/data/routes.ts
src/data/navigation-labels.json
getPath()
Link
```

No manual localized URL construction is allowed.

## 2. Public Pricing V1 matrix

| Public section | Canonical numeric field | Eligibility |
|---|---|---|
| Airport Transportation | `pricing[vehicleId].airportTransfer` | supported |
| Private Chauffeur — hourly | `pricing[vehicleId].hourly` | supported by `privateChauffeur.bookingOptions.hourly` |
| Private Chauffeur — half-day | `pricing[vehicleId].halfDay` | supported by `privateChauffeur.bookingOptions.halfDay` |
| Private Chauffeur — full-day | `pricing[vehicleId].fullDay` | supported by `privateChauffeur.bookingOptions.fullDay` |
| Business hub | no direct numeric public price | show pricing behavior only |
| Corporate | no direct numeric public price | show estimate/quote behavior only |
| Delegation | no direct numeric public price | quote only |
| Conference & Congress | no direct numeric public price | quote only |
| Special Events hub | no verified numeric `from` amount | do not render a numeric `from` value |
| Wedding | no direct numeric public price | quote only |
| Prom | no direct numeric public price | quote only |
| VIP | no direct numeric public price | quote only |

## 3. Explicitly excluded data

The implementation MUST NOT render:

```text
pricing[vehicleId].perKm
```

Reason:

`perKm` exists in pricing data, but the current public service catalogue does not expose a standalone per-kilometre booking format. Private Chauffeur booking options are hourly, half-day and full-day. Pricing V1 follows catalogue eligibility, not raw column availability.

The implementation MUST NOT render:

```text
src/docs/pricing.csv → PUTEVI IZ BEOGRADA
```

Reason:

City-to-city service is outside the supported Luxury Transportation service catalogue.

The implementation MUST NOT parse `pricing.csv` at runtime.

## 4. Currency invariant

Current canonical state:

```text
airportTransfer.currency = "EUR"
VehiclePricing.currency   = "EUR"
```

Hourly, half-day and full-day rows use `VehiclePricing.currency`. Airport rows
use `airportTransfer.currency`. Both are typed canonical data and are already
present for every numeric record.

The coding agent MUST NOT:

```text
hardcode "€" in Pricing components
store currency in UI JSON
store currency in Markdown
derive currency from browser locale
```

## 5. Display adapter rules

For each visible fare row:

```text
vehicle display name → fleet.ts
amount               → pricing.ts
currency             → pricing.ts
hire limits          → services.ts
localized labels     → content/ui
URL                   → route helpers
```

Price formatting MUST use locale-aware number/currency formatting.

No component owns a numeric fallback.

## 6. Special Events `from` mode

`services.ts` currently marks the Special Events hub:

```text
pricingMode: ["from", "quote"]
```

No verified numeric `from` amount exists in canonical pricing data.

Pricing V1 MUST render the service as quote-driven and MUST NOT display:

```text
From €X
starting at X
packages from X
```

until a canonical numeric source is added.

## 7. Formula prohibition

Pricing V1 MUST NOT calculate:

```text
extra kilometres
extra hours
waiting surcharges
night surcharges
return-trip multipliers
multi-vehicle discounts
corporate discounts
event packages
```

No such formula is currently defined by canonical data.

## 8. Data failure behavior

If a required public fare is missing:

```text
development/build → fail loud
production render → do not substitute fabricated fallback
```

If a published-pricing vehicle or required currency is missing:

```text
development/build fails loud
publication is blocked
```
