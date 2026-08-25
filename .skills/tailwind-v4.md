---
name: tailwind-v4
description: >
  Mandatory Tailwind CSS v4 implementation and review rules. Use for every task that
  creates, edits, reviews, migrates, debugs, or reasons about Tailwind CSS, CSS,
  responsive layout, component styling, design tokens, Astro styling, UI states,
  accessibility styling, or frontend visual implementation in this Tailwind v4 project.
---

# Tailwind CSS v4 — Nuclear-Grade Agent Skill

## 0. Mission

You are working inside a **Tailwind CSS v4 project**.

Current Luxury Transportation packages are pinned to Tailwind CSS `4.3.3` and `@tailwindcss/vite` `4.3.3`. Verify `package.json`/lockfile before assuming those exact versions in a future task.

Tailwind v4 is a hard architectural constraint.

Do not treat Tailwind v4 as "mostly compatible with Tailwind v3."

Do not generate Tailwind configuration, syntax, utilities, plugins, examples, or architectural patterns from memory without first inspecting the repository.

Your responsibilities are:

1. preserve native Tailwind v4 architecture;
2. prevent Tailwind v3 patterns from entering the repository;
3. use the project's existing design tokens;
4. preserve visual consistency;
5. write statically detectable Tailwind classes;
6. implement mobile-first responsive behavior;
7. preserve accessibility;
8. minimize custom CSS;
9. minimize arbitrary values;
10. prevent design-token drift;
11. avoid unnecessary dependencies;
12. verify the final implementation;
13. report uncertainty instead of silently inventing framework behavior.

A task is not complete because the markup looks plausible.

A task is complete only when the implementation is valid for the installed Tailwind version, follows the repository's design system, builds successfully, and has been visually/reasonably verified.

---

# 1. Authority hierarchy

When instructions conflict, use this order:

1. root `AGENTS.md`;
2. installed package versions in `package.json` / lockfile;
3. `DESIGN.md` + active Theme V2 JSON for visual/token intent;
4. the project's actual Tailwind/Vite/global-CSS architecture;
5. locked page blueprint for page-specific structure;
6. current official Tailwind CSS v4 documentation;
7. this skill;
8. verified local component patterns;
9. model memory.

This skill is procedural and cannot override repository authority.

**Model memory is the lowest authority.**

Do not replace a verified project pattern merely because another Tailwind v4 pattern is also valid.

---

# 2. Mandatory preflight

Before making meaningful styling changes, inspect the project.

At minimum inspect:

```text
package.json
astro.config.* or framework config
src/styles/*
existing global stylesheet
relevant layout
relevant component(s)
design-system documentation if present
agent/project instructions if present
```

Determine:

```text
TAILWIND_VERSION
BUILD_INTEGRATION
GLOBAL_STYLESHEET
TOKEN_SOURCE
BREAKPOINT_STRATEGY
COMPONENT_STYLE_PATTERN
PLUGIN_USAGE
CLASS_MERGING_HELPERS
FORMATTER/LINTER
```

For this repository, verify the actual production chain:

```text
Astro
  ↓
Vite
  ↓
@tailwindcss/vite
  ↓
site/luksuzni-prevoz/src/styles/global.css
  ↓
@import "tailwindcss"
@import fonts
@import generated Theme V2 CSS
@import unlayered Foundation safeguards
```

The current Theme V2 generator emits semantic CSS custom properties under `@layer theme`; it does **not** place all project tokens inside Tailwind `@theme`.

Named project font utilities are registered with `@utility`.

Do not assume every project CSS variable automatically produces a Tailwind utility.

Discover and preserve the actual architecture.

---

# 3. Hard stop conditions

Stop and investigate before editing if any of the following are true:

* installed Tailwind version cannot be determined;
* both Tailwind v3 and v4 dependencies appear present;
* both `@astrojs/tailwind` and `@tailwindcss/vite` appear active;
* the project contains an unexplained `tailwind.config.*`;
* global CSS architecture is unclear;
* multiple conflicting token definitions exist;
* the task would require changing Tailwind architecture;
* the requested implementation appears to depend on a v3-only plugin;
* dependency changes are required but were not requested;
* the implementation would require guessing an undocumented class.

Do not "fix" these situations opportunistically.

Report them or preserve the current architecture unless the task explicitly includes migration.

---

# 4. Tailwind v4 architectural baseline

Tailwind v4 uses the CSS import entry:

```css
@import "tailwindcss";
```

Tailwind v4 supports CSS-first configuration through directives such as:

```css
@theme { ... }
@utility ...
@source ...
@reference ...
@custom-variant ...
```

However, **framework capability is not permission to rewrite this repository's theme architecture**.

Current project contract:

```text
Theme V2 JSON
  ↓
repository theme:sync generator
  ↓
generated theme.css
  ↓
@layer theme { :root { semantic CSS variables } }
  ↓
global.css
  ↓
registered project utilities + Tailwind utilities
```

Therefore:

- do not copy Theme V2 JSON into a new `@theme` block;
- do not manually edit generated `theme.css`;
- do not create duplicate design-token namespaces;
- do not assume a `:root` token creates utilities like `font-heading` automatically;
- use existing registered project utilities where available;
- use CSS variables directly when a semantic token intentionally has no Tailwind utility;
- introduce `@theme` only for a deliberate Tailwind-native token/utility requirement that does not duplicate the generator and is approved by repository authority.

Portable Tailwind v4 example:

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.7 0.1 250);
  --font-display: "Example Sans", sans-serif;
}
```

This example demonstrates Tailwind v4 syntax only; it is **not** the Luxury Transportation token source.

Always inspect the current project's theme before using token names.

---

# 5. FORBIDDEN: Tailwind v3 architecture

Do not introduce:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Do not create any of these unless the task explicitly requires legacy compatibility:

```text
tailwind.config.js
tailwind.config.ts
tailwind.config.mjs
tailwind.config.cjs
```

Do not introduce traditional v3 configuration like:

```js
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Do not add:

```text
@astrojs/tailwind
```

to a native Astro + Tailwind v4 project.

Do not downgrade:

```text
tailwindcss
@tailwindcss/vite
@tailwindcss/postcss
```

without explicit instruction.

Do not run:

```bash
npx tailwindcss init
```

as a reflexive setup step.

---

# 6. Legacy compatibility policy

Tailwind v4 contains compatibility mechanisms.

Their existence does **not** make them preferred architecture.

Examples include:

```css
@config
@plugin
```

Rules:

