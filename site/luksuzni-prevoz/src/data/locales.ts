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

/** Factual country name paired with each locale's flag (not a theme value). */
export const localeCountryNames: Record<LocaleCode, string> = {
  sr: "Srbija",
  en: "United Kingdom",
  ru: "Россия",
};
