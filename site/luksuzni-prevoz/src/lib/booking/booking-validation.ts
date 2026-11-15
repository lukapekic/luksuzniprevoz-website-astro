import { resolveZonedDateTime, evaluateBookingSchedule } from "@astro-foundation/form-kit";
import { isValidPhoneNumber } from "../forms/phone-validation.ts";
import { formatDisplayDate } from "./booking-date-time.ts";
import { isBookingDateInRange } from "./booking-date-policy.ts";
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
  | "date-range"
  | "lead-time"
  | "hourly-minimum"
  | "airport-scope"
  | "return-fields"
  | "passenger-count"
  | "vehicle-required"
  | "vehicle-capacity"
  | "full-name"
  | "email"
  | "phone"
  | "notes-length"
  | "company";

export interface BookingValidationIssue {
  field: string;
  code: BookingValidationCode;
}

export type BookingRequestResult =
  { ok: true; request: BookingRequest } | { ok: false; issues: BookingValidationIssue[] };

/** Compatibility export: all projects share the same strict timezone conversion. */
export function zonedLocalDateTimeToDate(
  date: string,
  time: string,
  timeZone: "Europe/Belgrade",
): Date | null {
  return resolveZonedDateTime(date, time, timeZone);
}

export function validateBookingLeadTime(
  date: string,
  time: string,
  publicMinimumHours: number,
  timeZone: "Europe/Belgrade",
  now = new Date(),
): boolean {
  return evaluateBookingSchedule(date, time, {
    minimumHours: publicMinimumHours,
    timeZone,
    now,
  }).valid;
}

export function validateVehicleCapacity(passengerCount: number, vehicle: Vehicle | null): boolean {
  if (!vehicle || vehicle.passengers === null) return true;
  return passengerCount <= vehicle.passengers;
}

function required(value: unknown): boolean {
  return typeof value === "string"
    ? value.trim().length > 0
    : value !== undefined && value !== null;
}

const businessServices: BookingServiceKey[] = [
  "corporateTransportation",
  "delegationTransportation",
  "conferenceCongressTransportation",
];

