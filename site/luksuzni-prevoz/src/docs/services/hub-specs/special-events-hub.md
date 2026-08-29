# Special Events Hub — Page Blueprint & Agent Implementation Brief

**Project:** Luxury Transportation  
**Page type:** Service category / Special Events hub  
**Status:** Ready for implementation planning  
**Depends on:** Shared Hub Page Primitives specification  
**Important:** Reuse the existing Theme V2, typography, spacing, containers, global CTA, header/footer, data architecture, i18n system, responsive rules, and accessibility conventions.

---

# 1. Page Purpose

The Special Events Hub is the category page for occasion-based chauffeur transportation.

It should help visitors immediately choose the relevant service:

- Wedding Transportation
- Prom Transportation
- VIP Transportation

The page must feel:

- cinematic
- premium
- warm
- composed
- visually led
- trustworthy

It must still look unmistakably part of the Luxury Transportation website.

Avoid turning the page into:

- a wedding planner site
- a party limousine page
- a nightlife page
- an ornate "luxury" page
- a gold/floral design theme

---

# 2. Child Service Architecture

## 2.1 Wedding Transportation

Use cases:
- couple transportation
- guest transportation
- multi-car arrangements
- ceremony/photo/venue timing
- V-Class / Sprinter for guests where appropriate
- waiting between scheduled parts when arranged

Design/content:
Premium and elegant, but never clichéd.

---

## 2.2 Prom Transportation

Use cases:
- premium arrival
- vehicle selection
- passenger capacity
- pickup timing
- group transportation where relevant

This child page can eventually be shorter and more conversion-focused than Wedding/VIP.

---

## 2.3 VIP Transportation

Use cases:
- private/custom itinerary
- important guests
- premium event transport
- chauffeur-at-disposal where applicable
- multi-stop schedules
- bespoke coordination

Commercial rule:
**Quote-only initially.**

Positioning:
Borrow from Private Chauffeur and Business Transportation.

Constraint:
Do not advertise security, guards, bodyguards, close protection, escort services, or similar.

---

# 3. Primary Conversion Goal

Primary:
help the user select the correct event service and begin an enquiry.

Secondary:
communicate that Luxury Transportation can coordinate both the principal passenger/vehicle and additional guest/group transportation.

Complex event transport must remain manually confirmed.

---

# 4. Recommended Section Order

```txt
1. Special Events Hero
2. Event Service Selector
3. Event Coordination Capability
4. Editorial Feature — Timing Matters
5. Fleet Preview
6. How Event Booking Works
7. Event Service Details / Trust
8. Related Services
9. Final CTA
```

Optional:
A small photo-led proof/gallery strip can be inserted if the project has strong approved imagery and it does not make the page too long.

---

# 5. Section Specifications

## 5.1 Hero

### Goal

Create visual/emotional impact while keeping the page category-neutral.

Do not make the hero specifically "wedding" because that would bias the whole hub.

### Suggested content direction

Eyebrow:
`Special Events`

H1 direction:
`Transportation for occasions that matter.`

Treat wording as intent unless approved localized copy exists.

Supporting idea:
- chauffeur-driven premium vehicles
- planned around the occasion
- individual cars through coordinated guest transport

### CTA

Primary:
Explore event services / request transport

Secondary:
contact / quote depending on current CTA conventions

### Visual

Preferred:
- evening arrival
- chauffeur opening rear door
- premium venue entrance
- elegantly dressed passenger without making identity/event type too specific
- S-Class/V-Class in refined environment

Avoid:
- bride-only hero
- balloons
- neon
- nightclub limo
- champagne
- confetti-heavy visuals
- cheesy luxury tropes

---

## 5.2 Event Service Selector

Use the shared 3-service selector.

### Items

#### 01 — Wedding Transportation
Intent:
Transport for the couple, guests, and the timing between each part of the day.

Potential meta:
`Couple · Guests · Multiple vehicles`

