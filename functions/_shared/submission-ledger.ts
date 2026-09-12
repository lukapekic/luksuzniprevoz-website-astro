import type { D1DatabaseLike, LedgerRecord, SubmissionLedger } from "./types.ts";

interface DatabaseRow {
  submission_id: string;
  reference: string;
  status: "processing" | "accepted" | "failed";
  brevo_message_id: string | null;
  updated_at: number;
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
          (submission_id, reference, form_kind, locale, status, attempt_count, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'processing', 1, ?, ?)`,
      ).bind(
        input.submissionId,
        input.reference,
        input.kind,
        input.locale,
        input.now,
        input.now,
      ).run();

      let row = await db.prepare(
        `SELECT submission_id, reference, status, brevo_message_id, updated_at
           FROM form_submissions WHERE submission_id = ?`,
      ).bind(input.submissionId).first<DatabaseRow>();
      if (!result.success || !row) throw new Error("submission-ledger-begin");
      let claimed = (result.meta?.changes ?? 0) > 0;

      const staleProcessing = row.status === "processing" && row.updated_at <= input.now - 2 * 60 * 1000;
      if (!claimed && (row.status === "failed" || staleProcessing)) {
        const retry = await db.prepare(
          `UPDATE form_submissions
              SET status = 'processing', attempt_count = attempt_count + 1,
                  last_error_code = NULL, updated_at = ?
            WHERE submission_id = ? AND (status = 'failed' OR (status = 'processing' AND updated_at <= ?))`,
        ).bind(input.now, input.submissionId, input.now - 2 * 60 * 1000).run();
        if (!retry.success) throw new Error("submission-ledger-retry");
        claimed = (retry.meta?.changes ?? 0) > 0;
        row = await db.prepare(
          `SELECT submission_id, reference, status, brevo_message_id, updated_at
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
