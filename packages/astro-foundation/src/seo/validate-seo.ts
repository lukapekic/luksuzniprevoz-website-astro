/**
 * SEO validator — FND-SEO-01, FND-SEO-03, FND-SEO-04, FND-SEO-05,
 * FND-SEO-08, FND-SEO-09, FND-SEO-10, FND-SEO-11, FND-SEO-12, FND-SEO-13, FND-SEO-14
 *
 * Pure function: takes site data, returns issues array.
 */
import type { FoundationIssue } from "../core/errors.ts";
import { StructuredDataSchemas, isEligibleForStructuredData } from "./structured-data.ts";

// --- Input types ---

export interface SeoPage {
  /** Route key this page belongs to */
  routeKey: string;
  /** Locale code */
  locale: string;
  /** Full URL for this page */
  url: string;
  /** Page title (composed, with brand) */
  title: string;
  /** Meta description */
  description: string;
  /** H1 text on the page */
  h1?: string;
  /** Canonical URL, if set */
  canonical?: string;
  /** <html lang> attribute */
  htmlLang?: string;
  /** hreflang links */
  hreflang?: Array<{ hreflang: string; href: string }>;
  /** OG metadata */
  og?: {
    title?: string;
    description?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
    type?: string;
    locale?: string;
  };
  /** JSON-LD structured data */
  structuredData?: object[];
  /** Whether this page is noindex */
  noindex?: boolean;
  /** Whether this page is published */
  published?: boolean;
  /** Sitemap config */
  sitemap?: { include: boolean };
  /** Breadcrumb items */
  breadcrumbs?: Array<{ name: string; url: string; routeKey?: string }>;
  /** lastmod date, if provided from content */
  lastmod?: string;
  /** Whether lastmod comes from content (vs filesystem) */
  lastmodFromContent?: boolean;
  /** The raw seoTitle (before composition) */
  rawTitle?: string;
  /** The brand name */
  brand?: string;
  /** Title template used */
  titleTemplate?: string;
  /** Capability flags for this page/route */
  capabilities?: string[];
}

export interface SeoSiteData {
  site: string;
  brand: string;
  capabilities: string[];
  pages: SeoPage[];
  /** Sitemap entries */
  sitemap?: Array<{
    url: string;
    lastmod?: string;
    alternates?: Array<{ hreflang: string; href: string }>;
  }>;
  /** Whether build output exists (for file-existence checks) */
  hasBuildOutput?: boolean;
  /** Existing OG image files in dist/ (relative paths) */
  existingOgFiles?: string[];
}

// --- FND-SEO-01: Every indexable page has required SEO metadata ---

function validateSeoBasics(pages: SeoPage[], issues: FoundationIssue[]) {
  for (const page of pages) {
    const pageId = `${page.routeKey}/${page.locale}`;

    // Skip non-indexable pages for some checks
    const isIndexable = !page.noindex && page.published !== false;

    // FND-SEO-01: unique title
    if (!page.title || page.title.trim().length === 0) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: pageId,
        offendingValue: "Page has no title",
        fix: "Set seoTitle for this page",
      });
    }

    // FND-SEO-01: useful description
    if (!page.description || page.description.trim().length === 0) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: pageId,
        offendingValue: "Page has no description",
        fix: "Set seoDescription for this page",
      });
    }

    // FND-SEO-01: canonical URL for indexable pages
    if (isIndexable && !page.canonical) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "warning",
        filePath: pageId,
        offendingValue: "Indexable page has no canonical URL",
        fix: "Set a canonical URL for this page",
      });
    }

    // FND-SEO-01: <html lang> attribute
    if (!page.htmlLang) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: pageId,
        offendingValue: "Page has no htmlLang",
        fix: "Set locale.htmlLang in the config",
      });
    }

    // FND-SEO-01: hreflang for multi-locale indexable pages
    if (isIndexable && page.hreflang && page.hreflang.length === 0) {
      // If the site has multiple locales, hreflang should be present
      // This is a soft check — we just warn if it's an empty array
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "warning",
        filePath: pageId,
        offendingValue: "hreflang array is empty on indexable page",
        fix: "Include hreflang links for all available locales",
      });
    }

    // FND-SEO-01: OG metadata for indexable pages
    if (isIndexable && !page.og?.title) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "warning",
        filePath: pageId,
        offendingValue: "Indexable page has no og:title",
        fix: "Set og:title (usually same as page title)",
      });
    }
    if (isIndexable && !page.og?.description) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "warning",
        filePath: pageId,
        offendingValue: "Indexable page has no og:description",
        fix: "Set og:description (usually same as meta description)",
      });
    }

    // FND-SEO-01: exactly one H1
    if (isIndexable && page.h1 !== undefined && page.h1.trim().length === 0) {
      issues.push({
        ruleId: "FND-SEO-01",
        severity: "warning",
        filePath: pageId,
        offendingValue: "Page has an empty H1",
        fix: "Provide H1 content or remove the H1 element",
      });
    }
  }
}

