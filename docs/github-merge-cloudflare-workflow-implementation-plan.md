# GitHub Merge Gates and Cloudflare Pages Deployment — Implementation Plan

Date: 2026-09-15  
Status: Proposed; repository workflow and external platform changes have not
been implemented by this plan.  
Baseline commit inspected:
`0cb265a` (`Merge pull request #22 from lukapekic/chore/astro-7-migration`).

## 1. Purpose

Make pull-request validation the authoritative admission gate for `master`,
remove duplicate GitHub Actions work after a merge, and configure Cloudflare
Pages so only reviewed, green commits from `master` reach Production.

The implementation must provide four distinct levels of evidence:

1. **Pre-merge static release gate** — generated contracts, governance,
   localization/content, SEO, lint, types, unit tests, build, secrets, and the
   production dependency audit.
2. **Pre-merge browser accessibility gate** — the focused WCAG 2.2/Axe suite in
   Chromium.
3. **Post-merge release evidence** — one workflow on the actual `master` commit,
   including the static release gate and Chromium/Firefox/WebKit accessibility.
4. **Scheduled/manual deep evidence** — the complete Playwright smoke suite and
   Lighthouse, kept outside the critical merge path.

The selected deployment model is the repository's already-approved model:

```text
Cloudflare Pages Git integration
production branch: master
deployment source: commits admitted to master by GitHub rules
```

This plan does **not** replace Git integration with Wrangler or store Cloudflare
deployment credentials in GitHub. Required pre-merge checks are therefore the
actual deployment gate. The post-merge Release workflow is confirmation and
rollback evidence; it cannot delay a Pages Git build that starts from the same
`master` push.

## 2. Fixed implementation decisions

The implementing agent should use these decisions without reopening them:

| Decision                           | Selected behavior                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Production branch                  | `master`                                                                                     |
| Cloudflare deployment method       | Pages Git integration                                                                        |
| Required static check name         | Preserve `quality-fast`                                                                      |
| Required browser check name        | Add `a11y-chromium`                                                                          |
| PR static command                  | `pnpm quality:release`                                                                       |
| PR browser coverage                | Accessibility suite in Chromium                                                              |
| Post-merge browser coverage        | Accessibility suite in Chromium, Firefox, and WebKit                                         |
| Complete smoke suite               | Weekly and manual, not required for every merge                                              |
| Lighthouse                         | Weekly and manual, not required for every merge                                              |
| Preview deployment strategy        | Stable `staging` branch only by default                                                      |
| Production auto-deploy             | Enabled for `master` after GitHub rules are active                                           |
| GitHub-hosted deploy job           | Not part of this PR                                                                          |
| Wrangler dependency/config         | Not part of this PR                                                                          |
| Required approvals                 | Do not introduce an approval count solely through this task; require a PR and passing checks |
| Merge queue                        | Do not enable it as part of this task; make the workflow compatible through `merge_group`    |
| Path filters on required workflows | None                                                                                         |

The existing `quality-fast` check name is intentionally retained even though
its command becomes the complete release gate. Renaming a required check and
changing repository rules simultaneously can create a period where no PR is
mergeable. A future cleanup may rename it only through a staged ruleset
migration.

## 3. Authority and procedure

Apply these sources in order:

1. root `AGENTS.md`;
2. validated package/workflow configuration;
3. `docs/deployment.md`;
4. `docs/cloudflare-pages-forms/README.md`;
5. `.skills/astro-architecture.md`;
6. official GitHub Actions/ruleset documentation;
7. official Cloudflare Pages documentation;
8. the current implementation.

Repository invariants:

- use pnpm only;
- keep Astro static-first;
- do not edit generated files;
- do not weaken content, translations, SEO, accessibility, security, theme,
  governance, lint, type, unit, or build rules;
- do not add client code, page changes, content changes, route changes, theme
  changes, or design changes;
- do not commit Cloudflare account IDs, D1 database IDs, API tokens, Turnstile
  secrets, Brevo secrets, `.env`, or `.dev.vars`;
- never claim a GitHub/Cloudflare gate passed unless the real platform run
  completed successfully.

Official references reviewed for this plan:

- [GitHub workflow events and `merge_group`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub ruleset rules and required status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Creating a GitHub repository ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Cloudflare Pages branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)

## 4. Current-state findings

### 4.1 Repository and runtime

At the inspected baseline:

```text
branch: master
HEAD: 0cb265a
Astro: 7.3.2
Node contract: >=22.19.0; .nvmrc currently selects 22.22.2
pnpm: 10.14.0
site: site/luksuzni-prevoz
site package: @luksuzni-prevoz/site
static output: site/luksuzni-prevoz/dist
```

The Astro 7 migration is merged. The dependency audit is now enforceable:

```json
"audit:deps": "pnpm audit --prod --audit-level high"
```

### 4.2 Current Quality workflow

`.github/workflows/quality.yml` currently runs for both:

```text
pull_request
push to master
```

Its single `quality-fast` job:

1. installs dependencies;
2. installs Chromium, Firefox, and WebKit plus OS dependencies;
3. runs `pnpm quality:page`;
4. runs the accessibility suite in all three configured browsers.

Problems:

- it performs release-like work despite being named `quality-fast`;
- it downloads all browsers before static checks can fail;
- it does not run `secret-scan` or `audit:deps` before merge;
- its `push: master` execution duplicates the Release workflow;
- it has no `merge_group` trigger, so it is not safe to require if merge queue
  is later enabled;
- one monolithic job makes static and browser failures less obvious.

### 4.3 Current Release workflow

`.github/workflows/release.yml` runs on `push: master`. It:

1. installs dependencies;
2. installs all three browsers before static validation;
3. runs `pnpm quality:release`;
4. runs all-browser accessibility.

On every merge, both Quality Gates and Release currently repeat dependency
installation, browser provisioning, static checks, build, and accessibility.

