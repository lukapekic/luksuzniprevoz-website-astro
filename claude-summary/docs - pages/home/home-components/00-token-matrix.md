# Home Component Token Matrix

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Rule

This file maps Homepage component roles to the active semantic design system.

It is **not** a second token source.

Raw values live only in:

```text
site/luksuzni-prevoz/src/theme/versions/version-2/
```

Generated CSS lives in:

```text
site/luksuzni-prevoz/src/theme/generated/theme.css
```

Never copy old V1 palette/radius/font values into Homepage components.

## Theme identity

```text
Theme          → Black & Platinum / version-2
Headings       → Inter Tight
Body / UI      → Manrope
BrandLockup    → Cormorant Garamond Italic
```

## Semantic color roles

Homepage components consume these active semantic roles:

```text
background
surface
surfaceElevated
surfaceLight
inputSurface
accent
accentHover
textPrimary
textMuted
textOnLight
borderSubtle
inputBorder
divider
focusDark
focusLight
selection
success
warning
error
info
disabled
```

The visual direction is graphite + off-white with restrained platinum accent.

Do not use gold-first styling or old warm-charcoal values.

## Geometry roles

Read active values from:

```text
layout.json
spacing.json
radii.json
```

Homepage uses:

```text
main container
reading / narrow measures
page gutter
section spacing: compact / standard / feature
radius: control / card / section
mobile / tablet / desktop grid definitions
approved desktop composition ratios
```

Do not duplicate the numeric values here.

## Responsive behavior

Use active Theme V2 breakpoints.

Design review states remain:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Do not add orientation queries unless a proven layout issue requires them.

## Typography usage

- H1/H2/H3: semantic heading tokens + `font-heading` → Inter Tight.
- Body/supporting copy: semantic body tokens + `font-body` → Manrope.
- Navigation/buttons/controls: Manrope.
- Brand wordmark only: `font-brand italic` → Cormorant Garamond Italic.
- Long copy uses reading/narrow measure tokens.
- No Homepage-local type scale.

## Component matrix

| Component | Surface ownership | Radius role | Section rhythm | Primary layout |
|---|---|---|---|---|
| SiteHeader | transparent over Hero → sticky dark surface | control only | n/a | compact row |
| HomepageHero | **full-bleed** cinematic media; contained inner content | no outer Hero panel radius requirement | feature after | desktop 7/5 content |
| ServiceShowcase | open background | card/media | standard/feature transition | 35/30/35 mosaic |
| ServiceCard | image-backed | card | n/a | overlay content |
| Private Chauffeur | open background | image=card | feature | 5/7 |
| TrustStrip | elevated contained | section | standard | 4 / 2×2 / 1 |
| FleetShowcase | open background | card items | feature | horizontal track |
| HowItWorks | light contained | section | standard | 3 / adaptive / 1 |
| Reviews | open background | card items | standard | 3 / ~2 / swipe |
| FinalCTA | contained neutral graphite gradient | section | feature | 62/38 |
| SiteFooter | dark background | none | compact | 3 cols → stack |

## Global forbidden patterns

- no black/gold limousine styling
- no metallic glow/chrome treatment
- no giant shadows
- no routine hover lift
- no autoplay
- no contained rounded Homepage Hero
- no arbitrary spacing/radius systems
- no raw internal URLs
- no invented contact/fleet/pricing data
- no page-content layout flags that duplicate component contracts
