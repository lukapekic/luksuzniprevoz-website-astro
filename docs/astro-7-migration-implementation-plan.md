# Astro 7 Migration — Implementation Plan

Date: 2026-09-15  
Status: Implemented on `chore/astro-7-migration`; local verification is complete
except for the explicitly external acceptance items noted below. See
`docs/astro-7-migration-verification-report.md` for the implementation evidence.
Baseline commit used for the rehearsal:
`a46b9af7ec68e18701470bec0425932dca989bea` (`master`).

## 1. Objective

Upgrade the workspace's production site from Astro `5.18.2` to Astro `7.3.2`
without changing product behavior, page structure, localized content, routing,
SEO output, visual identity, or the static deployment architecture.

The migration must also remove the dependency advisories currently inherited
through Astro and make the production dependency audit enforce high and
critical findings instead of converting every audit failure into a successful
exit.

The completed migration must preserve:

- static Astro output;
- all 49 currently generated pages and endpoints;
- all configured locales (`sr`, `en`, and `ru`);
- the existing route map and always-trailing-slash behavior;
- the current content schemas and authored content semantics;
- the active Theme V2 output and component contracts;
- the current Tailwind CSS v4 integration;
- booking, form, pricing, navigation, structured-data, and image behavior;
- the existing browser accessibility and responsive acceptance floor.

## 2. Scope boundaries

### In scope

- Astro `5.18.2` to `7.3.2`;
- the Zod 3 to Zod 4 migration required by Astro 7 content schemas;
- Astro 7 content-schema import changes;
- the one confirmed Zod 4 validator API change in the shared foundation;
- lockfile regeneration;
- narrowly scoped transitive dependency overrides needed to remove remaining
  advisories;
- audit enforcement at the high/critical threshold;
- generated-type, route, content, SEO, build, unit, accessibility, responsive,
  and functional verification;
- correction of stale comments that explicitly describe current code as
  Astro 5-specific;
- correction of the confirmed accessibility-test synchronization gap exposed
  by the Astro 7 rehearsal.

### Out of scope

- Cloudflare configuration or deployment implementation;
- GitHub Actions consolidation or general CI redesign;
- changing from static output to SSR, server islands, or endpoints requiring an
  Astro adapter;
- page redesign, component redesign, theme changes, or token changes;
- changes to localized copy, route slugs, pricing, fleet, contact, or service
  facts;
- opportunistic dependency upgrades unrelated to Astro 7 compatibility or the
  identified audit findings;
- broad Zod migration of isolated packages that do not compose schemas with
  Astro;
- suppressing type, lint, accessibility, audit, or build failures.

If implementation reveals that any production UI or content change is needed,
stop and classify it separately. The migration does not authorize visual or
editorial changes.

## 3. Authority and required procedure

Apply, in order:

1. root `AGENTS.md`;
2. current workspace/package configuration;
3. current public contracts from `@astro-foundation/core`;
4. `.skills/astro-architecture.md`;
5. official Astro 6 and Astro 7 upgrade documentation;
6. current implementation only after the above authorities.

The migration changes a shared foundation dependency and content schemas.
Treat it as a cross-package/foundation change. Do not manually edit generated
files. Use `pnpm` only.

Before implementation:

```bash
git status --short --branch
node --version
pnpm --version
pnpm install --frozen-lockfile
```

Expected runtime contract:

```text
Node: 22.22.2 from .nvmrc
pnpm: 10.14.0 from packageManager
```

Use a dedicated branch and a clean starting worktree. Do not combine this
migration with deployment work or unrelated UI/content changes.

Recommended branch:

```bash
git switch -c chore/astro-7-migration
```

## 4. Current dependency and security baseline

### Direct versions

```text
site/luksuzni-prevoz/package.json
  astro: 5.18.2

packages/astro-foundation/package.json
  zod: ^3.25.0

packages/seo-research/package.json
  zod: ^3.25.0
```

The SEO research package's Zod 3 dependency is isolated from Astro content
schema composition. Do not upgrade it merely to force a single Zod major across
the workspace. Its tests passed while the foundation package used Zod 4 in the
rehearsal.

### Audit baseline

`pnpm audit --prod` reported 16 advisories:

```text
3 low
6 moderate
6 high
1 critical
```

Grouped by dependency:

| Dependency            | Findings | Current version | Patched target  |
| --------------------- | -------: | --------------- | --------------- |
| Astro                 |       10 | 5.18.2          | 7.2.8 or newer  |
| Sharp                 |        2 | 0.34.5          | 0.35.4 or newer |
| SVGO                  |        2 | 4.0.2           | 4.1.0 or newer  |
| js-yaml               |        1 | 4.3.1           | 4.3.2 or newer  |
| esbuild through Astro |        1 | 0.27.7          | 0.28.1 or newer |

The individual findings observed on 2026-09-15 were:

| Severity | Package                                       | Advisory              | Minimum patched version    |
| -------- | --------------------------------------------- | --------------------- | -------------------------- |
| Critical | Astro/Sharp AVIF optimization                 | `GHSA-26w7-cxv4-gfx2` | Astro 7.2.8 / Sharp 0.35.4 |
| High     | Sharp/libvips                                 | `GHSA-f88m-g3jw-g9cj` | Sharp 0.35.0               |
| High     | Sharp/libheif                                 | `GHSA-rgj7-g3m4-5g8c` | Sharp 0.35.4               |
| High     | Astro prerendered error-page Host-header SSRF | `GHSA-2pvr-wf23-7pc7` | Astro 6.4.6                |
| High     | Astro unescaped slot-name XSS                 | `GHSA-8hv8-536x-4wqp` | Astro 6.3.3                |
| High     | js-yaml merge-source CPU exhaustion           | `GHSA-2883-xcg3-v3hh` | js-yaml 4.3.2              |
| High     | SVGO executable-link sanitization bypass      | `GHSA-w27v-7q3p-w38r` | SVGO 4.1.0                 |
| Moderate | Astro `define:vars` XSS                       | `GHSA-j687-52p2-xcff` | Astro 6.1.6                |
| Moderate | Astro spread-prop attribute-name XSS          | `GHSA-jrpj-wcv7-9fh9` | Astro 6.4.6                |
| Moderate | Astro incomplete spread-attribute fix         | `GHSA-f48w-9m4c-m7f5` | Astro 7.0.6                |
| Moderate | Astro View Transition reflected XSS           | `GHSA-4g3v-8h47-v7g6` | Astro 7.1.0                |
| Moderate | Astro configured-base authorization bypass    | `GHSA-376h-93r7-7g6f` | Astro 7.2.4                |
| Moderate | SVGO `foreignObject` sanitization bypass      | `GHSA-4vpr-x523-8j87` | SVGO 4.1.0                 |
| Low      | Astro server-island parameter replay          | `GHSA-xr5h-phrj-8vxv` | Astro 6.1.10               |
| Low      | Astro hydrated transition-directive XSS       | `GHSA-7pw4-f3q4-r2p2` | Astro 7.0.4                |
| Low      | esbuild Windows development-server traversal  | `GHSA-g7r4-m6w7-qqqr` | esbuild 0.28.1             |

The site is static, so several SSR/runtime prerequisites are absent. This
reduces exposure but does not make the dependency state acceptable. The
critical AVIF issue is a build-time image-processing risk and is relevant to
CI or Cloudflare build workers if an untrusted image reaches the build.

### Current audit enforcement problem

The current root script intentionally exits successfully even when the audit
reports vulnerabilities:

```json
"audit:deps": "pnpm audit --prod || (... && exit 0)"
```

Consequently, a green release workflow does not currently mean a clean or
policy-compliant dependency audit.

## 5. Rehearsal evidence

A disposable copy of baseline commit
`a46b9af7ec68e18701470bec0425932dca989bea` was created under `/tmp`. No rehearsal
change was applied to the real worktree.

### 5.1 Unmodified Astro 7 result

Changing only Astro from `5.18.2` to `7.3.2` failed during content type
generation:

```text
[GenerateContentTypesError]
Cannot read properties of undefined (reading 'def')
```

The failure originated while constructing the page discriminated union in:

```text
site/luksuzni-prevoz/src/content/schemas/pages.ts
```

Root cause: the site composed schemas created by Astro 7's Zod 4 instance with
shared schemas created by `@astro-foundation/core` using Zod 3.

### 5.2 First Zod alignment result

Moving the foundation package to Zod 4 allowed content synchronization to
proceed, but the deprecated `z` import from `astro:content` caused content
schema inference to degrade to `unknown`. This produced 576 cascading Astro
component errors. These were not 576 independent migration defects.