### 4.4 Existing command boundaries

The commands already have useful layers:

```text
quality:fast
  generated drift, governance, skills, foundation/theme/design validation,
  routes, content, SEO, lint, checks, unit tests, waivers

quality:page
  quality:fast + production build

quality:release
  quality:page + production secret scan + high/critical dependency audit

test:a11y
  accessibility.spec.ts in every configured Playwright project

test:e2e
  complete tests/smoke suite in every configured Playwright project

test:lighthouse
  six configured URLs, three runs each, enforced category and Web Vital budgets
```

The PR gate should call the existing `quality:release` composition rather than
copying its individual commands into YAML. This preserves local/CI parity and
prevents the workflow from drifting when the repository command evolves.

### 4.5 Browser scope

The Playwright configuration contains:

```text
chromium
firefox
webkit
```

The focused accessibility file provides 16 tests per browser at the inspected
baseline. The complete smoke suite is much larger: the Astro 7 rehearsal
observed 316 Chromium cases, or roughly 948 cases across all three engines
before retries. Full three-engine smoke testing is valuable deep evidence but
is too expensive for every routine merge.

### 4.6 Cloudflare state recorded in the repository

The repository has approved Cloudflare Pages but still records external
provisioning as incomplete:

```text
hosting: Cloudflare Pages approved
deploy trigger: Pages Git integration from master, not yet connected
preview strategy: stable staging branch planned
Pages project name/hostname: TBD
Preview and Production D1 resources: unprovisioned
Turnstile/Brevo/WAF account configuration: pending
```

Implemented runtime assets already exist:

```text
functions/api/forms/contact.ts
functions/api/forms/booking.ts
functions/_shared/**
migrations/0001_form_submission_ledger.sql
```

The Pages project must use the repository root. Selecting
`site/luksuzni-prevoz` as the project root would hide both workspace packages
and the root `functions/` directory.

### 4.7 External state that must be inspected, never guessed

Repository files cannot prove:

- whether a `master` branch protection rule or ruleset is active;
- which checks it currently requires;
- whether administrators can bypass it;
- whether the Cloudflare GitHub App is installed;
- the Cloudflare account, Pages project name, or generated hostname;
- whether Preview/Production variables, bindings, and secrets exist;
- whether D1, Turnstile, Brevo, DNS, TLS, or WAF are provisioned.

The implementing agent must inspect those dashboards or authenticated APIs and
record actual values in the existing deployment/runbook launch tables. It must
not ask for invented placeholder values or commit secrets.

## 5. Target event topology

```text
feature branch / PR
        |
        +--> GitHub: quality-fast
        |      pnpm quality:release
        |
        +--> GitHub: a11y-chromium
               runs only after quality-fast passes
               focused Axe/WCAG suite in Chromium
        |
        v
GitHub ruleset admits merge only when both required checks are green
        |
        v
master receives the merge commit
        |
        +--> GitHub: Release
        |      quality:release once
        |      accessibility in Chromium + Firefox + WebKit
        |
        +--> Cloudflare Pages Git integration
               builds/deploys the same master SHA
               previous production remains rollback target

weekly/manual
        |
        +--> complete three-engine Playwright smoke suite
        +--> Lighthouse CI configured URL/budget suite
```

The GitHub Release and Cloudflare Pages branches start from the same push but
are independent. Compare `GITHUB_SHA` with Cloudflare's
`CF_PAGES_COMMIT_SHA` during release review.

## 6. Scope

### In scope

- update `.github/workflows/quality.yml`;
- update `.github/workflows/release.yml`;
- add `.github/workflows/deep-checks.yml`;
- add an explicit root Chromium accessibility script;
- update `docs/deployment.md` with the final CI/deployment sequencing contract;
- update the Cloudflare launch record after real resources are provisioned;
- configure the GitHub `master` ruleset;
- configure Cloudflare Pages Git integration and branch controls;
- perform Preview then Production acceptance using the existing forms runbook;
- document exact external settings and observed checks without committing
  secrets.

### Out of scope

- migrating Pages deployment to `wrangler pages deploy`;
- adding `cloudflare/wrangler-action` or Cloudflare API tokens to GitHub;
- changing Astro rendering mode or adding an adapter;
- changing Pages Functions implementation;
- changing forms, content, translations, SEO data, routes, components, CSS,
  theme tokens, or visual behavior;
- weakening `quality:release`, Axe, Playwright, Lighthouse, or the audit;
- adding a blanket CI-success fallback;
- adding path filters to either required PR check;
- using `pull_request_target` for code execution;
- adding arbitrary sleeps or retries that hide deterministic failures;
- enabling merge queue without a separate operational decision;
- provisioning an email provider other than the already-implemented Brevo
  adapter.

## 7. Expected repository changes

```text
.github/workflows/quality.yml
.github/workflows/release.yml
.github/workflows/deep-checks.yml        # new
package.json
docs/deployment.md
docs/cloudflare-pages-forms/README.md    # launch record/settings only when known
```

No generated file should change. If implementation produces changes under
`.design/`, `.astro/`, `dist/`, generated theme CSS, or generated types, stop
and determine whether a command wrote files unintentionally.

## 8. Phase 0 — Baseline and external-state inventory

Start from the latest `master` in a dedicated branch:

```bash
git status --short --branch
git fetch origin
git switch master
git pull --ff-only
git switch -c chore/merge-gates-cloudflare-workflows
node --version
pnpm --version
pnpm install --frozen-lockfile
```

Expected versions:

```text
Node 22.22.2
pnpm 10.14.0
```

Record baseline GitHub Actions behavior from the last merged PR and last
`master` push:

- workflow names;
- check/job names;
- run URLs;
- conclusions;
- durations;
- whether `quality-fast` is already required;
- whether Cloudflare already publishes a check run.

If authenticated GitHub CLI access is available, inspect rules without changing
them:

```bash
gh api repos/lukapekic/luksuzniprevoz-website-astro/rulesets
gh api repos/lukapekic/luksuzniprevoz-website-astro/branches/master/protection
```

An HTTP `404` may mean no legacy branch protection or insufficient permission;
verify in **GitHub repository > Settings > Rules > Rulesets** before drawing a
conclusion.

Record the Cloudflare state from **Workers & Pages** and the GitHub App
installation. Complete known fields in the runbook launch record. Leave truly
unknown fields as `TBD`; do not fabricate them.

Run the baseline repository gates:

```bash
pnpm quality:release
pnpm --filter @luksuzni-prevoz/site exec playwright test \
  tests/smoke/accessibility.spec.ts \
  --project=chromium
```

If Chromium is not installed locally, provision only Chromium for this check.
Host-specific inability to run Firefox/WebKit does not permit claiming those
engines passed; final evidence comes from Ubuntu GitHub Actions.

## 9. Phase 1 — Add the focused Chromium command

Add this root script next to `test:a11y`:

```json
"test:a11y:chromium": "pnpm --filter @luksuzni-prevoz/site exec playwright test tests/smoke/accessibility.spec.ts --project=chromium"
```

Do not change `test:a11y`; it remains the all-configured-engine command used by
Release.

Do not add a second Playwright configuration or duplicate the accessibility
spec. The browser selector belongs in the command only.

Focused verification:

```bash
pnpm test:a11y:chromium
```

Expected baseline suite count is 16. Treat the count as informative rather than
hard-coding it into CI because legitimate future accessibility coverage may
increase it.

## 10. Phase 2 — Replace the PR Quality workflow

Replace `.github/workflows/quality.yml` with this target structure:

```yaml
name: Quality Gates

on:
  pull_request:
  merge_group:
    types: [checks_requested]

concurrency:
  group: quality-${{ github.event.pull_request.number || github.event.merge_group.head_sha || github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  ASTRO_TELEMETRY_DISABLED: "1"

jobs:
  quality-fast:
    # This check name is retained because repository rules may already require it.
    name: quality-fast
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v5
        # No version: action-setup reads packageManager from package.json.
      - uses: actions/setup-node@v5
        with:
          node-version-file: ".nvmrc"
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm quality:release

  a11y-chromium:
    name: a11y-chromium
    needs: quality-fast
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v5
      - uses: actions/setup-node@v5
        with:
          node-version-file: ".nvmrc"
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Install Chromium and operating-system dependencies
        run: pnpm --filter @luksuzni-prevoz/site exec playwright install --with-deps chromium
      - run: pnpm test:a11y:chromium
      - name: Upload Playwright failure evidence
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: pr-a11y-chromium-${{ github.run_id }}
          path: |
            site/luksuzni-prevoz/playwright-report/
            site/luksuzni-prevoz/test-results/
          if-no-files-found: ignore
          retention-days: 7
```

Implementation notes:

- `quality-fast` remains the exact required-check identity.
- `quality:release` moves secret and dependency checks before merge.
- the browser job waits for static success, preventing browser provisioning on
  an already-invalid PR;
- only Chromium is installed for the PR browser job;
- no PR secret is required, so fork behavior stays safe;
- the Playwright web server already builds with Cloudflare's public always-pass
  Turnstile test site key for automated tests;
- cancelled older PR runs should not consume browser resources;
- failure evidence is retained briefly and is not committed;
- do not add `continue-on-error` anywhere;
- do not filter by changed paths because required checks skipped by workflow
  filters can leave merge requirements unresolved;
- do not re-add `push: master` to this file.

The `merge_group` event is inert while merge queue is disabled. It prevents a
future queue from deadlocking because GitHub requires required checks to run on
the merge-group SHA, not only on `pull_request` events.

## 11. Phase 3 — Make Release the only `master` workflow

Replace `.github/workflows/release.yml` with this target structure:

```yaml
name: Release

on:
  push:
    branches:
      - master
  workflow_dispatch:

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: read

env:
  ASTRO_TELEMETRY_DISABLED: "1"

jobs:
  release:
    name: release
    runs-on: ubuntu-24.04
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v5
        # No version: action-setup reads packageManager from package.json.
      - uses: actions/setup-node@v5
        with:
          node-version-file: ".nvmrc"
          cache: pnpm
      - run: pnpm install --frozen-lockfile

      - name: Run the static release gate
        run: pnpm quality:release

      - name: Install all supported browser engines and operating-system dependencies
        run: pnpm --filter @luksuzni-prevoz/site exec playwright install --with-deps chromium firefox webkit

      - name: Run cross-engine accessibility evidence
        run: pnpm test:a11y

      - name: Upload Playwright failure evidence
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: release-a11y-${{ github.sha }}
          path: |
            site/luksuzni-prevoz/playwright-report/
            site/luksuzni-prevoz/test-results/
          if-no-files-found: ignore
          retention-days: 14
```

Important behavior:

- Release is now the only GitHub Actions workflow triggered by `push: master`;
- the static gate runs before downloading browsers;
- all three browser engines remain release evidence;
- `cancel-in-progress: false` preserves evidence for every admitted `master`
  commit;
- `workflow_dispatch` allows an operator to rerun Release without another
  commit;
- the job has no deploy permissions or Cloudflare credentials;
- Release must not use `needs` on a PR workflow because workflows cannot create
  a reliable cross-event dependency for this Git integration model.

Do not add a `workflow_run` indirection. It complicates SHA identity and does
not gate Cloudflare's independent Git webhook.

## 12. Phase 4 — Add scheduled/manual deep checks

Create `.github/workflows/deep-checks.yml`:

```yaml
name: Deep Checks

on:
  workflow_dispatch:
  schedule:
    - cron: "17 3 * * 1"

concurrency:
  group: deep-checks-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  ASTRO_TELEMETRY_DISABLED: "1"

jobs:
  full-smoke:
    name: full-smoke
    runs-on: ubuntu-24.04
    timeout-minutes: 90
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v5
      - uses: actions/setup-node@v5
        with:
          node-version-file: ".nvmrc"
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Install all supported browser engines and operating-system dependencies
        run: pnpm --filter @luksuzni-prevoz/site exec playwright install --with-deps chromium firefox webkit
      - run: pnpm test:e2e
      - name: Upload Playwright failure evidence
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: deep-smoke-${{ github.run_id }}
          path: |
            site/luksuzni-prevoz/playwright-report/
            site/luksuzni-prevoz/test-results/
          if-no-files-found: ignore
          retention-days: 14

  lighthouse:
    name: lighthouse
    runs-on: ubuntu-24.04
    timeout-minutes: 45
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v5
      - uses: actions/setup-node@v5
        with:
          node-version-file: ".nvmrc"
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Verify Chrome is available
        run: google-chrome --version
      - run: pnpm test:lighthouse
      - name: Upload Lighthouse evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-${{ github.run_id }}
          path: lhci-reports/
          if-no-files-found: error
          retention-days: 14
```

The schedule is Monday at 03:17 UTC. The non-round minute reduces collision
with common scheduled-workflow load. Scheduled workflows run from the default
branch.

Before finalizing this workflow:

1. trigger it manually;
2. confirm Ubuntu's `google-chrome` binary is present;
3. confirm the complete smoke suite finishes inside 90 minutes;
4. confirm all six Lighthouse URLs complete three runs;
5. confirm reports upload without leaking page/form data;
6. adjust timeouts upward only if measured successful runtime requires it.

If the full three-engine smoke suite exceeds the runner time despite healthy
tests, split by Playwright project into a matrix in a follow-up commit within
this PR. Do not reduce browser coverage or test files to make the schedule fit.

Deep Checks is deliberately not a required `master` status. A scheduled failure
must create an issue/repair task and be investigated, but it does not retroactively
change the result of an already-admitted merge.

## 13. Phase 5 — Update deployment documentation

Update `docs/deployment.md` so it states:

- PRs run `quality:release`, not only `quality:page`;
- `quality-fast` and `a11y-chromium` are the required checks;
- Release is the only post-merge GitHub workflow;
- post-merge Release and Pages Git deployment start independently from the
  same `master` push;
- pre-merge rules are the production admission gate;
- Chromium accessibility is required pre-merge;
- all-engine accessibility is required as release evidence;
- full smoke and Lighthouse run weekly/manually;
- Production remains Pages Git integration from `master`;
- Preview automatic deployments are restricted to `staging` by default;
- the exact project name, Pages hostname, D1 resources, form secrets/bindings,
  and operational owner remain recorded only once verified.

Update the `docs/cloudflare-pages-forms/README.md` launch record only with facts
observed during provisioning. Never replace `TBD` with an assumption.

Do not duplicate the entire forms runbook into `docs/deployment.md`. Link it as
the detailed operational procedure.

## 14. Phase 6 — Validate repository changes locally

Run formatting and diff checks first:

```bash
pnpm exec prettier --check \
  .github/workflows/quality.yml \
  .github/workflows/release.yml \
  .github/workflows/deep-checks.yml \
  package.json \
  docs/deployment.md \
  docs/cloudflare-pages-forms/README.md
git diff --check
```

Run the exact pre-merge static command:

```bash
pnpm quality:release
```

Run the exact PR browser command:

```bash
pnpm test:a11y:chromium
```

If this environment supports all three Playwright engines, also run:

```bash
pnpm test:a11y
```

Do not claim unsupported engines passed locally. Ubuntu GitHub Actions is the
required cross-engine execution environment.

Review workflow semantics manually:

- only Quality Gates has `pull_request` and `merge_group`;
- only Release has `push: master`;
- Deep Checks has only `schedule` and `workflow_dispatch`;
- action permissions remain read-only;
- no secret context appears in PR steps;
- no `continue-on-error` exists;
- no check is conditionally skipped by file paths;
- browser installation happens after the static gate in Release;
- PR accessibility installs only Chromium;
- artifacts upload only evidence directories;
- generated/build/test report directories remain uncommitted.

## 15. Phase 7 — Prove the workflows on the implementation PR

Push the branch and open the PR. Do not configure the new required check before
GitHub has observed at least one check run with that exact name.

Expected PR checks:

```text
quality-fast
a11y-chromium
```

Required observations:

- `quality-fast` runs `pnpm quality:release` and reports a clean audit;
- `a11y-chromium` starts only after `quality-fast` succeeds;
- only Chromium is downloaded for the PR browser job;
- 16 accessibility tests pass at the current baseline suite size;
- neither Release nor Deep Checks starts for the PR event;
- artifact upload is skipped on success;
- cancelling an outdated PR run cancels its queued browser job.

While the checks are pending, confirm GitHub presents the PR as blocked. Use an
existing failed run, if one naturally occurs, to confirm failure blocking. Do
not create and push a deliberately broken commit merely to test the ruleset.

After the successful check contexts exist, configure the GitHub ruleset before
merging this PR.

## 16. Phase 8 — Configure the GitHub `master` ruleset

In **Repository > Settings > Rules > Rulesets**, create or update one active
branch ruleset targeting the default branch (`master`).

Required settings:

| Rule                                  | Setting                                                                |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Enforcement                           | Active                                                                 |
| Target                                | Default branch / `master`                                              |
| Require a pull request before merging | Enabled                                                                |
| Required approvals                    | Preserve current repository policy; do not add an unavailable reviewer |
| Dismiss stale approvals               | Preserve current policy                                                |
| Require conversation resolution       | Enabled                                                                |
| Require status checks                 | Enabled                                                                |
| Required check                        | `quality-fast`, source GitHub Actions                                  |
| Required check                        | `a11y-chromium`, source GitHub Actions                                 |
| Require branch up to date             | Enabled                                                                |
| Block force pushes                    | Enabled                                                                |
| Allow deletions                       | Disabled                                                               |
| Bypass list                           | Empty unless an already-approved emergency actor is documented         |

