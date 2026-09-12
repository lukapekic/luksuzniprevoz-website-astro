import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vehicles } from "../../src/data/fleet.ts";
import { getPublishedPricingRecords } from "../../src/components/pricing/pricing-view-model.ts";
import { getService } from "../../src/data/services.ts";
import { getRoute } from "../../src/data/routes.ts";

describe("pricing page canonical model", () => {
  it("contains all and only published-pricing vehicles in fleet order", () => {
    const records = getPublishedPricingRecords();
    const expected = vehicles
      .filter((vehicle) => vehicle.pricingStatus === "published")
      .map((vehicle) => vehicle.id);

    assert.deepEqual(records.map(({ vehicle }) => vehicle.id), expected);
    assert.equal(records.some(({ vehicle }) => vehicle.id === "skoda-kodiaq"), false);
  });

  it("keeps every public ledger row in EUR and within the canonical airport scope", () => {
    for (const { pricing } of getPublishedPricingRecords()) {
      assert.equal(pricing.currency, "EUR");
      assert.equal(pricing.airportTransfer.currency, pricing.currency);
      assert.equal(
        pricing.airportTransfer.scope,
        "belgrade-airport-to-belgrade-city",
      );
    }
  });

  it("derives both custom-pricing families from their canonical service children", () => {
    for (const hubKey of ["businessTransportation", "specialEvents"] as const) {
      const hub = getService(hubKey);
      assert.equal(hub.kind, "hub");
      assert.equal(hub.children?.length, 3);

      for (const routeKey of [hub.routeKey, ...(hub.children ?? [])]) {
        const route = getRoute(routeKey);
        assert.ok(route.availability === "published" || route.availability === "scaffold");
        assert.ok(getService(routeKey).pricingMode.includes("quote"));
      }
    }
  });
});
