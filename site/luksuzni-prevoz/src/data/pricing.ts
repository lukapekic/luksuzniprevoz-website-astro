/**
 * Pricing matrix — FND-ARCH-03 / FND-TYPE-02.
 *
 * Route-coupled structural data, authored as typed TS (not JSON): every entry
 * is keyed by a `VehicleId` (imported from fleet.ts), so a typo is a compile
 * error. The runtime guard reconciles the partial numeric-pricing map with each
 * vehicle's published/quote-only state.
 *
 * SINGLE SOURCE OF TRUTH for prices: numeric fare facts live HERE and nowhere
 * else. Content frontmatter MUST NOT duplicate prices, formulas, or vehicle
 * capacities — it references vehicles by `vehicleId` and points at this data
 * via `source: "pricing-data"`. The pricing page renders this matrix; service
 * pages reference vehicles for recommendation, never their prices.
 *
 * Source: owner-supplied "Cene Limo servis usluga.xlsx", table "LIMO SERVIS
 * USLUGE", columns: Najam po satu / Poludnevni najam 5h·100km / Celodnevni
 * najam 10h·200km / Prevoz po km. Airport transfer values are also represented
 * below, owner-confirmed in EUR for Belgrade Airport ↔ Belgrade city locations.
 * The "PUTEVI IZ BEOGRADA" section remains outside this service contract.
 *
 * No Zod: no external untrusted input, no independent artifact to validate.
 * Typing is the validation; the module-load guard is the structural check.
 */
import type { VehicleId } from "./fleet.ts";
import { vehicleIds, vehicles } from "./fleet.ts";

// --- Enum vocabularies (typed unions) --------------------------------------

/** A pricing unit (how a fare is quoted). */
export type PricingUnit = "per-hour" | "per-half-day" | "per-full-day" | "per-kilometre";
export type PricingCurrency = "EUR";

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
 * exactly as supplied; Airport transfer values are owner-confirmed in EUR.
 */
export interface VehiclePricing {
  vehicleId: VehicleId;
  currency: PricingCurrency;
  /** Najam po satu — flat hourly hire. */
  hourly: number;
  /** Poludnevni najam — 5h / 100km block. */
  halfDay: number;
  /** Celodnevni najam — 10h / 200km block. */
  fullDay: number;
  /** Prevoz po km — per-kilometre rate. */
  perKm: number;
  /** Airport transfer fare, per vehicle, Belgrade Airport ↔ Belgrade city. */
  airportTransfer: {
    amount: number;
    currency: "EUR";
    scope: "belgrade-airport-to-belgrade-city";
  };
}

// --- Authoritative pricing facts ------------------------------------------
// Keyed by VehicleId. Quote-only vehicles intentionally have no numeric row.

export const pricing: Partial<Record<VehicleId, VehiclePricing>> = {
  "skoda-superb": {
    vehicleId: "skoda-superb",
    currency: "EUR",
    hourly: 50,
    halfDay: 140,
    fullDay: 220,
    perKm: 1.0,
    airportTransfer: { amount: 40, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-e-class": {
    vehicleId: "mercedes-e-class",
    currency: "EUR",
    hourly: 55,
    halfDay: 160,
    fullDay: 240,
    perKm: 1.1,
    airportTransfer: { amount: 45, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-v-class-6-plus-1-extra-long": {
    vehicleId: "mercedes-v-class-6-plus-1-extra-long",
    currency: "EUR",
    hourly: 70,
    halfDay: 180,
    fullDay: 280,
    perKm: 1.3,
    airportTransfer: { amount: 60, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-v-class-7-plus-1-extra-long": {
    vehicleId: "mercedes-v-class-7-plus-1-extra-long",
    currency: "EUR",
    hourly: 70,
    halfDay: 180,
    fullDay: 280,
    perKm: 1.3,
    airportTransfer: { amount: 60, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-vito-tourer-8-plus-1": {
    vehicleId: "mercedes-vito-tourer-8-plus-1",
    currency: "EUR",
    hourly: 60,
    halfDay: 170,
    fullDay: 260,
    perKm: 1.2,
    airportTransfer: { amount: 50, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-s-class": {
    vehicleId: "mercedes-s-class",
    currency: "EUR",
    hourly: 100,
    halfDay: 320,
    fullDay: 550,
    perKm: 2.0,
    airportTransfer: { amount: 90, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
  "mercedes-sprinter": {
    vehicleId: "mercedes-sprinter",
    currency: "EUR",
    hourly: 110,
    halfDay: 200,
    fullDay: 320,
    perKm: 2.6,
    airportTransfer: { amount: 100, currency: "EUR", scope: "belgrade-airport-to-belgrade-city" },
  },
};

// --- Lookup helpers --------------------------------------------------------

export function getPricing(id: VehicleId): VehiclePricing | null {
  return pricing[id] ?? null;
}

// --- Drift guard (dev/build) ----------------------------------------------

/**
 * Verifies, at module load (dev/build): every published fleet vehicle has a
 * numeric pricing entry, quote-only vehicles do not, and every pricing entry
 * belongs to a canonical fleet vehicle. This closes the fleet↔pricing side of
 * the two-sources-of-truth closure (fleet.ts's own guard closes uniqueness).
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertPricingConsistency(): void {
  const fleetSet = new Set<string>(vehicleIds);
  const pricingSet = new Set<string>(Object.keys(pricing));

  for (const vehicle of vehicles) {
    const hasPricing = pricingSet.has(vehicle.id);
    if (vehicle.pricingStatus === "published" && !hasPricing) {
      throw new Error(
        `pricing.ts is missing an entry for published fleet vehicle "${vehicle.id}".`,
      );
    }
    if (vehicle.pricingStatus === "quote-only" && hasPricing) {
      throw new Error(
        `pricing.ts has an entry for quote-only fleet vehicle "${vehicle.id}" — publish its pricing status in the same change or remove the numeric pricing entry.`,
      );
    }
  }
  for (const id of pricingSet) {
    if (!fleetSet.has(id)) {
      throw new Error(
        `pricing.ts has an entry for "${id}" which is not in fleet.ts — add the vehicle to the fleet roster or remove the pricing entry.`,
      );
    }
    const entry = pricing[id as VehicleId];
    if (entry?.vehicleId !== id) {
      throw new Error(
        `pricing.ts key "${id}" does not match its vehicleId "${entry?.vehicleId ?? "missing"}".`,
      );
    }
  }
}

assertPricingConsistency();
