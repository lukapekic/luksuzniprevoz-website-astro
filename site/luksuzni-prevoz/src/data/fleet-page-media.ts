/** Fleet-page media for enabled presentation relationships. */
import type { ImageMetadata } from "astro";
import { visibleFleetPageModels, type VisibleFleetPageProfileKey } from "./fleet-page.ts";
import mercedesSClass from "../assets/fleet/original/s-class/front-facing.webp";
import mercedesEClass from "../assets/fleet/original/e-class/front-facing.webp";
import skodaSuperb from "../assets/fleet/original/superb/front-facing.webp";
import skodaKodiaq from "../assets/fleet/original/kodiaq/front-facing.webp";
import mercedesVClass from "../assets/fleet/original/v-class/front-facing.webp";
import mercedesSprinter from "../assets/fleet/original/sprinter/front-facing.webp";

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
