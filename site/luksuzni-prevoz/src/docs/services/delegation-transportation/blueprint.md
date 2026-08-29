# Luxury Transportation — Delegation Transportation Blueprint v1

Status: **LOCKED STRUCTURAL BLUEPRINT**  
Route key: `delegationTransportation`  
Parent hub: `businessTransportation`  
Page type: `service`  
Primary conversion goal: **turn a delegation programme into one reviewed transport request**

A structural change requires an explicit blueprint revision.

---

# 1. Product definition

Delegation Transportation is chauffeur-driven transport for diplomatic, institutional, international, corporate and executive delegations whose movement requires coordinated vehicles, passenger groups, locations and timing.

Canonical `services.ts` facts:

```text
pricingMode = ["quote"]
multipleVehicles = true
mixedVehicleClasses = true
dedicatedCoordinator = true
securityService = false
```

Canonical operations used by this page include:

```text
chauffeur internal training includes discretion
chauffeur dress code = suit-and-tie
English-speaking chauffeur standard = true
minimum licence experience = 5 years
important-trip pre-trip vehicle inspection = true
requested confirmed model guarantee = true
manual confirmation = true
```

The page is NOT:

```text
Corporate Transportation
Conference / Congress Transportation
Private Chauffeur
a political campaign service
a security / close-protection service
a police-escort or motorcade service
an instant ride-hailing service
a public price list
```

---

# 2. Conversion strategy

The visitor MUST understand from the Hero + Overview:

```text
the service coordinates more than one vehicle
different vehicle classes can have different roles
one coordinator keeps the transport request together
the service is quote-only
the request is manually confirmed
```

The visitor MUST understand before the final conversion:

```text
who the service is for
how several movements stay part of one programme
how S-Class / E-Class / V-Class roles differ
how professional discretion is handled
that formal confidentiality requirements can be submitted for written agreement
that institutional clients use Luxury Transportation
what information the organiser must provide
that security services are excluded
```

Primary CTA:

```text
Send a Delegation Request
→ booking flow
```

Secondary CTA:

```text
Request a Quote
→ quote flow
```

---

# 3. Locked visible order

Exactly:

```text
1. SiteHeader
2. Full-bleed Delegation Hero
3. Delegation Service Overview — four numbered facts
4. Who This Service Is For — image-led editorial split
5. One Delegation. Several Movements. — signature movement sequence
6. Different Vehicles. One Operational Plan. — mixed-fleet split
7. Discretion Is Part of the Service — confidentiality split
8. Institutional Client Proof — exactly three approved client marks
9. Send the Programme, Not Separate Rides — organiser briefing
10. Delegation Vehicle Recommendations
11. Service Standards
12. FAQ
13. FinalCTA
14. SiteFooter
```

Do not insert reviews, ratings, pricing, a Business Hub logo wall, a generic trust strip, related-service cards, a process clone, gallery, map, political imagery section, security section or extra CTA band.

---

# 4. Hero

Use:

```text
BaseLayout overHero=true
ServiceHero variant="full-bleed"
```

Locked Hero asset:

```text
src/assets/shared/other/v-class-embassy-entrance.webp
```

The asset is decorative:

```text
imageAlt=""
```

Do not identify the photographed building as an embassy, government property or client location.

The visible flags are contextual photography only. Copy MUST NOT imply a relationship with the country or institution depicted in the Hero photograph.

Eyebrow:

```text
delegationTransportation.hero.eyebrow
```

Hero H1 and description come from localized Markdown.

Primary CTA resolves to `booking`.

Secondary CTA resolves to `quote`.

Hero trust markers use `ServiceHero.trustMarkers`.

Exactly three:

```text
business.coordination.multipleVehicles
business.coordination.mixedVehicleClasses
business.coordination.dedicatedCoordinator
```

Before rendering, assert the matching canonical booleans are `true`.

Do not use `supportText`.

No price, client logos, ratings, flags-as-proof or security language in the Hero.

---

# 5. Delegation Service Overview

Use:

```text
ServiceOverview
variant="numbered-divider-facts"
surface="open-dark"
```

Exactly four facts:

```text
01 Multiple vehicles
02 Mixed vehicle classes
03 Dedicated coordination
04 One coordinated schedule
```

Titles 01–03 reuse existing `business.coordination.*` keys.

Descriptions use Delegation UI keys.

Fact 04 is an editorial synthesis. It MUST NOT become a new service boolean.

No icons. No cards. No pricing.

---

# 6. Who This Service Is For

Content section key:

```text
audience
```

Use `Section`, `PageContainer`, `OpenSplitSection`, `SectionHeading`.

Desktop from `lg`:

```text
image 7 | content 5
```

Mobile/tablet DOM:

```text
content first
image second
```

Locked image:

```text
src/assets/shared/other/s-class-hotel-entrance-vertical.webp
```

The image is decorative.

Exactly five audience items:

```text
diplomatic missions and embassies
official and institutional delegations
international organisations
corporate and executive delegations
hosts, assistants and delegation coordinators
```

