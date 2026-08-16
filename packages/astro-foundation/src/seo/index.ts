// @astro-foundation/core seo subpath
export {
  composeTitle,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  type SeoData,
} from "./seo-data.ts";

export {
  LocalBusinessSchema,
  WebSiteSchema,
  OrganizationSchema,
  BreadcrumbListSchema,
  FaqPageSchema,
  StructuredDataSchemas,
  buildLocalBusiness,
  buildWebSite,
  buildOrganization,
  buildBreadcrumbList,
  buildFaqPage,
  isEligibleForStructuredData,
  validateStructuredData,
  type LocalBusiness,
  type WebSite,
  type Organization,
  type BreadcrumbList,
  type FaqPage,
} from "./structured-data.ts";

export { validateSeo, type SeoPage, type SeoSiteData } from "./validate-seo.ts";

export {
  ogContentHash,
  validateFontScriptCoverage,
  generateOgSvg,
  generateOgImage,
  pagesNeedingOgGeneration,
  type OgImageOptions,
  type OgCacheEntry,
  type OgGeneratorResult,
  type FontCoverageIssue,
} from "./og.ts";

export {
  generateRedirects,
  formatRedirectsJson,
  formatRedirectsCloudflare,
  formatRedirectsVercel,
  type RedirectEntry,
  type RouteWithPreviousSlugs,
} from "./redirects.ts";
