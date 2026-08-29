# Codex — Private Chauffeur v3 Content Handoff

Use this together with the locked v3 blueprint, wireframe, implementation and acceptance files.

## Required content operations

1. Replace the three existing Private Chauffeur scaffold Markdown files with the files in `content/`.
2. Keep them `status: in-review` and `noindex: true` during page implementation.
3. Merge every key from `ui-additions/sr.json` into `src/content/ui/sr.json`.
4. Merge every key from `ui-additions/en.json` into `src/content/ui/en.json`.
5. Merge every key from `ui-additions/ru.json` into `src/content/ui/ru.json`.
6. Do not delete or overwrite unrelated existing UI keys.
7. Preserve the identical UI key set across all three locales.
8. Use `content-contract.md` for interpolation and ownership.
9. Do not author numeric hire facts directly in page components.
10. Do not replace the Hero support line with Markdown `supportText`; build it from canonical data + `privateChauffeur.hero.supportTemplate`.
11. Interpolate the five allowed FAQ tokens from `services.ts` before rendering visible FAQ and FAQ structured data.
12. Keep the FAQ at exactly 10 items.
13. Run content/type/SEO validation after merging.
14. Publish only after full v3 acceptance passes.

The Serbian source digest expected by EN/RU is generator-owned. Run
`pnpm content:sync-digests site/luksuzni-prevoz` after source normalization and
use its output.

If Serbian copy changes, re-run the repository digest workflow and re-review EN/RU.
