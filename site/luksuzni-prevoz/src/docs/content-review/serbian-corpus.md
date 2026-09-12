# Serbian Corpus Review

> **Historical audit, superseded 12 September 2026.** The Serbian proposals were
> applied and followed by English/Russian review. See
> [serbian-language-reference.md](serbian-language-reference.md) and
> [FINAL-REVIEW.md](FINAL-REVIEW.md) for the current corpus state.

## Scope and method

This pass reconciles all 15 Serbian page entries, the Serbian navigation-label
map, all 681 Serbian UI dictionary entries, and the strings actually composed by
the current page renderers. English and Russian wording was not reviewed. Their
files were inspected only when needed to confirm lifecycle/parity behavior.

## Approved language rules

| Area | Corpus rule | Replace/avoid |
|---|---|---|
| Primary service noun | `prevoz` | Generic `transport` in customer prose |
| Product noun | `usluga` | `servis` when it means a customer offering |
| Chauffeur product | `Privatni vozač` or `vozilo sa profesionalnim vozačem` | `Private Chauffeur` in Serbian copy |
| Airport family | `aerodromski prevoz` | `aerodromski transport`; unexplained `FBO/handler` |
| Event family | `prevoz za posebne prilike` | `specijalni događaji` as the family name |
| Vehicle classes | `limuzina`, `kombi`; `kombi vozilo/vozila` where a category noun is needed; canonical `Mercedes-Benz S-Class/E-Class/V-Class` and `Sprinter` | `sedan`, `van`, `vanovi`, `minivan`, bare `S/E/V klasa` |
| Availability | `raspoloživost` | Mixed `dostupnost` for vehicles/services; retain `dostupan` for UI availability only where natural |
| E-mail | Owner-approved house style: `e-mail`, `e-mail adresa` | `e-pošta`, `adresa e-pošte`, mixed spellings |
| Optional fields | `(nije obavezno)` | `(opciono)` when space permits |
| Complex journey | `raspored`, `raspored putovanja`, or `redosled vožnji` where time/order matters; `plan prevoza` for broader organization | `itinerer`, `operativni kontekst`, `model angažovanja` |
| Voice | Polite plural: `Pošaljite`, `Zatražite`, `Pogledajte`, `Saznajte` | Mixed singular imperatives |

## CTA integrity model

| Intent | Serbian label |
|---|---|
| Enter the booking planner | `Započnite rezervaciju` |
| Submit a request | `Pošaljite zahtev` plus useful context where needed |
| Advance within the planner | `Nastavite` / `Nastavite rezervaciju` |
| Request individual pricing | `Zatražite ponudu` |
| Visit an information route | `Pogledajte vozila` or `Saznajte više` |
| Contact without a form promise | `Kontaktirajte nas` |

No marketing CTA may imply that a reservation is confirmed. The in-form
confirmation note remains explicit: submitting creates a request, and the team
confirms it only after review.

## Shared Serbian UI findings

