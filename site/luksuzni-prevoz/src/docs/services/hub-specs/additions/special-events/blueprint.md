# Luxury Transportation — Special Events Hub Blueprint v1

Status: **Locked structural blueprint**
Route key: `specialEvents`  
Page kind: hub  
Theme binding: **semantic; active Theme V2 only**

> Intended destination:
> `site/luksuzni-prevoz/src/docs/services/special-events/blueprint.md`
>
> Once approved/committed as locked, this file owns page-specific structure.
> It does not own raw token values or production translations.

## Shared contracts

Apply:
```text
src/docs/services/shared/*
AGENTS.md
DESIGN.md
```

Use existing hub content schema and service data.

## 1. Goal

Present Special Events as the category-level entry for chauffeur-driven transportation around important occasions, while routing users quickly to Wedding, Prom, and VIP Transportation.

The page should communicate two things:

1. the right vehicle for the principal passenger/occasion;
2. the ability to coordinate guests, groups, multiple vehicles and timing when the requirement is larger than one car.

The page must remain unmistakably Black & Platinum Luxury Transportation.

It must **not** become:
- a wedding-planner site
- a party-limousine page
- a nightlife landing page
- a gold/floral luxury theme
- a generic image gallery
- a card-grid showcase

## 2. Hub data

Authority:
```text
src/data/services.ts
src/data/routes.ts
```

Canonical children:
```text
weddingTransportation
promTransportation
vipTransportation
```

Hub facts:
```text
coverage: primarily-belgrade
outsideBelgrade: quote
pricingMode: from + quote
generalUseCases:
  birthdays
  private-parties
  galas
  other-special-events
```

Important:
`pricingMode: from` is a capability signal, not permission to invent a public "from" value.

No numeric event pricing unless current verified pricing data/content explicitly supports it.

## 3. Child capability truth

### Wedding
- couple transport
- guest transport
- multiple vehicles
- mixed classes
- return possible
- waiting possible through custom quote
- custom presentation request

### Prom
- individual and group transport
- multiple vehicles
- mixed classes
- return possible
- waiting possible through custom quote
- custom presentation request

### VIP
- quote only
- discretion
- privacy
- commercial/private aviation
- multi-vehicle
- dedicated coordinator for complex bookings
- custom decoration positioning is false

Never imply:
- security
- bodyguards
- close protection
- escort services

## 4. Conversion

Primary:
event transportation enquiry / booking flow.

Secondary:
Request a Quote for multi-vehicle, custom-timing, VIP, or otherwise complex arrangements.

No instant-confirmation promise.

## 5. Locked page order

1. `SiteHeader`
2. `ServiceHero` — `contained`
3. `ServiceOverview`
4. `SpecialEventServiceSelector`
5. Event Coordination / Principal + Guests
6. Other Special Occasions
7. `VehicleRecommendations`
8. `ServiceStandards`
9. `FAQ`
10. `FinalCTA`
11. `SiteFooter`

Do not add by default:
- review carousel
- pricing calculator
- wedding-only gallery
- generic event process section
- duplicated trust strip
- second CTA band
- public rate table

## 6. Hero

Use shared:
```text
ServiceHero / contained
```

Hero must be **category-neutral**.

Preferred image direction:
- premium arrival/departure at an elegant venue
- chauffeur opening a rear door
- vehicle + passenger context
- evening or architectural atmosphere
- no event type dominates

Avoid:
- bride-only hero
- prom-only hero
- red carpet cliché
- champagne
- balloons/confetti
- stretch limousine
- nightclub lighting

Content requirements:
- one H1
- concise category proposition
- primary action
- optional secondary quote action
- no service-card strip inside hero

## 7. Service Overview

Use shared `ServiceOverview`.

Purpose:
explain that the hub covers both a principal journey and coordinated event transportation where guests/groups/timing require more planning.

Use operational, divider-led facts rather than decorative badges.

Suggested content roles:
- chauffeur-driven arrival
- one or multiple vehicles
- guest/group coordination
- timing planned around confirmed itinerary

The exact copy comes from localized content.

## 8. SpecialEventServiceSelector

Initial implementation is page-local.

Use reviewed `ServiceCard` as the card primitive.

Show exactly:
- Wedding Transportation
- Prom Transportation
- VIP Transportation

Rules:
- child list matched against canonical route/service data
- image-led
- one concise sentence
- explicit CTA
- CTA is the interactive target; no invisible whole-card link
- localized routing through `Link` / route helpers
- no hardcoded service URLs
- no carousel for only three items

### Visual personality

Compared with Business:
- allow stronger event-context photography
- keep metadata lighter
- preserve same typography/theme
- no separate Events color scheme

## 9. Event Coordination / Principal + Guests

