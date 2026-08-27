# Business and Special Events Hubs — Implementation Plan

Status: **Approved execution plan**  
Scope: `businessTransportation` and `specialEvents`

This plan applies root `AGENTS.md`, `DESIGN.md`, the locked Business packet,
the approved Special Events packet, the active theme, and the reviewed shared
component contracts. Placeholder content and media are allowed during the
implementation phase, but must remain visibly tracked and must not be reported
as approved production content.

## Phase 1 — Governance and compliance preflight

- Resolve the exact authority chain for both pages.
- Run design context for every production target before editing.
- Record the blueprint compliance matrix for both hubs.
- Inspect current shared-component consumers before changing public APIs.
- Preserve the current Airport page while neutralizing shared service APIs.

## Phase 2 — Shared service foundation

- Make `ServiceOverview` genuinely reusable:
  - preserve the Airport `grouped-icons` contract;
  - implement a content-agnostic `divider-facts` contract;
  - keep operational facts and localized labels caller-owned.
- Make `VehicleRecommendations` genuinely reusable:
  - remove Airport-only assumptions from the presentation API;
  - accept a neutral recommendation view model;
  - keep optional page-supplied metadata for Airport fares;
  - preserve neutral missing-image behavior.
- Add `HubServiceSelector`:
  - exactly three canonical child services;
  - shared `ServiceCard` identity;
  - stack at mobile and tablet portrait;
  - approved 4/4/4 composition at tablet landscape/desktop;
  - no carousel and no page-category styling variant.
- Add a shared hub integrity helper for canonical child matching, duplicate and
  missing-child detection, and canonical ordering.
- Add `/dev/ui` previews for the reusable service overview, selector, vehicle
  recommendations, and standards states changed or introduced here.
- Run component impact checks before and after shared API changes.

## Phase 3 — Business Transportation

Implement the locked order:

1. contained `ServiceHero`;
2. shared `ServiceOverview`;
3. shared `HubServiceSelector`;
4. page-local one-off versus recurring commercial paths;
5. page-local coordination/multi-vehicle composition using `OpenSplitSection`;
6. client evidence, rendered only when public-use and asset policy allow it;
7. shared neutral `VehicleRecommendations`;
8. shared `ServiceStandards`;
9. shared `FAQ`;
10. shared `FinalCTA`.

Create a dedicated Business renderer and dispatch it from the existing
`ContentPageRenderer`.

Business URLs:

```text
sr  /poslovni-prevoz/
en  /en/business-transportation/
ru  /ru/biznes-transfer/
```

## Phase 4 — Special Events

Implement the approved order:

1. contained category-neutral `ServiceHero`;
2. shared `ServiceOverview`;
3. shared `HubServiceSelector`;
4. page-local event coordination/timing composition using `OpenSplitSection`;
5. page-local Other Special Occasions composition;
6. shared neutral `VehicleRecommendations`;
7. shared `ServiceStandards`;
8. shared `FAQ`;
9. shared `FinalCTA`.

Use typed placeholder content for every missing locale field. Placeholder
entries remain draft/noindex and are never described as reviewed translations.
Create a dedicated Special Events renderer that accepts only real `hub`
content; scaffold content continues through the scaffold renderer until the
placeholder content is intentionally promoted to the typed hub preview path.

Special Events URLs:

```text
sr  /prevoz-za-specijalne-dogadjaje/
en  /en/special-events/
ru  /ru/transport-dlya-osobykh-meropriyatiy/
```

## Phase 5 — Routing and navigation integration

- Preserve all URL construction in `routes.ts` and routing helpers.
- Verify all six hub URLs use trailing slashes.
- Verify the Services menu exposes both hub routes and their canonical
  children in SR, EN, and RU.
- Verify the mobile menu, desktop flyouts, footer service navigation, language
  switching, canonical URLs, hreflang, and internal child links.
- Keep Special Events out of the sitemap/indexable set while its content is
  placeholder or incomplete.

## Phase 6 — Localization and content audit

- Validate SR/EN/RU hub content parity.
- Add missing shared UI keys through `content/ui`, never component literals.
- Check long Serbian Latin, English, and Russian Cyrillic wrapping.
- Produce a final inventory of:
  - placeholder editorial copy;
  - missing or unreviewed translations;
  - missing hero/selector/coordination images;
  - missing client logos or permissions;
  - unverified fleet, pricing, contact, or operational inputs;
  - any deliberately omitted section.

## Phase 7 — Verification and completion

- Run component impact checks.
- Run the `page` UI verification profile for both page assemblers.
- Run route, content, SEO, schema, TypeScript, lint, unit, accessibility, and
  site build checks.
- Review mobile, tablet portrait, tablet landscape, desktop, and wide desktop.
- Verify keyboard order, focus visibility, 44×44 targets, reduced motion,
  optimized image geometry, and zero accidental horizontal overflow.
- Fix all P0/P1 findings before completion.

## Compliance matrix — Business

| Requirement | Authority/data | Component | Responsive contract | Verification |
| --- | --- | --- | --- | --- |
| Contained hero and one H1 | Business blueprint + localized content | `ServiceHero` | Contained at all five states; actions stack when required | Heading/font/CTA/crop review |
| Canonical three children | `services.ts`, `routes.ts`, `childServices` content | `HubServiceSelector` | Stack, then approved 4/4/4 | Route and duplicate/missing-child assertions |
| One-off/recurring | Corporate capabilities + keyed editorial section | `BusinessCommercialPaths` | Two divided paths; stacked with horizontal divider on narrow states | Capability and CTA audit |
| Coordination | Delegation/conference capabilities + content | `OpenSplitSection` composition | Copy-first DOM; approved desktop split | Security-claim and order audit |
| Clients | `clients.ts` policy/assets | Page-local evidence region | Variable eligible count; no overflow | Omission/permission audit |
| Vehicles | Content IDs + fleet data | `VehicleRecommendations` | Shared responsive contract | No Business fare/spec duplication |
| Standards | `operations.ts` + verified service data | `ServiceStandards` | Shared responsive contract | Fact-source audit |
| FAQ/schema | Localized content | `FAQ` + approved SEO builder | Reading measure at all states | Visible/schema equality |
| Final conversion | Localized content + CTA/contact helpers | `FinalCTA` | Existing shared contract | CTA role/contact gating |

## Compliance matrix — Special Events

| Requirement | Authority/data | Component | Responsive contract | Verification |
| --- | --- | --- | --- | --- |
| Category-neutral contained hero | Special Events blueprint + localized/placeholder content | `ServiceHero` | Contained at all five states | Heading/font/CTA/crop review |
| Canonical Wedding/Prom/VIP children | `services.ts`, `routes.ts`, `childServices` content | `HubServiceSelector` | Stack, then approved 4/4/4 | Route and duplicate/missing-child assertions |
| Principal/guests/timing | Verified child capabilities + keyed content | `OpenSplitSection` composition | Copy-first DOM; approved desktop split | Waiting/return/security wording audit |
| Other occasions | Hub `generalUseCases` + localized UI labels | Page-local divided list | Single readable list, then restrained multi-column list | Enum/UI-key parity |
| Vehicles | Content IDs + fleet data | `VehicleRecommendations` | Shared responsive contract | No invented event price/spec |
| Standards | `operations.ts` + verified child data | `ServiceStandards` | Shared responsive contract | Fact-source audit |
| FAQ/schema | Localized/placeholder content | `FAQ` + approved SEO builder | Reading measure at all states | Visible/schema equality |
| Final conversion | Localized/placeholder content + CTA/contact helpers | `FinalCTA` | Existing shared contract | CTA role/manual-confirmation wording |