Do not require these checks:

- `release` — it exists only after merge;
- `full-smoke` or `lighthouse` — they are scheduled/manual;
- a Cloudflare Production check — it exists only after a `master` push;
- stale job names from the previous workflow.

If the repository uses legacy branch protection instead of rulesets, implement
the same behavior there. Prefer one ruleset authority rather than overlapping
legacy rules and rulesets with unclear interactions.

Verify protection:

1. a failing required check blocks merge;
2. a pending required check blocks merge;
3. both green checks permit merge;
4. a direct push to `master` by a normal contributor is rejected;
5. a force push is rejected;
6. new commits invalidate the previous check result and rerun the workflow;
7. a branch behind `master` must update and rerun checks.

Merge queue remains disabled for this rollout. If enabled later, the already
present `merge_group: checks_requested` trigger must be proven with a queued PR
before making the queue mandatory.

## 17. Phase 9 — Configure Cloudflare Pages Git integration

Perform GitHub protection before enabling Production automatic deployments.

### 17.1 Connect the repository

In **Cloudflare > Workers & Pages**:

1. create/select a Pages application;
2. connect the Cloudflare GitHub App to
   `lukapekic/luksuzniprevoz-website-astro`;
3. grant the App access only to the required repository where account policy
   permits;
4. select `master` as the Production branch;
5. use **None/custom** as the framework preset;
6. leave the advanced root path empty so the repository root is used.

Build configuration:

| Setting                | Exact value                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| Production branch      | `master`                                                                 |
| Repository root        | repository root / empty advanced path                                    |
| Build command          | `pnpm types:generate:check && pnpm --filter @luksuzni-prevoz/site build` |
| Build output directory | `site/luksuzni-prevoz/dist`                                              |
| Functions directory    | root `functions/`, automatically discovered                              |
| Node                   | `22.22.2`                                                                |
| pnpm                   | `10.14.0`                                                                |

Cloudflare treats a non-zero build command exit as failure. Do not append
`|| true`, do not run a generator that repairs drift, and do not point output at
the repository or site root.

### 17.2 Configure branch controls

Under **Pages project > Settings > Builds > Branch control**:

- Production branch: `master`;
- Enable automatic Production branch deployments: **on**, but only after
  GitHub rules are active;
- Preview branch mode: **Custom branches**;
- Preview include: `staging`;
- do not enable all-branch previews by default;
- explicitly exclude automated branches such as `dependabot/*` if the dashboard
  rule model would otherwise include them.

This preserves a stable acceptance hostname:

```text
staging.<cloudflare-project-name>.pages.dev
```

It also limits Pages build consumption and avoids Turnstile failures on
unregistered hash/branch hostnames.

### 17.3 Configure build variables

Set separately for Preview and Production:

| Variable                    | Preview                           | Production                           |
| --------------------------- | --------------------------------- | ------------------------------------ |
| `NODE_VERSION`              | `22.22.2`                         | `22.22.2`                            |
| `PNPM_VERSION`              | `10.14.0`                         | `10.14.0`                            |
| `PUBLIC_TURNSTILE_SITE_KEY` | Preview Managed widget public key | Production Managed widget public key |

The Turnstile site key is public by design. Its matching secret is a runtime
encrypted secret, never a build variable.

### 17.4 Confirm check-run visibility

After a staging and Production build, confirm Cloudflare publishes deployment
status/check information back to GitHub and that each run identifies the same
commit SHA as the Pages deployment.

Do not make a Production-only Cloudflare check required on PRs. It cannot exist
until after merge. If PR previews are deliberately enabled in the future, a
separate Preview check may be considered only after its stable check name and
fork behavior are proven.

## 18. Phase 10 — Provision the Cloudflare forms environment

Follow `docs/cloudflare-pages-forms/README.md` exactly. The CI workflow PR does
not modify the form runtime, but Production is not operational until these
bindings are complete.

### 18.1 Preview resources first

1. Create the stable `staging` branch and deploy it through Pages Preview.
2. Create a Managed Turnstile Preview widget.
3. Allow the Pages project hostname in Turnstile.
4. Add the exact stable staging hostname to the application allowlist.
5. Create `luksuzni-prevoz-forms-preview` in D1.
6. Apply `migrations/0001_form_submission_ledger.sql` through the D1 SQL
   Console.
7. Verify the `form_submissions` table and
   `form_submissions_status_updated_idx`.
8. Bind the database as exactly `FORM_DB` in Preview.
9. Configure Preview runtime variables and encrypted secrets.
10. Use a Preview-only Brevo recipient, never the Production office address.
11. Redeploy staging after variables/bindings change.

Preview runtime contract:

| Name                      | Type                 | Required value                                         |
| ------------------------- | -------------------- | ------------------------------------------------------ |
| `FORM_ENVIRONMENT`        | plain variable       | `preview`                                              |
| `TURNSTILE_ALLOWED_HOSTS` | plain variable       | exact stable staging hostname, no scheme/path/wildcard |
| `TURNSTILE_SECRET_KEY`    | encrypted secret     | Preview widget secret                                  |
| `BREVO_API_KEY`           | encrypted secret     | site-specific Brevo key                                |
| `BREVO_SENDER_EMAIL`      | plain or encrypted   | verified sender                                        |
| `BREVO_SENDER_NAME`       | plain variable       | approved brand name                                    |
| `BREVO_TO_EMAIL`          | preferably encrypted | Preview/test recipient                                 |
| `FORM_DB`                 | D1 binding           | Preview database                                       |

Complete every Preview acceptance item in the runbook, including successful
Contact/Booking delivery, idempotent retry behavior, safe failures, no PII in
D1/logs, localized routes, noindex, and direct-contact recovery.

