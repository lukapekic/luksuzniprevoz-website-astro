# Design governance implementation plan

Date: 2026-09-13
Status: Proposed implementation sequence; no implementation or design approval implied.

## Objective and boundaries

Make design compliance deterministic from task entry through final review. Preserve the approved product design, localized copy, CTA roles, component identity, and locked page structure. Improve enforcement without creating another source of visual truth.

Authority: root `AGENTS.md` for technical/process rules; `DESIGN.md` for visual direction; locked blueprints for permitted page structure; configured theme JSON for raw token values; approved component contracts for shared identity/API. Apply `.skills/design-governance.md` and `.skills/design-foundation-governance.md`, plus the relevant specialist skills for each implementation step.

Work in the current workspace without overwriting unrelated changes. Establish the starting diff and record baseline failures before implementation. Do not treat existing uncommitted work as this plan's implementation.

## Delivery order

| Phase | Outcome                                                           | Depends on |
| ----- | ----------------------------------------------------------------- | ---------- |
| 1     | Detector catches confirmed token and typography bypasses          | Baseline   |
| 2     | Verification covers the real change and correct surfaces          | 1          |
| 3     | Shared changes select all affected consumers                      | 2          |
| 4     | Completion requires fresh automated and visual evidence           | 2–3        |
| 5     | Locked contracts and skill routing become unambiguous             | 4          |
| 6     | Semantic recipes and contrast pairs reduce implementation choices | 5          |
| 7     | Accepted decisions persist and rollout is complete                | 4–6        |

Each phase is a bounded reviewable change. Phase 4 defines evidence identity early; phase 7 builds durable accepted-review records on that format. Do not delay source binding until the final phase.

## Baseline and implementation discipline

1. Read the applicable authorities and inspect the current diff.
2. Record current results for `pnpm governance:validate`, `pnpm skills:validate`, `pnpm design:self-test`, `pnpm design:sync:check`, `pnpm design:doctor`, `pnpm design:detect --strict`, `pnpm components:check`, `pnpm theme:sync:check`, and `pnpm theme:validate`.
3. Run `design:context` before any production UI changes. If governance/theme source targets cannot currently resolve a legitimate surface, repair target classification in phase 2; never label infrastructure as `dev-ui` to get through a gate.
4. Add regression cases before fixing confirmed enforcement gaps. Use temporary fixtures and ensure test cleanup. No deliberately invalid fixtures belong in production scan roots.
5. A stricter check may expose existing violations. Inventory them, resolve confirmed violations in bounded changes, and adjudicate false positives against authority. Do not add blanket allowlists or lower severities to regain green checks.
6. Regenerate machine-owned artifacts only through the relevant generators. Verification remains check-only.

## Phase 1 — Close detector gaps

Primary files: `scripts/design/rules/{theme-values,typography,layout,tailwind}.mjs`, `scripts/design/lib.mjs`, `scripts/design/self-test.mjs`, and focused fixture/test modules if the self-test becomes too large.

Implementation:

- Add failing fixtures for raw font size, unknown color variable, brand role outside BrandLockup, raw spacing mixed with a valid token, and range-style media queries using unregistered thresholds.
- Inspect available parser dependencies and reuse suitable declared tooling. If necessary, add a narrowly justified parser dependency; do not rely on undeclared transitive imports.
- Parse relevant style declarations, values, media conditions, and static utility strings structurally. Cover Astro styles, supported inline styles, media ranges, conventional min/max queries, and container queries.
- Resolve theme variables against generated token inventory. Distinguish theme variables, documented component-owned variables, platform keywords, and permitted structural values. Validate every expression operand, not merely the presence of `var(...)`.
- Enforce font role ownership, including `font-brand` and direct brand-variable usage. Preserve legitimate BrandLockup integrations and font-face declarations.
- Define allowed structural dimensions explicitly. A focal-point percentage or zero reset is not automatically a theme violation. An undefined variable or arbitrary local type scale is not automatically structural.
- Record stable rule IDs, severity, authority, and correction guidance; align new rules with the existing governance/traceability model.

Acceptance:

- All five audit probes produce the expected findings.
- Positive fixtures cover valid calculations, documented custom properties, comments, SVG/image data, font declarations, registered thresholds, and approved component ownership.
- Full production detection remains clean after actual violations are resolved; no blanket suppression.

Verification: detector fixtures/self-tests, governance validation, strict full-site detection, lint, and affected unit tests.

## Phase 2 — Resolve scope and verification requirements

Primary files: `scripts/design/{lib,context,detect}.mjs`, `scripts/governance/{verify-ui,validate}.mjs`, `.design/config{,.schema}.json`, `.governance/policy.json`.

Implementation:

- Reject explicit target/surface mismatches. Model shared ownership and legitimate multiple surfaces rather than trusting any known surface ID.
- Add explicit classification for theme/configuration, foundation tooling, documentation/contracts, production UI, and dev-only targets. Theme source verification must not attempt to scan JSON as a UI file.
- Support planned files through existing planned-target semantics, with ownership validated again after creation.
- Define local and CI change discovery: explicit base revision in CI; tracked staged/unstaged changes and relevant untracked files locally. Handle renamed and deleted files. Do not silently assume a branch name or omit dirty files.
- Compute required gates as the union of change categories. Profiles are not a simple ranked scale: theme plus component changes require both sets of relevant gates.
- Keep focused target checks available, but label them partial when they do not cover the change. Whole-change completion must reconcile every relevant changed file.
- Return resolved surfaces, changed files, scope exclusions with reasons, required gates, and authority paths in machine-readable context.
- Centralize severity/exception handling. Preserve non-waivable rules; validate any permitted exception against the existing waiver process. Reporting-only commands cannot authorize completion.

Acceptance:

- Homepage plus `dev-ui` is rejected; legitimate shared multi-surface ownership succeeds.
- Changing two UI files and verifying one cannot approve the whole change.
- Requesting `small-ui` cannot omit component/theme/content gates required by the actual diff.
- Mixed changes, planned targets, deleted files, and missing CI base revisions have tested deterministic behavior.
- Theme, foundation, and contract-only targets run their applicable profiles successfully without artificial UI surface assignments.

Verification: resolver/profile integration tests, governance validation, self-tests, representative page/component/theme/foundation context and verification invocations.

## Phase 3 — Expand shared-component impact

Primary files: `scripts/governance/{components,component-impact,verify-ui}.mjs`, import resolution in `scripts/design/lib.mjs`, generated `.governance/components.json`, and route/test mappings.

Implementation:

- Resolve supported relative imports, configured aliases, re-exports, and workspace package exports using actual repository configuration.
- Construct a cycle-safe transitive graph from changed shared components to affected assemblers, routes, locales, and packages.
- Distinguish confirmed page-local components from unresolved/unregistered shared components. Unresolved relevant imports block complete impact verification.
- Associate affected surfaces with existing smoke suites and required contract/migration evidence. New variants require a compatibility decision; unchanged APIs can record explicit compatibility rather than a fabricated migration.
- Generate the registry and validate that mapped tests and routes exist. The registry describes ownership and coverage, not visual decisions.

Acceptance:

- A Header or FinalCTA change reaches every actual production consumer through intermediate components.
- Fixtures cover aliases, barrels, package exports, cycles, missing registrations, and local-only components.
- Each affected surface has selected verification coverage or an explicit incomplete result; absence of coverage never silently passes.

Verification: import graph tests, `pnpm components:sync`, `pnpm components:check`, component profile, and selected affected-package checks. Browser execution is integrated in phase 4.

## Phase 4 — Require fresh browser and review evidence

Primary files: `scripts/governance/verify-ui.mjs`, new evidence schema/validator, `.governance/policy.json`, `site/luksuzni-prevoz/tests/support/contracts.ts`, smoke suites and Playwright configuration, `.github/workflows/{quality,release}.yml`.

Implementation:

- Separate static verification, browser verification, and visual/manual review statuses. Overall completion requires every applicable category; missing browser capability yields incomplete, not pass.
- Bind evidence to changed-file content hashes, relevant dependencies, theme/configuration, contracts, test inputs, and built artifact identity. Include base/head revision where available; commit SHA alone is insufficient for dirty workspaces.
- Use unique evidence paths per run. Record tool/browser versions, selected routes/locales/states, commands, results, artifact references, and unresolved findings. Avoid overwriting unrelated review records.
- Run affected-surface browser tests against a verified production build. Prevent reuse of an unrelated stale preview server; record any test-only environment substitutions.
- Exercise all five required widths and both sides of topology transitions. Derive locales from configuration. Cover overflow, minimum targets, keyboard/focus order, CTA destinations, media geometry, enlarged text, reduced motion, and applicable error/missing-data states.
- Check declared font roles plus actual font loading and representative Latin/Cyrillic glyph rendering. Computed `font-family` alone does not prove the desired face rendered.
- Attach screenshots and focused visual review findings. Stable screenshot comparison may assist review but cannot certify design intent or authorize baseline replacement.
- Provision pinned browser capability deliberately in CI for this phase; preserve the existing three-engine functional smoke contract. Upload failure evidence and keep existing required-check names stable where possible.
- Define an independent-review record: reviewer identity/role, reviewed source identity, authorities, findings, and disposition. A successful test runner cannot synthesize reviewer approval.

Acceptance:

- Static success plus missing screenshots/review is incomplete.
- Stale source/build/theme/contract evidence is rejected.
- Missing required locales, widths, interaction assertions, or affected-consumer results is incomplete.
- Failed browser checks and unresolved blocking findings prevent completion. Permitted exceptions require existing documented authority.
- CI executes selected browser coverage and retains inspectable evidence.

Verification: evidence-schema and stale-evidence tests; runner failure-path tests; affected Playwright suites; `pnpm test:a11y`; page/component profiles; `pnpm quality:release`. Run applicable performance/Lighthouse evidence for performance-sensitive changes.

## Phase 5 — Consolidate contracts and skill routing

