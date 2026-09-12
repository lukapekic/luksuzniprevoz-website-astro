# Portable SEO Research Package — Implementation Plan

Status: **V1 IMPLEMENTED; LIVE PROVIDER AND SECOND REAL-REPOSITORY PROOF DEFERRED**  
Initial target: `site/luksuzni-prevoz/`  
Portable target: another repository using the same Astro Foundation route,
content, and locale contracts

This plan defines a reusable, read-first SEO research package that combines the
repository's existing deterministic SEO validation with ValueSERP research,
bounded competitor inspection, historical snapshots, and evidence-backed
content proposals. It does not authorize automatic content mutation or changes
to production page structure.

## 1. Authority and applied procedures

Implement beneath, in order:

1. root `AGENTS.md`;
2. validated `foundation.config.ts` and route/content contracts;
3. current public APIs from `@astro-foundation/core`;
4. `.skills/astro-architecture.md`;
5. `.skills/technical-seo.md`.

The package owns reusable research mechanisms. Each target site continues to
own its identity, locales, routes, localized content, verified business facts,
keyword targets, search intent, and competitor selection.

No part of this package may become a second source of truth for:

- localized routes;
- canonical URLs or trailing-slash behavior;
- page publication/indexability state;
- visible page copy;
- contact, pricing, fleet, service, review, or availability facts;
- structured-data claims;
- theme or UI values.

## 2. Intended outcome

Provide one portable workspace package:

```text
packages/seo-research/
```

with package name:

```text
@astro-foundation/seo-research
```

The primary command is:

```bash
pnpm seo:research \
  --project site/luksuzni-prevoz \
  --route airportTransportation \
  --locale en \
  --json
```

It produces a versioned JSON evidence bundle containing:

- resolved page identity and source digest;
- current source and rendered SEO state;
- existing Foundation SEO findings;
- localized ValueSERP results and the site's position;
- bounded competitor-page observations;
- deterministic content/structure gaps;
- field-level proposed changes where evidence is sufficient;
- explicit uncertainty, provenance, and review requirements.

The package must be copyable into another Foundation repository without source
changes. The destination site supplies only its own configuration and target
data.

## 3. Locked implementation decisions

| Concern             | Decision                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Package boundary    | New `packages/seo-research`; do not add ValueSERP or site research policy to `@astro-foundation/core`.                       |
| Rendering           | No runtime or client code; Astro remains static-first.                                                                       |
| Site selection      | `--project` is required. No default site, first-site selection, or fallback.                                                 |
| Site imports        | The package never statically imports from `site/luksuzni-prevoz`.                                                            |
| Site truth          | Load identity/locales from `foundation.config.ts`, paths from the route map, and editorial copy from localized content.      |
| Research config     | A tracked `seo-research.config.ts` lives at the target site root.                                                            |
| Locales             | Discover configured locales; do not hard-code SR/EN/RU in package logic. The initial site config must define all three.      |
| Output              | JSON is canonical; human-readable console/Markdown output is derived.                                                        |
| Default behavior    | Read-only. No source edits, commits, pull requests, indexing requests, or external writes beyond configured local artifacts. |
| ValueSERP           | Optional external provider enabled only when configured and supplied an environment key.                                     |
| Competitor fetching | Bounded, cached, size-limited, and read-only. Do not store full third-party HTML in durable reports.                         |
| Suggestions         | Evidence-backed, field-level, schema-validated, and always marked for human review.                                          |
| Content application | Deferred. V1 must not include an `apply` command.                                                                            |
| AI generation       | Provider-neutral interface. Evidence collection and deterministic analysis must work without an AI provider.                 |
| Generated state     | Stored under the selected project, never inside the reusable package.                                                        |

## 4. Existing repository capabilities to reuse

Reuse public, verified contracts instead of rebuilding them:

- `foundation.config.ts` for site identity and locales;
- `src/data/routes.ts` and `getPath()` for localized URLs;
- `BaseContentSchema`, `BaseSeoSchema`, and site page schemas for content shape;
- `@astro-foundation/core/seo` types and pure validation where public APIs are
  sufficient;
- current title composition, hreflang, canonical, breadcrumb, and structured
  data helpers;
- root `seo:validate`, `routes:validate`, and `content:validate` behavior as
  acceptance gates;
