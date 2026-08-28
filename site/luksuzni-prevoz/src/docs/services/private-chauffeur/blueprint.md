# Luxury Transportation — Private Chauffeur Blueprint v3

Status: **LOCKED STRUCTURAL BLUEPRINT**
Route key: `privateChauffeur`
Page kind: `service`
Theme binding: **semantic; active repository theme only**
Primary objective: **flagship service conversion page**

> This file is page-specific authority.
> The coding agent MUST preserve the exact visible section order, component roles, data ownership, image roles, CTA hierarchy, responsive topology, and content responsibilities defined here.
> Any change to this structure requires an explicit blueprint revision before implementation.

---

# 1. Authority

Apply the repository source-of-truth hierarchy from root `AGENTS.md`.

For this page, the required visible-UI authority chain is:

```text
1. this locked blueprint
2. DESIGN.md
3. active theme JSON
4. approved shared component contracts
5. wireframe.html
6. matching .skills procedures
7. verified production patterns
```

The wireframe defines geometry and hierarchy only. It does not override design tokens, typography, accessibility, routing, data ownership, or shared component contracts.

---

# 2. Product Definition

Private Chauffeur is the flagship service.

The customer books:

```text
vehicle from the Luxury Transportation fleet
+
professional chauffeur
+
reserved period
+
confirmed itinerary / planned stops
```

The service is NOT:

```text
a driver for the customer's own vehicle
a point-to-point transfer
a ride-hailing service
instant on-demand transport
unrestricted waiting
automatic multi-day booking
automatic international pricing
```

Canonical service truth comes from:

```text
src/data/services.ts
```

Current service contract:

```text
routeKey                    privateChauffeur
kind                        service
pricingMode                 calculable + quote
coverage                    primarily-belgrade
hourly.minimumHours         1
hourly.publishedKmLimit     null
halfDay.hours               5
halfDay.includedKm          100
fullDay.hours               10
fullDay.includedKm          200
chauffeurRemainsAvailable   true
multiplePlannedStops        true
scheduleChangeHandling      subject-to-availability-within-reserved-period
multiDay                    quote
international               quote
customerVehicleChauffeurOnly false
relatedRoutes               airportTransportation
                            businessTransportation
                            vipTransportation
```

Confirmed cross-cutting operational contract:

```text
operations.service.parkingLogisticsHandledByChauffeur true
contact.bookingLeadTime.confirmationMode               manual
```

These newly confirmed facts MUST be added to their canonical typed data owners
before page rendering. `services.ts` owns Private Chauffeur schedule behavior,
`operations.ts` owns the chauffeur-handled parking/logistics standard, and
`contact.ts` owns the global manual-confirmation policy. The data modules and
their consistency checks MUST fail in development/build if a required value is
missing or has an unsupported vocabulary value.

These facts MUST NOT be copied into localized prose as the source of truth.

---

# 3. Conversion Strategy

The page serves three customer intents.

## Intent A — customer understands the service and wants to book

Primary CTA:

```text
Book Private Chauffeur
```

Route through the canonical booking flow.

Until a dedicated booking route exists, use the canonical current flow
fallback returned by `resolveCtaHref()`. Do not emit an empty `href`, `href="#"`,
a current-page link, a manually authored Contact URL, or a fake booking route.

## Intent B — customer has a complex schedule

Secondary CTA:

```text
Request a Quote
```

Route through the canonical quote flow.

Quote actions use the same canonical current flow fallback and remain visible.

## Intent C — customer requires more information

The page answers:

```text
what the service is
how it differs from a transfer
how long it can be booked
what the chauffeur does during the reserved period
what is included
which sedan to choose
how multi-day / international requests work
how confirmation works
```

No page section invents instant confirmation.

Every request remains pending manual confirmation.

---

# 4. Locked Page Order

The final visible order is exactly:

```text
1.  SiteHeader
2.  Flagship Hero — ServiceHero / full-bleed
3.  Service Definition — ServiceOverview
4.  Hire Options — PrivateChauffeurOptions
5.  Your Time Remains Yours — cinematic open split
6.  One Chauffeur. One Schedule. — itinerary open split
7.  Travel Without Losing the Day — editorial statement section
8.  What Comes With Every Hire — standards / inclusions
9.  Passenger Experience — cinematic open split
10. Sedan Recommendations — VehicleRecommendations
11. Custom Engagement Panel — elevated graphite
12. FAQ
13. FinalCTA
14. SiteFooter
```

