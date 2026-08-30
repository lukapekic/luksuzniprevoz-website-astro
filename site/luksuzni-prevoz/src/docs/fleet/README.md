# Fleet Page — Agent Handoff

Use this directory as the Fleet page source package.

## Authority order

Read and obey in this order:

1. repository root `AGENTS.md`;
2. repository root `DESIGN.md`;
3. this package `blueprint.md`;
4. the active theme resolved from `site/luksuzni-prevoz/foundation.config.ts`;
5. approved shared-component contracts;
6. this package `implementation.md`;
7. this package `wireframe.html` for structural intent only;
8. matching `.skills/*`.

No file in this package authorizes weakening repository rules.

## Required skills

Load the smallest complete new-page bundle defined by `AGENTS.md`, including:

- `design-foundation-governance.md`
- `blueprint-to-ui.md`
- `component-architecture.md`
- `high-value-visual-execution.md`
- `typography-system.md`
- `imagery-art-direction.md`
- `responsive-layout.md`
- `responsive-ui.md`
- `responsive-images-performance.md`
- `tailwind-v4.md`
- `accessibility-wcag.md`
- `technical-seo.md`
- `structured-data.md`
- `multilingual-routing.md`

## Execution order

1. Verify the asset contract.
2. Apply the canonical fleet/data changes.
3. Apply the Fleet content-schema changes.
4. Merge UI additions into all three locale dictionaries.
5. Install the localized Fleet content entries.
6. Run the repository content digest synchronization command.
7. Build `FleetPage.astro` and page-local Fleet components.
8. Register the Fleet page in `ContentPageRenderer.astro`.
9. Change the Fleet route from `scaffold` to `published`.
10. Render and review 320 / 768 / 1024 / 1440 / 1920.
11. Run design review and technical review.
12. Run repository validation/build gates.
13. Remove noindex/scaffold behavior only after all required locale/content/asset gates pass.

## Non-negotiable data rule

The supplied pricing source has no Škoda Kodiaq price row.

Do not copy Superb prices.  
Do not estimate Kodiaq prices.  
Do not scrape a price from another operator.  
Do not omit Kodiaq from the canonical fleet merely to preserve the old pricing invariant.

Implement the quote-only pricing state defined in `data-contract.md`.

## Content install

The files under `content/` are full candidate replacements for the three current Fleet scaffold files.

After installing them, run the repository's content digest synchronization command so EN/RU receive a digest generated from the final Serbian source. Do not hand-author a digest.

## UI install

The files under `ui-additions/` contain merge-only keys. Do not replace the existing locale dictionaries with these files. Merge every key into the corresponding `src/content/ui/<locale>.json` and retain all existing keys.
