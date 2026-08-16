/**
 * Unit tests for JSON-LD structured data builders and validators (FND-SEO-06, FND-SEO-14).
 */
import { describe, it, expect } from "vitest";
import {
  LocalBusinessSchema,
  WebSiteSchema,
  OrganizationSchema,
  BreadcrumbListSchema,
  FaqPageSchema,
  buildLocalBusiness,
  buildWebSite,
  buildOrganization,
  buildBreadcrumbList,
  buildFaqPage,
  isEligibleForStructuredData,
  validateStructuredData,
  StructuredDataSchemas,
} from "../../../src/seo/structured-data.ts";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = resolve(__dirname, "../../fixtures/structured-data");

function loadFixture(relPath: string) {
  return JSON.parse(readFileSync(resolve(FIXTURES, relPath), "utf-8"));
}

// --- Builder tests ---

describe("buildLocalBusiness", () => {
  it("builds valid LocalBusiness JSON-LD", () => {
    const result = buildLocalBusiness({
      site: "https://example.com",
      business: {
        name: "ACME",
        description: "A local business",
        telephone: "+1-555-0123",
        email: "info@example.com",
        address: {
          city: "Belgrade",
          postalCode: "11000",
          country: "RS",
          street: "123 Main St",
        },
      },
      locale: "sr",
      image: "https://example.com/img.jpg",
    });

    expect(result).toEqual({
      "@type": "LocalBusiness",
      "@id": "https://example.com/#organization",
      name: "ACME",
      description: "A local business",
      url: "https://example.com",
      telephone: "+1-555-0123",
      email: "info@example.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Main St",
        addressLocality: "Belgrade",
        postalCode: "11000",
        addressCountry: "RS",
      },
      image: "https://example.com/img.jpg",
      inLanguage: "sr",
    });

    // Verify it passes schema validation
    expect(LocalBusinessSchema.safeParse(result).success).toBe(true);
  });

  it("builds without optional fields", () => {
    const result = buildLocalBusiness({
      site: "https://example.com",
      business: {
        name: "ACME",
        description: "A business",
        address: { city: "NYC", postalCode: "10001", country: "US" },
      },
    });
    expect(result.telephone).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.image).toBeUndefined();
    expect(result.inLanguage).toBeUndefined();
    expect(result.address.streetAddress).toBeUndefined();
  });
});

describe("buildWebSite", () => {
  it("builds valid WebSite JSON-LD", () => {
    const result = buildWebSite({
      site: "https://example.com",
      name: "ACME Site",
      locale: "en",
    });
    expect(result["@type"]).toBe("WebSite");
    expect(result["@id"]).toBe("https://example.com/#website");
    expect(WebSiteSchema.safeParse(result).success).toBe(true);
  });

  it("builds without locale", () => {
    const result = buildWebSite({
      site: "https://example.com",
      name: "ACME Site",
    });
    expect(result.inLanguage).toBeUndefined();
  });
});

describe("buildOrganization", () => {
  it("builds valid Organization JSON-LD", () => {
    const result = buildOrganization({
      site: "https://example.com",
      name: "ACME",
      logo: "https://example.com/logo.png",
    });
    expect(result["@type"]).toBe("Organization");
    expect(OrganizationSchema.safeParse(result).success).toBe(true);
  });

  it("builds without logo", () => {
    const result = buildOrganization({
      site: "https://example.com",
      name: "ACME",
    });
    expect(result.logo).toBeUndefined();
  });
});

describe("buildBreadcrumbList", () => {
  it("builds valid BreadcrumbList JSON-LD", () => {
    const result = buildBreadcrumbList([
      { name: "Home", url: "https://example.com/" },
      { name: "About", url: "https://example.com/about/" },
    ]);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0]?.position).toBe(1);
    expect(result.itemListElement[1]?.position).toBe(2);
    expect(BreadcrumbListSchema.safeParse(result).success).toBe(true);
  });

  it("handles empty items", () => {
    const result = buildBreadcrumbList([]);
    expect(result.itemListElement).toHaveLength(0);
  });
});

describe("buildFaqPage", () => {
  it("builds valid FAQPage JSON-LD", () => {
    const result = buildFaqPage([{ question: "What is this?", answer: "A FAQ." }]);
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toHaveLength(1);
    expect(FaqPageSchema.safeParse(result).success).toBe(true);
  });

  it("handles multiple FAQs", () => {
    const result = buildFaqPage([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(result.mainEntity).toHaveLength(2);
  });
});

// --- Eligibility check (FND-SEO-14) ---

describe("isEligibleForStructuredData", () => {
  it("returns true when type is in capabilities", () => {
    expect(isEligibleForStructuredData("Organization", ["Organization", "WebSite"])).toBe(true);
  });

  it("returns false when type is not in capabilities", () => {
    expect(isEligibleForStructuredData("LocalBusiness", ["Organization", "WebSite"])).toBe(false);
  });

  it("returns false for empty capabilities", () => {
    expect(isEligibleForStructuredData("Organization", [])).toBe(false);
  });
});

// --- validateStructuredData ---

describe("validateStructuredData", () => {
  it("validates valid LocalBusiness fixture", () => {
    const data = loadFixture("valid/local-business.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(true);
  });

  it("validates valid WebSite fixture", () => {
    const data = loadFixture("valid/website.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(true);
  });

  it("validates valid Organization fixture", () => {
    const data = loadFixture("valid/organization.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(true);
  });

  it("validates valid BreadcrumbList fixture", () => {
    const data = loadFixture("valid/breadcrumb-list.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(true);
  });

  it("validates valid FAQPage fixture", () => {
    const data = loadFixture("valid/faq-page.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL in LocalBusiness", () => {
    const data = loadFixture("invalid/local-business-bad-url.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it("rejects missing required fields", () => {
    const data = loadFixture("invalid/missing-required-fields.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("rejects unknown @type", () => {
    const data = loadFixture("invalid/wrong-type.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(false);
    expect(result.errors![0]).toContain("Unknown or missing @type");
  });

  it("rejects invalid URL in BreadcrumbList", () => {
    const data = loadFixture("invalid/breadcrumb-bad-url.json");
    const result = validateStructuredData(data);
    expect(result.success).toBe(false);
  });

  it("rejects missing @type", () => {
    const result = validateStructuredData({ name: "test" });
    expect(result.success).toBe(false);
    expect(result.errors![0]).toContain("Unknown or missing @type");
  });

  it("rejects null", () => {
    const result = validateStructuredData(null);
    expect(result.success).toBe(false);
  });
});

// --- Schema map ---

describe("StructuredDataSchemas", () => {
  it("has schemas for all 5 types", () => {
    expect(Object.keys(StructuredDataSchemas)).toEqual([
      "LocalBusiness",
      "WebSite",
      "Organization",
      "BreadcrumbList",
      "FAQPage",
    ]);
  });
});
