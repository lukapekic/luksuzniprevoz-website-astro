# Shared Contract — VehicleRecommendations

Status: **Shared structural contract**

## Purpose

Show a small, service-relevant fleet subset without duplicating the Homepage fleet showcase or full Fleet page.

## Default behavior

- open dark section;
- section heading + short contextual copy;
- approximately three recommendations when verified content supplies them;
- each item: vehicle image, canonical display name, vehicle class/verified facts where appropriate, short localized suitability copy;
- section CTA: View Full Fleet.

## Airport full-image carousel variant

Airport Transportation reuses the Homepage `HorizontalCarousel` mechanics and
the full-image/scrim/overlaid-copy visual language of Homepage service cards.
It remains a vehicle recommendation component, not a route-card component.

Vehicle-specific Airport fares come only from shared pricing data. Missing
owner-supplied values render the approved pending state; they are never inferred
from other pricing units.

Where several priced configurations belong to one fleet model family, the
showcase uses the canonical family display name from `fleet-media.ts`; capacity
variants remain available to pricing rather than appearing in the card title.

## Data rules

- vehicle identity/capacity comes only from `fleet.ts`;
- service-page content references vehicle IDs;
- never duplicate pricing in this component;
- missing imagery uses a neutral placeholder rather than redesigning the section.

## Responsive

Desktop may use a three-item row. Tablet and mobile adapt without forcing equal-height dashboard cards.
