# Route: `booking`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, intentionally `noindex`, `translationState: reviewed`
- Primary user task: select a concrete service, describe the journey, choose or request a vehicle recommendation, understand the commercial state, review the request, and use the currently available submission or recovery path without assuming confirmation.
- Composed-surface sources: `booking.sr.md`, `BookingPage.astro`, `BookingWizard.astro`, controller, booking validation/pricing helpers, `booking.ts`, `contact.ts`, `services.ts`, `pricing.ts`, `fleet.ts`, `operations.ts`, used `booking.*` Serbian UI keys, forms rollout plan, shared Header/Footer output.

## Blueprint and content-contract constraints

- The page is a request planner, not checkout, payment, dispatch, or instant confirmation.
- Service, journey, vehicle, and review remain the four steps.
- Prices, capacities, lead time, time zone, and service rules remain data-derived.
- Manual confirmation applies to the vehicle, commercial result, availability, and reservation.
- The locked Booking blueprint still defines a validation-only release. The newer forms plan says repository submission code is implemented but external Cloudflare/Turnstile/D1/Brevo activation remains incomplete and may supersede deferred-submission copy only after blueprint/acceptance updates.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Requests must meet a 24-hour public minimum lead time | `contact.ts#bookingLeadTime.publicMinimumHours` | verified | Value is interpolated; avoid hardcoding. |
| Times are interpreted in Europe/Belgrade | `contact.ts#bookingLeadTime.timeZone` | verified | Retain explicit note. |
| Online submission is not currently enabled | Locked Booking blueprint plus forms plan external rollout status | verified for current release, conditional on deployment | Copy must change atomically when production activation is authorized. |
| Repository has a same-origin booking submission implementation | `BookingWizard.astro`, `booking-controller.ts`, `functions/api/forms/booking.ts` | verified implementation, not proof of live deployment | This is an authority/readiness mismatch outside editorial scope. |
| Submission creates a request pending manual confirmation | `contact.ts#confirmationMode`, forms response contract | verified | Retain in all active/future states. |
| Fixed/calculated/estimated/quote-required commercial results are possible | Booking blueprint and `booking.ts#BookingPricingResult` | verified | Keep distinctions understandable and qualified. |
| Child seat is available on request | `operations.ts#service.childSeatOnRequest` | verified | Field is rendered conditionally from data. |
| Unknown vehicle capacity can receive manual review | Booking blueprint §8 and nullable `fleet.ts#passengers` | verified | Explain in customer language. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P1 | Booking blueprint/acceptance versus current submission implementation and `booking.sr.md` | Locked authority and current copy say validation-only, while repository code can POST when configured. The deployment plan says external activation is still pending and requires blueprint updates first. | Blueprint §§1, 11, 17–18; forms plan status and Phase 0 condition; controller `fetch()` path. | Keep current unavailability meaning for now. Before any Turnstile/site activation, update the locked blueprint/acceptance and replace validation-only Serbian copy in the same release. Treat this as a release blocker, not an editorial guess. | high | Forms activation decision outside this content audit. |
| P1 | `booking.sr.md#booking.assuranceTitle` | “Pre nego što nastavite” is rendered after the wizard, so its temporal instruction does not match placement. | `BookingPage.astro` renders the assurance section below `BookingWizard`. | Replace with `Kako potvrđujemo zahtev`. | high | None. |
| P1 | `booking.sr.md#booking.heading.intro` | “pre nego što nas kontaktirate” is tied to the temporary direct-contact phase and will become stale when submission activates. | Forms rollout explicitly anticipates live submission without changing page topology. | Replace with evergreen copy: `Tražimo samo podatke potrebne za izabranu uslugu. Sve možete pregledati i izmeniti pre poslednjeg koraka.` | high | None. |
| P1 | `content/ui/sr.json#booking.review.intro` | “biće omogućeno kasnije” is a future promise and will become false immediately upon activation. | External activation has no committed public date; skill prohibits unsupported timing promises. | Current release: `Proverite podatke i unesite podatke za kontakt. Onlajn slanje trenutno nije dostupno; za nastavak nas kontaktirajte direktno.` Replace again with neutral send instruction when activation is approved. | high | Forms activation lifecycle. |
| P1 | `content/ui/sr.json#booking.error.hourlyMinimum` | `{hours} sat(a)` is visibly machine-like and not acceptable native-facing Serbian. | Current interpolation supplies `1`; the template must remain safe if the data changes. | Replace with `Minimalno trajanje najma je {hours} h.` Preserve `{hours}`. | high | None. |
| P1 | `content/ui/sr.json#booking.price.estimate` | “Procenjena paket cena” has incorrect word order. | Serbian language quality. | Replace with `Procenjena cena paketa`. | high | None. |
| P1 | `content/ui/sr.json#booking.status.error` | The error claims entered transport data was saved, while persistent recovery deliberately excludes addresses, free text, contact data, flight number, and notes. | Booking privacy contract and `BookingDraft` persistence filter. | Replace with `Zahtev nije poslat. Proverite podatke i pokušajte ponovo.` | high | None. |
| P1 | `content/ui/sr.json#booking.vehicle.capacityOnReview` | “Kapacitet se potvrđuje uz zahtev” is vague and uses operational jargon for a vehicle with unknown published capacity. | Kodiaq capacity is null; manual review remains valid. | Replace with `Broj putnika za ovo vozilo proverićemo pre potvrde.` | high | None. |
| P2 | `booking.sr.md#intro` | “prikazuju primenljivu cenu” is formal and abstract. | User needs to understand what the planner can show. | Replace sentence with `Za jednostavnije zahteve prikazaćemo cenu ili procenu, dok za složenije rasporede pripremamo individualnu ponudu.` | high | Harmonize “procena” terminology with Pricing. |
| P2 | `content/ui/sr.json#booking.airport.scopeHint` | “područje za kraj vožnje koji nije aerodrom” is grammatically awkward and requires decoding direction. | The field applies to the non-airport point in either direction. | Replace with `Izaberite područje druge tačke putovanja, odnosno polaska ili odredišta koje nije aerodrom.` | high | Check available line length in rendered fieldset. |
| P2 | `content/ui/sr.json#booking.service.airportHint` | “Aerodrom Beograd” is inconsistent with the canonical customer-facing airport name elsewhere. | Pricing uses “Aerodrom Nikola Tesla”; service data identifies Belgrade Nikola Tesla. | Replace with `Dolazak sa Aerodroma Nikola Tesla ili odlazak na aerodrom.` | high | Corpus airport naming decision. |
| P2 | `content/ui/sr.json#booking.leadTime.note` | “Javni zahtev” sounds institutional. | The rule applies to any request through this flow, and one fixed noun form would fail for values such as 1, 2, 21, and 24. | Replace with `Pošaljite zahtev najmanje {hours} h pre željenog početka.` Preserve `{hours}`. | high | Use plural-aware formatting if a full word replaces `h`. |
| P2 | Optional field labels across `booking.field.*` | Repeated “(opciono)” is understandable but less natural than “nije obavezno”. | Native-facing Serbian clarity. | Prefer a single corpus convention, likely `(nije obavezno)`, after checking responsive fit for all labels. | medium | Responsive text review. |
| P2 | `booking.sr.md#assuranceBody` and `booking.status.submissionUnavailable` | Both repeat online unavailability and direct contact at the end of the same flow. | Repetition is currently partly functional, but the assurance should focus on manual confirmation. | Assurance body: `Raspoloživost, izbor vozila, cena i konačna organizacija potvrđuju se ručno nakon pregleda zahteva.` Let the status own channel availability. | high | Forms activation lifecycle. |

