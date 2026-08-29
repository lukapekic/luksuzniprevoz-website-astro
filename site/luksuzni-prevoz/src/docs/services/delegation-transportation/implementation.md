# Delegation Transportation v1 — Implementation Contract

Status: **IMPLEMENTATION-READY / STRICT**

Route: `delegationTransportation`

# 1. Mandatory preflight

Before production edits:

```text
1. Read root AGENTS.md.
2. Read DESIGN.md.
3. Read current shared service contracts.
4. Read this entire Delegation packet.
5. Load required repository skills.
6. Run current design-context tooling.
7. Inspect current shared service APIs.
8. Fill compliance-matrix.md.
```

Do not begin visible implementation before these steps complete.

# 2. Lifecycle

Start from:

```text
routeKey = delegationTransportation
kind = service
parent = businessTransportation
availability = scaffold
```

During implementation:

```text
route remains scaffold
content status = in-review
content noindex = true
```

Do not publish early.

# 3. Asset preflight

Verify every locked path in `asset-contract.md`.

Missing file = `ASSET BLOCKER`.

Do not rename, substitute, download or regenerate a missing asset.

Preserve supplied spellings including `chinesee-embassy.png`, `emplyoee-group-outside.webp`, and `v-class-on-the-move-veertical.webp`.

# 4. Content installation

Production targets:

```text
src/content/pages/delegation-transportation/
  delegation-transportation.sr.md
  delegation-transportation.en.md
  delegation-transportation.ru.md
```

Install supplied content.

Run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

The generator MUST replace packet digest markers. Do not hand-author digests.

Keep all locales `in-review`, `reviewed`, `noindex:true` until release.

# 5. UI merge

Merge the three `ui-additions/*.json` fragments into existing dictionaries.

Do not replace dictionaries or delete unrelated keys.

Regenerate current repository i18n/types.

Delegation key parity across SR/EN/RU is mandatory.

# 6. Required page-local architecture

Create exactly:

```text
src/components/services/delegation-transportation/
  DelegationTransportationPage.astro
  DelegationMovementSequence.astro
  DelegationInstitutionalProof.astro
```

Any extra component requires a written justification mapped to a locked requirement.

# 7. Shared components

Reuse:

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
astro:assets Image
```

Do not clone them.

Do not reuse `BusinessClientProof`.

Do not reuse Corporate page-local panels.

# 8. Shared component blocker protocol

Before changing shared code, stop and report:

```text
SHARED COMPONENT BLOCKER

Component:
Current behavior:
Locked Delegation requirement:
Why caller composition cannot satisfy it:
Smallest compatible shared change:
Affected consumers:
Required cross-page verification:
```

No silent shared change.

# 9. Renderer guard

`DelegationTransportationPage.astro` MUST accept:

```ts
interface Props {
  routeKey: "delegationTransportation";
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}
```

Fail unless route key, content route key and `pageType === service` match.

Require Hero + secondary CTA, Overview, Vehicle Recommendations, FAQ, FinalCTA + secondary CTA and sections `audience`, `movement`, `mixedFleet`, `discretion`, `briefing`.

Missing required content = build error.

# 10. Canonical assertions

Resolve `getService("delegationTransportation")`.

Fail unless:

```text
pricingMode contains only quote
multipleVehicles === true
mixedVehicleClasses === true
dedicatedCoordinator === true
securityService === false
```

Fail unless operations/contact support the visible claims:

```text
internalTraining includes discretion
dressCode = suit-and-tie
englishSpeakingStandard = true
minimumLicenseYears >= 5
preTripInspectionForImportantTrips = true
requestedConfirmedModelGuaranteed = true
confirmationMode = manual
```

Do not expose background-check copy.

# 11. CTA contract

Assert Hero primary = booking, Hero secondary = quote, Final primary = booking, Final secondary = quote.

Resolve every action through `resolveCtaHref()`.

Never construct locale paths or flow query strings manually.

Briefing quiet CTA uses resolved booking href.

# 12. Hero

Import `v-class-embassy-entrance.webp`.

Use full-bleed shared Hero, decorative alt, no supportText.

Build exactly three trust markers from existing Business coordination UI keys after canonical assertions.

Do not mention photographed building, flags, country or institution.

# 13. Overview

Use shared `ServiceOverview` with `numbered-divider-facts` + `open-dark`.

Exactly four groups: multiple vehicles, mixed classes, dedicated coordination, one coordinated schedule.

No icon/card/price.

# 14. Audience

Read `audience`, require body + exactly five items.

Use `OpenSplitSection` with `s-class-hotel-entrance-vertical.webp`.

Desktop image 5/content 7. Below `lg`, content then image.

Items use a restrained divider list.

# 15. DelegationMovementSequence

Component owns Section, container, full-width label/heading/intro/body, illustrative-example label, six-stage semantic ordered list, static connector CSS, supporting image and responsive composition.

Use `emplyoee-group-outside.webp`.

Desktop full-width intro followed by sequence 7/image 5. The sequence determines
the lower-row height and the cover image stretches to the same grid track with
an intentional focal position. Mobile intro → sequence → image.

Do not render a closing slogan.

No JS/map/times/status badges.

# 16. Mixed fleet

Read `mixedFleet`, require exactly three items.

Use `OpenSplitSection` with `v-class-on-the-move-veertical.webp`.

Desktop content 7/image 5.

No technical fleet duplication. No price.

# 17. Discretion

Read `discretion`.

Use a contained dark editorial composition with no image, placeholder or empty
media column. Below `lg`, render heading/intro then the trust list. From `lg`,
use heading/intro 5 and trust list 7.

Render exactly four UI-driven trust rows.

Gate discretion row on operations training. Gate confirmation row on contact data.

NDA row uses supplied non-guarantee wording.

No secure/protected/classified/bodyguard/escort wording.

# 18. Institutional proof

Read the route-approved roster through:

```ts
const approvedClients = getApprovedClientsFor("delegationTransportation");
```

Resolve each non-null `logoAsset` through `clientLogoMedia`.

Fail unless the returned IDs and order are exactly:

```text
chinese-embassy
osce-mission-to-serbia
serbian-swimming-federation
```

The canonical helper gates per-route placement, approved status and asset presence. Do not import logo files directly into the page component and do not reconstruct client names from UI strings.

`DelegationInstitutionalProof` uses an open dark surrounding section with its
label, heading and intro above three individual light semantic logo boxes. Use
`astro:assets Image`, no filter/recolour, and no external links. Preserve one
column on narrow mobile, an intentional tablet transition and three equal boxes
from tablet portrait through wide desktop.

Use semantic feature spacing so the proof section has clear dark breathing room
after the contained Discretion section.

Do not add generic Business Hub clients.

# 19. Briefing

Read `briefing`.

Build four numbered UI rows: times/locations, passengers/groups, vehicle structure, special/confidentiality requirements.

Render canonical manual-confirmation note.

Quiet CTA → booking.

No form.

# 20. Vehicles

Assert exact IDs/order:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
```

