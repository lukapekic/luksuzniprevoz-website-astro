# FinalCTA — wide compact interior closing-panel contract

Status: **owner-approved compact refinement after DR-12**. This replaces the viewport-wide closing canvas while retaining the DR-12 interior photograph and one shared component across all existing consumers.

## Structure and ownership

One wide, contained photographic panel fills the active main container, not the viewport. A decorative optimized Astro image sits behind an independent semantic-background scrim and the content. The shared component owns the structure; the site's media data layer selects `src/assets/images/shared/interiors/final-cta-interior.webp`; localized page content owns heading, description, and action labels; route helpers and verified contact data own destinations and contacts. Existing page-specific CTA meanings and optional actions remain intact. A missing image yields a readable dark closer with the same actions.

Migration note: the old per-consumer `image`, `imageAlt`, `imageFit`, and `mediaTreatment` props were removed from the shared API. All 13 existing production consumers now use the same approved interior through `closing-media.ts`; no page-specific closing image is inferred from its vehicle content.

The panel uses the semantic section radius, a compact 20rem structural minimum height at normal desktop text size, and no feature-sized spacer. Content may grow for translations or zoom. It remains a conversion closer with an H2, Inter Tight heading, Manrope body/actions/contacts, clear primary and secondary action hierarchy, then one compact phone/email row. It never becomes a second Hero or a booking form.

## Responsive contract

- Below the active `xs` threshold (30rem), retain one contained image-backed panel with a short top interior reveal, then stack text, full-width actions, and contacts in DOM/focus order.
- From `xs` to below `lg` (64rem), retain one continuous panel image with top detail and lower copy; actions and contacts may wrap into rows without reordering.
- At `lg` and wider, use the wide panel capped by the active main container, with content left and dashboard visible opposite. Its compact minimum height is structural, not a maximum; content may expand at zoom or with longer translations.
- At all five required states, preserve recognizable dashboard features, readable measure, zero accidental overflow, 44×44 targets, visible focus, and semantic heading order.

Use one dark scrim behind copy, a horizontal treatment at `lg` and wider and a vertical treatment below `lg`. Tune its opacity against the actual image and all localized copy; normal text/contacts require 4.5:1 and qualifying large headings 3:1. Do not filter or fade the image itself. Use DR-11 WebP 85 delivery, source-capped candidates, accurate contained-panel `sizes`, lazy loading, and no LCP preload. The currently supplied source is 2400×1600, so metadata, rather than an older handoff snapshot, determines its cap.
