# AGENTS.md

> **Purpose:** Single authoritative technical/foundation rulebook and universal agent entrypoint for this repository.
>
> `AGENTS.md` at repository root is the **only AGENTS authority**.  
> `DESIGN.md` is the mandatory visual/design authority.  
> `.skills/*.md` contains task-specific operating procedures.  
> Page blueprints define page-specific structure and may authorize explicit local exceptions.
>
> **Do not create or restore `docs/AGENTS.md`.**

---

# 1. Source-of-truth hierarchy

Use the smallest relevant authority chain. When sources disagree, the higher source wins.

## Technical / foundation

```text
1. root AGENTS.md
2. validated repository configuration and generated contracts
3. approved page blueprint for page-specific requirements
4. current verified shared component/API contracts
5. matching .skills procedure
6. existing implementation
```

`AGENTS.md` wins for:

- FND rules and non-waivable requirements;
- architecture and primitives;
- data/content boundaries;
- routing/i18n rules;
- generated-file ownership;
- quality gates and verification discipline;
- CSP/security requirements;
- waivers and traceability.

Traceability is documented in:

```text
docs/rule-traceability.md
```

and checked with:

```bash
pnpm traceability --check
```

## Visual / design

For any visible UI work, read:

```text
DESIGN.md
```

The visual hierarchy is:

```text
1. locked page blueprint
2. DESIGN.md
3. active theme version JSON tokens
4. approved shared component contracts
5. wireframe structural intent
6. matching .skills procedure
7. current verified production patterns
8. external references
```

A wireframe defines structure/geometry only. It never overrides active theme tokens, production typography, accessibility, routing, or component contracts.

## Skills

`.skills/*.md` explain **how to work**. They are procedural, not an independent source of product/theme truth.

If a skill conflicts with:

```text
AGENTS.md
DESIGN.md
locked page blueprint
active theme token JSON
validated repository configuration
```

the source-of-truth file wins and the stale skill should be corrected.

---

# 2. Repository and package manager

This is a pnpm workspace monorepo.

- Package manager: `pnpm@10.14.0`.
- Node: `>=20`.
- Current product site: `site/luksuzni-prevoz/`.
- Core library: `packages/astro-foundation/`.
- ESLint plugin: `packages/eslint-plugin-astro-foundation/`.
- Shared scripts: `scripts/`.
- Agent skills: `.skills/`.

**Use `pnpm` only. Never use `npm` or `yarn`.**

Astro remains static-first unless runtime rendering is explicitly required.

---

# 3. Always-on agent contract

- Do not weaken or bypass TypeScript, lint, accessibility, SEO, route, theme, localization, security, or quality rules.
- Do not manually edit generated files such as `src/theme/generated/theme.css` or generated `types.ts`.
- Do not manually concatenate localized internal URLs. Use `getPath()`, `<Link>`, and approved routing helpers.
- All user-visible strings come from approved localization/content sources. Do not invent translations during implementation.
- Do not hardcode pricing, fleet facts, contact details, locale paths, service relationships, or design-token values inside page components.
- Reuse foundation helpers before creating duplicate routing, SEO, schema, i18n, image, validation, or data logic.
- Prefer native semantic HTML before ARIA or unnecessary abstraction.
- Avoid unnecessary client-side JavaScript and dependencies. `client:*` requires the repository's required island justification/comment.
- Do not refactor unrelated stable code during scoped work.
- Every configured locale is required for every page unless the validated content model explicitly says otherwise.
- Do not silently reopen locked product/design decisions.
- Do not silently simplify required blueprint regions.
- Diagnose from source before patching screenshots or symptoms.
- Run the relevant quality/verification commands before reporting completion.
- Never claim a command/gate passed unless it actually ran successfully.

---

# 4. Core FND rules retained from the former docs/AGENTS.md

These rules remain authoritative after removal of `docs/AGENTS.md`.

## Code / architecture

- **FND-ARCH-03** — All user-visible strings must come from approved UI/content sources.
- **FND-UI-06** — Class passthrough on primitives is layout-only unless the primitive explicitly documents a broader contract.
- `Page` owns `<head>` and sets document `lang`/`dir`; no other component emits head tags.
- Generated artifacts are machine-owned and must be regenerated, not hand-edited.

## Routing / i18n

- **FND-I18N-03** — Internal URLs come from the route map / `getPath()`, never folder names or manual locale concatenation.
- **FND-I18N-04** — `trailingSlash` is always `"always"`; internal paths end with `/`.
- **FND-I18N-13** — Direction-sensitive CSS uses logical properties. Do not use physical left/right properties where logical equivalents exist.
- Language switching, hreflang, breadcrumbs, navigation, and localized links use approved routing helpers/data.
- No silent locale fallback for page content.

