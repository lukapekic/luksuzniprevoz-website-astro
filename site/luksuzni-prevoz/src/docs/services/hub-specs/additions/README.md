# Luxury Transportation — Repo-Grounded Hub Page Packet

Generated from a direct scan of `lukapekic/luksuzniprevoz-website-astro` on `master` (2026-08-27).

## Purpose

This packet is designed to be handed to a Codex/coding agent that already has access to the repository.

It does **not** create a parallel design system. It maps the hub work onto the repository's actual authority chain:

1. root `AGENTS.md`
2. locked page blueprint
3. `DESIGN.md`
4. active Theme V2 JSON
5. approved shared component contracts
6. semantic wireframe
7. task-specific `.skills`
8. verified production patterns

## Important discovery

The repository already contains a mature, **locked Business Transportation v2 page packet**:

```text
site/luksuzni-prevoz/src/docs/services/business-transportation/
  blueprint.md
  wireframe.html
  implementation.md
  implementation-ui-addendum.md
  acceptance.md
  business-transportation-content-pack/
```

The Business hub content is also already published/reviewed for the current content system.

Therefore, do **not** replace that package with a conflicting alternative merely because this packet exists.

The Business files in this bundle are:

- a synchronized reference blueprint,
- the current semantic wireframe,
- and a concise current-state implementation plan showing what remains to be wired in production.

The original Special Events draft from this packet has been superseded and removed. The locked production contract now lives under `src/docs/services/special-events/`; use that directory for all Special Events work.

## Key architecture decision

Do **not** create `HubHero`, `HubPage`, or a speculative generic hub system up front.

The repository already has the correct shared foundation:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
ServiceCard
OpenSplitSection
FAQ
FinalCTA
BaseLayout
Section
PageContainer
ReadingContainer
SectionHeading
Link
SiteHeader / SiteFooter through BaseLayout
```

Build hub-specific compositions locally first.

Only extract a new shared `HubServiceSelector` after both Business and Special Events are implemented and verified to share the same semantic contract. This follows `.skills/component-architecture.md`.

## Recommended execution order

1. Read `shared/repo-findings.md`.
2. Read `shared/hub-development-contract.md`.
3. Implement Business Transportation from its existing locked repo packet, using the delta plan here to understand current code state.
4. Review Business at all required responsive states.
5. Add/lock the Special Events packet in the repo.
6. Create approved SR/EN/RU Special Events content before publication.
7. Implement Special Events.
8. Compare both child-service selectors.
9. Extract a shared selector only if the two verified consumers genuinely match.
10. Run full design + technical review.

## Included files

```text
shared/
  repo-findings.md
  hub-development-contract.md

business-transportation/
  blueprint.md
  wireframe.html
  implementation-plan.md

codex-handoff.md
```
