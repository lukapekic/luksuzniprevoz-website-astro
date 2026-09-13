# Serbian content review — active workflow

Updated: 13 September 2026. **15/15 Serbian pages applied and editorially reviewed.**
**Final integrated verification is paused for concurrent-work coordination.**
The frozen build passed all 225 page/locale/width states and 90 automated axe runs.
Previously completed page acceptance is retained as evidence, but current-worktree
sign-off is reopened because unrelated theme, shared-UI and governance changes
appeared during this run. No editorial work has been discarded.
See [the latest checkpoint](serbian-editorial-checkpoint-2026-09-13.md).

This tracks the renewed browser-first language pass requested after the earlier
content/SEO work. “Done” below means this new pass is applied and verified
locally; it does not mean deployed or independently certified by a native editor.
The prior pass remains historical evidence, not completion evidence for this one.

## Where to resume

1. Read this workflow and [serbian-review-status.json](serbian-review-status.json).
2. Check the worktree; preserve existing edits and read the next page's authorities.
3. Inspect the next page in the browser before drafting or applying replacements.
4. Proceed without page-by-page approval. Ask only for a material business fact
   that cannot be resolved from repository evidence; continue independent work.
5. Update the tracker after each stage and batch. No agents need to be started
   merely to maintain this plan.

The JSON file is the authoritative progress ledger. This document owns the
procedure and readable dashboard; update its dashboard from the ledger whenever
page status changes. Previous `status.json` / `execution-status.json` page
results belong to the earlier review.

## Page dashboard

| Batch | Pages | Editorial / frozen browser review | Current-worktree acceptance |
| --- | --- | --- | --- |
| Reference | Wedding | Done | Reopened: integrated verification |
| 1 | Prom, VIP, Special events | Done | Reopened: integrated verification |
| 2 | Corporate, Delegation, Conference, Business hub | Done | Reopened: integrated verification |
| 3 | Private chauffeur, Airport, Fleet, Pricing | Done | Pending stable integrated verification |
| 4 | Contact, Booking, Homepage | Done | Pending stable integrated verification |

All 45 localized entries are applied/aligned. All 15 composed Serbian pages and
five-width screenshots were lead-reviewed. The browser summary records 225 unique
states, zero measured overflow/clipping/errors and 90 clean axe runs. Earlier
profile passes are retained; they do not certify new concurrent changes.

Batch order deliberately puts service pages before their hubs and the homepage
last. Within batch 3, check canonical fleet/pricing facts while writing the
service pages, then refine the fleet/pricing presentation.

## Status rules

- **To do (`todo`)**: this stage has not started.
- **In progress (`in_progress`)**: active work, with owner and current stage recorded.
- **Blocked (`blocked`)**: record the exact missing input or failed prerequisite,
  evidence, and the smallest next action. Other independent pages can proceed.
- **Done (`done`)**: the lead accepted the result and recorded evidence.

Each page has six stage statuses. A failed check keeps verification in progress
(or blocked if an external prerequisite prevents progress); it never becomes a
silent exception. A later content change reopens affected translation,
verification and browser-review stages. Delegated implementation finishing is
not page completion.

## Repeatable page workflow

| Stage | Work and required output | Owner |
| --- | --- | --- |
| Browser baseline | Read the complete rendered Serbian page, shared UI and resolved values. Save text, screenshots and concrete wording/layout findings at the five viewport states. | Browser support gathers; lead reviews |
| Serbian editorial | Write exact replacements for approved content fields. Check grammar, natural phrasing, factual support, useful section purpose, repetition, terminology and CTA intent. | Lead |
| Implementation | Apply those exact replacements to assigned files; preserve IDs, tokens, routes, CTA destinations and locked structure. Report any mismatch instead of improvising. | Implementation support |
| Translation alignment | Lead reviews EN/RU meaning against the final Serbian source. Support may identify differences and apply exact reviewed changes. Update lifecycle/digests truthfully. | Lead, with support |
| Verification | Run required target-specific governance and site checks; inspect rendered head/SEO alignment, relevant accessibility, interactions and affected consumers. Record actual results. | Support runs; lead resolves |
| Lead browser review | Read the revised composed page, inspect heading wrapping and CTA geometry at all five widths, confirm controls/focus and factual conditions, then accept or return corrections. | Lead |

