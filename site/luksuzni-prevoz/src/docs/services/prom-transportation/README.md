# Prom Transportation V2 — Implementation Package

**Target route:** `promTransportation`  
**Page type:** direct service  
**Primary locale:** Serbian (`sr`)  
**Theme:** active Theme V2 — Black & Platinum  
**Status:** DEDICATED UI IMPLEMENTED — PAGE VERIFICATION PASSED 2026-08-29

This package defines the target Prom Transportation page contract. Validated
repository configuration, schemas, canonical data, and current reviewed shared
component APIs are the implementation baseline; stale statements in this
package must be synchronized to those contracts before code is written.

## Authority order

1. repository root `AGENTS.md`
2. validated repository configuration, schemas, and canonical data
3. current reviewed shared component/API contracts
4. this package `blueprint.md`
5. repository `DESIGN.md`
6. configured active Theme V2 tokens
7. `wireframe.md`
8. matching `.skills/*.md`

The Prom route and localized content are published and indexable. The explicit
Prom renderer replaces the generic leaf renderer and uses `hero.title` as its
single rendered H1. It is the second production consumer of the shared
Wedding/Prom occasion-service architecture.

## Package files

```text
prom-transportation-v2/
├── README.md
├── blueprint.md
├── implementation.md
├── acceptance.md
├── wireframe.md
└── redesign-content-pack/
    ├── prom-transportation.sr.md
    ├── prom-transportation.en.md
    ├── prom-transportation.ru.md
    ├── ui-additions.sr.json
    ├── ui-additions.en.json
    ├── ui-additions.ru.json
    └── schema-changes.md
```

## Required contextual image assets

The implementation expects:

```text
src/assets/shared/other/prom-holding-flowers-mercedes-bg.webp
src/assets/shared/other/prom-closeup-mercedes-background.webp
src/assets/shared/other/flowers-on-console.webp
src/assets/shared/other/v-class-interior.webp
```

Locked roles:

```text
Hero
→ prom-holding-flowers-mercedes-bg.webp

Prom-arrival story
→ prom-closeup-mercedes-background.webp

Individual vs group transport
→ v-class-interior.webp

Presentation/detail feature
→ flowers-on-console.webp
```

Canonical Fleet media remains responsible for the vehicle recommendation section.

If a Prom-specific filename differs in the implementation branch, STOP and resolve the mapping. Do not substitute Wedding photography.

## Shared Occasion architecture

Prom MUST reuse the shared components already established by Wedding where their contracts remain valid:

```text
src/components/services/occasion-transportation/
├── OccasionServiceDefinition.astro
├── OccasionScope.astro
├── OccasionStandards.astro
└── OccasionProcessSteps.astro
```

Prom-local narrative:

```text
src/components/services/prom-transportation/
├── PromTransportationPage.astro
├── PromArrivalStory.astro
├── PromGroupArrival.astro
└── PromPresentation.astro
```

Do not fork the shared Occasion layer and do not introduce `if (prom)` / `if (wedding)` branches inside shared components.

## Content installation status

The SR/EN/RU service entries are installed in:

```text
src/content/pages/prom-transportation/
```

All three entries are `status: published`, `translationState: reviewed` and
`noindex: false`. EN/RU record the regenerated digest of the Serbian source.

The missing Prom UI keys and `occasion.capability.individualAndGroup` are
installed in the matching UI locale files. Shared `occasion.*` values already
present from Wedding were retained unchanged:

```text
missing key → add
existing identical key → keep
existing different key → STOP and reconcile
```

Digest, generated-type, content, route, SEO, Astro check and build validation
are green. The exact Prom `page` verification profile passed 19 gates, and the
dedicated smoke suite passed in Chromium and Firefox. Manual visual review
covered 320, 768, 1024, 1440 and 1920 CSS px. WebKit execution remains blocked
by missing host libraries, not by a known page defect.

## Commercial constraints

- quote-based pricing;
- manual confirmation;
- individual/group travel supported by canonical Prom data;
- multiple vehicles/mixed classes only when supported and confirmed;
- waiting and return only when requested and confirmed;
- presentation requests reviewed individually;
- decorations/flowers are not automatically included;
- no party-bus, alcohol, nightlife, red-carpet, entertainment, security, photography or event-planning claims.
