# Luxury Transportation — Pricing Page Blueprint v1.2

Status: **LOCKED STRUCTURAL BLUEPRINT**
Route key: `pricing`
Page kind: `page`
Design direction: **Platinum Tariff Ledger**
Theme binding: **semantic; resolve the configured active theme**
Primary objective: **make supported prices easy to find without turning the page into a table-heavy tariff sheet**

> This file is page-specific authority.
> The coding agent MUST preserve the visible section order, data ownership, CTA hierarchy, responsive topology, price eligibility, and component roles defined here.
> Any structural change requires an explicit blueprint revision.

Revision 1.2 adopts the reviewed full-bleed `ServiceHero` presentation with an
integrated over-Hero header. It also aligns Pricing FAQ composition with the
shared `/dev/ui` light example: the localized heading and divider-led rows now
share one contained light section. Content, data, CTA, route and SEO contracts
are unchanged.

---

# 1. Authority

Apply the repository authority chains exactly:

```text
Technical:
1. root AGENTS.md
2. validated repository configuration and generated contracts
3. this blueprint for page-specific requirements
4. current reviewed component/data contracts

Visual:
1. this locked blueprint
2. DESIGN.md
3. configured active theme and generated semantic tokens
4. reviewed shared component contracts
5. wireframe.html geometry
6. matching .skills procedures
```

The wireframe defines geometry and hierarchy only.

---

# 2. Product definition

The Pricing page is a catalogue-aligned pricing reference for Luxury Transportation.

It answers:

```text
What can I price immediately?
Which vehicle price applies?
What does the Private Chauffeur hire format include?
Which services require an estimate or individual quote?
When is a price actually confirmed?
```

The page is NOT:

```text
a city-to-city fare catalogue
a route price database
a per-kilometre public booking page
a booking calculator
an automatic quote engine
a SaaS pricing-plan page
a package comparison table
```

Canonical product truth comes from:

```text
src/data/pricing.ts
src/data/services.ts
src/data/fleet.ts
src/data/routes.ts
```

---

# 3. Locked public pricing scope

## Public numeric pricing

Render numeric amounts only for:

```text
Airport Transportation
→ pricing[vehicleId].airportTransfer

Private Chauffeur hourly
→ pricing[vehicleId].hourly
→ service eligibility from privateChauffeur.bookingOptions.hourly

Private Chauffeur half-day
→ pricing[vehicleId].halfDay
→ service limits from privateChauffeur.bookingOptions.halfDay

Private Chauffeur full-day
→ pricing[vehicleId].fullDay
→ service limits from privateChauffeur.bookingOptions.fullDay
```

Numeric ledgers include all and only vehicles whose canonical
`pricingStatus === "published"`, in `fleet.ts` declaration order. The current
fleet has eight vehicles; seven have published pricing. Škoda Kodiaq is
quote-only and does not receive a numeric fallback in Pricing V1.

## Public non-numeric pricing behavior

Render pricing behavior only for:

```text
Business Transportation
Corporate Transportation
Delegation Transportation
Conference & Congress Transportation
Special Events
Wedding Transportation
Prom Transportation
VIP Transportation
```

The label/status comes from each service's `pricingMode`.

## Explicit exclusions

Do not render:

```text
pricing[vehicleId].perKm
docs/pricing.csv → PUTEVI IZ BEOGRADA
any city-to-city fare
any destination fare
any unverified numeric "from" value
any overage formula
```

`data-contract.md` is mandatory for implementation.

---

# 4. Conversion strategy

The page serves three customer intents.

## Intent A — customer found a standard public tariff

Primary action after Airport Transportation:

```text
Explore Airport Transportation
```

Target:

```text
routeKey: airportTransportation
```

Primary action after Private Chauffeur:

```text
Explore Private Chauffeur
```

Target:

```text
routeKey: privateChauffeur
```

These route CTAs let the service page carry the booking-specific flow.

## Intent B — customer needs a custom engagement

Primary custom-pricing action:

```text
Request a Quote
```

Target:

```text
flowKey: quote
```

## Intent C — customer wants to begin directly

Hero primary:

```text
Book a Ride
```

Target:

```text
flowKey: booking
```

Hero secondary:

```text
Request a Quote
```

Target:

```text
flowKey: quote
```

No CTA implies instant confirmation.

---

# 5. Locked page order

The final visible order is exactly:

```text
1.  SiteHeader
2.  Pricing Hero — ServiceHero / full-bleed
3.  Pricing Intro + three-link PricingIndex
4.  Published Prices heading + description — dark/open
5.  Airport Published Pricing — contained light surface
    5A. Airport Transportation
6.  Private Chauffeur heading + description — dark/open
7.  Private Chauffeur Published Pricing — independent contained light surface
    7A. Private Chauffeur — hourly
    7B. Private Chauffeur — half-day
    7C. Private Chauffeur — full-day
8.  Individual Pricing — dark/elevated reset
9.  Pricing Models — independent contained light explanatory surface
10. Confirmation Statement — dark/open reading statement
11. FAQ heading + rows — one independent contained light section
12. FinalCTA
13. SiteFooter
```

`PricingPage.astro` composes the page through `BaseLayout` with
`overHero={true}`. `BaseLayout`/`Page` own document chrome, `lang`/`dir` and
head emission. Build metadata with `buildPageSeo`; no Pricing component emits
head tags.

The coding agent MUST NOT:

```text
insert route pricing
insert per-kilometre pricing
insert a calculator
insert a pricing comparison table
insert pricing cards
insert reviews
insert TrustStrip
insert Fleet showcase
insert a second CTA band
merge Individual Pricing with Published Pricing
hide published rates behind tabs
```

---

# 6. Section 01 — Pricing Hero

Component:

```text
ServiceHero
variant="full-bleed"
```

Shared component code remains unchanged.

Asset:

```text
src/assets/s-class-wheel-interior.webp
```

Image role:

```text
decorative cinematic context
```

Use empty alt text.

## Content

Source:

```text
content.data.hero
content/ui → pricing.hero.eyebrow
```

The Hero communicates:

```text
1. this page contains service pricing
2. standard services have published prices
3. custom engagements receive individual pricing
4. booking and quote are separate actions
```

Pass `content.data.hero.supportText` through the existing `ServiceHero`
support-text contract. Do not replace it with trust-marker badges.

## Desktop topology

Use the reviewed full-bleed component topology. The media fills the Hero canvas,
the content remains inside the main container, and authored support text uses
the existing split composition at the component's desktop threshold.

## Mobile/tablet

Use the existing one-DOM-tree component behavior.

Do not create a second mobile Hero.

## Height

Use the existing `full-bleed` variant height and layering contract unchanged.
Do not create page-local viewport-height, scrim or focal-point overrides.

---

# 7. Section 02 — Pricing Intro + PricingIndex

Surface:

```text
dark background / open section
```

Use:

```text
PageContainer
Section
SectionHeading
PricingIndex page-local component
```

Content:

```text
content.data.introSection
```

After the intro, render exactly three native anchor links:

```text
Airport Transportation → #airport
Private Chauffeur      → #private-chauffeur
Individual Quotes      → #individual-pricing
```

Airport and Private Chauffeur labels come from canonical navigation labels.
The authored custom anchor label comes from `pricing.nav.custom`. The nav
`aria-label` comes from `pricing.nav.ariaLabel`.

## Visual identity

The index is:

```text
open
divider-led
typographic
divider-led within the 7-column index region at the approved split state
```

It is NOT:

```text
three rounded cards
three pills
three equal dashboard tiles
```

## Accessibility

Use `<nav>` with localized `aria-label`.

Anchor targets must receive correct scroll offset for the sticky header if required by current global behavior.

44×44 target minimum applies.

---

# 8. Section 03 — Published Prices + Airport Pricing

Heading surface:

```text
background / open dark
```

The localized Published Prices heading and description render directly on the
page canvas. They are not children of the light pricing surface.

Airport pricing surface:

```text
surfaceLight
textOnLight
```

The Airport ledger is one contained light functional surface below the dark
heading. It does not include the Private Chauffeur ledgers.

