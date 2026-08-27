---
name: responsive-images-performance
description: Use for production images, crops, responsive sources, LCP/CLS/INP, fonts, hydration, or performance budgets. Enforces Astro asset optimization and evidence-based loading behavior.
source-of-truth: AGENTS.md
---

# Responsive Images and Performance

## Authority

The blueprint and imagery contract define image role and composition. The active theme owns layout values. `foundation.config.ts` owns performance budgets. Inspect the actual production image API before editing; there is no assumed universal image component contract.

## Image contract

- Use Astro asset optimization through the reviewed image-bearing component or `astro:assets` inside that component.
- Do not ship raw `<img>` or `<picture>` where repository lint prohibits it.
- Provide localized, purpose-specific alt for informative images and empty alt for decorative images.
- Give the likely LCP image eager/high-priority behavior; lazy-load non-critical imagery.
- Reserve intrinsic geometry to prevent layout shift.
- Define responsive crop, focal point, and fallback behavior for every required viewport state.
- Keep remote sources explicitly allowlisted and verified.
- Do not upscale unsuitable assets or use CSS to hide oversized delivery.

## Performance contract

- Stay within the configured JS, CSS, font, route, image, and island budgets.
- Hydrate only genuine interactions and include the required island justification.
- Load only used font weights/styles and avoid redundant preload/fetch behavior.
- Diagnose LCP, CLS, and INP from measured evidence rather than visual guesses.
- Preserve useful content and accessibility while optimizing.

## Verification

Run the applicable `verify:ui` profile and release Lighthouse checks when the environment provides them. Inspect generated markup/network behavior for priority, dimensions, responsive sources, lazy loading, font delivery, and client bundles. A budget increase is an architecture decision, not a performance fix.
