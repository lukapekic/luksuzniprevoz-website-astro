# HomepageHero — Exact V1.1 Contract

## Outer shell

The Homepage Hero is **full bleed**.

```text
viewport-width media/surface
+
contained inner content aligned to Theme V2 main container
```

Do not implement it as a rounded 80rem panel.

The previous contained `16:7` Homepage Hero contract is obsolete.

## Header relationship

At page top:

- SiteHeader visually overlays/integrates with Hero.
- Header is transparent/near-transparent.
- No opaque strip separates Header from Hero.
- Header remains above Hero content/media in the stacking order.
- Sticky scrolled state belongs to SiteHeader, not to a fake Homepage wrapper.

## Sizing

Desktop:

- near-viewport-height;
- content must determine minimum safe height;
- never clip copy to preserve a visual ratio.

Mobile:

- content-defined/tall cinematic height is acceptable;
- both CTAs must remain discoverable;
- image crop must preserve readable negative space.

## Desktop content grid

Inner content preserves the approved wireframe relationship:

```text
7fr 5fr
```

- left: H1 + proposition + two CTAs;
- right: concise support/trust statement;
- image remains one full Hero background, never a right-side image column.

If the split becomes cramped at tablet portrait, collapse/adapt rather than forcing it.

## Layering

Required conceptual stack:

```text
media        z-lowest
scrim        above media
content      above scrim
SiteHeader   above Hero layers at page top
```

When content exists in source but is hidden, inspect:

- Astro scoped-style ownership;
- PageContainer/Container class forwarding;
- `position`;
- `z-index`;
- transform/filter/isolation stacking contexts;
- parent overflow.

Do not diagnose "missing content" without source evidence.

## Inner spacing

Use Theme V2 page gutters/spacing.

Top content spacing must account for the overlaid Header without creating a separate visible Header band.

## Surface / image

- Full-width S-Class contextual image.
- Cover behavior with explicit focal point.
- Stronger restrained scrim behind left copy.
- Controlled treatment behind right statement.
- No glow.
- No gold/platinum tint over the whole image.
- Preserve vehicle focal subject.

## Colors

Use Theme V2 semantic tokens:

- H1/support: textPrimary/textMuted as contrast permits;
- dividers/details: divider/textMuted;
- actions: shared approved Button contract.

## Typography

- H1: Inter Tight / semantic H1 token.
- Supporting/body/UI: Manrope.
- H1 target: approximately two desktop visual lines where localized copy permits.
- Brand Cormorant does not appear in Hero copy.

## CTA contract

Exactly two prominent actions:

1. Book a Chauffeur.
2. Request a Quote.

Do not replace Request a Quote with Fleet or an unrelated action.

## Motion

- One-time content entrance only.
- Subtle image zoom/pan allowed.
- Reduced-motion behavior required.

## Forbidden

- badges;
- ratings;
- booking form;
- feature-icon row;
- fleet specs;
- pricing;
- separate image column;
- contained rounded Homepage Hero panel.
