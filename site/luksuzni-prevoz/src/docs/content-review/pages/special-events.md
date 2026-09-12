# Route: `specialEvents`

## Scope

- Audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable; all three child services are published.
- User task: choose Wedding, Prom, or VIP transport—or submit another occasion—and understand when guests, multiple vehicles, waiting, return, and manual confirmation apply.
- Sources: Serbian hub entry, locked Special Events blueprint, final renderer/child cards, route/service/operations/contact/fleet data, used Special Events/Occasion UI keys, shared chrome.

## Claim ledger

The hub’s child set and supported other occasions (birthdays, private parties, galas, other events) are data-backed. Multi-vehicle, guest, privacy/discretion, waiting, and return labels are correctly gated to the child services that support them. The hub properly avoids presenting those capabilities as universal.

## Findings and proposals

| Priority | Field/group | Issue | Proposed replacement/action |
|---|---|---|---|
| P1 | `service/servis` terminology | `izabrani servis`, `potvrđeni servis`, and `Servisi za događaje` read as translated product taxonomy. | Use `usluga`: `izabrana usluga`, `potvrđena usluga`, `Usluge za događaje`. |
| P1 | Hero, Overview, Scope, Coordination | Four consecutive regions repeatedly enumerate one/multiple vehicles, guests, locations, timing, waiting, and return. | Hero states range; Overview states four principles; Scope contrasts one vehicle with coordinated transport; Coordination alone explains the sequence/caveats. Remove duplicate lists from intros and bodies. |
| P1 | Family naming | Visible copy alternates `posebni događaji`, `posebne prilike`, and route/UI legacy `specijalne događaje`. | Adopt `prevoz za posebne prilike` as the family name, with `događaj` retained only for the concrete customer occasion. Route slugs can remain unchanged. |
| P2 | `overview.heading.title` | `Više od dolaska jednim automobilom` defines the service by negation. | `Prevoz prilagođen ljudima, lokacijama i vremenu događaja`. |
| P2 | `specialEvents.overview.principal.title` | `Glavni putnik` does not naturally cover a wedding couple and sounds operational. | `Osoba ili par u središtu događaja`. Check length; shorter card option: `Važan dolazak`. |
| P2 | Child CTA labels | Repeating `Istražite` is less task-oriented than the rest of the site. | Use separate labels: `Saznajte više o prevozu za venčanje`, `Saznajte više o prevozu za maturu`, and `Saznajte više o VIP prevozu`; canonical route names are also suitable when the card affordance is clear. |
| P2 | `otherOccasions.heading` | `među ove tri kategorije` is correct but bureaucratic. | `Planirate neku drugu posebnu priliku?` |
| P2 | Process item | `sa konkretnim zahtevom` says little about what is evaluated. | `Proveravamo raspoloživost i predlažemo vozilo ili kombinaciju vozila prema broju putnika i planu.` |
| P2 | Vehicle intro | `reprezentativan`, `karakter događaja`, and `raspoloživa flota` are abstract. | `Vozilo biramo prema putnicima, ulozi u događaju i raspoloživosti za traženi datum.` |

## Conclusion

The hub’s factual scoping is strong and all child destinations are available, unlike the Business hub. Its content opportunity is a decisive compression pass plus one Serbian family name and `usluga/prevoz` vocabulary. No owner input is required.
