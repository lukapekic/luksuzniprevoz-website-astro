# Service Pages — Responsive Rules

Status: **Shared acceptance contract**

Every page is reviewed at:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

## Rules

- responsive behavior follows active theme breakpoints;
- mobile is a designed state, not collapsed desktop;
- tablet portrait and landscape must both be intentional;
- preserve heading hierarchy, content order, readable measure, CTA targets, image focal points, and semantic grouping;
- no accidental horizontal page overflow;
- image-backed Heroes require breakpoint-specific crop/focal review;
- use container queries in production when behavior depends on parent width rather than viewport width;
- do not hardcode breakpoint numbers in blueprints.

## Wireframe behavior

Shared `wireframe-responsive.js` reads breakpoint CSS variables from the active generated theme and sets a structural state on `<html>`.
