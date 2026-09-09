# Route: `fleet`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, indexable, `translationState: reviewed`
- Primary user task: understand the available chauffeured-vehicle range, choose a suitable category for passengers, luggage, and journey type, then start a truthful booking or quote request.
- Composed-surface sources: `fleet.sr.md`, `FleetPage.astro`, Fleet child components, `fleet.ts`, `fleet-page.ts`, `operations.ts`, `services.ts`, `content/ui/sr.json`, shared Header/FAQ/FinalCTA/Footer output.

## Blueprint and content-contract constraints

- Preserve six visual chapters in the locked S-Class, E-Class, Superb, Kodiaq, V-Class, Sprinter order.
- Vehicle identity, class, operator passenger capacity, pricing state, and availability conditions come from canonical data.
- Kodiaq capacity remains undisclosed and its price remains quote-only until owner-confirmed data exists.
- Do not add manufacturer specifications or imply that nominal passenger capacity guarantees luggage fit.
- Keep booking and quote actions; neither may imply immediate confirmation.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Six showcased model families and their order | `src/data/fleet-page.ts#fleetPageModels` and Fleet blueprint §2 | verified | Retain. |
| Published passenger counts | `src/data/fleet.ts#vehicles[].passengers` | verified | Values are rendered from data, not duplicated in prose. |
| Kodiaq is an SUV with no published capacity or numeric price | `fleet.ts#skoda-kodiaq` | verified | Keep the limitation, but explain it in customer language rather than repository terminology. |
| Specific requested model is checked before confirmation | `operations.ts#vehicles.requestedConfirmedModelGuaranteed` plus current manual-confirmation flow | conditional | Retain availability/confirmation qualification. |
| Child seat is available on request | `operations.ts#service.childSeatOnRequest` | verified | Retain request and pre-confirmation wording. |
| Multiple vehicles can be arranged | Per-service flags in `services.ts` | conditional | Keep “kod usluga koje podržavaju” qualification. |
| Superb has a spacious rear bench and favourable luggage-space relationship | No corresponding canonical Fleet field or cited owner source | unsupported | Replace with suitability wording that does not assert physical specifications. |
| Kodiaq provides easier upright entry and a more flexible cabin/luggage relationship | Canonical data verifies only identity and SUV class | unsupported | Remove the physical-feature claims unless owner evidence is added. |
| S-Class provides privacy as a vehicle feature | Blueprint supports discretion/representation, but Fleet data does not verify a privacy feature | conditional | Describe service experience and suitability; avoid implying privacy glass or a technical feature. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P1 | `fleet.sr.md#hero.title` | “po vašem standardu” is generic status language and does not identify the page task. | Blueprint requires the hero to establish Fleet and help visitors choose by journey. | Replace with `Vozila sa profesionalnim vozačem za različite vrste putovanja`. | high | Corpus H1/SEO alignment pass. |
| P1 | `fleet.sr.md#hero.primaryCta.label` and `finalCta.primaryCta.label` | “Rezerviši vožnju” can read as immediate confirmation although the real target starts a request that is manually confirmed. | CTA integrity rule; Fleet FAQ and booking flow explicitly require manual confirmation. | Preferred corpus label: `Započnite rezervaciju`. Keep the existing booking flow target. | high | Apply consistently across Serbian surfaces after corpus CTA review. |
| P1 | `fleet.sr.md#profiles.skodaSuperb` | Summary, best-for text, and highlights assert spacious rear seating and luggage characteristics absent from canonical data. | `fleet.ts` verifies identity, class, price status, and passenger count only. | Summary: `Nenametljiva poslovna limuzina za privatne i poslovne vožnje kada je važan miran, profesionalan nastup.` Best for: `Svakodnevne poslovne obaveze, aerodromske vožnje i privatna putovanja za do tri putnika, uz konačan izbor prema prtljagu i rasporedu.` Replace highlights with role-based points; do not describe unverified cabin dimensions. | high | None. |
| P1 | `fleet.sr.md#profiles.skodaKodiaq` | Copy asserts higher seating, easier entry, and cabin/luggage flexibility that are not verified by the data contract. | Fleet data contract explicitly limits known Kodiaq facts to identity, SUV class, null capacity, and quote-only pricing. | Summary: `SUV kao alternativa klasičnim limuzinama za putnike koji žele ovaj tip vozila.` Best for: `Privatna i poslovna putovanja kada se traži SUV, uz proveru broja putnika, prtljaga, cene i raspoloživosti pre potvrde.` Highlights: `SUV u kolekciji.` / `Za putnike koji žele SUV umesto limuzine.` / `Pre potvrde proveravamo broj putnika, prtljag, cenu i raspoloživost.` | high | Better copy becomes possible after owner-confirmed capacity/spec evidence. |
| P1 | `fleet.sr.md#faq.items[1].answer` and `[4].answer` | “operativni kapacitet”, “podaci flote” and especially “kanonski podaci” expose implementation concepts instead of answering customers directly. | Content skill requires familiar words and literal, useful answers. | Capacity answer: `Za vozila sa potvrđenim kapacitetom prikazujemo najveći broj putnika. Konačan izbor proveravamo i prema količini prtljaga.` Kodiaq answer: `Da. Kodiaq je SUV u našoj floti. Pošaljite broj putnika, količinu prtljaga i raspored putovanja. Pre potvrde proverićemo da li vozilo odgovara zahtevu. Proverićemo i cenu i raspoloživost.` | high | None. |
| P2 | `fleet.sr.md#fleetSection.heading.title`, hero/profile copy | “The Chauffeur Collection”, “Flagship”, “premium” and “vanovi” create an uneven Serbian register. Canonical model names may remain untranslated, but editorial headings need not be English. | Content guide distinguishes canonical display names from localized editorial copy. | Use `Kolekcija vozila`; replace `Flagship izbor kolekcije` with `Vodeći model kolekcije`; prefer `kombi vozila` or role-based wording where “van” is not a canonical model name. | high | Confirm corpus terminology once, then apply globally. |
| P2 | `fleet.sr.md#introSection` and several profile highlights | The heading is slogan-like, while summaries, best-for lines, and highlights often repeat the same suitability claim three times. | Blueprint assigns a distinct information role to summary, best-for, and highlights; skill requires each section to add information. | Heading: `Izbor vozila zavisi od putnika, prtljaga i rasporeda`. During application, keep summary = positioning, best-for = concrete use cases, highlights = non-duplicative decision cues. | high | Corpus repetition pass. |
| P2 | `content/ui/sr.json#fleet.profile.passengerCapacity` | “Kapacitet putnika” is understandable but institutional. | Customer task is choosing by actual party size. | Prefer `Broj putnika` if it remains semantically correct in all Fleet facts. | medium | Check all consumers of the shared key before applying. |

