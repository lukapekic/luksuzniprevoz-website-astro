/** Canonical asset paths; localized copy and presentation settings remain with consumers. */
import assetHero from "../../assets/images/pages/home/hero.jpg";
import assetPrivateChauffeurCard from "../../assets/images/pages/home/private-chauffeur-card.webp";
import assetAirportTransferCard from "../../assets/images/pages/home/airport-transfer-card.webp";
import assetBusinessTransportCard from "../../assets/images/pages/home/business-transport-card.webp";
import assetPrivateChauffeurAlternateCard from "../../assets/images/pages/home/private-chauffeur-alternate-card.webp";
import assetSpecialEventsCard from "../../assets/images/pages/home/special-events-card.webp";

export const home = {
  hero: assetHero,
  services: {
    chauffeur: assetPrivateChauffeurCard,
    airport: assetAirportTransferCard,
    business: assetBusinessTransportCard,
    chauffeurAlternate: assetPrivateChauffeurAlternateCard,
    specialEvents: assetSpecialEventsCard,
  },
} as const;
