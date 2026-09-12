# Pricing Page — Blueprint Compliance Matrix

Status: **IMPLEMENTED — VERIFIED 2026-08-30**
Surface: `pricing`

| Requirement | Authority | Data/content source | Owner | Responsive contract | Verification |
|---|---|---|---|---|---|
| Page chrome, head, locale | AGENTS / blueprint | route + locale config | `BaseLayout` / `buildPageSeo` | one layout at all states | head/landmark inspection |
| Full-bleed Hero | blueprint §6 | `content.data.hero`, Pricing UI, hero asset | shared `ServiceHero` | overlaid media; support split at shared desktop threshold | visual + image markup |
| Hero support statement | blueprint §6 | `hero.supportText` | shared `ServiceHero` | retained in one DOM tree | content assertion |
| Three-link Pricing Index | blueprint §7 | nav labels + Pricing custom label | `PricingIndex` | stacked; 5/7 intro/index from `lg` | anchor/focus/target tests |
| Published Prices dark heading + Airport panel | blueprint §8–9 | localized heading + `pricing.ts`, `fleet.ts` | `PricingPublishedRates` / `PricingRateGroup` | dark heading above contained panel; ledger stacked through `lg`, 5/7 from `xl` | surface ownership + parity + overflow tests |
| Private Chauffeur dark heading + independent panel | blueprint §10 | localized heading/note + hourly/halfDay/fullDay + service limits | `PricingPublishedRates` / `PricingRateGroup` | dark heading above one shared panel; groups stacked through `lg`, 5/7 from `xl` | panel/group/data tests |
| Published-pricing eligibility | data contract | `fleet.pricingStatus`, `getPricing` | page adapter | same roster at every state | unit + DOM row counts |
| Quote-only exclusion | data contract | Škoda Kodiaq canonical state | page adapter | no numeric fallback | unit + DOM absence |
| Individual Pricing families | blueprint §12 | canonical service hubs/children/routes | `PricingCustomServices` | stacked through `lg`, 6/6 at `xl` | link/status tests |
| Pricing Models | blueprint §13 | authored `pricingModels` section | `PricingModels` | independent light parent; stacked then three columns at `lg` | item count/topology/surface test |
| Confirmation | blueprint §14 | authored `confirmation` section | `PricingPage` | open dark `container.main`; prose capped by body measure | content/heading/surface/width review |
| FAQ + FAQPage | blueprint §15 | one validated FAQ array | shared `Section` + `FAQ` + `buildFaqPage` | heading and rows in one regular-width contained light section | DOM/JSON-LD/surface/width parity |
| Final CTA | blueprint §16 | authored CTA, verified contacts, dedicated asset | shared `FinalCTA` | stacked before `lg`, 62/38 from `lg` | props/link/image review |
| Static-first behavior | AGENTS / plan | no client state required | all Pricing components | equivalent content | bundle/island inspection |
| Accessibility | AGENTS / acceptance | semantic DOM/localized labels | all owners | logical order, 44×44, no overflow | axe/keyboard/zoom |
| Localization/routing | AGENTS / routing skill | routes, nav labels, UI/content | page adapter + `Link` | SR/EN/RU parity | route/SEO/browser tests |
| Publication | implementation plan | route availability + three content records | routes/content | atomic across locales | build/sitemap/hreflang |

All rows are implemented. Automated browser verification passed in Chromium
and Firefox; WebKit remains an environment-only coverage gap because its host
system libraries are unavailable. No P0/P1 Pricing finding remains open.
