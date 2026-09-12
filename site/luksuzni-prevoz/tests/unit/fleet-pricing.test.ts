import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getVehicle, vehicles } from "../../src/data/fleet.ts";
import { assertPricingConsistency, getPricing, pricing } from "../../src/data/pricing.ts";
import { resolveBookingPricing } from "../../src/lib/booking/booking-pricing.ts";
import type { PrivateChauffeurBooking } from "../../src/data/booking.ts";
import {
  assertFleetPageModelConsistency,
  fleetPageModels,
  visibleFleetPageProfileKeys,
  visibleFleetPageModels,
} from "../../src/data/fleet-page.ts";

describe("fleet pricing status", () => {
  it("keeps Kodiaq canonical without inventing capacity or pricing", () => {
    assert.deepEqual(getVehicle("skoda-kodiaq"), {
      id: "skoda-kodiaq",
      displayName: "Škoda Kodiaq",
      vehicleClass: "suv",
      pricingStatus: "quote-only",
      passengers: null,
    });
    assert.equal(getPricing("skoda-kodiaq"), null);
    assert.equal("skoda-kodiaq" in pricing, false);
  });

  it("keeps every published vehicle priced and the roster consistent", () => {
    for (const vehicle of vehicles) {
      if (vehicle.pricingStatus === "published") {
        assert.notEqual(
          getPricing(vehicle.id),
          null,
          `${vehicle.id} must retain published pricing`,
        );
      }
    }
    assert.doesNotThrow(() => assertPricingConsistency());
  });

  it("keeps Vito canonical and priced while excluding it from the Fleet showcase", () => {
    const vito = getVehicle("mercedes-vito-tourer-8-plus-1");
    const vitoPresentation = fleetPageModels.find((entry) => entry.key === "mercedesVitoTourer");

    assert.equal(vito.pricingStatus, "published");
    assert.notEqual(getPricing(vito.id), null);
    assert.deepEqual(vitoPresentation, {
      key: "mercedesVitoTourer",
      vehicleIds: ["mercedes-vito-tourer-8-plus-1"],
      showOnFleetPage: false,
      image: null,
    });
    assert.deepEqual(
      visibleFleetPageModels.map((entry) => entry.key),
      [...visibleFleetPageProfileKeys],
    );
    assert.equal(
      visibleFleetPageModels.some((entry) => entry.vehicleIds.includes(vito.id)),
      false,
    );
    assert.doesNotThrow(() => assertFleetPageModelConsistency());
  });

  it("routes a Kodiaq booking preference to quote handling before arithmetic", () => {
    const request: PrivateChauffeurBooking = {
      intent: "quote",
      serviceKey: "privateChauffeur",
      date: "2026-10-10",
      time: "12:00",
      pickup: "Belgrade",
      destination: "Novi Beograd",
      passengerCount: 2,
      childSeatRequested: false,
      multipleVehiclesRequested: false,
      hireMode: "hourly",
      hours: 2,
      multiDay: false,
      international: false,
      vehiclePreference: "skoda-kodiaq",
    };

    assert.deepEqual(resolveBookingPricing(request), {
      kind: "quote-required",
      reason: "quote-only-service",
    });
  });
});
