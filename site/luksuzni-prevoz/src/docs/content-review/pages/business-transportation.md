# Route: `businessTransportation`

> **Final state — 12 September 2026:** This audit is retained as historical
> evidence. The former child-route release blocker is resolved: Corporate,
> Delegation and Conference/Congress are all published in SR/EN/RU.

## Scope

- Mode: audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle: published and indexable.
- User task: distinguish Corporate, Delegation, and Conference/Congress services, select the correct route, understand coordination and commercial paths, and send a manually reviewed request.
- Sources: Serbian hub entry, locked hub blueprint, final renderer and child-card resolver, `routes.ts`, `services.ts`, `clients.ts`, operations/contact data, used Business and child-service UI keys, fleet and shared chrome.

## Claim ledger

| Claim | Source | Status/action |
|---|---|---|
| Hub has exactly three specialist child services | route/service maps | structurally verified |
| Corporate supports recurring contracts, invoicing, terms, and same-chauffeur continuity | Corporate service data | verified and properly scoped |
| Delegation and Conference support multi-vehicle coordination | respective child service data | verified and properly scoped |
| Four selected client logos may render | `clients.ts` public display policy | verified display state; avoid endorsement language |
| All three child destinations are publicly available | `routes.ts` and content lifecycle | resolved: all three children are published |

## Findings and proposed replacements

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P0 | Published Hub child-service cards | The published/indexable hub is contractually required to show and link all three services, but Corporate and Conference routes are `scaffold` with `in-review` service content and are omitted from production static paths. The final 43-page production build emitted Serbian `/poslovni-prevoz/` but neither Serbian child route, so two central commercial links can lead to unavailable routes. | Recommended safe release path: keep the hub non-indexable/non-public until both child routes pass gates and are activated together. Alternative requires an explicit blueprint revision permitting unavailable-card treatment. | Owner/release authorization; cannot be solved by copy alone. |
| P1 | `childServices` labels and corpus terminology | `servis` is used as a direct translation of “service,” while Serbian customer copy elsewhere uses `usluga`; `transport` and `prevoz` alternate. | Standardize on `poslovna usluga` / `prevoz`; reserve `servis` for intentionally branded/internal classifications only. Example heading: `Izaberite poslovnu uslugu`. | Corpus terminology. |
| P1 | Hero/support and Overview | Hero, support, Overview, and child cards all enumerate one trip/multiple meetings/complex schedules before users reach the actual choices. | Keep Hero focused on outcome, use Overview for three principles, and let child cards carry use-case distinctions. Suggested Hero description: `Profesionalni vozači, reprezentativna vozila i koordinacija prilagođena poslovnom danu — od jedne vožnje do složenog rasporeda.` | Coordinated hub edit. |
| P1 | Client-proof framing | `Iskustvo sa zahtevnim...` implies a judgement about engagement difficulty; logos establish approved client relationships, not testimonials. | Heading `Odabrani poslovni klijenti`; intro `Kompanije i organizacije za koje smo pružali usluge prevoza.` | Confirm only if client records mean something narrower. |
| P1 | Hero primary CTA | `Izaberite poslovni servis` targets the correct section but uses the disputed loanword. | `Izaberite poslovnu uslugu`. | Corpus terminology. |
| P2 | `overview.body` | Starts with generic scenario copy (`Sastanci se pomeraju...`) then repeats categories already in cards. | `Poslovni prevoz organizujemo prema terminima, lokacijama, putnicima i ulozi svakog vozila. Bilo da je potrebna jedna vožnja ili složeniji raspored, sve detalje unapred usaglašavamo.` | None. |
| P2 | Child card `Delegacije i protokol` | “Protokol” is not the route/service name and can suggest a broader protocol service. | Use the canonical `Prevoz delegacija`; describe protocol requirements only as request details. | Route naming. |
| P2 | Illustrative coordination timeline | Hardcoded times look like a concrete itinerary even though the blueprint says illustrative. | Add the visible label `Primer poslovnog rasporeda`; keep entries clearly illustrative. | Existing component/layout. |
| P2 | `process.items[1]` | `Zahtev usmeravamo na odgovarajući poslovni servis` is internal routing language. | `Predlažemo odgovarajuću uslugu, vozila i način koordinacije.` | None. |
| P2 | Vehicle copy | `izvršni putnik`, `V klasa`, and mixed model spelling read as translated copy. | Use `rukovodilac`, canonical Mercedes-Benz model names, and `limuzina` for generic class. | Fleet terminology. |

## Used Serbian UI and conclusion

Capability labels remain correctly gated per child, and the FAQ avoids presenting
multi-vehicle support as universal. The former release-integrity issue is resolved;
the final build emits all child routes. The opening was compressed, `usluga` and
`prevoz` were standardized, and claims remain scoped to the correct child.
