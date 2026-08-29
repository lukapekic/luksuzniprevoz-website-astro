# Private Chauffeur v3 — Implementation Contract

Status: **IMPLEMENTED AND PUBLISHED — GLOBAL RELEASE GATE BLOCKED BY UNRELATED BUSINESS CONTENT**
Route key: `privateChauffeur`
Page type: `service`
Blueprint status: **LOCKED**
Wireframe: `wireframe.html`

This contract converts the locked Private Chauffeur v3 blueprint into deterministic production work.

The coding agent MUST follow this file exactly. This revision records the
owner-approved decisions from the pre-implementation scan and the implemented
production contract. Verification evidence lives in `compliance-matrix.md`.

---

# 1. Mandatory Authority Stack

Read before editing:

```text
AGENTS.md
DESIGN.md

site/luksuzni-prevoz/src/docs/services/private-chauffeur/
  blueprint.md
  wireframe.html
  implementation.md
  acceptance.md

site/luksuzni-prevoz/src/docs/services/shared/
  00-system-rules.md
  01-token-contract.md
  02-service-hero.md
  03-service-overview.md
  04-vehicle-recommendations.md
  05-service-standards.md
  06-responsive-rules.md
  07-wireframe-rules.md
```

Load the exact new-page skill bundle required by root `AGENTS.md`.

Include:

```text
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/imagery-art-direction.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/responsive-images-performance.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/multilingual-routing.md
.skills/technical-seo.md
.skills/structured-data.md
```

Before editing run the current repository design-context command for the Private Chauffeur target.

---

# 2. Current Repository State

The route is published and rendered by the dedicated page assembler:

```text
src/components/services/private-chauffeur/PrivateChauffeurPage.astro
```

Current content entries:

```text
src/content/pages/private-chauffeur/private-chauffeur.sr.md
src/content/pages/private-chauffeur/private-chauffeur.en.md
src/content/pages/private-chauffeur/private-chauffeur.ru.md
```

Current production state is service / published / reviewed / indexable in all
three locales. The supplied v3 entries replaced the former scaffolds atomically.

Current `ContentPageRenderer.astro` already exists.

Do NOT create another dispatcher.

The existing dispatcher maps `privateChauffeur` to the dedicated assembler only
after its scaffold branch, so a future explicit scaffold state would continue
to use `ScaffoldPage`.

---

# 3. Required Compliance Matrix

Before editing, create:

```text
requirement | authority | data source | component | responsive states | verification
```

The matrix MUST include every locked section:

```text
Hero
Service Definition
Hire Options
Your Time Remains Yours
One Chauffeur. One Schedule.
Travel Without Losing the Day
What Comes With Every Hire
Passenger Experience
Sedan Recommendations
Custom Engagement Panel
FAQ
FinalCTA
```

Also include:

```text
route lifecycle
SEO
structured data
localization
image assets
CTA flows
responsive states
accessibility
performance
```

No production UI editing begins before the matrix exists.

---

# 4. Target Component Architecture

Required page-local components:

```text
src/components/services/private-chauffeur/
  PrivateChauffeurPage.astro
  PrivateChauffeurOptions.astro
  PrivateChauffeurEditorialStatement.astro
  PrivateChauffeurCustomPanel.astro
```

These four components have distinct responsibilities.

## `PrivateChauffeurPage.astro`

Owns:

```text
page assembly
route/content narrowing
SEO adapter
CTA resolution
canonical data lookup
section lookup
image imports
view-model creation
exact section order
```

## `PrivateChauffeurOptions.astro`

Owns:

```text
Hourly / Half Day / Full Day comparison
data-derived hire facts
responsive comparison topology
primary + quiet quote actions
```

## `PrivateChauffeurEditorialStatement.astro`

Owns:

```text
locked 8/4 editorial statement composition
vertical image
four large statement titles, each with one concise supporting line
```

