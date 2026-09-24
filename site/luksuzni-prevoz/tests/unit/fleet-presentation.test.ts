import { describe, expect, it } from "vitest";
import { getVehicle } from "../../src/data/fleet.ts";
import { airportFamilyFare, fleetFamilyKey, fleetFamilyName, fleetFamilyPassengers, uniqueFleetFamilies } from "../../src/data/fleet-presentation.ts";

describe("fleet presentation families", () => {
  const six = getVehicle("mercedes-v-class-6-plus-1-extra-long");
  const seven = getVehicle("mercedes-v-class-7-plus-1-extra-long");

  it("keeps one V-Class card in first-family order without changing configuration records", () => {
    const cards = uniqueFleetFamilies([{ vehicle: six }, { vehicle: getVehicle("mercedes-s-class") }, { vehicle: seven }]);
    expect(cards.map(({ vehicle }) => fleetFamilyKey(vehicle.id))).toEqual(["mercedes-v-class", "mercedes-s-class"]);
    expect(fleetFamilyName(cards[0]!.vehicle)).toBe("Mercedes-Benz V-Class");
    expect(fleetFamilyPassengers(cards[0]!.vehicle)).toBeNull();
    expect(six.passengers).toBe(6);
    expect(seven.passengers).toBe(7);
  });

  it("only projects an exact airport fare when the family configurations agree", () => {
    expect(airportFamilyFare("mercedes-v-class")).toEqual({ amount: 60, currency: "EUR" });
    expect(airportFamilyFare("skoda-kodiaq")).toBeNull();
  });
});
