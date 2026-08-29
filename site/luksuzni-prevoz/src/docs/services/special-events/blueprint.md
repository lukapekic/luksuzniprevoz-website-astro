# Special Events Hub — Locked Blueprint V2

**Status:** LOCKED  
**Route key:** `specialEvents`  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system

This blueprint replaces the planning-level Special Events hub specification for page-specific decisions. Root `AGENTS.md` remains technical authority. `DESIGN.md` and the configured active Theme V2 token source remain visual-system authority.

## 1. Product objective

The page MUST sell Special Events Transportation as a managed occasion-transport service, not as a generic luxury-car page and not as a wedding-only page.

Before the fleet region, the page MUST establish:

- the service covers weddings, proms, VIP transport, and other special occasions;
- the customer can start with one important vehicle or a coordinated plan involving guests and multiple vehicles when the selected child service supports it;
- transport is organised around the confirmed event plan, locations, passenger groups, and timing;
- waiting, return journeys, and schedule changes are confirmed as part of the specific arrangement rather than implied as unlimited flexibility;
- complex event transport is manually reviewed and confirmed.

The intended character is:

`cinematic occasion transport + calm hospitality + precise coordination`

The page MUST NOT resemble a wedding-planner site, party-limousine site, nightlife page, event-ticket page, SaaS landing page, dashboard, black/gold luxury cliché, or repetitive card showcase.

## 2. Locked section order

1. Site Header
2. Special Events Hero
3. Special Events Proposition
4. Event Services
5. Other Occasions
6. Service Scope
7. Event Coordination Story
8. Fleet by Event Role
9. Event Standards
10. How Booking Works
11. Special Events FAQ
12. Final CTA
13. Site Footer

No section in this order is optional.

## 3. Data boundaries

Localized page content owns:

- headings;
- editorial prose;
- child-service commercial copy;
- CTA labels;
- FAQ copy;
- authored process steps;
- authored event-flow labels.

Canonical data owns:

- service relationships;
- child-service capabilities;
- pricing mode;
- route keys and localized paths;
- vehicle facts;
- contact details;
- operating standards;
- manual-confirmation rules;
- supported general special-event use cases.

`src/content/ui/{sr,en,ru}.json` owns reusable translated labels for canonical capabilities, operational facts, section labels, vehicle-role labels, and data-gated standard rows.

The page MUST NOT duplicate canonical service, fleet, contact, or operating truth in Astro components.

## 4. Theme contract

The configured active Black & Platinum theme is REQUIRED.

Production styling MUST use active semantic tokens for:

- color;
- typography;
- spacing;
- containers;
- radii;
- motion;
- focus treatment;
- responsive thresholds.

Headings MUST resolve to Inter Tight. Body and UI text MUST resolve to Manrope. Cormorant Garamond remains restricted to approved brand-lockup use.

Raw page-local palette values, raw spacing scales, raw radius values, metallic gradients, glow, chrome effects, gold-first styling, floral theme decoration, and event-specific color themes are PROHIBITED.

FAQ is the only large light page region. The How Booking Works section may contain one bounded light process panel on the dark page background.

## 5. Locked asset contract

All supplied page photography lives under:

`src/assets/shared/other/`

The implementation MUST use these normalized target names and roles:

```text
s-class-driving-forest-intheback.webp
→ full-bleed Special Events Hero

e-class-outside-weeding-day.webp
→ Wedding service card

v-class-interior.webp
→ Prom service card TEMPORARY BACKUP

s-class-interior-driver-side.webp
→ VIP service card

v-class-outisde-weeding-day.webp
→ Event Coordination Story media
```

These assets are reserved for the Wedding child page and MUST NOT render on the hub:

```text
s-class-with-flowers-special-occasion.webp
weeding-day-kissing.webp
```

### Prom temporary-media rule

`v-class-interior.webp` is the only approved temporary Prom substitution.

When a dedicated Prom/event-arrival photograph is supplied:

- replace only the Prom asset mapping;
- preserve the Prom card copy;
- preserve card topology;
- preserve responsive behavior;
- preserve capability labels;
- do not redesign the section.

The temporary image MUST NOT be reused elsewhere on this hub while it serves the Prom card.

### Image accessibility

