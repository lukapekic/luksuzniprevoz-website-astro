> **Active review — 13 September 2026:** Start with [SERBIAN-REVIEW-WORKFLOW.md](SERBIAN-REVIEW-WORKFLOW.md) and [serbian-review-status.json](serbian-review-status.json). They track the renewed browser-first Serbian pass. The earlier results below are historical; their approval pauses are not active.

# Serbian Content Review Handoff

## Saved checkpoint

- Saved: 9 September 2026 at 13:31:56 UTC.
- Branch: `feature/pricing-fleet-booking`.
- Stage: Serbian audit and proposal pack complete; awaiting owner approval.
- Production content changed: no.
- English and Russian wording reviewed: no; only parity/lifecycle mechanics were
  inspected.
- Repository state: review artifacts and the updated content-review skill are
  uncommitted.

## Completed work

- Audited all 15 current routes in Serbian Latin.
- Reviewed composed page copy, used Serbian UI strings, navigation, CTAs,
  factual claims, repetition, lifecycle, and SEO handoff.
- Recorded 151 findings: 4 P0, 68 P1, and 79 P2.
- Researched Serbian grammar, orthography, person, tense/aspect, cases, number
  inflection, and natural web usage.
- Added a mandatory final Serbian language gate to the content-review skill.
- Re-reviewed all 15 proposal reports using that language reference.
- Applied owner terminology decisions to the proposal set: `kombi`, no Serbian
  `vanovi`; no customer-facing `itinerer`; `e-mail` / `e-mail adresa` as the
  explicit house style.
- Made dynamic duration proposals safe for Serbian number changes by using
  neutral `h`, `min`, or `god.` unless plural-aware formatting is implemented.

## Resume point

Read in this order:

1. `status.json`
2. `approval-pack.md`
3. `serbian-language-reference.md`
4. `serbian-language-final-review.md`
5. `decisions-required.md`
6. the affected route report under `pages/` when applying a field

The next owner input is exactly:

> Approve Serbian defaults

That approval authorizes one controlled multilingual application phase:

1. apply the approved Serbian edits;
2. review and update English and Russian against the final Serbian source;
3. update affected UI/navigation dictionaries with locale parity;
4. synchronize source digests and generated types where required;
5. run content, route, SEO, Astro check/build, and `routing-content`
   verification;
6. report only unresolved factual, legal, or release exceptions.

Do not begin production edits before that approval.

## Unresolved blockers and safe defaults

1. **Business hub release integrity:** the hub and global navigation link to
   Corporate and Conference/Congress routes that the final production build did
   not emit. Safe default: hold hub/navigation exposure until both child routes
   are approved and activated together.
2. **Contact response SLA:** the two-hour response promise has no verified
   operational source. Safe default: replace it with `Na poruke odgovaramo tokom
   radnog vremena.`
3. **Forms lifecycle:** Booking and Contact blueprints still describe
   validation-only behavior, while code can submit when externally configured.
   Activation requires the separate blueprint/acceptance update.
4. **Legal/privacy wording:** do not strengthen data-handling or confidentiality
   promises without the approved privacy/retention contract.

## Validation evidence

The saved baseline records these successful checks:

- `pnpm skills:validate`
- `pnpm routes:validate site/luksuzni-prevoz`
- `pnpm content:validate site/luksuzni-prevoz`
- `pnpm seo:validate site/luksuzni-prevoz` — 45/45
- `pnpm --filter @luksuzni-prevoz/site check` — 0 errors, 6 hints
- `pnpm --filter @luksuzni-prevoz/site build` — 43 pages
- `pnpm traceability --check`
- artifact integrity and `git diff --check`

Before application, confirm that this checkpoint is still current. After any
production edit, rerun the applicable commands instead of relying on this saved
baseline.
