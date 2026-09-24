# SiteHeader — Exact V1.2 Contract

## Geometry

Desktop:

- minimum visual row height: about `4.25rem`
- grid: `auto minmax(0, 1fr) auto`; the navigation track is shrinkable
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
- the translucent surface covers the complete header box so enlarged/wrapped
  navigation never falls outside its contrast-providing background

## Content

Left:

- approved Luksuzni transport symbol and canonical public identity; no GS artwork
- the home link keeps **Luksuzni transport** as its accessible name

Center desktop:

- main nav

Right:

- SR / EN / RU
- Book CTA resolved through the canonical `booking` flow intent

Mobile:

- approved own-brand symbol
- Book CTA
- menu trigger
- language selector may move into menu

The Book CTA uses the canonical localized booking flow. The Header must not
hardcode a route or ignore `navigation.headerPrimaryAction`.

## Enlarged-text compatibility

Normal mobile, tablet portrait, tablet landscape, desktop and wide-desktop
layouts retain their current content and focus order. Navigation links may wrap
within their desktop track when enlarged text requires another line. The action
group remains width-constrained without hiding or shrinking controls.

Explicit local structural exception: a shell container narrower than `16rem`
uses one column in DOM order (brand, then booking/menu actions). This is a
content-fit threshold, not a new viewport/theme breakpoint: a 320 CSS px screen
at the normal font stays in the existing row, while a doubled root font allows
the same controls to wrap. The shell remains gutter-constrained, no information
is removed, and every target retains its minimum size. The sticky background
may be taller than the former compact surface to cover wrapped controls.

Compatibility decision: no public props, CTA targets, menu semantics or client
dependencies change. Verify every header consumer and existing menu/focus tests.

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


### Route availability correction (2026-09-11)

The navigation projection excludes unpublished route destinations. It preserves
published hub entries, branch order, localized labels, all header props and
keyboard behavior. Canonical children remain in service data and the business
hub cards; gated cards use the documented enquiry destination. All header
consumers receive this correction through the shared navigation data, with no
visual component API migration.