After switching the relevant imports to `astro/zod` and aligning the foundation
schema implementation with Zod 4, Astro check dropped to one remaining import
error, then to zero errors after correcting that import.

### 5.3 Confirmed Zod 4 API break

The foundation's `AutocompleteSchema` uses the Zod 3 form of `.refine()` where
the second callback receives the parsed value and returns a message. Zod 4 no
longer accepts that signature. The rehearsal replaced it with
`.superRefine((value, context) => ...)` and `context.addIssue(...)`, preserving
the existing detailed invalid-token message.

### 5.4 Successful static result

After the bounded changes described in this plan:

```text
Astro check:       223 files, 0 errors
Static build:      49 pages built
Image generation: 364 variants generated
Routes validation: passed
Content validation: 45/45 files passed
SEO validation:   passed
```

No page component implementation, localized Markdown file, route, data file,
theme token, or production CSS change was needed.

The cold build took approximately 5 minutes 8 seconds because the disposable
copy had no Astro image cache and recompressed all 364 image variants. The next
cached build took approximately 3.3 seconds. Treat cold-build resource usage as
a deployment verification item, not as an Astro incompatibility.

### 5.5 Successful unit result

All existing unit suites passed after the migration changes:

```text
@astro-foundation/core
@astro-foundation/seo-research
eslint-plugin-astro-foundation
@luksuzni-prevoz/site
```

The pre-migration suite contains 286 foundation tests, 26 SEO research tests,
80 ESLint-plugin tests, and 36 site test cases. Do not reduce coverage during
the migration.

### 5.6 Browser result and known synchronization defect

The complete Chromium smoke suite ran 316 tests:

```text
315 passed
1 failed
```

All tested responsive states passed at:

```text
320
768
1024
1440
1920
```

The passing coverage included localized routes, SEO output, navigation,
booking, forms, pricing, fleet, header/dropdowns, enlarged text, minimum target
size, image loading, horizontal overflow, and page-specific WCAG checks.

The single failure was:

```text
site/luksuzni-prevoz/tests/smoke/accessibility.spec.ts
Accessibility (axe-core)
FND-A11Y-01: content page has no WCAG 2.2 axe violations
```

Axe sampled the airport-page primary CTA during an apparent transition state
and reported varying transient contrast ratios (`2.34` and `3.07`). The
airport page's dedicated WCAG test passed. Repeating only the failing generic
test three times produced two passes and one failure. This is evidence of a
timing-sensitive test, not proof of a settled-state visual regression.

The migration must still resolve the test deterministically. Do not weaken Axe,
disable the color-contrast rule, or change design tokens merely to silence the
test. First ensure the generic content-page scan waits for the same settled
animation state already used by the homepage scan. Then inspect final computed
foreground/background colors. If the settled state fails, classify it as a real
accessibility blocker and follow normal theme/design governance.

Firefox and WebKit were not exercised against Astro 7 in the rehearsal. The
local Fedora 43 host could run Chromium and Firefox generally, but Playwright's
Ubuntu fallback WebKit binary lacked `libicu74` and `libjpeg-turbo8`. GitHub's
Ubuntu 24.04 workflow installs these through Playwright `--with-deps`; final
cross-engine evidence must come from that supported runner or another correctly
provisioned Ubuntu environment.

### 5.7 Successful audit result

Astro `7.3.2` removed 13 of the 16 findings and resolved esbuild and Sharp to
patched lines. pnpm retained already-compatible but vulnerable lockfile entries
for js-yaml `4.3.1` and SVGO `4.0.2`.

The following narrow overrides were tested:

```json
"js-yaml@>=4.0.0 <4.3.2": "4.3.2",
"svgo@>=4.0.0 <4.1.0": "4.1.0"
```

After reinstalling, the rehearsal audit reported:

```text
No known vulnerabilities found
```

These selectors intentionally leave unrelated js-yaml or SVGO major versions
untouched.

## 6. Target dependency state

The target manifests and lockfile must resolve at least:

```text
astro       7.3.2 (exact direct site dependency)
zod         4.6.5 (exact foundation dependency used in rehearsal)
sharp       >=0.35.4 through Astro
esbuild     >=0.28.1 through Astro
js-yaml     4.3.2 for affected 4.x dependency paths
svgo        4.1.0 for affected 4.x dependency paths
```