The coding agent MUST NOT:

```text
reorder these sections
merge sections
remove sections
insert new visible sections
insert reviews
insert Homepage TrustStrip
insert a process/how-it-works section
insert a pricing table
insert a booking form in Hero
insert a related-service card grid
insert a gallery
insert a second CTA band
```

---

# 5. Image Asset Contract

The owner supplied six contextual assets for this page family.

The implementation MUST use the following five contextual images on this page:

```text
Hero:
chaufferu-hand-on-wheel.jpg

Your Time Remains Yours:
business-transport-hub-hero.jpg

One Chauffeur. One Schedule:
backseat-view-sclass.jpg

Travel Without Losing the Day:
business-transport-vertical-card.jpg

Passenger Experience:
business-transport-backseat-subject-2.jpg
```

Reserved / not used on this page:

```text
business-transport-backseat-subject.jpg
```

That reserved asset remains available for Business Transportation or future replacement.

The coding agent MUST preserve these image roles.

All five contextual images are decorative because the adjacent localized copy
fully communicates their meaning. Render them with `alt=""` and the approved
decorative-image semantics. The reserved alternate is also decorative if used
in a future approved composition. Do not invent localized alt text for these
assets.

These assets are shared service-context imagery used by Private Chauffeur and
other approved transportation surfaces. Consolidate them in a shared,
domain-owned folder rather than a page-owned folder.

Required repository destination:

```text
src/assets/shared/chauffeur-service/
  hero-chauffeur-wheel.jpg
  productivity-backseat.jpg
  schedule-backseat-view.jpg
  editorial-workspace-vertical.jpg
  passenger-experience-reading.jpg
  passenger-experience-alternate.jpg
```

Move the existing owner-supplied files; do not create duplicate copies. Update
every existing consumer import as part of the same atomic asset move. The asset
move does not authorize image substitution.

If an asset is missing, use the repository-approved neutral placeholder and report:

```text
ASSET BLOCKER
```

Do not fetch stock imagery.

---

# 6. Section 01 — Flagship Hero

Component:

```text
ServiceHero
variant = full-bleed
```

Reuse the approved shared full-bleed architecture and Homepage Hero visual
language. The Hero is a full viewport-width, near-viewport photographic canvas
with the SiteHeader in its approved over-Hero state. Content aligns to the
shared page container/grid; the image remains the immersive background at every
state rather than becoming a split media column.

Image:

```text
chaufferu-hand-on-wheel.jpg
```

The image communicates chauffeur service directly.

## Responsive topology

The semantic/source order remains:

```text
content
decorative media
```

The media is positioned as the background layer by the shared component. It
remains non-interactive and MUST NOT precede meaningful content in the
accessibility or focus order. No duplicated Hero markup for separate
breakpoints. The strong semantic-token scrim protects H1, CTA, support-fact,
and over-Hero Header contrast while preserving the chauffeur/steering-wheel
focal point.

## Hero content responsibility

The Hero MUST communicate all of the following:

```text
1. this is Private Chauffeur service in Belgrade
2. the service includes a fleet vehicle + professional chauffeur
3. the service is booked around the customer's schedule
4. standard hire formats include hourly, half-day and full-day
5. multi-day requirements continue through quote
```

## Required Hero copy pattern

H1 intent:

```text
Private Chauffeur in Belgrade
```

Proposition intent:

```text
A premium vehicle and professional chauffeur reserved around your schedule — from a single hour to a full day.
```

The content team can refine wording while preserving this exact meaning.

## CTA hierarchy

Primary:

```text
Book Private Chauffeur
```

Secondary:

```text
Request a Quote
```

## Quiet support line

Render one compact support line with data-derived facts:

```text
From 1 hour
Half day 5h / 100 km
Full day 10h / 200 km
Multi-day by request
```

Values MUST come from `services.ts`.

No pricing amount appears in Hero.

## Forbidden Hero content

Do not render:

```text
fare numbers
currency
rating
reviews
trust chips
fleet specifications
booking form fields
service-standard badges
third CTA
client logos
```

---

# 7. Section 02 — Service Definition

Component:

```text
ServiceOverview
variant = numbered-divider-facts
```

