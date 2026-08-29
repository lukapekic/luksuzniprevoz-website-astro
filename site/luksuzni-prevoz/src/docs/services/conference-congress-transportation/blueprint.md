# Luxury Transportation — Conference / Congress Transportation Blueprint v1

Status: **LOCKED STRUCTURAL BLUEPRINT**  
Route key: `conferenceCongressTransportation`  
Parent hub: `businessTransportation`  
Page type: `service`  
Primary goal: **convert an event transportation requirement into a structured booking/quote request**

This file is page-specific authority. The implementation MUST preserve the visible order, data ownership, component roles, responsive topology, CTA hierarchy and factual boundaries defined here. A structural change requires an explicit blueprint revision.

---

# 1. Product definition

Conference / Congress Transportation is chauffeur-driven event transportation organised around a confirmed conference, congress or business-event schedule.

Canonical `services.ts` facts:

```text
pricingMode = quote
airportArrivals = true
hotelTransfers = true
venueShuttles = true
multiVehicleSchedules = true
individualExecutiveTransfers = true
groupTransport = true
vehicleRoles.individualExecutive = [mercedes-s-class, mercedes-e-class]
vehicleRoles.smallerGroup = [mercedes-v-class-7-plus-1-extra-long]
vehicleRoles.largerGroup = [mercedes-sprinter]
```

The page is NOT:

```text
Corporate Transportation
Delegation Transportation
a recurring corporate-contract page
a security or close-protection service
a live dispatch/control-centre product
a public pricing page
a promise of unlimited fleet capacity
a promise of airport departure/return transport
```

The current Conference service contract has no `airportDepartures`, `return` or equivalent capability. The page MUST NOT imply one.

---

# 2. Conversion strategy

The page narrative is locked:

```text
one event schedule
→ different participant roles
→ several movement points
→ individual and group transport
→ several vehicle roles when required
→ one coherent event transport arrangement
→ request / quote
```

Within Hero + Overview the visitor must understand:

```text
what the service is
that it follows an event schedule
that airport arrivals are supported
that hotel and venue movements are supported
that individual and group transport are supported
that multiple vehicles can belong to one schedule
that pricing is quote-only
that submission is not instant confirmation
```

Primary action:

```text
Plan Event Transportation
→ booking flow
```

Secondary action:

```text
Request a Quote
→ quote flow
```

---

# 3. Locked visible order

Exactly:

```text
1. SiteHeader
2. Full-bleed Conference / Congress Hero
3. Conference Service Overview — four numbered facts
4. Who This Is For — editorial audience rail
5. From Arrival to Final Transfer — six-stage movement sequence
6. Different Passengers. Different Movements. — executive vs group split
7. Several Vehicles. One Event Schedule. — coordination composition
8. Conference Vehicle Recommendations
9. Service Standards
10. FAQ
11. FinalCTA
12. SiteFooter
```

Do not insert:

```text
reviews
client logos
Business Hub child-service cards
pricing cards or tables
generic process/how-it-works
related-services grid
gallery
conference-stage photography section
extra CTA band
live schedule dashboard
```

Client proof belongs to the Business Hub and Delegation-specific proof. Conference differentiates through event movement and passenger structure.

---

# 4. Hero — full bleed

Use shared:

```text
ServiceHero
variant="full-bleed"
```

BaseLayout:

```text
overHero=true
```

Hero image is owner-approved and locked:

```text
src/assets/shared/other/s-class-hotel-entrance-night.webp
```

The existing `ServiceHero` full-bleed dark treatment/scrim remains authoritative. Do not add a second page-local overlay.

Eyebrow:

```text
conferenceCongressTransportation.hero.eyebrow
```

H1 and description come from localized page content.

Primary CTA resolves through canonical `booking` flow.

Secondary CTA resolves through canonical `quote` flow.

## Hero trust markers

Pass exactly three localized Conference markers, after asserting the corresponding
canonical capabilities:

```text
Airport · hotel · event location
Individual and group transportation
Multi-vehicle schedule
```

Before rendering them, assert their corresponding Conference capability flags.

Do not use `supportText` on this Hero. The three markers keep the first viewport concise and align Conference with the Business-family service grammar without copying Corporate's Hero layout verbatim.

## Hero image behavior

Image is decorative:

```text
imageAlt=""
```

Required crop review:

```text
320
768
1024
1440
1920
```

