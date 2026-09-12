# Route: `airportTransportation`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, indexable, `translationState: reviewed`
- Primary user task: understand the airport arrival/departure service, begin a request with flight details, choose a suitable vehicle, and understand waiting, price, and manual confirmation.
- Composed-surface sources: `airport-transportation.sr.md`, locked v3 blueprint, `AirportTransportationPage.astro`, `AirportBookingBlock.astro`, timeline and shared service components, `services.ts`, `pricing.ts`, `operations.ts`, used `airport.*`, fleet, and service-standard Serbian UI keys, shared Header/Footer output.

## Blueprint and content-contract constraints

- The page is a private point-to-point airport service with a compact, state-preserving booking start—not a calculator or dead form.
- Flight tracking, meet and greet, luggage support, name sign, waiting, commercial/private aviation, and FBO coordination render only from verified capabilities.
- Vehicle-specific airport fares render from shared pricing and apply only to the validated route scope.
- Every request remains subject to availability and manual confirmation.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Service covers Belgrade Nikola Tesla Airport, one way or return | `services.ts#airportTransportation` | verified | Use the full customer-facing airport name consistently. |
| Flight tracking, meet and greet, luggage assistance, and optional name sign | `services.ts` capability flags | verified | Current overview and timeline are data-gated. |
| Standard waiting is 60 minutes after landing | `services.ts#standardWaitingMinutesAfterLanding` | verified | Rendered by interpolation; FAQ should state the number or clearly link to the same rule. |
| Private aviation and FBO coordination are supported | `services.ts` capability flags | verified | Do not imply guaranteed airside/private-terminal access. |
| Airport prices are vehicle-specific | `pricing.ts` and page adapter | verified | Cards use shared EUR values; scope remains Airport ↔ Belgrade city. |
| Form values continue into the detailed booking flow | GET query in `AirportBookingBlock` and booking hydration | verified | Describe as transferred/prefilled, not generically “saved”. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P1 | Hero and Final CTA primary labels | `Rezerviši aerodromski prevoz` implies completed reservation. | Blueprint §2 and `contact.ts#confirmationMode`. | Replace with `Započnite rezervaciju`; the compact form may retain `Nastavite rezervaciju` because it explicitly advances to review. | high | Corpus CTA decision. |
| P1 | `content/ui/sr.json#airport.booking.form.handoffNote` | `Podaci će biti sačuvani` suggests persistence/storage; implementation transfers values in the query to prefill the detailed flow. | `AirportBookingBlock.astro` submits GET parameters. | Replace with `Podaci će biti preneti u sledeći korak.` | high | None. |
| P1 | Arrival FAQ waiting answer | The page has a verified numeric waiting allowance but the FAQ says only “standardni period”, making an important limit opaque. | `standardWaitingMinutesAfterLanding: 60` already drives Overview; a fixed full-word suffix would not remain correct for every possible value. | Interpolate the same value: `Standardno čekanje traje {minutes} min nakon sletanja. Ako očekujete duže zadržavanje...` Extend the same safe interpolation used in Overview. | high | Use plural-aware formatting if `minut` is written in full. |
| P1 | `sections.privateAviationFbo` terminology | `FBO`, `handler` and `VIP transportni servis` are unexplained industry/English terms in customer-facing Serbian. | Blueprint requires high-value capability but does not require untranslated jargon. | On first mention use `operator privatnog terminala (FBO)`; use `zemaljski operater` thereafter; replace `VIP transportnim servisom` with `uslugom VIP prevoza`. | high | Confirm preferred aviation terminology only if owner has an established house style; safe default available. |
| P1 | `airport.timeline.luggage.text` | “bez nepotrebnog zadržavanja” is an unbounded speed/efficiency promise. | Data verifies assistance, not processing or terminal timing. | Replace with `Po susretu sa vozačem pružamo pomoć sa prtljagom i nastavljamo do vozila.` | high | None. |
| P2 | Page and UI terminology | Page uses `aerodromski prevoz`, while shared UI title uses `Aerodromski transport`. | Serbian corpus should choose one primary service name. | Standardize customer-facing navigation/UI on `Aerodromski prevoz`; retain `transport` only where it has a deliberate broader-system meaning. | high | Corpus terminology pass. |
| P2 | `content/ui/sr.json#airport.overview.transfer.text` | `od preuzimanja do odredišta` is tautological after “direktan transfer”. | Capability is simply one-way/return point-to-point. | Replace with `Jednosmerna ili povratna vožnja između aerodroma i dogovorene adrese.` | high | Keep scope aligned with pricing/location rules. |
| P2 | `content/ui/sr.json#airport.overview.arrival.title` | `Praćen dolazak` is ambiguous—it can describe the arrival rather than flight monitoring. | Body specifies flight tracking. | Replace with `Praćenje leta`. | high | None. |
| P2 | `content/ui/sr.json#airport.overview.assistance.text` and FAQ | `oznaka sa imenom` is understandable but less natural than the established airport phrase. | Capability `nameSign` is verified. | Prefer `tabla sa imenom`, qualified as `kada je dogovorena u potvrđenom zahtevu`. | medium | Corpus terminology. |
| P2 | `hero.supportText`, Overview, Arrival section | Three consecutive regions repeat coordination, flight, meeting point, and onward journey. | Composed page places these before the booking block. | Keep Hero as the promise, Overview as scannable capabilities, and Arrival as the step-by-step explanation. Remove duplicate “jedan povezan tok” and “ključni detalji” setup sentences. | high | Coordinated page edit. |
| P2 | `vehicleRecommendations.heading.intro` | `V klasa` lacks canonical model styling and “grupno vozilo” is vague. | Fleet uses Mercedes-Benz V-Class and Sprinter canonical display names. | Replace with `Od reprezentativne limuzine do kombi vozila Mercedes-Benz V-Class ili Mercedes-Benz Sprinter, preporuku biramo prema broju putnika i vrsti putovanja.` | high | Fleet naming pass. |
| P2 | `content/ui/sr.json#airport.booking.form.flightNumberOptional` | `(opciono)` should follow the corpus form convention. | Same qualifier occurs in Booking and Contact. | Prefer `(nije obavezno)` if responsive review confirms fit. | medium | Corpus terminology and responsive review. |