Use an open split composition built from existing primitives, preferably:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Recommended desktop composition:
```text
7/5
```
or the opposite only if image focal point/content logic requires it.

Purpose:
show that an event can involve:
- principal passenger / couple
- guests/family/group
- more than one vehicle
- mixed vehicle classes
- coordinated pickup times
- waiting/return only where the selected child capability supports it and the arrangement is confirmed

Do not hardcode vehicle assignments such as "S-Class always for couple".

Use canonical vehicle/service truth.

This section should also carry the "timing matters" message:
transport follows the confirmed event schedule, while changes remain subject to feasibility and coordination.

Do not promise unlimited waiting/flexibility.

## 10. Other Special Occasions

This is the hub-level place for use cases that do not justify separate child pages.

Source:
```text
services.specialEvents.generalUseCases
```

Current types:
- birthdays
- private parties
- galas
- other special events

Design:
- compact or standard section
- divider/list or restrained light-functional contrast
- **not** four generic icon cards
- no fake occasion imagery tiles
- one CTA toward quote/enquiry

Purpose:
prevent the hub from reading as only Weddings + Proms + VIP.

If localization labels for these enum values do not yet exist, add them to the approved UI/content source; do not hardcode English strings inside the component.

## 11. Vehicle Recommendations

Use shared `VehicleRecommendations`.

Content owns a small recommended vehicle ID set.

Operational/fleet data remains canonical.

Event framing may explain roles such as:
- individual/premium passenger
- couple
- family/small group
- larger group

Do not publish unsupported capacities/specs.

Current fleet data remains subject to its own verification status.

## 12. Service Standards

Use shared `ServiceStandards`.

Use only verified operational facts from `operations.ts` and relevant service capability data.

Useful themes:
- chauffeur presentation
- vehicle preparation
- passenger assistance
- discretion
- punctuality/coordination

Do not add:
- champagne
- decorations as standard inclusion
- bodyguard/security claims
- unsupported event extras

## 13. FAQ

Use shared `FAQ`.

Recommended topic families:
- which Special Events service to choose
- one car vs multiple vehicles
- guest/group transportation
- waiting / return trips
- custom presentation requests
- VIP quote process
- outside-Belgrade handling
- vehicle selection
- booking confirmation

## 14. Final CTA

Reuse shared `FinalCTA`.

Content intent:
send:
- event date
- pickup/venue locations
- passenger/group counts
- timing
- vehicle preference if known
- custom requirements

Complex requests receive manual review/confirmation.

No separate visual variant.

## 15. Related internal linking

The hub must link to all three children.

Contextual links may include:
- Private Chauffeur
- Airport Transportation
- Fleet
- Contact/booking

VIP may be contextually related to Private Chauffeur/Airport through child-page logic, but do not overload the hub with unrelated links.

## 16. Responsive acceptance

### Mobile
- hero remains contained and proportionate
- selector stacks
- event images retain meaningful focal points
- coordination content appears in logical reading order
- no horizontal event-timeline UI
- CTA targets >= project minimum
- no clipped long RU labels/headings

### Tablet portrait
- service selector does not become three cramped cards
- open split may remain stacked if needed
- Other Occasions remains easy to scan

### Tablet landscape / desktop
- selector can use approved 4/4/4
- coordination uses approved split composition
- page retains controlled whitespace and does not become gallery-like

### Wide desktop
- respect main container
- avoid stretched text measures or oversized empty regions

## 17. Imagery rules

Use approved asset pipeline.

Asset roles:
- hero: category-neutral contextual event transport
- selector: service-specific contextual images
- coordination: principal/guest or multi-vehicle context
- vehicles: standard fleet presentation
- Final CTA: existing shared media behavior

Missing assets:
use approved neutral placeholders.
Do not redesign around missing photography.

## 18. Accessibility

- one H1
- semantic section headings
- ServiceCard CTA-only interaction preserved
- descriptive alt only when image adds information; decorative event mood images may use empty alt
- DOM order = reading/focus order
- 44×44 targets
- visible focus states
- reduced motion
- no hover-only content
- no accidental overflow

## 19. SEO

Route remains scaffold/noindex until full content/locales are approved.

When published:
- unique localized SEO title/description
- canonical/hreflang via existing helpers
- hub internal links to all children
- BreadcrumbList through existing infrastructure
- FAQ structured data only through approved helper/policy
- no Event schema merely because the company transports people to events
- no fake reviews/prices

## 20. Guardrails

- dedicated `SpecialEventsPage` renderer
- no generic Markdown-only final page
- no page-local token system
- no hardcoded routes
- no hardcoded translations
- no invented event facts
- no numeric "from" price unless verified
- no security claims
- no wedding/party-limo clichés
- do not copy wireframe CSS into production
