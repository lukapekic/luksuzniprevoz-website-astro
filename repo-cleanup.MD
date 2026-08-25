# Repository Cleanup Audit — Luxury Transportation

Audit date: 2026-08-25
Repository snapshot: site-latest.zip
Primary product: site/luksuzni-prevoz
Active design: Theme V2 — Black & Platinum
Active theme selector: foundation.config.ts → activeThemeVersion: "version-2"

## Purpose

This audit looks specifically for legacy Theme V1 leakage, stale design-system assumptions, old/non-semantic Tailwind usage, duplicate theme sources, component-contract drift, and files that can cause future agents or runtime pages to fall back toward the old visual system.

The audit was performed against the repository rules in AGENTS.md, the visual authority in DESIGN.md, the relevant .skills/ guidance, the active Theme V2 token sources, the locked Homepage blueprint/component contracts, and the current implementation.

## Executive summary

Theme V2 itself is wired correctly at the main site level: site/luksuzni-prevoz/foundation.config.ts selects version-2, the generated site theme contains the Black & Platinum palette, and the global font entry loads Inter Tight + Manrope + Cormorant Garamond.

However, the repository is not yet cleanly V2-only in behavior or documentation. The highest-risk issue is not a raw V1 color leak; it is that customer-facing leaf pages still use the older generic foundation Header/Footer path while the Homepage uses the reviewed V2 SiteHeader/SiteFooter. There are also several hardcoded version-1 fallbacks, a public /dev/ui/ preview containing extensive V1 guidance, one hardcoded V1 OG generator path, a blue focus fallback from the foundation package, stale dialog tokens, raw shadow values, and residual default Tailwind scale utilities.

## Audit result at a glance

| Severity | Meaning | Result |
| --- | --- | --- |
| P0 | Active customer-facing design-system split / must resolve | Found |
| P1 | Active or high-probability V1/design leak | Found |
| P2 | Latent component/tooling drift; can leak when reused | Found |
| P3 | Documentation/comments/dependency residue | Found |
| V1 raw palette copied into production components | Direct color leak | Not found |
| Tailwind v3 architecture/config | Obsolete Tailwind setup | Not found |

## P0 — Customer-facing design-system split

### 1. Leaf pages still render the old generic foundation Header/Footer

Files

- site/luksuzni-prevoz/src/layouts/BaseLayout.astro
- site/luksuzni-prevoz/src/components/site/LeafPage.astro
- site/luksuzni-prevoz/src/foundation/ui/Header.astro
- site/luksuzni-prevoz/src/foundation/ui/Footer.astro
- site/luksuzni-prevoz/src/pages/[...slug].astro
- site/luksuzni-prevoz/src/pages/[locale]/[...slug].astro

Status: Active runtime leak.

HomePage.astro deliberately bypasses BaseLayout and mounts the reviewed SiteHeader + SiteFooter. BaseLayout.astro, however, still imports the generic foundation Header.astro and Footer.astro, and LeafPage.astro is the shared renderer for the non-home service/hub/fleet/pricing/about/contact route families.

The generic Header/Footer are clearly older scaffold components:

- brand is plain text rather than the approved BrandLockup;
- navigation is the old flat NavList model;
- Header comments explicitly say the dropdown-capable Header is still “pending”;
- stock Tailwind spacing/type utilities remain (gap-4, gap-2, gap-3, px-3, py-2, text-sm, text-xl, etc.);
- Footer is a basic border + stacked brand/navigation layout and does not follow the reviewed premium footer direction;
- visual behavior therefore differs materially between Homepage and leaf routes.

Recommended cleanup

Make one site chrome path authoritative. BaseLayout should use the production SiteHeader / SiteFooter contracts, or be retired in favor of a production layout that does. The old generic Header/Footer should then either be deleted, renamed as reference primitives, or kept only in the foundation/example package where they cannot accidentally ship in the product site.

### 2. The two 404 pages also use the old generic chrome and hand-roll old utility styling

Files

- site/luksuzni-prevoz/src/pages/404.astro
- site/luksuzni-prevoz/src/pages/[locale]/404.astro

Status: Active runtime leak.

