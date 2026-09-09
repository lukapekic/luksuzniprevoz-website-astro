# Route: `promTransportation`

## Scope

- Audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: request an individual, pair, group, or multi-vehicle arrival; provide pickup details; optionally request waiting, return, a model, or vehicle appearance; await confirmation.
- Sources: Serbian entry, locked Prom blueprint, final renderer/shared Occasion components, service/operations/contact/fleet data, used Prom/Occasion UI keys, shared chrome.

## Claim ledger

Typed data supports individual/group transport, multiple/mixed vehicle classes, return, waiting by custom quote, appearance requests, quote-only pricing, and manual confirmation. Parking logistics is a verified operating standard. No public claim should imply guaranteed attention, red-carpet treatment, unlimited waiting, or automatic vehicle availability; current copy avoids those claims.

## Findings and proposals

| Priority | Field/group | Issue | Proposed replacement/action |
|---|---|---|---|
| P1 | Hero/Overview and FAQ | `Premium vozilo` and `Prom Transportation` are English-heavy and less precise than the surrounding Serbian. | Use `vozilo više klase` and `usluga prevoza za maturu`. |
| P1 | `sections.standards.body` | `potvrđene operativne uslove i mogućnosti Prom Transportation servisa` exposes content/data implementation and mixes languages. | `Standard obuhvata profesionalnog vozača, pripremljeno vozilo i ručnu potvrdu dogovorenih detalja.` |
| P1 | Page-wide pickup/return repetition | Pickup place/time and return/waiting appear in Hero, Overview, Scope, Arrival, standards, process, FAQ, and Final CTA. | Keep the promise in Hero, required inputs in Scope, sequence in Arrival, caveat in FAQ, and concise inputs in Final CTA; remove duplicate qualification elsewhere. |
| P2 | `h1` plus `hero.title` | The entry stores the same visible heading twice while the dedicated renderer uses the Hero title. | Remove or formally deprecate the unused `h1` field when the schema/content contract permits; do not maintain duplicate source copy. |
| P2 | `arrivalStory.intro` | “počinje pre nego što izađete iz vozila” is rhetorically awkward. | `Dobro organizovan dolazak počinje jasnim planom preuzimanja.` |
| P2 | Vehicle class wording | `sedan` and generic `grupno vozilo` are less natural/specific. | Use `limuzina` and, where facts are displayed, canonical V-Class/Sprinter names from fleet data. |
| P2 | `prom.vehicleRole.mercedesEClass` | `Elegantna opcija` is subjective filler. | `Individualni dolazak ili prevoz za par`. |
| P2 | Process/CTA | `potvrditi sledeći korak` is vague; the team actually reviews availability and sends confirmation/quote. | `Tim će proveriti raspoloživost i poslati predlog organizacije.` |

## Conclusion

The copy is safe and clear but over-repeats the same planning facts. Remove English product naming, use concrete Serbian vehicle language, and give each locked section one distinct job. No owner input is required.
