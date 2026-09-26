import { formatDisplayDate, isCanonicalTime } from "./booking-date-time.ts";
import { isBookingDateInRange } from "./booking-date-policy.ts";

/**
 * Canonical Airport booking-start contract.
 *
 * The Airport page and the future booking page must use these names and
 * constraints. Keep query-string parsing/serialization here so the two forms
 * cannot drift independently.
 */

export const AIRPORT_FLIGHT_NUMBER_MAX = 40;

export const airportBookingFields = {
  service: "service",
  flightNumber: "flightNumber",
  date: "date",
  time: "time",
} as const;

export type AirportBookingIntent = {
  service: "airportTransportation";
  flightNumber?: string;
  date: string;
  time: string;
};

export const airportBookingService = "airportTransportation" as const;

export function parseAirportBookingIntent(params: URLSearchParams, now = new Date()): AirportBookingIntent | null {
  if (params.get(airportBookingFields.service) !== airportBookingService) return null;
  const date = params.get(airportBookingFields.date);
  const time = params.get(airportBookingFields.time);
  if (!date || !formatDisplayDate(date) || !isBookingDateInRange(date, now) || !time || !isCanonicalTime(time))
    return null;

  const flightNumber = params.get(airportBookingFields.flightNumber)?.trim();
  if (flightNumber && flightNumber.length > AIRPORT_FLIGHT_NUMBER_MAX) return null;
  return {
    service: airportBookingService,
    ...(flightNumber ? { flightNumber } : {}),
    date,
    time,
  };
}

export function serializeAirportBookingIntent(intent: AirportBookingIntent): URLSearchParams {
  const params = new URLSearchParams({
    [airportBookingFields.service]: intent.service,
    [airportBookingFields.date]: intent.date,
    [airportBookingFields.time]: intent.time,
  });
  if (intent.flightNumber?.trim())
    params.set(airportBookingFields.flightNumber, intent.flightNumber.trim());
  return params;
}
