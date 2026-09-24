import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { combineHourMinute, formatDisplayDate, formatDisplaySchedule, parseDisplayDate } from "../../src/lib/booking/booking-date-time.ts";
import { validateBookingDraft } from "../../src/lib/booking/booking-validation.ts";
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
    assert.equal(combineHourMinute("09", ""), "");
    assert.equal(formatDisplaySchedule("2026-09-24", "18:30"), "24/09/2026 · 18:30");
  });

  it("rejects a return before departure in Belgrade time", () => {
    const draft: BookingDraft = {
      intent: "booking", serviceKey: "airportTransportation", date: "2099-12-31", time: "18:30",
      pickup: "Airport", destination: "Belgrade", airportDirection: "airport-to-city",
      airportScope: "belgrade-city", returnRequested: true, returnDate: "2099-12-31", returnTime: "17:00",
      passengerCount: 2, vehiclePreference: "recommend",
    };
    const issues = validateBookingDraft(draft, { publicMinimumHours: 24, hourlyMinimumHours: 2, timeZone: "Europe/Belgrade", selectedVehicle: null });
    assert.ok(issues.some((issue) => issue.field === "return"));
  });
});