#### 02 — Prom Transportation
Intent:
A premium chauffeur-driven arrival with clear vehicle and pickup planning.

Potential meta:
`Arrival · Vehicle choice · Group options`

#### 03 — VIP Transportation
Intent:
Discreet custom transport for important guests, private schedules, and events.

Potential meta:
`Custom itinerary · Discretion · Quote only`

### Visual emphasis

Compared with Business:
- larger photography
- slightly less metadata
- warmer editorial copy
- same component hierarchy

---

## 5.3 Event Coordination Capability

### Core message

Content direction:
**Your car. Your guests. One coordinated schedule.**

### Purpose

Show that event transport can include much more than one premium vehicle.

Potential model:

```txt
Principal passenger / couple
        +
Family / guests / group
        ↓
S-Class / E-Class + V-Class + Sprinter
        ↓
Coordinated timing and pickup plan
```

Do not hardcode vehicle assignments if final fleet/business rules are not yet confirmed.

### Topics

- one or multiple vehicles
- separate guest pickups
- principal vehicle + group transport
- timing between locations
- waiting where pre-arranged
- manual coordination for complex events

### Visual

50/50 split or editorial composition.

Use photography, not a complicated logistics UI.

---

## 5.4 Editorial Feature — Timing Matters

### Purpose

Differentiate the service from simply renting a car.

### Content direction

Transport is planned around the event.

Possible scenarios:
- ceremony runs late
- photography takes longer
- dinner/event start shifts
- additional stop is required
- guests depart at different times

Do not promise unlimited flexibility.

Use language such as:
- where arranged
- where feasible
- according to confirmed itinerary

### Message

Luxury Transportation manages the transport plan so passengers can focus on the occasion.

---

## 5.5 Fleet Preview

Use the canonical/shared Fleet Preview.

Potential event relevance:
- S-Class
- E-Class
- V-Class
- Sprinter

Use final canonical data only.

Do not duplicate capacities or luggage data here.

### Page-specific introduction

Position fleet by purpose:
- principal vehicle
- couples/individual guests
- families
- groups

Do not define hard category labels unless supported by the final fleet model.

---

## 5.6 How Event Booking Works

Recommended flow:

1. **Choose the event/service**
2. **Send date, timing, passengers, and locations**
3. **Select or discuss vehicles**
4. **Receive manual confirmation / coordinated plan**

For complex events:
notes/custom requirements may be required.

Do not suggest instant confirmation.

---

## 5.7 Event Service Details / Trust

This should be short and relevant.

Possible supported topics:
- professional chauffeurs
- suits/ties
- discreet service
- premium maintained vehicles
- multi-vehicle capability
- guest transport
- English-speaking chauffeurs where relevant
- timing coordination
- signage on request only if contextually relevant and supported

Avoid:
- generic "luxury amenities" lists
- wedding clichés
- unsupported gifts/decorations/champagne
- security service claims

Potential layout:
2-column text + image or concise editorial fact grid.

---

## 5.8 Related Services

Primary:
- Private Chauffeur

Secondary:
- Airport Transfer where guests may be arriving into Belgrade

Potential future:
- Business/VIP relation only where naturally relevant

Do not make the page feel like a link directory.

---

## 5.9 Final CTA

Reuse existing FinalCTA.

Content intent:
- tell us the date, locations, and guest requirements
- one vehicle or coordinated transport
- receive a manually confirmed plan/quote

VIP remains quote-only.

---

# 6. Page Personality vs. Business Hub

The two hubs share primitives but must not appear as duplicate pages.

## Special Events should use

- more visual storytelling
- larger photography
- slightly warmer copy
- faster service discovery
- fewer operational labels
- more focus on occasion and presentation

## Business should use

- stronger evidence
- more logistics language
- more structured operational explanation
- partner/client logos
- more executive tone

Do not create separate themes.

The difference should come from content and composition.

