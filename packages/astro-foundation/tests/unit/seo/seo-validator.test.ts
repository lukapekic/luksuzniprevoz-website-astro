/**
 * Unit tests for SEO validator (FND-SEO-01,03,04,05,08,09,10,11,12,13,14).
 */
import { describe, it, expect } from "vitest";
import { validateSeo, type SeoSiteData, type SeoPage } from "../../../src/seo/validate-seo.ts";

function makeSiteData(overrides?: Partial<SeoSiteData>): SeoSiteData {
  return {
    site: "https://example.com",
    brand: "TestBrand",
    capabilities: ["Organization", "WebSite"],
    pages: [],
    ...overrides,
  };
}

function makePage(overrides?: Partial<SeoPage>): SeoPage {
  return {
    routeKey: "home",
    locale: "en",
    url: "https://example.com/",
    title: "Home | TestBrand",
    description: "A home page",
    h1: "Welcome Home",
    canonical: "https://example.com/",
    htmlLang: "en",
    og: {
      title: "Home | TestBrand",
      description: "A home page",
      image: "https://example.com/og.png",
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: "Home page",
    },
    published: true,
    sitemap: { include: true },
    breadcrumbs: [{ name: "Home", url: "https://example.com/", routeKey: "home" }],
    rawTitle: "Home",
    brand: "TestBrand",
    ...overrides,
  };
}

// --- FND-SEO-01: Basic SEO metadata ---

describe("FND-SEO-01: SEO basics", () => {
  it("passes for well-formed indexable page", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage()],
      }),
    );
    const seo01 = issues.filter((i) => i.ruleId === "FND-SEO-01");
    expect(seo01).toHaveLength(0);
  });

  it("errors on missing title", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ title: "" })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-01" && i.severity === "error")).toBe(true);
  });

  it("errors on missing description", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ description: "" })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-01" && i.severity === "error")).toBe(true);
  });

  it("warns on missing canonical for indexable page", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ canonical: undefined })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-01" && i.severity === "warning")).toBe(true);
  });

  it("errors on missing htmlLang", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ htmlLang: undefined })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-01" && i.severity === "error")).toBe(true);
  });
});

// --- FND-SEO-03: Title/description uniqueness ---

describe("FND-SEO-03: Title/description uniqueness", () => {
  it("errors on duplicate titles", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            routeKey: "a",
            url: "https://example.com/a/",
            title: "Same Title | TestBrand",
          }),
          makePage({
            routeKey: "b",
            url: "https://example.com/b/",
            title: "Same Title | TestBrand",
          }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-03" && i.severity === "error")).toBe(true);
  });

  it("errors on duplicate descriptions", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({ routeKey: "a", url: "https://example.com/a/", description: "Same desc" }),
          makePage({ routeKey: "b", url: "https://example.com/b/", description: "Same desc" }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-03" && i.severity === "error")).toBe(true);
  });

  it("warns on long title (>60 chars)", () => {
    const longTitle = "A".repeat(61) + " | TestBrand";
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ title: longTitle })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-03" && i.severity === "warning")).toBe(true);
  });

  it("warns on long description (>160 chars)", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ description: "A".repeat(161) })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-03" && i.severity === "warning")).toBe(true);
  });

  it("does not warn for noindex pages with duplicate titles", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({ routeKey: "a", url: "https://example.com/a/", title: "Same" }),
          makePage({ routeKey: "b", url: "https://example.com/b/", title: "Same", noindex: true }),
        ],
      }),
    );
    // noindex page is excluded from uniqueness check
    const dupErrors = issues.filter((i) => i.ruleId === "FND-SEO-03" && i.severity === "error");
    expect(dupErrors).toHaveLength(0);
  });
});

// --- FND-SEO-04 + FND-SEO-14: Structured data validation ---