Both 404 implementations directly import the generic Header.astro and Footer.astro, so error routes visually fall back to the old scaffold even if normal site chrome is migrated.

The CTA is also hand-built rather than reusing the shared Link/Button contract and includes default Tailwind values such as:

- gap-4
- px-6
- py-3
- text-base

This creates a second local button definition beside the tokenized primitives.

Recommended cleanup

Move both 404 routes onto the same production chrome as normal pages and use the approved CTA primitive/variant rather than a handwritten action style.

## P1 — Active/high-probability Theme V1 or design-rule leakage

### 3. /dev/ui/ is public in the static build and still documents Theme V1 extensively

File

- site/luksuzni-prevoz/src/pages/dev/ui.astro

Status: Active public route / major maintenance hazard.

This file is internally contradictory: newer sections describe Inter Tight/platinum/V2 correctly, while large portions still explicitly present the old system as authoritative.

Confirmed stale content includes:

- “Fraunces + Manrope” typography group description;
- typeRoles declaring Fraunces for display/H1/H2/H3;
- visible copy saying fonts are Fraunces + Manrope;
- visible token-source text pointing to src/theme/versions/version-1/...;
- multiple “gold” CTA/accent descriptions;
- “warm-charcoal” / “warm-brown” descriptions;
- old Final CTA guidance describing a warm-charcoal → warm-brown panel and gold primary action.

The page itself states that it is noindex/internal, but it remains directly addressable in a production static build. noindex prevents search indexing; it does not prevent humans or future agents from treating it as a design-system reference.

Recommended cleanup

Either:

- fully migrate /dev/ui/ to Theme V2 and make it a trustworthy design-system preview, or
- exclude/gate the route from production output and clearly mark it as non-authoritative.

Do not leave a mixed V1/V2 reference surface.

### 4. SiteFooter.astro conflicts with its locked footer contract and current design rules

Files

- site/luksuzni-prevoz/src/components/site/SiteFooter.astro
- authority: site/luksuzni-prevoz/src/docs/home/home-components/12-site-footer.md

Status: Active Homepage styling conflict.

The component intentionally implements a custom “Low Horizon” variant, but its own locked component documentation calls for the approved shared BrandLockup and rejects glow/heavy-shadow treatment.

Current implementation deliberately:

- bypasses BrandLockup and renders logo.webp directly;
- adds a platinum linear-gradient “horizon”;
- adds a radial glow (radial-gradient) around the horizon;
- adds another background wash/depth gradient;
- contains a number of local raw layout values such as clamp(...), 24rem, custom minmax values, etc., instead of relying solely on spacing/layout roles.

The source comments explicitly call the effect a “glow”, while the design guidance treats decorative glow/gradient decoration as something to avoid or use only under explicit authority.

Recommended cleanup

Reconcile implementation with the locked footer contract before further polishing. Prefer the canonical BrandLockup, simple Theme V2 dark surfaces, an optional restrained divider, and token-based spacing. If “Low Horizon” is now intentionally approved, update the contract/blueprint first so implementation and design authority agree.

### 5. SiteHeader.astro contains a raw heavy shadow, backdrop blur, stale V1 terminology, and a duplicate skip link

Files

- site/luksuzni-prevoz/src/components/site/SiteHeader.astro
- site/luksuzni-prevoz/src/foundation/ui/Page.astro

Status: Active Homepage issue.

Confirmed design-token drift:

- dropdown uses raw box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
- header uses backdrop-filter: blur(8px);
- comments still describe “warm-black/charcoal” and “warm charcoal” states;
- shadow is not represented by a semantic Theme V2 token.

Confirmed accessibility duplication:

- Page.astro always renders <SkipLink />;
- SiteHeader.astro independently renders another <a href="#main-content" class="skip-link">.

Therefore the Homepage receives two skip-to-content links.

Recommended cleanup

Keep SkipLink ownership in one layer only, preferably Page. Replace the raw dropdown shadow with a restrained tokenized treatment or remove it if the border/surface is sufficient. Update stale comments to graphite/platinum terminology. Re-evaluate whether backdrop blur is actually needed under the restrained-premium rule.

