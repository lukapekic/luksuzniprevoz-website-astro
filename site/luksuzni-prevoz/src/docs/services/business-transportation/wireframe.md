# Business Transportation Hub — Locked Wireframe V2

**Status:** LOCKED STRUCTURAL WIREFRAME

This file defines topology, hierarchy, grouping, media footprint, and responsive stacking. Production visual values come from Theme V2 tokens and approved component contracts.

## Desktop — 1440×900

```text
HEADER
↓
BUSINESS HERO
┌─────────────────────────────────────────────────────────────────────────┐
│ FULL-BLEED CINEMATIC BUSINESS MEDIA + OVER-HERO HEADER                  │
│ eyebrow                                                                 │
│ H1                                                                      │
│ description                                                             │
│ [Choose business service] [Request a quote]                             │
│ · Professional chauffeurs · Manual confirmation · Discreet service      │
└─────────────────────────────────────────────────────────────────────────┘
↓
BUSINESS PROPOSITION
┌──────────────────────────────────┬──────────────────────────────────────┐
│ H2 + body                        │ principle 1                          │
│                                  │ ───────────────────────────────────  │
│                                  │ principle 2                          │
│                                  │ ───────────────────────────────────  │
│                                  │ principle 3                          │
└──────────────────────────────────┴──────────────────────────────────────┘
↓
BUSINESS SERVICES — #business-services
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ 01 Corporate         │ │ 02 Delegation        │ │ 03 Conference        │
│ media                │ │ media                │ │ media                │
│ body                 │ │ body                 │ │ body                 │
│                      │ │                      │ │                      │
│ one-off              │ │ multiple vehicles    │ │ airport arrivals     │
│ recurring            │ │ mixed classes        │ │ hotel transfers      │
│ invoicing            │ │ coordination         │ │ venue shuttles       │
│ negotiated terms     │ │                      │ │ multi-vehicle sched. │
│ CTA →                │ │ CTA →                │ │ CTA →                │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
↓
ENGAGEMENT — DARK
┌──────────────────────────────────┬──────────────────────────────────────┐
│ One-off request                  │ Recurring Corporate Transportation   │
│ body                             │ body + Corporate CTA →               │
└──────────────────────────────────┴──────────────────────────────────────┘
↓
COORDINATION
┌──────────────────────────────────┬──────────────────────────────────────┐
│ H2 + body                        │ contextual business media            │
│ 08:30 Hotel pickup               │                                      │
│ 09:00 Business meeting           │                                      │
│ 12:30 Partner lunch              │                                      │
│ 14:00 Second business location   │                                      │
│ 17:00 Airport                    │                                      │
└──────────────────────────────────┴──────────────────────────────────────┘
↓
CLIENT PROOF
[President Palace] [Hyatt Regency] [Qatar Airways] [Square Nine]
real approved logos only; Chinese Embassy remains absent
↓
FLEET BY BUSINESS ROLE
[S-Class] [E-Class] [V-Class] [Sprinter]
role label beneath canonical vehicle name
↓
BUSINESS STANDARDS
01 Professional chauffeur | 02 Discretion | 03 Multi-vehicle coordination
04 Mixed vehicle classes  | 05 Schedule continuity | 06 Manual confirmation
↓
HOW IT WORKS
01 Send schedule ── 02 Receive organisation ── 03 Receive confirmation
↓
FAQ — ONLY LARGE LIGHT REGION
Q1 + / Q2 + / Q3 + / Q4 + / Q5 + / Q6 +
↓
FINAL CTA
┌──────────────────────────────────────┬──────────────────────────────────┐
│ H2 + copy                            │ CTA media                        │
│ [Business request] [Request quote]   │                                  │
│ phone · email                        │                                  │
└──────────────────────────────────────┴──────────────────────────────────┘
↓
FOOTER
```

## Tablet portrait — 768×1024

```text
HEADER
↓
HERO
↓
PROPOSITION
body
principle 1
principle 2
principle 3
↓
SERVICES
01 full width
02 + 03 side by side
↓
ENGAGEMENT
one-off
recurring + Corporate CTA
↓
COORDINATION
copy
timeline
media
↓
CLIENT PROOF in two columns
↓
FLEET
↓
STANDARDS
01 02
03 04
05 06
↓
PROCESS
01
02
03
↓
LIGHT FAQ
↓
FINAL CTA
↓
FOOTER
```

## Tablet landscape — 1024×768

```text
HEADER
↓
FULL-BLEED HERO + OVER-HERO HEADER
↓
PROPOSITION split
↓
SERVICES: three columns only when readable
↓
ENGAGEMENT: two columns
↓
COORDINATION split
↓
CLIENT PROOF in four columns
↓
FLEET
↓
STANDARDS 3×2
↓
PROCESS three columns
↓
LIGHT FAQ
↓
FINAL CTA
↓
FOOTER
```

## Mobile — 320×568

```text
HEADER
↓
FULL-BLEED HERO + OVER-HERO HEADER
eyebrow
H1
description
[Choose service]
[Request quote]
· trust
· trust
· trust
↓
PROPOSITION
H2 + copy
principle 1
principle 2
principle 3
↓
SERVICES
[01 Corporate image/body/chips/CTA]
[02 Delegation image/body/chips/CTA]
[03 Conference image/body/chips/CTA]
↓
ENGAGEMENT
one-off
recurring
Corporate CTA
↓
COORDINATION
H2 + copy
08:30
09:00
12:30
14:00
17:00
media
↓
CLIENT PROOF in two columns
↓
FLEET
↓
STANDARDS
01
02
03
04
05
06
↓
PROCESS
01
02
03
↓
FAQ — LIGHT
↓
FINAL CTA
primary
quote
phone · email
↓
FOOTER
```

## Service-card anatomy

```text
media
scrim
01
localized title
localized commercial body
canonical capability label
canonical capability label
canonical capability label
localized CTA →
```

Capability labels come from `services.ts` plus `content/ui`, not page frontmatter.

## Coordination timeline

```text
08:30  Hotel — pickup
  │
09:00  Business meeting
  │
12:30  Lunch with partners
  │
14:00  Second business location
  │
17:00  Airport
```

Timeline text stays semantic.

## Surface rhythm

```text
DARK HERO
DARK OPEN PROPOSITION
DARK IMAGE-LED SERVICES
DARK ENGAGEMENT
DARK COORDINATION
DARK CONDITIONAL CLIENT PROOF
DARK FLEET
DARK STANDARDS
DARK PROCESS
LIGHT FAQ
DARK FINAL CTA
DARK FOOTER
```
