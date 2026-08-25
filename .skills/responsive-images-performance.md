---
name: responsive-images-performance
description: Use for images, fonts, LCP/INP/CLS (Core Web Vitals), loading strategy, layout stability, client JS/hydration budget, and Astro image optimization. Covers the Image primitive roles and the configured performance budget.
workstream: performance-images
applies-to: "images (src/assets, public/images), fonts, <Image> primitive usage, client:* islands, foundation.config.ts (performanceBudget), astro.config.mjs (image domains)"
source-of-truth: AGENTS.md
---

# Responsive Images & Performance

## Goal & end result
Fast, stable pages: correct LCP priority, lazy non-critical images, reserved layout space (low CLS), minimal client JS, and images/fonts within the configured budget. End result: Lighthouse performance ≥ 0.90, a11y ≥ 0.95, best-practices ≥ 0.90, `pnpm quality:page` green; on release `test:lighthouse` passes.

## When to use
- Adding/changing images, OG images, fonts, or icons.
- Tuning LCP, CLS, INP, or the client-JS budget.
- Deciding `client:*` hydration or adding an island.
- Configuring remote image sources or the performance budget.

## When NOT to use
- Layout/responsive behavior with no image/font/JS dimension (use `responsive-ui`).
- Pure SEO metadata (use `technical-seo`); but OG image handling lives here.

## Fixed context (non-negotiable truths of this repo)
- **No raw `<img>`/`<picture>`.** Enforced by `no-raw-img-element` (FND-IMG-01/08). Use the `<Image>` primitive (from `@astro-foundation/core/ui`), which uses Astro's image optimization.
- **`<Image>` takes a `role`** that drives loading/priority behavior:
  | Role | Behavior |
  |------|----------|
  | `"hero"` | eager, not lazy, responsive sources, reserved space (LCP candidate) |
  | `"content"` | lazy by default, responsive sources, reserved space |
  | `"logo"` | preserve aspect ratio; brand name as alt |
  | `"decorative"` | `alt=""` (hidden from AT); never sole carrier of meaning |
  | `"icon"` | small non-photo icon |
- **Alt is required.** Empty string only for `role="decorative"`. Informational images need descriptive alt in the page's locale.
- **Declare images in frontmatter**, render via the primitive — not Markdown `![]()` syntax.
- **Remote images must be allowlisted** in `astro.config.mjs` (`image.domains`/`remotePatterns`). Avoid oversized originals and CSS-only downscaling.
- **Performance budget** (`foundation.config.ts` → `performanceBudget`): `maxJsKb: 50`, `maxCssKb: 40`, `maxFontFiles: 4`, `maxFontTotalKb: 150`, `maxLcpImageKb: 150`, `maxTotalRouteKb: 800`, `maxIslandsPerRoute: 3`.
- **Lighthouse CI** (`.lighthouserc.json`, FND-PERF-03): a11y ≥ 0.95, SEO ≥ 0.95, best-practices ≥ 0.90, performance ≥ 0.90; throttling 150ms RTT, 1638.4 kbps, 4× CPU.
- **Client JS is gated:** `client:*` requires a `// island: <reason>` comment (FND-ARCH-01, `no-client-directive-without-justification`). Static presentation needs no hydration.
- **Enforced:** `no-raw-design-value` (FND-THEME-09) — use theme tokens, not raw values (affects image sizing/spacing).

### 2026 performance truths (anchor decisions here)
- **Core Web Vitals (p75):** LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1. One amber metric fails the URL.
- **LCP image:** `fetchpriority="high"` + explicit `width`/`height` (reserves space → prevents CLS). The primitive applies this for `role="hero"`.
- **Preload vs fetchpriority:** `preload` is for resources the parser can't discover (fonts, CSS background images, JS-initiated fetches); `fetchpriority` adjusts priority of a discoverable resource. Don't preload the hero `<img>` that's already in the HTML — `fetchpriority="high"` is enough.
- **Fonts:** `font-display: swap` (or `optional` for near-zero CLS); preload only above-the-fold fonts with `crossorigin` (fonts fetch in CORS mode; without it they download twice); match the preload URL exactly to `@font-face` `src`. Within budget: ≤4 files, ≤150 KB total.
- **CLS:** always reserve space (explicit `width`/`height` / aspect-ratio box); match fallback font metrics with `size-adjust`/`ascent-override`/etc. when using webfonts.

