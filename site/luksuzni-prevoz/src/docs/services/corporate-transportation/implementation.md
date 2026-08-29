# Corporate Transportation v1 — Implementation Contract

Status: **IMPLEMENTATION-READY / STRICT**

Route: `corporateTransportation`

---

# 1. Mandatory authority

Read before editing:

```text
AGENTS.md
DESIGN.md
blueprint.md
wireframe.html
implementation.md
acceptance.md
content-contract.md
asset-contract.md
current shared service docs
required .skills
```

Run current design-context tooling before visible UI changes.

Create the repository compliance matrix before production edits.

---

# 2. Current repository state

Current route:

```text
kind: service
availability: scaffold
parent: businessTransportation
```

Current content files are strict scaffolds.

`ContentPageRenderer.astro` already exists.

Do NOT create a dispatcher.

Corporate gets one new mapping in the existing dispatcher after real `pageType: service` content is present.

---

# 3. Content integration

Replace the three Corporate scaffold files with the supplied v1 Markdown.

Keep:

```text
status: in-review
noindex: true
```

through implementation.

Merge `ui-additions/*.json` into existing dictionaries.

Do not replace or prune existing dictionaries.

UI key parity across SR/EN/RU is mandatory.

After installing the content, generate the Serbian source digest with:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

The generator output is authoritative; do not hand-edit a digest literal.

---

# 4. Required page-local architecture

Create exactly:

```text
src/components/services/corporate-transportation/
  CorporateTransportationPage.astro
  CorporateEngagementPanel.astro
  CorporateCoordinationPanel.astro
```

Audience rail and Working Day are direct compositions.

Do not create more page-local components unless a locked requirement cannot be expressed through existing primitives.

---

# 5. Shared components to reuse

Mandatory:

```text
BaseLayout
ServiceHero
ServiceOverview
OpenSplitSection
VehicleRecommendations
ServiceStandards
FAQ
FinalCTA
Section
PageContainer
ReadingContainer
SectionHeading
Link
```

No local clones.

---

# 6. Shared component blocker protocol

Before changing any shared component, stop and report:

```text
SHARED COMPONENT BLOCKER

Component:
Current behavior:
Locked requirement:
Why caller composition cannot satisfy it:
Smallest compatible shared change:
Affected consumers:
Cross-page verification:
```

No silent shared edits.

---

# 7. Renderer guard

`CorporateTransportationPage.astro`:

```ts
interface Props {
  routeKey: "corporateTransportation";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

Fail unless:

```text
routeKey matches
content.data.routeKey matches
pageType === service
```

Require:

```text
hero + secondary CTA
vehicleRecommendations
faq
finalCta + secondary CTA
sections:
  audience
  engagementModel
  workingDay
  coordination
