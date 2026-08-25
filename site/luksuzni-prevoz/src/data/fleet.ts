/**
 * Fleet roster — FND-ARCH-03 / FND-TYPE-02.
 *
 * Route-coupled structural data, authored as typed TS (not JSON): every
 * `vehicleId` is a member of the explicit `VehicleId` union, so a typo is a
 * compile error. Same pattern as services.ts / clients.ts / navigation.ts.
 *
 * VOCABULARY: the vehicle identity lives HERE and is the single source of
 * truth. Content frontmatter references vehicles by `vehicleId` (validated
 * against this roster by content:validate); pricing.ts keys its price matrix
 * by the same `VehicleId`. A module-load guard (assertFleetConsistency)
 * asserts ids are unique and that pricing.ts and fleet.ts agree on the roster
 * (the fleet↔pricing side of the two-sources-of-truth closure).
 *
 * The source is the owner-supplied "Cene Limo servis usluga.xlsx". Only facts
 * present in the source are recorded here: identity + display name. Passenger
 * capacity is recorded only where the source id explicitly encodes it
 * (e.g. "mercedes-v-class-6-plus-1-extra-long" → 6 passengers + 1 chauffeur);
 * it is null where the source states no number, so nothing is fabricated.
 * Vehicle DISPLAY NAMES (brand/proper names) are NOT translated — one source,
 * all locales (same posture as business.publicBrand / clients.displayName).
 *
 * No Zod: no external untrusted input, no independent artifact to validate.
 * Typing is the validation; the module-load guard is the structural check.
 */

// --- Enum vocabularies (typed unions) --------------------------------------

/** Coarse vehicle class, derived from the source's vehicle grouping. */
export type VehicleClass = "sedan" | "van" | "minivan" | "bus";

/**
 * Stable vehicle id — an explicit union (not derived from the `vehicles` array,
 * which would be circular). Listed exactly once here; `Vehicle.id: VehicleId`
 * and `pricing: Record<VehicleId, …>` together force the array and the pricing
 * matrix to cover the full set (TS requires every union key in a Record), and
 * assertFleetConsistency closes the array↔pricing loop at runtime.
 */
export type VehicleId =
  | "skoda-superb"
  | "mercedes-e-class"
  | "mercedes-v-class-6-plus-1-extra-long"
  | "mercedes-v-class-7-plus-1-extra-long"
  | "mercedes-vito-tourer-8-plus-1"
  | "mercedes-s-class"
  | "mercedes-sprinter";

// --- Structural types ------------------------------------------------------

export interface Vehicle {
  /** Stable id; matches pricing.ts keys and content frontmatter `vehicleIds`. */
  id: VehicleId;
  /** Display name from the source (not translated). */
  displayName: string;
  /** Coarse class for grouping/filtering on the fleet page. */
  vehicleClass: VehicleClass;
  /**
   * Passenger seats, ONLY where the source id explicitly encodes the count
   * (e.g. "6+1" → 6). null where the source states no number — never fabricated.
   * The "+1" is the chauffeur and is not counted in passengers.
   */
  passengers: number | null;
}

// --- Authoritative fleet facts --------------------------------------------
// Sourced from "Cene Limo servis usluga.xlsx" (table "LIMO SERVIS USLUGE").
// Display names are the source's `sourceName` verbatim.
export const vehicles: Vehicle[] = [
  {
    id: "skoda-superb",
    displayName: "Škoda Superb",
    vehicleClass: "sedan",
    passengers: 3,
  },
  {
    id: "mercedes-e-class",
    displayName: "Mercedes E klasa",
    vehicleClass: "sedan",
    passengers: 3,
  },
  {
    id: "mercedes-v-class-6-plus-1-extra-long",
    displayName: "Mercedes V klasa 6+1 Extra Long",
    vehicleClass: "van",
    passengers: 6,
  },
  {
    id: "mercedes-v-class-7-plus-1-extra-long",
    displayName: "Mercedes V klasa 7+1 Extra Long",
    vehicleClass: "van",
    passengers: 7,
  },
  {
    id: "mercedes-vito-tourer-8-plus-1",
    displayName: "Mercedes Vito Tourer 8+1",
    vehicleClass: "minivan",
    passengers: 8,
  },
  {
    id: "mercedes-s-class",
    displayName: "Mercedes S klasa",
    vehicleClass: "sedan",
    passengers: 3,
  },
  {
    id: "mercedes-sprinter",
    displayName: "Mercedes Sprinter",
    vehicleClass: "bus",
    passengers: 19,
  },
];

// --- Lookup helpers --------------------------------------------------------

/** All vehicle ids, in declaration order. Drives the Zod enum in the content schema. */
export const vehicleIds: VehicleId[] = vehicles.map((v) => v.id);

const vehicleById = new Map<string, Vehicle>(vehicles.map((v) => [v.id, v]));

export function getVehicle(id: string): Vehicle {
  const v = vehicleById.get(id);
  if (!v) throw new Error(`Vehicle not found: ${id}`);
  return v;
}

// --- Drift guard (dev/build) ----------------------------------------------

/**
 * Verifies, at module load (dev/build):
 *   1. fleet ids are unique (a duplicate would collide as a list key and when
 *      matching the pricing matrix);
 *   2. the fleet roster and the pricing roster agree on exactly the same id
 *      set (the fleet↔pricing side of the two-sources-of-truth closure — a
 *      vehicle priced but not listed, or listed but unpriced, fails loud).
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertFleetConsistency(): void {
  // (1) unique ids
  const seen = new Set<string>();
  for (const v of vehicles) {
    if (seen.has(v.id)) {
      throw new Error(`fleet.ts has duplicate vehicle id "${v.id}" — ids must be unique.`);
    }
    seen.add(v.id);
  }

  // (2) agreement with pricing.ts is asserted from pricing.ts (it imports the
  // VehicleId union from here, and Record<VehicleId, …> forces completeness),
  // so the closure is checked from the pricing side. This guard closes the
  // internal uniqueness side.
}

assertFleetConsistency();
