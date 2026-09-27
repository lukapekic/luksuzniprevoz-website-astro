# Content and SEO Finalization SPEC

- **Status:** TODO — investigation complete; implementation has not started
- **Created:** 27 September 2026
- **Target:** `site/luksuzni-prevoz/`
- **Locales:** Serbian Latin (`sr-Latn`, source), English (`en`), Russian (`ru`)
- **Implementation branch:** current working branch

## 1. Purpose

This specification preserves the findings of the final content, translation,
technical SEO, structured-data, competition-research, and release-workflow
investigation. It defines the remaining implementation work and acceptance
criteria without silently treating the investigation itself as implementation.

All work in this document is **TODO** unless a finding is explicitly labelled as
an already verified baseline.

Route, redirect, sitemap-discovery, robots, canonical-host, and production
crawlability remediation is being implemented by a separate agent. Those items
remain documented here because they affect SEO acceptance, but must not be
implemented a second time from this specification. See section 6.

## 2. Authority and evidence

Implementation must follow, in order:

1. root `AGENTS.md`;
2. `docs/content-authoring.md`;
3. page blueprints and content contracts;
4. verified `site/luksuzni-prevoz/src/data/*` facts;
5. `.skills/content-quality-review.md`;
6. `.skills/technical-page-review.md`;
7. `.skills/technical-seo.md`;
8. `.skills/structured-data.md`;
9. `.skills/multilingual-routing.md`;
10. the current implementation and this plan.

Investigation inputs include:

- all 45 localized page entries under `src/content/pages/`;
- all localized UI dictionaries;
- route, navigation, business, contact, pricing, service, fleet, and media data;
- the rendered production build;
- the live production domain and representative redirects/404 responses;
- current SEO research configuration and its September 2026 evidence;
- GitHub quality/release/deep-check workflows;
- `/home/pekula/Projects/private/astro-foundation` at its inspected 1.0.0
  platform contract;
- current official Google Search and Bing Webmaster documentation.

## 3. Verified baseline

The following are baseline facts, not TODO claims:

- There are 15 route families and 45 localized Markdown entries.
- There are 42 intended indexable localized URLs.
- The three Booking URLs are intentionally `noindex, follow` and excluded from
  the sitemap.
- All page entries are currently `published` and carry reviewed translation
  lifecycle metadata.
- Serbian is the source locale; English and Russian entries carry matching
  source digests.
- The inspected build has exactly one H1 per route/locale and no heading-level
  skips.
- No inspected internal route link is broken.
- No inspected content image is missing `alt`, width, or height.
- Absolute self-canonicals are correct on the 42 indexable pages.
- Reciprocal `sr-Latn`, `en`, `ru`, and `x-default` annotations are correct on
  indexable pages and in the sitemap.
- JSON-LD parsed successfully on all inspected pages.
- Localized 404 documents carry `noindex, follow`, and live unknown URLs return
  HTTP 404.
- HTTP to HTTPS, `www` to apex, slash normalization, and sampled legacy 301s
  behaved correctly during investigation.
- Content similarity is low overall. The most important differentiation review
  remains hub versus leaf intent, not wholesale duplicate-content rewriting.

Read-only validators run during investigation:

```text
pnpm content:validate site/luksuzni-prevoz --json     passed
pnpm routes:validate site/luksuzni-prevoz --json      passed
pnpm seo:validate site/luksuzni-prevoz --json         passed: 45/45
pnpm --silent seo:research validate-config --project site/luksuzni-prevoz
                                                       passed: 14 targets
```

`seo:validate` emitted one warning for the Serbian homepage because the authored
title contains `Luksuzni prevoz`, which is both the public brand and the natural
service phrase. This is not a justification to weaken the title. The validator
should distinguish intentional brand/phrase overlap from a duplicated suffix.

## 4. Completion objective

The final result must provide:

- owner/native-reviewed Serbian source content;
- independently reviewed English and Russian meaning, terminology, and search
  intent;
- a closed content-review ledger on the current integrated build;
- evidence-backed page differentiation and internal linking;
- complete, truthful head and structured-data output;
- approved legal/privacy/consent content where capabilities require it;
- an improved multilingual competition-research process;
- a selectively upgraded foundation/release workflow;
- reproducible automated and manual release evidence;
- post-release measurement through first-party search data.

The completion objective is not a larger word count, exact-match repetition,
automatic publication of AI output, or copying competitor claims.

## 5. Priority summary

| ID    | Priority                         | Status                | Workstream           | Required result                                                                                               |
| ----- | -------------------------------- | --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| RC-01 | P0                               | TODO — parallel agent | Routes/crawl         | Production crawlability and route migration remain correct and release-validated.                             |
| CT-01 | P0                               | TODO                  | Content governance   | Close the stale integrated content-review checkpoint on the current clean worktree.                           |
| LG-01 | P0 before forms/analytics launch | TODO                  | Legal/privacy        | Resolve the mismatch between declared legal/consent capabilities and missing public legal surfaces.           |
| RS-01 | P1                               | TODO                  | Release foundation   | Selectively port workspace, manifest, artifact-validation, and security improvements from the new foundation. |
| HD-01 | P1                               | TODO                  | Head/social          | Replace the WebP-only favicon and correct default social-image metadata.                                      |
| SD-01 | P1                               | TODO                  | Structured data      | Reassess FAQPage and enrich the single verified business entity only with approved facts.                     |
| CR-01 | P1                               | TODO                  | Competition research | Add first-party data, mobile/local evidence, multilingual query coverage, and an actual comparison/gap layer. |
| TR-01 | P1                               | TODO                  | Translation          | Obtain truthful Serbian/English/Russian final review and synchronize digests only afterward.                  |
| NC-01 | P2                               | TODO after evidence   | New content          | Generate legal/trust pages and only research-qualified service/destination pages.                             |
| PM-01 | P2                               | TODO                  | Measurement          | Establish Search Console, Bing, Business Profile, and Core Web Vitals monitoring.                             |

## 6. Parallel route and crawlability track

- **Implementation owner:** separate agent
- **Status:** TODO in that workstream; do not duplicate here

The investigation observed that the live production `robots.txt` returned:

```text
User-agent: *
Disallow: /
```

The source requires `PROD_ROBOTS=1` for a production build, while the documented
Cloudflare Pages build command did not set that production variable. The live
sitemap and content pages were available, but compliant crawlers were denied.
Search results still exposed cached WordPress-era snippets and URLs at the time
of investigation.

The parallel implementation must own all of the following:

- production versus Preview robots behavior;
- the Cloudflare Production environment/build contract;
- robots-to-sitemap references;
- route availability and localized route parity;
- sitemap discovery/output and any accurate `lastmod` decision;
- legacy redirect generation and direct-hop validation;
- canonical host and trailing-slash normalization;
- live Search Console URL/sitemap submission related to the route migration;
- deployment artifact checks that cover the above.

This specification's later content and SEO acceptance depends on that track,
but must merge around it rather than reimplement it.

## 7. Foundation 1.0.0 reuse plan

### RS-01 — Bootstrap product-specific workspace metadata

**Status:** TODO

Create product-specific equivalents of the newer foundation's:

- `foundation.workspace.json`;
- `foundation.platform.json` ownership/compatibility contract;
- workspace validation;
- conflict-safe foundation manifest checks.

The product values must identify:

- `site/luksuzni-prevoz`;
- `@luksuzni-prevoz/site`;
- production branch `master`;
- production URL mode;
- redirects enabled;
- the custom `packages/seo-research` and form runtime as retained product
  extensions.

Do not copy the reference site's paths, package name, branch, or generated
hashes. Do not run `foundation:sync` until a product-specific manifest has been
reviewed and the ownership boundaries are correct.

