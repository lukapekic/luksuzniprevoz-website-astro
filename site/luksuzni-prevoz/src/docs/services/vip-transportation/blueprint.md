# VIP Transportation — Locked Blueprint V1

**Status:** LOCKED TARGET CONTRACT — READY FOR IMPLEMENTATION  
**Route key:** `vipTransportation`  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system  
**Prepared:** 2026-08-30

Root `AGENTS.md` remains technical authority. `DESIGN.md` and the configured active theme remain visual authority. Validated schemas, canonical data and reviewed shared component APIs define the implementation baseline.

## 1. Product objective

The page MUST sell VIP Transportation as discreet, chauffeur-driven transportation organised around an important guest and a confirmed itinerary.

Before the Fleet region, the visitor MUST understand:

- VIP Transportation is an individually organised service, not a predefined package;
- discretion and privacy are core service capabilities;
- the service can cover one important movement or a wider private itinerary;
- commercial and private aviation arrivals are supported;
- several vehicles can form one confirmed transport plan;
- complex bookings can receive dedicated coordination;
- price is provided by individual quote;
- every arrangement is manually reviewed and confirmed;
- VIP Transportation is not a security or close-protection service.

The intended character is:

```text
quiet confidence + controlled movement + discreet coordination
```

VIP MUST feel more private, restrained and operational than Wedding or Prom Transportation while remaining part of the same Special Events family.

VIP MUST NOT resemble a celebrity concierge template, nightclub limousine service, private-jet charter company, security company, luxury-car rental catalogue or generic Private Chauffeur page with VIP wording substituted.

## 2. Service distinction

The page MUST preserve the following service-family boundaries:

```text
Private Chauffeur
→ chauffeur and vehicle retained around the customer's own reserved schedule

Corporate Transportation
→ structured business mobility and commercial client arrangements

Delegation Transportation
→ formal group and multi-vehicle movement

VIP Transportation
→ discreet, high-touch transport organised around an important guest, private itinerary, arrivals and complex coordination
```

Do not duplicate Private Chauffeur's hourly/half-day/full-day product model. Do not duplicate Corporate invoicing/contract language. Do not present VIP as formal delegation protocol or security.

## 3. Conversion objective

Primary: VIP Transportation request / booking flow.  
Secondary: Request a Quote.

The Hero provides immediate conversion. The remaining page explains why the service exists, what information is required and how a private or complex itinerary is handled before the final handoff.

## 4. Locked section order

1. Site Header
2. Full-Bleed VIP Hero
3. VIP Service Definition / Passenger Experience
4. Service Scope
5. Discretion & Privacy
6. Arrivals & Aviation
7. Fleet by VIP Role
8. Complex Itinerary & Coordination
9. VIP Service Standards
10. How the Arrangement Works
11. VIP FAQ
12. Final CTA
13. Site Footer

No region may be silently removed, merged or reordered.

## 5. Data boundaries

Localized page content owns:

- SEO title/description;
- Hero title/description and CTA labels;
- section headings, intros and editorial prose;
- authored scope items;
- discretion principles;
- aviation explanations;
- illustrative itinerary stages;
- process copy;
- FAQ questions/answers;
- final CTA copy.

Canonical data owns:

- quote pricing mode;
- discretion/privacy capability truth;
- commercial/private aviation capability truth;
- multi-vehicle capability truth;
- complex-booking coordinator capability truth;
- fleet model/specification/capacity/media truth;
- chauffeur/vehicle operating standards;
- booking confirmation model;
- phone/email/contact truth;
- localized slugs and URLs.

`content/ui/{sr,en,ru}.json` owns reusable VIP labels, Hero trust markers, section labels, VIP capability labels, VIP standard labels and VIP vehicle-role labels.

Markdown MUST NOT encode presentation fields.

## 6. Shared architecture

Reuse without forking:

- `ServiceHero`;
- `OccasionScope`;
- `VehicleRecommendations`;
- `OccasionStandards`;
- `OccasionProcessSteps`;
- `FAQ`;
- `FinalCTA`;
- approved foundation layout primitives.

VIP-local:

- `VipServiceDefinition`;
- `VipDiscretion`;
- `VipAviation`;
- `VipItinerary`;
- `VipTransportationPage`.

