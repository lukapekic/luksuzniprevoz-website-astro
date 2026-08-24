---
name: accessibility-wcag
description: Use for UI semantics, forms, navigation, interaction, keyboard operability, focus, contrast, target size, reduced motion, alt text, language/DIR, and any work touching WCAG 2.2 AA conformance. Covers the semantic-HTML-first model and the manual checklist.
workstream: accessibility
applies-to: "all components, primitives, pages, forms, navigation, dialogs; src/content/ui/ (a11y.* strings), foundation.config.ts (locales dir/htmlLang)"
source-of-truth: AGENTS.md
---

# Accessibility / WCAG 2.2 AA

## Goal & end result
A page that meets **WCAG 2.2 AA** — native semantics first, full keyboard operability, visible unobscured focus, sufficient contrast, correct target sizes, programmatic labels, correct language/DIR, reduced-motion respected — verified by `pnpm test:a11y` plus the manual checklist. End result: automated a11y green, Lighthouse a11y ≥ 0.95, manual checklist items for the touched area completed.

## When to use
- Building/changing any UI that users interact with or perceive.
- Forms (labels, errors, validation), navigation, dialogs, menus, disclosure, tabs.
- Setting document language, `dir`, skip links, headings, landmarks.
- Alt text, ARIA decisions, focus management, motion.

## When NOT to use
- Pure SEO metadata with no UX surface (use `technical-seo`).
- Pure performance/image work (use `responsive-images-performance`); but alt text and LCP-a11y overlap — coordinate.

## Fixed context (non-negotiable truths of this repo)
- **Baseline: WCAG 2.2 AA is mandatory.** FND-A11Y-01 is **non-waivable**. New AA success criteria you must satisfy:
  - **2.4.11 Focus Not Obscured (Minimum)** — a focused component is not entirely hidden by author content.
  - **2.5.8 Target Size (Minimum)** — pointer targets ≥ 24×24 CSS px (with exceptions). This repo's stricter bar is **44×44** (FND-A11Y-05).
  - **3.2.6 Consistent Help** (A), **3.3.7 Redundant Entry** (A), **3.3.8 Accessible Authentication (Minimum)** (AA), **2.5.7 Dragging Movements** (AA).
- **Native semantic HTML first.** ARIA only when native semantics are insufficient — and then meaningful, not decorative.
- **Landmarks/structure:** exactly one primary `<main>` (the `Container` primitive gives it `id="main-content"`). One meaningful `<h1>` and a logical `h1→h6` hierarchy. Use `<section>` for major thematic sections, associated with a visible heading via `aria-labelledby` when needed (`Section` primitive).
- **Links navigate; buttons perform actions.** No clickable `<div>`/`<span>`.
- **Keyboard:** full operability, logical Tab order, no traps. Modal dialogs trap focus correctly; Escape closes open modals/menus/disclosure; arrow keys in composite widgets.
- **Skip link:** first focusable element, visible on focus (not hover-only), navigates to `#main-content` (SkipLink primitive, 44×44).
- **Focus:** visible `:focus-visible` in **every theme mode**; indicator contrast ≥ 3:1; not suppressed by `outline: none` without a replacement; not clipped.
- **Contrast:** normal text ≥ 4.5:1; qualifying large text (≥18.66px bold or ≥24px) ≥ 3:1; non-text/UI component contrast ≥ 3:1 where required.
- **Forms:** programmatic labels (`Field`/`Input`/`Select`/`Textarea`/`Checkbox`), errors associated with fields and announced (`FormStatus` + `aria-live`), accessible spam mitigation (honeypot/Turnstile/hCaptcha preferred over visual CAPTCHA; audio alternative if CAPTCHA is unavoidable — FND-A11Y-10).
- **Images:** `<Image>` primitive with descriptive `alt` in the page locale; `alt=""` only for `role="decorative"`; icon-only buttons get `aria-label`.
- **Motion:** respect `prefers-reduced-motion` (theme `motion.reduced` values); no autoplay animations, parallax, or blinking.
- **Language/DIR:** correct `htmlLang` and `dir` per locale (`Page` sets both from config); no wrong-language fallback; `dir` drives logical-property mirroring (coordinate with `responsive-ui`).
- **Strings via the UI dictionary** (FND-ARCH-03, `no-hardcoded-ui-string`): all user-visible strings via `t()`, including a11y labels (`a11y.skipLink`, `a11y.openMenu`, …).
- **Enforced:** `no-physical-direction-property` (focus rings/offsets must use logical properties), `no-hardcoded-ui-string`, `no-raw-img-element` (alt discipline).

