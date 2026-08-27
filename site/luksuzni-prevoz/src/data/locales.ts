/**
 * Locale display metadata — FND-ARCH-03 / FND-I18N-10.
 *
 * Presentation components (e.g. LanguageSwitcher) must not duplicate locale
 * display literals. The language name, hreflang, and htmlLang already live in
 * `foundation.config.ts` (the single source of truth for locale identity), so
 * the switcher derives them from config. This module supplies the only locale
 * display facts that config does not carry — the country name paired with each
 * flag — as typed, factual metadata (the same pattern routes.ts / business.ts
 * use for structural site data: typed at authoring, not Zod-parsed).
 *
 * Serbian policy (P1.10): the Serbian product surface is Serbian Latin
 * (sr-Latn-RS). The public language label is therefore "Srpski" and is owned
 * by `foundation.config.ts` (`locales[].label`), not duplicated here.
 */
import type { LocaleCode } from "@astro-foundation/core";
import { config } from "../../foundation.config.ts";

export const localeCodes = config.locales.locales.map((locale) => locale.code as LocaleCode);

const configuredDefaultLocale = config.locales.locales.find((locale) => locale.isDefault);
if (!configuredDefaultLocale) {
  throw new Error("foundation.config.ts must declare exactly one default locale");
}

export const defaultLocale = configuredDefaultLocale.code as LocaleCode;
export const nonDefaultLocales = localeCodes.filter((locale) => locale !== defaultLocale);

export function getLocaleConfig(locale: LocaleCode) {
  const localeConfig = config.locales.locales.find((candidate) => candidate.code === locale);
  if (!localeConfig) throw new Error(`Locale not configured: ${locale}`);
  return localeConfig;
}

/** Factual country name paired with each locale's flag (not a theme value). */
export const localeCountryNames: Record<LocaleCode, string> = {
  sr: "Srbija",
  en: "United Kingdom",
  ru: "Россия",
};

for (const locale of localeCodes) {
  if (!localeCountryNames[locale]) {
    throw new Error(`Missing country display metadata for locale: ${locale}`);
  }
}