Do not create a floating card for each rate row.

Source heading:

```text
content.data.pricing.heading
```

Numeric data source:

```text
src/data/pricing.ts
```

Vehicle source:

```text
src/data/fleet.ts
```

Service-limit source:

```text
src/data/services.ts
```

## General rate-row contract

Every rate row contains:

```text
vehicle display name
optional canonical passenger fact only when current design needs it
formatted price
localized unit/status label
```

Vehicle order follows `fleet.ts` declaration order unless the blueprint is revised.

Rows use restrained internal dividers.

No row has its own CTA.

No row is a rounded card.

---

# 9. Section 03A — Airport Transportation

Anchor:

```text
id="airport"
```

Status:

```text
Fixed fare
```

Data:

```text
getPricing(vehicleId).airportTransfer
```

Scope:

```text
belgrade-airport-to-belgrade-city
```

Localized scope label:

```text
pricing.airport.scope
```

The page MUST state that the published fare is per vehicle for the supported transfer scope.

## Desktop topology

Use approved 5/7 composition:

```text
5 columns
→ title
→ fixed-fare label
→ scope
→ compact explanatory note
→ one service route CTA

7 columns
→ all canonical published-pricing vehicle/fare rows
```

## Mobile/tablet portrait

Stack:

```text
heading/meta
rate list
service CTA
```

## CTA

Label:

```text
pricing.cta.airport
```

Target:

```text
getPath("airportTransportation", locale)
```

Do not route directly to a fabricated booking URL.

---

# 10. Section 04 — Private Chauffeur tariff groups

Anchor on section wrapper:

```text
id="private-chauffeur"
```

Section label:

```text
pricing.chauffeur.label
```

Section title:

```text
pricing.chauffeur.title
```

Intro/note:

```text
pricing.chauffeur.note
```

The Private Chauffeur label, title and note render directly on the dark page
canvas. Below them, render one new independent contained light surface that
owns all three tariff groups and the single service CTA. Return to the dark
canvas between the Airport and Private Chauffeur pricing surfaces.

Render exactly three tariff groups:

```text
Hourly Hire
Half-Day Hire
Full-Day Hire
```

Do not render `perKm`.

## Hourly

Amount:

```text
pricing[vehicleId].hourly
```

Eligibility/fact:

```text
privateChauffeur.bookingOptions.hourly.minimumHours
```

Template:

```text
pricing.rate.hourly.fact
```

Do not fabricate a kilometre limit. The current service contract explicitly has `publishedKmLimit: null`.

## Half-day

Amount:

```text
pricing[vehicleId].halfDay
```

Facts:

```text
privateChauffeur.bookingOptions.halfDay.hours
privateChauffeur.bookingOptions.halfDay.includedKm
```

Template:

```text
pricing.rate.halfDay.fact
```

## Full-day

Amount:

```text
pricing[vehicleId].fullDay
```

Facts:

```text
privateChauffeur.bookingOptions.fullDay.hours
privateChauffeur.bookingOptions.fullDay.includedKm
```

Template:

```text
pricing.rate.fullDay.fact
```

## Rate-group topology

Each `PricingRateGroup` uses approved 5/7 desktop composition:

```text
5 columns
→ tariff title
→ data-derived fact
→ unit/status

7 columns
→ vehicle/fare ledger
```

Groups are separated by whitespace and one quiet divider.

The first group has no decorative top rule. Borders remain restrained; surface
contrast, spacing and hierarchy do most of the separation.

## CTA

One CTA after all three groups:

```text
pricing.cta.chauffeur
```

Target:

```text
privateChauffeur
```

Do not repeat the CTA inside each group.

---

# 11. Currency invariant

Canonical currency already exists in `pricing.ts`:

```text
Airport fares                  → airportTransfer.currency
hourly / halfDay / fullDay     → VehiclePricing.currency
```

Format both through the existing shared locale-aware currency helper and the
configured locale's `intl.numberLocale`.

The component MUST NOT hardcode:

```text
€
EUR
RSD
```

Missing currency for any published-pricing row is a development/build failure
and blocks publication. No presentation fallback is permitted.