// --- FND-SEO-03: Title/description uniqueness, character count warnings ---

function validateTitleDescriptionUniqueness(pages: SeoPage[], issues: FoundationIssue[]) {
  const titlesByIndexable = new Map<string, string[]>();
  const descsByIndexable = new Map<string, string[]>();

  for (const page of pages) {
    const isIndexable = !page.noindex && page.published !== false;
    if (!isIndexable) continue;

    const pageId = `${page.routeKey}/${page.locale}`;

    // Character count warnings
    if (page.title && page.title.length > 60) {
      issues.push({
        ruleId: "FND-SEO-03",
        severity: "warning",
        filePath: pageId,
        offendingValue: `Title is ${page.title.length} characters (>60)`,
        fix: "Consider shortening the title for better SERP display",
      });
    }
    if (page.description && page.description.length > 160) {
      issues.push({
        ruleId: "FND-SEO-03",
        severity: "warning",
        filePath: pageId,
        offendingValue: `Description is ${page.description.length} characters (>160)`,
        fix: "Consider shortening the description for better SERP display",
      });
    }

    // Uniqueness
    if (page.title) {
      const existing = titlesByIndexable.get(page.title) ?? [];
      existing.push(pageId);
      titlesByIndexable.set(page.title, existing);
    }
    if (page.description) {
      const existing = descsByIndexable.get(page.description) ?? [];
      existing.push(pageId);
      descsByIndexable.set(page.description, existing);
    }
  }

  for (const [title, pageIds] of titlesByIndexable) {
    if (pageIds.length > 1) {
      issues.push({
        ruleId: "FND-SEO-03",
        severity: "error",
        offendingValue: `Duplicate title among indexable pages: "${title}"`,
        expectedValue: `Unique titles. Found on: ${pageIds.join(", ")}`,
        fix: "Give each page a unique title",
      });
    }
  }

  for (const [desc, pageIds] of descsByIndexable) {
    if (pageIds.length > 1) {
      issues.push({
        ruleId: "FND-SEO-03",
        severity: "error",
        offendingValue: `Duplicate description among indexable pages: "${desc.slice(0, 80)}..."`,
        expectedValue: `Unique descriptions. Found on: ${pageIds.join(", ")}`,
        fix: "Give each page a unique description",
      });
    }
  }
}

// --- FND-SEO-04: Structured data syntax validation + FND-SEO-14 eligibility ---

