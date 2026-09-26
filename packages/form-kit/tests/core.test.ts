import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { combineHourMinute, formatDisplayDate, parseDisplayDate, isValidPhoneNumber } from "@astro-foundation/form-kit";
import { verifyTurnstile } from "@astro-foundation/form-kit/turnstile/server";
import { sendBrevoTransactionalEmail, type BrevoEmailInput } from "@astro-foundation/form-kit/brevo";

const email: BrevoEmailInput = {
  apiKey: "test-key", sender: { email: "office@example.com", name: "Example" },
  to: [{ email: "team@example.com" }], replyTo: { email: "visitor@example.org" },
  subject: "Question", text: "Plain text", html: "<p>Escaped by the caller</p>",
  submissionId: "example-id", tags: ["contact", "preview"],
};

describe("portable form helpers", () => {
  it("validates international and Serbian phones without a site dependency", () => {
    for (const phone of ["", "060-123-4567", "+381 60 123 4567", "00381 (60) 123-4567", "011/234-5678"]) assert.equal(isValidPhoneNumber(phone), true);
    for (const phone of ["06", "+000 1234567", "060-letter", "+381 1234567890123456"]) assert.equal(isValidPhoneNumber(phone), false);
  });
  it("round-trips real calendar dates and rejects invalid 24-hour values", () => {
    assert.equal(parseDisplayDate("29/02/2028"), "2028-02-29");
    assert.equal(formatDisplayDate("2028-02-29"), "29/02/2028");
    assert.equal(parseDisplayDate("29/02/2027"), null);
    assert.equal(parseDisplayDate("31/04/2028"), null);
    assert.equal(combineHourMinute("23", "59"), "23:59");
    assert.equal(combineHourMinute("24", "00"), "");
    assert.equal(combineHourMinute("12", "60"), "");
  });
  it("checks both the hostname and arbitrary application Turnstile action", async () => {
    for (const [hostname, action, expected] of [
      ["forms.example.com", "newsletter", true], ["other.example.com", "newsletter", false], ["forms.example.com", "other", false],
    ] as const) {
      assert.equal(await verifyTurnstile({
        token: "token", secret: "test-secret", expectedAction: "newsletter", allowedHosts: ["forms.example.com"],
        fetcher: async () => new Response(JSON.stringify({ success: true, hostname, action })),
      }), expected);
    }
    assert.equal(await verifyTurnstile({ token: "", secret: "test-secret", expectedAction: "newsletter", allowedHosts: ["forms.example.com"], fetcher: async () => { throw new Error("must not fetch"); } }), false);
  });
  it("passes caller-rendered email and correlation details to Brevo", async () => {
    const result = await sendBrevoTransactionalEmail({ ...email, fetcher: async (url, init) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email");
      const body = JSON.parse(String(init?.body));
      assert.deepEqual(body.sender, email.sender);
      assert.deepEqual(body.replyTo, email.replyTo);
      assert.equal(body.htmlContent, email.html);
      assert.equal(body.textContent, email.text);
      assert.deepEqual(body.headers, { "X-Submission-Id": "example-id" });
      return new Response(JSON.stringify({ messageId: "provider-id" }), { status: 201 });
    } });
    assert.deepEqual(result, { ok: true, messageId: "provider-id" });
  });
  it("distinguishes a safe rejection from an uncertain delivery outcome", async () => {
    for (const [status, expected] of [
      [400, { ok: false, retryable: false, uncertain: false }],
      [429, { ok: false, retryable: true, uncertain: false }],
      [500, { ok: false, retryable: false, uncertain: true }],
    ] as const) {
      assert.deepEqual(await sendBrevoTransactionalEmail({ ...email, fetcher: async () => new Response("{}", { status }) }), expected);
    }
    assert.deepEqual(await sendBrevoTransactionalEmail({ ...email, fetcher: async () => { throw new Error("network interruption"); } }), { ok: false, uncertain: true });
    assert.deepEqual(await sendBrevoTransactionalEmail({ ...email, fetcher: async () => new Response("{}", { status: 201 }) }), { ok: false, uncertain: true });
  });
  it("rejects missing configuration before making a provider request", async () => {
    assert.deepEqual(await sendBrevoTransactionalEmail({ ...email, apiKey: "", fetcher: async () => { throw new Error("must not fetch"); } }), { ok: false, retryable: false });
  });
});
