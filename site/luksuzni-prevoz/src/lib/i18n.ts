/**
 * i18n helpers for the production site.
 * Loads UI strings from the content/ui/*.json dictionary.
 * FND-ARCH-03: All user-visible strings come from UI dictionary.
 * FND-TYPE-02: `t()` is keyed by the generated `UiStringKey` union, so a
 * typo like `t("home.tite", locale)` is a compile error.
 */

import type { UiStringKey, LocaleCode } from "@astro-foundation/core";
import { localeCodes } from "../data/locales.ts";

const dictionaryModules = import.meta.glob<Record<string, string>>("../content/ui/*.json", {
  eager: true,
  import: "default",
});

const uiStrings = Object.fromEntries(
  localeCodes.map((locale) => {
    const dictionary = dictionaryModules[`../content/ui/${locale}.json`];
    if (!dictionary) throw new Error(`Missing UI dictionary for locale: ${locale}`);
    return [locale, dictionary];
  }),
) as Record<LocaleCode, Record<string, string>>;

/**
 * Get a UI string by key for a given locale.
 * Missing locale dictionaries or keys are configuration errors. Localized UI
 * never falls back to another language.
 */
export function t(key: UiStringKey, locale: LocaleCode): string {
  const dictionary = uiStrings[locale];
  if (!dictionary) throw new Error(`Missing UI dictionary for locale: ${locale}`);
  const value = dictionary[key];
  if (value === undefined) throw new Error(`Missing UI string "${key}" for locale "${locale}"`);
  return value;
}

/**
 * Get the full UI strings dictionary for a given locale.
 */
export function getUiStrings(locale: LocaleCode): Record<string, string> {
  const dictionary = uiStrings[locale];
  if (!dictionary) throw new Error(`Missing UI dictionary for locale: ${locale}`);
  return dictionary;
}