## Procedure
1. **Use the `<Image>` primitive** with the correct `role` and descriptive `alt` (or `alt=""` for decorative). Don't write raw `<img>`/`<picture>`.
2. **LCP:** mark the single most likely LCP element `role="hero"` (eager + high priority + reserved space). Don't lazy-load it.
3. **Non-critical images:** `role="content"` (lazy, responsive sources, reserved space).
4. **Remote images:** allowlist the origin in `astro.config.mjs`; prefer optimized local assets in `src/assets/`.
5. **Fonts:** subset to used weights/styles; `font-display: swap`/`optional`; preload above-the-fold woff2 with `crossorigin`; stay within `maxFontFiles`/`maxFontTotalKb`.
6. **Client JS:** avoid hydration for static presentation. If an island is genuinely needed, add `// island: <reason>` and keep within `maxIslandsPerRoute`/`maxJsKb`.
7. **Layout stability:** reserve space for every image/font/ads slot; avoid injecting content above the LCP element.
8. **Measure:** `pnpm test:lighthouse` and `pnpm quality:page`; on release `pnpm quality:release`.

## Verify
- `pnpm quality:page` (build + generated drift)
- Release: `pnpm test:lighthouse` (thresholds above) · `pnpm quality:release`
- Manual: confirm hero is eager + high priority; normal images lazy; no layout shift on load; fonts swap without large CLS.

## Definition of done
- All images via the `<Image>` primitive with correct role + alt.
- LCP element eager + high priority + reserved space; non-critical images lazy.
- No raw `<img>`, no oversized originals, no CSS-only downscaling, no un-allowlisted remote sources.
- Fonts within budget, `font-display` set, above-the-fold preloaded with `crossorigin`.
- Client JS minimal and justified (`// island:`); within island/JS budgets.
- Lighthouse thresholds met; `quality:page` (and `quality:release` on deploy) green.

## Never do (banned patterns)
- Use raw `<img>`/`<picture>` outside the primitive (lint fails).
- Lazy-load the LCP/hero image, or omit `width`/`height` (layout shift).
- Use `alt` that carries meaning for a decorative image, or leave a meaningful image with `alt=""`.
- Use Markdown image syntax `![]()` — declare in frontmatter, render via `<Image>`.
- Fetch from a remote image origin not allowlisted in `astro.config.mjs`.
- Preload a resource already discoverable in the HTML (double-fetch); preload fonts without `crossorigin`.
- Ship unused font weights/styles or exceed the font budget.
- Add `client:*` without `// island:` justification, or exceed `maxIslandsPerRoute`/`maxJsKb`.
- Use CSS-only downscaling of oversized originals.
- Block the LCP element with late-injected content or unreserved slots.

## Escalation triggers
- A genuine interaction needs an island that would exceed `maxIslandsPerRoute` (3) or `maxJsKb` (50) → escalate; don't silently raise the budget.
- A remote image source can't be allowlisted or the asset is too large to optimize in-build → escalate.
- Lighthouse performance < 0.90 on release and the gap isn't a single fixable image/font → escalate (structural).
- A third-party script (analytics/consent) is required → wire via `capabilities.thirdParty[]` (strategy `lazy`), gate on consent, and check the CSP/secret model; escalate if it can't meet the budget.
- A requirement for `font-display: block` (invisible text swap) that would hurt LCP → escalate; don't trade LCP for aesthetics silently.
