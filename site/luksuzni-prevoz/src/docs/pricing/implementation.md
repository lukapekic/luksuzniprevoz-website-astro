# Luxury Transportation — Pricing Page Implementation Plan v2

Status: **CODE-ALIGNED IMPLEMENTATION PLAN**
Target route: `pricing`
Page type: `pricing`
Required blueprint: `blueprint.md`
Required acceptance contract: `acceptance.md`
Required data contract: `data-contract.md`

This plan supersedes Pricing implementation plan v1. It reflects the current
repository contracts as of 2026-08-30. The current code and generated contracts
remain authoritative for technical and data behavior. After Phase 1 synchronizes
the page documents, the locked blueprint resumes page-specific visual authority.

No production Pricing UI may be implemented before Phase 1 and Phase 2 pass.

---

# 0. Verified repository baseline

The implementation starts from these current facts:

```text
pricing content already lives in src/content/pages/pricing/
SR, EN and RU use the full pricing schema and currently validate
localized Pricing UI keys are already merged and generated types are current
Pricing route availability is scaffold
Pricing content status is draft and noindex is true in all locales
src/components/pricing/ does not exist yet
ContentPageRenderer has no Pricing dispatch yet
the Pricing design surface is registered in .design/config.json
```

Canonical pricing/fleet facts:

```text
fleet.ts declares eight vehicles
seven vehicles have pricingStatus: published
Škoda Kodiaq has pricingStatus: quote-only
pricing.ts intentionally contains numeric records for the seven published vehicles only
VehiclePricing.currency is typed as EUR and present on every numeric record
airportTransfer retains its own typed currency and scope
assertPricingConsistency() guards fleet/pricing parity
```

Do not recreate completed content/UI installation work. Do not add a second
currency owner.

---

# 1. Stop conditions

Stop and report a blocker when any of the following is true:

```text
the Pricing design surface does not resolve
the component registry is stale before shared-component impact assessment
blueprint, acceptance and wireframe still contradict this plan's data/responsive contracts
any Pricing locale fails schema or parity validation
a published-pricing fleet vehicle has no canonical pricing record
a quote-only fleet vehicle has a numeric pricing record
the configured active theme cannot be resolved
a required shared component must be redesigned rather than correctly integrated
publication would expose a dead Pricing navigation link or omit a localized route
```

Do not bypass a blocker with hardcoded copy, prices, currency, route paths,
vehicle facts, raw theme values or duplicate responsive DOM.

---

# 2. Phase 1 — synchronize the page contract

Before creating production components, update the remaining Pricing documents.

## `blueprint.md`

Required corrections:

```text
split authority into the root technical chain and the page visual chain
refer to the configured active theme rather than hard-binding the document to Theme V2
replace the obsolete missing-currency gate with the current VehiclePricing.currency invariant
define numeric rows as all and only pricingStatus: published vehicles
define Škoda Kodiaq as quote-only and outside numeric ledgers for V1
correct every advertised 5/7 composition to literal 5 columns + 7 columns
lock the page-local ledger split to xl
require hero.supportText passthrough
require FAQPage from the same visible validated FAQ array
align FinalCTA behavior with its reviewed 62/38 lg contract
clarify that Pricing Models, Confirmation and FAQ remain separate semantic regions
even when they share one continuous light visual surface
```

## `acceptance.md`

Required corrections:

```text
assert configured active-theme resolution instead of a literal theme version
assert VehiclePricing.currency for hourly, half-day and full-day fares
assert all-and-only published-pricing vehicle parity instead of "current fleet = seven"
assert quote-only vehicles receive no numeric fallback
assert hero support text is rendered
assert BaseLayout + buildPageSeo ownership
assert the exact breakpoint contract in Phase 7
separate draft validation from post-publication browser tests
make publication an atomic route + three-locale lifecycle transition
use check-only generators unless their authoritative input changed
```

## `wireframe.html`

Required corrections:

```text
show the ServiceHero support-text region
use real anchor placeholders with href values in PricingIndex
place matching ids on all three anchor destinations
remove "seven current fleet" as a structural truth
show literal 5/7 tariff topology at xl
align FinalCTA with the shared 62/38 lg composition
represent Pricing Models, Confirmation and FAQ as distinct semantic sections
replace literal Theme V2 authority language with configured-active-theme language
```

## Supporting Pricing documents

Update `README.md`, `data-contract.md`, `VALIDATION.md` and `MANIFEST.md` so
none claims that chauffeur currency is missing. Remove or deprecate the
`pricing.data.pendingCurrency` handoff key. Keep `pricing.price.unavailable`
only for an explicitly authorized quote-only presentation; V1 numeric ledgers
do not use it.

