# Astro 7 Migration — Verification Report

Date: 2026-09-15  
Branch: `chore/astro-7-migration`  
Baseline: `a46b9af7ec68e18701470bec0425932dca989bea` with Astro `5.18.2`  
Target: Astro `7.3.2`

## Result

The migration implementation and all locally supported acceptance checks pass.
The production site remains static, builds 49 pages/endpoints and 364 optimized
image variants, preserves all localized route/content/SEO semantics, and has no
known production dependency vulnerabilities.

Final WebKit acceptance remains an Ubuntu CI item. Playwright's WebKit binary
cannot launch on the Fedora 43 implementation host because its Ubuntu fallback
requires `libicu74` and `libjpeg-turbo8`. Chromium and Firefox both pass the
complete 316-test smoke suite locally.

## Compatibility decisions

- The site pins Astro exactly at `7.3.2`.
- The shared foundation pins Zod exactly at `4.6.5` because its schemas compose
  with Astro content schemas.
- Site content schemas and inferred content types import Zod from `astro/zod`,
  keeping a single schema instance at the Astro boundary.
- The isolated SEO research package remains on Zod 3 because it does not compose
  schemas with Astro.
- `AutocompleteSchema` uses Zod 4 `superRefine()` while preserving its previous
  token-specific error messages.
- Deprecated schema `.merge()` use was replaced with supported shape
  composition.
- Narrow overrides patch only vulnerable `js-yaml` 4 releases before `4.3.2`
  and SVGO 4 releases before `4.1.0`.

## Changed files

- `.design/system.json`
- `README.md`
- `docs/astro-7-migration-implementation-plan.md`
- `docs/astro-7-migration-verification-report.md`
- `package.json`
- `packages/astro-foundation/package.json`
- `packages/astro-foundation/src/content/schemas.ts`
- `packages/astro-foundation/tests/unit/content/autocomplete.test.ts`
- `packages/eslint-plugin-astro-foundation/src/rules/__tests__/no-legacy-collection.test.ts`
- `packages/eslint-plugin-astro-foundation/src/rules/no-legacy-collection.ts`
- `pnpm-lock.yaml`
- `site/luksuzni-prevoz/package.json`
- `site/luksuzni-prevoz/src/components/home/HomepageHero.types.ts`
- `site/luksuzni-prevoz/src/components/shared/FinalCTA.types.ts`
- `site/luksuzni-prevoz/src/components/shared/TrustStrip.types.ts`
- `site/luksuzni-prevoz/src/components/site/LeafPage.astro`
- `site/luksuzni-prevoz/src/content/schemas/pages.ts`
- `site/luksuzni-prevoz/src/content/schemas/shared.ts`
- `site/luksuzni-prevoz/tests/smoke/accessibility.spec.ts`
- `site/luksuzni-prevoz/tests/support/contracts.ts`

No production CSS, theme tokens, localized copy, routes, business data, page
structure, or shared component APIs changed.

## Dependency audit

| State                           | Low | Moderate | High | Critical | Total |
| ------------------------------- | --: | -------: | ---: | -------: | ----: |
| Astro 5 baseline                |   3 |        6 |    6 |        1 |    16 |
| Astro 7 before narrow overrides |   0 |        1 |    2 |        0 |     3 |
| Final                           |   0 |        0 |    0 |        0 |     0 |

Both `pnpm audit --prod` and the enforceable `pnpm audit:deps` report no known
vulnerabilities. `audit:deps` now fails on high or critical findings instead of
converting every audit result to success.

## Static and workspace verification

The following migration gates passed:

```text
pnpm install --frozen-lockfile
pnpm generated:check
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm types:generate:check
pnpm theme:validate
pnpm theme:sync:check
pnpm design:sync:check
pnpm components:check
pnpm traceability --check
pnpm lint
pnpm check
pnpm test:unit
pnpm build
pnpm secret-scan
pnpm audit --prod
pnpm audit:deps
pnpm verify:ui --change foundation --scope-complete
pnpm quality:release
pnpm --filter @astro-foundation/core check
pnpm --filter @astro-foundation/core test:unit
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Key results:

- Astro check: 223 files, 0 errors, 6 pre-existing hints.
- Unit tests: 428 passed across all workspace suites.
- Content: 45/45 localized content files passed.
- Build: 49 pages/endpoints and 364 optimized image variants.
- Traceability: 75 rules passed.
- The generated design snapshot was refreshed through `pnpm design:sync`; only
  its timestamp and source hash changed after source-comment cleanup.

The repository-wide `pnpm format:check` still reports the pre-existing backlog
of 134 unrelated files. Focused Prettier checks and `git diff --check` pass for
all migration-edited source files; the backlog was not rewritten as part of
this scoped migration.

## Browser verification

| Check                                | Chromium | Firefox |                  WebKit |
| ------------------------------------ | -------: | ------: | ----------------------: |
| Formerly flaky content-page Axe test |    10/10 |       — |                       — |
| Accessibility suite                  |      8/8 |     8/8 | Host dependency blocked |
| Complete smoke suite                 |  316/316 | 316/316 | Host dependency blocked |

The complete suites cover Serbian, English, and Russian; widths 320, 768, 1024,
1440, and 1920 CSS pixels; horizontal overflow; 44-by-44 CSS-pixel targets;
booking/contact behavior; navigation and locale switching; responsive images;
SEO output; and page-specific WCAG checks.

The accessibility synchronization change does not add sleeps or weaken Axe.
It waits for fonts, reveals explicitly selected entrance regions, waits for
finite Web Animations while tolerating cancellation, resets scroll position,
and preserves the exact zero-violations assertion and target-size rule.

## Production artifact comparison

Astro 5 and Astro 7 were installed and built in separate directories. A
temporary semantic comparator checked every generated HTML document plus the
static route artifacts.

- Public route files: 52 in each build (49 HTML, `robots.txt`, and two sitemaps).
- Total `dist` files: 433 in each build.
- Route inventory, trailing-slash URLs, robots behavior, sitemap destinations,
  sitemap hreflang sets, document `lang`/`dir`, titles, descriptions, canonicals,
  page hreflang sets, visible production text, and JSON-LD all match.
- Media contracts match for intrinsic dimensions, formats, `srcset` descriptors,
  `sizes`, loading, decoding, and priority. Astro 7 omits explicit
  `fetchpriority="auto"`, which is the browser default.
- Image assets match: 367 files (156 AVIF and 211 WebP), 34,266,535 bytes in
  each build. This includes the 364 generated variants and three copied assets.
- Booking, contact, and Turnstile client bundles remain present. Their combined
  emitted size decreased from 41,230 to 40,997 bytes (233 bytes smaller).
- `pnpm secret-scan` found no secrets in the final `dist`.

The bounded visual review compared Astro 5 and Astro 7 for:

| Page                   | Locale           |  Viewport |
| ---------------------- | ---------------- | --------: |
| Home                   | Serbian          |   320×568 |
| Airport transportation | English          |  768×1024 |
| Booking                | Russian          |  1024×768 |
| Contact                | Serbian          |  1440×900 |
| Pricing                | English          | 1920×1080 |
| Fleet                  | Russian          |  1440×900 |
| 404 fallback           | Serbian fallback |   320×568 |

After synchronizing fonts, visible image decoding, and finite animations, four
pairs were pixel-identical. The other three had normalized raster differences
below `5e-7`; manual inspection found no visible layout, typography, imagery, or
content change. Every expected route returned 200, the unknown route returned
404, all viewport widths had zero overflow, and no application console/page
errors were observed. Temporary screenshots and comparison scripts were kept
outside the repository and were not committed.

## Remaining acceptance items

- Run `pnpm test:a11y` on the supported Ubuntu runner with Playwright Chromium,
  Firefox, and WebKit dependencies installed. WebKit must pass before merge.
- Prefer running the full `pnpm test:e2e` matrix on that runner.
- Confirm cold-build duration and memory limits in the actual deployment
  environment before production rollout.

There are no blueprint deviations, new component variants, missing assets,
content placeholders, or approved-rule exceptions introduced by this migration.
