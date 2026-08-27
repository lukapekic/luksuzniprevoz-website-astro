# Shared Contract — ServiceOverview v2

Status: **Shared structural contract**

## Purpose

Explain what the service is and what its verified service behavior includes before deeper commercial or operational details.

## Variants

### `divider-facts`

Legacy/default editorial relationship for pages whose facts read naturally as independent rows.

Desktop:

```text
5 / 7
heading + concise explanation | compact fact rows
```

### `grouped-icons`

Approved where several low-level capabilities describe one customer-facing concept.

Used by:

- Airport Transportation

Desktop:

```text
5 / 7
editorial explanation | 2-column or single-column grouped icon facts
```

Each group:

- one decorative semantic icon;
- one localized title;
- one concise localized summary;
- may aggregate several canonical capability values;
- must never turn into a floating feature card.

## Grouping rule

Grouping is a view-model concern.

Canonical data still controls truth. UI/content controls presentation wording.

Do not duplicate a single business fact into several visible rows merely because the data model stores separate booleans.

## Visual behavior

The shared overview composition does **not** own the outer page surface. The consuming page blueprint chooses `open-dark`, contained, elevated, or another approved semantic Section composition.

For Airport Transportation v3.1 the page blueprint explicitly places `grouped-icons` inside one compact `contained-dark` architectural panel.

Within the overview composition:

- do not create a second enclosing card around the fact group;
- typography, spacing, dividers, and icon grouping do most of the work;
- icons are restrained and monochrome;
- platinum is used sparingly rather than filling every icon;
- no colorful icon system;
- no badge wall;
- no dashboard grid.

## Data/content

Facts come from verified data sources; editorial explanation and localized labels come from approved content/UI sources.
