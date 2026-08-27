# Luxury Transportation — Private Chauffeur Blueprint v2

Status: **Locked structural blueprint**  
Route key: `privateChauffeur`  
Theme binding: **semantic; uses the active theme selected by repository configuration**

> This blueprint defines page structure, component identity, responsive behavior, conversion logic, and data ownership. It does not define raw colors, fonts, spacing values, radii, shadows, breakpoints, or pricing facts.

## Shared contracts

Read and apply:

```text
../shared/00-system-rules.md
../shared/01-token-contract.md
../shared/02-service-hero.md
../shared/03-service-overview.md
../shared/04-vehicle-recommendations.md
../shared/05-service-standards.md
../shared/06-responsive-rules.md
../shared/07-wireframe-rules.md
```

## 1. Goal

Explain flexible chauffeur hire clearly, distinguish Hourly / Half Day / Full Day use, establish chauffeur availability as the flagship behavior, and convert the visitor to booking or quote without making the page look like a pricing dashboard.

## 2. Conversion

Primary: booking flow for Private Chauffeur.  
Secondary: Request a Quote for complex/multi-day/international requests.

Every request remains pending manual availability/resource confirmation.

## 3. Authoritative service facts

Use `services.ts` for the current capability contract:

- hourly hire with repository-defined minimum;
- half-day block with repository-defined hours/km;
- full-day block with repository-defined hours/km;
- chauffeur remains available;
- multi-day → quote;
- international → quote;
- related routes include Airport, Business, and VIP where defined.

Use `pricing.ts` only for pricing facts it actually represents. Do not display a currency unless the authoritative source provides a verified display currency.

## 4. Page order

1. `SiteHeader`
2. `ServiceHero` — `responsive-split`
3. `ServiceOverview`
4. `PrivateChauffeurOptions`
5. Availability & Flexibility split
6. `VehicleRecommendations`
7. `ServiceStandards`
8. `FAQ`
9. `FinalCTA`
10. `SiteFooter`

Order is locked unless this blueprint is explicitly revised.

## 5. Hero

Shared contract: `ServiceHero / responsive-split`.

Desktop:

```text
content 5 | contextual chauffeur/vehicle media 7
```

Tablet/mobile transform into one contained image-backed Hero.

Content:

- one H1;
- concise proposition;
- primary booking CTA;
- secondary quote CTA;
- optional quiet contextual line.

No pricing, booking form, fleet specs, ratings, or trust-chip row.

## 6. Service Overview

Shared `ServiceOverview`.

Purpose: answer what Private Chauffeur means and what standard service behavior includes.

Prefer divider-led facts such as chauffeur availability, professional chauffeur standards, flexible use, and service-related inclusions supported by verified data/content.

## 7. PrivateChauffeurOptions

Page-specific composition.

Purpose: distinguish Hourly / Half Day / Full Day without three floating pricing cards.

Surface role: functional/light contained section.

Desktop:

```text
section heading + short explanation
↓
Hourly | Half Day | Full Day
↓
shared booking action
```

Rules:

- all options live inside one parent functional surface;
- internal separation uses spacing/dividers;
- numerical hours/km come from `services.ts`;
- numerical fares come only from `pricing.ts` when safe to display;
- currency is never inferred;
- complex cases route to quote;
- mobile stacks options in reading order.

## 8. Availability & Flexibility

Page-specific open split.

Desktop:

```text
contextual media 7 | copy/facts 5
```

Purpose: explain that the chauffeur can remain available and that complex/multi-day/international use is handled as a custom request.

Use verified service/contact policy. Do not imply unrestricted last-minute or 24/7 booking availability.

Tablet/mobile: copy first, media second unless content review proves another accessible order.

## 9. Vehicle Recommendations

Use shared `VehicleRecommendations`.

Service content supplies relevant `vehicleId` references; fleet facts remain owned by `fleet.ts`.

Do not reuse Homepage `FleetShowcase` visual identity.

## 10. Service Standards

Use shared `ServiceStandards` with facts from `operations.ts` and applicable service capabilities.

## 11. FAQ

Use verified shared `FAQ` component.

Reading-focused; localized content owns questions/answers. Structured data must match visible FAQ content.

Likely topic families:

- minimum hire / package differences;
- included distance where applicable;
- chauffeur remaining available;
- multi-day/international requests;
- booking confirmation;
- vehicle selection.

## 12. Final CTA

Use verified shared `FinalCTA` without page-local visual redesign.

Content intent: convert a visitor who now understands the hire model. Primary booking action; secondary quote path where supported by the component contract; verified contact channels may appear only through canonical contact gating.

## 13. Internal links

Use route helpers only. Required relationships should include, when content calls for them:

- Airport Transportation;
- Business Transportation;
- VIP Transportation;
- Fleet;
- Pricing / booking routes where configured.

No manually concatenated localized URLs.

## 14. Responsive acceptance

Apply shared responsive contract. Particular checks:

- desktop split Hero transforms cleanly to image-backed Hero;
- option comparison remains readable on tablet portrait;
- no equal-height card forcing on mobile;
- media crop preserves chauffeur/vehicle focal point;
- CTA targets and visible focus remain compliant.

## 15. Implementation guardrails

- dedicated final renderer; do not leave this page as generic prose-only `LeafPage` output;
- reuse global chrome and shared service compositions;
- no page-local palette/type/radius/breakpoint definitions;
- no hardcoded business facts;
- do not copy wireframe helper CSS into production;
- keep localized content separate from structural/business data.
