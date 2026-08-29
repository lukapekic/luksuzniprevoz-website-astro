# Luxury Transportation — Business Transportation Blueprint v2

Status: **Locked structural blueprint — synchronized reference from repository**  
Route key: `businessTransportation`  
Page kind: hub  
Theme binding: **semantic; uses the active theme selected by repository configuration**

> This copy is included for handoff convenience. The repository's current
> `src/docs/services/business-transportation/blueprint.md` remains authoritative
> if it differs from this exported packet.

## Shared contracts

Apply all files under `../shared/`.

## 1. Goal

Present Business Transportation as a coordinated professional transport capability for one-off corporate work, recurring arrangements, delegations, conferences/congresses, and multi-vehicle operations without turning the page into a generic corporate/SaaS layout.

## 2. Hub data

Use `services.ts` as authority.

Current hub children:

```text
corporateTransportation
delegationTransportation
conferenceCongressTransportation
```

Current hub pricing behavior supports estimated-when-simple and quote modes as defined in data. Outside normal coverage routes to quote.

Child-service capability facts remain owned by their corresponding service entries.

## 3. Conversion

Primary: business transport booking/inquiry path.  
Secondary: Request a Quote for complex/recurring/multi-vehicle work.

No promise of instant confirmation.

## 4. Page order

1. `SiteHeader`
2. `ServiceHero` — `contained`
3. `ServiceOverview`
4. `BusinessServiceSelector`
5. One-off vs Recurring Arrangements
6. Coordination / Multi-Vehicle Capability
7. Trusted Clients
8. `VehicleRecommendations`
9. `ServiceStandards`
10. `FAQ`
11. `FinalCTA`
12. `SiteFooter`

## 5. Hero

Shared `ServiceHero / contained`.

Image direction: contextual executive/corporate transport, not generic office stock photography.

Content:

- one H1
- concise business proposition
- primary action
- secondary quote action

No client-logo strip, pricing grid, or form inside Hero.

## 6. Service Overview

Use shared `ServiceOverview`.

Purpose: explain the difference between ordinary point-to-point transport and coordinated business transport capability.

Facts remain divider-led and operational rather than marketing badges.

## 7. BusinessServiceSelector

Page-specific composition built from the approved image-led `ServiceCard` identity.

Show canonical children:

- Corporate Transportation
- Delegation Transportation
- Conference & Congress Transportation

Rules:

- contextual image-led discovery
- title + concise description + explicit CTA
- do not make entire card an ambiguous click target
- route destinations use route helpers
- child list is data-driven, not hardcoded in the component

## 8. One-off vs Recurring Arrangements

Page-specific functional/light section.

Desktop: two clear commercial paths separated by structure/divider rather than floating pricing cards.

### One-off

Explain one-off business transport based on verified Corporate Transportation capability.

### Recurring

Explain recurring contracts, invoicing, negotiated pricing, and dedicated chauffeur behavior only where current service data confirms them.

CTA behavior can differ by path but must preserve global CTA hierarchy.

## 9. Coordination / Multi-Vehicle Capability

Page-specific open split with contextual business/delegation transport media.

Purpose: communicate scheduling, multiple vehicles, mixed vehicle classes, group movement, and coordinator capability only where supported by child-service data.

Do not imply security services; `delegationTransportation.securityService` is false.

## 10. Trusted Clients

Business-only confidence section.

Data source: `clients.ts` and its display policy.

Rules:

- render only when route policy allows it
- logo count is data-driven
- never lock exact client count
- public logo display must respect asset status and usage-permission policy
- missing/unapproved logos do not authorize fake marks or invented client claims
- layout adapts to approved/available count

## 11. Vehicle Recommendations

Use shared `VehicleRecommendations` with business-relevant vehicle IDs supplied by content.

## 12. Service Standards

Use shared `ServiceStandards` with `operations.ts` and verified business/child-service capabilities.

## 13. FAQ

Use shared `FAQ`.

Topic families:

- one-off vs recurring
- invoicing/contracts
- multiple vehicles / mixed classes
- delegation/conference coordination
- coverage / custom routes
- booking confirmation
- vehicle planning

## 14. Final CTA

Use verified shared `FinalCTA` with business-specific content only.

Do not create a separate visual variant.

## 15. Internal links

Use route helpers.

The hub must link to its children and may contextually link to:

- Airport Transportation
- Private Chauffeur
- Fleet
- Contact/booking destinations

## 16. Responsive acceptance

Particular checks:

- child-service selector remains image-led
- one-off/recurring comparison remains clear on tablet portrait
- coordination content/media order remains intentional
- trusted-client layout handles variable approved counts
- no accidental horizontal overflow

## 17. Implementation guardrails

- dedicated hub renderer
- child services data-driven
- client display permission/asset gated
- no fixed client count
- no security claims
- no page-local theme/breakpoint definitions
- no hardcoded routes, fleet facts, pricing, or contact data
- do not copy wireframe CSS into production
