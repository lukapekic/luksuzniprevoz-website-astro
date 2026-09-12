import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleFormSubmission } from "../../../../functions/_shared/submission-pipeline.ts";
import { sendBrevoEmail } from "../../../../functions/_shared/brevo.ts";
import { verifyTurnstile } from "../../../../functions/_shared/turnstile.ts";
import { validateContactPayload } from "../../../../functions/_shared/validation.ts";
import type {
  D1DatabaseLike,
  D1PreparedStatementLike,
  D1ResultLike,
  FormEnvironment,
} from "../../../../functions/_shared/types.ts";

interface Row {
  submission_id: string;
  reference: string;
  status: "processing" | "accepted" | "failed";
  brevo_message_id: string | null;
  attempt_count: number;
  updated_at: number;
}

class MemoryStatement implements D1PreparedStatementLike {
  private values: unknown[] = [];
  private query: string;
  private rows: Map<string, Row>;
  constructor(query: string, rows: Map<string, Row>) {
    this.query = query;
    this.rows = rows;
  }
  bind(...values: unknown[]): D1PreparedStatementLike { this.values = values; return this; }
  async first<T>(): Promise<T | null> {
    return (this.rows.get(String(this.values[0])) as T | undefined) ?? null;
  }
  async run(): Promise<D1ResultLike> {
    if (this.query.includes("INSERT OR IGNORE")) {
      const id = String(this.values[0]);
      if (this.rows.has(id)) return { success: true, meta: { changes: 0 } };
      this.rows.set(id, {
        submission_id: id,
        reference: String(this.values[1]),
        status: "processing",
        brevo_message_id: null,
        attempt_count: 1,
        updated_at: Number(this.values[4]),
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (this.query.includes("attempt_count = attempt_count + 1")) {
      const row = this.rows.get(String(this.values[1]));
      if (!row || (row.status !== "failed" && !(row.status === "processing" && row.updated_at <= Number(this.values[2])))) {
        return { success: true, meta: { changes: 0 } };
      }
      row.status = "processing";
      row.attempt_count += 1;
      row.updated_at = Number(this.values[0]);
      return { success: true, meta: { changes: 1 } };
    }
    if (this.query.includes("status = 'accepted'")) {
      const row = this.rows.get(String(this.values[2]));
      if (row) { row.status = "accepted"; row.brevo_message_id = String(this.values[0]); }
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }
    if (this.query.includes("status = 'failed'")) {
      const row = this.rows.get(String(this.values[2]));
      if (row) row.status = "failed";
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }
    throw new Error(`Unexpected query: ${this.query}`);
  }
}

class MemoryD1 implements D1DatabaseLike {
  readonly rows = new Map<string, Row>();
  prepare(query: string): D1PreparedStatementLike { return new MemoryStatement(query, this.rows); }
}

const payload = {
  fullName: "Jovana Petrović",
  email: "jovana@example.com",
  phone: "+381 60 111 9999",
  message: "Please send additional service information.",
};

function environment(db = new MemoryD1()): FormEnvironment {
  return {
    FORM_DB: db,
    FORM_ENVIRONMENT: "preview",
    TURNSTILE_SECRET_KEY: "secret",
    TURNSTILE_ALLOWED_HOSTS: "preview.example.com",
    BREVO_API_KEY: "brevo",
    BREVO_SENDER_EMAIL: "office@example.com",
    BREVO_SENDER_NAME: "Luxury Transportation",
    BREVO_TO_EMAIL: "dispatch@example.com",
  };
}

function request(submissionId = "7bd7f3a8-16da-4cd4-8bf2-e5153b534d1e"): Request {
  return new Request("https://preview.example.com/api/forms/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://preview.example.com" },
    body: JSON.stringify({ submissionId, locale: "en", turnstileToken: "token", payload }),
  });
}

describe("form runtime pipeline", () => {
  it("accepts a verified request once and reuses its stable reference", async () => {
    const db = new MemoryD1();
    let deliveries = 0;
    const options = {
      kind: "contact" as const,
      action: "contact_submit" as const,
      maxBytes: 16 * 1024,
      validate: validateContactPayload,
      verify: async () => true,
      deliver: async () => { deliveries += 1; return { ok: true, messageId: "brevo-1" }; },
    };
    const first = await handleFormSubmission({ request: request(), env: environment(db) }, options);
    const duplicate = await handleFormSubmission({ request: request(), env: environment(db) }, options);
    assert.equal(first.status, 202);
    assert.equal(duplicate.status, 202);
    assert.deepEqual(await first.json(), await duplicate.json());
    assert.equal(deliveries, 1);
    assert.equal([...db.rows.values()][0]?.status, "accepted");
  });

  it("rejects a mismatched origin before bot verification", async () => {
    const badRequest = request();
    const headers = new Headers(badRequest.headers);
    headers.set("origin", "https://attacker.example");
    const response = await handleFormSubmission(
      { request: new Request(badRequest, { headers }), env: environment() },
      {
        kind: "contact",
        action: "contact_submit",
        maxBytes: 16 * 1024,
        validate: validateContactPayload,
        verify: async () => { throw new Error("must not run"); },
      },
    );
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, code: "bad_request" });
  });

  it("rejects production use of the always-pass Turnstile test secret", async () => {
    const env = environment();
    env.FORM_ENVIRONMENT = "production";
    env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
    const response = await handleFormSubmission(
      { request: request(), env },
      { kind: "contact", action: "contact_submit", maxBytes: 16 * 1024, validate: validateContactPayload },
    );
    assert.equal(response.status, 503);
  });
});

describe("provider adapters", () => {
  it("checks Turnstile action and hostname", async () => {
    const accepted = await verifyTurnstile({
      token: "token",
      secret: "secret",
      expectedAction: "contact_submit",
      allowedHosts: ["preview.example.com"],
      fetcher: async () => new Response(JSON.stringify({
        success: true,
        action: "contact_submit",
        hostname: "preview.example.com",
      }), { status: 200 }),
    });
    const rejected = await verifyTurnstile({
      token: "token",
      secret: "secret",
      expectedAction: "booking_submit",
      allowedHosts: ["preview.example.com"],
      fetcher: async () => new Response(JSON.stringify({
        success: true,
        action: "contact_submit",
        hostname: "preview.example.com",
      }), { status: 200 }),
    });
    assert.equal(accepted, true);
    assert.equal(rejected, false);
  });

  it("sends normalized content through Brevo with Reply-To and idempotency", async () => {
    const sent: Record<string, unknown>[] = [];
    const result = await sendBrevoEmail({
      env: environment(),
      submission: { kind: "contact", locale: "en", values: payload },
      submissionId: "7bd7f3a8-16da-4cd4-8bf2-e5153b534d1e",
      reference: "LP-20260830-7BD7F3A8",
      fetcher: async (_url, init) => {
        sent.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
        return new Response(JSON.stringify({ messageId: "brevo-1" }), { status: 201 });
      },
    });
    assert.deepEqual(result, { ok: true, messageId: "brevo-1" });
    assert.deepEqual(sent[0]?.replyTo, { email: "jovana@example.com", name: "Jovana Petrović" });
    assert.deepEqual(sent[0]?.headers, { "Idempotency-Key": "7bd7f3a8-16da-4cd4-8bf2-e5153b534d1e" });
    assert.match(String(sent[0]?.htmlContent), /Jovana Petrović/);
  });
});
