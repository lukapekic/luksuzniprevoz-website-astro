# Pricing Page — Package Manifest

## Repository findings used

| Authority | Path | Role |
|---|---|---|
| Technical rules | `AGENTS.md` | architecture, data boundaries, quality gates |
| Visual rules | `DESIGN.md` | Black & Platinum visual authority |
| Functional UI | `.skills/functional-ui.md` | pricing state and no-false-confirmation rules |
| Blueprint execution | `.skills/blueprint-to-ui.md` | locked page workflow |
| Component ownership | `.skills/component-architecture.md` | shared vs page-local rules |
| Responsive design | `.skills/responsive-layout.md` | 320/768/1024/1440/1920 acceptance |
| Technical SEO | `.skills/technical-seo.md` | indexability/canonical/hreflang |
| Multilingual routing | `.skills/multilingual-routing.md` | localized route parity |
| Active theme | version resolved from `foundation.config.ts` | semantic visual/token source |
| Pricing facts | `src/data/pricing.ts` | numeric pricing source of truth |
| Service rules | `src/data/services.ts` | pricing modes + hire limits + catalogue |
| Fleet facts | `src/data/fleet.ts` | vehicle names/IDs |
| Route truth | `src/data/routes.ts` | slugs, hierarchy, publication |
| Content schema | `src/content/schemas/pages.ts` | `pricingPageSchema` |
| Shared content schema | `src/content/schemas/shared.ts` | CTA/FAQ/editorial contracts |
| Current Pricing content | `src/content/pages/pricing/*` | full localized published/indexable entries |
| Renderer | `src/components/site/ContentPageRenderer.astro` | explicit page dispatch |
| Hero | `src/components/services/shared/ServiceHero.astro` | reviewed hero API |
| FAQ | `src/components/shared/FAQ.astro` | reviewed FAQ |
| Final CTA | `src/components/shared/FinalCTA.astro` | reviewed conversion closer |

## Existing package patterns mirrored

The structure and strictness of this handoff follow the established page packages under:

```text
src/docs/services/private-chauffeur/
src/docs/services/wedding-transportation/
src/docs/services/prom-transportation/
```

## Files in this package

- `data-contract.md` — public pricing scope and source ownership.
- `shared-ui-additions.md` — reuse/new-component contract.
- `blueprint.md` — locked page structure and responsive design.
- `implementation.md` — ordered coding plan.
- `acceptance.md` — binary completion checklist.
- `compliance-matrix.md` — implemented region/source/verification traceability.
- `wireframe.html` — responsive visual/topology reference.

## No schema expansion

The existing `pricingPageSchema` already supports:

```text
hero
introSection
pricing.source = "pricing-data"
sections
faq
finalCta
```

No content schema change is authorized for Pricing V1. Canonical localized
content and UI strings live only in their official `src/content` locations;
this documentation directory does not keep duplicate source copies.