* preserve existing compatibility configuration when required;
* do not introduce it merely because an old tutorial uses it;
* do not migrate a native v4 project back toward JavaScript configuration;
* do not remove compatibility configuration unless the task explicitly includes migration;
* document why compatibility behavior is necessary if you introduce it.

Default preference:

```text
native v4 CSS-first configuration
```

---

# 7. Tailwind v4 directives

Understand the purpose of the major v4 directives.

## `@import`

Used to load Tailwind:

```css
@import "tailwindcss";
```

---

## `@theme`

Use for project design tokens that should participate in Tailwind's utility API.

Example:

```css
@theme {
  --color-brand: #1a4c7c;
}
```

Use:

```html
<div class="bg-brand text-white">
```

Prefer native CSS theme variables over the legacy `theme()` function in custom CSS; current Tailwind v4 documentation treats `theme()` as deprecated.

For this repository specifically, do not migrate generated Theme V2 `:root` tokens into `@theme` merely to generate utilities. Preserve the generator architecture and register only the utilities actually required.

---

## `@source`

Tailwind v4 uses automatic source detection.

Use `@source` only when legitimate classes live in sources automatic detection will not scan, such as an ignored/external library.

```css
@source "../node_modules/example-library";
```

For monorepo/base-path cases, inspect whether the Tailwind import should use `source(...)` rather than registering broad directories blindly.

If a stylesheet deliberately disables automatic detection with `source(none)`, every required source must be registered explicitly.

For the rare case where a static utility must be generated even though it does not appear in source, Tailwind v4 uses `@source inline(...)` rather than a v3 `safelist` config.

Do **not** create a v3 `content: []` array or `safelist` option.

---

## `@utility`

Use to register a true reusable utility.

Example:

```css
@utility content-auto {
  content-visibility: auto;
}
```

Custom utilities must represent reusable behavior.

Do not create a custom utility merely to hide an arbitrary component-specific design.

---

## `@variant`

Use when applying Tailwind variants inside CSS is genuinely appropriate.

---

## `@custom-variant`

Use when the project requires a reusable custom variant.

Example pattern:

```css
@custom-variant theme-example (&:where([data-theme="example"] *));
```

Do not create custom variants unless there is a clear reusable requirement.

---

## `@reference`

Use where a separately processed style context needs access to the project's Tailwind theme, utilities, or variants without duplicating CSS.

Typical situations include component-scoped CSS or CSS modules.

Example:

```css
@reference "../styles/global.css";
```

Do not blindly add `@reference` to every component.

---

## `@apply`

Supported, but use conservatively.

Preferred order:

```text
1. utilities in markup
2. existing component abstraction
3. project token
4. @utility where truly reusable
5. custom CSS
6. @apply only when it provides genuine value
```

Do not use `@apply` merely to recreate a semantic class system like Bootstrap.

Bad:

```css
.button {
  @apply px-6 py-3 rounded-lg bg-blue-500 text-white;
}
```

when the project already has an appropriate component abstraction.

---

# 8. `@theme` versus `:root`

Use `@theme` when the value should create or influence Tailwind utilities.

Example:

```css
@theme {
  --color-primary: #1a4c7c;
}
```

Use regular CSS custom properties when the variable is runtime/component behavior and should **not** create a Tailwind utility.

Example:

```css
:root {
  --header-current-height: 5rem;
}
```

Do not dump every CSS variable into `@theme`.

Do not place every design token in `:root`.

Ask:

> Should Tailwind expose this as part of the project's utility API?

If yes:

```text
@theme
```

If no:

```text
normal CSS variable
```

---

# 9. Theme token governance

## Core principle

Reusable design decisions belong to the design system.

Do not repeatedly encode them as arbitrary values.

Bad:

```html
<div class="bg-[#1A4C7C]">
```

when the same value represents the primary brand color.

Good:

```html
<div class="bg-primary">
```

---

## Before creating a token

Search the existing theme.

Never introduce:

```text
primary-blue
brand-blue
main-blue
blue-brand
corporate-blue
```

when:

```text
primary
```

already represents the same concept.

---

## Semantic tokens preferred

For branded/product work, prefer semantic concepts:

```text
primary
primary-hover
surface
surface-muted
text
text-secondary
text-muted
border
border-strong
success
warning
error
accent
```

over arbitrary palette proliferation.

Prefer:

```html
text-text-muted
```

over:

```html
text-gray-500
```

when the project intentionally defines semantic typography colors.

---

# 10. Token creation threshold

Create a project token when a value is:

* reused;
* part of visual identity;
* part of typography;
* part of spacing rhythm;
* part of layout behavior;
* part of radius strategy;
* part of elevation strategy;
* a semantic color;
* a breakpoint;
* a recurring animation/easing value.

Do not create a global token for a one-off visual correction.

---

# 11. Arbitrary value policy

Arbitrary values are valid Tailwind.

They are not forbidden.

They must be justified.

Good one-off examples:

```text
top-[117px]
grid-cols-[1fr_auto]
w-[min(100%,72rem)]
bg-[position:65%_center]
```

Suspicious examples:

```text
mt-[37px]
mb-[53px]
px-[21px]
rounded-[13px]
text-[17px]
max-w-[977px]
```

when the project already has a spacing/type/layout system.

Before using an arbitrary value, ask:

1. does an existing utility solve this?
2. does a project token solve this?
3. should a token be created?
4. is this genuinely a one-off geometry requirement?

Avoid "pixel archaeology" where the agent adds random values until a screenshot looks roughly correct.

---

# 12. Do not generate dynamic Tailwind class fragments

Tailwind scans source code as text.

Never rely on runtime construction such as:

```astro
<div class={`bg-${color}-500`}>
```

or:

```tsx
<div className={`text-${variant}`}>
```

or:

```js
const klass = `grid-cols-${columns}`;
```

These classes may not be statically discoverable.

Use complete class strings.

Good:

```ts
const variants = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-text",
  ghost: "bg-transparent text-primary",
} as const;
```

Then:

```astro
<button class={variants[variant]}>
```

---

# 13. Dynamic variants must map to static strings

For component props:

Bad:

```ts
const padding = `px-${size}`;
```

Good:

```ts
const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
} as const;
```

Likewise for:

```text
colors
columns
gaps
alignment
visibility
radius
text size
component variants
```

Static maps are preferred.

---

# 14. Do not safelist around bad architecture

If Tailwind cannot detect a class because the application constructs it dynamically, first fix the architecture by mapping variants to complete static class strings.

Do not immediately force-generate a large class set.

If a legitimate static safelist is truly required, use Tailwind v4 `@source inline(...)` narrowly and document why.