```

Missing required content = build failure.

---

# 8. Canonical assertions

Resolve:

```ts
const corporate = getService("corporateTransportation");
const businessHub = getService("businessTransportation");
```

Assert:

```text
supportsOneOff === true
supportsRecurringContracts === true
supportsInvoicing === true
supportsNegotiatedPricing === true
dedicatedChauffeurAcrossStops === true
pricingMode contains estimated-when-simple
pricingMode contains quote
businessHub.outsideBelgrade === quote
```

Also assert the canonical operations/contact facts used in FAQ/standards.

Do not hide failed facts. Fail loud.

---

# 9. Hero

Use:

```text
BaseLayout overHero=true
ServiceHero variant="full-bleed"
```

Pass:

```text
eyebrow from corporateTransportation.hero.eyebrow
localized H1/description
booking CTA
quote CTA
support line
Hero asset
```

Build support line from these existing UI labels only after capability assertions:

```text
business.commercial.oneOff
business.commercial.recurring
business.capability.invoicing
business.capability.dedicatedChauffeurAcrossStops
business.hero.trust.manualConfirmation
```

Join with restrained separators after asserting the four Corporate capability
facts and manual confirmation from contact data. The support content remains
one `supportText` string: stacked below the main content before `xl`, then
rendered through the existing full-bleed 7/5 support region from `xl` onward.

No Markdown `supportText`.

---

# 10. Overview

Use shared `ServiceOverview`.

Exactly four groups:

```text
01 one-off
02 recurring
03 invoicing
04 dedicated chauffeur
```

Titles use existing `business.*` keys.

Descriptions use Corporate UI additions.

Use:

```text
variant="numbered-divider-facts"
surface="open-dark"
```

---

# 11. Audience rail

Read section `audience`.

Require exactly five items.

Compose with:

```text
Section
PageContainer
SectionHeading
semantic list
```

Use decorative numbers 01–05.

No cards. No icons. No client JS.

Use the locked token thresholds:

```text
below md      → one vertical sequence
md to xl      → two columns; fifth item spans the final row
xl to 2xl     → three columns; final row remains left aligned
2xl and above → exactly five equal segments
```

---

# 12. Engagement panel

Create `CorporateEngagementPanel.astro`.

One parent light surface.

Desktop:

```text
5 / 7
```

One-off:

```text
title = business.commercial.oneOff
editorial description = engagementModel item 1
CTA label = corporateTransportation.cta.oneOff
CTA href = booking
```

Recurring:

```text
title = business.commercial.recurring
editorial description = item 2
exactly 3 facts:
  business.capability.recurringContracts
  business.capability.invoicing
  business.capability.negotiatedPricing
CTA label = corporateTransportation.cta.recurring
CTA href = quote
```

No monetary data.

---

# 13. Working Day

Require `workingDay`:

```text
body
exactly 3 items
```

Use `OpenSplitSection`.

Desktop:

```text
image 7 | content 5
```

Asset:

```text
src/assets/shared/other/s-class-driving-forest-intheback.webp
```

Below the split, render static itinerary:

```text
Hotel → Office → Meeting → Lunch → Client → Dinner
```

Use Corporate itinerary UI keys.

No JS, map, hardcoded times, or horizontal overflow.

---

# 14. Coordination panel

Create `CorporateCoordinationPanel.astro`.

Surface:

```text
elevated graphite
```

Desktop:

```text
5 / 7
```

Exactly three nodes:

```text
chauffeur
company contact
confirmed itinerary
```

One destination:

```text
one confirmed transport plan
```

Use Corporate coordination UI keys.

Static CSS connectors only.

Quiet booking action uses `corporateTransportation.cta.sendScheduleQuiet`.

---

# 15. Vehicles

Use shared `VehicleRecommendations`.

Assert exact IDs/order:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
```

Resolve canonical fleet data/media.

No fare.

---

# 16. Standards

Use:

```text
buildServiceStandardGroups(locale)
```

Require 4 groups × 3 facts.

Add markers `01`–`04`.

Pass:

```text
ServiceStandards
variant="numbered-matrix"
surface="contained-dark"
```

Use Corporate standards heading/intro from UI.

No new standards clone or profile.

---

# 17. FAQ token resolver

Content has exactly nine FAQ rows.

Allowed tokens only:

```text
{oneOffAnswer}
{recurringAnswer}
{commercialAnswer}
{dedicatedAnswer}
{outsideAreaAnswer}
{vehicleAnswer}
{confirmationAnswer}
```

Import and reuse `interpolateTokens()` from `src/lib/interpolate.ts`.

Token map values come from Corporate UI additions after canonical assertions.

Unknown token = error.

Unresolved token = error.

The exact resolved FAQ array feeds both:

```text
FAQ
buildFaqPage()
```

---

# 18. CTA resolution

All actions use:

```text
resolveCtaHref()
```

Canonical flow behavior:

```text
booking → localized Contact route + intent=booking
quote   → localized Contact route + intent=quote
```

The resolver owns flow validation and query serialization. Page code never
constructs a localized Contact path or flow query.

No manual locale paths.

Hero:
- primary booking
- secondary quote

