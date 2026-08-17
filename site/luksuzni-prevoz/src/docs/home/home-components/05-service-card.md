# ServiceCard — Exact V1 Contract

## Geometry
- full-card background image
- radius: `0.75rem`
- overflow hidden
- no visible production border
- no heavy shadow

## Overlay
Position toward bottom:
- left/right inset: about `1.2rem`
- bottom inset: about `1.15rem`
Map to nearest project spacing tokens (`space-5` / `space-4` etc.).

Content gap:
- about `space-3`

## Scrim
- full-card bottom gradient
- stronger on the smaller Business/Special cards
- purpose is contrast only; not a decorative black block

## Text
- title: H3/card-heading token, textPrimary
- optional support: small/base textMuted
- CTA: clearly visible UI text, not tiny low-contrast link

## Interaction
- card remains physically still
- no translate
- no scale
- image may adjust brightness/contrast subtly
- focus-visible more explicit than hover

## Image
- contextual photo: cover
- focal point required when crop matters
- background is edge-to-edge

## Accessibility
Prefer one clear navigational target. If whole-card linking is used, do not nest another interactive CTA inside it.
