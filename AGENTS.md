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

Many scripts accept a project path. For the current Luxury Transportation site, prefer an explicit target where the script otherwise defaults to the reference site, for example:

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
