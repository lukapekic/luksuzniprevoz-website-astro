# Luxury Transportation — Homepage Blueprint v1

Status: **Locked structural blueprint**  
Route: Serbian `/` · English `/en/` · Russian `/ru/`  
Purpose: Source of truth for homepage structure, component selection, surface rhythm, spacing, responsive behavior, image roles, CTA behavior, and implementation constraints.

> This blueprint defines structure and behavior only. Final copy, translations, photography, fleet data, pricing data, reviews, and trust-point content are produced/verified in later passes.

## 1. Page goal

The homepage must let a visitor understand the offer quickly, identify the right service, build confidence in the operator, inspect the fleet at a glance, and move naturally toward booking or requesting a quote.

The page should feel premium and cinematic without becoming visually dense or behaving like a SaaS/dashboard interface.

## 2. Primary audience

- Private clients looking for chauffeured transport in Belgrade.
- Airport passengers requiring reliable premium pickup/drop-off.
- Corporate and institutional customers evaluating business transport capability.
- Special-event customers evaluating premium transport options.

## 3. Core conversion actions

Primary action: **Book a Chauffeur**  
Secondary action: **Request a Quote**

Do not introduce additional competing primary CTAs on the homepage.

## 4. Page-wide rules

- Main layout max-width: approximately `1280px`.
- Reading content is constrained where appropriate; target around `920px` maximum for longer copy.
- Page background uses the main dark semantic background in production.
- Homepage is dark-first, with one intentional light contained section: **How It Works**.
- Section spacing uses only approved `compact`, `standard`, and `feature` tiers.
- Avoid visible horizontal separators between major sections.
- Reuse approved components before creating new patterns.
- No homepage pricing table or large pricing preview.
- No embedded booking form in the hero.
- No trusted-client logo wall on the homepage.
- No dedicated About teaser is required.
- Google Reviews appear before the Final CTA.
- All final text and interaction states must satisfy WCAG 2.2 AA.

## 5. Homepage order

1. Header
2. Hero
3. Main Services / `ServiceShowcase`
4. Private Chauffeur feature
5. Why Choose Us / Trust
6. Fleet showcase
7. How It Works
8. Google Reviews
9. Final CTA
10. Footer

This order is locked for v1 unless the blueprint is explicitly revised.

---

# 6. Header

Component: approved site `Header` pattern from `components-rules.v1.md`.

## Desktop

- Compact single row.
- Left: GS mark + coded `Luxury Transportation` wordmark.
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

- Transparent/near-transparent over the hero at page top.
- Sticky compact warm-charcoal surface after scrolling.

---

# 7. Hero

Component: `HomepageHero`.

## Purpose

Establish the premium chauffeur positioning immediately and present the two conversion paths without clutter.

## Composition

Contained cinematic feature panel inside the main container.

Desktop content model:

- Left: H1, short proposition, primary CTA, secondary CTA.
- Right: one concise supporting service/trust statement.
- Background: Mercedes S-Class contextual photography fills the **entire contained hero panel**. It is not a separate image column or right-side image block.

Do not add badges, rating chips, feature icon rows, fleet specs, pricing, or a booking form.

## Content limits

- One meaningful H1, ideally no more than approximately two visual lines on desktop.
- Supporting paragraph: approximately 2–3 lines.
- Right-side supporting statement: approximately 2–3 lines.
- Exactly two prominent CTA actions.

## Layout

- Main contained panel, not viewport full-bleed.
- Section/panel radius: `1rem / 16px`.
- Desktop visual ratio target: approximately `16:7`, with sensible minimum height.
- Two-column desktop composition.
- Background image fills the full hero panel edge-to-edge inside the 16px radius and must preserve sufficient negative space behind both text regions.
- The desktop two-column model applies to **content placement only**; it must not create a separate visual image container.

## Image treatment

- Preferred V1 subject: Mercedes S-Class.
- Production image receives restrained cinematic darkening/scrim.
- Stronger dark treatment behind left copy.
- Controlled treatment behind right statement.
- Preserve the car as the focal subject.
- No artificial glow or excessive filter treatment.

## Motion

- Gentle one-time text/CTA entrance.
- Extremely subtle slow background zoom/pan allowed.
- Respect `prefers-reduced-motion`.

## Responsive

- Mobile becomes a clear single-column reading order.
- Keep both CTAs immediately discoverable.
- Background focal point/crop must be explicitly reviewed at mobile, tablet portrait, tablet landscape, desktop.

## Spacing

