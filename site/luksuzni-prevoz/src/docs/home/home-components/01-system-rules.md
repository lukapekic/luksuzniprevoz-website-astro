# Home Component System — Exact Implementation Rules

## 1. Container
All Home sections except the footer background use the main shell:

```css
width: min(calc(100% - (2 * page-gutter)), 80rem);
margin-inline: auto;
```

Use the project's container/gutter tokens instead of copying this literal CSS when available.

## 2. Section rhythm
The approved V1 order and spacing is:

1. Header
2. Hero
3. Services — `feature`
4. Private Chauffeur — `feature`
5. Trust — `standard`
6. Fleet — `feature`
7. How It Works — `standard`
8. Reviews — `standard`
9. Final CTA — `feature`
10. Footer — `standard` top separation + compact inner rhythm

Do not mechanically alternate surfaces.

## 3. Open vs contained
Open:
- Services
- Private Chauffeur
- Fleet
- Reviews

Contained:
- Hero
- Trust
- How It Works
- Final CTA

## 4. Colors
Open dark sections:
- background: page background `#171310`
- main text: `#F5EFE6`
- supporting text: `#C8BCAF`
- accent: `#C49A58`

Contained elevated:
- background: `#2A221D`

Light contained:
- background: `#F3EDE3`
- text: `#211B17`
- accent: `#C49A58`
- light focus: `#7A5525`

## 5. Radius
- section panels: `1rem`
- cards/images: `0.75rem`
- buttons/controls: `0.5rem`
No arbitrary larger rounding.

## 6. Borders/shadows
- default border: none
- dividers only where blueprint explicitly allows
- divider token/value: `#332A24`
- subtle border token/value: `#3A302A`
- no card shadow unless a later design review proves it necessary

## 7. CTA styling
Primary CTA:
- background accent `#C49A58`
- text `#211B17`
- hover background `#D2AA68`
- radius `0.5rem`
- focus ring appropriate to surface

Secondary CTA:
- transparent/dark surface
- primary text color
- subtle border if required
- same target height as primary

Minimum practical target:
- use project control-height token if one exists
- otherwise do not go below ~2.75rem visual control height for primary Home CTAs

## 8. Motion
- buttons: color/brightness only
- cards: no translate, no scale
- image hover: restrained brightness/contrast only
- hero: optional one-time text entrance + subtle background zoom/pan
- all nonessential movement disabled by reduced motion

## 9. Breakpoints
The wireframe's behavioral transitions are:
- below 768px: mobile stack
- 768–1023px: tablet
- 1024px+: desktop
Use project breakpoint tokens that correspond to these values.

## 10. Accessibility
- one H1 only
- logical H2/H3 hierarchy
- full keyboard behavior
- visible focus stronger than hover
- overlay text must retain AA contrast at each crop
- carousels require labels and controls; no autoplay
