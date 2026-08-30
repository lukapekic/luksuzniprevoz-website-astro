# Fleet Page — Locked Blueprint

**Status:** LOCKED  
**Route key:** `fleet`  
**Page archetype:** `fleet`  
**Design direction:** Variant 1 — **The Chauffeur Collection**

## 1. Page objective

The Fleet page sells the quality, range, and suitability of the chauffeured vehicle collection.

It MUST answer:

1. What vehicles are available?
2. Which vehicle category fits my journey?
3. How many passengers can the operator carry in each verified service configuration?
4. Which vehicle is best suited to my type of trip?
5. How are luggage, passenger count, and specific-model availability handled?
6. How do I proceed to booking or a quote?

The page MUST feel like a premium automotive product presentation integrated into the Black & Platinum Luxury Transportation system.

It MUST NOT feel like:

- a rental-car inventory;
- a dealership configurator;
- a generic limousine card grid;
- a pricing table with cars attached;
- a 3D/animation demo;
- a repeated Homepage Fleet carousel.

## 2. Canonical roster represented by the page

The final page represents these visual model chapters in this exact order:

1. Mercedes S klasa
2. Mercedes E klasa
3. Škoda Superb
4. Škoda Kodiaq
5. Mercedes V klasa
6. Mercedes Sprinter

The V-Class chapter resolves two canonical service configurations:

- `mercedes-v-class-6-plus-1-extra-long`
- `mercedes-v-class-7-plus-1-extra-long`

The page presents **6 visual model chapters backed by 7 canonical vehicle records**. Mercedes Vito Tourer remains the eighth canonical vehicle and remains available to pricing consumers, but it is not part of the Fleet showcase because no approved Fleet-page source image exists.

Fleet-page participation is controlled by the dedicated presentation relationship in `src/data/fleet-page.ts`. Vito MUST remain canonical and priced, with `showOnFleetPage: false` and `image: null` in that page-specific relationship. Enabled chapter images are owned separately by `src/data/fleet-page-media.ts`.

Vehicle identity, service capacity, class, pricing state, and verified operator facts MUST come from canonical data.

## 3. Page order

The locked order is:

```text
SiteHeader over Hero
→ Full-bleed Fleet Hero
→ Fleet Navigator
→ Fleet Introduction
→ Vehicle Collection
   → S klasa
   → E klasa
   → Superb
   → Kodiaq
   → V klasa
   → Sprinter
→ Choosing the Right Vehicle
→ FAQ
→ FinalCTA
→ SiteFooter
```

No region is silently removed, reordered, or converted to a different page pattern.

## 4. Full-bleed Fleet Hero

### Role

The Hero establishes Fleet as a first-class product page.

### Media

Exact asset:

`src/assets/pages/fleet/hero.webp`

The Hero MUST use the existing full-bleed Hero layering model:

```text
media
→ scrim
→ content
→ over-Hero header
```

Use `ServiceHero` with `variant="full-bleed"` if its current reviewed contract satisfies the Fleet blueprint without modification.

Do not create a Fleet-specific Hero clone solely to rename the component.

### Content

Hero contains:

- one H1;
- one concise lede;
- primary booking CTA;
- secondary quote CTA.

No metric badges.  
No fake “2022+” fleet claim.  
No passenger-count strip.  
No manufacturer specifications.  
No vehicle-card overlay.  
No decorative uppercase eyebrow requirement.

### Header

`BaseLayout overHero={true}` MUST enable the approved transparent Header-over-Hero state.

## 5. Fleet Navigator

### Role

Provide fast in-page orientation without becoming a filter application.

### Categories

The navigator contains exactly three anchors:

1. Sedans
2. SUV
3. Group Transport

Mapping:

```text
Sedans
  Mercedes S-Class
  Mercedes E-Class
  Škoda Superb

SUV
  Škoda Kodiaq

Group Transport
  Mercedes V klasa
  Mercedes Sprinter
```

### Interaction

- Native anchors only.
- No required client-side JavaScript.
- 44×44 target minimum.
- Visible focus.
- Sticky behavior is NOT required.
- No pill-cloud styling.
- Use restrained text / divider treatment.
- The navigator surface itself is contained by the approved main container.
- Do not add an inner panel gutter around the divider-led tab row.
- Treat the navigator as one grouped surface using the semantic card radius;
  individual anchors do not become rounded pills.

## 6. Fleet Introduction

Open-dark section.

The section uses the approved main page container and canonical grid. Its
heading and body occupy a bounded reading span aligned to the main grid rather
than a separately centred reading container.

The section explains:

- vehicle choice depends on journey, passenger count, luggage, and schedule;
- exact model selection is confirmed with availability;
- operator capacity, not manufacturer brochure seating, controls visible passenger counts.

Do not publish a blanket model-year statement.

## 7. Vehicle Collection

### Global chapter contract

Every model chapter uses the same stable composition inside the approved main
page container and canonical 12-column grid.

Chapters are separated by the approved section rhythm and category markers,
not by a bottom border after every vehicle.

#### Desktop ≥ 80rem

Approved `7/5` composition on the 12-column grid:

```text
7 columns: vehicle media stage
5 columns: model information
```

The media stays on the same logical side for every chapter.

**No zig-zag alternation.**

#### Tablet landscape 64–79.99rem

Use `6/6` on the same 12-column grid.

#### Tablet portrait 48–63.98rem

Stack:

```text
model heading
→ vehicle image
→ capacity / class / configuration facts
→ summary
→ best-for copy
```

