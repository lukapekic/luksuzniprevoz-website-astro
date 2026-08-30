import { sendBrevoEmail } from "./brevo.ts";
import { jsonResponse, readJsonBody, RequestBodyError, requestHostnameAllowed } from "./http.ts";
import { createD1Ledger } from "./submission-ledger.ts";
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

const TURNSTILE_ALWAYS_PASSES_TEST_SECRET = "1x0000000000000000000000000000000AA";

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
    env.FORM_ENVIRONMENT &&
    env.TURNSTILE_SECRET_KEY &&
    env.TURNSTILE_ALLOWED_HOSTS &&
    env.BREVO_API_KEY &&
    env.BREVO_SENDER_EMAIL &&
    env.BREVO_SENDER_NAME &&
    env.BREVO_TO_EMAIL,
  );
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
    return new Response(null, { status: 405, headers: { allow: "POST", "cache-control": "no-store" } });
  }
  if (!isConfigured(env)) return jsonResponse({ ok: false, code: "service_unavailable" }, 503);
  if (env.FORM_ENVIRONMENT === "production" && env.TURNSTILE_SECRET_KEY === TURNSTILE_ALWAYS_PASSES_TEST_SECRET) {
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
    claim = await ledger.begin({
      submissionId: envelope.submissionId,
      reference: proposedReference,
      kind: options.kind,
      locale: envelope.locale,
      now,
    });
  } catch {
    return jsonResponse({ ok: false, code: "server_error" }, 500);
  }

  if (!claim.created) {
    return jsonResponse({ ok: true, status: "pending", reference: claim.record.reference }, 202);
  }

  const delivery = await (options.deliver ?? sendBrevoEmail)({
    env,
    submission: validated.value,
    submissionId: envelope.submissionId,
    reference: claim.record.reference,
  });
  if (!delivery.ok || !delivery.messageId) {
    try {
      await ledger.failed(envelope.submissionId, delivery.retryable ? "brevo-retryable" : "brevo-rejected", Date.now());
    } catch {
      // Delivery failed and the ledger could not be updated; report a retryable
      // service failure without exposing internal details.
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
