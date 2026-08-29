# Conference / Congress Transportation — Audit Remediation Plan

Status: **RESOLVED CONTRACT PREPARATION / PAGE IMPLEMENTATION PENDING**

This plan records the ordered corrections made after auditing the page packet against repository code, governance, design, data, localization and responsive contracts.

## P0 — governance and canonical data

1. Register the `conference-congress-transportation` surface in `.design/config.json`, linked to this blueprint and the shared/page contract directories.
2. Regenerate `.design/system.json` with `pnpm design:sync`, then prove the surface resolves with `pnpm design:context`.
3. Own Conference vehicle-role relationships in `src/data/services.ts`, typed against `VehicleId` from `fleet.ts`:
   - `individualExecutive` → S-Class, E-Class;
   - `smallerGroup` → V-Class 7+1 Extra Long;
   - `largerGroup` → Sprinter.
4. Require page compositions and recommendation checks to read `getService("conferenceCongressTransportation").vehicleRoles`; localized UI owns only labels, never the relationship.

## P1 — contract and responsive synchronization

1. Use the verified Corporate audience rail as the matching Business-family precedent: one column by default, two at `md`, three at `xl`, five at `2xl`. Delegation's audience is an image/content split and is not the matching topology.
2. Define the five required evidence widths as 320, 768, 1024, 1440 and 1920 CSS px. Also test both sides of every Conference-owned topology transition.
3. Keep SiteHeader, the fleet CTA, FinalCTA without a phantom helper label, and SiteFooter in the wireframe's structural order.
4. Require complete renderer guards for localized intro/body/CTA fields and exact item counts.
5. Make the shared `BusinessMovementSequence` extraction follow shared-component governance: pre-change impact check, reviewed contract/registry synchronization after the component exists, component-profile verification and Delegation regression evidence.
6. Add explicit semantic typography, image delivery, reserved geometry, LCP/lazy-loading and no-island acceptance.

## P2 — packet hygiene

1. Refer to the configured active theme and semantic tokens rather than locking implementation instructions to a theme version.
2. Treat `wireframe.html` as schematic structure: use semantic aliases, logical CSS properties, correct `sr-Latn` language metadata and no production-only helper label.
3. Point all content instructions to the installed per-page content directory under `src/content/pages/`; retain `ui-additions/` as an audit fragment after merging it into the canonical dictionaries.

## Verification sequence

```bash
pnpm design:sync
pnpm design:context --target site/luksuzni-prevoz/src/content/pages/conference-congress-transportation/conference-congress-transportation.sr.md --surface conference-congress-transportation
pnpm types:generate
pnpm types:generate:check
pnpm components:check
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Production UI creation, shared extraction, browser evidence and publication remain a separate implementation phase governed by `implementation.md` and `acceptance.md`.