## Accessibility / responsive

- WCAG 2.2 AA is the minimum target.
- **FND-A11Y-05** — Interactive targets must meet the project minimum target size of 44×44 CSS px.
- **FND-RESP-03** — No accidental horizontal page overflow.
- Responsive review must cover mobile, tablet portrait, tablet landscape, desktop, and a wide-desktop sanity check.
- Prefer semantic HTML; use ARIA to add missing semantics, not to replace native semantics.
- Focus-visible states must be clearly perceivable.
- Reduced-motion behavior is required where motion exists.

## CSS / theme

- **FND-CSS-04** — Generated theme CSS uses `@layer theme`.
- Active theme source lives under the current site's `src/theme/versions/<activeThemeVersion>/`.
- `foundation.config.ts` selects the active theme version.
- `theme/generated/theme.css` is generated by `theme:sync` and must not be manually edited.
- Components consume semantic tokens/utilities; they do not copy raw palette/type/spacing values.
- Tailwind work follows `.skills/tailwind-v4.md`.

## Islands / client JS

- Prefer static Astro output.
- Use client-side JavaScript only when behavior genuinely requires it.
- Any `client:*` island must include the repository-required justification.
- Do not add dependencies merely to avoid a small amount of native HTML/CSS/JS.

---

# 5. Current Luxury Transportation data boundaries

For `site/luksuzni-prevoz/`:

```text
foundation.config.ts
  → site identity, locales, capabilities, active theme, performance budget

src/data/routes.ts
  → route map / localized paths

src/data/navigation.ts
  → navigation relationships

src/data/*
  → verified operational/business data such as service rules, contacts, fleet relationships

src/content/pages/*
  → localized page/editorial content

src/content/ui/*
  → localized UI strings

src/theme/versions/version-2/*
  → active raw design-token source

src/theme/generated/theme.css
  → generated CSS output; never edit directly
```

Presentation components must not become alternate data stores.

If a business fact is unverified, preserve the project's verification/placeholder gating. Do not invent it to make a UI look complete.

---

# 6. Active design/theme contract

The current product design direction is defined by:

```text
DESIGN.md
site/luksuzni-prevoz/src/theme/versions/version-2/
```

Theme V2 is the active Black & Platinum system.

Current type roles:

```text
Headings     → Inter Tight
Body / UI    → Manrope
BrandLockup  → Cormorant Garamond Italic
```

Do not reintroduce Fraunces, Instrument Serif, gold-first styling, or old warm-charcoal token values into production unless a future locked design decision explicitly changes the active theme.

Raw values belong in Theme V2 JSON, not in `AGENTS.md`, `DESIGN.md`, skills, or components.

---

# 7. Tailwind CSS v4 contract

The current site uses Tailwind CSS v4 with `@tailwindcss/vite`.

Canonical global entry:

```css
@import "tailwindcss";
@import "./fonts.css";
@import "../theme/generated/theme.css";
@import "@astro-foundation/core/theme/foundation.css";
```

Rules:

- Do not introduce `@tailwind base`, `@tailwind components`, or `@tailwind utilities`.
- Do not create a v3-style `tailwind.config.*` unless a deliberate compatibility/migration task requires it.
- Use CSS-first Tailwind v4 features (`@theme`, `@utility`, `@source`, `@reference`) according to `.skills/tailwind-v4.md`.
- Keep utility class names statically detectable; map runtime variants to complete class strings.
- Use `@source` only when automatic detection cannot see a legitimate source.
- Use `@reference` in scoped/component CSS only when access to Tailwind theme/utilities is actually needed.
- Prefer semantic project utilities/tokens over repeated arbitrary values.
- The active generated theme currently exposes project tokens as CSS custom properties under `@layer theme`; named project utilities such as `font-heading`, `font-body`, and `font-brand` are registered in the global CSS entry. Do not assume every `:root` token automatically creates a Tailwind utility.
- Astro scoped-style ownership must be understood before styling elements rendered inside child components. Parent scoped selectors are not a reliable way to style arbitrary child-component DOM.

---

# 8. Primitive/component contract

Shared infrastructure includes:

```text
Page
Container / PageContainer / ReadingContainer
Section / SectionHeading
Link
Button and form controls
BrandLockup
SiteHeader
LanguageSwitcher
Breadcrumbs
FAQ
TrustStrip
HorizontalCarousel
FinalCTA
SiteFooter
```

Once a shared component is reviewed and approved, page work reuses it.

When a reused component appears wrong in a page, investigate integration before redesign:

```text
prop/data wiring
slot/API mismatch
scoped-style ownership
stacking context / z-index
positioning
parent overflow
container ownership
surface inheritance
responsive parent constraints
duplicate/legacy import path
```

A page-specific task does not grant permission to redesign shared infrastructure unless root cause is proven to be inside the shared component.

---

# 9. Rejected implementation rule

A rejected implementation is not a design reference.

It may be inspected for:

- data integration;
- routing;
- useful prop contracts;
- proven technical behavior.

Do not inherit its:

- composition;
- spacing;
- typography;
- imagery treatment;
- CSS;
- CTA choices;
- component boundaries;

unless those are independently validated against current authority.

---

# 10. Skill registry

All skills live directly in `.skills/`.

## Architecture / framework

- `astro-architecture.md` — Astro architecture, component boundaries, islands, dependencies, data/content architecture.
- `tailwind-v4.md` — all Tailwind CSS work and v4 anti-regression rules.
- `multilingual-routing.md` — locale routing, slugs, hreflang, breadcrumbs, switching, parity.

## Design / UI

- `design-foundation-governance.md` — active theme governance and design-token discipline.
- `blueprint-to-ui.md` — mandatory for blueprint/wireframe implementation.
- `component-architecture.md` — components, variants, shared/page-local composition.
- `high-value-visual-execution.md` — hierarchy, restraint, whitespace, component identity.
- `typography-system.md` — Inter Tight / Manrope / brand typography and font QA.
- `imagery-art-direction.md` — image roles, crop, focal points, scrims.
- `functional-ui.md` — forms, booking, pricing/calculator states.
- `responsive-layout.md` — design-level responsive composition.
- `design-review.md` — independent visual review.

## Technical / quality

- `responsive-ui.md` — technical responsive correctness.
- `responsive-images-performance.md` — image delivery, LCP, CLS, performance.
- `accessibility-wcag.md` — WCAG 2.2 AA.
- `technical-seo.md` — metadata/indexability/internal-link technical behavior.
- `structured-data.md` — JSON-LD/schema.
- `technical-page-review.md` — final technical page gate.

`skills-manifest.json` is metadata only.

---

# 11. Required skill bundles

Load the smallest complete bundle.

## New/major page from blueprint + wireframe

Mandatory:

```text
AGENTS.md
DESIGN.md
page blueprint
page wireframe
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

Add imagery/performance skills for image-bearing pages, functional UI for forms/pricing/booking, and multilingual routing when routes/locales/links are touched.

## Small visual patch

```text
AGENTS.md
DESIGN.md
.skills/design-foundation-governance.md
.skills/tailwind-v4.md
```

plus only the specialist skill relevant to the patch.

## Page design review

```text
AGENTS.md
DESIGN.md
page blueprint
page wireframe
.skills/design-review.md
.skills/design-foundation-governance.md
.skills/typography-system.md
.skills/responsive-layout.md
```

## Technical page review

```text
AGENTS.md
.skills/technical-page-review.md
.skills/accessibility-wcag.md
.skills/technical-seo.md
.skills/structured-data.md
.skills/responsive-ui.md
.skills/responsive-images-performance.md
.skills/multilingual-routing.md
```

---

# 12. Blueprint implementation workflow

For a locked page:

```text
1. Read root AGENTS.md.
2. Read DESIGN.md.
3. Read the page blueprint.
4. Read the wireframe for structural intent.
5. Load only matching skills.
6. Inspect active theme JSON and verified shared components/data.
7. Build a blueprint compliance matrix.
8. Diagnose existing implementation before editing.
9. Implement one bounded section/component at a time.
10. Render/review mobile.
11. Review tablet portrait.
12. Review tablet landscape.
13. Review desktop.
14. Wide-desktop sanity check.
15. Independent design review.
16. Fix design blockers.
17. Technical page review.
18. Run required project checks/build.
19. Report exact files changed, commands run, and unresolved items.
```

Do not begin by copying wireframe CSS into production.

---

# 13. Wireframe rule

A wireframe may define:

- hierarchy;
- grouping;
- relative prominence;
- content relationship;
- approximate geometry;
- grid topology;
- image footprint;
- responsive stacking intent;
- presence/order of actions.

A wireframe does not define final:

- fonts;
- raw colors;
- production token values;
- helper labels;
- skeletons;
- dashed image outlines;
- exact spacing;
- shadows;
- borders;
- component implementation strategy.

For this repository, wireframes may use Tailwind CSS v4 utility syntax to make responsive geometry explicit, but production code must still map the structure to actual Astro components and active semantic tokens.

---

# 14. Quality and verification

## Foundation commands

Common root commands:

```bash
pnpm foundation:doctor
pnpm types:generate
pnpm theme:validate
pnpm theme:sync
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm lint
pnpm test:unit
```

Many scripts accept a project path and default to `site/luksuzni-prevoz`. You can also pass an explicit target:

```bash
pnpm foundation:doctor site/luksuzni-prevoz
pnpm theme:sync site/luksuzni-prevoz
pnpm theme:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
```

## Site-specific page verification

For current page work also run:

```bash
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

