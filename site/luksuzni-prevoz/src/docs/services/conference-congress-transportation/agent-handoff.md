# Conference / Congress Transportation — Agent Handoff

Status: **READY FOR CODEX IMPLEMENTATION**

Implement `conferenceCongressTransportation` from this directory as a strict locked-page task.

## Start here

Read, in order:

```text
/AGENTS.md
/DESIGN.md
src/docs/services/conference-congress-transportation/MANIFEST.md
src/docs/services/conference-congress-transportation/blueprint.md
src/docs/services/conference-congress-transportation/wireframe.html
src/docs/services/conference-congress-transportation/implementation.md
src/docs/services/conference-congress-transportation/acceptance.md
src/docs/services/conference-congress-transportation/content-contract.md
src/docs/services/conference-congress-transportation/asset-contract.md
current shared service documentation
matching .skills required by AGENTS.md
```

Then inspect the current production implementations of:

```text
CorporateTransportationPage.astro
DelegationTransportationPage.astro
DelegationMovementSequence.astro
ServiceHero.astro
ServiceOverview.astro
VehicleRecommendations.astro
ServiceStandards.astro
FAQ.astro
FinalCTA.astro
ContentPageRenderer.astro
```

## First implementation output

Create:

```text
src/docs/services/conference-congress-transportation/compliance-matrix.md
```

Map every blueprint requirement to its source data, production component and acceptance check. Do this before production edits.

## Production work

Execute in this order:

```text
1. Replace the three Conference scaffold content entries with the supplied reviewed content pack.
2. Merge the three UI-addition payloads into existing locale dictionaries without deleting existing keys.
3. Run content digest synchronization and use generated digests.
4. Extract DelegationMovementSequence into shared BusinessMovementSequence; migrate Delegation with no visible/behavioral regression.
5. Build ConferenceCongressTransportationPage.
6. Build ConferencePassengerMovement.
7. Build ConferenceMultiVehicleSchedule.
8. Add the Conference mapping to the existing ContentPageRenderer.
9. Add targeted tests and run repository validators.
10. Perform responsive and cross-page visual review.
11. Keep the route non-public until every acceptance item passes.
12. Publish route availability only as the final release action.
```

## Non-negotiable facts

Conference canonical service support is limited to:

```text
airport arrivals
hotel transfers
venue shuttles
multi-vehicle schedules
individual executive transfers
group transport
quote-only pricing
```

Do not add airport departure/return language. The journey ends with `Final transfer` until canonical service data explicitly changes.

Do not borrow Corporate recurring/invoicing semantics or Delegation dedicated-coordinator/security semantics.

## Required implementation report

Return:

```text
A. Files changed
B. Shared extraction performed
C. Canonical assertions added
D. Content/UI integration
E. Asset integration
F. Responsive review results
G. Accessibility/SEO results
H. Tests/validators/build results
I. Cross-page regression results for Delegation
J. Remaining blockers
K. Publication state
```

Stop and report any source-of-truth conflict instead of inventing a fallback.