Resolve canonical fleet/media.

Suitability UI keys:

```text
delegationTransportation.vehicleRole.sClass
delegationTransportation.vehicleRole.eClass
delegationTransportation.vehicleRole.vClass
```

No fare metadata.

# 21. Standards

Use `buildServiceStandardGroups(locale)`.

Require 4 groups × 3 facts.

Pass markers 01–04 into shared `ServiceStandards`, `numbered-matrix`, `contained-dark`.

No page-local standards clone.

# 22. FAQ

Require exactly eight Markdown FAQ rows.

Allowed tokens only:

```text
{multipleVehiclesAnswer}
{mixedClassesAnswer}
{coordinatorAnswer}
{groupMovementAnswer}
{ndaAnswer}
{confirmationAnswer}
{securityAnswer}
```

Reuse `interpolateTokens()`.

Unknown or unresolved token = error.

Security answer explicitly excludes physical security/protection.

NDA answer is request + written-agreement only.

Visible FAQ and FAQ schema use identical resolved arrays.

# 23. SEO

Reuse `buildPageSeo()`.

Hero title is the only H1.

FAQ structured data uses visible resolved FAQ.

No price/review/fake-client schema.

No component `<head>`.

# 24. Dispatcher

After service content and renderer exist, add exactly one `delegationTransportation` mapping to existing `ContentPageRenderer.astro`.

Do not create another dispatcher.

# 25. Final CTA

Import `s-class-interior-1.webp`.

Pass `imageAlt=""`, `imageFit="cover"`, `mediaTreatment="integrated"`.

Pass verified contact channels using existing service-page pattern.

Both booking and quote buttons remain visible.

# 26. Responsive verification

Review 320/768/1024/1440/1920 and both sides of actual topology-changing breakpoints.

Record topology, DOM order, image crop, SR/EN/RU wrapping, CTA destinations, target sizes, focus order, overflow and logo legibility.

Hero crop MUST keep the V-Class recognisable and left-side copy readable.

The supplied SR/EN/RU CTA labels MUST remain one row at the tablet-portrait state. Institutional proof MUST be one column in the mobile state and exactly three equal regions from tablet portrait through wide desktop.

# 27. Verification commands

Run current repository commands including at minimum:

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

Also run current Astro check, production build, UI verification, independent design review and technical page review.

Never claim a gate passed unless it ran successfully.

# 28. Release

Release only when all locked assets resolve, all locale content validates, UI parity passes, design/technical reviews pass, acceptance is fully green and repository gates pass.

Then, in one bounded release change:

```text
route → published
SR → published/indexable
EN → published/indexable
RU → published/indexable
```

# 29. Completion report

Return:

```text
files created
files modified
shared components reused
shared components changed
content lifecycle
UI merge
asset state
institutional client proof state
CTA/flow state
route state
SEO/schema state
commands + actual results
remaining blockers
```