Do not add Sharp, esbuild, js-yaml, or SVGO as direct site dependencies merely
to influence resolution. Use Astro's supported dependency ranges plus the
narrow root overrides for the two lockfile-preserved vulnerable versions.

Do not add a global Zod override. `packages/seo-research` intentionally remains
on Zod 3 unless a separate package-specific migration proves necessary. The
schemas that must share the Astro 7/Zod 4 contract are the site content schemas
and `@astro-foundation/core` schemas composed into them.

## 7. Expected file map

### Required manifest and lockfile changes

```text
site/luksuzni-prevoz/package.json
packages/astro-foundation/package.json
package.json
pnpm-lock.yaml
```

### Required source changes confirmed by rehearsal

```text
site/luksuzni-prevoz/src/content/schemas/pages.ts
site/luksuzni-prevoz/src/content/schemas/shared.ts
site/luksuzni-prevoz/src/components/shared/TrustStrip.types.ts
packages/astro-foundation/src/content/schemas.ts
```

### Stale version-specific text to review

```text
site/luksuzni-prevoz/src/components/site/LeafPage.astro
packages/eslint-plugin-astro-foundation/src/rules/no-legacy-collection.ts
packages/eslint-plugin-astro-foundation/src/rules/__tests__/no-legacy-collection.test.ts
```

Update comments/messages only when they incorrectly describe the current API as
Astro 5-specific. Do not change the rule behavior without a proven Astro 7
contract change and a corresponding test.

### Test/support files likely to change

```text
site/luksuzni-prevoz/tests/smoke/accessibility.spec.ts
site/luksuzni-prevoz/tests/support/contracts.ts   # preferred home for a shared settle helper
```

Do not manually edit:

```text
site/luksuzni-prevoz/.astro/**
site/luksuzni-prevoz/src/theme/generated/theme.css
packages/astro-foundation/src/generated/types.ts
```

## 8. Implementation sequence

### Phase 0 — Establish a reproducible baseline

1. Confirm the branch and worktree are clean.
2. Confirm local Node and pnpm match repository configuration.
3. Install with the frozen lockfile.
4. Record the current dependency paths:

   ```bash
   pnpm --filter @luksuzni-prevoz/site why astro
   pnpm --filter @luksuzni-prevoz/site why sharp
   pnpm --filter @luksuzni-prevoz/site why js-yaml
   pnpm --filter @luksuzni-prevoz/site why svgo
   pnpm --filter @luksuzni-prevoz/site why esbuild
   pnpm --filter @astro-foundation/core why zod
   ```

5. Record the unmasked audit baseline:

   ```bash
   pnpm audit --prod
   ```

6. Run the current baseline gates before editing:

   ```bash
   pnpm generated:check
   pnpm routes:validate
   pnpm content:validate
   pnpm seo:validate
   pnpm check
   pnpm test:unit
   pnpm build
   ```

If baseline source gates fail for reasons not documented here, stop and
separate those failures from the migration.

### Phase 1 — Upgrade the direct framework dependency

Update only the production site:

```bash
pnpm --filter @luksuzni-prevoz/site add astro@7.3.2 --save-exact
```

Expected manifest result:

```json
"astro": "7.3.2"
```

Do not use an unconstrained caret for this major migration. A later controlled
Astro update may deliberately change the exact version.

Inspect the lockfile diff immediately. Confirm that the change is explainable by
Astro 7, Vite 8, the new compiler/runtime chain, Sharp, and their transitive
dependencies. Investigate unrelated churn before proceeding.

### Phase 2 — Align the shared content schema with Zod 4

Update the foundation dependency:

```bash
pnpm --filter @astro-foundation/core add zod@4.6.5 --save-exact
```

Do not upgrade `packages/seo-research` as part of this phase.

In these site files:

```text
site/luksuzni-prevoz/src/content/schemas/pages.ts
site/luksuzni-prevoz/src/content/schemas/shared.ts
```

replace:

```ts
import { z } from "astro:content";
```

with:

```ts
import { z } from "astro/zod";
```

In:

```text
site/luksuzni-prevoz/src/components/shared/TrustStrip.types.ts
```

replace the corresponding type import with:

```ts
import type { z } from "astro/zod";
```

