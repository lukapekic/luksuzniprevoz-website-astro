---
name: imagery-art-direction
description: Use for image selection, photography roles, vehicle cutouts, crop, focal point, scrims, responsive behavior, asset reuse, and missing-image states.
source-of-truth: DESIGN.md
---

# Imagery Art Direction

## Authority

The locked blueprint defines whether imagery exists and its structural role. `DESIGN.md` defines art direction. The active layout/surface tokens and reviewed component contract define production treatment. Asset availability never authorizes a different composition.

## Image-role contract

For each image document:

- purpose and relationship to adjacent content;
- informative or decorative accessibility role;
- source and verification status;
- crop and focal point at every viewport state;
- overlay/scrim role when needed for legibility;
- intrinsic geometry and delivery priority;
- missing, failed, and low-quality fallback;
- reuse restrictions.

## Rules

- Use imagery to establish context, subject identity, or hierarchy—not as filler.
- Do not reuse the same photograph for unrelated high-prominence roles without explicit approval.
- Preserve important vehicle/person/environment features through responsive crops.
- Do not place text over uncontrolled detail without an approved legibility treatment.
- Do not fabricate logos, clients, locations, services, or operational access through imagery.
- Do not upscale weak assets or conceal low quality with excessive effects.
- Keep decorative imagery out of the accessibility tree; localize informative alt text.
- Coordinate with the production image/performance contract for loading, sources, and layout stability.

## Verification

Review every mandatory viewport, theme mode if applicable, localized text overlay, missing-image state, contrast/focus interaction, and actual optimized output. Run the applicable `verify:ui` profile.
