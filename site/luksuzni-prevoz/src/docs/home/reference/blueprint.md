# Luxury Transportation — Homepage Blueprint v1.2

Status: **Locked structural blueprint**  
Route: Serbian `/` · English `/en/` · Russian `/ru/`  
Theme: **Black & Platinum — Theme V2**  
Purpose: Source of truth for Homepage structure, component selection, surface rhythm, spacing, responsive behavior, image roles, CTA behavior, and implementation constraints.

> This blueprint defines structure and behavior. Final copy, translations, photography, fleet data, pricing data, reviews, and trust-point content remain subject to their verified data/content sources.
>
> **Current revision:** the Homepage Hero uses the approved full-resolution S-Class photograph with a low-key dusk treatment, the chauffeur feature returns to an open split, fleet cards use canonical vehicle imagery where available, and the shared Header/FinalCTA gain bounded Homepage treatments.

---

# 1. Page goal

The Homepage must let a visitor understand the offer quickly, identify the right service, build confidence in the operator, inspect the fleet at a glance, and move naturally toward booking or requesting a quote.

The page should feel premium and cinematic without becoming visually dense, decorative, or SaaS/dashboard-like.

---

# 2. Primary audience

- Private clients looking for chauffeured transport in Belgrade.
- Airport passengers requiring reliable premium pickup/drop-off.
- Corporate and institutional customers evaluating business transport capability.
- Special-event customers evaluating premium transport options.

---

# 3. Core conversion actions

Primary action: **Book a Chauffeur**  
Secondary action: **Request a Quote**

Do not introduce competing primary Homepage CTAs.

---

# 4. Page-wide rules

- Main inner content alignment uses the active Theme V2 main container.
- Reading content is constrained with the active reading/narrow measure where appropriate.
- Page background uses the main dark Theme V2 semantic background.
- Homepage is dark-first, with one intentional light contained section: **How It Works**.
- Section spacing uses the active `compact`, `standard`, and `feature` tiers.
- Avoid visible horizontal separators between major sections.
- Reuse approved components before creating new patterns.
- No Homepage pricing table or large pricing preview.
- No embedded booking form in the Hero.
- No trusted-client logo wall on the Homepage.
- Google Reviews appear before FinalCTA.
- All final text and interaction states must satisfy WCAG 2.2 AA.
- Raw design values come from active Theme V2 JSON; do not duplicate old V1 theme values in page code.

---

# 5. Homepage order

1. SiteHeader
2. HomepageHero
3. ServiceShowcase
4. Private Chauffeur feature
5. TrustStrip / Why Choose Us
6. Fleet showcase
7. How It Works
8. Google Reviews
9. FinalCTA
10. SiteFooter

This order is locked for v1.2 unless this blueprint is explicitly revised.

---

# 6. Header

Component: verified production `SiteHeader`.

## Desktop

- Compact single row.
- Left: GS vector mark. The public brand name remains the accessible home-link name; no visible wordmark appears in the compact Header.
- Main navigation.
- `SR / EN / RU` language switcher.
- Visible Book CTA.
- Business and Special Events may use restrained dropdowns.

## Mobile

- Compact header with GS mark/brand and visible Book CTA.
- Full-height menu panel for navigation.
- Child links visible directly; no accordion by default.
- Language selector may move into the menu.

## Surface behavior

At page top:

- Header visually integrates **over the Hero**.
- Fully transparent surface with contrast supplied by the Hero's top scrim.
- It must not render as a separate opaque strip above the Hero.
- Text/actions require sufficient contrast over the Hero image/scrim.

After scroll:

- Sticky compact translucent graphite/dark semantic surface.
- No decorative bottom border or shadow; surface contrast and restrained blur provide separation.
- Transition must not cause layout jump.
- Use current Theme V2 semantic tokens.

## Integration rule

If Header appearance is wrong on Homepage, inspect:

```text
overHero prop/state
position/sticky behavior
z-index
Hero/Header stacking context
parent container ownership
surface/background inheritance
scoped-style ownership
```

before redesigning `SiteHeader`.

---

# 7. Hero

Component: `HomepageHero`.

## Purpose

Establish the premium chauffeur positioning immediately and present the two conversion paths without clutter.

## Locked composition

The Hero is a **full-bleed photographic section**.

- Hero media/scrim spans the full viewport width.
- Hero is near-viewport-height on desktop.
- Hero inner content remains aligned to the active main container.
- Desktop content preserves the approved two-column relationship:
  - left: primary message and CTAs;
  - right: concise support/trust statement.
