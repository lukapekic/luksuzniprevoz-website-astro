import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getVehicle } from "../../src/data/fleet.ts";
import {
  conferenceCongressService,
  conferenceCongressVehicleRoles,
  getService,
} from "../../src/data/services.ts";

describe("Conference service data", () => {
  it("owns the canonical vehicle-role mapping in services.ts", () => {
    const conference = getService("conferenceCongressTransportation");

    assert.strictEqual(conference, conferenceCongressService);
    assert.strictEqual(conference.vehicleRoles, conferenceCongressVehicleRoles);
    assert.deepEqual(conference.vehicleRoles, {
      individualExecutive: ["mercedes-s-class", "mercedes-e-class"],
      smallerGroup: ["mercedes-v-class-7-plus-1-extra-long"],
      largerGroup: ["mercedes-sprinter"],
    });
  });

  it("maps every role to a canonical fleet vehicle", () => {
    const roleVehicleIds = Object.values(conferenceCongressVehicleRoles).flat();

    assert.equal(new Set(roleVehicleIds).size, 4);
    for (const vehicleId of roleVehicleIds) {
      assert.equal(getVehicle(vehicleId).id, vehicleId);
    }
  });
});

describe("VIP service data", () => {
  it("declares the complete positive and negative capability contract", () => {
    const vip = getService("vipTransportation");

    assert.deepEqual(vip.pricingMode, ["quote"]);
    assert.equal(vip.discretion, true);
    assert.equal(vip.privacy, true);
    assert.equal(vip.commercialAviation, true);
    assert.equal(vip.privateAviation, true);
    assert.equal(vip.multiVehicle, true);
    assert.equal(vip.dedicatedCoordinatorForComplexBookings, true);
    assert.equal(vip.securityService, false);
    assert.equal(vip.customDecorationPositioning, false);
  });
});
