/** DR-10 image roles and starting focal positions; reviewed crop in phase 5. */
import { home } from "./media/home";
const privateChauffeur = home.services.chauffeur;
import { shared } from "./media/shared";
const passengerAtWork = shared.passengerExperience.passengerWorkingInBackseat;
const corporateRoad = shared.driving.pexelsGeorgesultan11877375;
const vipDetail = shared.driving.pexelsTriemli32897253;
const specialEmblem = shared.driving.pexelsVishalMakwana98438331040135;

export const selectedMedia = {
  privateChauffeurCard: { image: privateChauffeur, position: "40% 42%" },
  homePassengerFeature: { image: passengerAtWork, position: "48% 50%" },
  corporateHero: { image: corporateRoad, position: "58% 60%" },
  vipDiscretion: { image: vipDetail, position: "52% 52%" },
  specialEventsHero: { image: specialEmblem, position: "50% 52%" },
} as const;