### RS-02 — Port release-safety infrastructure selectively

**Status:** TODO

Port/adapt:

- workspace-aware project resolution;
- release-mode foundation doctor;
- deployment artifact validation;
- security-header validation;
- workspace contract tests;
- complete Git history in governance-sensitive GitHub workflows;
- truthful `quality:fast` PR behavior;
- check-only generated-contract behavior in CI.

The route/crawl parts of deployment validation belong to the parallel track.
The remaining validator must also confirm the built `_headers`, required assets,
and relevant non-route production artifacts.

### RS-03 — Preserve stronger product implementations

**Status:** TODO verification item

Do not replace the current product `Page.astro`, SEO builders, or content
validators with the reference versions. Preserve:

- safe JSON-LD serialization;
- default OG and Twitter metadata;
- localized OG locale and alt text;
- current `noindex, follow` behavior;
- font/LCP controls;
- product route-availability and atomic locale rules;
- the custom SEO research package.

The newer reference `Page.astro` uses raw `JSON.stringify`, lacks the product's
default social/favicons behavior, and uses `noindex, nofollow`. It is not an
upgrade for this site.

### RS-04 — Enforce production security policy

**Status:** TODO

The live header was still `Content-Security-Policy-Report-Only` during the
investigation. Review actual violations and then ship an enforcing policy that
supports only the required Astro assets, Turnstile endpoints, forms, and any
approved consent-gated analytics. Preserve HSTS, `nosniff`, Referrer Policy,
Permissions Policy, `frame-ancestors`, `base-uri`, and `form-action` protections.

## 8. Content finalization

### CT-01 — Close the active review ledger

**Status:** TODO

`src/docs/content-review/serbian-review-status.json` reports that all 15 Serbian
pages were applied and reviewed in a frozen browser build, but it still marks
all 15 pages blocked because final integrated verification was interrupted by
concurrent theme/governance work.

The current worktree was clean during this investigation. Resume the documented
workflow rather than starting another rewrite:

1. inspect current authority and generated contracts;
2. rebuild from the current worktree;
3. run the pending exact content/UI verification profiles;
4. repeat the integrated rendered/browser review;
5. update the ledger truthfully;
6. retain historical frozen-build evidence as history, not current acceptance.

### CT-02 — Final source-language review

**Status:** TODO

Perform an owner or independent native Serbian Latin/Ekavian review of the
composed pages. Review in this order:

1. Fleet, Pricing, Booking, Contact;
2. Private Chauffeur, Airport;
3. Corporate, Delegation, Conference/Congress, then Business hub;
4. Wedding, Prom, VIP, then Special Events hub;
5. Homepage last.

For each page review:

- intended user task and unique route purpose;
- grammar, case government, agreement, aspect, word order, and formal plural
  voice;
- owner terminology (`kombi`, `raspored`, `e-mail`, canonical model names);
- factual support for every operational/commercial statement;
- CTA truth: sending a request is not booking confirmation;
- pricing and availability qualifications;
- adjacent and cross-page repetition;
- heading usefulness and rendered wrapping;
- title, description, H1, internal links, alt text, and structured-data parity.

### CT-03 — Maintain a claim ledger

**Status:** TODO

Create a review artifact mapping material claims to their authority. At minimum
cover:

- prices, taxes, inclusions, waiting, kilometres, and duration;
- passenger/luggage capacities;
- named vehicle/model availability;
- airport flight tracking, greeting, parking, and terminal access;
- driver dress, training, languages, discretion, and coordination;
- response hours and any response-time promise;
- cancellation/refund/change behavior;
- recurring corporate invoicing and negotiated terms;
- NDA or confidentiality conditions;
- review/profile ownership;
- legal identity and relationships between public brands.

Unverified facts remain gated. Do not weaken a gate to complete prose.

### CT-04 — Resolve route-intent overlap editorially