Run after document synchronization:

```bash
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm types:generate:check
```

---

# 3. Phase 2 — governance bootstrap and preflight

Read the authority bundle required by root `AGENTS.md`, including `DESIGN.md`,
the synchronized Pricing blueprint/wireframe, and the required page, responsive,
accessibility, Tailwind, component, functional, SEO, schema and routing skills.

Run:

```bash
git status --short
pnpm design:context --target site/luksuzni-prevoz/src/docs/pricing/blueprint.md --surface pricing
pnpm components:check
```

The blueprint target is the pre-creation governance bootstrap because the
future production target does not exist yet. After creating the minimal
`PricingPage.astro` shell, rerun immediately:

```bash
pnpm design:context --target site/luksuzni-prevoz/src/components/pricing/PricingPage.astro --surface pricing
```

Do not add layout, styling or section composition to the shell until the exact
production target resolves. Record this bootstrap sequence in the completion
report.

Inspect current contracts rather than relying on examples:

```text
foundation.config.ts
src/data/pricing.ts
src/data/fleet.ts
src/data/services.ts
src/data/routes.ts
src/data/navigation.ts
src/data/navigation-labels.json
src/data/flows.ts
src/data/contact.ts
src/data/locales.ts
src/content/schemas/pages.ts
src/lib/pages.ts
src/lib/seo.ts
src/lib/cta.ts
src/layouts/BaseLayout.astro
src/components/site/ContentPageRenderer.astro
src/components/services/shared/ServiceHero.astro
src/components/shared/FAQ.astro
src/components/shared/FinalCTA.astro
```

No shared component change is expected.

---

# 4. Phase 3 — page-local architecture

Create:

```text
site/luksuzni-prevoz/src/components/pricing/
```

Required responsibilities:

```text
PricingPage.astro            → content guards, canonical adapter, SEO and page assembly
PricingIndex.astro           → three native in-page links
PricingPublishedRates.astro  → one continuous light numeric-pricing canvas
PricingRateGroup.astro       → one tariff metadata/ledger composition
PricingCustomServices.astro  → Business and Special Events quote families
PricingModels.astro          → three authored explanatory items
```

Additional page-local type or adapter files are allowed when they make data
validation independently testable. Do not create a global `PricingCard`, add a
dependency or add a client island.

`PricingPage.astro` inputs:

```ts
routeKey: "pricing"
locale: LocaleCode
content: CollectionEntry<"pages">
```

Fail loudly in development when:

```text
routeKey is not pricing
pageType is not pricing
pricing.source is not pricing-data
individualPricing, pricingModels or confirmation is absent
pricingModels does not contain exactly three items
FAQ does not contain exactly eight items
```

---

# 5. Phase 4 — canonical view model

Build the adapter before presentation markup.

## Numeric fleet eligibility

Derive:

```ts
const pricedVehicles = vehicles.filter(
  (vehicle) => vehicle.pricingStatus === "published",
);
```

For each priced vehicle, call `getPricing(vehicle.id)`. Throw if it returns
`null`. Do not call numeric fields for quote-only vehicles.

Current expected result is seven numeric vehicles, but the semantic contract is
parity with the canonical `pricingStatus: published` roster, not a hardcoded
number.

## Airport rows

For each priced vehicle in canonical fleet order:

```ts
{
  vehicleId: vehicle.id,
  displayName: vehicle.displayName,
  amount: vehiclePricing.airportTransfer.amount,
  currency: vehiclePricing.airportTransfer.currency,
}
```

Throw unless:

```text
airportTransfer.scope === "belgrade-airport-to-belgrade-city"
```

## Private Chauffeur rows

Build separate hourly, half-day and full-day arrays from the same priced roster:

```text
amount   → vehiclePricing.hourly | halfDay | fullDay
currency → vehiclePricing.currency
```

Do not render `perKm` or break any existing `pricing.ts` consumer.

Facts come from:

```text
hourly minimum → privateChauffeurService.bookingOptions.hourly.minimumHours
half-day       → hours + includedKm
full-day       → hours + includedKm
```

Interpolate the localized templates with the existing approved helper. Do not
duplicate the numeric facts in content or component strings.

## Custom service families

Derive the two families from the canonical service hubs and their `children`:

```text
businessTransportation
specialEvents
```

For each hub/child row provide:

