/**
 * Service capabilities + hub composition — FND-ARCH-03 / FND-TYPE-02.
 *
 * Route-coupled structural data, authored as typed TS (not JSON): every
 * `routeKey`, `children`, and `relatedRoutes` entry is a member of the
 * generated `RouteKey` union, so a typo is a compile error. Same pattern as
 * navigation.ts and routes.ts.
 *
 * VOCABULARY: uses the single `RouteKind` union from routes.ts
 * ("page" | "service" | "hub"). The original data's "direct-service" is
 * mapped to "service" — one vocabulary, authoritative in routes.ts. The guard
 * (assertServicesConsistency) asserts every service entry's `kind` matches the
 * route's `kind` in routes.ts, so the two can never silently drift.
 *
 * THREE SOURCES OF TRUTH for hub→children: routes.ts (`parent` — drives URLs +
 * breadcrumbs), navigation.ts (branch children — drives the dropdown), and
 * this file (`children` — drives service capability grouping). The guard
 * closes the services↔routes side by asserting a hub's declared `children`
 * equal exactly the routes whose `parent` is that hub (childrenOf). The
 * navigation↔routes side is guarded by navigation.ts's own routeKey check.
 *
 * No Zod: no external untrusted input, no independent artifact to validate.
 * Typing is the validation; the module-load guard is the structural check.
 */
import type { RouteKey } from "@astro-foundation/core";
import type { VehicleId } from "./fleet.ts";
import { type RouteKind, getRoute, childrenOf, routeMap } from "./routes.ts";

// --- Enum vocabularies (typed unions) --------------------------------------

export type PricingMode =
  "calculable" | "fixed-when-calculable" | "estimated-when-simple" | "from" | "quote";

export type Coverage = "primarily-belgrade";
export type OutsideAreaHandling = "quote";
export type MultiDayHandling = "quote";
/** Service-level international handling (distinct from business.serviceArea.internationalHandling). */
export type ServiceInternationalHandling = "quote";
export type ScheduleChangeHandling = "subject-to-availability-within-reserved-period";
export type WaitingPossible = "custom-quote";
export type StandardStops = "point-to-point";
export type Airport = "belgrade-nikola-tesla";
export type SpecialEventUseCase =
  "birthdays" | "private-parties" | "galas" | "other-special-events";

// --- Booking options -------------------------------------------------------

export interface BookingHourly {
  minimumHours: number;
  publishedKmLimit: number | null;
}
export interface BookingBlock {
  hours: number;
  includedKm: number;
}
export interface BookingOptions {
  hourly?: BookingHourly;
  halfDay?: BookingBlock;
  fullDay?: BookingBlock;
}

export interface PrivateChauffeurBookingOptions extends BookingOptions {
  hourly: BookingHourly;
  halfDay: BookingBlock;
  fullDay: BookingBlock;
}

// --- Service definition (flat; `kind` discriminates hub vs direct service) --

export interface ServiceDef {
  routeKey: RouteKey;
  kind: RouteKind;
  pricingMode: PricingMode[];

  // hub-only
  children?: RouteKey[];
  coverage?: Coverage;
  outsideBelgrade?: OutsideAreaHandling;
  generalUseCases?: SpecialEventUseCase[];

  // direct-service capabilities (presence implies the capability applies)
  flagship?: boolean;
  bookingOptions?: BookingOptions;
  chauffeurRemainsAvailable?: boolean;
  multiplePlannedStops?: boolean;
  scheduleChangeHandling?: ScheduleChangeHandling;
  multiDay?: MultiDayHandling;
  international?: ServiceInternationalHandling;
  customerVehicleChauffeurOnly?: boolean;
  relatedRoutes?: RouteKey[];

  // airport
  airports?: Airport[];
  oneWay?: boolean;
  return?: boolean;
  standardStops?: StandardStops;
  flightTracking?: boolean;
  meetAndGreet?: boolean;
  luggageAssistance?: boolean;
  nameSign?: boolean;
  standardWaitingMinutesAfterLanding?: number;
  commercialAviation?: boolean;
  privateAviation?: boolean;
  fboCoordination?: boolean;

