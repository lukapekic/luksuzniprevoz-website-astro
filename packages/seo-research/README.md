# `@astro-foundation/seo-research`

Portable, read-only SEO research for Astro Foundation sites. The package combines a selected
site's authoritative route, locale, content, and Foundation SEO data with rendered-page
inspection, optional ValueSERP evidence, bounded competitor inspection, historical snapshots,
and strict evidence-backed proposals.

It has no runtime or browser integration and never edits production content.

## Requirements and installation

- Node `>=22.19`
- pnpm workspace containing `packages/*` and the selected site
- the same Foundation `foundation.config.ts`, `src/data/routes.ts`, and localized Markdown
  content contracts

The package directly declares `parse5` because arbitrary rendered HTML must be parsed with a
standards-based parser. It uses Node's native `fetch`; no HTTP client is required.

The root workspace exposes:

```json
{
  "seo:research": "pnpm --silent --filter @astro-foundation/seo-research exec tsx src/cli.ts"
}
```

The site that imports `defineSeoResearchConfig` also declares the package:

```json
{
  "devDependencies": {
    "@astro-foundation/seo-research": "workspace:*"
  }
}
```

## Site configuration

Create `<project>/seo-research.config.ts`. This config owns research intent only; it must not
duplicate site identity, locale lists, slugs, canonical URLs, or business facts.

```ts
import { defineSeoResearchConfig } from "@astro-foundation/seo-research";

export default defineSeoResearchConfig({
  schemaVersion: 1,
  provider: { kind: "valueserp", apiKeyEnv: "VALUESERP_API_KEY" },
  limits: { maxQueriesPerRun: 6, maxCompetitorPagesPerQuery: 3 },
  targets: [
    {
      routeKey: "airportTransportation",
      intent: "transactional",
      locales: {
        sr: {
          primaryKeyword: "aerodromski prevoz Beograd",
          search: { languageCode: "sr", countryCode: "rs", location: "Belgrade,Serbia" },
        },
        en: {
          primaryKeyword: "Belgrade airport transfer",
          secondaryKeywords: ["private airport transfer Belgrade"],
          entities: ["Nikola Tesla Airport"],
          questions: ["What happens if my flight is delayed?"],
          search: { languageCode: "en", countryCode: "rs", location: "Belgrade,Serbia" },
        },
        ru: {
          primaryKeyword: "трансфер из аэропорта Белграда",
          search: { languageCode: "ru", countryCode: "rs", location: "Belgrade,Serbia" },
        },
      },
    },
  ],
});
```

Every locale available for a configured route must have independent keyword research. Missing
locale targets fail validation; values are never translated or borrowed from another locale.

## Commands

```bash
pnpm seo:research validate-config --project site/luksuzni-prevoz

pnpm seo:research run \
  --project site/luksuzni-prevoz \
  --route airportTransportation \
  --locale en \
  --mode built \
  --json

pnpm seo:research run --project site/luksuzni-prevoz --all --max-queries 3

pnpm seo:research compare \
  --project site/luksuzni-prevoz \
  --previous reports/previous.json \
  --current reports/current.json
```

Modes:

- `offline` reads source plus valid normalized cache and performs no network access.
- `built` reads the selected site's existing `dist/`; it never silently builds or switches live.
- `live` fetches the deployed page with redirect, network-destination, type, size, and timeout
  guards.

Use `--skip-serp`, `--skip-competitors`, or `--refresh` to control collection. `--max-queries`
may lower but never raise the configured budget. A live ValueSERP run consumes provider credits;
the package never performs a live smoke query during normal tests.

`--output <path>` writes canonical JSON atomically. For shell pipelines, invoke
`pnpm --silent seo:research ... --json` so pnpm's lifecycle banner is suppressed; the CLI itself
writes only JSON to stdout and failures to stderr.

## Output and local state

The strict schema-versioned report records:

- page route key, locale, canonical route-map URL, source path, and SHA-256 source digest;
- localized source fields, rendered metadata/outline/links/images/JSON-LD, and Foundation issues;
- timestamped ValueSERP query dimensions, normalized organic results, and matched position;
- bounded competitor observations and sitemap changes;
- evidence-linked findings, deterministic safe proposals, warnings, cache use, and query budget.

Generated state is private local tooling data:

```text
<project>/.seo-research/
├── cache/
├── runs/
└── snapshots/
```

The repository ignores this directory. Artifacts contain normalized excerpts, never API keys,
request URLs containing keys, authorization headers, environment dumps, or full competitor HTML.

## Reviewed suggestion workflow

`--suggestion-input <path>` writes a bounded provider-neutral evidence document for Codex or
another reviewed drafting workflow. Validate returned JSON before human review:

```bash
pnpm seo:research validate-suggestions \
  --project site/luksuzni-prevoz \
  --report reports/report.json \
  --suggestions reports/suggestions.json
```

Suggestion files must retain the report/project identity, route, locale, source path, source
digest, allowed field path, and real evidence IDs. Every proposal has `requiresReview: true`.
Stale proposals fail. New factual claims must use `proposedValue: null` until the fact is verified
and added to an approved canonical source. V1 deliberately has no `apply` command and no direct
model-provider adapter.

## Copying to another Foundation repository

1. Copy `packages/seo-research/` unchanged.
2. Confirm the destination workspace includes `packages/*`.
3. Add the root `seo:research` script and the site's workspace development dependency shown
   above.
4. Create the destination site's own `seo-research.config.ts` with every configured locale.
5. Add `site/*/.seo-research/` to `.gitignore`.
6. Run `pnpm install`, `validate-config`, package check/tests, and an offline page run.
7. Add `VALUESERP_API_KEY` only when an approved live run is needed.

Copying requires no package-source edits and no theme integration. If the other repository's
Foundation route/content contracts have diverged, reconcile those contracts explicitly instead
of adding site-name fallbacks to this package.

## Verification

```bash
pnpm --filter @astro-foundation/seo-research check
pnpm --filter @astro-foundation/seo-research test:unit
pnpm routes:validate <project>
pnpm content:validate <project>
pnpm seo:validate <project>
```
