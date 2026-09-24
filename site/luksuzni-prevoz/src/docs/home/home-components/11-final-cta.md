# FinalCTA — full-width interior closing-section contract

Status: **DR-12 approved direction**. This replaces the former contained rounded split panel, side-only media region, mask, accent veil, and mobile media panel for all existing shared FinalCTA consumers.

## Structure and ownership

One continuous photographic section spans the viewport. A decorative optimized Astro image sits behind an independent semantic-background scrim and the content. The content stays in the normal main container. The shared component owns the structure; the site's media data layer selects `src/assets/shared/final-cta-interior-v2.webp`; localized page content owns heading, description, and action labels; route helpers and verified contact data own destinations and contacts. Existing page-specific CTA meanings and optional actions remain intact. A missing image yields a readable dark closer with the same actions.

The section has no outer card radius or extra feature-sized spacer. It remains a medium-height conversion closer with an H2, Inter Tight heading, Manrope body/actions/contacts, clear primary and secondary action hierarchy, then one compact phone/email row. It never becomes a second Hero or a booking form.

## Responsive contract

- Below the active `xs` threshold, reserve a visible interior region above the content, then stack text, full-width actions, and contacts in DOM/focus order.
- From `xs` to below `lg`, retain one continuous image with top detail and lower copy; actions and contacts may wrap into rows without reordering.
- At `lg` and wider, use a full-width image with the content aligned left in the capped main container and the dashboard visible opposite. The desktop minimum height is a structural reference; content may expand at zoom or with longer translations.
- At all five required states, preserve recognizable dashboard features, readable measure, zero accidental overflow, 44×44 targets, visible focus, and semantic heading order.

Use one dark scrim behind copy, a horizontal treatment at `lg` and wider and a vertical treatment below `lg`. Tune its opacity against the actual image and all localized copy; normal text/contacts require 4.5:1 and qualifying large headings 3:1. Do not filter or fade the image itself. Use the DR-11 full-width WebP 85 delivery policy, source-capped candidates, accurate `sizes`, lazy loading, and no LCP preload. The currently supplied source is 2400×1600, so metadata, rather than an older handoff snapshot, determines its cap.
