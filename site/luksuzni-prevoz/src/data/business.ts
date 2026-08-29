/**
 * Business identity + operational facts — FND-ARCH-03 / FND-TYPE-02.
 *
 * Language-independent structural facts live here as typed TS: brand identity,
 * parent-company relationship, headquarters, service area, customer groups,
 * payment methods, support model. Enums are typed unions so consuming
 * components branch on known values (a typo is a compile error).
 *
 * Translatable PROSE (full sentences shown to users) does NOT live here — it
 * lives in content/ui/*.json and is referenced by a stable UiStringKey. This
 * keeps facts (one source, all locales) separate from text (per-locale,
 * translator-edited, parity-checked by content:validate). The translation
 * agent refines the text later; the keys are stable.
 *
 * JSON-LD: `businessData` is the compat export consumed by
 * `buildLocalBusiness()` in @astro-foundation/core/seo. Phone/email are NOT
 * wired here — they live in contact.ts and are unverified (null) until the
 * owner confirms them; telephone/email are omitted from JSON-LD while null
 * (better to omit than emit empty). Wire + enrich JSON-LD when contact lands.
 */
import type { UiStringKey } from "@astro-foundation/core";

// --- Enum vocabularies (typed unions — branch safely in components) --------

export type CustomerGroup =
  | "private-clients"
  | "families"
  | "business-travelers"
  | "executives"
  | "companies"
  | "delegations"
  | "embassies-and-diplomatic-missions"
  | "hotels"
  | "conference-and-event-organizers";

export type PaymentMethod = "cash" | "card" | "bank-transfer" | "invoice";

/** How international / outside-area requests are handled. */
export type InternationalHandling = "custom-quote";

/** Where contact details stand in verification. */
export type VerificationStatus = "verified" | "owner-confirmation-required";

// --- Structural types ------------------------------------------------------

export interface ParentCompany {
  name: string;
  operatingSince: number;
  /** UiStringKey into content/ui/*.json for the translated description. */
  relationshipDescriptionKey: UiStringKey;
  publicPlacement: ("about" | "footer")[];
}

export interface Headquarters {
  city: string;
  country: string;
  streetAddress: string;
  verificationStatus: VerificationStatus;
}

export interface ServiceArea {
  primary: string[];
  secondary: string[];
  international: boolean;
  internationalHandling: InternationalHandling;
}

export interface SupportModel {
  public247SupportClaim: boolean;
  /** Formatted office-hours range, e.g. "08:00-18:00". Fact, not prose. */
  officeHours: string;
  afterHoursManagersMayBeAvailable: boolean;
}

export interface Business {
  publicBrand: string;
  parentCompany: ParentCompany;
  headquarters: Headquarters;
  serviceArea: ServiceArea;
  customerGroups: CustomerGroup[];
  paymentMethods: PaymentMethod[];
  supportModel: SupportModel;
}

// --- Authoritative business facts -----------------------------------------

export const business: Business = {
  publicBrand: "Luxury Transportation",
  parentCompany: {
    name: "GrandSolution",
    operatingSince: 2014,
    relationshipDescriptionKey: "business.parentCompanyDescription",
    publicPlacement: ["about", "footer"],
  },
  headquarters: {
    city: "Belgrade",
    country: "Serbia",
    streetAddress: "Antifašističke borbe 25, 11070, Belgrade, Serbia",
    verificationStatus: "verified",
  },
  serviceArea: {
    primary: ["Belgrade"],
    secondary: ["Serbia"],
    international: true,
    internationalHandling: "custom-quote",
  },
  customerGroups: [
    "private-clients",
    "families",
    "business-travelers",
    "executives",
    "companies",
    "delegations",
    "embassies-and-diplomatic-missions",
    "hotels",
    "conference-and-event-organizers",
  ],
  paymentMethods: ["cash", "card", "bank-transfer", "invoice"],
  supportModel: {
    public247SupportClaim: false,
    officeHours: "08:00-18:00",
    afterHoursManagersMayBeAvailable: true,
  },
};

// --- JSON-LD compat export (consumed by buildLocalBusiness) ---------------
//
// Address comes from the VERIFIED headquarters. telephone/email are left empty
// — they are owned by contact.ts and unverified until the owner confirms them.
// buildLocalBusiness treats telephone/email as optional, so omitting (empty)
// keeps JSON-LD valid without emitting fake contact points. Revisit when
// contact.ts carries verified phone/email (FND-SEO-06).

export const businessData = {
  name: business.publicBrand,
  description: "Premium chauffeur-driven transportation services based in Belgrade, Serbia.",
  telephone: "",
  email: "",
  address: {
    street: "Antifašističke borbe 25",
    city: business.headquarters.city,
    postalCode: "11070",
    country: "RS",
  },
} as const;

export type BusinessData = typeof businessData;