`numbered-divider-facts` is a new additive semantic variant of the shared
component. It preserves all existing `divider-facts` and `grouped-icons`
consumers unchanged. The variant accepts localized title/text plus an explicit
presentational sequence marker, keeps the fact list in one vertical column,
and renders no icons or card shells.

Surface:

```text
open-dark
```

Desktop composition:

```text
5 / 7
```

Purpose:

```text
define Private Chauffeur immediately
distinguish it from a transfer
remove ambiguity around customer-owned vehicle
explain the core service behavior
```

## Core explanatory meaning

The section MUST communicate:

```text
A transfer ends at the destination.
Private Chauffeur keeps the chosen vehicle and chauffeur connected to the customer's reserved period and confirmed schedule.
```

## Four factual rows

Render exactly four divider-led facts.

Do not use icons.

Use compact local sequence numbers:

```text
01
02
03
04
```

These numbers belong only to the fact rows. They MUST NOT compete with page section numbers.

Facts:

```text
01 — Vehicle + professional chauffeur
02 — Hire from one hour
03 — Multiple planned stops
04 — Chauffeur remains available during the booked period
```

The facts are data-driven.

No card grid.

No icon grid.

No TrustStrip.

---

# 8. Section 03 — Hire Options

Page-specific component:

```text
PrivateChauffeurOptions.astro
```

Surface:

```text
light functional contained surface
```

Purpose:

```text
explain which hire format fits which schedule
```

This section is NOT a pricing table.

## Locked hire modes

Exactly:

```text
Hourly
Half Day
Full Day
```

## Hourly

Data:

```text
minimumHours = services.privateChauffeur.bookingOptions.hourly.minimumHours
publishedKmLimit = null
```

Content intent:

```text
shorter schedules
single or several nearby commitments
meetings
appointments
dinner
shopping
private obligations
```

The section MUST NOT invent an hourly kilometre allowance.

## Half Day

Data:

```text
5 hours
100 km included
```

Content intent:

```text
several appointments
multiple stops
structured part of the day
business or private itinerary
```

## Full Day

Data:

```text
10 hours
200 km included
```

Content intent:

```text
complete daily itinerary
multiple locations
longer periods between stops
full working or private schedule
```

## Visual contract

One parent surface.

Desktop:

```text
Hourly | Half Day | Full Day
```

Internal separation uses dividers.

Do not create three independent floating cards.

Mobile:

```text
Hourly
divider
Half Day
divider
Full Day
shared CTA
quiet quote CTA
```

No equal-height forcing.

No horizontal scrolling.

## CTA

Primary:

```text
Book Private Chauffeur
```

Quiet contextual CTA:

```text
Need a longer or more complex itinerary? Request a custom quote →
```

Use canonical flow resolution.

Resolve both actions through the canonical current flow fallback and keep them
visible.

---

# 9. Section 04 — Your Time Remains Yours

Section type:

```text
cinematic open split
```

Components:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Desktop:

```text
image 7 | content 5
```

Image:

```text
business-transport-hub-hero.jpg
```

The image shows a passenger working in the rear cabin.

## Heading

```text
Your time remains yours
```

## Core body meaning

The section MUST sell the practical value of chauffeur hire:

```text
The time between destinations becomes usable passenger time.
The chauffeur handles the journey while the passenger works, prepares, calls, reads, rests, or resets between commitments.
```

## Three benefit statements

Render exactly three.

### Stay productive between stops

Meaning:

```text
Use the rear cabin for calls, preparation, focused work or private time.
```

### Leave the logistics outside

Meaning:

```text
The passenger does not search for parking, arrange the next car or repeat the itinerary after every stop.
```

### Arrive ready for what comes next

Meaning:

```text
The chauffeur handles the journey while the passenger uses the time according to their needs.
```

Visual organization:

```text
heading
short body
three divider-led benefit statements
```

No CTA.

No icons.

No cards.

---

# 10. Section 05 — One Chauffeur. One Schedule.

Section type:

```text
cinematic open split
```

Desktop:

```text
content 5 | image 7
```

The orientation intentionally differs from Section 04.

Image:

```text
backseat-view-sclass.jpg
```

## Heading

```text
One chauffeur. One schedule.
```

## Core body meaning

The section MUST communicate continuity:

```text
The customer does not arrange a new journey after every stop.
The chosen vehicle and chauffeur remain connected to the confirmed itinerary throughout the reserved period.
```