All five hub photographs are decorative because adjacent localized text carries the full page meaning. Render empty alt text and remove them from the accessibility tree according to the approved image contract.

## 6. Special Events Hero

Use shared `ServiceHero / full-bleed` as the first page region and pass `overHero={true}` to `BaseLayout`.

Render:

- `specialEvents.hero.eyebrow` from `content/ui`;
- H1 from `hero.title`;
- description from `hero.description`;
- primary CTA from `hero.primaryCta`;
- secondary CTA from `hero.secondaryCta`;
- exactly three passive trust markers from `content/ui`.

Required trust keys:

- `specialEvents.hero.trust.professionalChauffeur`
- `specialEvents.hero.trust.eventPlan`
- `specialEvents.hero.trust.manualConfirmation`

Primary CTA MUST target `#event-services`.

Secondary CTA MUST use the existing quote flow.

Hero image MUST be `s-class-driving-forest-intheback.webp`.

The Hero MUST remain category-neutral. It MUST NOT contain wedding-specific, prom-specific, or VIP-specific decorative language.

Hero imagery uses the approved image-backed layer model: media → scrim → content → over-Hero Header.

The scrim MUST preserve text contrast and visually control the green background without introducing a new color theme.

## 7. Special Events Proposition

Use:

- `overview.heading`;
- `overview.body`;
- exactly three `overview.items`.

The three proposition principles are:

1. principal passenger or couple;
2. guests and groups;
3. one agreed event schedule.

Render the principles as open rows/columns with quiet internal dividers. Detached dashboard cards are PROHIBITED.

The proposition MUST explain the category before asking the visitor to choose a child service.

## 8. Event Services — P0 commercial region

Section id: `event-services`

Exactly three destination cards MUST render in this order:

1. `weddingTransportation`
2. `promTransportation`
3. `vipTransportation`

Every card MUST render:

- generated index `01`, `02`, `03`;
- locked contextual image;
- localized title;
- localized body;
- exactly three active canonical capability labels translated through `content/ui`;
- localized CTA;
- one route-map-driven link.

All commercial information remains visible without hover.

The cards MUST be more image-led than the Business hub cards, but remain part of the same Theme V2 system.

### 8.1 Wedding capability labels

Read `getService("weddingTransportation")`.

Render only active capabilities:

```text
coupleTransport → specialEvents.capability.coupleTransport
guestTransport → specialEvents.capability.guestTransport
multipleVehicles → specialEvents.capability.multipleVehicles
```

Card media:

`e-class-outside-weeding-day.webp`

Do not render unsupported gifts, champagne, decorations-as-included, unlimited waiting, or automatic vehicle availability.

### 8.2 Prom capability labels

Read `getService("promTransportation")`.

Render only active capabilities:

```text
individualAndGroup → specialEvents.capability.individualAndGroup
multipleVehicles → specialEvents.capability.multipleVehicles
returnPossible → specialEvents.capability.returnByAgreement
```

Card media:

`v-class-interior.webp` — temporary approved backup.

The card MUST NOT borrow wedding flowers, wedding-couple imagery, party-limousine imagery, alcohol imagery, or nightlife styling.

### 8.3 VIP capability labels

Read `getService("vipTransportation")`.

Render only active facts:

```text
privacy → specialEvents.capability.privacy
discretion → specialEvents.capability.discretion
pricingMode includes "quote" → specialEvents.capability.individualQuote
```

Card media:

`s-class-interior-driver-side.webp`

Security, guards, bodyguards, close protection, escort services, and security-service implications are PROHIBITED.

## 9. Other Occasions

Source: `sections[key=otherOccasions]` plus canonical `specialEvents.generalUseCases`.

The section MUST explicitly prevent users with unlisted occasions from leaving the page after the three specialist cards.

Render canonical use cases only:

```text
birthdays → specialEvents.occasion.birthdays
private-parties → specialEvents.occasion.privateParties
galas → specialEvents.occasion.galas
other-special-events → specialEvents.occasion.other
```

The section CTA uses the authored general event-request flow.

Visual treatment:

- compact contained dark elevated strip;
- explanatory copy and CTA on one side;
- occasion list on the other side at desktop;
- no large light background;
- no event icons;
- no image required.

## 10. Service Scope

