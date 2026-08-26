# Luxury Transportation — Page-Specific Section Builder

Status: **Shared execution prompt**

Use this prompt for sections that belong to one locked service page and are not one of the four shared service contracts.

Mandatory base files:

```text
00-service-agent-foundation.md
component-reuse-registry.md
01-reuse-first-component-builder.md
```

---

## Invocation inputs

```text
TARGET_PAGE:
TARGET_SECTION:
TARGET_BLUEPRINT:
TARGET_WIREFRAME:
ALLOWED_FILES_OR_DIRECTORY:
SHARED_SERVICE_COMPONENT_STATUS:
OPTIONAL_IMPLEMENTATION_NOTES:
```

---

## 1. Mission

Implement the assigned page-specific section with the **minimum new abstraction necessary**, while composing reviewed primitives/shared patterns and preserving the section's unique page meaning.

Page-specific means the section may have unique semantics.

It does NOT mean the section gets a new container system, card vocabulary, button system, split primitive, theme rules, or data store.

---

## 2. Mandatory discovery

Before editing:

1. Read the page blueprint in full.
2. Read the exact target-section requirements again.
3. Read all shared service contracts referenced by that blueprint.
4. Read the component reuse registry.
5. Inspect real APIs/usages for likely reusable components.
6. Inspect canonical data/content sources needed by the section.
7. Run:

```bash
pnpm design:context site/luksuzni-prevoz
```

Build from the blueprint, not from a screenshot or rejected implementation.

---

## 3. Known page-specific section map

Treat these as page-local by default unless later repetition proves otherwise.

### Private Chauffeur

```text
PrivateChauffeurOptions
Availability & Flexibility
```

Preferred reuse direction:

```text
PrivateChauffeurOptions
→ Section + PageContainer + SectionHeading + divider-led option structure
→ pricing/service facts from canonical data
→ shared CTA primitives

Availability & Flexibility
→ Section + PageContainer + OpenSplitSection
```

Do not turn Hourly / Half Day / Full Day into three floating dashboard pricing cards.

### Airport Transportation

```text
AirportBookingBlock
Arrival Handling & Flight Tracking
Private Aviation / FBO
```

Preferred reuse direction:

```text
AirportBookingBlock
→ Section(light/functional) + container + SectionHeading + existing form/control primitives

Arrival Handling
→ Section + PageContainer + OpenSplitSection

Private Aviation / FBO
→ contained/page-local feature composed from foundation primitives
```

Do not invent airport fares or simulate unsupported pricing states.

### Business Transportation

```text
BusinessServiceSelector
One-off vs Recurring Arrangements
Coordination / Multi-Vehicle Capability
Trusted Clients
```

Preferred reuse direction:

```text
BusinessServiceSelector
→ ServiceCard where its reviewed identity fits + route/data-driven children

One-off vs Recurring
→ functional/light Section + PageContainer + structural divider/comparison

Coordination / Multi-Vehicle
→ Section + PageContainer + OpenSplitSection

Trusted Clients
→ page-local confidence composition + clients.ts gating
```

Do not generalize Trusted Clients into a global logo wall before another page has the same semantic need.

---

## 4. Page-local architecture rule

A page-specific section may be implemented as:

```text
A. direct composition inside the dedicated page renderer
or
B. one page-local component when the section has enough internal structure to justify a boundary
```

Prefer A when markup remains clear and contained.

Prefer B when the section:

- has substantial internal structure;
- owns a coherent semantic region;
- has its own data adapter/interactions;
- would otherwise make the page renderer difficult to understand/test.

Do not extract tiny wrappers merely to reduce line count.

---

## 5. Reuse restrictions

Before creating a page-local component, search for:

```text
Section
PageContainer
ReadingContainer
SectionHeading
OpenSplitSection
ServiceCard
Link
Button
form primitives
HorizontalCarousel
```

Use those for the responsibilities they already own.

Rejected examples:

```text
AirportSplitSection      # duplicates OpenSplitSection
BusinessServiceCard      # duplicates ServiceCard without distinct identity
ChauffeurSectionWrapper  # duplicates Section + PageContainer
AirportButton            # duplicates Link/Button
ClientCarousel           # unless carousel mechanics are actually required; reuse HorizontalCarousel if so
```

---

## 6. Functional UI rule

For booking/pricing/form-like sections:

- inspect existing Field/Input/Button/Dialog/control primitives first;
- keep the UI operational, not dashboard-like;
- use a light functional surface only when the blueprint specifies it;
- distinguish fixed / estimated / quote states semantically where supported;
- unsupported commercial states must remain unreachable, not mocked;
- customer-detail collection does not belong in an early lightweight booking block unless the blueprint says so.

Do not add a dependency to avoid a small amount of native Astro/HTML/CSS behavior.

---

## 7. Data/content rule

Consume canonical sources.

The section must not duplicate:

```text
services.ts facts
operations.ts facts
fleet.ts facts
pricing.ts facts
clients.ts policy
contact.ts values
routes.ts paths
localized content
```

If content/data is missing:

```text
1. identify the missing canonical field/fact;
2. do not invent it;
3. preserve a safe UI state or omit the unsupported claim;
4. report the blocker in the handoff.
```

Do not edit business data unless verified values were explicitly supplied as part of the task.

---

## 8. Styling/responsive rule

Use semantic theme roles and existing section/container/layout ownership.

The section must work at:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop sanity
```

Do not use new raw breakpoint values.

For split sections, use `OpenSplitSection` and its approved ratios/order instead of bespoke media queries.

For long localized strings, allow wrapping and content-driven height; do not force equal heights merely for symmetry.

---

## 9. Scope boundaries

Do not:

- assemble/rewrite unrelated sections;
- modify shared service components unless a proven blocker exists;
- redesign FinalCTA/FAQ/chrome;
- alter page order;
- copy wireframe helper CSS;
- modify active theme values;
- refactor unrelated data/routing code.

If the target section exposes a shared-component API blocker, stop broadening the implementation and report:

```text
SHARED COMPONENT BLOCKER
Component:
Missing capability:
Blueprint requirement:
Why composition cannot solve it:
Suggested minimal API change:
Affected consumers:
```

---

## 10. Verification

Run:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
```

Run site build if the section is integrated into a route/renderer:

```bash
pnpm --filter @luksuzni-prevoz/site build
```

---

## 11. Required completion report

```text
TARGET SECTION
- ...

IMPLEMENTATION FORM
- direct page composition | page-local component

EXISTING REUSE
- ...

NEW COMPONENTS
- None
or
- <name>: <why the boundary is justified>

CANONICAL DATA/CONTENT SOURCES
- ...

FILES CHANGED
- ...

VALIDATION
- ...

SHARED BLOCKERS / BLUEPRINT DEVIATIONS
- None
or
- ...
```
