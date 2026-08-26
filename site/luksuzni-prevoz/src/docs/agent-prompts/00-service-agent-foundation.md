# Luxury Transportation — Service Page Agent Foundation

Status: **Shared mandatory prompt for service-page implementation agents**

Use this prompt as the common foundation for all dedicated service-page builds and major service-page revisions in `site/luksuzni-prevoz/`.

This prompt does not replace repository authority. It tells the implementation agent how to apply that authority consistently.

---

## 1. Mission

Build the assigned service page as a dedicated, production-quality Astro renderer that follows the locked page blueprint, reuses reviewed shared components, consumes verified data/content sources, and preserves the current Luxury Transportation design system.

The page must feel intentionally designed for its service, while still belonging to one coherent site system.

Do not solve the task by copying a wireframe, cloning another page, inventing a one-off component family, or expanding a generic page renderer until it becomes a mega-component.

---

## 2. Mandatory authority chain

Before editing, read the smallest complete authority chain for the target page:

```text
1. root AGENTS.md
2. target locked page blueprint
3. DESIGN.md
4. active theme selected by site/foundation.config.ts
5. shared service contracts under src/docs/services/shared/
6. current reviewed component APIs/types
7. target wireframe for structural intent only
8. matching .skills procedures
9. existing implementation only as verified technical reference
```

Technical/foundation conflicts are resolved by `AGENTS.md`.

Visible/design conflicts are resolved by the locked page blueprint, then `DESIGN.md`, then active semantic theme tokens, then approved component contracts.

A wireframe never overrides production typography, theme tokens, component APIs, data ownership, accessibility, routing, or localization.

---

## 3. Required repository context

Before UI work run:

```bash
pnpm design:context <target>
```

If requested by the context command:

```bash
pnpm design:sync
```

Inspect the target page blueprint and all referenced shared service contracts before creating components.

Also inspect the real public APIs/types of any component you intend to reuse. Do not infer capabilities from filenames.

---

## 4. Reuse-first rule

For every visible block, decide in this order:

```text
1. Can an approved existing component solve it unchanged?
2. Can an approved existing variant solve it?
3. Can existing primitives compose the required structure?
4. Is the structure intentionally page-local?
5. Does the locked blueprint require a new shared component?
6. Is there proven cross-page repetition that justifies extraction?
```

Reuse first. Compose second. Create third.

Before creating any reusable component, read:

```text
src/docs/agent-prompts/component-reuse-registry.md
```

A new component or variant requires an explicit semantic reason, not superficial visual similarity.

---

## 5. Composition ownership

Respect component ownership boundaries.

Examples:

```text
Section
  owns vertical rhythm + semantic section surface

PageContainer / ReadingContainer
  own horizontal containment only

SectionHeading
  owns reusable section-heading identity

OpenSplitSection
  owns split composition + media frame only

HorizontalCarousel
  owns carousel mechanics only

FAQ
  owns FAQ rows only

FinalCTA
  owns the complete reviewed closing conversion pattern
```

Do not wrap a shared component in a page-local clone merely to restyle what the shared component already owns.

Do not force a low-level mechanical primitive to own page semantics.

Do not style slotted child-component DOM from an unrelated parent scoped stylesheet.

---

## 6. Service-page shared contracts

The service system defines these preferred shared contracts:

```text
ServiceHero
ServiceOverview
VehicleRecommendations
ServiceStandards
```

Use them according to the locked page blueprint.

If a shared service contract is documented but not implemented yet, implement it only when the current task needs it, using the documented contract and existing primitives/components. Keep its API small and reusable across the service pages named by the contract.

Do not replace these contracts with page-specific copies.

Do not generalize unrelated homepage patterns into service-page substitutes.

---

## 7. Global chrome and global shared components

Use reviewed production infrastructure instead of page-local rewrites:

```text
BaseLayout where compatible with the page's hero/chrome requirements
SiteHeader
SiteFooter
FinalCTA
FAQ
Section
PageContainer
ReadingContainer
SectionHeading
Link
Button / form controls
Breadcrumbs where blueprint/page hierarchy calls for them
```

A service-page task does not authorize redesigning global chrome.

If integration looks wrong, first diagnose:

```text
props/data wiring
slot/API mismatch
scoped-style ownership
stacking context
positioning
overflow
container ownership
surface inheritance
responsive parent constraints
duplicate/legacy import paths
```

Modify shared infrastructure only when the defect is proven to live there and cross-page impact has been reviewed.

---

## 8. Homepage-component boundary

Homepage components are not automatically service-page components.

Do not reuse homepage-specific identity merely because the visual ingredients look similar.

In particular:

- do not use Homepage `FleetShowcase` as `VehicleRecommendations`;
- do not use Homepage Trust identity as `ServiceStandards`;
- do not collapse `HomepageHero`, `ServiceHero`, and `FinalCTA` into a universal image/text panel;
- do not replace service discovery with Homepage-specific `ServiceShowcase` when the blueprint calls for `ServiceCard` or another service contract.

Reuse low-level mechanics/primitives where appropriate, not unrelated semantic identities.

---

## 9. Dedicated renderer rule

Private Chauffeur, Airport Transportation, and Business Transportation are locked to dedicated final renderers.

Do not leave them as generic prose-only `LeafPage` output.

`LeafPage` remains useful for generic non-home content routes, but these major service pages must render their blueprint-defined section architecture explicitly.

Do not mutate `LeafPage` into a configurable service-page mega-renderer.

---

## 10. Theme and visual rules

The active site theme is selected by:

```text
site/luksuzni-prevoz/foundation.config.ts
```

Consume semantic tokens. Do not hard-code the current theme version into generic UI logic.

Do not introduce:

```text
raw hex/rgb/hsl palette values
page-local spacing scales
page-local radii scales
page-local breakpoint systems
arbitrary Tailwind colors/radii/shadows
legacy Theme V1 values
legacy Fraunces typography
warm-charcoal/gold-first styling
metallic gradients
glow-heavy luxury effects
dashboard/SaaS card grids
```

Use hierarchy, typography, composition, contextual imagery, semantic surfaces, and controlled whitespace before decorative effects.

Dark-first does not mean dark-only. Functional/pricing/form sections may use approved light surfaces when the blueprint calls for them.

---

## 11. Typography

Use the active semantic typography roles.

Current production roles resolve to:

```text
Headings    → heading role
Body / UI   → body/UI role
BrandLockup → brand-only role
```

Do not hard-code font-family names in new components when semantic roles already exist.

Do not spread the BrandLockup font into page headings.

---

## 12. Data ownership

Never turn presentation components into business-data stores.

Use authoritative sources:

```text
services.ts   → service capabilities, relationships, pricing modes
operations.ts → operating standards
fleet.ts      → canonical vehicle facts
pricing.ts    → only pricing facts it explicitly represents
clients.ts    → client roster + display/permission policy
contact.ts    → verified contact channels and operational contact facts
routes.ts     → route keys / localized paths
content       → localized editorial copy, FAQs, page text
```

Rules:

- never infer missing prices;
- never infer currency;
- never invent operational promises;
- never duplicate fleet capacity/specifications inside components;
- never invent client logos or public usage permission;
- never hardcode phone/email/contact data into page components;
- preserve verification/placeholder gating when authoritative data is incomplete.

---

## 13. Routing and localization

All internal links use repository routing helpers and approved primitives.

Do not manually concatenate localized URLs.

Use `getPath()`, `<Link>`, route keys, and existing routing helpers.

Every user-visible string comes from approved content/UI localization sources.

Do not invent translations in structural components.

Responsive layouts and CSS must remain localization-safe and use logical properties where required by repository rules.

---

## 14. CTA hierarchy

Preserve semantic action hierarchy:

```text
Primary    → booking / main conversion
Secondary  → quote
Section    → contextual navigation/action
Contextual → related service
Tertiary   → verified contact channel
```

Do not make all actions visually equal.

Do not create page-local button/link variants merely to create novelty.

Use the reviewed `FinalCTA` unchanged visually; supply page-specific content/data through its public API.

Final CTA must remain a closing conversion region, not Hero #2.

---

## 15. Responsive behavior

