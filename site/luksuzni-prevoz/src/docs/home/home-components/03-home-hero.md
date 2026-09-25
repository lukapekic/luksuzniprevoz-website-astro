# HomepageHero — Exact V1.2 Contract

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

The production `HomePage` offset wrapper sets the layout-only custom property
`--homepage-hero-header-clearance` to the same header-height role used for its
negative offset. `HomepageHero` adds this clearance to its semantic top spacing.
Other consumers (including `dev/ui`) retain zero additional clearance by default.
This is an additive CSS integration contract, not a new visual variant or prop.
At all five viewport states and 200% text, the H1 and actions must start below
the actual header. Media remains full bleed behind it; content may increase the
hero height instead of being obscured. Font roles, 7/5 placement, image crop,
CTA destinations and DOM/focus order remain unchanged.

## Surface / image

- Full-width approved `hero-example-2.jpg` S-Class contextual image.
- Cover behavior with explicit focal point.
- Mobile crop favors the vehicle's front; tablet and desktop receive separately reviewed crops.
- Moderate exposure/saturation reduction establishes a credible low-key dusk character without pretending the daylight scene is literal night.
- Stronger restrained scrim behind left copy.
- Top/bottom settle plus restrained radial vignette protect Header and content while preserving chrome highlights.
- Controlled treatment behind right statement.
- No glow.
- No gold/platinum tint over the whole image.
- Preserve vehicle focal subject.
- The opt-in `center-reveal` scrim keeps the existing full-bleed header,
  text-side, and bottom protection while making only a modest reduction in
  darkness over the centre of the S-Class photograph. A low-opacity base veil
  covers the entire frame, including the far edge where the directional scrim
  fades. The centre remains visibly overlaid; it is not a transparent opening.
  The default scrim remains available and unchanged. This is an
  image-legibility treatment, not a new Hero composition or CTA variant.
- Below `xl` (80rem), content occupies one reading column across the image;
  the reveal therefore keeps stronger localized copy protection over pale sky.
  At `xl` and wider, the 7/5 composition permits the brighter central reveal.
  Both states preserve source and focus order, focal vehicle visibility, and
  text-on-photo contrast at 320/768/1024/1440/1920 CSS px.

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

- One-time staggered content entrance.
- Subtle image zoom/pan enabled.
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

## Animation containment verification (2026-09-11)

The decorative image has its own absolute media wrapper with `overflow: clip`.
The image's existing settle animation is contained within the full-bleed canvas;
copy, actions, focus rings and the header remain outside that wrapper. This fixes
measured horizontal overflow during the image zoom without changing the approved
composition or suppressing page/content overflow. At 320, 768, 1024, 1440 and
1920 CSS px, reading order, CTA placement, crop breakpoints and content-driven
height retain the contract above. There is no shared API change.
