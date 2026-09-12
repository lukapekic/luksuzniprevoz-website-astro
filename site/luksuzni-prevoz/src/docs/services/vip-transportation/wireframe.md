# VIP Transportation — Locked Wireframe V1

**Status:** LOCKED STRUCTURAL WIREFRAME — IMPLEMENTED
**Prepared:** 2026-08-30

This file owns topology and reading order only. The locked blueprint owns content intent and image roles. Localized content, canonical data, shared component APIs, `DESIGN.md` and the active theme own final copy, facts, behavior and visual values.

## Universal reading order

```text
Header over Hero
→ full-bleed Hero
→ service definition
→ service scope
→ discretion and privacy
→ arrivals and aviation
→ vehicle recommendations
→ itinerary coordination
→ service standards
→ arrangement process
→ FAQ
→ Final CTA
→ Footer
```

DOM, screen-reader and keyboard order remain identical to this sequence at every viewport.

## 320×568 — mobile

```text
FULL-BLEED HERO
localized eyebrow
localized H1 + description
primary conversion
secondary conversion
three passive trust markers
↓
DEFINITION
label + H2 + body
three ordered principles
editorial media
↓
SCOPE
label + H2 + body
three divided items
wrapped capability labels
↓
DISCRETION
label + H2 + body
three principles
editorial media
↓
AVIATION
label + H2 + body
three items + one action
primary media
supporting media
↓
VEHICLE RECOMMENDATIONS
shared horizontal carousel
fleet action
↓
ITINERARY
five vertical ordered stages
↓
STANDARDS
six rows / one column
↓
PROCESS
three stacked steps in one light inner strip
↓
FAQ
single light reading region / eight rows
↓
FINAL CTA
content first, media second
```

Requirements: no horizontal page overflow, no horizontal itinerary scroller, full-width stacked Hero actions at the existing narrow breakpoint, and 44×44 interactive targets.

## 768×1024 — tablet portrait

```text
Hero topology unchanged
Definition remains content-first and stacked
Scope remains one divided stack
Discretion remains content-first and stacked
Aviation remains content → primary media → supporting media
Fleet uses shared tablet behavior
Itinerary remains one vertical sequence
Standards use 2 columns
Process remains stacked
FAQ and Final CTA use their shared tablet behavior
```

No media is visually reordered ahead of its explanatory content.

## 1024×768 — tablet landscape / active lg

```text
Definition: approved 7/5 editorial split
Scope: shared divided panel
Discretion: approved 5/7 editorial split
Aviation: approved 5/7 content/media split with subordinate supporting media
Fleet: shared carousel
Itinerary: row one 4/4/4, row two 6/6
Standards: 3×2
Process: 3 equal columns
FAQ: reading container
Final CTA: shared desktop composition
```

The itinerary always remains stages 1–5 in source and visual order. Russian copy wraps within the fixed topology; it never selects a different layout.

## 1440×900 — desktop

Use the same topology as 1024×768. Main and reading containers follow the active theme. Editorial media receives greater footprint only inside the approved split; no additional columns, cards or decorative trackers appear.

## 1920×1080 — wide desktop

No topology expansion. Containers cap at active theme limits, text measures remain bounded, Hero/background media may fill the viewport, and contextual media remains contained by its section composition.

## Surface rhythm

```text
dark Hero
dark editorial sequence
dark Process section with one light inner strip
light FAQ reading region
dark Final CTA
dark Footer
```

FAQ is the only large light page region. The wireframe does not prescribe raw colors, spacing, radii, typography values, asset filenames, localized copy, vehicle names or component internals.