Engagement:
- one-off booking
- recurring quote

Coordination:
- quiet booking action

FinalCTA:
- booking + quote

Both FinalCTA buttons MUST render.

---

# 19. SEO

Use `buildPageSeo()`.

Hero title is the only H1.

FAQ structured data uses resolved visible FAQ array.

No price schema.

No review schema.

No component emits `<head>`.

---

# 20. Asset state

Locked shared assets:

```text
Hero        → src/assets/shared/other/chauffeur-inside-grayedout.webp
Working Day → src/assets/shared/other/s-class-driving-forest-intheback.webp
```

Import both existing WebP files directly. Do not copy them into a page-local
directory, rename them, convert them or retain the obsolete placeholder paths.
Use the existing `ServiceHero` and `OpenSplitSection` image pipelines.

No autonomous stock download or runtime hotlink.

---

# 21. Pricing hard gate

Do not render:

```text
hourly price
per-km price
from price
currency
pricing matrix
computed estimate
```

The service supports request/quote handling; the page does not invent pricing.

---

# 22. Lifecycle

Implementation state:

```text
content = in-review
noindex = true
route = scaffold
```

Release only after:

```text
SR/EN/RU validated
both locked shared images resolve
design review passes
technical review passes
acceptance fully passes
all repo gates pass
```

Then all three locales and route move to published together.

---

# 23. Responsive verification

Review at least:

```text
320
768
1024
1440
1920
```

Check:

```text
320  → mobile topology from blueprint §17
768  → tablet-portrait topology from blueprint §17
1024 → tablet-landscape topology from blueprint §17
1440 → desktop topology from blueprint §17
1920 → wide-desktop topology from blueprint §17
```

For each state record topology, DOM/content order, width constraints, image
behavior, CTA placement and destinations, overflow, keyboard/focus order, and
44×44 target measurements. Verify SR/EN/RU wrapping. Also verify immediately on
both sides of `md`, `lg`, `xl`, and `2xl` for every region whose topology changes.

---

# 24. Accessibility

Hard gates:

```text
WCAG 2.2 AA
one H1
logical headings
44×44 actions
visible focus
keyboard operation
semantic lists
decorative numbering hidden from AT
correct image alt
reduced motion
logical DOM order
```

---

# 25. Implementation sequence

Execute exactly:

```text
1. Read authorities/skills.
2. Confirm the dedicated Corporate design surface and run design context.
3. Inspect shared APIs.
4. Create compliance matrix.
5. Merge UI fragments into all locale dictionaries.
6. Regenerate generated types.
7. Install SR/EN/RU content in review/noindex state.
8. Regenerate source digests and validate content.
9. Verify both locked shared images and remove obsolete placeholder references.
10. Create CorporateTransportationPage.
11. Create CorporateEngagementPanel.
12. Create CorporateCoordinationPanel.
13. Compose Audience and Working Day from primitives.
14. Add canonical assertions.
15. Reuse the repository interpolation helper for FAQ resolution.
16. Wire vehicles/standards.
17. Wire SEO/schema.
18. Add the existing dispatcher mapping in the same bounded change.
19. Synchronize the component-consumer registry, then check it.
20. Review all responsive states.
21. Run independent design review.
22. Run technical review.
23. Run repository gates and acceptance.
24. Publish only after final assets + all gates.
```

---

# 26. Verification commands

Run repository-current commands, including at minimum:

```bash
pnpm components:sync
pnpm components:check
pnpm foundation:doctor site/luksuzni-prevoz
pnpm types:generate
pnpm content:sync-digests site/luksuzni-prevoz
pnpm theme:validate
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
```

Also run current Astro check/build, UI verification, design review and technical page review required by repository authority.

Never claim a gate passed unless it actually ran successfully.

---

# 27. Completion report

Return:

```text
files created
files modified
shared components reused
shared components changed
content lifecycle
UI merge
asset state
route state
SEO/schema state
commands + actual results
remaining blockers
```

No vague completion statement.
