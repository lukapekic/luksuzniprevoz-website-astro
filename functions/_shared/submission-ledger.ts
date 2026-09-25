import type { D1DatabaseLike, LedgerRecord, SubmissionLedger } from "./types.ts";

export class SubmissionIdentityError extends Error {}

interface DatabaseRow {
  submission_id: string;
  reference: string;
  status: "processing" | "accepted" | "failed";
  brevo_message_id: string | null;
  updated_at: number;
  form_kind: string;
  locale: string;
  payload_digest: string | null;
}

function mapRow(row: DatabaseRow): LedgerRecord {
  return {
    submissionId: row.submission_id,
    reference: row.reference,
    status: row.status,
    brevoMessageId: row.brevo_message_id,
    updatedAt: row.updated_at,
  };
}

export function createD1Ledger(db: D1DatabaseLike): SubmissionLedger {
  return {
    async begin(input) {
      const result = await db.prepare(
        `INSERT OR IGNORE INTO form_submissions
          (submission_id, reference, form_kind, locale, payload_digest, status, attempt_count, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'processing', 1, ?, ?)`,
      ).bind(
        input.submissionId,
        input.reference,
        input.kind,
        input.locale,
        input.payloadDigest,
        input.now,
        input.now,
      ).run();

      let row = await db.prepare(
        `SELECT submission_id, reference, status, brevo_message_id, updated_at, form_kind, locale, payload_digest
           FROM form_submissions WHERE submission_id = ?`,
      ).bind(input.submissionId).first<DatabaseRow>();
      if (!result.success || !row) throw new Error("submission-ledger-begin");
      if (row.form_kind !== input.kind || row.locale !== input.locale || row.payload_digest !== input.payloadDigest) {
        throw new SubmissionIdentityError("submission-id-content-mismatch");
      }
      let claimed = (result.meta?.changes ?? 0) > 0;

      if (!claimed && row.status === "failed") {
        const retry = await db.prepare(
          `UPDATE form_submissions
              SET status = 'processing', attempt_count = attempt_count + 1,
                  last_error_code = NULL, updated_at = ?
            WHERE submission_id = ? AND status = 'failed'`,
        ).bind(input.now, input.submissionId).run();
        if (!retry.success) throw new Error("submission-ledger-retry");
        claimed = (retry.meta?.changes ?? 0) > 0;
        row = await db.prepare(
          `SELECT submission_id, reference, status, brevo_message_id, updated_at, form_kind, locale, payload_digest
             FROM form_submissions WHERE submission_id = ?`,
        ).bind(input.submissionId).first<DatabaseRow>();
        if (!row) throw new Error("submission-ledger-retry-read");
      }

      return { created: claimed, record: mapRow(row) };
    },
    async accepted(submissionId, messageId, now) {
      const result = await db.prepare(
        `UPDATE form_submissions
            SET status = 'accepted', brevo_message_id = ?, last_error_code = NULL, updated_at = ?
          WHERE submission_id = ?`,
      ).bind(messageId, now, submissionId).run();
      if (!result.success) throw new Error("submission-ledger-accepted");
    },
    async failed(submissionId, code, now) {
      const result = await db.prepare(
        `UPDATE form_submissions
            SET status = 'failed', last_error_code = ?, updated_at = ?
          WHERE submission_id = ?`,
      ).bind(code, now, submissionId).run();
      if (!result.success) throw new Error("submission-ledger-failed");
    },
  };
}