The root `quality:*` scripts are foundation-wide gates and some still target the reference implementation internally. Until those scripts are deliberately retargeted, do not imply that a root `quality:fast/page/release` result alone proves the Luxury Transportation site page passed its own Astro check/build.

## Existing root gates

```bash
pnpm quality:fast
pnpm quality:page
pnpm quality:release
```

Do not edit package scripts as part of unrelated page work.

---

# 15. Testing / platform expectations

Foundation/reference testing includes:

- Vitest unit tests;
- Playwright E2E where configured;
- accessibility tests;
- Lighthouse CI.

Reference responsive test widths include:

```text
320
768
1024
1440
1920
```

Design review is not limited to those exact widths; tablet portrait and tablet landscape are distinct acceptance states.

Do not ask isolated coding agents to install browsers/system packages unless the task explicitly provisions that capability. Use the available repository checks plus manual browser review when appropriate.

---

# 16. Lighthouse / security baseline

Existing Foundation Lighthouse thresholds:

```text
accessibility   ≥ 0.95
SEO             ≥ 0.95
best-practices  ≥ 0.90
performance     ≥ 0.90
```

Existing security/header baseline includes CSP and:

- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- HSTS where deployment supports it.

Do not weaken these to make a page or integration easier.

---

# 17. Scale envelope and exceptions

The current architecture is designed around:

```text
≤ 30 routes per locale
2–6 locales
~20–50 pages per locale
single static site
```

Out-of-scope architecture such as SSR/endpoints, CMS, authentication, site search, or large pagination requires an explicit architecture decision.

See:

```text
docs/scale-envelope.md
docs/exceptions.md
```

Any permitted deviation from an FND rule uses the documented waiver process. Non-waivable rules cannot be waived.

---

# 18. Change management

## Theme/token change

Update:

```text
site/luksuzni-prevoz/src/theme/versions/version-2/*.json
```

then regenerate:

```text
src/theme/generated/theme.css
```

Do not patch individual components to mimic a theme change.

## Global design-direction change

Update:

```text
DESIGN.md
```

and the active Theme V2 sources if raw tokens change.

## Page structure change

Update in this order:

```text
page blueprint
→ wireframe
→ implementation
```

## Agent procedure change

Update the relevant `.skills/*.md`.

A skill must not become a second storage location for current raw design values.

---

# 19. Completion discipline

Before reporting a task complete:

- identify the authority files and skills applied;
- list files changed;
- list tests/checks/gates actually run;
- report unresolved TODOs;
- report placeholders/missing assets;
- report any blueprint deviation;
- report any new component/variant and why it was necessary;
- distinguish automated verification from manual visual review.

Never hide known deviations behind “done”, “finished”, or “production-ready”.

# AGENTS.md additions

Add this as a concise section near the existing agent procedure / quality workflow. Do not duplicate the full skill contents in `AGENTS.md`.

## Deterministic design-governance workflow

For production UI work, agents MUST use the repository design-governance layer.

Before editing:

```bash
pnpm design:context <target>
```

If the context command reports a missing/stale machine-readable snapshot:

```bash
pnpm design:sync
```

Before declaring UI work complete:

```bash
pnpm design:detect <target>
pnpm check
```

Major page work also runs the page-specific and release gates already required elsewhere in this file.

`pnpm design:doctor` checks drift between the active theme, generated design snapshot, selectors, current design documentation, and global site integration. It is maintenance/verification, not permission to redesign.

### Workflow doctrine

**Refinement preserves. Redesign replaces.**

A cleanup, refactor, accessibility correction, responsive correction, token migration, performance fix, or bug fix MUST preserve approved component identity, factual copy, CTA roles, and locked blueprint structure unless the task explicitly authorizes a design-direction change.

### Design-governance authority

The governance scripts do not become a visual source of truth. Existing authority remains:

1. locked page blueprint;
2. `DESIGN.md`;
3. active theme + generated semantic tokens;
4. reviewed shared component contract;
5. wireframe geometry.

`AGENTS.md` remains the technical/procedural authority.

## Theme Ownership and Upgrade Protocol

### Single source of truth

