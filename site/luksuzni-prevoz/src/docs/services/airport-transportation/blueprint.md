# Luxury Transportation — Airport Transportation Blueprint v3

Status: **Locked structural blueprint — v3.3 refinement-aligned**
Route key: `airportTransportation`
Page type: `service`
Theme binding: **semantic; uses the active theme selected by repository configuration**

> This blueprint replaces the previous contained-Airport direction. It defines the approved page structure, visual hierarchy, interaction intent, responsive behavior, conversion logic, and data ownership. Raw theme values remain external.

## Shared contracts

Read and apply:

```text
../shared/00-system-rules.md
../shared/01-token-contract.md
../shared/02-service-hero.md
../shared/03-service-overview.md
../shared/04-vehicle-recommendations.md
../shared/05-service-standards.md
../shared/06-responsive-rules.md
../shared/07-wireframe-rules.md
```

For Airport v3, the following shared variants are explicitly selected:

```text
ServiceHero                → full-bleed
ServiceOverview            → grouped-icons
VehicleRecommendations     → homepage-carousel mechanics + full-image cards
ServiceStandards           → outlined standards matrix
```

## 1. Goal

Present Airport Transportation as a premium arrival/departure service with stronger visual identity than a generic service article.

The page must:

- feel cinematic at entry;
- explain the Airport service with fast, icon-led scanning;
- convert users through a compact real booking-start form;
- make flight/arrival handling visually understandable through a vertical timeline;
- elevate Private Aviation / FBO as a high-value VIP capability;
- make vehicle selection feel like premium product browsing;
- reduce standards to a small number of strong, grouped confidence statements;
- keep the page minimal, professional, discreet, and transportation-led.

## 2. Conversion

Primary: begin Airport booking.

Secondary: Request a Quote for cases that need manual commercial review.

All requests remain subject to manual confirmation.

The compact Airport booking form is an entry step only. It must preserve entered state and continue to the detailed booking form. It is not a calculator and it must not display a fare.

## 3. Authoritative service facts

Use `services.ts` for Airport capability truth:

- supported airport;
- point-to-point behavior;
- one-way / return;
- flight tracking;
- meet & greet;
- luggage assistance;
- name sign;
- standard waiting allowance;
- commercial aviation;
- private aviation;
- FBO coordination;
- related routes.

Use `operations.ts` for general operational standards.
Use `fleet.ts` for vehicle facts.
Use `contact.ts` / `business.ts` for booking-policy facts.
Use pricing data only where it explicitly represents Airport pricing.

No content/UI string becomes the source of those facts.

## 4. Pricing gate

Airport fares are vehicle-specific and belong to the shared pricing source. The
page displays a fare only when the selected vehicle has a validated Airport fare
and currency/unit metadata. Airport transfer fares are now supplied for every
vehicle in EUR and apply only to Belgrade Airport ↔ Belgrade city locations.
Render the typed fare from shared pricing data; never duplicate or derive it.

## 5. Locked page order

1. `SiteHeader` over full-bleed Hero
2. `ServiceHero` — `full-bleed`
3. `ServiceOverview` — grouped icon facts
4. Arrival Handling & Flight Tracking — media + vertical timeline
5. `AirportBookingBlock` — compact booking-start form
6. Private Aviation / FBO — open VIP editorial split with portrait media
7. `VehicleRecommendations` — editorial carousel
8. `ServiceStandards` — four grouped standards
9. `FAQ`
10. `FinalCTA`
11. `SiteFooter`

Do not insert:

- reviews carousel;
- client-logo section;
- trust strip;
- public pricing table;
- calculator;
- generic process section;
- unrelated service-card grid;
- duplicate closing CTA.

## 5A. Repo-aligned section surface rhythm — v3.1

The Hero is the only full-bleed content region on this page.

After Hero, the page uses semantic container, spacing, surface, media, and
control roles from the configured active theme. No raw theme values are locked
in this blueprint.

Approved Airport surface map:

```text
Overview            open dark standard section
Arrival             open dark editorial split; compact media 5 / content 7
Booking             contained light compact panel
Private Aviation    open dark feature split; portrait media
Vehicles            open dark carousel; full-image cards
Standards           one contained-dark outlined matrix
FAQ                 contained light compact reading panel
Final CTA           existing shared compact contained closer
```

Do not implement these as edge-to-edge dark/light bands.

Do not make each information row a card. The rounded unit is the major architectural section; internal grouping still prefers dividers, spacing, and typography unless a specific component contract calls for cards.

