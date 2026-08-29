# Wedding Transportation — Locked Blueprint V2

**Status:** LOCKED  
**Route key:** `weddingTransportation`  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system

Root `AGENTS.md` remains technical authority. `DESIGN.md` and the configured active theme remain visual authority.

## 1. Product objective

The page MUST sell Wedding Transportation as a planned chauffeur-transport service for the couple and, where required, family and guests.

Before the fleet section, the visitor MUST understand:

- this is chauffeur-driven transportation for a wedding day;
- the service can cover one principal vehicle or a coordinated multi-vehicle arrangement;
- the couple and guests do not need to use the same vehicle;
- transport can be planned across several confirmed wedding-day locations;
- waiting and return transport are arranged only when included in the confirmed plan;
- special presentation requests can be submitted for review;
- every request is manually confirmed.

The page MUST feel:

`elegant + calm + personal + operationally reliable`

It MUST NOT feel like:

- a wedding-planner website;
- a floral/romantic theme detached from the parent site;
- a party-limousine website;
- a black/gold luxury cliché;
- a vehicle-rental catalogue;
- a generic direct-service template with wedding nouns substituted into it.

## 2. Conversion objective

Primary conversion: **Wedding transportation request / booking flow**

Secondary conversion: **Request a quote**

The page MUST still be useful to a visitor who is not ready to submit immediately. Content order gradually moves the visitor from service understanding to transport planning and finally to the booking handoff.

## 3. Locked section order

1. Site Header
2. Full-Bleed Wedding Hero
3. Wedding Service Definition
4. Service Scope — One Vehicle or Coordinated Plan
5. Wedding-Day Story
6. Fleet by Wedding Role
7. Couple & Guest Transportation
8. Vehicle Presentation & Special Requests
9. Wedding Transport Standards
10. How Booking Works
11. Wedding FAQ
12. Final CTA
13. Site Footer

No region may be silently removed, merged, or reordered.

## 4. Data boundaries

Localized page content owns headings, introductions, editorial prose, authored timeline/story items, CTA labels and FAQ copy.

Canonical data owns service capabilities, pricing mode, route relationships, fleet facts, vehicle capacities/specifications, operational chauffeur/vehicle standards, contact details and confirmation model.

`content/ui/{sr,en,ru}.json` owns reusable translated labels for canonical capabilities, fleet-role suitability labels, section labels, passive Hero trust markers, and data-gated standards.

Page components MUST NOT become alternate business-data stores.

## 5. Shared Wedding/Prom architecture

Wedding is the first real consumer of the shared occasion-service architecture.

Shared from the start:
- service-definition composition;
- one-vehicle / coordinated-plan composition;
- standards composition;
- booking-process composition;
- existing ServiceHero;
- existing VehicleRecommendations;
- existing FAQ;
- existing FinalCTA.

Wedding-specific:
- wedding-day narrative;
- couple/guest transport narrative;
- vehicle-presentation story;
- contextual wedding photography.

Shared components MUST remain content-agnostic. A component may not contain `if wedding` / `if prom` content branches.

## 6. Theme contract

Theme V2 Black & Platinum is REQUIRED.

Headings resolve to Inter Tight. Body/UI resolves to Manrope. Brand typography remains restricted to approved BrandLockup usage.

Use semantic configured tokens only.

PROHIBITED:
- wedding-specific pink/rose/gold UI palette;
- floral UI decorations;
- raw theme values;
- glow;
- chrome;
- metallic gradients;
- decorative script typography;
- oversized wedding-style serif headings;
- ornamental wedding dividers.

Wedding personality comes from content and contextual photography, not a new visual system.

## 7. Hero

Use shared `ServiceHero` with:

```text
variant="full-bleed"
BaseLayout overHero={true}
```

Required content:
- `wedding.hero.eyebrow`;
- localized H1;
- localized description;
- primary booking action;
- secondary quote action;
- exactly three passive trust markers.

Trust keys:

```text
wedding.hero.trust.professionalChauffeur
wedding.hero.trust.manualConfirmation
wedding.hero.trust.customPlan
```

Required asset:

```text
src/assets/shared/other/weeding-day-kissing.webp
```

The image establishes unmistakable Wedding context while retaining the vehicle as part of the scene. It is decorative because adjacent copy carries the complete service meaning.

Crop:
- desktop: preserve couple, bouquet, and visible vehicle context;
- tablet: preserve couple and vehicle relationship;
- mobile: crop for impact but retain wedding + vehicle context.

Do not reuse this image as another high-prominence region.

## 8. Wedding Service Definition

Source: `overview`.

Answer immediately what the customer is booking.

Render localized heading, intro, body and exactly three concise principle lines:

1. chauffeur-driven principal transport;
2. guest/family transport where included;
3. one or more vehicles with waiting/return only when agreed.

Use an open dark composition. No detached cards.

## 9. Service Scope

Source: `sections[key=serviceScope]`.

Core message: **One principal vehicle or a coordinated transport plan.**

Exactly three authored items:
1. principal vehicle;
2. additional vehicles / guests;
3. waiting and return by agreement.

Canonical capability labels may supplement:
`multipleVehicles`, `mixedVehicleClasses`, `returnPossible`, `waitingPossible`.

Use shared `OccasionScope`.

## 10. Wedding-Day Story

