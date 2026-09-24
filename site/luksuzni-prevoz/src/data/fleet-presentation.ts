/** Typed public model-family projection; configuration identity stays in fleet/pricing. */
import { fleetModelDisplayNames, type Vehicle, type VehicleId } from "./fleet.ts";
import { pricing } from "./pricing.ts";

export type FleetFamilyKey = Exclude<VehicleId, "mercedes-v-class-6-plus-1-extra-long" | "mercedes-v-class-7-plus-1-extra-long"> | "mercedes-v-class";

const familyById: Record<VehicleId, FleetFamilyKey> = {
  "skoda-superb": "skoda-superb",
  "skoda-kodiaq": "skoda-kodiaq",
  "mercedes-e-class": "mercedes-e-class",
  "mercedes-v-class-6-plus-1-extra-long": "mercedes-v-class",
  "mercedes-v-class-7-plus-1-extra-long": "mercedes-v-class",
  "mercedes-vito-tourer-8-plus-1": "mercedes-vito-tourer-8-plus-1",
  "mercedes-s-class": "mercedes-s-class",
  "mercedes-sprinter": "mercedes-sprinter",
};

export function fleetFamilyKey(id: VehicleId): FleetFamilyKey { return familyById[id]; }
export function fleetFamilyName(vehicle: Vehicle): string {
  return fleetFamilyKey(vehicle.id) === "mercedes-v-class"
    ? fleetModelDisplayNames.mercedesVClass : vehicle.displayName;
}
export function fleetFamilyPassengers(vehicle: Vehicle): number | null {
  return fleetFamilyKey(vehicle.id) === "mercedes-v-class" ? null : vehicle.passengers;
}

export function uniqueFleetFamilies<T extends { vehicle: Vehicle }>(items: readonly T[]): T[] {
  const seen = new Set<FleetFamilyKey>();
  return items.filter((item) => {
    const key = fleetFamilyKey(item.vehicle.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Exact airport family fare only when every canonical configuration agrees. */
export function airportFamilyFare(family: FleetFamilyKey): { amount: number; currency: "EUR" } | null {
  const ids = (Object.keys(familyById) as VehicleId[]).filter((id) => familyById[id] === family);
  const fares = ids.map((id) => pricing[id]?.airportTransfer);
  const first = fares[0];
  if (!first || fares.some((fare) => !fare || fare.scope !== first.scope || fare.currency !== first.currency || fare.amount !== first.amount)) return null;
  return { amount: first.amount, currency: first.currency };
}
