# Airport Transportation — Implementation Contract

Status: **Implementation-ready page packet**  
Route key: `airportTransportation`  
Page type: `service`  
Blueprint: `src/docs/services/airport-transportation/blueprint.md`  
Wireframe: `src/docs/services/airport-transportation/wireframe.html`

This file converts the locked Airport Transportation blueprint into an actionable production implementation contract.

It does **not** replace root authority, shared prompts, shared service contracts, the active theme, or the locked blueprint.

When sources conflict, follow the repository precedence in `AGENTS.md`.

---

# 1. Mandatory prompt stack

Read before implementation:

```text
AGENTS.md
DESIGN.md

site/luksuzni-prevoz/src/docs/agent-prompts/
  00-service-agent-foundation.md
  component-reuse-registry.md
  01-reuse-first-component-builder.md
  03-page-specific-section-builder.md
  04-service-page-assembler.md
  05-data-content-integration.md
  06-responsive-a11y-imagery.md
  07-validation-review-handoff.md

site/luksuzni-prevoz/src/docs/services/shared/
  00-system-rules.md
  01-token-contract.md
  02-service-hero.md
  03-service-overview.md
  04-vehicle-recommendations.md
  05-service-standards.md
  06-responsive-rules.md
  07-wireframe-rules.md

site/luksuzni-prevoz/src/docs/services/airport-transportation/
  blueprint.md
  wireframe.html
  implementation.md
  acceptance.md
```

Mandatory specialist skill for this page:

```text
.skills/functional-ui.md
```

Also load the remaining smallest required bundle defined by `AGENTS.md`.

Before editing:

```bash
pnpm design:context site/luksuzni-prevoz
```

---

# 2. Preconditions

The shared service layer is prerequisite:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
```

Expected shared location:

```text
site/luksuzni-prevoz/src/components/services/shared/
```

Also reuse verified production infrastructure:

```text
BaseLayout
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button
Field
Input
Select
Checkbox when genuinely required
OpenSplitSection
FAQ
FinalCTA
SiteHeader
SiteFooter
```

If a required shared service component is missing:

1. do not create an Airport-local substitute;
2. run the shared service-component workflow;
3. resume only after the shared contract exists.

---

# 3. Current authoritative Airport facts

Use:

```text
src/data/services.ts
```

The current Airport service entry defines:

```text
routeKey                              airportTransportation
kind                                  service
pricingMode                           fixed-when-calculable + quote
airport                               belgrade-nikola-tesla
oneWay                                true
return                                true
standardStops                         point-to-point
flightTracking                        true
meetAndGreet                          true
luggageAssistance                     true
nameSign                              true
standardWaitingMinutesAfterLanding    60
commercialAviation                    true
privateAviation                       true
fboCoordination                       true
relatedRoutes                         privateChauffeur
                                      vipTransportation
```

Do not duplicate those facts in page components or localized Markdown.

---

# 4. Airport pricing gate — critical

`src/data/pricing.ts` intentionally excludes Airport Transfer fares.

Its source contract explicitly says the Airport Transfer column is not represented.

Therefore current implementation has **no authoritative Airport fare source**.

The Airport page MUST NOT:

- infer a fixed fare;
- derive an Airport fare from hourly/per-km chauffeur pricing;
- use a Homepage or old-site Airport fare;
- copy a number from a spreadsheet not represented in the validated data layer;
- assume EUR/RSD or another currency;
- present an estimated amount;
- show a fake `0`, blank value, or placeholder price.

The service capability says fixed pricing is possible **when calculable**. That does not make a fixed price calculable today.

Current production commercial state:

```text
quote / booking request without displayed fare
```

Any future activation of Fixed price requires:

1. a validated Airport pricing source;
2. an approved resolver/calculation contract;
3. updated tests;
4. an explicit update to this implementation contract if UI behavior changes.

---

# 5. Booking-handoff gate — critical

Current:

```text
src/lib/cta.ts
```

resolves `booking` and `quote` flow targets to the Contact route as an interim handoff.

There is no current validated booking-state transport contract that carries:

```text
pickup
drop-off
trip type
date/time
vehicle
```

into a real booking flow.

Therefore current implementation MUST NOT render a form that collects those values and then discards them.

Do not create:

- a fake calculator;
- a non-submitting form;
- a form that resets values when the CTA is clicked;
- query-string conventions not supported by the receiving flow;
- localStorage/sessionStorage handoff invented by this page;
- client-side booking state architecture inside this component.

The wireframe's field/result layout expresses **future functional structure**, not permission to ship dead controls.

---

# 6. Current AirportBookingBlock behavior

For the current repo state, `AirportBookingBlock` renders an **honest handoff state** while retaining the wireframe's functional hierarchy.

Recommended current composition:

```text
light functional section

