import {
  validateContactField,
  validateContactForm,
  type ContactFormErrorCode,
  type ContactFormField,
  type ContactFormValues,
  type ContactValidationSchema,
} from "./contact-form-validation.ts";

export interface ContactFieldState {
  touched: boolean;
  dirty: boolean;
  error: ContactFormErrorCode | null;
}

export type ContactFormState = Record<ContactFormField, ContactFieldState>;

export interface ContactFormController {
  getState: () => ContactFormState;
  validateField: (field: ContactFormField) => ContactFormErrorCode | null;
  validateAll: () => ReturnType<typeof validateContactForm>;
  destroy: () => void;
}

const fields: readonly ContactFormField[] = ["fullName", "email", "phone", "message"];

function isContactFormField(value: string): value is ContactFormField {
  return fields.includes(value as ContactFormField);
}

function getControl(
  form: HTMLFormElement,
  field: ContactFormField,
): HTMLInputElement | HTMLTextAreaElement {
  const control = form.elements.namedItem(field);
  if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
    throw new Error(`Missing contact-form control: ${field}`);
  }
  return control;
}

function readValues(form: HTMLFormElement): ContactFormValues {
  return {
    fullName: getControl(form, "fullName").value,
    email: getControl(form, "email").value,
    phone: getControl(form, "phone").value,
    message: getControl(form, "message").value,
  };
}

function getMessages(form: HTMLFormElement): Record<ContactFormErrorCode, string> {
  const messages: Record<ContactFormErrorCode, string | undefined> = {
    required: form.dataset.errorRequired,
    fullNameFormat: form.dataset.errorFullNameFormat,
    emailFormat: form.dataset.errorEmailFormat,
    phoneFormat: form.dataset.errorPhoneFormat,
    messageLength: form.dataset.errorMessageLength,
  };

  for (const [code, message] of Object.entries(messages)) {
    if (!message) throw new Error(`Missing contact-form error copy: ${code}`);
  }

  return messages as Record<ContactFormErrorCode, string>;
}

function cloneState(state: ContactFormState): ContactFormState {
  return Object.fromEntries(
    fields.map((field) => [field, { ...state[field] }]),
  ) as unknown as ContactFormState;
}

export function createContactFormController(
  form: HTMLFormElement,
  schema?: ContactValidationSchema,
): ContactFormController {
  const messages = getMessages(form);
  const initialValues = readValues(form);
  const state = Object.fromEntries(
    fields.map((field) => [field, { touched: false, dirty: false, error: null }]),
  ) as ContactFormState;

  const renderFieldError = (field: ContactFormField, error: ContactFormErrorCode | null): void => {
    const control = getControl(form, field);
    const errorId = `${control.id}-error`;
    const hintId = `${control.id}-hint`;
    const errorTarget = form.querySelector<HTMLElement>(`#${CSS.escape(errorId)}`);
    if (!errorTarget) throw new Error(`Missing contact-form error target: ${errorId}`);
    const hintTarget = form.querySelector<HTMLElement>(`#${CSS.escape(hintId)}`);

    const describedBy = new Set(
      (control.getAttribute("aria-describedby") ?? "").split(/\s+/u).filter(Boolean),
    );

    if (error) {
      const message = messages[error];
      errorTarget.textContent = message;
      errorTarget.hidden = false;
      if (hintTarget) hintTarget.hidden = true;
      describedBy.add(errorId);
      describedBy.delete(hintId);
      control.setAttribute("aria-invalid", "true");
      control.setCustomValidity(message);
    } else {
      errorTarget.textContent = "";
      errorTarget.hidden = true;
      if (hintTarget) hintTarget.hidden = false;
      describedBy.delete(errorId);
      if (hintTarget) describedBy.add(hintId);
      control.removeAttribute("aria-invalid");
      control.setCustomValidity("");
    }

    if (describedBy.size > 0) {
      control.setAttribute("aria-describedby", [...describedBy].join(" "));
    } else {
      control.removeAttribute("aria-describedby");
    }
  };

  const validateField = (field: ContactFormField): ContactFormErrorCode | null => {
    const error = validateContactField(field, readValues(form), schema);
    state[field].error = error;
    renderFieldError(field, error);
    return error;
  };

  const onInput = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (!isContactFormField(target.name)) return;

    state[target.name].dirty = target.value !== initialValues[target.name];
    if (state[target.name].touched) validateField(target.name);
  };

  const onBlur = (event: FocusEvent): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (!isContactFormField(target.name)) return;

    state[target.name].touched = true;
    validateField(target.name);
  };

  const validateAll = (): ReturnType<typeof validateContactForm> => {
    const result = validateContactForm(readValues(form), schema);
    for (const field of fields) {
      const error = result.errors[field] ?? null;
      state[field].touched = true;
      state[field].error = error;
      renderFieldError(field, error);
    }
    return result;
  };

  form.addEventListener("input", onInput);
  form.addEventListener("blur", onBlur, true);

  return {
    getState: () => cloneState(state),
    validateField,
    validateAll,
    destroy: () => {
      form.removeEventListener("input", onInput);
      form.removeEventListener("blur", onBlur, true);
    },
  };
}

const mountedForms = new WeakMap<HTMLFormElement, ContactFormController>();

export function mountContactForms(root: ParentNode = document): void {
  for (const form of Array.from(
    root.querySelectorAll<HTMLFormElement>("[data-contact-question-form]"),
  )) {
    if (mountedForms.has(form)) continue;
    mountedForms.set(form, createContactFormController(form));
    form.dataset.validationReady = "true";
  }
}