describe("FND-SEO-04 + FND-SEO-14: Structured data", () => {
  it("passes for valid structured data in capabilities", () => {
    const issues = validateSeo(
      makeSiteData({
        capabilities: ["Organization"],
        pages: [
          makePage({
            structuredData: [
              {
                "@type": "Organization",
                "@id": "https://example.com/#org",
                name: "ACME",
                url: "https://example.com",
              },
            ],
          }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-04")).toBe(false);
    expect(issues.some((i) => i.ruleId === "FND-SEO-14")).toBe(false);
  });

  it("warns FND-SEO-14 for type not in capabilities", () => {
    const issues = validateSeo(
      makeSiteData({
        capabilities: ["Organization"],
        pages: [
          makePage({
            structuredData: [
              {
                "@type": "LocalBusiness",
                "@id": "https://example.com/#biz",
                name: "ACME",
                description: "A biz",
                url: "https://example.com",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "NYC",
                  postalCode: "10001",
                  addressCountry: "US",
                },
              },
            ],
          }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-14" && i.severity === "warning")).toBe(true);
  });

  it("errors FND-SEO-04 for invalid structured data", () => {
    const issues = validateSeo(
      makeSiteData({
        capabilities: ["Organization"],
        pages: [
          makePage({
            structuredData: [
              {
                "@type": "Organization",
                // missing @id, name, url
              },
            ],
          }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-04" && i.severity === "error")).toBe(true);
  });

  it("errors on missing @type in structured data", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            structuredData: [{ name: "Something" }],
          }),
        ],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-04" && i.severity === "error")).toBe(true);
  });
});

// --- FND-SEO-05: Sitemap validation ---

describe("FND-SEO-05: Sitemap validation", () => {
  it("errors when noindex page is in sitemap", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ url: "https://example.com/secret/", noindex: true })],
        sitemap: [{ url: "https://example.com/secret/" }],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-05" && i.severity === "error")).toBe(true);
  });

  it("errors when unpublished page is in sitemap", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ url: "https://example.com/draft/", published: false })],
        sitemap: [{ url: "https://example.com/draft/" }],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-05" && i.severity === "error")).toBe(true);
  });

  it("warns on empty alternates", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage()],
        sitemap: [{ url: "https://example.com/", alternates: [] }],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-05" && i.severity === "warning")).toBe(true);
  });
});

// --- FND-SEO-08: OG image validation ---

describe("FND-SEO-08: OG image validation", () => {
  it("errors on relative og:image URL", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ og: { image: "/og.png" } })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-08" && i.severity === "error")).toBe(true);
  });

  it("warns on missing og:image dimensions", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ og: { image: "https://example.com/og.png" } })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-08" && i.severity === "warning")).toBe(true);
  });

  it("warns on wrong og:image dimensions", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            og: { image: "https://example.com/og.png", imageWidth: 800, imageHeight: 600 },
          }),
        ],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-08" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("800x600"),
      ),
    ).toBe(true);
  });

  it("warns on missing og:image:alt", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            og: { image: "https://example.com/og.png", imageWidth: 1200, imageHeight: 630 },
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-08" && i.offendingValue?.includes("og:image:alt")),
    ).toBe(true);
  });

  it("errors when OG file not found in dist/ (with build output)", () => {
    const issues = validateSeo(
      makeSiteData({
        hasBuildOutput: true,
        existingOgFiles: ["other.png"],
        pages: [
          makePage({
            og: {
              image: "https://example.com/og.png",
              imageWidth: 1200,
              imageHeight: 630,
              imageAlt: "test",
            },
          }),
        ],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-08" &&
          i.severity === "error" &&
          i.offendingValue?.includes("not found"),
      ),
    ).toBe(true);
  });

  it("passes for valid OG image", () => {
    const issues = validateSeo(
      makeSiteData({
        hasBuildOutput: true,
        existingOgFiles: ["og.png"],
        pages: [
          makePage({
            og: {
              image: "https://example.com/og.png",
              imageWidth: 1200,
              imageHeight: 630,
              imageAlt: "test",
            },
          }),
        ],
      }),
    );
    const ogIssues = issues.filter((i) => i.ruleId === "FND-SEO-08");
    expect(ogIssues).toHaveLength(0);
  });
});

