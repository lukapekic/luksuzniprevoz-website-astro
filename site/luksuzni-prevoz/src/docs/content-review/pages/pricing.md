# Route: `pricing`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, indexable, `translationState: reviewed`
- Primary user task: find supported public prices, understand what each tariff covers, recognize when an estimate or individual quote is required, and start the appropriate next action without mistaking submission for confirmation.
- Composed-surface sources: `pricing.sr.md`, Pricing components/view model, `pricing.ts`, `services.ts`, `fleet.ts`, `routes.ts`, navigation labels, used `pricing.*` Serbian UI keys, shared Header/FAQ/FinalCTA/Footer output.

## Blueprint and content-contract constraints

- Public numeric prices are limited to airport transfers and Private Chauffeur hourly, half-day, and full-day formats.
- Amounts, currency, eligible vehicles, durations, included kilometres, and pricing modes remain data-derived.
- Per-kilometre and city-to-city fares, surcharge formulas, and unverified starting prices remain excluded.
- Custom services distinguish estimate-plus-quote from quote-only handling.
- Submission never equals confirmed price, availability, or reservation.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Airport transfer has a fixed per-vehicle price in the supported scope | `pricing.ts#airportTransfer` and Pricing data contract §2 | verified | Scope UI resolves to Aerodrom Nikola Tesla ↔ Beograd. |
| Private Chauffeur has hourly, 5h/100km, and 10h/200km published formats | `services.ts#privateChauffeurService.bookingOptions` and `pricing.ts` | verified | Values render dynamically; do not duplicate numbers in Markdown. |
| Business requests may receive an estimate; complex/recurring work receives a quote | `services.ts#businessTransportation/corporateTransportation.pricingMode` | conditional | Preserve distinction without promising an estimate for every request. |
| Delegation, conference, wedding, prom, and VIP services are quote-driven | Corresponding `services.ts#pricingMode` fields | verified | Retain. |
| Special Events has no verified numeric starting price | Pricing data contract §6 | verified negative fact | Retain non-numeric handling. |
| Prices and availability are manually confirmed | Current booking/confirmation contract and page blueprint | verified | Retain prominently. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P1 | `pricing.sr.md#pricing.heading.intro` | “moraju se prikazati direktno iz aktuelnih podataka” is an implementation instruction presented to customers. | Values are already guaranteed by `PricingPage.astro` and the locked data contract. | Replace with `Uporedite aerodromski prevoz i pakete najma vozila sa profesionalnim vozačem. Uz svaku opciju prikazujemo važeću cenu i uslove.` | high | None. |
| P1 | `pricing.sr.md#faq.items[1-3]` | Answers explain that values are “read directly from data” and that a rule is not duplicated in content. This does not answer the visitor naturally. | Rendered price groups already display current duration, kilometres, and minimum. | `[1]` `Prikazani su najam po satu, poludnevni i celodnevni najam. Uz svaki format navedeni su važeći iznos i uslovi.` `[2]` `Da. Minimalno trajanje prikazano je uz najam po satu.` `[3]` `Uz obe opcije prikazani su trajanje i uključena kilometraža. Ako plan izlazi iz tog okvira, pripremamo individualnu ponudu.` | high | None. |
| P1 | `pricing.sr.md#hero.primaryCta.label` and `finalCta.primaryCta.label` | “Rezerviši vožnju” can imply completion while the flow creates a request subject to manual confirmation. | Blueprint explicitly prohibits instant-confirmation implications. | Use the corpus standard `Započnite rezervaciju`; preserve the booking target. | high | Corpus CTA decision. |
| P1 | `pricing.sr.md#faq.items[4].answer` | “modeli koji su direktno vezani za podržane usluge” exposes catalogue logic and is harder to understand than the policy itself. | Public scope is simply airport plus time-based chauffeur-hire formats. | Replace with `Ne. Javni cenovnik obuhvata aerodromski prevoz i pakete najma vozila sa profesionalnim vozačem koji se obračunavaju prema trajanju. Za ostale zahteve pripremamo procenu ili individualnu ponudu, u zavisnosti od usluge.` | high | None. |
| P1 | `pricing.sr.md#confirmation.body` and FAQ final answer | “Cena i rezervacija postaju potvrđene” is grammatically heavy and blurs confirmation of the price with acceptance of the booking. | Manual confirmation is required for both, but they are distinct customer outcomes. | Replace body with `Nakon prijema zahteva proveravamo raspoloživost, detalje angažmana i odgovarajući način obračuna. Cena i termin važe tek kada ih naš tim ručno potvrdi.` Use the same distinction in the final FAQ answer. | high | Confirm “termin” is the desired common term in the booking corpus pass. |
| P2 | `pricing.sr.md#hero.supportText` | Three slogan fragments separated by middle dots are dense and echo a recurring template pattern. | Skill treats slogan triplets as a diagnostic signal; the hero already has a complete description. | Replace with one sentence: `Objavljene tarife za standardne usluge, uz individualnu ponudu za složenije angažmane.` | high | None. |
| P2 | `pricing.sr.md#introSection` | “aktuelni katalog”, “modeli cena”, “definisani uslovi” and “angažmani prelaze na procenu” sound internal and abstract. | Page objective is to make pricing easy to find and understand. | Title: `Izaberite uslugu i način obračuna`. Intro: `Prikazujemo samo cene i opcije koje su trenutno raspoložive za rezervaciju.` Body: `Aerodromski prevoz ima objavljenu cenu za podržanu relaciju. Najam vozila sa profesionalnim vozačem ima tarife prema trajanju. Za poslovni prevoz, delegacije, konferencije i posebne prilike pripremamo procenu ili individualnu ponudu prema konkretnom rasporedu.` | high | Corpus terminology. |
| P2 | `pricing.sr.md#sections.individualPricing.body` | “privlačna početna cena bez potvrđenog osnova” talks about the company’s publishing posture rather than the customer’s decision. | Blueprint requires useful explanation of custom pricing. | Replace with `Za ove usluge cenu određuju raspored, izbor i broj vozila, relacije i potreban nivo koordinacije. Kada dobijemo te podatke, pripremamo procenu ili individualnu ponudu prema pravilima izabrane usluge.` | high | None. |
| P2 | `pricing.sr.md#sections.pricingModels` | “način prikaza”, “čitaju iz podataka” and “standardni model” remain implementation-oriented. | The three models should explain customer-visible pricing behavior. | Retain the three headings; rewrite descriptions around when the customer sees a fixed fare, published time-based tariff, or tailored quote, without referring to data plumbing. | high | Exact copy to harmonize after service-family audits. |
| P2 | `pricing.sr.md#finalCta.heading` | “Znate šta vam je potrebno?” is generic and creates a yes/no dead end. | CTA should identify the next useful action. | Replace with `Pošaljite detalje prevoza`. | high | None. |

