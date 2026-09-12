# Route: `conferenceCongressTransportation`

> **Final state — 12 September 2026:** This audit is retained as historical
> evidence. Its copy findings were applied, and the route is now published,
> reviewed and indexable in SR/EN/RU after an isolated 13-gate verification.

## Scope

- Mode: audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle at audit time: `in-review`, `noindex`, route availability `scaffold`; now resolved and published.
- User task: provide the event schedule and passenger groups for a quote covering airport arrivals, hotels, venues, individual travellers, groups, and multiple vehicles.
- Sources: Serbian page entry, locked blueprint/content contract, final renderer, `conferenceCongressService`, operations/contact data, used Conference/Business UI keys, fleet and shared chrome.

## Claim ledger

| Claim | Source | Status/action |
|---|---|---|
| Airport arrivals, hotel transfers, and venue shuttles | typed Conference service | verified |
| Individual executive and group transport can coexist | typed Conference service | verified |
| Multiple vehicles can share one event schedule | typed Conference service | verified |
| Price is always an individual quote | `pricingMode: ["quote"]` | verified |
| Exact vehicle roles | `conferenceCongressVehicleRoles` | verified and data-derived |

## Findings and proposed replacements

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P1 | Lifecycle and Business Hub relationship | Full content is correctly held for review, but the published parent hub links to this scaffold route. | Keep this page non-public until its page gates pass; resolve the parent-hub mismatch before release. | Release/route decision. |
| P1 | Primary CTAs | `Planirajte prevoz za događaj` describes an activity but not the result of the linked booking flow; a mid-page CTA switches to informal `Pošalji`. | Standardize on `Pošaljite zahtev za prevoz` or contextual `Pošaljite raspored događaja`, always polite plural. | Corpus CTA/voice decision. |
| P1 | Opening and middle-page repetition | Overview, event journey, passenger movement, and multi-vehicle sections repeat `raspored događaja`, individual/group movement, and multiple vehicles. | Keep Overview scannable; use event journey only for chronological touchpoints; passenger movement for two audience modes; multi-vehicle for vehicle assignment. Remove repeated explanatory clauses. | Coordinated page edit. |
| P2 | `audience` item copy | Five fragments omit verbs and read like internal card notes rather than polished Serbian sentences. | Use complete concise sentences, e.g. `Organizatori na jednom mestu imaju pregled dolazaka, hotela, lokacija i grupa.` | None. |
| P2 | `eventJourney.heading.intro` | `Primer organizacije, ne fiksna ruta.` is abrupt and implementation-like. | `Ovo je primer organizacije; konačan raspored pripremamo prema podacima za konkretan događaj.` | None. |
| P2 | `eventJourney` stage labels | `Transfer`, `lokacija konferencije`, and `završni transfer` vary terminology and can exclude congresses. | Prefer `prevoz do hotela`, `lokacija događaja`, and `završna vožnja`. | Corpus terminology. |
| P2 | Vehicle copy and UI trust markers | `S klasa`, `E klasa`, `V klasa` and middle-dot lists do not follow canonical model names or sentence-style Serbian. | Derive `Mercedes-Benz S-Class/E-Class/V-Class` names from fleet data; replace decorative separators with punctuation or structured items. | Fleet/UI presentation. |
| P2 | `faq.quoteAnswer` | `drugih potvrđenih zahteva za transport` is bureaucratic and semantically odd before confirmation. | `Ponudu pripremamo prema rasporedu, lokacijama, broju putnika, potrebnim vozilima i posebnim zahtevima.` | None. |
| P2 | Final CTA text | `pripremiti transportni plan i individualnu ponudu` repeats two nouns and mixes terminology. | `Proverićemo detalje i pripremiti individualnu ponudu za organizaciju prevoza.` | None. |

## Used Serbian UI and conclusion

The interpolated FAQ answers continue to mirror typed capabilities and manual
confirmation. Terminology, model names, polite-plural actions and card copy were
standardized, translations were reviewed, and the route was activated in all
locales. No owner content input remains.