function validateStructuredData(
  pages: SeoPage[],
  siteCapabilities: string[],
  issues: FoundationIssue[],
) {
  for (const page of pages) {
    if (!page.structuredData || page.structuredData.length === 0) continue;
    const pageId = `${page.routeKey}/${page.locale}`;

    for (const sd of page.structuredData) {
      const obj = sd as Record<string, unknown>;
      const type = obj?.["@type"];

      if (typeof type !== "string") {
        issues.push({
          ruleId: "FND-SEO-04",
          severity: "error",
          filePath: pageId,
          offendingValue: "Structured data object missing @type",
          fix: "Add a valid @type field (e.g., LocalBusiness, WebSite)",
        });
        continue;
      }

      // FND-SEO-14: Type eligibility
      if (!isEligibleForStructuredData(type, siteCapabilities)) {
        issues.push({
          ruleId: "FND-SEO-14",
          severity: "warning",
          filePath: pageId,
          offendingValue: `Structured data type "${type}" is not in capabilities`,
          expectedValue: `One of: [${siteCapabilities.join(", ")}]`,
          fix: `Add "${type}" to capabilities.structuredData in foundation.config.ts`,
        });
      }

      // FND-SEO-04: Zod syntax validation
      const schema = StructuredDataSchemas[type];
      if (schema) {
        const result = schema.safeParse(sd);
        if (!result.success) {
          for (const err of result.error.issues) {
            issues.push({
              ruleId: "FND-SEO-04",
              severity: "error",
              filePath: pageId,
              offendingValue: `Structured data (${type}): ${err.path.join(".")} — ${err.message}`,
              fix: "Fix the structured data to match the schema",
            });
          }
        }
      }
    }
  }
}

// --- FND-SEO-05: Sitemap validation ---

function validateSitemap(siteData: SeoSiteData, pages: SeoPage[], issues: FoundationIssue[]) {
  if (!siteData.sitemap || siteData.sitemap.length === 0) return;

  // Build set of noindex/non-published URLs
  const excludedUrls = new Set<string>();
  for (const page of pages) {
    if (page.noindex || page.published === false || page.sitemap?.include === false) {
      excludedUrls.add(page.url);
    }
  }

  for (const entry of siteData.sitemap) {
    // FND-SEO-05: noindex/non-published should be excluded
    if (excludedUrls.has(entry.url)) {
      issues.push({
        ruleId: "FND-SEO-05",
        severity: "error",
        offendingValue: `Sitemap includes excluded page: ${entry.url}`,
        expectedValue: "noindex and non-published pages must not be in sitemap",
        fix: "Remove this URL from the sitemap or change the page's noindex/sitemap config",
      });
    }

    // FND-SEO-05: xhtml:link alternates should exist for multi-locale
    if (entry.alternates && entry.alternates.length === 0) {
      issues.push({
        ruleId: "FND-SEO-05",
        severity: "warning",
        offendingValue: `Sitemap entry ${entry.url} has empty alternates`,
        fix: "Include xhtml:link alternates for all available locales",
      });
    }
  }
}

// --- FND-SEO-08: OG image validation ---

function validateOgImages(pages: SeoPage[], siteData: SeoSiteData, issues: FoundationIssue[]) {
  for (const page of pages) {
    if (!page.og?.image) continue;
    const pageId = `${page.routeKey}/${page.locale}`;

    // FND-SEO-08: og:image must be absolute URL
    if (!page.og.image.startsWith("http://") && !page.og.image.startsWith("https://")) {
      issues.push({
        ruleId: "FND-SEO-08",
        severity: "error",
        filePath: pageId,
        offendingValue: `og:image is not absolute: "${page.og.image}"`,
        expectedValue: "Absolute URL starting with https://",
        fix: "Use an absolute URL for og:image",
      });
    }

    // FND-SEO-08: width/height declared
    if (!page.og.imageWidth || !page.og.imageHeight) {
      issues.push({
        ruleId: "FND-SEO-08",
        severity: "warning",
        filePath: pageId,
        offendingValue: "og:image:width and og:image:height not both declared",
        expectedValue: "Both og:image:width (1200) and og:image:height (630)",
        fix: "Declare og:image:width and og:image:height meta tags",
      });
    } else if (page.og.imageWidth !== 1200 || page.og.imageHeight !== 630) {
      issues.push({
        ruleId: "FND-SEO-08",
        severity: "warning",
        filePath: pageId,
        offendingValue: `og:image dimensions are ${page.og.imageWidth}x${page.og.imageHeight} (expected 1200x630)`,
        fix: "Use 1200x630 for optimal social media display",
      });
    }

    // FND-SEO-08: og:image:alt
    if (!page.og.imageAlt) {
      issues.push({
        ruleId: "FND-SEO-08",
        severity: "warning",
        filePath: pageId,
        offendingValue: "og:image:alt is missing",
        fix: "Add og:image:alt for accessibility and better social display",
      });
    }

    // FND-SEO-08: file exists in dist/ (if build output)
    if (siteData.hasBuildOutput && siteData.existingOgFiles) {
      // Extract filename from URL
      const urlPath = new URL(page.og.image, siteData.site).pathname;
      const filename = urlPath.split("/").pop();
      if (filename && !siteData.existingOgFiles.includes(filename)) {
        issues.push({
          ruleId: "FND-SEO-08",
          severity: "error",
          filePath: pageId,
          offendingValue: `og:image file not found in dist/: ${filename}`,
          fix: "Generate or copy the OG image to the build output",
        });
      }
    }
  }
}

