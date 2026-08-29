# Delegation Transportation v1 — Agent Packet

Status: **IMPLEMENTATION-READY / STRICT**

Route key: `delegationTransportation`
Parent hub: `businessTransportation`
Target page type: `service`

This packet is the page-specific authority for the Delegation Transportation implementation.

## Required packet files

```text
README.md
blueprint.md
implementation.md
acceptance.md
content-contract.md
asset-contract.md
wireframe.html
agent-handoff.md
compliance-matrix.md

content/
  delegation-transportation.sr.md
  delegation-transportation.en.md
  delegation-transportation.ru.md

ui-additions/
  sr.json
  en.json
  ru.json
```

## Mandatory repository authority

The coding agent MUST read, in this order:

```text
AGENTS.md
DESIGN.md
current foundation/theme context
current shared service contracts
this README
blueprint.md
implementation.md
acceptance.md
content-contract.md
asset-contract.md
wireframe.html
agent-handoff.md
```

The agent MUST run current repository design-context tooling before production UI edits.

## Page promise

Delegation Transportation is a quote-only service for coordinated transport of delegations and executive/institutional groups where the confirmed request can require:

```text
multiple vehicles
mixed vehicle classes
dedicated transport coordination
one joined transport programme
professional discretion
```

Canonical service boundaries remain:

```text
pricingMode = quote only
securityService = false
```

The page MUST NOT imply:

```text
close protection
security escort
police escort
motorcade services
armed security
political affiliation
government endorsement
automatic NDA acceptance
instant booking confirmation
fixed Delegation pricing
```

## Locked page identity

Corporate Transportation owns continuity across one company's working day.

Delegation Transportation owns:

> **Several passenger groups and vehicle roles coordinated as one delegation programme, delivered with professional discretion.**

## Lifecycle

During implementation:

```text
route availability = scaffold
content status = in-review
content noindex = true
all locales remain staged together
```

Publication occurs only after every blocking acceptance item passes.

No locale publishes independently.
