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

## Research basis and authority

Research was refreshed on 12 September 2026. The reference separates codified
language rules from editorial choices and does not treat search-result frequency
as proof of correctness.

The primary normative authority is the current *Pravopis srpskoga jezika* and
the fourth edition of *Normativna gramatika srpskoga jezika* (Matica srpska,
2022). The latter is confirmed in the bibliography of the Institute for the
Serbian Language SANU's 2025 *Južnoslovenski filolog*.^1 The Board for
Standardization and the Institute's Standard Language Department are the
institutional references for published decisions and the continuing development
of the norm.^2

For practical verification, the University of Belgrade syllabus for
*Savremeni srpski jezik 2* treats congruence, case meanings, verb forms,
negation, word order, cohesion and punctuation as connected parts of text
analysis.^3 The University of Novi Sad's morphology textbook is the supporting
reference for inflection,^4 while its *Serbian Dictionary of Recent Anglicisms*
is used for current loanword treatment.^5 Raskovnik, maintained with the
Institute for the Serbian Language SANU, is a useful lexicographic cross-check;
dictionary presence alone does not make a word suitable for concise customer
copy.^6

Published Board decisions resolve several recurring website questions:

- `sat` is the preferred ordinary word for a 60-minute unit; `čas` remains
  legitimate in its other meanings and in formal administrative time
  expressions.^7
- Infinitive and `da` + present are both part of standard Serbian. Choice depends
  on syntax, meaning, rhythm and avoidance of heavy repetition; neither should
  be replaced mechanically.^8
- Enclitics normally follow the first stressed word or phrase, cannot begin an
  independent sentence and must not be stranded after a marked pause.^9
- When `trebati` supplements another verb, the neutral construction is
  impersonal (`treba da`, `trebalo bi da`); personal forms are normal when the
  verb means “to need/be necessary”, with limited congruence-driven exceptions.^10

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
- Avoid English-influenced support verbs when Serbian has a direct predicate:
  prefer `usluga omogućava`, `organizujemo`, `može da obuhvati` or a direct
  active sentence over repeated `usluga podržava`.
- Do not use `kroz` as a mechanical translation of English *through* when time,
  means or procedure is intended. Prefer `tokom više vožnji`, `u ponudi`,
  `nakon pregleda` or `uz koordinaciju`, according to meaning.
- Distinguish location from stop. Use `lokacija`, `mesto preuzimanja`,
  `odredište` or `planirano zaustavljanje`; reserve `stanica` for an actual
  station or established public-transport stop.

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
- Use sentence case in headings and controls. All-uppercase display treatment
  belongs to CSS, not authored language, unless an abbreviation such as `VIP`,
  `SUV`, `FBO` or `NDA` requires capitals.
- Use `—` for a deliberate sentence break and `–` for ranges. Avoid using a
  slash to compress alternatives in customer-facing prose.
- Prefer one clear sentence to stacked nominal phrases. A premium tone comes
  from precise facts and calm syntax, not from superlatives, status language or
  repeated adjectives.

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
| internal capability wording | direct Serbian verb: `organizujemo`, `može da obuhvati`, `omogućava` | repeated `podržava` calques |
| service family | `usluga`, `usluge` | customer-facing `servis`, `servisi` |
| planned stop | `lokacija`, `planirano zaustavljanje` | generic `stanica` when no station is meant |

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

## Sources

1. Predrag Piper, Ivan Klajn and Rajna Dragićević. *Normativna gramatika
   srpskoga jezika*, 4th ed., Matica srpska, 2022; bibliographic confirmation in
   the Institute for the Serbian Language SANU,
   [*Južnoslovenski filolog* 81/1](https://www.isj.sanu.ac.rs/wp-content/uploads/2025/11/%D0%88%D0%A4_81_1-4.pdf),
   2025.
2. Institute for the Serbian Language SANU,
   [Standard Language Department](https://www.isj.sanu.ac.rs/odseci/odsek-za-standardni-jezik/),
   and the [Board for Standardization of the Serbian Language](https://www.ossj.rs/).
3. University of Belgrade Faculty of Philology,
   [*Savremeni srpski jezik 2*](https://www.fil.bg.ac.rs/sr-lat/fis/karton_predmeta/2101515),
   course specification and bibliography.
4. Milan Ajdžanović,
   [*Standardni srpski jezik 2: Morfologija*](https://digitalna.ff.uns.ac.rs/sadrzaj/2022/978-86-6065-706-2),
   University of Novi Sad Faculty of Philosophy, 2022.
5. Tvrtko Prćić et al.,
   [*Srpski rečnik novijih anglicizama*](https://digitalna.ff.uns.ac.rs/sadrzaj/2021/978-86-6065-636-2),
   University of Novi Sad Faculty of Philosophy, 2021.
6. Institute for the Serbian Language SANU and partners,
   [Raskovnik dictionary platform](https://raskovnik.org/).
7. Board for Standardization of the Serbian Language,
   [decision on `sat` and `čas`](https://www.ossj.rs/odluke-i-saopstenja/bosnjacki-ili-bosanski-jezik-sat-ili-cas-jevrejski-hebrejski-jezik-ili-ivrit/).
8. Board for Standardization of the Serbian Language,
   [decision on the infinitive and `da`-construction](https://www.ossj.rs/odluke-i-saopstenja/o-odnosu-izmedju-da-konstrukcije-i-infinitiva-u-srpskom-jeziku/).
9. Board for Standardization of the Serbian Language,
   [decision on enclitic placement](https://www.ossj.rs/odluke-i-saopstenja/mesto-enklitike-u-recenici/).
10. Rada Stijović, Institute for the Serbian Language SANU,
    [guidance on `trebati`](https://jezikofil.rs/sta-treba-znati-o-glagolu-trebati-ili-sta-cemo-sa-trebati/).
