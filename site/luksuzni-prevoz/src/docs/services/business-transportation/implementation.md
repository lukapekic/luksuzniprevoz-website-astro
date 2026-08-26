# Business Transportation — Implementation Contract

Status: **Implementation-ready page packet**  
Route key: `businessTransportation`  
Page type: `hub`  
Blueprint: `src/docs/services/business-transportation/blueprint.md`  
Wireframe: `src/docs/services/business-transportation/wireframe.html`

This file converts the locked Business Transportation blueprint into an actionable production implementation contract.

It does **not** replace root authority, the locked blueprint, shared service contracts, the active theme, or the shared agent prompts.

When sources conflict, follow the precedence defined by `AGENTS.md`.

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

site/luksuzni-prevoz/src/docs/services/business-transportation/
  blueprint.md
  wireframe.html
  implementation.md
  acceptance.md
```

Also load the smallest relevant `.skills/` bundle required by `AGENTS.md`.

Because this page includes commercial-path UI, also read:

```text
.skills/functional-ui.md
```

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

Reuse existing production components/primitives:

```text
BaseLayout
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button
ServiceCard
OpenSplitSection
FAQ
FinalCTA
SiteHeader
SiteFooter
```

Do not create Business-local replacements for those.

If a shared service component is missing:

1. do not clone it under the Business folder;
2. execute the shared service-component workflow;
3. resume Business assembly after the shared component exists.

---

# 3. Hub identity — critical

`businessTransportation` is a **hub**, not a direct service.

Authoritative source:

```text
src/data/services.ts
```

Current hub facts:

```text
routeKey       businessTransportation
kind           hub
pricingMode    estimated-when-simple + quote
coverage       primarily-belgrade
outsideBelgrade quote
children:
  corporateTransportation
  delegationTransportation
  conferenceCongressTransportation
```

Do not treat the hub as if it owns all child capabilities directly.

Child-specific facts remain owned by their own service records.

The page may aggregate verified child capabilities for explanation, but the renderer must keep the source relationship explicit.

---

# 4. Child-service facts

## Corporate Transportation

Current verified capabilities:

```text
supportsOneOff               true
supportsRecurringContracts   true
supportsInvoicing            true
supportsNegotiatedPricing    true
dedicatedChauffeurAcrossStops true
pricingMode                  estimated-when-simple + quote
```

## Delegation Transportation

Current verified capabilities:

```text
multipleVehicles      true
mixedVehicleClasses   true
dedicatedCoordinator  true
securityService       false
pricingMode           quote
```

## Conference & Congress Transportation

Current verified capabilities:

```text
airportArrivals              true
hotelTransfers               true
venueShuttles                true
multiVehicleSchedules        true
individualExecutiveTransfers true
groupTransport               true
pricingMode                  quote
```

Do not copy these as component literals.

Resolve them from `services.ts`.

---

# 5. Pricing / commercial-state gate

The Business hub supports:

```text
estimated-when-simple
quote
```

as capability modes.

That does **not** authorize the page agent to invent an estimator.

Unless the repository already contains a validated business estimator/calculation contract at implementation time, this page MUST NOT display numeric business pricing.

Do not:

- derive a business estimate from `pricing.ts` ad hoc;
- multiply per-km values inside the page renderer;
- infer currency;
- publish "from" values;
- make recurring negotiated pricing look like a public rate card;
- render an Estimated result without a real estimator/state model.

Current safe Business page behavior:

```text
one-off → inquiry / estimate-request path
recurring → quote / contract discussion path
complex multi-vehicle → quote
outside normal coverage → quote
```

The One-off vs Recurring section explains commercial **paths**, not price amounts.

---

# 6. Goal

Produce a dedicated Business Transportation hub page that:

- establishes coordinated business transportation capability;
- routes users clearly to Corporate / Delegation / Conference & Congress;
- distinguishes one-off work from recurring arrangements;
- explains multi-vehicle and coordination capability without overstating it;
- shows trusted client evidence according to the repository's display and asset policy;
- recommends suitable vehicles;
- reinforces operational standards;
- answers business-specific questions;
- closes with the shared Final CTA.

The page must not become:

- a generic corporate SaaS page;
- a dashboard;
- a public rate sheet;
- a collection of repetitive business cards;
- a client-logo billboard;
- a security-services page;
- a generic Markdown hub.

---

# 7. Locked page order

Preserve:

```text
1. SiteHeader
2. ServiceHero — contained
3. ServiceOverview
4. BusinessServiceSelector
5. One-off vs Recurring Arrangements
6. Coordination / Multi-Vehicle Capability
7. Trusted Clients
8. VehicleRecommendations
9. ServiceStandards
10. FAQ
11. FinalCTA
12. SiteFooter
```

Trusted Clients is a policy/data-gated slot. If no safe public client rendering is available, omit the visual section rather than showing fake marks or empty production placeholders.

Do not add:

- reviews carousel;
- Homepage TrustStrip;
- pricing calculator;
- generic service grid beyond the three hub children;
- business contact form in Hero;
- security/bodyguard block;
- duplicate CTA band;
- process/how-it-works section.

---

# 8. Target implementation architecture

Preferred minimal structure:

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
    └── business-transportation/
        ├── BusinessTransportationPage.astro
        ├── BusinessServiceSelector.astro
        └── BusinessCommercialPaths.astro
```