Update the explanatory comment in `shared.ts` so it names `astro/zod` and Zod
4 accurately.

Run immediately:

```bash
pnpm --filter @luksuzni-prevoz/site check
```

Do not patch component props with casts if `CollectionEntry<"pages">["data"]`
becomes `unknown`. That indicates schema inference is still broken. Fix the
schema/Zod boundary instead.

### Phase 3 — Migrate the confirmed Zod validator API

In:

```text
packages/astro-foundation/src/content/schemas.ts
```

migrate `AutocompleteSchema` from the Zod 3 value-dependent `.refine()` message
callback to Zod 4 `.superRefine()`.

Required semantic shape:

```ts
export const AutocompleteSchema = z
  .string()
  .min(1, "autocomplete must not be empty — omit the attribute instead")
  .superRefine((value, context) => {
    const bad = value
      .split(/\s+/)
      .filter(Boolean)
      .find((token) => !(AUTOCOMPLETE_TOKENS as readonly string[]).includes(token));

    if (bad) {
      context.addIssue({
        code: "custom",
        message: `Invalid autocomplete token: "${bad}". Must be a WHATWG autofill token.`,
      });
    }
  });
```

Preserve the exact validation intent and diagnostic quality. Confirm or add
unit coverage for:

- a valid single token;
- a valid whitespace-separated token sequence;
- an invalid token;
- the invalid token appearing in the error message;
- an empty string retaining the existing minimum-length error.

Run:

```bash
pnpm --filter @astro-foundation/core check
pnpm --filter @astro-foundation/core test:unit
```

### Phase 4 — Remove the new schema-composition deprecation

The rehearsal passed with one new Zod 4 hint because
`BaseContentSchema.merge(BaseSeoSchema)` is deprecated.

In:

```text
site/luksuzni-prevoz/src/content/schemas/pages.ts
```

replace the deprecated composition with a Zod 4-supported equivalent, such as
extending `BaseContentSchema` with `BaseSeoSchema.shape` and the page-local
fields. Preserve the current unknown-key policy and inferred output exactly.

Example intent:

```ts
const pageBase = BaseContentSchema.extend({
  ...BaseSeoSchema.shape,
  h1: z.string().min(1).optional(),
  intro: z.string().optional(),
});
```

Validate all 45 content files after this change. Do not accept a new
deprecation hint as permanent migration debt when its bounded replacement is
available.

### Phase 5 — Resolve the remaining audit findings narrowly

After updating Astro, run:

```bash
pnpm audit --prod
```

Astro 7.3.2 is expected to remove all Astro, Sharp, and esbuild findings. If
pnpm retains vulnerable compatible js-yaml and SVGO versions, add these entries
to the existing root `pnpm.overrides` object:

```json
"js-yaml@>=4.0.0 <4.3.2": "4.3.2",
"svgo@>=4.0.0 <4.1.0": "4.1.0"
```

Regenerate the lockfile through pnpm:

```bash
pnpm install
```

Do not edit `pnpm-lock.yaml` manually.

Verify the resolved dependency paths and confirm no vulnerable duplicate path
remains:

```bash
pnpm --filter @luksuzni-prevoz/site why sharp
pnpm --filter @luksuzni-prevoz/site why js-yaml
pnpm --filter @luksuzni-prevoz/site why svgo
pnpm --filter @luksuzni-prevoz/site why esbuild
pnpm audit --prod
```

Expected result:

```text
No known vulnerabilities found
```

Then change the root audit script to enforce policy:

```json
"audit:deps": "pnpm audit --prod --audit-level high"
```

Remove the unconditional `|| ... exit 0` behavior. This threshold blocks high
and critical findings without making a newly published low/moderate advisory an
automatic deployment outage. For this migration, however, the acceptance target
is zero known findings at the time the lockfile is committed.

If a new advisory appears during implementation, do not widen or remove the
overrides reflexively. Record its dependency path, exploit prerequisites,
patched range, and whether a supported upgrade exists. Any temporary exception
must follow `docs/exceptions.md`; no blanket audit bypass is permitted.

### Phase 6 — Update stale version-specific documentation

Search for stale active references:

```bash
rg -n "Astro 5|astro@5|5\.18\.2|astro:content.*z" . \
  -g '!node_modules' \
  -g '!dist' \
  -g '!.astro'
```

