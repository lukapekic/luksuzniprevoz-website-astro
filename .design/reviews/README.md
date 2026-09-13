# Persistent Design Reviews

Use this directory only for accepted review state that future agents should know.

`index.json` is the machine-readable registry. Each accepted record names a
contract ID, 64-character source hash, reviewer, evidence path, and status.
The evidence must remain available. A missing, stale, or self-created record
does not approve a future UI change.

Recommended file names:

- `home.md`
- `private-chauffeur.md`
- `airport-transportation.md`
- `business-transportation.md`

Each review should contain only:

- reviewed commit/date;
- accepted decisions that must not be "fixed" later;
- unresolved P0/P1/P2 issues;
- intentional exceptions and their authority;
- follow-up verification required.

Do not copy full critique transcripts here. Keep these files short and durable.
