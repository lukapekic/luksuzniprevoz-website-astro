/**
 * Client roster + display policy — FND-ARCH-03 / FND-TYPE-02.
 *
 * `displayPolicy` is route-coupled: its keys are `RouteKey`s (the original
 * semantic names map homepage→home and businessHub→businessTransportation).
 * Authored as typed TS so every placement is a compile-checked
 * RouteKey; a module-load guard asserts those keys are known routes (closes
 * the rename gap if types:generate isn't re-run after a route rename — same
 * posture as navigation.ts/services.ts).
 *
 * `displayName` values are brand/proper names and are NOT translated (same as
 * business.publicBrand) — one source, all locales. `context` is a
 * relationship code, not prose. `logoAsset` is an imported local asset or
 * null. `logoStatus` records whether that asset is approved for public use.
 *
 * `logoPermissionShouldBeVerified`: logos must not be shown publicly until
 * usage rights are confirmed — consuming components gate public logo display
 * on per-client `logoStatus`, not just asset presence.
 */
import type { RouteKey } from "@astro-foundation/core";
import { routeMap } from "./routes.ts";

// --- Enum vocabularies (typed unions) --------------------------------------

export type ClientCategory =
  | "hotel"
  | "aviation"
  | "diplomatic"
  | "international-organisation"
  | "sports-federation";

/** Relationship context for a client (code, not prose). Extend as more arise. */
export type ClientContext = "private-flight-related-transport";

export type ClientLogoId =
  | "hyatt-regency"
  | "president-palace-hotel"
  | "qatar-airways"
  | "square-nine-hotels"
  | "chinese-embassy"
  | "osce"
  | "serbian-swimming-association";

export type LogoStatus =
  | "approved-for-public-display"
  | "asset-required"
  | "transparent-asset-available-or-planned"
  | "asset-and-public-usage-check-required";

// --- Structural types ------------------------------------------------------

export interface Client {
  /** Stable id; used as React/key and to match future logo assets. */
  id: string;
  displayName: string;
  category: ClientCategory;
  context?: ClientContext;
  /** Stable identifier into client-media.ts; null until an asset is provided. */
  logoAsset: ClientLogoId | null;
  logoStatus: LogoStatus;
  /** Routes on which this client may be shown after the route-level policy passes. */
  placements: RouteKey[];
}

export interface ClientDisplayPolicy {
  /** True where the client roster should be shown. Keys are RouteKeys. */
  placements: Partial<Record<RouteKey, boolean>>;
  /** Logos must not ship publicly until usage rights are confirmed. */
  logoPermissionShouldBeVerified: boolean;
}

// --- Authoritative client facts -------------------------------------------

export const clientDisplayPolicy: ClientDisplayPolicy = {
  placements: {
    home: false,
    businessTransportation: true,
    delegationTransportation: true,
  },
  logoPermissionShouldBeVerified: true,
};

export const clients: Client[] = [
  {
    id: "president-palace-belgrade",
    displayName: "President Palace Belgrade",
    category: "hotel",
    logoAsset: "president-palace-hotel",
    logoStatus: "approved-for-public-display",
    placements: ["businessTransportation"],
  },
  {
    id: "hyatt-regency-belgrade",
    displayName: "Hyatt Regency Belgrade",
    category: "hotel",
    logoAsset: "hyatt-regency",
    logoStatus: "approved-for-public-display",
    placements: ["businessTransportation"],
  },
  {
    id: "qatar-airways",
    displayName: "Qatar Airways",
    category: "aviation",
    context: "private-flight-related-transport",
    logoAsset: "qatar-airways",
    logoStatus: "approved-for-public-display",
    placements: ["businessTransportation"],
  },
  {
    id: "chinese-embassy",
    displayName: "Embassy of the People's Republic of China",
    category: "diplomatic",
    logoAsset: "chinese-embassy",
    logoStatus: "approved-for-public-display",
    placements: ["delegationTransportation"],
  },
  {
    id: "osce-mission-to-serbia",
    displayName: "OSCE Mission to Serbia",
    category: "international-organisation",
    logoAsset: "osce",
    logoStatus: "approved-for-public-display",
    placements: ["delegationTransportation"],
  },
  {
    id: "serbian-swimming-federation",
    displayName: "Serbian Swimming Federation",
    category: "sports-federation",
    logoAsset: "serbian-swimming-association",
    logoStatus: "approved-for-public-display",
    placements: ["delegationTransportation"],
  },
  {
    id: "square-nine-belgrade",
    displayName: "Square Nine Hotel Belgrade",
    category: "hotel",
    logoAsset: "square-nine-hotels",
    logoStatus: "approved-for-public-display",
    placements: ["businessTransportation"],
  },
];

// --- Lookup helpers --------------------------------------------------------

/** True if the client roster should be displayed on a given route. */
export function shouldDisplayClientsOn(routeKey: RouteKey): boolean {
  return clientDisplayPolicy.placements[routeKey] ?? false;
}

/** Clients with both a real asset and confirmed public-display permission. */
export function getApprovedClientsFor(routeKey: RouteKey): Client[] {
  if (!shouldDisplayClientsOn(routeKey)) return [];
  return clients.filter(
    (client) =>
      client.placements.includes(routeKey) &&
      client.logoAsset !== null &&
      client.logoStatus === "approved-for-public-display",
  );
}

/** Routes where the client roster is shown, in declaration order. */
export const clientDisplayRoutes: RouteKey[] = (
  Object.keys(clientDisplayPolicy.placements) as RouteKey[]
).filter((k) => clientDisplayPolicy.placements[k] === true);

// --- Drift guard (dev/build) ----------------------------------------------

/**
 * Verifies, at module load (dev/build):
 *   1. displayPolicy placement keys are known routes (compile already
 *      guarantees they're valid RouteKeys; this closes the gap if
 *      types:generate isn't re-run after a route rename);
 *   2. per-client placements are known, route-level-enabled routes;
 *   3. client ids are unique (a duplicate would collide as a list key and when
 *      matching logo assets later).
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertClientsConsistency(): void {
  const knownRoutes = new Set(Object.keys(routeMap));

  // (1) placement keys ⊆ routeMap
  for (const key of Object.keys(clientDisplayPolicy.placements) as RouteKey[]) {
    if (!knownRoutes.has(key)) {
      throw new Error(
        `clients.ts displayPolicy references unknown routeKey "${key}" — not in src/data/routes.ts routeMap (was RouteKey regenerated after a route rename?).`,
      );
    }
  }

  // (2) client placements are known and route-level enabled
  for (const client of clients) {
    for (const routeKey of client.placements) {
      if (!knownRoutes.has(routeKey)) {
        throw new Error(
          `clients.ts client "${client.id}" references unknown routeKey "${routeKey}" — not in src/data/routes.ts routeMap.`,
        );
      }
      if (!clientDisplayPolicy.placements[routeKey]) {
        throw new Error(
          `clients.ts client "${client.id}" is placed on "${routeKey}", but that route is disabled by clientDisplayPolicy.`,
        );
      }
    }
  }

  // (3) unique client ids
  const seen = new Set<string>();
  for (const c of clients) {
    if (seen.has(c.id)) {
      throw new Error(`clients.ts has duplicate client id "${c.id}" — ids must be unique.`);
    }
    seen.add(c.id);
  }
}

assertClientsConsistency();