```text
routeKey
localized route label from getNavLabel(routeKey, locale)
localized status derived from pricingMode
route availability
canonical href only when availability is published
```

Do not hardcode child arrays. Do not render a numeric `from` amount unless a
future canonical data source explicitly supplies one.

---

# 6. Phase 5 — formatting, labels and actions

Format every amount through the shared helper:

```ts
formatCurrency(amount, currency, getLocaleConfig(locale).intl.numberLocale)
```

Do not concatenate symbols/codes and do not derive currency from locale.

Label ownership:

```text
route/service names        → getNavLabel(routeKey, locale)
Individual Quotes anchor   → pricing.nav.custom
statuses, units and facts  → pricing.* UI strings
authored headings/body     → Pricing page content
```

Redundant Pricing UI route labels may remain temporarily unused until the
document/UI cleanup is reviewed. Do not create another label source.

Resolve authored CTA targets with the existing CTA/flow helpers:

```text
booking flow → canonical booking route with intent=booking
quote flow   → canonical booking route with intent=quote
service CTA  → Link route target / getPath architecture
```

Never manually concatenate localized paths or query strings.

---

# 7. Phase 6 — page assembly

Use `BaseLayout` as the sole page/chrome owner:

```astro
<BaseLayout
  seo={seo}
  currentRouteKey="pricing"
  currentLocale={locale}
  overHero={false}
>
  ...
</BaseLayout>
```

Build SEO through `buildPageSeo`. Feed the same validated FAQ array to both:

```text
visible FAQ.astro
buildFaqPage(faqItems)
```

`buildPageSeo` owns noindex-dependent canonical, hreflang and structured-data
suppression. Do not emit page-local head markup. Do not add Product, Offer,
AggregateOffer, priceRange, review or rating schema.

Visible order:

```text
SiteHeader
ServiceHero responsive-split
Pricing Intro + PricingIndex
Published Pricing Canvas
  Airport
  Private Chauffeur hourly
  Private Chauffeur half-day
  Private Chauffeur full-day
Individual Pricing
Pricing Models
Confirmation Statement
FAQ
FinalCTA
SiteFooter
```

Pricing Models, Confirmation and FAQ remain separate semantic regions even
when placed inside one continuous light visual canvas.

## Hero

Reuse `ServiceHero` unchanged:

```text
variant="responsive-split"
title/description/supportText from content.data.hero
eyebrow from Pricing UI
resolved booking and quote actions
image src/assets/s-class-wheel-interior.webp
imageAlt=""
no trust markers
```

## Pricing Index

Use one native `<nav>` containing exactly these links:

```text
#airport
#private-chauffeur
#individual-pricing
```

Targets need sticky-header-safe scroll offset, visible focus and 44×44 minimum
interactive size.

## Published Pricing Canvas

Use one contained light canvas with semantic light-surface tokens. Rate groups
are open, divider-led compositions, not cards or tables. Each row keeps vehicle,
formatted price and localized unit/status understandable without layout CSS.

## Individual Pricing

Use two open service families. Link only published routes; scaffold rows remain
plain text with localized pricing status. Render one quote-flow CTA after both
families.

## Final CTA

Reuse the reviewed component without geometry changes:

```text
heading/description/actions from content.data.finalCta
contacts from verified contact.phone/contact.email only
image src/assets/final-cta-bg.webp
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
locale passed through
```

---

# 8. Phase 7 — deterministic responsive contract

Use one logical DOM order at every width.

## Mobile — 320

```text
Hero: existing single-column responsive-split state
Intro/Index: stacked; full-width anchor links
Every ledger: meta then rows
Custom families: Business then Special Events
Pricing Models: stacked with horizontal dividers
FinalCTA: content then image
No horizontal overflow; long vehicle names wrap within their row
```

## Tablet portrait — 768

```text
same topology and focus order as mobile
increased tokenized spacing
ledgers and custom families remain stacked
```

## Tablet landscape — 1024 (`lg`)

```text
Hero remains in its existing pre-xl state
Intro/Index becomes 5/7
numeric ledgers remain stacked
custom families remain stacked
Pricing Models becomes three columns
FinalCTA uses its reviewed 62/38 layout
```

## Desktop — 1440 (`xl` active)

```text
ServiceHero uses its reviewed 5/7 responsive split
Airport and every Chauffeur ledger use 5/7
custom families use 6/6
Pricing Models remains three columns
FinalCTA remains its reviewed 62/38 layout
```

## Wide desktop — 1920

```text
desktop topology is preserved
all primary regions remain capped by container.main
rows and reading measure do not stretch
```

