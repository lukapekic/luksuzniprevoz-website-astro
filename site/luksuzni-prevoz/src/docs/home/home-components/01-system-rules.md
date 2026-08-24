# Home Component System — Exact Implementation Rules

Status: **Aligned to Homepage Blueprint v1.1 + Theme V2**

## 1. Container ownership

Most Homepage sections use the active Theme V2 main container for inner content.

The exception is the Homepage Hero:

```text
full-bleed outer media/surface
+
main-container inner content
```

Do not wrap the Hero's entire media footprint in `PageContainer`.

Footer background may be full width while its content remains contained.

## 2. Section rhythm

Locked order:

1. SiteHeader
2. HomepageHero
3. ServiceShowcase
4. Private Chauffeur
5. Trust
6. Fleet
7. How It Works
8. Reviews
9. FinalCTA
10. SiteFooter

Use Theme V2 semantic section spacing:

```text
Hero → Services: feature
Services → Private Chauffeur: generous feature rhythm
Private Chauffeur → Trust: standard
Trust → Fleet: feature
Fleet → How It Works: standard
How It Works → Reviews: standard
Reviews → FinalCTA: feature
FinalCTA → Footer: standard/compact ending
```

Do not mechanically alternate surfaces.

## 3. Open vs contained

Open:

- Services
- Private Chauffeur
- Fleet
- Reviews

Contained:

- Trust
- How It Works
- FinalCTA

Special:

- HomepageHero = full-bleed outer media with contained inner content.

## 4. Colors

Use Theme V2 semantic color variables only.

Do not duplicate raw palette values.

General mapping:

```text
open dark sections → background + textPrimary/textMuted
contained dark      → surface/surfaceElevated
light contained     → surfaceLight + textOnLight
accent/detail       → restrained accent/platinum
```

## 5. Radius

Use Theme V2 semantic radius roles:

```text
section
card/media
control
```

The full-bleed Homepage Hero does not become a rounded contained panel.

No arbitrary larger rounding.

## 6. Borders / shadows

- Default decorative border: none.
- Use divider/border tokens only where structure requires them.
- No heavy card shadows.
- Prefer surface contrast + spacing.

## 7. CTA styling

Primary and secondary CTA treatments use approved shared Button/component contracts.

Homepage CTA hierarchy:

```text
Primary    → Book a Chauffeur
Secondary  → Request a Quote
Section    → contextual section action
Tertiary   → verified phone/email/WhatsApp
```

Do not hardcode old accent colors/radius values in Homepage files.

Interactive target area must satisfy the project accessibility contract.

## 8. Motion

- Buttons: restrained state change.
- Cards: no routine translate/lift.
- Images: subtle approved brightness/contrast/scale only.
- Hero: optional one-time content entrance + subtle background motion.
- All nonessential movement respects reduced motion.

## 9. Breakpoints

Use Theme V2 breakpoints and responsive-layout skill.

Review:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Do not infer that `lg` automatically means a design is acceptable.

## 10. Accessibility

- Exactly one H1.
- Logical heading hierarchy.
- Keyboard behavior for interactive controls.
- Visible focus stronger than hover.
- Overlay content must maintain WCAG 2.2 AA contrast at each image crop.
- Carousels require labels/controls; no autoplay.
- Header-over-Hero state must preserve contrast.
