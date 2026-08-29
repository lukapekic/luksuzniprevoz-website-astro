/**
 * Client-logo presentation relationships.
 *
 * Client identity, approval, placement, and stable logo identifiers remain in
 * clients.ts. This Astro-only media module maps those identifiers to imported
 * local assets so Node-based data validators can load canonical client data.
 */
import type { ImageMetadata } from "astro";
import type { ClientLogoId } from "./clients.ts";
import hyattRegency from "../assets/clients/hyatt-regency.png";
import presidentPalaceHotel from "../assets/clients/prezident-palace-hotel.png";
import qatarAirways from "../assets/clients/qatar-airways.png";
import squareNineHotels from "../assets/clients/square-nine-hotels.png";

export const clientLogoMedia = {
  "hyatt-regency": hyattRegency,
  "president-palace-hotel": presidentPalaceHotel,
  "qatar-airways": qatarAirways,
  "square-nine-hotels": squareNineHotels,
} satisfies Record<ClientLogoId, ImageMetadata>;