The vehicle and hotel/venue entrance context must remain visible while the inline-start H1 and CTAs retain AA contrast.

---

# 5. Conference Service Overview

Reuse shared:

```text
ServiceOverview
variant="numbered-divider-facts"
surface="open-dark"
```

Desktop topology:

```text
copy 5 | facts 7
```

Exactly four facts:

```text
01 Airport arrivals
02 Hotel and event locations
03 Individual and group transportation
04 Multi-vehicle schedules
```

Titles/data binding:

```text
01 title → business.coordination.airportArrivals
02 title → conferenceCongressTransportation.overview.hotelVenue.title
03 title → conferenceCongressTransportation.overview.individualGroup.title
04 title → business.coordination.multiVehicleSchedules
```

Descriptions come from Conference UI strings and only render after canonical capability assertions.

No icons. No cards. No prices.

---

# 6. Who This Is For — editorial audience rail

Content section key:

```text
audience
```

Exactly five authored items:

```text
01 Event organisers
02 Speakers
03 Executives and management
04 Business and invited guests
05 Participant groups
```

Visual contract:

```text
open dark surface
heading + intro/body
divider-led editorial rail
local decorative numbers 01–05
no raised cards
no icons
no image
```

This section remains direct Conference page composition. Its topology follows the verified Corporate five-item audience rail, which is the closest production Business-family match. Delegation uses an image/content split and is not the matching layout contract. Do NOT extract a Business audience component in this task.

Responsive:

```text
mobile          one vertical sequence
md              two columns; final item spans final row
xl              three columns; final row inline-start aligned
2xl             five equal segments
```

DOM order remains 01→05 at every viewport.

---

# 7. From Arrival to Final Transfer — shared Business movement sequence

Content section key:

```text
eventJourney
```

This is the primary Conference signature story.

## Shared extraction

Current Delegation production owns:

```text
DelegationMovementSequence.astro
```

It already expresses the same semantic responsibility required here:

```text
a six-stage illustrative movement sequence
+ heading/intro/optional body
+ example label
+ supporting image
+ static CSS connections
```

Extract it into:

```text
src/components/services/shared/BusinessMovementSequence.astro
```

The extraction is explicitly authorized by this blueprint.

Requirements:

```text
preserve Delegation rendering and responsive behavior
remove Delegation-specific component naming
replace hard-coded delegation heading id with caller-provided unique headingId
keep exactly six stages in the component contract
keep static Astro/CSS implementation
no JavaScript
no routing logic
no service facts inside the shared component
```

Migrate Delegation to the shared component in the same implementation and regression-test it.

## Conference stages

Exactly:

```text
01 Arrival
02 Hotel
03 Conference venue
04 Additional location
05 Return to hotel
06 Final transfer
```

Stages come from `eventJourney.items` in localized content.

The concise introduction MUST state that the sequence illustrates the organisation principle and is not a fixed route. A second explanatory body paragraph is not required.

The final stage remains **Final transfer**. Do not render Airport departure.

## Image

```text
src/assets/fleet/original/sprinter/interior-entrance.webp
```

Decorative. The right-side image shows the Sprinter passenger entrance and must
remain subordinate to the six-stage sequence.

## Desktop topology

Use the extracted component's contained open-split/default treatment. Desktop
preserves:

```text
sequence 7 | image 5
```

The section is a contained graphite split with the sequence on the left and image
on the right. At desktop, the image height matches the rendered stepped-sequence
content and must not enlarge the grid row from its portrait intrinsic ratio. The
sequence is editorial, not a tracking/status UI.

Forbidden:

```text
times
status badges
vehicle live positions
map pins
progress animation
driver assignment
availability indicators
```

---

# 8. Different Passengers. Different Movements.

Content section key:

```text
passengerMovement
```

Page-local component:

```text
ConferencePassengerMovement.astro
```

Purpose: explain how individual executive movement and group movement coexist inside the same event schedule.

Exactly two authored items:

```text
01 Individual and executive movement
02 Group movement
```

## Vehicle-role binding

The page resolves canonical fleet IDs from `getService("conferenceCongressTransportation").vehicleRoles`; authored content and page components do not own the relationships or capacity.

Executive role binds to `vehicleRoles.individualExecutive`:

```text
mercedes-s-class
mercedes-e-class
```

Group role combines `vehicleRoles.smallerGroup` and `vehicleRoles.largerGroup` in that order:

```text
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

If capacities are shown, resolve them from `fleet.ts` only:

```text
S-Class = 3
E-Class = 3
V-Class Extra Long = 7
Sprinter = 19
```

Do not hardcode these numbers in Markdown or UI JSON.

## Visual contract

Use one contained light editorial section as a contrast beat.

Desktop:

```text
heading/introduction full editorial width
then two vertically stacked facts
```

Each fact contains:

```text
number
title
quiet canonical vehicle-role label
concise body
```

The facts remain in one column at every breakpoint. They have no outer borders;
one quiet horizontal divider separates 01 and 02. Use generous vertical spacing
so the composition remains cinematic and comfortable.

Keep the standard semantic section gap between the contained Journey and
Passenger Movement surfaces; they must not read as one joined two-tone panel.

This is not a vehicle-card section. No prices, badges, feature grids or CTAs inside each side.

Mobile order:

```text
heading/introduction
executive fact
divider
group fact
```

---

# 9. Several Vehicles. One Event Schedule.

Content section key:

```text
multiVehicle
```

Page-local component:

```text
ConferenceMultiVehicleSchedule.astro
```

Canonical prerequisite:

```text
conference.multiVehicleSchedules === true
```

Purpose: show that several vehicle roles can remain part of one event transport arrangement.

Exactly three authored movement-role items:

```text
01 Individual movement
02 Smaller group
03 Larger group
```

Visual labels bind to canonical service roles:

```text
01 vehicleRoles.individualExecutive
02 vehicleRoles.smallerGroup
03 vehicleRoles.largerGroup
```

The renderer gets role relationships from `services.ts` and vehicle facts from `fleet.ts`. UI strings label the authored nodes but do not own vehicle IDs or assert availability quantities.

## Visual contract

Surface:

```text
open dark
```

Desktop:

```text
section copy 5 | coordination model 7
```

Right-side model:

```text
three divider-led movement lanes
→ one event-schedule outcome
```

Destination label:

```text
conferenceCongressTransportation.multiVehicle.scheduleLabel
```

Quiet CTA comes from `multiVehicle.cta` and resolves to canonical booking flow.

The page-local component owns its connector CSS. Movement roles are not cards and
the outcome is not a destination box. It MUST remain editorial and static.

Forbidden:

```text
clock times
live dots
online/offline state
driver names
plate numbers
vehicle tracking
control-centre styling
real-time assignment
map UI
dedicated Conference coordinator claim
```

Do not reuse `CorporateCoordinationPanel`: Corporate models company-contact/chauffeur/itinerary inputs, while Conference models passenger movement roles. They are different semantic responsibilities despite a related visual grammar.

---

# 10. Vehicle Recommendations

Reuse:

```text
VehicleRecommendations
```

Locked IDs and order:

```text
1. mercedes-s-class
2. mercedes-e-class
3. mercedes-v-class-7-plus-1-extra-long
4. mercedes-sprinter
```

Canonical capacities currently resolve from `fleet.ts`:

```text
3
3
7
19
```

Do not duplicate those numbers in content/UI.

Use existing Business vehicle-role labels where they accurately describe the role:

```text
business.vehicleRole.mercedesSClass
business.vehicleRole.mercedesEClass
business.vehicleRole.mercedesVClassExtraLong
business.vehicleRole.mercedesSprinter
```

CTA targets `fleet` route.

No fare or estimate.

---

# 11. Service Standards

Reuse:

```text
ServiceStandards
variant="numbered-matrix"
surface="contained-dark"
```

Use:

```text
buildServiceStandardGroups(locale)
```

Add markers 01–04.

Require exactly four groups with exactly three facts each, matching the established Corporate/Delegation service contract.

Heading/intro:

```text
conferenceCongressTransportation.standards.heading
conferenceCongressTransportation.standards.intro
```

Do not create a Conference standards clone.

Do not add:

```text
event staffing
security/protection
conference desk
24/7 event coordination
background-check marketing copy
```

---

# 12. FAQ

Use:

```text
Section
ReadingContainer
SectionHeading
FAQ
```

Surface:

```text
light
```

Exactly nine questions.

Required subjects:

```text
who the service is for
airport arrivals
hotel ↔ event-location transport
multi-vehicle schedules
different vehicle roles for executive/group movement
information needed for a quote
quote-only pricing
specific vehicle request
manual confirmation
```

Operational token keys:

```text
{airportArrivalsAnswer}
{hotelVenueAnswer}
{multiVehicleAnswer}
{individualGroupAnswer}
{quoteAnswer}
{vehicleAnswer}
{confirmationAnswer}
```

Before interpolating, assert the canonical facts each answer depends on.

The exact same resolved `faqItems` array feeds:

```text
visible FAQ
FAQPage structured data
```

No airport-departure FAQ.

---

# 13. Final CTA

Reuse:

```text
FinalCTA
```

Primary → booking flow.  
Secondary → quote flow.

Image:

```text
src/assets/shared/other/v-class-parked-outside.webp
```

Props:

```text
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

