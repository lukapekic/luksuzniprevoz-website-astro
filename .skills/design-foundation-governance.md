---
name: design-foundation-governance
description: Use for visible UI, design-token, spacing, typography, surface, radius, motion, container, or theme work. Resolves authority and prevents local visual drift.
source-of-truth: DESIGN.md
---

# Design Foundation Governance

## Authority

Apply the visual hierarchy exactly:

1. locked page blueprint;
2. `DESIGN.md`;
3. the theme selected by `foundation.config.ts` and its generated semantic tokens;
4. reviewed shared-component contracts;
5. wireframe geometry.

Skills and current implementation never override those sources.

## Entry

Run `pnpm design:context --target <exact-file> --surface <surface-id>` and read only the authorities returned for the target. If the snapshot is stale, run the approved generator before editing. An unresolved surface or missing required blueprint is blocking.

## Implementation contract

- Resolve theme selection only from the target site's configuration. Never introduce a fallback.
- Consume semantic color, spacing, type, radius, motion, container, and breakpoint roles.
- Put raw theme values only in the active versioned theme source and regenerate outputs.
- Preserve approved component identity during refinements, migrations, accessibility fixes, responsive fixes, and refactors.
- Treat wireframes as topology and relative prominence, not visual token authority.
- Do not convert the page into generic cards, repeated equal-weight bands, or decoration without content purpose.
- Do not invent copy, business facts, translations, assets, or CTA roles to complete a composition.

## Theme changes

Use the theme upgrade sequence in `AGENTS.md`. A theme task is incomplete until configured version, resolved implementation, generated CSS, and `.design/system.json` agree and the `theme` verification profile passes.

## Exit

Run the matching `verify:ui` profile. P0/P1 findings block completion; P2 requires resolution or a documented approved exception.
