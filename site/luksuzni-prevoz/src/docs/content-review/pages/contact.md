# Route: `contact`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, indexable, `translationState: reviewed`
- Primary user task: find a verified direct contact channel or send a short general question without mistaking this form for booking, availability, or quotation.
- Composed-surface sources: `contact.sr.md`, `ContactPage.astro`, `ContactDetails.astro`, `ContactForm.astro`, controller and validation contract, `contact.ts`, used `contact.*` and shared form Serbian UI keys, forms rollout plan, shared Header/Footer output.

## Blueprint and content-contract constraints

- The page has one concise introduction and a two-part contact region: verified details first, general-question form second.
- The form is not a booking, itinerary, availability, or quote form.
- Phone, email, address, office hours, and verification status remain data-derived.
- The locked Contact blueprint still defines a validation-only release. The newer forms plan says repository submission code is implemented but external Cloudflare/Turnstile/D1/Brevo activation remains incomplete and may supersede deferred-submission copy only after blueprint/acceptance updates.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Phone, email, office address, and daily 08:00–18:00 hours are current | `contact.ts` verified fields | verified | Retain data ownership; do not copy values into prose. |
| The team usually responds within two working-hours | `content/ui/sr.json#contact.officeNote` only | unsupported | No verified SLA or response-time field supports this promise. Replace unless the owner verifies it and data ownership is added. |
| Online submission is not currently enabled | Locked Contact blueprint plus forms plan external rollout status | verified for current release, conditional on deployment | Copy must change atomically when production activation is authorized. |
| Repository has a same-origin contact submission implementation | `ContactForm.astro`, controller, `functions/api/forms/contact.ts` | verified implementation, not proof of live deployment | This is an authority/readiness mismatch outside editorial scope. |
| A submitted question receives a reference and remains separate from booking | Form response contract and Contact blueprint | verified | Retain only while the endpoint is activated and functioning. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P0 | `content/ui/sr.json#contact.officeNote` | “Obično odgovaramo u roku od 2 sata” is a material response-time promise without a verified operational source. It is also repeated in the site footer. | `contact.ts` stores the translation key but no verified response SLA; the blueprint does not authorize a two-hour claim. | Replace with evidence-safe `Na poruke odgovaramo tokom radnog vremena.` If the two-hour target is contractually verified, model it as a verified operational field before restoring the claim. | high | Owner verification only if the stronger promise is desired. |
| P1 | Contact blueprint/acceptance versus current submission implementation and `contact.sr.md` | Locked authority and page copy say validation-only, while repository code can POST when configured. The deployment plan says external activation is still pending and requires blueprint updates first. | Blueprint §§4, 6–7, 12; forms plan status and Phase 0 condition; controller `fetch()` path. | Keep current unavailable meaning for now. Before any Turnstile/site activation, update the locked blueprint/acceptance and activation-specific Serbian copy in the same release. Treat this as a release blocker, not an editorial guess. | high | Forms activation decision outside this audit. |
| P1 | `contact.sr.md#contact.formIntro` | “pripremljen za vizuelni pregled” exposes implementation/review process to customers; “biće omogućeno” is an unsupported future promise. | Current missing-key state already produces an explicit unavailable status; no public activation date exists. | Replace with evergreen task copy: `Opišite ukratko svoje pitanje i ostavite podatke putem kojih možemo da odgovorimo.` Let the live form status state whether sending is available. | high | None. |
| P1 | `contact.sr.md#introSection.body` | The sentence about avoiding automated confirmations is defensive implementation language and does not help users choose a channel. | Direct phone/e-mail and hours are already rendered from verified data. | Replace with `Pozovite nas ili pošaljite e-mail za pitanja o uslugama, organizaciji prevoza i poslovnoj saradnji.` | high | None. |
| P1 | `ContactDetails.astro` composed Serbian address | Serbian output displays canonical English `Belgrade, Serbia`, producing a mixed-language address. | `contact.ts` stores one raw city/country value and the component prints it for every locale. | Add an approved localized city/country presentation boundary (for Serbian: `Beograd, Srbija`) while retaining canonical facts and structured-data alignment. | high | Small data/component contract change; outside copy-only application. |
| P1 | `content/ui/sr.json#contact.form.unavailableStatus` | “dostupan za pregled” again exposes staging intent and makes the disabled form sound like a demo. | The controller displays this state when no Turnstile key exists. | Replace with `Onlajn slanje trenutno nije dostupno. Pozovite nas ili nam pišite na e-mail adresu.` This can match the existing service-unavailable message. | high | Coordinate with forms activation. |
| P2 | `contact.sr.md#intro` | “obratite se našem timu u Beogradu” is correct but repeats the service categories immediately below. | H1, intro, and details heading occupy consecutive regions. | Tighten to `Za pitanja o uslugama i organizaciji prevoza obratite se našem timu u Beogradu.` | high | None. |
| P2 | `content/ui/sr.json#contact.form.phone` | “(opciono)” should follow the corpus convention chosen for Booking and other forms. | Same qualifier occurs across shared form copy. | Prefer `(nije obavezno)` if responsive review confirms fit. | medium | Corpus terminology and responsive review. |
| P2 | `content/ui/sr.json#contact.form.error.phone` | The validation example repeats the actual public business number, blurring an input example with the company’s contact fact and duplicating operational data in UI copy. | Exact number is already canonically owned by `contact.ts`. | Replace with `Unesite ispravan broj telefona sa pozivnim brojem.` | high | None. |
| P2 | `content/ui/sr.json#contact.form.error.messageLength` | The string hardcodes limits also owned by `CONTACT_FORM_LIMITS`, creating drift risk. | Inputs and validation derive 10/3000 from the TypeScript contract, but the message does not. | Add `{min}` and `{max}` interpolation from `CONTACT_FORM_LIMITS`, then use `Pitanje mora imati između {min} i {max} znakova.` | high | Small component/controller contract change. |

