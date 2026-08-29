# Luxury Transportation — Corporate Transportation Blueprint v1

Status: **LOCKED STRUCTURAL BLUEPRINT**  
Route key: `corporateTransportation`  
Parent hub: `businessTransportation`  
Page type: `service`  
Primary goal: **convert company/executive transport requirements into a confirmed corporate request**

> This file is page-specific authority.
> The implementation MUST preserve the exact visible order, data ownership, component roles, responsive topology, CTA hierarchy and content responsibilities defined here.
> A structural change requires an explicit blueprint revision.

---

# 1. Product definition

Corporate Transportation is chauffeur-driven business transportation for executives, management, business guests, companies, and company-side assistants or travel coordinators.

Canonical `services.ts` capabilities:

```text
supportsOneOff = true
supportsRecurringContracts = true
supportsInvoicing = true
supportsNegotiatedPricing = true
dedicatedChauffeurAcrossStops = true
pricingMode = estimated-when-simple + quote
```

The page is NOT:

```text
Delegation Transportation
Conference / Congress Transportation
a generic Private Chauffeur duplicate
a security / close-protection service
an instant ride-hailing product
a public pricing table
```

---

# 2. Conversion strategy

The visitor must understand within the Hero + first section:

```text
what Corporate Transportation is
who it is for
one-off vs recurring support
business invoicing support
same-chauffeur continuity across connected schedule points
manual confirmation
```

Primary action:

```text
Send a Corporate Request
```

Secondary action:

```text
Request a Quote
```

The page progression is locked:

```text
definition
→ audience recognition
→ commercial model choice
→ real working-day value
→ coordination proof
→ vehicle choice
→ service standard
→ objections
→ final request
```

---

# 3. Locked visible order

Exactly:

```text
1. SiteHeader
2. Full-bleed Corporate Hero
3. Corporate Service Overview — four numbered facts
4. Who This Is For — editorial audience rail
5. One-Off vs Recurring — commercial pathways panel
6. Keep the Working Day Connected — image-led split + itinerary ribbon
7. One Plan. One Point of Coordination. — graphite coordination panel
8. Corporate Vehicle Recommendations
9. What Your Company Can Expect — standards matrix
10. FAQ
11. FinalCTA
12. SiteFooter
```

Do not insert:

```text
reviews
client logos
Business Hub child-service cards
process/how-it-works
pricing matrix
generic trust strip
related-services grid
gallery
extra CTA band
```

Client logos remain owned by the Business Hub.

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

Eyebrow comes from:

```text
corporateTransportation.hero.eyebrow
```

H1 and description come from localized page content.

Primary CTA resolves to `booking`.

Secondary CTA resolves to `quote`.

The canonical flow resolver owns the distinction:

```text
booking → localized Contact route + intent=booking
quote   → localized Contact route + intent=quote
```

Page code never constructs either URL or query parameter.

## Hero support facts

Build one restrained support line from canonical capability checks + existing UI keys:

```text
business.commercial.oneOff
business.commercial.recurring
business.capability.invoicing
business.capability.dedicatedChauffeurAcrossStops
business.hero.trust.manualConfirmation
```

The first four labels require their matching Corporate capabilities. The manual
confirmation label requires `contact.bookingLeadTime.confirmationMode ===
"manual"`. If a locked canonical fact becomes false/missing, fail build and
report a data-contract blocker. Do not silently hide it.

## Hero image slot

Locked shared asset:

```text
src/assets/shared/other/chauffeur-inside-grayedout.webp
```

Required visual character:

```text
professional chauffeur / executive arrival
modern office, hotel or business architecture
premium, discreet and credible
clear business context
negative space for Hero copy
no misleading security/protection cues
```

Import the existing shared WebP directly and pass it through `ServiceHero`.
Do not copy, rename, convert or duplicate the source asset. Use the existing
full-bleed image treatment and review its crop at all five required viewport
states before considering any shared API change.

---

# 5. Corporate Service Overview

Use shared:

```text
ServiceOverview
variant="numbered-divider-facts"
surface="open-dark"
```

Desktop:

```text
copy 5 | facts 7
```

Exactly four facts:

```text
01 One-off corporate request
02 Recurring arrangement
03 Business-client invoicing
04 Same chauffeur across connected schedule points
```

Titles use existing `business.*` UI labels.

Descriptions use:

```text
corporateTransportation.overview.oneOff.text
corporateTransportation.overview.recurring.text
corporateTransportation.overview.invoicing.text
corporateTransportation.overview.dedicated.text
```

No icons. No cards. No prices.

---

# 6. Who This Is For — editorial audience rail

Content section key:

```text
audience
```

Exactly five authored items.

Visual contract:

```text
open dark
heading + intro/body
divider-led audience rail
local decorative numbers 01–05
no raised cards
no icons
```

Wide desktop uses five segments only while copy remains readable.

Tablet uses a deliberate 2-column or vertical divider composition.

Mobile uses one vertical sequence.

The rail is static editorial content.

---

# 7. One-Off vs Recurring — commercial pathways

Page-local component:

