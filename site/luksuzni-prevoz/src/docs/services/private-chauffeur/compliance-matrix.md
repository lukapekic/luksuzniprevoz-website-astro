# Private Chauffeur v3 — Implementation Compliance Matrix

Status: implementation evidence ledger

| Requirement | Authority | Data/content source | Production owner | Responsive contract | Verification |
| --- | --- | --- | --- | --- | --- |
| Hero | Blueprint §6 | service data + localized Hero + shared image | `ServiceHero / full-bleed` | full-bleed near-viewport canvas with over-Hero Header at every state | component tests, five-state render, page verification |
| Service definition | Blueprint §7 | `services.ts` + localized UI/content | `ServiceOverview / numbered-divider-facts` | one list through portrait; 5/7 from `lg` | four-row assertion, component/page verification |
| Hire options | Blueprint §8 | booking options + localized section/UI | `PrivateChauffeurOptions` | vertical through portrait; three columns from `lg` | type/content assertions, overflow review |
| Your Time | Blueprint §9 | localized section + shared image | `OpenSplitSection` composition | content then 4:3 media; visual 7/5 from `lg` | image/DOM/order review |
| One Schedule | Blueprint §10 | service facts + localized section/UI + shared image | `OpenSplitSection` composition | vertical itinerary through portrait; 5/7 from `lg` | six-stop/three-fact assertions, DOM review |
| Editorial statement | Blueprint §11 | localized body + four item pairs + shared vertical image | `PrivateChauffeurEditorialStatement` | one-column fact panel through portrait; 8/4 section and 2×2 facts from `lg` | four-pair assertion, localized wrapping review |
| Standards | Blueprint §12 | `operations.ts` + localized shared UI | `ServiceStandards / numbered-matrix` | one list through portrait; 4/8 with 2×2 matrix from `lg` | four-group/three-fact assertions, component/page verification |
| Passenger experience | Blueprint §13 | localized section + shared image | `OpenSplitSection` composition | content then 4:3 media; visual 7/5 from `lg` | two-fact assertion, DOM/image review |
| Sedan recommendations | Blueprint §14 | content IDs + `fleet.ts`/fleet media | `VehicleRecommendations` | shared carousel at every state | ordered-ID assertion, carousel/overflow review |
| Custom engagement | Blueprint §15 | service modes + existing localized UI | `PrivateChauffeurCustomPanel` | one column through portrait; 7/5 from `lg` | three-fact assertion, flow-fallback review |
| FAQ | Blueprint §16 | localized FAQ + canonical interpolation | `FAQ` + `buildFaqPage()` | reading container at every state | ten-item/token/schema parity tests |
| Final CTA | Blueprint §17 | localized content + verified contacts | `FinalCTA` | shared compact composition; both actions visible | component/page verification |
| CTA flows | Blueprint §§3, 21 | CTA schema + route map | default `resolveCtaHref()` behavior | localized Contact fallback at every state | resolver unit tests, rendered-link audit |
| Fleet link | Blueprint §§14, 21 | route key `fleet` | `Link` via `VehicleRecommendations` | shared carousel CTA | routes validation, built-link audit |
| Business facts | Blueprint §2 | `services.ts`, `operations.ts`, `contact.ts` | typed data + assertions | presentation-independent | TypeScript/unit/build validation |
| Localization | Blueprint §§19–20 | approved SR/EN/RU package + UI dictionaries | content collection + `t()` | long-label and Cyrillic review at five states | type generation, content parity, visual review |
| Digest | Blueprint §19 | Serbian canonical content | recursive canonicalizer + digest generator | n/a | canonicalization unit tests + sync/check |
| Images | Blueprint §5 | six owner-supplied files | `src/assets/shared/chauffeur-service/` | locked crop/priority per state | import search, generated markup, CLS/LCP review |
| SEO | Blueprint §28 / technical SEO skill | localized SEO + route map | `buildPageSeo()` / `Page` | equivalent meaningful content | SEO/routes validators + built head inspection |
| Structured data | Blueprint §§16, 28 | same interpolated visible FAQ | typed FAQ builder | locale-aligned | unit/SEO validation + built JSON-LD comparison |
| Lifecycle | Blueprint §§19, 30 | content status + route availability | content files + `routes.ts` | all locales atomic | pre-publication gates, routes/content/SEO rerun |
| Accessibility | Blueprint §23 | semantic content/component contracts | shared/local components | logical DOM/focus; 44×44; no overflow | automated a11y + keyboard/manual review |
| Performance | Blueprint §24 | image roles + site budget | Astro image pipeline; static Astro | Hero priority; below-fold lazy | build output, responsive image and budget review |

No compliance row may be closed from inference. Automated and manual evidence
must be recorded separately in the completion report.

## Recorded implementation evidence

- Exact-target design context resolved the locked blueprint, shared contracts,
  Theme V2, and repository data authorities; the regenerated design snapshot
  is current.
- Manual browser review covered 320, 768, 1024, 1440, and 1920 CSS px with SR,
  EN, and RU. The Hero remained full-bleed with a meaningful steering-wheel
  crop, readable copy/actions/support facts, and the approved over-Hero Header.
- Browser assertions confirmed one H1; ten FAQ disclosures matching FAQ JSON-LD;
  no empty links; localized Contact fallbacks for booking/quote; the locked
  three-sedan list; and Inter Tight/Manrope computed typography roles.
- The editorial and standards compositions remain one column through tablet
  portrait and become balanced 2×2 matrices at `lg`. Standards contain exactly
  four groups with exactly three facts per group; all number markers are hidden
  from assistive technology.
- At all five reference widths, `scrollWidth === clientWidth` and visible
  controls meet the 44×44 target minimum. The focused Axe WCAG 2.2 check passed
  in Chromium and Firefox.
- All main-content images loaded with non-zero intrinsic widths after a
  progressive-scroll pass; the Hero is eager/high-priority and contextual
  images below it remain lazy.
- The additive shared standards variant has four direct consumers. A combined
  29-test Chromium run covering Airport, Business, Private Chauffeur, and
  Special Events passed. Private Chauffeur also passed all nine focused tests
  in Chromium and Firefox.
- Independent design review found no P0/P1/P2 visual finding in the scoped pass.
  The Web Interface Guidelines review found no scoped accessibility, focus,
  animation, image, navigation, or interaction violation.
- Foundation doctor, theme validation/sync check, route/content/SEO validation,
  generated-type checks, lint, unit tests, component registry, traceability,
  design doctor/detector, and design snapshot checks passed.

## Global gate note

The final `page` and `component` verification profiles are not green in the
current dirty worktree. Their governance/design/theme/type/content/route/SEO
gates passed, then root `pnpm check` reparsed unrelated in-progress Business
Transportation content and rejected its unsupported `anchor` CTA target and
section-level `cta` field. The explicit site `astro check` and production build
stop on the same content-schema mismatch. That Business schema decision remains
outside this page contract and was not altered.

The root cross-browser accessibility command passed all Chromium and Firefox
tests but could not launch WebKit because the host lacks `libicu74` and
`libjpeg-turbo8`. Focused Private Chauffeur Axe coverage passed in both
available engines.
