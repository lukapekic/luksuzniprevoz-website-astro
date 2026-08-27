# Luxury Transportation — Reuse-First Component Builder

Status: **Shared execution prompt**

Use this prompt whenever an agent is asked to build or materially revise a visible component/section for a service page.

This prompt MUST be used together with:

```text
site/luksuzni-prevoz/src/docs/agent-prompts/00-service-agent-foundation.md
site/luksuzni-prevoz/src/docs/agent-prompts/component-reuse-registry.md
```

The foundation prompt and registry are mandatory. This file does not repeat their full rules.

---

## Invocation inputs

The dispatching agent/user should provide:

```text
TARGET_PAGE:
TARGET_SECTION_OR_COMPONENT:
TARGET_BLUEPRINT:
TARGET_WIREFRAME:
ALLOWED_FILES_OR_DIRECTORY:
OPTIONAL_IMPLEMENTATION_NOTES:
```

If a value is obvious from the target page docs, resolve it from the repository instead of asking for it again.

---

## 1. Mission

Satisfy the assigned blueprint requirement with the **smallest justified implementation surface**.

The default outcome is NOT “create a component.”

The default outcome is:

```text
reuse an approved component unchanged
or
compose existing primitives/patterns
```

Create new code only where the blueprint cannot be satisfied cleanly through existing contracts.

---

## 2. Mandatory discovery before editing

Before writing component code:

1. Read the service-agent foundation prompt.
2. Read the component reuse registry.
3. Read the target blueprint section.
4. Read any referenced shared service contract.
5. Inspect the actual source + public API/types of every likely reusable component.
6. Search the production site for current usages of those components.
7. Inspect the matching `.skills` files required by `AGENTS.md`.
8. Run:

```bash
pnpm design:context site/luksuzni-prevoz
```

Do not infer component behavior from a filename or screenshot.

---

## 3. Mandatory reuse decision

Produce this decision internally before implementation:

```text
REQUIREMENT:
What does the blueprint actually require?

CANDIDATE REUSE:
Which existing primitives/shared components can satisfy it?

COMPOSITION:
Can those existing pieces be composed without a new abstraction?

API GAP:
Is there a proven missing capability in an approved shared component?

NEW CODE DECISION:
none | page-local composition | minimal existing-component extension | new shared contract
```

Use this order:

```text
1. Existing approved component unchanged
2. Existing approved variant
3. Composition of existing primitives/patterns
4. Page-local composition
5. Minimal extension to an existing component when semantically reusable
6. New shared component only when a locked shared contract or proven cross-page reuse requires it
```

Do not skip directly to step 4–6.

---

## 4. Reuse search scope

At minimum inspect:

```text
site/luksuzni-prevoz/src/foundation/ui/
site/luksuzni-prevoz/src/components/shared/
site/luksuzni-prevoz/src/components/site/
site/luksuzni-prevoz/src/components/services/   # if present
```

For service-page sections, explicitly consider:

```text
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button / form primitives
Breadcrumbs
OpenSplitSection
ServiceCard
HorizontalCarousel
FAQ
FinalCTA
```

Do not reuse Homepage-specific semantic identities unless the registry explicitly permits the underlying pattern.

---

## 5. Composition-first examples

Prefer:

```text
Section
  PageContainer
    SectionHeading
    divider-led rows
```

over creating:

```text
AirportOverviewWrapper
BusinessFactsPanel
ChauffeurInfoContainer
```

Prefer:

```text
Section
  PageContainer
    OpenSplitSection
      slotted page-specific content
```

over creating another split-layout component.

Prefer:

```text
ServiceCard × N
```

for compatible service discovery rather than another card vocabulary.

Prefer:

```text
Section
  ReadingContainer
    SectionHeading
    FAQ
```

over a new FAQ section/accordion implementation.

---

## 6. New-component gate

A new component is allowed only when all of these are true:

- the blueprint requires a distinct semantic unit;
- existing components cannot satisfy it unchanged;
- composition alone would create repeated or unclear page markup;
- the new boundary has a clear owner/responsibility;
- the API can remain small;
- content and business data stay outside the component;
- theme values stay outside the component API;
- responsive behavior is defined;
- accessibility ownership is clear;
- it does not duplicate a Homepage/global/shared identity.

A new **shared** component additionally requires one of:

- a locked shared service contract; or
- demonstrated reuse by at least two semantically aligned page contexts.

Do not generalize hypothetical future reuse.

---

## 7. Existing-component extension gate

Do not add a prop merely because the target page looks different.

A new prop/variant must preserve the existing component's:

```text
semantic purpose
content structure
visual identity
interaction model
accessibility contract
```

If the requested change alters identity/structure, keep it page-local or create a separately justified component instead of turning the shared component into a mega-component.

When a shared API looks insufficient, first verify the problem is not:

```text
wrong container
wrong Section surface/spacing
incorrect slot composition
incorrect data adapter
wrong image role
scoped CSS ownership
parent overflow/positioning
incorrect existing prop usage
```

---

## 8. Styling rules

Use current semantic theme tokens/utilities only.

Do not add:

```text
raw colors
one-off radii
one-off section padding
new breakpoint numbers
one-off shadows
dynamic Tailwind fragments
page-local button/link styling that duplicates primitives
```

Class passthrough is layout-only unless the component explicitly documents otherwise.

Do not use parent scoped CSS to reach into child-component DOM.

---

## 9. Content/data rules

The component must not become a data source.

No hardcoded:

```text
localized marketing copy
prices/currency
fleet capacities
service facts
client claims
contact values
locale URLs
FAQ content
```

Use the repository's canonical content/data layer and route helpers.

If the required fact is missing/unverified, preserve the gap or route to the approved quote/placeholder state. Do not invent it for visual completeness.

---

## 10. Scope rules

Edit only the files required to satisfy the assigned component/section.

Do not:

- redesign SiteHeader/SiteFooter/FinalCTA/FAQ;
- refactor unrelated shared code;
- reorganize component directories;
- modify theme sources to solve a page-local issue;
- alter authoritative data merely to make the UI easier;
- expand the task into full-page assembly unless explicitly assigned.

If a shared component truly blocks the task, report the blocker rather than silently redesigning it.

---

## 11. Verification

Run the smallest relevant set, including at minimum:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
```

If the change affects page rendering/integration, also run:

```bash
pnpm --filter @luksuzni-prevoz/site build
```

Do not claim visual viewport verification unless it actually occurred.

---

## 12. Required completion report

Return exactly this structure:

```text
REUSE DECISION
- Existing components reused:
- Existing variants used:
- Composition chosen:

FILES CHANGED
- ...

NEW COMPONENTS
- None
or
- <name>: <why composition/reuse was insufficient>

SHARED API CHANGES
- None
or
- <component>: <minimal change + cross-page impact>

DATA/CONTENT SOURCES
- ...

VALIDATION RUN
- <command>: PASS/FAIL/NOT RUN

KNOWN BLOCKERS / DEVIATIONS
- None
or
- ...
```

A completion report with many new components is a signal to re-check the reuse decision before declaring success.
