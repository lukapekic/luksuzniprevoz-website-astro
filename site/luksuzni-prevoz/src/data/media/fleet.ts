/** Canonical vehicle photographs; model relationships remain in fleet data. */
import eClassFrontFacing from "../../assets/images/fleet/e-class/front-facing.webp";
import eClassLeftFacing from "../../assets/images/fleet/e-class/left-facing.webp";
import kodiaqFrontFacing from "../../assets/images/fleet/kodiaq/front-facing.webp";
import kodiaqLeftFacing from "../../assets/images/fleet/kodiaq/left-facing.webp";
import sClassFrontFacing from "../../assets/images/fleet/s-class/front-facing.webp";
import sClassLeftFacing from "../../assets/images/fleet/s-class/left-facing.webp";
import sprinterFrontFacing from "../../assets/images/fleet/sprinter/front-facing.webp";
import sprinterInteriorEntrance from "../../assets/images/fleet/sprinter/interior-entrance.webp";
import sprinterLeftFacing from "../../assets/images/fleet/sprinter/left-facing.webp";
import superbFrontFacing from "../../assets/images/fleet/superb/front-facing.webp";
import superbLeftFacing from "../../assets/images/fleet/superb/left-facing.webp";
import vClassFrontFacing from "../../assets/images/fleet/v-class/front-facing.webp";
import vClassLeftFacing from "../../assets/images/fleet/v-class/left-facing.webp";

export const fleet = {
  eClass: {
    frontFacing: eClassFrontFacing,
    leftFacing: eClassLeftFacing,
  },
  kodiaq: {
    frontFacing: kodiaqFrontFacing,
    leftFacing: kodiaqLeftFacing,
  },
  sClass: {
    frontFacing: sClassFrontFacing,
    leftFacing: sClassLeftFacing,
  },
  sprinter: {
    frontFacing: sprinterFrontFacing,
    interiorEntrance: sprinterInteriorEntrance,
    leftFacing: sprinterLeftFacing,
  },
  superb: {
    frontFacing: superbFrontFacing,
    leftFacing: superbLeftFacing,
  },
  vClass: {
    frontFacing: vClassFrontFacing,
    leftFacing: vClassLeftFacing,
  },
} as const;