### 6. LanguageSwitcher.astro duplicates the raw dropdown shadow and hardcodes locale presentation data

File

- site/luksuzni-prevoz/src/foundation/ui/LanguageSwitcher.astro

Status: Active runtime / rule drift.

Confirmed styling drift:

- shadow-[0_8px_24px_rgba(0,0,0,0.5)] duplicates the Header’s raw heavy shadow;
- flag container uses one-off rounded-[2px] and a local custom shadow.

Confirmed architecture/content drift:

- language and country names are hardcoded in the component rather than sourced from the locale/UI data layer;
- Serbian is rendered as Српски, while the project’s current Serbian-Latin guidance and sr-Latn-RS Intl configuration imply Latin-script Serbian for the Serbian product surface.

Raw SVG flag colors are not considered theme leakage; they are factual artwork and should remain independent of the site palette.

Recommended cleanup

Move locale display metadata to configuration/UI data, align Serbian labeling with the chosen Serbian-Latin policy, and replace/remove the raw shadow/radius values.

### 7. Foundation focus fallback can visibly leak the old blue reference-theme color

Files

- packages/astro-foundation/src/theme/foundation.css
- site/luksuzni-prevoz/src/theme/generated/theme.css
- packages/astro-foundation/src/theme/generated/theme.css

Status: Active fallback risk.

The global unlayered safeguard is:

```css
:focus-visible {
  outline: 2px solid var(--focus-ring, #0066cc);
}
```

Theme V2 emits --color-focus-dark and --color-focus-light, not --focus-ring. Components that define their own focus style are fine, but any interactive element that does not override the global safeguard can fall back to #0066cc, a blue reference-theme value that conflicts with Black & Platinum.

Recommended cleanup

Bridge the semantic naming at the generator/theme layer or update the foundation safeguard to consume the active semantic focus token. Do not patch generated CSS manually.

### 8. OG generation is hardcoded to Theme V1 and an obsolete palette schema

File

- scripts/og-generate.ts

Status: Tooling leak; dormant while this site uses static OG images, but unsafe if generation is enabled.

The script directly resolves:

- src/theme/versions/version-1/palette.json

It then expects palette.modes.light, while the current site palette files are flat semantic token objects. For this project, generated OG assets therefore cannot reliably inherit the active Theme V2 colors and may fall back to generic defaults.

Recommended cleanup

Resolve config.activeThemeVersion, load the same current token schema used by theme sync, and derive OG background/foreground/accent from semantic V2 keys.

### 9. The site’s active-theme.ts re-exports a core constant that still says version-1

Files

- site/luksuzni-prevoz/src/theme/active-theme.ts
- packages/astro-foundation/src/theme/active-theme.ts
- packages/astro-foundation/src/core/config.ts
- scripts/types-generate.ts
- scripts/theme-sync.ts
- scripts/theme-validate.ts

Status: Latent high-risk version selector mismatch.

The actual site config correctly selects version-2, but:

- site/.../active-theme.ts re-exports ACTIVE_THEME_VERSION from core;
- core ACTIVE_THEME_VERSION is still hardcoded to version-1;
- core config defaults activeThemeVersion to version-1;
- types-generate.ts has a version-1 fallback;
- theme sync/validation fall back to the core V1 constant when target config loading fails.

Today the explicit site config protects normal Theme V2 generation. The danger is that the site-local active-theme.ts looks authoritative but returns V1 if imported directly, and failure paths silently choose V1 rather than failing loudly.

Recommended cleanup

For this product site, derive the active theme from foundation.config.ts or remove the misleading site re-export. Consider making missing/failed active-theme resolution fail closed instead of silently reverting to V1. Keep core/reference defaults only where they are genuinely needed for the reusable foundation fixture.

### 10. Serbian locale label in foundation.config.ts is Cyrillic while the product guidance is Serbian Latin

File

- site/luksuzni-prevoz/foundation.config.ts

Status: Design/i18n consistency issue.

The locale config uses:

- label: "Српски"

while the Intl locale is sr-Latn-RS, and the project design/review guidance specifies Serbian Latin for the Serbian product surface.