- Vitest and existing TypeScript conventions.

Do not copy these WordPress-toolkit boundaries:

- WordPress REST clients;
- RankMath field names;
- Polylang post relationships;
- numeric post IDs as suggestion targets;
- schema injection plugins;
- direct remote mutation and rollback commands;
- regular-expression-only HTML parsing.

## 5. Target file map

Create:

```text
packages/seo-research/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts
│   ├── cli.ts
│   ├── errors.ts
│   ├── config/
│   │   ├── define-config.ts
│   │   ├── load-config.ts
│   │   └── schema.ts
│   ├── site/
│   │   ├── load-site.ts
│   │   ├── discover-content.ts
│   │   ├── resolve-route.ts
│   │   └── source-digest.ts
│   ├── providers/
│   │   ├── types.ts
│   │   └── valueserp.ts
│   ├── collect/
│   │   ├── source-page.ts
│   │   ├── rendered-page.ts
│   │   ├── competitor-page.ts
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── analyze/
│   │   ├── technical.ts
│   │   ├── serp.ts
│   │   ├── content.ts
│   │   ├── internal-links.ts
│   │   ├── locale-parity.ts
│   │   └── proposals.ts
│   ├── reports/
│   │   ├── schema.ts
│   │   ├── build-report.ts
│   │   └── markdown.ts
│   ├── suggestions/
│   │   ├── schema.ts
│   │   ├── provider.ts
│   │   └── validate.ts
│   └── storage/
│       ├── cache.ts
│       └── snapshots.ts
└── tests/
    ├── fixtures/
    │   ├── site-a/
    │   └── site-b/
    ├── config.test.ts
    ├── site-loader.test.ts
    ├── rendered-page.test.ts
    ├── valueserp.test.ts
    ├── analysis.test.ts
    ├── suggestions.test.ts
    ├── snapshots.test.ts
    └── cli.test.ts
```

Create for the initial site:

```text
site/luksuzni-prevoz/seo-research.config.ts
```

Modify during implementation:

```text
package.json
.gitignore
docs/README.md
pnpm-lock.yaml                 # only if a direct dependency is added
```

Avoid changing production components, content, routes, themes, generated theme
CSS, or generated route types while building the package.

## 6. Package and dependency contract

Initial `package.json` shape:

```json
{
  "name": "@astro-foundation/seo-research",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "research": "tsx src/cli.ts",
    "check": "tsc --noEmit",
    "test:unit": "vitest run"
  },
  "dependencies": {
    "@astro-foundation/core": "workspace:*",
    "yaml": "^2",
    "zod": "^3"
  }
}
```

Before selecting an HTML parser, inspect existing direct dependencies and the
required extraction surface. Prefer one explicit standards-based parser such as
`parse5`; do not rely on a transitive dependency and do not parse arbitrary HTML
with regular expressions. Record the dependency decision in the package README.

Do not add an HTTP library. Node's native `fetch`, `AbortController`, URL, and
stream primitives are sufficient for the initial provider and collector.

## 7. Site research configuration

The target site's `seo-research.config.ts` is tool configuration, not production
content or product configuration. It may identify research targets and
competitors, but it must not duplicate site identity, locales, slugs, canonical
URLs, or business facts.

Public configuration shape:

```ts
interface SeoResearchConfig {
  readonly schemaVersion: 1;
  readonly targets: readonly SeoResearchTarget[];
  readonly competitors?: readonly CompetitorTarget[];
  readonly provider?: {
    readonly kind: "valueserp";
    readonly apiKeyEnv: "VALUESERP_API_KEY";
  };
  readonly limits?: {
    readonly maxQueriesPerRun?: number;
    readonly maxOrganicResultsPerQuery?: number;
    readonly maxCompetitorPagesPerQuery?: number;
    readonly requestTimeoutMs?: number;
    readonly maxResponseBytes?: number;
    readonly cacheTtlHours?: number;
  };
}

interface SeoResearchTarget {
  readonly routeKey: string;
  readonly intent: "informational" | "navigational" | "commercial" | "transactional" | "mixed";
  readonly locales: Readonly<Record<string, LocaleSearchTarget>>;
}

interface LocaleSearchTarget {
  readonly primaryKeyword: string;
  readonly secondaryKeywords?: readonly string[];
  readonly entities?: readonly string[];
  readonly questions?: readonly string[];
  readonly search: {
    readonly languageCode: string;
    readonly countryCode: string;
    readonly location?: string;
    readonly googleDomain?: string;
    readonly device?: "desktop" | "tablet" | "mobile";
  };
}

interface CompetitorTarget {
  readonly name: string;
  readonly domain: string;
  readonly sitemapUrl?: string;
  readonly trackedRoutePatterns?: readonly string[];
}
```