heading + concise explanation

┌────────────────────────────┬───────────────────────────┐
│ details we need            │ current commercial path   │
│                            │                           │
│ pickup / drop-off          │ fare requires review      │
│ one-way / return           │ manual confirmation       │
│ date/time                  │ Book Airport Transfer     │
│ vehicle preference         │ Request a Quote           │
└────────────────────────────┴───────────────────────────┘
```

Important:

- the left side is **informational**, not a set of fake form controls;
- the right side is the current `quote/booking-request` result state;
- no fare is displayed;
- the CTA handoff uses existing content CTA targets and `resolveCtaHref()`.

This is a deliberate data/handoff-gated implementation of the structural wireframe.

## Future functional activation

If, before implementation, the repo has gained a verified booking handoff and Airport pricing resolver:

- reassess this section against the newer authority;
- reuse `Field`, `Input`, `Select`, `Button`, and existing functional primitives;
- never invent parallel controls;
- support Fixed / Quote only as actual data permits;
- do not expose Estimated unless repository data explicitly supports it.

Do not create speculative component variants today for that future state.

---

# 7. Goal

Produce the dedicated Airport Transportation service page.

It must:

- establish Belgrade Airport scope quickly;
- explain arrival handling clearly;
- explain verified flight-tracking/meeting/waiting behavior;
- provide a clear current booking/quote path;
- establish private aviation/FBO capability without creating another service page;
- recommend relevant vehicles;
- reinforce operational standards;
- answer Airport-specific questions;
- close with the shared Final CTA.

It must not become:

- an unsupported price calculator;
- an airline/travel portal;
- a dense booking form;
- a SaaS widget;
- a generic article;
- a collection of feature cards.

---

# 8. Locked page order

Preserve:

```text
1. SiteHeader
2. ServiceHero — contained
3. ServiceOverview
4. AirportBookingBlock
5. Arrival Handling & Flight Tracking
6. Private Aviation / FBO
7. VehicleRecommendations
8. ServiceStandards
9. FAQ
10. FinalCTA
11. SiteFooter
```

Do not insert:

- review carousel;
- client logos;
- trust strip;
- booking form in Hero;
- separate price table;
- separate private-aviation service page;
- process section;
- duplicate CTA band;
- unrelated service-card grid.

---

# 9. Target implementation architecture

Prefer:

```text
site/luksuzni-prevoz/src/components/
├── site/
│   └── ContentPageRenderer.astro
│
└── services/
    ├── shared/
    │   ├── ServiceHero.astro
    │   ├── ServiceOverview.astro
    │   ├── VehicleRecommendations.astro
    │   └── ServiceStandards.astro
    │
    └── airport-transportation/
        ├── AirportTransportationPage.astro
        └── AirportBookingBlock.astro
