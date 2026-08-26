# Private Chauffeur — Acceptance Contract

Status: **Required completion gate**  
Route key: `privateChauffeur`

An implementation is not approved until every applicable item below passes.

Use this checklist after implementation, not as permission to change the locked blueprint.

---

# 1. Authority

- [ ] Root `AGENTS.md` was read.
- [ ] Root `DESIGN.md` was read.
- [ ] `00-service-agent-foundation.md` was read.
- [ ] `component-reuse-registry.md` was read.
- [ ] Private Chauffeur `blueprint.md` was read.
- [ ] Private Chauffeur `wireframe.html` was read.
- [ ] Shared service contracts were read.
- [ ] Matching `.skills/` files required by `AGENTS.md` were loaded.
- [ ] `pnpm design:context site/luksuzni-prevoz` ran successfully before UI work.

---

# 2. Prerequisite shared layer

These are reused, not reimplemented locally:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `OpenSplitSection`
- [ ] `FAQ`
- [ ] `FinalCTA`
- [ ] `Section`
- [ ] `PageContainer`
- [ ] `ReadingContainer`
- [ ] `SectionHeading`
- [ ] routing/link helpers
- [ ] `BaseLayout`
- [ ] `SiteHeader`
- [ ] `SiteFooter`

Fail if a Private-Chauffeur-local clone replaces any of the above.

---

# 3. New-component budget

Expected new visual/page components:

```text
PrivateChauffeurPage.astro
PrivateChauffeurOptions.astro
```

Expected new non-visual infrastructure:

```text
ContentPageRenderer.astro
```

- [ ] Every additional new component is listed in the handoff.
- [ ] Every additional new component has a real semantic/structural justification.
- [ ] No wrapper component exists only to rename `Section` or `PageContainer`.
- [ ] No page-local Button/Link/Heading/FAQ/CTA clone exists.
- [ ] Availability & Flexibility remains direct composition unless extraction was explicitly justified.

Reject component explosion.

---

# 4. Renderer / routing

- [ ] `privateChauffeur` no longer renders as generic prose-only `LeafPage`.
- [ ] A dedicated `PrivateChauffeurPage` renderer exists.
- [ ] One shared non-visual content-page dispatcher is used.
- [ ] Default Serbian catch-all uses the dispatcher.
- [ ] `/en|ru/` catch-all uses the same dispatcher.
- [ ] Route conditional logic is not duplicated across both catch-all files.
- [ ] Unimplemented routes still fall back to the existing `LeafPage`.
- [ ] Dispatcher owns no visual design or business facts.
- [ ] No manual localized path concatenation was introduced.

---

# 5. Page structure

Exact visible order:

- [ ] `ServiceHero`
- [ ] `ServiceOverview`
- [ ] `PrivateChauffeurOptions`
- [ ] Availability & Flexibility
- [ ] `VehicleRecommendations`
- [ ] `ServiceStandards`
- [ ] `FAQ`
- [ ] `FinalCTA`

Global chrome:

- [ ] `SiteHeader` comes from approved production chrome.
- [ ] `SiteFooter` comes from approved production chrome.

Must not appear unless blueprint was explicitly revised:

- [ ] no duplicate reviews section
- [ ] no Homepage `TrustStrip`
- [ ] no Homepage process section
- [ ] no pricing table
- [ ] no client-logo section
- [ ] no booking form inside Hero
- [ ] no unrelated service-card grid
- [ ] no second closing CTA
- [ ] no decorative gallery

---

# 6. Hero

- [ ] Uses shared `ServiceHero`.
- [ ] Uses `responsive-split`.
- [ ] Desktop relationship is content 5 / media 7.
- [ ] Tablet/mobile uses the approved contained image-backed transformation.
- [ ] Exactly one H1 is rendered.
- [ ] H1 comes from the Hero content contract.
- [ ] Primary CTA uses approved CTA resolution.
- [ ] Secondary quote CTA uses approved CTA resolution when authored.
- [ ] At most one quiet support/context line appears.
- [ ] No pricing appears.
- [ ] No ratings appear.
- [ ] No trust-chip row appears.
- [ ] No fleet specs appear.
- [ ] No booking form appears.
- [ ] No new visible breadcrumb band was inserted outside the blueprint.
- [ ] Missing imagery preserves geometry instead of causing redesign.

---

# 7. Service Overview

- [ ] Uses shared `ServiceOverview`.
- [ ] Default presentation is open/divider-led, not a card grid.
- [ ] Editorial explanation comes from content.
- [ ] Service capability facts come from `services.ts`.
- [ ] No duplicated hardcoded capability facts exist in the component.
- [ ] Homepage `TrustStrip` is not reused as a substitute.

---

# 8. Private Chauffeur Options