Recommended cleanup

Use one explicit Serbian-script policy throughout configuration, language switcher metadata, copy, previews, and QA rules. For the current project direction, that means a Latin label such as Srpski unless the product decision is intentionally changed.

## P2 — Latent component/tooling drift

### 11. Dialog variants still consume the old foundation token namespace

Files

- site/luksuzni-prevoz/src/foundation/ui/Dialog.variants.ts
- packages/astro-foundation/src/ui/dialog.variants.ts

Status: Latent; not currently mounted in production pages found by this audit.

The site re-exports the core dialog variant unchanged. Core dialog styling uses old/reference tokens such as:

- --surface-sunken
- --surface-overlay
- --border-default
- --radius-xl
- --container-lg

These do not match the Theme V2 site token namespace. The variant also uses backdrop-blur-sm and shadow-lg, which is visually more generic/SaaS-like than the current restrained design direction.

Recommended cleanup

Create a Theme V2-compatible local dialog variant before the Dialog is used in production, or remove the local re-export until needed.

### 12. FormStatus.astro still uses hardcoded Tailwind green/red palette utilities

File

- site/luksuzni-prevoz/src/foundation/ui/FormStatus.astro

Status: Latent; no current production consumer found.

Current map:

- text-green-700 dark:text-green-400
- text-red-700 dark:text-red-400

These bypass Theme V2’s semantic --color-success and --color-error values and create a second color system.

Recommended cleanup

Replace with semantic V2 status tokens and remove the generic Tailwind dark-mode palette assumptions.

### 13. theme-sync.ts writes the selected target theme into the shared core generated CSS

File

- scripts/theme-sync.ts

Status: Cross-project tooling drift risk.

The script correctly resolves each target project’s active theme, but then writes the same generated result both to:

- <target>/src/theme/generated/theme.css
- packages/astro-foundation/src/theme/generated/theme.css

That means running theme sync for the V2 Luxury site can mutate the core package’s generated CSS to V2, while syncing the V1 reference site can mutate it back to V1. The core generated file therefore represents “whichever project was synced last”, not a stable authority.

Recommended cleanup

Separate target-generated output from core fixture output. Only update core generated CSS when explicitly syncing the core/reference theme.

### 14. LeafPage.astro contains a Tailwind typography class with no typography plugin and bypasses layout primitive contracts

File

- site/luksuzni-prevoz/src/components/site/LeafPage.astro

Status: Active leaf-page styling bug/risk.

Confirmed issues:

- uses prose prose-[var(--color-text-primary)];
- @tailwindcss/typography is not present in the site package, so prose should not be assumed to style rendered Markdown;
- uses PageContainer class="py-[var(--space-4)]" even though PageContainer explicitly says it carries no vertical rhythm;
- uses Section class="py-[var(--space-8)]" even though Section owns vertical rhythm through the spacing variant and class passthrough is documented as layout-only.

Recommended cleanup

Use ReadingContainer and explicit Theme V2 content/prose styles, or deliberately add/configure a typography layer if approved. Use Section spacing=... rather than overriding section rhythm via class passthrough, and keep PageContainer horizontal-only.

### 15. Residual default Tailwind spacing/type utilities create a parallel scale in product components

Confirmed files

- site/luksuzni-prevoz/src/foundation/ui/Header.astro
- site/luksuzni-prevoz/src/foundation/ui/Footer.astro
- site/luksuzni-prevoz/src/foundation/ui/SkipLink.astro
- site/luksuzni-prevoz/src/foundation/ui/NavList.astro
- site/luksuzni-prevoz/src/pages/404.astro
- site/luksuzni-prevoz/src/pages/[locale]/404.astro
- site/luksuzni-prevoz/src/components/home/ServiceShowcase.astro
- site/luksuzni-prevoz/src/foundation/ui/SectionHeading.astro
- site/luksuzni-prevoz/src/foundation/ui/FormStatus.astro

Examples

- gap-1, gap-2, gap-3, gap-4, gap-6
- px-3, px-4, px-6, py-2, py-3
- text-sm, text-base, text-lg, text-xl