This component is justified because the blueprint explicitly requires a non-standard editorial composition that is not the semantic responsibility of `OpenSplitSection`.

## `PrivateChauffeurCustomPanel.astro`

Owns:

```text
elevated graphite custom-engagement panel
7/5 topology
three custom-service facts
primary + quiet CTA hierarchy
```

Do NOT create additional Private Chauffeur page-local components unless a real contract blocker exists.

---

# 5. Shared Components That MUST Be Reused

```text
BaseLayout
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
OpenSplitSection
FAQ
FinalCTA
Section
PageContainer
ReadingContainer
SectionHeading
Link
```

No page-local replacement is allowed.

The following additive shared capabilities are approved for this page and MUST
be designed as semantic variants, not page selectors:

```text
ServiceHero             existing full-bleed topology + resolved flow actions
ServiceOverview         numbered-divider-facts
ServiceStandards        numbered-matrix on contained-dark surface
FinalCTA                optional resolved actions
resolveCtaHref()        canonical current flow fallback
```

Defaults and existing call sites remain unchanged. Do not branch shared
components on `privateChauffeur`, route keys, pathname, or content values.

---

# 6. Shared Component Change Protocol

The owner has authorized the smallest additive shared changes required by this
contract. Before changing any shared component:

```text
1. run pnpm components:check
2. inventory every current consumer and default prop path
3. run design context for the exact shared-component target
4. record the intended additive API and compatibility behavior
5. add/update component contract fixtures and focused tests
6. implement without route- or page-name coupling
7. verify every affected page/package
8. run the component UI verification profile
```

The agent MUST NOT otherwise redesign:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
OpenSplitSection
FAQ
FinalCTA
foundation primitives
SiteHeader
SiteFooter
```

If a new incompatibility appears beyond the approved additive capabilities,
stop and report the original blocker template before broadening scope.

---

# 7. Approved Shared-Component Plan

The locked blueprint requires:

```text
ServiceHero variant="full-bleed"
```

with a full-width, near-viewport photographic canvas:

```text
container-aligned content over immersive media
```

Reuse the existing reviewed `full-bleed` variant:

```text
mobile + tablet portrait    full-bleed image-backed, content-first
tablet landscape           full-bleed image-backed, content-first
desktop + wide desktop      full-bleed image-backed, container-aligned content
```

Keep one semantic DOM tree. Media remains layered behind content, decorative,
and non-interactive. Do not substitute:

```text
contained
responsive-split
page-local hero
duplicated Hero markup
```

No ServiceHero API change is required for this pass. Existing `contained`,
`responsive-split`, and `full-bleed` consumers remain unchanged.

Make `primaryAction` and `secondaryAction` independently optional resolved
actions. Omitted actions render no anchor and no empty action wrapper. Existing
required-action call sites remain source-compatible.

## `ServiceOverview`

Add `variant="numbered-divider-facts"`. Its group model supports an explicit
presentational marker plus localized title and text. It renders a single
vertical semantic list with dividers, no icons, and no card shells. Existing
`divider-facts` and `grouped-icons` behavior remains the default-compatible
path.

## `ServiceStandards`

Add `variant="numbered-matrix"` and reuse the semantic
`surface="contained-dark"` option. The variant renders a 4/8 intro-to-matrix
composition with a balanced 2×2 matrix from `lg` and one vertical numbered
sequence below that threshold. It requires four groups with exactly three
visible facts each and omits icons/card shells. Existing variants and consumers
retain their current markup and styling.

Extend the existing standards view-model helper with an explicit profile (for
example `profile: "private-chauffeur"`) rather than creating a second helper.
The default profile and return behavior stay compatible for existing pages.

## `VehicleRecommendations`

Do not add a page-specific layout. Reuse its existing accessible
`HorizontalCarousel` composition at every viewport, with the locked vehicle
order. Controls render only when the measured shared carousel has actual
overflow.

## `FinalCTA`

Allow primary and secondary resolved actions to be optional. When neither has
a destination, retain the shared content/media composition and omit the action
region without placeholder, disabled, empty, contact-fallback, or current-page
links. Existing consumers that pass actions remain unchanged.

## Registration and compatibility

Ensure `ServiceHero` and every changed shared component is registered in the
machine-readable component-governance inventory. Update shared contracts,
fixtures, and tests. Verify Business Transportation, Airport Transportation,
VIP/service consumers, and any other consumer found by repository search—not
only this page.

---

# 8. Content Schema

Use existing:

```text
servicePageSchema
```

No schema redesign is authorized.

Required localized editorial shape:

```yaml
routeKey: privateChauffeur
locale: sr | en | ru
pageType: service

