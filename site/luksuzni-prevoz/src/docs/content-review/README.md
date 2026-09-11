> **Historical checkpoint, superseded 11 September 2026.** The owner authorized autonomous multilingual content application and SEO research. See [EXECUTION.md](EXECUTION.md), [execution-status.json](execution-status.json), and [FINAL-REVIEW.md](FINAL-REVIEW.md) for the current result. Approval pauses and unchanged-content statements below describe the earlier audit only.

# Serbian Content Corpus Review

This workspace records the Serbian-first content-quality review for every current Luxury Transportation route. It is an audit/proposal workspace: production entries under `src/content/pages/` and `src/content/ui/` remain unchanged until the Serbian corpus is approved and EN/RU can be updated in releasable multilingual batches.

When resuming a paused review, start with `HANDOFF.md`. For normal review, start
with `approval-pack.md`. Use `serbian-corpus.md` for approved terminology,
`serbian-language-reference.md` for grammar and inflection,
`serbian-language-final-review.md` for the second-pass evidence, `status.json`
for machine-readable progress, and `pages/` for route-level evidence.

## Authority

Use the smallest relevant chain for each page:

1. root `AGENTS.md`
2. `docs/content-authoring.md`
3. the page blueprint and content contract, when present
4. verified `src/data/*` facts
5. content schemas, renderer, interpolation sources, and used Serbian UI keys
6. current Serbian content
7. `.skills/content-quality-review.md`

## Execution order

1. Fleet, Pricing, Booking, Contact
2. Private Chauffeur, Airport Transportation
3. Corporate, Delegation, Conference/Congress, Business hub
4. Wedding, Prom, VIP, Special Events hub
5. Homepage
6. Corpus-wide Serbian terminology, repetition, CTA, and shared-UI pass
7. Final Serbian grammar, inflection, token-resolution, and natural-usage pass

Leaf pages precede their hubs; the homepage is last because it summarizes the settled offer.

## Working contract

- Review only Serbian wording during this phase. Inspect EN/RU only for mechanical token or lifecycle context.
- Inspect the composed page, not only Markdown frontmatter.
- Trace material claims to repository evidence before proposing stronger or more specific wording.
- Record unresolved facts in `decisions-required.md`; never insert review markers into production content.
- Do not request page-by-page approval. Consolidate owner input after repository evidence is exhausted.
- Update `status.json` after each checkpoint.
- Create one report per route from `pages/_template.md`.
- Keep final SEO optimization as a separate handoff.
- Apply `serbian-language-reference.md` to every proposed replacement before
  requesting corpus approval.

## Completion condition

The Serbian phase completes when all 15 routes and their used Serbian UI strings have reports, corpus-level consistency has been reviewed, every P0/P1 is resolved or consolidated for owner input, proposed replacements are approval-ready, production localized content remains unchanged, and the baseline validation commands pass.