## Used Serbian UI strings

| Key | Assessment | Proposed action |
|---|---|---|
| `pricing.hero.eyebrow` | Clear. | Retain. |
| `pricing.nav.ariaLabel` | Descriptive and accessible. | Retain. |
| `pricing.nav.custom` | Clear. | Retain. |
| `pricing.airport.label/scope` | Concise and data-aligned. | Retain. |
| `pricing.chauffeur.label/note` | Clear. | Retain. |
| `pricing.rate.*.title/fact` | Natural with representative values: `Minimum 1 h`, `5 h · do 100 km`, `10 h · do 200 km`. | Retain tokens exactly; consider `Najmanje {hours} h` during corpus terminology pass. |
| `pricing.unit.*` | Clear in row context. | Retain. |
| `pricing.status.published/quote` | Clear. | Retain. |
| `pricing.status.estimateQuote` | “Procena + ponuda” is compact but mechanical. | Prefer `Procena, zatim ponuda` if layout permits. |
| `pricing.custom.*Group` | Clear. | Retain, subject to special/“specijalni” corpus terminology. |
| `pricing.cta.airport/chauffeur` | Descriptive route actions. | Retain. |

Global navigation, contact affordances, and footer strings remain assigned to the shared Serbian UI pass.

## Page-level conclusions

- Scope and audience: complete and correctly limited to supported public pricing.
- Coordination/process clarity: strong in structure; prose should describe customer outcomes rather than repository data flow.
- Limitations and qualification: accurate; excluded pricing is clearly handled without fabricated figures.
- CTA integrity: route CTAs are strong; booking labels need the corpus-wide request/confirmation correction.
- Retained intentional repetition: manual confirmation belongs in hero support, confirmation section, FAQ, and final action context, but wording should vary by function.
- Content input required: none.
- SEO handoff: metadata accurately reflects the visible offer; revisit only after Serbian terminology and H1 wording are frozen.
- Recommended disposition: approve after implementation-language removal and corpus CTA/terminology alignment.
