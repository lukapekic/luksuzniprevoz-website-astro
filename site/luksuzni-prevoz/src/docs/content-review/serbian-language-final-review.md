# Final Serbian Language Review

## Result

Completed on 9 September 2026 against `serbian-language-reference.md` after the
initial content-quality and corpus passes. All 15 route reports and the proposed
shared-UI changes were re-read in context. Production content remains unchanged.

The pass covered:

- polite second-person plural and consistent company/system voice;
- present, perfect, future, conditional, and verbal aspect as used in claims and
  process descriptions;
- case government, adjective/noun agreement, and Serbian information order;
- number-dependent forms and every proposed duration token;
- owner-approved terminology and unexplained foreign vocabulary;
- CTA truth, so grammatical polishing does not strengthen an unsupported claim.

## Corrections made to the proposal set

1. Replaced `van`, `vanovi`, `minivan`, and generic `sedan` proposals with
   `kombi`, `kombi vozilo/vozila`, or `limuzina` according to context.
2. Removed the foreign journey term from every proposed replacement. The
   approved alternatives are `raspored`, `raspored putovanja`, `redosled
   vožnji`, and `plan prevoza` according to meaning.
3. Adopted the owner's `e-mail` / `e-mail adresa` house style consistently.
   This remains documented as a deliberate exception because normative sources
   generally prefer `imejl`/`mejl` and `imejl-adresa`.
4. Replaced brittle `{hours} sati`, `{minutes} minuta`, and `{years} godina`
   patterns with neutral `h`, `min`, and `god.` proposals. A future full-word
   formatter must select forms from the complete number, including the 11–14
   exception.
5. Corrected remaining informal submission labels to `Pošaljite...` and kept
   general-audience `vi/vam/vaš` lowercase.
6. Reworked translated or noun-heavy phrases, including `Private Chauffeur
   najam`, `vremenski formati`, `pošaljite poslovni raspored`, `odgovoriti sa
   predlogom`, and `organizovan prema gostu`.
7. Corrected unclear agreement and word order in Fleet, Pricing, Booking,
   Corporate, Conference/Congress, Business, VIP, and Home proposals.

## Route-by-route verdict

| Route | Final language verdict | Material adjustment in this pass |
|---|---|---|
| Fleet | passed | Naturalized SUV/capacity wording; changed `dostupnost` to `raspoloživost`; strengthened the Serbian chauffeur label without strengthening facts. |
| Pricing | passed | Replaced the mixed English product phrase and abstract “time formats” with customer-facing package/option wording. |
| Booking | passed | Corrected contact wording, plural-unsafe lead time, availability terminology, and polite submission voice. |
| Contact | passed | Applied `e-mail` house style and polite-plural submission wording; avoided awkward declension by using `pišite na e-mail adresu`. |
| Private Chauffeur | passed | Replaced the foreign journey term with `raspored putovanja` and corrected a mismatched heading. |
| Airport Transportation | passed | Made the waiting token number-safe, chose `Praćenje leta`, and used `kombi vozilo` for the larger-vehicle category. |
| Corporate Transportation | passed | Replaced unnatural schedule CTAs and the translated recurring-service construction. |
| Delegation Transportation | passed | Corrected coordination in the confidentiality phrase and simplified incomplete “operational request” wording. |
| Conference/Congress Transportation | passed | Gave fragmentary audience copy an explicit subject and naturalized the illustrative-schedule label. |
| Business Transportation | passed | Corrected agreement around the `ili` construction by rewriting the sentence; retained the separate P0 release blocker. |
| Wedding Transportation | passed | Existing proposals already use natural case/agreement and the approved vehicle vocabulary. |
| Prom Transportation | passed | Replaced the calque `odgovoriti sa predlogom` with `poslati predlog`. |
| VIP Transportation | passed | Naturalized the H1, confidentiality standard, security explanation, and schedule terminology. |
| Special Events | passed | Replaced slash-compressed CTA wording with three complete labels. |
| Home | passed | Made the years token number-safe and corrected trust, Fleet, booking, and schedule phrasing. |

## Required application behavior

- Do not copy a shortened example ending in an ellipsis into production. In
  apply mode, produce the complete field and rerun this language gate.
- Resolve tokens with real values before approval of the implementation, not
  only as placeholders in Markdown.
- If a full unit word replaces `h`, `min`, or `god.`, use a Serbian plural-aware
  formatter and test 0, 1, 2, 4, 5, 11, 14, 21, 22, and 25.
- Keep exact model labels canonical; build Serbian case around a generic noun
  rather than altering the product label.
- Search production Serbian for every avoid-list term after application. An
  occurrence is allowed only when it is being discussed in documentation, not
  shown to a customer.

## Remaining non-linguistic blockers

Language review does not resolve the Business hub's unavailable child routes,
the form-activation contract mismatch, or missing legal/operational evidence.
Those remain governed by `decisions-required.md` and their route reports.