Do not fall back to v3-style `safelist`/`content` configuration.

---

# 15. Source detection

Tailwind v4 uses automatic source detection.

Do not add:

```js
content: [
  "./src/**/*.{html,js,ts,jsx,tsx,astro}"
]
```

for normal v4 usage.

If classes live somewhere Tailwind does not detect, use the appropriate v4 source mechanism.

Example:

```css
@source "../some-external-library";
```

Do not register generated build output or irrelevant directories.

---

# 16. Removed v3 utilities

Never introduce deprecated v3 utilities.

Use these replacements:

| Forbidden / old         | Tailwind v4 approach                       |
| ----------------------- | ------------------------------------------ |
| `bg-opacity-*`          | color opacity modifier, e.g. `bg-black/50` |
| `text-opacity-*`        | `text-black/50`                            |
| `border-opacity-*`      | `border-black/50`                          |
| `divide-opacity-*`      | `divide-black/50`                          |
| `ring-opacity-*`        | `ring-black/50`                            |
| `placeholder-opacity-*` | color opacity modifier                     |
| `flex-shrink-*`         | `shrink-*`                                 |
| `flex-grow-*`           | `grow-*`                                   |
| `overflow-ellipsis`     | `text-ellipsis`                            |
| `decoration-slice`      | `box-decoration-slice`                     |
| `decoration-clone`      | `box-decoration-clone`                     |

If one appears in edited code, determine whether it is legacy code that should be migrated within task scope.

---

# 17. v4 renamed scale semantics

Tailwind v4 changed names/scale semantics for several utilities.

Be especially careful when translating v3 references.

Conceptual v3 → v4 equivalents include:

| v3 visual intent            | v4 equivalent      |
| --------------------------- | ------------------ |
| `shadow-sm`                 | `shadow-xs`        |
| bare `shadow`               | `shadow-sm`        |
| `drop-shadow-sm`            | `drop-shadow-xs`   |
| bare `drop-shadow`          | `drop-shadow-sm`   |
| `blur-sm`                   | `blur-xs`          |
| bare `blur`                 | `blur-sm`          |
| `backdrop-blur-sm`          | `backdrop-blur-xs` |
| bare `backdrop-blur`        | `backdrop-blur-sm` |
| `rounded-sm`                | `rounded-xs`       |
| bare `rounded`              | `rounded-sm`       |
| old `outline-none` behavior | `outline-hidden`   |
| old 3px `ring`              | `ring-3`           |

Do not mechanically copy Tailwind v3 screenshots/examples and assume identical visual output.

---

# 18. Important distinction: `outline-none`

In modern Tailwind v4:

```text
outline-none
```

actually disables the outline.

The former accessibility-oriented "hidden outline" behavior is:

```text
outline-hidden
```

Do not use `outline-none` on interactive controls unless you provide an equally visible accessible focus treatment.

Preferred pattern:

```html
<button
  class="
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-primary
  "
>
```

Use project-specific focus tokens if available.

---

# 19. Ring behavior

Do not assume:

```text
ring
```

means the old v3 3px blue ring.

Specify focus styling intentionally.

Example:

```html
<input
  class="
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2
  "
/>
```

Or use project-approved outline styling.

Never depend on implicit ring color for branded/accessibility-critical states.

---

# 20. Border behavior

Do not rely on unspecified Tailwind border color.

Prefer explicit project tokens:

```html
<div class="border border-border">
```

rather than:

```html
<div class="border">
```

when visual design depends on a specific border color.

This is especially important when reproducing designs created under Tailwind v3.

---

# 21. Gradients

Do not blindly copy v3 gradient syntax from old examples.

Use current project/Tailwind v4 syntax.

For directional linear gradients, expect current syntax resembling:

```text
bg-linear-to-r
bg-linear-to-b
```

instead of assuming old examples using:

```text
bg-gradient-to-r
```

Verify existing project conventions before editing gradient-heavy UI.

Do not add decorative gradients simply because they are easy to generate.

---

# 22. Container utility

Do not attempt to configure v4 container behavior through:

```js
theme: {
  container: {
    center: true,
    padding: ...
  }
}
```

If the project customizes Tailwind's `container`, use v4 CSS architecture.

Example:

```css
@utility container {
  margin-inline: auto;
  padding-inline: 1rem;
}
```

However, if the project has its own layout utility such as:

```text
page-container
content-container
section-inner
```

reuse it instead of modifying the built-in `container`.

---

# 23. Prefer one canonical page container

Avoid page-by-page width drift such as:

```text
max-w-5xl
max-w-6xl
max-w-7xl
max-w-[1180px]
max-w-[1240px]
```

unless the design system intentionally defines multiple container widths.

If the project has a canonical container utility or component, reuse it.

Example conceptual system:

```text
container-wide
container-content
container-narrow
```

Do not invent a new width for every section.

---

# 24. Mobile-first responsive design is mandatory

Base classes represent mobile.

Enhancement occurs at larger breakpoints.

Good:

```html
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
```

Bad:

```html
<div class="grid grid-cols-3 max-md:grid-cols-1">
```

unless a max-width variant is intentionally required.

Think:

```text
mobile
→ tablet portrait
→ tablet landscape
→ laptop
→ wide desktop
```

Do not think:

```text
desktop
→ somehow shrink it
```

---

# 25. Do not overuse breakpoints

Avoid breakpoint noise:

```text
sm:
md:
lg:
xl:
2xl:
```

on every property.

A good responsive component changes only where its design actually requires a change.

Prefer fluid behavior using:

```text
grid
flex-wrap
minmax()
clamp()
aspect-ratio
max-width
container queries
```

where these produce more robust layouts.

---

# 26. Custom breakpoints

If the project defines custom breakpoints through:

```css
@theme {
  --breakpoint-*:
}
```

use them.

Do not hardcode custom media-query pixel values elsewhere without a strong reason.

Do not alter breakpoint definitions because one component is awkward.

Fix the component first.

---

# 27. Container queries

Tailwind v4 supports container-query workflows.

Use container queries when a reusable component should adapt to its **available parent width** rather than the viewport.

Pattern:

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    ...
  </div>
