# Home Component Token Matrix

Status: Locked for Homepage V1
Sources: `docs/home/reference/blueprint.md` + `docs/home/reference/wireframe.html`

## Rule

Use the project's generated theme variables/tokens. The literals below are the locked V1 values from the approved project design system and homepage references. If generated variable names differ, map to the existing token that resolves to the same semantic value. Do not create duplicate token systems.

## Core colors

| Semantic role | Locked V1 value |
|---|---:|
| page background | `#171310` |
| surface | `#211B17` |
| elevated surface | `#2A221D` |
| light surface | `#F3EDE3` |
| input surface | `#FAF6F0` |
| accent | `#C49A58` |
| accent hover | `#D2AA68` |
| text primary | `#F5EFE6` |
| text muted | `#C8BCAF` |
| text on light | `#211B17` |
| subtle border | `#3A302A` |
| divider | `#332A24` |
| focus dark | `#E0B86F` |
| focus light | `#7A5525` |

## Core geometry

| Token role | Locked V1 value |
|---|---:|
| main container | `80rem` |
| reading width | `57.5rem` |
| page gutter | `clamp(1rem, 3vw, 2rem)` |
| section compact | `clamp(3rem, 5vw, 4rem)` |
| section standard | `clamp(4rem, 7vw, 6rem)` |
| section feature | `clamp(5rem, 9vw, 8rem)` |
| section radius | `1rem` |
| card radius | `0.75rem` |
| control radius | `0.5rem` |

## Base spacing scale

Use the actual spacing scale from project tokens. For this Home contract, map these roles to the project's numeric tokens:

| Role | Intended value |
|---|---:|
| `space-2` | `0.5rem` |
| `space-3` | `0.75rem` |
| `space-4` | `1rem` |
| `space-5` | `1.25rem` |
| `space-6` | `1.5rem` |
| `space-8` | `2rem` |
| `space-10` | `2.5rem` |
| `space-12` | `3rem` |
| `space-16` | `4rem` |

## Responsive thresholds

Use project breakpoints. The approved wireframe behavior maps approximately to:
- mobile: `< 48rem` / below 768px
- tablet: `48rem–63.999rem`
- desktop: `>= 64rem` / 1024px+
- wide desktop remains capped by `80rem` main container

Do not add orientation queries unless a specific implementation issue requires one.

## Typography usage

Use existing project typography tokens:
- H1: project H1 token
- H2: project H2 token
- H3/card title: project H3 token
- body: project base body token
- small/meta: project small token
- UI/buttons: body/UI font + semibold weight
- headings: Fraunces
- body/UI: Manrope

Locked text treatment:
- H1/H2 tracking around `-0.02em`
- H3 tracking around `-0.01em`
- heading line-height around `1.05–1.15`
- body line-height around `1.55–1.65`
- long copy measure max about `57.5rem`; local component copy should be substantially narrower

## Component matrix

| Component | Surface | Outer radius | Section spacing | Primary layout |
|---|---|---|---|---|
| SiteHeader | transparent → background/surface | none | n/a | 3-part row |
| HomeHero | image-backed cinematic | section | feature after | desktop 7/5 content placement |
| ServiceShowcase | open background | none | feature | 35/30/35 mosaic |
| ServiceCard | image-backed | card | n/a | overlay content |
| Private Chauffeur | open background | image=card | feature | 5/7 |
| TrustStrip | elevated | section | standard | 4 / 2x2 / 1 |
| FleetShowcase | open background | card items | feature | horizontal track |
| HowItWorks | light surface | section | standard | 3 / adaptive / 1 |
| Reviews | open background | card items | standard | 3 / ~2 / swipe |
| FinalCTA | cinematic gradient | section | feature | 62/38 |
| SiteFooter | dark background | none | compact | 3 cols → stack |

## Global forbidden patterns

- no glassmorphism
- no gold borders
- no giant shadows
- no hover lift/scale on cards
- no autoplay
- no full-bleed Home hero
- no arbitrary new spacing/radius values
- no raw internal URLs
- no page-content layout flags
