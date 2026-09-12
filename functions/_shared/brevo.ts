import type { EmailDeliveryResult, FormEnvironment, ValidatedSubmission } from "./types.ts";
import { renderSubmissionEmail } from "./email-rendering.ts";

export async function sendBrevoEmail(input: {
  env: FormEnvironment;
  submission: ValidatedSubmission;
  submissionId: string;
  reference: string;
  fetcher?: typeof fetch;
}): Promise<EmailDeliveryResult> {
  const { env } = input;
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL || !env.BREVO_SENDER_NAME || !env.BREVO_TO_EMAIL) {
    return { ok: false, retryable: false };
  }
  const recipients = env.BREVO_TO_EMAIL.split(",").map((email) => email.trim()).filter(Boolean).map((email) => ({ email }));
  if (recipients.length === 0) return { ok: false, retryable: false };
  const rendered = renderSubmissionEmail(input.submission, input.reference);

  try {
    const response = await (input.fetcher ?? fetch)("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME },
        to: recipients,
        replyTo: rendered.replyTo,
        subject: rendered.subject,
        textContent: rendered.text,
        htmlContent: rendered.html,
        tags: [rendered.tag, env.FORM_ENVIRONMENT ?? "unknown"],
        headers: { "Idempotency-Key": input.submissionId },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status !== 201) {
      return { ok: false, retryable: response.status === 429 || response.status >= 500 };
    }
    const body = (await response.json()) as { messageId?: string };
    return body.messageId ? { ok: true, messageId: body.messageId } : { ok: false, retryable: true };
  } catch {
    return { ok: false, retryable: true };
  }
}
