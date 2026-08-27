---
name: design-review
description: Use for an independent post-implementation visual and UX review. Compares rendered output with the locked blueprint, design authority, active tokens, component contracts, and responsive acceptance states without redesigning by preference.
source-of-truth: DESIGN.md
---

# Design Review

## Authority

Review in this order: locked blueprint, `DESIGN.md`, active semantic tokens, reviewed shared-component contracts, then wireframe geometry. Existing implementation and reviewer taste are not authorities.

## Evidence required

- exact target and surface;
- blueprint compliance matrix;
- rendered mobile, tablet portrait, tablet landscape, desktop, and wide-desktop states;
- relevant interaction states;
- localized Serbian, English, and Russian samples;
- design detector output.

## Review dimensions

Blueprint completeness, hierarchy and CTA priority, component identity, semantic typography, spacing rhythm, surface/radius/accent restraint, imagery behavior, responsive topology, accessibility states, factual/localization integrity, overflow, layout shift, and unnecessary client behavior.

Do not impose hardcoded proportions, containers, radii, or breakpoint values. Resolve those from the blueprint and active system.

## Findings

Report `severity | authority | location | observed evidence | expected contract | bounded correction`. P0/P1 blocks completion. P2 requires correction or an approved recorded exception. Separate automated evidence from visual judgment. Review does not authorize redesign.