Update only descriptions of the current implementation. Historical records and
test fixtures are not automatically stale.

Known candidates:

- `LeafPage.astro` comment describing the `render()` return as Astro 5-specific;
- the ESLint rule guidance describing the Content Layer as “Astro 5”; replace
  it with version-independent “Astro Content Layer” wording if the actual rule
  remains valid;
- site schema comments claiming `z` comes from `astro:content`.

### Phase 7 — Run static and cross-package verification

Run focused checks first:

```bash
pnpm --filter @astro-foundation/core check
pnpm --filter @luksuzni-prevoz/site check
pnpm test:unit
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm types:generate:check
pnpm theme:sync:check
pnpm components:check
pnpm design:sync:check
pnpm traceability --check
pnpm lint
pnpm build
pnpm secret-scan
pnpm audit:deps
```

Then run the repository's cross-package/foundation profile:

```bash
pnpm verify:ui --change foundation --scope-complete
```

The foundation profile does not require `--target` or `--surface`. If the
actual changed-file classifier derives additional page/component/content gates,
run the union it requires. Do not lower the requested profile to evade a gate.

Finally run:

```bash
pnpm quality:release
```

Expected static acceptance:

- no generated-file drift;
- zero TypeScript/Astro errors;
- no new migration-related deprecation hints;
- all unit suites pass;
- 45/45 content files pass;
- all routes and localized SEO entries pass;
- all 49 pages/endpoints build;
- all 364 image variants build;
- secret scan passes;
- dependency audit reports no known vulnerabilities.

### Phase 8 — Make the accessibility scan deterministic

Inspect the existing settled-animation logic in the homepage accessibility
case. Extract a narrowly scoped helper into
`tests/support/contracts.ts` if doing so avoids duplicating the logic.

For the generic content-page Axe scan:

1. navigate to the airport transportation route;
2. wait for fonts;
3. reveal/scroll any entrance-animated region needed for its final state;
4. wait for finite document animations to settle, tolerating cancelled
   animations;
5. reset scroll position if required for deterministic scanning;
6. run Axe with the same WCAG 2.2 tags and target-size rule;
7. preserve `expect(results.violations).toEqual([])` unchanged.

Do not add arbitrary sleeps. Synchronize against DOM state, computed opacity, or
the Web Animations API.

Validate the formerly flaky test repeatedly:

```bash
pnpm --filter @luksuzni-prevoz/site exec playwright test \
  tests/smoke/accessibility.spec.ts \
  --project=chromium \
  --grep "content page has no WCAG" \
  --repeat-each=10
```

All 10 repetitions must pass.

Then run the full Chromium suite:

```bash
pnpm --filter @luksuzni-prevoz/site exec playwright test \
  tests/smoke \
  --project=chromium
```

Expected result: 316/316 pass, subject to the suite count at implementation
time.

On an Ubuntu runner with Playwright dependencies installed, run:

```bash
pnpm --filter @luksuzni-prevoz/site exec playwright install \
  --with-deps chromium firefox webkit
pnpm test:a11y
```

Prefer also running the complete smoke suite across all configured engines for
this major migration:

```bash
pnpm test:e2e
```

Browser acceptance:

- Chromium, Firefox, and WebKit accessibility cases pass;
- no horizontal overflow at all five governed widths;
- minimum targets remain at least 44 by 44 CSS pixels;
- all three locales render and switch correctly;
- booking/contact client behavior remains functional;
- no broken optimized images;
- no console/page errors attributable to Astro 7;
- no accessibility assertion is weakened or skipped.

### Phase 9 — Compare the production artifacts

Build Astro 5 from the baseline commit and Astro 7 from the migration branch in
separate directories or CI artifacts. Compare semantics, not hashed filenames.

Verify:

- identical intended route inventory;
- `robots.txt` behavior;
- sitemap index and page sitemap destinations;
- canonical URLs and hreflang sets;
- trailing slashes;
- document `lang` and `dir`;
- page titles and meta descriptions;
- JSON-LD validity and visible/schema FAQ parity;
- HTTP-independent static fallback behavior for the 404 pages;
- image intrinsic dimensions, `srcset`, `sizes`, loading priority, and formats;
- client bundle presence for booking/contact behavior;
- absence of secrets or server-only environment values in `dist/`.

