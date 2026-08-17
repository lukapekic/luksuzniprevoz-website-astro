# Coding Agent Task — Step 1: Content Model

Install the Luxury Transportation editorial content model only.

## Add
- `src/content.config.ts`
- `src/content/schemas/shared.ts`
- `src/content/schemas/pages.ts`
- `docs/content-model.md`
- `docs/content-validation.md`

## Implement
1. Register one build-time Astro collection named `pages`.
2. Use `glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" })`.
3. Use the supplied `pageSchema`.
4. Integrate semantic rules from `docs/content-validation.md` into existing `content:validate`.
5. Reuse existing validated route/fleet/client loaders. Do not duplicate project-data parsing.
6. Validate exact SR/EN/RU parity and all cross-references.
7. Create directories only for the four pilot pages if useful:
   - home
   - private-chauffeur
   - airport-transportation
   - business-transportation
8. Do NOT invent marketing copy to make validation pass.
9. Do NOT implement UI components/layouts.
10. Do NOT put pricing/contact/fleet/business facts into Markdown.
11. Do NOT add layout/theme/variant fields to schemas.
12. Preserve all reusable foundation quality gates.

## Compatibility
If the repository already has equivalent content collection infrastructure, integrate instead of duplicating it. Adapt import paths only when required by existing conventions.

## Run
- `astro sync` (or project equivalent)
- `npm run content:validate`
- `npm run check`
- `npm run lint`

Do not weaken a failing gate.

## Report
Return:
- files added/changed
- infrastructure reused
- validation results
- conflicts/unresolved references

Stop after this step.
