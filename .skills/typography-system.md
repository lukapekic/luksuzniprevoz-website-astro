---
name: typography-system
description: Use when implementing or reviewing headings, body/UI text, controls, localized copy, brand lockup, font loading, type hierarchy, line length, or text wrapping.
source-of-truth: AGENTS.md
---

# Typography System

## Authority

Use the active semantic typography roles registered by the design system: `font-heading` for headings, `font-body` for body/UI/navigation/forms/controls, and `font-brand` only inside the reviewed `BrandLockup` contract. Font families and raw type values belong to the active theme source.

## Required checks

- Declare one logical H1 and a non-skipping heading hierarchy.
- Use semantic size, weight, line-height, tracking, and measure roles.
- Keep controls legible and consistent with body/UI roles.
- Do not tune layout around fallback-font metrics.
- Do not put brand typography into editorial headings or decorative labels.
- Verify wrapping, truncation, line length, and hierarchy with Serbian Latin, English, and Russian Cyrillic content.
- Verify text zoom and enlarged browser font without clipping or lost controls.
- Confirm computed font family and role for H1, H2, body/UI, controls, and brand lockup.
- Reserve font metrics and loading behavior to avoid layout shift.

## Stop conditions

Do not introduce an arbitrary type scale, raw font family, page-specific tracking system, or reduced font size merely to make content fit. Fix the contract, measure, wrapping, or topology instead.

## Exit

Run the applicable `verify:ui` profile and include computed-style and localization review in manual evidence.
