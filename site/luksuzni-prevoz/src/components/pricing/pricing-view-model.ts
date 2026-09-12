import { vehicles, type Vehicle } from "../../data/fleet.ts";
import { getPricing, type VehiclePricing } from "../../data/pricing.ts";

export interface PublishedPricingRecord {
  vehicle: Vehicle;
  pricing: VehiclePricing;
}

/**
 * Numeric Pricing ledgers contain all and only canonical published-pricing
 * vehicles, in fleet declaration order. Quote-only vehicles never receive a
 * presentation fallback.
 */
export function getPublishedPricingRecords(): PublishedPricingRecord[] {
  return vehicles
    .filter((vehicle) => vehicle.pricingStatus === "published")
    .map((vehicle) => {
      const vehiclePricing = getPricing(vehicle.id);
      if (!vehiclePricing) {
        throw new Error(
          `Pricing page cannot render published-pricing vehicle "${vehicle.id}" without canonical pricing.`,
        );
      }
      return { vehicle, pricing: vehiclePricing };
    });
}