Each site MUST select its active theme through its own `foundation.config.ts`.

For the Luxury Transportation site, the canonical selector is:

`site/luksuzni-prevoz/foundation.config.ts`

using:

`activeThemeVersion`

Shared foundation packages MAY contain theme implementations, schemas,
generators, validation logic, and reusable theme utilities.

Shared packages MUST NOT:

- choose the active theme for a product site;
- expose an `ACTIVE_THEME_VERSION` used as a site selector;
- silently fall back to `version-1`, `version-2`, or any other theme;
- override a site's `foundation.config.ts`.

If a site's configured theme cannot be resolved, theme generation MUST fail
with a clear error.

Missing or invalid theme configuration is never permission to use a fallback.

### Theme resolution invariant

For every production site, these layers MUST agree:

`foundation.config.ts`
→ configured `activeThemeVersion`
→ resolved theme implementation
→ generated theme output
→ `.design/system.json`

A mismatch between these layers is a governance failure.

For Luxury Transportation, the currently configured production theme is
resolved from the site's config. Agents MUST NOT hard-code the current version
into generic/shared tooling merely because it is the presently active theme.

### Theme upgrades

When creating or activating a new theme version, agents MUST follow this
sequence.

1. Create the new theme implementation using the repository's established
   versioned theme structure.

2. Preserve previous theme versions unless the task explicitly authorizes
   their removal.

3. Validate the new theme implementation before activation.

4. Change the target site's `foundation.config.ts`:
   `activeThemeVersion`.

5. Do NOT change shared foundation code merely to activate the theme.

6. Run the repository theme generation/synchronization command.

7. Run theme validation.

8. Regenerate the machine-readable design snapshot:

   `pnpm design:sync`

9. Run:

   `pnpm design:doctor`

10. Run:

    `pnpm design:detect`

11. Run:

    `pnpm check`

12. Verify that the configured version, generated theme output, and
    `.design/system.json` all report the same active version.

13. Search the repository for stale references to the previous theme in:
    - production UI;
    - generated configuration;
    - governance files;
    - dev previews;
    - documentation;
    - comments;
    - test fixtures.

14. Classify every remaining previous-theme reference before removing it.
    Historical theme implementations, archived documentation, and another
    site's legitimate theme selection are not automatically stale.

### Theme-independent documentation

Blueprints, wireframes, and shared component contracts MUST describe styling
through semantic design roles/tokens rather than literal theme values whenever
the theme system already owns those values.

Prefer concepts such as:

- `background`
- `surface`
- `surfaceElevated`
- `surfaceLight`
- `text`
- `textSecondary`
- `textMuted`
- `border`
- `borderStrong`
- `accent`
- semantic spacing roles
- semantic radius roles
- semantic container roles

Blueprints MUST NOT lock a production design to:

- hex colors;
- RGB/HSL literals;
- theme-version-specific color names;
- raw radius values;
- raw spacing values;
- raw breakpoint values;

unless the value is genuinely structural and is not represented by the design
system.

A normal palette/theme upgrade SHOULD therefore require no blueprint or
wireframe rewrite.

### No fallback rule

Agents MUST NOT introduce code equivalent to:

- "if configured theme cannot be found, use version-1";
- "if activeThemeVersion is absent, use the package default";
- "use the first available theme";
- "use the latest theme automatically".

Theme selection is explicit configuration.

Failure to resolve explicit configuration MUST stop the relevant generation or
validation command.

### Shared foundation rule

`packages/astro-foundation` is infrastructure, not product configuration.

It owns reusable mechanisms.

The target site's `foundation.config.ts` owns product-level theme selection.

Do not move product-specific active-theme decisions into shared foundation code.

### Theme-related task completion gate

An agent modifying any of the following:

- theme versions;
- theme manifests;
- theme generation;
- theme validation;
- `foundation.config.ts`;
- generated theme outputs;
- design token generation;
- `.design/system.json`;
- theme governance logic;

MUST NOT declare the task complete until the applicable checks have passed:

```bash
pnpm theme:sync
pnpm theme:validate
pnpm design:sync
pnpm design:doctor
pnpm design:detect
pnpm check

## Universal UI completion protocol

Harness-specific hooks provide immediate feedback but are not required
for correctness.

Any agent modifying production UI MUST:

1. Run `pnpm design:context <target>` before implementation.
2. Follow the authorities returned by that command.
3. Run `pnpm design:detect <target>` after implementation.
4. Run `pnpm check`.
5. Report any unresolved governance failure explicitly.

An agent MUST NOT declare production UI work complete while a P0/P1
design-governance finding remains unresolved unless the task explicitly
documents an approved exception.
