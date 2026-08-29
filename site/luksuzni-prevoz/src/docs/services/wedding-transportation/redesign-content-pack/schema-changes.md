# Wedding Transportation V2 — Schema Changes

**Required schema changes: NONE.**

The current `servicePageSchema` already supports the full Wedding V2 shape:

- `hero`
- `overview.heading`
- `overview.body`
- `overview.items`
- keyed `sections`
- section `items`
- optional section CTA
- `vehicleRecommendations`
- `faq`
- `finalCta`

The existing CTA schema already supports flow targets.

Do not encode layout, image positions, theme values, or Wedding/Prom variants in content schemas. Image roles remain blueprint/implementation-owned static imports from `src/assets/shared/other/`.
