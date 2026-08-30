import {
  isBookingIntent,
  isBookingServiceKey,
  type BookingDraft,
  type BookingIntent,
  type BookingStep,
} from "../../data/booking.ts";
import { parseAirportBookingIntent } from "./airport-booking-intent.ts";

export const bookingHandoffFields = ["intent", "service", "flightNumber", "date", "time"] as const;

export interface BookingHandoff {
  initialStep: BookingStep;
  patch: Pick<BookingDraft, "intent" | "serviceKey" | "flightNumber" | "date" | "time">;
}

export function parseBookingHandoff(params: URLSearchParams): BookingHandoff {
  const rawIntent = params.get("intent") ?? "";
  const intent: BookingIntent = isBookingIntent(rawIntent) ? rawIntent : "booking";
  const rawService = params.get("service") ?? "";

  if (!isBookingServiceKey(rawService)) {
    return { initialStep: "service", patch: { intent } };
  }

  const patch: BookingHandoff["patch"] = { intent, serviceKey: rawService };
  if (rawService === "airportTransportation") {
    const airport = parseAirportBookingIntent(params);
    if (airport) {
      patch.date = airport.date;
      patch.time = airport.time;
      patch.flightNumber = airport.flightNumber;
    }
  }
  return { initialStep: "journey", patch };
}

export function cleanBookingHandoffUrl(url: URL): string {
  for (const key of bookingHandoffFields) url.searchParams.delete(key);
  const query = url.searchParams.toString();
  return `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
}
