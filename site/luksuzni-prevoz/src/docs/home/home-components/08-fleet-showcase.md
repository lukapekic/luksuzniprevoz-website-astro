# FleetShowcase — shared fleet-card contract

Status: **DR-06 approved direction**. This replaces the former inset/contained-image card contract. The Homepage remains an open dark section with feature spacing, a left-aligned heading and introduction, and its existing localized Fleet action.

## Component ownership

`FleetShowcase` selects the Homepage families and owns the section copy and action. A typed fleet presentation adapter resolves family identity, approved photo, localized category, and verified optional facts. `FleetCard` renders the same image-over-details article used by service recommendations. `HorizontalCarousel` owns scrolling, controls, count, and accessible announcements. The dedicated Fleet page keeps its larger vehicle-detail features.

## Card

- One outer `surface` card with semantic `card` radius; no inner image frame, heavy border, or shadow.
- The image fills a 4:3 landscape region edge to edge with `object-fit: cover`, natural color and full opacity. No image overlay, filter, hover darkening, zoom, or inactive-item fade.
- The graphite information panel follows the image in DOM and visual order: model heading, localized class, then optional compact verified capacity/fare metadata.
- Homepage cards never show a fare. Both V-Class pricing configurations produce one public **Mercedes-Benz V-Class** family card without an arbitrary singular capacity. Booking and pricing configuration IDs remain distinct.
- Omit unavailable facts and the metadata row if empty. Let names and labels wrap; no fixed card or panel height, truncation, or font shrinking.
- Cards are non-interactive articles. The existing section action is the route to Fleet.

## Carousel and responsive contract

Use the configured `md` and `lg` thresholds. Below `md`, item basis is 88% of the track; from `md` to below `lg`, use `(100% - gap) / 1.8`; at `lg` and wider use `(100% - 3 × gap) / 3.2`. Keep a next-card cue when more cards exist. At all sizes the card order is image, name, category, facts; controls precede the track and the section action retains its approved placement. At the configured card container threshold, facts stack in logical order. The page has no accidental horizontal overflow; carousel overflow is contained.

Review mobile, tablet portrait, tablet landscape, desktop, and wide desktop, including long Serbian, English, and Russian labels, keyboard focus, 44×44 controls, disabled ends, and reduced motion. Responsive Astro image candidates, `sizes`, and source-aware crops follow DR-11 and the approved image-delivery policy.
