import type { Vehicle } from "../../data/fleet.ts";
import {
  isBookingServiceKey,
  type BookingDraft,
  type BookingRequest,
  type BookingServiceKey,
} from "../../data/booking.ts";

export type BookingValidationCode =
  | "required"
  | "service"
  | "date-time"
  | "lead-time"
  | "hourly-minimum"
  | "airport-scope"
  | "return-fields"
  | "passenger-count"
  | "vehicle-required"
  | "vehicle-capacity"
  | "email"
  | "company";

export interface BookingValidationIssue {
  field: string;
  code: BookingValidationCode;
}

export type BookingRequestResult =
  | { ok: true; request: BookingRequest }
  | { ok: false; issues: BookingValidationIssue[] };

function localPartsAt(instantMs: number, timeZone: string): number[] {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const values = Object.fromEntries(
    formatter.formatToParts(new Date(instantMs)).map((part) => [part.type, part.value]),
  );
  return [values.year, values.month, values.day, values.hour, values.minute].map(Number);
}

export function zonedLocalDateTimeToDate(
  date: string,
  time: string,
  timeZone: "Europe/Belgrade",
): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const target = [...date.split("-"), ...time.split(":")].map(Number);
  const [year, month, day, hour, minute] = target;
  if (!year || !month || !day || hour === undefined || minute === undefined) return null;

  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let candidate = targetAsUtc;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const [cy, cm, cd, ch, cmin] = localPartsAt(candidate, timeZone);
    const representedAsUtc = Date.UTC(cy, cm - 1, cd, ch, cmin);
    const adjustment = targetAsUtc - representedAsUtc;
    candidate += adjustment;
    if (adjustment === 0) break;
  }

  const finalParts = localPartsAt(candidate, timeZone);
  if (!finalParts.every((part, index) => part === target[index])) return null;
  return new Date(candidate);
}

export function validateBookingLeadTime(
  date: string,
  time: string,
  publicMinimumHours: number,
  timeZone: "Europe/Belgrade",
  now = new Date(),
): boolean {
  const requested = zonedLocalDateTimeToDate(date, time, timeZone);
  if (!requested) return false;
  return requested.getTime() - now.getTime() >= publicMinimumHours * 60 * 60 * 1000;
}

export function validateVehicleCapacity(
  passengerCount: number,
  vehicle: Vehicle | null,
): boolean {
  if (!vehicle || vehicle.passengers === null) return true;
  return passengerCount <= vehicle.passengers;
}

function required(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
}

const businessServices: BookingServiceKey[] = [
  "corporateTransportation",
  "delegationTransportation",
  "conferenceCongressTransportation",
];

export interface BookingValidationOptions {
  publicMinimumHours: number;
  hourlyMinimumHours: number;
  timeZone: "Europe/Belgrade";
  selectedVehicle: Vehicle | null;
  now?: Date;
  includeContact?: boolean;
}