`VipServiceDefinition` is page-local because the selected passenger-experience media is a locked part of its composition. It MUST follow the same open/divider-led design language as `OccasionServiceDefinition`; it MUST NOT introduce detached feature cards.

Do not broaden a shared API unless the requirement is stable and page-neutral. Any shared change requires consumer-impact verification against Wedding and Prom.

## 7. Theme contract

The configured active Black & Platinum system is REQUIRED.

Typography remains defined by the active theme:

- headings → Inter Tight;
- body/UI → Manrope;
- brand typography → approved BrandLockup only.

The VIP page is the most restrained Special Events page. UI remains graphite, off-white and platinum. Photography may carry natural sky, cabin, runway and landscape color; those colors MUST NOT become interface accents.

PROHIBITED:

- gold-first luxury treatment;
- blue aviation UI theme;
- champagne/gold gradients;
- glow/neon effects;
- red-carpet styling;
- celebrity iconography;
- aircraft-inspired decorative lines pretending to be flight tracking;
- security/shield motifs;
- glassmorphism panels over every photograph;
- large decorative badges;
- script/editorial fashion typography.

## 8. Full-Bleed VIP Hero

Use shared `ServiceHero` with `variant="full-bleed"` and `BaseLayout overHero={true}`.

Required asset:

```text
src/assets/shared/other/hero-chauffeur-wheel.webp
```

Render:

- `vip.hero.eyebrow`;
- localized H1 and description;
- primary VIP request CTA;
- secondary quote CTA;
- exactly three passive trust markers.

Trust keys:

```text
vip.hero.trust.discretion
vip.hero.trust.privateItinerary
vip.hero.trust.coordinatedService
```

The photograph is decorative because adjacent copy carries full meaning.

Crop priority:

1. preserve the chauffeur/passenger relationship;
2. preserve the reflective, low-profile cabin context;
3. retain usable dark copy space;
4. do not crop to a generic steering-wheel product detail.

Start with the shared full-bleed Hero crop/scrim contract. Do not patch `ServiceHero` internals from VIP-local CSS. A new focal-point requirement is a shared-component change and triggers consumer-impact verification.

## 9. VIP Service Definition / Passenger Experience

Source: `overview`.

Purpose: answer **what makes this different from simply booking a premium car?**

Required asset:

```text
src/assets/shared/other/passenger-experience-alternate.webp
```

Render localized heading, intro, body and exactly three principles:

1. discreet chauffeur-driven service;
2. individual organisation around the confirmed itinerary;
3. one or several coordinated movements when required.

The passenger experience image reinforces calm, private rear-seat travel. It MUST NOT be used to claim a guaranteed laptop, onboard office package, specific seat equipment or any vehicle feature not owned by Fleet data.

Desktop composition: editorial split with copy and three principles on one side, media on the other. Keep the media calm and secondary to the service definition.

Mobile DOM order: copy → principles → image.

## 10. Service Scope

Source: `sections[key=serviceScope]`.

Reuse `OccasionScope`.

Core message: **Built around the guest, not a standard route.**

Exactly three authored items:

1. individual VIP transportation;
2. private itinerary;
3. multiple vehicles.

Canonical capability labels supplement authored copy in this exact order:

```text
pricingMode includes "quote"
→ occasion.capability.individualQuote

commercialAviation
→ vip.capability.commercialAviation

privateAviation
→ vip.capability.privateAviation

multiVehicle
→ vip.capability.multiVehicle

dedicatedCoordinatorForComplexBookings
→ vip.capability.dedicatedCoordinator
```

Exactly five active labels render for the current canonical service definition.

This region is explanatory. It is not a booking form, itinerary builder, package selector or price calculator.

## 11. Discretion & Privacy

Source: `sections[key=discretion]`.

Core message:

```text
Present when needed. Invisible when not.
```

Required asset:

```text
src/assets/shared/other/schedule-backseat-view.webp
```

This is the signature VIP editorial section.

Exactly three authored principles:

1. professional presence;
2. private schedule handling;
3. quiet execution.

The copy MUST explain discretion without making legal, cybersecurity or absolute-confidentiality promises. Do not claim encrypted communications, NDA-by-default, anonymous booking, data deletion, protected identity, background checks or security screening unless canonical data explicitly adds those capabilities later.

The image is decorative and remains dark. No large translucent card may cover the central road/passenger perspective.

Desktop: use a cinematic wide or asymmetric 7/5 editorial composition. The text has clear readable measure and the image retains substantial negative space.

