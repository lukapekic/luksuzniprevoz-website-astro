# Prom Transportation — Locked Wireframe V2

**Status:** LOCKED STRUCTURAL WIREFRAME — CODE-SYNCHRONIZED 2026-08-29

Topology only. Theme V2 and approved shared components own final visual values.

## Desktop — 1440×900 reference

```text
HEADER OVER HERO
↓
FULL-BLEED PROM HERO
┌──────────────────────────────────────────────────────────────────────────┐
│ prom-holding-flowers-mercedes-bg.webp                                   │
│ approved dark Hero scrim                                                │
│ PREVOZ ZA MATURU                                                        │
│ H1                                                                       │
│ concise service definition                                               │
│ [Send Prom request] [Request quote]                                     │
│ · Professional chauffeur · Planned pickup · Manual confirmation          │
└──────────────────────────────────────────────────────────────────────────┘
↓
SERVICE DEFINITION — OPEN DARK
┌────────────────────────────────┬─────────────────────────────────────────┐
│ H2 + intro + body              │ 01 vehicle + chauffeur                 │
│                                │ ──────────────────────────────────────  │
│                                │ 02 individual or group                 │
│                                │ ──────────────────────────────────────  │
│                                │ 03 pickup + confirmed return           │
└────────────────────────────────┴─────────────────────────────────────────┘
↓
PLANNING SCOPE
heading + intro
┌──────────────────────────────────────────────────────────────────────────┐
│ 01 Pickup place and time                                                │
│ ──────────────────────────────────────────────────────────────────────── │
│ 02 Passenger / group plan                                               │
│ ──────────────────────────────────────────────────────────────────────── │
│ 03 Waiting / return if required                                         │
└──────────────────────────────────────────────────────────────────────────┘
↓
ARRIVAL STORY
┌───────────────────────────────────────┬──────────────────────────────────┐
│ H2 + body                             │ prom-closeup-mercedes-background │
│ 01 Pickup                             │                                  │
│ 02 Chauffeur-driven journey           │                                  │
│ 03 Arrival                            │                                  │
│ 04 Agreed return                      │                                  │
└───────────────────────────────────────┴──────────────────────────────────┘
↓
FLEET BY PROM ROLE
[S-Class] [E-Class] [V-Class] [Sprinter]
canonical facts + Prom suitability label
↓
INDIVIDUAL OR GROUP ARRIVAL
┌───────────────────────────────────────┬──────────────────────────────────┐
│ H2 + copy                             │ v-class-interior.webp             │
│ 01 Individual / pair                  │                                  │
│ 02 Group together                     │                                  │
│ 03 Several vehicles                   │                                  │
└───────────────────────────────────────┴──────────────────────────────────┘
↓
PRESENTATION / DETAIL REQUESTS
┌───────────────────────────────────────┬──────────────────────────────────┐
│ flowers-on-console.webp               │ H2 + body                        │
│                                       │ request disclaimer               │
│                                       │ [Include special requirements]   │
└───────────────────────────────────────┴──────────────────────────────────┘
↓
PROM TRANSPORT STANDARDS
01 Professional chauffeur | 02 Prepared vehicle | 03 Individual/group
04 Multi-vehicle          | 05 Waiting/return   | 06 Manual confirmation
↓
HOW BOOKING WORKS
heading on dark
┌──────────────────────┬──────────────────────┬────────────────────────────┐
│ 01 Send details      │ 02 Confirm plan      │ 03 Receive confirmation    │
└──────────────────────┴──────────────────────┴────────────────────────────┘
one light strip
↓
FAQ — ONLY LARGE LIGHT READING REGION
6 questions
↓
FINAL CTA
┌──────────────────────────────────────┬───────────────────────────────────┐
│ H2 + copy                            │ approved FinalCTA media           │
│ [Prom request] [Request quote]       │                                   │
│ verified phone · email               │                                   │
└──────────────────────────────────────┴───────────────────────────────────┘
↓
FOOTER
```

## Tablet portrait — 768×1024

```text
FULL-BLEED HERO
↓
DEFINITION stacked
↓
PLANNING SCOPE one divided panel
↓
ARRIVAL STORY
copy → 4 stages → image
↓
FLEET approved tablet behavior
↓
GROUP ARRIVAL
copy → 3 groups → image
↓
PRESENTATION
copy + CTA → image
↓
STANDARDS exactly 2 columns at active md
↓
PROCESS one stacked light strip
↓
LIGHT FAQ
↓
FINAL CTA
```

## Tablet landscape — 1024×768

```text
FULL-BLEED HERO
↓
DEFINITION split
↓
SCOPE divided panel
↓
ARRIVAL STORY content 7 / media 5
↓
FLEET
↓
GROUP ARRIVAL content 7 / media 5
↓
PRESENTATION media 5 / content 7
↓
STANDARDS 3×2
↓
PROCESS three-column light strip
↓
FAQ
↓
FINAL CTA
```

## Mobile — 320×568

```text
HEADER OVER HERO
↓
FULL-BLEED HERO
PREVOZ ZA MATURU
H1
[Send Prom request]
[Request quote]
trust markers
↓
DEFINITION
H2 + body
01 / 02 / 03 divided
↓
SCOPE
pickup / passengers / return
↓
ARRIVAL STORY
H2 + body
01 Pickup
02 Journey
03 Arrival
04 Return
[image]
↓
FLEET carousel
↓
GROUP ARRIVAL
H2 + copy
01 individual/pair
02 group
03 several vehicles
[image]
↓
PRESENTATION
H2 + copy + disclaimer
[CTA]
[image]
↓
STANDARDS 01–06
↓
PROCESS one light strip, stacked
↓
LIGHT FAQ
↓
FINAL CTA
↓
FOOTER
```

## Image-role contract

### Hero — `prom-holding-flowers-mercedes-bg.webp`

Keep formal-event context and visible vehicle/Mercedes identity. Do not crop to dress-only imagery. Dark scrim owns legibility.
Start with the current shared full-bleed Hero crop behavior; any new focal-point
API requires shared-component impact review rather than page-local styling of
ServiceHero internals.

### Arrival — `prom-closeup-mercedes-background.webp`

Editorial formal-event detail with Mercedes context. No large text overlay.

### Group — `v-class-interior.webp`

Explains travelling together. No capacity/specification overlay.

### Presentation — `flowers-on-console.webp`

Illustrative special-occasion detail. Adjacent copy must state that flowers/decorative details are not automatically included.
The portrait source uses intentional object-cover geometry in the page-local
media region. Preserve the flowers and console focal relationship at every
governed state.

## Surface rhythm

```text
DARK HERO
DARK DEFINITION
DARK SCOPE
DARK ARRIVAL STORY
DARK FLEET
DARK GROUP STORY
DARK PRESENTATION
DARK STANDARDS
DARK PROCESS + LIGHT INNER STRIP
LIGHT FAQ
DARK FINAL CTA
```