The page does not claim political affiliation.

No cards. No icons. No client logos here.

---

# 7. Signature — One Delegation. Several Movements.

Page-local component:

```text
DelegationMovementSequence.astro
```

Content section key:

```text
movement
```

The sequence is explicitly labelled as an illustrative coordinated schedule.

Exactly six stages:

```text
01 Arrival
02 Group allocation
03 Accommodation
04 Programme
05 Evening movement
06 Continuation
```

Localized stage labels/examples come from `delegationTransportation.movement.*`.

Illustrative locations can include an arrival point/airport, hotel, meeting/business location, event/dinner and next confirmed location.

These examples MUST NOT be converted into new canonical Delegation capability flags.

Closing line:

```text
Vehicles differ. The schedule remains one.
```

Locked supporting image:

```text
src/assets/shared/other/emplyoee-group-outside.webp
```

Visual contract:

```text
dark open/elevated surface
heading/explanation first
vertical semantic ordered list
restrained accent connector
typographic stages
supporting image secondary to sequence
no cards
no map
no status chips
no animated vehicles
no JS
```

Desktop from `lg`:

```text
sequence 7 | supporting image 5
```

Mobile/tablet:

```text
intro
sequence
image
```

---

# 8. Different Vehicles. One Operational Plan.

Content section key:

```text
mixedFleet
```

Use `OpenSplitSection`.

Desktop from `lg`:

```text
content 7 | image 5
```

Locked image:

```text
src/assets/shared/other/v-class-on-the-move-veertical.webp
```

Exactly three editorial role concepts:

```text
representative sedan
business sedan
V-Class group movement
```

These explain mixed roles and do not duplicate the Fleet section.

The final line MUST state that the final vehicle structure is confirmed against passenger count and programme.

No prices.

No Sprinter promotion in v1.

---

# 9. Discretion and Confidentiality

Content section key:

```text
discretion
```

Use `Section`, `PageContainer`, `OpenSplitSection`, `SectionHeading`.

Desktop from `lg`:

```text
image 5 | content 7
```

Mobile/tablet DOM:

```text
content first
image second
```

Locked image:

```text
src/assets/shared/other/s-class-interior-1.webp
```

Exactly four trust principles:

```text
01 Professional discretion
02 Operational information remains in the engagement context
03 Formal confidentiality requirements / NDA request handling
04 Manual confirmation before engagement
```

Principle 01 renders only after:

```text
operations.chauffeurs.internalTraining includes "discretion"
```

Principle 04 renders only after:

```text
contact.bookingLeadTime.confirmationMode === "manual"
```

NDA wording is limited to:

```text
An NDA or another formal confidentiality requirement can be included in the request.
The condition applies only after both sides agree it in writing before the confirmed engagement.
```

Do not say NDA guaranteed, all NDAs accepted, automatic NDA, absolute secrecy, secure transport or classified transport.

Confidentiality never becomes a physical-security promise.

---

# 10. Institutional Client Proof

Page-local component:

```text
DelegationInstitutionalProof.astro
```

Exactly three owner-supplied v1 marks:

```text
src/assets/clients/chinesee-embassy.png
src/assets/clients/osce.png
src/assets/clients/serbian-swimming-association.png
```

Client identity, canonical display names, approval state and route placement come from `src/data/clients.ts`. Logo media resolves through `src/data/client-media.ts`.

The renderer MUST call `getApprovedClientsFor("delegationTransportation")` and MUST fail unless the ordered result is exactly:

```text
chinese-embassy
osce-mission-to-serbia
serbian-swimming-federation
```

Visible framing:

```text
Selected institutional clients of Luxury Transportation
```

Do not say every listed organisation purchased the identical Delegation Transportation configuration.

Surface:

```text
light
```

Logo rules:

```text
original supplied artwork
object-fit contain
no grayscale
no CSS filter
no recolour
no crop
no distortion
no outgoing links
```

Layout:

```text
mobile: vertical proof list
tablet+: three equal logo regions with restrained dividers
```

No additional client appears in v1.

Do not reuse `BusinessClientProof`.

---

# 11. Organiser Briefing

Content section key:

```text
briefing
```

Compose directly with `Section`, `PageContainer`, `SectionHeading`, `Link` and a semantic numbered list.

Exactly four inputs:

```text
01 Times and locations
02 Passengers and groups
03 Preferred vehicle structure
04 Special operational / confidentiality requirements
```

After the inputs, render one restrained manual-confirmation note gated by contact data.

Quiet CTA:

```text
delegationTransportation.cta.sendProgramme
→ booking flow
```

No embedded form.

No instant confirmation.

---

# 12. Vehicle Recommendations

Reuse `VehicleRecommendations`.

Locked IDs/order:

```text
1. mercedes-s-class
2. mercedes-e-class
3. mercedes-v-class-7-plus-1-extra-long
```

No Sprinter. No Superb. No fourth vehicle. No fare.

Canonical fleet data/media own facts and imagery.

Delegation suitability labels come from UI.

