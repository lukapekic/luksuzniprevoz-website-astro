/**
 * Contact + booking-policy facts — FND-ARCH-03 / FND-TYPE-02.
 *
 * Operational facts (nullable pending owner confirmation), each carrying a
 * `verificationStatus`. Structural fields are typed; translatable PROSE (full
 * sentences) is referenced by UiStringKey into content/ui/*.json, same pattern
 * as business.ts — facts are one-source/all-locales, text is per-locale and
 * parity-checked by content:validate.
 *
 * STATUS: phone/email/whatsapp/office address are `null` +
 * "owner-confirmation-required". The owner provides real values later; until
 * then the site must NOT present them as live contact points. Components gate
 * rendering on `verificationStatus === "verified"` (or non-null) so a null
 * never ships as a clickable tel:/mailto:. JSON-LD telephone/email are sourced
 * from here once verified (see business.ts businessData).
 */
import type { UiStringKey } from "@astro-foundation/core";
import type { VerificationStatus } from "./business.ts";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ContactChannel<T> {
  value: T | null;
  verificationStatus: VerificationStatus;
}

export interface OfficeLocation {
  address: string | null;
  city: string;
  country: string;
  postalCode: string;
  googleMapsUrl: string | null;
  verificationStatus: VerificationStatus;
}

export interface OfficeHours {
  timezone: string;
  days: DayOfWeek[];
  opens: string;
  closes: string;
  /** UiStringKey into content/ui/*.json for the translated public note. */
  publicNoteKey: UiStringKey;
}

export interface BookingLeadTime {
  publicMinimumHours: number;
  lastMinuteMarketingAllowed: boolean;
  /** UiStringKey into content/ui/*.json for the translated exception policy. */
  exceptionPolicyKey: UiStringKey;
}

export interface Contact {
  office: OfficeLocation;
  phone: ContactChannel<string>;
  email: ContactChannel<string>;
  whatsapp: ContactChannel<string>;
  officeHours: OfficeHours;
  bookingLeadTime: BookingLeadTime;
}

export const contact: Contact = {
  office: {
    address: "Antifašističke borbe 25",
    city: "Belgrade",
    country: "Serbia",
    postalCode: "11070",
    googleMapsUrl: null,
    verificationStatus: "verified",
  },
  phone: {
    value: "+381 60 111 9999",
    verificationStatus: "verified",
  },
  email: {
    value: "office@luksuzniprevoz.rs",
    verificationStatus: "verified",
  },
  whatsapp: {
    value: null,
    verificationStatus: "verified",
  },
  officeHours: {
    timezone: "Europe/Belgrade",
    days: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    opens: "08:00",
    closes: "18:00",
    publicNoteKey: "contact.officeNote",
  },
  bookingLeadTime: {
    publicMinimumHours: 24,
    lastMinuteMarketingAllowed: false,
    exceptionPolicyKey: "contact.bookingExceptionPolicy",
  },
};

/** True only when a channel carries a verified, non-null value. Components
 *  use this to decide whether to render a live tel:/mailto: link. */
export function isVerified<T>(channel: ContactChannel<T>): boolean {
  return channel.value !== null && channel.verificationStatus === "verified";
}
