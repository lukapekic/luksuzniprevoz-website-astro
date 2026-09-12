# Route: `corporateTransportation`

> **Final state — 12 September 2026:** This audit is retained as historical
> evidence. Its copy findings were applied, and the route is now published,
> reviewed and indexable in SR/EN/RU after an isolated 13-gate verification.

## Scope

- Mode: audit/proposal; Serbian Latin only; no production content changed.
- Lifecycle at audit time: `in-review`, `noindex`, route availability `scaffold`; now resolved and published.
- User task: choose between one-off and recurring corporate transport, understand invoicing/terms, provide a business schedule, and await manual confirmation.
- Sources: Serbian page entry, locked blueprint/content contract, final renderer, `services.ts`, `operations.ts`, `contact.ts`, used Corporate/Business UI keys, fleet and shared chrome.

## Claim ledger

| Claim | Source | Status/action |
|---|---|---|
| One-off and recurring arrangements are supported | `services.ts` | verified |
| Business invoicing and negotiated commercial terms are supported when agreed | `services.ts` | verified; keep conditional wording |
| The same chauffeur can cover connected stops | `services.ts#dedicatedChauffeurAcrossStops` | verified; qualify by confirmed arrangement |
| Routes outside Belgrade require a quote | parent Business service data | verified |
| Every request is manually confirmed | `contact.ts` | verified |

## Findings and proposed replacements

| Priority | Field/group | Issue | Proposed replacement/action | Dependency |
|---|---|---|---|---|
| P1 | Lifecycle and Business Hub relationship | This full page is correctly in review, but the published Business hub links to its scaffold route. | Keep this page non-public until its page gates pass; resolve the hub release mismatch in the Business report. | Release/route decision. |
| P1 | Hero description | `od jednog poslovnog rasporeda` is unnatural and the sentence repeats the page’s schedule language. | `Profesionalni prevoz sa vozačem za direktore, poslovne goste i kompanije — od pojedinačnog poslovnog dana do prevoza koji se redovno ponavlja.` | None. |
| P1 | Page-wide composition | Overview, audience, working-day and coordination sections repeatedly restate “one connected confirmed schedule.” | Let Overview define the service, audience identify buyers, working-day demonstrate the benefit, and coordination explain roles. Remove repeated setup sentences while preserving every locked section. | Coordinated page edit. |
| P1 | `overview.heading.intro` | `tačka A do tačke B` is a generic cliché and frames the offer negatively. | `Kompaniji su potrebni jasan raspored, odgovarajuće vozilo i unapred potvrđena organizacija.` | None. |
| P1 | Primary CTA register | `Pošalji korporativni upit` conflicts with the polite plural used on adjacent business pages. | `Pošaljite detalje poslovnog prevoza`. | Corpus voice decision. |
| P2 | `engagementModel` wording | `model`, `stabilniji model`, and `način angažovanja` sound procedural. | Prefer `vrsta saradnje`, `kontinuirana saradnja`, and `odgovarajući način organizacije`. | None. |
| P2 | `workingDay.items[1]` | `transportni plan` breaks the preferred Serbian term and adds jargon. | `Sledeća potvrđena lokacija već je deo istog plana prevoza.` | Corpus terminology. |
| P2 | `corporateTransportation.cta.recurring` | `Razgovaraj o stalnoj saradnji` is informal singular and “stalna” overstates recurrence. | `Razgovarajte o kontinuiranoj saradnji`. | Corpus voice. |
| P2 | Quiet CTA | Authored arrow `→` makes presentation part of content. | `Pošaljite detalje poslovnog prevoza`; let the link component own any icon. | UI presentation convention. |
| P2 | Vehicle intro | `V klasa` is inconsistent with canonical vehicle naming. | Use `Mercedes-Benz V-Class`; use `limuzina` rather than `sedan` in generic Serbian descriptions. | Fleet terminology. |

## Used Serbian UI and conclusion

Capability and FAQ templates remain factually data-gated. The repetition,
terminology and polite-plural findings were applied, translations were reviewed,
and the route was activated in all locales. No owner content input remains.
