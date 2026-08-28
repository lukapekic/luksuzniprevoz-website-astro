export const CONTACT_FORM_LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { minDigits: 7, maxDigits: 15, max: 32 },
  message: { min: 10, max: 3000 },
} as const;

/**
 * Unicode-aware personal-name shape:
 * - at least two name parts;
 * - letters and combining marks across Serbian Latin/Cyrillic and other scripts;
 * - permits common apostrophes, periods, and hyphens inside a name part.
 *
 * This is deliberately a shape check, not an identity check. Server-side bot
 * controls remain mandatory once submission exists.
 */
export const FULL_NAME_PATTERN =
  /^(?=.{2,100}$)\p{L}[\p{L}\p{M}'’ʼ.-]*(?:[ \u00a0-]+\p{L}[\p{L}\p{M}'’ʼ.-]*)+$/u;

/** Practical mailbox/domain validation with explicit local and total limits. */
export const EMAIL_PATTERN =
  /^(?=.{3,254}$)(?=.{1,64}@)[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

/**
 * International-friendly phone shape. Accepts +country-code, 00-country-code,
 * or a local number beginning with 0, plus common visual separators.
 */
export const PHONE_PATTERN = /^(?:(?:\+|00)[1-9]|0)(?:[ \u00a0().-]*\d){6,14}$/;

export type ContactFormField = "fullName" | "email" | "phone" | "message";

export type ContactFormErrorCode =
  "required" | "fullNameFormat" | "emailFormat" | "phoneFormat" | "messageLength";

export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<ContactFormField, ContactFormErrorCode>>;

export type ContactFieldValidator = (
  value: string,
  values: Readonly<ContactFormValues>,
) => ContactFormErrorCode | null;

export type ContactValidationSchema = Record<ContactFormField, readonly ContactFieldValidator[]>;

const required: ContactFieldValidator = (value) => (value.length === 0 ? "required" : null);

const fullNameFormat: ContactFieldValidator = (value) =>
  value.length > 0 && !FULL_NAME_PATTERN.test(value) ? "fullNameFormat" : null;

const emailFormat: ContactFieldValidator = (value) =>
  value.length > 0 && !EMAIL_PATTERN.test(value) ? "emailFormat" : null;

const phoneFormat: ContactFieldValidator = (value) => {
  if (value.length === 0) return null;

  const dialValue = value.startsWith("00") ? value.slice(2) : value;
  const digitCount = dialValue.replace(/\D/gu, "").length;
  return PHONE_PATTERN.test(value) &&
    digitCount >= CONTACT_FORM_LIMITS.phone.minDigits &&
    digitCount <= CONTACT_FORM_LIMITS.phone.maxDigits
    ? null
    : "phoneFormat";
};

const messageLength: ContactFieldValidator = (value) =>
  value.length > 0 &&
  (value.length < CONTACT_FORM_LIMITS.message.min || value.length > CONTACT_FORM_LIMITS.message.max)
    ? "messageLength"
    : null;

export const contactValidationSchema: ContactValidationSchema = {
  fullName: [required, fullNameFormat],
  email: [required, emailFormat],
  phone: [phoneFormat],
  message: [required, messageLength],
};

export function normalizeContactField(field: ContactFormField, value: string): string {
  const normalized = value.normalize("NFKC");
  if (field === "message") return normalized.trim();
  return normalized.trim().replace(/\s+/gu, " ");
}

export function normalizeContactValues(values: Readonly<ContactFormValues>): ContactFormValues {
  return {
    fullName: normalizeContactField("fullName", values.fullName),
    email: normalizeContactField("email", values.email),
    phone: normalizeContactField("phone", values.phone),
    message: normalizeContactField("message", values.message),
  };
}

/** Appends custom rules while preserving the baseline rules and their order. */
export function extendContactValidationSchema(
  custom: Partial<Record<ContactFormField, readonly ContactFieldValidator[]>>,
): ContactValidationSchema {
  return {
    fullName: [...contactValidationSchema.fullName, ...(custom.fullName ?? [])],
    email: [...contactValidationSchema.email, ...(custom.email ?? [])],
    phone: [...contactValidationSchema.phone, ...(custom.phone ?? [])],
    message: [...contactValidationSchema.message, ...(custom.message ?? [])],
  };
}

export function validateContactField(
  field: ContactFormField,
  values: Readonly<ContactFormValues>,
  schema: ContactValidationSchema = contactValidationSchema,
): ContactFormErrorCode | null {
  const normalized = normalizeContactValues(values);
  for (const validator of schema[field]) {
    const error = validator(normalized[field], normalized);
    if (error) return error;
  }
  return null;
}

export function validateContactForm(
  values: Readonly<ContactFormValues>,
  schema: ContactValidationSchema = contactValidationSchema,
): { values: ContactFormValues; errors: ContactFormErrors; isValid: boolean } {
  const normalized = normalizeContactValues(values);
  const errors: ContactFormErrors = {};

  for (const field of Object.keys(schema) as ContactFormField[]) {
    const error = validateContactField(field, normalized, schema);
    if (error) errors[field] = error;
  }

  return {
    values: normalized,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
