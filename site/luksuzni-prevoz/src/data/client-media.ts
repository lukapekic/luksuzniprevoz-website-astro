/**
 * Client-logo presentation relationships.
 *
 * Client identity, approval, placement, and stable logo identifiers remain in
 * clients.ts. This Astro-only media module maps those identifiers to imported
 * local assets so Node-based data validators can load canonical client data.
 */
import type { ImageMetadata } from "astro";
import type { ClientLogoId } from "./clients.ts";
import { logos } from "./media/logos";
const chineseEmbassy = logos.clients.chineseEmbassy;
const hyattRegency = logos.clients.hyattRegency;
const osce = logos.clients.osce;
const presidentPalaceHotel = logos.clients.prezidentPalaceHotel;
const qatarAirways = logos.clients.qatarAirways;
const serbianSwimmingAssociation = logos.clients.serbianSwimmingAssociation;
const squareNineHotels = logos.clients.squareNineHotels;

export const clientLogoMedia = {
  "chinese-embassy": chineseEmbassy,
  "hyatt-regency": hyattRegency,
  osce,
  "president-palace-hotel": presidentPalaceHotel,
  "qatar-airways": qatarAirways,
  "serbian-swimming-association": serbianSwimmingAssociation,
  "square-nine-hotels": squareNineHotels,
} satisfies Record<ClientLogoId, ImageMetadata>;