- The image is one full Hero background/media layer.
- There is **no separate right-side image column**.

Do not add badges, rating chips, feature-icon rows, fleet specs, pricing, or a booking form.

## Content limits

- One meaningful H1, ideally approximately two visual lines on desktop where localized copy permits.
- Supporting paragraph: approximately 2–3 lines.
- Right-side supporting statement: approximately 2–3 lines.
- Exactly two prominent Hero actions:
  - Book a Chauffeur
  - Request a Quote

## Desktop geometry

- Full viewport-width outer Hero.
- Near-viewport-height; content must never be clipped to preserve a fixed ratio.
- Inner content aligns to the Theme V2 main container and page gutter.
- Desktop content grid approximately **7/5**.
- Left copy is vertically/optically centered in the primary reading region.
- Right support statement occupies the lower/right support region without becoming a separate card.
- Header overlays the upper Hero region at page top.
- Inner top spacing must account for Header readability without creating a visible strip.

The previous contained `16:7` rounded Hero panel is **rejected for the current Homepage**.

## Layering contract

Required conceptual stacking order:

```text
0. Hero media/image
1. scrim/contrast treatment
2. Hero content
3. SiteHeader at page top
```

The implementation may use different numeric z-index values, but the visible order is mandatory.

When Hero content exists in source but is not visible, diagnose:

```text
scoped-style selector ownership
position
z-index
stacking contexts
transform
filter
isolation
parent overflow
PageContainer/Container class forwarding
```

before changing copy or component structure.

## Image treatment

- Approved subject: the full-resolution side-profile Mercedes S-Class photograph (`hero-example-2.jpg`).
- Image fills the entire full-bleed Hero.
- Use a restrained low-key dusk treatment: moderate exposure/saturation reduction plus directional, top/bottom and radial semantic scrims.
- Stronger contrast treatment behind left copy.
- Controlled treatment behind right statement.
- Preserve the vehicle as focal subject.
- Art-direct focal position independently for mobile, tablet and desktop; mobile favors the vehicle's front rather than the rear quarter.
- No artificial glow.
- No metallic/platinum tint over the whole image.
- No excessive blur/filter treatment.

## Typography

- H1: Inter Tight via active heading token.
- Supporting/body/UI: Manrope.
- Do not use BrandLockup Cormorant for Hero copy.
- Do not reintroduce serif heading treatment.

## Motion

- Gentle one-time staggered text/CTA entrance.
- Extremely subtle slow background zoom/pan is enabled.
- Respect `prefers-reduced-motion`.

## Responsive

### Mobile

- Full-bleed image remains.
- Clear single-column content order.
- H1/support/CTAs remain immediately discoverable.
- Right support statement moves below the primary CTA group.
- Stack both CTAs full width at narrow mobile and return them to inline actions once the tokenized layout permits.
- Explicitly review mobile focal point and text contrast.
- Do not force desktop masonry/ratio geometry.

### Tablet portrait

- Prefer single-column or carefully balanced split based on available container width.
- Do not preserve 7/5 if readability becomes cramped.

### Tablet landscape / desktop

- Two-column content model returns when comfortable.
- Review focal point independently from desktop.

## Spacing

Use **feature** transition spacing after the Hero.

---

# 8. Main Services — Homepage ServiceShowcase

Component: `ServiceShowcase`.

This is a Homepage-specific composition and must not replace the generic service-card/grid pattern elsewhere.

## Heading

- Left-aligned section heading.
- One short supporting line maximum.

## Services

1. Private Chauffeur
2. Airport Transportation
3. Business Transportation
4. Special Events

## Desktop composition

Single-row asymmetric mosaic with one clean overall rectangular footprint:

- Private Chauffeur: approximately **35%** of available width; wide/dominant.
- Airport Transportation: approximately **30%**; tall treatment.
- Final region: approximately **35%**; Business and Special Events stacked vertically.

All regions resolve to the same overall mosaic height.

This is an explicit Homepage exception to the normal grid presets.

## Card treatment

- Photography fills each card edge-to-edge.
- No separate image region above content.
- Use active Theme V2 card radius.
- Controlled internal bottom scrim for readable title/action content.
- Smaller stacked cards may use a slightly stronger bottom scrim.
- Service name is a real semantic heading/link.
- Compact clearly interactive CTA appears with the service name.
- No low-contrast tiny-link treatment.
- No visible decorative card borders or heavy shadows.
- Card remains physically still on hover.
- Image-only brightness/contrast change may be subtle.

## Private Chauffeur hierarchy

Private Chauffeur is dominant through footprint only.