// --- FND-SEO-09: Internal link graph — no orphans, click depth <= 3 ---

function validateLinkGraph(pages: SeoPage[], issues: FoundationIssue[]) {
  // Build adjacency: for each page URL, what pages link to it?
  // We use breadcrumbs to infer parent->child links.
  const childOf = new Map<string, string>(); // child url -> parent url
  const pageByUrl = new Map<string, SeoPage>();

  for (const page of pages) {
    pageByUrl.set(page.url, page);
  }

  for (const page of pages) {
    if (!page.breadcrumbs) continue;
    // Each breadcrumb item links to a parent page
    for (let i = 0; i < page.breadcrumbs.length - 1; i++) {
      const parent = page.breadcrumbs[i]!;
      childOf.set(page.url, parent.url);
    }
  }

  // Find orphan pages (no incoming links except home)
  // A page is "linked to" if it appears as a PARENT breadcrumb in another page.
  const linkedTo = new Set<string>();
  for (const page of pages) {
    linkedTo.add(page.url);
  }

  const homePage = pages.find((p) => p.routeKey === "home" && !p.noindex && p.published !== false);
  if (homePage) {
    linkedTo.delete(homePage.url); // Home is always reachable
  }

  // Check which pages have children linking to them.
  // Only count parent breadcrumbs (excluding the last item, which is the current page itself).
  for (const page of pages) {
    if (!page.breadcrumbs || page.breadcrumbs.length <= 1) continue;
    // All parent URLs in breadcrumbs (excluding the last = current page) are reachable
    for (let i = 0; i < page.breadcrumbs.length - 1; i++) {
      linkedTo.delete(page.breadcrumbs[i]!.url);
    }
  }

  for (const orphanUrl of linkedTo) {
    const orphanPage = pageByUrl.get(orphanUrl);
    if (orphanPage && !orphanPage.noindex && orphanPage.published !== false) {
      issues.push({
        ruleId: "FND-SEO-09",
        severity: "warning",
        filePath: `${orphanPage.routeKey}/${orphanPage.locale}`,
        offendingValue: `Page is an orphan (no internal links pointing to it)`,
        fix: "Add internal links to this page from other pages",
      });
    }
  }

  // Check click depth <= 3
  for (const page of pages) {
    if (!page.breadcrumbs || page.breadcrumbs.length === 0) continue;
    const isIndexable = !page.noindex && page.published !== false;
    if (!isIndexable) continue;

    // Click depth = number of breadcrumbs (each is a click from home)
    const depth = page.breadcrumbs.length;
    if (depth > 3) {
      issues.push({
        ruleId: "FND-SEO-09",
        severity: "warning",
        filePath: `${page.routeKey}/${page.locale}`,
        offendingValue: `Page has click depth ${depth} (max 3)`,
        fix: "Restructure navigation to reduce click depth",
      });
    }
  }
}

// --- FND-SEO-10: Indexability signal coherence (7 contradiction checks) ---