Validation rules:

- every configured `routeKey` resolves in the selected site's route map;
- every configured locale exists in `foundation.config.ts`;
- published target routes have a content entry for every configured locale;
- scaffold, draft, unavailable, and noindex targets are rejected by default;
- an explicit `includeNonIndexable: true` diagnostic override may inspect them,
  but they never receive ranking recommendations;
- every locale target supplies its own keyword research; no locale fallback;
- URL values are not accepted for site pages because the route map owns them;
- unknown keys fail strict Zod validation.

## 8. Public package API

Export only stable orchestration and schema contracts:

```ts
export {
  defineSeoResearchConfig,
  loadSeoResearchConfig,
  runSeoResearch,
  compareSeoSnapshots,
  parseSeoResearchReport,
  parseSeoSuggestionFile,
};

export type {
  SeoResearchConfig,
  SeoResearchRequest,
  SeoResearchReport,
  SeoEvidence,
  SeoFinding,
  SeoProposal,
  SeoSuggestionProvider,
};
```

Keep ValueSERP payload details and site-loader internals private. Consumers use
normalized package types rather than provider response shapes.

Do not expose mutable singletons. Core functions accept configuration, clock,
filesystem, and fetch dependencies where determinism or testing requires them.

## 9. Canonical report contract

Use a strict, versioned Zod schema. The report should have this top-level shape:

```ts
interface SeoResearchReport {
  readonly schemaVersion: 1;
  readonly run: {
    readonly id: string;
    readonly generatedAt: string;
    readonly packageVersion: string;
    readonly project: string;
    readonly mode: "offline" | "built" | "live";
    readonly provider: "valueserp" | null;
    readonly cache: { readonly hits: number; readonly misses: number };
    readonly budget: { readonly allowed: number; readonly used: number };
  };
  readonly page: {
    readonly routeKey: string;
    readonly locale: string;
    readonly url: string;
    readonly sourcePath: string;
    readonly sourceDigest: string;
    readonly published: boolean;
    readonly indexable: boolean;
  };
  readonly target: LocaleSearchTarget;
  readonly current: CurrentPageEvidence;
  readonly serp: SerpEvidence | null;
  readonly competitors: readonly CompetitorEvidence[];
  readonly findings: readonly SeoFinding[];
  readonly proposals: readonly SeoProposal[];
  readonly warnings: readonly ResearchWarning[];
}
```

Every finding and proposal must reference evidence IDs. Do not emit unsupported
free-form conclusions detached from observed data.

Proposal shape:

```ts
interface SeoProposal {
  readonly id: string;
  readonly target: {
    readonly routeKey: string;
    readonly locale: string;
    readonly sourcePath: string;
    readonly fieldPath: string;
  };
  readonly currentValue: unknown;
  readonly proposedValue: unknown;
  readonly category:
    "metadata" | "heading" | "content-coverage" | "internal-link" | "image" | "structured-data";
  readonly severity: "low" | "medium" | "high";
  readonly confidence: "low" | "medium" | "high";
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly factImpact: "none" | "restates-existing" | "new-claim";
  readonly requiresReview: true;
  readonly sourceDigest: string;
}
```

Proposals with `factImpact: "new-claim"` must be warnings/opportunities only;
they must not contain publishable replacement copy until the fact is added to
an approved canonical source and verified.

## 10. CLI contract

Add root script:

```json
{
  "seo:research": "pnpm --silent --filter @astro-foundation/seo-research exec tsx src/cli.ts"
}
```

Supported initial commands:

```text
seo:research validate-config
seo:research run
seo:research compare
seo:research validate-suggestions
```

Required/common flags:

```text
--project <path>                 required for every command
--route <routeKey>               required for a single-page run
--locale <locale>                required for a single-page run
--all                            run every configured target with budget checks
--mode <offline|built|live>      default: built
--json                           print canonical JSON to stdout
--output <path>                  write canonical JSON atomically
--skip-serp                      do not call ValueSERP
--skip-competitors               do not fetch ranking pages
--refresh                        bypass valid cache entries
--max-queries <count>            may lower, never raise, configured run budget
```

Behavior:

- `offline` uses stored normalized fixtures/cache and never performs network
  access;
- `built` reads local production output and uses external research providers if
  enabled;
- `live` reads the deployed page and external providers;
- missing built output in `built` mode produces a clear error with the required
  site build command; the package does not silently build or switch to live;
- JSON mode writes only JSON to stdout; progress and warnings go to stderr;
- partial provider failures are represented in `warnings` and do not erase
  successful evidence;
- invalid configuration, unresolved routes/content, exhausted budgets, and
  invalid report/suggestion schemas fail non-zero.

## 11. Site and rendered-page collection

### Site inventory

Given `--project`, resolve and load exactly:

```text
<project>/foundation.config.ts
<project>/src/data/routes.ts
<project>/src/content/pages/**/*.md
<project>/seo-research.config.ts
```

The loader must:

1. resolve the project beneath the repository root;
2. reject missing or ambiguous authority files;
3. validate site config, routes, research config, and content identity;
4. map `(routeKey, locale)` to one content source;
5. derive the public path through `getPath()`;
6. compute a stable digest from the source content;
7. retain the exact source path for proposal targeting.

Do not infer route identity from directory or file names.

### Rendered page

Use a standards-based HTML parser to collect:

- document language and direction;
- title and meta description;
- canonical and hreflang links;
- robots directives;
- Open Graph and Twitter metadata;
- H1 count/text and ordered H2/H3 outline;
- visible paragraph/list/table text with navigation/chrome separated where
  possible;
- internal links and anchor text;
- image source, role, alt, width, and height;
- JSON-LD blocks and declared types.

Built mode resolves the expected HTML artifact from the canonical localized
path and trailing-slash contract. Live mode follows a small, fixed redirect
limit and records the final URL/status.

The report stores extracted facts and short bounded excerpts only. Full HTML is
eligible for ephemeral cache storage but not durable snapshots.

### Existing SEO validation

Prefer calling the existing pure Foundation validator with a correctly built
page/site model. Do not scrape human-formatted terminal output. If a required
validator helper is not public, either:

1. add a small backward-compatible public export to
   `@astro-foundation/core/seo`; or
2. keep a package-local adapter that builds the existing public input type.

Do not duplicate FND rule implementations in the research package.

## 12. ValueSERP provider

Adapt the proven client concepts:

- typed normalized query/result contracts;
- injected `fetch` and clock for tests;
- request timeout;
- safe parsing of malformed optional fields;
- domain-position resolution including `www`/subdomain handling;
- sequential or deliberately bounded requests;
- structured provider errors.

Add the protections missing from the source implementation:

- strict Zod validation of provider responses before normalization;
- per-run query budget enforced before the first request;
- cache key covering keyword, location, domain, language, country, device, and
  result count;
- bounded exponential retry for `429` and transient `5xx` only;
- `Retry-After` support;
- partial-result handling for multi-query runs;
- API-key redaction from errors, debug output, cache metadata, and reports;
- no logging of the complete request URL because the provider key may be a
  query parameter;
- configurable timeout and cache TTL with conservative maximums;
- one opt-in live smoke test, disabled in normal CI.

Normalized SERP evidence should retain:

```text
keyword
locale/search parameters
fetchedAt
organic position
URL/domain
title
snippet
our matched position and URL
```

Do not treat a single localized SERP result as universal or stable ranking
truth. Record location, language, device, and timestamp on every result.

## 13. Competitor and sitemap collection

Select competitor pages from two bounded sources:

1. top organic results for the current query;
2. explicitly configured tracked competitors.

Rules:

- deduplicate canonicalized URLs;
- exclude the target site's own domain from competitor observations;
- cap pages per query and pages per domain;
- allow only `http:` and `https:` URLs without embedded credentials;
- block loopback, link-local, private-network, and unsupported destinations;
- enforce redirect, timeout, content-type, and response-size limits;
- use a transparent package user agent;
- respect robots directives by default;
- avoid repeated fetches through cache TTLs;
- retain titles, descriptions, headings, schema types, and bounded excerpts,
  not complete copied content.

Store complete normalized sitemap entry sets in snapshots before computing a
diff. Never reconstruct a previous sitemap from its prior `added`/`removed`
delta.

Sitemap reports may identify new or removed competitor URLs. They must not
automatically recommend creating equivalent pages; route/content additions are
separate product decisions.

## 14. Deterministic analysis

Analysis must remain useful without a model provider.

### Technical findings

Carry through existing FND issues and add observations that require rendered
HTML, including:

- actual H1 count and heading sequence;
- rendered canonical/hreflang/robots state;
- source-versus-rendered metadata mismatch;
- rendered internal-link graph and orphan risk;
- missing/broken image metadata;
- JSON-LD parse/type presence;
- mobile/live content parity only when both variants were actually collected.

### SERP findings

Report:

- current site position or absence within the requested result window;
- which site URL ranks for the query;
- potential route cannibalization when the ranking URL differs from the target;
- position change against a comparable prior snapshot;
- recurring title/snippet patterns as observations, not prescriptive truth.

### Content findings

Compare only against configured targets and observed evidence:

- intent alignment between target and page archetype/content;
- primary topic presence in title, rendered H1, introduction, and relevant
  sections using locale-safe normalization;
- configured entity/question coverage;
- useful subtopics repeatedly present in ranking pages but absent locally;
- thin or generic section text;
- internal-link opportunities to existing route keys;
- source/rendered localization leakage across SR/EN/RU.

Do not calculate or optimize keyword density. Do not recommend stuffing every
heading with the primary query. Morphological or semantic conclusions that the
deterministic analyzer cannot support must be marked low-confidence or left to
the optional suggestion provider.

### Locale parity

Compare structural field paths and coverage, not literal text equality. Every
locale is researched independently. A missing locale target is a configuration
error, not permission to reuse another locale's keywords or proposals.

## 15. Proposal generation and AI handoff

### Deterministic proposals

V1 may emit exact field-level proposals only when the replacement is fully
derivable without inventing copy, for example:

- remove a duplicated brand suffix when the existing title template owns it;
- correct a canonical/internal route reference through the route map;
- identify a missing configured topic and target field without drafting a new
  business claim;
- propose an existing related route key as an internal-link target.

For nuanced title, description, heading, FAQ, or body rewrites, V1 emits an
evidence-backed proposal request rather than pretending a deterministic rewrite
is editorially valid.

### Suggestion-provider contract

Define:

```ts
interface SeoSuggestionProvider {
  readonly id: string;
  generate(input: SeoSuggestionInput): Promise<readonly SeoProposal[]>;
}
```

The provider receives only:

- current localized content fields;
- configured intent/keywords/entities/questions;
- normalized technical and SERP evidence;
- short competitor observations;
- an allowlist of target field paths;
- explicit fact and localization constraints.

Provider output must pass the strict proposal schema. Reject:

- unknown route keys/locales/field paths;
- missing current values or source digests;
- evidence IDs that do not exist;
- unverified numeric or operational claims;
- invented reviews, dates, availability, prices, locations, schema facts, or
  service relationships;
- proposals for a locale not independently configured;
- source-code replacements or CSS/component edits.

The initial implementation should provide the interface, prompt/evidence export,
and `validate-suggestions` command. A direct model API adapter is a separate
bounded phase requiring an explicit provider/model decision. This keeps the
portable package useful with Codex or another reviewed AI workflow without
hard-coding one vendor.

## 16. Storage, caching, and history

Default generated root:

```text
<project>/.seo-research/
├── cache/
├── runs/
└── snapshots/
```

Add the whole directory to `.gitignore` initially. Operators may copy selected
normalized reports to a tracked documentation location deliberately; the tool
must not commit them automatically.

Writes must be atomic:

1. validate complete output;
2. write to a sibling temporary file;
3. rename to the final path.

Snapshot identity includes the comparable query dimensions. Do not compute
position deltas across different keywords, locations, languages, countries,
Google domains, devices, or result windows.

