# Private Chauffeur — Implementation Contract

Status: **Implementation-ready page packet**  
Route key: `privateChauffeur`  
Page type: `service`  
Blueprint: `src/docs/services/private-chauffeur/blueprint.md`  
Wireframe: `src/docs/services/private-chauffeur/wireframe.html`

This file converts the locked Private Chauffeur blueprint into an actionable production implementation contract.

It does **not** replace:

- root `AGENTS.md`;
- root `DESIGN.md`;
- the locked page blueprint;
- the shared service contracts;
- the active theme;
- the shared agent foundation;
- the component reuse registry.

When any source conflicts, use the repository authority order defined by `AGENTS.md`.

---

# 1. Mandatory prompt stack

Before implementation, read:

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

site/luksuzni-prevoz/src/docs/services/private-chauffeur/
  blueprint.md
  wireframe.html
  implementation.md
  acceptance.md
```

Also load the smallest relevant `.skills/` bundle required by `AGENTS.md`.

Before editing:

```bash
pnpm design:context site/luksuzni-prevoz
```

---

# 2. Preconditions

The shared service layer is a prerequisite.

The following approved shared service contracts should exist before the Private Chauffeur page agent performs page assembly:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
```

Expected canonical location:

```text
site/luksuzni-prevoz/src/components/services/shared/
```

If one or more are missing:

1. do not create a Private-Chauffeur-local substitute;
2. do not duplicate the shared contract under the page folder;
3. dispatch the shared-service component workflow first;
4. resume this page only when the shared contracts are available.

Verified site-shared components must also be reused:

```text
BaseLayout
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button where actual button behavior is required
OpenSplitSection
FAQ
FinalCTA
SiteHeader
SiteFooter
```

---

# 3. Current authoritative page facts

Use:

```text
src/data/services.ts
```

for the Private Chauffeur capability contract.

The current authoritative service entry defines:

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
multiDay                    quote
international               quote
customerVehicle...          false
relatedRoutes               airportTransportation
                            businessTransportation
                            vipTransportation
```

Do not copy those values into page components or localized Markdown.

Retrieve them from the data source at render/build time.

## Pricing rule — locked for this implementation

`src/data/pricing.ts` is authoritative for vehicle fares, but its contract explicitly states:

```text
service pages reference vehicles for recommendation, never their prices
```

The source also does not explicitly state a currency.

Therefore the Private Chauffeur service page MUST NOT render:

- hourly fare numbers;
- half-day fare numbers;
- full-day fare numbers;
- per-kilometre fare numbers;
- `€`, `EUR`, `RSD`, `$`, or another inferred currency;
- "from" fare claims derived from the matrix.

The hire-options section communicates **hire structure**, not a price table.

If future repository authority changes this rule, update the blueprint/implementation contract deliberately rather than bypassing `pricing.ts`.

---

# 4. Goal

Produce the dedicated final Private Chauffeur service page renderer.

The page must:

- explain the service quickly;
- distinguish Hourly / Half Day / Full Day hire;
- communicate that the chauffeur remains available during the selected hire period;
- route multi-day and international work to quote;
- recommend a small verified fleet subset;
- reinforce operational standards;
- answer common questions;
- close with the shared conversion CTA.

The page must feel like a premium transportation service page, not:

- a pricing dashboard;
- a SaaS comparison table;
- a grid of floating cards;
- a generic Markdown article;
- a clone of the Homepage.

---

# 5. Locked page order

The final renderer must preserve this order:

```text
1. SiteHeader
2. ServiceHero — responsive-split
3. ServiceOverview
4. PrivateChauffeurOptions
5. Availability & Flexibility
6. VehicleRecommendations
7. ServiceStandards
8. FAQ
9. FinalCTA
10. SiteFooter
```

`SiteHeader` and `SiteFooter` should normally come from `BaseLayout`.

Do not add a new visible region between these sections without a blueprint revision.

Do not add:

- review carousel;
- trust strip;
- process/how-it-works section;
- client logos;
- separate pricing section;
- booking form;
- related-service card grid;
- decorative gallery;
- duplicate CTA band.

---

# 6. Target implementation architecture

Prefer the following minimal structure:

```text
site/luksuzni-prevoz/src/components/
├── site/
│   ├── ContentPageRenderer.astro        # new, tiny non-visual dispatcher
│   └── LeafPage.astro                   # existing generic fallback
│
└── services/
    ├── shared/
    │   ├── ServiceHero.astro
    │   ├── ServiceOverview.astro
    │   ├── VehicleRecommendations.astro
    │   └── ServiceStandards.astro
    │
    └── private-chauffeur/
        ├── PrivateChauffeurPage.astro    # dedicated page renderer
        └── PrivateChauffeurOptions.astro # justified page-specific component
