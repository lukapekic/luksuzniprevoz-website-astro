/**
 * Proposed booking validation helpers.
 * Historical drafting aid. Current public V1 validates client-side only;
 * future server validation is authoritative once Cloudflare submission exists.
 */
import type { BookingRequest } from "../../../data/booking.ts";
import type { Vehicle } from "../../../data/fleet.ts";

export interface BookingValidationIssue {
  field: string;
  code:
    | "required"
    | "lead-time"
    | "hourly-minimum"
    | "passenger-count"
    | "vehicle-capacity"
    | "return-fields"
    | "invalid";
}

export function validateLeadTime(
  date: string,
  time: string,
  publicMinimumHours: number,
  timeZone: "Europe/Belgrade",
  requestedDateTimeToInstant: (
    date: string,
    time: string,
    timeZone: "Europe/Belgrade",
  ) => Date | null,
  now: Date = new Date(),
): boolean {
  const requested = requestedDateTimeToInstant(date, time, timeZone);
  if (!requested || Number.isNaN(requested.getTime())) return false;
  const minimumMs = publicMinimumHours * 60 * 60 * 1000;
  return requested.getTime() - now.getTime() >= minimumMs;
}

export function validateVehicleCapacity(
  passengerCount: number,
  vehicle: Vehicle | null,
): boolean {
  if (!vehicle) return true; // "recommend" remains valid and manually assigned.
  if (vehicle.passengers === null) return true;
  return passengerCount <= vehicle.passengers;
}

export function validateBookingRequest(
  request: BookingRequest,
  options: {
    publicMinimumHours: number;
    timeZone: "Europe/Belgrade";
    requestedDateTimeToInstant: (
      date: string,
      time: string,
      timeZone: "Europe/Belgrade",
    ) => Date | null;
    selectedVehicle: Vehicle | null;
    hourlyMinimumHours: number;
    now?: Date;
  },
): BookingValidationIssue[] {
  const issues: BookingValidationIssue[] = [];

  if (!validateLeadTime(
    request.date,
    request.time,
    options.publicMinimumHours,
    options.timeZone,
    options.requestedDateTimeToInstant,
    options.now,
  )) {
    issues.push({ field: "dateTime", code: "lead-time" });
  }

  if (!Number.isInteger(request.passengerCount) || request.passengerCount < 1) {
    issues.push({ field: "passengerCount", code: "passenger-count" });
  }

  if (!validateVehicleCapacity(request.passengerCount, options.selectedVehicle)) {
    issues.push({ field: "vehiclePreference", code: "vehicle-capacity" });
  }

  if (request.serviceKey === "privateChauffeur") {
    if (!request.pickup.trim()) issues.push({ field: "pickup", code: "required" });
    if (request.hireMode === "hourly") {
      if (
        request.hours === undefined ||
        !Number.isInteger(request.hours) ||
        request.hours < options.hourlyMinimumHours
      ) {
        issues.push({ field: "hours", code: "hourly-minimum" });
      }
    }
  }

  if (request.serviceKey === "airportTransportation") {
    if (!request.pickup.trim()) issues.push({ field: "pickup", code: "required" });
    if (!request.destination.trim()) issues.push({ field: "destination", code: "required" });
    if (request.returnRequested && (!request.returnDate || !request.returnTime)) {
      issues.push({ field: "return", code: "return-fields" });
    }
  }

  return issues;
}
