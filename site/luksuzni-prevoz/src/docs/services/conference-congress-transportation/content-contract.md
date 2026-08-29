# Conference / Congress Transportation — Content Contract

Status: **LOCKED / STRICT**

Route key: `conferenceCongressTransportation`

## 1. Content ownership

Localized Markdown owns editorial copy only:

```text
SEO title and description
Hero H1, description and CTA labels
Overview heading/body
Audience copy
Event Journey copy
Passenger-movement copy
Multi-vehicle copy
Vehicle section heading/intro/CTA label
FAQ questions and editorial answers/tokens
Final CTA copy and labels
```

`src/data/*.ts` owns operational facts. Page content MUST NOT become a second data source for:

```text
pricing
vehicle capacity
contact data
route paths
service capability booleans
confirmation mechanics
operational standards
```

Presentation stays in the blueprint/components, never Markdown.

## 2. Required lifecycle

Serbian is the source locale.

During implementation all three entries MUST remain:

```text
status: in-review
translationState: reviewed
noindex: true
```

EN/RU MUST include:

```text
sourceLocale: sr
sourceDigest: GENERATE_WITH_CONTENT_SYNC
```

The implementation agent MUST run the repository digest generator and accept its output. Do not hand-author a digest.

## 3. Required content shape

Exactly:

```text
hero
  primary CTA → booking flow
  secondary CTA → quote flow

overview

sections
  audience
  eventJourney
  passengerMovement
  multiVehicle

vehicleRecommendations
  4 locked vehicle IDs
  CTA → fleet route

faq
  exactly 9 items

finalCta
  primary CTA → booking flow
  secondary CTA → quote flow
```

### `audience`

Requires body copy and exactly five items:

```text
organisers
speakers
executives / management
business and invited guests
participant groups
```

### `eventJourney`

Requires intro/body and exactly six authored stages:

```text
Arrival
Hotel
Conference venue
Additional programme location
Return to hotel
Final transfer
```

The section MUST explicitly frame the sequence as an illustration of organisation, not a fixed itinerary.

### `passengerMovement`

Requires intro/body and exactly two items:

```text
individual / executive movement
group movement
```

Do not author passenger capacities here. Components resolve fleet facts from `fleet.ts`.

### `multiVehicle`

Requires intro/body, exactly three movement-role items and one quiet booking CTA.

The content describes movement roles. It MUST NOT claim a dedicated Conference coordinator, live vehicle tracking, driver assignment, guaranteed number of vehicles or real-time dispatch.

## 4. Canonical factual boundary

The page is allowed to state only the current Conference service capabilities:

```text
airportArrivals
hotelTransfers
venueShuttles
multiVehicleSchedules
individualExecutiveTransfers
groupTransport
quote-only pricing
```

The current service contract does NOT contain an airport-departure/return capability. Therefore all locales MUST use a neutral final stage equivalent to **Final transfer**.

Forbidden until canonical data is explicitly changed:

```text
Airport → ... → Airport
airport departure guaranteed/included
return airport transfer included
```

Also forbidden unless canonical data is expanded:

```text
multi-day event support
several hotels in one event
unlimited/guaranteed fleet quantities
Conference transport desk
on-site transport staff
dedicated Conference coordinator
security / protection / escort
24/7 Conference coordination
live tracking or real-time status promises
```

## 5. Pricing language

Conference pricing is quote-only.

Allowed:

```text
individual quote
quote prepared from event requirements
pricing depends on the confirmed transport requirement
```

Forbidden:

```text
hourly price
per-km price
from-price
fixed conference package
automatic estimate
currency amount
```

## 6. Confirmation language

The request is not instant confirmation.

Allowed copy states that the team reviews availability and request details before manual confirmation.

Do not introduce an SLA, automatic confirmation, live inventory or guaranteed instant availability.

## 7. Translation quality

SR, EN and RU MUST express the same product promise and the same capability boundary. Translation does not authorize extra claims, deleted caveats or different CTA roles.

Russian copy uses natural Cyrillic. Brand/vehicle model names remain canonical where used.

## 8. FAQ data flow

The visible FAQ and FAQ structured data MUST use the exact same resolved FAQ array.

Operational answers that depend on service/contact/fleet/operations facts are resolved from UI tokens only after the page renderer asserts their canonical source facts.
