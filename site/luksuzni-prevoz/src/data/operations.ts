/**
 * Operational standards — FND-ARCH-03 / FND-TYPE-02.
 *
 * Language-independent structural facts about how the service is delivered:
 * chauffeur standards, vehicle standards, and always-on service amenities.
 * Every field is a code/boolean/number (a controlled vocabulary), authored as
 * typed TS so consuming components branch on known values (a typo is a compile
 * error). No prose, no i18n — display labels, if ever needed, map from these
 * codes to content/ui/*.json later.
 *
 * No consistency guard: this data is not route-coupled and has no second source
 * of truth to cross-check (unlike routes/navigation/services). Typing IS the
 * validation. Single-value unions document the accepted vocabulary and
 * compile-reject out-of-vocabulary strings; extend the union to add values.
 *
 * Scope note: `service.*` here are the GENERAL always-on amenities (every
 * trip). `services.ts` carries PER-SERVICE capability flags (e.g.
 * airportTransportation.luggageAssistance). The two are distinct concerns —
 * general standard vs per-service capability — and intentionally may overlap.
 */
// --- Enum vocabularies (typed unions) --------------------------------------

export type DressCode = "suit-and-tie";

export type CleanlinessStandard = "highest-standard";

export type MaintenanceStandard =
  | "authorized-or-official-service-representatives";

export type InternalTrainingArea =
  | "customer-service"
  | "discretion"
  | "route-knowledge"
  | "airport-procedures"
  | "vip-procedures";

// --- Structural types ------------------------------------------------------

export interface ChauffeurStandards {
  dressCode: DressCode;
  englishSpeakingStandard: boolean;
  minimumLicenseYears: number;
  backgroundChecks: boolean;
  internalTraining: InternalTrainingArea[];
}

export interface VehicleStandards {
  cleanlinessStandard: CleanlinessStandard;
  maintenance: MaintenanceStandard;
  preTripInspectionForImportantTrips: boolean;
  backupVehicleAvailable: boolean;
  requestedConfirmedModelGuaranteed: boolean;
}

export interface ServiceStandards {
  doorOpening: boolean;
  luggageAssistance: boolean;
  passengerInsurance: boolean;
  bottledWater: boolean;
  wifi: boolean;
  chargers: boolean;
  climateControl: boolean;
  childSeatOnRequest: boolean;
  massageSeatsWhereVehicleSupports: boolean;
}

export interface OperationalStandards {
  chauffeurs: ChauffeurStandards;
  vehicles: VehicleStandards;
  service: ServiceStandards;
}

// --- Authoritative operational facts ---------------------------------------

export const operations: OperationalStandards = {
  chauffeurs: {
    dressCode: "suit-and-tie",
    englishSpeakingStandard: true,
    minimumLicenseYears: 5,
    backgroundChecks: true,
    internalTraining: [
      "customer-service",
      "discretion",
      "route-knowledge",
      "airport-procedures",
      "vip-procedures",
    ],
  },
  vehicles: {
    cleanlinessStandard: "highest-standard",
    maintenance: "authorized-or-official-service-representatives",
    preTripInspectionForImportantTrips: true,
    backupVehicleAvailable: true,
    requestedConfirmedModelGuaranteed: true,
  },
  service: {
    doorOpening: true,
    luggageAssistance: true,
    passengerInsurance: true,
    bottledWater: true,
    wifi: true,
    chargers: true,
    climateControl: true,
    childSeatOnRequest: true,
    massageSeatsWhereVehicleSupports: true,
  },
};
