# Serbian SEO market and migration research — 12 September 2026

## Executive result

A fresh ValueSERP run covered all 14 indexable Serbian route targets on Google
Serbia with Belgrade localization. Fourteen initial requests plus two controlled
retries produced a valid final SERP for every target and 42 bounded competitor-
page observations. Together with the 42 historical attempts, the ledger now
records 58 attempts, below the approved ceiling of 60. The API key was loaded
from the ignored root `.env`; it was never printed, copied into a report or
written to generated output.

The site already owns useful search equity, but it sits on the outgoing
WordPress URLs: the current homepage ranked first for the general luxury-
transport query, the old corporate article ranked first for the corporate
query, and the old pricing URL ranked ninth for the pricing query. The most
important technical action is therefore migration, not another round of broad
keyword copy. Thirty-three direct legacy-to-current route mappings have been
added to `routes.ts` and verified through the existing redirect generator.

The content action is similarly focused. Four Serbian pages received changes
where the fresh results showed a real task mismatch:

- `Lični vozač` replaces the more employment-prone headline `Privatni vozač`,
  while the page still explains a chauffeur-driven vehicle booked by time;
- `Poslovni prevoz putnika` distinguishes the service from freight results;
- Fleet now uses the explicit Serbian market term `vozni park limo servisa`;
- Pricing now uses `cenovnik limo servisa`, the dominant wording of pricing
  results.

No ungrammatical exact-match wording was introduced. `u Beogradu` remains the
correct Serbian locative even when the raw search query omits the preposition.
No competitor price, guarantee, fleet specification, availability claim,
rating or response-time promise was imported.

## Scope and method

The fresh run used the repository's read-only SEO research package and its
configured dimensions:

| Dimension | Value |
|---|---|
| Provider | ValueSERP |
| Engine/domain | Google / `google.rs` |
| Location | Belgrade, Serbia |
| Country/language | `rs` / `sr` |
| Device | Desktop |
| Requested organic window | 20 results |
| Observed organic window | 8–10 results per successful query |
| Route targets | 14 Serbian indexable routes; Booking excluded because it is `noindex` |
| Fresh attempts | 16: 14 initial + 2 successful retries |
| Final SERP coverage | 14/14 targets |
| Competitor pages collected | 42, capped at three per query and one page per domain |

Positions are point-in-time observations, not search volume, keyword
difficulty, traffic estimates or ranking forecasts. ValueSERP's normalized
organic output does not preserve local packs, ads, People Also Ask or search-
volume data, so none of those is inferred. Competitor fetches produced four
network/403 failures and three robots exclusions; pages returning a challenge
screen were not treated as evidence of missing metadata or content.

