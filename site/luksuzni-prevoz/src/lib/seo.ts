/**
 * SEO helpers for the production site.
 * Builds SeoData objects from content and config.
 * FND-SEO-13: Title template "{title} | {brand}"
 */

import type { SeoData } from "@astro-foundation/core/seo";
import {
  buildLocalBusiness,
  buildWebSite,
  buildBreadcrumbList,
  isEligibleForStructuredData,
  validateStructuredData,
} from "@astro-foundation/core/seo";
import type { Route, Locale } from "@astro-foundation/core/i18n";
import { buildHreflangSet, getBreadcrumbs, getPath } from "@astro-foundation/core/i18n";
import type { BreadcrumbItem, LocaleCode } from "@astro-foundation/core/i18n";
import type { RouteKey } from "@astro-foundation/core";
import { config } from "../../foundation.config.ts";
import { routes, routeMap } from "../data/routes.ts";
import { defaultLocale, getLocaleConfig } from "../data/locales.ts";
import { navLabelMap } from "../data/navigation.ts";

import { business } from "../data/business.ts";
import { contact, isVerified, type DayOfWeek } from "../data/contact.ts";
import { t } from "./i18n.ts";

interface PageSeoOptions {
  routeKey: RouteKey;
  locale: LocaleCode;
  title: string;
  description: string;
  noindex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  structuredData?: object[];
}

/** Cast routes to the expected Route[] type for core functions */
const typedRoutes = routes as unknown as Route[];
const typedLocales = config.locales.locales as unknown as Locale[];

/**
 * Build full SeoData with locale info, hreflang, canonical, etc.
 */
export function buildPageSeo(opts: PageSeoOptions): SeoData {
  const { routeKey, locale, title, description, ogImage, ogImageAlt, structuredData } = opts;

  const noindex = Boolean(
    opts.noindex || routeMap[routeKey]?.noindex || routeMap[routeKey]?.availability !== "published",
  );
  const localeConfig = getLocaleConfig(locale);
  const path = getPath(routeKey, locale, typedRoutes, defaultLocale);
  const canonical = noindex ? undefined : `${config.site}${path}`;

  // Search engines require fully qualified alternate URLs in document head.
  const hreflang = noindex
    ? []
    : buildHreflangSet(routeKey, locale, typedRoutes, typedLocales, defaultLocale).map((link) => ({
        hreflang: link.hreflang,
        href: `${config.site}${link.href}`,
      }));

  return {
    title,
    description,
    canonical,
    noindex,
    ogImage: ogImage ? new URL(ogImage, config.site).href : undefined,
    ogImageAlt,
    locale: { htmlLang: localeConfig.htmlLang, dir: localeConfig.dir },
    hreflang,
    structuredData: noindex ? undefined : buildSiteStructuredData(routeKey, locale, structuredData),
    brand: config.brand,
  };
}

/**
 * Build breadcrumb data for a given route.
 */
export function buildBreadcrumbs(routeKey: RouteKey, locale: LocaleCode): BreadcrumbItem[] {
  const labels = navLabelMap(locale);
  labels.set("home", t("home.title", locale));
  const chain = getBreadcrumbs(typedRoutes, routeKey, locale, defaultLocale, labels);
  if (routeKey !== "home" && !chain.some((item) => item.routeKey === "home")) {
    chain.unshift({
      routeKey: "home",
      label: labels.get("home")!,
      path: getPath("home", locale, typedRoutes, defaultLocale),
    });
  }
  return chain;
}

/** Canonical entity facts are shared; descriptions and navigation names are localized. */
function buildSiteStructuredData(
  routeKey: RouteKey,
  locale: LocaleCode,
  pageData: object[] = [],
): object[] {
  const nodes: object[] = [];
  const language = getLocaleConfig(locale).htmlLang;
  const schemaDays = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  } as const satisfies Record<DayOfWeek, string>;
  if (contact.office.verificationStatus === "verified" && contact.office.address) {
    nodes.push(
      buildLocalBusiness({
        site: config.site,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: contact.officeHours.days.map((day) => schemaDays[day]),
            opens: contact.officeHours.opens,
            closes: contact.officeHours.closes,
          },
        ],
        business: {
          name: business.publicBrand,
          description: t("business.entityDescription", locale),
          telephone: isVerified(contact.phone) ? (contact.phone.value ?? undefined) : undefined,
          email: isVerified(contact.email) ? (contact.email.value ?? undefined) : undefined,
          address: {
            street: contact.office.address,
            city: t("location.belgrade", locale),
            postalCode: contact.office.postalCode,
            country: "RS",
          },
        },
      }),
    );
  }
  if (routeKey === "home") {
    nodes.push(buildWebSite({ site: config.site, name: config.brand, locale: language }));
  } else {
    const breadcrumbs = buildBreadcrumbs(routeKey, locale);
    nodes.push(
      buildBreadcrumbList(
        breadcrumbs.map((item) => ({
          name: item.label,
          url: new URL(item.path, config.site).href,
        })),
      ),
    );
  }
  nodes.push(...pageData);
  return nodes.map((node) => {
    const type = (node as { "@type"?: string })["@type"];
    if (!type || !isEligibleForStructuredData(type, config.capabilities.structuredData)) {
      throw new Error(`Undeclared structured-data type: ${type}`);
    }
    const validation = validateStructuredData(node);
    if (!validation.success) throw new Error(`Invalid ${type}: ${validation.errors?.join(", ")}`);
    return { "@context": "https://schema.org", ...node };
  });
}