Private Aviation is the intentional cinematic open-section exception. Its
portrait media is a distinct card/media surface rather than a padded image
inside a larger containing panel.

## 6. Section heading system

Every section has a localized heading. Use a restrained page-wide heading
motif:

```text
Pregled
Dolazak
Rezervacija
Privatna avijacija
Vozila
Standardi
Česta pitanja
```

Rules:

- use heading plus description for Overview, Arrival, Booking, Vehicles,
  Standards, FAQ, and Final CTA;
- Private Aviation may use a short accent rule in addition to its description;
- no visible section numbers or numbered eyebrows;
- the heading never competes with the H2 and no section becomes an uppercase
  decorative label.

The Hero may use an unnumbered service eyebrow.

## 7. Hero — full bleed

Airport no longer uses the contained ServiceHero.

Use:

```text
ServiceHero
variant = full-bleed
```

Behavior:

- full viewport width;
- near-viewport cinematic height;
- no outer card radius;
- no page-container wrapper around the media surface;
- media is the section background/full panel;
- content remains constrained to the normal inner page grid;
- content is grounded in the lower optical region, matching the Homepage Hero composition;
- SiteHeader overlays the Hero using the verified over-Hero header behavior;
- strong scrim/contrast treatment must be responsive to image crop;
- one H1;
- concise proposition;
- primary booking CTA;
- secondary quote CTA;
- optional one quiet contextual line.

Do not add:

- booking fields in Hero;
- price;
- ratings;
- fleet specs;
- trust chips;
- client logos.

## 8. Service Overview — grouped icon facts

Use:

```text
ServiceOverview
variant = grouped-icons
```

Purpose: communicate the verified Airport capability set without notebook-like individual fact rows.

Airport grouping:

### Transfer

Backed by:

```text
standardStops
oneWay
return
```

One visual row, not three separate rows.

### Arrival

Backed by:

```text
flightTracking
meetAndGreet
standardWaitingMinutesAfterLanding
```

Waiting value is interpolated from canonical data.

### Assistance

Backed by:

```text
luggageAssistance
nameSign
```

### Aviation

Backed by:

```text
commercialAviation
privateAviation
fboCoordination
```

Visual rules:

- one icon per semantic group;
- icon is decorative because adjacent text carries meaning;
- four compact rows/groups;
- no icon cards;
- no badge wall;
- no raw internal enum text;
- no repeated statement of the same capability.

Desktop keeps an editorial copy / capability relationship; mobile stacks naturally.

## 9. AirportBookingBlock — compact booking-start form

Replace the previous `details we need | current commercial path` layout.

New purpose:

- let the user begin the booking;
- collect only the highest-value Airport details;
- preserve those values into the detailed booking form;
- keep the section simple and conversion-focused.

Desktop composition:

```text
heading + concise explanation  |  compact booking-start form
```

Approved initial fields:

```text
flight number
date
time
```

Rules:

- visible labels; placeholder never substitutes for label;
- date/time use appropriate native or approved form primitives;
- flight number may be optional when the detailed flow permits;
- one strong `Continue booking` action;
- secondary quote action may appear as a quiet text/link action;
- no "Details we need" list;
- no price/result card;
- no white-on-white primary button;
- button/surface contrast must pass WCAG 2.2 AA;
- entered state must be preserved into the detailed form;
- if state-preserving handoff does not exist, it must be implemented before this form can ship.

This is not permission to ship dead inputs.

## 10. Arrival Handling & Flight Tracking — vertical timeline

Use an open media / content split on the page canvas. Do not place the split
inside a contained dark panel.

Desktop:

```text
media 5 | content 7
```

Content side contains a vertical timeline rather than a generic divider list.

Timeline semantics are driven by verified capabilities and localized UI wording.

Preferred Airport sequence:

1. flight status followed;
2. agreed meeting point / meet & greet;
3. luggage support;
4. direct onward journey.

The exact visible steps must respect canonical capability state.

Visual rules:

- media and content share one desktop row and equal block height;
- image height follows the content rather than imposing an oversized aspect-ratio panel;
- one continuous vertical rule;
- restrained numbered/icon nodes;
- active/accent treatment limited to nodes/eyebrow;
- no floating cards;
- no excessive animation.

Optional motion is a subtle progressive reveal only where the repository's motion infrastructure supports it and reduced-motion is honored.

Mobile:

```text
copy/timeline first
media second
```

## 11. Private Aviation / FBO — VIP editorial feature

This section must sell a higher-touch service, not read like a generic capability note.

