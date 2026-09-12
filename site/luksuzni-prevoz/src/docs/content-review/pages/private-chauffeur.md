# Route: `privateChauffeur`

## Scope

- Mode: audit/proposal
- Reviewed locale: Serbian Latin (`sr`)
- Production content changed: no
- Route/content status: published, indexable, `translationState: reviewed`
- Primary user task: understand how time-based chauffeur hire differs from a transfer, choose a suitable duration and vehicle, and send a request subject to manual confirmation.
- Composed-surface sources: `private-chauffeur.sr.md`, locked v3 blueprint/content contract, `PrivateChauffeurPage.astro`, page-local components, `services.ts`, `operations.ts`, `fleet.ts`, used `privateChauffeur.*`, `service.privateChauffeur.*`, booking, fleet, and service-standard Serbian UI keys, shared Header/Footer output.

## Blueprint and content-contract constraints

- The service combines a fleet vehicle, professional chauffeur, reserved period, and confirmed itinerary; it is not a point-to-point transfer or driver-only service.
- Hourly, half-day, and full-day facts are interpolated from `services.ts`; multi-day and international plans require a quote.
- The long locked section order and the distinction between booking, quote, and manual confirmation remain unchanged.
- Serbian is the canonical source; this pass proposes editorial changes without modifying source digests or translations.

## Claim ledger

| Claim | Source file/field | Status | Notes/action |
|---|---|---|---|
| Minimum one-hour, 5 h/100 km half-day, and 10 h/200 km full-day formats | `services.ts#privateChauffeurService.bookingOptions` | verified | Rendered by interpolation; retain data ownership. |
| Chauffeur remains available and multiple planned stops are supported | `services.ts` capability fields | verified | Always qualify by the confirmed reserved period. |
| Schedule changes are subject to availability within the reserved period | `services.ts#scheduleChangeHandling` | verified | Current FAQ qualifies this correctly. |
| Multi-day and international plans require individual review/quote | `services.ts#multiDay`, `international` | verified | Avoid opening with an unqualified “Da”. |
| Chauffeur handles parking/arrival logistics | `operations.ts#parkingLogisticsHandledByChauffeur` | verified | Current benefit statement is supported. |
| Work, calls, reading, and rest are possible in transit | Editorial benefit, not an operational guarantee | reasonable with qualification | Present as options, never guaranteed productivity or privacy. |

## Findings and proposed replacements

