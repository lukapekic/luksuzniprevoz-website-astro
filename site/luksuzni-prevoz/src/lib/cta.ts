/**
 * CTA resolution — shared helper (FND-ARCH: reuse before duplicating).
 *
 * Route targets resolve to localized URLs via getPath (FND-I18N-03 — never
 * manual slug concatenation). Flow targets (e.g. the booking wizard) are not
 * yet implemented as routes. Existing consumers retain the interim Contact
 * destination; consumers that must not substitute Contact can opt into an
 * explicit nullable result and omit the unresolved action.
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
 * - anchor target → a same-document fragment identifier.
 * - flow target → interim contact route by default (backward compatible).
 * - flow target + `unresolvedFlow:"omit"` → null.
 */
export interface ResolveCtaOptions {
  unresolvedFlow?: "contact" | "omit";
}

export function resolveCtaHref(cta: Cta, locale: LocaleCode): string;
export function resolveCtaHref(
  cta: Cta,
  locale: LocaleCode,
  options: { unresolvedFlow: "contact" },
): string;
export function resolveCtaHref(
  cta: Cta,
  locale: LocaleCode,
  options: { unresolvedFlow: "omit" },
): string | null;
export function resolveCtaHref(
  cta: Cta,
  locale: LocaleCode,
  options: ResolveCtaOptions = {},
): string | null {
  if (cta.target.type === "route") {
    return getPath(cta.target.routeKey as RouteKey, locale, routes, defaultLocale);
  }
  if (cta.target.type === "anchor") {
    return `#${cta.target.anchorId}`;
  }
  if (options.unresolvedFlow === "omit") return null;
  // Backward-compatible flow behavior for existing callers.
  return getPath("contact", locale, routes, defaultLocale);
}