## Used Serbian UI strings

| Key group | Assessment | Proposed action |
|---|---|---|
| `contact.details.*` and `contact.details.everyDay` | Clear and appropriately literal. | Retain. |
| `contact.officeNote` | Unsupported response SLA with footer-wide impact. | Replace with verified working-hours wording or model a verified SLA. |
| Core `contact.form.*` labels and hints | Plain and task-focused. | Normalize the optional-field qualifier only at corpus level. |
| Submission states | Success, reference, Turnstile, rate-limit, and server states are restrained and actionable. | Retain; coordinate unavailable wording with deployment state. |
| Validation errors | Generally clear and inclusive of Unicode names. | Remove the real contact number from the phone example; derive message bounds. |

Global navigation and other footer strings remain assigned to the shared Serbian UI pass. The `contact.officeNote` exception is included here because it is a Contact-owned fact rendered on this page and site-wide.

## Page-level conclusions

- Scope and audience: the page correctly separates general questions from booking and quotation.
- Coordination/process clarity: direct channels are clear; staging-oriented form prose must be replaced with customer language.
- Limitations and qualification: form availability has a documented cross-artifact lifecycle risk; current disabled behavior is explicit.
- CTA integrity: standardize the accurate submission label to polite plural: `Pošaljite pitanje`.
- Retained intentional repetition: phone and e-mail appear in details and failure recovery because the latter remains actionable when online submission fails.
- Content input required: only if the owner wants to retain the two-hour response claim. The safe recommendation requires no input.
- SEO handoff: metadata is relevant, though “luksuznom prevozu” should follow the final corpus brand/service terminology decision.
- Recommended disposition: Serbian wording can be approved with the safe response-hours replacement. Address localization and form-limit interpolation should be queued as bounded technical dependencies; production activation remains a separate authority/deployment decision.
