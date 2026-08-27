# Luxury Transportation — Service Implementation Validation & Handoff

Status: **Shared final gate prompt**

Use this prompt after a service-page implementation batch is complete. Prefer a reviewer agent that did not perform the main implementation when possible.

This prompt is for independent validation, drift detection, and handoff quality.

It does not authorize a redesign.

Mandatory base files:

```text
00-service-agent-foundation.md
component-reuse-registry.md
```

---

## Invocation inputs

```text
TARGET_PAGE_OR_SCOPE:
TARGET_BLUEPRINT:
TARGET_WIREFRAME:
IMPLEMENTATION_COMMIT_OR_DIFF: optional
FIX_MODE: report-only | bounded-fixes
AVAILABLE_BROWSER_REVIEW: yes | no
OPTIONAL_KNOWN_LIMITATIONS:
```

Default `FIX_MODE` should be `report-only` for an independent review agent.

---

## 1. Mission

Determine whether the implementation is genuinely ready to hand off by checking:

```text
blueprint compliance
reuse discipline
component architecture
data/content ownership
theme/token discipline
responsive correctness
accessibility
routing/i18n
SEO/structured-data integration where relevant
build/check status
known deviations
```

The review must distinguish:

```text
automated verification
source-code inspection
manual visual verification
not-verified assumptions
```

Never convert an unverified assumption into “PASS.”

---

## 2. Read authority first

Read:

```text
AGENTS.md
DESIGN.md
00-service-agent-foundation.md
component-reuse-registry.md
target blueprint
shared service contracts
target wireframe
matching review/technical skills
```

Inspect the final implementation and actual component APIs.

Run:

```bash
pnpm design:context --target <exact-reviewed-file> --surface <surface-id>
```

---

## 3. Blueprint compliance matrix

Build a matrix before judging polish:

```text
Section / Requirement
Expected component/identity
Present?
Correct order?
Correct data source?
Responsive intent preserved?
Deviation?
```

For major service pages, every locked section must be accounted for.

Missing sections are blockers, not minor polish issues.

Do not reward visual similarity if the architecture/data contract is wrong.

---

## 4. Reuse audit

Search all changed/target files and classify every component used/created.

Verify:

- reviewed foundation primitives are reused;
- `SiteHeader`/`SiteFooter` are not cloned;
- `FAQ` and `FinalCTA` are reused;
- `OpenSplitSection` is reused for compatible split sections;
- `ServiceCard` is reused where the approved service-card identity fits;
- the four service-shared contracts are not duplicated page-locally;
- Homepage-specific identities are not incorrectly imported as substitutes;
- `LeafPage` is not the final renderer for the three major service pages;
- no universal mega-component was introduced.

Every new component must have a clear justification.

Flag wrapper-only components that duplicate Section/container/heading responsibility.

---

## 5. New-component budget review

There is no arbitrary numeric hard limit, but the implementation should trend toward minimal new components.

Classify each new component:

```text
required shared service contract
justified page-local semantic section
unnecessary wrapper/duplicate
premature shared abstraction
```

A large number of new components is a reason to inspect reuse—not automatic failure by itself.

Reject components whose only purpose is:

```text
renaming an existing primitive
adding one styling wrapper
hardcoding one page's copy/data
creating a new visual variant system
```

---

## 6. Theme/design audit

Verify:

- site theme selection still comes only from `foundation.config.ts`;
- no manual generated-theme edits;
- no raw palette/radius/breakpoint system introduced;
- no legacy Theme V1/Fraunces/gold-first drift;
- Inter Tight/Manrope semantic roles remain intact;
- premium effect comes from hierarchy/composition/imagery rather than effects;
- no cardification/SaaS dashboard drift;
- FinalCTA remains FinalCTA, not Hero #2;
- service standards do not become Homepage TrustStrip identity;
- recommendations do not become Homepage FleetShowcase identity.

Do not suggest a redesign merely because another composition is aesthetically possible.

---

## 7. Data/content audit

Search for duplicated/hardcoded facts in changed UI.

Verify appropriate canonical ownership for:

```text
services
operations
fleet
pricing
clients
contacts
routes
localized page/UI content
```

Critical checks:

- no invented Airport fares;
- no inferred currency;
- no unverified client-logo display;
- no security/bodyguard claims contrary to data;
- no manual locale URL concatenation;
- no silent locale content fallback;
- FAQ visible content matches structured-data source architecture.

---

## 8. Responsive/a11y audit

If browser review is available, inspect:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

If not available, inspect source/tests and mark visual states as NOT MANUALLY VERIFIED.

Check:

```text
horizontal overflow
heading hierarchy
focus-visible
target size
keyboard behavior
surface contrast
long localized strings
image crop/alt
reduced motion
form labels/states
carousel semantics if used
```

---

## 9. Required automated gates

For a major completed service page, run:

```bash
pnpm design:sync:check
pnpm design:doctor
pnpm verify:ui --target <exact-reviewed-file> --surface <surface-id> --change page
pnpm --filter @luksuzni-prevoz/site build
```

Because root `pnpm check` already runs generated types + site/core checks, report its actual result rather than inventing separate success.

If page work touched route/content/SEO data, run:

```bash
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
```

For a broad integration milestone, `pnpm design:guard` may additionally be run, but do not substitute it for page-specific build/validators required by the changed scope.

Run existing E2E/a11y tests when the environment supports them and they are applicable:

```bash
pnpm test:e2e
pnpm test:a11y
```

Never install browsers/system packages during review unless the task explicitly authorizes it.

---

## 10. Severity model

Use:

```text
BLOCKER
  blueprint missing/wrong order, broken build, invalid route/content, inaccessible critical interaction,
  invented business data, duplicated global chrome, theme authority violation

HIGH
  wrong shared component identity, major responsive failure, substantial reuse violation,
  incorrect data source, SEO/schema mismatch on production page

MEDIUM
  localized overflow, inconsistent section rhythm, minor semantic/accessibility issue,
  unnecessary component extraction, imagery/crop issue

LOW
  bounded polish/readability refinement with no structural impact
```

Do not inflate personal aesthetic preferences into blockers.

---

## 11. Fix mode

### report-only

Do not change code.

Return findings with exact file/component references and minimal recommended remediation.

### bounded-fixes

You may fix only clearly verified BLOCKER/HIGH/MEDIUM defects inside the target scope.

Still do not:

- redesign approved components;
- change business facts;
- alter locked page structure without blueprint revision;
- refactor unrelated code;
- create new theme direction.

Re-run affected validation after each bounded fix batch.

---

## 12. Final handoff format

Return exactly:

```text
VERDICT
- READY | READY WITH NON-BLOCKING NOTES | NOT READY

BLUEPRINT COMPLIANCE
- <section>: PASS/FAIL

REUSE SUMMARY
- Existing components reused:
- Shared service components used:
- Page-local components:
- New shared abstractions:

NEW COMPONENT JUSTIFICATION REVIEW
- <component>: JUSTIFIED / QUESTIONABLE / REJECT

FINDINGS
BLOCKER
- ...
HIGH
- ...
MEDIUM
- ...
LOW
- ...

DATA/CONTENT INTEGRITY
- PASS/FAIL + notes

RESPONSIVE/A11Y
- automated/source review:
- manual viewport review:

VALIDATION COMMANDS
- <command>: PASS/FAIL/NOT RUN

FILES CHANGED BY REVIEWER
- None
or
- ...

UNVERIFIED ITEMS
- None
or
- ...

NEXT ACTION
- merge/continue | targeted fix list
```

A page is not `READY` while any BLOCKER remains or a required build/check gate fails.
