/** Shared shape check for optional phones; preserves the entered display format. */
export const PHONE_LIMITS = { minDigits: 7, maxDigits: 15, max: 32 } as const;
export const PHONE_PATTERN = /^(?:(?:\+|00)[1-9]|0)(?:[ \u00a0()./-]*\d){6,14}$/;

export function isValidPhoneNumber(value: string): boolean {
  const normalized = value.normalize("NFKC").trim();
  if (!normalized) return true;
  const dialValue = normalized.startsWith("00") ? normalized.slice(2) : normalized;
  const digits = dialValue.replace(/\D/gu, "").length;
  return normalized.length <= PHONE_LIMITS.max && PHONE_PATTERN.test(normalized) &&
    digits >= PHONE_LIMITS.minDigits && digits <= PHONE_LIMITS.maxDigits;
}