```text
CorporateEngagementPanel.astro
```

One light functional parent surface.

Desktop:

```text
one-off 5 | recurring 7
```

## One-off side

Uses:

```text
business.commercial.oneOff
engagementModel.items[0]
CTA → booking
CTA label → corporateTransportation.cta.oneOff
```

## Recurring side

Uses:

```text
business.commercial.recurring
engagementModel.items[1]
```

Exactly three canonical capability facts:

```text
business.capability.recurringContracts
business.capability.invoicing
business.capability.negotiatedPricing
```

CTA:

```text
quote
corporateTransportation.cta.recurring
```

No monetary amounts.

No pricing cards.

No contract duration claim.

No guaranteed commercial terms outside the confirmed arrangement.

---

# 8. Keep the Working Day Connected

Compose with:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Section key:

```text
workingDay
```

Desktop:

```text
image 7 | copy 5
```

Image target:

```text
src/assets/shared/other/s-class-driving-forest-intheback.webp
```

Required image character:

```text
executive/business passenger in rear cabin
work / call / preparation / quiet travel
credible corporate context
```

Require exactly three authored benefit items.

Below the split render one restrained itinerary ribbon:

```text
Hotel
→ Office
→ Meeting
→ Lunch
→ Client
→ Dinner
```

Labels come from UI JSON.

No times. No map. No JavaScript. No dashboard styling. No CTA.

Import the existing shared WebP directly through `OpenSplitSection`. Do not
copy, rename, convert or duplicate it. The existing shared media handling owns
lazy loading, responsive widths and reserved geometry.

---

# 9. One Plan. One Point of Coordination.

Page-local component:

```text
CorporateCoordinationPanel.astro
```

Surface:

```text
elevated graphite
```

Desktop:

```text
heading/body 5 | coordination model 7
```

Right-side model contains exactly:

```text
Professional chauffeur
Company contact
Confirmed itinerary
```

feeding:

```text
One confirmed transport plan
```

Node copy comes from `corporateTransportation.coordination.*`.

Connection treatment is static CSS only.

No JS. No flowchart library. No glass. No glow.

Quiet CTA:

```text
corporateTransportation.cta.sendScheduleQuiet
→ booking flow
```

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
```

No fourth vehicle.

No Sprinter.

No Superb on this page.

Canonical fleet data owns vehicle facts and media.

No fare.

---

# 11. What Your Company Can Expect

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

Add markers `01`–`04`.

Exactly four groups.

Exactly three visible facts per group.

Desktop:

```text
intro 4 | matrix 8
```

Heading/intro:

```text
corporateTransportation.standards.heading
corporateTransportation.standards.intro
```

Do not create a Corporate standards clone.

Do not expose background checks.

Do not add massage-seat language.

---

# 12. FAQ

Use:

```text
ReadingContainer
FAQ
```

Surface:

```text
light
```

Exactly nine questions.

Allowed operational tokens:

```text
{oneOffAnswer}
{recurringAnswer}
{commercialAnswer}
{dedicatedAnswer}
{outsideAreaAnswer}
{vehicleAnswer}
{confirmationAnswer}
```

Resolve only after asserting:

```text
corporate supportsOneOff
corporate supportsRecurringContracts
corporate supportsInvoicing
corporate supportsNegotiatedPricing
corporate dedicatedChauffeurAcrossStops
business hub outsideBelgrade = quote
operations requestedConfirmedModelGuaranteed
contact confirmationMode = manual
```

The exact same resolved FAQ array feeds visible FAQ and FAQ structured data.

---

# 13. Final CTA

Reuse existing:

```text
FinalCTA
```

Primary → booking.

Secondary → quote.

Both buttons MUST render through canonical `resolveCtaHref()` behavior.

Do not create a fake booking route.

---

# 14. Pricing

No monetary values appear on this page.

`estimated-when-simple` does not authorize a page component to invent an estimate.

Forbidden:

```text
hourly fare
per-km fare
from-price
currency
pricing matrix
automatic estimate
```

---

# 15. Content package

Use supplied:

```text
content/
  corporate-transportation.sr.md
  corporate-transportation.en.md
  corporate-transportation.ru.md

ui-additions/
  sr.json
  en.json
  ru.json