---

# 13. Service Standards

Reuse:

```text
buildServiceStandardGroups(locale)
ServiceStandards
variant="numbered-matrix"
surface="contained-dark"
```

Exactly four groups, exactly three visible facts per group, markers `01`–`04`.

Do not expose background-check or massage-seat marketing copy.

No security implication.

---

# 14. FAQ

Use `ReadingContainer` + `FAQ` on a light surface.

Exactly eight questions covering:

```text
multiple vehicles
mixed vehicle classes
dedicated coordinator
information required for a quote
different group pickup/movement points
NDA/formal confidentiality
manual confirmation
security exclusion
```

Allowed interpolation tokens only:

```text
{multipleVehiclesAnswer}
{mixedClassesAnswer}
{coordinatorAnswer}
{groupMovementAnswer}
{ndaAnswer}
{confirmationAnswer}
{securityAnswer}
```

Unknown or unresolved token = build error.

The exact same resolved FAQ array feeds visible FAQ and FAQ structured data.

Security answer MUST state that physical security/protection is not part of the service.

---

# 15. Final CTA

Reuse `FinalCTA`.

Locked image:

```text
src/assets/shared/other/s-class-hotel-entrance-night.webp
```

Pass:

```text
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

Primary → booking. Secondary → quote. Both resolve through `resolveCtaHref()`.

Final CTA is a conversion closer, not Hero #2.

---

# 16. Pricing

No monetary value appears.

Forbidden: hourly price, per-km price, from-price, currency, matrix, computed estimate, discount or contract rate.

The only commercial behavior is quote request.

---

# 17. Component budget

Required page-local production components:

```text
DelegationTransportationPage.astro
DelegationMovementSequence.astro
DelegationInstitutionalProof.astro
```

Do not create DelegationHero, DelegationOverview, DelegationFAQ, DelegationFinalCTA, DelegationVehicleRecommendations, DelegationStandards, DelegationAudience or DelegationBriefing.

Do not generalize or modify Corporate page-local panels in this task.

Do not extract a new Business-family abstraction solely because two regions look similar.

---

# 18. Responsive contract

Required review widths:

```text
320
768
1024
1440
1920
```

Theme breakpoints remain authoritative.

320 (mobile state):

```text
Hero full bleed; CTAs form one vertical stack; trust markers remain one ordered wrapping list with no hidden or reordered item
Overview vertical
Audience copy then image
Movement intro → vertical sequence → image
Mixed fleet copy → image
Discretion copy/trust rows → image
Institutional proof three marks vertically
Briefing copy → inputs → quiet CTA
Vehicles shared narrow carousel
Standards one sequence
FAQ reading width
FinalCTA copy/actions then media
```

768 (tablet-portrait state):

```text
Hero full bleed; supplied SR/EN/RU CTA labels render in one row; trust markers remain one ordered wrapping list
Overview vertical
Audience copy then image
Movement vertical sequence + image
Mixed fleet copy then image
Discretion copy then image
Institutional proof exactly three equal regions
Briefing stacked
Vehicles/Standards shared tablet topology
```

1024 (tablet-landscape / `lg` state):

```text
Overview 5 / 7
Audience image 7 / copy 5
Movement sequence 7 / image 5
Mixed fleet copy 7 / image 5
Discretion image 5 / copy 7
Institutional proof intro 4 / proof zone 8
Briefing intro 5 / inputs 7
Standards 4 / 8
Vehicles shared three-item wide topology
FAQ remains at reading width
FinalCTA uses shared wide copy/media topology
```

1440 (desktop state):

```text
Retain the complete 1024 topology and DOM/focus order
Use the active main/reading container constraints; regions do not grow beyond their semantic containers
All photographic frames remain cover media under the locked crop contract
```

1920 (wide-desktop state):

```text
Retain the complete 1440 topology and DOM/focus order
Main content remains capped by the active semantic containers and centered in the viewport
No proof, text or media region stretches into a new topology
```

No region horizontally scrolls except approved shared vehicle-carousel behavior.

---

# 19. Accessibility

Hard requirements:

```text
WCAG 2.2 AA
exactly one H1
logical headings
44x44 interactive targets
visible focus
keyboard operation
semantic lists
decorative numbering hidden from AT when redundant
decorative photos alt=""
meaningful logos use canonical `clients.ts` organisation `displayName` as alt text
reduced motion
logical DOM order
no horizontal overflow
```

---

# 20. Visual tone

The page MUST feel institutional, premium, quiet, operationally confident, discreet and international.

It MUST NOT feel like a political campaign, security contractor, government portal, SaaS dashboard, luxury cliché, car catalogue or logo wall.

Photo progression is locked:

```text
Hero              → V-Class at formal international entrance
Audience          → arrival / hotel context
Movement          → people + multiple transport context
Mixed fleet       → V-Class movement
Discretion        → quiet premium interior
Institution proof → approved real client marks
Vehicles          → canonical fleet
Final CTA          → vehicle waiting at premium entrance
```
