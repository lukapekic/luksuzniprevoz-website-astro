# Shared Contract — ServiceStandards

Status: **Shared structural contract**

## Purpose

Present operational confidence near the end of the service page without reusing the Homepage TrustStrip identity.

## Default composition

Open dark section.

Desktop:

```text
5 / 7
heading + short statement | divider-led standard rows/grid
```

Tablet/mobile stack naturally.

## Airport outlined-matrix variant

Airport Transportation uses one contained panel with four concise standard
groups in a contiguous outlined matrix. A complete subtle perimeter and
responsive internal dividers define every group, including the first, while
preserving one architectural unit rather than four floating cards. Tablet uses
a deliberate 2×2 topology; mobile uses one column.

## Numbered-matrix variant

`numbered-matrix` presents exactly four marked groups with exactly three visible
facts per group inside one contained dark composition. Mobile and tablet
portrait render a single numbered sequence. At the active `lg` threshold the
component uses a 4/8 heading-to-matrix relationship and a balanced 2×2 matrix.
Cells share subtle internal dividers and never become independent cards. Group
markers are presentational; titles and facts remain localized. Existing
`cards`, `divided-panel`, and `editorial-list` variants retain their current
surface, markup, and responsive behavior.

## Content sources

Primary factual source: `operations.ts`, supplemented only by service-specific verified capability flags from `services.ts`.

## Visual rules

- not a badge wall;
- not a set of floating trust cards;
- restrained divider/detail treatment;
- no security/bodyguard claims where the service data says otherwise.
