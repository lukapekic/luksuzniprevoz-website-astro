import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseBookingHandoff, cleanBookingHandoffUrl } from "../../src/lib/booking/booking-handoff.ts";
import { resolveBookingPricing } from "../../src/lib/booking/booking-pricing.ts";
import { zonedLocalDateTimeToDate, validateBookingLeadTime } from "../../src/lib/booking/booking-validation.ts";
import { loadBookingDraft, saveBookingDraft, selectPersistedBookingDraft } from "../../src/lib/booking/booking-storage.ts";
import type { PrivateChauffeurBooking, AirportBooking } from "../../src/data/booking.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const common = {
  intent: "booking" as const,
  date: "2026-10-10",
  time: "12:00",
  pickup: "Belgrade",
  passengerCount: 2,
  childSeatRequested: false,
  multipleVehiclesRequested: false,
};

describe("booking handoff", () => {
  it("accepts only canonical direct-service and Airport fields", () => {
    const result = parseBookingHandoff(new URLSearchParams({
      intent: "quote", service: "airportTransportation", date: "2026-10-10",
      time: "12:30", flightNumber: "JU 123", amount: "1",
    }));
    assert.deepEqual(result, {
      initialStep: "journey",
      patch: {
        intent: "quote", serviceKey: "airportTransportation", date: "2026-10-10",
        time: "12:30", flightNumber: "JU 123",
      },
    });
    assert.deepEqual(
      parseBookingHandoff(new URLSearchParams({ service: "unknown", date: "2026-10-10" })),
      { initialStep: "service", patch: { intent: "booking" } },
    );
  });

  it("cleans only consumed handoff keys", () => {
    const url = new URL("https://example.test/en/booking/?intent=booking&service=privateChauffeur&campaign=summer#form");
    assert.equal(cleanBookingHandoffUrl(url), "/en/booking/?campaign=summer#form");
  });
});

describe("booking time-zone validation", () => {
  it("interprets winter and summer input in Europe/Belgrade", () => {
    assert.equal(zonedLocalDateTimeToDate("2026-01-15", "12:00", "Europe/Belgrade")?.toISOString(), "2026-01-15T11:00:00.000Z");
    assert.equal(zonedLocalDateTimeToDate("2026-07-15", "12:00", "Europe/Belgrade")?.toISOString(), "2026-07-15T10:00:00.000Z");
    assert.equal(zonedLocalDateTimeToDate("2026-03-29", "02:30", "Europe/Belgrade"), null);
  });

  it("enforces canonical lead time against the resolved instant", () => {
    const now = new Date("2026-01-14T11:30:00.000Z");
    assert.equal(validateBookingLeadTime("2026-01-15", "12:00", 24, "Europe/Belgrade", now), false);
    assert.equal(validateBookingLeadTime("2026-01-15", "13:00", 24, "Europe/Belgrade", now), true);
  });
});

describe("booking pricing", () => {
  it("quotes vehicle recommendation and outside Airport scope", () => {
    const recommended: PrivateChauffeurBooking = {
      ...common, serviceKey: "privateChauffeur", destination: "Novi Beograd",
      hireMode: "hourly", hours: 2, multiDay: false, international: false,
      vehiclePreference: "recommend",
    };
    assert.deepEqual(resolveBookingPricing(recommended), {
      kind: "quote-required", reason: "vehicle-recommendation",
    });

    const airport: AirportBooking = {
      ...common, serviceKey: "airportTransportation", destination: "Novi Sad",
      direction: "airport-to-city", airportScope: "other", returnRequested: false,
      vehiclePreference: "mercedes-e-class",
    };
    assert.deepEqual(resolveBookingPricing(airport), {
      kind: "quote-required", reason: "outside-airport-scope",
    });
  });

  it("calculates canonical hourly and fixed Airport fares", () => {
    const hourly: PrivateChauffeurBooking = {
      ...common, serviceKey: "privateChauffeur", destination: "Novi Beograd",
      hireMode: "hourly", hours: 2, multiDay: false, international: false,
      vehiclePreference: "mercedes-e-class",
    };
    const hourlyResult = resolveBookingPricing(hourly);
    assert.equal(hourlyResult.kind, "calculated");
    assert.equal("amount" in hourlyResult ? hourlyResult.amount : null, 110);

    const airport: AirportBooking = {
      ...common, serviceKey: "airportTransportation", destination: "Belgrade",
      direction: "airport-to-city", airportScope: "belgrade-city", returnRequested: false,
      vehiclePreference: "mercedes-e-class",
    };
    assert.deepEqual(resolveBookingPricing(airport), {
      kind: "fixed", vehicleId: "mercedes-e-class", source: "airport-transfer", amount: 45, currency: "EUR",
    });
  });
});

describe("booking draft storage", () => {
  it("persists only structured non-free-text fields and expires safely", () => {
    const selected = selectPersistedBookingDraft({
      intent: "quote", serviceKey: "airportTransportation", date: "2026-10-10",
      pickup: "Sensitive address", flightNumber: "JU 123", fullName: "Sensitive Name",
      passengerCount: 2, vehiclePreference: "recommend",
    });
    assert.deepEqual(selected, {
      intent: "quote", serviceKey: "airportTransportation", date: "2026-10-10",
      passengerCount: 2, vehiclePreference: "recommend",
    });
    const storage = new MemoryStorage();
    saveBookingDraft(storage, selected, 1000);
    assert.deepEqual(loadBookingDraft(storage, 1500), selected);
    assert.equal(loadBookingDraft(storage, 10_000_000), null);
  });
});
