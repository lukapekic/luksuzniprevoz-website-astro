---
name: imagery-art-direction
description: >
  Governs photography, vehicle imagery, cutouts, responsive crops, focal points, scrims,
  image roles, asset selection, and missing-asset behavior for Luxury Transportation.
  Use for any image-bearing section or visual design review.
---

# Luxury Transportation — Imagery & Art Direction

## 0. Mission

Photography is structural, not decorative.

Every image must have a role.

The goal is natural premium imagery with:

- clear focal subject;
- appropriate negative space;
- restrained grading;
- correct crop;
- correct object-fit;
- purposeful relation to content.

## 1. Image roles

Distinguish these roles.

### Cinematic hero contextual image
- full-panel;
- environmental;
- negative space for copy;
- strong focal subject;
- restrained scrim.

### Contextual split image
- supports explanatory content;
- usually object-cover;
- real service context.

### Service card background
- full-card image;
- title/CTA readable over controlled lower scrim.

### Fleet vehicle cutout
- transparent PNG;
- object-contain;
- standardized neutral/dark stage.

### Final CTA vehicle
- front-facing or otherwise blueprint-approved;
- integrated/blended into panel;
- no hard image-card boundary when blueprint says blended.

Do not substitute one role for another.

## 2. Default ratios

Foundation defaults:

```text
Hero               ~16/7 desktop, taller responsively
Split contextual    4/3
Service/card        3/2
Portrait/context    4/5 blueprint-only
Fleet               16/9 or controlled horizontal stage
Final CTA           flexible panel
```

Blueprint overrides win.

## 3. Object-fit

Contextual photography:

```text
object-cover
```

Vehicle cutouts:

```text
object-contain
```

Never crop transparent vehicle PNGs with object-cover unless explicitly intended.

## 4. Focal-point contract

Every meaningful image-bearing component must consider:

```text
mobile focal point
tablet portrait focal point
tablet landscape focal point
desktop focal point
```

Do not assume:

```text
object-center
```

works everywhere.

## 5. Negative-space requirement

For text-over-image compositions, inspect:

- text-safe region;
- focal subject;
- contrast;
- balance.

Hero image is not successful merely because a Mercedes is visible.

The photograph must support the composition.

## 6. Scrims

Use restrained warm-charcoal scrims where text overlays photography.

Prefer directional/local contrast treatment.

Do not cover the whole image with an unnecessarily opaque dark layer if local treatment is enough.

Do not place copy inside a floating card merely because contrast is hard; first evaluate image crop and scrim.

## 7. Hero identity

Hero must remain cinematic.

Do not:
- separate image into a side card when blueprint says full-panel;
- obscure focal vehicle with oversized H1;
- use a crop where the car is barely recognizable;
- add artificial glow;
- add neon/gold lighting effects;
- add unrelated badges/features over image.

## 8. ServiceShowcase images

Homepage ServiceShowcase:

- full-card image;
- edge-to-edge;
- lower scrim;
- title + compact CTA;
- no separate image region.

This is a homepage-specific exception.

Do not generalize to generic ServiceCard.

## 9. Split images

Split image must materially reinforce content.

Avoid:
- generic luxury interior filler;
- isolated studio vehicle when operational context is required;
- irrelevant city photography.

For Airport Arrival Handling, prefer actual arrival/meet/luggage/terminal context.

## 10. Private aviation imagery

Use:
- FBO/private terminal context;
- discreet premium transport connection;
- aircraft/terminal context where appropriate.

Do not imply:
- security services;
- bodyguard services;
- airport access beyond actual procedure.

## 11. Final CTA

Final CTA is not Hero #2.

Image should:

- occupy roughly 35–40% visual footprint on desktop;
- blend into right side;
- preserve grille/headlight/vehicle identity;
- avoid hard boundary;
- avoid dominating copy.

Do not reuse hero's full background-image treatment.

## 12. Asset reuse policy

Do not reuse the same hero photograph later simply because it is available.

Repeated hero environment in Final CTA weakens visual hierarchy.

Prefer distinct assets matching distinct roles.

## 13. Missing-asset policy

If production asset is missing:

```text
NEUTRAL PLACEHOLDER
>
WRONG ASSET
>
REDESIGN
```

Preserve:

- footprint;
- aspect ratio;
- intended crop role;
- composition.

Do not compensate with:
- random gradient art;
- generic stock;
- duplicated hero image;
- fake vehicle silhouette;
- decorative blobs.

## 14. Vehicle model integrity

Do not display a model different from the confirmed data/blueprint merely because a nicer image exists.

Do not invent model variants.

Use provisional placeholders when fleet data is not final.

## 15. Color grading

Avoid:
- heavy duotone;
- obvious teal/orange;
- extreme desaturation;
- aggressive vignette;
- gold tint over everything.

Aim for natural premium photography integrated into warm-charcoal UI.

## 16. Image hover

Default:

```text
subtle brightness/contrast shift
```

No default scale/zoom.

Image zoom requires component/page exception.

## 17. Responsive crop review

At each breakpoint verify:

- subject not cut awkwardly;
- faces/body not clipped;
- car proportions remain readable;
- text does not cover focal area;
- object-position intentional;
- image height remains balanced with content.

## 18. Transparent PNG stages

Fleet PNGs should share:

- consistent scale;
- consistent vertical alignment;
- consistent visual stage/background;
- consistent padding.

Do not allow one vehicle to look tiny and another oversized due to source-canvas differences.

Normalize presentation at component/data level.

## 19. Alt text ownership

Meaningful imagery receives localized alt text from content/data source.

Decorative imagery is hidden appropriately.

Do not generate alt text from file name alone.

## 20. Asset acceptance checklist

- [ ] correct role;
- [ ] correct subject;
- [ ] correct model where applicable;
- [ ] correct crop;
- [ ] focal point reviewed;
- [ ] negative space supports copy;
- [ ] scrim restrained;
- [ ] no heavy artificial effects;
- [ ] responsive crops reviewed;
- [ ] no unjustified asset reuse;
- [ ] missing asset handled with placeholder rather than redesign.

## 21. Completion report

```text
IMAGE ROLE:
ASSET:
OBJECT FIT:
MOBILE FOCAL:
TABLET P FOCAL:
TABLET L FOCAL:
DESKTOP FOCAL:
SCRIM:
MISSING ASSET:
ALT SOURCE:
```
