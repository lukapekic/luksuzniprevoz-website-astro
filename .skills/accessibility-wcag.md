---
name: accessibility-wcag
description: Use for any perceptible or interactive UI, including semantics, keyboard behavior, focus, forms, navigation, contrast, targets, motion, images, language, and WCAG 2.2 AA review.
source-of-truth: AGENTS.md
---

# Accessibility / WCAG 2.2 AA

## Authority

WCAG 2.2 AA is the minimum. Repository rules can be stricter, including the universal 44×44 CSS px target requirement. Prefer native semantic HTML; ARIA adds missing semantics and never replaces correct native behavior.

## Implementation contract

- One logical H1, non-skipping heading hierarchy, and correct landmarks.
- All functionality keyboard operable with logical focus order.
- Perceivable, unobscured, unclipped `:focus-visible` states.
- Every visible interactive target at least 44×44 CSS px.
- Programmatic control names; forms with labels, instructions, associated errors, and non-color status communication.
- Navigation, disclosure, menu, dialog, and carousel semantics matching behavior.
- Localized purpose-specific alt for informative images; empty alt for decorative images.
- Document `lang` and `dir` from locale configuration.
- Validated semantic contrast tokens and reduced-motion behavior.
- Usable zoom, text enlargement, long localization, errors, missing data, and no-JS behavior.

## Verification

Run the applicable `verify:ui` profile and `pnpm test:a11y`. Automated tests use WCAG 2.2 tags and explicit target-size checks. Complete relevant items in `docs/a11y-manual-checklist.md`; automation does not prove reading order, label quality, focus intent, or cognitive clarity.

Any known WCAG A/AA or target-size failure is P1 or higher and blocks UI completion.
