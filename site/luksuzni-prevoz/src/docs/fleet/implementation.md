# Fleet Page — Implementation Plan

**Status:** LOCKED IMPLEMENTATION CONTRACT  
**Target:** `site/luksuzni-prevoz/`

## 0. Current repository baseline

Already implemented and retained:

- Kodiaq canonical Fleet record with `passengers: null` and `pricingStatus: "quote-only"`;
- nullable/partial pricing contract and pricing consistency guards;
- Fleet profile content shape;
- installed SR/EN/RU Fleet content and Fleet UI keys;
- generated translation digests.

Remaining work is the Fleet-specific presentation relationship, six-chapter content alignment, page-local components, renderer registration, route publication, governance verification, and responsive/technical review.

Vito remains canonical and priced. It is not a Fleet showcase chapter because there is no approved Fleet-page image. The exclusion belongs to Fleet-page presentation data, not `Vehicle` or pricing facts.

## 1. Production file map

Create:

```text
src/components/fleet/FleetPage.astro
src/components/fleet/FleetNavigator.astro
src/components/fleet/FleetVehicleFeature.astro
src/components/fleet/FleetFitGuide.astro
src/data/fleet-page.ts
src/data/fleet-page-media.ts
```

Reuse:

```text
src/components/services/shared/ServiceHero.astro
src/components/shared/FAQ.astro
src/components/shared/FinalCTA.astro
src/foundation/ui/Section.astro
src/foundation/ui/PageContainer.astro
src/foundation/ui/ReadingContainer.astro
src/foundation/ui/SectionHeading.astro
src/foundation/ui/Link.astro
src/layouts/BaseLayout.astro
```

Modify:

```text
src/data/fleet.ts
src/data/pricing.ts
src/data/routes.ts
src/content/schemas/pages.ts
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
src/content/pages/fleet/fleet.sr.md
src/content/pages/fleet/fleet.en.md
src/content/pages/fleet/fleet.ru.md
src/components/site/ContentPageRenderer.astro
.design/config.json
```

Do not modify generated theme CSS manually.

## 2. Preserve canonical data

The Kodiaq and pricing work in `data-contract.md` is already implemented. Verify it; do not reapply it or alter supplied numeric values.

### 2.1 Fleet

The canonical Fleet contains:

```text
VehicleClass += "suv"
VehicleId    += "skoda-kodiaq"
```

Kodiaq canonical record:

```text
id: "skoda-kodiaq"
displayName: "Škoda Kodiaq"
vehicleClass: "suv"
passengers: null
pricingStatus: "quote-only"
```

Existing priced vehicles retain:

```text
pricingStatus: "published"
```

No Kodiaq capacity number is authored until owner-confirmed.

### 2.2 Pricing

Retain the quote-only-compatible pricing contract from `data-contract.md`.

Do not weaken unknown-vehicle validation.

`getPricing()` MUST force the caller to handle absence.

Any pricing/calculator consumer touched by the type change MUST be updated in the same implementation so no undefined arithmetic is possible.

## 3. Fleet page media map

Create dedicated `fleet-page.ts` participation data and `fleet-page-media.ts` enabled media data.

Do not repurpose Homepage presentation ordering.

Required participation shape:

```ts
interface FleetPageModel {
  key: FleetPageProfileKey;
  vehicleIds: readonly VehicleId[];
  showOnFleetPage: boolean;
}
```

Locked order:

```text
mercedesSClass
mercedesEClass
skodaSuperb
skodaKodiaq
mercedesVClass
mercedesVitoTourer
mercedesSprinter
```

Use exact assets from `asset-contract.md`.

V-Class maps both canonical V-Class IDs to one model-family media entry.

Vito remains in this page-specific relationship so its exclusion is explicit:

```ts
{
  key: "mercedesVitoTourer",
  vehicleIds: ["mercedes-vito-tourer-8-plus-1"],
  showOnFleetPage: false,
  image: null,
}
```

Every visible entry has `showOnFleetPage: true`; `fleet-page-media.ts` supplies a non-null image for each enabled key. Page content profiles MUST match the enabled entries exactly; disabled entries never render.

