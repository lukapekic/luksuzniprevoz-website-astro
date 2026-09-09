# Route: `vipTransportation`

## Scope

- Audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: request discreet, quote-only transport for an important guest, private itinerary, aviation arrival, multiple vehicles, or complex coordination while understanding that security is excluded.
- Sources: Serbian entry, locked VIP blueprint, final renderer/page components, VIP service and operating/contact/fleet data, used VIP/Occasion UI keys, shared chrome.

## Claim ledger

Typed service data explicitly supports discretion, privacy, commercial/private aviation, multiple vehicles, and dedicated coordination for complex bookings. It explicitly excludes security. Pricing is quote-only and confirmation is manual. These flags support restrained service descriptions, but they do not independently define legal privacy/retention practices or guarantee secrecy.

## Findings and proposals

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P1 | Hero H1 | `Diskretan prevoz, organizovan prema vašem rasporedu` does not name VIP service and is nearly interchangeable with Private Chauffeur. | `VIP prevoz prilagođen gostu i dogovorenom rasporedu`. | Preserve page distinction in corpus pass. |
| P1 | `sections.discretion.body/items` | Copy states how movement data is used/handled without an approved public privacy and retention contract for the request flow. `postupaju se` is also grammatically wrong. | Keep service behavior separate from legal claims: `Vozač dobija informacije potrebne za potvrđeni plan, a komunikacija sa gostom ostaje profesionalna i nenametljiva.` Review any data-use promise with production privacy copy before form activation. | Legal/privacy rollout. |
| P1 | `sections.standards.body` | `potvrđenih operativnih pravila i kanonskih VIP mogućnosti` is implementation jargon addressed to customers. | `Standardi obuhvataju profesionalnog vozača, pripremljeno vozilo, diskretan pristup i koordinaciju prema potvrđenim detaljima zahteva.` | None. |
| P1 | Security FAQ | `close-protection` is untranslated jargon. | `Ne. VIP prevoz ne uključuje fizičko ni lično obezbeđenje.` | None. |
| P1 | Page-wide structure | The current foreign journey term, `angažman`, `potvrđen plan`, and coordination are repeated through Overview, Scope, Discretion, Aviation, journey schedule, Process, FAQ, and CTA. | Use `raspored putovanja` as the default Serbian term. Give Scope the supported shapes, Aviation the arrival boundary, the schedule section the complex sequence, and Process the handoff; delete repeated framing elsewhere. | Coordinated page edit. |
| P2 | `vip.hero.trust.coordinatedService` | `Individualno koordinisano` is an incomplete, unnatural phrase. | `Koordinacija prema zahtevu`. | None. |
| P2 | `overview.heading.title` | `premium` is an avoidable English loan and the statement is generic. | `Više od vozila visoke klase`. | Corpus terminology. |
| P2 | Aviation wording | `avio dolazak` and `komercijalna avijacija` sound industry-led for a ground-transport page. | Prefer `dolazak komercijalnim ili privatnim letom`; retain aviation terms only where distinction is required. | Airport terminology. |
| P2 | `process.items[2]` | “dobijate ... organizaciju i individualnu ponudu” is noun-heavy. | `Nakon provere šaljemo predlog, individualnu ponudu i detalje koji zahtevaju vašu potvrdu.` | Ensure exact order matches sales process. |
| P2 | Vehicle suitability | `glavni VIP gost`, `prateći poslovni prevoz`, and `veće prateće grupe` are stiff. | Use direct roles: `važan gost`, `prateći putnici`, `veća grupa`; keep models/capacities data-derived. | Fleet terminology. |

## Conclusion

The page correctly separates VIP transport from chauffeur packages, delegations, and security. Its priority is to remove implementation/privacy overreach and repeated foreign or procedural journey terminology while keeping the capability boundaries. No owner input is required for the safe wording; privacy statements must be coordinated with the form’s legal rollout.
