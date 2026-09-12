/**
 * Homepage fleet presentation relationships.
 *
 * Vehicle identity and facts remain owned by fleet.ts. This module owns only
 * the ordered Homepage presentation and the relationship between canonical
 * vehicle ids and locally verified media assets.
 */
import type { ImageMetadata } from "astro";
import { fleetModelDisplayNames, type VehicleId } from "./fleet.ts";
import skodaSuperb from "../assets/fleet/original/superb/left-facing.webp";
import skodaKodiaq from "../assets/fleet/original/kodiaq/left-facing.webp";
import mercedesEClass from "../assets/fleet/original/e-class/left-facing.webp";
import mercedesSClass from "../assets/fleet/original/s-class/left-facing.webp";
import mercedesVClass from "../assets/fleet/original/v-class/left-facing.webp";
import mercedesSprinter from "../assets/fleet/original/sprinter/left-facing.webp";

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
 * Vito remains null and is omitted from that showcase. Kodiaq has canonical
 * compact media available but is not added to the locked Homepage sequence.
 */
export const homepageFleetMedia: Record<VehicleId, ImageMetadata | null> = {
  "skoda-superb": skodaSuperb,
  "skoda-kodiaq": skodaKodiaq,
  "mercedes-e-class": mercedesEClass,
  "mercedes-v-class-6-plus-1-extra-long": mercedesVClass,
  "mercedes-v-class-7-plus-1-extra-long": mercedesVClass,
  "mercedes-vito-tourer-8-plus-1": null,
  "mercedes-s-class": mercedesSClass,
  "mercedes-sprinter": mercedesSprinter,
};
