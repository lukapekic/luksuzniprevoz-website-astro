# Install the refreshed root docs

1. Replace the repository-root `docs/` directory with the `docs/` directory in this package.
2. This intentionally removes the retired files:
   - `docs/init-checklist.md`
   - `docs/optional-vrt.md`
   - `docs/spec-amendments.md`
3. Keep `docs/exceptions.md` and `docs/rule-traceability.md`; repository tooling consumes them.
4. Update the repository-root `README.md` if it still links to any of the three retired docs. Its docs table should point to the seven active files in `docs/README.md`.
5. After copying, run:

   ```bash
   pnpm traceability
   pnpm traceability --check
   pnpm parse-waivers
   ```

6. Then run the normal repository checks appropriate to the current branch, including `pnpm design:doctor` / `pnpm design:detect` when available.

`rule-traceability.md` included in this package was regenerated against the supplied repository snapshot with the refreshed docs. Re-running `pnpm traceability` in the final local repository remains canonical, especially after the separate reference-site/theme cleanup changes.