---

# 7. Content Tone

Use:

- composed
- elegant
- clear
- understated
- reassuring
- concise

Avoid:

- "make your night unforgettable"
- "arrive like a celebrity"
- "turn heads"
- "once-in-a-lifetime luxury"
- "party in style"
- excessive romance
- excessive VIP language

Wedding copy should remain refined.
Prom copy can be lighter but still premium.
VIP copy should be discreet and restrained.

---

# 8. Photography Direction

Preferred:

- chauffeur opening door
- elegant venue arrival
- S-Class in evening architectural environment
- rear-seat/detail imagery
- couple shown naturally, not posed like wedding advertising
- V-Class/Sprinter for guest/group story
- discreet passenger arrival/departure

Avoid:

- stretch limousines
- party buses
- champagne
- nightclub neon
- balloons
- fake red carpets unless genuinely relevant
- excessive bridal imagery on the hub
- floral overlays
- gold ornaments
- security/bodyguard visual cues

---

# 9. SEO Intent

Hub targets category-level event transport intent.

Potential semantic themes:

- event transportation Belgrade
- chauffeur service for events
- wedding transportation Belgrade
- prom transportation
- VIP transportation Belgrade
- private event chauffeur
- guest transportation

Do not keyword-stuff.

Each child page should target its own specific intent more strongly.

### Internal links required

- Wedding Transportation
- Prom Transportation
- VIP Transportation
- Private Chauffeur
- Airport Transfer where relevant
- Fleet if contextually useful
- Contact/booking

---

# 10. Structured Data

Follow existing project SEO rules.

Likely:
- WebPage
- Service
- BreadcrumbList

Do not create:
- Event schema for events the company is not organizing
- fake offers/prices
- fake reviews
- fake aggregate ratings

This page provides transportation **for** events; it is not itself an event listing.

---

# 11. Responsive Notes

### Mobile

- Hero must not become overly tall.
- Stack event services.
- Keep image crops clean.
- No hover-dependent service descriptions.
- Coordination content must read naturally as text.
- Process stays vertical.

### Desktop

- Larger image treatment than Business Hub is appropriate.
- Editorial asymmetry encouraged.
- Preserve calm whitespace.
- Do not turn the page into a masonry gallery.

---

# 12. Implementation Acceptance Criteria

- [ ] Uses the shared hub primitives.
- [ ] Clearly links to Wedding, Prom, and VIP child pages.
- [ ] Hub hero remains event-neutral.
- [ ] Service selector uses a more visual treatment than Business without becoming a different design system.
- [ ] Multi-vehicle/guest coordination is communicated.
- [ ] VIP is quote-only.
- [ ] No security/close-protection claims.
- [ ] No wedding/party-limo clichés.
- [ ] Canonical fleet data is reused.
- [ ] Booking remains manually confirmed.
- [ ] Private Chauffeur is cross-linked.
- [ ] Airport Transfer is linked where contextually appropriate.
- [ ] Mobile and keyboard behavior are complete.
- [ ] SEO/i18n conventions are respected.
- [ ] No invented translations or unsupported commercial claims.

---

# 13. Agent Execution Instruction

Before coding:

1. Read project root rules and current design implementation guidance.
2. Inspect Homepage and completed Airport Transfer page for spacing, hierarchy, CTA, imagery, and section patterns.
3. Read the Hub Page Primitives specification.
4. Inspect the implemented Business Hub if it already exists by the time this page is built; reuse/refactor shared primitives rather than copying markup.
5. Implement the Special Events Hub using the same structural system.
6. Preserve a warmer/more visual page personality through content and composition only.
7. Do not invent translations or final pricing/fleet facts.
8. Use approved placeholder/content workflow if production copy is unavailable.
9. Run required lint/build/tests.
10. Report:
   - files changed
   - components reused
   - new components created
   - content/data changes
   - SEO/schema changes
   - unresolved blockers
