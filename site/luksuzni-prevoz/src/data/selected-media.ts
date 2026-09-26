/** DR-10 image roles and starting focal positions; reviewed crop in phase 5. */
import privateChauffeur from "../assets/sections/home/private-chauffeur.webp";
import passengerAtWork from "../assets/shared/other/passenger-working-in-backseat.webp";
import corporateRoad from "../assets/shared/pexels-georgesultan-11877375.webp";
import vipDetail from "../assets/shared/pexels-triemli-32897253.webp";
import specialEmblem from "../assets/shared/pexels-vishal-makwana-984383-31040135.webp";

export const selectedMedia = {
  privateChauffeurCard: { image: privateChauffeur, position: "40% 42%" },
  homePassengerFeature: { image: passengerAtWork, position: "48% 50%" },
  corporateHero: { image: corporateRoad, position: "58% 60%" },
  vipDiscretion: { image: vipDetail, position: "52% 52%" },
  specialEventsHero: { image: specialEmblem, position: "50% 52%" },
} as const;
