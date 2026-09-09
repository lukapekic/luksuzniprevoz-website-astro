# Serbian Language Reference for Website Copy

## Purpose

Use this reference for the final Serbian language pass after factual, structural,
and conversion review, but before owner approval or translation. It applies to
Serbian Latin, Ekavian, customer-facing copy for the Luxury Transportation site.

This is a practical editorial contract, not a complete grammar. A rule marked
**normative** follows published Serbian grammar or orthography guidance. A rule
marked **house style** is a deliberate product-language decision. When those
conflict, record the exception instead of presenting house style as the only
normatively accepted form.

## Research basis

Research checked on 9 September 2026:

- The [Board for Standardization of the Serbian Language](https://www.ossj.rs/naslovna-strana/)
  brings together the principal Serbian-language institutions and publishes
  normative decisions.
- The University of Belgrade Faculty of Philology course
  [Savremeni srpski jezik 2](https://www.fil.bg.ac.rs/sr-lat/fis/karton_predmeta/2101515)
  treats agreement, cases, verb forms, word order, cohesion, and punctuation as
  connected parts of text review. Its bibliography points to the current
  standard grammar literature.
- The University of Novi Sad textbook
  [Standardni srpski jezik 2: Morfologija](https://digitalna.ff.uns.ac.rs/sadrzaj/2022/978-86-6065-706-2)
  is the morphology reference for inflection.
- The Institute for the Serbian Language SANU identifies
  [Raskovnik](https://raskovnik.org/) as its Serbian lexicographic platform. Use
  it to verify uncertain lemmas; dictionary presence alone does not make a word
  suitable for customer copy.
- The University of Novi Sad study of number/case errors confirms that two,
  three, and four take the paucal/genitive-singular form, while five and higher
  take genitive plural: [academic source](https://digitalna.ff.uns.ac.rs/sites/default/files/db/books/978-86-6065-910-3.pdf).
- The Board's decision on [sat versus čas](https://www.ossj.rs/odluke-i-saopstenja/bosnjacki-ili-bosanski-jezik-sat-ili-cas-jevrejski-hebrejski-jezik-ili-ivrit/)
  recommends `sat` as the natural word for a 60-minute duration; `čas` has
  broader and more formal meanings.
- The Board confirms that both the infinitive and `da` + present have legitimate
  Serbian uses: [infinitive and da-construction](https://www.ossj.rs/odluke-i-saopstenja/o-odnosu-izmedju-da-konstrukcije-i-infinitiva-u-srpskom-jeziku/).
- Prof. Dr Rada Stijović of the Institute for the Serbian Language SANU explains
  the personal and impersonal uses of
  [`trebati`](https://jezikofil.rs/sta-treba-znati-o-glagolu-trebati-ili-sta-cemo-sa-trebati/).
- The Board's guidance on [enclitic placement](https://www.ossj.rs/odluke-i-saopstenja/mesto-enklitike-u-recenici/)
  shows that short unstressed forms follow Serbian sentence structure and cannot
  be placed mechanically as in English.
- The University of Novi Sad's
  [Dictionary of Recent Anglicisms](https://digitalna.ff.uns.ac.rs/sites/default/files/db/books/978-86-6065-636-2.pdf)
  recommends adapted Serbian forms in general and records source-form `e-mail`
  only for particular contexts.

## Person, address, and voice

**Normative/practical rule:** verbs agree with their subject in person and
number. Do not switch between informal singular and polite plural on one
surface.

- Address visitors with polite second-person plural: `Pošaljite`, `Izaberite`,
  `Pogledajte`, `Navedite`.
- Use lowercase `vi`, `vam`, `vas`, `vaš` when addressing the website audience.
  Capitalized `Vi/Vaš` is reserved for respectful correspondence with one known
  person, not a general web audience.
- Use first-person plural for actions the company genuinely performs:
  `proveravamo`, `predlažemo`, `šaljemo`.
- Use third person or an impersonal construction for system state or general
  rules: `Slanje trenutno nije dostupno`; `Potrebno je navesti datum`.
- Prefer the perfective imperative for a single CTA action: `Pošaljite zahtev`,
  not an aspectually repetitive form such as `Šaljite zahtev`.

## Tense, aspect, and claim timing

- **Present:** current facts, stable policies, and recurring process:
  `Tim proverava raspoloživost.`
- **Perfect:** completed actions supported by evidence:
  `Pružali smo usluge prevoza.` Do not turn a client record into a performance
  endorsement.
- **Future I:** a committed next step that follows a defined trigger:
  `Nakon provere poslaćemo ponudu.` Do not use `biće`, `omogućićemo`, or
  `uskoro` for an unapproved future feature.
- **Conditional:** a real condition or option, not a disguised promise:
  `Ako raspored to zahteva, možemo predložiti više vozila.`
- Match aspect to meaning: imperfective verbs describe duration or repetition
  (`pratimo let`), while perfective verbs describe one completed step
  (`proverićemo zahtev`).

## Cases, agreement, and sentence construction

- Adjectives, pronouns, and participles must agree with their nouns in gender,
  number, and case: `procenjena cena paketa`, not `procenjena paket cena`.
- Check the government of every verb and preposition. Frequent site patterns:
  `prema rasporedu` (dative), `bez čekanja` (genitive), `sa profesionalnim
  vozačem` (instrumental), `za putovanje` (accusative), `između aerodroma i
  adrese` (genitive).
- `u` and `na` normally take accusative for direction (`na aerodrom`) and
  locative for position (`na aerodromu`).
- Use impersonal `treba da` / `potrebno je da` when `trebati` supplements
  another verb: `Potrebno je da navedete datum.` Personal forms are appropriate
  when `trebati` means “to need”: `Trebaju nam datum i vreme.`
- Keep enclitics close to a natural first stressed unit. Rewrite any sentence
  whose inserted phrase leaves `je`, `se`, `ga`, `mu`, or `vam` stranded after a
  long pause.
- Prefer natural Serbian information order over English noun strings and heavy
  nominalization: `cena paketa`, `plan prevoza`, `broj putnika`.

## Numbers, durations, and interpolation

For full-word dynamic counts, select the form from the complete number, with
11–14 taking precedence over the last digit:

| Value pattern | `sat` | `godina` | Example |
|---|---|---|---|
| exactly 1; ends in 1 except 11 | `sat` | `godinu` in duration phrases | `1 sat`, `21 sat`; `najmanje 1 godinu` |
| ends in 2–4 except 12–14 | `sata` | `godine` | `2 sata`, `24 sata`; `22 godine` |
| 0, 5–20, or ends in 5–9/0 | `sati` | `godina` | `5 sati`, `11 sati`; `25 godina` |

- Never use machine forms such as `sat(a)`.
- A token followed by one fixed word form is unsafe unless its allowed value is
  invariant and documented. Test at least 0, 1, 2, 4, 5, 11, 14, 21, 22, and 25.
- When plural-aware formatting is unavailable, use recognized neutral units:
  `{hours} h`, `{minutes} min`, `{kilometers} km`. Keep a nonbreaking space in
  rendered typography where the component supports it.
- In prose, use `sat` for 60 minutes. Use `čas` only when it means a moment,
  lesson, or deliberately formal concept.
- For customer-facing clock ranges, Serbian orthographic style uses a point
  between hour and minutes (`8.00–18.00`). Machine formats and native form
  controls may retain required technical syntax such as `08:00`.

## Orthography and vocabulary

- Use Serbian Latin with full diacritics and Ekavian forms.
- Write `ne` separately from verbs, except standard fused forms such as `neću`,
  `nemam`, `nisam`, and `nemoj`.
- Write `da li` separately. Avoid slash-built words and pseudo-inflections.
- Explain unavoidable specialist abbreviations on first use, for example
  `operator privatnog terminala (FBO)`.
- Preserve canonical trademarks and model labels: `Mercedes-Benz S-Class`,
  `E-Class`, `V-Class`, and `Sprinter`. Add a Serbian generic noun around a model
  when case would otherwise distort its canonical display form.

## Luxury Transportation house style

These owner-approved choices govern this corpus:

| Meaning | Use | Avoid |
|---|---|---|
| customer transport | `prevoz` | generic `transport` |
| customer offering | `usluga` | `servis` |
| chauffeur product | `Privatni vozač`; `vozilo sa profesionalnim vozačem` | English product label |
| car class | `limuzina` | `sedan` |
| larger vehicle | `kombi`; `kombi vozilo/vozila` where a category noun is needed | `van`, `vanovi`, `minivan` |
| timed or ordered journey | `raspored`, `raspored putovanja`, `redosled vožnji` | `itinerer` |
| broader organization | `plan prevoza`, `organizacija prevoza` | internal process jargon |
| availability | `raspoloživost` | mechanical replacement of every natural use of `dostupan` |
| email | `e-mail`, `e-mail adresa` | `e-pošta`, `adresa e-pošte`, mixed spellings |
| optional field | `(nije obavezno)` | `(opciono)` |

`E-mail` is an intentional house-style exception. Current normative references
generally prefer adapted `imejl`/`mejl` and `imejl-adresa`, while allowing the
source form in limited contexts. Keep the chosen spelling consistent and do not
claim that it is the sole normative Serbian form.

## Final Serbian language gate

Before a proposal becomes the approved Serbian source:

1. Read the replacement in its complete rendered sentence and adjacent section.
2. Check person, number, tense, aspect, case, agreement, and natural word order.
3. Resolve every interpolation token with representative real and boundary
   values; reject any fixed suffix that fails a number case.
4. Check headings, labels, errors, accessibility names, and CTA verbs as well as
   body prose.
5. Search for forbidden/mixed terms and confirm each remaining foreign term is a
   canonical name or explained specialist term.
6. Confirm the wording remains factually supported and does not create a new
   promise while being made more fluent.
7. Record deliberate house-style exceptions and unresolved native-review doubts.

Only after this gate passes may the Serbian pack return to owner approval and
then become the source for English and Russian review.