### 18.2 Production resources after Preview acceptance

1. Create `luksuzni-prevoz-forms-production` separately.
2. Apply and verify the same migration.
3. Bind it as `FORM_DB` in Production.
4. Create/configure the Production Managed Turnstile widget.
5. Authenticate the Brevo sender/domain.
6. Configure the Production office recipient.
7. Configure exact allowed hosts.
8. Add and test the WAF rate-limit rule from the runbook.
9. Attach the custom domain only after Preview acceptance and Production
   bindings are ready.

Production runtime contract:

| Name                      | Type                 | Required value                                                                                 |
| ------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `FORM_ENVIRONMENT`        | plain variable       | `production`                                                                                   |
| `TURNSTILE_ALLOWED_HOSTS` | plain variable       | `luksuzniprevoz.rs,www.luksuzniprevoz.rs,<project>.pages.dev` using actual required hosts only |
| `TURNSTILE_SECRET_KEY`    | encrypted secret     | Production widget secret; never the always-pass test secret                                    |
| `BREVO_API_KEY`           | encrypted secret     | dedicated site key                                                                             |
| `BREVO_SENDER_EMAIL`      | plain or encrypted   | authenticated sender                                                                           |
| `BREVO_SENDER_NAME`       | plain variable       | approved brand name                                                                            |
| `BREVO_TO_EMAIL`          | preferably encrypted | actual office recipient(s)                                                                     |
| `FORM_DB`                 | D1 binding           | Production database                                                                            |

The WAF rule matches the two exact API paths from the runbook. Begin with its
documented test threshold, verify false-positive behavior on shared/mobile
networks, and record the final threshold. Do not emulate edge rate limiting in
client JavaScript.

## 19. Phase 11 — Safe rollout order

Use this order:

1. Implement repository workflow and documentation changes.
2. Run local validation.
3. Open the workflow PR and obtain green `quality-fast` and
   `a11y-chromium` runs.
4. Activate the `master` ruleset with both required checks.
5. Merge the workflow PR.
6. Confirm exactly one GitHub Release workflow runs on the resulting `master`
   SHA; Quality Gates must not run for the push event.
7. Manually trigger Deep Checks and make both jobs green.
8. Connect/provision Cloudflare Pages without attaching the Production custom
   domain yet.
9. Configure branch controls and stable staging Preview.
10. Provision/accept Preview Turnstile, D1, Brevo, Functions, redirects,
    headers, CSP, and noindex behavior.
11. Provision Production bindings and secrets.
12. Confirm the GitHub ruleset still blocks unverified merges.
13. Enable automatic Production deployments from `master`.
14. Allow one known-green `master` commit to build on Pages.
15. Compare GitHub `GITHUB_SHA` and Cloudflare `CF_PAGES_COMMIT_SHA`.
16. Attach/verify the Production custom domain and TLS.
17. Complete the Production smoke and forms acceptance checklists.
18. Record actual launch values and operational ownership.

Do not connect the public custom domain to an unaccepted first Pages build.

## 20. Merge and deployment behavior after rollout

For every normal change:

1. create a branch and PR;
2. wait for `quality-fast`;
3. after it passes, wait for `a11y-chromium`;
4. complete required human review and resolve conversations;
5. update from `master` if GitHub marks the branch stale;
6. merge only when both required checks are green;
7. observe the single Release workflow and Cloudflare Production deployment;
8. confirm both refer to the same commit SHA;
9. run the bounded post-deploy checks appropriate to the change;
10. investigate any Release or Pages failure immediately.

Never use a `[skip ci]` or Cloudflare skip prefix on a normal Production merge.
Those flags can produce a `master` commit without expected evidence or without
a deployment. Reserve them for a documented operational incident with explicit
authorization.

## 21. Post-deploy acceptance

At minimum verify:

- Production deployment status is successful for the expected SHA;
- Release is green for the same SHA;
- `https://luksuzniprevoz.rs` uses HTTPS and the canonical host policy;
- Serbian default routes work without an unintended prefix;
- representative `/en/` and `/ru/` routes work;
- language switching and trailing slashes remain correct;
- home, airport transportation, booking, contact, pricing, fleet, and 404
  render;
- `robots.txt`, sitemap, canonical, and hreflang output are Production-correct;
- no Preview `noindex` behavior leaked to Production;
- optimized images, CSS, fonts, and client scripts load;
- security headers/CSP do not block required assets or Turnstile;
- `GET` on each form API returns `405` with `Allow: POST`;
- one real Contact and one real Booking submission return `202` and stable
  references;
- matching D1 metadata and Brevo message IDs exist;
- no submitted PII exists in D1 or application logs;
- retrying the same submission ID does not normally create a second email;
- direct phone/email recovery remains available;
- Cloudflare WAF/Turnstile behavior is understandable and not blocking normal
  traffic;
- Lighthouse remains within the configured performance/accessibility/SEO/
  best-practices budgets.

## 22. Failure and rollback procedures

### Required PR check fails

- do not merge;
- read the failing command, not only the job summary;
- download Playwright evidence if present;
- fix the source or deterministic test synchronization;
- never use `continue-on-error`, delete an assertion, or remove a required
  check to force the merge.

### Release fails after merge

Because Pages Git deployment may already be running:

1. identify whether Cloudflare deployed the same SHA;
2. if Production is affected, use Pages rollback to the last known-good
   deployment;
3. temporarily disable automatic Production deployments if more merges could
   compound the incident;
4. preserve D1/Brevo evidence;
5. fix through a new protected PR;
6. rerun Release and post-deploy acceptance;
7. re-enable automatic deployments only when the corrected SHA is accepted.

### Cloudflare build fails

- inspect the Pages build log and `CF_PAGES_COMMIT_SHA`;
- confirm repository root, Node, pnpm, build command, output directory, and
  `PUBLIC_TURNSTILE_SITE_KEY`;