Do not add a `Featured` badge.

## Responsive

- Desktop/tablet landscape where space allows: asymmetric mosaic.
- Tablet portrait: clean `2 × 2`.
- Mobile: one card per row.
- Mobile does not preserve desktop masonry proportions.

## Surface

Open section on page background.

No large container surface around the mosaic.

## Spacing

Use **standard** internal section spacing and generous transition rhythm toward the Private Chauffeur feature.

---

# 9. Private Chauffeur Feature

Component: `OpenSplitSection` with Homepage-specific content slot.

## Purpose

Give the flagship service a second, deeper Homepage moment after all primary services are visible.

## Desktop composition

- `Content | Image`.
- Approximate grid: **5/7**.
- Content left, contextual image right.

## Content structure

- Optional short restrained platinum accent rule.
- H2.
- Concise descriptive copy.
- Compact package summary:
  - Hourly
  - Half Day
  - Full Day
- One clear service-level CTA.

The package summary is informational and sits inside one compact elevated-graphite inset with internal dividers.

Do not turn it into three pricing cards, a light pricing panel, or a pricing table. Current values describe duration/km booking options, not monetary prices.

## Surface

Open section directly on the main page background.

The text side has no enclosing card/panel; only the compact package-summary inset is contained.

## Image

- Contextual chauffeur/S-Class photography.
- Typical ratio around `4:3`.
- Use Theme V2 card/media radius.
- `object-cover` with explicit focal positioning.

## Typography/colors

- Heading: Theme V2 primary text.
- Body: Theme V2 muted text.
- Accent: restrained platinum, if used.
- Package labels: high-contrast text with subtle dividers where useful.

## Responsive

- Mobile: content first, image second.
- Tablet may stack if 5/7 becomes cramped.
- Do not retain split when line length/CTA targets suffer.

## Spacing

Use **feature** spacing.

---

# 10. Why Choose Us / Trust

Components: Homepage section composition + `TrustStrip variant="dark"`.

## Purpose

Provide a compact confidence checkpoint after the flagship-service explanation.

## Content

- Left-aligned heading.
- Optional short intro line.
- Four verified/placeholder trust items until content pass.

## TrustStrip structure

Each item:

1. restrained icon
2. short title
3. one concise supporting line

## Surface

- Elevated dark Theme V2 semantic surface.
- One contained surface for all four items.
- Use Theme V2 section radius.
- No individual card borders/shadows.
- Subtle vertical dividers allowed on desktop.

## Responsive

- Desktop: 4 across.
- Tablet: `2 × 2`.
- Mobile: stacked.

## Image

No image.

This is an intentional visual break after photography-heavy sections.

## Spacing

Use **standard** spacing and keep it compact.

---

# 11. Fleet Showcase

Component: `FleetShowcase` / `HorizontalCarousel`.

## Purpose

Show fleet quality/range without duplicating the Fleet page.

## Heading row

- Left-aligned heading + one short intro.
- Compact section CTA: **View Full Fleet** or localized equivalent.

## Carousel

Each item contains:

- dominant vehicle image;
- model name;
- vehicle class;
- 2–3 compact verified facts/placeholders;
- no pricing.

The Homepage presents vehicle families, not pricing configurations:

- render one generic **Mercedes V klasa** card;
- do not repeat V-Class `6+1` and `7+1` as separate fleet cards;
- omit Mercedes Vito while no matching approved vehicle image exists;
- keep configuration-specific capacity and fare records in canonical data for
  future Pricing-page rows.

## Vehicle image rules

- Transparent vehicle PNGs use `object-contain`.
- Use standardized neutral/dark presentation backgrounds.
- Do not crop transparent cutouts with `object-cover`.

## Desktop viewport

Show approximately **2.5–3 cards** so horizontal continuation is obvious.

## Tablet

Approximately **1.5–2 cards** visible.

## Mobile

Approximately **1.1 cards** visible.

Swipe continuation must be obvious.

## Motion/accessibility

- No autoplay.
- Smooth restrained transition.
- Keyboard controls and programmatic labels required.
- Reduced-motion behavior required.

## Surface

Open dark section.

Cards/items may use restrained surface contrast; the entire section is not one large panel.

## Spacing

Use **feature** spacing.

---

# 12. How It Works

Component: `HowItWorks`.

## Purpose

Explain booking simplicity and reduce perceived friction before reviews/final conversion.

## Surface

The Homepage’s intentional **light contained section**.

- Theme V2 light semantic surface.
- Contained within the main inner grid.
- Theme V2 section radius.
- Dark text on light surface.
- Platinum details used sparingly.