</div>
```

Use them selectively.

Good candidates:

* cards;
* embedded booking widgets;
* reusable media components;
* sidebar content;
* components that appear in multiple layout contexts.

Do not replace all viewport breakpoints with container queries.

---

# 28. Layout strategy hierarchy

Prefer layout systems in this order:

```text
1. normal document flow
2. flexbox
3. grid
4. container queries
5. relative positioning
6. absolute positioning where semantically appropriate
```

Do not use absolute positioning as the primary layout engine.

Absolute positioning is appropriate for things such as:

* overlays;
* decorative elements;
* badges;
* icons;
* hero artwork;
* intentionally layered composition.

It is not appropriate for basic text/image alignment that Grid or Flexbox can solve.

---

# 29. Avoid fixed heights for content

Bad default:

```text
h-[600px]
```

for sections containing variable text.

Prefer:

```text
min-h-*
py-*
aspect-*
```

or content-driven height.

Fixed heights are acceptable where the visual media itself requires a known viewport:

* hero artwork;
* video frame;
* map;
* gallery;
* controlled carousel;
* decorative canvas.

Check mobile overflow.

---

# 30. Prefer `gap` over brittle sibling spacing

For flex/grid groups prefer:

```text
gap-*
```

instead of:

```text
space-y-*
space-x-*
```

when children may reorder, wrap, hide, or carry their own margins.

`space-*` is not forbidden.

Use it where its sibling-spacing semantics are appropriate.

---

# 31. Typography governance

Before styling text, inspect the project's typography tokens.

Prefer design-system classes:

```text
font-heading
font-body
text-text
text-text-secondary
text-text-muted
```

where defined.

Do not casually introduce:

```text
font-serif
font-sans
```

if semantic project fonts already exist.

---

# 32. Heading hierarchy is semantic, not visual

Do not choose `<h3>` because its default visual style seems correct.

HTML hierarchy and Tailwind styling are separate.

Example:

```html
<h2 class="text-4xl font-heading">
```

is valid.

Do not skip semantic levels simply to get a smaller visual size.

---

# 33. Avoid arbitrary typography drift

Suspicious:

```text
text-[37px]
text-[41px]
text-[15px]
leading-[1.13]
tracking-[0.023em]
```

unless derived from an intentional design system/reference.

Prefer existing scale/token values.

For fluid hero typography, a controlled arbitrary `clamp()` may be justified if the project uses that strategy.

Example:

```text
text-[clamp(2.5rem,6vw,5rem)]
```

If repeated, promote the decision into the design system.

---

# 34. Color governance

Use project semantic tokens before Tailwind palette colors.

Preferred:

```text
bg-primary
text-text
text-text-secondary
border-border
```

Potentially suspicious in branded production UI:

```text
bg-blue-600
text-gray-500
border-slate-200
```

unless the project deliberately uses those palette tokens.

Do not create a parallel color system inside components.

---

# 35. Opacity syntax

Use modern color opacity modifiers:

```text
bg-black/50
text-white/80
border-white/20
```

Do not use removed opacity helpers such as:

```text
bg-opacity-50
text-opacity-80
```

---

# 36. CSS variables in arbitrary values

When project behavior requires runtime CSS custom properties, prefer explicit and readable Tailwind syntax supported by the installed version.

Example concepts:

```text
opacity-(--overlay-opacity)
```

or appropriate arbitrary-value syntax.

Do not generate deeply nested arbitrary CSS expressions when normal CSS would be clearer.

---

# 37. State styling

Every interactive control must intentionally consider:

```text
default
hover
focus-visible
active
disabled
loading where relevant
selected/current where relevant
error where relevant
```

Do not implement hover as the only interaction state.

Touch devices do not have traditional hover.

---

# 38. Focus-visible is mandatory

Interactive elements must retain visible keyboard focus.

Do not use:

```text
focus:outline-none
```

without replacement.

Preferred:

```text
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-primary
```

or the project's approved focus pattern.

Consistency matters more than agent preference.

---

# 39. Disabled controls

Disabled state must not rely on opacity alone if clarity suffers.

Consider:

```text
disabled:cursor-not-allowed
disabled:opacity-*
```

plus semantic disabled styling where required.

Do not allow disabled controls to retain misleading hover effects.

---

# 40. Reduced motion

Whenever adding:

* transforms;
* parallax;
* large movement;
* continuous animation;
* reveal animations;
* autoplay motion;

consider users who prefer reduced motion.

Use variants such as:

```text
motion-reduce:
motion-safe:
```

where appropriate.

Do not animate important content in a way that blocks access to it.

Do not add animation simply to make AI-generated UI "feel premium."

---

# 41. Hover effects

Hover effects must be subtle and intentional.

Avoid default AI patterns like:

```text
hover:-translate-y-2
hover:scale-105
hover:shadow-2xl
```

on every card.

Prefer state changes that reinforce interaction:

* modest background shift;
* border shift;
* text/icon shift;
* subtle elevation;
* controlled media zoom.

Preserve the site's design language.

---

# 42. `group` and `peer`

Use `group` and `peer` when state needs to flow across related elements.

Do not use them when normal semantic state or parent selectors would be clearer.

Avoid deeply nested chains such as:

```text
group-hover:
peer-checked:
group-has:
```

without a clear reason.

Complex selector logic deserves readability scrutiny.

---

# 43. Forms

For every form control ensure:

* real label exists;
* focus state exists;
* error state exists where validation exists;
* disabled state is clear;
* placeholder is not used as the sole label;
* touch target is adequate;
* color is not the only error indicator.

Use project form patterns if they exist.

Do not redesign input appearance independently inside each form.

---

# 44. Buttons

Use existing button components or variants where available.

Do not repeatedly construct bespoke button classes across pages.

A button system should typically control:

```text
size
variant
icon placement
disabled state
focus state
loading state
```

Static variant maps are preferred.

---

# 45. Links versus buttons

Do not style semantic misuse.

Navigation/action distinction still matters.

Use:

```text
<a>
```

for navigation.

Use:

```text
<button>
```

for actions.

Tailwind does not justify incorrect HTML semantics.

---

# 46. Images and media

Tailwind styling does not replace correct image behavior.

For content imagery consider:

```text
w-full
h-auto
object-cover
object-contain
aspect-*
```

based on intent.

Do not distort imagery with incompatible fixed width and height.

For decorative/hero images, verify crop behavior at mobile, tablet, and desktop widths.

---

# 47. Aspect ratio

Prefer intentional aspect ratios over hardcoded paired dimensions when appropriate.

Example:

```text
aspect-[16/10]
object-cover
```

If an aspect ratio is repeated project-wide, consider making it a token.

---

# 48. Z-index policy

Do not solve layering problems by escalating:

```text
z-[999]
z-[9999]
z-[99999]
```

Understand the stacking context.

Prefer a small deliberate z-index hierarchy.

If the project has z-index tokens or conventions, use them.

---

# 49. Shadows and elevation

Inspect project elevation rules.

Do not casually introduce:

```text
shadow-xl
shadow-2xl
```

because a component needs separation.

Premium/minimal design often benefits from:

* spacing;
* background contrast;
* subtle borders;
* restrained shadows.

Remember that v4 shadow naming differs from old v3 visual assumptions.

---

# 50. Radius governance

Use the project's radius system.

Avoid arbitrary mixtures:

```text
rounded
rounded-md
rounded-xl
rounded-2xl
rounded-[18px]
rounded-[22px]
```

across similar components.

If project radius utilities/tokens exist, reuse the semantic project roles rather than inventing a parallel naming scheme.

For Luxury Transportation, inspect Theme V2 `radii.json` and the generated/registered utility surface before choosing classes.

Do not turn every section into a rounded card.

---

# 51. Component class strategy

For simple Astro components, static class strings are preferred.

Example:

```astro
<section class="py-16 md:py-24">
```

For variants, use static maps.

Example:

```astro
---
const styles = {
  primary: "bg-primary text-white",
  secondary: "bg-surface text-text",
};

