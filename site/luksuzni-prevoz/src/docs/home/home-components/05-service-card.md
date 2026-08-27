# ServiceCard — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

ServiceCard is a reusable image-backed service primitive. It must consume active Theme V2 semantic tokens rather than redefining visual values locally.

Relevant skills:

```text
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/imagery-art-direction.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

## Geometry

- full-card contextual image;
- card/media radius comes from the Theme V2 semantic `card` radius role;
- overflow is clipped to the card boundary;
- no visible decorative production border by default;
- no heavy shadow.

The Homepage ServiceShowcase determines card footprint. ServiceCard must not hardcode Homepage mosaic widths.

## Content placement

Content is anchored toward the lower portion of the image with spacing derived from Theme V2 spacing tokens.

The internal stack contains:

- service heading;
- optional concise supporting copy where the approved composition allows it;
- clear service CTA.

Do not duplicate literal inset/gap values in this contract. Use the active spacing scale and preserve the wireframe's compact lower-overlay relationship.

## Scrim

- full-card readability gradient/scrim;
- stronger treatment is permitted for the smaller Business / Special Events footprints;
- scrim exists for contrast, not as a decorative opaque block;
- use semantic Theme V2 colors/color-mix behavior rather than raw black/old V1 values.

## Typography / color

- title uses semantic heading typography (`font-heading` → Inter Tight);
- support/CTA UI uses Manrope through the shared type system;
- title uses `textPrimary` or the equivalent semantic high-contrast role;
- support uses `textMuted` where contrast remains compliant;
- no local font-family declarations;
- no raw palette values.

## Interaction

- card remains physically still;
- no routine translate/lift;
- no card-scale hover;
- image may use a restrained brightness/contrast treatment if approved;
- focus-visible must be more explicit than hover;
- reduced-motion rules apply to nonessential image transitions.

## Image

- contextual photography uses cover behavior;
- explicit focal positioning is required when crop matters;
- image remains edge-to-edge;
- image role/crop follows `.skills/imagery-art-direction.md`;
- responsive delivery follows `.skills/responsive-images-performance.md` when production assets are wired.

## Accessibility

Prefer one clear navigational target.

If the whole card is a link, do not nest another interactive CTA inside it. Preserve semantic service headings and meaningful localized image alternatives where the image is not decorative.

When multiple cards share a concise visible CTA label, include the localized service title in visually hidden link text so every destination has a descriptive programmatic and crawler-readable name.

## Forbidden

- local gold/platinum hex values;
- local radius literals;
- hardcoded route strings;
- nested interactive targets;
- pricing inside the service card;
- hover lift or glow effects.