| Priority | Exact key/surface | Current issue | Approved proposal |
|---|---|---|---|
| P0 | `nav.breadcrumb` | `Mrve` is a literal translation and an unacceptable accessible name. | `Putanja stranice` |
| P0 | `home.title` used in breadcrumbs/404 | `Dobrodošli` labels the Home route incorrectly. | `Početna` |
| P0 | `contact.officeNote` in Contact and every footer | Unsupported two-hour response promise. | `Na poruke odgovaramo tokom radnog vremena.` |
| P0 | Business/global navigation | Header exposes links to Corporate and Conference scaffold routes that production does not emit. | Hold the Business hub/navigation exposure until the two routes are activated, or revise the locked navigation/hub contract. |
| P1 | `navigation-labels.sr.book` | `Rezerviši` implies confirmation and uses singular voice. | `Započnite rezervaciju` |
| P1 | `navigation-labels.sr.specialEvents` and Booking event keys | `Specijalni događaji` conflicts with the family’s Serbian editorial direction. | `Posebne prilike`; `Druga posebna prilika`; `Izaberite vrstu posebne prilike`. |
| P1 | Breadcrumb/footer location output | Canonical `Belgrade, Serbia` is printed on Serbian pages. | Add locale-aware display names `Beograd, Srbija` without changing canonical identity fields. |
| P1 | Pricing/Private Chauffeur keys | Multiple Serbian surfaces expose the English product label. | `Privatni vozač` / `najam vozila sa profesionalnim vozačem`. |
| P1 | Booking error/review states | Future promise, false saved-data claim, machine plural `sat(a)`, and incorrect `Procenjena paket cena`. | Use the exact replacements in `pages/booking.md`. |
| P1 | Contact unavailable/form states | Staging phrases `za pregled` and `biće/uskoro` expose implementation state. | Use current-state recovery copy; let the controller own availability. |
| P1 | Institutional client proof | English institution names and testimonial-like reliability claims on Serbian output. | Localized public display labels and factual relationship copy. |
| P1 | Privacy/confidentiality prose | Several surfaces describe data handling beyond the current approved legal/retention contract. | Describe service discretion only; review data-use language during form activation. |
| P2 | `fleet.class.sedan`, navigator labels | `Sedan`, `Vanovi`, and `Minivan` are inconsistent. | `Limuzina` and `Kombi vozila`; use `kombi` consistently for this vehicle category. |
| P2 | Carousel control labels | `Prethodna vozila` / `Sledeća vozila` sound like groups rather than one control movement. | `Prethodno vozilo` / `Sledeće vozilo`; review analogous review controls. |
| P2 | Authored arrow glyphs | Several localized quiet CTAs include `→`. | Store text only; component owns iconography. |
| P2 | Dormant future keys | `contact.form.unavailableAction: Slanje uskoro dostupno` and `airport.fare.pending: Cena uskoro` promise timing. | Remove if unused or use neutral current-state labels (`Slanje nije dostupno`, `Cena nije objavljena`). |
| P2 | Dormant legacy keys | `home.subtitle`, `home.cta`, `airport.title`, and `business.parentCompanyDescription` have no confirmed composed role or stale terminology. | Verify references, then remove or correct through the normal key-generation/parity workflow. |

## Repetition policy

Retain a fact only when it serves a different decision:

- Hero: proposition and next action.
- Overview: fast scope/capability scan.
- Narrative/process section: how the service works.
- Vehicle region: suitability, not another service definition.
- FAQ: objection or limitation not already obvious.
- Final CTA: minimum information needed to proceed.

Manual confirmation may repeat near price, submission, and the final action
because each guards a different incorrect inference. Duration, waiting, return,
multi-vehicle, schedule, and availability copy should not repeat in adjacent
regions merely to fill a locked layout.

## SEO handoff

- Keep Serbian route phrases in SEO titles: privatni vozač, aerodromski prevoz,
  poslovni/korporativni prevoz, prevoz delegacija, konferencije i kongresi,
  venčanje, matura, VIP prevoz, vozila, cene, kontakt.
- Re-run title/description review only after Serbian body/terminology approval.
- Retain `noindex` for Booking and all `in-review`/scaffold content.
- Do not publish the Business hub while its required child destinations remain
  unavailable.
- Do not translate SEO text until the final Serbian source is approved.

## Translation/application boundary

The current parity floor does not permit a Serbian-only production edit while
published EN/RU entries remain marked reviewed against the old digest. The
Serbian proposals therefore remain in review artifacts. After one owner
approval, the agent should update the Serbian source pack, review and update EN
and RU against that approved source, synchronize digests, and apply all locales
as one releasable batch.

## Final language gate

Every proposed replacement was re-read against `serbian-language-reference.md`.
The pass checks person and polite-plural voice, tense/aspect, case government,
agreement, Serbian word order, number-dependent forms, token resolution, and the
owner-approved vocabulary above. Dynamic quantities use plural-aware formatting
or neutral `h`, `min`, and `km` units instead of a fixed suffix.