Cache/report files must never contain:

- API keys or authorization headers;
- full ValueSERP request URLs containing credentials;
- full competitor HTML;
- environment dumps;
- unpublished content from outside the selected repository;
- form/customer data.

## 17. Delivery phases

### Phase 1 — Package skeleton and strict configuration

1. Create the workspace package and TypeScript/Vitest configuration.
2. Add `defineSeoResearchConfig()` and strict Zod schemas.
3. Add the root command wrapper.
4. Create the initial site config with one intentionally small SR/EN/RU target.
5. Add configuration and CLI argument tests.

Exit criteria:

- the package checks and tests independently;
- explicit project/config loading works from repository root;
- invalid project, route, locale, and unknown config keys fail clearly;
- no network access exists yet.

### Phase 2 — Site inventory and source/rendered evidence

1. Discover route/content pairs from authoritative files.
2. Resolve URLs through `getPath()`.
3. Compute source digests.
4. Add standards-based built/live HTML extraction.
5. Integrate existing Foundation SEO validation.
6. Produce a valid offline/source report without SERP evidence.

Exit criteria:

- representative home, service, hub, noindex, and scaffold fixtures behave
  correctly;
- built output confirms actual H1/head/link/schema behavior;
- no route is derived from a filename or manually concatenated locale path.

### Phase 3 — ValueSERP provider and safe cache

1. Implement normalized provider types and parser.
2. Add timeout, retry, budget, redaction, and cache behavior.
3. Add domain-position and cannibalization inputs.
4. Test entirely with injected fetch fixtures.
5. Add an opt-in one-query live smoke command.

Exit criteria:

- normal CI uses zero provider credits;
- malformed/partial provider payloads are safe;
- keys cannot appear in snapshots, stdout, stderr, or thrown messages;
- repeated equivalent queries use the cache.

### Phase 4 — Competitor and sitemap evidence

1. Select bounded ranking/configured pages.
2. Add safe remote-fetch guards and robots handling.
3. Extract normalized metadata, outline, schema types, and short evidence.
4. Store full normalized sitemap sets and calculate valid deltas.

Exit criteria:

- response/redirect/domain budgets are enforced;
- private/local network targets are rejected;
- durable output contains no full third-party HTML;
- snapshot diffs compare full prior and current sets.

### Phase 5 — Deterministic analysis and canonical report

1. Implement technical, SERP, content, internal-link, and locale-parity analyzers.
2. Assign stable finding/evidence IDs.
3. Implement the versioned report schema and Markdown renderer.
4. Add snapshot comparison with exact query-dimension matching.

Exit criteria:

- every finding cites evidence;
- the report distinguishes observation, inference, and proposal;
- analysis remains useful in `offline` and `--skip-serp` modes;
- results are deterministic for fixed fixtures and clock.

### Phase 6 — Proposal schema and reviewed AI workflow

1. Implement strict field-level proposal schemas.
2. Add allowlisted page-archetype field paths.
3. Add fact-impact classification and source-digest requirements.
4. Export a bounded suggestion input document.
5. Add `validate-suggestions` for AI-produced JSON.
6. Document the Codex/manual review workflow.

Exit criteria:

- proposals cannot target components, CSS, generated files, routes, or business
  data;
- stale source digests and invented evidence references fail;
- every proposal is marked `requiresReview: true`;
- no command mutates content.

### Phase 7 — Optional direct suggestion provider

Proceed only after an explicit provider/model decision.

1. Add one provider adapter behind `SeoSuggestionProvider`.
2. Use structured output with strict schema validation.
3. Cap input/output tokens and retries.
4. redact credentials and avoid persisting provider prompts containing more
   source content than the canonical report already permits.
5. retry invalid structured output once, then fail safely.

Exit criteria:

- evidence-only mode remains the default and works without the provider;
- direct suggestion generation is opt-in;
- generated proposals pass the same validator as manually supplied proposals;
- no auto-apply path exists.

### Phase 8 — Portability proof and documentation

1. Test against two fixture sites with different route keys, pages, themes, and
   configured locales.
2. Copy the package unchanged into the second real Foundation repository.
3. Add only its package registration, root script, site config, environment
   secret, and ignored state directory.
4. Run an offline fixture pass before any live provider request.
5. Document migration and compatibility requirements in the package README.

