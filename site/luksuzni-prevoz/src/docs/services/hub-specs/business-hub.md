# Business Transportation Hub — Page Blueprint & Agent Implementation Brief

**Project:** Luxury Transportation  
**Page type:** Service category / business transportation hub  
**Status:** Ready for implementation planning  
**Depends on:** Shared Hub Page Primitives specification  
**Important:** Use the existing project design system, theme, tokens, typography, containers, header/footer, CTA patterns, i18n architecture, and SEO conventions as source of truth.

---

# 1. Page Purpose

The Business Transportation Hub is the category-level landing page for professional/business transportation.

It must make one core promise clear:

> Luxury Transportation can handle anything from one executive journey to coordinated multi-vehicle business transport.

The page should feel:

- executive
- precise
- discreet
- operationally capable
- calm
- premium

It should **not** feel like:

- a generic B2B SaaS landing page
- a chauffeur company stuffed with corporate buzzwords
- an event-planner website
- a security/close-protection service
- a luxury page overloaded with gold

---

# 2. Child Service Architecture

The hub must prominently route to these three child services:

## 2.1 Corporate Transportation

Use cases:
- executive travel
- recurring corporate transport
- meetings
- hotel ↔ office
- airport ↔ office
- client transport
- roadshows
- business trips
- account/contract-style arrangements

Important:
**Roadshows stay inside Corporate Transportation. Do not create a separate Roadshow page.**

---

## 2.2 Delegation Transportation

Use cases:
- executive delegations
- corporate groups
- diplomatic-style delegations
- multi-vehicle arrivals/departures
- hotel/airport/venue coordination

Positioning:
- coordinated fleet
- discreet execution
- clear point of contact
- schedule flexibility

Constraint:
Do not claim security, guards, close protection, escorts, background checks, or similar services.

---

## 2.3 Conference & Congress Transportation

Use cases:
- conferences
- congresses
- business events
- speakers/VIPs
- multiple hotels
- venue transfers
- dinners/evening programs
- airport arrivals/departures

Positioning:
- multi-vehicle scheduling
- timetable coordination
- multiple pickup points
- group movement
- changes during the event

---

# 3. Primary Conversion Goal

Primary:
**Business transport enquiry / quote**

Secondary:
Move users into the correct child service page.

The page should not force visitors through a long generic booking form before they understand the service.

Use the project's established CTA labels where possible.

Potential intent:
- Plan Business Transport
- Request a Quote
- Contact Our Team

Do not imply automatic acceptance/instant confirmation.

---

# 4. Recommended Section Order

```txt
1. Business Hub Hero
2. Business Service Selector
3. Operational Capability
4. Why Companies Work With Us
5. Editorial Feature — Business Travel & Roadshows
6. Fleet Preview
7. Trusted By / Partner Logos
8. How Business Coordination Works
9. Related Services
10. Final CTA
```

This order may be adjusted slightly if existing page patterns strongly favor another arrangement, but preserve the narrative logic.

---

# 5. Section Specifications

## 5.1 Hero

### Goal

Immediately position Luxury Transportation as a business transport operator capable of both individual and coordinated programs.

### Suggested content direction

Eyebrow:
`Business Transportation`

H1 direction:
`Business transportation, precisely coordinated.`

Do not treat this exact English wording as approved production translation; use it as content intent unless approved localized copy already exists.

Supporting message:
- individual executives through multi-vehicle schedules
- business travel built around timing and coordination
- Belgrade/Serbia context where appropriate

### CTA

Primary:
business enquiry / quote

Secondary:
jump to services or explore business services

### Optional compact proof line

Examples of content categories:
- Executive travel
- Delegations
- Conferences
- Multi-vehicle coordination

### Visual

Preferred:
- S-Class / E-Class / V-Class at a modern business, hotel, aviation, or architectural environment
- chauffeur interaction
- executive arrival/departure

Avoid:
- fake boardroom stock photography
- posed handshake imagery
- generic laptop/office photos
- fake "corporate team" photos

---

## 5.2 Business Service Selector

