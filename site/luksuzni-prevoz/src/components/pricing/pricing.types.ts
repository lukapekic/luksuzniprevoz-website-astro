import type { RouteKey } from "@astro-foundation/core";
import type { VehicleId } from "../../data/fleet.ts";

export interface PricingRouteAction {
  label: string;
  to: RouteKey;
}

export interface PricingHrefAction {
  label: string;
  href: string;
}

export interface PricingRateRow {
  vehicleId: VehicleId;
  displayName: string;
  formattedPrice: string;
  unit: string;
}

export interface PricingTariffGroup {
  key: "hourly" | "half-day" | "full-day";
  heading: string;
  fact: string;
  status: string;
  rows: PricingRateRow[];
}

export interface PricingCustomServiceRow {
  routeKey: RouteKey;
  label: string;
  status: string;
  availability: "published" | "scaffold";
}

export interface PricingServiceFamily {
  key: "business" | "events";
  heading: string;
  rows: PricingCustomServiceRow[];
}
