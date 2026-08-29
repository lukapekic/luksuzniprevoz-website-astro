# Prom Transportation — Locked Blueprint V2

**Status:** LOCKED TARGET CONTRACT — CODE-SYNCHRONIZED 2026-08-29  
**Route key:** `promTransportation`  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system

Root `AGENTS.md` remains technical authority. `DESIGN.md` and configured Theme V2 remain visual authority.
Validated schemas, canonical data, and reviewed shared component APIs define
the current implementation baseline. The route/content publication state is
independent from completion of this dedicated page UI.

## 1. Product objective

The page MUST sell Prom Transportation as chauffeur-driven transportation built around a clear pickup plan, passenger count and selected vehicle arrangement.

Before the Fleet region, the visitor MUST understand:

- this is professional chauffeur transportation for a prom/graduation evening;
- the service supports an individual passenger, a pair, a group, or several vehicles when confirmed;
- pickup time/location are agreed before the event;
- return transport and waiting are included only when requested and confirmed;
- a vehicle preference can be submitted but availability is manually confirmed;
- presentation requests can be submitted for review;
- booking is manually confirmed.

The intended character is:

`premium arrival + simple planning + professional execution`

Prom MUST feel younger and faster than Wedding Transportation while clearly belonging to the same site.

It MUST NOT resemble a nightclub, party-limousine service, teen-party template, red-carpet/celebrity service, or Wedding page with only nouns changed.

## 2. Conversion objective

Primary: Prom transport request / booking flow.  
Secondary: Request a Quote.

Ready-to-convert visitors see the booking action immediately; the rest of the page explains the service and removes uncertainty before the final handoff.

## 3. Locked section order

1. Site Header
2. Full-Bleed Prom Hero
3. Prom Service Definition
4. Planning Scope
5. Prom Arrival Story
6. Fleet by Prom Role
7. Individual or Group Arrival
8. Vehicle Presentation & Detail Requests
9. Prom Transport Standards
10. How Booking Works
11. Prom FAQ
12. Final CTA
13. Site Footer

No region may be silently removed, merged or reordered.

## 4. Data boundaries

Localized page content owns headings, intros, editorial copy, authored arrival stages, CTA labels and FAQ copy.

Canonical data owns pricing mode, service capabilities, fleet truth, route relationships, operational chauffeur/vehicle standards, contact details and confirmation behavior.

`content/ui/{sr,en,ru}.json` owns Hero labels/trust markers, section labels, shared Occasion capability/standard labels and Prom vehicle-role labels.

## 5. Shared Wedding/Prom architecture

Prom is the second consumer of the shared Occasion layer.

Reuse:

- ServiceHero;
- OccasionServiceDefinition;
- OccasionScope;
- VehicleRecommendations;
- OccasionStandards;
- OccasionProcessSteps;
- FAQ;
- FinalCTA;
- foundation layout primitives.

Prom-local:

- PromArrivalStory;
- PromGroupArrival;
- PromPresentation;
- PromTransportationPage.

Do not copy Wedding shared markup into Prom. Do not broaden shared APIs unless Prom exposes a stable semantic requirement valid for both consumers.

## 6. Theme contract

Theme V2 Black & Platinum is REQUIRED.

Headings → Inter Tight. Body/UI → Manrope. Brand typography remains restricted to approved BrandLockup usage.

Prom photography may contain richer event color, but UI remains graphite, off-white and restrained platinum.

PROHIBITED:

- magenta/red UI accents derived from imagery;
- neon/glow/club styling;
- event-color gradients;
- script typography;
- star/sparkle decoration;
- gold-first treatment;
- party-style pills.

## 7. Full-Bleed Hero

Use shared `ServiceHero` with `variant="full-bleed"` and `BaseLayout overHero={true}`.

Render:

- `prom.hero.eyebrow`;
- localized H1 and description;
- primary booking CTA;
- secondary quote CTA;
- exactly three passive trust markers.

Trust keys:

```text
prom.hero.trust.professionalChauffeur
prom.hero.trust.manualConfirmation
prom.hero.trust.plannedPickup
```

Required image:

```text
src/assets/shared/other/prom-holding-flowers-mercedes-bg.webp
```

The scrim MUST integrate the saturated formal-event photography into Theme V2. Image colors MUST NOT become interface accents.

Start with the existing shared `ServiceHero` full-bleed crop and scrim
contract. Verify its existing focal behavior at all governed states. If the
vehicle/formal-event context or copy contrast fails, do not apply page CSS to
shared internals: treat any new focal-point API as a shared-component change,
run consumer-impact checks, and re-verify Wedding.

Crop priority:

1. retain Mercedes/vehicle identity;
2. retain bouquet/formal-attire context;
3. preserve a legible copy region;
4. never crop to an abstract dress-only photograph.

Image is decorative because adjacent copy carries full service meaning.

## 8. Prom Service Definition

Source: `overview`.

Purpose: answer **what exactly am I booking?**

Render localized heading, intro, body and exactly three principles:

1. premium vehicle + professional chauffeur;
2. individual/pair/group transport;
3. agreed pickup with return/waiting only when confirmed.

Use shared `OccasionServiceDefinition` and open/divider-led composition. Detached feature cards are prohibited.

## 9. Planning Scope

Source: `sections[key=serviceScope]`.

Use shared `OccasionScope`.

Purpose: explain what is agreed before the evening:

1. pickup place/time;
2. passenger/group plan;
3. return/waiting if required.

Canonical Prom capabilities supplement authored copy:

```text
individualAndGroup
multipleVehicles
mixedVehicleClasses
returnPossible
waitingPossible
pricingMode includes "quote"
```

These render as exactly six active capability labels. The presentation-request
capability does not render in this list because it owns the dedicated
Presentation section.

This is explanation, not a form or pricing configurator.

## 10. Prom Arrival Story

Source: `sections[key=arrivalStory]`.

Core message: **The arrival is part of the evening.**

Required image:

```text
src/assets/shared/other/prom-closeup-mercedes-background.webp
```

Exactly four illustrative stages:

1. pickup;
2. chauffeur-driven journey;
3. arrival at the confirmed venue;
4. agreed return when included.

The story can communicate not needing to drive/park personally, but MUST NOT promise crowd attention, celebrity treatment, red-carpet access, venue priority or unlimited waiting.

No large text overlay on the image.

## 11. Fleet by Prom Role

Reuse canonical VehicleRecommendations/Fleet infrastructure.

Required IDs:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Prom role labels:

```text
prom.vehicleRole.mercedesSClass
prom.vehicleRole.mercedesEClass
prom.vehicleRole.mercedesVClassExtraLong
prom.vehicleRole.mercedesSprinter
```

Suitability labels are not exclusive assignments. Do not duplicate capacity, luggage, price, equipment or availability.

## 12. Individual or Group Arrival

Source: `sections[key=groupArrival]`.

Core message: **One vehicle or arrive with your group.**

Required image:

```text
src/assets/shared/other/v-class-interior.webp
```

Canonical gates:

```text
individualAndGroup
multipleVehicles
mixedVehicleClasses
```

Exactly three authored groups:

1. individual/pair;
2. group travelling together;
3. several vehicles for a larger/split group.

This is a passenger-arrangement section, not another Fleet catalogue. Do not repeat capacities.

## 13. Vehicle Presentation & Detail Requests

Source: `sections[key=presentation]`.

Required image:

```text
src/assets/shared/other/flowers-on-console.webp
```

Gate: `customPresentationRequest === true`.

Core message: **The vehicle is prepared for the agreed arrival.**

Visible content MUST state that requests are reviewed individually and styling/decorative details are not automatically included. The photograph is illustrative.

PROHIBITED claims: included flowers, decoration, champagne, red carpet, gifts, custom lighting or entertainment.

## 14. Prom Transport Standards

Source: `sections[key=standards]`.