## Itinerary visualization

Render one restrained linear itinerary:

```text
Hotel
→
Meeting
→
Lunch
→
Appointment
→
Dinner
→
Hotel
```

This is editorial, not dashboard UI.

Do not use:

```text
map
cards
icons
interactive timeline
carousel
```

## Three factual statements

### Multiple stops

Meaning:

```text
Several locations can be planned inside the reserved hire period.
```

### Chauffeur remains available

Meaning:

```text
The customer continues when ready according to the confirmed arrangement instead of arranging a new vehicle for every segment.
```

### Plans beyond one day

Meaning:

```text
Multi-day and international itineraries continue through custom quote and manual coordination.
```

## Quiet CTA

```text
Planning a complex itinerary? Request a quote →
```

---

# 11. Section 06 — Travel Without Losing the Day

Section type:

```text
editorial statement composition
```

This section MUST NOT use `OpenSplitSection` if that component forces a conventional balanced split that weakens the locked editorial composition.

Use existing primitives:

```text
Section
PageContainer
SectionHeading
Image
```

Create a page-local wrapper only when required to preserve the locked geometry.

Desktop:

```text
text 8 | vertical image 4
```

Image:

```text
business-transport-vertical-card.jpg
```

Image role:

```text
tall vertical cabin/workspace detail
```

## Heading

```text
Travel without losing the day
```

## Intro

Use one short sentence:

```text
Your chauffeur already knows the confirmed plan and stays connected to the schedule.
```

## Fact panel

Render one contained elevated-graphite fact panel. Inside it, render exactly
four title/support pairs with decorative `01`–`04` markers:

```text
No searching for the next car.
Transportation is already part of the confirmed plan.

No parking decisions between stops.
The chauffeur handles the logistics of arrival and continuing the journey.

No repeating your itinerary throughout the day.
Confirmed locations remain connected within the same schedule.

Step back in when you're ready and continue.
When the passenger is ready, the journey continues according to the confirmed arrangement.
```

The title/support pairs are the visual content. Render the section `body` as
the single intro sentence. Before integration, normalize this content entry so
`heading.intro` is omitted for this section rather than authored and ignored.
No authored item title or supporting line may be silently discarded.

From `lg`, the panel is a balanced 2×2 matrix with quiet internal dividers.
Below `lg`, it is one vertical sequence. It remains one composition rather than
four independent cards.

No bullet icons.

No CTA.

No additional paragraph stack beyond the one intro and the four supporting
lines.

---

# 12. Section 07 — What Comes With Every Hire

Use:

```text
ServiceStandards
variant = numbered-matrix
surface = contained-dark
```

The shared component MUST implement this approved additive information topology.
Do not create a page-local standards clone. Existing variants and consumers
remain backward compatible and receive cross-consumer verification.

`numbered-matrix` is an additive semantic variant. It renders an intro column
and one numbered 2×2 matrix, with no icons or card shells. Existing `cards`,
`divided-panel`, and `editorial-list` consumers retain their current defaults,
surfaces, markup contracts, and responsive behavior.

Surface:

```text
contained graphite / contained-dark
```

Desktop relationship:

```text
heading / intro 4
standards 8
```

The standard groups form one internal 2×2 divider matrix from `lg` upward and
one vertical sequence below `lg`.

No cards.

No icons.

No badge wall.

## Heading

```text
What comes with every hire
```

## Intro meaning

```text
The vehicle, chauffeur and passenger-care standard remains consistent across confirmed Private Chauffeur engagements.
```

## Exactly four groups

### 01 — Professional chauffeur

Use verified facts from `operations.ts`:

```text
suit and tie
English-speaking standard
minimum licence experience
```

Do not expose the internal background-check fact in public copy.

### 02 — Prepared vehicle

Use verified facts:

```text
cleanliness standard
authorized/official maintenance
confirmed requested vehicle model
```

### 03 — Passenger care

Use verified facts:

```text
luggage assistance
passenger insurance
child seat on request
```

### 04 — Cabin comfort

Use verified facts:

```text
bottled water
device chargers
Wi-Fi + climate control as one concise combined fact
```

Do not include massage seats in this section.

Vehicle-specific equipment remains fleet-level information.

---

# 13. Section 08 — Passenger Experience

Section type:

```text
cinematic open split
```

Components:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Desktop:

```text
image 7 | content 5
```