  // corporate
  supportsOneOff?: boolean;
  supportsRecurringContracts?: boolean;
  supportsInvoicing?: boolean;
  supportsNegotiatedPricing?: boolean;
  dedicatedChauffeurAcrossStops?: boolean;

  // delegation / conference / events (shared capability flags)
  multipleVehicles?: boolean;
  mixedVehicleClasses?: boolean;
  dedicatedCoordinator?: boolean;
  securityService?: boolean;
  airportArrivals?: boolean;
  hotelTransfers?: boolean;
  venueShuttles?: boolean;
  multiVehicleSchedules?: boolean;
  individualExecutiveTransfers?: boolean;
  groupTransport?: boolean;
  coupleTransport?: boolean;
  guestTransport?: boolean;
  returnPossible?: boolean;
  waitingPossible?: WaitingPossible;
  customPresentationRequest?: boolean;
  individualAndGroup?: boolean;

  // vip
  discretion?: boolean;
  privacy?: boolean;
  multiVehicle?: boolean;
  dedicatedCoordinatorForComplexBookings?: boolean;
  customDecorationPositioning?: boolean;
}

export interface PrivateChauffeurServiceDef extends ServiceDef {
  routeKey: "privateChauffeur";
  kind: "service";
  bookingOptions: PrivateChauffeurBookingOptions;
  chauffeurRemainsAvailable: true;
  multiplePlannedStops: true;
  scheduleChangeHandling: ScheduleChangeHandling;
  multiDay: "quote";
  international: "quote";
  customerVehicleChauffeurOnly: false;
}

export interface ConferenceCongressVehicleRoles {
  individualExecutive: readonly [VehicleId, VehicleId];
  smallerGroup: readonly [VehicleId];
  largerGroup: readonly [VehicleId];
}

export interface ConferenceCongressServiceDef extends ServiceDef {
  routeKey: "conferenceCongressTransportation";
  kind: "service";
  pricingMode: ["quote"];
  airportArrivals: true;
  hotelTransfers: true;
  venueShuttles: true;
  multiVehicleSchedules: true;
  individualExecutiveTransfers: true;
  groupTransport: true;
  vehicleRoles: ConferenceCongressVehicleRoles;
}

// --- Authoritative service facts ------------------------------------------

export const privateChauffeurService: PrivateChauffeurServiceDef = {
  routeKey: "privateChauffeur",
  kind: "service",
  pricingMode: ["calculable", "quote"],
  coverage: "primarily-belgrade",
  bookingOptions: {
    hourly: { minimumHours: 1, publishedKmLimit: null },
    halfDay: { hours: 5, includedKm: 100 },
    fullDay: { hours: 10, includedKm: 200 },
  },
  chauffeurRemainsAvailable: true,
  multiplePlannedStops: true,
  scheduleChangeHandling: "subject-to-availability-within-reserved-period",
  multiDay: "quote",
  international: "quote",
  customerVehicleChauffeurOnly: false,
  relatedRoutes: ["airportTransportation", "businessTransportation", "vipTransportation"],
};

export const conferenceCongressVehicleRoles = {
  individualExecutive: ["mercedes-s-class", "mercedes-e-class"],
  smallerGroup: ["mercedes-v-class-7-plus-1-extra-long"],
  largerGroup: ["mercedes-sprinter"],
} as const satisfies ConferenceCongressVehicleRoles;

export const conferenceCongressService: ConferenceCongressServiceDef = {
  routeKey: "conferenceCongressTransportation",
  kind: "service",
  pricingMode: ["quote"],
  airportArrivals: true,
  hotelTransfers: true,
  venueShuttles: true,
  multiVehicleSchedules: true,
  individualExecutiveTransfers: true,
  groupTransport: true,
  vehicleRoles: conferenceCongressVehicleRoles,
};

