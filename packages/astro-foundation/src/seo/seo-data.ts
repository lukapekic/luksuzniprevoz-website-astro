/**
 * SEO data types and helpers for the Page primitive.
 * FND-SEO-13: Title template composition
 */

/** SEO data required by every page. */
export interface SeoData {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  /** OG image dimensions (FND-SEO-08: 1200×630). Emitted as og:image:width/height. */
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: string;
  locale: { htmlLang: string; dir: "ltr" | "rtl" };
  hreflang?: Array<{ hreflang: string; href: string }>;
  structuredData?: object[];
  brand: string;
}

/**
 * Composes a page title using the template.
 * FND-SEO-13: Default template is "{title} | {brand}".
 * Supports custom templates with {title} and {brand} placeholders.
 */
export function composeTitle(title: string, brand: string, template?: string): string {
  if (
    !brand ||
    title.toLocaleLowerCase().includes(brand.toLocaleLowerCase()) ||
    (!template && /\S\s[|—]\s\S/.test(title))
  ) {
    return title;
  }
  const tpl = template ?? "{title} | {brand}";
  return tpl.replace("{title}", title).replace("{brand}", brand);
}

/**
 * Builds a BreadcrumbList JSON-LD structured data object.
 * FND-SEO-11: Breadcrumb schema for search engines.
 */
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Builds an Organization JSON-LD structured data object.
 */
export function buildOrganizationJsonLd(opts: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts.name,
    url: opts.url,
    ...(opts.logo && { logo: opts.logo }),
    ...(opts.sameAs && { sameAs: opts.sameAs }),
  };
}

/**
 * Builds a WebSite JSON-LD structured data object.
 */
export function buildWebSiteJsonLd(opts: {
  name: string;
  url: string;
  searchUrl?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: opts.name,
    url: opts.url,
    ...(opts.searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: opts.searchUrl,
        "query-input": "required name=search_term_string",
      },
    }),
  };
}
