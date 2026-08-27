# Luxury Transportation — Airport Transportation Blueprint v3

Status: **Locked structural blueprint — v3.1 repo-aligned surfaces**
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
VehicleRecommendations     → editorial-carousel
ServiceStandards           → four-group panels
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

The current Airport page has no validated display fare.

Therefore:

- no fixed Airport price;
- no estimated Airport price;
- no inferred currency;
- no `from` price;
- no derived hourly/per-km calculation;
- no fake price state.

The booking-start form continues without displaying a fare.

## 5. Locked page order

1. `SiteHeader` over full-bleed Hero
2. `ServiceHero` — `full-bleed`
3. `ServiceOverview` — grouped icon facts
4. `AirportBookingBlock` — compact booking-start form
5. Arrival Handling & Flight Tracking — media + vertical timeline
6. Private Aviation / FBO — VIP editorial split with flush media
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

After Hero, the page returns to the production compact architectural-panel language:

```text
page canvas        near-black
main cap           --container-main / 80rem
section radius     --radius-section / 1rem
card/media radius  --radius-card / .75rem
control radius     --radius-control / .375rem
section rhythm     compact by default
```

Approved Airport surface map:

```text
Overview            contained-dark compact panel
Booking             contained light compact panel
Arrival             contained-dark compact panel
Private Aviation    contained elevated panel; media flush inside outer radius
Vehicles            contained-dark compact panel
Standards           contained-dark compact panel
FAQ                 contained light compact reading panel
Final CTA           existing shared compact contained closer
```

Do not implement these as edge-to-edge dark/light bands.

Do not make each information row a card. The rounded unit is the major architectural section; internal grouping still prefers dividers, spacing, and typography unless a specific component contract calls for cards.

Private Aviation is the intentional exception where the contextual image fills its side of the rounded outer panel with zero inner media padding/radius. The outer section clips the media.

## 6. Section index system

Use a restrained page-wide metadata motif:

```text
01 — Pregled
02 — Rezervacija
03 — Dolazak
04 — Privatna avijacija
05 — Vozila
06 — Standardi
07 — Česta pitanja
```

Rules:

- number + localized label in normal title case;
- platinum is reserved primarily for the number / short rule;
- label stays muted;
- small UI role;
- never competes with the H2;
- no decorative boxes around the index;
- do not turn every section into an uppercase editorial eyebrow.

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

Use a large media / content split.

Desktop:

```text
media 7 | content 5
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
content 5 | media 7
```

Media behavior:

- fills the entire media column;
- full section height;
- no internal image padding;
- no image card;
- no independent image radius;
- image meets the section edge directly;
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

Use the shared `VehicleRecommendations` editorial-carousel contract.

Intent:

- premium product browsing;
- photography-led;
- current/active vehicle visibly dominant;
- adjacent recommendation partially visible on larger screens;
- explicit previous/next controls;
- active position counter;
- touch/drag/scroll-snap support on mobile where the shared carousel supports it.

Each item may show:

- canonical display name;
- localized vehicle class;
- canonical passenger capacity when available;
- concise suitability wording if the component/content contract supports it.

No Airport fare.
No invented luggage capacity.
No copied Homepage `FleetShowcase` identity.

## 13. Service Standards — four grouped panels

Use shared:

```text
ServiceStandards
variant = four-group-panels
```

Show **four strong standard groups**, not a long operational notebook list.

Preferred grouping:

1. Professional chauffeur
2. Prepared vehicle
3. Passenger care
4. Comfort & journey

Each panel:

- one icon;
- strong short title;
- maximum 2–3 concise verified supporting facts;
- no marketing statistics;
- no badge wall;
- no more than four visible panels.

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
- FBO media becomes a wide flush image rather than a padded card;
- vehicle carousel has no accidental page overflow;
- four standards panels become 2×2 or 1-column as space requires;
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
- no invented price;
- no dead mini-form;
- no manual localized URLs;
- no random remote stock imagery;
- keep localized editorial content separate from canonical data.
