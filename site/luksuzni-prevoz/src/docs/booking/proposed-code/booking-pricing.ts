/**
 * Proposed pure pricing resolver for Booking V1.
 *
 * Historical drafting aid only. The locked implementation plan and production
 * repository contracts own final behavior.
 */
import type { VehiclePricing } from "../../../data/pricing.ts";
import type { VehicleId } from "../../../data/fleet.ts";
import type {
  BookingPricingResult,
  BookingRequest,
  PrivateChauffeurBooking,
} from "../../../data/booking.ts";

interface ResolverInput {
  request: BookingRequest;
  vehicleId: VehicleId | null;
  vehiclePricing: VehiclePricing | null;
  halfDay: { hours: number; includedKm: number };
  fullDay: { hours: number; includedKm: number };
  hourlyMinimumHours: number;
  distanceResult?: { distanceKm: number; source: "approved-routing-provider" };
}

function quote(reason: Extract<BookingPricingResult, { kind: "quote-required" }>['reason']): BookingPricingResult {
  return { kind: "quote-required", reason };
}

function unavailable(reason: Extract<BookingPricingResult, { kind: "unavailable" }>['reason']): BookingPricingResult {
  return { kind: "unavailable", reason };
}

function resolvePrivate(
  request: PrivateChauffeurBooking,
  input: ResolverInput,
): BookingPricingResult {
  const { vehicleId, vehiclePricing } = input;
  if (request.vehiclePreference === "recommend") return quote("vehicle-recommendation");
  if (!vehicleId) return unavailable("invalid-request");
  if (!vehiclePricing) return unavailable("missing-pricing-data");

  if (request.multiDay) return quote("multi-day");
  if (request.international) return quote("international");

  // `currency` is the required proposed canonical addition to VehiclePricing.
  const currency = vehiclePricing.currency;

  if (request.hireMode === "hourly") {
    const hours = request.hours ?? 0;
    if (!Number.isInteger(hours) || hours < input.hourlyMinimumHours) {
      return unavailable("invalid-request");
    }
    return {
      kind: "calculated",
      vehicleId,
      source: "hourly",
      amount: vehiclePricing.hourly * hours,
      currency,
      arithmetic: { quantity: hours, unitAmount: vehiclePricing.hourly, unit: "hour" },
    };
  }

  if (request.hireMode === "halfDay") {
    if (input.distanceResult === undefined) {
      return {
        kind: "estimate",
        vehicleId,
        source: "half-day-base",
        amount: vehiclePricing.halfDay,
        currency,
        reason: "distance-unqualified",
      };
    }
    if (input.distanceResult.distanceKm > input.halfDay.includedKm) {
      return quote("package-distance-exceeded");
    }
    return {
      kind: "calculated",
      vehicleId,
      source: "half-day",
      amount: vehiclePricing.halfDay,
      currency,
    };
  }

  if (input.distanceResult === undefined) {
    return {
      kind: "estimate",
      vehicleId,
      source: "full-day-base",
      amount: vehiclePricing.fullDay,
      currency,
      reason: "distance-unqualified",
    };
  }
  if (input.distanceResult.distanceKm > input.fullDay.includedKm) {
    return quote("package-distance-exceeded");
  }
  return {
    kind: "calculated",
    vehicleId,
    source: "full-day",
    amount: vehiclePricing.fullDay,
    currency,
  };
}

export function resolveBookingPricing(input: ResolverInput): BookingPricingResult {
  const { request, vehicleId, vehiclePricing } = input;

  if (request.serviceKey === "privateChauffeur") {
    return resolvePrivate(request, input);
  }

  if (request.serviceKey === "airportTransportation") {
    if (request.vehiclePreference === "recommend") return quote("vehicle-recommendation");
    if (!vehicleId) return unavailable("invalid-request");
    if (!vehiclePricing) return unavailable("missing-pricing-data");
    if (request.returnRequested) return quote("airport-return-policy-undefined");
    if (request.airportScope === "other") return quote("outside-airport-scope");

    return {
      kind: "fixed",
      vehicleId,
      source: "airport-transfer",
      amount: vehiclePricing.airportTransfer.amount,
      currency: vehiclePricing.airportTransfer.currency,
    };
  }

  if (request.serviceKey === "corporateTransportation") {
    if (request.multipleVehiclesRequested) return quote("multiple-vehicles");
    return quote("business-estimate-policy-undefined");
  }

  if (
    request.serviceKey === "delegationTransportation" ||
    request.serviceKey === "conferenceCongressTransportation"
  ) {
    if (request.multipleVehiclesRequested) return quote("multiple-vehicles");
    return quote("quote-only-service");
  }

  if (request.multipleVehiclesRequested) return quote("multiple-vehicles");
  return quote("quote-only-service");
}
