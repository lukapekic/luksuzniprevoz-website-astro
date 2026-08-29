# Shared Contract — ServiceHero

Status: **Shared structural contract**

## Purpose

Provide a cinematic, low-density service entrance with one H1 and clear conversion actions.

## Variants

### `contained`

Used by:

- Special Events

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

- pages whose locked blueprint explicitly selects a split service entrance

Desktop:

```text
content 5 / media 7
```

Tablet/mobile:

```text
contained image-backed Hero
```

### `full-bleed`

Used by Airport Transportation, Private Chauffeur, Business Transportation, and Corporate Transportation
where their locked blueprints select the cinematic full-viewport entrance and
over-Hero header integration.

The content grid is grounded in the lower optical region using the same
composition principle as Homepage Hero. The scrim remains strongest behind
copy and header chrome while preserving a visibly brighter central service
subject.

## Shared content limits

- exactly one H1;
- short supporting proposition;
- primary action;
- secondary action where blueprint requires it;
- at most one quiet contextual line.
- optional localized eyebrow where the page blueprint requires one;
- optional tuple of exactly three passive trust markers where the page
  blueprint and canonical data support them.

Trust markers render as quiet semantic text with separators; they are never
chips, badges, ratings, or interactive controls. Do not add pricing, fleet
specs, ratings, or booking forms to ServiceHero.

## Action-resolution contract

`primaryAction` and `secondaryAction` are independently optional resolved
actions. A caller omits an action when its canonical flow destination is not
available. The component then renders no anchor and no empty action wrapper.
Existing callers that supply actions retain the established CTA hierarchy.

## Token mapping

Use active semantic tokens for surface, text, spacing, radius, typography, and motion. No raw theme values belong in this contract.

## Responsive requirement

Image focal point/scrim strength are reviewed independently at mobile, tablet portrait, tablet landscape, desktop, and wide desktop.
