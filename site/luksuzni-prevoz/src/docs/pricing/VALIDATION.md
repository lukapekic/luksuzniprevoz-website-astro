# Package Validation

Prepared: 2026-08-30

## Automated package checks

- UI addition key parity SR/EN/RU: PASS
- Serbian source digest: `efbdb5a9f5bbdc38`
- English source digest match: PASS
- Russian source digest match: PASS
- Content frontmatter YAML parse: PASS
- UI additions JSON parse: PASS
- Wireframe HTML parse: PASS
- Wireframe H1 count: 1
- Wireframe city-to-city fare content: ABSENT
- Wireframe public per-kilometre tariff group: ABSENT
- Wireframe airport + hourly + half-day + full-day structures: PRESENT

## Current publication state

Private Chauffeur hourly/half-day/full-day currency is encoded by
`VehiclePricing.currency` in canonical `pricing.ts`. The pricing consistency
guard also enforces the published-pricing/quote-only fleet boundary.

The full authored content is:

```text
status: published
noindex: false
```

and the Pricing route is:

```text
availability: published
```

The route and all three localized content lifecycle records were transitioned
atomically after the implementation gates passed.

## Production verification evidence

- `verify:ui` Pricing `page` profile: PASS, 19 gates.
- Site Astro check: PASS, zero errors.
- Site production build: PASS; `/cene/`, `/en/pricing/` and `/ru/tseny/` emitted.
- Pricing unit/data tests: PASS.
- Pricing browser suite: PASS in Chromium and Firefox, 26/26 tests.
- Blueprint v1.2 surface ownership: PASS; Airport, Chauffeur, Pricing Models and FAQ are the only four purpose-specific light panels.
- Axe WCAG 2.2/best-practice scan: PASS after removing a duplicate labelled landmark.
- Horizontal overflow: PASS at 320, 768, 1024, 1440 and 1920 CSS px.
- Closing-region grid parity: PASS; Pricing Models, confirmation and FAQ resolve to
  the same `container.main` inline size at desktop, while confirmation prose
  retains `measure.body`.
- Manual full-page refinement review: PASS for English at all five widths, Russian mobile and Serbian tablet portrait.
- Pricing value hierarchy: PASS; existing semantic `xl` role with tabular figures is more prominent than unit metadata.
- WebKit execution: NOT RUN because the host lacks the Playwright WebKit system libraries;
  no browser/system packages were installed as part of page work.

## Wireframe design-system reconciliation

- Shared wireframe base integration: PASS
- Shared responsive-state script integration: PASS
- Local raw palette/type/spacing/radius scale: ABSENT
- Non-approved 4/8 pricing composition: MUST BE ABSENT
- Approved 5/7 tariff composition at `xl`: REQUIRED
- Published Prices heading: OPEN DARK CANVAS
- Airport pricing: INDEPENDENT CONTAINED LIGHT SURFACE
- Private Chauffeur heading: OPEN DARK CANVAS
- Hourly/half-day/full-day pricing: ONE INDEPENDENT CONTAINED LIGHT SURFACE
- Individual pricing: SINGLE ELEVATED DARK FAMILY PANEL
- Pricing Models: ONE CONTAINED LIGHT SURFACE
- Confirmation statement: OPEN DARK READING REGION
- FAQ: HEADING + SHARED ROWS IN ONE CONTAINED LIGHT SECTION
- Final CTA: CONTAINED MEDIUM-HEIGHT CONTENT/MEDIA COMPOSITION
