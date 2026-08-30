import {
  validateContactField,
  validateContactForm,
  type ContactFormErrorCode,
  type ContactFormField,
  type ContactFormValues,
  type ContactValidationSchema,
} from "./contact-form-validation.ts";
import { createTurnstileController } from "../../lib/forms/turnstile-client.ts";

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

interface FormApiResponse {
  ok: boolean;
  code?: "validation" | "bot_verification" | "rate_limited" | "service_unavailable" | "server_error";
  reference?: string;
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

function renderSummary(form: HTMLFormElement, messages: string[]): void {
  const summary = form.querySelector<HTMLElement>("[data-contact-error-summary]");
  const list = form.querySelector<HTMLElement>("[data-contact-error-summary-list]");
  if (!summary || !list) return;
  list.replaceChildren(...[...new Set(messages)].map((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    return item;
  }));
  summary.hidden = messages.length === 0;
  if (messages.length > 0) summary.focus();
}

function statusMessage(form: HTMLFormElement, key: string): string {
  return form.dataset[key] ?? "";
}

export function mountContactForms(root: ParentNode = document): void {
  for (const form of Array.from(
    root.querySelectorAll<HTMLFormElement>("[data-contact-question-form]"),
  )) {
    if (mountedForms.has(form)) continue;
    const controller = createContactFormController(form);
    mountedForms.set(form, controller);
    form.dataset.validationReady = "true";

    const status = form.querySelector<HTMLElement>("[role='status']");
    const submit = form.querySelector<HTMLButtonElement>("[data-contact-submit] button");
    const submitLabel = form.querySelector<HTMLElement>("[data-contact-submit-label]");
    const turnstileContainer = form.querySelector<HTMLElement>("[data-contact-turnstile]");
    const siteKey = form.dataset.turnstileSiteKey ?? "";
    if (!status || !submit || !submitLabel || !turnstileContainer || !siteKey) {
      if (status) status.textContent = statusMessage(form, "statusServiceUnavailable");
      if (submit) submit.disabled = true;
      continue;
    }

    const turnstile = createTurnstileController({
      container: turnstileContainer,
      siteKey,
      action: "contact_submit",
    });
    void turnstile.render().catch(() => {
      status.textContent = statusMessage(form, "statusServiceUnavailable");
      submit.disabled = true;
    });

    let submissionId: string | null = null;
    let completed = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (completed) return;
      renderSummary(form, []);
      const validation = controller.validateAll();
      if (!validation.isValid) {
        const messages = Object.values(validation.errors).map((code) => getMessages(form)[code]);
        renderSummary(form, messages);
        return;
      }
      const token = turnstile.getToken();
      if (!token) {
        status.textContent = statusMessage(form, "statusTurnstileRequired");
        return;
      }

      submissionId ??= crypto.randomUUID();
      submit.disabled = true;
      submitLabel.textContent = statusMessage(form, "statusSubmitting");
      status.textContent = statusMessage(form, "statusSubmitting");
      try {
        const response = await fetch(form.dataset.endpoint ?? "/api/forms/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            submissionId,
            locale: form.dataset.locale,
            turnstileToken: token,
            payload: validation.values,
          }),
        });
        const body = await response.json() as FormApiResponse;
        if (response.ok && body.ok && body.reference) {
          status.textContent = `${statusMessage(form, "statusSuccess")} ${statusMessage(form, "statusReference").replace("{reference}", body.reference)}`;
          completed = true;
          submissionId = null;
          return;
        }
        const statusKeys = {
          bot_verification: "statusBotVerification",
          rate_limited: "statusRateLimited",
          service_unavailable: "statusServiceUnavailable",
          server_error: "statusServerError",
          validation: "statusServerError",
        } as const;
        status.textContent = statusMessage(form, statusKeys[body.code ?? "server_error"]);
      } catch {
        status.textContent = statusMessage(form, "statusServerError");
      } finally {
        turnstile.reset();
        submit.disabled = completed;
        submitLabel.textContent = statusMessage(form, "submitAction");
      }
    });
  }
}