Use **feature** spacing after Hero.

---

# 8. Main Services — Homepage ServiceShowcase

Component: `ServiceShowcase`.

This is a **homepage-specific composition** and must not replace the generic Service Card/Grid pattern elsewhere.

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
- Airport Transportation: approximately **30%**; vertical/tall treatment.
- Final region: approximately **35%**; Business and Special Events stacked vertically.

All regions resolve to the same overall mosaic height.

This asymmetric composition is an explicit homepage blueprint exception to the normal grid presets.

## Card treatment

- Photography fills the **entire card background** edge-to-edge; there is no separate image region above the content.
- Card radius: `0.75rem / 12px`.
- Controlled internal bottom gradient/scrim overlays the full-card image for readable title and CTA content.
- Smaller stacked Business / Special Events cards may use a slightly stronger bottom scrim because of their reduced vertical space.
- Service name is visible as the heading.
- Compact, clearly interactive CTA appears with the service name.
- No low-contrast tiny link treatment.
- No visible card borders or heavy shadows.
- Card remains physically still on hover.
- Image may use subtle brightness/contrast hover adjustment only.

## Private Chauffeur hierarchy

Private Chauffeur is visually dominant through footprint only. Do not add a `Featured` badge.

## Responsive

- Desktop/tablet landscape where space allows: asymmetric mosaic.
- Tablet portrait: clean `2 × 2` service layout.
- Mobile: one card per row.
- The mobile layout must not attempt to preserve the desktop masonry proportions.

## Surface

Open section on the page background. No large container surface around the service mosaic.

## Spacing

Use **standard** section spacing internally; transition to the next feature uses generous breathing room.

---

# 9. Private Chauffeur Feature

Component: `OpenSplitSection` with homepage-specific content slot.

## Purpose

Give the flagship service a second, deeper homepage moment after the visitor has seen all main services.

## Desktop composition

- `Content | Image`.
- Approximate grid: **5/7**.
- Content left, contextual image right.

## Content structure

- Short muted-gold accent rule.
- H2 section heading.
- Concise descriptive copy.
- Compact package summary for:
  - Hourly
  - Half Day
  - Full Day
- One clear service-level CTA.

The package summary is informational only. Do not turn it into three pricing cards or a pricing table.

## Surface

Open section directly on the main page background.

The text side has **no enclosing card or panel**.

## Image

- Contextual chauffeur/S-Class photography.
- Typical ratio: `4:3`.
- Image radius: `0.75rem / 12px`.
- `object-cover` with explicit focal positioning.

## Typography/colors in production

- Heading: primary cream text.
- Body: muted text.
- Accent rule: restrained muted gold.
- Package labels: high-contrast text with subtle dividers where useful.

## Responsive

- Mobile defaults to content first, image second.
- Tablet may stack if 5/7 becomes cramped.
- Do not retain a split if line lengths or CTA targets become compromised.

## Spacing

Use **feature** spacing.

---

# 10. Why Choose Us / Trust

Components: `WhyChooseUs` + `TrustStrip variant="dark"`.

## Purpose

Provide a compact confidence checkpoint after the flagship-service explanation.

## Content

- Left-aligned heading.
- Optional short intro line.
- Four trust items with placeholder content until the content pass.

## TrustStrip structure

Each item:

1. restrained icon
2. short title
3. one concise supporting line

## Surface

- Trust strip uses the elevated dark semantic surface in production.
- One contained surface for all four items.
- Radius: `1rem / 16px`.
- No individual card borders/shadows.
- Subtle vertical dividers allowed on desktop.

## Responsive

- Desktop: 4 across.
- Tablet: 2 × 2.
- Mobile: stacked.

## Image

No image. This is an intentional visual break after the photography-heavy sections above.

## Spacing

Use **standard** spacing. Keep the section compact.

---

# 11. Fleet Showcase

Component: `FleetShowcase` / horizontal fleet carousel.

## Purpose

Show fleet quality and range without duplicating the dedicated Fleet page.

## Heading row

- Left-aligned heading + one short intro.
- Compact section CTA: **View Full Fleet** or localized equivalent.

## Carousel

- Vehicle image dominates each item.
- Model name.
- Vehicle class.
- 2–3 compact factual placeholders until fleet data is verified.
- No pricing.

## Vehicle image rules

- Production vehicle PNGs: `object-contain`.
- Use standardized neutral/dark presentation backgrounds.
- Do not crop transparent vehicle cutouts with `object-cover`.

## Desktop viewport

