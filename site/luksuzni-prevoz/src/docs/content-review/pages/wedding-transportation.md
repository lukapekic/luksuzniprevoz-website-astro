# Route: `weddingTransportation`

## Scope

- Audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: plan transport for the couple, family, and guests; specify locations, vehicles, waiting, return, and appearance requests; understand manual confirmation.
- Sources: Serbian entry, locked Wedding blueprint, final renderer/shared Occasion components, service/operations/contact/fleet data, used Wedding/Occasion UI keys, shared chrome.

## Claim ledger

All core claims are supported: couple and guest transport, multiple/mixed vehicle classes, return, waiting by custom quote, appearance requests for review, quote-only pricing, and manual confirmation. Decoration, flowers, and ribbons are correctly described as non-standard and unconfirmed until explicitly agreed.

## Findings and proposals

| Priority | Field/group | Issue | Proposed replacement/action |
|---|---|---|---|
| P1 | Hero primary CTA | `Planirajte prevoz za venčanje` points into a request flow and can sound like an immediate planning tool. | Use `Pošaljite zahtev za venčanje`, matching the truthful Final CTA. |
| P1 | `sections.presentation.body`, FAQ and standards body | `Wedding Transportation uslugu/servisa` is mixed-language, internal product nomenclature. | Use `uslugu prevoza za venčanje`; standards body: `Prikazani standardi zasnivaju se na potvrđenim pravilima usluge i operativnim mogućnostima.` |
| P1 | Repetition of waiting/return qualification | The same caveat appears in Overview item, Scope item, Wedding Day, Occasion standards, FAQ, and CTA. | Retain it in Overview, Scope, and FAQ; let the Wedding Day tell the sequence and the Final CTA ask for the detail without restating the rule. |
| P2 | `weddingDay.heading.intro` | `tačka A do tačke B` is a generic cliché. | `Prevoz treba da prati plan venčanja, a ne samo jednu vožnju između dve lokacije.` |
| P2 | Appearance terminology | `prezentacija vozila` is abstract for customers who mean flowers, ribbons, or another requested look. | Standardize on `izgled vozila` / `posebni zahtevi za izgled vozila`; keep capability ownership unchanged. |
| P2 | `serviceScope.body` | `Nekim venčanjima je potrebno` is grammatically clumsy. | `Za neka venčanja dovoljno je glavno vozilo za mladence; druga uključuju...` |
| P2 | Vehicle copy | `prema ulozi u danu`, `sedan`, and bare `V klasa` are vague or inconsistent. | `Vozilo prema putnicima i delu plana`; use `limuzina` and canonical `Mercedes-Benz V-Class`. |
| P2 | Standards heading | `pouzdanu organizaciju` is a broad outcome claim. | Prefer concrete `Važan dan zahteva pažljivu pripremu`. |

## Conclusion

The page is unusually disciplined about optional waiting, return, and decoration. Its main work is editorial compression and removing English/internal service names. No owner input is required; the request CTA, appearance terminology, and repetition rules can follow corpus decisions.