Also verify immediately below and above `xl`. Production CSS must use the
active breakpoint role/registered utility rather than copying a raw breakpoint
value. DOM order and keyboard order must remain unchanged.

---

# 9. Phase 8 — renderer integration

Update `ContentPageRenderer.astro` with explicit Pricing dispatch before the
generic `LeafPage` branch:

```text
routeKey === "pricing" → PricingPage
```

Do not alter shared static-path generation for this page.

After the minimal shell exists and the exact design context has passed,
implement one bounded region at a time and inspect integration before changing
any shared primitive.

---

# 10. Phase 9 — tests before publication

Add unit tests for an extracted adapter/helper when present.

Unit/data assertions:

```text
all and only pricingStatus: published vehicles enter numeric ledgers
quote-only vehicles never receive numeric fallback
canonical fleet order is retained
all numeric rows resolve currency
airport scope is the supported canonical scope
three Chauffeur groups are built
perKm remains excluded from public view models
custom families derive from canonical service children
published/scaffold route-link behavior is correct
```

Before publication, use content/route/SEO validators and dev-preview review for
the draft/noindex state. A production build intentionally omits non-scaffold
draft Pricing content, so one production E2E artifact must not be expected to
prove both draft and published states.

---

# 11. Phase 10 — atomic publication transition

Publish only after implementation, responsive review, accessibility review,
content validation and page acceptance pass.

Change in one release unit:

```text
routes.ts pricing availability: scaffold → published
pricing.sr.md status: draft → published; noindex: true → false
pricing.en.md status: draft → published; noindex: true → false
pricing.ru.md status: draft → published; noindex: true → false
```

Route availability drives route/sitemap policy; content status drives whether
the full Pricing entry is emitted by production static paths. Both lifecycle
layers must agree.

The header navigation already contains the Pricing route. Do not deploy an
intermediate state where that link points to a page omitted from the production
build. If an intermediate deployment is unavoidable, availability-filtering
navigation requires a separate shared-component impact review.

Do not hand-edit generated sitemap, canonical or hreflang output.

---

# 12. Phase 11 — post-publication browser verification

Create:

```text
site/luksuzni-prevoz/tests/smoke/pricing.spec.ts
```

Run all three localized routes through the site E2E script. Assert:

```text
successful page response and indexable metadata
one H1 and logical heading structure
hero support text and both flow destinations
three working in-page anchors and matching target ids
Airport rows equal the canonical published-pricing roster
three Chauffeur groups whose rows equal that same roster
no quote-only numeric fallback
no per-kilometre or city-to-city public fare
Business and Special Events families and status behavior
eight visible FAQ items and matching FAQPage data
FinalCTA actions and verified contact behavior
no horizontal overflow at 320, 768, 1024, 1440 and 1920
keyboard focus order and visible focus
```

Run the Pricing spec with the repository site script, for example:

```bash
pnpm --filter @luksuzni-prevoz/site test:e2e -- tests/smoke/pricing.spec.ts
```

Do not snapshot raw CSS.

---

# 13. Phase 12 — required verification order

Use generators only when their authoritative inputs changed. Otherwise use
check-only forms.

```bash
pnpm foundation:doctor site/luksuzni-prevoz
pnpm theme:sync:check
pnpm theme:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm types:generate:check
pnpm components:check
pnpm lint
pnpm test:unit
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm --filter @luksuzni-prevoz/site test:e2e -- tests/smoke/pricing.spec.ts
pnpm verify:ui --target site/luksuzni-prevoz/src/components/pricing/PricingPage.astro --surface pricing --change page
```

Additionally complete browser-based responsive, keyboard, accessibility,
independent design and technical page reviews. Do not report a gate as passed
unless it actually ran successfully.

Run `pnpm content:sync-digests` only after an approved Serbian editorial change,
followed by translation re-review. Run `pnpm types:generate` only after an
authoritative route/UI key change. Run `pnpm components:sync` only when the
component registry is stale after reviewed component/consumer changes.

---

# 14. Completion report

Report:

```text
authority files and skills applied
exact files created and changed
shared components changed and cross-consumer impact (expected: none)
canonical fleet/pricing eligibility behavior
route/content publication changes
commands actually run and their results
responsive evidence for all five states and both sides of xl
keyboard/accessibility evidence
SEO/structured-data evidence
content digest changes, if any
remaining placeholders, blockers, deviations or TODOs
```

No unresolved P0/P1 governance, data, accessibility, responsive, SEO or
localization finding may remain at completion.