FinalCTA remains a closer, not a second Hero.

Copy requests:

```text
date
key locations
passenger count
group structure
basic event movement schedule
```

Do not imply a file-upload feature.

---

# 14. Pricing

No monetary values appear on this page.

Conference `pricingMode` is exactly:

```text
quote
```

Forbidden:

```text
from-price
hourly price
per-km price
fixed event package
automatic estimate
currency
pricing matrix
```

---

# 15. Content and UI package

Canonical content is installed at:

```text
src/content/pages/conference-congress-transportation/
  conference-congress-transportation.sr.md
  conference-congress-transportation.en.md
  conference-congress-transportation.ru.md

ui-additions/
  sr.json
  en.json
  ru.json
```

Serbian is source locale.

Keep:

```text
status: in-review
translationState: reviewed
noindex: true
```

EN/RU digests are generator-owned. Run the repository sync command and use generated values.

`ui-additions/` is retained as an audit fragment. Its keys are merged into the canonical UI dictionaries; dictionaries are never replaced or pruned.

---

# 16. Component budget

Required new Conference page-local components:

```text
ConferenceCongressTransportationPage.astro
ConferencePassengerMovement.astro
ConferenceMultiVehicleSchedule.astro
```

Required shared extraction:

```text
BusinessMovementSequence.astro
```

Source extraction:

```text
DelegationMovementSequence.astro
```

After extraction, Delegation MUST use the new shared component and the old page-local movement component MUST be removed if no longer referenced.

Before editing the approved shared component surface, run `pnpm components:check`. After `BusinessMovementSequence.astro` exists, add it to the reviewed shared-component registry/contract, run the repository synchronization command, run the `component` verification profile, and verify every reported consumer. The extraction is not complete without Delegation regression evidence.

Do not create:

```text
ConferenceHero
ConferenceOverview
ConferenceAudience
ConferenceFAQ
ConferenceFinalCTA
ConferenceVehicleRecommendations
ConferenceStandards
```

Do not extract speculative shared components from the executive/group or multi-vehicle sections during this task.

---

# 17. Renderer contract

Add one mapping to the existing `ContentPageRenderer.astro` after the Conference content entries are real `pageType: service` entries:

```text
conferenceCongressTransportation
→ ConferenceCongressTransportationPage
```

Do not create a second dispatcher.

The page renderer must guard:

```text
routeKey === conferenceCongressTransportation
content.data.routeKey matches
pageType === service
hero exists with secondary CTA
vehicleRecommendations exists
faq exists
final CTA has secondary CTA
required four section keys exist
every required section heading intro/body field exists
audience has body and exactly five complete items
eventJourney has intro/body and exactly six complete items
passengerMovement has intro/body and exactly two complete items
multiVehicle has intro/body, booking CTA and exactly three complete items
FAQ has exactly nine complete items
```

Missing locked content fails build.

---

# 18. Responsive contract

Use the configured active theme thresholds and semantic tokens. Preserve one DOM order and one focus order at every state. Required reference states:

## Mobile — 320, below `md`

```text
Hero                     full bleed; stacked copy/actions; actions full width
Overview                 vertical numbered facts
Audience                 vertical numbered rail
Event Journey            intro; six-stage sequence; image below/after sequence per shared component
Passenger Movement       intro; executive role; group role; no horizontal split
Multi Vehicle            copy; three nodes; outcome; CTA
Vehicles                 shared narrow carousel behavior
Standards                shared one-column sequence
FAQ                      reading width; wrapping summaries
FinalCTA                  copy/actions then integrated media
```

## Tablet portrait — 768, `md` to below `lg`