Image:

```text
business-transport-backseat-subject-2.jpg
```

## Heading

```text
Quiet when you need it. Ready when you need to move.
```

## Body meaning

```text
Between destinations, the rear cabin remains the passenger's private space for work, reading, calls or rest while the chauffeur handles the journey.
```

## Exactly two quiet facts

```text
Discreet chauffeur service
Private rear-cabin environment
```

No CTA.

No long feature list.

No amenities repetition.

---

# 14. Section 09 — Sedan Recommendations

Use:

```text
VehicleRecommendations
```

Reuse the current shared carousel mechanics at every viewport. Do not create a
page-specific static-row variant. The three locked recommendations remain in
one ordered carousel/list; controls render only when the shared component
detects real overflow.

Exactly three vehicle IDs:

```text
mercedes-s-class
mercedes-e-class
skoda-superb
```

No V-Class.

No Sprinter.

No other vehicle.

## Heading

```text
Choose the sedan that suits your day
```

## Intro meaning

```text
Choose between maximum rear-seat comfort, executive balance and discreet practical chauffeur travel.
```

The content layer defines framing only.

Canonical:

```text
vehicle names
classes
capacity
media
facts
```

come from fleet data.

No fare appears.

No pricing matrix appears.

No unsupported vehicle feature appears.

The section CTA leads to route key `fleet` through the approved routing helper.

---

# 15. Section 10 — Custom Engagement Panel

Section type:

```text
contained elevated graphite panel
```

Surface:

```text
surface-elevated / graphite hierarchy from active theme
```

Do not create raw colors.

Desktop:

```text
heading / intro 7
facts / CTA 5
```

## Heading

```text
When your schedule doesn't fit a standard hire
```

## Intro

Meaning:

```text
Multi-day journeys, travel outside the standard service area and schedules that require more planning are handled individually.
```

## Three facts

### Multi-day chauffeur

Meaning:

```text
Arrange the vehicle and chauffeur across several days through a custom quote.
```

### Longer-distance or international travel

Meaning:

```text
Send the route and schedule for individual review and quote.
```

### Complex itinerary

Meaning:

```text
Multiple days, locations or special timing requirements are coordinated around one transport plan.
```

## CTA hierarchy

Primary:

```text
Request a Custom Quote
```

Quiet secondary:

```text
Send Us Your Schedule →
```

Both use canonical flow resolution and the current flow fallback until a
dedicated booking route exists.

No cards.

No pricing.

No fake response-time promise.

---

# 16. Section 11 — FAQ

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

The FAQ MUST prioritize purchase objections.

Required topic order:

```text
1. What is the difference between Private Chauffeur and a transfer?
2. What is the minimum hire?
3. Does the chauffeur stay with me between stops?
4. What is included in half-day hire?
5. What is included in full-day hire?
6. Can I add several stops, and how are schedule changes handled?
7. Can I book for several days?
8. Can I travel outside Belgrade or internationally?
9. Can I choose the vehicle?
10. How is the reservation confirmed?
```

Do not add an answer that invents:

```text
overtime pricing
parking inclusion
toll inclusion
unlimited waiting
guaranteed schedule changes
instant availability
```

If the required FAQ answer depends on missing business truth, keep the topic out of production content and report a content-data blocker.

Visible FAQ and FAQ structured data use the same validated array.

---

# 17. Section 12 — Final CTA

Use existing:

```text
FinalCTA
```

No page-local visual variant.

## Heading intent

```text
Tell us how your day is planned
```

## Body meaning

```text
Send the date, starting time, planned locations, passenger count and preferred vehicle. The team confirms the appropriate hire arrangement and availability.
```

## CTA hierarchy

Primary:

```text
Book Private Chauffeur
```

Secondary:

```text
Request a Quote
```

Both actions remain visible and resolve through the canonical current flow
fallback until dedicated booking and quote routes exist.

Verified contact channels are rendered through canonical contact gating only.

FinalCTA remains a medium-height conversion closer.

It MUST NOT become Hero #2.

---

# 18. Pricing Rule

The Private Chauffeur page MUST NOT display monetary fare values.

`pricing.ts` remains the single monetary pricing source and currently owns service-page separation.

Forbidden on this page:

```text
hourly fare
half-day fare
full-day fare
per-km fare
from-price
currency symbol
currency code
calculated estimate
```

