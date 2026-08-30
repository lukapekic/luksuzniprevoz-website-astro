# Fleet Page Handoff — Manifest

Status: **IMPLEMENTATION CONTRACT — SIX-CHAPTER SHOWCASE**  
Target route: `fleet`  
Chosen direction: **Variant 1 — The Chauffeur Collection**  
Prepared: **2026-08-30**

## Locked decisions

- Fleet page is a dedicated page implementation.
- Hero is full bleed.
- Hero asset: `site/luksuzni-prevoz/src/assets/pages/fleet/hero.webp`.
- Header integrates over the full-bleed Hero through the existing over-Hero contract.
- Vehicle presentation is open, product-led, and chapter-based.
- Every vehicle chapter uses the corresponding `assets/fleet/original/<folder>/left-facing.webp`.
- No Homepage fleet carousel is reused as the full Fleet page.
- No automatic left/right zig-zag.
- No dashboard-style vehicle cards.
- No engine, power, acceleration, or trim marketing.
- Customer capacity is resolved from canonical operator data, never from manufacturer seating claims.
- Mercedes V-Class is one visual model family with two canonical service configurations.
- Mercedes Vito Tourer remains canonical and priced but is excluded from the Fleet showcase through `showOnFleetPage: false` because no approved Fleet-page image exists.
- Škoda Kodiaq is added as a canonical SUV vehicle.
- Kodiaq pricing is **not invented**. The canonical pricing model is updated to support an explicit quote-only vehicle state.
- Kodiaq passenger capacity is **not invented**. It stays `null` until owner-confirmed and is omitted from public UI while null.
- SR / EN / RU share identical content structure.
- Vehicle display names remain canonical and are not translated.
- Production implementation uses semantic tokens from the theme selected by `foundation.config.ts`.

## Files

| File                   | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `README.md`            | Agent entrypoint and implementation order        |
| `blueprint.md`         | Locked page/product/design contract              |
| `implementation.md`    | Exact production implementation plan             |
| `acceptance.md`        | Binary acceptance checklist                      |
| `wireframe.html`       | Responsive structural wireframe                  |
| `asset-contract.md`    | Exact Hero and vehicle media contract            |
| `data-contract.md`     | Kodiaq + pricing-state + canonical fleet changes |
| `schema-changes.md`    | Fleet content schema changes                     |
| `research-notes.md`    | 2022+ model research and publication gates       |
| `ui-additions/en.json` | UI dictionary additions                          |
| `ui-additions/sr.json` | UI dictionary additions                          |
| `ui-additions/ru.json` | UI dictionary additions                          |
| `content/fleet.en.md`  | Approved English editorial candidate             |
| `content/fleet.sr.md`  | Approved Serbian editorial source candidate      |
| `content/fleet.ru.md`  | Approved Russian editorial candidate             |

## Remote-repository asset note

The local repository contains the required Hero and all six showcase vehicle images. Vito has no approved Fleet-page image and is intentionally not a showcase chapter; this does not remove or alter its canonical/pricing records.
