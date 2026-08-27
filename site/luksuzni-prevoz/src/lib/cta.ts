/**
 * CTA resolution — shared helper (FND-ARCH: reuse before duplicating).
 *
 * Route targets resolve to localized URLs via getPath (FND-I18N-03 — never
 * manual slug concatenation). Flow targets (e.g. the booking wizard) are not
 * yet implemented as routes; V1 routes them to the contact page as the interim
 * booking entry. Replace the flow branch when the booking flow exists.
 */
import { getPath } from "@astro-foundation/core/i18n";
import { routes } from "../data/routes.ts";
import { ctaSchema } from "../content/schemas/shared.ts";
import { defaultLocale } from "../data/locales.ts";
import type { z } from "astro:content";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

/** CTA shape as authored in editorial content (z.infer of ctaSchema). */
export type Cta = z.infer<typeof ctaSchema>;

/**
 * Resolve a CTA's href for the current locale.
 * - route target → getPath (localized, never a raw URL).
 * - flow target → interim contact route (booking flow pending).
 */
export function resolveCtaHref(cta: Cta, locale: LocaleCode): string {
  if (cta.target.type === "route") {
    return getPath(cta.target.routeKey as RouteKey, locale, routes, defaultLocale);
  }
  // Flow target — booking flow not yet implemented; interim → contact route.
  return getPath("contact", locale, routes, defaultLocale);
}
