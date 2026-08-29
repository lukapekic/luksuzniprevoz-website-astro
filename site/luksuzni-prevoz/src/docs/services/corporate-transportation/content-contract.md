# Corporate Transportation v1 — Content Contract

Status: **LOCKED**

## Production content targets

```text
src/content/pages/corporate-transportation/
  corporate-transportation.sr.md
  corporate-transportation.en.md
  corporate-transportation.ru.md
```

Serbian is source locale.

The source digest is generator-owned. Obtain it only by running:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

Do not preserve or manually copy a packet digest.

All entries remain:

```text
status: in-review
translationState: reviewed
noindex: true
```

until page acceptance passes.

## UI additions

`ui-additions/*.json` are merge fragments.

Merge into existing:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Never replace the dictionaries.

## Existing keys that MUST be reused

```text
business.commercial.oneOff
business.commercial.recurring
business.commercial.estimateRequest
business.commercial.quoteRequest
business.capability.recurringContracts
business.capability.invoicing
business.capability.negotiatedPricing
business.capability.dedicatedChauffeurAcrossStops
business.coverage.outsideQuote
business.hero.trust.manualConfirmation
serviceStandards.group.*
operations.chauffeur.*
operations.vehicle.*
operations.service.*
fleet.class.*
fleet.passengers
fleet.carousel.*
```

## Content ownership

Markdown owns editorial copy: SEO, Hero copy, overview copy, audience copy, engagement descriptions, Working Day copy, coordination heading/body, vehicle-section framing, FAQ questions/non-operational explanations, and FinalCTA copy.

UI JSON owns Corporate section labels, data-derived presentation copy, action labels, itinerary labels, coordination nodes, standards heading/intro, and localized operational FAQ answers.

Typed data owns service capabilities, outside-area handling, fleet facts, operations facts, confirmation mode, routes, and pricing.

The canonical flow map owns the `booking` and `quote` intent vocabulary and
their localized Contact destinations. Content stores flow keys only.

## FAQ token contract

Allowed tokens only:

```text
{oneOffAnswer}
{recurringAnswer}
{commercialAnswer}
{dedicatedAnswer}
{outsideAreaAnswer}
{vehicleAnswer}
{confirmationAnswer}
```

Unknown token = build error.

Unresolved token = build error.

## Source changes

If Serbian editorial copy changes, run the repository digest workflow and re-review EN/RU before restoring reviewed state.

## Publication

Do not publish while either locked shared contextual image is unresolved or replaced by a placeholder.

Do not publish one locale independently.
