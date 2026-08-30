CREATE TABLE IF NOT EXISTS form_submissions (
  submission_id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  form_kind TEXT NOT NULL CHECK (form_kind IN ('contact', 'booking')),
  locale TEXT NOT NULL CHECK (locale IN ('sr', 'en', 'ru')),
  status TEXT NOT NULL CHECK (status IN ('processing', 'accepted', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  brevo_message_id TEXT,
  last_error_code TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS form_submissions_status_updated_idx
  ON form_submissions (status, updated_at);