Expected page-specific component count:

```text
3:
BusinessTransportationPage
BusinessServiceSelector
BusinessCommercialPaths
```

Why these are justified:

### `BusinessTransportationPage`

Dedicated hub renderer and assembler.

### `BusinessServiceSelector`

Owns the hub-child discovery composition:

- canonical child ordering;
- content-to-child matching;
- `ServiceCard` composition;
- localized routing;
- image-led responsive behavior.

### `BusinessCommercialPaths`

Owns the one-off vs recurring functional comparison:

- two data-derived commercial paths;
- shared light functional parent;
- clear CTA hierarchy;
- responsive divider behavior.

Do not create by default:

```text
BusinessCoordination.astro
TrustedClients.astro
BusinessVehicleRecommendations.astro
BusinessStandards.astro
BusinessFAQ.astro
BusinessFinalCTA.astro
```

Coordination and Trusted Clients should first be composed directly from existing primitives/data.

---

# 9. Shared dispatcher integration

Reuse the single non-visual:

```text
src/components/site/ContentPageRenderer.astro
```

Add:

```text
businessTransportation → BusinessTransportationPage
```

Expected mapping once all three core service pages are integrated:

```text
privateChauffeur       → PrivateChauffeurPage
airportTransportation → AirportTransportationPage
businessTransportation → BusinessTransportationPage
all other current non-home routes → LeafPage
```

Do not create another dispatcher.

Do not duplicate route checks in locale catch-all files.

Do not alter route generation merely to support this renderer.

---

# 10. Dedicated hub renderer

Create:

```text
src/components/services/business-transportation/BusinessTransportationPage.astro
```

Recommended props:

```ts
interface Props {
  routeKey: "businessTransportation";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

The renderer must narrow/assert:

```text
routeKey === businessTransportation
content.data.pageType === hub
content.data.routeKey === businessTransportation
```

It owns:

- hub-level composition;
- SEO adaptation;
- hub/child data resolution;
- CTA adaptation;
- stable editorial-section lookup;
- trusted-client policy evaluation;
- page-specific view models;
- exact page order.

It does not own:

- global chrome internals;
- raw theme values;
- child-service facts as literals;
- client facts as literals;
- localized copy;
- fleet facts;
- route construction;
- shared component internals.

---

# 11. BaseLayout / header

Use:

```text
BaseLayout
```

Use the contained service-Hero page behavior:

```text
overHero = false
```

Do not reproduce Homepage transparent-header behavior.

---

# 12. Hub content contract

Canonical directory:

```text
src/content/pages/business-transportation/
```

Suggested organization:

```text
business-transportation.sr.md
business-transportation.en.md
business-transportation.ru.md
```

Identity remains `(routeKey, locale)`.

Required archetype:

```yaml
routeKey: businessTransportation
locale: sr | en | ru
pageType: hub
```

Use the existing `hubPageSchema`.

Recommended editorial structure:

```yaml
hero:
  ...

overview:
  heading:
    ...
  body: ...

childServices:
  heading:
    ...
  items:
    - routeKey: corporateTransportation
      ...
    - routeKey: delegationTransportation
      ...
    - routeKey: conferenceCongressTransportation
      ...

sections:
  - key: oneOffRecurring
    heading:
      ...
    body: ...
    items: ...

  - key: coordination
    heading:
      ...
    body: ...
    items: ...
    image: ...

  - key: trustedClients
    heading:
      ...
    body: ...

vehicleRecommendations:
  ...

faq:
  ...

finalCta:
  ...
