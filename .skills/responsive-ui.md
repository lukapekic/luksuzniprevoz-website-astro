---
name: responsive-ui
description: Use for responsive layout, container/width adaptation, breakpoints, touch targets, overflow, orientation, and CSS that must work across the foundation's fixed viewport set. Covers mobile-first, logical properties, and layout-only class passthrough.
workstream: responsive-ui
applies-to: "components/, foundation/ui/ (layout/spacing), theme tokens (spacing/layout/radii), any CSS/class composition on primitives"
source-of-truth: AGENTS.md
---

# Responsive UI

## Goal & end result
Layout that adapts from 320px to 1920px with no horizontal overflow, no loss of meaningful content or interaction on small screens, usable touch targets, unclipped focus, and logical (not physical) CSS. End result: `pnpm test:e2e` (responsive at 320/768/1024/1440/1920) + `pnpm test:a11y` + `pnpm quality:page` green.

## When to use
- Building or changing responsive layout, containers, grids, spacing, breakpoints.
- Composing classes on primitives.
- Fixing overflow, clipping, touch-target, or RTL/mirroring issues.

## When NOT to use
- Image/font/LCP/performance work (use `responsive-images-performance`).
- Semantics/keyboard/contrast work (use `accessibility-wcag`; the two overlap on touch targets and focus — coordinate).

## Fixed context (non-negotiable truths of this repo)
- **Mobile-first.** Write base styles for the smallest viewport, enhance upward with `min-width` media queries.
- **Fixed viewport set** (FND-RESP-06, enforced in e2e): **320, 768, 1024, 1440, 1920** (plus **390** in the a11y manual checklist). E2E responsive tests run at these widths; e2e runs on Chromium, Firefox, WebKit (FND-COMPAT-03). Don't invent other breakpoints; if a project truly needs one, escalate.
- **No horizontal overflow** (FND-RESP-03): `overflow-x: hidden` on `html, body`; ordinary pages must not require horizontal scrolling.
- **Logical properties only** (FND-I18N-13, enforced by `no-physical-direction-property`): `padding-inline`/`margin-inline`/`inset-inline`/`border-inline`/`text-align: inline-start` — never `left`/`right`/`padding-left`/`margin-right`. This is what makes RTL/`dir` mirroring correct.
- **Class passthrough on primitives is layout-only** (FND-UI-06, enforced by `no-appearance-class-passthrough`): margin, grid/flex, width, order only. Never pass appearance classes (color, typography, border, shadow, background). No dynamic class expressions on primitives.
- **Use theme tokens, not raw values** (FND-THEME-09, `no-raw-design-value`): spacing/radii/color from `src/theme/versions/<active>/`; generated CSS at `src/theme/generated/theme.css` (`@layer theme`).
- **Touch targets: 44×44 minimum** for interactive elements (FND-A11Y-05). WCAG 2.2 SC 2.5.8 sets a 24×24 AA floor with exceptions (Spacing/Equivalent/Inline/User Agent/Essential) — 44×44 is this project's stricter bar; don't drop to 24 unless an exception genuinely applies and you escalate.
- **Focus must not be clipped** (WCAG 2.2 SC 2.4.11 Focus Not Obscured): a focused component must not be entirely hidden by author-created content.

## Procedure
1. **Start mobile-first.** Define the 320px layout; add `min-width` enhancements for 768/1024/1440/1920 only where the design actually changes.
2. **Use logical properties** for every directional style so `dir`/RTL mirrors automatically.
3. **Reserve space, don't clip:** use `aspect-ratio`/explicit sizes for media; avoid fixed heights that clip translated text (translations expand).
4. **Compose with layout-only classes** on primitives; put appearance via variants/tokens, not passthrough.
5. **Keep touch targets ≥ 44×44** at all sizes (account for dense nav/footer on mobile).
6. **Prevent overflow:** `overflow-x: hidden` baseline; test long translations, sticky elements, tables, and carousels.
7. **Test the fixed set** (320, 390, 768, 1024, 1440, 1920): navigation, forms, accordions, dialogs, sticky elements, long translations, zoom/400%, image focal behavior, focus visibility.
8. **Run the gates.**

## Verify
- `pnpm test:e2e` (responsive spec at 320/768/1024/1440/1920, 3 engines)
- `pnpm test:a11y`
- `pnpm quality:page`
- Manual: 400% zoom + 320px reflow; no clipping/overflow; focus visible and unobscured.

## Definition of done
- Layout works across 320–1920 (and 390) with no horizontal overflow on ordinary pages.
- No meaningful content/interaction lost on small screens; touch targets ≥ 44×44; focus unclipped.
- All directional CSS is logical; primitive class passthrough is layout-only; values come from theme tokens.
- `test:e2e`, `test:a11y`, `quality:page` green.

## Never do (banned patterns)
- Desktop-first patchwork or orientation-specific CSS where width/container adaptation suffices.
- Physical direction properties (`left`, `right`, `padding-left`, `margin-right`, `text-align: left`).
- Pass appearance classes (color, typography, border, shadow, background) to primitives, or dynamic class expressions.
- Fixed heights that clip translated text.
- Ordinary-page horizontal scrolling / relying on `overflow-x: hidden` to hide *real* overflow bugs.
- Drop touch targets to the 24px floor without a genuine WCAG 2.5.8 exception (and escalation).
- Hide important mobile content that exists on desktop.
- Use raw design values instead of theme tokens.
- Invent breakpoints outside the fixed set without escalating.

## Escalation triggers
- A design genuinely needs a breakpoint outside the fixed set (320/768/1024/1440/1920) → escalate (FND-RESP-06 is a pinned contract).
- A touch target can't meet 44×44 and the only fallback is the 24px exception → escalate before applying the exception.
- RTL/`dir` mirroring can't be achieved with logical properties alone → escalate (may indicate a component needing a variant).
- A layout requires orientation-specific CSS or a fixed height that conflicts with translation expansion → escalate; don't clip silently.
- A primitive needs appearance customization that passthrough forbids → add a variant/token, don't bypass the lint rule.

## Strict responsive evidence

Every review records pass/fail evidence for 320, 390, 768, 1024, 1440, and
1920px, including both tablet orientations. The record must cover topology,
reading order, focus order, overflow, target size, translated-content expansion,
carousel behavior, and image focal points. A generic “responsive” approval is
not sufficient. Missing evidence is an unresolved quality finding.