The page communicates hire structure, not price.

Link to Pricing only through approved contextual navigation when the content/route contract includes it.

---

# 19. V3 Content Package

The page uses the locked content package supplied with this blueprint:

```text
content/
  private-chauffeur.sr.md
  private-chauffeur.en.md
  private-chauffeur.ru.md

ui-additions/
  sr.json
  en.json
  ru.json

content-contract.md
```

Serbian is the source locale.

The packet's recorded Serbian source digest is provisional because the
repository digest canonicalizer currently
omits nested translatable fields. Fix recursive canonicalization and its unit
coverage first, normalize the approved content described by this blueprint,
then regenerate the digest with `pnpm content:sync-digests
site/luksuzni-prevoz`. The regenerated value becomes authoritative; this
document MUST NOT preserve a stale literal as a release requirement.

The Markdown entries remain `status: in-review` and `noindex: true` during
implementation. After implementation, automated gates, required design review,
technical review, and acceptance pass, publish all three locales atomically:

```text
status: published
noindex: false
routeMap.privateChauffeur.availability: published
```

The owner's additional post-publication manual review may produce follow-up
refinements; it does not authorize skipping repository release gates.

The UI files are merge fragments. They MUST be merged into the existing locale dictionaries without deleting existing keys.

The `faqSchema` maximum is 10. V3 contains exactly 10 FAQ items.

Operational numeric values in FAQ and UI templates are resolved from canonical data according to `content-contract.md`.

---

# 20. Content Ownership

Localized page content owns:

```text
SEO title
SEO description
Hero title
Hero proposition
CTA labels
section headings
editorial body copy
benefit statements
FAQ questions/answers
FinalCTA copy
image alt decisions
```

For the five locked contextual images, this blueprint owns the explicit
decorative decision, so no localized alt copy is required or invented.

Canonical data owns:

```text
hire durations
included kilometres
service modes
chauffeur availability
multiple planned stops
schedule-change handling
multi-day handling
international handling
fleet facts
vehicle IDs
vehicle capacity
operations standards
chauffeur-handled parking/logistics
routes
contact data
manual confirmation mode
pricing
```

UI localization owns reusable data-derived labels.

Reuse the existing keys below wherever their meaning is required:

```text
service.privateChauffeur.chauffeurAvailable
service.privateChauffeur.multiDayQuote
service.privateChauffeur.internationalQuote
service.privateChauffeur.complexQuote
```

Do not merge synonymous `privateChauffeur.schedule.*.text` or
`privateChauffeur.custom.*.text` additions that would create parallel wording
for these facts. Add only missing titles, templates, itinerary labels, and
section/action labels with a distinct semantic responsibility. Section labels
render only where the selected shared/page component contract requires them;
the page MUST NOT add an eyebrow label to every section by default.

No user-visible string is hardcoded in page components.

---

# 21. Internal Links

Canonical relevant routes:

```text
airportTransportation
businessTransportation
vipTransportation
fleet
pricing
future booking / quote intents
```

The page MUST NOT add a standalone related-services card grid.

Use contextual links only where authored and supported.

Every internal route uses:

```text
RouteKey
Link
getPath()
resolveCtaHref()
```

No localized URL concatenation.

The Fleet CTA resolves to route key `fleet` with the approved routing helper.
Booking, quote, custom-quote, and send-schedule intents use the canonical
`resolveCtaHref()` flow behavior. Until dedicated routes exist, that behavior
resolves to the localized Contact destination. Components MUST NOT render
empty, placeholder, disabled-link, current-page, manually concatenated, or fake
route anchors.

---

# 22. Responsive Contract

The implementation uses the active theme breakpoint roles and is reviewed at
all five states in `.governance/viewports.json`. The state contracts below are
deterministic. They own topology, order, width constraints, image behavior, CTA
placement, overflow, and focus order.

## Invariants at every state

```text
DOM/reading order       content before contextual media
section order           exactly the locked page order
container               semantic main or reading container as specified
text measure            semantic body/narrow measure; never viewport-wide prose
images                  reserved geometry; object-cover crop; no distortion
interactive targets     minimum 44 × 44 CSS px
overflow                zero accidental horizontal page overflow
focus order             follows DOM order; never follows visual CSS reordering
flow action             canonical fallback; never empty, manual, or fake
```

## Mobile