## Used Serbian UI strings

| Key | Assessment | Proposed action |
|---|---|---|
| `fleet.navigator.ariaLabel` | Clear and descriptive. | Retain. |
| `fleet.navigator.sedans` | Natural category label. | Retain. |
| `fleet.navigator.suv` | Established category label. | Retain. |
| `fleet.navigator.groupTransport` | Clear. | Retain. |
| `fleet.class.*` | Mostly clear; `van` → “Kombi” is appropriate customer wording. | Retain. |
| `fleet.profile.vehicleClass` | Clear. | Retain. |
| `fleet.profile.configurations` | Accurate but repeated as two identical `<dt>` labels. | Content is acceptable; presentation issue is outside this review. |
| `fleet.profile.passengerCapacity` | Slightly institutional. | Consider `Broj putnika` after consumer check. |
| `fleet.profile.quoteOnly` | Clear and truthful. | Retain. |
| `fleet.vClass.configuration.six/seven` | Clear, facts match canonical passenger counts. | Retain. |
| `fleet.profile.bestFor` | Natural enough, but profile content must actually provide distinct use cases. | Retain. |
| `fleet.passengers` | Correct with the currently rendered values 3, 6, 7, and 19. | Retain; recheck if interpolation expands to other counts. |

Global navigation, contact affordances, and footer strings are deferred to the shared Serbian UI pass rather than re-audited on every page.

## Page-level conclusions

- Scope and audience: complete; the six-family offer and decision context are understandable.
- Coordination/process clarity: strong, particularly around passenger/luggage fit and manual confirmation.
- Limitations and qualification: structurally correct; Kodiaq limitations need customer-facing wording.
- CTA integrity: target is correct, but the Serbian label should describe starting a request rather than completed reservation.
- Retained intentional repetition: passenger count plus luggage appears in hero, fit guide, FAQ, and CTA because it affects distinct decisions at each point.
- Content input required: none to publish safer copy. Owner-confirmed Kodiaq capacity and pricing would enable more specific future content but are not required for this review.
- SEO handoff: reassess visible H1/`seoTitle` alignment after the clearer H1 is approved; do not add vehicle/location repetition merely for keywords.
- Recommended disposition: approve after the P1 replacements and corpus CTA/terminology decisions are incorporated into the Serbian source pack.