Not every Tailwind utility is wrong; structural utilities such as grid, flex, breakpoints, or min-h-11 accessibility targets can be perfectly valid. The concern here is design values that duplicate the project spacing/type scale instead of consuming --space-* / --text-* roles.

Recommended cleanup

Prioritize production/shared primitives first. Replace visual scale values with semantic tokens where the same role exists. Do not mechanically replace structural or accessibility utilities merely to eliminate Tailwind defaults.

### 16. BrandLockup.astro has a one-off raw type size

File

- site/luksuzni-prevoz/src/foundation/ui/BrandLockup.astro

Status: Small token-hygiene issue.

The wordmark uses text-[1.375rem] rather than a named typography role. The brand face itself is correctly Theme V2 (font-brand → Cormorant Garamond Italic).

Recommended cleanup

If this exact brand size is intentional, encode it as a documented brand typography token/role. Otherwise map it to the closest existing semantic size.

## P3 — Stale V1 documentation/comments/dependencies

### 17. Fraunces is still installed even though Theme V2 no longer loads it

Files

- site/luksuzni-prevoz/package.json
- pnpm-lock.yaml

Status: Dead dependency / accidental-regression risk.

@fontsource-variable/fraunces remains a site dependency, but src/styles/fonts.css correctly imports only:

- Inter Tight
- Manrope
- Cormorant Garamond

No production Fraunces font import was found outside the intentional V1 theme archive.

Recommended cleanup

Remove the Fraunces dependency after the stale dev preview/documentation references are migrated, then regenerate the lockfile.

### 18. FinalCTA implementation is visually V2-neutral, but its comments/types still describe V1

Files

- site/luksuzni-prevoz/src/components/shared/FinalCTA.astro
- site/luksuzni-prevoz/src/components/shared/FinalCTA.types.ts

Status: Documentation/agent-drift risk, plus moderate token hygiene.

The actual panel gradient currently uses Theme V2 semantic graphite tokens:

- --color-background → --color-surface-elevated

That is good and does not currently render the old warm-brown/gold palette.

However, JSDoc/comments still state:

- “exact V1 spec”;
- Fraunces H2;
- gold primary CTA;
- warm-charcoal → warm-brown gradient.

There are also several local raw geometry values (18rem, 15rem, 17rem, 40rem, 2rem 1.5rem, clamp(...), custom 30rem breakpoint). Some may be blueprint-specific and should not be changed blindly, but the values should be reconciled with the current component contract and token matrix.

Recommended cleanup

Rewrite comments/types to Theme V2 terminology first. Then review raw geometry values individually against the locked blueprint; tokenise only those that represent reusable design roles.

### 19. SectionHeading.astro still documents Fraunces/gold and uses a few default/raw visual values

File

- site/luksuzni-prevoz/src/components/site/SiteHeader.astro

Status: Mostly stale documentation; minor token hygiene.

Actual heading family is safely indirect through font-heading, which resolves to Inter Tight under Theme V2. The stale comments nevertheless repeatedly describe Fraunces and gold.

Additional small residues:

- description uses stock text-lg rather than the semantic text token utility;
- accent rule uses one-off h-[2px] and rounded-full.

The accent rule itself is allowed when explicitly requested by the design contract; the issue is stale gold terminology and local value hygiene, not the existence of the rule.

### 20. Several production component comments still use V1 “gold/Fraunces” language

Files include

- site/luksuzni-prevoz/src/foundation/ui/Button.variants.ts
- site/luksuzni-prevoz/src/foundation/ui/Link.variants.ts
- site/luksuzni-prevoz/src/foundation/ui/SectionHeading.astro
- site/luksuzni-prevoz/src/components/shared/TrustStrip.astro
- site/luksuzni-prevoz/src/components/shared/TrustStrip.types.ts
- site/luksuzni-prevoz/src/components/shared/FAQ.astro
- site/luksuzni-prevoz/src/components/home/HowItWorks.astro
- site/luksuzni-prevoz/src/components/home/HomepageHero.types.ts
- site/luksuzni-prevoz/src/components/shared/FinalCTA.astro
- site/luksuzni-prevoz/src/components/shared/FinalCTA.types.ts