---

# 12. Section 05 — Individual Pricing

Anchor:

```text
id="individual-pricing"
```

Surface:

```text
background / surface
dark
```

Content source:

```text
sections[key=individualPricing]
```

Component:

```text
PricingCustomServices
```

## Structure

Desktop:

```text
left 6 columns  → Business Transportation family
right 6 columns → Special Events family
```

Each family is an open column with divider-led service rows.

### Business family source

Start from:

```text
getService("businessTransportation")
```

Render:

```text
business hub
+
canonical children from services.ts
```

### Special Events family source

Start from:

```text
getService("specialEvents")
```

Render:

```text
special-events hub
+
canonical children from services.ts
```

Do not hardcode child-service arrays in the component.

## Row contract

Each service row contains:

```text
localized service name
localized pricing-mode status
route link only when route availability === "published"
```

Status mapping:

```text
["estimated-when-simple","quote"] → pricing.status.estimateQuote
["quote"]                         → pricing.status.quote
["from","quote"]                  → pricing.status.quote
```

Special Events' `"from"` mode does not receive a public `from` number because canonical numeric data is absent.

The custom section CTA resolves `flowKey: quote`.

## Responsive

Mobile/tablet portrait:

```text
Business family
then Special Events family
```

No horizontal scrolling.

No card grid.

---

# 13. Section 06 — Pricing Models

Surface:

```text
independent contained surfaceLight panel
```

Content:

```text
sections[key=pricingModels]
```

Component:

```text
PricingModels
```

Exactly three items:

```text
Fixed fare
Published tariff
Individual quotation
```

Desktop:

```text
3 equal semantic columns
internal vertical dividers
no outer card border
```

Mobile/tablet portrait:

```text
stacked
internal horizontal dividers
```

The section is explanatory, not interactive.

---

# 14. Section 07 — Confirmation Statement

Content:

```text
sections[key=confirmation]
```

Surface:

```text
background / open dark
```

Render the heading, intro and body directly on the dark page canvas as an open
commercial/policy statement, not a card. The region uses the regular
`container.main` page width and grid alignment; paragraph copy remains capped by
the semantic body measure. Use deliberate but non-heroic whitespace.

It must state:

```text
request submission is not confirmation
availability is checked
price model is checked
manual confirmation completes booking
```

Do not invent response-time guarantees.

---

# 15. Section 08 — FAQ

Reuse:

```text
FAQ.astro
```

Content:

```text
content.data.faq
```

Exactly eight questions in the supplied content set.

Render the localized FAQ heading and shared FAQ rows together in one independent
contained `Section surface="light"`, matching the reviewed light composition in
`/dev/ui`. Use `PageContainer` inside the section and pass `on="light"` to both
`SectionHeading` and `FAQ`. The current approved FAQ content model has no intro
field, so do not fabricate intro copy. The FAQ remains divider-led and no item
becomes a card.

Confirmation and FAQ remain separate adjacent semantic sections with independent
dark/open and contained-light surface ownership.

The same validated array feeds visible FAQ and `buildFaqPage` structured data.

Do not add price amounts to FAQ copy.

Do not duplicate service limits numerically in FAQ copy.

---

# 16. Section 09 — Final CTA

Reuse:

```text
FinalCTA.astro
```

Content:

```text
content.data.finalCta
```

Primary:

```text
booking flow
```

Secondary:

```text
quote flow
```

Use verified canonical phone/email only through the existing FinalCTA contact contract.

Do not reuse the Pricing Hero image.

FinalCTA remains medium-height.

Integration contract:

```text
image             → src/assets/final-cta-bg.webp
imageAlt          → ""
imageFit          → "cover"
mediaTreatment    → "integrated"
desktop behavior  → reviewed 62/38 split from lg
```

---

# 17. Visual contract

Theme:

```text
configured active Black & Platinum theme
```

Type:

```text
Headings → Inter Tight
Body/UI  → Manrope
Brand     → existing BrandLockup only
```

Page rhythm:

```text
full-bleed image Hero with integrated header
→ dark 5/7 intro/index
→ dark Published Prices heading/description
→ contained light Airport pricing surface
→ dark Private Chauffeur heading/description
→ independent contained light shared Chauffeur surface
→ dark individual-pricing region with one elevated family panel
→ independent contained light Pricing Models surface
→ dark open confirmation statement
→ contained light FAQ section with heading + shared rows
→ dark contained FinalCTA
```

The dark/light transitions are semantic, not decorative alternation.

Platinum use is restricted to:

```text
eyebrows
selected/high-value small emphasis
quiet dividers/details where current contracts call for it
focus
primary action treatment through existing components
```

No metallic gradients.

No gold.

No glow.

No oversized SaaS radius.

---

# 18. Responsive contract

Reference evidence widths:

```text
320
768
1024
1440
1920
```

All topology changes use the configured active theme breakpoint roles from `layout.json`.
Do not copy raw breakpoint values into page-local production code or future blueprint revisions.

## 320 mobile

```text
Hero → single-column existing component state
Intro/index → one-column logical order; three divider-led links remain full-width within their column
Airport → heading then ledger
Chauffeur groups → heading then ledger
Custom services → Business then Events
Pricing models → stacked
Confirmation → open regular-width region on the dark canvas; prose retains body measure
FAQ → contained light section; heading then divider-led rows in logical order
```

## 768 tablet portrait

```text
preserve mobile logical order
increase breathing room
no forced side-by-side ledger
```

## 1024 tablet landscape

```text
pricing ledgers remain readable
Intro/Index uses 5/7
pricing ledgers remain stacked until xl
custom families remain stacked until xl
Pricing Models uses three columns
FinalCTA uses its reviewed 62/38 lg state
```

The page-local Airport/Chauffeur 5/7 tariff topology and custom-family 6/6
topology activate at `xl`. Verify immediately below and above `xl`; do not copy
its raw value into production CSS.

## 1440 desktop

```text
5/7 Airport
5/7 each Chauffeur tariff group
6/6 custom families
3-column pricing models
```

## 1920 wide desktop

```text
same topology as desktop
main content capped by the active `container.main` role
no widening of row measure beyond the approved container
```

No horizontal page overflow at any state.

---

# 19. Accessibility

Required:

```text
exactly one H1
logical H2/H3 structure
native nav for PricingIndex
native links for route/anchor actions
44×44 interactive targets
visible focus
no hover-only price information
semantic lists for rate rows
currency/unit announced as text
logical DOM order
reduced motion
no duplicated responsive DOM
```

Price alignment must remain understandable at 200% text zoom.

Do not rely on column position alone to communicate the rate unit.

---

# 20. SEO and structured data

Before publication:

```text
route availability = scaffold
content status      = draft
noindex             = true
```

After data consistency + implementation acceptance:

```text
route availability = published
content status      = published
noindex             = false
```

Required SEO behavior:

```text
unique localized title/description
exactly one H1
canonical from route map
reciprocal hreflang
pricing route included in sitemap only after publication
crawlable internal links
equivalent meaningful mobile/desktop content
```

Structured data:

```text
Breadcrumb / normal page graph → existing architecture
FAQPage → only from visible validated FAQ
```

Do not add:

```text
Offer
AggregateOffer
priceRange
Product
review/rating schema
```

for Pricing V1.

---

# 21. Content/localization contract

Canonical localized content lives at:

```text
src/content/pages/pricing/pricing.sr.md
src/content/pages/pricing/pricing.en.md
src/content/pages/pricing/pricing.ru.md
```

The three files MUST retain structural parity.

Serbian is the source locale.

EN/RU source digest in this package:

```text
efbdb5a9f5bbdc38
```

Only after an approved Serbian editorial change:

```bash
pnpm content:sync-digests
```

Translations must be reviewed again if the digest becomes stale.

No user-visible string is added to Astro markup.

---

# 22. Verification exit

The page is complete only when:

```text
all acceptance items pass
fleet/pricing/currency invariants pass
content is published
route is published
design review has no P0/P1
technical page review passes
site check/build pass
responsive review passes all five states
```

Required commands are enumerated in `acceptance.md`.
