---
name: responsive-layout
description: >
  Mandatory responsive-layout reasoning for Luxury Transportation. Use for any page,
  section, component, image, carousel, form, split layout, grid, navigation, or
  responsive review. Enforces mobile-first design, tablet portrait/landscape review,
  container-query reasoning, and wide-desktop caps.
---

# Luxury Transportation — Responsive Layout

## 0. Mission

Responsive design is not:

```text
desktop layout
→ shrink until it fits
```

It is:

```text
mobile-first information order
→ tablet composition
→ tablet landscape composition
→ desktop composition
→ wide-desktop sanity check
```

## 1. Required review states

Every meaningful page/component must consider:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Typical checkpoints:

```text
~320–375
~390–430
~768
~1024
~1280–1440
2xl sanity check
```

Exact browser sizes may vary.

## 2. Grid foundation

Use:

```text
mobile   4 columns
tablet   8 columns
desktop 12 columns
```

Approved desktop compositions:

```text
12
6/6
5/7
7/5
4/4/4
8/4
3/3/3/3 sparingly
```

Page-blueprint exceptions must remain explicit.

## 3. Mobile first

Base implementation is phone.

Do not build desktop classes first and spend the rest of the task undoing them with max-width variants.

Default complex-section behavior:

```text
single column
content before imagery
comfortable touch targets
no page overflow
```

unless blueprint says otherwise.

## 4. Content order

For split sections:

Desktop can be:

```text
Image | Content
```

while mobile defaults to:

```text
Content
Image
```

if component rules say so.

Do not let DOM order accidentally produce wrong accessibility/reading order.

Use layout ordering carefully.

## 5. Tablet is not a small desktop

Tablet portrait must be reviewed independently.

At ~768px:

- 5/7 splits may be too cramped;
- hero two-column copy may be too dense;
- 3-column steps may reduce readability;
- 3 vehicle cards may not fit.

Stack or reduce columns when required.

## 6. Tablet landscape is not automatically desktop

At `lg`, re-evaluate:

- actual text length;
- locale expansion;
- image crop;
- CTA fit;
- control width.

Blueprint may say:

```text
where space allows
```

Do not activate desktop composition merely because `lg` matched.

## 7. Container queries

Use container queries when component behavior depends on available parent width.

Good candidates:

- ServiceShowcase;
- reusable split components;
- embedded calculator groups;
- trust strips;
- reusable card layouts;
- components used in different parent widths.

Do not use container queries just because Tailwind supports them.

## 8. Viewport breakpoint vs component width

Ask:

> Is this layout change caused by the viewport or by the width available to this component?

If component width:

```text
prefer container-aware behavior
```

If page/global navigation/overall viewport behavior:

```text
viewport breakpoint may be appropriate
```

## 9. Wide desktop

Main content remains capped around:

```text
1280px
```

At `2xl`:

- do not widen body measure;
- do not stretch card rows;
- do not scale typography indefinitely;
- do not enlarge hero indefinitely.

Use additional breathing room around the capped composition.

## 10. Reading width

Longer copy remains constrained around:

```text
~920px
```

or project body measure rules.

Do not let paragraphs become 120-character lines on wide screens.

## 11. ServiceShowcase exception

Homepage desktop mosaic:

```text
35 / 30 / 35-style
```

is a blueprint-specific exception.

Tablet portrait:

```text
2×2
```

Mobile:

```text
1 per row
```

Do not force desktop masonry proportions on mobile.

Use content/container width to decide whether tablet landscape can support the mosaic.

## 12. Hero behavior

Image-backed Hero must review:

- copy width;
- CTA wrapping;
- text-safe negative space;
- focal crop;
- panel height.

Mobile hero may become taller rather than preserving desktop aspect ratio.

Do not preserve `16/7` at the cost of unreadable mobile content.

## 13. CTA behavior

Buttons may wrap or stack when needed.

"May become full-width" means discretionary.

Full-width buttons are not mandatory unless blueprint says so.

Preserve hierarchy:

- primary remains primary;
- secondary remains secondary.

## 14. Carousel behavior

Intentional horizontal overflow is allowed inside carousel viewport only.

Page itself must not overflow horizontally.

Expected visible continuation may be:

```text
desktop  ~2.5–3 items
tablet   ~1.5–2 items
mobile   ~1.1 items
```

when blueprint specifies.

Do not hide overflow so aggressively that continuation affordance disappears.

## 15. Forms/calculator

Desktop:
- structured compact layout;
- field widths reflect task needs.

Tablet:
- 1–2 column groupings.

Mobile:
- single column;
- result immediately follows required inputs;
- no horizontal scroll.

Do not force desktop form row onto mobile.

## 16. Localized content expansion

Serbian, English, and Russian lengths differ.

Do not validate layout using one language only.

At minimum test:
- long nav labels;
- long H1;
- button text;
- section heading;
- card title;
- form labels.

Do not truncate important copy to preserve layout.

## 17. Fixed heights

Avoid fixed heights for text-bearing sections.

Allowed controlled heights:

- cinematic hero with safe min-height;
- media frame;
- carousel media stage;
- map/video where defined.

Footer, FAQ, text splits and mobile CTA should be content-defined.

## 18. Overflow

Check:

- long words;
- language switch;
- nav/dropdown;
- buttons;
- carousels;
- form controls;
- transparent PNG vehicles;
- absolute art;
- pseudo-elements.

No accidental page overflow.

## 19. Touch targets

Compact visual treatment does not permit tiny interaction target.

Mobile controls must remain comfortably tappable.

This includes:
- small text CTAs;
- carousel arrows;
- language switch;
- FAQ controls;
- icon buttons.

## 20. Image crop per breakpoint

Every image-bearing component must consider:

```text
mobile crop
tablet portrait crop
tablet landscape crop
desktop crop
```

Do not assume one object-position works everywhere.

Coordinate with imagery-art-direction skill.

## 21. Responsive acceptance matrix

Before completion:

```text
COMPONENT | MOBILE | TABLET P | TABLET L | DESKTOP | WIDE
Hero
Services
Split
Trust
Fleet
Functional UI
FAQ
Final CTA
Footer
```

Mark each:

```text
pass
needs review
not applicable
```

## 22. Rejection conditions

Reject:

- desktop-only composition;
- skipped tablet portrait;
- skipped tablet landscape;
- wide-desktop stretching;
- wrong content order;
- important mobile content hidden to solve layout;
- page overflow;
- fixed-height clipping;
- carousel causing page overflow;
- one crop used without focal review;
- `lg` treated as automatic desktop approval.

## 23. Completion report

Report responsive review by state, not generic:

```text
MOBILE:
TABLET PORTRAIT:
TABLET LANDSCAPE:
DESKTOP:
WIDE DESKTOP:
OVERFLOW:
LOCALIZATION STRESS:
```