export function validateBookingDraft(
  draft: BookingDraft,
  options: BookingValidationOptions,
): BookingValidationIssue[] {
  const issues: BookingValidationIssue[] = [];
  if (!draft.serviceKey || !isBookingServiceKey(draft.serviceKey)) {
    return [{ field: "service", code: "service" }];
  }
  if (!draft.date || !draft.time) {
    issues.push({ field: "dateTime", code: "date-time" });
  } else if (!validateBookingLeadTime(
    draft.date, draft.time, options.publicMinimumHours, options.timeZone, options.now,
  )) {
    issues.push({ field: "dateTime", code: "lead-time" });
  }

  if (!required(draft.pickup)) issues.push({ field: "pickup", code: "required" });

  if (draft.serviceKey === "privateChauffeur") {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!draft.hireMode) issues.push({ field: "hireMode", code: "required" });
    if (draft.hireMode === "hourly" && (!Number.isInteger(draft.hours) || (draft.hours ?? 0) < options.hourlyMinimumHours)) {
      issues.push({ field: "hours", code: "hourly-minimum" });
    }
  }
  if (draft.serviceKey === "airportTransportation") {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!draft.airportDirection) issues.push({ field: "airportDirection", code: "required" });
    if (!draft.airportScope) issues.push({ field: "airportScope", code: "airport-scope" });
    if (draft.returnRequested && (!draft.returnDate || !draft.returnTime)) {
      issues.push({ field: "return", code: "return-fields" });
    }
  }
  if (businessServices.includes(draft.serviceKey)) {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!required(draft.scheduleOutline)) issues.push({ field: "scheduleOutline", code: "required" });
    if (draft.serviceKey === "corporateTransportation" && !draft.engagement) {
      issues.push({ field: "engagement", code: "required" });
    }
  }
  if (["weddingTransportation", "promTransportation", "vipTransportation", "specialEvents"].includes(draft.serviceKey)) {
    if (!required(draft.eventVenue)) issues.push({ field: "eventVenue", code: "required" });
    if (!required(draft.scheduleOutline)) issues.push({ field: "scheduleOutline", code: "required" });
  }

  if (!Number.isInteger(draft.passengerCount) || (draft.passengerCount ?? 0) < 1) {
    issues.push({ field: "passengerCount", code: "passenger-count" });
  }
  if (!draft.vehiclePreference) issues.push({ field: "vehiclePreference", code: "vehicle-required" });
  if (draft.passengerCount && !validateVehicleCapacity(draft.passengerCount, options.selectedVehicle)) {
    issues.push({ field: "vehiclePreference", code: "vehicle-capacity" });
  }

  if (options.includeContact) {
    if (!required(draft.fullName)) issues.push({ field: "fullName", code: "required" });
    if (!draft.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      issues.push({ field: "email", code: "email" });
    }
    if (businessServices.includes(draft.serviceKey) && !required(draft.company)) {
      issues.push({ field: "company", code: "company" });
    }
  }
  return issues;
}

export function buildBookingRequest(
  draft: BookingDraft,
  options: BookingValidationOptions,
): BookingRequestResult {
  const issues = validateBookingDraft(draft, { ...options, includeContact: false });
  if (issues.length > 0) return { ok: false, issues };

  const common = {
    intent: draft.intent ?? "booking" as const,
    date: draft.date!,
    time: draft.time!,
    pickup: draft.pickup!.trim(),
    passengerCount: draft.passengerCount!,
    ...(draft.luggageCount !== undefined ? { luggageCount: draft.luggageCount } : {}),
    childSeatRequested: draft.childSeatRequested ?? false,
    vehiclePreference: draft.vehiclePreference!,
    multipleVehiclesRequested: draft.multipleVehiclesRequested ?? false,
  };

  switch (draft.serviceKey!) {
    case "privateChauffeur":
      return { ok: true, request: {
        ...common, serviceKey: "privateChauffeur", destination: draft.destination!.trim(),
        hireMode: draft.hireMode!, ...(draft.hours ? { hours: draft.hours } : {}),
        ...(draft.plannedStops?.trim() ? { plannedStops: draft.plannedStops.trim() } : {}),
        multiDay: draft.multiDay ?? false, international: draft.international ?? false,
      } };
    case "airportTransportation":
      return { ok: true, request: {
        ...common, serviceKey: "airportTransportation", destination: draft.destination!.trim(),
        direction: draft.airportDirection!, airportScope: draft.airportScope!,
        ...(draft.flightNumber?.trim() ? { flightNumber: draft.flightNumber.trim() } : {}),
        returnRequested: draft.returnRequested ?? false,
        ...(draft.returnDate ? { returnDate: draft.returnDate } : {}),
        ...(draft.returnTime ? { returnTime: draft.returnTime } : {}),
      } };
    case "corporateTransportation":
      return { ok: true, request: {
        ...common, serviceKey: "corporateTransportation", destination: draft.destination!.trim(),
        engagement: draft.engagement!, scheduleOutline: draft.scheduleOutline!.trim(),
        ...(draft.invoiceReference?.trim() ? { invoiceReference: draft.invoiceReference.trim() } : {}),
        multipleLocations: draft.multipleLocations ?? false,
      } };
    case "delegationTransportation":
    case "conferenceCongressTransportation":
      return { ok: true, request: {
        ...common, serviceKey: draft.serviceKey, destination: draft.destination!.trim(),
        scheduleOutline: draft.scheduleOutline!.trim(), multipleLocations: draft.multipleLocations ?? false,
      } };
    default:
      return { ok: true, request: {
        ...common, serviceKey: draft.serviceKey!, eventVenue: draft.eventVenue!.trim(),
        scheduleOutline: draft.scheduleOutline!.trim(), waitingRequested: draft.waitingRequested ?? false,
      } };
  }
}
