/**
 * i18n helpers for the reference site.
 * Loads UI strings from the content/ui/*.json dictionary.
 * FND-ARCH-03: All user-visible strings come from UI dictionary.
 * FND-TYPE-02: `t()` is keyed by the generated `UiStringKey` union, so a
 * typo like `t("home.tite", locale)` is a compile error.
 */

import srStrings from "../content/ui/sr.json";
import enStrings from "../content/ui/en.json";
import ruStrings from "../content/ui/ru.json";
import type { UiStringKey, LocaleCode } from "@astro-foundation/core";

const uiStrings: Record<string, Record<string, string>> = {
  sr: srStrings as unknown as Record<string, string>,
  en: enStrings as unknown as Record<string, string>,
  ru: ruStrings as unknown as Record<string, string>,
};

/**
 * Get a UI string by key for a given locale.
 * Falls back to the default locale (sr) if the key is missing.
 */
export function t(key: UiStringKey, locale: LocaleCode): string {
  return uiStrings[locale]?.[key] ?? uiStrings["sr"]?.[key] ?? key;
}

/**
 * Get the full UI strings dictionary for a given locale.
 */
export function getUiStrings(locale: LocaleCode): Record<string, string> {
  return uiStrings[locale] ?? uiStrings["sr"] ?? {};
}
