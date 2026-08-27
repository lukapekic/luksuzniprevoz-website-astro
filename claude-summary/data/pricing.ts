/**
 * Pricing matrix — FND-ARCH-03 / FND-TYPE-02.
 *
 * Route-coupled structural data, authored as typed TS (not JSON): every entry
 * is keyed by a `VehicleId` (imported from fleet.ts), so a typo is a compile
 * error and the pricing roster can never drift from the fleet roster. Same
 * pattern as services.ts / clients.ts / fleet.ts.
 *
 * SINGLE SOURCE OF TRUTH for prices: numeric fare facts live HERE and nowhere
 * else. Content frontmatter MUST NOT duplicate prices, formulas, or vehicle
 * capacities — it references vehicles by `vehicleId` and points at this data
 * via `source: "pricing-data"`. The pricing page renders this matrix; service
 * pages reference vehicles for recommendation, never their prices.
 *
 * Source: owner-supplied "Cene Limo servis usluga.xlsx", table "LIMO SERVIS
 * USLUGE", columns: Najam po satu / Poludnevni najam 5h·100km / Celodnevni
 * najam 10h·200km / Prevoz po km. The "Aerodromski transfer" column and the
 * "PUTEVI IZ BEOGRADA" section are excluded (per the source manifest) and are
 * not represented here. Currency is not explicitly stated in the source
 * (currencyStatus: "not-explicitly-stated-in-source"); do not assume EUR/RSD.
 *
 * No Zod: no external untrusted input, no independent artifact to validate.
 * Typing is the validation; the module-load guard is the structural check.
 */
import type { VehicleId } from "./fleet.ts";
import { vehicleIds } from "./fleet.ts";

// --- Enum vocabularies (typed unions) --------------------------------------

/** A pricing unit (how a fare is quoted). */
export type PricingUnit = "per-hour" | "per-half-day" | "per-full-day" | "per-kilometre";

// --- Structural types ------------------------------------------------------

/** Half-day block: 5 hours, 100 km included (from the source). */
export interface HalfDayBlock {
  hours: 5;
  includedKm: 100;
}
/** Full-day block: 10 hours, 200 km included (from the source). */
export interface FullDayBlock {
  hours: 10;
  includedKm: 200;
}

/** The pricing units manifest (source: the `units` object in the source JSON). */
export const pricingUnits = {
  hourly: "per-hour" as const,
  halfDay: { hours: 5, includedKm: 100 } satisfies HalfDayBlock,
  fullDay: { hours: 10, includedKm: 200 } satisfies FullDayBlock,
  perKm: "per-kilometre" as const,
};

/**
 * Per-vehicle fares. `hourly` / `halfDay` / `fullDay` are flat fares (the
 * source's "Najam po satu" / "Poludnevni najam" / "Celodnevni najam"); `perKm`
 * is the per-kilometre rate (the source's "Prevoz po km"). All numbers are
 * exactly as supplied; currency is unspecified in the source.
 */
export interface VehiclePricing {
  vehicleId: VehicleId;
  /** Najam po satu — flat hourly hire. */
  hourly: number;
  /** Poludnevni najam — 5h / 100km block. */
  halfDay: number;
  /** Celodnevni najam — 10h / 200km block. */
  fullDay: number;
  /** Prevoz po km — per-kilometre rate. */
  perKm: number;
}

// --- Authoritative pricing facts ------------------------------------------
// Keyed by VehicleId so the roster is compile-checked against fleet.ts.

export const pricing: Record<VehicleId, VehiclePricing> = {
  "skoda-superb": {
    vehicleId: "skoda-superb",
    hourly: 50,
    halfDay: 140,
    fullDay: 220,
    perKm: 1.0,
  },
  "mercedes-e-class": {
    vehicleId: "mercedes-e-class",
    hourly: 55,
    halfDay: 160,
    fullDay: 240,
    perKm: 1.1,
  },
  "mercedes-v-class-6-plus-1-extra-long": {
    vehicleId: "mercedes-v-class-6-plus-1-extra-long",
    hourly: 70,
    halfDay: 180,
    fullDay: 280,
    perKm: 1.3,
  },
  "mercedes-v-class-7-plus-1-extra-long": {
    vehicleId: "mercedes-v-class-7-plus-1-extra-long",
    hourly: 70,
    halfDay: 180,
    fullDay: 280,
    perKm: 1.3,
  },
  "mercedes-vito-tourer-8-plus-1": {
    vehicleId: "mercedes-vito-tourer-8-plus-1",
    hourly: 60,
    halfDay: 170,
    fullDay: 260,
    perKm: 1.2,
  },
  "mercedes-s-class": {
    vehicleId: "mercedes-s-class",
    hourly: 100,
    halfDay: 320,
    fullDay: 550,
    perKm: 2.0,
  },
  "mercedes-sprinter": {
    vehicleId: "mercedes-sprinter",
    hourly: 110,
    halfDay: 200,
    fullDay: 320,
    perKm: 2.6,
  },
};

// --- Lookup helpers --------------------------------------------------------

export function getPricing(id: VehicleId): VehiclePricing {
  return pricing[id];
}

// --- Drift guard (dev/build) ----------------------------------------------

/**
 * Verifies, at module load (dev/build): the pricing roster and the fleet
 * roster agree on EXACTLY the same id set — every fleet vehicle has a pricing
 * entry, and every pricing entry is a known fleet vehicle. A vehicle priced
 * but not listed (or listed but unpriced) fails loud. This closes the
 * fleet↔pricing side of the two-sources-of-truth closure (fleet.ts's own guard
 * closes internal uniqueness).
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertPricingConsistency(): void {
  const fleetSet = new Set<string>(vehicleIds);
  const pricingSet = new Set<string>(Object.keys(pricing));

  for (const id of fleetSet) {
    if (!pricingSet.has(id)) {
      throw new Error(
        `pricing.ts is missing an entry for fleet vehicle "${id}" — every fleet vehicle must be priced.`,
      );
    }
  }
  for (const id of pricingSet) {
    if (!fleetSet.has(id)) {
      throw new Error(
        `pricing.ts has an entry for "${id}" which is not in fleet.ts — add the vehicle to the fleet roster or remove the pricing entry.`,
      );
    }
  }
}

assertPricingConsistency();