**Status:** TODO

Explicitly test these page pairs/groups for cannibalization and duplicated
decision support:

- Home versus Private Chauffeur;
- Fleet versus Pricing;
- Business hub versus Corporate, Delegation, and Conference;
- Special Events hub versus Wedding, Prom, and VIP.

Hubs must help users choose; leaves must answer the concrete service task.
Retain repeated manual-confirmation language only where it guards a materially
different user decision.

### CT-05 — Review shared FAQs

**Status:** TODO

Several routes repeat the same booking-confirmation answer. Preserve it where
needed for conversion accuracy, but consider deriving invariant operational
answers from one approved content/data source. Do not add questions merely to
increase FAQ count or schema volume.

## 9. Translation finalization

### TR-01 — Serbian-first atomic workflow

**Status:** TODO

For every accepted Serbian change:

1. approve the final Serbian field in composed-page context;
2. review English and Russian meaning against that final source;
3. use natural locale terminology rather than matching Serbian syntax;
4. recheck title/H1/query intent independently per locale;
5. synchronize source digests only after review;
6. release all configured locales atomically.

Do not use the current `translationState: reviewed` value as proof of native
certification. Record the reviewer/method accurately.

### TR-02 — English review focus

**Status:** TODO

Check:

- chauffeur versus driver versus transport terminology;
- UK/international English consistency;
- airport, corporate, delegation, conference, wedding, prom, and VIP query
  intent;
- natural CTAs and booking/request language;
- avoidance of imported guarantees and inflated luxury adjectives.

### TR-03 — Russian review focus

**Status:** TODO

Check:

- chauffeur/driver service versus self-drive rental ambiguity;
- `трансфер`, `автомобиль с водителем`, and `личный водитель` by task;
- case/agreement and idiomatic service phrasing;
- airport and business terminology;
- natural localized titles rather than exact-phrase insertion.

## 10. New content generation

### NC-01 — Legal/privacy/consent pages

**Status:** TODO — requires owner/legal input

The configuration declares `legalPages: true`, `consentBanner: true`, and lazy
Google Tag Manager analytics, but no legal routes or production consent surface
exist. Forms also process personal data through Turnstile, D1, and Brevo.

Decide and create the required SR/EN/RU content for:

- privacy notice;
- booking/service terms or conditions;
- cookie/analytics notice and preference management if non-essential tracking
  is enabled.

This specification does not invent jurisdiction-specific legal copy. Until
approved content and controls exist, non-essential analytics must remain blocked
and capability declarations must not imply a completed implementation.

### NC-02 — Company/About trust page

**Status:** TODO — conditional recommendation

Create a localized company page if the owner can approve enough verifiable
information about:

- public and legal identity;
- relationship to Grand Solution or other related brands;
- operating history and service expertise;
- team/coordination model;
- office and verified contact/profile information.

Do not recreate an About page solely to preserve an obsolete URL or manufacture
E-E-A-T signals. The page must provide real user trust value.

### NC-03 — Destination/intercity content

**Status:** TODO only after search and operational evidence

Potential topics include an intercity hub and individually proven routes such as
Belgrade–Novi Sad, Budapest, Zagreb, Kopaonik, or Zlatibor. Generate a page only
when all are true:

- first-party or controlled SERP evidence shows distinct intent;
- the service and commercial model are verified;
- the page can provide unique decision support;
- it will not cannibalize Private Chauffeur;
- internal links have a defensible location;
- SR/EN/RU can be reviewed and published together.

### NC-04 — Generation procedure

**Status:** TODO process requirement

Every approved new route must use this sequence:

1. intent brief and claim ledger;
2. route/locale/slug decision by the route owner;
3. blueprint or content contract;
4. non-published SR/EN/RU scaffolds with no silent fallback;
5. Serbian authoring and approval;
6. English/Russian translation and independent review;
7. lifecycle/digest synchronization;
8. atomic publication;
9. navigation/internal-link integration only where justified;
10. rendered head/schema/accessibility/responsive verification.

