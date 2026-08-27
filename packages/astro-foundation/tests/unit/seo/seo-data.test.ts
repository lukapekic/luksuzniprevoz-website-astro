/**
 * Unit tests for SeoData composition and title template (FND-SEO-13).
 */
import { describe, it, expect } from "vitest";
import { composeTitle, type SeoData } from "../../../src/seo/seo-data.ts";

describe("composeTitle — FND-SEO-13", () => {
  it("applies default template", () => {
    expect(composeTitle("Home", "Brand")).toBe("Home | Brand");
  });

  it("applies custom template", () => {
    expect(composeTitle("Home", "Brand", "{brand} — {title}")).toBe("Brand — Home");
  });

  it("FND-SEO-13: does not duplicate a brand already present in an authoritative title", () => {
    expect(composeTitle("Airport Transfer | Brand", "Brand")).toBe("Airport Transfer | Brand");
    expect(composeTitle("Airport Transfer | Trading Name", "Configured Legal Brand")).toBe(
      "Airport Transfer | Trading Name",
    );
  });

  it("handles missing brand gracefully", () => {
    expect(composeTitle("Home", "")).toBe("Home");
  });

  it("handles title with special chars", () => {
    expect(composeTitle("A & B", "C")).toBe("A & B | C");
  });
});

describe("SeoData type acceptance", () => {
  it("accepts minimal required fields", () => {
    const seo: SeoData = {
      title: "Test",
      description: "A test page",
      locale: { htmlLang: "en", dir: "ltr" },
      brand: "TestBrand",
    };
    expect(seo.title).toBe("Test");
  });

  it("accepts full optional fields", () => {
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
});