```

Expected page-specific visual component count:

```text
2:
AirportTransportationPage
AirportBookingBlock
```

Do not create separate components by default for:

```text
ArrivalHandling
PrivateAviationFeature
AirportFAQ
AirportFinalCTA
AirportVehicleRecommendations
```

Arrival and Private Aviation can be composed from existing primitives/patterns.

---

# 10. Shared dispatcher integration

Private Chauffeur implementation establishes or is expected to establish:

```text
src/components/site/ContentPageRenderer.astro
```

Airport must reuse that same dispatcher.

Add:

```text
airportTransportation → AirportTransportationPage
```

Do not:

- create `AirportPageRenderer`;
- duplicate conditions in both catch-all route files;
- build a second dispatcher;
- change generic route generation.

If `ContentPageRenderer` does not yet exist because pages are being implemented out of order, create the same tiny non-visual dispatcher contract defined by the shared/page implementation architecture—once.

Expected mapping after Private + Airport:

```text
privateChauffeur       → PrivateChauffeurPage
airportTransportation → AirportTransportationPage
all other current non-home routes → LeafPage
```

---

# 11. Dedicated page renderer

Create:

```text
src/components/services/airport-transportation/AirportTransportationPage.astro
```

Recommended props:

```ts
interface Props {
  routeKey: "airportTransportation";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

The renderer must narrow/assert:

```text
routeKey === airportTransportation
content.data.pageType === service
content.data.routeKey === airportTransportation
```

It owns:

- page-level composition;
- SEO adaptation;
- data lookup;
- CTA adaptation;
- stable `sections[].key` lookup;
- page-specific view models;
- exact section order.

It does not own:

- global chrome internals;
- theme values;
- localized copy;
- Airport fare data;
- fleet facts;
- shared component internals;
- route construction.

---

# 12. BaseLayout / header

Use:

```text
BaseLayout
```

Use:

```text
overHero = false
```

for the current contained ServiceHero contract.

Do not reproduce Homepage transparent-over-Hero header behavior.

The ServiceHero is a contained service entrance, not Homepage Hero.

---

# 13. Content contract

Canonical directory:

```text
src/content/pages/airport-transportation/
```

Suggested organization:

```text
airport-transportation.sr.md
airport-transportation.en.md
airport-transportation.ru.md
```

Identity remains `(routeKey, locale)`.

Required base:

```yaml
routeKey: airportTransportation
locale: sr | en | ru
pageType: service
```

Use existing `servicePageSchema`.

Recommended editorial shape:

```yaml
hero:
  ...

overview:
  heading:
    ...
  body: ...
  items: ...

sections:
  - key: booking
    heading:
      ...
    body: ...
    items: ...

  - key: arrivalHandling
    heading:
      ...
    body: ...
    items: ...
    image: ...

  - key: privateAviationFbo
    heading:
      ...
    body: ...
    items: ...
    image: ...
    relatedRouteKeys:
      - vipTransportation

vehicleRecommendations:
  ...

faq:
  ...

finalCta:
  ...
```

The exact copy is separate from this implementation contract.

---

# 14. Content/data separation

Content may own:

- H1;
- descriptions;
- CTA labels;
- section headings;
- public explanatory wording;
- informational "details we need" wording;
- suitability copy;
- FAQ copy;
- final CTA copy;
- image alt;
- focal point;
- optional related-route editorial context.

Content MUST NOT own canonical values for:

- supported airport;
- one-way/return capability;
- waiting allowance;
- flight tracking;
- meet & greet;
- luggage assistance;
- name sign;
- FBO capability;
- private/commercial aviation flags;
- Airport fares;
- currency;
- fleet capacity;
- contact channels;
- booking lead time;
- routes.

---

# 15. Contact / booking-policy facts

Use:

```text
src/data/contact.ts
src/data/business.ts
```

where the UI needs verified booking-policy context.

Current verified facts include:

```text
publicMinimumHours         24
lastMinuteMarketingAllowed false
public247SupportClaim      false
officeHours                08:00–18:00
```

Do not use these facts to create excessive policy text on the page.

They primarily prevent false claims such as:

- "Book anytime, 24/7";
- "Last-minute guaranteed";
- "Instant confirmation".

Manual confirmation remains the global booking rule.

If displaying phone/email in FinalCTA or contextual areas, use existing verification gating.

---

# 16. CTA adapter

Reuse:

```text
resolveCtaHref()
```

Current booking/quote flow targets resolve through the existing interim Contact handoff.

For `AirportBookingBlock`, prefer reusing the Hero's primary and secondary CTAs rather than inventing a duplicate page-specific CTA content model.

Do not create a new CTA resolver.

Do not create a new booking route.

---

# 17. Section 1 — ServiceHero

Use shared:

```text
ServiceHero
variant = contained
```

All responsive states remain contained.

Content:

- one H1;
- concise Airport proposition;
- primary Book Airport Transfer action;
- secondary Request a Quote action;
- optional quiet support line if authored.

No:

- calculator;
- form fields;
- price;
- fleet specs;
- ratings;
- trust-chip strip;
- client logos.

Image:

- Airport/chauffeur/vehicle context;
- not generic airplane-only stock;
- crop and scrim reviewed across all states.

---

# 18. Section 2 — ServiceOverview

Use shared:

```text
ServiceOverview
```

Purpose: explain what standard Airport service includes.

Data can drive verified inclusion states such as:

```text
point-to-point
meet & greet
flight tracking
luggage assistance
name sign
waiting allowance
return capability
```

Do not turn those into feature cards.

Do not show an unsupported fact because it sounds standard for Airport transfer services.

---

# 19. Section 3 — AirportBookingBlock

Create:

```text
AirportBookingBlock.astro
```

This is the main Airport-specific component.

## Current purpose

Communicate:

- what trip details the team needs;
- that the current Airport fare is not data-backed for instant display;
- booking/quote handoff;
- pending manual confirmation.

## Current inputs

There are **no interactive trip-detail inputs** until the repo provides a state-preserving booking handoff.

Instead show concise informational detail categories, for example:

```text
pickup / drop-off
one-way / return
date and pickup time
vehicle preference
```

The wording must come from approved localized content/UI sources.

## Current result state

Render only a supported state equivalent to:

```text
quote / booking request
```

Do not label it `Fixed`.

Do not label it `Estimated`.

Do not show a price.

Do not show fake calculation/loading behavior.

## CTA

Use existing authored Hero booking/quote CTA contracts and `resolveCtaHref()`.

## Manual confirmation

Include a quiet, clear pending-confirmation message through approved localized wording.

Do not hide this in tiny fine print.

## Visual structure

Use one functional light parent.

Desktop may preserve the wireframe's two-zone relationship:

```text
detail requirements | current commercial/handoff state
```

Tablet:

```text
one or two columns based on comfortable reading width
```

Mobile:

```text
details
↓
commercial state
↓
actions
```

No dashboard cards.

---

# 20. Functional primitives — future activation rule

When real fields become permitted, reuse:

```text
Field
Input
Select
Button
Checkbox if genuinely needed
```

The existing primitives already own:

- labels;
- hint/error relationships;
- aria-invalid;
- 44px target minimum;
- light-surface tokens;
- focus behavior.

Do not create:

```text
AirportInput
AirportSelect
AirportField
AirportDateField
```

unless a missing semantic behavior is first proven.

One-way / Return may justify a shared segmented control **only when actual interaction is implemented** and only after searching for an existing approved implementation.

Do not create a segmented-control abstraction for the current non-interactive state.

---

# 21. Section 4 — Arrival Handling & Flight Tracking

Default implementation: direct composition.

Use:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Desktop:

```text
media 7 | copy 5
```

Use `image-content` / `7-5` according to the actual OpenSplit API.

Mobile:

```text
copy first
media second
```

Data source:

```text
services.ts
```

Verified facts may include:

```text
flightTracking
meetAndGreet
luggageAssistance
nameSign
standardWaitingMinutesAfterLanding
```

The 60-minute waiting value must come from data at render time.

Do not:

- hardcode "60";
- imply unlimited wait;
- imply automatic pickup changes unsupported by policy;
- create ArrivalHandling cards;
- create an Airport-specific split primitive.

---

# 22. Section 5 — Private Aviation / FBO

Default implementation: direct composition, not a new component.

Preferred composition:

```text
Section surface="elevated" or blueprint-approved contained surface
  PageContainer
    OpenSplitSection
```

Suggested desktop relationship:

```text
content 5 | contextual media 7
```

Use the existing split API rather than building a new feature-panel primitive.

Data source:

```text
services.ts
```

Render only if current service flags support:

```text
commercialAviation
privateAviation
fboCoordination
```

Content may explain coordination in customer-facing language.

Do not claim:

- apron access guarantees;
- security service;
- bodyguard service;
- private terminal access beyond verified FBO/handler coordination;
- flight operations services;
- aviation services outside chauffeur transport coordination.

Quote path can reuse the page's secondary quote CTA.

Relationship to `vipTransportation` may be shown only through approved localized routing/link behavior.

---

# 23. Section 6 — VehicleRecommendations

Use shared:

```text
VehicleRecommendations
```

Content supplies:

```text
vehicleIds
```

Resolve facts from:

```text
fleet.ts
```

Do not:

- invent Airport-specific vehicle capacity;
- show Airport fares;
- show luggage capacity unless canonical data later contains it;
- automatically recommend the whole fleet;
- copy Homepage FleetShowcase visual identity.

Approximately three relevant vehicles are preferred when approved content supplies them.

---

# 24. Section 7 — ServiceStandards

Use shared:

```text
ServiceStandards
```

Primary source:

```text
operations.ts
```

Airport-specific supplements may come from:

```text
services.ts
```

Do not create badges/cards.

Do not duplicate Arrival Handling facts unnecessarily.

The standards section should focus on enduring operational confidence, while Arrival Handling owns Airport-specific meeting/flight workflow.

---

# 25. Section 8 — FAQ

Use shared:

```text
FAQ
```

Compose:

```text
Section
ReadingContainer
SectionHeading
FAQ
```

Likely public topic families, when authored:

- flight delay / tracking;
- meeting point / name sign;
- waiting allowance;
- luggage support;
- return booking;
- private aviation/FBO;
- manual confirmation;
- quote/pricing state.

Visible FAQ and FAQ structured data use the same validated item array.

No second accordion.

---

# 26. Section 9 — FinalCTA

Use:

```text
FinalCTA
```

No Airport-specific visual variant.

No second Hero.

No page-local gradient/radius/media contract.

Use canonical contact verification gating where applicable.

---

# 27. Internal links

Likely contextual relationships:

```text
privateChauffeur
vipTransportation
fleet
contact / booking flow
```

Use:

```text
RouteKey
Link
getPath()
resolveCtaHref()
```

Never manual localized URL concatenation.

---

# 28. SEO

Reuse:

```text
buildPageSeo()
BaseLayout / Page
```

Hero title is the single H1.

Do not render `content.data.h1` in addition to Hero title.

Preserve:

- lifecycle/noindex handling;
- canonical path;
- locale metadata;
- hreflang;
- SEO title/description.

Do not emit `<head>` from the page renderer.

---

# 29. Structured data

Reuse existing approved builders.

Hard rules:

- no Airport price/currency in JSON-LD without validated data;
- FAQ schema must match visible FAQ exactly;
- route URLs come from routing infrastructure;
- no duplicated business facts;
- no ad-hoc schema helper if an approved builder already exists.

Report a schema gap rather than inventing one.

---

# 30. UI strings

Use existing reusable UI strings where present.

New Airport-functional labels, if required, belong in:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Examples of semantic key families that may be needed:

```text
airport.booking.detailsHeading
airport.booking.pickupDropoff
airport.booking.tripType
airport.booking.dateTime
airport.booking.vehiclePreference
airport.booking.currentState
booking.pendingConfirmation
pricing.quoteRequired
```

These are recommended key semantics, not approved translations.

Do not invent Serbian/Russian translations during implementation.

If approved labels are missing, report a content/UI-string blocker.

---

# 31. Responsive contract

Review:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Reference widths:

```text
320
768
1024
1440
1920
```

## Hero

Contained at all states.

Review:

- crop;
- focal point;
- scrim;
- H1 wrapping;
- CTA stacking.

## Booking block

Current state:

- no dead fields;
- two-zone desktop composition may stack on mobile;
- actions immediately follow result state on mobile;
- no dashboard feel.

Future functional state:

- pickup/drop-off get adequate width;
- controls 1–2 columns as usable;
- mobile single column;
- result follows inputs;
- no horizontal scroll.

## Arrival Handling

Desktop:

```text
media 7 / copy 5
```

Mobile:

```text
copy → media
```

## FBO feature

Must remain subordinate to main Airport service.

Do not let it become a second Hero.

## Vehicle recommendations / FAQ / FinalCTA

Follow their shared responsive contracts.

---

# 32. Accessibility

Minimum:

```text
WCAG 2.2 AA
```

Required:

- exactly one H1;
- logical H2/H3 hierarchy;
- semantic sections;
- 44×44 target minimum;
- visible focus;
- correct image alt semantics;
- light-surface contrast;
- no horizontal overflow;
- reduced motion;
- keyboard-safe FAQ;
- no unlabeled form control if future fields are activated;
- placeholder never substitutes for a label;
- error text not color-only;
- result state communicates meaning textually, not by color alone.

---

# 33. Theme / CSS

Consume the active site theme through repository configuration.

No:

- raw palette;
- hardcoded theme version fallback;
- raw radius scale;
- raw spacing scale;
- page-local breakpoint system;
- copied wireframe CSS;
- gold;
- glow;
- glass;
- dashboard shadows;
- routine hover lift.

Functional UI uses approved semantic light/input tokens.

Follow Tailwind v4 skill.

---

# 34. Imagery

Roles:

```text
ServiceHero              Airport/chauffeur contextual media
Arrival Handling         meet-and-greet / arrival context
Private Aviation/FBO     executive vehicle + private aviation/FBO context
VehicleRecommendations   canonical vehicle media
FinalCTA                  shared FinalCTA media
```

Avoid generic aircraft-only imagery that disconnects the page from chauffeur transport.

Do not fetch random stock imagery during component implementation.

Missing assets preserve layout and use approved neutral placeholders.

---

# 35. Page-specific component budget

Expected:

```text
AirportTransportationPage.astro
AirportBookingBlock.astro
```

Expected shared dispatcher change:

```text
ContentPageRenderer.astro
```

No additional page component should be created without explicit report/justification.

Especially reject:

```text
ArrivalHandling.astro
PrivateAviationFeature.astro
AirportFAQ.astro
AirportFinalCTA.astro
AirportVehicleCard.astro
AirportField.astro
AirportInput.astro
```

unless the current shared primitives are proven insufficient.

---

# 36. Allowed files

Expected scope:

```text
src/components/services/airport-transportation/*
src/components/site/ContentPageRenderer.astro

src/content/pages/airport-transportation/*
  only when approved page content is part of task

src/content/ui/{sr,en,ru}.json
  only for approved missing UI labels

tests/*
  only direct Airport/dispatcher coverage
```

If the shared dispatcher was already integrated into both route catch-alls by Private Chauffeur, Airport should not need to touch those route files again.

Do not refactor unrelated pages.

Do not modify shared service components during assembly without blocker escalation.

---

# 37. Shared-component blocker protocol

If a shared component cannot satisfy a locked requirement:

```text
SHARED COMPONENT BLOCKER

Component:
Current API:
Locked requirement:
Why composition cannot solve it:
Smallest proposed API change:
Affected consumers:
Cross-page review required:
```

Do not silently patch shared internals.

---

# 38. Functional blocker protocol

If a requested interactive behavior lacks backend/state/handoff/data support:

```text
FUNCTIONAL BLOCKER

Requested behavior:
Required data/state:
Current repository capability:
Missing contract:
Safe current fallback:
What must exist before activation:
```

The safe fallback must be honest and usable, not fake interactivity.

---

# 39. Content blocker protocol

The Airport content directory currently has no locale page entries.

Do not invent production copy.

Report:

```text
CONTENT BLOCKER

Missing locale/content:
Required schema field or UI key:
Can structural implementation proceed? yes/no
```

---

# 40. Implementation sequence

```text
1. pnpm design:context site/luksuzni-prevoz

2. Confirm shared service components.

3. Inspect:
   - Airport blueprint
   - wireframe
   - services.ts
   - pricing.ts
   - contact.ts
   - business.ts
   - fleet.ts
   - operations.ts
   - functional-ui skill
   - Field/Input/Select/Button APIs
   - CTA resolver
   - dispatcher

4. Build blueprint compliance matrix.

5. Add Airport mapping to ContentPageRenderer.

6. Create AirportTransportationPage.

7. Create AirportBookingBlock in current honest handoff mode.

8. Compose Arrival Handling from OpenSplitSection.

9. Compose Private Aviation/FBO from existing Section + OpenSplitSection.

10. Wire shared:
    - ServiceHero
    - ServiceOverview
    - VehicleRecommendations
    - ServiceStandards
    - FAQ
    - FinalCTA

11. Integrate canonical data.

12. Integrate approved localized content/UI strings.

13. Integrate approved structured data.

14. Review all responsive states.

15. Run design detector.

16. Run site validation/check/build.

17. Complete acceptance contract.
```

---

# 41. Definition of done

Airport Transportation is complete only when:

- it has a dedicated renderer;
- the shared dispatcher maps the Airport route correctly;
- locked section order is preserved;
- shared service components are reused;
- only justified page-specific components were created;
- no Airport fare/currency is fabricated;
- no fake form/calculator exists;
- current booking/quote handoff is honest;
- Airport capability facts come from `services.ts`;
- booking-policy facts come from canonical data;
- fleet facts come from `fleet.ts`;
- standards come from `operations.ts`;
- Arrival and FBO sections reuse existing composition primitives;
- localization remains external;
- responsive states were reviewed;
- accessibility passes;
- content/routes/SEO validation passes;
- site check/build passes;
- design detector passes;
- all blockers are reported.

