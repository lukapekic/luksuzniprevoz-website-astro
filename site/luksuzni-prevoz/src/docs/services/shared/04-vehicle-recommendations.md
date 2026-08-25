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

## Data rules

- vehicle identity/capacity comes only from `fleet.ts`;
- service-page content references vehicle IDs;
- never duplicate pricing in this component;
- missing imagery uses a neutral placeholder rather than redesigning the section.

## Responsive

Desktop may use a three-item row. Tablet and mobile adapt without forcing equal-height dashboard cards.