- [ ] Uses one functional/light parent surface.
- [ ] Hourly / Half Day / Full Day are visually related inside that parent.
- [ ] Three independent floating pricing cards were not created.
- [ ] Mode labels use approved localized UI strings.
- [ ] Hourly minimum is read from `services.ts`.
- [ ] Half-day hours are read from `services.ts`.
- [ ] Half-day included kilometres are read from `services.ts`.
- [ ] Full-day hours are read from `services.ts`.
- [ ] Full-day included kilometres are read from `services.ts`.
- [ ] Hourly does not invent a kilometre allowance when `publishedKmLimit` is null.
- [ ] There is one coherent shared booking/next action unless blueprint/content explicitly requires otherwise.
- [ ] Mobile stacks naturally.
- [ ] No horizontal scroll.
- [ ] No forced equal-height card layout.

## Pricing hard gate

The following must all be absent from this service page:

- [ ] no hourly fare value
- [ ] no half-day fare value
- [ ] no full-day fare value
- [ ] no per-km fare value
- [ ] no inferred EUR
- [ ] no inferred RSD
- [ ] no inferred currency symbol
- [ ] no duplicated `pricing.ts` matrix

Fail immediately if service-page fares were introduced.

---

# 9. Availability & Flexibility

- [ ] Uses `OpenSplitSection`.
- [ ] Desktop visual relationship is image 7 / content 5.
- [ ] Mobile reading order is content first, image second.
- [ ] `chauffeurRemainsAvailable` is read from `services.ts`.
- [ ] `multiDay === "quote"` is read from `services.ts`.
- [ ] `international === "quote"` is read from `services.ts`.
- [ ] Localized strings describe data-derived states without becoming the factual source.
- [ ] No claim of guaranteed last-minute availability exists.
- [ ] No claim of unrestricted 24/7 booking exists.
- [ ] No claim of instant confirmation exists.
- [ ] No fixed international pricing claim exists.
- [ ] No new page-local split primitive was created.

---

# 10. Vehicle Recommendations

- [ ] Uses shared `VehicleRecommendations`.
- [ ] Vehicle IDs come from localized page content.
- [ ] IDs are validated by the existing content schema.
- [ ] Canonical vehicle facts come from `fleet.ts`.
- [ ] Display names are not re-authored/translated in the component.
- [ ] Capacity is only shown when canonical value is non-null.
- [ ] Vehicle class uses approved localized UI labels.
- [ ] No fare appears.
- [ ] No invented luggage capacity appears.
- [ ] No invented equipment/features appear.
- [ ] Homepage `FleetShowcase` visual identity was not copied.
- [ ] Missing photography uses approved placeholder treatment.
- [ ] Full Fleet CTA uses approved route resolution.

---

# 11. Service Standards

- [ ] Uses shared `ServiceStandards`.
- [ ] Primary factual source is `operations.ts`.
- [ ] Service-specific supplements come only from verified `services.ts` capabilities.
- [ ] Internal enum/code strings are not shown directly to users.
- [ ] Localized labels are external to the visual component.
- [ ] No trust-card grid was introduced.
- [ ] No badge wall was introduced.
- [ ] No bodyguard/security claim was introduced.
- [ ] Homepage `TrustStrip` was not substituted.

---

# 12. FAQ

- [ ] Uses shared `FAQ`.
- [ ] FAQ is composed inside page-owned `Section`.
- [ ] Uses `ReadingContainer`.
- [ ] Uses `SectionHeading`.
- [ ] FAQ component owns rows only.
- [ ] FAQ questions/answers come from validated localized content.
- [ ] Visible FAQ and FAQ structured data consume the same item array.
- [ ] No duplicate FAQ copy was created for schema.
- [ ] No second accordion implementation exists.
- [ ] `<details>/<summary>` behavior remains keyboard accessible.

---

# 13. Final CTA

- [ ] Uses existing shared `FinalCTA`.
- [ ] Content is page-specific through props/data only.
- [ ] Primary action follows global conversion hierarchy.
- [ ] Secondary quote/contact action remains subordinate.
- [ ] No `PrivateChauffeurFinalCTA` clone exists.
- [ ] No page-specific FinalCTA gradient exists.
- [ ] No page-specific FinalCTA radius exists.
- [ ] No second-Hero treatment exists.

---

# 14. Content

Expected locale coverage:

- [ ] Serbian content entry exists.
- [ ] English content entry exists.
- [ ] Russian content entry exists.

Every entry:

- [ ] `routeKey: privateChauffeur`
- [ ] `pageType: service`
- [ ] correct locale
- [ ] valid lifecycle fields
- [ ] valid SEO fields
- [ ] valid Hero
- [ ] valid overview
- [ ] `sections` contains `hireOptions`
- [ ] `sections` contains `availabilityFlexibility`
- [ ] valid vehicle recommendations
- [ ] valid FAQ
- [ ] valid Final CTA

