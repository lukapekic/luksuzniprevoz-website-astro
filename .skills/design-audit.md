---
name: design-audit
source-of-truth: AGENTS.md
description: Technical, measurable UI audit for theming, accessibility, responsive behavior, implementation integrity, and performance. Reports issues; does not redesign.
---

# Design Audit

This is technical verification, not visual critique.

## Run

```bash
pnpm design:sync:check
pnpm design:doctor --soft
pnpm design:detect <target> --soft
pnpm check
```

Then apply the existing `technical-page-review`, `accessibility-wcag`, `responsive-layout`, `responsive-images-performance`, and `tailwind-v4` skills as relevant.

## Score five dimensions

- Accessibility
- Theming/token integrity
- Responsive integrity
- Implementation/component integrity
- Performance/assets

## Severity

- P0 — blocking, false data, broken task, structural accessibility failure
- P1 — major, WCAG AA failure, theme/component/routing violation
- P2 — minor/system drift that should be fixed
- P3 — polish only

Every finding must include:

- file/line or component;
- impact;
- violated authority/rule;
- concrete fix;
- whether it is deterministic or visual/manual.

Do not report detector output blindly; verify context and note false positives.