```text
Hero                 full-bleed image-backed; content-first; actions stacked;
                     support facts wrap inside the content measure
Overview             one column; four numbered rows remain one vertical list
Hire Options         one column in Hourly → Half Day → Full Day order; shared actions last
Your Time            content then 4:3 image
One Schedule         content, itinerary, facts, optional resolved action, then 4:3 image;
                     itinerary is one vertical semantic sequence
Editorial Statement  intro and four title/support rows, then capped vertical image
Standards            heading/intro then four numbered matrix groups in one column
Passenger Experience content then 4:3 image
Sedans               existing accessible carousel; ordered S-Class → E-Class → Superb
Custom Panel         heading, intro, facts, then resolved actions; one column
FAQ                  reading container; questions wrap without clipped indicators
FinalCTA             compact content-first stack; both flow actions visible; media follows
```

## Tablet portrait

Use the same single-column section topology and semantic order as mobile.
Increase only token-owned gutters/measures. Hero actions remain stacked; this
state does not depend on localized label length. Hire Options and Standards
remain vertical. The sedan carousel shows the shared tablet
continuation cue and retains logical control → list focus order.

## Tablet landscape

At the active `lg` composition threshold:

```text
Hero                 remains full-bleed image-backed with over-Hero Header
Overview             5 / 7; four facts remain one vertical list
Hire Options         three equal internal columns in one parent surface
Your Time            visual image 7 / content 5; DOM remains content → image
One Schedule         content 5 / image 7
Editorial Statement  text 8 / vertical image 4
Standards            heading/intro 4 / 2×2 matrix 8
Passenger Experience visual image 7 / content 5; DOM remains content → image
Sedans               existing carousel mechanics; no static page-local grid
Custom Panel         heading/intro 7 / facts/actions 5
FAQ / FinalCTA       retain their shared contained contracts
```

## Desktop

At desktop the Hero preserves the full-bleed near-viewport composition:

```text
Hero                     full-bleed media canvas; container-aligned content
Overview                 content 5 / numbered facts 7
Hire Options             3 equal internal columns
Your Time                visual image 7 / content 5
One Schedule             content 5 / image 7
Editorial Statement      text 8 / vertical image 4
Standards                heading/intro 4 / 2×2 matrix 8
Passenger Experience     visual image 7 / content 5
Custom Panel             heading/intro 7 / facts/actions 5
```

CTA groups retain the locked hierarchy and do not stretch to fill their grid
column. The sedan carousel stays within the semantic main container.

## Wide desktop

Preserve the desktop topology. Cap the page with `--container-main`, copy with
the approved semantic measures, and media with its assigned grid region. Do not
increase section height, type scale, image ratio, or inter-column gap merely
because more viewport width is available. Empty outer space is intentional.

---

# 23. Accessibility

Minimum:

```text
WCAG 2.2 AA
```

Required:

```text
exactly one H1
logical H2/H3 hierarchy
native semantic elements
44x44 minimum interactive targets
visible focus
keyboard operability
no hover-only information
decorative images use empty alt
informative images use approved localized alt
reduced motion support
no horizontal overflow
correct light-surface contrast
DOM order follows reading/focus order
```

---

# 24. Performance

The page contains multiple large contextual images.

The implementation MUST:

```text
use Astro image pipeline
preload only the Hero image when current performance policy allows it
lazy-load below-the-fold contextual images
provide stable aspect ratio / dimensions
use responsive widths
avoid raw remote images
avoid unnecessary hydration
respect site performance budget
```

No contextual image becomes an uncontrolled LCP competitor.

---

# 25. Implementation Guardrails

The agent MUST NOT:

```text
simplify the page into generic LeafPage
invent new design tokens
invent new breakpoints
use raw colors
copy wireframe CSS
create a PrivateChauffeurFinalCTA
create a PrivateChauffeurFAQ
create a local ServiceHero clone
create a local ServiceStandards clone
create an image gallery
create generic feature cards
create icon rows where numbers/dividers are locked
add pricing
add reviews
add fake metrics
add unsupported operational claims
change shared components silently
```

Shared-component changes follow the authorized additive change protocol in
`implementation.md`; no other shared redesign is in scope.

---

# 26. Definition of Blueprint Compliance

An implementation is blueprint-compliant only when every visible region, image role, CTA role, data source, responsive topology, and prohibition in this file is satisfied.

No undocumented deviation is accepted.
