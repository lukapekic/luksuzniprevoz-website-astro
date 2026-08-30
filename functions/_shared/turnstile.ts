interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
}

export async function verifyTurnstile(input: {
  token: string;
  secret: string;
  expectedAction: string;
  allowedHosts: string[];
  remoteIp?: string;
  fetcher?: typeof fetch;
}): Promise<boolean> {
  if (!input.token || input.token.length > 2048 || !input.secret) return false;
  const body = new FormData();
  body.set("secret", input.secret);
  body.set("response", input.token);
  body.set("idempotency_key", crypto.randomUUID());
  if (input.remoteIp) body.set("remoteip", input.remoteIp);

  try {
    const response = await (input.fetcher ?? fetch)(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return false;
    const result = (await response.json()) as TurnstileResult;
    return result.success === true &&
      result.action === input.expectedAction &&
      typeof result.hostname === "string" &&
      input.allowedHosts.includes(result.hostname.toLowerCase());
  } catch {
    return false;
  }
}