Show approximately **2.5–3 cards** in view so there is clear horizontal continuation.

## Tablet

Approximately **1.5–2 cards** visible.

## Mobile

Approximately **1.1 cards** visible; swipe intent should be obvious.

## Motion

- No autoplay.
- Smooth restrained transition.
- Keyboard controls and accessible control labels required.
- Reduced-motion behavior required.

## Surface

Open section on the main dark page background.

Cards/items may use restrained surface contrast, but the whole Fleet section is not wrapped in a large contained panel.

## Spacing

Use **feature** spacing.

---

# 12. How It Works

Component: `HowItWorks`.

## Purpose

Explain that booking is simple and reduce perceived friction before social proof and the final conversion block.

## Surface

This is the homepage’s intentional **light contained section**.

Production surface: warm-neutral light semantic surface.

- Contained within the main 1280px grid.
- Radius: `1rem / 16px`.
- Dark text on light surface.
- Muted-gold details used sparingly.

## Structure

- Heading + short intro.
- Three sequential steps.
- Sequence numbers `01`, `02`, `03` are approved here because the content is genuinely sequential.
- No card boxes around individual steps.
- Optional subtle connector/divider on desktop.
- No icons unless final content proves they add clarity.

Conceptual flow for normal booking:

1. Choose service / vehicle.
2. Send request.
3. Team confirms availability/details.

Quote-led copy may adapt while preserving the same three-step visual system.

## Responsive

- Desktop: 3 columns.
- Tablet: retain 3 columns only when legible; otherwise reduce/stack based on container width.
- Mobile: stacked steps.

## Spacing

Use **standard** spacing. The panel itself should feel compact rather than oversized.

---

# 13. Google Reviews

Component: `GoogleReviews`.

## Purpose

Provide social proof immediately before the final conversion section.

## Surface

Open section on the main dark page background.

Individual review cards use restrained dark/elevated surface contrast.

## Structure

- Left-aligned heading + short intro.
- Review cards in horizontal carousel or desktop 3-card presentation.
- Reviewer name.
- Rating treatment.
- Review excerpt.
- Relevant metadata where available.
- Compact section CTA linking to the business’s **actual Google Maps / Google Business profile**.

## Visual rules

- Review card radius: `0.75rem / 12px`.
- No oversized bright-yellow star treatment.
- Google branding/rating presentation remains recognizable but visually restrained.
- No autoplay.

## Responsive

- Desktop: approximately 3 review cards visible or equivalent horizontal presentation.
- Tablet: 1.5–2 as appropriate.
- Mobile: swipeable cards with clear continuation.

## External CTA

The compact section-level CTA opens/links to the actual business Google Maps profile. Final URL must be verified before launch.

## Spacing

Use **standard** spacing.

---

# 14. Final CTA

Component: approved `FinalCTA`.

## Purpose

Close the homepage with a strong but medium-height conversion block; it must not feel like a second hero.

## Layout

Contained panel within the main container.

Desktop:

- Left/content: approximately **60–65%**.
- Right/image: approximately **35–40%**.

## Content

- Strong short heading.
- Concise supporting copy.
- Primary: Book a Chauffeur.
- Secondary: Request a Quote.
- Compact tertiary contact options: email, phone, WhatsApp.

## Image

Preferred treatment: front-facing Mercedes S-Class blended into the right side.

## Visual treatment

- Radius: `1rem / 16px`.
- Desktop target height: approximately `22rem–26rem`.
- Tablet target: approximately `20rem–22rem` where layout permits.
- Mobile: content-defined height.
- Restrained warm-charcoal → warm-brown gradient is explicitly approved.
- No dramatic gold gradient.
- No strong glow.
- No hard image edge.
- Vehicle must not exceed the intended 35–40% visual footprint.

## Responsive

- Mobile content first.
- Car may move below or softly integrate behind/beside content only if final asset supports legibility.
- Preserve comfortable CTA targets and sufficient text contrast.

## Spacing

Use **feature** spacing before/around the Final CTA.

---

# 15. Footer

Component: `SiteFooter`.

## Purpose

Compact premium site ending after the strong final CTA; do not create a giant sitemap footer.

## Desktop

Approximately 3 columns:

1. Brand: GS mark + Luxury Transportation + one concise brand line.
2. Services / Company navigation.
3. Contact: phone, email, WhatsApp, office hours.

Bottom row:

- legal links
- copyright
- language shortcuts if useful

## Rules

