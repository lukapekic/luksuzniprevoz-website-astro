# Bootstrap Checklist (FND-META-07)

Use this checklist when creating a new project from the Astro Foundation Template.
All items must be completed before the project is considered production-ready.

---

## 1. Scaffold the Starter Template

- [ ] Create the project using `create-astro-foundation` or `degit`
- [ ] Verify the monorepo structure is intact (`packages/`, `site/`, `scripts/`, `docs/`)
- [ ] Run `pnpm install` with no errors

## 2. Fill `foundation.config.ts`

- [ ] Set `site` to your production URL (not a placeholder)
- [ ] Set `brand` to your organization or product name
- [ ] Configure at least 2 locales (FND-CAP-04)
- [ ] Set `isDefault: true` on exactly one locale
- [ ] Set `isXDefault: true` on the same locale (or the locale that serves `x-default` hreflang)
- [ ] Configure `missingTranslation` strategy (`"omit"` or `"fallback"`)
- [ ] If `"fallback"`, set `fallbackLocale`
- [ ] Set `parityFloor` to your minimum locale coverage threshold
- [ ] Enable or disable `capabilities` as needed
- [ ] Review `performanceBudget` values for your project

## 3. Run `foundation:doctor`

- [ ] `pnpm foundation:doctor` passes with zero errors
- [ ] Verify: Node.js ≥ 22, Astro ≥ 5, Tailwind ≥ 4, TypeScript ≥ 5, Zod ≥ 3
- [ ] Verify: `site` is not a placeholder URL
- [ ] Verify: ≥ 2 locales configured

## 4. Run `types:generate` then `quality:release`

- [ ] `pnpm types:generate` completes without errors
- [ ] `pnpm quality:release` passes on the untouched starter (no custom code yet)
- [ ] This ensures the template ships in a known-good state

## 5. Replace Placeholder Brand Data

- [ ] Edit `src/data/business.ts` (or equivalent) with your organization's:
  - [ ] Legal name
  - [ ] Short brand name
  - [ ] Default locale
  - [ ] Contact info (email, phone, address)
  - [ ] Social media URLs
  - [ ] Logo file(s)

## 6. Replace Placeholder Theme Tokens

- [ ] Edit `src/theme/versions/version-1/` directory:
  - [ ] `manifest.json` — set `name` and `themeVersion`
  - [ ] `palette.json` — adjust color tokens for your brand
  - [ ] `typography.json` — set font families, sizes, weights, line heights
  - [ ] `spacing.json` — review spacing scale
  - [ ] `radii.json` — set border radius values
  - [ ] `layout.json` — configure containers and gutters
  - [ ] `motion.json` — set durations, easings, and reduced-motion overrides

## 7. Generate OG Image

- [ ] If `capabilities.ogImages` is `"generated"`: run `pnpm og:generate`
- [ ] If `capabilities.ogImages` is `"static"`: replace placeholder OG images with branded versions (1200×630)
- [ ] Verify OG images display correctly with your brand colors and name
- [ ] Check OG image for all locales (FND-SEO-07 font script coverage)

## 8. Update Robots Policy

- [ ] Review `src/pages/robots.txt.ts` (or equivalent)
- [ ] Allow all crawlers for public sites
- [ ] Disallow staging/dev paths (`/drafts/`, `/api/`)
- [ ] Add sitemap reference

## 9. Write 404 Copy for All Locales

- [ ] For each configured locale, write a 404 page with:
  - [ ] Clear "Page not found" message in the locale's language
  - [ ] A link back to the home page (using `getPath("home", locale)`)
  - [ ] A link back to the page root (or locale root)
  - [ ] Consistent brand styling

## 10. Create Legal Pages

If `capabilities.legalPages` is `true`:

- [ ] Privacy Policy — for each locale
- [ ] Cookie Policy — for each locale
- [ ] Imprint (Impressum) — for each locale (required in some jurisdictions)
- [ ] Accessibility Statement — for each locale
- [ ] All legal pages linked in the site footer

## 11. Complete `docs/deployment.md`

- [ ] Fill in the deployment guide (see `docs/deployment.md` template)
- [ ] Document host, build command, environment variables
- [ ] Document CI/CD pipeline

## 12. Run `theme:sync` and Verify Generated CSS

- [ ] `pnpm theme:sync` generates `src/theme/generated/theme.css`
- [ ] Verify the generated CSS contains all expected custom properties
- [ ] Verify `@layer theme` wrapper is present
- [ ] Verify `prefers-reduced-motion` override section exists
- [ ] Verify `prefers-color-scheme: dark` fallback exists

## 13. Run `quality:fast` and Ensure Green

- [ ] `pnpm quality:fast` passes all checks
- [ ] This runs: `foundation:doctor`, `types:generate`, `theme:validate`, `routes:validate`, `content:validate`, `seo:validate`, `lint`, `test:unit`

## 14. Set Up CI and Verify Gates Pass

- [ ] Configure CI pipeline (GitHub Actions, GitLab CI, etc.)
- [ ] CI runs `pnpm quality:release` on every push/PR
- [ ] CI runs `pnpm quality:fast` on every push/PR
- [ ] Deploy only after all quality gates pass
- [ ] Verify gates pass on a clean CI run

## 15. Test Language Switching on Every Page

- [ ] For every route × locale combination:
  - [ ] Language switcher shows the correct locale label
  - [ ] Clicking a locale navigates to the correct localized URL
  - [ ] The URL format is correct (default: unprefixed, others: `/locale/slug/`)
  - [ ] Content displays in the correct language
  - [ ] `hreflang` tags are present and correct (FND-SEO-09)
  - [ ] `x-default` hreflang is present

## 16. Run Manual Accessibility Checklist

- [ ] Complete the manual accessibility checklist in `docs/a11y-manual-checklist.md`
- [ ] Document any known issues or planned improvements

---

## Post-Launch

- [ ] Set up monitoring (error tracking, performance)
- [ ] Submit sitemap to search engines
- [ ] Verify `robots.txt` is served correctly
- [ ] Run Lighthouse audit on key pages
- [ ] Verify Core Web Vitals meet budget thresholds
