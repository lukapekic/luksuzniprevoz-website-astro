import type { BookingDraft, BookingPricingResult, BookingRequest } from "../../site/luksuzni-prevoz/src/data/booking.ts";
import type { ContactFormValues } from "../../site/luksuzni-prevoz/src/components/contact/contact-form-validation.ts";

export type FormKind = "contact" | "booking";
export type FormLocale = "sr" | "en" | "ru";
export type SubmissionStatus = "processing" | "accepted" | "failed";

export interface FormRequestEnvelope<T> {
  submissionId: string;
  locale: FormLocale;
  turnstileToken: string;
  payload: T;
}

export interface ContactSubmission {
  kind: "contact";
  locale: FormLocale;
  values: ContactFormValues;
}

export interface BookingSubmission {
  kind: "booking";
  locale: FormLocale;
  draft: BookingDraft;
  request: BookingRequest;
  pricing: BookingPricingResult;
}

export type ValidatedSubmission = ContactSubmission | BookingSubmission;

export type FormResponseBody =
  | { ok: true; status: "pending"; reference: string }
  | { ok: false; code: "bad_request" }
  | { ok: false; code: "validation"; fields: Record<string, string> }
  | { ok: false; code: "bot_verification" }
  | { ok: false; code: "rate_limited"; retryAfterSeconds?: number }
  | { ok: false; code: "service_unavailable" }
  | { ok: false; code: "server_error" };

export interface FormEnvironment {
  FORM_DB?: D1DatabaseLike;
  FORM_ENVIRONMENT?: "production" | "preview" | "local";
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_ALLOWED_HOSTS?: string;
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  BREVO_TO_EMAIL?: string;
}

export interface D1ResultLike {
  success: boolean;
  meta?: { changes?: number };
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1ResultLike>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface PagesContextLike {
  request: Request;
  env: FormEnvironment;
}

export interface LedgerRecord {
  submissionId: string;
  reference: string;
  status: SubmissionStatus;
  brevoMessageId: string | null;
  updatedAt: number;
}

export interface SubmissionLedger {
  begin(input: {
    submissionId: string;
    reference: string;
    kind: FormKind;
    locale: FormLocale;
    now: number;
  }): Promise<{ created: boolean; record: LedgerRecord }>;
  accepted(submissionId: string, messageId: string, now: number): Promise<void>;
  failed(submissionId: string, code: string, now: number): Promise<void>;
}

export interface EmailDeliveryResult {
  ok: boolean;
  messageId?: string;
  retryable?: boolean;
}