- do not manually patch generated files in Pages;
- correct configuration or source, verify through GitHub, then redeploy the
  exact accepted commit;
- confirm the previous known-good deployment remains the active rollback
  target.

### Forms fail after deployment

- verify `FORM_ENVIRONMENT`, exact allowed hosts, Turnstile key pair, Brevo
  configuration, and `FORM_DB` binding;
- verify the D1 migration exists in the correct environment;
- preserve D1 and Brevo message/reference evidence;
- revoke the site-specific Brevo key if outbound delivery must stop
  immediately;
- roll back Pages when necessary;
- never delete the Production D1 database as a rollback shortcut.

### Secret exposure

- revoke/rotate the exposed Cloudflare, Turnstile, or Brevo credential before
  redeployment;
- inspect Git history, Actions artifacts/logs, Pages logs, and `dist/`;
- confirm submitted payloads and raw provider responses did not enter logs;
- record the incident and new secret-rotation date.

## 23. Verification matrix

| Gate                                 |             PR | `master` Release |       Weekly/manual |           Cloudflare Preview |        Cloudflare Production |
| ------------------------------------ | -------------: | ---------------: | ------------------: | ---------------------------: | ---------------------------: |
| Frozen install                       |            Yes |              Yes |                 Yes |                Pages install |                Pages install |
| Generated drift                      |            Yes |              Yes |            Indirect | Types check in build command | Types check in build command |
| Governance/theme/routes/content/SEO  |            Yes |              Yes |            Indirect |          Pre-admitted source |          Pre-admitted source |
| Lint/types/unit                      |            Yes |              Yes |            Indirect |          Pre-admitted source |          Pre-admitted source |
| Production build                     |            Yes |              Yes | Browser/LHCI builds |                          Yes |                          Yes |
| Secret scan                          |            Yes |              Yes |            Indirect |                No substitute |                No substitute |
| High/critical dependency audit       |            Yes |              Yes |            Indirect |                No substitute |                No substitute |
| Axe/WCAG Chromium                    |            Yes |              Yes |      Via full smoke |           Preview acceptance |        Production acceptance |
| Axe/WCAG Firefox/WebKit              |             No |              Yes |      Via full smoke |                           No |                           No |
| Complete responsive/functional smoke |             No |               No |  Yes, three engines |               Bounded manual |               Bounded manual |
| Lighthouse budgets                   |             No |               No |                 Yes |          Optional diagnostic |            Post-deploy check |
| Functions/D1/Turnstile/Brevo         | Mock/unit only |   Mock/unit only |      Mock/unit only |              Real acceptance |              Real acceptance |

## 24. Risk register

| Risk                                                             | Likelihood                     | Impact   | Mitigation                                                                     |
| ---------------------------------------------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------ |
| Vulnerable dependency merges because audit runs only after merge | Confirmed current gap          | High     | Run `quality:release` in required PR job                                       |
| Two GitHub workflows repeat on every `master` push               | Confirmed                      | Medium   | Remove `push` from Quality; keep one Release                                   |
| Browser downloads are wasted when static checks fail             | Confirmed                      | Medium   | Make PR browser job depend on static; move Release install after static        |
| Required check rename locks merging                              | Medium                         | High     | Preserve `quality-fast`; add `a11y-chromium` only after first observed run     |
| Merge queue later waits forever                                  | Medium if queue enabled        | High     | Add `merge_group: checks_requested` now                                        |
| Path-filtered required workflow stays pending                    | Avoidable                      | High     | No path filters on required workflows                                          |
| Full smoke makes every PR too slow/flaky                         | High                           | Medium   | Chromium accessibility on PR; full suite scheduled/manual                      |
| Cross-engine accessibility regression is missed                  | Low–medium                     | High     | All three engines on actual `master` Release                                   |
| Cloudflare deploys before post-merge Release completes           | Inherent to selected Git model | High     | Strict required pre-merge gates; SHA comparison; rollback procedure            |
| Direct push bypasses pre-merge evidence                          | Medium without rules           | High     | Active ruleset, PR required, no normal bypass, force push blocked              |
| Pages project root hides Functions/workspace                     | Medium                         | High     | Use repository root; exact monorepo build/output settings                      |
| All PR branches consume Pages build quota                        | Medium                         | Medium   | Preview branch control limited to stable `staging`                             |
| Turnstile works on one hostname but not Preview                  | High if aliases vary           | Medium   | Stable staging alias; widget project hostname plus exact application allowlist |
| Preview sends to Production recipient                            | Avoidable                      | High     | Separate environment values and Preview-only recipient                         |
| Preview and Production share D1                                  | Avoidable                      | High     | Separate databases, same binding name resolved per environment                 |
| Cloudflare secrets leak through GitHub workflow                  | Avoidable                      | Critical | No GitHub deploy credentials; runtime secrets remain encrypted in Pages        |
| Failed form email is sent without ledger evidence                | Existing design fails closed   | High     | Require `FORM_DB`, migrate/bind before launch, test D1 failure path            |
| Lighthouse scheduled runner lacks Chrome                         | Medium                         | Low      | Manual first run and explicit `google-chrome --version` preflight              |
| Deep suite exceeds timeout                                       | Medium                         | Low      | 90-minute measured budget; matrix split if needed, no coverage reduction       |
| Cloudflare platform build differs from GitHub                    | Medium                         | Medium   | Pin Node/pnpm, exact build command, compare SHA, Preview acceptance            |

## 25. Completion checklist

### Repository

