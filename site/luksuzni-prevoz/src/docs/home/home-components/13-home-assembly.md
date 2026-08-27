# Home Page Assembly — Locked V1.1

## Exact order

1. SiteHeader
2. HomepageHero
3. ServiceShowcase
4. Private Chauffeur Feature
5. TrustStrip
6. FleetShowcase
7. HowItWorks
8. GoogleReviews
9. FinalCTA
10. SiteFooter

## Hero/Header integration

At page top:

```text
SiteHeader overlays/integrates with full-bleed HomepageHero
```

There is no separate opaque Header strip above the Hero.

Hero media is full viewport width; Hero content is aligned to the main inner container.

## Spacing sequence

- Header → Hero: integration/overlay, not a normal section gap.
- Hero → Services: feature.
- Services → Private Chauffeur: feature rhythm.
- Private Chauffeur → Trust: standard.
- Trust → Fleet: feature.
- Fleet → How It Works: standard.
- How It Works → Reviews: standard.
- Reviews → FinalCTA: feature.
- FinalCTA → Footer: standard/compact ending.

## Visual surface sequence

```text
full-bleed cinematic Hero
→ open image mosaic
→ open editorial split with one compact graphite package inset
→ elevated contained Trust
→ open Fleet
→ light contained How It Works
→ open Reviews
→ contained graphite FinalCTA
→ compact dark Footer
```

## Responsive checkpoints

Review at minimum:

- narrow/common mobile;
- tablet portrait;
- tablet landscape;
- desktop;
- wide desktop sanity check.

At all widths:

- no accidental page horizontal overflow;
- carousel overflow remains contained to its viewport;
- no clipped focus rings;
- no copy clipped to preserve fixed heights;
- Hero media remains full bleed;
- Header/Hero contrast remains valid.
- Hero, sections and CTA motion reduce to static presentation under `prefers-reduced-motion`.
