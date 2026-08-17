# ServiceShowcase — Exact V1 Contract

## Section
- open dark
- padding-block: section feature
- heading margin-bottom: `space-8` / about `2rem`
- heading max-width about `42rem`

## Desktop >=64rem
Grid:
- columns: `35fr 30fr 35fr`
- gap: `space-4` / `1rem`
- total mosaic height: `clamp(28rem, 40vw, 34rem)`
- final third is internal stack: `1fr 1fr`, gap `space-4`

Order in DOM:
1. Private Chauffeur
2. Airport
3. Business
4. Special Events

## Tablet 48–63.999rem
- 2 columns
- height auto
- each card min-height about `20rem`
- stacked wrapper may flatten into normal grid items

## Mobile <48rem
- 1 column
- each card min-height about `19rem`
- gap `space-4`
- do not preserve desktop asymmetry

## Heading
- H2: project H2 token
- intro: max one short line target on desktop
- text colors: textPrimary + textMuted

## Cards
Use ServiceCard.
No outer panel around mosaic.
