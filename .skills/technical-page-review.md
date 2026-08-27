---
name: technical-page-review
description: Use as the final technical page gate. Produces an evidence-backed PASS/FAIL across architecture, routing, content, SEO, schema, accessibility, responsive behavior, images, performance, and governance.
source-of-truth: AGENTS.md
---

# Technical Page Review

## Authority

Use `AGENTS.md`, the exact surface context, and machine-readable governance profiles. This review aggregates evidence; it does not redefine requirements.

## Procedure

1. Resolve the exact target and surface.
2. Review architecture/data ownership and generated-file integrity.
3. Verify route and locale parity, route-derived URLs, switching, breadcrumbs, and hreflang.
4. Verify metadata, canonical/indexability, internal links, sitemap behavior, and visible-content-aligned structured data.
5. Verify WCAG 2.2 AA, 44×44 targets, keyboard/focus, semantics, contrast, motion, language, and manual checklist evidence.
6. Verify all five responsive states, content order, images, CTA placement, and zero accidental overflow.
7. Verify optimized images, reserved geometry, LCP priority, justified client code, and configured budgets.
8. Run `pnpm verify:ui --target <target> --surface <surface-id> --change page`.

## Verdict

Report:

- `PASS` or `FAIL`;
- blocking findings with rule ID and exact location;
- P2 findings and exception status;
- commands actually run and results;
- automated versus manual evidence;
- unresolved data, asset, environment, or blueprint issues.

Never infer a gate, browser, viewport, locale, or manual check passed. Any unresolved P0/P1 is `FAIL` unless an explicit authority documents a permitted exception.
