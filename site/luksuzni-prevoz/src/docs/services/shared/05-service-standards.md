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

## Airport divided-panel variant

Airport Transportation uses one contained panel with four concise standard
groups separated by responsive dividers. It is visually related to the
Homepage standards/trust treatment: one architectural unit, no floating card
grid. Tablet uses a deliberate 2×2 topology; mobile uses one column.

## Content sources

Primary factual source: `operations.ts`, supplemented only by service-specific verified capability flags from `services.ts`.

## Visual rules

- not a badge wall;
- not a set of floating trust cards;
- restrained divider/detail treatment;
- no security/bodyguard claims where the service data says otherwise.
