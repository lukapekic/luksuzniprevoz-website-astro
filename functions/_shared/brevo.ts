import { sendBrevoTransactionalEmail } from "@astro-foundation/form-kit/brevo";
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

  return sendBrevoTransactionalEmail({
    apiKey: env.BREVO_API_KEY,
    sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME },
    to: recipients,
    replyTo: rendered.replyTo,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    tags: [rendered.tag, env.FORM_ENVIRONMENT ?? "unknown"],
    submissionId: input.submissionId,
    fetcher: input.fetcher,
  });
}
