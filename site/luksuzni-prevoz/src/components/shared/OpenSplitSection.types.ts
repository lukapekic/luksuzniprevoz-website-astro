/**
 * OpenSplitSection — reusable open-layout content | image split composition.
 *
 * Identity: ONE editorial two-column composition — content | image — with NO
 * enclosing card shell, boxed panel, border, shadow, or decorative split
 * divider (DESIGN.md §6 "No cardification"; design-foundation-governance.md
 * §6/§8). The image is a 4:3 contextual split photo
 * (imagery-art-direction.md §1 "Contextual split image" / §2) that materially
 * supports the slotted content; it uses the approved card/media radius
 * (--radius-card, 12px), never the control or section radius.
 *
 * OWNERSHIP: the component owns the COMPOSITION ONLY — the responsive
 * two-column grid, the desktop column ratio, the desktop visual direction, the
 * mobile ordering rule, the internal column gap, and the image media frame.
 * It does NOT own the page <Section>, <PageContainer>, section spacing,
 * surface, or neighboring section rhythm — those belong to the caller so the
 * page blueprint controls section rhythm and composes the split cleanly
 * (component-architecture.md §3/§18). The caller composes:
 *
 *   <Section surface="open-dark" spacing aria-labelledby>
 *     <PageContainer>
 *       <OpenSplitSection image={…} imageAlt={…} layout ratio mobileOrder>
 *         <div slot="content">…SectionHeading / <p> / <Link>…</div>
 *       </OpenSplitSection>
 *     </PageContainer>
 *   </Section>
 *
 * It owns NO page copy: the heading, body, CTAs, lists, and page-specific
 * semantics arrive through the named `content` slot, so the public API stays
 * small and the component cannot decay into a giant content API. It does NOT
 * style slotted h2/p/a/ul via descendant selectors; the caller composes
 * SectionHeading / <p> / <Link> (no local typography overrides).
 *
 * Ratios describe the visual LEFT / RIGHT columns, not content-vs-image
 * proportions independent of layout:
 *
 *   ratio="5-7" + layout="content-image" → content 5 (left) / image 7 (right)
 *   ratio="5-7" + layout="image-content" → image 5 (left) / content 7 (right)
 *
 * Only the three locked desktop ratios exist (responsive-layout.md §2;
 * design-foundation-governance.md §13): 5/7, 6/6, 7/5. Other proportions are
 * blueprint exceptions and are not exposed here.
 *
 * Image: an imported ImageMetadata asset rendered through astro:assets <Image>
 * (the approved pipeline — FND-IMG-08 only bans raw <img>/<picture>). The
 * foundation Image primitive types `src: string` and cannot accept an imported
 * ImageMetadata, so astro:assets <Image> is used directly, mirroring
 * ServiceCard / FinalCTA. The media frame is 4:3 / object-cover — the locked
 * split-contextual image role (imagery-art-direction.md §1/§2/§3).
 *
 * Alt contract: the caller makes the accessibility decision. `imageAlt: ""` →
 * decorative (alt="" + role="presentation"); non-empty → informative image
 * with that alt. The heading/content are never copied into alt
 * (imagery-art-direction.md §19).
 */
// `ImageMetadata` is the type returned by ESM imports of image assets
// (`import x from "./photo.webp"`) and the `src` shape accepted by astro:assets
// <Image> for imported assets. It is bound by the ambient `*.webp` module
// declarations in Astro's client types but is NOT re-exported by the
// `astro:assets` module in this Astro version, so it is anchored here via a
// type-only import of a representative asset. `import type` is erased at
// compile time — there is no runtime or bundle coupling to this file; only its
// inferred type (`ImageMetadata`) is used. Mirrors shared/ServiceCard.types.ts.
import type sampleAsset from "../../assets/hero.webp";

// `ImageMetadata` (typeof an imported image asset) — see the comment above the
// import. `import type` is erased at compile time; only the inferred type is used.
type OpenSplitImage = typeof sampleAsset;

/** Desktop visual direction of the two columns. */
export type OpenSplitLayout = "content-image" | "image-content";

/** Desktop left/right column ratio (visual columns, see file header). */
export type OpenSplitRatio = "5-7" | "6-6" | "7-5";

/**
 * Mobile stacking order. `content-first` is the default and preserves the
 * natural reading order (DOM is content → image). `image-first` is an explicit
 * blueprint exception only — it visually stacks the image above the content on
 * mobile via CSS `order` while the DOM/reading order stays content → image.
 */
export type OpenSplitMobileOrder = "content-first" | "image-first";

export interface OpenSplitSectionProps {
  /** Image — an imported ImageMetadata asset, rendered via astro:assets <Image>. */
  image: OpenSplitImage;
  /** Alt text; empty string = decorative (alt="" + role="presentation"). */
  imageAlt: string;
  /** Desktop visual direction (default content-image — content left, image right). */
  layout?: OpenSplitLayout;
  /** Desktop left/right column ratio (default 6-6 — balanced split). */
  ratio?: OpenSplitRatio;
  /** Mobile stacking order (default content-first). */
  mobileOrder?: OpenSplitMobileOrder;
  /** Extend the media to the containing panel's block-end and inline-end edges. */
  mediaBleed?: boolean;
  /** Add the standard bottom-weighted dark media overlay. */
  mediaOverlay?: boolean;
  /** Layout-only class passthrough on the composition root (FND-UI-06). */
  class?: string;
}