seoTitle: ...
seoDescription: ...

hero:
  title: ...
  description: ...
  primaryCta: ...
  secondaryCta: ...

overview:
  heading: ...
  body: ...

sections:
  - key: hireOptions
    heading: ...
    body: ...
    items: ...

  - key: timeRemainsYours
    heading: ...
    body: ...
    items: ...

  - key: oneChauffeurOneSchedule
    heading: ...
    body: ...
    items: ...

  - key: travelWithoutLosingDay
    heading: ...
    body: ...
    items: ...

  - key: passengerExperience
    heading: ...
    body: ...
    items: ...

  - key: customEngagement
    heading: ...
    body: ...
    items: ...

vehicleRecommendations:
  heading: ...
  vehicleIds:
    - mercedes-s-class
    - mercedes-e-class
    - skoda-superb
  cta: ...

faq:
  heading: ...
  items: ...

finalCta: ...
```

The exact schema-compatible representation MUST use the repository's existing `editorialSectionSchema` fields.

Do not alter schema only to mirror this pseudo-YAML.

---

# 9. Content Lifecycle Rule

Implementation and content authoring remain separate concerns.

Production publication requires:

```text
SR source complete
EN reviewed
RU reviewed
pageType = service
status = published according to repo lifecycle
translation parity valid
noindex removed according to lifecycle
route availability switched from scaffold to published
```

No locale is published alone.

The owner has confirmed the supplied SR/EN/RU package. Do not invent or rewrite
translations during integration. Normalize only schema/contract issues
explicitly required here, including the editorial intro ownership and source
digest.

---

# 10. Page Renderer

Create:

```text
PrivateChauffeurPage.astro
```

Props:

```ts
interface Props {
  routeKey: "privateChauffeur";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

Fail immediately unless:

```text
routeKey === "privateChauffeur"
content.data.routeKey === "privateChauffeur"
content.data.pageType === "service"
```

Required content assertions:

```text
hero exists
vehicleRecommendations exists
faq exists
finalCta exists

sections contain:
hireOptions
timeRemainsYours
oneChauffeurOneSchedule
travelWithoutLosingDay
passengerExperience
customEngagement
```

Missing required section = build-time error.

No silent omission.

---

# 11. Canonical Data Resolution

Resolve service:

```ts
const service = getService("privateChauffeur");
```

Resolve:

```text
bookingOptions
chauffeurRemainsAvailable
multiplePlannedStops
scheduleChangeHandling
multiDay
international
customerVehicleChauffeurOnly
relatedRoutes
```

Resolve operation standards from:

```text
src/data/operations.ts
```

including the confirmed canonical value:

```text
service.parkingLogisticsHandledByChauffeur = true
```

Resolve the confirmation policy from:

```text
src/data/contact.ts
bookingLeadTime.confirmationMode = "manual"
```

Resolve sedans from:

```text
src/data/fleet.ts
```

Resolve CTA targets through:

```text
resolveCtaHref()
```

Resolve internal links with:

```text
Link / RouteKey / getPath()
```

No factual literals in presentation markup.

## Strict type and validation changes

Add controlled vocabulary types rather than free strings:

```ts
type ScheduleChangeHandling = "subject-to-availability-within-reserved-period";

type ConfirmationMode = "manual";
```

Extend the canonical interfaces with:

```ts
PrivateChauffeur service:
  multiplePlannedStops: true
  scheduleChangeHandling: ScheduleChangeHandling

Operations service standards:
  parkingLogisticsHandledByChauffeur: boolean

Contact booking lead-time policy:
  confirmationMode: ConfirmationMode
```

The Private Chauffeur page adapter MUST obtain a narrowed, validated service
contract. Extend the repository consistency assertions so development/build
fails if these required values, booking option values, or controlled vocabulary
members are absent or contradictory. Do not use optional chaining, `as` casts,
default literals, or locale prose as fallback data.

## CTA resolution contract

The existing resolver preserves both its default fallback and opt-in nullable
mode:

```ts
resolveCtaHref(cta, locale); // existing behavior and string return
resolveCtaHref(cta, locale, { unresolvedFlow: "omit" }); // string | null
```

Private Chauffeur uses the default string-returning behavior for booking,
quote, custom-quote, and send-schedule flows. Until dedicated routes exist,
that canonical behavior resolves to the localized Contact route. The page does
not manually author a Contact URL. The Fleet CTA uses route key `fleet` through
the approved route helper.

---

# 12. Pricing Hard Gate

Do NOT display any monetary pricing on this page.

Forbidden:

```text
getPricing() for visible fare amounts
hourly fare
half-day fare
full-day fare
per-km fare
from price
currency code
currency symbol
calculated estimate
```

If `VehicleRecommendations` currently requires pricing data internally for a fare display, call it in a mode that suppresses fare, extend the shared component through the blocker protocol, or use its existing no-fare API.

Do not bypass the pricing contract.

---

# 13. Image Integration

Move the owner-supplied assets into the shared chauffeur-service domain folder.
Do not copy them or leave duplicate page/hub-owned files.

Required destination and normalized filenames:

```text
src/assets/shared/chauffeur-service/hero-chauffeur-wheel.jpg
src/assets/shared/chauffeur-service/productivity-backseat.jpg
src/assets/shared/chauffeur-service/schedule-backseat-view.jpg
src/assets/shared/chauffeur-service/editorial-workspace-vertical.jpg
src/assets/shared/chauffeur-service/passenger-experience-reading.jpg
src/assets/shared/chauffeur-service/passenger-experience-alternate.jpg
```

Map:

```text
Hero                      hero-chauffeur-wheel.jpg
Your Time                 productivity-backseat.jpg
One Schedule              schedule-backseat-view.jpg
Editorial Statement       editorial-workspace-vertical.jpg
Passenger Experience      passenger-experience-reading.jpg
```

The agent MUST NOT reuse one image in multiple contextual sections.

The agent MUST NOT reuse Airport/Homepage imagery as replacement.

Update every existing Private Chauffeur, Airport Transportation, Business
Transportation, documentation fixture, or preview import found by repository
search in the same asset-move change. All six assets are decorative in their
approved adjacent-copy compositions and use `alt=""`; do not invent localized
alt text. Hero uses eager/high-priority shared handling; all five below-Hero
uses are lazy with reserved geometry.

---

# 14. Hero Implementation

Use:

```text
BaseLayout overHero=true
ServiceHero variant="full-bleed"
```

Pass:

```text
localized title
localized description
data-derived supportText presentation
resolved primary CTA through canonical fallback
resolved secondary CTA through canonical fallback
Hero image
```

The support line MUST be assembled from canonical values + localized UI strings.

No English hardcoding.

Both Hero actions remain visible and resolve through the canonical current flow
fallback until dedicated booking/quote routes exist.

---

# 15. Service Definition View Model

Use `ServiceOverview`.

Build exactly four rows.

Required view-model shape:

```ts
[
  {
    number: "01",
    title: localized title,
    text: localized support
  },
  {
    number: "02",
    title: localized title,
    text: localized interpolation of minimumHours
  },
  {
    number: "03",
    title: localized title,
    text: localized support
  },
  {
    number: "04",
    title: localized title,
    text: existing localized
      service.privateChauffeur.chauffeurAvailable
  }
]
```

Render through the approved `numbered-divider-facts` variant.

Do not replace with icons.

---

# 16. Hire Options Implementation

`PrivateChauffeurOptions.astro` receives a presentation view model.

It MUST NOT import `services.ts` directly if the page renderer already owns canonical data assembly.

Preferred separation:

```text
PrivateChauffeurPage
  canonical data → localized view model
          ↓
PrivateChauffeurOptions
  presentation only
```

Props include:

```text
heading
intro/body
hourly item
half-day item
full-day item
resolved primary action through canonical flow fallback
resolved quiet quote action through canonical flow fallback
locale
```

No raw route construction.

No price fields.

Resolve both actions through the canonical current flow fallback. Do not pass
empty strings or manually authored Contact destinations.

---

# 17. Your Time Remains Yours

Compose directly in page renderer with:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Use:

```text
layout = image-content
ratio = 7-5
```

Render exactly three divider-led benefit statements from localized content.

No CTA.

No new component.

---

# 18. One Chauffeur. One Schedule.

Compose directly with:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Use:

```text
layout = content-image
ratio = 5-7
mobileOrder = content-first
```

Render:

```text
localized body
static semantic itinerary labels from content/UI localization
three fact rows
resolved quiet quote link through canonical flow fallback
```

The itinerary is static HTML/CSS.

No JavaScript.

No map.

No timeline library.

Reuse these existing shared fact strings where their meaning applies:

```text
service.privateChauffeur.chauffeurAvailable
service.privateChauffeur.multiDayQuote
service.privateChauffeur.internationalQuote
service.privateChauffeur.complexQuote
```

Do not merge new synonymous schedule/custom body keys. Add only the missing
section titles, itinerary labels, action labels, and genuinely distinct
templates.

---

# 19. Editorial Statement Component

Create:

```text
PrivateChauffeurEditorialStatement.astro
```

Props:

```ts
interface Props {
  heading: string;
  intro: string;
  statements: readonly [
    { title: string; text: string },
    { title: string; text: string },
    { title: string; text: string },
    { title: string; text: string },
  ];
  image: ImageMetadata;
  imageAlt: "";
}
```

The tuple length is exactly four.

Desktop:

```text
8 / 4
```

Mobile:

```text
text
image
```

The four statement pairs render inside one elevated-graphite panel. The panel
is one column below `lg` and a balanced 2×2 matrix from `lg`. Markers `01`–`04`
are decorative; cells use only shared internal dividers and never become
independent cards.

Use active tokens only.

No CTA prop.

No icon prop.

No variant prop.

Normalize the `travelWithoutLosingDay` content so `section.body` is the single
intro and each of the four item titles retains exactly one supporting line.
Omit `heading.intro` for this section rather than rendering duplicate intro
copy or silently ignoring an authored field. Fail if the tuple is not exactly
four complete title/text pairs.

---

# 20. Service Standards

Use shared `ServiceStandards`.

Build exactly four groups from canonical operations data.

Public group content excludes:

```text
backgroundChecks
massageSeatsWhereVehicleSupports
```

Reason:

```text
background checks are not part of the desired public wording
massage seats are vehicle-specific
```

Use the approved `numbered-matrix` + `contained-dark` variant and the extended
existing standards view-model helper profile. Keep exactly four locked groups
with exactly three canonical facts each; omit icons and card shells.

Do not create local replacement.

---

# 21. Passenger Experience

Compose directly with:

```text
Section
PageContainer
OpenSplitSection
SectionHeading
```

Render:

```text
heading
short body
two quiet facts
image
```

No CTA.

No duplicated amenities.

---

# 22. Sedan Recommendations

Use `VehicleRecommendations`.

Pass exactly:

```text
mercedes-s-class
mercedes-e-class
skoda-superb
```

Add a build-time assertion that content vehicle IDs equal this locked set in this locked order.

If localized content contains another ID, fail loud.

No automatic expansion to all sedans.

No V-Class.

No Sprinter.

No fare.

Resolve the section CTA strictly as `{ to: "fleet" }` through the existing
route-aware shared component API. Do not use a literal localized path.

---

# 23. Custom Engagement Panel

Create:

```text
PrivateChauffeurCustomPanel.astro
```

Props:

```ts
interface Props {
  heading: string;
  intro: string;
  facts: [CustomFact, CustomFact, CustomFact];
  primaryAction: Action | null;
  secondaryAction: Action | null;
  locale: LocaleCode;
}
```

Exactly three facts.

No variant prop.

Desktop:

```text
7 / 5
```

Mobile:

```text
heading
intro
facts
primary CTA
quiet secondary CTA
```

Use elevated graphite semantic surface.

No raw palette values.

Until dedicated routes exist both custom actions resolve through the canonical
current flow fallback. Reuse the existing multi-day, international, and
complex-quote UI strings for fact bodies rather than adding duplicates.

---

# 24. FAQ

Use shared `FAQ`.

The locked v3 content contains exactly **10 FAQ items**, matching the repository `faqSchema` maximum.

The "multiple stops" and "schedule changes" objections are combined in FAQ item 6.

Before rendering, interpolate these tokens from `services.privateChauffeur.bookingOptions`:

```text
{minimumHours}
{halfDayHours}
{halfDayKm}
{fullDayHours}
{fullDayKm}
```

Use one deterministic interpolation helper.

Fail in development/build if a required token remains unresolved.

The same interpolated FAQ array feeds both:

```text
FAQ
buildFaqPage()
```

The production FAQ array MUST NOT contain unsupported answers.

Do not change the FAQ schema for this page.

---

# 25. FinalCTA

Reuse shared `FinalCTA`.

Resolve:

```text
resolved booking CTA through canonical fallback
resolved quote CTA through canonical fallback
verified contact channels
existing FinalCTA media
```

Do not introduce Private Chauffeur-specific FinalCTA styling.

Both actions remain visible and use the canonical current flow fallback until
dedicated booking/quote routes exist. Verified phone/email channels may render
only through the existing canonical contact-gating API.

---

# 26. UI Localization

Data-derived UI wording belongs in:

```text
src/content/ui/{sr,en,ru}.json
```

Add stable semantic keys only where required.

Expected key families:

```text
privateChauffeur.hero.*
privateChauffeur.overview.*
privateChauffeur.options.*
privateChauffeur.itinerary.*
privateChauffeur.standards.*
privateChauffeur.custom.*
```

Before merging, compare semantic meaning against the full dictionaries. Reuse:

```text
service.privateChauffeur.chauffeurAvailable
service.privateChauffeur.multiDayQuote
service.privateChauffeur.internationalQuote
service.privateChauffeur.complexQuote
```

Do not merge proposed schedule/custom text keys that duplicate those strings.
Add only distinct missing titles, templates, itinerary labels, section labels
actually rendered by a component contract, and action labels. Generate/update
typed UI contracts through the repository generator; never hand-edit generated
types.

Do not hardcode English.

Do not invent Serbian/Russian in component code.

---

# 27. Locked V3 Content Integration

Use:

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

Repository targets:

```text
src/content/pages/private-chauffeur/*
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

The UI JSON files supplied with this packet are merge fragments.

Do not replace the existing dictionaries.

Serbian is the source locale. The packet digest is provisional and MUST NOT be
copied into production because the current digest replacer omits nested
translatable fields.

First replace the digest implementation with recursive stable
canonicalization that includes every translatable nested object/array while
excluding only repository-defined non-source metadata. Add unit coverage for:

```text
nested field changes alter the digest
object key ordering does not alter the digest
array ordering does alter the digest
excluded lifecycle/translation metadata does not alter the digest
all locale files receive the regenerated Serbian source digest
```

After the approved content normalization and atomic file replacement, run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

The generator output is authoritative. Do not hardcode a digest in this plan
or edit generated digest fields by hand.

Hero `supportText` is NOT authored in Markdown. Build the Hero support line from:

```text
privateChauffeur.hero.supportTemplate
+
services.privateChauffeur.bookingOptions
```

The page remains `in-review` / `noindex:true` until all implementation and
acceptance gates pass. Then set all three entries to `published` /
`noindex:false` and switch the route to `published` in the same release change.

---

# 28. SEO

Use existing:

```text
buildPageSeo()
```

The page does not own `<head>`.

Hero title is the single H1.

SEO uses localized:

```text
seoTitle
seoDescription
```

Preserve:

```text
canonical
hreflang
lifecycle/noindex
route metadata
```

Structured data uses approved repository helpers only.

No price schema.

No invented review schema.

---

# 29. Dispatcher Integration

Modify existing:

```text
src/components/site/ContentPageRenderer.astro
```

Add:

```text
privateChauffeur → PrivateChauffeurPage
```

only for real service content.

The scaffold path continues to render `ScaffoldPage`.

No route conditional duplication in catch-all files.

---

# 30. Route Publication

Do not change:

```text
routeMap.privateChauffeur.availability
```

from `scaffold` to `published` until:

```text
SR service content valid
EN service content valid/reviewed
RU service content valid/reviewed
content parity passes
SEO passes
page implementation passes acceptance
```

Publication is the final lifecycle step.

---

# 31. Responsive Implementation

The blueprint's responsive section is normative. Verify exact states at 320,
768, 1024, 1440, and 1920 CSS px plus at least one fluid width between each
pair. Use active semantic breakpoint roles; do not introduce page-local raw
breakpoints.

## Every state

```text
DOM order         content before decorative contextual media
section order     locked and unchanged
text measure      semantic/capped
images            reserved aspect; object-cover; no distortion
targets           minimum 44 × 44 CSS px
overflow          no accidental horizontal page overflow
focus order       DOM order, never visual CSS order
flow CTAs         canonical fallback with no empty/manual/fake link
```

## Mobile — 320 reference

Every page section is one column. Hero is full-bleed image-backed with resolved
actions stacked. Overview, standards, itinerary, and options are vertical
semantic lists. Split sections render content then 4:3 media. Editorial renders
intro, four title/support pairs, then capped vertical media. Sedan
recommendations keep the shared carousel. No equal-height forcing.

## Tablet portrait — 768 reference

Keep the mobile topology and reading order. Increase only token-owned gutters
and measures. Hero actions remain stacked independent of localized label
length. Options and Standards remain vertical. The shared carousel retains its
continuation cue and logical control-to-list focus order.

## Tablet landscape — 1024 reference / active `lg`

```text
Hero                 full-bleed image-backed with over-Hero Header
Overview             5/7; facts remain one vertical list
Hire Options         three equal internal columns in one surface
Your Time            visual 7 / content 5; DOM content → image
One Schedule         content 5 / image 7
Editorial            text 8 / image 4
Standards             intro 4 / 2×2 matrix 8
Passenger Experience visual 7 / content 5; DOM content → image
Sedans                shared carousel, never a page-local static row
Custom Panel          intro 7 / facts/actions 5
FAQ / FinalCTA        shared contained contracts
```

## Desktop — 1440 reference / active `xl`

Preserve the Hero's full-bleed near-viewport composition. Preserve the tablet-
landscape topology for other sections, allow only token-owned measure/gutter
growth, and keep the carousel's own overflow behavior. Do not replace it with a
static three-card grid.

## Wide desktop — 1920 reference

Preserve desktop topology within semantic max-width containers. Do not scale
prose, images, gaps, or panels with the viewport beyond theme-owned caps. Check
Hero focal crop, editorial image cap, balanced negative space, and absence of
detached controls or excessive line length.

No `display:none` duplication of entire semantic sections. Use one DOM tree and
CSS/grid composition. For visually reversed splits, use grid placement while
preserving logical DOM and keyboard order.

---

# 32. Accessibility Implementation

Hard gates:

```text
one H1
correct heading hierarchy
44x44 minimum interactive targets
visible focus
keyboard navigation
semantic links
semantic lists
FAQ keyboard support
decorative alt=""
informative localized alt
reduced-motion behavior
logical DOM order
light-surface contrast
```

---

# 33. Performance Implementation

This page contains five contextual images plus fleet media.

Required:

```text
Hero = eager / high priority according to shared Hero contract
all contextual images below Hero = lazy
responsive Astro image output
explicit dimensions/aspect
optimized formats/quality through existing pipeline
no new image library
no new client island
```

Verify against site performance budget.

---

# 34. Implementation Sequence

Execute exactly:

```text
1.  Re-read authorities and the mandatory skill bundle.
2.  Run design context for the exact page target and each shared target.
3.  Create the blueprint compliance matrix.
4.  Fix recursive source-digest canonicalization and its unit tests.
5.  Add confirmed business facts to canonical typed data and assertions.
6.  Run pre-change components:check and inventory all shared consumers.
7.  Register missing shared components in design governance.
8.  Add the approved backward-compatible shared variants/action APIs.
9.  Update shared component contracts, fixtures, and focused tests.
10. Move and normalize all six images; update every existing consumer atomically.
11. Normalize/replace the three page content entries and merge only distinct UI keys.
12. Regenerate UI types and the Serbian source digest; validate locale parity.
13. Create PrivateChauffeurPage and its three justified page-local components.
14. Build typed canonical-data/localized presentation view models.
15. Compose all shared and local sections in locked order.
16. Wire canonical booking/quote flow fallbacks and the routed Fleet action.
17. Wire FAQ + FAQ schema from the same interpolated validated array.
18. Add the existing dispatcher mapping without catch-all duplication.
19. Keep content in-review/noindex while implementation verification runs.
20. Review/fix mobile at 320 and intervening fluid width.
21. Review/fix tablet portrait at 768 and intervening fluid width.
22. Review/fix tablet landscape at 1024 and intervening fluid width.
23. Review/fix desktop at 1440 and intervening fluid width.
24. Review/fix wide desktop at 1920.
25. Verify every affected shared-component consumer.
26. Run independent design and technical page reviews; fix P0/P1 findings.
27. Run ordered repository, content, SEO, accessibility, test, check, and build gates.
28. Run the locked acceptance checklist.
29. Publish all locales and the route atomically; rerun publication gates.
```

---

# 35. Required Verification Commands

Run repository-current commands.

At minimum:

```bash
pnpm design:context --target site/luksuzni-prevoz/src/components/services/private-chauffeur/PrivateChauffeurPage.astro --surface private-chauffeur
pnpm components:check
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
pnpm theme:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm content:sync-digests site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm lint
pnpm test:unit
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm verify:ui --target site/luksuzni-prevoz/src/components/services/private-chauffeur/PrivateChauffeurPage.astro --surface private-chauffeur --change page
```

For each changed shared component, also run its exact design context and:

```bash
pnpm verify:ui --target <exact-shared-component-file> --surface <registered-surface-id> --change component
```

Run `pnpm design:sync` only if preflight reports a stale snapshot. Run the
responsive, accessibility, design-review, and technical-page-review procedures
required by the loaded skills and record manual viewport evidence separately
from automated command results.

Never report a command as passed unless it ran successfully.

---

# 36. Completion Report

The agent MUST report:

```text
files created
files modified
shared components reused
shared components changed
blockers resolved
localized content status
route lifecycle status
images imported
placeholder assets remaining
SEO/schema work
commands run
actual results
unresolved blockers
```

No vague completion statement.