Source: `sections[key=serviceScope]`.

Heading intent: one vehicle or coordinated transport for the entire event.

Render exactly two authored items:

1. one important arrival;
2. coordinated event transport.

This section explains scale without claiming every event requires multiple vehicles.

At `lg` and above use an approved 5/7 split:

- heading/intro/body in the 5-column region;
- two numbered divided rows in the 7-column region.

The two items remain on the dark theme. Do not create two floating cards and do not introduce a large light panel.

Below `lg`, explanatory copy precedes both rows.

## 11. Event Coordination Story

Source: `sections[key=eventCoordination]`.

Use an editorial 7/5 split at `lg` and above.

Content side renders all five authored event phases in order:

1. pickup;
2. principal arrival;
3. guests/group arrival;
4. arranged waiting or additional location;
5. planned return.

The sequence is illustrative. It MUST NOT create a universal event timetable or promise waiting where it has not been confirmed.

Media:

`v-class-outisde-weeding-day.webp`

Render through Astro's image pipeline with:

- `object-fit: cover`;
- semantic section/media radius;
- intentional focal point;
- no text overlay;
- no surrounding card;
- lazy loading below the fold.

Mobile DOM order:

`heading → copy → event phases → media`

## 12. Fleet by Event Role

Required vehicle IDs:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Canonical vehicle facts come only from fleet data.

Event-role labels come from:

```text
specialEvents.vehicleRole.mercedesSClass
specialEvents.vehicleRole.mercedesEClass
specialEvents.vehicleRole.mercedesVClassExtraLong
specialEvents.vehicleRole.mercedesSprinter
```

The page MUST NOT duplicate capacity, luggage, class, equipment, or price facts.

The role labels are contextual suitability copy, not hard service assignment. They MUST NOT imply that a model is guaranteed for a category before confirmation.

## 13. Event Standards

Source: `sections[key=standards]`.

Heading, intro, and body come from localized page content.

Render these five rows only when their canonical gates are active:

1. professional chauffeur;
2. discretion;
3. multi-vehicle organisation;
4. arranged waiting and return;
5. manual confirmation.

Required UI keys:

```text
specialEvents.standard.professionalChauffeur.*
specialEvents.standard.discretion.*
specialEvents.standard.multiVehicle.*
specialEvents.standard.waitingReturn.*
specialEvents.standard.manualConfirmation.*
```

Gating:

- professional chauffeur → canonical chauffeur dress/operations data;
- discretion → canonical chauffeur discretion training or VIP discretion capability;
- multi-vehicle → Wedding `multipleVehicles` OR Prom `multipleVehicles` OR VIP `multiVehicle`;
- waiting/return → active Wedding/Prom waiting/return capabilities;
- manual confirmation → canonical booking confirmation mode.

At `lg` and above use a 5/7 explanatory-content / divided-row composition. Below `lg`, copy precedes the rows.

Five detached cards are PROHIBITED.

Do not render generic luxury-amenity lists in this section.

## 14. How Booking Works

Source: `sections[key=process]`.

Render exactly three authored steps:

1. send the date and plan;
2. receive the proposed organisation;
3. receive confirmed transport details.

The section remains compact and dark.

The heading remains on the open dark page background. All three steps render inside one shared light elevated strip.

Below `lg`:

- one column;
- horizontal internal dividers only.

At `lg` and above:

- three equal columns;
- vertical internal dividers only.

Individual process cards and outer item borders are PROHIBITED.

The copy MUST state that basic event details are enough to start. It MUST NOT require the customer to decide vehicle count before enquiry.

No instant-confirmation language is allowed.

## 15. Special Events FAQ

FAQ is the only large light region.

Exactly six localized FAQ items render.

The FAQ MUST cover:

- choosing Wedding/Prom/VIP versus a general occasion request;
- multi-vehicle organisation;
- guest/group transport;
- waiting and return journeys;
- schedule changes;
- manual booking confirmation.

Answers MUST stay capability-specific.

Do not use `Event` structured data. This page sells transportation for events; it does not publish an event listing.

Reuse the current visible FAQ and FAQPage structured-data path.

## 16. Final CTA

Reuse the approved shared `FinalCTA`.

CTA hierarchy:

1. primary event/booking action;
2. secondary Request a Quote;
3. tertiary verified phone and email from canonical contact data.