## Procedure
1. **Start with semantics.** Use the right native element/landmark/heading before any ARIA or abstraction.
2. **Wire to primitives:** `Page` (head/lang/dir), `Container` (`main#main-content`), `Section` (aria-labelledby), `SkipLink`, `Link`, `NavList` (aria-current), `LanguageSwitcher` (hreflang/lang), `Breadcrumbs` (nav + JSON-LD), form primitives.
3. **Keyboard:** ensure every interactive element is reachable, ordered, and exitable; manage focus for dialogs/menus (trap + Escape + restore on close).
4. **Labels & errors:** associate every field with a label and its error; announce errors via `aria-live`.
5. **Color/contrast:** use theme tokens (don't hand-pick colors); verify ≥ thresholds in both light and dark.
6. **Target size & focus:** interactive elements ≥ 44×44; confirm `:focus-visible` is visible and unobscured in every theme mode.
7. **Motion & language:** honor `prefers-reduced-motion`; confirm `htmlLang`/`dir` are correct and strings are translated via `t()`.
8. **Automated + manual:** run `pnpm test:a11y`; complete the relevant sections of `docs/a11y-manual-checklist.md` (keyboard, skip link, focus, screen-reader, 400%/320px zoom, text-spacing override, forced-colors, reduced motion, alt review).

## Verify
- `pnpm test:a11y` · `pnpm quality:page`
- Release: `pnpm quality:release` (Lighthouse a11y ≥ 0.95)
- Manual: the matching sections of `docs/a11y-manual-checklist.md` (automated tests do not cover keyboard traps, screen-reader output, zoom/reflow, text-spacing, forced-colors, reduced motion, or alt quality).

## Definition of done
- Meets WCAG 2.2 AA for the touched area; FND-A11Y-01 satisfied (non-waivable).
- One `<main>`, one `<h1>`, logical headings, correct landmarks.
- Full keyboard operability, no traps; visible unobscured focus in every theme mode; targets ≥ 44×44.
- Contrast ≥ thresholds; labels/errors associated and announced; alt correct; motion/language/DIR correct.
- `test:a11y` + `quality:page` green; relevant manual-checklist sections completed.

## Never do (banned patterns)
- Use clickable `<div>`/`<span>` for links or buttons.
- Placeholder-only labels; hover-only content; removed focus styles (`outline: none` without replacement).
- Color-only state signaling; meaningless ARIA; `aria-hidden` on focusable elements.
- Hide critical content on mobile (also an SEO/indexing problem).
- Drop to the 24px target floor without a genuine exception + escalation.
- Use visual CAPTCHA without an audio alternative (FND-A11Y-10).
- Hardcode user-visible/a11y strings (use `t()` + `a11y.*` keys).
- Set wrong `htmlLang`/`dir` or rely on wrong-language fallback.
- Ignore `prefers-reduced-motion` (autoplay, parallax, blinking).
- Use physical CSS direction properties for focus offsets/positioning.
- Emit `<head>` tags or JSON-LD outside the `Page` primitive.

## Escalation triggers
- A requirement conflicts with FND-A11Y-01 (non-waivable) or any AA criterion → **do not proceed**; escalate. No waiver can weaken a11y.
- A touch target genuinely can't meet 44×44 and the WCAG 2.5.8 exception is the only path → escalate with the specific exception (Spacing/Equivalent/Inline/User Agent/Essential).
- An interactive widget has no native equivalent (custom tabs/menu/combobox) → follow the WAI-ARIA pattern exactly; escalate if the pattern can't be met within the primitive model.
- A third-party embed (consent banner, map, video) introduces a11y defects you can't fix in-repo → escalate (gate it on consent + an accessible alternative).
- A CAPTCHA is mandated → escalate to choose an accessible mitigation (FND-A11Y-10); don't ship a screen-reader-blocking gate.