Content must not duplicate:

- [ ] hire duration facts
- [ ] kilometre allowance facts
- [ ] fare numbers
- [ ] currency
- [ ] fleet capacity
- [ ] operational standards
- [ ] contact data
- [ ] route URLs

If approved content is not part of the implementation task, these checks may remain a declared blocker, but the page must not be represented as production-complete.

---

# 15. UI strings

- [ ] Existing `booking.mode.*` keys are reused.
- [ ] Existing unit labels are reused.
- [ ] No hardcoded English mode label exists in Astro.
- [ ] No agent-invented Serbian/Russian translation exists.
- [ ] Any new data-derived display key exists in all configured locales before completion.
- [ ] UI dictionaries hold presentation wording, while canonical data controls truth/state.

---

# 16. CTA / routing

- [ ] Existing `resolveCtaHref()` is reused.
- [ ] Internal routes use `RouteKey`/`Link`/`getPath()` as appropriate.
- [ ] No manually authored `/en/...` path exists in page code.
- [ ] No manually authored `/ru/...` path exists in page code.
- [ ] No duplicated local CTA resolver exists.
- [ ] Booking/quote flow behavior still follows current repository flow handling.
- [ ] Related-route links are supported by canonical route/service data.

---

# 17. SEO

- [ ] Existing `buildPageSeo()` path is reused.
- [ ] Page does not emit its own `<head>`.
- [ ] One H1 only.
- [ ] SEO title comes from localized content.
- [ ] SEO description comes from localized content.
- [ ] Locale metadata remains intact.
- [ ] Canonical behavior remains intact.
- [ ] hreflang behavior remains intact.
- [ ] lifecycle/noindex behavior remains intact.
- [ ] no raw localized URLs were inserted into metadata.

---

# 18. Structured data

- [ ] Existing structured-data infrastructure is reused.
- [ ] FAQ schema matches visible FAQ exactly.
- [ ] No duplicated FAQ array exists.
- [ ] No hardcoded route URL exists in JSON-LD.
- [ ] No duplicated service facts exist in JSON-LD.
- [ ] No invented price/currency appears in schema.
- [ ] No new ad-hoc JSON-LD helper was created when an approved helper already exists.

---

# 19. Theme / visual system

- [ ] Uses active theme through repository configuration.
- [ ] No component selects `version-2` directly as a fallback.
- [ ] No raw hex colors.
- [ ] No raw rgb/hsl colors.
- [ ] No page-local palette.
- [ ] No page-local spacing scale.
- [ ] No page-local radius scale.
- [ ] No page-local breakpoint scale.
- [ ] No copied wireframe CSS.
- [ ] No Tailwind v3 config.
- [ ] No gold-first luxury styling.
- [ ] No glass.
- [ ] No glow.
- [ ] No strong decorative shadow system.
- [ ] No routine hover lift.
- [ ] No unnecessary cardification.

---

# 20. Typography

Computed browser typography must confirm:

- [ ] H1 uses the approved heading stack.
- [ ] H2 uses the approved heading stack.
- [ ] body uses the approved body stack.
- [ ] navigation remains approved.
- [ ] CTA/button typography remains approved.
- [ ] Cormorant Garamond does not leak into general page headings/body.

Layout must not be tuned around a fallback font.

---

# 21. Accessibility

- [ ] WCAG 2.2 AA baseline.
- [ ] Exactly one H1.
- [ ] Logical heading hierarchy.
- [ ] Semantic sections.
- [ ] Correct `aria-labelledby` where used.
- [ ] Interactive targets meet 44×44 CSS px project minimum.
- [ ] Focus-visible is clearly perceivable.
- [ ] Keyboard navigation works.
- [ ] FAQ is keyboard operable.
- [ ] No horizontal page overflow.
- [ ] Reduced motion respected.
- [ ] Informative image alt is localized and meaningful.
- [ ] Decorative images use empty alt/presentation semantics.
- [ ] Light-surface text meets contrast requirements.
- [ ] ARIA does not replace available native semantics.

---

# 22. Responsive acceptance

Review each state independently:

```text
Mobile
Tablet portrait
Tablet landscape
Desktop
Wide desktop
```

Reference widths:

```text
320
768
1024
1440
1920
```

## Mobile

- [ ] No horizontal overflow.
- [ ] Hero CTAs fit/stack cleanly.
- [ ] Hero image focal point remains useful.
- [ ] Hire options stack naturally.
- [ ] Availability copy precedes media.
- [ ] Vehicle names do not overflow.
- [ ] FAQ summaries wrap cleanly.
- [ ] Final CTA remains a medium-height closer, not Hero #2.

## Tablet portrait

