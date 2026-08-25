# Manual Accessibility Checklist (FND-A11Y-09)

The production target is **WCAG 2.2 AA minimum**. Automated linting, `astro check`, Playwright/axe checks, and validators catch many failures; the items below require manual verification on representative production pages.

Use real localized content, not placeholder strings.

## 1. Keyboard-only walkthrough

Navigate with Tab, Shift+Tab, Enter, Space, Escape, and Arrow keys where the widget pattern requires them.

- [ ] All interactive elements are keyboard reachable.
- [ ] Focus order follows the visual/logical reading order.
- [ ] There are no keyboard traps.
- [ ] Menus, disclosures, dialogs, and other composites use the expected keyboard interaction.
- [ ] Escape closes dismissible overlays/menus where appropriate.
- [ ] Opening/closing UI does not unexpectedly reset focus.
- [ ] Whole-card visual treatments do not create invalid nested interactive targets.

## 2. Skip link and landmarks

- [ ] The skip-to-content link is the first meaningful focus target.
- [ ] It becomes visible on keyboard focus.
- [ ] Activation moves the user to the main content region.
- [ ] The page has one clear `<main>` landmark.
- [ ] Header/navigation/footer landmarks are semantically identifiable.

## 3. Visible focus on every relevant surface

Theme V2 is dark-first and includes multiple **surface contexts**, not separate light/dark theme modes. Check focus on:

- dark background/surface;
- elevated dark surface;
- intentional light functional surface (`surfaceLight`);
- image/scrim overlays;
- form/input surfaces.

Verify:

- [ ] Every interactive control has a visible keyboard focus indicator.
- [ ] Focus contrast is at least 3:1 against adjacent colors.
- [ ] `outline: none` is never used without an equivalent visible replacement.
- [ ] Focus treatment remains visible on `SiteHeader`, navigation/dropdowns, `LanguageSwitcher`, buttons/links, form controls, FAQ/disclosures, dialogs (if present), carousel controls, and footer links.
- [ ] Focus is not hidden behind sticky/fixed UI.

## 4. Screen-reader spot check

Test at least one current screen reader, for example NVDA, VoiceOver, or Orca.

- [ ] Document title and current language are announced correctly.
- [ ] Heading hierarchy is logical; one page-level H1 is exposed.
- [ ] Informative images have useful localized alt text.
- [ ] Decorative imagery is ignored (`alt=""` and the component's decorative contract).
- [ ] Form fields have programmatic labels and useful instructions.
- [ ] Validation errors identify the field/problem and are announced.
- [ ] Status/success feedback is exposed through the appropriate live-region behavior.
- [ ] Language switching exposes the current language and alternatives clearly.
- [ ] Breadcrumbs, when present, are announced as navigation/list structure.
- [ ] Non-default-language fragments use the correct `lang` when needed.

## 5. Zoom, text resize, and narrow viewport

Check at 200% and 400% browser zoom and at a 320 CSS-pixel viewport.

- [ ] Content reflows without loss of information/function.
- [ ] Reading text does not require horizontal scrolling.
- [ ] Controls are not clipped or overlapped.
- [ ] Navigation remains operable.
- [ ] Touch targets are at least 44×44 CSS pixels where WCAG target-size guidance applies.
- [ ] Images preserve useful composition and do not overflow.
- [ ] Long Serbian/Russian/English labels do not break controls.

## 6. WCAG text-spacing override

Apply a user override equivalent to WCAG 1.4.12:

```css
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p {
  margin-bottom: 2em !important;
}
```

- [ ] Text is not truncated, clipped, or overlapped.
- [ ] Buttons and form controls remain usable.
- [ ] Navigation and localized labels remain readable.
- [ ] Important information is not hidden because a fixed height cannot grow.

## 7. Forced colors / high contrast

Enable Windows High Contrast / `forced-colors: active` where possible.

- [ ] Text remains readable.
- [ ] Focus rings and control boundaries remain visible.
- [ ] Links remain distinguishable from surrounding text.
- [ ] Form controls remain understandable and operable.
- [ ] No meaning relies on color alone.
- [ ] Image-overlay copy still has an understandable fallback/contrast treatment.

## 8. Reduced motion

Enable `prefers-reduced-motion: reduce`.

Theme-generated reduced-motion tokens set motion durations/features to their reduced state. Verify the rendered experience, not only the token values.

- [ ] No essential content depends on animation.
- [ ] No parallax or non-essential cinematic movement remains.
- [ ] No flashing/blinking content is introduced.
- [ ] Hover/focus/expanded-state feedback remains understandable even when motion is removed.
- [ ] Carousels and interactive state changes remain usable without animation.

## 9. Contrast and color

Check computed/rendered colors on each relevant surface.

- [ ] Normal text reaches at least 4.5:1 contrast.
- [ ] Large text reaches at least 3:1.
- [ ] Interactive boundaries/focus indicators meet applicable non-text contrast requirements.
- [ ] Muted copy on dark surfaces uses the semantic theme tokens and remains readable.
- [ ] Text on `surfaceLight` uses the light-surface text tokens, not dark-surface text colors.
- [ ] Text over photography remains readable with the approved scrim/overlay contract.

## 10. Images and media

- [ ] Decorative marketing imagery has empty alt text through the component contract.
- [ ] Informative images have concise, localized alt text.
- [ ] Alt text does not repeat nearby visible text unnecessarily.
- [ ] Logos have an accessible name where they function as identity/navigation.
- [ ] Meaning is not embedded only in an image.
- [ ] Cropping/focal points do not remove information required to understand an informative image.

## 11. Forms (FND-A11Y-10)

For every production form:

- [ ] Every control has a visible/programmatic label.
- [ ] `autocomplete` uses a valid WHATWG token where applicable.
- [ ] Required state is communicated programmatically, not by color alone.
- [ ] Error messages explain both the problem and recovery.
- [ ] Error focus/summary behavior is useful after submission.
- [ ] Success/failure status is announced.
- [ ] Any spam protection remains keyboard and screen-reader accessible.
- [ ] No personal data is placed in query strings.

## 12. Responsive composition and reading order

The visual layout may change between mobile, tablet, and desktop, but semantic order must remain useful.

- [ ] CSS reordering does not create a mismatch between visual and focus order.
- [ ] Split sections stack in the blueprint-approved content/image order.
- [ ] Hidden decorative elements do not create empty accessible content.
- [ ] Desktop-only visual affordances have mobile equivalents where required.

## 13. Final release record

For a significant page/UI release, record:

- pages/routes checked;
- viewport/device classes checked;
- screen reader/browser combination used;
- unresolved accessibility defects;
- any approved waiver reference from `docs/exceptions.md`.

A visual refinement that stays within the active theme tokens and locked component/page contracts does **not** require a new theme version by itself. Theme versioning follows the Theme Ownership and Upgrade Protocol in `AGENTS.md`.

Accessibility failures are not waived by redesign preference. In particular, `FND-A11Y-01` is non-waivable.
