# Serbian editorial checkpoint — 13 September 2026

## Outcome

All 15 Serbian pages have applied editorial revisions and a lead review of the
complete composed Serbian page. English and Russian meaning alignment is also
applied across 45 entries. The owner terminology is retained: kombi, raspored,
e-mail/e-mail adresa and canonical Mercedes-Benz model names.

**This is not final production approval.** Concurrent theme, shared-UI and
governance work appeared during verification. Current-worktree acceptance is
reopened until that work has a stable handoff and the combined scope is reviewed.
No content has been reverted, no deployment performed and no real enquiry sent.

## Authorities and writing approach

Root AGENTS.md, DESIGN.md, page/component contracts and the repository content,
design-governance, typography, responsive, accessibility and functional-UI
procedures guided this pass. The existing researched
[Serbian language reference](serbian-language-reference.md) guided case and
agreement, verbal aspect, word order, numeric forms and consistent Latin/Ekavian
usage. Exact before/after replacements are preserved in `approved-replacements/`.
No new paid market research or AI-detector scoring was used in this editorial pass.

The review favors concrete instructions, shorter headings and direct verbs.
Business conditions remain explicit without inventing availability, prices,
capacities, security services or automatic booking confirmation.

## Page acceptance on the frozen editorial build

Every row below has a full composed Serbian text review and visual inspection
at 320,768,1024,1440 and 1920 CSS px. Automated normal/enlarged-text checks cover
all three locales. Mobile FinalCTA crops were also read separately where present.

| Page | Main editorial/factual emphasis |
| --- | --- |
| Home | Clear service choices; concise closing heading “Gde i kada putujete?” |
| Private chauffeur | Time-based hire; confirmed duration/km limits; changes conditional |
| Airport | One-way fixed-fare scope, waiting and terminal-access conditions; booking handoff |
| Business hub | Distinguish corporate, delegation and event services; published child links |
| Corporate | One-off versus regular work, invoicing and same-driver conditions |
| Delegation | Groups/vehicles/coordinator; written NDA conditions; no security service |
| Conference | Arrivals/hotels/event locations, individual versus group schedules |
| Special events | Help users choose the occasion; waiting/return and multiple vehicles conditional |
| Wedding | Couple versus guests; decoration, waiting and return separately agreed |
| Prom | Individual/pair/friends; practical pickup instructions; no automatic extras |
| VIP | Discretion and visit planning; private-terminal access conditional; no personal security |
| Fleet | Canonical models; verified passenger counts; baggage and model availability qualification |
| Pricing | Existing fares unchanged; hourly/half-day/full-day terms; quote versus confirmed booking |
| Contact | Natural labels/help/errors; direct contact and working-hour response wording |
| Booking | Clear step instructions, price/quote distinctions and request-versus-confirmation wording |

## Responsive corrections owned by this pass

- FinalCTA: content-driven height and shrinkable/wrapping content, actions and contacts.
- SiteHeader: enlarged-text fit; wrapped navigation/actions and matching surface height.
- HorizontalCarousel: wrapping controls without changing order or behavior.
- Global main text: emergency wrapping without reducing the semantic type scale.
- Airport form: shrinkable intrinsic grid children and contained primary action.
- Contact: semantic desktop column gutter, preserving the 5/7 split.
- Homepage hero: explicit header clearance in the offset integration. The optional
  layout custom property defaults to zero for consumers without that offset.

These preserve component identity, CTA destinations and locked content order.
Component/type comments and affected contracts were updated. The earlier
[responsive report](responsive-editorial-2026-09-13.md) documents diagnosis.

## Evidence actually obtained

- [Frozen browser corpus](serbian-browser-corpus-2026-09-13.json):225 unique
  route/locale/width states, all HTTP 200, zero captured errors, zero normal or
  200%-text page overflow, zero measured FinalCTA clipping.90 axe runs at 320/1440
  had no violations. Root text size was verified as 32 px for enlarged checks.
- 54 shared CTA/header/carousel Chromium regressions passed.
- 46 rendered SEO tests passed: metadata, canonical/hreflang, visible FAQ/schema,
  sitemap and internal-link coverage.42 indexable pages and 3 intentionally
  noindex Booking routes retain their established policy.