Hashed asset names and compression sizes may legitimately change. Do not demand
byte-identical output across Astro majors. Investigate missing routes, changed
metadata, changed visible content, broken media, or materially larger client
bundles.

Perform a bounded manual spot review of at least:

```text
home
airport transportation
booking
contact
pricing
fleet
404
```

Cover Serbian, English, and Russian plus the required viewport states. This is
a migration regression review, not authorization to redesign.

### Phase 10 — Commit and PR discipline

Keep the migration in one reviewable PR. A sensible commit split is:

1. `chore(deps): upgrade Astro and align Zod 4`;
2. `fix(content): migrate schemas to Astro 7 Zod contracts`;
3. `test(a11y): wait for settled content-page motion`;
4. `chore(security): enforce patched transitive dependencies and audit`.

Do not commit:

- `node_modules`;
- `dist`;
- `.astro` local output;
- Playwright HTML reports, traces, screenshots, or test-results unless a
  repository evidence contract explicitly requires a particular artifact;
- temporary audit output;
- the disposable rehearsal directory.

The PR description must include:

- baseline and target versions;
- the Zod/content-schema compatibility decision;
- exact changed files;
- audit before/after counts;
- all commands actually run;
- automated browser engines and viewports actually covered;
- manual checks performed;
- any output differences;
- any unresolved item or environment limitation.

## 9. Risk register

| Risk                                                          | Likelihood                           | Impact | Mitigation / required evidence                                                                             |
| ------------------------------------------------------------- | ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------- |
| Mixed Zod 3/4 schemas break Astro content generation          | Confirmed without migration          | High   | Upgrade foundation schema owner, use `astro/zod` in site schemas, reject `unknown` casts                   |
| Zod 4 inference changes alter `CollectionEntry<"pages">`      | Medium                               | High   | Astro check must infer concrete page unions; validate all 45 entries and every page renderer               |
| Zod 4 validator behavior changes                              | Confirmed for autocomplete validator | Medium | Preserve error behavior with `superRefine`; focused unit tests                                             |
| Zod `.merge()` deprecation remains as debt                    | Confirmed hint                       | Low    | Replace with supported shape composition and verify inferred type/unknown-key semantics                    |
| Vite 8 changes CSS order or client bundling                   | Low–medium                           | High   | Full build, smoke tests, computed-style checks, artifact comparison, manual spot review                    |
| New Astro compiler changes emitted HTML details               | Low–medium                           | Medium | SEO/structured-data/browser tests and semantic artifact comparison                                         |
| Sharp changes image bytes, dimensions, or memory usage        | Medium                               | Medium | Cold and cached builds, image assertions, broken-media checks, Cloudflare resource review                  |
| Cold build exceeds deployment constraints                     | Low based on rehearsal               | High   | Rehearsal was ~5m08s; verify actual Cloudflare/GitHub limits and caching before production                 |
| Accessibility scan samples transitional colors                | Confirmed intermittent test issue    | Medium | Settle finite animations deterministically; repeat failing test 10 times; never disable Axe rules          |
| Firefox/WebKit regression is missed locally                   | Medium                               | Medium | Require GitHub/Ubuntu three-engine accessibility evidence before merge                                     |
| Narrow overrides mask later upstream fixes                    | Low                                  | Low    | Document why they exist; review/remove after Astro raises its minimum transitive versions                  |
| Broad override accidentally upgrades unrelated major versions | Avoidable                            | High   | Use the two bounded vulnerable-version selectors exactly; do not globally override all versions            |
| Audit goes green despite findings                             | Confirmed current policy issue       | High   | Replace blanket success fallback with `--audit-level high`; target zero findings for this PR               |
| Shared foundation Zod change affects another consumer         | Medium                               | High   | Run full workspace checks/unit tests and foundation verification profile                                   |
| SEO research Zod 3 is upgraded unnecessarily                  | Avoidable                            | Medium | Leave isolated package on Zod 3; its rehearsal tests passed with foundation on Zod 4                       |
| Migration accidentally changes UI/content                     | Avoidable                            | High   | Keep file scope bounded; no tokens, CSS, page content, routes, or business data without separate authority |

## 10. Rollback strategy

Before merge, rollback is the normal PR revert: restore the Astro 5 manifest,
foundation Zod 3 manifest, schema imports/API, audit script, overrides, and the
previous lockfile together. Do not partially restore only Astro or only Zod;
those combinations are known to be incompatible.

