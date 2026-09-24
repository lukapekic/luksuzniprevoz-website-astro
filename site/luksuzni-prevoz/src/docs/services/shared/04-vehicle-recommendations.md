# Shared Contract — VehicleRecommendations

Status: **DR-06 approved direction**. This supersedes the old overlaid-photo and Airport-only full-image variants.

The wrapper selects each service's existing verified vehicle families and order, localized heading/introduction, applicable contextual fare, and existing Fleet action. It renders the same non-interactive `FleetCard` as the Homepage inside `HorizontalCarousel`. The card owns only the 4:3 natural-color media and separate graphite details panel. No service-specific visual skin, overlay copy, suitability paragraph, card booking button, or invented fare is allowed.

Resolve presentation families in a typed data adapter, preserving first family order and the underlying configuration IDs for booking and pricing. A generic V-Class card uses the canonical family title and omits singular capacity. An Airport family fare appears only when canonical pricing proves it applies to the represented configurations and route scope; otherwise follow the approved quote/omission policy. Preserve unique service suitability information in a quiet model-labelled list after the carousel rather than silently discarding it. This list does not add a card CTA or another service claim.

The shared track uses the active `md`/`lg` responsive thresholds and the FleetShowcase sizing contract. A small set may keep an approved non-empty layout; never add filler cards. Controls, count, keyboard/swipe navigation, focus, reduced motion, 44×44 targets, and all five viewport states remain required. Images use DR-11's source-capped optimized candidates and layout-accurate `sizes`.