Mobile: content first, media second.

## 12. Arrivals & Aviation

Source: `sections[key=aviation]`.

Core message: **From arrival to the next engagement.**

Primary asset:

```text
src/assets/shared/other/mercedes-sprint-next-to-private-jet.webp
```

Supporting asset:

```text
src/assets/shared/other/private-jet-parked-outside-of-hangar.webp
```

Exactly three authored items:

1. commercial aviation;
2. private aviation;
3. onward itinerary.

Canonical gates:

```text
commercialAviation === true
privateAviation === true
```

The section may reference Belgrade Nikola Tesla Airport through existing route/service context, but MUST NOT claim airside/tarmac access, private terminal access, FBO access or aircraft-side pickup unless the corresponding canonical capability and operational arrangement explicitly support that statement.

The photographs are editorial proof of aviation context, not proof of airport permissions.

The supporting private-jet image remains secondary. It MUST NOT make the site resemble a charter-broker or aircraft-rental service.

Section CTA: booking flow with localized “Discuss an arrival” equivalent.

## 13. Fleet by VIP Role

Reuse canonical `VehicleRecommendations` infrastructure.

Required IDs and order:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Role labels:

```text
vip.vehicleRole.mercedesSClass
vip.vehicleRole.mercedesEClass
vip.vehicleRole.mercedesVClassExtraLong
vip.vehicleRole.mercedesSprinter
```

Intended role language:

- S-Class → principal VIP passenger / representative individual transport;
- E-Class → discreet individual or accompanying executive transport;
- V-Class → guest with accompanying passengers or additional luggage;
- Sprinter → larger accompanying group / coordinated multi-vehicle requirement.

Suitability labels are advisory, not exclusive assignments. Do not duplicate capacities, luggage values, equipment, price or availability.

## 14. Complex Itinerary & Coordination

Source: `sections[key=itinerary]`.

Core message: **One itinerary. One coordinated transport plan.**

Exactly five illustrative stages:

1. arrival;
2. scheduled movements;
3. additional passengers or vehicles;
4. changes;
5. dedicated coordination.

This section MUST be rendered as a restrained itinerary/sequence, not a map, fake live tracker or editable booking timeline.

Canonical gates:

```text
multiVehicle === true
dedicatedCoordinatorForComplexBookings === true
```

Change wording MUST remain conditional. Schedule changes are reviewed against the confirmed engagement, reserved resources and current availability. Do not promise unlimited flexibility.

No static example may imply that every VIP booking includes airport + hotel + meeting + dinner + return. The stages explain the organisation model, not a package.

## 15. VIP Service Standards

Source: `sections[key=standards]`.

Reuse `OccasionStandards`.

Exactly six data-gated rows:

1. professional chauffeur;
2. prepared vehicle;
3. discretion and privacy;
4. dedicated coordination for complex bookings;
5. multi-vehicle coordination;
6. manual confirmation.

Gates:

```text
professional chauffeur
→ operations.chauffeurs.dressCode === "suit-and-tie"

prepared vehicle
→ operations.vehicles.cleanlinessStandard === "highest-standard"
  AND operations.vehicles.preTripInspectionForImportantTrips === true

discretion/privacy
→ vip.discretion === true
  AND vip.privacy === true

dedicated coordination
→ vip.dedicatedCoordinatorForComplexBookings === true

multi-vehicle coordination
→ vip.multiVehicle === true

manual confirmation
→ contact.bookingLeadTime.confirmationMode === "manual"
```

Reuse the existing generic Occasion standard labels where semantics are identical. Add VIP-specific labels only for discretion/privacy and dedicated coordination.

Do not render a generic amenity/icon grid.

## 16. How the Arrangement Works

Source: `sections[key=process]`.

Reuse `OccasionProcessSteps`.

Exactly three steps:

1. send the requirements;
2. we review the engagement;
3. receive the confirmed plan and quote.

The process MUST make manual review explicit.

Use the existing Occasion process geometry: heading on dark surface and one shared light inner strip. Stacked below `lg`; three equal columns at `lg+`.

## 17. VIP FAQ

FAQ is the only large light reading region.

Exactly eight localized questions covering:

1. who the service is for;
2. airport/private aviation arrivals;
3. several itinerary locations;
4. several vehicles;
5. dedicated coordination for complex bookings;
6. security/close-protection exclusion;
7. individual quote pricing;
8. manual confirmation.

