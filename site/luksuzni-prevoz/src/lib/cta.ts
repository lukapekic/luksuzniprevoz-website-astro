/**
 * CTA resolution — shared helper (FND-ARCH: reuse before duplicating).
 *
 * Route targets resolve to localized URLs via getPath (FND-I18N-03 — never
 * manual slug concatenation). Flow targets resolve through the canonical flow
 * map to the localized Contact route plus a stable request-intent query.
 */
import { getPath } from "@astro-foundation/core/i18n";
import { routes } from "../data/routes.ts";
import type { Cta } from "../content/schemas/shared.ts";
import { defaultLocale } from "../data/locales.ts";
import { getFlowTarget, isFlowKey, type FlowKey } from "../data/flows.ts";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

export type { Cta } from "../content/schemas/shared.ts";

export function resolveFlowHref(flowKey: FlowKey, locale: LocaleCode): string {
  const target = getFlowTarget(flowKey);
  const path = getPath(target.routeKey, locale, routes, defaultLocale);
  const query = new URLSearchParams({ intent: target.intent });
  return `${path}?${query.toString()}`;
}

/**
 * Resolve a CTA's href for the current locale.
 * - route target → getPath (localized, never a raw URL).
 * - anchor target → a same-document fragment identifier.
 * - flow target → canonical localized Contact route + request intent.
 * - unknown runtime flow + `unresolvedFlow:"omit"` → null.
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
  if (!isFlowKey(cta.target.flowKey)) {
    if (options.unresolvedFlow === "omit") return null;
    throw new Error(`Unknown flow key: ${cta.target.flowKey}`);
  }
  return resolveFlowHref(cta.target.flowKey, locale);
}
