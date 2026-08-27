# Codex Handoff — Business + Special Events Hubs

Use this prompt with the attached packet and the live repository.

---

You are implementing the next Luxury Transportation service hubs in `site/luksuzni-prevoz/`.

Read root `AGENTS.md` and `DESIGN.md` first. Treat the repository as authoritative.

I am providing a repo-grounded packet under:

```text
shared/
business-transportation/
special-events/
```

Important context:

1. Business Transportation already has a locked v2 blueprint, wireframe, full implementation contract, acceptance contract, and reviewed localized content **inside the repository**. Do not replace them with a conflicting design. Use the repository's current locked files as authority. The supplied `business-transportation/implementation-plan.md` is a current-state execution delta only.

2. `ContentPageRenderer.astro` currently has a dedicated renderer for Airport Transportation but Business still falls through to generic `LeafPage`. Implement the Business dedicated renderer according to the locked repo packet.

3. Special Events is currently a scaffold route/content family. The supplied Special Events blueprint/wireframe/implementation/acceptance packet is the proposed new page contract. Do not invent production SR/EN/RU copy. If approved localized hub content is still absent, implement via the safe dev/fixture path and keep production scaffold/noindex until content is approved.

4. Reuse existing shared components:
   `ServiceHero`, `ServiceOverview`, `ServiceCard`, `OpenSplitSection`,
   `VehicleRecommendations`, `ServiceStandards`, `FAQ`, `FinalCTA`,
   foundation layout primitives and existing route/SEO/CTA helpers.

5. Do not create speculative `HubPage`, `HubHero`, or parallel hub primitives.
   Keep Business and Special Events selectors page-local initially.
   After both pages are implemented and reviewed, compare the selectors and extract a shared `HubServiceSelector` only if their verified semantic/DOM/responsive contracts are truly identical.

6. Build the blueprint compliance matrix before editing.

7. Follow data ownership:
   - routes → `routes.ts`
   - service capabilities → `services.ts`
   - operational facts → appropriate data modules
   - localized editorial copy → content collection
   - UI labels → approved UI localization
   - tokens → active Theme V2 only

8. Never hardcode locale paths, pricing, fleet facts, client identities, contact facts, or raw theme values in page components.

9. Preserve manual booking confirmation semantics.

10. Run all required design, component, route, content, SEO, accessibility, test, and build gates. Never claim a gate passed unless it ran.

Implementation order:

### Phase 1 — Business
- audit current locked Business docs + content
- build compliance matrix
- create the page-local Business component folder defined by the existing implementation contract
- wire `businessTransportation` into `ContentPageRenderer`
- implement locked page order
- responsive/design review
- technical review + checks

### Phase 2 — Special Events
- add/lock supplied Special Events docs in the corresponding repo docs folder
- confirm content lifecycle
- if full localized content is approved, author/validate hub entries and publish route according to repo rules
- otherwise keep production scaffold and use safe dev preview for UI implementation
- create `SpecialEventsPage` + `SpecialEventServiceSelector`
- wire renderer only for real hub content
- implement locked page order
- responsive/design review
- technical review + checks

### Phase 3 — Shared-selector evaluation
- compare both selectors
- run `pnpm components:check`
- extract only if stable shared semantics are proven
- otherwise retain page-local selectors

At completion report:
- exact files changed
- new components and why they are justified
- shared components reused
- content/route lifecycle changes
- assets used/placeholders
- validation commands and actual results
- unresolved blockers