Reference widths: **320, 768, 1024, 1440, 1920 CSS px**. Check enlarged text and
the relevant form/FAQ/keyboard states. Screenshots must allow images and fonts
to load; a lazy image or sticky-header capture artifact is not proof of a defect.

Writing standard: natural Serbian Latin/Ekavian, polite plural address, concrete
verbs and useful information. Keep `kombi`, `raspored`, `e-mail` and canonical
model names. Use the existing Serbian language reference for cases, agreement,
aspect, word order and numeric forms. Preserve booking conditions without
repeating administrative qualifiers in every sentence. Do not optimize for
an AI detector score.

## Delegation and cost controls

The lead owns the Serbian copy and final editorial judgment. Use at most **two
supporting agents**, normally **GPT-5.6 Luna**, in addition to the lead:

- Browser support: extraction, screenshots, heading/overflow measurements and
  specific regression checks.
- Implementation support: exact replacement application and bounded checks;
  flag translation differences for the lead.

Every assignment includes exact files, approved replacements or read-only
targets, acceptance criteria, prohibited mutations and expected evidence.
A support agent never invents copy, strengthens a claim, changes lifecycle
metadata to silence a gate, or declares a page done. If it cannot complete a
bounded task reliably, the lead takes over rather than paying for repeated
unproductive attempts.

Only one writer owns a file at a time. The lead owns the shared Serbian
dictionary and canonical-data edits. Freeze the batch before verification.
Do not run concurrent builds or digest generators while another agent is
writing. Separate evidence paths prevent verification reports overwriting one
another. Browser baseline work may run alongside the lead's writing on another
already-inspected page.

## Batch acceptance

Run preflight `design:context` before applicable edits and the required exact
target/surface `verify:ui --change routing-content` profiles afterwards.
Use other profiles only if actual component/design changes require them.
Repository-required per-target checks take precedence over cost savings.

Group independent work and avoid extra reruns beyond mandatory profiles.
A single coordinated final batch build can serve the browser review once all
writers have finished. Run content/routes/SEO validation, site check/build,
lint and tests as required by the applicable profiles; report their real
results. Synchronize digests only after corresponding translations were reviewed.

For a shared component fix, first diagnose the component, follow its
cross-consumer contract and required component checks, then test affected
consumers. Shorter copy is not permission to hide overflow, shrink arbitrary
fonts or remove required controls.

After each batch, report pages completed, outstanding issues and next batch.
No user approval pause is inserted.

## Cross-page tasks

| Task | Status | Completion condition |
| --- | --- | --- |
| Shared Serbian dictionary | Done on frozen corpus | Used labels, forms, errors and shared explanations reviewed in context |
| Canonical vehicle labels | Done on frozen corpus | Rendered names agree with owner terminology through canonical sources |
| Corpus consistency | Done on frozen corpus | All pages compared for duplication, voice, headings, claims and CTA consistency |
| Final SEO and locale regression | Integration blocked | Search intent and metadata remain aligned; locale meaning, lifecycle, routes and indexability pass |

Full new competitor/API research is outside this editorial pass. Preserve the
existing research and record any search-intent issue discovered for follow-up.

## Completion and evidence

The entire workflow is complete only when all 15 page records and cross-page
tasks are done, required gates have passed, and a final report lists changes,
evidence and any external limitations. No new scaffold/placeholder content is
introduced. Owner review and deployment are separate steps.

For each page save a dated report under this directory with before/after
examples, claims checked, changed files, locale decisions, viewport evidence,
commands/results and unresolved issues. Link it from the JSON page record.

Completed reference:
[Wedding editorial report](wedding-browser-editorial-2026-09-13.md) and
[Wedding browser checks](wedding-browser-checks-2026-09-13.json).
