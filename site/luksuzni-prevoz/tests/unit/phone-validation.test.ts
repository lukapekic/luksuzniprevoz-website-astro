import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidPhoneNumber } from "../../src/lib/forms/phone-validation.ts";
import { validateContactForm } from "../../src/components/contact/contact-form-validation.ts";
import { validateBookingDraft } from "../../src/lib/booking/booking-validation.ts";
import { validateContactPayload, validateBookingPayload } from "../../../../functions/_shared/validation.ts";

const contact = { fullName: "Jovana Petrović", email: "jovana@example.com", message: "A sufficiently long question." };
const journey = { intent: "booking" as const, serviceKey: "airportTransportation" as const,
  date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), time: "18:30", pickup: "Airport", destination: "Belgrade",
  airportDirection: "airport-to-city" as const, airportScope: "belgrade-city" as const,
  passengerCount: 2, vehiclePreference: "recommend" as const, fullName: contact.fullName, email: contact.email };
const options = { publicMinimumHours: 24, hourlyMinimumHours: 2, timeZone: "Europe/Belgrade" as const, selectedVehicle: null, includeContact: true };

describe("phone formats across client and server forms", () => {
  for (const [accepted, phones] of [
    [true, ["", "060-123-4567", "064/123-4567", "063 123 456", "+381 60 123 4567", "00381 (60) 123-4567", "+44 20 7946 0958", "011 234 5678"]],
    [false, ["+000 1234567", "060-abc-4567", "1234567", "06", "+381 1234567890123456", "+381 60 123 4567 ext 1"]],
  ] as const) {
    it(`${accepted ? "accepts" : "rejects"} the same phone shapes everywhere`, () => {
      for (const phone of phones) {
        assert.equal(isValidPhoneNumber(phone), accepted, phone);
        assert.equal(!validateContactForm({ ...contact, phone }).errors.phone, accepted, phone);
        assert.equal(!validateBookingDraft({ ...journey, phone }, options).some(issue => issue.field === "phone"), accepted, phone);
        assert.equal(validateContactPayload({ ...contact, phone }, "sr").ok, accepted, phone);
        assert.equal(validateBookingPayload({ ...journey, phone }, "sr").ok, accepted, phone);
      }
    });
  }
});