// --- FND-SEO-09: Internal link graph ---

describe("FND-SEO-09: Link graph", () => {
  it("does not report a page reached by a crawlable internal link", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            routeKey: "home",
            url: "https://example.com/",
            internalLinks: ["https://example.com/airport/"],
            breadcrumbs: [{ name: "Home", url: "https://example.com/", routeKey: "home" }],
          }),
          makePage({
            routeKey: "airport",
            url: "https://example.com/airport/",
            breadcrumbs: [
              { name: "Airport", url: "https://example.com/airport/", routeKey: "airport" },
            ],
          }),
        ],
      }),
    );
    expect(issues.some((issue) => issue.ruleId === "FND-SEO-09")).toBe(false);
  });

  it("warns on orphan page", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            routeKey: "home",
            url: "https://example.com/",
            breadcrumbs: [{ name: "Home", url: "https://example.com/", routeKey: "home" }],
          }),
          makePage({
            routeKey: "orphan",
            url: "https://example.com/orphan/",
            breadcrumbs: [
              { name: "Orphan", url: "https://example.com/orphan/", routeKey: "orphan" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-09" && i.offendingValue?.includes("orphan")),
    ).toBe(true);
  });

  it("warns on click depth > 3", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            routeKey: "deep",
            url: "https://example.com/a/b/c/d/",
            breadcrumbs: [
              { name: "A", url: "https://example.com/a/", routeKey: "a" },
              { name: "B", url: "https://example.com/a/b/", routeKey: "b" },
              { name: "C", url: "https://example.com/a/b/c/", routeKey: "c" },
              { name: "D", url: "https://example.com/a/b/c/d/", routeKey: "deep" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-09" && i.offendingValue?.includes("depth 4")),
    ).toBe(true);
  });
});

// --- FND-SEO-10: Indexability coherence ---

describe("FND-SEO-10: Indexability coherence", () => {
  it("errors: noindex + sitemap.include", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ noindex: true, sitemap: { include: true } })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-10" &&
          i.severity === "error" &&
          i.offendingValue?.includes("noindex=true but sitemap.include=true"),
      ),
    ).toBe(true);
  });

  it("warns: noindex + canonical", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ noindex: true, canonical: "https://example.com/" })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-10" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("canonical"),
      ),
    ).toBe(true);
  });

  it("warns: noindex + hreflang", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({ noindex: true, hreflang: [{ hreflang: "en", href: "https://example.com/" }] }),
        ],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-10" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("hreflang"),
      ),
    ).toBe(true);
  });

  it("errors: published=false + sitemap.include", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ published: false, sitemap: { include: true } })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-10" &&
          i.severity === "error" &&
          i.offendingValue?.includes("published=false"),
      ),
    ).toBe(true);
  });

  it("warns: noindex + full OG metadata", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            noindex: true,
            og: { title: "T", description: "D", image: "https://example.com/og.png" },
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-10" && i.offendingValue?.includes("OG metadata")),
    ).toBe(true);
  });

  it("warns: noindex + structured data", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            noindex: true,
            structuredData: [
              { "@type": "Organization", "@id": "#", name: "A", url: "https://example.com" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some(
        (i) => i.ruleId === "FND-SEO-10" && i.offendingValue?.includes("structured data"),
      ),
    ).toBe(true);
  });

  it("passes for coherent indexable page", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage()],
      }),
    );
    const coherence = issues.filter((i) => i.ruleId === "FND-SEO-10");
    expect(coherence).toHaveLength(0);
  });
});

// --- FND-SEO-11: Breadcrumb validation ---

