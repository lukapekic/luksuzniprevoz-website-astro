# Design Governance

This directory is machine-facing support for the human authorities already in the repository.

Authority remains:

1. locked page blueprint
2. `DESIGN.md`
3. active theme and generated semantic tokens
4. reviewed shared component contracts
5. wireframe geometry

`AGENTS.md` remains the technical/process authority.

## Files

- `config.json` — stable repository paths and discovery rules.
- `system.json` — generated snapshot of the active theme, token names, components, and document inventory. Do not hand-edit.
- `system.schema.json` — lightweight schema for `system.json`.
- `reviews/` — optional persistent design-review records.

Generate or refresh the snapshot with:

```bash
pnpm design:sync
```

Verify that it is current without writing:

```bash
pnpm design:sync:check
```

Do not place visual design decisions in `.design/config.json`. Visual truth belongs to the active theme, `DESIGN.md`, blueprints, and component contracts.