```text
Hero                     full bleed; wrapping action row above the shared `xs` threshold; DOM order unchanged
Overview                 vertical fact sequence
Audience                 2 columns; fifth item spans final row
Event Journey            shared stacked layout
Passenger Movement       vertical two-fact sequence; executive then group in DOM/focus order
Multi Vehicle            stacked model
Vehicles                 shared tablet behavior
Standards                shared tablet behavior
FAQ / FinalCTA           shared tablet behavior
```

## Tablet landscape — 1024, `lg` to below `xl`

```text
Hero                     full bleed
Overview                 5 / 7
Audience                 2-column editorial rail
Event Journey            7 / 5
Passenger Movement       vertical two-fact sequence
Multi Vehicle            5 / 7
Standards                4 / 8 matrix
```

## Desktop — 1440, `xl` to below `2xl`

```text
Hero                     cinematic full bleed
Overview                 5 / 7
Audience                 3 columns until 2xl
Event Journey            7 / 5
Passenger Movement       vertical two-fact sequence
Multi Vehicle            5 / 7
Vehicles                 shared wide behavior
Standards                4 / 8 matrix
FAQ                      reading width
FinalCTA                  shared integrated media
```

## Wide desktop — 1920, at or above `2xl`

Audience uses five equal segments from the configured `2xl` threshold, matching Corporate Transportation. All other sections remain capped by approved container and reading-measure roles; images retain their assigned crop/fit and CTAs remain within their owning section.

Conference-owned topology changes occur at `md`, `lg`, `xl` and `2xl`. In addition to the five reference widths, verify computed topology on both sides of each applicable threshold. Long Russian content is required at the narrowest state and around each transition.

Every grid track uses zero intrinsic minimum where required. There is no accidental horizontal overflow, CSS reordering, duplicate responsive DOM or clipped focus indicator at any state. All interactive targets remain at least 44×44 CSS px.

---

# 19. Accessibility

Mandatory:

```text
one H1 only
logical heading hierarchy
semantic ordered lists for sequences
44×44 minimum interactive targets
visible focus states
keyboard access to all interactive UI
no content conveyed by connector lines alone
AA contrast
reduced-motion compliance inherited from shared Hero
no horizontal overflow at 320px
```

All assigned editorial images are decorative because the adjacent text carries their meaning. Use empty alt and presentation semantics consistently.

---

# 20. SEO and structured data

Use the existing `buildPageSeo` path.

Requirements:

```text
localized SEO title/description
canonical localized route resolution
exactly one H1
FAQPage generated from resolved visible FAQ items
no hardcoded URLs
no schema claims beyond canonical data
noindex remains true until publication gate
```

Do not add Event, Organization, Product or Offer structured data solely because this is a conference service page.

---

# 21. Performance and motion

No page-level JavaScript is required for the three signature sections.

Use static Astro/CSS for:

```text
audience rail
event movement sequence
passenger comparison
multi-vehicle model
```

Motion remains limited to existing shared component behavior. Do not add scrolling timelines, parallax, animated route lines, counters or status animations.

Typography uses only semantic roles: `font-heading` for H1–H3, `font-body` for body/UI/actions and `font-brand` only inside `BrandLockup`. Verify computed H1, H2, body/UI, control and brand-lockup fonts with Serbian Latin, English and Russian Cyrillic content, including text zoom.

All images use the repository's reviewed Astro image path with intrinsic geometry reserved. The Hero is the likely LCP image and keeps the shared eager/high-priority behavior; Event Journey and FinalCTA media remain lazy unless their shared component contract says otherwise. Verify generated responsive sources, crop/focal intent, dimensions, loading priority, CLS and the configured route/image/font/JS budgets. The page adds no client island.

---

# 22. Cross-page boundary

Conference MUST feel related to Corporate and Delegation through:

```text
ServiceHero
ServiceOverview
shared movement grammar
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
configured active-theme typography/tokens/surfaces
```

Conference MUST remain distinct through:

```text
event schedule as the organising object
arrival/hotel/venue journey
speaker/executive vs participant-group comparison
multi-vehicle event schedule
Conference-specific audience
Sprinter inclusion
owner-approved hotel-arrival Hero
```

Do not import Corporate recurring/invoicing language.

Do not import Delegation dedicated-coordinator, institutional-client, NDA or security-boundary sections.

---

# 23. Publication gate

During implementation:

```text
route availability remains scaffold/non-public
content remains noindex: true
```

Publish only after `acceptance.md` passes, translations are synchronized, all tests/validators pass and the owner approves the visual result.

Publication changes are explicit and separate from page construction.
