import { getPath, type LocaleCode, type RouteKey } from "@astro-foundation/core";

export interface ResearchRoute {
  readonly key: string;
  readonly slugs: Record<string, string | undefined>;
  readonly parent?: string;
  readonly kind?: string;
  readonly availability?: string;
  readonly noindex?: boolean;
  readonly sitemap?: { include?: boolean; priority?: number };
}

export function resolveRoutePath(
  routeKey: string,
  locale: string,
  routes: readonly ResearchRoute[],
  defaultLocale: string,
): string {
  return getPath(routeKey as RouteKey, locale as LocaleCode, routes, defaultLocale as LocaleCode);
}
