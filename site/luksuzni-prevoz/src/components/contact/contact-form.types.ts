import type { ContactFormErrorCode } from "./contact-form-validation.ts";

/**
 * Localized contact-form copy supplied by an approved content/UI source.
 * The component intentionally owns no fallback strings.
 */
export interface ContactFormCopy {
  fullNameLabel: string;
  fullNameHint?: string;
  emailLabel: string;
  emailHint?: string;
  phoneLabel: string;
  phoneHint?: string;
  messageLabel: string;
  messageHint?: string;
  unavailableAction: string;
  unavailableStatus: string;
  errors: Record<ContactFormErrorCode, string>;
}

/** Localized labels only; operational contact facts remain in data/contact.ts. */
export interface ContactDetailsCopy {
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  officeHoursLabel: string;
  everyDayLabel: string;
  officeNote: string;
}

export interface ContactPageCopy {
  details: ContactDetailsCopy;
  form: ContactFormCopy;
}