#### Mobile <48rem

Single column.

Order:

```text
model identity
→ vehicle image
→ canonical compact facts
→ editorial summary
→ best-for text
```

Do not use CSS ordering that changes DOM reading order.

### Vehicle image contract

Every chapter uses:

`src/assets/fleet/original/<vehicle-folder>/left-facing.webp`

Image treatment:

- fill the complete media stage with `object-cover`;
- use the source photography's stable 3:2 aspect ratio so the vehicle remains
  clear without artificial top/bottom bands;
- center the crop with `object-position: center`;
- add a very light black scrim derived from the semantic background token;
- restrained graphite stage;
- no glowing outline;
- no fake floor reflection;
- no 3D rotation;
- no required hover zoom;
- image is decorative when the adjacent canonical model name fully supplies identity.

### Chapter information hierarchy

Each chapter contains:

1. canonical model-family name;
2. canonical vehicle class;
3. canonical operator passenger capacity when verified;
4. V-Class configuration rows where applicable;
5. localized editorial summary;
6. localized “best for” statement;
7. 2–3 localized editorial highlights.

No chapter contains:

- horsepower;
- engine displacement;
- acceleration;
- fuel consumption;
- trim-line claims;
- unverified Wi-Fi;
- unverified massage seats;
- unverified screens/audio;
- manufacturer seating count presented as operator capacity;
- copied pricing values.

### Capacity rendering

For a single canonical record:

- render `passengers` only when non-null;
- omit the capacity row when null;
- never display `0`, `unknown`, `N/A`, or a guessed value.

For V-Class:

- show one visual model family;
- show the two canonical configurations as two rows;
- resolve each row's capacity from its canonical vehicle record.

### Kodiaq

Kodiaq is a canonical `suv`.

Until owner-confirmed service capacity is added:

- `passengers` remains `null`;
- no passenger-capacity value is rendered;
- no manufacturer “5 seats” or “7 seats” value substitutes for operator capacity.

Until owner-confirmed pricing is added:

- pricing state is quote-only;
- Fleet page does not invent or display a price.

## 8. Choosing the Right Vehicle

Dark section with one bounded light functional panel.

Do not create four detached cards.

Exactly four decision criteria:

1. Passengers
2. Luggage
3. Journey type
4. One vehicle or several

### Desktop ≥64rem

One light panel with four equal information columns and internal dividers.

### Mobile / tablet portrait

One light panel with four stacked rows and internal dividers.

This region MUST explain that luggage and passenger count are considered together.

It MUST NOT promise that the largest nominal passenger configuration is always correct for passengers travelling with large amounts of luggage.

## 9. FAQ

Use the approved shared FAQ.

FAQ is the primary reading-focused light region. It uses the approved
contained light `Section` pattern with `ReadingContainer` inside; it is not a
full-width light band.

Questions cover:

- exact model selection;
- passenger capacity;
- V-Class configurations;
- luggage;
- Kodiaq/SUV option;
- multiple vehicles;
- child seat;
- manual confirmation.

Visible FAQ and FAQPage structured data MUST consume the same validated array.

No Product schema is required.  
No Vehicle schema is introduced without a separate structured-data decision.

## 10. Final CTA

Reuse the existing shared `FinalCTA`.

Primary action: booking flow.  
Secondary action: quote flow.

Final CTA remains medium height.

It MUST NOT become Hero #2.

## 11. Theme contract

Production uses semantic tokens from the theme selected by `foundation.config.ts`. The current configured snapshot is Theme V2, but this blueprint does not own the active theme version or raw values.

Required typography roles:

```text
H1/H2/H3 → Inter Tight
body/UI  → Manrope
brand     → existing brand-only Cormorant Garamond exception
```

Platinum remains restrained.

Use hierarchy through:

```text
type
+ scale
+ spacing
+ vehicle imagery
+ surface contrast
```

Do not compensate with:

- metallic gradients;
- glow;
- glassmorphism;
- heavy shadows;
- repeated outlined cards;
- oversized radius;
- decorative badges.

## 12. Responsive review states

Required evidence widths:

```text
320
768
1024
1440
1920
```

At every state verify:

- one H1;
- no horizontal overflow;
- vehicle image fills its stage and the centred vehicle subject remains clear;
- readable content measure;
- logical DOM order;
- 44×44 interactive targets;
- visible focus;
- no duplicated model copy;
- V-Class configuration rows remain understandable;
- Kodiaq capacity omission does not leave a broken/empty label;
- Hero text retains contrast;
- Final CTA remains subordinate to the Hero.

## 13. Performance contract

The current site performance budget remains authoritative.

Fleet page MUST:

- optimize Hero through Astro assets;
- eager-load only the actual LCP Hero image;
- lazy-load vehicle images;
- define intrinsic image geometry;
- avoid shipping original multi-megabyte files as raw static `<img>` URLs without Astro transformation;
- avoid new client islands;
- avoid a JavaScript gallery/configurator.

The original `left-facing.webp` files are source assets. Production delivery MUST be optimized by Astro.

## 14. SEO contract

Fleet route becomes publishable only when:

- SR/EN/RU content is complete;
- route availability changes from scaffold to published;
- noindex is false;
- canonical and hreflang behavior passes;
- Fleet is internally linked from existing navigation/Homepage CTA;
- all model names render in HTML;
- model descriptions render in HTML without interaction.

SEO copy focuses on chauffeur-driven fleet selection, not dealership specifications.
