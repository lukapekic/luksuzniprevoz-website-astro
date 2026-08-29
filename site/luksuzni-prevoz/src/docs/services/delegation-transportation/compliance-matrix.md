# Delegation Transportation v1 — Repository Compliance Matrix

Status: **COMPLETED — 2026-08-29**

| Requirement | Expected authority / primitive | Working-tree path / finding | Status |
|---|---|---|---|
| Root technical authority | `AGENTS.md` | `AGENTS.md` | ✅ |
| Design authority | `DESIGN.md` | `DESIGN.md` | ✅ |
| Theme | Theme V2 Black & Platinum | `src/theme/versions/version-2/` selected by `foundation.config.ts` | ✅ |
| Route | `delegationTransportation` | `src/data/routes.ts` — published for sr/en/ru | ✅ |
| Service facts | `services.ts` | `src/data/services.ts` | ✅ |
| Operations | `operations.ts` | `src/data/operations.ts` | ✅ |
| Contact/manual confirmation | `contact.ts` | `src/data/contact.ts` | ✅ |
| Client identity/approval/placement | `clients.ts` | `src/data/clients.ts` — exact three approved delegation clients | ✅ |
| Client media resolver | `client-media.ts` | `src/data/client-media.ts` | ✅ |
| Fleet | `fleet.ts` | `src/data/fleet.ts` | ✅ |
| Fleet media | `fleet-media.ts` | `src/data/fleet-media.ts` | ✅ |
| Flow resolver | `flows.ts` + `cta.ts` | `src/data/flows.ts`, `src/utils/cta.ts` | ✅ |
| SEO | `seo.ts` | `src/utils/seo.ts` | ✅ |
| Dispatcher | `ContentPageRenderer.astro` | `src/components/site/ContentPageRenderer.astro` | ✅ |
| Hero | `ServiceHero.astro` | `src/components/services/ServiceHero.astro` | ✅ |
| Overview | `ServiceOverview.astro` | `src/components/services/ServiceOverview.astro` | ✅ |
| Split | `OpenSplitSection.astro` | `src/components/services/OpenSplitSection.astro` | ✅ |
| Vehicles | `VehicleRecommendations.astro` | `src/components/services/VehicleRecommendations.astro` | ✅ |
| Standards | `ServiceStandards.astro` | `src/components/services/ServiceStandards.astro` | ✅ |
| FAQ | `FAQ.astro` | `src/components/site/FAQ.astro` | ✅ |
| Final CTA | `FinalCTA.astro` | `src/components/site/FinalCTA.astro` | ✅ |
| Hero image | `shared/other/v-class-embassy-entrance.webp` | asset resolved and rendered by `DelegationTransportationPage.astro` | ✅ |
| Audience image | `shared/other/s-class-hotel-entrance-vertical.webp` | asset resolved and rendered by `DelegationTransportationPage.astro` | ✅ |
| Movement image | `shared/other/emplyoee-group-outside.webp` | asset resolved and rendered by `DelegationMovementSequence.astro` | ✅ |
| Mixed-fleet image | `shared/other/v-class-on-the-move-veertical.webp` | asset resolved and rendered by `DelegationTransportationPage.astro` | ✅ |
| Discretion image | `shared/other/s-class-interior-1.webp` | asset resolved and rendered by `DelegationTransportationPage.astro` | ✅ |
| FinalCTA image | `shared/other/s-class-hotel-entrance-night.webp` | asset resolved and rendered by `DelegationTransportationPage.astro` | ✅ |
| Chinese Embassy mark | `clients.ts` id `chinese-embassy` → `client-media.ts` → `clients/chinesee-embassy.png` | approved record and exact logo resolver verified | ✅ |
| OSCE mark | `clients.ts` id `osce-mission-to-serbia` → `client-media.ts` → `clients/osce.png` | approved record and exact logo resolver verified | ✅ |
| Serbian Swimming mark | `clients.ts` id `serbian-swimming-federation` → `client-media.ts` → `clients/serbian-swimming-association.png` | approved record and exact logo resolver verified | ✅ |

Shared-change declaration:

```text
[x] No shared component change is required.
[ ] SHARED COMPONENT BLOCKER raised before changing shared code.
```

Expected page-local components:

```text
DelegationTransportationPage.astro
DelegationMovementSequence.astro
DelegationInstitutionalProof.astro
```

Any additional page-local component requires a written justification mapped to a locked blueprint requirement.