After merge but before production deployment, revert the complete migration PR
if any required build, browser, content, SEO, or audit gate fails.

After production deployment, the site is a static artifact. Preserve the last
known-good Astro 5 build artifact or commit so deployment can be rolled back
without reinstalling a mixed dependency graph. Reverting deployment does not
remove the need to complete the security upgrade; it only restores service
while the migration defect is fixed.

Do not weaken the audit, content schema, accessibility checks, or static output
contract as a rollback shortcut.

## 11. Completion checklist

- [x] Work performed on a clean dedicated branch.
- [x] Astro is exactly `7.3.2`.
- [x] Foundation schemas use the tested Zod 4 line.
- [x] Site content schemas/types import Zod from `astro/zod`.
- [x] No content entry data is inferred as `unknown`.
- [x] `AutocompleteSchema` preserves its validation behavior under Zod 4.
- [x] No new Zod/Astro migration deprecation hint remains.
- [x] SEO research remains isolated on Zod 3 unless separately justified.
- [x] Narrow js-yaml and SVGO overrides are present only if still required.
- [x] `pnpm audit --prod` reports no known vulnerabilities.
- [x] `audit:deps` blocks high and critical findings.
- [x] Generated files are current and were not hand-edited.
- [x] Theme and component registries remain unchanged/current.
- [x] All 45 content files pass.
- [x] Route and SEO validation pass.
- [x] All workspace checks and unit tests pass.
- [x] All 49 pages/endpoints build.
- [x] All expected optimized images build and load.
- [x] Formerly flaky accessibility test passes 10 repeated Chromium runs.
- [x] Full Chromium smoke suite passes.
- [ ] Chromium, Firefox, and WebKit accessibility suites pass on Ubuntu. Chromium
      and Firefox pass locally; WebKit awaits the supported Ubuntu runner.
- [x] Responsive tests pass at 320, 768, 1024, 1440, and 1920.
- [x] Production artifact comparison shows no unintended route/content/SEO change.
- [ ] Cold-build time/resource use is acceptable for the deployment environment.
      Local cold-build evidence is recorded; deployment limits await environment
      verification.
- [x] `pnpm verify:ui --change foundation --scope-complete` passes.
- [x] `pnpm quality:release` passes with the enforceable audit.
- [ ] PR reports exact automated and manual evidence plus unresolved items. The
      pushed branch includes a ready-to-use verification report; no PR was opened
      as part of this implementation request.

## 12. Estimated effort

Based on the completed rehearsal:

| Work item                                             |   Estimate |
| ----------------------------------------------------- | ---------: |
| Dependency and lockfile update                        | 0.5–1 hour |
| Zod 4 and content-schema migration                    |  1–2 hours |
| Foundation validator migration and tests              | 0.5–1 hour |
| Audit overrides/enforcement and verification          | 0.5–1 hour |
| Static/full workspace verification                    |  1–2 hours |
| Browser synchronization fix and Chromium verification |  1–2 hours |
| Three-engine CI and manual artifact review            |  1–2 hours |

Likely implementation and verification: **5–8 engineering hours**.  
Conservative contingency: **one to two working days** if Vite 8 output,
cross-browser behavior, or deployment build resources reveal additional issues.

## 13. Handoff summary for the implementing agent

This is not an exploratory major-version migration anymore: a disposable
rehearsal proved the core approach.

The confirmed minimum source migration is:

1. Astro `5.18.2` to `7.3.2`;
2. foundation Zod 3 to the tested Zod 4 line;
3. three imports moved to `astro/zod`;
4. one `.refine()` validator migrated to `.superRefine()`;
5. one deprecated schema merge modernized;
6. two narrow transitive overrides if the lockfile retains vulnerable js-yaml
   and SVGO versions;
7. one animation-aware accessibility synchronization correction.

The rehearsal reached zero static/type errors, built all routes and images,
passed all unit/content/route/SEO checks, produced a zero-vulnerability audit,
and passed 315 of 316 Chromium smoke tests. The remaining browser failure was
intermittent and isolated to scanning a transitioning CTA; it must be fixed
deterministically and then verified across the supported engines.

Preserve scope. Do not turn this into a UI redesign, content cleanup, routing
change, deployment change, or general dependency modernization.