Use the shared 3-service selector.

### Items

#### 01 — Corporate Transportation
Short intent:
Executive and recurring business travel built around the working day.

Potential meta:
`Executives · Roadshows · Recurring transport`

#### 02 — Delegation Transportation
Short intent:
Coordinated movement of executives, guests, and multiple vehicles.

Potential meta:
`Multi-vehicle · Airport · Hotel · Venue`

#### 03 — Conference & Congress
Short intent:
Transport programs for event schedules, speakers, guests, and multiple locations.

Potential meta:
`Schedules · Groups · Multiple pickup points`

### UX

The three entries must be obvious navigation choices, not passive marketing cards.

---

## 5.3 Operational Capability

### Core message

**One journey or an entire movement.**

Again, use as intent rather than unapproved localized final copy.

### Purpose

Explain the difference between a normal transfer provider and a company capable of coordinating business logistics.

### Suggested visual/content concept

Show a simple itinerary model such as:

`Airport → Hotel → Office → Venue → Dinner → Airport`

Alongside scale:

`1 executive → several guests → coordinated fleet`

Explain:

- one or multiple vehicles
- matching transport to itinerary
- airport, hotel, office, venue coordination
- schedule changes
- single point of contact for more complex arrangements

### Visual treatment

Prefer:
- 50/50 split
- strong image
- minimal route/timeline visualization

Do not turn it into a complex dashboard.

---

## 5.4 Why Companies Work With Us

### Purpose

Evidence/trust section.

### Topics

Use only facts supported by project/business data:

- professional chauffeurs
- drivers in suits/ties
- experienced drivers
- English-speaking chauffeurs
- discreet service
- own fleet preferred
- partner fleet backup where required
- multi-vehicle capability
- recurring corporate arrangements
- flight monitoring where airport transport is involved
- manual coordination for complex requests

### Design

Could use:
- restrained grid
- compact numbered facts
- text + one detail image

Avoid generic icon soup.

---

## 5.5 Editorial Feature — Business Travel & Roadshows

### Purpose

Give roadshows a meaningful presence without creating a separate SEO page.

### Message

Transport should follow the working day, not force the working day to follow transport.

Cover:
- multiple meetings
- changing times
- waiting between appointments
- additional stops
- airport integration
- chauffeur remaining available where service arrangement allows

### Cross-link

Natural link to:
**Private Chauffeur**

This section can explain that chauffeur-at-disposal service may suit roadshows and flexible business days.

---

## 5.6 Fleet Preview

Use canonical fleet data / existing fleet preview.

### Business-relevant categories

Do not hardcode if current data structure already defines them.

Typical relevance:
- S-Class — executive/VIP
- E-Class — business travel
- V-Class — executives/groups
- Sprinter — larger groups/delegations

Škoda models may appear according to final fleet categorization.

### Important

Current fleet data is provisional until the owner supplies final production fleet information.

Do not duplicate model specs in this page.

---

## 5.7 Trusted By / Partner Logos

### Purpose

This is the preferred site location for partner/client/business logos.

### Rules

- Use only real approved logos already supplied/authorized.
- Do not invent clients.
- Do not imply endorsement beyond the real relationship.
- Monochrome/subdued treatment preferred.
- Maintain logo aspect ratios.
- Alt text should be sensible.
- If there are not enough approved logos, omit the section rather than filling it with placeholders in production.

Potential heading direction:
`Trusted for business travel and guest transportation`

Keep restrained.

---

## 5.8 How Business Coordination Works

Recommended 4 steps:

1. **Send the itinerary**
   - dates, times, locations, passenger count, vehicle needs

2. **We coordinate the transport plan**
   - vehicles, timings, pickups, airport/venue requirements

3. **Chauffeurs operate to the agreed schedule**
   - support adjustments where feasible

4. **Service is manually confirmed**
   - preserve current booking/confirmation rules

Exact labels may be improved by content agent.

Do not suggest algorithmic dispatch or instant automated confirmation unless such systems genuinely exist.

---

## 5.9 Related Services