const { variant = "primary" } = Astro.props;
---

<section class={styles[variant]}>
```

---

# 52. Class composition helpers

If the repository already uses:

```text
clsx
classnames
tailwind-merge
cva
tailwind-variants
```

follow the established pattern.

Do not introduce a new class-composition dependency for one component.

Do not assume `tailwind-merge` is installed.

Inspect first.

---

# 53. Conditional classes

Prefer readable conditionals.

Good:

```astro
class:list={[
  "base classes",
  active && "text-primary",
  disabled && "opacity-50",
]}
```

where Astro's established project style supports it.

Avoid complex inline ternary forests.

If visual state becomes complex, define a static variant map.

---

# 54. Astro-specific rules

When using Astro:

1. preserve Astro's zero-JS-by-default philosophy;
2. do not introduce React merely for styling;
3. use semantic Astro markup;
4. keep visual behavior in CSS when JavaScript is unnecessary;
5. import global Tailwind CSS through the established layout architecture;
6. do not add `@astrojs/tailwind` to native v4 projects;
7. do not create `tailwind.config.*` reflexively;
8. preserve `@tailwindcss/vite` architecture where present.

---

# 55. Astro scoped `<style>` blocks

Prefer utility classes in markup when practical.

Use scoped `<style>` for:

* complex pseudo-elements;
* complicated art-direction CSS;
* uncommon selectors;
* third-party overrides;
* styles that would be less readable as utilities;
* advanced animation/layout cases.

Do not move straightforward Tailwind styling into `<style>` merely to shorten HTML.

---

# 56. Astro + `@reference`

If a scoped/separately processed CSS context needs access to custom Tailwind theme utilities or variants, use the project's appropriate `@reference` strategy.

Conceptual example:

```astro
<style>
  @reference "../styles/global.css";

  .special-element {
    @apply text-primary;
  }
