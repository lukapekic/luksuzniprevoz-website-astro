# Manual Accessibility Checklist (FND-A11Y-09)

Automated tests catch many issues, but some accessibility requirements can only be verified manually. Complete this checklist before every release.

---

## 1. Keyboard-Only Walkthrough

Navigate the entire site using only the keyboard (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys).

- [ ] All interactive elements are reachable via Tab
- [ ] Tab order follows a logical, predictable sequence (top-to-bottom, left-to-right)
- [ ] No keyboard traps — every focusable element can be exited
- [ ] Modal dialogs trap focus correctly (Tab cycles within the dialog)
- [ ] Escape closes open modals, menus, and disclosure panels
- [ ] Arrow keys work in composite widgets (tabs, menus, radio groups)
- [ ] Home/End keys work in lists and menus where applicable

## 2. Skip Link

- [ ] A skip-to-content link is the first focusable element on the page
- [ ] The skip link is **visible on focus** (not just on hover)
- [ ] The skip link navigates to the main content area
- [ ] After activation, focus moves to the main content

## 3. Visible Focus Indicator

Check in **every theme mode** (light, dark, and any additional modes).

- [ ] Every interactive control (buttons, links, inputs, selects) shows a visible focus ring on keyboard focus
- [ ] The focus indicator has sufficient contrast against the background (minimum 3:1)
- [ ] The focus indicator is not suppressed by `outline: none` without a replacement
- [ ] Custom focus styles (if any) are at least as visible as the browser default
- [ ] Focus is not lost when switching between theme modes
- [ ] Focus is visible on all components: Button, Link, Input, Select, Dialog, NavList, LanguageSwitcher, Disclosure, Checkbox, Textarea

## 4. Screen-Reader Spot Check

Test with at least one screen reader (NVDA on Windows, VoiceOver on macOS/iOS, or Orca on Linux).

- [ ] Page title is announced correctly
- [ ] Heading hierarchy (h1 → h6) is logical and announced in order
- [ ] Images have meaningful alt text (or empty alt for decorative)
- [ ] Form fields have associated labels
- [ ] Error messages are announced (not just displayed visually)
- [ ] Language switcher announces the current and available languages
- [ ] Breadcrumb trail is announced as a navigation landmark/list
- [ ] Modal dialogs announce their purpose and trap focus
- [ ] Content in non-default languages is announced in the correct language (via `lang` attribute)

## 5. Zoom and Responsive Layout (400% / 320px)

- [ ] At **400% browser zoom**, all content remains readable and functional
- [ ] No content is cut off or overlapping
- [ ] Text reflows into a single column at extreme zoom levels
- [ ] At **320px viewport width**, the layout adapts correctly
- [ ] Horizontal scrolling is never required for reading text
- [ ] Touch targets remain at least 44×44 CSS pixels at all sizes
- [ ] Images scale proportionally and do not overflow their containers

## 6. Text-Spacing Override

Apply the following user stylesheet (per WCAG 1.4.12):

```css
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
  paragraph-spacing: 2em !important; /* via margin-bottom */
}
p {
  margin-bottom: 2em !important;
}
```

- [ ] No text is truncated, clipped, or overlapping
- [ ] All text remains readable
- [ ] UI controls (buttons, inputs) remain functional and not overlapped
- [ ] Navigation items remain accessible

## 7. Windows High Contrast Mode (`forced-colors: active`)

Enable "High Contrast" mode in Windows Settings → Accessibility.

- [ ] All text remains readable against the high-contrast background
- [ ] Borders and outlines are visible (not replaced by invisible colors)
- [ ] Links are distinguishable from body text (underlined or otherwise differentiated)
- [ ] Focus indicators are visible (browsers apply a default in forced-colors mode)
- [ ] Form controls remain usable
- [ ] Images with text overlay remain readable
- [ ] No information is conveyed by color alone

## 8. Reduced Motion (`prefers-reduced-motion: reduce`)

Enable "Reduce motion" in OS accessibility settings.

- [ ] No autoplay animations or videos
- [ ] Transition durations are instant or near-instant (per theme `motion.reduced` values)
- [ ] No parallax scrolling effects
- [ ] No blinking or flashing content
- [ ] Content that was animated still conveys its meaning without the animation

## 9. Alt Text Review

Audit every `<Image>` primitive (or generated `<img>`) on the site.

- [ ] Every informational image has descriptive alt text
- [ ] Decorative images have `role="decorative"` (or `alt=""`)
- [ ] Complex images (charts, infographics) have extended descriptions
- [ ] Alt text is in the correct locale language
- [ ] Alt text does not include redundant phrases like "image of" or "link to"
- [ ] Logo images use the brand name as alt text (e.g., `alt="Acme Corp"`)
- [ ] Icon-only buttons have `aria-label` describing the action

---

## 10. Visual Regression Review (FND-THEME-10)

> The template does not ship an automated VRT pipeline by default (see
> `docs/optional-vrt.md`). Instead, any unintended visual change to a rendered
> primitive must be caught by manual review and — if it changes the visual
> contract — promoted to a **new theme version**.

Compare every rendered primitive against the last released theme version
(`src/theme/versions/<active>/`). Do this before any release that touches
theme tokens, variants, or primitive markup.

- [ ] Render each primitive in **every `allCombinations()` variant** (variant ×
      size × tone, ≤3 axes) in both light and dark theme modes
- [ ] No primitive's rendered appearance changed unintentionally
- [ ] Any **intentional** visual change is recorded as a **new theme version**
      (a new directory under `src/theme/versions/`, not an edit to the existing
      one) — per FND-THEME-10
- [ ] Focus rings, hover, and active states are visually consistent with the
      prior version (or deliberately versioned)
- [ ] RTL layouts render as the mirror of LTR (no asymmetric drift)
- [ ] Typography scale, spacing scale, and radii produce no visible shift at
      the spec's viewport set (320 / 390 / 768 / 1024 / 1440 / 1920)
- [ ] If a visual change is disputed, err toward a new theme version —
      versioning is cheap, silent drift is not

If your team has opted into automated VRT per `docs/optional-vrt.md`, this
checklist item is supplemented (not replaced) by the snapshot diff.

---

## Tools Used

| Tool | Version | Date |
|------|---------|------|
| | | |
| | | |

## Notes

_
_(Document any issues found, workarounds applied, or future improvements.)_
