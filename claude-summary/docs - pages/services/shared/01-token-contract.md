# Service Page Token Contract

Status: **Semantic reference only — not a token source**

Raw values live in the active theme JSON. Generated CSS lives in:

```text
site/luksuzni-prevoz/src/theme/generated/theme.css
```

Service docs and wireframes reference only these semantic CSS variables.

## Color roles

```text
--color-background
--color-surface
--color-surface-elevated
--color-surface-light
--color-input-surface
--color-accent
--color-accent-hover
--color-text-primary
--color-text-muted
--color-text-on-light
--color-border-subtle
--color-input-border
--color-divider
--color-focus-dark
--color-focus-light
--color-selection
--color-success
--color-warning
--color-error
--color-info
--color-disabled
```

## Typography roles

```text
--font-heading
--font-body
--font-brand
--text-h1
--text-h2
--text-h3
--text-base
--text-ui
--text-caption
--line-height-heading
--line-height-body
--measure-body
--measure-narrow
```

## Spacing roles

```text
--space-*
--space-section-compact
--space-section-standard
--space-section-feature
```

## Radius roles

```text
--radius-control
--radius-card
--radius-section
```

## Layout roles

```text
--container-main
--container-reading
--container-narrow
--gutter-page
--gutter-section
--column-gap-mobile
--column-gap-tablet
--column-gap-desktop
--breakpoint-sm
--breakpoint-md
--breakpoint-lg
--breakpoint-xl
--breakpoint-2xl
```

## Motion roles

Use active `--duration-*`, `--ease-*`, and `--motion-*` variables where motion is approved.

## Rule

If the active theme changes, update the theme tokens—not these blueprints.
