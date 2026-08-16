/**
 * Intl formatters — FND-I18N-12.
 * Each factory returns a pre-configured Intl formatter for a given locale.
 */

/**
 * Creates a date formatter for the given locale.
 * Formats as "January 1, 2025" style (year, month long, day numeric).
 */
export function createDateFormatter(dateTimeLocale: string) {
  return new Intl.DateTimeFormat(dateTimeLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Creates a number formatter for the given locale.
 */
export function createNumberFormatter(numberLocale: string) {
  return new Intl.NumberFormat(numberLocale);
}

/**
 * Formats a number as currency.
 *
 * @param value - The numeric value to format
 * @param currency - ISO 4217 currency code (e.g. "EUR", "RSD")
 * @param numberLocale - BCP 47 locale for number formatting
 */
export function formatCurrency(value: number, currency: string, numberLocale: string): string {
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency,
  }).format(value);
}
