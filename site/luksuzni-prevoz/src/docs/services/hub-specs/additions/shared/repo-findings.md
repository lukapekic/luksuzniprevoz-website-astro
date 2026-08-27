# Repository Scan Findings — Hub Pages

## 1. Authorities found

### Root governance

`AGENTS.md` is the only technical/foundation authority.

It explicitly states:

- `DESIGN.md` is mandatory for visible UI.
- `.skills/*.md` are procedural.
- locked blueprints outrank `DESIGN.md` for page-specific structure.
- wireframes define structure/geometry only.
- raw token values remain in active theme JSON.
- user-visible copy must come from approved content/UI sources.
- internal routes must use `getPath()` / `<Link>` / approved route helpers.
- generated theme artifacts are machine-owned.
- WCAG 2.2 AA and 44×44 px interaction targets are required.
- static Astro is preferred.
- responsive review must include mobile, tablet portrait, tablet landscape, desktop, and wide desktop.

## 2. Active product

```text
site/luksuzni-prevoz/
```

Framework:
- Astro
- Tailwind CSS v4
- pnpm workspace
- static-first output

Active theme:
```text
version-2
```

## 3. Current visual authority

Theme V2 is Black & Platinum.

Locked type roles:
- headings → Inter Tight
- body/UI → Manrope
- brand lockup → Cormorant Garamond Italic

Design character:
- near-black / graphite canvas
- restrained platinum contrast
- off-white primary text
- image-led where image has a real role
- controlled whitespace
- minimal borders/shadows
- premium without limousine clichés

Explicit anti-patterns include:
- black/gold template styling
- SaaS/dashboard appearance
- generic card grids
- metallic gradients
- glow
- giant rounded rectangles
- routine card lift/zoom
- centered-everything
- fake metrics
- repetitive icon feature cards

## 4. Layout system learned from Theme V2

The live token system provides:

- main / reading / narrow content containers
- page and section gutters
- 4-column mobile grid
- 8-column tablet grid
- 12-column desktop grid
- explicit tablet/desktop column gaps
- approved desktop compositions including:
  - 12
  - 6/6
  - 5/7
  - 7/5
  - 4/4/4
  - 8/4
  - 3/3/3/3
- semantic section spacing tiers:
  - compact
  - standard
  - feature

Blueprints and implementation should name semantic roles/compositions rather than duplicate raw token values.

## 5. Existing shared service layer

Production components already exist at:

```text
src/components/services/shared/
  ServiceHero.astro
  ServiceOverview.astro
  VehicleRecommendations.astro
  ServiceStandards.astro
```

Other reviewed shared components include:

```text
src/components/shared/
  ServiceCard.astro
  OpenSplitSection.astro
  FAQ.astro
  FinalCTA.astro
  HorizontalCarousel.astro
```

Foundation layout/UI primitives already exist for:

```text
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button / form controls
```

### ServiceHero

Current production API supports:
- `contained`
- `responsive-split`
- `full-bleed`

For Business and Special Events hubs, use the contained service-hero family unless a locked blueprint explicitly changes it.

The current Business blueprint already locks `ServiceHero / contained`.

### ServiceCard

`ServiceCard` is already the reviewed visual vocabulary for service navigation.

Important contract:
- image-led 3:2 card surface
- title + concise support + visible CTA
- only the CTA is interactive
- no whole-card link overlay
- no border/shadow/dashboard body
- imported Astro image or neutral approved placeholder
- caller owns localized copy, route and alt decision

This makes `ServiceCard` the correct primitive for both hub child-service selectors.

## 6. Actual runtime page architecture

Localized route generation flows through the catch-all route system and then:

```text
src/components/site/ContentPageRenderer.astro
```

Current dedicated renderer mapping:
- Airport Transportation → `AirportTransportationPage`
- scaffold content → `ScaffoldPage`
- other authored content → generic `LeafPage`

### Important implementation gap

Business Transportation is already:
- route kind `hub`
- route availability `published`
- content `pageType: hub`
- localized content reviewed/published

But `ContentPageRenderer.astro` does **not yet map** `businessTransportation` to a dedicated `BusinessTransportationPage`.

Therefore Business currently falls through to generic `LeafPage`, despite the repo already containing a locked dedicated-hub design/implementation packet.

This is the immediate Business implementation task.

## 7. Current route/service truth

From `src/data/routes.ts`:

### Business
```text
businessTransportation
  sr: /poslovni-prevoz/
  en: /en/business-transportation/
  ru: /ru/biznes-transfer/
```

Children:
- corporateTransportation
- delegationTransportation
- conferenceCongressTransportation

### Special Events
```text
specialEvents
  sr: /prevoz-za-specijalne-dogadjaje/
  en: /en/special-events/
  ru: /ru/transport-dlya-osobykh-meropriyatiy/
```

Children:
- weddingTransportation
- promTransportation
- vipTransportation

Special Events is currently `scaffold`, not published.

## 8. Service capability truth

`src/data/services.ts` owns service/hub facts.

### Business hub
- estimated-when-simple + quote
- primarily Belgrade
- outside normal area → quote

Corporate:
- one-off supported
- recurring contracts supported
- invoicing supported
- negotiated pricing supported
- dedicated chauffeur across stops supported

Delegation:
- multiple vehicles
- mixed vehicle classes
- dedicated coordinator
- `securityService: false`

Conference/Congress:
- airport arrivals
- hotel transfers
- venue shuttles
- multi-vehicle schedules
- executive transfers
- group transport

### Special Events hub
- pricing modes: from + quote
- primarily Belgrade
- outside normal area → quote
- general use cases:
  - birthdays
  - private parties
  - galas
  - other special events

Wedding:
- couple transport
- guest transport
- multiple vehicles
- mixed classes
- return possible
- waiting through custom quote
- custom presentation request

Prom:
- individual + group
- multiple vehicles
- mixed classes
- return possible
- waiting through custom quote
- custom presentation request

VIP:
- quote
- discretion
- privacy
- commercial/private aviation
- multi-vehicle
- dedicated coordinator for complex bookings
- no custom-decoration positioning

## 9. Content architecture

The `pages` Astro content collection uses a discriminated schema.

Hub content already has a suitable schema:

```yaml
pageType: hub
hero:
overview:
childServices:
sections:
vehicleRecommendations:
faq:
finalCta:
```

No new hub schema is required for Special Events unless a later product requirement cannot be represented by this existing model.

### Special Events content status

All three Special Events entries are currently scaffold/missing translation/noindex.

Therefore:
- design/component implementation may be prepared,
- but publication must not invent production copy or translations,
- and the route should remain scaffold/noindex until complete SR/EN/RU content is approved.

## 10. Existing Business documentation status

The repo already contains:

- locked Business blueprint v2
- semantic HTML wireframe
- implementation contract
- implementation UI addendum
- acceptance contract
- localized content pack

Recommendation:
**preserve it**. Do not generate a competing visual redesign unless the owner explicitly unlocks the page structure.

## 11. Airport page as production reference

Airport Transportation demonstrates the preferred dedicated-renderer pattern:

- strict route/content narrowing
- data-driven service capability view models
- `buildPageSeo`
- `resolveCtaHref`
- shared `ServiceHero`
- shared `ServiceOverview`
- `OpenSplitSection`
- shared `VehicleRecommendations`
- shared `ServiceStandards`
- shared `FAQ`
- shared `FinalCTA`
- semantic token CSS
- no manual route concatenation
- no hardcoded operational facts in presentation

Business and Special Events should follow the same architectural discipline, not copy Airport's page composition.