export const services: Record<string, ServiceDef> = {
  privateChauffeur: privateChauffeurService,
  airportTransportation: {
    routeKey: "airportTransportation",
    kind: "service",
    pricingMode: ["fixed-when-calculable", "quote"],
    airports: ["belgrade-nikola-tesla"],
    oneWay: true,
    return: true,
    standardStops: "point-to-point",
    flightTracking: true,
    meetAndGreet: true,
    luggageAssistance: true,
    nameSign: true,
    standardWaitingMinutesAfterLanding: 60,
    commercialAviation: true,
    privateAviation: true,
    fboCoordination: true,
    relatedRoutes: ["privateChauffeur", "vipTransportation"],
  },
  businessTransportation: {
    routeKey: "businessTransportation",
    kind: "hub",
    pricingMode: ["estimated-when-simple", "quote"],
    children: [
      "corporateTransportation",
      "delegationTransportation",
      "conferenceCongressTransportation",
    ],
    coverage: "primarily-belgrade",
    outsideBelgrade: "quote",
  },
  corporateTransportation: {
    routeKey: "corporateTransportation",
    kind: "service",
    pricingMode: ["estimated-when-simple", "quote"],
    supportsOneOff: true,
    supportsRecurringContracts: true,
    supportsInvoicing: true,
    supportsNegotiatedPricing: true,
    dedicatedChauffeurAcrossStops: true,
  },
  delegationTransportation: {
    routeKey: "delegationTransportation",
    kind: "service",
    pricingMode: ["quote"],
    multipleVehicles: true,
    mixedVehicleClasses: true,
    dedicatedCoordinator: true,
    securityService: false,
  },
  conferenceCongressTransportation: conferenceCongressService,
  specialEvents: {
    routeKey: "specialEvents",
    kind: "hub",
    pricingMode: ["from", "quote"],
    children: ["weddingTransportation", "promTransportation", "vipTransportation"],
    coverage: "primarily-belgrade",
    outsideBelgrade: "quote",
    generalUseCases: ["birthdays", "private-parties", "galas", "other-special-events"],
  },
  weddingTransportation: {
    routeKey: "weddingTransportation",
    kind: "service",
    pricingMode: ["quote"],
    coupleTransport: true,
    guestTransport: true,
    multipleVehicles: true,
    mixedVehicleClasses: true,
    returnPossible: true,
    waitingPossible: "custom-quote",
    customPresentationRequest: true,
  },
  promTransportation: {
    routeKey: "promTransportation",
    kind: "service",
    pricingMode: ["quote"],
    individualAndGroup: true,
    multipleVehicles: true,
    mixedVehicleClasses: true,
    returnPossible: true,
    waitingPossible: "custom-quote",
    customPresentationRequest: true,
  },
  vipTransportation: {
    routeKey: "vipTransportation",
    kind: "service",
    pricingMode: ["quote"],
    discretion: true,
    privacy: true,
    privateAviation: true,
    commercialAviation: true,
    multiVehicle: true,
    dedicatedCoordinatorForComplexBookings: true,
    customDecorationPositioning: false,
  },
};

// --- Lookup helpers --------------------------------------------------------

export function getService(key: "privateChauffeur"): PrivateChauffeurServiceDef;
export function getService(
  key: "conferenceCongressTransportation",
): ConferenceCongressServiceDef;
export function getService(key: string): ServiceDef;
export function getService(key: string): ServiceDef {
  const svc = services[key];
  if (!svc) throw new Error(`Service not found: ${key}`);
  return svc;
}

/** All hub service keys, in declaration order. */
export const hubKeys: string[] = Object.entries(services)
  .filter(([, s]) => s.kind === "hub")
  .map(([k]) => k);

/** All direct-service keys, in declaration order. */
export const directServiceKeys: string[] = Object.entries(services)
  .filter(([, s]) => s.kind === "service")
  .map(([k]) => k);

// --- Drift guard (dev/build) ----------------------------------------------