const FULL_NAME_PATTERN =
  /^[\p{L}\p{M}][\p{L}\p{M}'’.-]*(?:[ \t]+[\p{L}\p{M}][\p{L}\p{M}'’.-]*)+$/u;

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
  if (!draft.date || !draft.time || !formatDisplayDate(draft.date)) {
    issues.push({ field: "dateTime", code: "date-time" });
  } else if (!isBookingDateInRange(draft.date, options.now)) {
    issues.push({ field: "dateTime", code: "date-range" });
  } else {
    const assessment = evaluateBookingSchedule(draft.date, draft.time, {
      minimumHours: options.publicMinimumHours,
      timeZone: options.timeZone,
      now: options.now,
    });
    if (!assessment.valid)
      issues.push({
        field: "dateTime",
        code: assessment.reason === "invalid" ? "date-time" : "lead-time",
      });
  }

  if (!required(draft.pickup)) issues.push({ field: "pickup", code: "required" });

  if (draft.serviceKey === "privateChauffeur") {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!draft.hireMode) issues.push({ field: "hireMode", code: "required" });
    if (
      draft.hireMode === "hourly" &&
      (!Number.isInteger(draft.hours) || (draft.hours ?? 0) < options.hourlyMinimumHours)
    ) {
      issues.push({ field: "hours", code: "hourly-minimum" });
    }
  }
  if (draft.serviceKey === "airportTransportation") {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!draft.airportDirection) issues.push({ field: "airportDirection", code: "required" });
    if (!draft.airportScope) issues.push({ field: "airportScope", code: "airport-scope" });
    if (draft.returnRequested && (!draft.returnDate || !draft.returnTime)) {
      issues.push({ field: "return", code: "return-fields" });
    } else if (
      draft.returnRequested &&
      draft.returnDate &&
      draft.returnTime &&
      draft.date &&
      draft.time
    ) {
      const outbound = zonedLocalDateTimeToDate(draft.date, draft.time, options.timeZone);
      const inbound = zonedLocalDateTimeToDate(
        draft.returnDate,
        draft.returnTime,
        options.timeZone,
      );
      if (!isBookingDateInRange(draft.returnDate, options.now)) {
        issues.push({ field: "return", code: "date-range" });
      } else if (!outbound || !inbound || inbound.getTime() <= outbound.getTime()) {
        issues.push({ field: "return", code: "date-time" });
      }
    }
  }
  if (businessServices.includes(draft.serviceKey)) {
    if (!required(draft.destination)) issues.push({ field: "destination", code: "required" });
    if (!required(draft.scheduleOutline))
      issues.push({ field: "scheduleOutline", code: "required" });
    if (draft.serviceKey === "corporateTransportation" && !draft.engagement) {
      issues.push({ field: "engagement", code: "required" });
    }
  }
  if (
    ["weddingTransportation", "promTransportation", "vipTransportation", "specialEvents"].includes(
      draft.serviceKey,
    )
  ) {
    if (!required(draft.eventVenue)) issues.push({ field: "eventVenue", code: "required" });
    if (!required(draft.scheduleOutline))
      issues.push({ field: "scheduleOutline", code: "required" });
  }

  if (!Number.isInteger(draft.passengerCount) || (draft.passengerCount ?? 0) < 1) {
    issues.push({ field: "passengerCount", code: "passenger-count" });
  }
  if (!draft.vehiclePreference)
    issues.push({ field: "vehiclePreference", code: "vehicle-required" });
  if (
    draft.passengerCount &&
    !validateVehicleCapacity(draft.passengerCount, options.selectedVehicle)
  ) {
    issues.push({ field: "vehiclePreference", code: "vehicle-capacity" });
  }

  if (options.includeContact) {
    if (
      !draft.fullName ||
      !FULL_NAME_PATTERN.test(draft.fullName.trim()) ||
      draft.fullName.trim().length > 100
    ) {
      issues.push({ field: "fullName", code: "full-name" });
    }
    if (!draft.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      issues.push({ field: "email", code: "email" });
    }
    if (draft.phone && !isValidPhoneNumber(draft.phone)) {
      issues.push({ field: "phone", code: "phone" });
    }
    if (draft.notes && draft.notes.trim().length > 1000) {
      issues.push({ field: "notes", code: "notes-length" });
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
    intent: draft.intent ?? ("booking" as const),
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
      return {
        ok: true,
        request: {
          ...common,
          serviceKey: "privateChauffeur",
          destination: draft.destination!.trim(),
          hireMode: draft.hireMode!,
          ...(draft.hours ? { hours: draft.hours } : {}),
          ...(draft.plannedStops?.trim() ? { plannedStops: draft.plannedStops.trim() } : {}),
          multiDay: draft.multiDay ?? false,
          international: draft.international ?? false,
        },
      };
    case "airportTransportation":
      return {
        ok: true,
        request: {
          ...common,
          serviceKey: "airportTransportation",
          destination: draft.destination!.trim(),
          direction: draft.airportDirection!,
          airportScope: draft.airportScope!,
          ...(draft.flightNumber?.trim() ? { flightNumber: draft.flightNumber.trim() } : {}),
          returnRequested: draft.returnRequested ?? false,
          ...(draft.returnDate ? { returnDate: draft.returnDate } : {}),
          ...(draft.returnTime ? { returnTime: draft.returnTime } : {}),
        },
      };
    case "corporateTransportation":
      return {
        ok: true,
        request: {
          ...common,
          serviceKey: "corporateTransportation",
          destination: draft.destination!.trim(),
          engagement: draft.engagement!,
          scheduleOutline: draft.scheduleOutline!.trim(),
          ...(draft.invoiceReference?.trim()
            ? { invoiceReference: draft.invoiceReference.trim() }
            : {}),
          multipleLocations: draft.multipleLocations ?? false,
        },
      };
    case "delegationTransportation":
    case "conferenceCongressTransportation":
      return {
        ok: true,
        request: {
          ...common,
          serviceKey: draft.serviceKey,
          destination: draft.destination!.trim(),
          scheduleOutline: draft.scheduleOutline!.trim(),
          multipleLocations: draft.multipleLocations ?? false,
        },
      };
    default:
      return {
        ok: true,
        request: {
          ...common,
          serviceKey: draft.serviceKey!,
          eventVenue: draft.eventVenue!.trim(),
          scheduleOutline: draft.scheduleOutline!.trim(),
          waitingRequested: draft.waitingRequested ?? false,
        },
      };
  }
}