- [ ] Dedicated branch starts from current clean `master`.
- [ ] `test:a11y:chromium` exists and passes.
- [ ] Quality Gates triggers only on `pull_request` and `merge_group`.
- [ ] `quality-fast` preserves its exact check name.
- [ ] `quality-fast` runs `pnpm quality:release`.
- [ ] `a11y-chromium` depends on `quality-fast`.
- [ ] PR browser provisioning installs only Chromium.
- [ ] Release is the only `push: master` GitHub workflow.
- [ ] Release runs static checks before installing browsers.
- [ ] Release runs all-engine accessibility.
- [ ] Deep Checks supports weekly and manual execution.
- [ ] Deep Checks runs full smoke and Lighthouse without weakening thresholds.
- [ ] Failure evidence uploads are bounded and temporary.
- [ ] No workflow uses secrets for PR code execution.
- [ ] No workflow uses `continue-on-error` or success-masking fallbacks.
- [ ] No required workflow uses path filters.
- [ ] Documentation describes the actual event/deployment topology.
- [ ] No generated, UI, content, route, or theme file changed.

### Verification

- [ ] Prettier passes for all changed files.
- [ ] `git diff --check` passes.
- [ ] `pnpm quality:release` passes locally.
- [ ] `pnpm test:a11y:chromium` passes locally or its environment limitation is
      explicitly recorded.
- [ ] Real PR `quality-fast` passes.
- [ ] Real PR `a11y-chromium` passes.
- [ ] Real `master` Release passes after merge.
- [ ] Quality Gates does not rerun for the `master` push.
- [ ] Manual Deep Checks run passes both jobs.
- [ ] GitHub and Cloudflare run URLs/SHAs are recorded.

### GitHub rules

- [ ] Active ruleset targets `master`.
- [ ] Pull requests are required.
- [ ] `quality-fast` is required from GitHub Actions.
- [ ] `a11y-chromium` is required from GitHub Actions.
- [ ] Branches must be current before merge.
- [ ] Conversations must be resolved.
- [ ] Force pushes and deletion are blocked.
- [ ] No undocumented bypass actor exists.
- [ ] Failing/pending checks demonstrably block merge.

### Cloudflare

- [ ] Pages Git integration is connected to the correct repository.
- [ ] Production branch is `master`.
- [ ] Repository root is used.
- [ ] Build command and output directory are exact.
- [ ] Node and pnpm match repository versions.
- [ ] Production auto-deploy is enabled only after GitHub protection.
- [ ] Preview builds are restricted to stable `staging` by default.
- [ ] Preview has noindex behavior.
- [ ] Preview and Production use separate Turnstile configuration.
- [ ] Preview and Production use separate D1 databases bound as `FORM_DB`.
- [ ] D1 migration is verified in both environments.
- [ ] Preview and Production recipients are separate and correct.
- [ ] Brevo sender/domain is authenticated.
- [ ] Exact host allowlists are configured.
- [ ] WAF rate limiting is tested and documented.
- [ ] Custom domain, HTTPS, canonical host, and TLS are verified.
- [ ] GitHub and Pages Production SHAs match.
- [ ] Contact and Booking real acceptance tests pass.
- [ ] Launch record contains actual non-secret infrastructure facts.
- [ ] Rollback to the last known-good Pages deployment is understood/tested.

## 26. Commit and PR structure

Recommended commits:

1. `ci: make pull-request release gates authoritative`
2. `ci: add scheduled browser and lighthouse evidence`
3. `docs: record GitHub and Cloudflare release controls`

PR title:

```text
ci: protect master and deduplicate release workflows
```

PR description must state:

- baseline commit;
- old and new event topology;
- exact required check names;
- why `quality-fast` name is preserved;
- commands run locally;
- GitHub Actions run URLs and results;
- browser engines actually exercised;
- audit result;
- ruleset changes performed outside Git;
- Cloudflare settings performed outside Git;
- Pages Preview/Production SHA and URLs when provisioned;
- unresolved account-level provisioning marked explicitly;
- rollback steps.

Do not commit:

- Playwright reports/traces/screenshots;
- Lighthouse reports;
- `dist/`, `.astro/`, or `node_modules/`;
- account IDs, database IDs, API tokens, secrets, or recipient addresses;
- local `.env`/`.dev.vars` files;
- copied Cloudflare dashboard exports containing sensitive values.

## 27. Estimated effort

| Work                                              |                       Estimate |
| ------------------------------------------------- | -----------------------------: |
| Workflow and root script changes                  |                      1–2 hours |
| Documentation updates                             |                      1–2 hours |
| Local and PR verification                         |                      1–2 hours |
| GitHub ruleset configuration/proof                |                     0.5–1 hour |
| First Deep Checks run and adjustment              |                      1–2 hours |
| Cloudflare Pages and staging provisioning         |                      1–3 hours |
| Turnstile, D1, Brevo, WAF, and Preview acceptance |                      2–5 hours |
| Production domain/forms rollout and verification  | 1–3 hours plus DNS propagation |

Repository-only PR: approximately **4–8 engineering hours**.  
Full external Cloudflare/forms rollout: approximately **one working day**, with
additional calendar time possible for DNS propagation or Brevo domain
authentication.

## 28. Handoff summary

The implementation is intentionally conservative:

1. move `secret-scan` and the hard dependency audit into the required PR gate
   by running `quality:release`;
2. retain the stable `quality-fast` status name;
3. add required Chromium accessibility after static success;
4. stop Quality Gates from running again on `master`;
5. keep one Release workflow for the actual merge SHA and three-engine
   accessibility;
6. move complete smoke/Lighthouse evidence to a weekly/manual workflow;
7. enforce the two PR checks through an active `master` ruleset;
8. deploy through the already-approved Cloudflare Pages Git integration from
   protected `master`;
9. restrict Preview builds to stable `staging`;
10. provision Preview then Production forms infrastructure according to the
    existing runbook;
11. compare GitHub and Cloudflare SHAs and retain a tested rollback path.

Do not introduce Wrangler deployment, GitHub Cloudflare secrets, UI/content
changes, or weakened checks. If external account access is unavailable, finish
and verify the repository PR, leave external launch fields truthfully marked
`TBD`, and report the exact account-owner steps remaining rather than inventing
credentials or claiming deployment completion.