Desktop:

```text
content 7 | media 5
```

Media behavior:

- uses the approved portrait contextual-image role;
- remains a single media surface with no nested image card;
- crop/focal point reviewed at all breakpoints.

Content direction:

- discreet pre-arrival coordination;
- passenger/assistant/company itinerary coordination;
- FBO/handler-aware pickup procedure;
- continuity from arrival to vehicle and onward schedule;
- custom handling for complex VIP transport requirements.

Do not claim:

- security/bodyguard service;
- apron-access guarantee;
- guaranteed private-terminal access;
- aviation operations;
- flight handling outside transport coordination.

The section may contextually link to `vipTransportation`.

## 12. Vehicle Recommendations — editorial carousel

Use the same `HorizontalCarousel` mechanics as the Homepage fleet section,
while keeping Airport-specific card content.

Intent:

- premium product browsing;
- photography-led;
- adjacent recommendation partially visible;
- explicit previous/next controls;
- active position counter;
- touch/drag/scroll-snap support on mobile where the shared carousel supports it.

Each item uses the Homepage service-card visual identity: full-image background,
directional scrim, and overlaid copy. It may show:

- canonical display name;
- localized vehicle class;
- canonical passenger capacity when available;
- concise suitability wording if the component/content contract supports it;
- validated vehicle-specific Airport fare from shared pricing data.

No hardcoded or inferred Airport fare.
No invented luggage capacity.
No copied Homepage `FleetShowcase` identity.

## 13. Service Standards — one outlined matrix

Use shared:

```text
ServiceStandards
variant = divided-panel
```

Show **four strong standard groups** as one contiguous outlined matrix. The
matrix has a complete subtle perimeter and internal rules, so the first group
is as clearly defined as every following group. It must not read as four
floating cards or a long operational notebook list.

Preferred grouping:

1. Professional chauffeur
2. Prepared vehicle
3. Passenger care
4. Comfort & journey

Each group:

- one icon;
- strong short title;
- maximum 2–3 concise verified supporting facts;
- no marketing statistics;
- no badge wall;
- no more than four visible groups.

The factual source remains `operations.ts`, supplemented only where the Airport service has a relevant verified capability.

## 14. FAQ

Keep the verified shared FAQ architecture.

Visual treatment may be refined with:

- section eyebrow;
- clear row numbering;
- generous click target;
- plus/minus state;
- subtle open/hover state.

Do not create a second accordion implementation.

## 15. Final CTA

Reuse the verified shared `FinalCTA`.

Do not turn it into a second Hero.

Retain the image-led split and page-specific Airport copy.

## 16. Interaction hierarchy

Required useful interaction:

- compact Airport booking-start form;
- vehicle carousel;
- FAQ expand/collapse.

Optional restrained interaction:

- icon-row hover/focus polish;
- subtle CTA arrow movement;
- timeline reveal;
- subtle media crop/scale treatment where the design system already supports motion.

No decorative interaction should require a new framework island when native HTML/CSS or existing shared behavior is sufficient.

## 17. Responsive acceptance

Review independently:

```text
320
768
1024
1440
1920
```

Particular checks:

- Hero remains full bleed at every width;
- over-Hero header remains readable and keyboard-safe;
- H1 and CTAs do not collide with focal subject;
- Overview groups do not wrap into unreadable fragments;
- booking form stacks to a clean single column on mobile;
- timeline remains visually continuous;
- FBO media preserves its portrait role without becoming a nested card;
- vehicle carousel has no accidental page overflow;
- standards become 2×2 or 1-column as space requires, with correct dividers;
- FAQ rows remain comfortably tappable.

## 18. Accessibility

Minimum: WCAG 2.2 AA.

Hard requirements:

- exactly one H1;
- strong text/media contrast in full-bleed Hero;
- 44×44 minimum interactive targets;
- visible focus;
- labelled form controls;
- field errors associated programmatically when present;
- no placeholder-only labels;
- no color-only state;
- carousel controls keyboard-operable;
- carousel does not trap focus;
- timeline meaning remains available as text;
- decorative icons are hidden from assistive technology;
- reduced motion respected.

## 19. Implementation guardrails

- dedicated final renderer;
- shared component variants updated deliberately rather than patched locally;
- no page-local raw palette/type/radius/breakpoint system;
- no hardcoded operational/business facts;
- no hardcoded, inferred, or fabricated price;
- no dead mini-form;
- no manual localized URLs;
- no random remote stock imagery;
- keep localized editorial content separate from canonical data.
