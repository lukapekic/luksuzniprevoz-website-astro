import { getVehicle, type VehicleId } from "../../data/fleet.ts";
import { pricing, type VehiclePricing } from "../../data/pricing.ts";
import { privateChauffeurService } from "../../data/services.ts";
import type {
  BookingPricingResult,
  BookingRequest,
  PrivateChauffeurBooking,
  QuoteReason,
} from "../../data/booking.ts";

export interface BookingDistanceResult {
  distanceKm: number;
  source: "approved-routing-provider";
}

export interface BookingPricingContext {
  pricingByVehicle?: Partial<Record<VehicleId, VehiclePricing>>;
  distanceResult?: BookingDistanceResult;
}

function quote(reason: QuoteReason): BookingPricingResult {
  return { kind: "quote-required", reason };
}

function resolvePrivate(
  request: PrivateChauffeurBooking,
  vehicleId: VehicleId,
  vehiclePricing: VehiclePricing,
  context: BookingPricingContext,
): BookingPricingResult {
  if (request.multiDay) return quote("multi-day");
  if (request.international) return quote("international");

  if (request.hireMode === "hourly") {
    const hours = request.hours ?? 0;
    if (!Number.isInteger(hours) || hours < privateChauffeurService.bookingOptions.hourly.minimumHours) {
      return { kind: "unavailable", reason: "invalid-request" };
    }
    return {
      kind: "calculated",
      vehicleId,
      source: "hourly",
      amount: vehiclePricing.hourly * hours,
      currency: vehiclePricing.currency,
      arithmetic: { quantity: hours, unitAmount: vehiclePricing.hourly, unit: "hour" },
    };
  }

  const isHalfDay = request.hireMode === "halfDay";
  const packageFacts = isHalfDay
    ? privateChauffeurService.bookingOptions.halfDay
    : privateChauffeurService.bookingOptions.fullDay;
  const amount = isHalfDay ? vehiclePricing.halfDay : vehiclePricing.fullDay;
  const source = isHalfDay ? "half-day" as const : "full-day" as const;

  if (!context.distanceResult) {
    return {
      kind: "estimate",
      vehicleId,
      source: isHalfDay ? "half-day-base" : "full-day-base",
      amount,
      currency: vehiclePricing.currency,
      reason: "distance-unqualified",
    };
  }
  if (context.distanceResult.distanceKm > packageFacts.includedKm) {
    return quote("package-distance-exceeded");
  }
  return { kind: "calculated", vehicleId, source, amount, currency: vehiclePricing.currency };
}

export function resolveBookingPricing(
  request: BookingRequest,
  context: BookingPricingContext = {},
): BookingPricingResult {
  if (request.multipleVehiclesRequested) return quote("multiple-vehicles");
  if (request.vehiclePreference === "recommend") return quote("vehicle-recommendation");

  const vehicleId = request.vehiclePreference;
  const vehiclePricing = (context.pricingByVehicle ?? pricing)[vehicleId];
  if (!vehiclePricing) {
    return getVehicle(vehicleId).pricingStatus === "quote-only"
      ? quote("quote-only-service")
      : { kind: "unavailable", reason: "missing-pricing-data" };
  }

  if (request.serviceKey === "privateChauffeur") {
    return resolvePrivate(request, vehicleId, vehiclePricing, context);
  }
  if (request.serviceKey === "airportTransportation") {
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
    return quote("business-estimate-policy-undefined");
  }
  return quote("quote-only-service");
}
