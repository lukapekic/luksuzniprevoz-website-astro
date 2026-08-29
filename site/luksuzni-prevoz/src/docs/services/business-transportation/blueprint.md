# Business Transportation Hub — Locked Blueprint V2

**Status:** LOCKED  
**Route key:** `businessTransportation`  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system

This blueprint replaces the previous Business Transportation redesign draft. Root `AGENTS.md` remains technical authority. `DESIGN.md` and the configured active theme token source remain visual-system authority.

## 1. Product objective

The page MUST sell Business Transportation as a managed business-mobility service, not a generic chauffeur page.

Before the fleet region, the page MUST establish:

- transport is organised around a business schedule, not only a route;
- three specialist services cover distinct business use cases;
- complex requests can involve several vehicles, locations, arrivals, and schedule changes when the selected child service supports them;
- executive presentation, discretion, and operational coordination are separate parts of the service.

The intended character is:

`corporate concierge + executive mobility + operational coordination`

The page MUST NOT resemble a generic limousine template, SaaS landing page, dashboard, black/gold luxury cliché, silver/blue corporate template, or repetitive card showcase.

## 2. Locked section order

1. Site Header
2. Business Hero
3. Business Proposition
4. Business Services
5. Engagement Model
6. Coordination Story
7. Approved Client Proof
8. Fleet by Business Role
9. Business Standards
10. How It Works
11. Business FAQ
12. Final CTA
13. Site Footer

Approved Client Proof is conditional. If canonical client data resolves to zero publicly displayable logo assets with verified usage rights, the entire region MUST be absent.

## 3. Data boundaries

Localized page content owns headings, editorial prose, CTA labels, FAQ copy, timeline labels, and explanatory copy.

Canonical data owns service capabilities, service relationships, routes, vehicle facts, pricing, contact details, client identities, client-logo state, display permissions, and operational standards.

`content/ui/{sr,en,ru}.json` owns reusable translated labels for canonical capabilities and operational facts.

The hub MUST NOT duplicate capability truth.

## 4. Theme contract

The configured active Black & Platinum theme is REQUIRED.

Production styling MUST use active semantic tokens for color, typography, spacing, containers, radii, motion, and focus.

Headings MUST resolve to Inter Tight. Body and UI text MUST resolve to Manrope. Cormorant Garamond remains restricted to approved brand-lockup usage.

Raw palette values, raw spacing scales, raw radius scales, metallic gradients, glow, chrome effects, blue-corporate styling, and gold-first styling are PROHIBITED.

FAQ is the only large light-surface region.

## 5. Business Hero

Use shared `ServiceHero / full-bleed` as the first page region and pass
`overHero={true}` to `BaseLayout`. The image covers the full Hero canvas at all
governed states; copy remains inside the active page container and the Header
uses its approved transparent-over-Hero state.

Render:

- `business.hero.eyebrow` from `content/ui`;
- H1 from `hero.title`;
- description from `hero.description`;
- primary CTA from `hero.primaryCta`;
- secondary CTA from `hero.secondaryCta`;
- three passive trust markers from `content/ui`.

Required trust keys:

- `business.hero.trust.professionalChauffeur`
- `business.hero.trust.manualConfirmation`
- `business.hero.trust.discretion`

Primary CTA MUST target `#business-services`.

Secondary CTA MUST use the existing quote flow.

Hero trust markers MUST NOT claim multi-vehicle service as a universal rule.

## 6. Business Proposition

Use `overview.heading`, `overview.body`, and exactly three `overview.items`.

The three proposition principles are:

1. schedule first;
2. one vehicle or several when the selected service supports it;
3. discreet professional service.

Render principles as open rows or columns with dividers. Three detached dashboard cards are PROHIBITED.

## 7. Business Services — P0 commercial region

Section id: `business-services`

Exactly three destination cards MUST render in this order:

1. `corporateTransportation`
2. `delegationTransportation`
3. `conferenceCongressTransportation`

Every card renders:

- generated index `01`, `02`, `03`;
- contextual image or approved neutral media placeholder;
- localized title;
- localized body;
- canonical capability labels translated through `content/ui`;
- localized CTA;
- one route-map-driven link.