describe("FND-SEO-11: Breadcrumb validation", () => {
  it("errors on breadcrumb cycle", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            breadcrumbs: [
              { name: "A", url: "https://example.com/a/" },
              { name: "B", url: "https://example.com/b/" },
              { name: "A", url: "https://example.com/a/" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-11" && i.offendingValue?.includes("cycle")),
    ).toBe(true);
  });

  it("errors when breadcrumb parent not found", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            breadcrumbs: [
              { name: "Home", url: "https://example.com/" },
              { name: "Unknown", url: "https://example.com/unknown/" },
              { name: "Current", url: "https://example.com/current/" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some((i) => i.ruleId === "FND-SEO-11" && i.offendingValue?.includes("not found")),
    ).toBe(true);
  });

  it("warns when breadcrumb parent is not published", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({ routeKey: "parent", url: "https://example.com/parent/", published: false }),
          makePage({
            routeKey: "child",
            url: "https://example.com/parent/child/",
            breadcrumbs: [
              { name: "Parent", url: "https://example.com/parent/", routeKey: "parent" },
              { name: "Child", url: "https://example.com/parent/child/", routeKey: "child" },
            ],
          }),
        ],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-11" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("not published"),
      ),
    ).toBe(true);
  });
});

// --- FND-SEO-12: lastmod from content ---

describe("FND-SEO-12: lastmod from content", () => {
  it("warns when lastmod comes from filesystem", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ lastmod: "2025-01-01", lastmodFromContent: false })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-12" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("filesystem"),
      ),
    ).toBe(true);
  });

  it("passes when lastmod comes from content", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ lastmod: "2025-01-01", lastmodFromContent: true })],
      }),
    );
    expect(issues.some((i) => i.ruleId === "FND-SEO-12")).toBe(false);
  });
});

// --- FND-SEO-13: Title composition ---

describe("FND-SEO-13: Title composition", () => {
  it("errors on double brand suffix", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ title: "Home | TestBrand | TestBrand", brand: "TestBrand" })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-13" &&
          i.severity === "error" &&
          i.offendingValue?.includes("double brand"),
      ),
    ).toBe(true);
  });

  it("warns when title equals H1", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ title: "Welcome Home", h1: "Welcome Home" })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-13" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("identical to H1"),
      ),
    ).toBe(true);
  });

  it("warns when rawTitle contains brand", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [makePage({ rawTitle: "Home | TestBrand", brand: "TestBrand" })],
      }),
    );
    expect(
      issues.some(
        (i) =>
          i.ruleId === "FND-SEO-13" &&
          i.severity === "warning" &&
          i.offendingValue?.includes("already contains brand"),
      ),
    ).toBe(true);
  });

  it("passes for properly composed title", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({
            title: "Home | TestBrand",
            h1: "Welcome Home",
            rawTitle: "Home",
            brand: "TestBrand",
          }),
        ],
      }),
    );
    const seo13 = issues.filter((i) => i.ruleId === "FND-SEO-13");
    expect(seo13).toHaveLength(0);
  });
});

// --- Empty / edge cases ---

describe("Edge cases", () => {
  it("returns no issues for empty pages array", () => {
    const issues = validateSeo(makeSiteData({ pages: [] }));
    expect(issues).toHaveLength(0);
  });

  it("returns no issues for fully valid multi-page site", () => {
    const issues = validateSeo(
      makeSiteData({
        pages: [
          makePage({ routeKey: "home", url: "https://example.com/" }),
          makePage({
            routeKey: "about",
            locale: "en",
            url: "https://example.com/about/",
            title: "About | TestBrand",
            description: "About us",
            h1: "About Us",
            canonical: "https://example.com/about/",
            breadcrumbs: [
              { name: "Home", url: "https://example.com/" },
              { name: "About", url: "https://example.com/about/" },
            ],
            rawTitle: "About",
          }),
        ],
      }),
    );
    const errors = issues.filter((i) => i.severity === "error");
    expect(errors).toHaveLength(0);
  });
});