Exit criteria:

- no source change inside `packages/seo-research` is needed for the second site;
- theme differences have no effect on research behavior;
- the second site resolves all URLs/content through its own authorities;
- both repositories pass package and existing SEO/content/route gates.

## 18. Test plan

### Unit tests

- strict config acceptance/rejection;
- explicit project-path resolution and traversal rejection;
- route/locale/content mapping;
- scaffold/draft/noindex exclusion;
- source digest determinism;
- title/meta/canonical/hreflang/robots extraction;
- H1 count and heading order;
- internal-link and image extraction;
- valid/invalid JSON-LD collection;
- ValueSERP normalization and malformed payloads;
- domain matching without substring false positives;
- query-cache key completeness;
- timeout, retry, `Retry-After`, budget, and partial failure behavior;
- secret redaction;
- remote-fetch URL/redirect/size/content-type guards;
- sitemap full-snapshot diffs;
- comparable/non-comparable historical queries;
- locale parity without literal translation assumptions;
- evidence reference integrity;
- suggestion target allowlists and stale digest rejection;
- atomic artifact writes.

### Integration tests

- CLI JSON stdout remains machine-parseable while progress uses stderr;
- offline run against both fixture sites;
- built run against a small generated `dist` fixture;
- all-target run stops before exceeding its query budget;
- one provider failure preserves other successful query evidence;
- existing Foundation validator findings retain their original rule IDs;
- report parse round-trip and snapshot comparison.

### Manual/live checks

- one opt-in ValueSERP query with an approved key;
- verify query location/language/device in the saved normalized result;
- confirm no key appears in console, error, report, or cache metadata;
- inspect one local built page and one live page for extraction parity;
- inspect one competitor fetch for robots, response cap, and excerpt limits;
- review SR, EN, and RU proposal quality independently.

## 19. Required verification

During package implementation, run at minimum:

```bash
pnpm --filter @astro-foundation/seo-research check
pnpm --filter @astro-foundation/seo-research test:unit
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm lint
pnpm test:unit
pnpm types:generate:check
pnpm theme:sync:check
pnpm traceability --check
pnpm secret-scan
```

Also run an offline package acceptance command, for example:

```bash
pnpm seo:research run \
  --project site/luksuzni-prevoz \
  --route airportTransportation \
  --locale en \
  --mode offline \
  --json
```

The exact CLI syntax must be finalized in Phase 1 and documented consistently.
Do not claim live ValueSERP verification unless the opt-in live smoke actually
runs successfully.

No design-governance preflight or UI verification is required unless a later
task adds or changes production UI. This package plan contains no visible UI
work.

## 20. Completion criteria

The package is complete for V1 when:

- it can be copied unchanged into the second Foundation repository;
- each repository supplies only site-owned research configuration;
- all URLs and locale relationships derive from canonical route/config data;
- local source and built HTML are analyzed together;
- ValueSERP use is bounded, cached, typed, and secret-safe;
- competitor evidence is bounded and legally/copyright-conscious;
- reports use a strict versioned JSON schema;
- every finding/proposal cites evidence and a source digest;
- no locale fallback or invented translation occurs;
- no unverified business fact becomes proposed publishable copy;
- no source mutation occurs;
- package, site, route, content, SEO, lint, type, unit, and secret checks pass;
- package README documents installation, config, commands, output schemas,
  offline operation, live-cost behavior, and copy-to-another-repository steps.

## 21. Deferred work

The following remain outside V1:

- a direct model/API implementation of `SeoSuggestionProvider`;
- an approved live ValueSERP/competitor smoke run using real provider credits;
- copying and registering the package in the second real repository (the two-site fixture proof is
  included in V1);
- applying proposals to Markdown;
- automatic branches, commits, or pull requests;
- Google Search Console integration;
- backlink analysis;
- rank tracking outside configured ValueSERP queries;
- image vision/alt-text generation;
- automatic route or page creation;
- submitting URLs for indexing;
- dashboards or client-side UI;
- SSR/endpoints/CMS integration.

Any future apply workflow requires a separate plan covering YAML-preserving
edits, content-schema validation, source-digest locking, localized review,
rollback strategy, and the repository's full content/SEO quality gates.