```

The preferred page-specific component count is therefore:

```text
2 page files:
- PrivateChauffeurPage
- PrivateChauffeurOptions
```

`PrivateChauffeurPage` is the renderer/assembler.

`PrivateChauffeurOptions` is justified because the Hourly / Half Day / Full Day functional comparison has:

- a distinct semantic purpose;
- data-derived option logic;
- a locked responsive layout;
- a shared booking action;
- enough internal structure to benefit from a focused contract.

Do **not** create a separate component for Availability & Flexibility by default.

Compose it directly from:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
Link / CTA adapter if needed
```

Create an `AvailabilityFlexibility.astro` component only if the implementation proves that the renderer becomes meaningfully harder to understand without it. If created, report the justification explicitly.

---

# 7. Route rendering / dispatcher integration

Current repository behavior sends default and non-default non-home routes through the generic `LeafPage`.

Private Chauffeur must not remain rendered by generic prose-only `LeafPage`.

Introduce one small non-visual dispatch layer:

```text
src/components/site/ContentPageRenderer.astro
```

Its responsibility is only:

```text
(routeKey, locale, content)
        ↓
known dedicated renderer?
        ↓ yes
dedicated renderer
        ↓ no
LeafPage fallback
```

Initial mapping:

```text
privateChauffeur → PrivateChauffeurPage
all other current non-home routes → LeafPage
```

Later Airport and Business can be added to the same dispatch point.

## Do not duplicate dispatch logic

Both:

```text
src/pages/[...slug].astro
src/pages/[locale]/[...slug].astro
```

should import the same `ContentPageRenderer`.

Do not place separate `if (routeKey === ...)` logic in both route files.

## Dispatcher constraints

`ContentPageRenderer`:

- owns no visual design;
- owns no content;
- owns no SEO;
- owns no theme values;
- owns no business facts;
- should remain tiny and explicit;
- should not become a dynamic registry framework unless later requirements justify one.

---

# 8. Dedicated page renderer contract

Create:

```text
src/components/services/private-chauffeur/PrivateChauffeurPage.astro
```

Recommended props:

```ts
interface Props {
  routeKey: "privateChauffeur";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

The implementation may use the repository's preferred broader `RouteKey` type if needed by the dispatcher, but it must assert/narrow:

```text
routeKey === "privateChauffeur"
content.data.pageType === "service"
content.data.routeKey === "privateChauffeur"
```

Do not silently render incompatible content.

The renderer owns:

- page-level composition;
- SEO adapter;
- CTA adaptation;
- data lookup;
- section selection by stable `sections[].key`;
- page-specific view-model assembly;
- exact section order.

It does not own:

- global chrome internals;
- global component styling;
- raw theme values;
- localized copy;
- fleet facts;
- pricing;
- route construction;
- shared service component internals.

---

# 9. BaseLayout / header behavior

Use:

```text
BaseLayout
```

for global page chrome.

For this blueprint:

```text
overHero = false
```

unless the locked blueprint is explicitly revised.

Reason:

- the service page Hero is a service-region composition;
- it is not the Homepage full-bleed Hero contract;
- the page blueprint does not authorize transparent Homepage-style header overlay.

Do not redesign `SiteHeader` to make the service Hero look more dramatic.

---

# 10. Content contract

The Private Chauffeur content directory currently requires locale entries.

Canonical directory:

```text
src/content/pages/private-chauffeur/
```

Suggested filenames:

```text
private-chauffeur.sr.md
private-chauffeur.en.md
private-chauffeur.ru.md
```

Filename is not the identity authority. The validated pair:

```text
(routeKey, locale)
```

remains authoritative.

Required frontmatter archetype:

```yaml
routeKey: privateChauffeur
locale: sr | en | ru
pageType: service
```

Use the existing `servicePageSchema`.

## Required editorial shape

The page implementation expects:

```yaml
hero:
  ...

