/**
 * Homepage fleet presentation relationships.
 *
 * Vehicle identity and facts remain owned by fleet.ts. This module owns only
 * the ordered Homepage presentation and the relationship between canonical
 * vehicle ids and locally verified media assets.
 */
import type { ImageMetadata } from "astro";
import type { VehicleId } from "./fleet.ts";
import skodaSuperb from "../assets/fleet/skoda-superb.webp";
import mercedesEClass from "../assets/fleet/mercedes-e.webp";
import mercedesSClass from "../assets/fleet/mercedes-s.webp";
import mercedesVClass from "../assets/fleet/mercedes-v.webp";
import mercedesSprinter from "../assets/fleet/mercedes-sprinter.webp";

/** Luxury-first Homepage sequence; it does not change the canonical roster. */
export const homepageFleetOrder: VehicleId[] = [
  "mercedes-s-class",
  "mercedes-e-class",
  "mercedes-v-class-6-plus-1-extra-long",
  "mercedes-v-class-7-plus-1-extra-long",
  "skoda-superb",
  "mercedes-vito-tourer-8-plus-1",
  "mercedes-sprinter",
];

/**
 * The two V-Class configurations share the same exterior-model photograph.
 * Vito remains null until a matching asset is supplied. The unrelated Kodiaq
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

