import type { VehicleId } from "./fleet.ts";
import type { PricingCurrency } from "./pricing.ts";

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
export type VehiclePreference = VehicleId | "recommend";

export interface BookingDraft {
  intent?: BookingIntent;
  serviceKey?: BookingServiceKey;
  date?: string;
  time?: string;
  pickup?: string;
  destination?: string;
  hireMode?: HireMode;
  hours?: number;
  plannedStops?: string;
  multiDay?: boolean;
  international?: boolean;
  airportDirection?: AirportDirection;
  airportScope?: AirportScope;
  flightNumber?: string;
  returnRequested?: boolean;
  returnDate?: string;
  returnTime?: string;
  engagement?: CorporateEngagement;
  scheduleOutline?: string;
  invoiceReference?: string;
  multipleLocations?: boolean;
  multipleVehiclesRequested?: boolean;
  eventVenue?: string;
  waitingRequested?: boolean;
  passengerCount?: number;
  luggageCount?: number;
  childSeatRequested?: boolean;
  vehiclePreference?: VehiclePreference;
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

interface BookingCommon {
  intent: BookingIntent;
  date: string;
  time: string;
  pickup: string;
  passengerCount: number;
  luggageCount?: number;
  childSeatRequested: boolean;
  vehiclePreference: VehiclePreference;
  multipleVehiclesRequested: boolean;
}

export interface PrivateChauffeurBooking extends BookingCommon {
  serviceKey: "privateChauffeur";
  destination: string;
  hireMode: HireMode;
  hours?: number;
  plannedStops?: string;
  multiDay: boolean;
  international: boolean;
}

export interface AirportBooking extends BookingCommon {
  serviceKey: "airportTransportation";
  destination: string;
  direction: AirportDirection;
  airportScope: AirportScope;
  flightNumber?: string;
  returnRequested: boolean;
  returnDate?: string;
  returnTime?: string;
}

export interface CorporateBooking extends BookingCommon {
  serviceKey: "corporateTransportation";
  destination: string;
  engagement: CorporateEngagement;
  scheduleOutline: string;
  invoiceReference?: string;
  multipleLocations: boolean;
}

export interface CoordinatedBooking extends BookingCommon {
  serviceKey: "delegationTransportation" | "conferenceCongressTransportation";
  destination: string;
  scheduleOutline: string;
  multipleLocations: boolean;
}

export interface EventBooking extends BookingCommon {
  serviceKey:
    | "weddingTransportation"
    | "promTransportation"
    | "vipTransportation"
    | "specialEvents";
  eventVenue: string;
  scheduleOutline: string;
  waitingRequested: boolean;
}

export type BookingRequest =
  | PrivateChauffeurBooking
  | AirportBooking
  | CorporateBooking
  | CoordinatedBooking
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

interface PricedResult {
  vehicleId: VehicleId;
  amount: number;
  currency: PricingCurrency;
}

export type BookingPricingResult =
  | (PricedResult & { kind: "fixed"; source: "airport-transfer" })
  | (PricedResult & {
      kind: "calculated";
      source: "hourly" | "half-day" | "full-day";
      arithmetic?: { quantity: number; unitAmount: number; unit: "hour" };
    })
  | (PricedResult & {
      kind: "estimate";
      source: "half-day-base" | "full-day-base";
      reason: "distance-unqualified";
    })
  | { kind: "quote-required"; reason: QuoteReason }
  | { kind: "unavailable"; reason: "invalid-request" | "missing-pricing-data" };

export function isBookingServiceKey(value: string): value is BookingServiceKey {
  return bookingServiceKeys.includes(value as BookingServiceKey);
}

export function isBookingIntent(value: string): value is BookingIntent {
  return value === "booking" || value === "quote";
}