- The 299-case non-submission smoke run had 295 passes and four stale text/link
  expectations. Corrected expectations passed targeted reruns. The 9-case Wedding
  suite passed; all 15 newly added homepage-clearance tests passed at normal and
  enlarged text. This is combined evidence, not a claimed clean 314-case single run.
- Six mocked Contact/Booking submission flows passed across SR/EN/RU; no actual
  outbound enquiry was made. The earlier repository form tests also passed
  validation/focus, no-JS behavior and Airport handoff.
- Exact final routing-content profiles passed for Corporate, Delegation,
  Conference, Business, Private chauffeur, Airport and Fleet. Earlier batch 1
  Prom/VIP/Special profiles passed. Evidence lives under `.design/.cache/serbian-*`.
- Shared component profiles passed for FinalCTA, SiteHeader, HorizontalCarousel
  and HomepageHero; small-UI profiles passed for global wrapping, Airport,
  Contact and the homepage integration. Their actual JSON gate arrays are the
  authority for gate counts.
- Successful profiles ran content/routes/SEO/type validation, check, lint,
  unit tests and the site build. No pass is implied for a command not in the
  corresponding evidence. `git diff --check` also passed before this checkpoint.

## Interrupted attempts and current blocker

Two later consolidated smoke attempts were stopped after the local preview
exited 143 and requests failed with connection refused. Their failures are
environmental diagnostics, not passing tests. The cause of those exits is not
established. A bounded runner owning its own preview subsequently completed
Prom/VIP, Fleet/Pricing and Contact/Booking capture batches cleanly.

Pricing verification first found a stale design snapshot, then stale generated
types. Repository synchronization commands were used; generated types added
the newly present measure/code token names. No generated file was hand-edited.
Those token/schema changes were not authored by this editorial pass.

The next attempt stopped on a newly introduced requirement:

> Change scope contains 12 UI files. Pass --scope-complete after reviewing the full scope; one target cannot certify the entire change.

New workspace changes include `.design/config*`, `.governance/components.json`,
`scripts/governance/verify-ui.mjs`, design-rule tooling, theme schema,
Theme V2 layout/typography and generated CSS, plus shared LeafPage work.
These were absent from this lead's earlier worktree inventory. They are preserved
as concurrent work, not adopted or certified without review. The exact pending
profile queue is Pricing, Contact, Booking, Home, SR/EN/RU UI dictionaries and
canonical fleet data: eight jobs under the earlier runner, to be reconciled with
the new full-scope governance procedure.

The frozen build is `/tmp/serbian-reviewed-frozen.JxMH1S/`; unaffected Private/
Airport captures used the preceding frozen build. Screenshots/composed text
remain in `/tmp/serbian-corpus-final/<route>-<locale>/`. They do not certify later
theme or shared-component changes. Temporary screenshot files are local session
artifacts; the durable JSON contains their acceptance summary and paths.

## Other limitations and resume steps

- Batch 2's supporting agent missed pre-edit contexts. Lead post-edit authority
  checks and subsequent profiles are recorded in
  [the business report](business-editorial-2026-09-13.md); no retroactive preflight
  claim is made.
- The normal preview without a public Turnstile key intentionally disables
  sending. Submission behavior was reviewed in the repository public-test-key
  build with intercepted POSTs. Live Cloudflare/SMTP delivery still needs a
  staging/owner check; no safeguard was bypassed.
- No new scaffold, fake business fact or placeholder asset was introduced.
  Fresh EN/RU market research and deployment are outside this pass.

Resume after the parallel work reaches a stable checkpoint: inspect and preserve
the combined diff, read updated authorities, review the full declared scope,
regenerate only stale contracts, rebuild a new frozen artifact, run the new
required profiles and integrated browser regression, then update the ledger.
Do not add `--scope-complete` without actually completing that scope review.

## Files owned by the editorial work

Localized `src/content/pages/*/*.{sr,en,ru}.md`, all three `src/content/ui/*.json`,
canonical names in `src/data/fleet.ts`; the seven responsive areas listed above;
their affected contracts/type comments; smoke assertions plus new enlarged-text
and homepage-clearance tests; and `src/docs/content-review/` workflow/reports and
replacement manifests. The type generator's latest output is also preserved.
Unrelated governance/theme/LeafPage edits are explicitly not claimed as this work.
