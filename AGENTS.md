# AGENTS.md

> **Purpose:** Universal agent entrypoint for this repository.
>
> `docs/AGENTS.md` is the authoritative technical/foundation rulebook.  
> `DESIGN.md` is the mandatory visual/design entrypoint.  
> `.skills/*.md` contains task-specific operating procedures.  
>
> Skills explain **how to work**. They do not override locked project sources of truth.

---

## 1. Source-of-truth hierarchy

### Global technical authority

`docs/AGENTS.md` wins for:

- `FND-*` rules;
- architecture;
- primitives;
- configuration variants;
- quality gates;
- Lighthouse thresholds;
- CSP;
- waivers;
- traceability;
- non-waivable requirements.

Traceability is enforced through:

```text
docs/rule-traceability.md
```

and:

```bash
pnpm traceability --check
```

### Visual/design authority

For any visual, page, component, layout, typography, imagery, responsive, or interaction-design task, read:

```text
DESIGN.md
```

`DESIGN.md` is the design entrypoint. It points to the actual locked foundation files and defines how agents must interpret them.

### Page-level authority

When implementing a page with an approved blueprint/wireframe:

```text
locked page blueprint
    ↓
approved component rules / locked design decisions
    ↓
design-system and token sources
    ↓
wireframe structural intent
    ↓
existing approved implementation patterns
```

A blueprint may explicitly authorize a page-specific exception to a generic component/layout rule.

A wireframe **never** overrides production typography, colors, tokens, motion, radius, or visual-system rules.

### Skill authority

`.skills/*.md` files are procedures and review protocols.

If a skill conflicts with:

```text
docs/AGENTS.md
locked page blueprint
locked design decision
validated design token source
```

the source-of-truth file wins.

---

## 2. Always-on contract

- **Use `pnpm` only.** Never use `npm` or `yarn`.
- Repository package manager: `pnpm@10.14.0`.
- Astro remains static-first unless runtime rendering is explicitly required (`output: "static"`).
- Never weaken or bypass TypeScript, lint, accessibility, SEO, route, theme, localization, or quality rules.
- Never manually edit generated files such as `theme/generated/theme.css` or generated `types.ts`.
- Never manually concatenate localized internal URLs. Use `getPath()` / `<Link>` and approved routing helpers.
- All user-visible UI strings come from the approved localization/content sources. Do not invent translations during implementation.
- Reuse foundation helpers before creating duplicate routing, SEO, schema, i18n, image, validation, or data logic.
- Prefer native semantic HTML before ARIA or unnecessary abstraction.
- Avoid unnecessary client-side JavaScript and dependencies. `client:*` requires the repository's required `// island:` justification/comment.
- Do not refactor unrelated stable code during scoped work.
- Every configured locale is required for every page. No silent fallback or optional locale page.
- Do not hardcode pricing, fleet facts, contact details, locale paths, service relationships, or design tokens inside page components.
- Do not silently reopen locked product/design decisions.
- Do not silently simplify required blueprint regions to make implementation easier.
- Run the relevant quality gate before declaring work complete.

---

## 3. Design work is a special case

For **any** task that affects visible UI, first read:

```text
DESIGN.md
.skills/design-foundation-governance.md
```

Then load only the additional matching skills required by the task.

Do not treat an existing implementation as authoritative merely because it already exists.

If an implementation has been marked rejected or failed review:

- do not use its markup/CSS as a design reference;
- preserve only proven integration/data behavior;
- rebuild from locked sources where necessary.

---

## 4. Universal skills directory

All agent skills live directly in:

```text
.skills/
```

Skills are Markdown files.

Do not assume agent-specific folders such as:

```text
.claude/skills/
.cursor/skills/
.codex/skills/
```

The repository uses `.skills/` as the universal skill source.

---

# 5. Skill registry

## Architecture / framework

### `.skills/astro-architecture.md`

Read for:

- Astro architecture;
- component boundaries;
- types;
- islands/client JS;
- dependencies;
- repository refactors;
- data/content architecture.

### `.skills/tailwind-v4.md`

Read for:

- all Tailwind CSS work;
- Tailwind v4 architecture;
- CSS-first configuration;
- `@theme`;
- `@utility`;
- `@source`;
- `@reference`;
- static class detection;
- prevention of Tailwind v3 regressions.

> Current repository filename is `tailwind-v4.md`. If renamed, prefer the correctly spelled `tailwind-v4.md` and update this file at the same time.

### `.skills/multilingual-routing.md`

Read for:

- locale routing;
- localized slugs;
- `getPath()` / `<Link>`;
- hreflang;
- breadcrumbs;
- language switching;
- UI/content parity;
- Serbian/English/Russian routing behavior.

---

# 6. Design / UI skills

## `.skills/design-foundation-governance.md`

Read for every visual task.

Covers:

- locked palette/surface hierarchy;
- design tokens;
- radius;
- spacing;
- grid/container rules;
- motion philosophy;
- gold scarcity;
- card philosophy;
- design anti-patterns;
- global design constraints.

---

## `.skills/blueprint-to-ui.md`

Mandatory when implementing from a page blueprint or wireframe.

Covers:

- blueprint compliance matrix;
- MUST / SHOULD / MAY interpretation;
- wireframe decontamination;
- geometry vs visual styling;
- placeholder boundaries;
- required-region preservation;
- CTA intent locking;
- immutable product strings;
- locale integrity;
- missing assets;
- prevention of silent structural omissions.

---

## `.skills/component-architecture.md`

Read when:

- creating a component;
- creating a variant;
- extracting shared UI;
- refactoring components;
- deciding global vs page-local composition.

Covers:

- reuse-first decisions;
- component identity;
- minimal APIs;
- page-local composition;
- avoidance of mega-components;
- avoidance of one-off component proliferation;
- shared primitives;
- carousel/form/control ownership.

---

## `.skills/high-value-visual-execution.md`

Read for visual implementation and refinement.

Covers:

- visual hierarchy;
- restraint;
- whitespace discipline;
- content-density proportionality;
- component identity;
- avoiding cardification;
- avoiding generic AI visual patterns;
- distinguishing Hero / feature section / Final CTA;
- premium visual rhythm.

---

## `.skills/typography-system.md`

Read for any text-bearing visual implementation or typography review.

Covers:

- Fraunces / Manrope usage;
- semantic type scale;
- font loading;
- computed-font verification;
- heading hierarchy;
- line-height;
- tracking;
- measure;
- localization expansion;
- prevention of fallback-font acceptance.

---

## `.skills/imagery-art-direction.md`

Read for any image-bearing UI.

Covers:

- cinematic hero imagery;
- contextual split imagery;
- full-card service photography;
- transparent vehicle PNGs;
- Final CTA vehicle treatment;
- focal points;
- responsive crop;
- object-fit;
- scrims;
- missing-asset policy;
- image-role fidelity.

---

## `.skills/functional-ui.md`

Read for:

- forms;
- booking;
- calculator;
- pricing interactions;
- segmented controls;
- validation;
- stateful service UI.

Covers:

- Fixed / Estimated / Quote states;
- Pending confirmation;
- progressive disclosure;
- field architecture;
- form/control consistency;
- prevention of SaaS/dashboard visual drift.

---

## `.skills/responsive-layout.md`

Read for **design-level responsive composition**.

Covers:

- mobile-first layout;
- tablet portrait;
- tablet landscape;
- desktop;
- wide desktop;
- 4/8/12 grid;
- split activation;
- container-query decisions;
- content order;
- layout topology;
- localization expansion.

---

## `.skills/design-review.md`

Mandatory independent visual review after significant page implementation.

Covers:

- blueprint completeness;
- visual-system compliance;
- CTA correctness;
- component identity;
- computed-font inspection;
- geometry/proportions;
- surface rhythm;
- cardification;
- responsive screenshots;
- imagery/crop;
- severity-ranked findings.

The design reviewer must **not redesign a locked page merely because another design is possible**.

---

# 7. Technical / quality skills

## `.skills/responsive-ui.md`

Read for **technical responsive correctness**.

This is distinct from `responsive-layout.md`.

Use it for:

- overflow;
- logical properties;
- viewport behavior;
- touch target sizing;
- technical breakpoint correctness;
- responsive interaction behavior.

### Division of responsibility

```text
responsive-layout.md
= visual composition and layout reasoning

responsive-ui.md
= technical responsive correctness
```

Use both for full page implementations.

---

## `.skills/responsive-images-performance.md`

Read for:

- responsive image delivery;
- Astro image pipeline;
- `srcset` / `sizes`;
- image dimensions;
- LCP image behavior;
- font performance;
- CLS;
- INP/LCP-related frontend performance;
- client-side JS budget.

This skill governs **delivery/performance**, while `imagery-art-direction.md` governs **visual role/crop/art direction**.

Use both for production imagery.

---

## `.skills/accessibility-wcag.md`

Read for:

- WCAG 2.2 AA;
- semantics;
- keyboard;
- focus-visible;
- contrast;
- forms;
- dialogs;
- motion;
- target sizes;
- language / `dir`;
- accessible interaction behavior.

Accessibility is non-waivable where foundation rules say so.

---

## `.skills/technical-seo.md`

Read for:

- indexability;
- metadata;
- canonical;
- hreflang;
- sitemap;
- robots;
- internal-link technical behavior;
- Core Web Vitals SEO requirements.

---

## `.skills/structured-data.md`

Read for:

- JSON-LD;
- schema generation;
- schema eligibility;
- validation;
- page-specific structured-data review.

---

## `.skills/technical-page-review.md`

Mandatory final technical gate for a completed page.

Covers:

- semantics;
- technical SEO;
- accessibility;
- route integrity;
- structured data;
- responsive technical checks;
- performance fundamentals;
- page-level quality gates.

`design-review.md` and `technical-page-review.md` are separate gates.

Passing one does not imply passing the other.

---

# 8. Non-skill metadata

## `.skills/skills-manifest.json`

This is metadata, not an instructional skill.

Use it to:

- enumerate skills;
- support tooling;
- describe skill categories;
- help automation select matching skills.

Do not treat it as a replacement for the Markdown skill itself.

---

# 9. Required skill bundles

Do not load every skill for every task.

Use the smallest complete bundle.

## A. Implement a new page from blueprint + wireframe

Mandatory:

```text
DESIGN.md
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Add:

```text
.skills/imagery-art-direction.md
.skills/responsive-images-performance.md
```

when the page contains imagery.

Add:

```text
.skills/functional-ui.md
```

when the page contains forms, pricing, booking, calculators, filters, or state-heavy UI.

Also load:

```text
.skills/multilingual-routing.md
```

when route/locale content or links are touched.

---

## B. Implement a reusable visual component

Read:

```text
DESIGN.md
.skills/design-foundation-governance.md
.skills/component-architecture.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Add typography/image/functional skills as required by the component.

---

## C. Small visual patch

Read:

```text
DESIGN.md
.skills/design-foundation-governance.md
.skills/tailwind-v4.md
```

plus only the specialist skill relevant to the patch.

Do not load the full page-implementation bundle unless required.

---

## D. Pricing / booking / calculator work

Read:

```text
.skills/astro-architecture.md
.skills/functional-ui.md
.skills/component-architecture.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/accessibility-wcag.md
.skills/tailwind-v4.md
```

Also inspect validated pricing/service data sources.

Never hardcode pricing into visual components.

---

## E. Image-heavy section

Read:

```text
.skills/imagery-art-direction.md
.skills/responsive-images-performance.md
.skills/responsive-layout.md
.skills/design-foundation-governance.md
```

These responsibilities are separate:

```text
art direction
≠
image delivery/performance
```

---

## F. Page design review

Read:

```text
DESIGN.md
.skills/design-review.md
.skills/design-foundation-governance.md
.skills/typography-system.md
.skills/responsive-layout.md
```

Also read:

```text
current page blueprint
current wireframe
```

Review rendered screenshots/browser output.

Do not perform the technical page review implicitly.

---

## G. Technical page review

Read:

```text
.skills/technical-page-review.md
.skills/accessibility-wcag.md
.skills/technical-seo.md
.skills/structured-data.md
.skills/responsive-ui.md
.skills/responsive-images-performance.md
.skills/multilingual-routing.md
```

---

# 10. Blueprint implementation workflow

For a locked blueprint/wireframe page, use this order:

```text
1. Read docs/AGENTS.md
2. Read DESIGN.md
3. Read page blueprint
4. Read wireframe
5. Load matching skills
6. Inspect existing approved primitives/components
7. Build blueprint compliance matrix
8. Implement one component/section at a time
9. Render in browser
10. Review mobile
11. Review tablet portrait
12. Review tablet landscape
13. Review desktop
14. Run independent design review
15. Fix design-review blockers
16. Run technical page review
17. Run required quality gate
```

Do not begin by copying wireframe HTML/CSS.

---

# 11. Wireframe rule

A grayscale HTML wireframe defines:

- hierarchy;
- grouping;
- content relationship;
- approximate geometry;
- layout topology;
- image footprint;
- responsive intent.

It does **not** define production:

- fonts;
- colors;
- helper labels;
- borders;
- shadows;
- skeleton blocks;
- dashed outlines;
- exact placeholder widths;
- visible cards;
- image boundaries;
- final spacing values.

Production styling is reconstructed from the design foundation.

---

# 12. Rejected implementation rule

If a page/component has been explicitly marked rejected:

```text
REJECTED IMPLEMENTATION
≠
DESIGN REFERENCE
```

It may be inspected only for:

- existing integration;
- data wiring;
- prop contracts worth preserving;
- technical behavior proven correct.

Do not inherit:

- visual composition;
- spacing;
- typography;
- image treatment;
- CSS;
- CTA choices;
- component boundaries;

unless separately validated against locked sources.

---

# 13. Global component rule

Once approved, global components should be treated as stable infrastructure:

```text
Header
Footer
Button
Breadcrumbs
FAQ
FinalCTA
shared layout primitives
shared carousel mechanics
shared form controls
```

A page agent should reuse them.

Do not redesign global components inside a page task.

---

# 14. Page completion requires separate reviews

A page is not complete after it builds.

Required conceptual gates:

```text
IMPLEMENTATION
    ↓
DESIGN REVIEW
    ↓
TECHNICAL PAGE REVIEW
    ↓
CONTENT/SEO REVIEW when content work is in scope
    ↓
QUALITY GATE
```

Design and technical review are independent.

---

# 15. Quality gates

During development:

```bash
pnpm quality:fast
```

Includes repository-configured fast checks such as:

- doctor;
- types;
- theme sync/validation;
- routes;
- content;
- SEO;
- lint;
- unit tests.

Before declaring any page task complete:

```bash
pnpm quality:page
```

Includes:

```text
quality:fast
+
build
+
generated-artifact drift checks
```

Before deploy or foundation/core changes:

```bash
pnpm quality:release
```

Includes repository-configured release checks such as:

- page quality;
- traceability;
- waivers;
- secret scan;
- dependency audit;
- e2e;
- accessibility;
- Lighthouse.

Do not claim a gate passed unless it was actually run.

---

# 16. Scale envelope

Do not silently exceed:

```text
≤ 30 routes per locale
2–6 locales
~20–50 pages per locale
single static site
```

Out of scope by design unless architecture is explicitly revisited:

- pagination;
- SSR/endpoints;
- CMS;
- authentication;
- site search.

See:

```text
docs/scale-envelope.md
```

If the project begins requiring several of these, escalate instead of bending validators.

---

# 17. Exceptions

Any deviation from an `FND-*` rule requires the documented waiver process in:

```text
docs/exceptions.md
```

Non-waivable rules cannot be waived.

Do not create informal exceptions inside components.

---

# 18. Completion discipline

Before reporting completion:

- identify which skills were applied;
- list files changed;
- list tests/gates actually run;
- report unresolved TODOs;
- report placeholders/missing assets;
- report any blueprint deviation;
- report any new component/variant and its justification.

Never hide known deviations behind wording such as:

```text
done
finished
production-ready
```

when required review or verification has not occurred.