Primary files: `AGENTS.md`, `DESIGN.md`, `.skills/*.md`, `.skills/skills-manifest.json`, `scripts/governance/skills-validate.mjs`, `scripts/design/context.mjs`, and existing blueprint/component contract directories.

Implementation:

- Keep root AGENTS authoritative. Give entry, profile selection, exceptions, and completion one canonical procedural definition; skills reference it rather than publishing alternate gate sequences.
- Clarify that blueprint precedence applies to authorized structure and local exceptions, not arbitrary overrides of token ownership or non-waivable requirements.
- Correct the outdated root quality-script warning after checking every claimed command against configuration.
- Validate skill bundle metadata against the authoritative bundle definition. Context returns the smallest complete bundle plus specialist additions.
- Extend existing contract documents with schema-validated metadata or linked acceptance records. Define one source for each field; generate summaries instead of duplicating editable truth.
- Include status/revision, region IDs/order, CTA roles, semantic surfaces/type roles, breakpoint references, per-state topology, image behavior, allowed variants, and acceptance-test references.
- Migrate HomepageHero and one shared component first, then remaining locked production contracts. Replace ambiguous thresholds through authority review; do not infer new design decisions from incidental CSS.

Acceptance:

- Missing required contract fields, unresolved locked thresholds, contradictory ownership, and stale bundle references fail validation.
- Context identifies exact contract and skill paths without sweeping unrelated documents into the task.
- No historical approval is invented during migration. Unverified decisions remain explicitly unresolved.

Verification: skills/governance/contract validation, traceability check, snapshot freshness, and applicable page/component profiles. Contract behavior changes require corresponding browser review.

## Phase 6 — Add semantic recipes and contrast usage contracts

Primary files: configured active theme JSON, `packages/astro-foundation/src/theme/{schema,sync,validate-theme}.ts`, generated theme output, canonical site CSS/utilities, and relevant component contracts.

Implementation:

- Inventory repeated type and surface combinations before adding recipes. Start with proven heading, lead/body, caption, control, and functional-surface roles; avoid speculative variants.
- Represent recipes as references to existing semantic tokens. Extend the theme schema/generator only where necessary; do not copy raw values into utilities or documents.
- Define approved foreground/background/state pairs and their intended text/control usage. Validate muted text according to actual permitted size/role, not a universal large-text assumption.
- Cover light and elevated surfaces, input states, accent actions, errors, and focus treatment. Keep image-overlay contrast as browser/manual evidence where token arithmetic cannot prove it.
- Pilot recipe consumption in a bounded component while preserving computed appearance. Wider migration follows verified equivalence, not an incidental redesign.
- Distinguish motion capability from permission: a token pattern being available does not authorize its use without the relevant contract.

Acceptance:

- Recipe references resolve; raw values have one authoritative owner.
- Invalid contrast pair fixtures fail; approved current pairs pass or produce a concrete correction proposal.
- Pilot consumers preserve typography, geometry, CTA emphasis, and responsive behavior across locales.

Verification: theme schema/generator/contrast unit tests; `pnpm theme:sync`; `pnpm theme:validate`; `pnpm design:sync`; theme profile with exact classified target; applicable component profile and browser evidence. Verify configured version, output, and snapshot agree.

## Phase 7 — Persist accepted decisions and finish rollout

Primary files: `.design/reviews/`, evidence/contract validators, design context, `.design/README.md`, completion guidance, CI artifact policy.

Implementation:

- Require concise accepted-review records for locked surfaces and approved shared components using phase 4's evidence identity.
- Record accepted identity/variants, relevant screenshot artifacts, unresolved findings, explicit exceptions, reviewer, and authority. Keep raw test output in artifacts rather than duplicating transcripts in repository docs.
- Have context return relevant accepted decisions and stale-review warnings so subsequent agents preserve intentional choices.
- Define artifact retention and durable locations for accepted references. A broken or expired evidence link cannot substantiate an approval.
- Validate exception scope and lifecycle using the existing waiver process. Agents must not approve their own exceptions simply to complete verification.
- Exercise an end-to-end pilot: a bounded UI fix, a shared-component fix, a theme-source change, and a deliberately incomplete verification attempt. Use fixtures where production mutation is unnecessary.
- Remove transitional paths that could report full completion without the new evidence. Report remaining unmigrated contracts and surfaces explicitly.

Acceptance:

- Relevant changes invalidate prior evidence; unrelated changes do not require needless re-review.
- Approved decisions are discoverable from exact-target context.
- No production surface is marked approved using missing, stale, self-invented, or partial evidence.
- All migrated profiles complete successfully with their required evidence; negative end-to-end cases fail as designed.

## Final handoff

Report authority/skills applied, files changed, rule coverage added, generated artifacts, commands actually run, automated versus manual evidence, approval status, unresolved findings, and any compatibility decisions. Existing missing assets/data remain visible and gated; this project does not fabricate replacements.

The final milestone is enforcement and evidence coverage for the approved design system. It does not authorize changing the site's visual direction, replacing shared component identities, or weakening foundation rules.
