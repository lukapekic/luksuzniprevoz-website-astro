import type { RouteKey } from "@astro-foundation/core";
import { getService } from "../data/services.ts";

export interface HubChildItem {
  routeKey: string;
}

/** Match localized card content to the canonical hub relationship and order. */
export function resolveHubChildItems<T extends HubChildItem>(
  hubRouteKey: RouteKey,
  authoredItems: readonly T[],
): T[] {
  const hub = getService(hubRouteKey);
  if (hub.kind !== "hub" || !hub.children) {
    throw new Error(`Route "${hubRouteKey}" is not a configured service hub.`);
  }

  const authoredByRoute = new Map<string, T>();
  for (const item of authoredItems) {
    if (authoredByRoute.has(item.routeKey)) {
      throw new Error(`Hub "${hubRouteKey}" has duplicate content for "${item.routeKey}".`);
    }
    authoredByRoute.set(item.routeKey, item);
  }

  const canonical = new Set<string>(hub.children);
  for (const routeKey of authoredByRoute.keys()) {
    if (!canonical.has(routeKey)) {
      throw new Error(`Hub "${hubRouteKey}" content includes non-child route "${routeKey}".`);
    }
  }

  return hub.children.map((routeKey) => {
    const item = authoredByRoute.get(routeKey);
    if (!item) throw new Error(`Hub "${hubRouteKey}" is missing child content for "${routeKey}".`);
    return item;
  });
}