The current live site's four WordPress page/post sitemaps were also scanned.
They expose 38 unique URLs: 33 have a directly relevant destination in the new
site, two are already unchanged (`/` and `/en/corporate-transportation/`), and
three have no equivalent (`/news/`, `/o-nama/`, `/en/about-us/`). Those three
remain intentionally unmapped because redirecting unrelated pages to the
homepage can be treated as a soft 404. Google's migration guidance recommends
direct permanent server-side redirects to the final relevant destination,
avoiding chains and irrelevant mass redirects. [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## Fresh Serbian SERP snapshot

| Route intent and query | Own-domain observation | Leading observed result | Decision |
|---|---|---|---|
| Home — `luksuzni prevoz Beograd` | #1, current homepage | [luksuzniprevoz.rs](https://luksuzniprevoz.rs/) | Preserve the existing homepage URL and general intent. |
| Airport — `aerodromski prevoz Beograd` | Not in returned 9 | [DAF Travel](https://www.daf-travel.com/) | Keep private, vehicle-level differentiation; do not imitate cheapest/shared positioning. |
| Private chauffeur — `privatni vozač Beograd` | Not in returned 9 | Jobs result #1; [Lider Limo's commercial page](https://liderlimo.rs/usluge/licni-vozac/) #2 | Lead with `lični vozač`; retain service scope and time-based hire. |
| Business — `poslovni prevoz Beograd` | Not in returned 9 | [Grand Solutions](https://grandsolutions.rs/prevoz-za-poslovna-putovanja/) #1 | Add `putnika` to separate passenger transport from freight noise. Grand Solutions is treated as a related-domain reference, not an independent competitor; see the evidence boundary below. |
| Corporate — `korporativni prevoz Beograd` | #1, legacy article URL | Current legacy article | Redirect the long legacy slug directly to `/korporativni-prevoz/`. |
| Delegations — `prevoz delegacija Beograd` | Not in returned 9 | [Premium Transfer](https://premiumtransfer.rs/prevoz-organizacija-i-koordinacija-domacih-i-inostranih-delegacija) #1 | Dedicated page and coordination-led content are justified. |
| Conferences — `prevoz za konferencije Beograd` | Not in returned 9 | [Pantas](https://pantas.rs/premium-prevoz-za-konferencije-i-kongrese-u-beogradu/) #1 | Keep the dedicated conference/congress page and airport–hotel–venue schedule. |
| Special events — `prevoz za posebne prilike Beograd` | #1, homepage rather than a dedicated URL | Current homepage | The new hub should consolidate this intent after launch; do not duplicate it on Home. |
| Weddings — `iznajmljivanje vozila sa vozačem za svadbe Beograd` | Not in returned 9 | [Grandeur](https://rentacargrandeur.rs/usluge/iznajmljivanje-auta-za-svadbe/) #1 | Existing chauffeur-driven wedding scope is aligned; preserve accurate vehicle terminology. |
| Prom — `iznajmljivanje limuzina za maturu Beograd` | Not in returned 9 | [LimoStar](https://www.limostar.rs/usluge/mature/) #1 | Keep `prevoz za maturu`; do not imply a stretch limousine or party vehicle absent from the fleet. |
| VIP — `VIP prevoz Beograd` | Not in returned 8 | [VIP Transfer Tija](https://www.viptransfer.rs/) #1 | Dedicated VIP page is valid; keep discretion and coordination without security-service claims. |
| Fleet — `iznajmljivanje vozila sa vozačem Beograd` | Not in returned 9 | Related Grand Solutions #1; [Serbia Driver](https://serbiadriver.com/sr/iznajmljivanje-vozila-sa-vozacem/) #2 | Use Fleet for model choice and Private Chauffeur for time-based service; migration mappings reinforce that split. |
| Pricing — `limo servis Beograd cenovnik` | #9, legacy pricing URL | [Careli Group](https://www.careligroup.rs/limo-servis-cenovnik/) #1 | Use `Cenovnik limo servisa u Beogradu` and redirect the ranking legacy URL to `/cene/`. |
| Contact — `Luxury Transportation Beograd kontakt` | #3, homepage rather than Contact | [luxurytransport.biz](https://luxurytransport.biz/) #1 | Redirect the old contact slug to `/kontakt/`; keep verified NAP and office hours consistent. |

The own-domain observations reflect the currently deployed WordPress site, not
the new Astro build. Absence of a future route is therefore not evidence that
its finished content is inadequate; the pages have not yet been deployed or
recrawled. Google notes that title-link and URL changes require recrawling and
may take days to weeks to appear. [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)

## Market structure and competitor patterns

Across the 14 top-result windows, the most recurrent domains were Grand
Solutions (8 queries), Lider Limo (6), Premium Mobility (5),
Pantas (4), and Transfers in Belgrade, ECS Serbia, Serbia Driver and VIP
Transfer Tija (3 each). Frequency is useful for identifying the competitive
set, but it is not a visibility score because each query returned a different
number of results and only one desktop location/device was sampled.

Independent competitors repeatedly use five useful patterns:

1. **One page per concrete task.** Delegation, conference, wedding, prom,
   airport and pricing queries usually return dedicated landing pages, not one
   generic services page. The new architecture already follows this pattern.
2. **Service plus city in titles and H1s.** The winning result usually states
   the task and Belgrade directly. Natural Serbian inflection is preferable to
   verbatim keyword repetition; Google can build title links from the title,
   H1, prominent content and link text. [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
3. **Commercial clarity.** Pricing pages name `cenovnik`; chauffeur pages state
   vehicle-with-driver or personal-driver service; fleet pages expose models.
   The implemented title refinements address these gaps without changing facts.
4. **Operational decision support.** Strong pages explain booking inputs,
   vehicle fit, schedule shape, airport handling and whether pricing is fixed or
   quoted. The new content already goes further than slogan-led competitors in
   these areas and should retain that people-first focus. [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
5. **Visible local identity.** Complete, consistent business information
   supports local relevance. Google describes local results as primarily based
   on relevance, distance and prominence and recommends a verified, accurate
   Business Profile. [Google Business Profile local-ranking guidance](https://support.google.com/business/answer/7091?hl=en)

The site should not copy competitors' superlatives, `24/7` promises, perfect
punctuality claims, unverified included amenities, ratings or prices. Their
published claims were not independently verified and do not override the
repository's canonical business data.

## Implemented content changes

### Personal-driver intent

The raw query `privatni vozač Beograd` produced two employment sites in the top
three. The first clearly commercial result used `Lični vozač`. The Serbian page
now uses `Lični vozač u Beogradu` in its SEO title and H1 while continuing to
describe the same verified product: a fleet vehicle and professional driver
reserved by the hour, half-day, full day or custom schedule. The existing
`privatni-vozac` route remains stable.

### Passenger-business intent

The broad business query mixed passenger service with freight results. The SEO
title, description and H1 now use `poslovni prevoz putnika`, which is both
natural Serbian and a factual disambiguation. No new corporate capability was
added.

### Fleet and pricing intent

Fleet now uses `Vozni park limo servisa u Beogradu`; visible content continues
to focus on chauffeur-driven model selection rather than dealership
specifications. Pricing now uses `Cenovnik limo servisa u Beogradu`, consistent
with the observed pricing-result language. Its description still explains the
actual distinction between airport prices per vehicle, duration-based hire and
individual quotes.

All other Serbian pages were retained because their task, location and visible
decision support already matched the fresh SERP. Google primarily forms snippets
from page content and may use a meta description when it is a better summary;
unique, accurate descriptions are therefore preserved instead of converted into
keyword lists. [Google snippet guidance](https://developers.google.com/search/docs/appearance/snippet)

## Implemented technical SEO changes

The route map now carries 33 source-of-truth `previousSlugs`, covering all
legacy Serbian and English URLs with a defensible equivalent. Examples:

| Legacy URL | Current destination |
|---|---|
| `/korporativni-prevoz-vasa-vrata-ka-profesionalizmu-i-luksuzu/` | `/korporativni-prevoz/` |
| `/cenovnik-usluga-prevoza/` | `/cene/` |
| `/prevoz-do-aerodroma-beograd/` | `/aerodromski-prevoz/` |
| `/iznajmljivanje-vozila-sa-vozacem/` | `/privatni-vozac/` |
| `/prevoz-mladenaca-prevoz-za-vencanje/` | `/prevoz-za-vencanja/` |
| `/vozila-limo-servisa-beograd/` | `/vozila/` |
| `/kontakt-limo-servisa-gs/` | `/kontakt/` |
| `/en/chauffeur-service/` | `/en/private-chauffeur/` |
| `/en/luxury-transport-belgrade/` | `/en/` |

The generated Cloudflare-format output contains 33 direct 301 rules with no
chains. A site-level unit test verifies the critical mappings and confirms that
the three unrelated archive/about URLs remain unmapped. Google recommends
permanent server-side redirects for permanent URL changes because they signal
the new canonical destination. [Google redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

No changes were made to canonical, hreflang, sitemap, robots, Open Graph or
structured-data builders because the built site already passes those contracts:

- every indexable route has an absolute self-canonical;
- Serbian Latin, English, Russian and x-default alternates are reciprocal;
- the sitemap contains 42 localized indexable URLs and excludes Booking;
- LocalBusiness uses verified contact/address/hours, BreadcrumbList is route-
  derived, and FAQPage mirrors visible FAQs;
- no ratings, Offers or unsupported availability are emitted.

Google recommends explicit alternate-language annotations and requires every
language version to reference itself and the others. The present implementation
already does that, so adding another mechanism would only increase maintenance
surface. [Google localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions)

## Launch and measurement workflow

The code/content side is complete, but three deployment/account actions cannot
be performed from the repository without access to the live host and Google
accounts:

1. Build the release with `PROD_ROBOTS=1`, generate the redirect format required
   by the selected host, and verify representative old URLs return a single 301
   to a 200 current URL.
2. Submit the new sitemap in Google Search Console and request inspection of the
   homepage, Corporate, Pricing, Airport, Private Chauffeur, Fleet and Contact.
   Google recommends sitemap submission for many changed URLs and URL Inspection
   for a small priority set. [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
3. Verify the real Google Business Profile and align its website URL, public
   name, address, telephone, hours and services with the verified repository
   data. Do not connect the mock review fixture or add `sameAs` URLs until account
   ownership is confirmed.

After deployment, capture the same 14-query SERP sample at approximately 14, 30
and 90 days, and compare Search Console impressions, clicks, CTR and landing URL
per query cluster. The success criterion is not universal position one; it is
transfer of own-domain impressions from obsolete URLs/homepage cannibalization
to the intended current route, with no loss of branded and corporate visibility.

## Deferred opportunities, not implementation requirements

The old sitemap contains intercity and destination articles (Niš, Zagreb,
Budapest, winter destinations and spas). They have been redirected to Private
Chauffeur because that current page visibly supports out-of-Belgrade and
international requests. A future intercity hub or destination-page programme
may be justified, but this run did not collect volume, conversion or Search
Console evidence for those topics. Creating many thin location pages now would
be speculative and contrary to people-first guidance.

Similarly, the unmatched Serbian and English About pages may deserve a future
company/trust page. They should not be recreated or redirected solely for SEO;
the owner should first approve which verified company history, team and legal
relationship can be published.

## Evidence boundaries

- ValueSERP results are dated 12 September 2026 and may vary by time, device,
  location and personalization.
- Organic positions do not establish traffic, conversions, quality or market
  share.
- The direct collector's challenge/robots/network failures are collection
  limitations, not competitor defects.
- Grand Solutions is treated as a related-domain reference, not an independent
  competitor. This is an inference from the repository's verified
  `GrandSolution` parent-company relationship and the outgoing site's visible
  Grand Solutions references; domain ownership was not independently verified.
  `transferi.rs` also remains ownership-uncertain and is not used for
  comparative claims.
- Local-pack visibility, backlinks, Search Console performance and Business
  Profile completeness were not available through the configured provider.
- Ranking outcomes are not guaranteed; the implemented work improves relevance,
  migration signals and crawlability while preserving factual and linguistic
  quality.