## 11. Head and social metadata

### HD-01 — Search-compatible favicon

**Status:** TODO

The current head emits only a WebP favicon. Google Search's documented supported
favicon formats do not include WebP. Provide a stable crawlable PNG and/or ICO
favicon, square and at least 48×48 for normal quality. Keep an Apple touch icon
where appropriate. Verify the live content type, status, robots access, and
stable URL.

Reference:
<https://developers.google.com/search/docs/appearance/favicon-in-search>

### HD-02 — Default share image

**Status:** TODO

The default share image is currently 1047×796 and every page uses it. Built pages
omit `og:image:width` and `og:image:height` because dimensions are emitted only
for page-specific frontmatter images.

Create an approved 1200×630 default share asset and ensure that the resolved
default—not only frontmatter overrides—emits:

- absolute `og:image`;
- width and height;
- localized `og:image:alt`;
- matching Twitter image metadata.

Optionally add `og:locale:alternate` for the other published language versions.
This is primarily share-preview quality, not a claim of direct ranking benefit.

### HD-03 — Validate rendered head output

**Status:** TODO

Extend final built-output checks so they inspect actual emitted HTML rather than
only synthesized/frontmatter SEO models. Cover:

- title and description;
- canonical and robots;
- complete reciprocal hreflang;
- OG/Twitter URL, image, dimensions, and alt;
- favicon presence/format;
- JSON-LD parsing and types;
- exactly one H1;
- localized 404 noindex behavior.

## 12. Structured data

### SD-01 — Retire FAQPage as a Google feature

**Status:** TODO decision

Google stopped showing FAQ rich results on 7 May 2026 and subsequently removed
the feature documentation. Keep visible FAQs where they help customers. Either:

- remove `FAQPage` from the declared Google-focused capability and emitted
  schema; or
- document that it is retained only as general Schema.org semantics, with no
  Google rich-result or ranking claim.

Reference: <https://developers.google.com/search/updates>

### SD-02 — Preserve one business entity

**Status:** TODO review

Keep the stable `/#organization` entity and do not emit a competing duplicate
Organization node. `LocalBusiness` is already an Organization subtype. Consider
adding to the same entity only when verified and publicly approved:

- crawlable logo;
- official Google Business Profile or social `sameAs` URLs;
- `legalName` if the legal/public-brand relationship is clear;
- tax/legal identifiers if publication is appropriate;
- verified geo or service-area details.

Do not add ratings, aggregate ratings, offers, prices, availability, service
areas, amenities, or a more specific subtype without evidence and eligibility.

References:

- <https://developers.google.com/search/docs/appearance/structured-data/local-business>
- <https://developers.google.com/search/docs/appearance/structured-data/organization>

### SD-03 — WebSite/site-name review

**Status:** TODO

Keep `WebSite` on the homepage. Verify whether the business has a distinctive,
consistently used `alternateName`; `Luksuzni prevoz` is also a generic Serbian
service phrase. Do not invent or rebrand the business for a schema field.

## 13. Competition and keyword research

### CR-01 — Start with first-party search data

**Status:** TODO — requires account access/export

Export 12–16 months of Google Search Console data by:

- query;
- page;
- country;
- device;
- impressions;
- clicks;
- CTR;
- average position.

Map each query to its intended route and locale. Flag:

- legacy URLs still receiving impressions;
- homepage ranking for a leaf intent;
- multiple current routes competing for one query cluster;
- high-impression/low-CTR pages;
- useful queries with no suitable landing page.

Also capture Bing Webmaster Tools and Google Business Profile visibility where
access exists. Local results must be reviewed separately from ordinary organic
results.

### CR-02 — Refresh controlled multilingual SERPs

**Status:** TODO

The existing September 2026 Serbian research remains the baseline. Refresh in
bounded batches, preserving exact:

- date/time;
- language;
- country and Belgrade location;
- device;
- Google domain;
- returned result type and ranking URL.

The current config has 14 routes × 3 locales but permits only 12 queries per
run. Split runs within that budget instead of bypassing it. Add mobile samples
for the commercially most important clusters.

### CR-03 — Improve target definitions

**Status:** TODO

Each locale/route target should contain:

- one primary task hypothesis;
- natural secondary phrases;
- user questions;
- named entities;
- ambiguity/exclusion notes;
- intended landing page and neighboring routes.

Exact-match findings remain human review signals. Serbian cases/prepositions,
English synonyms, and Russian morphology outrank raw keyword order.

### CR-04 — Update competitor coverage

**Status:** TODO

Retain the existing configured competitor set, subject to current validation.
A point-in-time public search spot check also surfaced potential comparators not
present in the configuration:

- AirGo;
- Premium Mobility;
- Premier Limo;
- Beo Limo;
- Regent Fleet;
- EV-olution/Transfer Belgrade.

Validate whether each is a direct comparator for the target intent. Add sitemap
URLs and tracked route patterns where available and robots-compliant; otherwise
configured competitor names do not cause stable proactive collection.

Continue treating Grand Solutions and `transferi.rs` as ownership/relationship-
sensitive references rather than automatically independent competitors.

### CR-05 — Add a real comparison/gap layer

**Status:** TODO

The current package collects competitor pages and adds them as evidence, but it
does not calculate competitor content gaps. Add a deterministic comparison
report or perform the equivalent reviewed analysis covering:

- title/H1/task alignment;
- route taxonomy and depth;
- pricing and inclusion clarity;
- booking friction and confirmation language;
- fleet/passenger/luggage decision support;
- airport procedure detail;
- business/local trust information;
- supported languages;
- visible questions and objections;
- structured data and technical behavior;
- claims that are unusable because they are unverified or provider-specific.

The report must distinguish observable evidence from inference and must never
convert competitor claims into product facts.

### CR-06 — Research deliverables

**Status:** TODO

Produce versioned artifacts for:

- multilingual keyword/intent map;
- SERP snapshot and query ledger;
- competitor route inventory;
- route-by-route comparison matrix;
- own-site cannibalization report;
- content gap list ranked by user/conversion value;
- explicit keep/refine/consolidate/create/reject decisions;
- post-release measurement baseline.

No research command may write directly to production content. Suggestions remain
digest-bound and require human review.

## 14. Final SEO application order

**Status:** TODO

Apply SEO changes only after the route/crawl track is stable and the visible
content is approved:

1. merge/reconcile the parallel route/crawl implementation;
2. port the selected release-safety foundation changes;
3. resolve legal/privacy/consent scope;
4. close Serbian integrated review;
5. approve English and Russian translations;
6. finish competition/query research;
7. update visible copy and internal links where evidence supports it;
8. finalize titles, descriptions, H1s, and alt text;
9. implement favicon and share-image corrections;
10. apply structured-data decisions;
11. rebuild and inspect actual output;
12. deploy and complete live acceptance;
13. request recrawl/submit sitemap through the route/crawl owner;
14. monitor at approximately 2, 4, 8, and 12 weeks.

Do not create mass location pages, target a preferred word count, add meta
keywords, create `llms.txt` for Google visibility, or add unsupported schema.

## 15. Acceptance criteria

### Content and localization

- [ ] All 15 existing route families have an accepted Serbian source review.
- [ ] English and Russian are independently reviewed for natural meaning and
      search intent.
- [ ] Translation digests match only after review.
- [ ] No silent locale fallback exists.
- [ ] Hub and leaf route purposes are distinguishable.
- [ ] Every material claim has a verified source or remains gated.
- [ ] Booking/contact CTAs never imply automatic confirmation.
- [ ] The active content-review ledger is complete on the current build.

### Head and structured data

