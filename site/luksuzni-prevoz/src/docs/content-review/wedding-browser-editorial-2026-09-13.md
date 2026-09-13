# Wedding page — browser-led Serbian editorial pass

Date: 2026-09-13. Status: applied and verified locally; not deployed.

This is the first completed page in the renewed natural-language review. It
does not certify the rest of the Serbian corpus. The owner authorized applying
edits after browser review without another approval step.

## Scope and authority

Applied root AGENTS.md, DESIGN.md, the locked Wedding blueprint/wireframe,
shared service and FinalCTA contracts, the existing Serbian language reference,
and the content-quality-review, design-governance, design-review,
design-foundation-governance, typography-system, responsive-layout,
accessibility-wcag, multilingual-routing and technical-seo procedures.

The browser-rendered Serbian page was read before editing, including shared UI
strings. The page Markdown and FAQ answers were also reviewed. Claims were
checked against services.ts (couple/guest transport, multiple vehicles,
waiting by quote, return, presentation requests), operations.ts (chauffeur dress
and vehicle preparation), and the blueprint's explicit confirmation and
decoration conditions.

## Changes

- `src/content/pages/wedding-transportation/wedding-transportation.sr.md`:
  shorter H1 and section headings; direct descriptions of pickup, ceremony,
  photography, reception and return; simpler guest-transport explanations;
  clearer FAQs and confirmation wording; explicit illustrative-photo notice;
  shorter final CTA heading and description.
- Corresponding `.en.md` and `.ru.md`: reviewed against the new Serbian meaning;
  updated headings, introduction, decoration notice, standards and final CTA.
  Retained accurate native syntax elsewhere rather than imposing literal Serbian
  phrasing. Updated review dates; canonical digest generator updated exactly two
  translation digests after the review.
- `src/content/ui/sr.json`: three Wedding-specific labels and six shared occasion
  standard strings simplified. Shared consumers include Wedding, Prom and VIP;
  browser regression checks covered all three Serbian pages.

Examples:

| Before | After |
| --- | --- |
| Prevoz za venčanje organizovan oko vašeg dana | Prevoz za mladence i goste |
| Glavno vozilo ostaje fokusirano na njihov raspored i važna kretanja tokom dana. | Automobil za mladence prati njihov raspored tokom dana. |
| Nakon provere raspoloživosti dobijate ručno potvrđene detalje prevoza. | Naš tim proverava raspoloživost vozila i potvrđuje sa vama detalje prevoza. |
| Pošaljite datum i plan venčanja. Mi ćemo organizovati prevoz. | Dogovorimo prevoz za venčanje |

No new operational promise, fixed price, included decoration, instant booking,
vehicle capacity or availability was introduced. The six FAQs, five journey
stages, vehicle IDs, all required regions and CTA destinations remain intact.
Metadata still describes wedding car hire in Belgrade; routes and SEO machinery
were not changed. No components, variants, CSS, theme values or assets changed.

## Browser findings and verification

Chromium against the local production build. Before/after Serbian CTA screenshots
were inspected at 320, 768, 1024, 1440 and 1920 CSS px. Full-page captures at 320
and 1440 and extracted main-content text also supported the review. Locator/full
page captures can contain the sticky header at the scroll position and an image
awaiting lazy loading; these are not classified as missing assets.

| Width | CTA title lines before → after | Panel height before → after (px) |
| --- | --- | --- |
| 320 | 5 → 3 | 892.75 → 767.97 |
| 768 | 2 → 1 | 596.78 → 563.19 |
| 1024 | 2 → 2 | 400.02 → 371.22 |
| 1440 | 3 → 2 | 416 → 416 |
| 1920 | 3 → 2 | 416 → 416 |

The original standard-width samples did not clip controls, although the long
desktop title crowded the panel. After editing, all 25 route/viewport samples
(three Wedding locales, Serbian Prom and Serbian VIP at five widths) had one
H1, no horizontal page overflow, no clipped final-CTA links and final-CTA
targets at least 44×44. Ten axe scans (mobile and desktop for all five pages)
reported zero WCAG A/AA violations. Serbian Wedding at 1440 with root text size
increased to 200% also had no page overflow or clipped CTA links. Computed
heading fonts resolved to Inter Tight; sampled body fonts resolved to Manrope.

Shortening the copy resolved the Wedding CTA crowding without modifying the
shared component. This does not establish that its height cap is safe for every
future page or arbitrary text length.

## Commands that passed

```text
pnpm design:context --target site/luksuzni-prevoz/src/content/pages/wedding-transportation/wedding-transportation.sr.md --surface wedding-transportation
pnpm design:context --target site/luksuzni-prevoz/src/content/ui/sr.json --surface shared-ui
pnpm content:sync-digests
pnpm --filter @luksuzni-prevoz/site build
pnpm verify:ui --target site/luksuzni-prevoz/src/content/pages/wedding-transportation/wedding-transportation.sr.md --surface wedding-transportation --change routing-content --evidence .design/.cache/verify-ui-wedding-editorial.json
pnpm verify:ui --target site/luksuzni-prevoz/src/content/ui/sr.json --surface shared-ui --change routing-content --evidence .design/.cache/verify-ui-wedding-strings.json
node /tmp/wedding-editorial-browser.mjs before
node /tmp/wedding-editorial-browser.mjs after
node /tmp/wedding-editorial-checks.mjs
git diff --check
```

Both routing-content profiles passed all 13 gates, including content, routes,
SEO (45/45), type generation checks, site/core checks, lint, unit tests and the
49-page site build. Astro check reported 0 errors, 0 warnings and 6 existing
hints. Initial local harness attempts hit sandbox, preview restart and browser
context issues; the corrected final browser run exited 0.

Evidence: `.design/.cache/verify-ui-wedding-editorial.json`,
`.design/.cache/verify-ui-wedding-strings.json`, and adjacent
`wedding-browser-checks-2026-09-13.json`. Transient screenshots and extracted
copy are in `/tmp/wedding-editorial-before/` and `/tmp/wedding-editorial-after/`.

## Remaining work

- Continue browser-first editing on the remaining Serbian pages; Prom and VIP
  were checked for shared-string regressions, not fully rewritten in this batch.
- Review canonical fleet display labels separately: the rendered Serbian fleet
  cards still use forms such as `Mercedes S klasa`. This predates this change
  and differs from the owner's preferred canonical model naming.
- Native-speaker/owner judgment remains distinct from the agent's editorial
  review and automated checks. No whole-site language certification is claimed.
- No new missing assets, placeholders or blueprint deviations were introduced.
  No deployment was performed.
