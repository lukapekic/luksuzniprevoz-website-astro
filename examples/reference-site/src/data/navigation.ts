/**
 * Navigation data — FND-I18N-10
 *
 * Primary and footer navigation items for the reference site.
 * Labels come from UI strings dictionary (FND-ARCH-03).
 * FND-TYPE-02: `routeKey` is typed as the generated `RouteKey` union so a
 * typo in a nav item is a compile error.
 */
import type { RouteKey, UiStringKey } from "@astro-foundation/core";

export interface NavItem {
  routeKey: RouteKey;
  labelKey: UiStringKey;
}

/** Primary navigation — shown in the header */
export const primaryNav: NavItem[] = [
  { routeKey: "home", labelKey: "home.title" },
  { routeKey: "airport", labelKey: "airport.title" },
  { routeKey: "about", labelKey: "about.title" },
  { routeKey: "contact", labelKey: "contact.title" },
];

/** Footer navigation — shown in the footer */
export const footerNav: NavItem[] = [
  { routeKey: "home", labelKey: "home.title" },
  { routeKey: "airport", labelKey: "airport.title" },
  { routeKey: "about", labelKey: "about.title" },
  { routeKey: "contact", labelKey: "contact.title" },
];
