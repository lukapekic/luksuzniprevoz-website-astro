import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleFormSubmission } from "../../../../functions/_shared/submission-pipeline.ts";
import { sendBrevoEmail } from "../../../../functions/_shared/brevo.ts";
import { renderSubmissionEmail } from "../../../../functions/_shared/email-rendering.ts";
import { verifyTurnstile } from "../../../../functions/_shared/turnstile.ts";
import { validateBookingPayload, validateContactPayload } from "../../../../functions/_shared/validation.ts";
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
  form_kind: string;
  locale: string;
  payload_digest: string;
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
        updated_at: Number(this.values[5]),
        form_kind: String(this.values[2]),
        locale: String(this.values[3]),
        payload_digest: String(this.values[4]),
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (this.query.includes("attempt_count = attempt_count + 1")) {
      const row = this.rows.get(String(this.values[1]));
      if (!row || row.status !== "failed") {
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
  phone: "+381 60 123 4567",
  message: "Please send additional service information.",
};

function environment(db: D1DatabaseLike = new MemoryD1()): FormEnvironment {
  return {
    FORM_DB: db,
    FORM_ENVIRONMENT: "preview",
    FORM_IDEMPOTENCY_SECRET: "test-only-key-with-at-least-32-characters",
    TURNSTILE_SECRET_KEY: "secret",
    TURNSTILE_ALLOWED_HOSTS: "preview.example.com",
    BREVO_API_KEY: "brevo",
    BREVO_SENDER_EMAIL: "office@example.com",
    BREVO_SENDER_NAME: "Luxury Transportation",
    BREVO_TO_EMAIL: "dispatch@example.com",
  };
}

function request(submissionId = "7bd7f3a8-16da-4cd4-8bf2-e5153b534d1e", values = payload): Request {
  return new Request("https://preview.example.com/api/forms/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://preview.example.com" },
    body: JSON.stringify({ submissionId, locale: "en", turnstileToken: "token", payload: values }),
  });
}

function bookingRequest(): Request {
  return new Request("https://preview.example.com/api/forms/booking", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://preview.example.com" },
    body: JSON.stringify({
      submissionId: "75c94e9c-824e-411f-8a8e-edb0b76c0bc1",
      locale: "en",
      turnstileToken: "token",
      payload: {
        intent: "booking",
        serviceKey: "airportTransportation",
        date: "2099-12-31",
        time: "12:00",
        pickup: "Belgrade Airport",
        destination: "Belgrade city",
        airportDirection: "airport-to-city",
        airportScope: "belgrade-city",
        passengerCount: 2,
        vehiclePreference: "recommend",
        fullName: "Jovana Petrović",
        email: "jovana@example.com",
      },
    }),
  });
}

