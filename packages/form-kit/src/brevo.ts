export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailDeliveryResult {
  ok: boolean;
  messageId?: string;
  retryable?: boolean;
  uncertain?: boolean;
}

export interface BrevoEmailInput {
  apiKey: string;
  sender: EmailAddress;
  to: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  text: string;
  html: string;
  tags?: string[];
  submissionId?: string;
  fetcher?: typeof fetch;
}

/** Sends once. An uncertain outcome must be reconciled by the caller, never blindly retried. */
export async function sendBrevoTransactionalEmail(input: BrevoEmailInput): Promise<EmailDeliveryResult> {
  if (!input.apiKey || !input.sender.email || input.to.length === 0 || input.to.some(recipient => !recipient.email)) {
    return { ok: false, retryable: false };
  }
  try {
    const response = await (input.fetcher ?? fetch)("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": input.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: input.sender,
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        textContent: input.text,
        htmlContent: input.html,
        tags: input.tags,
        ...(input.submissionId ? { headers: { "X-Submission-Id": input.submissionId } } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status !== 201) {
      return { ok: false, retryable: response.status === 429, uncertain: response.status >= 500 };
    }
    const body = (await response.json()) as { messageId?: string };
    return body.messageId ? { ok: true, messageId: body.messageId } : { ok: false, uncertain: true };
  } catch {
    return { ok: false, uncertain: true };
  }
}
