# Shared Contract — ServiceHero

Status: **Shared structural contract**

## Purpose

Provide a cinematic, low-density service entrance with one H1 and clear conversion actions.

## Variants

### `contained`

Used by:

- Airport Transportation
- Business Transportation

All responsive states use one contained image-backed Hero panel.

Conceptual layers:

```text
media
scrim
content
SiteHeader integration where approved
```

### `responsive-split`

Used by:

- Private Chauffeur

Desktop:

```text
content 5 / media 7
```

Tablet/mobile:

```text
contained image-backed Hero
```

## Shared content limits

- exactly one H1;
- short supporting proposition;
- primary action;
- secondary action where blueprint requires it;
- at most one quiet contextual line.

Do not add pricing, fleet specs, trust-chip rows, ratings, or booking forms to ServiceHero.

## Token mapping

Use active semantic tokens for surface, text, spacing, radius, typography, and motion. No raw theme values belong in this contract.

## Responsive requirement

Image focal point/scrim strength are reviewed independently at mobile, tablet portrait, tablet landscape, desktop, and wide desktop.