## Used Serbian UI strings

| Key group | Assessment | Proposed action |
|---|---|---|
| Section labels | Clear and appropriately restrained. | Change shared title `Aerodromski transport` to the chosen service term. |
| Overview capability copy | Correctly gated and concise. | Improve three phrases without changing fact scope. |
| Booking-start labels and notes | Task is clear and form handoff is functional. | Replace persistence implication and normalize optional qualifier. |
| Timeline | Sequence is strong and capability-backed. | Remove the unsupported no-delay implication. |
| Fare label | Accurate because value and currency are data-derived. | Retain; ensure pricing scope stays adjacent or otherwise clear in the card/page contract. |

## Page-level conclusions

- Scope and audience: the page covers commercial and private aviation without claiming aviation operations.
- Coordination/process clarity: the journey sequence and booking handoff are clear; jargon is the primary comprehension barrier.
- Limitations and qualification: manual confirmation is explicit, but the waiting allowance should be concrete in FAQ.
- CTA integrity: distinguish starting/continuing a request from confirmation.
- Retained intentional repetition: flight tracking may appear in Overview, timeline, and delay FAQ because each serves discovery, process, and objection handling.
- Content input required: none; owner terminology input is optional because safe Serbian defaults are available.
- SEO handoff: title/description are focused; final SEO review should confirm the chosen `aerodromski prevoz` terminology across navigation and metadata.
- Recommended disposition: approve after terminology cleanup, explicit data-derived waiting copy, and coordinated reduction of the opening-section repetition.
