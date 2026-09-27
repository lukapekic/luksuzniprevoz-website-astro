/** Optional combined registry. Prefer area imports in production consumers. */
import { airportTransportation } from "./airportTransportation";
import { brand } from "./brand";
import { businessTransportation } from "./businessTransportation";
import { fleet } from "./fleet";
import { fleetPage } from "./fleetPage";
import { home } from "./home";
import { logos } from "./logos";
import { shared } from "./shared";
import { vipTransportation } from "./vipTransportation";

export { airportTransportation, brand, businessTransportation, fleet, fleetPage, home, logos, shared, vipTransportation };

export const assets = { airportTransportation, brand, businessTransportation, fleet, fleetPage, home, logos, shared, vipTransportation } as const;