All commercial information remains visible without hover.

### Corporate capability labels

Render only active canonical capabilities:

- `supportsOneOff` → `business.commercial.oneOff`
- `supportsRecurringContracts` → `business.commercial.recurring`
- `supportsInvoicing` → `business.capability.invoicing`
- `supportsNegotiatedPricing` → `business.capability.negotiatedPricing`

Hourly, half-day, full-day, and Roadshow chips are PROHIBITED on this hub card.

### Delegation capability labels

Render only active canonical capabilities:

- `multipleVehicles` → `business.coordination.multipleVehicles`
- `mixedVehicleClasses` → `business.coordination.mixedVehicleClasses`
- `dedicatedCoordinator` → `business.coordination.dedicatedCoordinator`

Airport-arrival, private-aviation, security, and protection chips are PROHIBITED.

`securityService = false` is a hard absence.

### Conference & Congress capability labels

Render only active canonical capabilities:

- `airportArrivals` → `business.coordination.airportArrivals`
- `hotelTransfers` → `business.coordination.hotelTransfers`
- `venueShuttles` → `business.coordination.venueShuttles`
- `multiVehicleSchedules` → `business.coordination.multiVehicleSchedules`

Additional labels require an active capability and an approved localized UI key.

## 8. Engagement Model

Source: `sections[key=engagementModel]`

Heading: `Jedan zahtev ili kontinuirana korporativna saradnja`

The section MUST distinguish a single business transport request from recurring Corporate Transportation.

Recurring-contract, invoicing, and negotiated-commercial-term claims remain tied to `corporateTransportation`.

The contextual CTA routes to `corporateTransportation`.

The section remains a contained dark elevated region. At the active `lg`
threshold it uses a 5/7 split: eyebrow, heading, intro/body, and the contextual
CTA remain in the left explanatory column; the two engagement items occupy one
shared light panel in the right column. Below `lg`, the explanatory content and
CTA precede the panel.

The light panel uses the shared TrustStrip visual language without reusing or
modifying the fixed four-item TrustStrip component. It contains two stacked
rows, restrained `01` / `02` markers, and one internal horizontal divider. It
MUST NOT render two detached cards, outer item borders, or a shadow-heavy
treatment.

## 9. Coordination Story

Source: `sections[key=coordination]`

Heading: `Kada jedan automobil više nije dovoljan`

Use an editorial split with contextual media.

The contextual media is the repository asset `src/assets/hero-example.jpg`,
rendered through Astro's asset pipeline with an `object-cover` crop, the normal
semantic section radius, no text overlay, and no additional surrounding card.
The image is decorative because the adjacent localized copy carries the full
meaning.

Render all five `items` as a semantic schedule timeline.

The timeline is illustrative and MUST NOT create unsupported guarantees.

Same-chauffeur continuity is tied only to Corporate Transportation `dedicatedChauffeurAcrossStops`.

Multi-vehicle language is tied only to child services whose canonical capability set supports it.

Generic Business flight tracking is PROHIBITED. Flight tracking remains an Airport Transportation capability.

## 10. Approved Client Proof

Source: `sections[key=trustedClients]`

Canonical source: `src/data/clients.ts`.

Render only when:

- Business Transportation placement is active;
- a real `logoAsset` exists;
- public display is approved;
- usage-permission requirements are satisfied.

Current approved logo assets are:

- `president-palace-hotel`;
- `hyatt-regency`;
- `qatar-airways`;
- `square-nine-hotels`.

The Chinese Embassy record remains unapproved and MUST NOT render.

Placeholder logos, fake brand tiles, invented endorsements, and testimonials are PROHIBITED.

## 11. Fleet by Business Role

Required vehicle IDs:

- `mercedes-s-class`
- `mercedes-e-class`
- `mercedes-v-class-7-plus-1-extra-long`
- `mercedes-sprinter`

Canonical vehicle facts come only from fleet data.

Business-role labels come from:

- `business.vehicleRole.mercedesSClass`
- `business.vehicleRole.mercedesEClass`
- `business.vehicleRole.mercedesVClassExtraLong`
- `business.vehicleRole.mercedesSprinter`

The page MUST NOT duplicate capacity, luggage, class, price, or equipment facts.

## 12. Business Standards

Source: `sections[key=standards]`

Heading and intro come from page content.

The six standard rows are data-gated UI rows:

1. professional chauffeur;
2. discretion;
3. multi-vehicle coordination;
4. mixed vehicle classes;
5. chauffeur continuity across connected Corporate stops;
6. manual request confirmation.

The first five rows render only when their canonical condition is active.

Flight tracking is PROHIBITED in this section.

Use open grouping or one contained surface with separators. Six detached dashboard cards are PROHIBITED.

## 13. How It Works

Source: `sections[key=process]`.

The heading remains on the open dark page background. All three authored items
render inside one shared light elevated strip with restrained `01`, `02`, `03`
markers. At `lg` and above, the strip uses three equal columns with internal
vertical dividers only. Below `lg`, it uses one column with internal horizontal
dividers only. Individual process cards and outer item borders are PROHIBITED.

Engagement and How It Works share one page-local low-level
`BusinessDividedPanel` visual primitive. The fixed four-item global TrustStrip
contract remains unchanged.

Exactly three steps render:

1. send the schedule;
2. receive the proposed organisation;
3. receive confirmed transport details.

The section remains compact and dark.

## 14. Business FAQ

FAQ remains the only large light region.

Answers about recurring arrangements, invoicing, and same-chauffeur continuity MUST explicitly identify Corporate Transportation.

Answers about multiple vehicles MUST identify the relevant Delegation or Conference & Congress service context.

Generic Business flight-tracking claims are PROHIBITED.

## 15. Final CTA

Reuse the approved shared `FinalCTA`.

CTA hierarchy:

1. primary business/booking action;
2. secondary Request a Quote;
3. tertiary verified phone and email from canonical contact data.

The secondary CTA MUST NOT become a phone button.

Final CTA MUST NOT become a second hero.

## 16. Responsive contract

Required governed viewports:

- 320×568
- 768×1024
- 1024×768
- 1440×900
- 1920×1080

Every state MUST preserve exact content order, readable measure, image focal point, CTA placement, logical focus order, zero accidental page overflow, and 44×44 CSS px minimum targets.

### Mobile

- full-bleed Hero with over-Hero Header;
- service cards stack;
- coordination narrative/timeline precede media;
- standards use one column;
- process stacks;
- essential information never depends on hover.

### Tablet portrait

At 768 px, the first service card spans the row and cards two and three render
side by side. Standards use two columns, client logos use two columns, and the
process remains stacked. Engagement uses two columns.

### Tablet landscape and desktop

At 1024 px and above, services render in three columns, coordination uses a
7/5 split, standards render 3×2, client logos render four columns, and process
uses a three-step row.

### Wide desktop

At 1440 px and 1920 px, content stays inside the active main container and
reading measures; topology does not add columns or reorder content.

## 17. Accessibility

WCAG 2.2 AA is REQUIRED.

- one H1;
- logical H2/H3 hierarchy;
- semantic landmarks;
- keyboard operability;
- visible focus;
- 44×44 CSS px minimum targets;
- one clear interactive link per service card;
- no nested interactive controls;
- no hover-only content;
- localized informative alt text;
- empty decorative alt text;
- semantic timeline;
- reduced-motion behavior;
- logical CSS properties.

## 18. Prohibited outcomes

The implementation fails this blueprint if it contains:

- small generic service utility cards;
- a giant light Engagement Model panel;
- more than one large light content region;
- unsupported Corporate hourly/half-day/full-day/Roadshow chips;
- unsupported Delegation airport/private-aviation/security chips;
- generic Business flight tracking;
- fake client proof;
- duplicated fleet facts;
- hardcoded localized routes;
- raw page-local theme values;
- a generic `HubPage` abstraction created for this redesign;
- a second-hero Final CTA;
- mobile layouts that are only collapsed desktop layouts.