```

The exact copy remains a separate content-authoring concern.

---

# 13. Hub-child parity — hard requirement

The content schema allows route cards, but Business implementation must enforce the locked hub relationship.

Canonical child list comes from:

```text
getService("businessTransportation").children
```

Current exact set:

```text
corporateTransportation
delegationTransportation
conferenceCongressTransportation
```

`content.data.childServices.items` supplies localized:

- title;
- description;
- image;
- CTA label.

It does **not** define which routes are hub children.

Before rendering:

1. read canonical child IDs from `services.ts`;
2. index authored route cards by `routeKey`;
3. assert every canonical child has exactly one content item;
4. assert no non-child route is present in `childServices.items`;
5. render in canonical `services.ts` child order.

If parity fails, fail loudly in dev/build or report a content blocker.

Do not silently drop or invent child cards.

---

# 14. Content/data separation

Content may own:

- H1;
- Hero lede;
- CTA labels;
- section headings;
- explanatory business copy;
- route-card descriptions;
- route-card imagery;
- commercial-path prose;
- coordination prose;
- Trusted Clients heading/context;
- vehicle suitability copy;
- FAQ copy;
- Final CTA copy;
- alt/focal-point decisions.

Content MUST NOT own canonical:

- hub children;
- one-off support flag;
- recurring-contract flag;
- invoicing support;
- negotiated-pricing support;
- dedicated chauffeur capability;
- multi-vehicle capability;
- mixed-class capability;
- coordinator capability;
- conference transport capabilities;
- security-service status;
- pricing values;
- currency;
- fleet capacity;
- client identities;
- client logo policy;
- route URLs.

---

# 15. Section 1 — ServiceHero

Use shared:

```text
ServiceHero
variant = contained
```

All responsive states remain contained.

Content:

- one H1;
- concise business proposition;
- primary business inquiry/booking CTA;
- secondary Request a Quote CTA;
- optional quiet contextual line when authored.

No:

- client logo strip;
- rate grid;
- form;
- capability badge wall;
- fleet specs;
- ratings.

Image direction:

```text
executive / corporate chauffeur transportation
```

Avoid:

```text
generic office meeting stock
handshakes
laptops around conference tables
skyscraper-only imagery
```

The page must remain visually transportation-led.

---

# 16. Section 2 — ServiceOverview

Use shared:

```text
ServiceOverview
```

Purpose:

Explain the difference between ordinary point-to-point transport and coordinated business transportation.

Hub-level facts:

```text
primarily Belgrade
outside normal coverage → quote
one-off / recurring / delegation / conference pathways through children
```

Do not flatten every child capability into the overview.

Use divider-led operational facts, not badges/cards.

---

# 17. Section 3 — BusinessServiceSelector

Create:

```text
BusinessServiceSelector.astro
```

Use shared:

```text
ServiceCard
```

The selector is composition, not a new card visual system.

## Data ownership

Canonical child list:

```text
services.ts
```

Editorial presentation:

```text
content.data.childServices
```

Route behavior:

```text
RouteKey
ServiceCard.action.to
Link/getPath through shared component
```

## Current child order

Render exactly in the canonical hub order:

```text
Corporate Transportation
Delegation Transportation
Conference & Congress Transportation
```

but titles/descriptions remain localized content, not hardcoded labels in the component.

## Card rules

Reuse `ServiceCard` contract:

- full-image 3:2 card;
- bottom scrim;
- title;
- one concise description;
- visible CTA;
- CTA is the only interactive element;
- card itself is not an ambiguous whole-card link.

Do not create:

```text
BusinessServiceCard
HubServiceCard
CorporateCard
DelegationCard
ConferenceCard
```

## Missing imagery

Use the shared ServiceCard neutral placeholder variants.

Do not invent remote stock URLs or redesign the selector.

---

# 18. Section 4 — One-off vs Recurring Arrangements

Create:

```text
BusinessCommercialPaths.astro
```

Use one functional/light parent surface.

Desktop:

```text
One-off | Recurring
```

with structural divider.

Tablet/mobile:

```text
One-off
────────
Recurring
```

when width requires stacking.

Do not create two floating pricing cards.

## One-off path

Truth source:

```text
corporateTransportation
```

May render only when:

```text
supportsOneOff === true
```

Commercial mode may be explained as estimate/request path where repository capability supports it.

Do not display a numeric estimate without an approved estimator.

## Recurring path

Truth source:

```text
corporateTransportation
```

May communicate only verified states such as:

```text
supportsRecurringContracts
supportsInvoicing
supportsNegotiatedPricing
dedicatedChauffeurAcrossStops
```

Do not claim:

- automatic contract approval;
- guaranteed dedicated chauffeur for all future work beyond verified semantics;
- published corporate discounts;
- fixed negotiated rate;
- instant account setup.

## CTA hierarchy

Primary page conversion remains dominant.

The two commercial paths may have different actions if authored, but do not create two competing equal-primary CTA systems.

Prefer reuse of existing page/route/flow CTA contracts.

---

# 19. Section 5 — Coordination / Multi-Vehicle Capability

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
media 7 | content 5
```

