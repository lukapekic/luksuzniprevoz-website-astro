/**
 * Dedicated Fleet-page participation and ordering.
 *
 * This is presentation data: canonical vehicle facts remain in fleet.ts and
 * numeric fares remain in pricing.ts. Keeping the page flag here prevents a
 * page-specific concern from becoming part of the Vehicle business model.
 */
import { getVehicle, type VehicleId } from "./fleet.ts";

export type FleetPageProfileKey =
  | "mercedesSClass"
  | "mercedesEClass"
  | "skodaSuperb"
  | "skodaKodiaq"
  | "mercedesVClass"
  | "mercedesVitoTourer"
  | "mercedesSprinter";

export type VisibleFleetPageProfileKey = Exclude<FleetPageProfileKey, "mercedesVitoTourer">;

interface VisibleFleetPageModel {
  key: VisibleFleetPageProfileKey;
  vehicleIds: readonly VehicleId[];
  showOnFleetPage: true;
}

interface HiddenFleetPageModel {
  key: "mercedesVitoTourer";
  vehicleIds: readonly ["mercedes-vito-tourer-8-plus-1"];
  showOnFleetPage: false;
  image: null;
}

export type FleetPageModel = VisibleFleetPageModel | HiddenFleetPageModel;

export const fleetPageModels: readonly FleetPageModel[] = [
  { key: "mercedesSClass", vehicleIds: ["mercedes-s-class"], showOnFleetPage: true },
  { key: "mercedesEClass", vehicleIds: ["mercedes-e-class"], showOnFleetPage: true },
  { key: "skodaSuperb", vehicleIds: ["skoda-superb"], showOnFleetPage: true },
  { key: "skodaKodiaq", vehicleIds: ["skoda-kodiaq"], showOnFleetPage: true },
  {
    key: "mercedesVClass",
    vehicleIds: ["mercedes-v-class-6-plus-1-extra-long", "mercedes-v-class-7-plus-1-extra-long"],
    showOnFleetPage: true,
  },
  {
    key: "mercedesVitoTourer",
    vehicleIds: ["mercedes-vito-tourer-8-plus-1"],
    showOnFleetPage: false,
    image: null,
  },
  { key: "mercedesSprinter", vehicleIds: ["mercedes-sprinter"], showOnFleetPage: true },
];

export const visibleFleetPageProfileKeys = [
  "mercedesSClass",
  "mercedesEClass",
  "skodaSuperb",
  "skodaKodiaq",
  "mercedesVClass",
  "mercedesSprinter",
] as const satisfies readonly VisibleFleetPageProfileKey[];

export const visibleFleetPageModels = fleetPageModels.filter(
  (entry): entry is VisibleFleetPageModel => entry.showOnFleetPage,
);

export function assertFleetPageModelConsistency(): void {
  const seenKeys = new Set<string>();
  const seenVehicleIds = new Set<string>();

  for (const entry of fleetPageModels) {
    if (seenKeys.has(entry.key)) {
      throw new Error(`Fleet-page presentation key is duplicated: "${entry.key}".`);
    }
    seenKeys.add(entry.key);

    for (const vehicleId of entry.vehicleIds) {
      getVehicle(vehicleId);
      if (seenVehicleIds.has(vehicleId)) {
        throw new Error(`Fleet-page vehicle id is assigned more than once: "${vehicleId}".`);
      }
      seenVehicleIds.add(vehicleId);
    }
  }

  if (
    visibleFleetPageModels.map((entry) => entry.key).join("|") !==
    visibleFleetPageProfileKeys.join("|")
  ) {
    throw new Error("Fleet-page visible model order differs from the locked presentation order.");
  }

  const vito = fleetPageModels.find((entry) => entry.key === "mercedesVitoTourer");
  if (!vito || vito.showOnFleetPage) {
    throw new Error("Mercedes Vito Tourer must remain explicitly disabled on the Fleet page.");
  }
}

assertFleetPageModelConsistency();
