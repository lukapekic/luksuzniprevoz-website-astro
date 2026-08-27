/**
 * Unit tests for SEO data helpers (FND-SEO-13).
 */
import { describe, it, expect } from "vitest";
import {
  composeTitle,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  type SeoData,
} from "../../../src/seo/seo-data.ts";

describe("composeTitle", () => {
  it("uses default template {title} | {brand}", () => {
    expect(composeTitle("Home", "MyBrand")).toBe("Home | MyBrand");
  });

  it("uses custom template", () => {
    expect(composeTitle("Home", "MyBrand", "{brand} — {title}")).toBe("MyBrand — Home");
  });

  it("replaces both placeholders", () => {
    expect(composeTitle("About", "Site", "{title} - {brand}")).toBe("About - Site");
  });

  it("handles empty brand", () => {
    expect(composeTitle("Home", "")).toBe("Home");
  });

  it("handles title with special characters", () => {
    expect(composeTitle("Tom & Jerry", "ACME")).toBe("Tom & Jerry | ACME");
  });
});

describe("SeoData type", () => {
  it("accepts minimal required fields", () => {
    const seo: SeoData = {
      title: "Test",
      description: "A test page",
      locale: { htmlLang: "en", dir: "ltr" },
      brand: "TestBrand",
    };
    expect(seo.title).toBe("Test");
  });

  it("accepts all optional fields", () => {
    const seo: SeoData = {
      title: "Test",
      description: "A test page",
      canonical: "https://example.com/",
      noindex: true,
      ogImage: "https://example.com/og.jpg",
      ogImageAlt: "OG alt text",
      ogType: "article",
      locale: { htmlLang: "en", dir: "ltr" },
      hreflang: [
        { hreflang: "en", href: "https://example.com/en/" },
        { hreflang: "sr", href: "https://example.com/sr/" },
      ],
      structuredData: [{ "@type": "TestSchema" }],
      brand: "TestBrand",
    };
    expect(seo.canonical).toBe("https://example.com/");
    expect(seo.noindex).toBe(true);
    expect(seo.hreflang).toHaveLength(2);
  });

  it("supports RTL locale", () => {
    const seo: SeoData = {
      title: "Test",
      description: "A test page",
      locale: { htmlLang: "ar", dir: "rtl" },
      brand: "TestBrand",
    };
    expect(seo.locale.dir).toBe("rtl");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("creates valid BreadcrumbList JSON-LD", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "Home", url: "https://example.com/" },
      { name: "About", url: "https://example.com/about/" },
    ]);
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://example.com/about/" },
      ],
    });
  });

  it("handles single item", () => {
    const result = buildBreadcrumbJsonLd([{ name: "Home", url: "https://example.com/" }]);
    expect(result.itemListElement).toHaveLength(1);
    expect(result.itemListElement[0]?.position).toBe(1);
  });

  it("handles empty array", () => {
    const result = buildBreadcrumbJsonLd([]);
    expect(result.itemListElement).toHaveLength(0);
  });
});

describe("buildOrganizationJsonLd", () => {
  it("creates minimal Organization JSON-LD", () => {
    const result = buildOrganizationJsonLd({
      name: "ACME",
      url: "https://example.com",
    });
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ACME",
      url: "https://example.com",
    });
  });

  it("includes optional logo and sameAs", () => {
    const result = buildOrganizationJsonLd({
      name: "ACME",
      url: "https://example.com",
      logo: "https://example.com/logo.png",
      sameAs: ["https://twitter.com/acme"],
    });
    expect(result.logo).toBe("https://example.com/logo.png");
    expect(result.sameAs).toEqual(["https://twitter.com/acme"]);
  });
});

describe("buildWebSiteJsonLd", () => {
  it("creates minimal WebSite JSON-LD", () => {
    const result = buildWebSiteJsonLd({
      name: "ACME",
      url: "https://example.com",
    });
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ACME",
      url: "https://example.com",
    });
  });

  it("includes search action when searchUrl provided", () => {
    const result = buildWebSiteJsonLd({
      name: "ACME",
      url: "https://example.com",
      searchUrl: "https://example.com/search?q={search_term_string}",
    });
    expect(result.potentialAction).toBeDefined();
    expect((result.potentialAction as Array<Record<string, unknown>>)?.["@type"]).toBe(
      "SearchAction",
    );
  });
});
