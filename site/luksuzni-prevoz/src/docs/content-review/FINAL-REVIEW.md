# Content and SEO final review — 12 September 2026

> **Active review — 13 September 2026:** Start with [SERBIAN-REVIEW-WORKFLOW.md](SERBIAN-REVIEW-WORKFLOW.md) and [serbian-review-status.json](serbian-review-status.json). They track the renewed browser-first Serbian pass. The earlier results below are historical; their approval pauses are not active.

All 15 route families now have reviewed Serbian Latin, English and Russian
content: 45 localized page entries plus the shared UI and navigation dictionaries.
This is ready for the owner's final manual editorial review.

## Release state

- All page families are `published` in all three locales.
- Corporate Transportation and Conference/Congress Transportation were activated
  atomically in the route map and content lifecycle.
- The 42 indexable localized URLs are present in the sitemap.
- Booking remains deliberately `noindex, follow` and absent from the sitemap in
  all three locales.
- The production build emits 49 pages, including locale 404 pages and the
  development UI route.

## Editorial result

The Serbian pass uses contemporary standard Serbian Latin in the Ekavian form,
formal plural address, natural case government and agreement, and direct Serbian
verbs instead of translated constructions such as `usluga podržava` and `kroz
ponudu`. Customer-facing terminology now consistently uses `kombi`, `kombi
vozilo`, `limuzina`, `raspored`, `e-mail` and `e-mail adresa`. `Itinerer`, Serbian
`vanovi`, English `Private Chauffeur` labels and generic station terminology were
removed from production Serbian copy.

The complete language policy, normative distinctions and sources are in
[serbian-language-reference.md](serbian-language-reference.md). The `e-mail`
spelling is an explicit owner-approved house-style exception; the reference notes
the contemporary normative preference for `imejl`/`mejl`.

English and Russian were reviewed after the Serbian source pass. Translation
digests were synchronized only after that review. The Russian pass also corrected
agreement errors and replaced literal calques with idiomatic service language.

## SEO result

Every indexable page has a unique intent-led title and description. Built pages
include absolute self-canonicals, reciprocal `sr-Latn`/`en`/`ru` hreflang links,
an `x-default` Serbian URL, localized Open Graph data, and relevant LocalBusiness,
BreadcrumbList and visible FAQPage structured data. The sitemap contains exactly
42 localized indexable URLs and excludes all three Booking URLs.

The content follows Google's people-first guidance: it describes verified service
scope, passenger needs, vehicle choices, pricing behavior and the actual next step
without invented guarantees or keyword repetition. Metadata remains a concise
page summary rather than a list of search phrases.

A fresh Serbian-only ValueSERP sweep on 12 September covered all 14 indexable
Serbian route targets: 16 requests including two successful retries, 14 final
SERPs and 42 bounded competitor-page observations. The current WordPress
sitemaps exposed 38 legacy URLs. Thirty-three equivalent URLs now map through
the route source of truth to direct 301 destinations; two URLs remain unchanged,
and the unrelated News/About URLs remain intentionally unmapped. The complete
method, results, content decisions, redirect rationale and evidence limitations
are in [seo-market-research-2026-09-12.md](seo-market-research-2026-09-12.md).

The research also produced four focused Serbian changes: `Lični vozač`,
`Poslovni prevoz putnika`, `Vozni park limo servisa` and `Cenovnik limo
servisa`. Natural Serbian case forms were preserved even when raw queries omit
prepositions.

## Verification

Final successful checks:

- `pnpm routes:validate site/luksuzni-prevoz`
- `pnpm content:validate site/luksuzni-prevoz`
- `pnpm seo:validate site/luksuzni-prevoz` — 45/45 files
- `pnpm --filter @luksuzni-prevoz/site check` — 0 errors, 6 existing hints
- `pnpm --filter @luksuzni-prevoz/site build` — 49 pages
- `pnpm test:unit` — 427 tests passed
- isolated `routing-content` governance profiles for the two newly activated
  routes, Business hub, Private Chauffeur, Fleet, Pricing and the route map
- rendered inspection of canonical, hreflang, noindex, JSON-LD, robots and sitemap
- `pnpm generate:redirects site/luksuzni-prevoz --format=cloudflare` — 33 direct
  301 rules generated from the route map
- `pnpm quality:release` — passed; its nonblocking production-dependency audit
  reported the 16 pre-existing advisories itemized below

The first parallel governance attempt caused Astro loader interference. It was
not accepted as evidence; the affected critical profiles were rerun in isolation.

## Remaining external release items

Migration update (2026-09-25): `/news/` and `/o-nama/` now redirect to `/`,
and `/en/about-us/` redirects to `/en/` per the owner's instruction. The current
Cloudflare build generates 72 rules from 36 legacy paths; the 33-rule verification
record above describes the earlier review.

- Production deployment must set `PROD_ROBOTS=1`; local builds intentionally
  disallow crawling by default.
- The selected host/deployment pipeline must generate and publish the supported
  redirect format from `previousSlugs`; the repository verification used the
  Cloudflare format without assuming the final hosting provider.
- Live contact/booking delivery still depends on deployment secrets and provider
  configuration.
- Unverified review, map, luggage-capacity and Škoda Kodiaq capacity/pricing facts
  remain behind the existing data gates and were not invented.
- The nonblocking dependency audit reports 16 existing advisories (1 critical,
  6 high, 6 moderate and 3 low). Dependency upgrades are a separate maintenance
  task; this content/SEO change does not modify packages or the lockfile.
- No deployment was performed by this content/SEO task.

## Owner review path

Review the Serbian pages first, then compare English and Russian meaning. For SEO,
start with [metadata-map.json](metadata-map.json), [keyword-map.json](keyword-map.json),
[seo-market-research-2026-09-12.md](seo-market-research-2026-09-12.md) and the
built sitemap. Any owner correction should be applied to Serbian first,
then propagated to translations and followed by `content:sync-digests` and the
same validators.
