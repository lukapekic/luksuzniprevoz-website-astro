# Business Transportation — Localized UI Contract Addendum

Status: approved implementation input

No blueprint change is required. The hub identity, child-service order and page structure remain locked.

Merge these semantic keys into `src/content/ui/{sr,en,ru}.json` with locale parity:

## Hub / commercial path
- `business.coverage.primary`
- `business.coverage.outsideQuote`
- `business.commercial.oneOff`
- `business.commercial.recurring`
- `business.commercial.estimateRequest`
- `business.commercial.quoteRequest`

## Corporate capability labels
- `business.capability.recurringContracts`
- `business.capability.invoicing`
- `business.capability.negotiatedPricing`
- `business.capability.dedicatedChauffeurAcrossStops`

## Coordination labels
- `business.coordination.multipleVehicles`
- `business.coordination.mixedVehicleClasses`
- `business.coordination.dedicatedCoordinator`
- `business.coordination.airportArrivals`
- `business.coordination.hotelTransfers`
- `business.coordination.venueShuttles`
- `business.coordination.multiVehicleSchedules`
- `business.coordination.executiveTransfers`
- `business.coordination.groupTransport`

Rules:
- capability truth comes only from the relevant child entries in `services.ts`;
- do not render a label when its canonical boolean/capability is not active;
- the Business hub itself must not become the source of child-service capabilities;
- `delegationTransportation.securityService = false` remains a hard absence: no security/protection wording;
- no numeric price, estimator result or inferred currency is authorized;
- ServiceStandards continues to use the shared `operations.*` localization contract already established for Airport.
