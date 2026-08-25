---
name: design-craft-floor
description: Final project-specific quality floor to load immediately before production UI editing.
---

# Luxury Transportation — Craft Floor

Apply after direction is settled. It is a floor, not a new design direction.

## Verify in the built result

- The locked blueprint is complete.
- Semantic theme tokens own color, spacing roles, typography roles, radius roles, containers, breakpoints, and motion.
- Heading/UI/brand typography roles follow the active theme.
- Shared reviewed components keep their identity.
- Surface rhythm uses hierarchy and whitespace before decoration.
- Cards exist only when they represent real bounded objects or functionality.
- Buttons and links have correct semantic roles and visible keyboard focus.
- Real localized copy is tested at mobile, tablet portrait, tablet landscape, desktop, and wide desktop states.
- Images use the role defined by the blueprint/component contract, not arbitrary decoration.
- Missing operational facts, prices, client permissions, or assets remain data-gated; never invent them.
- `prefers-reduced-motion` behavior remains intentional.
- No Theme V1 terminology or styling leaks into production.

## Absolute project bans unless a locked authority explicitly overrides them

- raw palette values in production UI when a semantic token exists;
- page-local redesigns of SiteHeader, SiteFooter, FinalCTA, or other reviewed global components;
- manual localized URLs;
- arbitrary new font families;
- decorative glow/gradient/effect layers added merely to make a section feel "premium";
- nested card systems;
- wireframe colors/radii/pixels copied as production styling;
- invented testimonials, prices, client claims, permissions, or service guarantees.

## Finish discipline

Use bounded visual QA:

1. build fully;
2. inspect required viewport classes together;
3. fix the complete defect batch;
4. one confirmation pass;
5. stop.

Do not enter open-ended micro-polish loops.
