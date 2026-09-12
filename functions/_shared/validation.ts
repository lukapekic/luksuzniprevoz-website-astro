import { vehicles } from "../../site/luksuzni-prevoz/src/data/fleet.ts";
import { contact } from "../../site/luksuzni-prevoz/src/data/contact.ts";
import { privateChauffeurService } from "../../site/luksuzni-prevoz/src/data/services.ts";
import {
  bookingServiceKeys,
  type BookingDraft,
  type BookingIntent,
  type BookingServiceKey,
  type VehiclePreference,
} from "../../site/luksuzni-prevoz/src/data/booking.ts";
import {
  buildBookingRequest,
  validateBookingDraft,
} from "../../site/luksuzni-prevoz/src/lib/booking/booking-validation.ts";
import { resolveBookingPricing } from "../../site/luksuzni-prevoz/src/lib/booking/booking-pricing.ts";
import {
  validateContactForm,
  type ContactFormValues,
} from "../../site/luksuzni-prevoz/src/components/contact/contact-form-validation.ts";
import type {
  BookingSubmission,
  ContactSubmission,
  FormLocale,
  FormRequestEnvelope,
} from "./types.ts";

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; fields: Record<string, string> };

const LOCALES: FormLocale[] = ["sr", "en", "ru"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
  const keys = new Set(allowed);
  return Object.keys(value).every((key) => keys.has(key));
}

export function decodeEnvelope(value: unknown): ValidationResult<FormRequestEnvelope<unknown>> {
  if (!isObject(value) || !hasOnlyKeys(value, ["submissionId", "locale", "turnstileToken", "payload"])) {
    return { ok: false, fields: {} };
  }
  if (typeof value.submissionId !== "string" || !UUID_PATTERN.test(value.submissionId)) {
    return { ok: false, fields: { submissionId: "invalid" } };
  }
  if (typeof value.locale !== "string" || !LOCALES.includes(value.locale as FormLocale)) {
    return { ok: false, fields: { locale: "invalid" } };
  }
  if (typeof value.turnstileToken !== "string" || value.turnstileToken.length === 0 || value.turnstileToken.length > 2048) {
    return { ok: false, fields: { turnstileToken: "invalid" } };
  }
  return {
    ok: true,
    value: {
      submissionId: value.submissionId,
      locale: value.locale as FormLocale,
      turnstileToken: value.turnstileToken,
      payload: value.payload,
    },
  };
}

export function validateContactPayload(
  payload: unknown,
  locale: FormLocale,
): ValidationResult<ContactSubmission> {
  const keys = ["fullName", "email", "phone", "message"] as const;
  if (!isObject(payload) || !hasOnlyKeys(payload, keys)) return { ok: false, fields: {} };
  if (!keys.every((key) => typeof payload[key] === "string")) return { ok: false, fields: {} };
  const values = payload as unknown as ContactFormValues;
  const result = validateContactForm(values);
  if (!result.isValid) {
    return { ok: false, fields: Object.fromEntries(Object.entries(result.errors)) as Record<string, string> };
  }
  return { ok: true, value: { kind: "contact", locale, values: result.values } };
}

const BOOKING_KEYS = [
  "intent", "serviceKey", "date", "time", "pickup", "destination", "hireMode", "hours",
  "plannedStops", "multiDay", "international", "airportDirection", "airportScope",
  "flightNumber", "returnRequested", "returnDate", "returnTime", "engagement",
  "scheduleOutline", "invoiceReference", "multipleLocations", "multipleVehiclesRequested",
  "eventVenue", "waitingRequested", "passengerCount", "luggageCount", "childSeatRequested",
  "vehiclePreference", "fullName", "email", "phone", "company", "notes",
] as const;

const STRING_LIMITS: Partial<Record<(typeof BOOKING_KEYS)[number], number>> = {
  date: 10,
  time: 5,
  pickup: 300,
  destination: 300,
  plannedStops: 2000,
  flightNumber: 40,
  returnDate: 10,
  returnTime: 5,
  scheduleOutline: 3000,
  invoiceReference: 200,
  eventVenue: 300,
  fullName: 100,
  email: 254,
  phone: 32,
  company: 200,
  notes: 1000,
};

const BOOLEAN_KEYS = [
  "multiDay", "international", "returnRequested", "multipleLocations",
  "multipleVehiclesRequested", "waitingRequested", "childSeatRequested",
] as const;
const NUMBER_KEYS = ["hours", "passengerCount", "luggageCount"] as const;

