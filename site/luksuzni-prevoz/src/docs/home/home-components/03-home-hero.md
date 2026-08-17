# HomeHero — Exact V1 Contract

## Shell
- contained inside main `80rem` shell
- top margin from header: about `space-3`
- radius: `1rem`
- overflow: hidden

## Desktop sizing
- target aspect ratio: `16 / 7`
- min-height: about `32rem`
- max-height: about `35rem`
- content must override ratio if needed; never clip copy

## Desktop content grid
- `7fr 5fr`
- gap: `clamp(2rem, 5vw, 5rem)` or closest project layout token
- align items toward lower/optical center as in wireframe
- left copy max-width about `38rem`
- supporting copy max-width about `31rem`
- right statement aligned toward bottom-right content region
- right statement uses a subtle left divider only if contrast works

## Inner padding
- `clamp(1.5rem, 4vw, 4rem)`
Map to project spacing/gutter tokens where possible.

## Mobile
Below 48rem:
- single column
- min-height about `38rem`
- padding `1.5rem`
- preserve image area/negative space above copy
- CTAs remain visible without scrolling inside hero
- right statement moves below main CTA group
- remove left divider; optional top divider

## Surface/image
- full-panel S-Class background, never separate image column
- object/cover behavior with explicit focal point
- stronger dark gradient behind left copy
- controlled gradient behind right statement
- no glow
- no bright gold overlay

## Colors
- H1: textPrimary
- body: textPrimary or textMuted only when contrast passes
- subtle statement/divider: textMuted/divider
- primary CTA: accent + textOnLight
- secondary CTA: transparent + primary text + subtle border

## Typography
- H1: project H1 token, max ~2 visual desktop lines
- paragraph: base/lg token, 2–3 lines target
- right statement: base/sm depending final length

## Motion
- one-time copy entrance only
- subtle background zoom/pan permitted
- disabled/reduced with prefers-reduced-motion

## Forbidden
badges, ratings, booking form, feature icon row, fleet specs, pricing
