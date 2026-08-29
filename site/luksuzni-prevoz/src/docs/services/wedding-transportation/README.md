# Wedding Transportation V2 — Implementation Package

**Target route:** `weddingTransportation`  
**Page type:** direct service  
**Primary locale:** Serbian (`sr`)  
**Theme:** active Theme V2 — Black & Platinum  
**Status:** READY FOR IMPLEMENTATION

This package is the implementation authority for the Wedding Transportation page.

## Authority order

1. repository root `AGENTS.md`
2. this package `blueprint.md`
3. repository `DESIGN.md`
4. configured active Theme V2 tokens
5. reviewed shared component contracts
6. `wireframe.md`
7. matching `.skills/*.md`
8. current implementation

The existing Wedding route is currently a scaffold. This package replaces that scaffold with a complete direct-service page.

## Files

```text
wedding-transportation-v2/
├── README.md
├── blueprint.md
├── implementation.md
├── acceptance.md
├── wireframe.md
└── redesign-content-pack/
    ├── wedding-transportation.sr.md
    ├── wedding-transportation.en.md
    ├── wedding-transportation.ru.md
    ├── ui-additions.sr.json
    ├── ui-additions.en.json
    ├── ui-additions.ru.json
    └── schema-changes.md
```

## Required image assets

The implementation MUST use the following existing repository assets exactly as named:

```text
src/assets/shared/other/weeding-day-kissing.webp
src/assets/shared/other/e-class-outside-weeding-day.webp
src/assets/shared/other/v-class-outisde-weeding-day.webp
src/assets/shared/other/s-class-with-flowers-special-occasion.webp
```

The spelling above intentionally matches the current repository filenames. Do not silently rename assets as part of this page task.

Image roles are locked:

```text
Hero
→ weeding-day-kissing.webp

Wedding-day story
→ e-class-outside-weeding-day.webp

Guest/group transportation
→ v-class-outisde-weeding-day.webp

Presentation / special-request feature
→ s-class-with-flowers-special-occasion.webp
```

Canonical Fleet media remains responsible for the vehicle recommendation section. Do not reuse these contextual wedding photographs as fleet-card media.

## Shared Wedding/Prom architecture

Wedding is the first consumer of a planned Wedding/Prom shared occasion-service layer.

Create shared components only for stable semantics already proven to apply to both Wedding and Prom:

```text
src/components/services/occasion-transportation/
├── OccasionServiceDefinition.astro
├── OccasionScope.astro
├── OccasionStandards.astro
└── OccasionProcessSteps.astro
```

Wedding-specific narrative remains page-local:

```text
src/components/services/wedding-transportation/
├── WeddingTransportationPage.astro
├── WeddingDayStory.astro
├── WeddingGuestTransport.astro
└── WeddingPresentation.astro
```

Do not create a monolithic `WeddingPromPage.astro`, generic `OccasionPage.astro`, or variant-heavy mega component.

## Content installation

Replace the scaffold files under:

```text
src/content/pages/wedding-transportation/
```

with the three localized files in `redesign-content-pack/`.

Merge `ui-additions.*.json` into the matching existing:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Do not replace the existing UI files.

Then run the repository digest/type/content workflow before implementation.

## Important commercial rules

- Wedding Transportation remains manually confirmed.
- Pricing remains quote-based.
- Waiting and return transport are arranged and confirmed, never assumed.
- Multiple vehicles and mixed vehicle classes are supported by canonical Wedding capability data.
- Special presentation requests can be submitted, but decorations, flowers, ribbons, gifts, champagne, or styling are NOT included unless explicitly confirmed for the specific arrangement.
- Do not claim event planning, photography, venue coordination, security, close protection, or wedding-planner services.