Mobile:

```text
content first
media second
```

Aggregate only verified child capabilities.

### From Delegation

May support:

```text
multipleVehicles
mixedVehicleClasses
dedicatedCoordinator
```

### From Conference & Congress

May support:

```text
airportArrivals
hotelTransfers
venueShuttles
multiVehicleSchedules
individualExecutiveTransfers
groupTransport
```

## Security hard gate

Current:

```text
delegationTransportation.securityService === false
```

Therefore do not use:

- security service;
- close protection;
- bodyguard;
- security driver;
- protective transport;
- armed/unarmed protection;
- VIP protection.

Discretion and professional coordination are not security services.

Do not create `BusinessCoordination.astro` unless direct composition becomes demonstrably unmaintainable.

---

# 20. Section 6 — Trusted Clients

Default implementation: direct page composition.

Data source:

```text
src/data/clients.ts
```

Before rendering:

```ts
shouldDisplayClientsOn("businessTransportation")
```

must be true.

Current policy allows the Business route.

## Client identity

Display names come only from:

```text
clients[].displayName
```

Do not translate proper client names.

Do not hardcode the roster in the component.

## Logo policy

Current global rule:

```text
clientDisplayPolicy.logoPermissionShouldBeVerified === true
```

A logo may be rendered publicly only when:

1. a real `logoAsset` exists;
2. its current status/policy clearly permits public use;
3. repository asset/permission rules consider it display-ready.

Do not interpret:

```text
asset-required
transparent-asset-available-or-planned
asset-and-public-usage-check-required
```

as blanket public-logo approval.

At the current live-repo state, all `logoAsset` values are null.

Therefore:

- no fake logos;
- no generated brand marks;
- no production dashed placeholders;
- no copied logos from the web;
- no assumption of logo permission.

## Current safe fallback

Because the route display policy explicitly allows the client roster and canonical client display names exist, the section may render a **restrained text-name treatment** using those canonical names while logo assets remain unavailable, provided root/client policy does not prohibit name-only display.

The text-only treatment must not imitate logos.

If current repository/legal policy is interpreted as requiring explicit public permission for client names as well, omit the section and report a CLIENT DISPLAY BLOCKER.

Do not invent endorsements or relationship descriptions.

For Qatar Airways, the only canonical relationship context currently recorded is:

```text
private-flight-related-transport
```

Do not broaden it into a general airline partnership claim.

## Variable count

Never hardcode:

```text
3 logos
5 clients
6 slots
```

Layout follows the current eligible/displayable roster.

---

# 21. Section 7 — VehicleRecommendations

Use shared:

```text
VehicleRecommendations
```

Content supplies relevant `vehicleIds`.

Resolve canonical facts from:

```text
fleet.ts
```

Business page may recommend a mix suited to executive and group movement, but suitability wording belongs to content.

Do not:

- show business fare values;
- invent luggage capacity;
- invent equipment/features;
- copy Homepage FleetShowcase identity;
- automatically show every vehicle.

---

# 22. Section 8 — ServiceStandards

Use shared:

```text
ServiceStandards
```

Primary source:

```text
operations.ts
```

Supplement only with relevant verified business/child capabilities.

Do not duplicate the Coordination section.

Focus on enduring standards:

- chauffeur professionalism;
- vehicle preparation;
- discretion;
- backup arrangements;
- service consistency;

only as canonical data/localized approved wording supports them.

No badge wall/cards.

No security claims.

---

# 23. Section 9 — FAQ

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

Likely topic families when authored:

- one-off vs recurring;
- contracts/invoicing;
- negotiated pricing;
- multiple vehicles;
- mixed vehicle classes;
- delegation coordination;
- conference transport;
- outside-Belgrade/custom routes;
- manual confirmation;
- vehicle planning.

Visible FAQ and structured-data FAQ use the same validated array.

No second accordion.

---

# 24. Section 10 — FinalCTA

Use shared:

```text
FinalCTA
```