</style>
```

Do not add `@reference` unless required.

If normal CSS can simply use:

```css
color: var(--color-primary);
```

that may be clearer.

---

# 57. Prefer CSS variables over excessive `@apply` in scoped styles

If global theme variables are emitted and available:

Prefer:

```css
.special {
  color: var(--color-primary);
}
```

over:

```css
.special {
  @apply text-primary;
}
```

when the Tailwind abstraction provides no additional value.

---

# 58. Plugin policy

Before adding any Tailwind plugin:

1. verify it supports the installed Tailwind v4 version;
2. inspect current official integration syntax;
3. inspect whether the functionality is already built into Tailwind v4;
4. determine whether the project already has an alternative;
5. avoid adding a dependency for trivial functionality.

Never install an old plugin because a v3 tutorial recommends it.

---

# 59. Container-query plugin warning

Do not install an old Tailwind container-query plugin merely to use container queries.

Current Tailwind v4 has native container-query support.

---

# 60. Third-party component libraries

When copying code from:

* Tailwind Plus;
* Preline;
* daisyUI;
* Flowbite;
* old GitHub templates;
* Stack Overflow;
* blog posts;
* CodePen;
* AI-generated examples;

never assume its Tailwind version matches the project.

Before integrating:

```text
identify version
check class names
remove framework-specific assumptions
map colors to project tokens
map radius to project tokens
map typography to project tokens
map spacing to project system
remove unnecessary JS
review accessibility
review responsive behavior
```

External snippets are references, not project truth.

---

# 61. Tailwind Plus / external reference conversion protocol

When adapting an external section:

## Keep conceptually

* information hierarchy;
* grid concept;
* responsive structure;
* interaction pattern;
* media ratio.

## Replace with project values

* colors;
* fonts;
* spacing;
* radii;
* shadows;
* button styling;
* content width;
* animation;
* icon language.

Do not paste an external component unchanged and call it project-native.

---

# 62. Do not blindly trust AI-generated Tailwind

When reviewing another agent's code, actively search for:

```text
tailwind.config
@tailwind
@astrojs/tailwind
content:
theme.extend
bg-opacity-
text-opacity-
border-opacity-
ring-opacity-
placeholder-opacity-
flex-shrink-
flex-grow-
overflow-ellipsis
bg-gradient-to-
dynamic template-string classes
```

Also inspect suspicious:

```text
shadow-sm
rounded-sm
blur-sm
ring
outline-none
border
```

because their semantics may differ from what a v3-oriented agent intended.

---

# 63. CSS-first project configuration

When extending Tailwind v4, prefer CSS configuration.

Examples of project-level customization include:

```css
@theme {
  --color-primary: ...;
  --font-heading: ...;
  --breakpoint-...: ...;
}
```

and:

```css
@utility ... {
  ...
}
```

Do not reproduce equivalent v3 JavaScript configuration unless maintaining existing legacy compatibility.

---

# 64. Theme references and `inline`

When one theme variable references another CSS variable, inspect whether the project's architecture requires `@theme inline`.

Do not blindly duplicate variables or flatten runtime design tokens.

Use the existing project's approach consistently.

---

# 65. Base styles

Base styles are acceptable for intentional global behavior.

Examples:

```css
@layer base {
  html {
    /* intentional global behavior */
  }
}
```

Do not build a second CSS framework in `@layer base`.

Do not style every semantic element globally unless that is part of the project's documented system.

---

# 66. Preflight awareness

Tailwind Preflight may affect native HTML defaults.

When something looks unexpectedly different, investigate:

```text
Preflight
browser default
project base styles
component styles
```

before adding arbitrary override classes.

Do not patch symptoms blindly.

---

# 67. Button cursor behavior

Do not assume button cursor behavior from old Tailwind versions.

If the project explicitly wants:

```text
cursor-pointer
```

for actionable buttons, follow the project convention.

Do not globally modify cursor behavior without approval.

---

# 68. Placeholder styling

Do not assume historical Tailwind placeholder color defaults.

Specify placeholder styling where the design requires it:

```text
placeholder:text-text-muted
```

Do not depend on undocumented/default appearance for precise design replication.

---

# 69. Modern CSS first

Tailwind v4 is built around modern CSS.

Prefer native CSS capabilities where appropriate:

* CSS variables;
* `color-mix`;
* logical properties;
* Grid;
* Flexbox;
* `minmax`;
* `clamp`;
* aspect ratio;
* container queries;
* modern selectors.

Do not introduce JavaScript to solve a problem CSS handles cleanly.

---

# 70. Avoid unnecessary custom CSS

Before writing custom CSS ask:

1. does Tailwind already expose this?
2. does an arbitrary property solve this clearly?
3. is this reusable enough for `@utility`?
4. does this belong in the design system?
5. is custom CSS actually clearer?

Custom CSS is not forbidden.

Unnecessary custom CSS is.

---

# 71. Arbitrary properties

Arbitrary properties can be appropriate for modern CSS not represented by a utility.

Example concept:

```text
[mask-image:linear-gradient(...)]
```

Use them sparingly.

If repeated, promote the behavior into a named utility or proper CSS abstraction.

---

# 72. Do not optimize for shortest markup

Longer Tailwind markup can be more maintainable than hidden CSS abstractions if its design intent is clear.

Do not refactor:

```html
class="..."
```

into vague classes like:

```html
class="premium-card"
```

solely to reduce class count.

Component abstraction is preferable to semantic CSS-class proliferation.

---

# 73. Do not optimize for cleverness

Avoid obscure one-line Tailwind tricks when straightforward layout utilities are clearer.

Code should be easy for:

* humans;
* future agents;
* reviewers;
* accessibility reviewers;

to understand.

---

# 74. Responsive image positioning

For hero/background imagery, mobile often needs a different crop.

Do not assume:

```text
object-center
```

works at every width.

Use deliberate responsive positioning when required:

```text
object-[65%_center]
md:object-center
```

Only after inspecting the actual asset.

---

# 75. Responsive visibility

Do not hide meaningful content on mobile merely because layout becomes difficult.

Bad:

```text
hidden md:block
```

for information users need.

Use responsive restructuring first.

Visibility changes should have product/content justification.

---

# 76. Touch targets

Interactive mobile targets must remain comfortably usable.

Do not create tiny icon buttons merely because their SVG is 16px.

Provide sufficient hit area using padding/minimum dimensions.

Follow project accessibility requirements.

---

# 77. Responsive typography

Do not scale every heading across five breakpoints.

Prefer a restrained hierarchy.

Typical pattern:

```text
text-3xl
md:text-4xl
lg:text-5xl
```

or project fluid typography.

Avoid:

```text
text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl
```

unless the design explicitly requires it.

---

# 78. Responsive spacing

Section spacing should follow a consistent rhythm.

Do not independently invent:

```text
py-14
py-17
py-22
py-[92px]
```

across sections.

Prefer established project section-spacing tokens/utilities.

---

# 79. Accessibility is non-negotiable

Tailwind styling must not break:

* keyboard access;
* focus visibility;
* color contrast;
* semantic hierarchy;
* screen-reader labeling;
* motion preferences;
* zoom;
* content reflow;
* touch interaction.

Do not hide labels using only visual placeholders.

Do not remove outlines without replacement.

Do not make hover the only indication of interactivity.

---

# 80. Visual quality rules

Avoid typical generic AI-generated UI patterns unless supported by the project's design language.

Do not default to:

* giant gradient blobs;
* glassmorphism;
* excessive blur;
* glowing buttons;
* gradient text;
* every section inside a card;
* excessive pills;
* excessive border radii;
* arbitrary card shadows;
* constant scale-on-hover;
* icon + title + two-line-text grids everywhere;
* meaningless decorative grids;
* fake metrics;
* generic "premium" visual effects.

Tailwind's ease of adding these effects is not justification for using them.

---

# 81. Scope discipline

When asked to edit one component:

Do not:

* rewrite global theme;
* change Tailwind integration;
* change breakpoints;
* rename tokens;
* redesign unrelated components;
* install dependencies;
* refactor project-wide CSS;

unless necessary for the requested task.

Always respect:

```text
IN SCOPE
OUT OF SCOPE
```

---

# 82. Never modify build architecture casually

The following require explicit justification:

```text
astro.config.*
vite.config.*
postcss.config.*
package.json dependencies
global Tailwind import
Tailwind plugin architecture
theme namespace strategy
```

A styling task should rarely need to alter these.

---

# 83. Migration tasks are special

If explicitly migrating Tailwind v3 → v4:

1. create/confirm a safe branch;
2. inspect current version;
3. inspect all configuration;
4. inspect plugins;
5. use official migration tooling where appropriate;
6. review generated diff;
7. migrate JS theme configuration into CSS where appropriate;
8. remove legacy integration only when replacement is confirmed;
9. inspect renamed utilities;
10. inspect removed utilities;
11. inspect border/ring differences;
12. inspect container behavior;
13. build;
14. visually compare important pages;
15. do not treat successful compilation as sufficient.

Migration deserves separate visual QA.

---

# 84. Do not silently migrate

If the project contains valid compatibility architecture:

```text
@config
legacy plugin
tailwind.config.*
```

do not remove it during an unrelated UI task.

Flag it if relevant.

Preservation is safer than accidental migration.

---

# 85. Verification protocol

After a meaningful Tailwind change, run the project's existing verification commands.

Discover commands from:

```text
package.json
README
project instructions
```

Typical examples:

```bash
npm run lint
npm run check
npm run test
npm run build
```

Do not invent script names.

---

# 86. Tailwind-v3 regression scan

When repository tools permit, search for v3 regressions after significant styling work.

Search patterns including:

```text
@tailwind base
@tailwind components
@tailwind utilities
@astrojs/tailwind
bg-opacity-
text-opacity-
border-opacity-
divide-opacity-
ring-opacity-
placeholder-opacity-
flex-shrink-
flex-grow-
overflow-ellipsis
decoration-slice
decoration-clone
```

Also inspect newly introduced:

```text
tailwind.config.*
content:
theme.extend
```

Context matters: documentation or migration fixtures may legitimately contain these strings.

Do not blindly delete matches.

---

# 87. Suggested automated Tailwind-v4 guard

If the repository wants a strict regression guard, a project script may search application/config files for forbidden v3 patterns.

Example concept:

```bash
#!/usr/bin/env bash

