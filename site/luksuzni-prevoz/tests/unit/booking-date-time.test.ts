import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { maskDisplayDate, combineHourMinute, formatDisplayDate, formatDisplaySchedule, parseDisplayDate } from "../../src/lib/booking/booking-date-time.ts";
import { validateBookingDraft } from "../../src/lib/booking/booking-validation.ts";
import { bookingDateBounds, isBookingDateInRange } from "../../src/lib/booking/booking-date-policy.ts";
import { validateBookingPayload } from "../../../../functions/_shared/validation.ts";
import type { BookingDraft } from "../../src/data/booking.ts";

describe("explicit booking date and time presentation", () => {
  it("round-trips a leap date independent of browser locale", () => {
    assert.equal(parseDisplayDate("29/02/2028"), "2028-02-29");
    assert.equal(formatDisplayDate("2028-02-29"), "29/02/2028");
    assert.equal(parseDisplayDate("29/02/2027"), null);
    assert.equal(parseDisplayDate("31/02/2026"), null);
    assert.equal(formatDisplayDate("2026-02-31"), "");
  });

  it("requires complete 24-hour parts without rounding", () => {
    assert.equal(combineHourMinute("00", "00"), "00:00");
    assert.equal(combineHourMinute("18", "30"), "18:30");
    assert.equal(combineHourMinute("23", "59"), "23:59");
    assert.equal(combineHourMinute("24", "00"), "");
    assert.equal(formatDisplaySchedule("2026-09-24", "24:00"), null);
    assert.equal(formatDisplaySchedule("2026-09-24", "12:60"), null);
    assert.equal(combineHourMinute("09", ""), "");
    assert.equal(formatDisplaySchedule("2026-09-24", "18:30"), "24/09/2026 · 18:30");
  });

  it("rejects a return before departure in Belgrade time", () => {
    const draft: BookingDraft = {
      intent: "booking", serviceKey: "airportTransportation", date: "2026-10-10", time: "18:30",
      pickup: "Airport", destination: "Belgrade", airportDirection: "airport-to-city",
      airportScope: "belgrade-city", returnRequested: true, returnDate: "2026-10-10", returnTime: "17:00",
      passengerCount: 2, vehiclePreference: "recommend",
    };
    const issues = validateBookingDraft(draft, { publicMinimumHours: 24, hourlyMinimumHours: 2, timeZone: "Europe/Belgrade", selectedVehicle: null, now: new Date("2026-09-26T10:00:00Z") });
    assert.ok(issues.some((issue) => issue.field === "return"));
  });
});


describe("booking date mask and allowed horizon", () => {
  it("masks progressive digits, pasted separators, replacement and clearing", () => {
    assert.deepEqual(["0", "01", "010", "0109", "01092", "01092026", "01/09/2026", ""].map(maskDisplayDate),
      ["0", "01", "01/0", "01/09", "01/09/2", "01/09/2026", "01/09/2026", ""]);
    assert.equal(parseDisplayDate(maskDisplayDate("31022027")), null);
  });

  it("uses Belgrade's calendar day and clamps a leap-day anniversary", () => {
    assert.deepEqual(bookingDateBounds(new Date("2026-09-26T22:30:00Z")), { min: "2026-09-27", max: "2027-09-27" });
    assert.deepEqual(bookingDateBounds(new Date("2028-02-29T10:00:00Z")), { min: "2028-02-29", max: "2029-02-28" });
    const now = new Date("2026-09-26T10:00:00Z");
    for (const date of ["2026-09-26", "2027-09-26"]) assert.equal(isBookingDateInRange(date, now), true);
    for (const date of ["2026-09-25", "2027-09-27", "2032-09-26", "2027-02-29"]) assert.equal(isBookingDateInRange(date, now), false);
  });

  it("enforces outbound and return limits in authoritative server validation", () => {
    const now = new Date("2026-09-26T10:00:00Z");
    const journey = {
      intent: "booking", serviceKey: "airportTransportation", date: "2026-10-10", time: "18:30",
      pickup: "Airport", destination: "Belgrade", airportDirection: "airport-to-city", airportScope: "belgrade-city",
      passengerCount: 2, vehiclePreference: "recommend", fullName: "Jovana Petrović", email: "jovana@example.com",
    };
    assert.equal(validateBookingPayload(journey, "en", now).ok, true);
    assert.equal(validateBookingPayload({ ...journey, date: "2027-09-26" }, "en", now).ok, true);
    for (const date of ["2026-09-25", "2027-09-27", "2032-01-01"]) {
      const result = validateBookingPayload({ ...journey, date }, "en", now);
      assert.ok(!result.ok && result.fields.dateTime === "date-range");
    }
    const result = validateBookingPayload({ ...journey, returnRequested: true, returnDate: "2032-01-01", returnTime: "12:00" }, "en", now);
    assert.ok(!result.ok && result.fields.return === "date-range");
    assert.equal(validateBookingPayload({ ...journey, date: "2026-09-26" }, "en", now).ok, false, "minimum notice remains enforced");
  });
});