- [ ] Hero transformation is intentional.
- [ ] Hire options remain readable.
- [ ] No forced desktop three-column density.
- [ ] Vehicle recommendations fit without cramped text.
- [ ] Section spacing does not become excessive.

## Tablet landscape

- [ ] Hero moves toward desktop intent without awkward intermediate geometry.
- [ ] Availability split remains balanced.
- [ ] No accidental giant empty areas.

## Desktop

- [ ] Hero is content 5 / media 7.
- [ ] Availability is media 7 / content 5.
- [ ] Hire options read as one functional composition.
- [ ] Page hierarchy is stronger than decorative styling.
- [ ] No section resembles a dashboard.

## Wide desktop

- [ ] Content remains constrained by semantic containers.
- [ ] Images do not become uncontrolled full-width decoration.
- [ ] Text measure remains readable.
- [ ] Section rhythm does not become sparse/empty.

---

# 23. Image / performance

- [ ] Approved Astro image pipeline used.
- [ ] No unnecessary raw `<img>`.
- [ ] Hero image delivery is appropriate for LCP.
- [ ] Explicit sizing/aspect behavior avoids CLS.
- [ ] Responsive image output is used where applicable.
- [ ] Focal point is honored where authored.
- [ ] Missing asset state uses approved neutral treatment.
- [ ] No remote hotlinked stock imagery.
- [ ] No unnecessary client JavaScript for static media.

---

# 24. JavaScript / islands

- [ ] Page remains static-first.
- [ ] No new framework island was added for static composition.
- [ ] No dependency was added merely for layout/accordion behavior.
- [ ] Any `client:*` usage has the repository-required justification.
- [ ] FAQ remains zero-JS/native unless an approved contract changes it.

---

# 25. Automated validation

Run and record the result of every applicable command.

Minimum:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Final governance gate:

```bash
pnpm design:guard
```

When the task scope or repository policy requires them, also run:

```bash
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm test:a11y
```

Never mark a command passed if it was not actually executed successfully.

---

# 26. Manual visual review

The implementation must be visually inspected in a browser.

Record:

```text
mobile              PASS / FAIL / NOT RUN
tablet portrait     PASS / FAIL / NOT RUN
tablet landscape    PASS / FAIL / NOT RUN
desktop             PASS / FAIL / NOT RUN
wide desktop        PASS / FAIL / NOT RUN
```

Also record:

```text
font verification   PASS / FAIL / NOT RUN
keyboard review     PASS / FAIL / NOT RUN
focus review        PASS / FAIL / NOT RUN
image crop review   PASS / FAIL / NOT RUN
overflow review     PASS / FAIL / NOT RUN
```

Automated checks do not replace visual review.

---

# 27. Rejection conditions

Reject the implementation immediately if any of the following is true:

- Private Chauffeur still uses generic prose-only `LeafPage`.
- Shared service components were cloned locally.
- Fare values appear on the service page.
- Currency was inferred.
- `services.ts` facts were copied into component literals.
- `fleet.ts` facts were copied into component literals.
- `operations.ts` facts were copied into component literals.
- localized URLs were string-built.
- copy/translations were hardcoded into reusable components.
- unapproved translations were invented.
- Homepage `TrustStrip` substitutes for `ServiceStandards`.
- Homepage `FleetShowcase` substitutes for `VehicleRecommendations`.
- three floating pricing cards replace the single functional hire-options composition.
- a page-local FinalCTA was created.
- raw theme colors/radii/breakpoints were introduced.
- wireframe CSS was copied into production.
- responsive states were not checked.
- known blockers were hidden in the completion report.

---

# 28. Required completion report

The page agent must return:

```text
PRIVATE CHAUFFEUR IMPLEMENTATION REPORT

STATUS:
PASS / PARTIAL / BLOCKED

FILES CREATED:
-

FILES MODIFIED:
-

REUSED SHARED COMPONENTS:
-

NEW COMPONENTS:
-

WHY EACH NEW COMPONENT WAS REQUIRED:
-

PAGE-LOCAL COMPOSITIONS:
-

NEW SHARED VARIANTS:
-

DATA SOURCES USED:
-

CONTENT / UI STRING STATUS:
-

RESPONSIVE REVIEW:
mobile:
tablet portrait:
tablet landscape:
desktop:
wide desktop:

ACCESSIBILITY REVIEW:
-

COMMANDS RUN:
command → result

DESIGN DETECTOR:
-

SITE CHECK:
-

SITE BUILD:
-

BLUEPRINT DEVIATIONS:
-

SHARED COMPONENT BLOCKERS:
-

CONTENT BLOCKERS:
-

KNOWN TODOs:
-
```

A response of only:

```text
done
```

or:

```text
implemented successfully
```

is not an acceptable handoff.
