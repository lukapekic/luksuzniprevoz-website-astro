# Implemented SEO and final editorial decisions

## Metadata and content

All 15 route families have independent Serbian, English and Russian SEO titles
and descriptions. The content field supplies the page topic; `Page` appends the
configured brand once. Removed manually appended brand suffixes that previously
produced doubled branding. Titles describe service, location or task rather than
repeating superlatives. Character length is a review signal, not a promise about
Google's displayed title. [Google title guidance](https://developers.google.com/search/docs/appearance/title-link)

Descriptions explain scope and a useful next step. They are unique across pages
and aligned with visible content; Google can choose a different passage for a
query. [Google snippet guidance](https://developers.google.com/search/docs/appearance/snippet)

The post-research content upgrade makes the homepage's chauffeur offer explicit,
names Nikola Tesla Airport in airport copy, clarifies per-vehicle fares and
waiting, separates business-family purposes and improves Russian phrasing.
Wedding/prom text identifies chauffeur-driven vehicles rather than implying a
stretch limousine or self-drive product. No price, policy, review, ranking claim,
new location page or unsupported vehicle specification was imported.

## Technical implementation

- Route-derived canonical and reciprocal locale alternates remain absolute and
  retain Serbian Latin plus x-default. Route-level noindex and scaffold status
  now apply defensively even if a caller omits the content flag.
- Booking remains noindex and outside the sitemap. Corporate and Conference/
  Congress are now published and indexable in all three locales after their
  content, route and renderer gates passed.
- Public navigation now links all three live Business child services. Layout,
  order and canonical service relationships remain unchanged.
- Shared typed builders supply LocalBusiness from verified contact/business facts,
  WebSite on the homepage, route-derived BreadcrumbList elsewhere, and FAQPage
  where the same questions and answers are visible. No fabricated ratings,
  reviews, offers, aggregate prices, service availability, or legal identity.
- Every emitted document carries `https://schema.org` context and is validated
  against declared capabilities. The business has one stable entity identifier;
  no duplicate Organization node is emitted alongside its LocalBusiness node.
- JSON-LD escapes HTML parser delimiters to prevent authored text from ending its
  script element. The head owner supplies absolute existing share imagery, OG
  locale/site identity and Twitter card fields. No new dependency or client JS.
- The airport's waiting FAQ resolves the typed minutes value once for both visible
  copy and JSON-LD. Postal locality/country and institutional names have localized
  display text while canonical identities and verification gates remain.

Structured data must reflect real visible content; successful validation does
not establish factual eligibility or guarantee a rich result.
[Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

Google stopped showing FAQ rich results on 7 May 2026. Existing FAQPage is retained
as valid descriptive Schema.org markup tied to the visible FAQs, with no Google
rich-result or ranking benefit claimed. The current official change log supersedes
the older government/health-only eligibility advice.
[Google FAQ retirement](https://developers.google.com/search/updates#removing-faq-rich-result)

## Review and remaining business inputs

Review is delegated AI editorial review, not a native-speaker or owner sign-off.
Unverified Kodiaq passenger capacity/pricing, unsupported luggage counts and
unverified maps/review data remain gated. Existing booking/contact transport
activation still requires real deployment configuration; no customer enquiry was
sent during this work. No unsupported reply-time promise, 24/7 support claim,
instant booking guarantee or security service has been introduced.


## Additional defects found by built-output review

The site had no sitemap output even though production robots.txt referenced one.
It now generates `sitemap-index.xml` and `sitemap-pages.xml` statically from
published, indexable content and route entries. The sitemap carries reciprocal
locale links and x-default, and excludes booking, drafts, noindex content and
dev previews. No fabricated lastmod date is emitted. Preview robots remain
Disallow-all; production requires the existing `PROD_ROBOTS=1` setting.

The shared LocalBusiness builder gains an optional, validated opening-hours
field. This is an additive API change: callers that omit it retain the exact
previous output. The site supplies its verified daily office hours from
contact.ts. These are office hours, not a claim of 24/7 transport support.
[Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business)

Final title review shortened verbose qualifiers to keep the composed title
within the repository's 60-character guidance. The existing title helper avoids
appending the brand when the Serbian homepage title already contains it.

## Rendered final content pass

Shortened the homepage H1 independently in each language to state the chauffeur
service and, where natural, Belgrade. The Russian Fleet H1 is now `Автопарк с
водителем`, avoiding an awkward split in a long adjective at the desktop display
size. The supporting paragraphs retain professional service context. This is
copy refinement within the locked layout, not a new typography rule.

The final offline/built research flags exact phrase matching and the brand name
missing from raw content fields. Cases, prepositions and synonyms are intentional;
shared components provide visible brand identity. Preserve natural language and
record these heuristic dispositions rather than repeating phrases to clear them.

The LocalBusiness call omits the shared builder's optional `locale` argument so
that the physical business node does not emit `inLanguage`. WebSite retains it;
entity descriptions and addresses are still localized. Schema.org lists
`inLanguage` for content/performance/action types, not LocalBusiness.
[Schema.org inLanguage](https://schema.org/inLanguage)

## Homepage loading priority

The first full Lighthouse audit passed category thresholds but failed the stricter
2.5-second LCP budget on Serbian/Russian homepages. HomePage now uses Page's existing
`preloadFonts={false}` option for an image-led LCP. This removes competing font
preload hints; font faces, semantic typography, image quality, layout and all
performance thresholds remain unchanged. The isolated Russian probe improved LCP
from about 2.785 seconds to 1.529 seconds, with all four standard categories at 100.
The final six-URL, three-run-per-URL audit is recorded in verification.json.

## Fresh Serbian SERP and legacy migration pass — 12 September 2026

The configured ValueSERP runner completed all 14 Serbian indexable targets in a
single current market snapshot. Two initial provider failures were retried once;
the final result is 14/14 successful target reports and 42 bounded competitor
page observations. The cumulative ledger is 58 attempts against the ceiling of
60. The ignored `.env` key was loaded only into the process environment and is
absent from reports and build output.

Search intent supported four narrow Serbian refinements: `Lični vozač` reduces
employment-query ambiguity, `Poslovni prevoz putnika` distinguishes passenger
service from freight, and Fleet/Pricing use the observed `limo servis` task
language. The exact-match analyzer's complaints about `u Beogradu` remain
disposed as false positives: Serbian grammar outranks raw keyword order.

The outgoing WordPress sitemaps contain 38 unique page/post URLs. The route map
now owns 33 direct previous-slug mappings, including the legacy Corporate URL
observed at position 1 and Pricing URL observed at position 9. Root and the
English Corporate URL remain unchanged. News and Serbian/English About URLs have
no equivalent and are deliberately not redirected to an irrelevant page.

See [seo-market-research-2026-09-12.md](seo-market-research-2026-09-12.md) for
the query table, competitor patterns, evidence boundaries and post-launch
measurement workflow.
