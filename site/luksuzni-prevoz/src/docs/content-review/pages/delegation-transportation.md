# Route: `delegationTransportation`

## Scope

- Mode: audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: submit one programme for coordinated multi-vehicle delegation transport, understand vehicle roles, discretion, confidentiality options, and explicit exclusion of security services.
- Sources: Serbian page entry, locked blueprint/content contract, final renderer, `services.ts`, `operations.ts`, `clients.ts`, used Delegation/Business UI keys, fleet and shared chrome.

## Claim ledger

| Claim | Source | Status/action |
|---|---|---|
| Multiple vehicles, mixed classes, and a dedicated coordinator | `services.ts` | verified |
| Service is quote-only and manually confirmed | `services.ts`, `contact.ts` | verified |
| Chauffeurs receive discretion training | `operations.ts` | verified; do not turn this into an absolute secrecy guarantee |
| Physical security/protection/escort is excluded | `services.ts#securityService: false` | verified and clearly disclosed |
| Three institutional logos may be shown | `clients.ts` approved placements/status plus locked blueprint | verified public-display state |
| Client relationships prove reliable delivery and discretion | Not encoded by the roster | unsupported inference; remove performance endorsement |

## Findings and proposed replacements

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P0 | `delegationTransportation.clients.intro` | The roster supports a client relationship/logo display, but `potvrđuje ... pouzdanu realizaciju i diskreciju` converts it into an unsupported endorsement/performance claim. | `Odabrane diplomatske, međunarodne i nacionalne organizacije za koje smo pružali usluge prevoza.` | Confirm only if “provided transport” is not the intended client-record meaning; blueprint states these clients use the service. |
| P1 | Institutional client display names | Serbian output prints three English names from canonical `displayName`, including an embassy and national federation with natural Serbian names. | Add locale-aware public display labels while retaining canonical identities: `Ambasada Narodne Republike Kine`, `Misija OEBS-a u Srbiji`, `Plivački savez Srbije`. | Data/localization boundary change. |
| P1 | `delegationTransportation.trust.operational.text` | Claims a specific information-handling practice (`tretiraju se...`) without a published privacy/retention contract for the active request channel. | `Raspored, imena i lokacije koristimo za pripremu konkretnog zahteva i potvrđenog plana prevoza.` Review alongside production privacy copy before form activation. | Legal/privacy rollout. |
| P1 | NDA wording | Unexplained `NDA` is English/legal jargon. | First use: `ugovor o poverljivosti (NDA) ili drugi pisani zahtev u vezi sa poverljivošću`; FAQ can then use `ugovor o poverljivosti`. | Legal wording review only if stronger contractual language changes. |
| P1 | Dedicated coordination terminology | `posvećena koordinacija` is literal and vague to a buyer. | Use `jedna kontakt osoba za koordinaciju` where the canonical dedicated-coordinator capability is rendered. | Ensure operational interpretation matches current coordinator field. |
| P2 | Page-wide `transport`/`prevoz` mixture | Both terms are used for the same customer-facing service, sometimes in one paragraph. | Use `prevoz` in editorial Serbian; reserve `transportni plan` only if the team deliberately adopts it as a formal term, otherwise `plan prevoza`. | Corpus terminology. |
| P2 | `sections.mixedFleet` | `sedan`, `V klasa`, `izvršni putnik`, and `viši nivo reprezentativnosti` sound translated or abstract. | Use `reprezentativna limuzina`, `poslovna limuzina`, `Mercedes-Benz V-Class`, `rukovodilac`, and describe concrete suitability without ranking “representativeness.” | Fleet terminology. |
| P2 | FAQ briefing answer | `sve posebne operativne ili zahteve poverljivosti` is grammatically incomplete. | `...željena vozila i sve posebne zahteve koji utiču na organizaciju ili poverljivost.` | None. |
| P2 | Movement text | `S klasa · E klasa · V klasa` is inconsistent with canonical model names and middle-dot prose. | `Mercedes-Benz S-Class, E-Class i V-Class`, or render model names from fleet data. | Prefer data-derived display names. |
| P2 | CTA arrow | `Pošaljite program delegacije →` embeds presentation in localized text. | `Pošaljite program delegacije`; component owns iconography. | UI presentation convention. |

## Used Serbian UI and conclusion

The explicit security exclusion and written-agreement qualification are excellent. Keep them. The most important correction is to make client proof factual rather than testimonial, followed by localized institutional names and plain confidentiality language. Primary actions already describe sending a request rather than confirming a booking. No required owner input; the safe client-proof replacement follows the locked blueprint’s stated relationship.
