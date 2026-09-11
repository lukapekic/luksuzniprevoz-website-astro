# Content and SEO final review — 11 September 2026

The professional, restrained luxury content pass covers all 15 route families in
Serbian Latin, English and Russian: 45 page entries plus shared UI and navigation.
The owner delegated editorial approval and SEO decisions; this is an AI-reviewed
implementation for the owner's final review, not a native-speaker certification.
The work is on `feature/content-seo-finalization`, based on
`feature/pricing-fleet-booking` at `65398a3adb083a9d24e3eee73c9e5a4d16d2fb70`.
The earlier content skill/workflow changes are already in that base commit.

## Review these first

- [SEO research](seo-research.md): seven relevant Serbian-market competitors,
  source links, observed strengths and evidence limitations.
- [SEO decisions](seo-decisions.md): implemented technical and editorial choices.
- [Metadata map](metadata-map.json): final title/description fields for every locale.
- [Keyword map](keyword-map.json): intent, query hypotheses and evidence confidence.
- [Execution status](execution-status.json): current checkpoint and remaining inputs.
- [Verification evidence](verification.json): commands, exit codes, browser and
  Lighthouse results. Failed exploratory checks remain documented separately.
- [Changed files](changed-files.json): the complete implementation/review file list.

## What changed

Page copy now explains each service's purpose, relevant verified operations,
vehicle selection and the information required to arrange a journey. Removed
unsupported response-time promises, literal translations, drafting language and
confusing instant-confirmation implications. Serbian terminology follows the
repository's language reference, including `kombi`, `e-mail` and neutral dynamic
time units. EN/RU are localized editorial versions with aligned meaning. A final
pass after research refined search intent, titles, descriptions and visible copy.

The shared head now provides absolute canonical/hreflang/OG URLs, localized social
metadata, safe JSON-LD serialization and typed LocalBusiness, WebSite,
BreadcrumbList and visible FAQPage markup. Office hours and contact facts come
from verified typed data. Airport FAQ waiting values match the rendered answers.
The new static sitemap includes 36 indexable localized pages and excludes booking,
unpublished content and development previews. Production robots references it;
the existing `PROD_ROBOTS=1` deployment setting remains required for crawlable robots.

Navigation no longer points customers at unpublished child documents. The Business
hub retains its required three cards, with unavailable children using the existing
service-specific quote flow. This limited CTA exception is recorded in its blueprint.
The homepage's existing decorative image animation is now contained within its
own media layer, fixing measured horizontal overflow without clipping copy or focus. The homepage also uses the existing image-LCP font-preload opt-out
to prioritize its hero image; the fonts and visual design remain unchanged.

No new theme, shared UI variant, dependency, client island or runtime rendering was
introduced. The LocalBusiness builder's optional opening-hours field is additive;
existing callers retain their previous output. Generated types and design snapshot
were regenerated with repository commands.

## Scope and evidence limits

- Corporate and Conference/Congress copy is complete in all locales, but both route
  families retain their existing in-review/noindex/scaffold release gates. Their six
  entries are not advertised as live. Booking's three pages remain noindex.
- ValueSERP: 42 attempts, 15 successful responses and 27 failed requests; no automatic
  retries. Attempts do not establish billed credits. The initial 60-query total
  ceiling was respected; the direct runner's 42-query batch exceeded the planned
  12-per-run batch size, as recorded in the execution log.
- Seven providers were compared using organic results and readable public extracts.
  Direct HTML collectors received verification challenges, so competitor canonical,
  hreflang and JSON-LD details remain unknown. No search volume, difficulty,
  backlink score, traffic gain or ranking guarantee is claimed.
- The offline research heuristics flag exact query/entity phrases absent from raw
  source. Natural inflection and synonyms are retained; the shared brand is visible
  in composed pages. These flags are editorial review signals, not unresolved
  foundation errors or instructions to repeat keywords.
- Kodiaq capacity/pricing, luggage capacity, unverified review/map data and external
  form activation remain gated. Browser submission tests mock their endpoints;
  no customer enquiry or email was sent. No deployment was performed.
- Lighthouse passes its configured aggregate gate, with FCP warnings. The Serbian
  homepage median LCP is about 2.64s; individual samples do not all meet 2.5s.
  See the per-URL results and interpretation in verification.json.
- WebKit cannot launch here because required system libraries are unavailable.
  Chromium/Firefox results and AI screenshot review are distinguished in evidence.
- The dependency audit reports 16 existing advisories: 1 critical, 6 high, 6 moderate
  and 3 low. The critical advisory is Astro AVIF image-optimization RCE,
  [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2).
  The repository's dependency-audit command is nonblocking. A successful release
  command therefore does not mean the dependency audit is clean. Package upgrades
  and deployment exposure need a separate dependency-maintenance review; this task
  changed no dependency or lockfile.

## Authority and validation

Applied root `AGENTS.md`, `DESIGN.md`, content-authoring/language references, locked
page contracts and verified operational data. Procedures used: content-quality-review,
technical-seo, structured-data, multilingual-routing, design-governance,
design-foundation-governance, technical-page-review, accessibility-wcag,
responsive-ui, responsive-images-performance, and tailwind-v4 for the measured
homepage animation defect. Command results and manual visual review scope are
recorded in `verification.json`; no check is inferred from a different site's build.