| Priority | Exact file/field | Issue | Repository evidence | Proposed replacement/action | Confidence | Dependency |
|---|---|---|---|---|---|---|
| P1 | Hero and Final CTA primary labels | `Rezerviši privatnog vozača` implies completed reservation, although every request remains pending manual confirmation. | Blueprint §3 and `contact.ts#confirmationMode`. | Replace with `Započnite rezervaciju`; preserve the service query in the booking-flow target. | high | Corpus CTA decision. |
| P1 | Page-wide composition | The same idea—vehicle and chauffeur stay tied to a confirmed schedule—is restated across Hero, Overview, three middle sections, FAQ, and CTA. The Serbian source alone uses forms of “raspored” 17 times and “potvrđen” 11 times. | Composed page order and source count. | Assign one job to each region: definition in Overview, time benefit in `timeRemainsYours`, continuity in `oneChauffeurOneSchedule`, friction removed in the editorial statement, comfort/privacy in passenger experience. Remove repeated setup sentences while preserving locked regions. | high | Apply as a coordinated page edit, not isolated substitutions. |
| P1 | `sections.timeRemainsYours` | Intro, body, and three items repeat the same productivity list; “kabina ostaje vaš prostor” later suggests stronger privacy than the service guarantees. | Operations verifies discretion training, not exclusive acoustic/privacy conditions. | Intro: `Između obaveza možete da nastavite sa svojim danom dok vozač vodi računa o putu.` Body: `Vreme u vozilu možete iskoristiti za pripremu, poziv ili predah.` Keep three items only if each adds distinct practical value. | high | None. |
| P1 | `sections.passengerExperience` | Heading “Spremni kada treba da krenete” is grammatically mismatched with singular `Mir`; body duplicates the preceding time-benefit section. | Serbian grammar and composed repetition. | Heading: `Mir kada vam je potreban. Polazak prema dogovorenom rasporedu.` Body: `Tokom angažovanja vozač prati dogovoreni raspored, a nivo komunikacije prilagođava putniku.` | high | Confirm intended tone during editorial approval, not factual input. |
| P1 | Multi-day/international FAQ answers | Answers start with `Da`, which reads as direct availability before explaining that requests are individually assessed. | Canonical modes are `quote`, not automatic availability. | Multi-day: `Možete poslati zahtev za višednevni angažman. Navedite datume...`; international: `Možete poslati zahtev za rutu van Beograda ili međunarodno putovanje. Tim zatim proverava...` | high | None. |
| P2 | `content/ui/sr.json#privateChauffeur.standards.intro` | Mixed-language product phrase `Private Chauffeur angažmana` is not native Serbian and duplicates the heading. | Serbian-only review; route name is already localized as “Privatni vozač”. | Replace with `Profesionalni vozač, pripremljeno vozilo i dosledna briga o putniku deo su svakog potvrđenog angažovanja.` | high | None. |
| P2 | `content/ui/sr.json#privateChauffeur.overview.vehicleAndChauffeur.title` | `Vozilo + profesionalni vozač` uses a symbolic construction inconsistent with otherwise editorial Serbian. | Corpus tone. | Replace with `Vozilo sa profesionalnim vozačem`. | high | None. |
| P2 | `privateChauffeur.hero.supportTemplate` | Dense middle-dot fact string reads like an internal package summary and mixes `Poludnevni/Celodnevni` adjectival fragments. | Values are correctly interpolated but presentation can be clearer. | `Najam od {minimumHours} h. Poludnevni paket: {halfDayHours} h i do {halfDayKm} km. Celodnevni paket: {fullDayHours} h i do {fullDayKm} km. Višednevni planovi na upit.` | high | Check Hero line length at required widths. |
| P2 | `sections.hireOptions.body` | “prikazuju se iz važećih podataka usluge” exposes data implementation. | Values are already visibly rendered from canonical data. | Replace with `Uporedite trajanje i uključenu kilometražu, pa izaberite format koji najbolje prati vaš dan.` | high | None. |
| P2 | `vehicleRecommendations.heading` | `sedan` is an avoidable English loan in Serbian editorial copy. | UI already localizes the class as `limuzina`. | Heading: `Izaberite limuzinu koja odgovara vašem danu`; intro: `Tri limuzine pokrivaju različite prioritete poslovnog i privatnog putovanja.` | high | Corpus vehicle terminology. |
| P2 | `sections.customEngagement` and contextual CTA labels | The current foreign journey term, “model angažovanja”, and arrow glyphs make the close sound procedural and visually encoded in text. | Route supports quotes; Link component owns presentation. | Prefer `raspored putovanja`, `vrsta angažovanja`, and labels without authored `→`, e.g. `Zatražite ponudu za složeniji raspored`. | high | Shared link visual should supply any arrow. |

## Used Serbian UI strings

| Key group | Assessment | Proposed action |
|---|---|---|
| Duration/package templates | Factually correct and safely interpolated. | Recast Hero summary as sentences; retain compact card facts. |
| Overview and schedule labels | Clear but duplicate source paragraphs. | Shorten copy at the composed-page level. |
| `service.privateChauffeur.*` | Correctly qualifies quote-only scenarios. | Retain facts; reduce repetition across adjacent sections. |
| Standards | Data-backed and useful. | Localize the mixed-language intro. |
| Fleet labels/carousel controls | Reviewed with Fleet. | Follow Fleet terminology decisions. |

## Page-level conclusions

- Scope and audience: strong flagship explanation, but substantially longer than needed for one core service model.
- Coordination/process clarity: formats and manual confirmation are clear; quote-only cases need more cautious answer openings.
- Limitations and qualification: operational constraints are generally well handled and data-derived.
- CTA integrity: all booking CTAs should describe starting or sending a request, not completed reservation.
- Retained intentional repetition: duration facts may appear in Hero, option cards, and relevant FAQ because those contexts support scanning, comparison, and objection handling.
- Content input required: none.
- SEO handoff: metadata is specific and honest; preserve the Serbian search phrase while tightening on-page repetition.
- Recommended disposition: approve after a coordinated compression edit that preserves every locked section but gives each region a distinct editorial job.