function validateIndexabilityCoherence(pages: SeoPage[], issues: FoundationIssue[]) {
  for (const page of pages) {
    const pageId = `${page.routeKey}/${page.locale}`;

    // 1. noindex=true + sitemap.include=true
    if (page.noindex && page.sitemap?.include) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "error",
        filePath: pageId,
        offendingValue: "noindex=true but sitemap.include=true",
        fix: "Set sitemap.include=false for noindex pages",
      });
    }

    // 2. noindex=true + canonical set
    if (page.noindex && page.canonical) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "warning",
        filePath: pageId,
        offendingValue: "noindex=true but canonical URL is set",
        expectedValue: "noindex pages should not have canonical URLs",
        fix: "Remove canonical from noindex pages",
      });
    }

    // 3. noindex=true + hreflang present
    if (page.noindex && page.hreflang && page.hreflang.length > 0) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "warning",
        filePath: pageId,
        offendingValue: "noindex=true but hreflang links are present",
        expectedValue: "noindex pages should not have hreflang links",
        fix: "Remove hreflang from noindex pages",
      });
    }

    // 4. published=false + sitemap.include=true
    if (page.published === false && page.sitemap?.include) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "error",
        filePath: pageId,
        offendingValue: "published=false but sitemap.include=true",
        fix: "Set sitemap.include=false for unpublished pages",
      });
    }

    // 5. published=false + canonical set (soft)
    if (page.published === false && page.canonical) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "warning",
        filePath: pageId,
        offendingValue: "published=false but canonical URL is set",
        fix: "Consider removing canonical from unpublished pages",
      });
    }

    // 6. noindex=true + rich OG metadata (title, description, image)
    if (page.noindex && page.og?.title && page.og?.description && page.og?.image) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "warning",
        filePath: pageId,
        offendingValue: "noindex=true but full OG metadata is present",
        expectedValue: "noindex pages should have minimal OG metadata",
        fix: "Remove unnecessary OG metadata from noindex pages",
      });
    }

    // 7. noindex=true but has structured data
    if (page.noindex && page.structuredData && page.structuredData.length > 0) {
      issues.push({
        ruleId: "FND-SEO-10",
        severity: "warning",
        filePath: pageId,
        offendingValue: "noindex=true but structured data is present",
        expectedValue: "noindex pages should not have structured data",
        fix: "Remove structured data from noindex pages",
      });
    }
  }
}

// --- FND-SEO-11: Breadcrumb chain cycle detection, parent exists ---

function validateBreadcrumbs(pages: SeoPage[], issues: FoundationIssue[]) {
  for (const page of pages) {
    if (!page.breadcrumbs || page.breadcrumbs.length === 0) continue;
    const pageId = `${page.routeKey}/${page.locale}`;

    // FND-SEO-11: Cycle detection
    const visited = new Set<string>();
    for (const bc of page.breadcrumbs) {
      if (visited.has(bc.url)) {
        issues.push({
          ruleId: "FND-SEO-11",
          severity: "error",
          filePath: pageId,
          offendingValue: `Breadcrumb cycle detected at: ${bc.url}`,
          fix: "Fix the parent chain to remove the cycle",
        });
        break;
      }
      visited.add(bc.url);
    }

    // FND-SEO-11: Parent route exists and is published
    for (let i = 0; i < page.breadcrumbs.length - 1; i++) {
      const parent = page.breadcrumbs[i]!;
      const parentPage = pages.find((p) => p.url === parent.url && p.locale === page.locale);

      if (!parentPage) {
        issues.push({
          ruleId: "FND-SEO-11",
          severity: "error",
          filePath: pageId,
          offendingValue: `Breadcrumb parent not found: ${parent.url} (locale: ${page.locale})`,
          fix: "Ensure the parent route exists and has content for this locale",
        });
      } else if (parentPage.published === false) {
        issues.push({
          ruleId: "FND-SEO-11",
          severity: "warning",
          filePath: pageId,
          offendingValue: `Breadcrumb parent is not published: ${parent.url}`,
          fix: "Publish the parent page or remove it from breadcrumbs",
        });
      }
    }
  }
}