content-contract.md
asset-contract.md
```

Serbian is source locale.

EN/RU source digests are generator-owned and MUST match the current Serbian
source digest produced by `pnpm content:sync-digests site/luksuzni-prevoz`.

Keep all three:

```text
status: in-review
translationState: reviewed
noindex: true
```

during implementation.

Publish only after acceptance passes and both locked shared images resolve.

---

# 16. Component budget

Required page-local:

```text
CorporateTransportationPage.astro
CorporateEngagementPanel.astro
CorporateCoordinationPanel.astro
```

Do not create:

```text
CorporateHero
CorporateOverview
CorporateFAQ
CorporateFinalCTA
CorporateVehicleRecommendations
CorporateStandards
```

Audience rail and Working Day are direct compositions from shared primitives.

Do not extract a speculative Business-family component in this task. Delegation/Congress can trigger extraction after a second verified consumer proves the same contract.

---

# 17. Responsive contract

The active theme owns thresholds. The locked topology changes are:

```text
md  → tablet editorial grids become available
lg  → 12-column service splits and horizontal itinerary activate
xl  → ServiceHero supportText uses its existing 7 / 5 wide composition
2xl → audience rail expands from three to five segments
```

The DOM remains in logical reading order at every state. No CSS reordering may
move interactive content ahead of its source order. The Working Day DOM is copy
then image; `OpenSplitSection layout="image-content" ratio="7-5"` places the
image visually first only from `lg` onward.

## Mobile — 320 reference, below `md`

```text
Hero                         full bleed; copy/actions/support stack; actions full width
Overview                     one vertical fact sequence
Audience rail                one vertical divider sequence
Engagement                   one-off then recurring
Working Day                  copy then 4:3 image; itinerary vertical
Coordination                 heading, three nodes, destination, quiet CTA
Vehicles                     shared narrow carousel behavior
Standards                    one numbered sequence
FAQ                          reading width; summaries wrap
FinalCTA                     copy, both stacked actions, then shared media behavior
```

## Tablet portrait — 768 reference, `md` to below `lg`

```text
Hero                         full bleed; actions may share a row; support remains stacked
Overview                     one vertical fact sequence
Audience rail                two columns; fifth item spans the final row
Engagement                   stacked pathways inside one light parent surface
Working Day                  copy then image; itinerary remains vertical
Coordination                 stacked model with visible node-to-destination relationship
Vehicles                     shared tablet carousel behavior
Standards                    one numbered sequence
FAQ / FinalCTA               shared tablet behavior; both CTA actions remain visible
```

## Tablet landscape — 1024 reference, `lg` to below `xl`

```text
Hero                         full bleed; support remains stacked
Overview                     5 / 7
Audience rail                two columns; fifth item spans the final row
Engagement                   5 / 7
Working Day                  visual image 7 / copy 5; one horizontal itinerary
Coordination                 5 / 7
Vehicles                     shared three-item-capable carousel behavior
Standards                    4 / 8 with 2×2 matrix
FAQ / FinalCTA               shared behavior; both CTA actions remain visible
```

## Desktop — 1440 reference, `xl` to below `2xl`

```text
Hero                         full bleed; support uses existing 7 / 5 composition
Overview                     5 / 7
Audience rail                three columns; final row remains left aligned
Engagement                   5 / 7
Working Day                  visual image 7 / copy 5; one horizontal itinerary
Coordination                 5 / 7
Vehicles                     shared three-item behavior
Standards                    4 / 8 with 2×2 matrix
FAQ                          reading width
FinalCTA                     shared desktop behavior; both actions visible
```

## Wide desktop — 1920 reference, `2xl` and above

```text
All page content remains capped by the approved main/reading containers.
Audience rail expands to exactly five equal segments.
Other regions retain desktop topology; whitespace expands only through tokens.
```

At all states, contextual images keep reserved geometry and intentional crop;
CTA targets remain at least 44×44; the itinerary never scrolls horizontally;
long SR/EN/RU strings wrap without clipping; focus follows DOM order; and
`scrollWidth` does not exceed `clientWidth`.

---

# 18. Typography contract

```text
H1  → Hero title only
H2  → Overview, Audience, Engagement, Working Day, Coordination, Vehicles,
      Standards, FAQ, and FinalCTA section headings
H3  → authored audience/benefit/path titles, coordination nodes, vehicle cards,
      and standards groups where the owning component uses headings
```

H1/H2/H3 use `font-heading`. Body copy, labels, itinerary text, FAQ summaries,
facts, controls and actions use `font-body`. `font-brand` is forbidden outside
the shared BrandLockup. FAQ summaries are controls, not substitute headings.
No raw type values or page-local type scale may be introduced.

---

# 19. Accessibility

Hard requirements:

```text
WCAG 2.2 AA
one H1
logical heading order
44×44 targets
visible focus
native semantic lists
no hover-only information
correct image alt
reduced motion
logical DOM order
no horizontal overflow
```

Illustrative numbers are decorative.

---

# 20. Performance / imagery

Exactly two contextual image slots plus canonical fleet media:

```text
Hero
Working Day
```

Use Astro image pipeline.

Hero follows shared eager/high-priority contract.

Working Day lazy-loads with stable dimensions/aspect.

No remote stock hotlinks.

No publication with neutral placeholders or duplicated page-local copies.

---

# 21. Prohibited drift

The implementation MUST NOT:

```text
convert Hero back to contained/split
add Business Hub logos
add reviews
add pricing
add security claims
add 24/7 claims
add guaranteed last-minute changes
hardcode visible English
hardcode localized URLs
duplicate service/fleet/operations facts in page components
introduce card-grid SaaS styling
introduce raw colors
introduce new breakpoints
silently modify shared components
```

---

# 22. Blueprint compliance

The page passes only when every locked region, data source, CTA, component role, image slot, responsive state and prohibition in this file is satisfied.
