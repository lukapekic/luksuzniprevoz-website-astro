# Conference / Congress Transportation

Status: **IMPLEMENTATION-READY PAGE PACKAGE**

Route key: `conferenceCongressTransportation`  
Parent: `businessTransportation`

## Purpose

This directory defines the final implementation contract for the Conference / Congress Transportation service page. It converts the current scaffold into a dedicated Business-family service page while preserving the Black & Platinum design system, canonical business data, localization rules and existing shared service architecture.

## Mandatory authority order

Read in this order before production edits:

```text
1. repository root AGENTS.md
2. DESIGN.md
3. this blueprint.md
4. this wireframe.html
5. this implementation.md
6. this acceptance.md
7. this content-contract.md
8. this asset-contract.md
9. current shared service docs and APIs
10. matching .skills procedures required by AGENTS.md
```

The blueprint owns page-specific structure. `DESIGN.md` and the configured active theme token source own visual language. The wireframe owns structure only.

## Product boundary

Conference / Congress Transportation is quote-only chauffeur-driven event transportation organised around a confirmed event schedule. Canonical capabilities are:

```text
airportArrivals = true
hotelTransfers = true
venueShuttles = true
multiVehicleSchedules = true
individualExecutiveTransfers = true
groupTransport = true
pricingMode = quote
```

The page is not:

```text
Corporate Transportation
Delegation Transportation
a security/protection service
a live dispatch product
a public pricing page
a promise of unlimited vehicle availability
a promise of airport departure/return transport
```

## Implementation package

- `blueprint.md` — locked structure, content responsibility, components, responsive topology.
- `implementation.md` — strict implementation sequence and data assertions.
- `acceptance.md` — pass/fail release criteria.
- `wireframe.html` — structural visual reference only.
- `content-contract.md` — localization/editorial boundaries and required content shape.
- `asset-contract.md` — exact approved images and image roles.
- `agent-handoff.md` — execution entrypoint for the coding agent.
- `remediation-plan.md` — ordered audit findings, corrections and verification sequence.
- `src/content/pages/conference-congress-transportation/` — installed reviewed SR/EN/RU page content.
- `ui-additions/` — retained audit fragments already merged into canonical UI dictionaries.

## Publication posture

Keep page content `status: in-review` and `noindex: true` during implementation. Keep the route scaffold-gated until acceptance is complete. Publication is the final explicit release step.