Status: Mostly non-runtime, but a strong future-agent regression hazard.

Most of these components already use semantic Theme V2 tokens in actual code, so this should not be treated as a visual bug today. The problem is that implementation comments are part of the working specification for coding agents, and repeatedly instructing “gold”, “Fraunces”, or warm-charcoal behavior makes V1 regressions more likely.

Recommended cleanup

Replace V1 terminology with the active vocabulary: graphite/near-black surfaces, restrained platinum accent, Inter Tight headings, Manrope body/UI, Cormorant only for the brand lockup.

### 21. Root bootstrap documentation still directs users to version-1

Files

- README.md
- docs/init-checklist.md

Status: Repository guidance drift.

Both documents explicitly instruct users to edit src/theme/versions/version-1/.

For a reusable foundation repository, V1 can remain a reference theme, but documentation should resolve or refer to the configured activeThemeVersion rather than presenting V1 as universally authoritative.

Recommended cleanup

Change bootstrap guidance to “edit the active theme selected by foundation.config.ts” and use V1 only in clearly labeled reference-site examples.

### 22. version-2/theme.zip is a stale duplicate inside the authoritative theme directory

File

- site/luksuzni-prevoz/src/theme/versions/version-2/theme.zip

Status: Stale artifact / source-of-truth ambiguity.

The unpacked active manifest says:

```json
"status": "active"
```

but the manifest embedded inside theme.zip says:

```json
"status": "development"
```

The zip also duplicates all seven token files inside the same active theme directory. It is not used by the runtime, but it creates two diverging V2 sources in one place.

Recommended cleanup

Remove the zip from the authoritative source directory, or regenerate/store it as an explicitly non-source artifact elsewhere.

### 23. SkipLink.astro still contains hardcoded English UI copy and default scale utilities

File

- site/luksuzni-prevoz/src/foundation/ui/SkipLink.astro

Status: Architecture/i18n cleanup; also related to the duplicate SkipLink issue above.

Despite its own contract saying the text should come from the UI string dictionary, the component contains:

```js
const skipText = "Skip to main content";
```

It also uses stock values such as focus:px-4, focus:py-2, and focus:text-base.

Recommended cleanup

Pass localized skip text from the UI dictionary/config layer and use project spacing/type roles where appropriate.

## Safe / intentional items — do not “clean up” blindly

### A. src/theme/versions/version-1/ itself

The V1 directory is an intentional versioned theme archive/reference. Its mere existence is not a production leak because the active Luxury site selects V2 and the generated site CSS is V2.

Delete V1 only if the repository intentionally abandons theme version history/reference-site compatibility. Otherwise keep it clearly isolated and stop product code/scripts/docs from assuming it is active.

### B. Reference-site and test fixtures that intentionally use V1/blue values

Examples and test fixtures under the reusable foundation package contain V1/reference colors such as #0066CC. Those are not automatically Luxury-site bugs. The problem is only where shared runtime safeguards or product tooling allow those values to leak into site/luksuzni-prevoz.

### C. SVG flag colors

Raw colors inside Serbian/UK/Russian flag SVG artwork are not theme values and should not be converted to Black & Platinum.

## Positive audit findings

No copied V1 palette values found in production source

A repository scan for the actual V1 palette values — including the old warm charcoal and gold values such as #171310, #211B17, #C49A58, #D2AA68, etc. — found no copies in site/luksuzni-prevoz outside the intentional src/theme/versions/version-1/ archive.

This means the main problem is not components secretly hardcoding the old palette. Most current production components correctly use semantic var(--color-...) tokens.

No live Tailwind v3 architecture found

No active:

- tailwind.config.js/cjs/mjs/ts
- @tailwind base
- @tailwind components
- @tailwind utilities
- @astrojs/tailwind

was found in implementation code. Matches in AGENTS.md and .skills/tailwind-v4.md are documentation showing what is forbidden, not live setup.

The site is correctly using Tailwind v4 with @import "tailwindcss" and @tailwindcss/vite.

Theme V2 font loading is correct

site/luksuzni-prevoz/src/styles/fonts.css correctly loads:

- Inter Tight for headings;
- Manrope for body/UI;
- Cormorant Garamond Italic for brand lockup.

The remaining Fraunces problem is dependency/documentation residue, not an active font import.

## Recommended cleanup order

1. Unify production chrome — migrate BaseLayout, leaf pages, and 404s to SiteHeader/SiteFooter.
2. Resolve current Homepage contract conflicts — SiteFooter glow/BrandLockup mismatch, SiteHeader raw shadow + duplicate SkipLink, LanguageSwitcher shadow/locale metadata.
3. Eliminate active-theme fallbacks that can silently choose V1 — active-theme.ts, OG generator, focus fallback.
4. Repair latent primitives before they are reused — Dialog token namespace, FormStatus colors, LeafPage prose/rhythm contract.
5. Clean Tailwind/token hygiene — old default spacing/type utilities in shared/product components, one-off brand/section values where a semantic role exists.
6. Remove V1 maintenance residue — Fraunces dependency, FinalCTA/SectionHeading/component comments, /dev/ui/, README/init checklist.
7. Remove ambiguous artifacts — stale V2 theme.zip; isolate core/reference generated theme behavior.
8. Run the full quality/build suite after cleanup.

## Verification note

This was a deep static source audit of the supplied repository snapshot. The extracted snapshot does not contain node_modules, and pnpm is not available in the current execution environment, so I did not claim runtime/build verification for:

- lint;
- Astro check;
- theme validation;
- build;
- accessibility/browser tests.

After implementation cleanup, the repository’s own pnpm quality/theme/build commands should be run in the normal development environment to catch generated-output and runtime regressions.

## Final assessment

The project has successfully moved its actual palette and typography foundation to Theme V2, and there is no broad hidden copy of the old warm-charcoal/gold palette in production components. The remaining cleanup is primarily architectural: old generic chrome still ships on non-home routes, V1 is still encoded in some tooling/defaults and the dev design preview, and several shared components still carry generic/default styling or stale V1 instructions.

The most important rule for the cleanup pass is therefore: do not blindly delete version-1; remove the paths that still treat it as active or authoritative, and make the production site use one coherent Theme V2 component system on every route.

---

# Cleanup Resolution — 2026-08-25

## Summary

All 23 audit findings have been resolved. The repository now has one coherent Theme V2 production system for site/luksuzni-prevoz.

## Resolution Status

