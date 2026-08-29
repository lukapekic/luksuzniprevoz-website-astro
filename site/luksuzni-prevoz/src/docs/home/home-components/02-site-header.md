# SiteHeader — Exact V1.2 Contract

## Geometry

Desktop:

- minimum visual row height: about `4.25rem`
- grid: `auto 1fr auto`
- horizontal gap: `space-4`
- initial top inset: about `space-3`
- inner horizontal alignment: main shell/gutter

Mobile:

- minimum visual row height: about `3.75rem`
- gap: `space-3`
- visible Book CTA target about `2.25rem` visual height minimum, while preserving WCAG target-area requirements

## Surface states

Top:

- fully transparent over Hero only if contrast is valid through the Hero top scrim
- no bottom border or shadow

Sticky:

- visually compact translucent Theme V2 background/surface
- text: primary
- restrained backdrop blur
- no bottom border or shadow
- no outer radius
- preserve outer geometry while compacting the visual inner bar so the transition causes no layout jump

## Content

Left:

- GS vector mark only
- the home link keeps the public brand name as its accessible name

Center desktop:

- main nav

Right:

- SR / EN / RU
- Book CTA

Mobile:

- GS vector mark
- Book CTA
- menu trigger
- language selector may move into menu

## Dropdowns

Only:

- Business
- Special Events

Keep restrained. No promotional cards or mega-menu.

## Tokens

- background sticky: page background/surface
- text: textPrimary
- muted: textMuted
- CTA: approved shared Button treatment using Theme V2 tokens
- radius controls: control radius
- focus on dark: focusDark

## Interaction

Sticky transition must not cause layout jump.
Menu panel:

- full-height
- keyboard focus managed
- ESC close where implemented
- restore focus to trigger
- no hidden child links behind accordion by default