/**
 * Verifies, at module load (dev/build):
 *   1. every services entry is a known route, is NOT a page, and its `kind`
 *      matches the route's `kind` in routes.ts (vocabulary parity — closes the
 *      direct-service/service gap; the two files can never disagree);
 *   2. completeness — every non-page route in routes.ts has a services entry
 *      (a new service/hub route forgotten here fails loud);
 *   3. hub `children` ⊆ routeMap AND exactly equal `childrenOf(routeKey)`
 *      (the services↔routes side of the three-sources-of-truth closure);
 *      a service (kind:service) must not declare children;
 *   4. `relatedRoutes` ⊆ routeMap.
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertServicesConsistency(): void {
  const knownRoutes = new Set(Object.keys(routeMap));
  const serviceKeys = Object.keys(services);

  // (1) known route + not a page + kind parity
  for (const key of serviceKeys) {
    if (!knownRoutes.has(key)) {
      throw new Error(
        `services.ts references unknown routeKey "${key}" — not in src/data/routes.ts routeMap.`,
      );
    }
    const routeKind = getRoute(key).kind;
    const svc = services[key];
    if (routeKind === "page") {
      throw new Error(
        `services.ts declares "${key}" but routes.ts marks it kind:"page" — pages have no service entry. Remove it or change the route kind.`,
      );
    }
    if (svc.kind !== routeKind) {
      throw new Error(
        `services.ts "${key}" kind "${svc.kind}" differs from routes.ts kind "${routeKind}". Vocabulary must agree on a single RouteKind.`,
      );
    }
  }

  // (2) completeness — every non-page route has a services entry
  for (const [key, entry] of Object.entries(routeMap)) {
    if (entry.kind === "page") continue;
    if (!(key in services)) {
      throw new Error(
        `routes.ts has ${entry.kind} route "${key}" with no services.ts entry — add one, or mark the route kind:"page".`,
      );
    }
  }

  // (3) hub children ⊆ routeMap and === routes.ts childrenOf; services have none
  for (const key of serviceKeys) {
    const svc = services[key];
    if (svc.kind === "hub") {
      const declared = svc.children ?? [];
      for (const child of declared) {
        if (!knownRoutes.has(child)) {
          throw new Error(`services.ts hub "${key}" lists unknown child "${child}".`);
        }
      }
      const routesChildren = childrenOf(key)
        .map((r) => r.key)
        .sort();
      const declaredSorted = [...declared].sort();
      const same =
        routesChildren.length === declaredSorted.length &&
        routesChildren.every((c, i) => c === declaredSorted[i]);
      if (!same) {
        throw new Error(
          `services.ts hub "${key}" children ${JSON.stringify(declaredSorted)} differ from routes.ts parent children ${JSON.stringify(routesChildren)}. A hub's children must equal the routes whose parent is this hub.`,
        );
      }
    } else if (svc.children !== undefined) {
      throw new Error(
        `services.ts "${key}" (kind:service) declares children — only hubs (kind:hub) may declare children.`,
      );
    }
  }

  // (4) relatedRoutes ⊆ routeMap
  for (const key of serviceKeys) {
    const svc = services[key];
    if (svc.relatedRoutes) {
      for (const rel of svc.relatedRoutes) {
        if (!knownRoutes.has(rel)) {
          throw new Error(`services.ts "${key}" references unknown relatedRoute "${rel}".`);
        }
      }
    }
  }

  // (5) flagship Private Chauffeur contract is complete and internally valid.
  const privateChauffeur = services.privateChauffeur;
  if (
    privateChauffeur !== privateChauffeurService ||
    privateChauffeur.chauffeurRemainsAvailable !== true ||
    privateChauffeur.multiplePlannedStops !== true ||
    privateChauffeur.scheduleChangeHandling !== "subject-to-availability-within-reserved-period" ||
    privateChauffeur.multiDay !== "quote" ||
    privateChauffeur.international !== "quote" ||
    privateChauffeur.customerVehicleChauffeurOnly !== false
  ) {
    throw new Error(
      "services.ts Private Chauffeur capability contract is incomplete or contradictory.",
    );
  }

  const { hourly, halfDay, fullDay } = privateChauffeurService.bookingOptions;
  if (
    hourly.minimumHours <= 0 ||
    hourly.publishedKmLimit !== null ||
    halfDay.hours <= 0 ||
    halfDay.includedKm <= 0 ||
    fullDay.hours <= 0 ||
    fullDay.includedKm <= 0
  ) {
    throw new Error("services.ts Private Chauffeur booking options must be positive and complete.");
  }
}

assertServicesConsistency();