The content MUST reduce form anxiety by stating that the customer can start with:

- date;
- locations;
- approximate timing;
- passenger count;
- event type.

Vehicle selection is not required before the initial enquiry.

The secondary CTA MUST NOT become a phone button.

Final CTA MUST NOT become Hero #2.

## 17. Booking-flow contract

The page uses the existing content CTA flow keys:

```text
booking
quote
```

The current CTA resolver routes both flow targets to the localized Contact route with their canonical intent parameters.

The implementation MUST NOT create a page-local booking form, duplicate form state, or invent a temporary booking route.

When the real booking workflow is introduced, the page continues to use the canonical flow target without structural redesign.

## 18. Responsive contract

Required governed viewports:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

Every state MUST preserve:

- exact content order;
- readable measure;
- meaningful image crop;
- CTA hierarchy;
- logical focus order;
- zero accidental page overflow;
- 44×44 CSS px minimum interactive targets.

### Mobile — 320×568

- full-bleed Hero with over-Hero Header;
- hero CTAs stack where width requires it;
- proposition principles stack;
- all three event-service cards stack;
- Other Occasions copy/CTA precedes occasion labels;
- Service Scope explanatory copy precedes both rows;
- Event Coordination phases precede media;
- standards remain one divided list;
- process light strip stacks;
- no commercial information depends on hover.

### Tablet portrait — 768×1024

- Hero remains full-bleed;
- Wedding card spans the first service row;
- Prom and VIP share the second row;
- Other Occasions can use two columns when readable;
- Service Scope remains stacked copy → rows;
- Event Coordination remains copy/phases → media;
- standards remain copy → divided list;
- process remains stacked inside one light panel.

### Tablet landscape and desktop — 1024×768+

- service cards render three columns;
- Service Scope uses 5/7 split;
- Event Coordination uses 7/5 split;
- Other Occasions uses explanatory/list split;
- Event Standards uses 5/7 split;
- process uses one three-column light strip.

### Wide desktop

At 1440 px and 1920 px, content remains inside active containers and reading measures. Do not add columns, enlarge text beyond tokens, or stretch photography solely to fill width.

## 19. Accessibility

WCAG 2.2 AA is REQUIRED.

- exactly one H1;
- logical H2/H3 hierarchy;
- semantic landmarks;
- keyboard-operable links;
- visible focus;
- 44×44 CSS px minimum targets;
- one clear interactive route link per service card;
- no nested interactive controls;
- no hover-only content;
- decorative imagery uses empty alt;
- event sequence remains semantic text;
- reduced-motion behavior;
- logical CSS properties.

## 20. SEO and indexability

The installed localized content targets broad Special Events transportation intent. Child pages own specific Wedding, Prom, and VIP intent.

Required internal service links:

- Wedding Transportation;
- Prom Transportation;
- VIP Transportation;
- Fleet through the fleet CTA;
- booking/quote flow through Hero/Other Occasions/Final CTA.

Use existing WebPage/Service/Breadcrumb/FAQ conventions only where already supported by project SEO infrastructure.

Do not create:

- fake prices;
- fake reviews;
- aggregate ratings;
- Event schema;
- fake offers;
- invented service areas;
- unsupported decorations or amenities.

The final installed content is indexable. Do not retain the old work-in-progress `noindex: true` flag after the page passes this V2 acceptance contract.

## 21. Prohibited outcomes

The implementation fails this blueprint if it contains:

- a contained generic Hero;
- a wedding-specific Hero;
- service cards without photography;
- a Prom card using wedding-couple or floral wedding media;
- more than the approved temporary Prom image substitution;
- wedding-couple imagery on this hub;
- repeated reuse of the same photograph across high-prominence hub roles;
- event icons or generic SaaS feature cards;
- a large light Other Occasions section;
- a dashboard-style logistics diagram;
- unlimited-waiting claims;
- instant-confirmation claims;
- security/close-protection claims;
- generic amenity marketing;
- duplicated fleet facts;
- hardcoded localized URLs;
- raw page-local theme values;
- a generic `HubPage` abstraction;
- a page-local booking form;
- a second-Hero Final CTA;
- mobile layouts that are only collapsed desktop layouts.
