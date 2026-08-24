/**
 * Breadcrumbs — presentation types.
 *
 * The visible <Breadcrumbs> component is presentation-only: it receives an
 * already-resolved trail and renders semantics + quiet styling. It does NOT
 * fetch navigation data, infer hierarchy from the URL, or emit JSON-LD (the
 * Page primitive owns <head> structured-data emission; structured-data.md).
 *
 * ── Item shape ──
 * `BreadcrumbItem` is the narrowest PRESENTATION contract — `label` + optional
 * `href`. It aligns 1:1 with the foundation JSON-LD builder
 * `buildBreadcrumbList({ name, url }[])` (`label`↔`name`, `href`↔`url`) so one
 * canonical trail can feed BOTH the visible component AND the page-level
 * BreadcrumbList, with no second manually-maintained array (task §3).
 *
 * ── Canonical data source ──
 * The trail is built by `src/lib/seo.ts::buildBreadcrumbs(routeKey, locale)`,
 * which returns the foundation DATA-LAYER `BreadcrumbItem` (`{ routeKey, label,
 * path }`) from `@astro-foundation/core/i18n` (root ancestor → current, with
 * route-derived `path`s). That is a DIFFERENT type from this presentation
 * `BreadcrumbItem` — same name, different module — on purpose: the data layer
 * is routing-coupled (routeKey/path), the visual layer is not. The page adapts
 * `path → href` (and omits `href` on the final/current item) when it feeds the
 * visible component; the same `buildBreadcrumbs` output feeds the BreadcrumbList
 * JSON-LD directly via its `path`. One canonical trail, two consumers.
 *
 * ── Routing stays external ──
 * `href` must be a route-derived path (from getPath/buildBreadcrumbs), never a
 * hand-concatenated URL (FND-I18N-03). The component never builds a URL.
 */

/** A single visible breadcrumb. */
export interface BreadcrumbItem {
  /** Visible crumb label (a UI string supplied by the page/data layer). */
  label: string;
  /**
   * Route-derived href for linkable ancestors (from getPath/buildBreadcrumbs).
   * Omit for a non-linked ancestor (rare — e.g. a hub that is not a page).
   * The FINAL item's href is ignored: the last item is the current page and
   * is never rendered as a link (see Breadcrumbs.astro §current-item contract).
   */
  href?: string;
}

/** <Breadcrumbs> component props. */
export interface BreadcrumbsProps {
  /** Ordered trail, root ancestor first. The FINAL item is the current page. */
  items: BreadcrumbItem[];
  /** Accessible name for the <nav> landmark (a UI string — pass as expression). */
  ariaLabel?: string;
  /** Surface the trail sits on — drives text/focus color (default "dark"). */
  on?: "dark" | "light";
  /** Layout-only class (FND-UI-06). */
  class?: string;
}