- Dark surface.
- No newsletter signup.
- No oversized social-media block.
- Parent company relationship may be referenced appropriately in footer context.

## Mobile

Stack cleanly with clear groups and comfortable tap targets.

---

# 16. Surface rhythm

The intended homepage rhythm is:

1. **Hero** — contained, image-backed, dark/cinematic.
2. **Services** — open, image-heavy.
3. **Private Chauffeur** — open split, spacious.
4. **Trust** — contained elevated dark surface.
5. **Fleet** — open, image-led.
6. **How It Works** — contained light surface.
7. **Google Reviews** — open dark canvas with contained review cards.
8. **Final CTA** — contained cinematic gradient.
9. **Footer** — dark compact ending.

Do not mechanically alternate dark/light surfaces. The light How It Works panel is semantic and intentional.

---

# 17. Responsive baseline

## Mobile first

- Complex layouts collapse to one column.
- Content precedes imagery for split sections unless explicitly overridden.
- Touch targets remain accessible even when CTAs are visually compact.
- No horizontal page overflow.
- Carousel overflow is intentional and contained to the carousel viewport.

## Tablet portrait

- Services: `2 × 2`.
- Trust: `2 × 2`.
- Private Chauffeur split may stack when needed.
- Fleet/reviews show partial next item where appropriate.
- How It Works may stack if three columns compromise readability.

## Tablet landscape

- Re-evaluate eligibility for the asymmetric Services mosaic.
- Re-enable 5/7 split where comfortable.
- Review image focal positions rather than assuming desktop crops.

## Desktop

- Full asymmetric Services showcase.
- 5/7 Private Chauffeur split.
- 4-up Trust strip.
- Horizontal Fleet showcase.
- 3-step How It Works.
- Review presentation around 3 cards.

## Wide desktop

- Main content remains capped around 1280px.
- Do not stretch card rows or text line length just because more viewport space exists.

---

# 18. Accessibility / semantic hooks

- Exactly one meaningful page H1 in Hero.
- Section headings follow logical H2/H3 hierarchy.
- Service names in showcase are real semantic headings/links, not text baked into images.
- Carousel controls require keyboard interaction and programmatic labels.
- Review content and ratings require meaningful accessible text.
- All image overlays must preserve WCAG 2.2 AA contrast for overlaid text/controls.
- Focus-visible states must be more explicit than hover states.
- Reduced motion must disable/reduce cinematic and carousel transitions where appropriate.
- Decorative images/icons are hidden from assistive technology; meaningful images receive localized alt text.

---

# 19. Internal-link hooks

Homepage must provide direct links to:

- Private Chauffeur
- Airport Transportation
- Business Transportation
- Special Events
- Fleet
- Pricing where contextually appropriate through navigation/CTA architecture
- Contact
- booking flow
- quote flow
- Google Maps profile from the Reviews section

Child pages such as Corporate, Delegation, Conference, Wedding, Prom, and VIP are reached primarily through their hubs/navigation rather than cluttering the homepage.

---

# 20. Content placeholders / later pass

Do not finalize during wireframing:

- Hero H1/supporting statement.
- Service-card supporting language.
- Private Chauffeur descriptive copy/package wording.
- Trust-point copy/icons.
- Fleet capacities/features until verified.
- How It Works final localized wording.
- Review selection/excerpts.
- Final CTA copy.
- Footer brand line.

---

# 21. Image requirements / later assets

- Hero: cinematic S-Class contextual image; final edited asset pending.
- ServiceShowcase: one suitable contextual image per main service.
- Private Chauffeur: chauffeur + S-Class contextual image.
- Fleet: standardized transparent vehicle PNGs supplied later.
- Final CTA: preferred front-facing S-Class image blended into gradient surface.

Image crops/focal points are part of implementation review at every breakpoint.

---

# 22. Blueprint-specific exceptions

Approved exceptions for Home v1:

1. `ServiceShowcase` uses a 35/30/35-style asymmetric composition rather than standard 12-column card spans.
2. ServiceShowcase cards use overlaid heading/CTA treatment rather than the generic below-image ServiceCard content arrangement.
3. Final CTA may use a restrained gradient.
4. How It Works intentionally uses a light contained surface inside a dark-first homepage.

Agents must not generalize these exceptions to unrelated pages/components.

---

# 23. Implementation handoff rule

Implementation order:

**Blueprint → grayscale wireframe → Astro implementation → Design Review → Technical Page Review → Content SEO Review.**

If structure changes during review, update this blueprint first, then update the wireframe, then implementation.
