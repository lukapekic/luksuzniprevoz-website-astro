/** Fleet-page media for enabled presentation relationships. */
import type { ImageMetadata } from "astro";
import { visibleFleetPageModels, type VisibleFleetPageProfileKey } from "./fleet-page.ts";
import { fleet } from "./media/fleet";
const mercedesSClass = fleet.sClass.frontFacing;
const mercedesEClass = fleet.eClass.frontFacing;
const skodaSuperb = fleet.superb.frontFacing;
const skodaKodiaq = fleet.kodiaq.frontFacing;
const mercedesVClass = fleet.vClass.frontFacing;
const mercedesSprinter = fleet.sprinter.frontFacing;

const mediaByProfile: Record<VisibleFleetPageProfileKey, ImageMetadata> = {
  mercedesSClass,
  mercedesEClass,
  skodaSuperb,
  skodaKodiaq,
  mercedesVClass,
  mercedesSprinter,
};

export const fleetPageShowcase = visibleFleetPageModels.map((entry) => ({
  ...entry,
  image: mediaByProfile[entry.key],
}));
