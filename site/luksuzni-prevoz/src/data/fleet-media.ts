/**
 * Homepage fleet presentation relationships.
 *
 * Vehicle identity and facts remain owned by fleet.ts. This module owns only
 * the ordered Homepage presentation and the relationship between canonical
 * vehicle ids and locally verified media assets.
 */
import type { ImageMetadata } from "astro";
import { fleetModelDisplayNames, type VehicleId } from "./fleet.ts";
import skodaSuperb from "../assets/fleet/skoda-superb.webp";
import mercedesEClass from "../assets/fleet/mercedes-e.webp";
import mercedesSClass from "../assets/fleet/mercedes-s.webp";
import mercedesVClass from "../assets/fleet/mercedes-v.webp";
import mercedesSprinter from "../assets/fleet/mercedes-sprinter.webp";

export interface HomepageFleetEntry {
  /** Representative canonical record supplying vehicle class and media lookup. */
  vehicleId: VehicleId;
  /** Canonical model-family name when configuration suffixes are suppressed. */
  displayName?: string;
  /** Defaults true; false rolls capacity variants into Pricing instead. */
  showPassengerCapacity?: boolean;
}

/**
 * Luxury-first Homepage sequence. The Homepage shows photographed model
 * families, while configuration-specific records remain in fleet/pricing data.
 */
export const homepageFleetEntries = [
  { vehicleId: "mercedes-s-class" },
  { vehicleId: "mercedes-e-class" },
  {
    vehicleId: "mercedes-v-class-6-plus-1-extra-long",
    displayName: fleetModelDisplayNames.mercedesVClass,
    showPassengerCapacity: false,
  },
  { vehicleId: "skoda-superb" },
  { vehicleId: "mercedes-sprinter" },
] satisfies readonly HomepageFleetEntry[];

/**
 * Both canonical V-Class configurations relate to the same exterior-model
 * photograph, although only one generic V-Class card renders on the Homepage.
 * Vito remains null and is omitted from that showcase. The unrelated Kodiaq
 * asset is intentionally not mapped to a canonical vehicle.
 */
export const homepageFleetMedia: Record<VehicleId, ImageMetadata | null> = {
  "skoda-superb": skodaSuperb,
  "mercedes-e-class": mercedesEClass,
  "mercedes-v-class-6-plus-1-extra-long": mercedesVClass,
  "mercedes-v-class-7-plus-1-extra-long": mercedesVClass,
  "mercedes-vito-tourer-8-plus-1": null,
  "mercedes-s-class": mercedesSClass,
  "mercedes-sprinter": mercedesSprinter,
};