set -euo pipefail

patterns=(
  '@tailwind base'
  '@tailwind components'
  '@tailwind utilities'
  '@astrojs/tailwind'
  'bg-opacity-'
  'text-opacity-'
  'border-opacity-'
  'divide-opacity-'
  'ring-opacity-'
  'placeholder-opacity-'
  'flex-shrink-'
  'flex-grow-'
  'overflow-ellipsis'
)

failed=0

for pattern in "${patterns[@]}"; do
  if rg -n \
    --glob '!node_modules/**' \
    --glob '!dist/**' \
    --glob '!docs/**' \
    "$pattern" .; then
    echo "Tailwind v3 pattern detected: $pattern"
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  exit 1
fi
```

Do not add this script without task scope/approval.

If one already exists, run it.

---

# 88. Visual verification protocol

When browser/screenshot capability exists, use it.

For new or significantly changed components inspect:

```text
mobile
tablet portrait
tablet landscape
desktop
```

Suggested representative ranges:

```text
~320–375px
~390–430px
~768px
~1024px
~1280–1440px
```

Exact widths depend on project requirements.

Check:

* overflow;
* wrapping;
* crop;
* alignment;
* container width;
* whitespace;
* button size;
* navigation;
* typography;
* image focal point;
* focus states;
* hidden content.

---

# 89. Do not trust compilation alone

This can compile:

```html
<div class="rounded-xl shadow-xl p-8">
```

and still violate:

* the design system;
* visual hierarchy;
* spacing rhythm;
* mobile layout;
* project tone.

Compilation validates syntax.

It does not validate design.

---

# 90. Screenshot-driven implementation

When implementing from a screenshot:

Do not immediately recreate pixels.

First infer:

```text
container width
column structure
spacing rhythm
type hierarchy
media aspect ratio
alignment
breakpoint behavior
component boundaries
```

Then map those concepts to the project's tokens.

Do not import the reference site's exact:

* colors;
* typography;
* radius;
* shadow;
* dimensions;

unless explicitly instructed.

---

# 91. Screenshot comparison loop

Preferred workflow:

```text
IMPLEMENT
↓
BUILD/RENDER
↓
SCREENSHOT
↓
COMPARE
↓
IDENTIFY SPECIFIC DIFFERENCE
↓
PATCH
↓
RENDER AGAIN
```

Do not make five speculative CSS changes simultaneously when one measured adjustment would solve the problem.

---

# 92. Diagnose before patching

If alignment is wrong, determine whether the cause is:

```text
container
grid
gap
padding
margin
line-height
image crop
font metrics
positioning
breakpoint
```

Do not randomly adjust:

```text
left-[3px]
mt-[7px]
translate-x-[2px]
```

until it looks acceptable.

---

# 93. Design-token drift audit

When reviewing a component, look for repeated arbitrary values that likely represent missing tokens.

Example:

```text
rounded-[14px]
rounded-[15px]
rounded-[16px]
```

across related components.

This probably indicates design-system drift.

Recommend consolidation rather than adding another value.

---

# 94. Class duplication audit

Watch for repeated long class strings across several components.

If repetition represents a **real UI component**, extract a component.

Do not necessarily extract a CSS class.

Preferred:

```text
<Button />
<Card />
SectionHeading />
```

over:

```css
.btn-premium {}
.card-premium {}
.section-heading {}
```

when the framework supports component abstraction.

---

# 95. Design-system preservation

Before introducing a new:

* button;
* card;
* badge;
* input;
* section heading;
* container;
* image treatment;
* icon treatment;

search for an existing equivalent.

Reuse first.

Modify second.

Create third.

---

# 96. Dependency discipline

Do not install a package to solve what Tailwind/CSS already handles.

Do not introduce:

* animation library;
* class helper;
* icon library;
* component library;
* Tailwind plugin;

without checking whether the project already has an established solution.

Dependency changes require justification.

---

# 97. Version discipline

Never answer the question:

> "Does Tailwind support X?"

from memory when the implementation depends on it.

Check:

```text
installed Tailwind version
existing repository syntax
current documentation if available
```

Tailwind evolves.

The project version wins.

---

# 98. External documentation discipline

When searching documentation:

Prefer:

1. current official Tailwind docs;
2. current official framework docs;
3. official plugin docs;
4. current package repository;
5. reputable current examples.

Avoid treating:

```text
v2.tailwindcss.com
v3.tailwindcss.com
old blog posts
old Stack Overflow answers
old GitHub snippets
```

as canonical v4 implementation guidance.

They may still be useful for concept/history only.

---

# 99. Agent self-check before writing code

Before implementation, mentally confirm:

```text
TAILWIND_MAJOR_VERSION = 4
CONFIG_MODEL = CSS-first
GLOBAL_THEME_SOURCE = identified
DYNAMIC_CLASS_POLICY = static complete strings
RESPONSIVE_STRATEGY = mobile-first
DESIGN_TOKENS = reuse existing
ARBITRARY_VALUES = exception, not default
A11Y_STATES = required
BUILD_ARCHITECTURE = preserve
```

If any value is unknown, inspect the repository.

---

# 100. Agent self-check after writing code

Before declaring completion, verify:

## Architecture

* [ ] No Tailwind v3 architecture introduced.
* [ ] No `tailwind.config.*` created without explicit reason.
* [ ] No `@astrojs/tailwind` introduced into a v4 Astro project.
* [ ] Existing Vite/PostCSS architecture preserved.
* [ ] No dependency downgrade.

## CSS

* [ ] Tailwind loaded using project-standard v4 architecture.
* [ ] New reusable design values use appropriate tokens.
* [ ] No unnecessary arbitrary values.
* [ ] No unnecessary custom CSS.
* [ ] No unnecessary `@apply`.
* [ ] Custom utilities use appropriate v4 mechanisms.

## Classes

* [ ] No removed v3 utilities introduced.
* [ ] No runtime-generated Tailwind class fragments.
* [ ] Conditional class variants use complete static class strings.
* [ ] Renamed v4 utilities were considered when adapting old examples.
* [ ] Border/ring behavior is explicit where visually important.

## Design system

* [ ] Existing colors reused.
* [ ] Existing typography reused.
* [ ] Existing radius system reused.
* [ ] Existing spacing rhythm preserved.
* [ ] Existing container strategy reused.
* [ ] Existing components reused where possible.

## Responsive behavior

* [ ] Mobile is the base implementation.
* [ ] Tablet behavior considered.
* [ ] Desktop behavior considered.
* [ ] No accidental horizontal overflow.
* [ ] Images crop correctly.
* [ ] Content does not disappear merely to solve layout problems.

## Accessibility

* [ ] Visible keyboard focus preserved.
* [ ] Hover is not the only state.
* [ ] Disabled states are clear.
* [ ] Reduced-motion concerns considered.
* [ ] Semantic HTML preserved.
* [ ] Forms preserve labels and error behavior.

## Verification

* [ ] Relevant lint/check commands pass.
* [ ] Production build passes where practical.
* [ ] Tests pass where relevant.
* [ ] Browser/render inspected where tooling exists.
* [ ] No unrelated files modified.

---

# 101. Completion report format

For meaningful Tailwind tasks, finish with a concise report:

```text
TAILWIND:
- Confirmed version:
- Architecture preserved:
- Tokens reused/added:
- New utilities added:
- Arbitrary values introduced:
- Legacy/v3 patterns found:
- Legacy/v3 patterns introduced: none