Reuse `OccasionStandards`.

Data-gated rows:

1. professional chauffeur;
2. prepared vehicle;
3. individual/group capability;
4. multi-vehicle coordination;
5. waiting/return by agreement;
6. manual confirmation.

Keep the section operational and restrained. Do not introduce party-oriented amenity/icon lists.

## 15. How Booking Works

Source: `sections[key=process]`.

Reuse `OccasionProcessSteps`.

Exactly three steps:

1. send date/pickup/passenger details;
2. confirm transport/vehicle organisation;
3. receive manually confirmed pickup details.

Heading stays on dark background. Steps render in one shared light strip. Stacked below `lg`, three equal columns at `lg+`.

## 16. Prom FAQ

FAQ is the only large light reading region.

Exactly six localized questions covering:

1. individual/pair booking;
2. vehicle preference;
3. several vehicles;
4. waiting/return;
5. presentation requests;
6. manual confirmation.

Do not invent rules around age, parental consent, school policy, alcohol or venue access.

## 17. Final CTA

Reuse shared FinalCTA.

Primary → Prom request/booking flow.  
Secondary → Request a Quote.  
Tertiary → verified canonical phone/email.

Ask for date, pickup location/time, passenger count, vehicle preference and waiting/return needs.

Final CTA must not become Hero #2.

## 18. Surface rhythm

```text
DARK FULL-BLEED HERO
DARK OPEN DEFINITION
DARK SCOPE
DARK EDITORIAL ARRIVAL STORY
DARK FLEET
DARK GROUP-ARRIVAL STORY
DARK PRESENTATION FEATURE
DARK STANDARDS
DARK PROCESS + ONE LIGHT INNER STRIP
LIGHT FAQ
DARK FINAL CTA
DARK FOOTER
```

No additional large light region.

## 19. Responsive contract

Governed viewports:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

### Mobile

- Hero full-bleed and concise;
- crop keeps formal-event + Mercedes context;
- definition/scope stack;
- arrival story content/stages precede media;
- Fleet uses approved mobile behavior;
- group-arrival content precedes media;
- presentation content/CTA precede media;
- standards single column;
- process stacked light strip;
- zero page overflow.

### Tablet portrait

Maintain content-first editorial order. Do not force desktop split when measures are weak. Process remains stacked.

### Active `lg` threshold and above

- Arrival Story uses content 7 / media 5.
- Individual or Group Arrival uses content 7 / media 5.
- Presentation uses media 5 / content 7 while preserving content-first DOM order.
- Standards use a 3×2 matrix.
- Process becomes three equal columns.

### Active `md` to below `lg`

- Standards use a 2-column matrix.
- Process remains stacked.
- Editorial regions remain content-first and stacked.

### Wide desktop

No topology expansion. Main/reading containers cap width. Images preserve intentional crop.

## 20. Accessibility

WCAG 2.2 AA required: one H1, logical heading order, 44×44 targets, visible focus, keyboard operation, no hover-only content, correct decorative image alt behavior, semantic arrival stages, reduced motion, logical CSS properties and no overflow.

## 21. SEO

Target specific Prom/graduation transportation intent with Belgrade/local relevance.

Use unique localized metadata. Follow existing direct-service schema conventions. Do not use Event schema implying Luxury Transportation organizes the prom itself.

The route and all three locale entries are published and indexable for preview.
Canonical, hreflang, sitemap and robots behavior remain generated from the
route/content architecture. Dedicated-page acceptance is still pending until
the Prom renderer and tests are complete.

## 22. Prohibited outcomes

Implementation fails if it contains:

- contained Hero;
- Wedding imagery substituted for available Prom imagery;
- Wedding copy reused unchanged;
- nightclub/party-limo/celebrity styling;
- fake price;
- instant confirmation;
- hardcoded vehicle/contact data;
- raw localized URLs;
- duplicated shared Occasion components;
- Prom/Wedding branches inside shared components;
- more than one large light reading region;
- mobile layout that is only collapsed desktop.