## Structure

- Heading + short intro.
- Three sequential steps.
- Sequence numbers `01`, `02`, `03`.
- No individual card boxes.
- Optional subtle connector/divider on desktop.
- No icons unless final content proves they clarify the process.

Conceptual flow:

1. Choose service / vehicle.
2. Send request.
3. Team confirms availability/details.

Quote-led copy may adapt while preserving the same three-step visual system.

## Responsive

- Desktop: 3 columns.
- Tablet: retain 3 only when legible; otherwise adapt/stack by available width.
- Mobile: stacked.

## Spacing

Use **standard** spacing.

Panel should feel compact rather than oversized.

---

# 13. Google Reviews

Component: `GoogleReviews`.

## Purpose

Provide social proof immediately before FinalCTA.

## Surface

Open section on main dark canvas.

Individual review cards use restrained elevated surface contrast.

## Structure

- Left-aligned heading + short intro.
- Review cards in horizontal carousel or desktop 3-card presentation.
- Reviewer name.
- Rating treatment.
- Review excerpt.
- Relevant verified metadata.
- Compact section CTA to the actual Google Maps / Google Business profile.

## Visual rules

- Use Theme V2 card radius.
- No oversized bright-yellow star treatment.
- Google branding/rating remains recognizable but restrained.
- No autoplay.

## Responsive

- Desktop: around 2.5–3 review cards with a readable quote measure.
- Tablet: around 1.5–2.
- Mobile: swipeable with clear continuation.

## External CTA

Final URL must be verified before launch.

Do not invent a Google profile URL.

## Spacing

Use **standard** spacing.

---

# 14. Final CTA

Component: approved production `FinalCTA`.

## Purpose

Close the Homepage with a strong medium-height conversion block.

It must not feel like a second Hero.

## Layout

Contained panel inside the main content container.

Desktop:

- content: approximately **60–65%**;
- image: approximately **35–40%**.

## Content

- Strong short heading.
- Concise supporting copy.
- Primary: Book a Chauffeur.
- Secondary: Request a Quote.
- Compact tertiary contacts when canonical verified data exists:
  - phone
  - email

Missing verified contacts must follow canonical contact gating; do not invent them to fill the design.

## Image

Preferred treatment: front-facing Mercedes S-Class blended into the right media region.

On Homepage, the media fills its complete allocated region and uses the approved integrated treatment: a restrained light-neutral veil plus a soft fade into the panel. This does not change other `FinalCTA` consumers unless they opt into the same semantic treatment.

## Visual treatment

- Use Theme V2 section radius.
- Medium-height desktop target.
- Mobile height is content-defined.
- Restrained graphite → slightly elevated neutral graphite gradient is allowed.
- No warm-brown/gold theme drift.
- No dramatic platinum/metallic gradient.
- No strong glow.
- No hard image edge.
- Vehicle remains within the intended 35–40% visual footprint.

## Responsive

### Desktop

- ~60–65 / 35–40 split.
- Content vertically balanced.
- Image integrated, not a separate framed card.

### Mobile

- Content first.
- Primary Book CTA full width.
- Secondary Request Quote CTA full width.
- Verified phone/email contacts compactly presented.
- Dedicated media area below content.
- Image must not sit behind text if that harms legibility.

## Spacing

Use **feature** spacing before/around FinalCTA.

---

# 15. Footer

Component: verified production `SiteFooter`.

## Purpose

Compact premium ending after FinalCTA.

Do not create a giant sitemap footer.

## Desktop

Approximately 3 columns:

1. Brand.
2. Services / Company navigation.
3. Contact / office information.

Bottom row may contain:

- legal links;
- copyright;
- language shortcuts where useful.

## Contact rule

Footer uses canonical data only.

Target content includes verified:

- address;
- phone;
- email;
- office hours.

Unavailable/unverified values remain gated by the data source.

## Rules

- Dark Theme V2 surface.
- No newsletter.
- No oversized social block.
- No Homepage-specific footer variant.

## Mobile

Stack cleanly with clear groups and comfortable targets.

---

# 16. Surface rhythm

Intended Homepage rhythm:

1. **Hero** — full-bleed image-backed dark/cinematic entrance with contained inner content.
2. **Services** — open image-heavy section.
3. **Private Chauffeur** — open spacious split.
4. **Trust** — contained elevated dark surface.
5. **Fleet** — open image-led section.
6. **How It Works** — contained light surface.
7. **Google Reviews** — open dark canvas with contained review cards.
8. **FinalCTA** — contained graphite cinematic closer.
9. **Footer** — compact dark ending.

