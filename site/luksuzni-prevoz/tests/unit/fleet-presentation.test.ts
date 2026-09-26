import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getVehicle } from "../../src/data/fleet.ts";
import { airportFamilyFare, fleetFamilyKey, fleetFamilyName, fleetFamilyPassengers, uniqueFleetFamilies } from "../../src/data/fleet-presentation.ts";

describe("fleet presentation families", () => {
  const six = getVehicle("mercedes-v-class-6-plus-1-extra-long");
  const seven = getVehicle("mercedes-v-class-7-plus-1-extra-long");

  it("keeps one V-Class card in first-family order without changing configuration records", () => {
    const cards = uniqueFleetFamilies([{ vehicle: six }, { vehicle: getVehicle("mercedes-s-class") }, { vehicle: seven }]);
    assert.deepEqual(cards.map(({ vehicle }) => fleetFamilyKey(vehicle.id)), ["mercedes-v-class", "mercedes-s-class"]);
    assert.equal(fleetFamilyName(cards[0]!.vehicle), "Mercedes-Benz V-Class");
    assert.equal(fleetFamilyPassengers(cards[0]!.vehicle), null);
    assert.equal(six.passengers, 6);
    assert.equal(seven.passengers, 7);
  });

  it("only projects an exact airport fare when the family configurations agree", () => {
    assert.deepEqual(airportFamilyFare("mercedes-v-class"), { amount: 60, currency: "EUR" });
    assert.equal(airportFamilyFare("skoda-kodiaq"), null);
  });
});
