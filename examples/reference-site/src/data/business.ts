/**
 * Business data for structured data (LocalBusiness JSON-LD).
 * Used by buildLocalBusiness() in @astro-foundation/core/seo.
 */
export const businessData = {
  name: "Reference Site",
  description: "A reference implementation of the Astro Foundation Template",
  telephone: "+1-555-0123",
  email: "info@example.com",
  address: {
    street: "123 Main St",
    city: "Belgrade",
    postalCode: "11000",
    country: "RS",
  },
} as const;

export type BusinessData = typeof businessData;