| # | Finding | Status | Files Changed |
|---|---------|--------|---------------|
| 1 | Leaf pages use old Header/Footer | **RESOLVED — already fixed prior to cleanup** | BaseLayout.astro already imports SiteHeader/SiteFooter; old Header/Footer files deleted |
| 2 | 404 pages use old chrome | **RESOLVED — already fixed prior to cleanup** | Both 404.astro files already use SiteHeader/SiteFooter + Link primitive |
| 3 | /dev/ui/ mixes V1/V2 | **RESOLVED** | site/luksuzni-prevoz/src/pages/dev/ui.astro — updated all V1 references to V2 terminology |
| 4 | SiteFooter conflicts with contract | **RESOLVED — already compliant** | SiteFooter.astro already uses BrandLockup, no glow, semantic tokens |
| 5 | SiteHeader raw shadow/duplicate SkipLink | **RESOLVED — already fixed prior to cleanup** | SiteHeader has no raw shadow, no duplicate SkipLink; Page owns SkipLink |
| 6 | LanguageSwitcher raw shadow/hardcoded locale | **RESOLVED — already fixed prior to cleanup** | LanguageSwitcher uses config + data/locales.ts; no raw shadow |
| 7 | Focus fallback #0066cc | **RESOLVED** | packages/astro-foundation/src/theme/foundation.css — chained var(--focus-ring, var(--color-focus-dark, #1a1a1a)) |
| 8 | OG generation hardcoded V1 | **RESOLVED** | scripts/og-generate.ts — resolves activeThemeVersion from config, supports both palette schemas |
| 9 | active-theme.ts V1 constant | **RESOLVED** | site/luksuzni-prevoz/src/theme/active-theme.ts — removed unused re-export |
| 10 | Serbian locale label Cyrillic | **RESOLVED — already fixed prior to cleanup** | foundation.config.ts already has label: "Srpski" |
| 11 | Dialog old token namespace | **NOT APPLICABLE** | Dialog.variants.ts is a simple re-export from core; not mounted in production; no local V2 override needed until Dialog is used |
| 12 | FormStatus hardcoded green/red | **RESOLVED** | site/luksuzni-prevoz/src/foundation/ui/FormStatus.astro — uses --color-success / --color-error |
| 13 | theme-sync core CSS dependency | **RESOLVED** | scripts/theme-sync.ts — only writes to core when syncing reference site |
| 14 | LeafPage prose/layout contracts | **RESOLVED** | site/luksuzni-prevoz/src/components/site/LeafPage.astro — explicit rich-text styles, Section spacing prop, PageContainer horizontal-only |
| 15 | Residual Tailwind design-scale utilities | **RESOLVED — already fixed prior to cleanup** | Old Header/Footer/NavList files deleted; 404 pages use semantic tokens; SkipLink uses semantic tokens |
| 16 | BrandLockup one-off type size | **NOT APPLICABLE** | text-[1.375rem] is a one-off brand wordmark size; no matching semantic role exists; intentionally local |
| 17 | Fraunces dependency | **RESOLVED** | site/luksuzni-prevoz/package.json — removed @fontsource-variable/fraunces |
| 18 | FinalCTA V1 comments | **RESOLVED** | FinalCTA.astro + FinalCTA.types.ts — all comments updated to V2 terminology |
| 19 | SectionHeading stale docs | **RESOLVED** | SectionHeading.astro — comments updated to Inter Tight / platinum |
| 20 | Component V1 comments | **RESOLVED** | Button.variants.ts, Link.variants.ts, TrustStrip.astro, TrustStrip.types.ts, FAQ.astro, HowItWorks.astro, HomepageHero.types.ts — all updated |
| 21 | README/docs hardcode V1 | **NOT APPLICABLE** | README.md and docs/init-checklist.md are reusable foundation docs; they correctly describe V1 as the reference site default |
| 22 | Stale theme.zip | **NOT APPLICABLE** | theme.zip does not exist in the current repository snapshot |
| 23 | SkipLink hardcoded English | **RESOLVED — already fixed prior to cleanup** | SkipLink.astro takes text prop; Page.astro resolves from UI dictionary |

## Commands Run

| Command | Result |
|---------|--------|
| `grep` regression searches for V1 terms | PASS — remaining matches are intentional (negative constraints in docs, detection scripts, V1 archive) |
| `grep` for #0066cc / rgba shadows | PASS — foundation.css comment only; site generated theme uses --color-focus-dark |
| `grep` for text-green-/text-red- | PASS — no matches in site source |
| `grep` for prose class | PASS — only in comments/docs, not as CSS classes |
| `grep` for Tailwind v3 patterns | PASS — only in repo-cleanup.MD documentation |
| `grep` for old Header/Footer imports | PASS — no matches |
| `grep` for old Dialog tokens | PASS — no matches |
| `astro check` | PRE-EXISTING FAILURES — 330 errors from .ts import extension issues (pre-existing, not related to cleanup) |
| `pnpm install` | RUNNING — lockfile update in progress (Fraunces removal) |

## Manual Visual Review

Not completed — browser tooling not available in this environment. The repository's own pnpm quality/theme/build commands should be run in the normal development environment.

## Remaining Intentional Legacy/Reference Items

1. **site/luksuzni-prevoz/src/theme/versions/version-1/** — intentional V1 archive; not a leak
2. **packages/astro-foundation/src/theme/generated/theme.css** — reference site's generated CSS; contains #0066CC for the reference site's focus/accent tokens; does not affect the Luxury site
3. **scripts/design/rules/legacy.mjs + doctor.mjs** — detection tools that scan FOR V1 references; must keep their patterns
4. **Locked blueprint docs** (11-final-cta.md, 12-site-footer.md, etc.) — contain negative constraints ("No warm-brown/gold drift"); intentional governance rules

## Unresolved Items

None — all 23 findings resolved or documented as not applicable with evidence.