Business-specific copy only through data/props.

No Business-specific visual variant.

Do not create:

```text
BusinessFinalCTA
CorporateFinalCTA
```

Primary inquiry/booking action stays dominant.

Secondary quote action is appropriate for recurring/complex/multi-vehicle work.

---

# 25. Internal links

Required hub children:

```text
corporateTransportation
delegationTransportation
conferenceCongressTransportation
```

Contextual links may include:

```text
airportTransportation
privateChauffeur
fleet
contact / booking flow
```

All use:

```text
RouteKey
ServiceCard
Link
getPath()
resolveCtaHref()
```

as appropriate.

Never string-build localized URLs.

---

# 26. CTA adapter

Reuse:

```text
src/lib/cta.ts
resolveCtaHref()
```

Do not:

- create Business-local CTA resolver;
- create new booking routes;
- add unsupported form submission architecture.

Current booking/quote flows follow the repository's existing handoff behavior until the booking flow is implemented.

---

# 27. SEO

Reuse:

```text
buildPageSeo()
BaseLayout / Page
```

Hero title is the page's one H1.

Do not render a second base H1.

Preserve:

- canonical behavior;
- hreflang;
- locale metadata;
- lifecycle/noindex handling;
- localized SEO title;
- localized SEO description.

Do not emit `<head>` from the hub renderer.

---

# 28. Structured data

Reuse approved builders.

Hard rules:

- no invented business price;
- no invented client endorsement;
- no hardcoded route URL;
- no duplicated FAQ data;
- no duplicated operational facts;
- no security-service schema;
- no ad-hoc schema helper if an approved foundation helper already exists.

If a hub/service structured-data capability is missing, report the gap.

---

# 29. UI strings

Use existing reusable UI strings first.

Data-derived business labels may require reusable localized keys.

Potential semantic families:

```text
business.path.oneOff
business.path.recurring
business.capability.invoicing
business.capability.contracts
business.capability.negotiatedPricing
business.capability.multiVehicle
business.capability.mixedClasses
business.capability.coordination
business.clients.heading
```

These are semantic suggestions, not approved translations.

Do not invent Serbian/Russian translation during implementation.

If approved labels are absent, report:

```text
CONTENT / UI STRING BLOCKER
```

---

# 30. Trusted-client localization rule

Client proper names are not translated.

Any surrounding copy is localized.

Do not create localized variants of:

```text
Hyatt Regency Belgrade
Qatar Airways
Square Nine Hotel Belgrade
...
```

unless the canonical data source itself changes.

---

# 31. Responsive contract

Review independently:

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

Review executive-transport image crop and CTA stacking.

## Service selector

Desktop:

```text
3 image-led ServiceCards
```

Tablet portrait:

- do not force three narrow cards;
- preserve image-led discovery;
- 1–2 columns as usable.

Mobile:

- natural vertical stack;
- CTA remains explicit;
- card image/copy ratio remains coherent.

## One-off / recurring

Desktop:

```text
2 paths with structural divider
```

Tablet portrait/mobile:

```text
stack with horizontal divider
```

No floating card-grid appearance.

## Coordination

Desktop:

```text
media 7 / copy 5
```

Mobile:

```text
copy → media
```

## Trusted Clients

- layout reacts to eligible count;
- no fixed slot count;
- text-only fallback wraps cleanly;
- approved logos, when available, retain sensible intrinsic proportions;
- no horizontal logo strip overflow.

## Vehicle / Standards / FAQ / FinalCTA

Follow shared responsive contracts.

---

# 32. Accessibility

Minimum:

```text
WCAG 2.2 AA
```

Required:

- one H1;
- logical headings;
- semantic sections;
- explicit CTA link text;
- ServiceCard CTA remains the only card interactive target;
- 44×44 CSS px interactive target;
- visible focus;
- no horizontal overflow;
- reduced motion;
- correct image alt decisions;
- no fake logo images;
- client text names remain real text;
- light commercial section contrast compliant;
- FAQ keyboard accessible.

Do not use ARIA to replace native semantics.

---

# 33. Theme / CSS

Consume active theme through repository configuration.

Do not:

- hardcode theme version fallback;
- add raw color literals;
- add local palette;
- add local spacing/radius/breakpoint scales;
- copy wireframe CSS;
- add gold;
- add glass;
- add glow;
- add dashboard shadows;
- add routine hover lift.

Functional/light commercial section uses approved semantic on-light/input tokens.

Follow Tailwind v4 repo skill.

---

# 34. Imagery