function decodeBookingDraft(payload: unknown): ValidationResult<BookingDraft> {
  if (!isObject(payload) || !hasOnlyKeys(payload, BOOKING_KEYS)) return { ok: false, fields: {} };
  const draft: BookingDraft = {};

  for (const [key, max] of Object.entries(STRING_LIMITS)) {
    const value = payload[key];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string" || value.length > max) {
      return { ok: false, fields: { [key]: "invalid" } };
    }
    Object.assign(draft, { [key]: value.trim() });
  }
  for (const key of BOOLEAN_KEYS) {
    const value = payload[key];
    if (value === undefined) continue;
    if (typeof value !== "boolean") return { ok: false, fields: { [key]: "invalid" } };
    Object.assign(draft, { [key]: value });
  }
  for (const key of NUMBER_KEYS) {
    const value = payload[key];
    if (value === undefined) continue;
    if (typeof value !== "number" || !Number.isInteger(value) || Math.abs(value) > 1000) {
      return { ok: false, fields: { [key]: "invalid" } };
    }
    Object.assign(draft, { [key]: value });
  }

  const intent = payload.intent;
  if (intent !== undefined) {
    if (intent !== "booking" && intent !== "quote") return { ok: false, fields: { intent: "invalid" } };
    draft.intent = intent as BookingIntent;
  }
  const serviceKey = payload.serviceKey;
  if (serviceKey !== undefined) {
    if (typeof serviceKey !== "string" || !bookingServiceKeys.includes(serviceKey as BookingServiceKey)) {
      return { ok: false, fields: { service: "service" } };
    }
    draft.serviceKey = serviceKey as BookingServiceKey;
  }

  const enumFields = {
    hireMode: ["hourly", "halfDay", "fullDay"],
    airportDirection: ["airport-to-city", "city-to-airport"],
    airportScope: ["belgrade-city", "other"],
    engagement: ["one-off", "recurring"],
  } as const;
  for (const [key, values] of Object.entries(enumFields)) {
    const value = payload[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || !(values as readonly string[]).includes(value)) {
      return { ok: false, fields: { [key]: "invalid" } };
    }
    Object.assign(draft, { [key]: value });
  }
  const vehiclePreference = payload.vehiclePreference;
  if (vehiclePreference !== undefined) {
    const valid = vehiclePreference === "recommend" ||
      vehicles.some((vehicle) => vehicle.id === vehiclePreference);
    if (!valid) return { ok: false, fields: { vehiclePreference: "vehicle-required" } };
    draft.vehiclePreference = vehiclePreference as VehiclePreference;
  }
  return { ok: true, value: draft };
}

export function validateBookingPayload(
  payload: unknown,
  locale: FormLocale,
  now = new Date(),
): ValidationResult<BookingSubmission> {
  const decoded = decodeBookingDraft(payload);
  if (!decoded.ok) return decoded;
  const draft = decoded.value;
  const selectedVehicle = draft.vehiclePreference && draft.vehiclePreference !== "recommend"
    ? vehicles.find((vehicle) => vehicle.id === draft.vehiclePreference) ?? null
    : null;
  const issues = validateBookingDraft(draft, {
    publicMinimumHours: contact.bookingLeadTime.publicMinimumHours,
    hourlyMinimumHours: privateChauffeurService.bookingOptions.hourly.minimumHours,
    timeZone: contact.bookingLeadTime.timeZone,
    selectedVehicle,
    includeContact: true,
    now,
  });
  if (issues.length > 0) {
    return {
      ok: false,
      fields: Object.fromEntries(issues.map((issue) => [issue.field, issue.code])),
    };
  }
  const built = buildBookingRequest(draft, {
    publicMinimumHours: contact.bookingLeadTime.publicMinimumHours,
    hourlyMinimumHours: privateChauffeurService.bookingOptions.hourly.minimumHours,
    timeZone: contact.bookingLeadTime.timeZone,
    selectedVehicle,
    now,
  });
  if (!built.ok) return { ok: false, fields: {} };
  const pricing = resolveBookingPricing(built.request);
  if (pricing.kind === "unavailable") {
    return { ok: false, fields: { service: "service-unavailable" } };
  }
  return { ok: true, value: { kind: "booking", locale, draft, request: built.request, pricing } };
}
