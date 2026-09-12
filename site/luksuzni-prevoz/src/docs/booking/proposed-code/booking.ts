/**
 * Proposed booking-domain contract for Variant A.
 *
 * This file owns request vocabulary only. It references canonical service,
 * fleet, pricing and contact data rather than duplicating those facts.
 */
import type { VehicleId } from "../../../data/fleet.ts";

export const bookingServiceKeys = [
  "privateChauffeur",
  "airportTransportation",
  "corporateTransportation",
  "delegationTransportation",
  "conferenceCongressTransportation",
  "weddingTransportation",
  "promTransportation",
  "vipTransportation",
  "specialEvents",
] as const;

export type BookingServiceKey = (typeof bookingServiceKeys)[number];
export type BookingIntent = "booking" | "quote";
export type BookingStep = "service" | "journey" | "vehicle" | "review";

export type HireMode = "hourly" | "halfDay" | "fullDay";
export type AirportDirection = "airport-to-city" | "city-to-airport";
export type AirportScope = "belgrade-city" | "other";
export type CorporateEngagement = "one-off" | "recurring";

export interface BookingCommon {
  intent: BookingIntent;
  date: string;
  time: string;
  passengerCount: number;
  luggageCount?: number;
  childSeatRequested: boolean;
  vehiclePreference: VehicleId | "recommend";
}

export interface PrivateChauffeurBooking extends BookingCommon {
  serviceKey: "privateChauffeur";
  hireMode: HireMode;
  hours?: number;
  pickup: string;
  plannedStops: string[];
  multiDay: boolean;
  international: boolean;
}

export interface AirportBooking extends BookingCommon {
  serviceKey: "airportTransportation";
  direction: AirportDirection;
  pickup: string;
  destination: string;
  flightNumber?: string;
  returnRequested: boolean;
  returnDate?: string;
  returnTime?: string;
  airportScope: AirportScope;
}

export interface CorporateBooking extends BookingCommon {
  serviceKey: "corporateTransportation";
  engagement: CorporateEngagement;
  pickup: string;
  destination?: string;
  scheduleOutline: string;
  multipleLocations: boolean;
  multipleVehiclesRequested: boolean;
}

export interface DelegationBooking extends BookingCommon {
  serviceKey: "delegationTransportation";
  pickup: string;
  scheduleOutline: string;
  multipleLocations: boolean;
  multipleVehiclesRequested: boolean;
}

export interface ConferenceBooking extends BookingCommon {
  serviceKey: "conferenceCongressTransportation";
  pickup: string;
  scheduleOutline: string;
  multipleLocations: boolean;
  multipleVehiclesRequested: boolean;
}

export interface EventBooking extends BookingCommon {
  serviceKey:
    | "weddingTransportation"
    | "promTransportation"
    | "vipTransportation"
    | "specialEvents";
  pickup: string;
  destination: string;
  returnRequested: boolean;
  waitingRequested: boolean;
  multipleVehiclesRequested: boolean;
}

export type BookingRequest =
  | PrivateChauffeurBooking
  | AirportBooking
  | CorporateBooking
  | DelegationBooking
  | ConferenceBooking
  | EventBooking;

export type QuoteReason =
  | "multi-day"
  | "international"
  | "outside-airport-scope"
  | "airport-return-policy-undefined"
  | "package-distance-exceeded"
  | "business-estimate-policy-undefined"
  | "multiple-vehicles"
  | "complex-itinerary"
  | "quote-only-service"
  | "vehicle-recommendation";

export interface Money {
  amount: number;
  currency: "EUR";
}

export interface FixedPricingResult extends Money {
  kind: "fixed";
  vehicleId: VehicleId;
  source: "airport-transfer";
}

export interface CalculatedPricingResult extends Money {
  kind: "calculated";
  vehicleId: VehicleId;
  source: "hourly" | "half-day" | "full-day";
  arithmetic?: {
    quantity: number;
    unitAmount: number;
    unit: "hour";
  };
}

export interface EstimatePricingResult extends Money {
  kind: "estimate";
  vehicleId: VehicleId;
  source: "half-day-base" | "full-day-base";
  reason: "distance-unqualified";
}

export interface QuoteRequiredPricingResult {
  kind: "quote-required";
  reason: QuoteReason;
}

export interface UnavailablePricingResult {
  kind: "unavailable";
  reason: "vehicle-required" | "invalid-request" | "missing-pricing-data";
}

export type BookingPricingResult =
  | FixedPricingResult
  | CalculatedPricingResult
  | EstimatePricingResult
  | QuoteRequiredPricingResult
  | UnavailablePricingResult;

export function isBookingServiceKey(value: string): value is BookingServiceKey {
  return bookingServiceKeys.includes(value as BookingServiceKey);
}