Roles:

```text
ServiceHero             executive chauffeur / corporate transport
BusinessServiceSelector child-service contextual transport images
Coordination            delegation / multi-vehicle / group movement context
VehicleRecommendations  canonical vehicle imagery
FinalCTA                 shared FinalCTA media
```

Avoid:

```text
generic office interiors
boardrooms with no transport context
handshakes
city skyline-only imagery
fake client-logo composites
```

Missing assets use approved neutral placeholders where shared components support them.

---

# 35. Current Trusted Clients data state

At the current live repository snapshot:

- Business route placement is enabled;
- logo permission verification is required;
- all five client `logoAsset` values are null;
- statuses indicate missing/planned/check-required assets.

Therefore implementation should expect **no public logo rendering today** unless the repo is updated before build.

Do not ship the semantic wireframe's dashed logo placeholders as production UI.

A restrained canonical-name fallback is preferred when policy permits.

---

# 36. Allowed files

Expected scope:

```text
src/components/services/business-transportation/*
src/components/site/ContentPageRenderer.astro

src/content/pages/business-transportation/*
  only when approved localized content is part of task

src/content/ui/{sr,en,ru}.json
  only for approved missing UI labels

tests/*
  only direct Business/dispatcher coverage
```

If dispatcher already contains Private/Airport, preserve them.

Do not refactor unrelated pages.

Do not modify shared service components during page assembly without blocker escalation.

---

# 37. Shared-component blocker protocol

If a shared component cannot satisfy a locked blueprint requirement:

```text
SHARED COMPONENT BLOCKER

Component:
Current API:
Locked requirement:
Why caller composition cannot solve it:
Smallest proposed API change:
Affected consumers:
Cross-page review required:
```

Do not silently change shared internals.

---

# 38. Client display blocker protocol

If client public-display policy cannot safely resolve:

```text
CLIENT DISPLAY BLOCKER

Route policy:
Client:
Available identity:
Logo asset:
Logo status:
Permission requirement:
Safe current rendering:
Reason richer rendering is blocked:
```

Never "solve" a client blocker by downloading/recreating a logo.

---

# 39. Content blocker protocol

The Business content directory currently has no locale page entries.

Do not invent production copy.

Report:

```text
CONTENT BLOCKER

Missing locale/content:
Required hub schema field or UI key:
Can structural implementation proceed? yes/no
```

---

# 40. Implementation sequence

```text
1. pnpm design:context site/luksuzni-prevoz

2. Confirm shared service components.

3. Inspect:
   - Business blueprint
   - wireframe
   - services.ts
   - routes.ts
   - clients.ts
   - fleet.ts
   - operations.ts
   - hub content schema
   - ServiceCard API
   - OpenSplitSection API
   - CTA resolver
   - shared dispatcher

4. Build blueprint compliance matrix.

5. Add Business mapping to ContentPageRenderer.

6. Create BusinessTransportationPage.

7. Create BusinessServiceSelector using ServiceCard.

8. Add strict hub-child/content parity check.

9. Create BusinessCommercialPaths.

10. Compose Coordination via OpenSplitSection.

11. Compose Trusted Clients via clients.ts policy.
    - approved logos only
    - otherwise canonical-name fallback if policy permits
    - otherwise omit and report blocker

12. Wire shared:
    - ServiceHero
    - ServiceOverview
    - VehicleRecommendations
    - ServiceStandards
    - FAQ
    - FinalCTA

13. Integrate canonical data.

14. Integrate approved localized content/UI strings.

15. Integrate approved structured data.

16. Review responsive states.

17. Run design detector and validation gates.

18. Complete acceptance contract.
```

---

# 41. Definition of done

Business Transportation is complete only when:

- it has a dedicated hub renderer;
- shared dispatcher maps it correctly;
- `pageType: hub` is preserved;
- canonical hub children come from `services.ts`;
- localized child-card copy comes from content;
- child-card parity is enforced;
- `ServiceCard` is reused;
- one-off/recurring facts come from Corporate service data;
- no numeric business pricing is fabricated;
- Coordination facts come from child-service data;
- security service is never claimed;
- Trusted Clients respects route/display/logo policy;
- no fake logos/placeholders ship;
- fleet facts come from `fleet.ts`;
- standards come from `operations.ts`;
- shared components are reused;
- only justified page-specific components were created;
- responsive states were reviewed;
- accessibility passes;
- content/routes/SEO validation passes;
- site check/build passes;
- design detector passes;
- blockers are explicit.

