import { bookingDatePolicy } from "../../data/booking.ts";
import { contact } from "../../data/contact.ts";
import { formatDisplayDate } from "./booking-date-time.ts";

/** Inclusive calendar range in Belgrade; leap-day anniversaries clamp to February 28. */
export function bookingDateBounds(now = new Date()): { min: string; max: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: contact.bookingLeadTime.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (key: string) => parts.find(part => part.type === key)!.value;
  const year = Number(value("year"));
  const month = value("month");
  const day = value("day");
  const lastDay = new Date(Date.UTC(year + bookingDatePolicy.maximumYearsAhead, Number(month), 0)).getUTCDate();
  return {
    min: `${year}-${month}-${day}`,
    max: `${year + bookingDatePolicy.maximumYearsAhead}-${month}-${String(Math.min(Number(day), lastDay)).padStart(2, "0")}`,
  };
}

export function isBookingDateInRange(date: string, now = new Date()): boolean {
  const { min, max } = bookingDateBounds(now);
  return Boolean(formatDisplayDate(date)) && date >= min && date <= max;
}