RESPONSIVE:
- Mobile:
- Tablet:
- Desktop:

ACCESSIBILITY:
- Focus:
- Motion:
- Interaction states:

VERIFICATION:
- Lint:
- Check:
- Tests:
- Build:
- Visual review:

FILES CHANGED:
- ...

NOTES:
- ...
```

Do not claim a check passed if it was not run.

Use:

```text
not run
```

instead.

---

# 102. Error-handling policy

If Tailwind output behaves unexpectedly:

Do not immediately:

* create configuration;
* add safelists;
* add `!important`;
* add arbitrary values;
* add a plugin;
* downgrade Tailwind;
* paste old v3 code.

Investigate in this order:

```text
1. installed version
2. class spelling/current syntax
3. source detection
4. CSS import
5. token definition
6. component context
7. conflicting CSS
8. variant semantics
9. build integration
10. third-party library interaction
```

---

# 103. `!important` policy

`!important` is a last resort.

Before using it, identify:

* specificity conflict;
* source order;
* third-party override;
* component architecture problem.

Do not use arbitrary important modifiers to overpower poorly understood CSS.

If unavoidable, document why.

---

# 104. Performance awareness

Do not use Tailwind as an excuse to create visually expensive UI.

Avoid excessive:

* backdrop blur;
* huge box shadows;
* fixed backgrounds on mobile;
* complex filters;
* continuous animation;
* giant DOM structures;
* unnecessary client-side JS.

Prefer performant CSS and simple composition.

---

# 105. Maintainability rule

A future developer/agent should be able to answer:

> Why is this class here?

without reverse-engineering screenshot trial-and-error.

Prefer intentional classes over accidental ones.

Bad:

```text
mt-[23px]
left-[7px]
translate-y-[3px]
```

Good:

```text
mt-6
items-center
gap-4
```

when these describe actual layout intent.

---

# 106. Modification principle

Never rewrite a functioning Tailwind component merely to make it look more like how you personally would have written it.

Refactor only when it improves:

* correctness;
* consistency;
* accessibility;
* maintainability;
* performance;
* task requirements.

Style preference alone is not sufficient.

---

# 107. No speculative global changes

If one component needs unusual styling, do not immediately change:

```text
global spacing scale
global radius scale
global breakpoints
global colors
container width
base typography
```

Solve locally first unless the mismatch exposes a genuine design-system problem.

---

# 108. If the repository contradicts this skill

The repository may contain deliberate exceptions.

When an existing intentional project rule conflicts with a generic rule here:

1. preserve project behavior;
2. identify the conflict;
3. do not silently "correct" it;
4. follow explicit project documentation;
5. recommend migration separately if warranted.

This skill prevents accidental v3 regressions.

It is not authorization to rewrite working architecture.

---

# 109. Minimal valid Tailwind v4 mental model

Keep this model loaded:

```text
TAILWIND V4
│
├── CSS-first configuration
│
├── @import "tailwindcss"
│
├── @theme = utility-generating design tokens
│
├── :root = normal runtime CSS variables
│
├── automatic source detection
│
├── @source = explicit additional sources
│
├── @utility = reusable custom utility
│
├── @variant = variant inside CSS
│
├── @custom-variant = reusable custom variant
│
├── @reference = expose Tailwind context to isolated CSS
│
├── static complete class strings
│
├── mobile-first responsive design
│
├── native container queries
│
└── modern CSS
```

If you find yourself reaching for:

```text
tailwind.config.js
content: []
theme.extend
@tailwind base
@tailwind components
@tailwind utilities
```

stop.

You are probably falling back to Tailwind v3 mental models.

---

# 110. Golden implementation principles

When uncertain, follow these principles:

### Principle 1

**Read the repository before remembering Tailwind.**

### Principle 2

**Use existing tokens before inventing values.**

### Principle 3

**Use complete static class names.**

### Principle 4

**Mobile is the default; larger screens enhance it.**

### Principle 5

**Components adapt to layout; layouts should not depend on pixel hacks.**

### Principle 6

**Accessibility states are part of the design.**

### Principle 7

**External snippets must be translated into the project's design system.**

### Principle 8

**Compilation proves syntax, not visual correctness.**

### Principle 9

**One approved pattern reused ten times is better than ten newly generated patterns.**

### Principle 10

**Do not introduce legacy architecture simply because it still technically works.**

---

# 111. Tailwind v4 anti-regression oath

For every Tailwind-related task:

> I will verify the installed version before relying on framework memory.
> I will treat this repository as a Tailwind v4 project.
> I will preserve its CSS-first architecture.
> I will not introduce Tailwind v3 configuration.
> I will not dynamically construct utility names.
> I will reuse project tokens before inventing values.
> I will build mobile-first.
> I will preserve keyboard focus and accessibility states.
> I will not install dependencies casually.
> I will verify the implementation before declaring it complete.

---

# 112. Final rule

**Never "make Tailwind work" by forcing the project to resemble Tailwind v3.**

If something appears incompatible:

investigate the v4 solution.

If uncertain:

verify.

If the repository already has a solution:

reuse it.

If a new abstraction is required:

make it native to Tailwind v4.

The goal is not merely to produce styles.

The goal is to preserve a clean, predictable, native Tailwind CSS v4 codebase that future humans and agents can extend without reintroducing legacy assumptions.