Source: `sections[key=weddingDay]`.

Purpose: explain why Wedding Transportation differs from an ordinary point-to-point transfer.

Asset:

```text
src/assets/shared/other/e-class-outside-weeding-day.webp
```

Render an editorial split with five illustrative stages:
1. pickup;
2. ceremony;
3. photography / additional planned location;
4. celebration venue;
5. agreed return.

The sequence is illustrative, never mandatory. Actual transport follows the confirmed schedule.

Mobile DOM order: heading → copy → stages → image.

## 11. Fleet by Wedding Role

Use canonical VehicleRecommendations/Fleet infrastructure.

Vehicle IDs:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Wedding-role labels:

```text
wedding.vehicleRole.mercedesSClass
wedding.vehicleRole.mercedesEClass
wedding.vehicleRole.mercedesVClassExtraLong
wedding.vehicleRole.mercedesSprinter
```

They describe suitability, not exclusive assignment.

Do not duplicate capacity, luggage, features, prices, equipment or availability.

## 12. Couple & Guest Transportation

Source: `sections[key=guestTransport]`.

Core message: **The couple and guests do not need the same vehicle.**

Asset:

```text
src/assets/shared/other/v-class-outisde-weeding-day.webp
```

Exactly three groups:
1. couple / principal passengers;
2. family and smaller groups;
3. larger groups / several vehicles.

Claims gate against `coupleTransport`, `guestTransport`, `multipleVehicles`, `mixedVehicleClasses`.

This is a people-and-organisation section, not a second fleet catalogue.

## 13. Vehicle Presentation & Special Requests

Source: `sections[key=presentation]`.

Asset:

```text
src/assets/shared/other/s-class-with-flowers-special-occasion.webp
```

Gate: `customPresentationRequest === true`.

Copy MUST communicate:
- presentation requests are reviewed individually;
- decoration is not automatically included;
- the image is illustrative.

PROHIBITED: included flowers, ribbons, champagne, gifts, styling package or fixed wedding-decoration packages.

## 14. Wedding Transport Standards

Source: `sections[key=standards]`.

Use shared `OccasionStandards`.

Data-gated rows:
1. professional chauffeur;
2. prepared vehicle;
3. multi-vehicle coordination;
4. waiting/return by agreement;
5. presentation requests reviewed individually;
6. manual confirmation.

## 15. How Booking Works

Source: `sections[key=process]`.

Use shared `OccasionProcessSteps`.

Exactly three steps:
1. send the wedding plan;
2. receive the proposed transport organisation;
3. receive manually confirmed details.

Heading stays on dark background. Steps live in one light strip.

Below `lg`: stacked with internal horizontal dividers.  
At `lg+`: three columns with internal vertical dividers.

## 16. Wedding FAQ

FAQ is the only large light reading region.

Exactly six questions:
1. when to send the request;
2. guest transport;
3. multiple vehicles/classes;
4. waiting/return;
5. presentation/decoration requests;
6. manual confirmation.

No unsupported fixed lead time.

## 17. Final CTA

Reuse shared FinalCTA.

Hierarchy:
1. Wedding booking/request;
2. Request a Quote;
3. verified phone/email.

Final CTA is not Hero #2. Do not reuse Hero photography.

## 18. Surface rhythm

```text
DARK FULL-BLEED HERO
DARK OPEN SERVICE DEFINITION
DARK SERVICE SCOPE
DARK EDITORIAL WEDDING-DAY STORY
DARK FLEET
DARK GUEST TRANSPORT
DARK PRESENTATION FEATURE
DARK STANDARDS
DARK PROCESS + ONE LIGHT INNER STRIP
LIGHT FAQ
DARK FINAL CTA
DARK FOOTER
```

## 19. Responsive contract

Governed viewports:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

Mobile:
- full-bleed Hero;
- definition/scope stack;
- editorial splits become content-first;
- wedding-day stages vertical;
- fleet uses existing mobile behavior;
- guest/presentation media follow copy;
- standards one column;
- process stacked;
- zero overflow.

Tablet portrait:
- preserve content-first narrative;
- Hero crop preserves wedding + vehicle;
- process stays stacked.

1024+:
- editorial sections may use approved 7/5 or 6/6;
- standards may use 3×2;
- process uses three columns.

Wide desktop:
- active containers cap expansion;
- no extra columns.

## 20. Accessibility

WCAG 2.2 AA required:
- one H1;
- logical heading hierarchy;
- 44×44 targets;
- visible focus;
- no hover-only content;
- decorative contextual image alt;
- semantic wedding-day sequence;
- reduced motion;
- logical CSS;
- no horizontal overflow.

## 21. SEO

Target Wedding Transportation / Belgrade intent.

Use existing canonical/hreflang/Breadcrumb/Service structured-data architecture.

Do NOT add Event schema implying the company organizes weddings.

## 22. Prohibited outcomes

Fails if it contains:
- contained Hero;
- wedding-specific UI palette;
- wedding-planner language;
- party-limo styling;
- floral UI decoration;
- invented decoration package;
- fake price;
- instant confirmation;
- hardcoded contacts/fleet facts/routes;
- Wedding/Prom branches inside shared components;
- monolithic Wedding/Prom page abstraction;
- more than one large light reading region;
- Hero image reuse;
- mobile as collapsed desktop only.
