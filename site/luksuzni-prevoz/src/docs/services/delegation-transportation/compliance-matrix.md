# Delegation Transportation v1 — Repository Compliance Matrix

Status: **MUST BE COMPLETED BEFORE PRODUCTION UI EDITS**

| Requirement | Expected authority / primitive | Working-tree path / finding | Status |
|---|---|---|---|
| Root technical authority | `AGENTS.md` |  | ☐ |
| Design authority | `DESIGN.md` |  | ☐ |
| Theme | Theme V2 Black & Platinum |  | ☐ |
| Route | `delegationTransportation` |  | ☐ |
| Service facts | `services.ts` |  | ☐ |
| Operations | `operations.ts` |  | ☐ |
| Contact/manual confirmation | `contact.ts` |  | ☐ |
| Client identity/approval/placement | `clients.ts` |  | ☐ |
| Client media resolver | `client-media.ts` |  | ☐ |
| Fleet | `fleet.ts` |  | ☐ |
| Fleet media | `fleet-media.ts` |  | ☐ |
| Flow resolver | `flows.ts` + `cta.ts` |  | ☐ |
| SEO | `seo.ts` |  | ☐ |
| Dispatcher | `ContentPageRenderer.astro` |  | ☐ |
| Hero | `ServiceHero.astro` |  | ☐ |
| Overview | `ServiceOverview.astro` |  | ☐ |
| Split | `OpenSplitSection.astro` |  | ☐ |
| Vehicles | `VehicleRecommendations.astro` |  | ☐ |
| Standards | `ServiceStandards.astro` |  | ☐ |
| FAQ | `FAQ.astro` |  | ☐ |
| Final CTA | `FinalCTA.astro` |  | ☐ |
| Hero image | `shared/other/v-class-embassy-entrance.webp` |  | ☐ |
| Audience image | `shared/other/s-class-hotel-entrance-vertical.webp` |  | ☐ |
| Movement image | `shared/other/emplyoee-group-outside.webp` |  | ☐ |
| Mixed-fleet image | `shared/other/v-class-on-the-move-veertical.webp` |  | ☐ |
| Discretion image | `shared/other/s-class-interior-1.webp` |  | ☐ |
| FinalCTA image | `shared/other/s-class-hotel-entrance-night.webp` |  | ☐ |
| Chinese Embassy mark | `clients.ts` id `chinese-embassy` → `client-media.ts` → `clients/chinesee-embassy.png` |  | ☐ |
| OSCE mark | `clients.ts` id `osce-mission-to-serbia` → `client-media.ts` → `clients/osce.png` |  | ☐ |
| Serbian Swimming mark | `clients.ts` id `serbian-swimming-federation` → `client-media.ts` → `clients/serbian-swimming-association.png` |  | ☐ |

Shared-change declaration:

```text
[ ] No shared component change is required.
[ ] SHARED COMPONENT BLOCKER raised before changing shared code.
```

Expected page-local components:

```text
DelegationTransportationPage.astro
DelegationMovementSequence.astro
DelegationInstitutionalProof.astro
```

Any additional page-local component requires a written justification mapped to a locked blueprint requirement.
