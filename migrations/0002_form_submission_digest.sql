-- Apply after 0001. Existing rows have no digest and require manual reconciliation.
ALTER TABLE form_submissions ADD COLUMN payload_digest TEXT;