Build mobile-first and verify each intentionally different state:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop sanity check
```

Do not treat tablet as a scaled desktop.

Check:

- composition transformation;
- image crop/focal point;
- reading order;
- long localized strings;
- CTA wrapping;
- control target size;
- overflow;
- contained section geometry;
- carousel behavior where present.

A blueprint may define a specific mobile/desktop transformation; follow it rather than inventing a generic stack.

---

## 16. Accessibility

WCAG 2.2 AA is the minimum.

Preserve:

- one page H1;
- logical heading hierarchy;
- semantic native HTML;
- 44×44 CSS px minimum interactive target where required by project rules;
- visible focus states;
- keyboard access;
- reduced-motion behavior;
- correct informative/decorative image alt decisions;
- accessible form labels/errors/states;
- no accidental horizontal page overflow.

Do not add ARIA when native semantics already solve the problem.

---

## 17. Tailwind / Astro implementation

Use Tailwind CSS v4 according to `.skills/tailwind-v4.md`.

Keep class strings statically detectable.

Prefer semantic tokens/utilities over arbitrary values.

Do not introduce Tailwind v3 configuration or directives.

Prefer static Astro output. Add client-side JS only when interaction genuinely requires it and follow the repository island-justification rule.

Do not install a dependency to avoid a small native implementation.

---

## 18. Page-specific composition rule

Not every blueprint section becomes a global component.

Keep a section page-local when:

- it appears only on that page;
- its semantic purpose is page-specific;
- its responsive behavior is page-specific;
- extraction would create abstraction without real reuse.

Page-local compositions still reuse:

```text
Section
containers
SectionHeading
Link/Button/form primitives
OpenSplitSection where appropriate
ServiceCard where appropriate
semantic tokens
verified data/content
```

Do not create components such as `AirportInclusionItem`, `ArrivalHandlingItem`, or `BusinessStandardItem` when an existing low-level structure can express the same anatomy.

---

## 19. New component acceptance test

Before adding any new reusable component, answer all of these:

```text
What semantic role does it own?
Which page/blueprint requires it now?
Why can no approved component/variant solve it?
Why is composition from existing primitives insufficient?
Which responsive behavior does it own?
Which accessibility behavior does it own?
What content/data does it deliberately NOT own?
Is the API small and semantic?
Is it genuinely reusable, or should it remain page-local?
```

If these answers are weak, do not create the component.

---

## 20. Required implementation workflow

For the assigned service page:

```text
1. Read authorities and target blueprint.
2. Run design:context.
3. Inspect target route/content/data and real shared APIs.
4. Build a blueprint compliance matrix.
5. Build a reuse plan using component-reuse-registry.md.
6. Identify missing shared service contracts required by this page.
7. Implement one bounded section/component at a time.
8. Render/review responsive states.
9. Correct one bounded batch of visual/technical defects.
10. Run design detector on changed target.
11. Run site Astro check/build and relevant validation.
12. Report exact reuse/new abstractions/deviations/gates.
```

Do not begin by copying wireframe CSS into production.

---

## 21. Verification

Before declaring the page complete, run the relevant repository gates. At minimum for production UI work:

```bash
pnpm design:detect <target>
pnpm check
```

For Luxury Transportation page work also run:

```bash
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Run additional route/content/SEO/theme validations when the task touches those domains.

Use `pnpm design:doctor --soft` for governance-sensitive work or when theme/context drift is suspected.

Never claim a command passed unless it actually ran successfully.

---

## 22. Completion report

Return a concise implementation report using this structure:

```text
PAGE / ROUTE:
AUTHORITIES APPLIED:
REUSED COMPONENTS:
NEW SHARED COMPONENTS:
PAGE-LOCAL COMPOSITIONS:
NEW VARIANTS:
DATA SOURCES USED:
FILES CHANGED:
CHECKS RUN:
BLUEPRINT DEVIATIONS:
PLACEHOLDERS / MISSING ASSETS:
UNRESOLVED ITEMS:
```

For every new shared component/variant, include one sentence explaining why existing components or composition were insufficient.

---

## 23. Doctrine

```text
Reuse before creation.
Composition before abstraction.
Semantic identity before visual similarity.
Verified data before visual completeness.
Blueprint before implementation precedent.
Refinement preserves; redesign replaces.
```