overview:
  heading:
    ...
  body: ...
  items: ...

sections:
  - key: hireOptions
    heading:
      ...
    body: ...

  - key: availabilityFlexibility
    heading:
      ...
    body: ...
    image: ...

vehicleRecommendations:
  heading:
    ...
  vehicleIds:
    - ...
  cta:
    ...

faq:
  heading: ...
  items:
    - question: ...
      answer: ...

finalCta:
  ...
```

The exact editorial copy is not defined by this implementation contract.

## Content/data separation

Localized content may own:

- H1 wording;
- hero lede;
- CTA labels;
- section headings;
- explanatory editorial copy;
- suitability copy;
- FAQ questions/answers;
- final CTA copy;
- image alt decisions;
- image focal points.

Localized content MUST NOT become the factual source for:

- minimum hire duration;
- half-day hours;
- half-day included kilometres;
- full-day hours;
- full-day included kilometres;
- whether chauffeur availability applies;
- multi-day quote handling;
- international quote handling;
- fares;
- currency;
- passenger capacity;
- vehicle class;
- operational standards;
- routes;
- contact facts.

The renderer/components merge editorial wording with canonical data.

---

# 11. UI-string contract for data-derived labels

The repository already has shared labels such as:

```text
booking.mode.hourly
booking.mode.halfDay
booking.mode.fullDay
booking.upTo
booking.unit.hours
booking.unit.km
```

Reuse them.

If a data-derived fact needs a short reusable UI label that does not exist, extend `src/content/ui/{sr,en,ru}.json` only through the normal localization workflow.

Likely missing examples include a localized equivalent of:

```text
booking.minimum
service.privateChauffeur.chauffeurAvailable
service.privateChauffeur.multiDayQuote
service.privateChauffeur.internationalQuote
```

These names are recommended semantic keys, not permission to invent translations.

If approved localized values are unavailable:

```text
CONTENT / UI STRING BLOCKER
```

must be reported.

Do not:

- hardcode English in an Astro component;
- machine-invent Serbian/Russian text during implementation;
- move the operational fact itself into localized Markdown.

---

# 12. CTA adapter

Content CTAs use the existing content CTA schema.

Reuse:

```text
src/lib/cta.ts
resolveCtaHref()
```

for flow targets and any component API that expects a resolved `href`.

Do not:

- concatenate locale slugs;
- create a Private-Chauffeur-local CTA resolver;
- add a new booking route because the booking flow is not yet implemented.

Current flow behavior intentionally resolves booking/quote flows through the existing interim contact path.

---

# 13. Section 1 — ServiceHero

Use shared:

```text
ServiceHero
variant = responsive-split
```

## Desktop

Locked geometry:

```text
content 5 | media 7
```

## Tablet / mobile

Transform to the shared contained image-backed service Hero behavior.

## Content

Render:

- exactly one H1 from `content.data.hero.title`;
- concise description when present;
- primary CTA;
- secondary quote CTA when authored;
- optional single quiet contextual line when authored.

## Forbidden Hero content

Do not add:

- fare;
- fleet specifications;
- rating;
- trust chips;
- booking fields;
- pricing calculator;
- service-standard badge row;
- breadcrumbs as a new visual band;
- extra tertiary CTA.

## Imagery

Use content image declaration and focal point when supplied.

If approved service Hero photography is absent:

- preserve the shared Hero geometry;
- use the shared neutral asset-gap treatment;
- do not redesign the Hero;
- do not fetch random stock photography.

---

# 14. Section 2 — ServiceOverview

Use shared:

```text
ServiceOverview
```

Default semantic structure:

```text
open dark section
5 / 7 desktop relationship
heading + concise explanation | divider-led facts/inclusions
```

Input sources:

```text
editorial explanation → content.data.overview
service facts          → getService("privateChauffeur")
general standards      → only where the shared component contract permits
```

Do not create feature cards.

Do not reuse `TrustStrip`.

Do not hardcode data-derived factual sentences into the component.

---

# 15. Section 3 — PrivateChauffeurOptions

Create:

```text
PrivateChauffeurOptions.astro
```

This is the primary Private-Chauffeur-specific component.

## Purpose

Explain:

```text
Hourly
Half Day
Full Day
```

without resembling a pricing table.

## Surface

Use:

```text
Section surface="light"
```

or the exact functional/light composition required by the locked wireframe.

One parent surface only.

Do not create three independent floating cards.

## Data source

Use:

```ts
const service = getService("privateChauffeur");
const booking = service.bookingOptions;
```

The component or renderer must fail clearly if expected booking options are unexpectedly absent.

## Display model

### Hourly

Data-derived facts:

```text
minimumHours = 1
publishedKmLimit = null
```

Do not display an invented km allowance.

### Half Day

Data-derived facts:

```text
hours = 5
includedKm = 100
```

### Full Day

Data-derived facts:

```text
hours = 10
includedKm = 200
```

## Price rule

No fare amounts.

The section is a **hire-mode selector/explainer**, not a pricing matrix.

If price detail is needed, route users to the approved pricing/booking path rather than duplicating `pricing.ts`.

## Interaction

Prefer one shared action for the whole block unless the blueprint/content contract explicitly gives each option a distinct target.

Do not create three equal-priority primary CTAs.

## Responsive

Desktop:

```text
Hourly | Half Day | Full Day
```

within one functional parent.

Tablet portrait:

- retain readable distinction;
- do not force narrow three-column cards if content becomes cramped.

Mobile:

```text
Hourly
↓ divider
Half Day
↓ divider
Full Day
↓
shared action
```

No horizontal scroll.

No forced equal heights.

---

# 16. Section 4 — Availability & Flexibility

Default implementation: **composition, not a new component**.

Use:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

## Desktop

Locked relationship:

```text
contextual media 7 | copy/facts 5
```

Use:

```text
layout = image-content
ratio = 7-5
```

subject to the actual `OpenSplitSection` API semantics.

## Mobile

Reading order:

```text
copy first
media second
```

Use the component's `content-first` mobile contract.

Do not reorder DOM purely for visual preference.

## Data-derived facts

Use:

```text
service.chauffeurRemainsAvailable === true
service.multiDay === "quote"
service.international === "quote"
```

These facts may control whether localized explanatory rows/labels are rendered.

Do not imply:

- unrestricted 24/7 booking;
- same-day guaranteed availability;
- instant confirmation;
- international fixed pricing;
- multi-day automatic confirmation.

## Editorial layer

Use the `availabilityFlexibility` content section for:

- heading;
- explanatory body;
- image declaration;
- editorial context.

Do not store the service capability booleans/modes there.

---

# 17. Section 5 — VehicleRecommendations

Use shared:

```text
VehicleRecommendations
```

Input:

```text
content.data.vehicleRecommendations.vehicleIds
```

Resolve canonical facts with:

```text
fleet.ts
getVehicle()
```

The content layer selects relevant IDs; the component resolves:

- display name;
- vehicle class;
- passenger capacity when non-null.

## Hard rules

Do not:

- duplicate `fleet.ts`;
- show vehicle fare;
- reuse Homepage `FleetShowcase` identity;
- automatically recommend all vehicles;
- fabricate model features;
- fabricate luggage capacity;
- fabricate interior features.

Approximately three recommendations are preferred when approved content supplies them, but schema allows 1–4.

Missing imagery uses the shared neutral placeholder behavior.

CTA routes to the full fleet via the authored CTA target and approved route resolution.

---

# 18. Section 6 — ServiceStandards

Use shared:

```text
ServiceStandards
```

Primary fact source:

```text
src/data/operations.ts
```

Supplement only with relevant verified service capability data.

Do not:

- use `TrustStrip`;
- create badges;
- make a four-card trust grid;
- invent prose claims;
- introduce bodyguard/security language;
- expose internal enum codes directly to users.

Data codes/booleans must map to approved localized presentation strings.

---

# 19. Section 7 — FAQ

Use the existing shared:

```text
FAQ
```

Composition should remain:

```text
Section
ReadingContainer
SectionHeading
FAQ
```

`FAQ` owns only rows.

The page owns:

- section heading;
- surface;
- container;
- vertical rhythm.

FAQ data comes from:

```text
content.data.faq
```

The visible FAQ and structured FAQ data must use the same validated array.

Do not emit a second copy of FAQ content for JSON-LD.

Locate and reuse the canonical structured-data helper already referenced by the repository's FAQ contract.

Do not create a second accordion implementation.

---

# 20. Section 8 — FinalCTA

Use verified shared:

```text
FinalCTA
```

Adapt:

```text
content.data.finalCta
```

through existing CTA resolution.

Do not create:

```text
PrivateChauffeurFinalCTA
```

Do not modify `FinalCTA` merely to make this page feel unique.

No page-specific gradient, radius, CTA hierarchy, shadow, or media architecture.

---

# 21. Internal routes

Required/expected relationships may include:

```text
airportTransportation
businessTransportation
vipTransportation
fleet
pricing
contact / booking flow
```

Only render relationships supported by:

- content;
- `services.ts`;
- route data;
- blueprint.

All internal route destinations use:

```text
RouteKey
getPath()
Link
resolveCtaHref()
```

as appropriate.

Never construct:

```ts
"/en/" + slug
```

or equivalent.

---

# 22. SEO

Reuse:

```text
buildPageSeo()
BaseLayout / Page
```

as the existing generic page path does.

The Hero title is the page's single H1.

When Hero exists:

```text
do not render content.data.h1 as a second H1
```

Preserve:

- canonical path behavior;
- locale metadata;
- hreflang behavior;
- page lifecycle/noindex behavior;
- title/description from content;
- structured data generated through approved helpers.

Do not put `<head>` tags inside the service renderer.

---

# 23. Structured data

The implementation must not invent a service schema layer independently.

Use the repository's existing structured-data builders/contracts.

At minimum:

- visible FAQ and FAQ schema must use the same `faq.items`;
- breadcrumb/service schema, if already supported by the foundation, must use route/data sources;
- no duplicated factual literals inside JSON-LD.

If the repository has no approved structured-data builder for a new semantic requirement, report the gap rather than embedding an ad-hoc object in the page.

---

# 24. Responsive contract

Review these states independently:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Repository reference widths include:

```text
320
768
1024
1440
1920
```

The implementation is not complete merely because it works at those exact pixel widths.

## Private-specific checks

### Hero

Desktop:

```text
5 / 7 split
```

Tablet/mobile:

```text
contained image-backed composition
```

Review:

- image crop;
- focal point;
- scrim;
- H1 wrapping;
- CTA stacking.

### Options

- 3-way structure remains understandable at tablet portrait;
- mobile becomes a natural vertical comparison;
- no equal-height forcing;
- no horizontal scroll.

### Availability split

- desktop visual image 7 / copy 5;
- mobile reading order copy → image;
- no crop hiding the meaningful vehicle/chauffeur subject.

### VehicleRecommendations

- no cramped 3-column desktop assumption on tablet;
- vehicle names and localized class labels wrap safely.

### FAQ

- readable measure;
- 44px interactive target minimum;
- no clipped summary text.

---

# 25. Accessibility contract

Minimum:

```text
WCAG 2.2 AA
```

Required:

- one H1;
- correct H2/H3 hierarchy;
- semantic regions;
- meaningful `aria-labelledby` where sections use it;
- 44×44 CSS px minimum interactive target;
- visible focus;
- native semantics where possible;
- no accidental keyboard traps;
- no horizontal overflow;
- reduced-motion compliance;
- decorative images use empty alt/presentation semantics;
- informative images use approved localized alt;
- CTA names remain unique/understandable in context;
- light-surface contrast uses the approved on-light tokens.

Do not use ARIA to simulate semantics available in native HTML.

---

# 26. Theme / CSS

The page consumes the active theme selected by:

```text
site/luksuzni-prevoz/foundation.config.ts
```

Do not hardcode:

```text
version-2
```

inside generic/shared page logic merely because it is currently active.

Production styling uses semantic project tokens.

Do not add:

- raw hex/rgb/hsl colors;
- a page-local spacing scale;
- a page-local radius scale;
- a page-local breakpoint system;
- Tailwind v3 config;
- copied wireframe CSS;
- new decorative gradients;
- large shadows;
- glass;
- hover lift;
- gold.

Use Tailwind v4 according to the repository skill.

---

# 27. Image handling

Use approved Astro image handling and existing shared component contracts.

Do not:

- add raw `<img>` when an approved image path exists;
- embed remote hotlinked stock images;
- redesign a component because photography is missing;
- generate a new asset pipeline.

Image responsibilities:

```text
Hero                     contextual chauffeur/vehicle image
Availability split       contextual chauffeur/vehicle availability image
VehicleRecommendations   vehicle media per shared contract
FinalCTA                  existing shared final-CTA media contract
```

Missing assets should degrade to neutral semantic placeholders where the shared component supports them.

---

# 28. Implementation sequence

Use this order:

```text
1. pnpm design:context site/luksuzni-prevoz

