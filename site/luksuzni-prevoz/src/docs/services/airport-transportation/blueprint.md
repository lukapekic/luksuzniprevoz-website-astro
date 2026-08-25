# Luxury Transportation — Airport Transportation Blueprint v2

Status: **Locked structural blueprint**  
Route key: `airportTransportation`  
Theme binding: **semantic; uses the active theme selected by repository configuration**

> This blueprint defines structure, responsive behavior, conversion states, and data ownership. Visual values are inherited from the active theme and shared component contracts.

## Shared contracts

Apply all files under `../shared/`, especially `ServiceHero`, `ServiceOverview`, `VehicleRecommendations`, `ServiceStandards`, responsive rules, and wireframe rules.

## 1. Goal

Make Belgrade airport transportation easy to understand and book, explain arrival handling clearly, support commercial and private aviation, and route non-standard requests to quote.

## 2. Scope

Use `services.ts` as authority. Current service supports the configured Belgrade airport, one-way and return service, point-to-point standard stops, flight tracking, meet & greet, luggage assistance, name sign, waiting allowance, commercial aviation, private aviation, and FBO coordination.

Do not broaden airport coverage or operational promises beyond verified data.

## 3. Conversion / pricing states

Primary: Book Airport Transfer.  
Secondary: Request a Quote.

The commercial interaction supports these semantic states:

```text
Fixed price
Estimated price
Quote required
```

But a state may render only when authoritative pricing data actually supports it.

### Current data gate

`pricing.ts` intentionally excludes Airport Transfer fares. Therefore the implementation must **not** invent, infer, duplicate, or hardcode fixed airport fares.

Until a validated Airport pricing source exists:

- keep the booking/route interaction architecture compatible with future fixed pricing;
- expose quote/booking behavior supported by current data;
- do not present a fabricated calculated fare.

Every request remains pending manual availability/resource confirmation.

## 4. Page order

1. `SiteHeader`
2. `ServiceHero` — `contained`
3. `ServiceOverview`
4. `AirportBookingBlock`
5. Arrival Handling & Flight Tracking split
6. Private Aviation / FBO feature
7. `VehicleRecommendations`
8. `ServiceStandards`
9. `FAQ`
10. `FinalCTA`
11. `SiteFooter`

## 5. Hero

Shared `ServiceHero / contained` at all responsive states.

- full-panel contextual airport/vehicle image;
- one H1;
- concise proposition;
- primary booking CTA;
- secondary quote CTA;
- no calculator/form inside Hero.

Content density stays low. Image crop and scrim are reviewed per responsive state.

## 6. Service Overview

Use shared `ServiceOverview`.

Purpose: answer what the standard airport transfer includes.

Fact families may include verified service capabilities such as point-to-point private ride, meet & greet, luggage assistance, flight tracking, waiting allowance, name sign, and return booking.

## 7. AirportBookingBlock

Page-specific functional composition.

Surface role: light/functional contained section.

Purpose: collect only the parameters required to identify the commercial path and continue into booking/quote.

Potential inputs depend on current booking architecture and validated data, typically:

- pickup;
- drop-off;
- one-way / return;
- date/time where needed;
- vehicle.

Do not embed the entire customer-details form here.

Result presentation must keep Fixed / Estimated / Quote visually and semantically distinct. Unsupported states remain unreachable rather than simulated.

## 8. Arrival Handling & Flight Tracking

Page-specific open split.

Desktop:

```text
contextual arrival media 7 | copy/facts 5
```

Purpose: explain arrival coordination, flight tracking, meeting process, luggage support, and verified waiting policy.

Use `services.ts` for service-specific facts and canonical content for public wording.

Tablet/mobile: copy first, media second.

## 9. Private Aviation / FBO

Page-specific contained feature.

Purpose: establish capability without creating a separate service page.

Content may cover only verified capabilities:

- private aviation support;
- FBO/handler coordination where procedure/access allows;
- custom coordination / quote path;
- relationship to VIP Transportation where appropriate.

Do not introduce security/bodyguard claims.

## 10. Vehicle Recommendations

Use shared `VehicleRecommendations`. Recommendations come from localized page content referencing `fleet.ts` vehicle IDs.

## 11. Service Standards

Use shared `ServiceStandards`, combining `operations.ts` with airport-specific verified capabilities where relevant.

## 12. FAQ

Use shared `FAQ`.

Likely topic families:

- flight delays / tracking;
- meeting point / name sign;
- waiting allowance;
- luggage;
- return booking;
- private aviation/FBO;
- confirmation status;
- quote cases.

Visible FAQ and structured data must stay aligned.

## 13. Final CTA

Use verified shared `FinalCTA`. No page-local gradient, radius, media, or footer-like variant.

## 14. Internal links

Use route helpers only. Contextual relationships may include:

- Private Chauffeur;
- VIP Transportation;
- Fleet;
- booking/contact destinations.

## 15. Responsive acceptance

Particular checks:

- contained Hero remains visually coherent at all states;
- functional block does not become dashboard-like;
- form controls meet accessibility target size;
- arrival media/copy order remains intentional;
- Private Aviation feature does not overpower the main airport service;
- no horizontal overflow.

## 16. Implementation guardrails

- dedicated final renderer rather than generic prose-only `LeafPage`;
- no hardcoded Airport fares;
- no page-local theme/breakpoint system;
- no duplicated fleet/contact/operational facts;
- no separate Private Aviation page from this blueprint;
- no wireframe CSS copied into production.