Visible FAQ and FAQ JSON-LD MUST use the same validated array.

Do not add claims about celebrity clients, diplomatic privileges, armed security, airport restricted-zone access, anonymity guarantees or private-jet charter.

## 18. Final CTA

Reuse shared `FinalCTA` and existing approved Final CTA media.

Primary → VIP Transportation request / booking flow.  
Secondary → Request a Quote.  
Tertiary contact → verified canonical phone/email only.

Ask for:

- date;
- principal locations;
- approximate schedule;
- passenger requirements;
- aviation arrival if relevant;
- multi-vehicle or complex coordination requirement if relevant.

Final CTA MUST remain a conversion handoff, not Hero #2.

## 19. Surface rhythm

```text
DARK FULL-BLEED HERO
DARK EDITORIAL SERVICE DEFINITION + PASSENGER MEDIA
DARK SERVICE SCOPE
DARK CINEMATIC DISCRETION
DARK AVIATION EDITORIAL
DARK FLEET
DARK ITINERARY / COORDINATION
DARK STANDARDS
DARK PROCESS + ONE LIGHT INNER STRIP
LIGHT FAQ
DARK FINAL CTA
DARK FOOTER
```

FAQ is the only large light reading region.

## 20. Responsive contract

Governed viewports:

```text
320×568
768×1024
1024×768
1440×900
1920×1080
```

### Mobile

- full-bleed Hero with usable dark copy area;
- definition content → principles → passenger image;
- scope stacked/divided with no horizontal capability overflow;
- discretion content → image;
- aviation content → primary image → supporting image;
- Fleet follows approved shared mobile behavior;
- itinerary stages are vertical and semantic;
- standards one column;
- process one stacked light strip;
- FAQ readable without nested scrolling;
- zero page overflow.

### Tablet portrait

Maintain content-first editorial order. Do not force desktop splits. Standards use two columns at active `md`. Process remains stacked below `lg`.

### Active `lg` and above

- Service Definition: content 7 / media 5 or equivalent existing split primitive;
- Discretion: content 5 / media 7 or equivalent cinematic split, without sacrificing text measure;
- Aviation: content and media form a deliberate editorial composition; supporting image stays subordinate;
- Itinerary becomes a horizontal or stepped desktop sequence only when semantics, focus order and long Russian copy remain intact;
- Standards use a 3×2 matrix;
- Process uses three equal columns.

### Wide desktop

No topology expansion. Main/reading containers cap width. Photography may extend visually inside approved section boundaries but must preserve content hierarchy and intentional crop.

## 21. Accessibility

WCAG 2.2 AA is REQUIRED.

- one H1 from Hero title;
- logical H2/H3 order;
- 44×44 minimum interactive targets;
- visible keyboard focus;
- no hover-only content;
- semantic itinerary stages;
- decorative images use empty alt where adjacent copy fully carries meaning;
- no autoplay or essential motion;
- reduced-motion behavior respected;
- logical CSS properties;
- no horizontal overflow at any governed viewport or 200% text zoom.

## 22. SEO

Target localized VIP chauffeur / VIP transportation intent with Belgrade relevance.

Use unique SR/EN/RU metadata. Follow existing direct-service FAQ/Breadcrumb/service schema conventions. Do not use:

- Event schema implying Luxury Transportation runs an event;
- Flight/Airline schema;
- security-service schema/claims;
- fake price/rating/review structured data.

The route remains scaffold until all three complete service entries are installed and validated. Only then change `vipTransportation` availability to `published` and allow canonical/hreflang/sitemap generation.

## 23. Prohibited outcomes

Implementation fails if it contains:

- contained Hero;
- generic luxury-car-rental positioning;
- celebrity/red-carpet language;
- security or close-protection promise;
- tarmac/airside access promise not backed by canonical data;
- private-jet charter positioning;
- fixed VIP package or fake published price;
- instant confirmation;
- unlimited waiting/change promise;
- Maybach imagery implying unavailable fleet;
- hardcoded contact or vehicle truth;
- raw localized URLs;
- duplicated shared Occasion components;
- VIP-specific branches inside shared components;
- more than one large light reading region;
- mobile layout that is only collapsed desktop;
- page-local literal theme values where semantic tokens exist.