## Used Serbian UI strings

The full current planner consumes most `booking.*` keys. High-value conclusions are grouped to avoid duplicating 160+ rows.

| Key group | Assessment | Proposed action |
|---|---|---|
| `booking.progress.*`, `booking.step.*`, navigation actions | Clear, concise, and accessible. | Retain. |
| `booking.action.requestBooking/requestQuote` | Accurately describes a request rather than confirmation. | Use as the corpus model for marketing CTAs. |
| `booking.service.*` | Structure and labels are clear. | Correct Airport naming; settle “specijalni” versus “posebni” globally. |
| `booking.journey.*`, core field labels | Mostly clear and literal. | Improve Airport scope hint and optional-field convention. |
| `booking.vehicle.*` | Strong selection and availability qualification. | Replace vague unknown-capacity wording. |
| `booking.price.*` | Commercial states are appropriately distinct. | Correct `estimate`; simplify package detail to `{hours} h · uključeno do {kilometers} km` if layout review supports it. |
| `booking.confirmation.note` | Excellent distinction between submission and confirmation. | Retain. |
| `booking.status.*` | Success/verification states are restrained and actionable. | Remove the overbroad saved-data claim; coordinate activation-specific states. |
| `booking.error.*` | Generally literal and useful. | Correct the hourly plural workaround; use the approved `e-mail` house style consistently. |
| `booking.quote.reason.*` | Concise and traceable to resolver reasons. | Retain. |

Global navigation and footer strings remain assigned to the shared Serbian UI pass.

## Page-level conclusions

- Scope and audience: the planner covers the complete current catalogue without pretending to be checkout.
- Coordination/process clarity: strong four-step structure; several temporary-release messages should be made evergreen where possible.
- Limitations and qualification: manual confirmation is excellent; submission availability has a documented cross-artifact lifecycle risk.
- CTA integrity: the in-form request action is the best current truth model; standardize its label as `Pošaljite zahtev za rezervaciju`, which is more accurate than marketing-page `Rezerviši vožnju`.
- Retained intentional repetition: manual confirmation appears in price, review, and assurance contexts because each guards a different inference.
- Content input required: none for Serbian wording. Production form activation requires an authorized blueprint/deployment decision, not an editorial fact.
- SEO handoff: retain `noindex`; metadata accurately describes the planner and should be revisited only if the release posture changes.
- Recommended disposition: Serbian copy can be approved with the proposed language changes, while the forms lifecycle mismatch remains an explicit activation blocker outside this audit.