Do not mechanically alternate dark/light surfaces.

---

# 17. Responsive baseline

## Mobile first

- Complex layouts collapse to one column.
- Split-section content precedes imagery unless explicitly overridden.
- Touch targets remain accessible.
- No accidental horizontal page overflow.
- Carousel overflow is intentional and contained.
- Hero remains full bleed.

## Tablet portrait

- Hero may stay single-column if 7/5 is cramped.
- Services: `2 × 2`.
- Trust: `2 × 2`.
- Private Chauffeur may stack.
- Fleet/reviews show partial next item.
- How It Works may stack if three columns compromise readability.

## Tablet landscape

- Re-evaluate Hero 7/5 eligibility.
- Re-enable asymmetric Services mosaic when comfortable.
- Re-enable 5/7 Private Chauffeur where comfortable.
- Review all image focal positions.

## Desktop

- Full-bleed near-viewport Hero + contained 7/5 content.
- Asymmetric Services mosaic.
- 5/7 Private Chauffeur split.
- 4-up Trust.
- Horizontal Fleet.
- 3-step How It Works.
- Review presentation around 3 cards.

## Wide desktop

- Hero media remains full bleed.
- Hero and section inner content remains capped by the Theme V2 main container.
- Do not stretch card rows or text measures merely because viewport is wider.

---

# 18. Accessibility / semantic hooks

- Exactly one meaningful page H1 in Hero.
- Logical H2/H3 hierarchy.
- Service names are semantic headings/links, not baked into images.
- Carousel controls require keyboard interaction and programmatic labels.
- Review ratings require meaningful accessible text.
- Overlay text/controls must preserve WCAG 2.2 AA contrast at every crop.
- Focus-visible is more explicit than hover.
- Reduced motion reduces/disables cinematic/carousel motion.
- Decorative images/icons are hidden from assistive technology.
- Meaningful images receive localized alt text.
- Header-over-Hero treatment must not reduce link/button contrast.

---

# 19. Internal-link hooks

Homepage must provide direct links to:

- Private Chauffeur
- Airport Transportation
- Business Transportation
- Special Events
- Fleet
- Pricing where contextually appropriate
- Contact
- booking flow
- quote flow
- Google Maps profile from Reviews

Child pages such as Delegation/Conference/Wedding/Prom/VIP remain primarily reached through hubs/navigation rather than cluttering Homepage.

---

# 20. Content/data boundaries

Do not finalize or invent during layout implementation:

- Hero H1/support statement where localized content is pending.
- Service support copy.
- Private Chauffeur descriptive/package wording beyond verified service data.
- Trust copy/icons.
- Fleet capacities/features until verified.
- How It Works localized wording.
- Reviews/excerpts/ratings.
- FinalCTA contact methods if not verified.
- Footer contact values if not verified.

Use repository content/data sources.

Presentation components are not data authorities.

---

# 21. Image requirements

- Hero: cinematic S-Class contextual image.
- ServiceShowcase: one contextual image per primary service.
- Private Chauffeur: chauffeur/S-Class contextual image.
- Fleet: standardized transparent vehicle PNGs.
- FinalCTA: front-facing S-Class blended into media region.

Missing assets do not authorize structural redesign.

Use neutral placeholders until final assets exist.

Image crop/focal point is reviewed at every breakpoint.

---

# 22. Blueprint-specific exceptions

Approved Homepage v1.1 exceptions:

1. **Homepage Hero is full bleed** while its inner content remains aligned to the main container.
2. Hero desktop content uses the approved 7/5 two-column relationship; this does not create a separate image column.
3. `ServiceShowcase` uses a 35/30/35 asymmetric composition instead of standard grid spans.
4. ServiceShowcase cards use overlaid title/action treatment instead of generic below-image ServiceCard content.
5. FinalCTA may use a restrained neutral graphite gradient.
6. How It Works intentionally uses a light contained surface inside the dark-first Homepage.

These exceptions are Homepage-local.

Do not generalize them to unrelated pages/components.

---

# 23. Implementation handoff

Required order:

```text
AGENTS.md
→ DESIGN.md
→ Theme V2
→ Homepage blueprint
→ Tailwind-v4 wireframe structural intent
→ source diagnosis
→ bounded Astro implementation
→ Design Review
→ Technical Page Review
→ Content/SEO Review where in scope
```

If Homepage structure changes:

```text
blueprint
→ wireframe
→ implementation
```

in that order.

Do not use rejected Homepage implementations as visual authority.
