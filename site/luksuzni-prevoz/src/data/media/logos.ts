/** Canonical asset paths; localized copy and presentation settings remain with consumers. */
import assetChineseEmbassy from "../../assets/logos/clients/chinese-embassy.png";
import assetHyattRegency from "../../assets/logos/clients/hyatt-regency.png";
import assetOsce from "../../assets/logos/clients/osce.png";
import assetPrezidentPalaceHotel from "../../assets/logos/clients/prezident-palace-hotel.png";
import assetQatarAirways from "../../assets/logos/clients/qatar-airways.png";
import assetSerbianSwimmingAssociation from "../../assets/logos/clients/serbian-swimming-association.png";
import assetSquareNineHotels from "../../assets/logos/clients/square-nine-hotels.png";
import assetBelgradeTransfersHorizontalOnDark from "../../assets/logos/partners/belgrade-transfers-horizontal-on-dark.svg";
import assetTransferi from "../../assets/logos/partners/transferi.svg";

export const logos = {
  clients: {
    chineseEmbassy: assetChineseEmbassy,
    hyattRegency: assetHyattRegency,
    osce: assetOsce,
    prezidentPalaceHotel: assetPrezidentPalaceHotel,
    qatarAirways: assetQatarAirways,
    serbianSwimmingAssociation: assetSerbianSwimmingAssociation,
    squareNineHotels: assetSquareNineHotels,
  },
  partners: {
    belgradeTransfersHorizontalOnDark: assetBelgradeTransfersHorizontalOnDark,
    transferi: assetTransferi,
  },
} as const;
