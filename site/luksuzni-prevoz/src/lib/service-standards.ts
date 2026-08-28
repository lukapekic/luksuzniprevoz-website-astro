import type { LocaleCode, UiStringKey } from "@astro-foundation/core";
import { operations } from "../data/operations.ts";
import { t } from "./i18n.ts";

export interface ServiceStandardGroup {
  icon?: "chauffeur" | "vehicle" | "care" | "comfort";
  marker?: string;
  title: string;
  items: string[];
}

export interface ServiceStandardOptions {
  profile?: "default" | "private-chauffeur";
}

export function buildServiceStandardGroups(
  locale: LocaleCode,
  options: ServiceStandardOptions = {},
): ServiceStandardGroup[] {
  const ui = (key: UiStringKey) => t(key, locale);
  const years = ui("operations.chauffeur.minimumLicenseYears").replace(
    "{years}",
    String(operations.chauffeurs.minimumLicenseYears),
  );

  if (options.profile === "private-chauffeur") {
    const requiredFacts = [
      operations.chauffeurs.englishSpeakingStandard,
      operations.vehicles.requestedConfirmedModelGuaranteed,
      operations.service.luggageAssistance,
      operations.service.passengerInsurance,
      operations.service.bottledWater,
      operations.service.climateControl,
      operations.service.wifi,
      operations.service.chargers,
      operations.service.childSeatOnRequest,
    ];
    if (requiredFacts.some((enabled) => enabled !== true)) {
      throw new Error(
        "Private Chauffeur service standards require confirmed canonical operations facts.",
      );
    }

    return [
      {
        marker: "01",
        title: ui("serviceStandards.group.chauffeur"),
        items: [
          ui("operations.chauffeur.professionalDress"),
          ui("operations.chauffeur.englishSpeaking"),
          years,
        ],
      },
      {
        marker: "02",
        title: ui("serviceStandards.group.vehicle"),
        items: [
          ui("operations.vehicle.cleanliness"),
          ui("operations.vehicle.maintenance"),
          ui("operations.vehicle.confirmedModel"),
        ],
      },
      {
        marker: "03",
        title: ui("serviceStandards.group.care"),
        items: [
          ui("operations.service.luggageAssistance"),
          ui("operations.service.passengerInsurance"),
          ui("operations.service.childSeatOnRequest"),
        ],
      },
      {
        marker: "04",
        title: ui("serviceStandards.group.comfort"),
        items: [
          ui("operations.service.bottledWater"),
          ui("operations.service.chargers"),
          `${ui("operations.service.wifi")} · ${ui("operations.service.climateControl")}`,
        ],
      },
    ];
  }

  return [
    {
      icon: "chauffeur",
      title: ui("serviceStandards.group.chauffeur"),
      items: [
        ui("operations.chauffeur.professionalDress"),
        ui("operations.chauffeur.englishSpeaking"),
        years,
      ],
    },
    {
      icon: "vehicle",
      title: ui("serviceStandards.group.vehicle"),
      items: [
        ui("operations.vehicle.cleanliness"),
        ui("operations.vehicle.maintenance"),
        ui("operations.vehicle.preTripInspection"),
      ],
    },
    {
      icon: "care",
      title: ui("serviceStandards.group.care"),
      items: [
        ui("operations.service.doorOpening"),
        ui("operations.service.luggageAssistance"),
        ui("operations.service.passengerInsurance"),
      ],
    },
    {
      icon: "comfort",
      title: ui("serviceStandards.group.comfort"),
      items: [
        ui("operations.service.climateControl"),
        ui("operations.service.bottledWater"),
        `${ui("operations.service.wifi")} · ${ui("operations.service.chargers")}`,
      ],
    },
  ];
}