2. Confirm shared service components exist and pass their own contract.

3. Inspect:
   - blueprint
   - wireframe
   - service data
   - operations data
   - content schema
   - UI strings
   - CTA resolver
   - route renderer paths

4. Create a short blueprint compliance matrix.

5. Add ContentPageRenderer.

6. Switch both catch-all routes from direct LeafPage usage
   to ContentPageRenderer.

7. Create PrivateChauffeurPage.

8. Implement PrivateChauffeurOptions.

9. Compose Availability & Flexibility from OpenSplitSection.

10. Wire shared:
    - ServiceHero
    - ServiceOverview
    - VehicleRecommendations
    - ServiceStandards
    - FAQ
    - FinalCTA

11. Integrate canonical data adapters.

12. Integrate approved localized content/UI strings.

13. Add/reuse approved structured-data handling.

14. Review responsive states.

15. Run design detector.

16. Run site check/build and required validation gates.

17. Run final acceptance checklist.
```

---

# 29. Allowed files

The page agent may modify/create only files needed for this implementation.

Expected scope:

```text
src/components/site/ContentPageRenderer.astro
src/components/services/private-chauffeur/*
src/pages/[...slug].astro
src/pages/[locale]/[...slug].astro

src/content/pages/private-chauffeur/*
  only when approved localized content is part of the task

src/content/ui/{sr,en,ru}.json
  only for approved missing reusable UI labels

tests/*
  only tests directly required by this page/dispatcher
```

Shared service components are considered prerequisite/frozen during page assembly.

If a shared component change is needed, use the blocker protocol below.

Do not modify unrelated Homepage components.

---

# 30. Shared-component blocker protocol

The page agent must not silently modify:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
OpenSplitSection
FAQ
FinalCTA
SiteHeader
SiteFooter
foundation primitives
```

If a shared API cannot satisfy a locked blueprint requirement, report:

```text
SHARED COMPONENT BLOCKER

Component:
Current API:
Locked blueprint requirement:
Why caller composition cannot solve it:
Smallest proposed API change:
Affected current consumers:
Cross-page review required:
```

Do not implement the shared change as part of the page diff unless the task explicitly authorizes it.

---

# 31. Content blocker protocol

The Private Chauffeur content directory is not a license to invent copy.

If required locale content or translated UI strings are absent:

```text
CONTENT BLOCKER

Missing locale/content:
Required schema field or UI key:
Why implementation cannot safely invent it:
Can structural implementation proceed without it? yes/no
```

Keep structural implementation and content authoring separable.

---

# 32. Definition of done

Private Chauffeur is implementation-complete only when:

- it renders through a dedicated page renderer;
- all three locale routes resolve through the shared dispatcher;
- locked section order is preserved;
- shared service components are reused;
- only justified page-specific components were created;
- hire modes come from `services.ts`;
- no fare numbers/currency appear;
- fleet facts come from `fleet.ts`;
- standards come from `operations.ts`;
- CTAs use route/flow helpers;
- localized copy lives outside components;
- all required responsive states were reviewed;
- accessibility requirements pass;
- content/routes/SEO validation passes;
- site Astro check passes;
- site build passes;
- design detector passes;
- all remaining blockers are reported explicitly.