The media module owns presentation relationships only. It does not own capacity, class, price, or model-copy facts.

## 4. Content schema

Apply `schema-changes.md`.

The Fleet schema MUST support exactly six visible model-family profiles because the V-Class chapter groups two canonical configurations and Vito is page-disabled.

Content owns:

- localized summary;
- localized best-for statement;
- localized editorial highlights.

Content does NOT own:

- display name;
- passenger number;
- vehicle class;
- pricing;
- image path;
- route path.

## 5. Localized content and UI

### 5.1 Install content

Copy the three files from this package into:

```text
src/content/pages/fleet/
```

Then run:

```bash
pnpm content:sync-digests
```

The generated EN/RU source digests MUST correspond to the final Serbian source.

### 5.2 Merge UI additions

Merge every key under `ui-additions/<locale>.json` into the matching production dictionary.

Do not replace the dictionary.

No UI key is allowed to be missing in one locale.

## 6. FleetPage.astro

Responsibilities:

1. validate route/content compatibility;
2. resolve localized content;
3. resolve canonical model/profile records;
4. resolve media from `fleet-page-media.ts`;
5. resolve categories through the explicit page mapping `sedan → sedans`, `suv → suv`, `van → groups`, `bus → groups`;
6. build FAQ schema from the same visible FAQ data;
7. resolve CTA hrefs through existing helpers;
8. compose page sections;
9. emit no page-local business facts.

Required high-level composition:

```text
BaseLayout overHero=true
→ ServiceHero full-bleed
→ FleetNavigator
→ Introduction
→ Sedans anchor + S klasa/E klasa/Superb
→ SUV anchor + Kodiaq
→ Group Transport anchor + V klasa/Sprinter
→ FleetFitGuide
→ FAQ
→ FinalCTA
```

Category labels MUST not become giant standalone bands. They are compact chapter markers/navigation destinations.

## 7. FleetNavigator.astro

Static Astro component.

Props contain resolved localized labels and anchor ids.

No island.

Desktop:

- horizontal layout;
- restrained divider treatment;
- the complete navigator surface is capped by `PageContainer`;
- the tab row has no extra inner panel gutter;
- the grouped navigator shell uses `--radius-card` with clipped internal states;
- individual anchors remain square within the group rather than becoming pills;
- anchors remain text-led.

Mobile:

- wrapping or two-column compact layout;
- no accidental page overflow;
- no horizontal scroll requirement.

ARIA:

- `<nav aria-label="...">`
- native anchor links.

## 8. FleetVehicleFeature.astro

One reusable page-local component.

### Required inputs

```text
profile editorial copy
canonical vehicle records
canonical model display name
resolved image
locale UI labels
anchor/category context
```

### Identity resolution

For ordinary chapters:

- name from canonical `Vehicle.displayName`.

For V-Class:

- name from existing `fleetModelDisplayNames.mercedesVClass`.

Do not duplicate those names in localized Markdown.

### Fact block

Render:

- localized class label;
- passenger capacity if non-null;
- V-Class configurations where the profile has two vehicle records;
- localized quote-only state when `pricingStatus === "quote-only"`.

Fleet page MUST NOT display numeric pricing in vehicle chapters.

### Kodiaq

When `passengers === null`, omit passenger-capacity row completely.

Do not render an empty label.

### Layout

Component owns the actual grid node. Its DOM order is identity → media → facts → summary → best-for → highlights. Desktop grid placement puts media in the first visual column without CSS `order` or duplicated content.

At `xl`: canonical 12-column grid with media spanning 7 and content spanning 5.
At `lg`: canonical 12-column grid with a 6/6 split.
Below `lg`: single logical column.

Do not reverse individual chapters.

Do not render a bottom divider after each vehicle chapter. Section rhythm and
category markers provide separation between cars.

## 9. Image delivery

### Hero

Pass `src/assets/pages/fleet/hero.webp` to the existing `ServiceHero` image prop.

Inherited `ServiceHero` behavior:

- `loading="eager"`;
- `fetchpriority="high"`;
- responsive widths;
- AVIF/WebP transformation according to existing conventions;
- controlled focal point;
- full-bleed `object-cover`;
- existing Hero scrim;
- alt empty when decorative.

### Vehicle sources

Use the six enabled `left-facing.webp` source assets. Disabled Vito has no page image and must not be substituted.

The original files can exceed 2 MB; they MUST be processed by Astro.

Expected vehicle delivery:

- `loading="lazy"`;
- centered `object-fit: cover`;
- stable source-aligned 3:2 aspect ratio;
- a very light scrim derived from `--color-background`;
- widths sized for 7-column / 6-column / mobile use;
- no oversized source shipped untouched;
- decorative empty alt where adjacent heading identifies the model.

Do not use the compact Homepage fleet images for these chapters.

## 10. FleetFitGuide.astro

One dark section containing one light inner panel.

Input comes from `sections[key=chooseRightVehicle]`.

Require exactly four items.

At `<64rem`:

- one column;
- internal horizontal dividers.

At `>=64rem`:

- four equal columns;
- internal vertical dividers.

No four-card grid.

## 11. FAQ

Reuse shared `FAQ`.

Compose it in the established contained `Section surface="light"` pattern,
with `ReadingContainer` inside. Do not use the full-width light band.

Build `FAQPage` structured data from the identical validated item array.

Do not emit Product, Car, ItemList-with-price, or AggregateOffer schema.

## 12. Renderer registration

Update `ContentPageRenderer.astro` with a dedicated Fleet route branch:

```text
routeKey === "fleet"
→ FleetPage
```

Do not route Fleet through `LeafPage`.

Treat renderer registration and route publication as one atomic delivery. Published Fleet content must never ship through the generic renderer.

## 13. Route publication

In `routes.ts`:

```text
fleet.availability: "published"
```

Make this change only after:

- all three locale content entries are installed;
- content schema supports them;
- UI parity passes;
- required assets exist;
- FleetPage is registered.

Let current sitemap machinery resolve normal page priority.

## 14. Responsive implementation

Token thresholds from active layout contract:

- `md` 48rem
- `lg` 64rem
- `xl` 80rem

Evidence widths:

```text
320
768
1024
1440
1920
```

Do not invent non-token breakpoints for primary topology changes.

At 1920, cap content with the approved main container. Vehicle media must not expand indefinitely.

The introduction uses `PageContainer` plus a canonical 12-column grid; its
copy occupies a bounded reading span aligned to the page grid. Vehicle chapters
use the same canonical grid rather than independent fractional tracks.

## 15. Shared component wiring

- `ServiceHero`: pass resolved `{ label, href }` actions, locale, `variant="full-bleed"`, imported Hero metadata, and decorative empty alt. Do not duplicate its LCP implementation.
- `FAQ`: compose inside `Section` + `ReadingContainer` + `SectionHeading`; pass the identical validated item array used by `buildFaqPage`.
- `FinalCTA`: pass resolved booking/quote actions, locale, verified-only contacts, `final-cta-bg.webp`, `imageFit="cover"`, and `mediaTreatment="integrated"`.
- Do not modify these approved shared components for Fleet-page styling.

## 16. Accessibility

Required:

- one H1;
- logical H2/H3 structure;
- category navigator is real `<nav>`;
- 44×44 anchors/actions;
- visible focus;
- no color-only state;
- image alt treatment follows role;
- no text embedded in vehicle images;
- no motion dependency;
- reduced-motion behavior inherited from Hero;
- no horizontal overflow at 320.

## 17. Governance and final validation

Register a `fleet` surface in `.design/config.json`, then run before UI editing:

```bash
pnpm design:context --target site/luksuzni-prevoz/src/components/fleet/FleetPage.astro --surface fleet
```

Run the current repository commands required by `AGENTS.md`, including the applicable forms of:

```bash
pnpm foundation:doctor
pnpm types:generate
pnpm theme:validate
pnpm theme:sync
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Run the exact page profile:

```bash
pnpm verify:ui --target site/luksuzni-prevoz/src/components/fleet/FleetPage.astro --surface fleet --change page
```

Never report a gate as passed unless it ran successfully.
