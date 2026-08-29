# Conference / Congress Transportation — Implementation Packet Manifest

Status: **LOCKED FOR IMPLEMENTATION**

Route key: `conferenceCongressTransportation`  
Parent hub: `businessTransportation`  
Target page type: `service`  
Planning branch: `feature/conference-congress-page-plan`

This packet is the page-specific implementation authority beneath root `AGENTS.md` and `DESIGN.md`.

## Files in this packet

```text
MANIFEST.md
README.md
blueprint.md
implementation.md
acceptance.md
wireframe.html
content-contract.md
asset-contract.md
agent-handoff.md
remediation-plan.md
ui-additions/
  sr.json
  en.json
  ru.json
```

Installed canonical content:

```text
src/content/pages/conference-congress-transportation/
  conference-congress-transportation.sr.md
  conference-congress-transportation.en.md
  conference-congress-transportation.ru.md
```

The implementation agent MUST create `compliance-matrix.md` after reading the current repository state and before production edits. The matrix is implementation output, not planning input.

## Locked owner decisions

- Hero image: `src/assets/shared/other/s-class-hotel-entrance-night.webp`.
- The existing full-bleed `ServiceHero` dark image treatment remains in use.
- Conference pricing is quote-only.
- The page covers airport arrivals, hotel transfers, venue transportation, individual executive transfers, group transport and multi-vehicle schedules.
- Airport departure/return transportation is NOT asserted because the current Conference service contract has no departure/return capability flag.
- The journey therefore ends with **Final transfer**, not **Airport departure**.
- No security, protection, event transport desk, live tracking dashboard, dedicated Conference coordinator, guaranteed fleet quantity, multi-day-event promise or multi-hotel promise is introduced.

## Implementation order

```text
1. Read authorities and this packet.
2. Create compliance-matrix.md.
3. Verify installed localized content and merged UI additions.
4. Extract DelegationMovementSequence into shared BusinessMovementSequence without regression.
5. Build Conference page-local components and page renderer.
6. Add ContentPageRenderer mapping.
7. Validate all three locales and all required responsive states.
8. Run design and technical acceptance.
9. Publish the route only after acceptance passes.
```
