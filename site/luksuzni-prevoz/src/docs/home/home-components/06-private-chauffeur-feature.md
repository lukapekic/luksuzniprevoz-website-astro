# Private Chauffeur Feature — Exact V1 Contract

## Section
- open dark
- padding-block: section feature
- no outer panel/radius

## Desktop >=64rem
Grid:
- `5fr 7fr`
- gap: `clamp(2rem, 5vw, 5rem)`
- align center

## Tablet
Stack when 5/7 makes copy or CTA cramped.

## Mobile
- single column
- content first
- image second

## Content stack
- accent rule
- H2
- body
- package summary
- CTA

Typical gaps:
- rule -> title: `space-4`
- title -> body: `space-4`
- body -> package summary: `space-5/6`
- package summary -> CTA: `space-6`

## Accent rule
- width about `3.5rem`
- thickness about `0.18rem`
- color: accent

## Package summary
Desktop:
- 3 equal columns
- border-block using divider
- padding-block: `space-4`
- item horizontal padding: about `space-3/4`
- internal vertical separators using divider
- first item no left padding
- last item no right divider

Mobile:
- 1 column
- each item padding-block around `space-3/4`
- horizontal separators
- no card boxes

## Image
- 4:3
- radius `0.75rem`
- cover
- explicit focal point

## Colors
- heading: textPrimary
- body: textMuted
- labels: textPrimary
- supporting package detail: textMuted
- accent: accent

## No pricing duplication
Package labels may describe Hourly / Half Day / Full Day.
Numeric prices must come from pricing data if shown later.
