/**
 * JSON-LD structured data builders with Zod validation.
 * FND-SEO-06: Typed builders for each structured data type.
 * FND-SEO-14: Eligibility check for structured data types.
 */
import { z } from "zod";

// --- Zod schemas for structured data validation (FND-SEO-04) ---

export const LocalBusinessSchema = z.object({
  "@type": z.literal("LocalBusiness"),
  "@id": z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  telephone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.object({
    "@type": z.literal("PostalAddress"),
    streetAddress: z.string().optional(),
    addressLocality: z.string(),
    postalCode: z.string(),
    addressCountry: z.string(),
  }),
  image: z.string().url().optional(),
  inLanguage: z.string().optional(),
  areaServed: z.array(z.string()).optional(),
});

export const WebSiteSchema = z.object({
  "@type": z.literal("WebSite"),
  "@id": z.string(),
  url: z.string().url(),
  name: z.string(),
  inLanguage: z.string().optional(),
});

export const OrganizationSchema = z.object({
  "@type": z.literal("Organization"),
  "@id": z.string(),
  name: z.string(),
  url: z.string().url(),
  logo: z.string().url().optional(),
});

export const BreadcrumbListSchema = z.object({
  "@type": z.literal("BreadcrumbList"),
  itemListElement: z.array(
    z.object({
      "@type": z.literal("ListItem"),
      position: z.number(),
      name: z.string(),
      item: z.string().url(),
    }),
  ),
});

export const FaqPageSchema = z.object({
  "@type": z.literal("FAQPage"),
  mainEntity: z.array(
    z.object({
      "@type": z.literal("Question"),
      name: z.string(),
      acceptedAnswer: z.object({
        "@type": z.literal("Answer"),
        text: z.string(),
      }),
    }),
  ),
});

// Inferred output types
export type LocalBusiness = z.infer<typeof LocalBusinessSchema>;
export type WebSite = z.infer<typeof WebSiteSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type BreadcrumbList = z.infer<typeof BreadcrumbListSchema>;
export type FaqPage = z.infer<typeof FaqPageSchema>;

// Map of all schemas by @type for generic validation
export const StructuredDataSchemas: Record<string, z.ZodTypeAny> = {
  LocalBusiness: LocalBusinessSchema,
  WebSite: WebSiteSchema,
  Organization: OrganizationSchema,
  BreadcrumbList: BreadcrumbListSchema,
  FAQPage: FaqPageSchema,
};

// --- Builder functions (FND-SEO-06: built from shared data) ---

/**
 * Builds a LocalBusiness JSON-LD object from business data.
 */
export function buildLocalBusiness(data: {
  site: string;
  business: {
    name: string;
    description: string;
    telephone?: string;
    email?: string;
    address: {
      city: string;
      postalCode: string;
      country: string;
      street?: string;
    };
  };
  locale?: string;
  image?: string;
}): LocalBusiness {
  return {
    "@type": "LocalBusiness",
    "@id": `${data.site}/#organization`,
    name: data.business.name,
    description: data.business.description,
    url: data.site,
    telephone: data.business.telephone,
    email: data.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.business.address.street,
      addressLocality: data.business.address.city,
      postalCode: data.business.address.postalCode,
      addressCountry: data.business.address.country,
    },
    image: data.image,
    inLanguage: data.locale,
  };
}

/**
 * Builds a WebSite JSON-LD object.
 */
export function buildWebSite(data: { site: string; name: string; locale?: string }): WebSite {
  return {
    "@type": "WebSite",
    "@id": `${data.site}/#website`,
    url: data.site,
    name: data.name,
    inLanguage: data.locale,
  };
}

/**
 * Builds an Organization JSON-LD object.
 */
export function buildOrganization(data: {
  site: string;
  name: string;
  logo?: string;
}): Organization {
  return {
    "@type": "Organization",
    "@id": `${data.site}/#organization`,
    name: data.name,
    url: data.site,
    logo: data.logo,
  };
}

/**
 * Builds a BreadcrumbList JSON-LD object.
 */
export function buildBreadcrumbList(items: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
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
 * Builds a FAQPage JSON-LD object.
 */
export function buildFaqPage(faqs: Array<{ question: string; answer: string }>): FaqPage {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * FND-SEO-14: Checks if a structured data type is eligible
 * based on the site's declared capabilities.
 */
export function isEligibleForStructuredData(type: string, capabilities: string[]): boolean {
  return capabilities.includes(type);
}

/**
 * Validates a JSON-LD object against the appropriate Zod schema.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function validateStructuredData(data: unknown): {
  success: boolean;
  data?: z.infer<(typeof StructuredDataSchemas)[string]>;
  errors?: string[];
} {
  const obj = data as Record<string, unknown>;
  const type = obj?.["@type"];
  if (typeof type !== "string" || !StructuredDataSchemas[type]) {
    return {
      success: false,
      errors: [`Unknown or missing @type: "${type}"`],
    };
  }

  const result = StructuredDataSchemas[type].safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
  };
}
