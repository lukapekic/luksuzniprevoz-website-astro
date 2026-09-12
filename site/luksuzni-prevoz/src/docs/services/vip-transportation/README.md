# VIP Transportation V1 — Implementation Package

**Target route:** `vipTransportation`  
**Page type:** direct service  
**Primary locale:** Serbian (`sr`)  
**Theme:** configured active Theme V2 — Black & Platinum  
**Status:** LOCKED — IMPLEMENTED
**Prepared:** 2026-08-30

This package defines the production target for the final Special Events child service: VIP Transportation. It follows the repository authority chain and the established Wedding/Prom Occasion architecture, but gives VIP its own operational identity: discreet, individually coordinated transportation around an important guest and confirmed itinerary.

The implementation MUST NOT reduce VIP Transportation to a generic luxury-car page. The page sells discretion, private itinerary handling, aviation arrivals, multi-vehicle organisation and dedicated coordination for complex bookings. Every capability-sensitive statement remains gated by `src/data/services.ts`.

## Authority order

1. repository root `AGENTS.md`
2. validated repository configuration, schemas and canonical data
3. current reviewed shared component/API contracts
4. this package `blueprint.md`
5. repository `DESIGN.md`
6. configured active Theme V2 semantic tokens
7. this package `wireframe.md`
8. applicable `.skills/*.md`

Root `docs/` is operational guidance only. Page design authority lives in this package under `src/docs/services/`.

## Package files

```text
vip-transportation/
├── README.md
├── blueprint.md
├── implementation.md
├── acceptance.md
├── wireframe.md
└── redesign-content-pack/
    ├── vip-transportation.sr.md
    ├── vip-transportation.en.md
    ├── vip-transportation.ru.md
    ├── ui-additions.sr.json
    ├── ui-additions.en.json
    ├── ui-additions.ru.json
    └── schema-changes.md
```

## Locked contextual imagery

The production mapping combines one page-specific editorial Hero with verified repository assets:

```text
Hero
→ src/assets/pages/vip-transportation/hero.png

Service definition / passenger experience
→ passenger-experience-alternate.webp

Discretion & privacy signature section
→ src/assets/shared/other/s-class-hotel-front-winter.webp

Arrivals & aviation primary image
→ mercedes-sprint-next-to-private-jet.webp

Arrivals & aviation supporting image
→ private-jet-parked-outside-of-hangar.webp
```

The existing canonical Fleet media remains responsible for the Vehicle Recommendations region. The existing shared Final CTA media remains responsible for the final conversion region.

Do not substitute the following as prominent VIP storytelling media:

```text
mercedes-outside-of-airstrip.webp
s-class-interior-1.webp
s-class-interior-driver-side.webp
s-class-move-highway.webp
s-class-move-highway-2.webp
v-class-interior-1.webp
productivity-backseat.webp
```

`S-Class move highway` visually appears to present a Maybach-class vehicle; it MUST NOT be used to imply bookable fleet availability unless canonical Fleet data explicitly supports that vehicle in the future.

## Shared Occasion architecture

VIP MUST reuse the stable Occasion components where their contracts fit:

```text
src/components/services/occasion-transportation/
├── OccasionScope.astro
├── OccasionStandards.astro
└── OccasionProcessSteps.astro
```

VIP uses a page-local service-definition composition because the approved passenger-experience photograph is part of that section's locked visual contract.

VIP-local components:

```text
src/components/services/vip-transportation/
├── VipTransportationPage.astro
├── VipServiceDefinition.astro
├── VipDiscretion.astro
├── VipAviation.astro
└── VipItinerary.astro
```

Reuse shared `ServiceHero`, `VehicleRecommendations`, `FAQ`, `FinalCTA` and foundation layout primitives. Do not copy shared Occasion markup into the VIP directory and do not add `if (vip)` branches to shared components.

## Content installation contract

The `redesign-content-pack` contains the complete SR/EN/RU target service entries and only the new UI dictionary keys required by the VIP renderer.

Installation order is locked:

1. replace all three VIP scaffolds with the supplied full service entries staged as `in-review` and `noindex: true`;
2. merge matching UI additions into `src/content/ui/{sr,en,ru}.json` using the strict merge rule below;
3. run `pnpm content:sync-digests` so EN/RU receive the real Serbian source digest;
4. validate content, routes and SEO;
5. implement and dispatch the dedicated VIP renderer while the route remains scaffold;
6. pass renderer tests, site check/build and UI verification;
7. publish content (`published`, `noindex: false`) and route availability atomically;
8. rerun the full acceptance stack before completion.

UI merge rule:

```text
missing key → add
existing identical key → keep
existing different key → STOP and reconcile
```

Do not invent or hand-write `sourceDigest`. The repository digest command owns it.

## Commercial and operational constraints

The canonical VIP service definition currently requires:

- quote-only pricing;
- discretion;
- privacy;
- commercial aviation support;
- private aviation support;
- multi-vehicle organisation;
- dedicated coordination for complex bookings;
- no decorative-positioning promise.

The page MUST NOT claim:

- close protection, bodyguards, security escorts or protective services;
- police escorts, priority road access or restricted-zone access;
- guaranteed tarmac/airside access;
- included flowers, decoration, champagne, gifts or entertainment;
- celebrity treatment, red-carpet access or paparazzi handling;
- fixed VIP packages or a published flat VIP price;
- instant confirmation;
- unlimited schedule changes or waiting;
- a vehicle model that canonical Fleet data does not offer.