- [ ] Every indexable page has one useful localized title, description, and H1.
- [ ] Actual rendered canonical/robots/hreflang output passes.
- [ ] A supported, stable favicon is emitted and crawlable.
- [ ] Default OG/Twitter image is approved and declares dimensions/alt.
- [ ] JSON-LD safely serializes and matches visible/verified facts.
- [ ] FAQPage retention/removal is explicitly decided.
- [ ] The business entity remains singular and uses only verified properties.

### New content

- [ ] Legal/privacy/consent route requirements are decided with qualified input.
- [ ] Required legal content exists in all configured locales before dependent
      capabilities are enabled.
- [ ] About/destination pages are generated only after their decision gates pass.
- [ ] New routes publish atomically across SR/EN/RU.

### Research

- [ ] Search Console query/page/device/country data is mapped to route intent.
- [ ] Serbian, English, and Russian SERPs have current controlled snapshots.
- [ ] Important mobile/local results are reviewed.
- [ ] Competitor coverage reflects the current result set.
- [ ] A comparison/gap report exists; raw competitor collection alone is not
      treated as the conclusion.
- [ ] Every proposed content/SEO change cites evidence and a target route.

### Release and live verification

- [ ] Parallel route/crawl work has passed its own acceptance and is merged.
- [ ] Product-specific workspace/platform contracts pass.
- [ ] Deployment and security artifact validators pass.
- [ ] CSP is enforcing without breaking required assets/forms.
- [ ] Responsive review covers 320, 768, 1024, 1440, and 1920 CSS px plus
      enlarged text.
- [ ] Accessibility, E2E, and Lighthouse checks pass.
- [ ] Live Search Console/Business Profile checks are recorded separately from
      repository automation.

Core Web Vitals field targets:

- LCP at or below 2.5 seconds;
- INP at or below 200 milliseconds;
- CLS at or below 0.1;
- evaluated at the 75th percentile for mobile and desktop.

Reference:
<https://developers.google.com/search/docs/appearance/core-web-vitals>

## 16. Required verification commands

Run the smallest applicable profiles during implementation, then the complete
release set before final handoff. Exact commands may be upgraded by the
foundation migration, but must include equivalent coverage:

```bash
pnpm quality:prepare
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm test:a11y
pnpm test:lighthouse
pnpm quality:release
```

Production artifact verification must build with the production robots contract;
Preview verification must prove the inverse. Do not claim the release gate
passed unless it ran successfully on the final integrated worktree.

## 17. External references

- Helpful, reliable, people-first content:
  <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- Localized versions and hreflang:
  <https://developers.google.com/search/docs/specialty/international/localized-versions>
- Canonicalization:
  <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Noindex and robots interaction:
  <https://developers.google.com/search/docs/crawling-indexing/block-indexing>
- Sitemap construction and `lastmod`:
  <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Title links:
  <https://developers.google.com/search/docs/appearance/title-link>
- Search snippets and meta descriptions:
  <https://developers.google.com/search/docs/appearance/snippet>
- Favicon requirements:
  <https://developers.google.com/search/docs/appearance/favicon-in-search>
- LocalBusiness structured data:
  <https://developers.google.com/search/docs/appearance/structured-data/local-business>
- Organization structured data:
  <https://developers.google.com/search/docs/appearance/structured-data/organization>
- Google Search documentation updates and FAQ retirement:
  <https://developers.google.com/search/updates>
- Requesting recrawl:
  <https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl>
- Local Business Profile visibility:
  <https://support.google.com/business/answer/7091>
- Bing sitemap guidance:
  <https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed>

## 18. Implementation handoff rule

Before starting a TODO, record its owner and exact files. After completing it,
record commands and evidence rather than changing the top-level specification
to “done” based only on code presence. The specification is complete only when
all accepted TODOs are implemented, rejected with a documented decision, or
transferred to a named external owner with acceptance evidence.
