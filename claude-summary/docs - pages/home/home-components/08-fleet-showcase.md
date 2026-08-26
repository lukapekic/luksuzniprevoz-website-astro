# FleetShowcase — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

FleetShowcase is a Homepage composition built on approved carousel mechanics and canonical fleet data.

Relevant skills:

```text
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/imagery-art-direction.md
.skills/responsive-images-performance.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

Do not duplicate Theme V2 visual values in this document or component.

## Section

- open dark Homepage section;
- uses the blueprint-approved `feature` rhythm;
- whole Fleet section is not wrapped in one large contained panel.

## Heading row

Desktop:

- heading/intro left;
- compact `View Full Fleet` section action right;
- alignment and gap use Theme V2 spacing/layout roles.

Mobile:

- stack heading and section action when required;
- maintain clear hierarchy and accessible target size.

## Carousel viewport / track

- horizontal overflow is intentional only inside the carousel viewport;
- page itself must not overflow;
- track gap comes from Theme V2 spacing;
- no autoplay.

## Visible-card intent

Use container-aware sizing to preserve the blueprint's continuation cue:

```text
desktop → approximately 2.5–3 items visible
tablet  → approximately 1.5–2 items visible
mobile  → approximately 1.1 items visible
```

Exact width values belong to implementation/container logic, not to a duplicated theme contract.

## Fleet item

- restrained semantic surface contrast (`surface` / `surfaceElevated` as appropriate);
- radius uses Theme V2 semantic `card` role;
- no heavy border/shadow;
- model and class remain visually subordinate to the vehicle image;
- only verified facts are rendered;
- no pricing on Homepage fleet cards.

## Vehicle image

- vehicle cutout/presentation image dominates the item;
- transparent vehicle PNGs use contain behavior;
- never crop cutout vehicles with cover;
- preserve full vehicle silhouette;
- use a standardized neutral/dark semantic presentation surface;
- responsive image delivery follows the repository image-performance skill.

The presentation region may retain the blueprint's approximate wide/landscape footprint, but the implementation must not hardcode image behavior that clips the vehicle.

## Meta content

Order:

1. model name
2. vehicle class
3. 2–3 verified compact facts

Spacing/padding use Theme V2 semantic spacing roles.

Fleet facts come from canonical fleet data. Where source data is silent, omit the fact rather than fabricate it.

## Controls

- previous/next controls are keyboard operable;
- controls have programmatic labels;
- disabled/end states are meaningful;
- focus-visible is explicit;
- reduced-motion behavior applies to transitions;
- no autoplay.

## Forbidden

- hardcoded capacities/features;
- Homepage fleet pricing;
- object-cover for vehicle cutouts;
- raw theme values;
- giant shadows/glow;
- decorative badges that are not supported by data.
