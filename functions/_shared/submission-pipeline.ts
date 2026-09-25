import { sendBrevoEmail } from "./brevo.ts";
import { jsonResponse, readJsonBody, RequestBodyError, requestHostnameAllowed } from "./http.ts";
import { createD1Ledger, SubmissionIdentityError } from "./submission-ledger.ts";
import { verifyTurnstile } from "./turnstile.ts";
import type {
  FormEnvironment,
  FormKind,
  FormLocale,
  FormRequestEnvelope,
  PagesContextLike,
  ValidatedSubmission,
} from "./types.ts";
import { decodeEnvelope } from "./validation.ts";

const TURNSTILE_TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

type PayloadValidator = (
  payload: unknown,
  locale: FormLocale,
) => { ok: true; value: ValidatedSubmission } | { ok: false; fields: Record<string, string> };

function configuredHosts(env: FormEnvironment): string[] {
  return (env.TURNSTILE_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isConfigured(env: FormEnvironment): boolean {
  return Boolean(
    env.FORM_DB &&
    (env.FORM_ENVIRONMENT === "production" || env.FORM_ENVIRONMENT === "preview" || env.FORM_ENVIRONMENT === "local") &&
    env.FORM_IDEMPOTENCY_SECRET && env.FORM_IDEMPOTENCY_SECRET.length >= 32 &&
    env.TURNSTILE_SECRET_KEY &&
    env.TURNSTILE_ALLOWED_HOSTS &&
    env.BREVO_API_KEY &&
    env.BREVO_SENDER_EMAIL &&
    env.BREVO_SENDER_NAME &&
    env.BREVO_TO_EMAIL,
  );
}

async function payloadDigest(secret: string, submission: ValidatedSubmission): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const stableInput = submission.kind === "booking"
    ? { kind: submission.kind, locale: submission.locale, draft: submission.draft }
    : { kind: submission.kind, locale: submission.locale, values: submission.values };
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(JSON.stringify(stableInput)));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function referenceFor(submissionId: string, now = new Date()): string {
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `LP-${day}-${submissionId.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function clientIp(request: Request): string | undefined {
  return request.headers.get("cf-connecting-ip") ?? undefined;
}

export async function handleFormSubmission(
  context: PagesContextLike,
  options: {
    kind: FormKind;
    action: "contact_submit" | "booking_submit";
    maxBytes: number;
    validate: PayloadValidator;
    verify?: typeof verifyTurnstile;
    deliver?: typeof sendBrevoEmail;
  },
): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { allow: "POST", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
  }
  if (!isConfigured(env)) return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  if (env.FORM_ENVIRONMENT === "production" && TURNSTILE_TEST_SECRETS.has(env.TURNSTILE_SECRET_KEY!)) {
    return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  }
  if (!requestHostnameAllowed(request, env.TURNSTILE_ALLOWED_HOSTS!)) {
    return jsonResponse({ ok: false, code: "bad_request" }, 400);
  }

  let raw: unknown;
  try {
    raw = await readJsonBody(request, options.maxBytes);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return jsonResponse({ ok: false, code: "bad_request" }, error.status);
    }
    return jsonResponse({ ok: false, code: "bad_request" }, 400);
  }

  const decoded = decodeEnvelope(raw);
  if (!decoded.ok) return jsonResponse({ ok: false, code: "bad_request" }, 400);
  const envelope = decoded.value as FormRequestEnvelope<unknown>;
  const botVerified = await (options.verify ?? verifyTurnstile)({
    token: envelope.turnstileToken,
    secret: env.TURNSTILE_SECRET_KEY!,
    expectedAction: options.action,
    allowedHosts: configuredHosts(env),
    remoteIp: clientIp(request),
  });
  if (!botVerified) return jsonResponse({ ok: false, code: "bot_verification" }, 403);

  const validated = options.validate(envelope.payload, envelope.locale);
  if (!validated.ok) {
    return jsonResponse({ ok: false, code: "validation", fields: validated.fields }, 422);
  }

  const ledger = createD1Ledger(env.FORM_DB!);
  const now = Date.now();
  const proposedReference = referenceFor(envelope.submissionId, new Date(now));
  let claim;
  try {
    const digest = await payloadDigest(env.FORM_IDEMPOTENCY_SECRET!, validated.value);
    claim = await ledger.begin({
      submissionId: envelope.submissionId,
      reference: proposedReference,
      kind: options.kind,
      locale: envelope.locale,
      payloadDigest: digest,
      now,
    });
  } catch (error) {
    if (error instanceof SubmissionIdentityError) return jsonResponse({ ok: false, code: "bad_request" }, 409);
    return jsonResponse({ ok: false, code: "server_error" }, 500);
  }

  if (!claim.created) {
    if (claim.record.status === "accepted") {
      return jsonResponse({ ok: true, status: "pending", reference: claim.record.reference }, 202);
    }
    return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  }

  let delivery;
  try {
    delivery = await (options.deliver ?? sendBrevoEmail)({
      env,
      submission: validated.value,
      submissionId: envelope.submissionId,
      reference: claim.record.reference,
    });
  } catch {
    // An interrupted provider request may have been accepted; retain processing
    // for operational reconciliation rather than automatically sending again.
    return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  }
  if (!delivery.ok || !delivery.messageId) {
    if (!delivery.uncertain) {
      try {
        await ledger.failed(envelope.submissionId, delivery.retryable ? "brevo-retryable" : "brevo-rejected", Date.now());
      } catch {
        // A failed ledger update must not expose internal details.
      }
    }
    return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  }

  try {
    await ledger.accepted(envelope.submissionId, delivery.messageId, Date.now());
  } catch {
    // The message already left through Brevo. Return the stable reference so a
    // client retry cannot create a second message for this submission id.
  }
  return jsonResponse({ ok: true, status: "pending", reference: claim.record.reference }, 202);
}