describe("form runtime pipeline", () => {
  it("rejects GET before processing and preserves API security headers", async () => {
    const response = await handleFormSubmission({
      request: new Request("https://preview.example.com/api/forms/contact"),
      env: environment(),
    }, {
      kind: "contact", action: "contact_submit", maxBytes: 16 * 1024, validate: validateContactPayload,
    });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  });

  it("validates and accepts a booking request through the same pipeline", async () => {
    const db = new MemoryD1();
    let deliveries = 0;
    const response = await handleFormSubmission({ request: bookingRequest(), env: environment(db) }, {
      kind: "booking",
      action: "booking_submit",
      maxBytes: 64 * 1024,
      validate: validateBookingPayload,
      verify: async () => true,
      deliver: async () => { deliveries += 1; return { ok: true, messageId: "booking-brevo-1" }; },
    });
    assert.equal(response.status, 202);
    assert.equal(deliveries, 1);
    assert.equal([...db.rows.values()][0]?.status, "accepted");
  });

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

  it("does not claim receipt while the first delivery is still processing", async () => {
    const db = new MemoryD1();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const options = {
      kind: "contact" as const,
      action: "contact_submit" as const,
      maxBytes: 16 * 1024,
      validate: validateContactPayload,
      verify: async () => true,
      deliver: async () => { await gate; return { ok: true, messageId: "brevo-1" }; },
    };
    const first = handleFormSubmission({ request: request(), env: environment(db) }, options);
    await new Promise((resolve) => setTimeout(resolve, 20));
    const duplicate = await handleFormSubmission({ request: request(), env: environment(db) }, options);
    assert.equal(duplicate.status, 503);
    assert.deepEqual(await duplicate.json(), { ok: false, code: "service_unavailable" });
    release();
    assert.equal((await first).status, 202);
  });

  it("rejects a reused ID with changed content", async () => {
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
    await handleFormSubmission({ request: request(), env: environment(db) }, options);
    const changed = await handleFormSubmission({
      request: request(undefined, { ...payload, message: "A different valid question." }),
      env: environment(db),
    }, options);
    assert.equal(changed.status, 409);
    assert.equal(deliveries, 1);
  });

  it("holds an uncertain provider result for reconciliation instead of resending", async () => {
    const db = new MemoryD1();
    let deliveries = 0;
    const options = {
      kind: "contact" as const,
      action: "contact_submit" as const,
      maxBytes: 16 * 1024,
      validate: validateContactPayload,
      verify: async () => true,
      deliver: async () => { deliveries += 1; return { ok: false, uncertain: true }; },
    };
    const first = await handleFormSubmission({ request: request(), env: environment(db) }, options);
    const retry = await handleFormSubmission({ request: request(), env: environment(db) }, options);
    assert.equal(first.status, 503);
    assert.equal(retry.status, 503);
    assert.equal(deliveries, 1);
    assert.equal([...db.rows.values()][0]?.status, "processing");
  });

  it("fails closed without the idempotency key or its D1 migration", async () => {
    const env = environment();
    delete env.FORM_IDEMPOTENCY_SECRET;
    const missingKey = await handleFormSubmission(
      { request: request(), env },
      { kind: "contact", action: "contact_submit", maxBytes: 16 * 1024, validate: validateContactPayload },
    );
    assert.equal(missingKey.status, 503);
    const brokenDb = environment({ prepare: () => { throw new Error("missing payload_digest column"); } });
    const missingMigration = await handleFormSubmission(
      { request: request(), env: brokenDb },
      { kind: "contact", action: "contact_submit", maxBytes: 16 * 1024, validate: validateContactPayload, verify: async () => true },
    );
    assert.equal(missingMigration.status, 500);
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

  it("rejects production use of all Turnstile test secrets", async () => {
    for (const secret of [
      "1x0000000000000000000000000000000AA",
      "2x0000000000000000000000000000000AA",
      "3x0000000000000000000000000000000AA",
    ]) {
      const env = environment();
      env.FORM_ENVIRONMENT = "production";
      env.TURNSTILE_SECRET_KEY = secret;
      const response = await handleFormSubmission(
        { request: request(), env },
        { kind: "contact", action: "contact_submit", maxBytes: 16 * 1024, validate: validateContactPayload },
      );
      assert.equal(response.status, 503);
    }
  });
});

describe("provider adapters", () => {
  it("escapes user content in the branded email and preserves its plain-text alternative", () => {
    const message = 'First line\n<img src=x onerror="alert(1)"> & details';
    const rendered = renderSubmissionEmail({ kind: "contact", locale: "sr", values: { ...payload, message } }, "LP-TEST-EMAIL");
    assert.match(rendered.html, /Luksuzni prevoz/);
    assert.match(rendered.html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp; details/);
    assert.doesNotMatch(rendered.html, /<img|<script/);
    assert.match(rendered.html, /LP-TEST-EMAIL/);
    assert.ok(rendered.text.includes(message));
    assert.match(rendered.text, /Pending manual confirmation/);
    assert.deepEqual(rendered.replyTo, { email: payload.email, name: payload.fullName });
  });

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
    const wrongHost = await verifyTurnstile({
      token: "token",
      secret: "secret",
      expectedAction: "contact_submit",
      allowedHosts: ["preview.example.com"],
      fetcher: async () => new Response(JSON.stringify({
        success: true,
        action: "contact_submit",
        hostname: "other.example.com",
      }), { status: 200 }),
    });
    assert.equal(wrongHost, false);
  });

  it("sends normalized content through Brevo with Reply-To and a correlation header", async () => {
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
    assert.deepEqual(sent[0]?.headers, { "X-Submission-Id": "7bd7f3a8-16da-4cd4-8bf2-e5153b534d1e" });
    assert.match(String(sent[0]?.htmlContent), /Jovana Petrović/);
  });
});