Primary cross-links:

- Airport Transfer
- Private Chauffeur

Potential contextual relationship:
- airport transfer for individual arrivals
- private chauffeur for flexible day schedules

Do not repeat the three business child services here unless the current site's related-service component structurally requires them.

---

## 5.10 Final CTA

Use the existing global FinalCTA.

Content intent:
- discuss itinerary
- request business transport
- complex schedules welcome
- one car or multiple vehicles

Do not fork the component.

---

# 6. Content Tone

Use:

- concise
- confident
- operational
- professional
- discreet
- specific

Avoid:

- "world-class"
- "unparalleled"
- "ultimate luxury"
- "elite experience"
- fake urgency
- security terminology
- unsupported numerical claims
- excessive use of "VIP"

Talk about execution and reliability more than luxury adjectives.

---

# 7. Photography Direction

Preferred scenes:

- chauffeur opening vehicle at hotel/business entrance
- S-Class/E-Class/V-Class in premium architectural environment
- executive arrival
- multiple vehicles lined up naturally
- airport/hotel context
- chauffeur waiting beside vehicle
- subtle business travel details

Avoid:

- obvious stock-boardroom photos
- fake office teams
- handshakes
- people pointing at charts
- champagne
- nightlife limousine imagery
- security/bodyguard imagery

---

# 8. SEO Intent

The hub should target broad business transportation category intent.

Potential semantic themes:

- business transportation Belgrade
- corporate chauffeur service Belgrade
- executive transportation Serbia
- business car service
- corporate transport
- delegation transportation
- conference transportation
- chauffeur for business travel

Do not stuff exact-match phrases.

Child pages should carry the more specific search intent.

### Internal links required

- Corporate Transportation
- Delegation Transportation
- Conference & Congress Transportation
- Airport Transfer
- Private Chauffeur
- Fleet if contextually appropriate
- Contact/booking path

---

# 9. Structured Data

Follow the project's SEO implementation conventions.

Likely relevant:
- WebPage
- Service
- BreadcrumbList
- Organization references from global schema

Do not add:
- fake prices
- fake reviews
- fake aggregate ratings
- fake service areas
- fake clients

---

# 10. Responsive Notes

### Mobile

- Hero remains concise.
- Service selector stacks.
- Operational itinerary must remain readable.
- Avoid tiny route labels.
- Logos should wrap cleanly.
- No horizontal business-process diagrams requiring swipe.

### Desktop

- Editorial/asymmetric compositions welcome.
- Maintain existing site max widths.
- Avoid overly dense corporate dashboards.

---

# 11. Implementation Acceptance Criteria

- [ ] Uses shared hub primitives.
- [ ] Links clearly to all three business child pages.
- [ ] Roadshows live under Corporate, not as a new page.
- [ ] Delegation content avoids security-service claims.
- [ ] Operational capability is clearly communicated.
- [ ] Partner logo section uses approved real assets only.
- [ ] Fleet data comes from canonical source.
- [ ] Manual confirmation language is accurate.
- [ ] Airport Transfer and Private Chauffeur are contextually cross-linked.
- [ ] Mobile layout fully works.
- [ ] Accessible focus/heading/alt behavior is complete.
- [ ] Locale/SEO architecture follows existing project rules.
- [ ] No new theme/tokens/design system is introduced.

---

# 12. Agent Execution Instruction

Before coding:

1. Read existing root project rules and page implementation docs.
2. Inspect the implemented Airport Transfer page and Homepage for established page composition patterns.
3. Audit existing shared components before creating new ones.
4. Read the Hub Page Primitives specification.
5. Implement only the minimum new primitives needed.
6. Build the Business Hub with real project content architecture.
7. Do not invent final translations or unsupported business claims.
8. If production localized copy is absent, use the repository's approved content workflow or clearly marked non-production placeholders according to existing project rules.
9. Run the project's required lint/build/test checks.
10. Report:
   - files changed
   - new reusable components
   - reused components
   - data/content files touched
   - SEO/schema additions
   - unresolved content/data blockers