// --- FND-SEO-12: lastmod from content, not filesystem ---

function validateLastmod(pages: SeoPage[], siteData: SeoSiteData, issues: FoundationIssue[]) {
  for (const page of pages) {
    if (!page.lastmod) continue;
    const pageId = `${page.routeKey}/${page.locale}`;
    const isIndexable = !page.noindex && page.published !== false;
    if (!isIndexable) continue;

    // FND-SEO-12: lastmod should come from content metadata, not filesystem
    if (page.lastmodFromContent === false) {
      issues.push({
        ruleId: "FND-SEO-12",
        severity: "warning",
        filePath: pageId,
        offendingValue: `lastmod comes from filesystem, not content: ${page.lastmod}`,
        expectedValue: "lastmod should be derived from content metadata (e.g., reviewedOn)",
        fix: "Use content-level date fields for lastmod",
      });
    }
  }
}

// --- FND-SEO-13: Title/description composition ---

function validateTitleComposition(pages: SeoPage[], issues: FoundationIssue[]) {
  for (const page of pages) {
    if (!page.title) continue;
    const pageId = `${page.routeKey}/${page.locale}`;

    // FND-SEO-13: No double brand suffix
    if (page.brand) {
      const brandSuffix = ` | ${page.brand}`;
      if (page.title.endsWith(`${brandSuffix}${brandSuffix}`)) {
        issues.push({
          ruleId: "FND-SEO-13",
          severity: "error",
          filePath: pageId,
          offendingValue: `Title has double brand suffix: "${page.title}"`,
          fix: "Check that title template is not applied twice",
        });
      }
      // Check for brand appearing twice anywhere in title
      const brandCount = page.title.split(page.brand).length - 1;
      if (brandCount > 1) {
        issues.push({
          ruleId: "FND-SEO-13",
          severity: "error",
          filePath: pageId,
          offendingValue: `Brand "${page.brand}" appears ${brandCount} times in title`,
          fix: "Ensure title template is applied only once",
        });
      }
    }

    // FND-SEO-13: title != H1 (they serve different purposes)
    if (page.h1 && page.title === page.h1) {
      issues.push({
        ruleId: "FND-SEO-13",
        severity: "warning",
        filePath: pageId,
        offendingValue: `Title is identical to H1: "${page.title}"`,
        expectedValue: "Title and H1 should differ (title includes brand, H1 is page-specific)",
        fix: "Use a different H1 or adjust the title template",
      });
    }

    // FND-SEO-13: rawTitle should not already include brand
    if (page.rawTitle && page.brand) {
      if (page.rawTitle.includes(page.brand)) {
        issues.push({
          ruleId: "FND-SEO-13",
          severity: "warning",
          filePath: pageId,
          offendingValue: `seoTitle already contains brand: "${page.rawTitle}"`,
          expectedValue: "seoTitle should be page-specific; brand is added by template",
          fix: "Remove brand from seoTitle and let the title template add it",
        });
      }
    }
  }
}

// --- Main validate function ---

/**
 * Validates SEO data for an entire site.
 * Pure function — takes data, returns issues.
 */
export function validateSeo(siteData: SeoSiteData): FoundationIssue[] {
  const issues: FoundationIssue[] = [];
  const { pages } = siteData;

  validateSeoBasics(pages, issues);
  validateTitleDescriptionUniqueness(pages, issues);
  validateStructuredData(pages, siteData.capabilities, issues);
  validateSitemap(siteData, pages, issues);
  validateOgImages(pages, siteData, issues);
  validateLinkGraph(pages, issues);
  validateIndexabilityCoherence(pages, issues);
  validateBreadcrumbs(pages, issues);
  validateLastmod(pages, siteData, issues);
  validateTitleComposition(pages, issues);

  return issues;
}
