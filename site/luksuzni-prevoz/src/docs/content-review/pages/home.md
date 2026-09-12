# Route: `home`

## Scope

- Audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: understand the offer, choose one of four service families, build confidence, inspect representative vehicles, understand the request process, and begin booking or contact.
- Sources: Serbian Home entry, locked Homepage blueprint, `HomePage.astro` and composed components, service/operations/contact/fleet/reviews data, used shared Serbian UI and navigation labels.

## Claim ledger

| Claim | Source | Status/action |
|---|---|---|
| Private Chauffeur duration formats | `services.ts` and Home adapter | verified and data-derived |
| Airport flight tracking and meet-and-greet | Airport service data | verified |
| Chauffeurs wear suit and tie and have at least five years’ licence experience | `operations.ts` | verified; current Home wording substitutes an unsupported service-experience claim |
| Vehicles are maintained through authorized/official providers and checked before important trips | `operations.ts` | verified; avoid unsourced “regularly” cadence |
| A backup vehicle is available when needed | `operations.ts` | verified |
| Every request is manually confirmed | `contact.ts` | verified |
| Google reviews/profile are current and public | no verified production Maps URL | not currently publishable; section is correctly gated out of production |

## Findings and proposals

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P0 | `trust.items[0].text` | `sa iskustvom u poslovnom, privatnom i VIP prevozu` is not supported by canonical operations data. Training areas and licence years are not proof of delivered service experience in each category. | Interpolate verified fact without a brittle noun suffix: `Vozači nose odelo i kravatu i imaju najmanje {years} god. vozačkog iskustva.` | Add data-derived interpolation from `operations.chauffeurs.minimumLicenseYears`; use plural-aware wording if the unit is written in full. |
| P1 | Hero and Final CTA primary labels | `Rezerviši vožnju` / `Rezerviši` imply completion, but the flow creates a request pending review. | `Započnite rezervaciju`. | Corpus CTA standard. |
| P1 | `trust.heading.intro` | `ista pažnja prema vozaču` says the attention is directed toward the driver, not the passenger. | `Od prvog kontakta do dolaska na odredište vodimo računa o putniku, vozilu i dogovorenim detaljima.` | None. |
| P1 | `trust.items[1].text` | `redovno održavaju` adds an unmodeled maintenance cadence, and “zahtevnijih i dužih angažmana” differs from the verified important-trip condition. | `Vozila se održavaju u ovlašćenim ili zvaničnim servisima i dodatno proveravaju pre važnih vožnji.` | Prefer composing from existing operations labels. |
| P1 | `trust.items[3].text` | `planira se odgovarajuća zamena` is more specific than the `backupVehicleAvailable` fact. | `Rezervno vozilo dostupno je po potrebi.` | None. |
| P1 | Home service/family labels | `Specijalni događaji` conflicts with the event family’s better Serbian `posebne prilike`; Airport naming is already correct. | Card title `Posebne prilike`; coordinate with navigation and Booking UI. | Corpus terminology. |
| P2 | Service card actions | Four `Saznaj više` labels use informal singular while most page actions use polite plural. | `Saznajte više`. | Corpus voice. |
| P2 | Hero support | `profesionalni vozač za ... posebne događaje` is grammatically uneven and repeats the Hero categories. | `Diskretna koordinacija i ručna potvrda svakog zahteva.` | None. |
| P2 | Flagship body | `Rezervišite vozilo...` again implies direct confirmation and repeats the detailed service page. | `Pošaljite zahtev za vozilo sa profesionalnim vozačem i navedite stanice ili obaveze tokom dana.` | None. |
| P2 | Fleet intro | Bare `V klase` is inconsistent with canonical model naming. | `Od poslovnih limuzina do modela Mercedes-Benz V-Class i Mercedes-Benz Sprinter za grupe.` | Fleet terminology. |
| P2 | Process step 2 | `dostupnost` conflicts with the corpus-preferred Serbian `raspoloživost`. | `Naš tim proverava raspoloživost, usaglašava detalje i tek zatim potvrđuje rezervaciju.` | Corpus terminology. |
| P2 | Reviews copy | The authored section says `našem Google profilu`, but there is no verified production profile URL. | Retain as dormant content only; review it when real profile/review data is connected. Do not expose the mock fixture. | Verified Google profile/data. |

## Conclusion

Home has three operational claims that need correction before its trust strip can be treated as evidence-safe. The section is otherwise well gated, especially Google Reviews. Apply the corpus CTA/voice/service-name rules, keep numeric package facts data-derived, and shorten repeated Hero/flagship phrasing. No owner input is required for the safe replacements.
