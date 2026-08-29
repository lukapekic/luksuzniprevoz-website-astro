# Corporate Transportation v1 — Complete Handoff

This packet contains the locked page plan, multilingual production copy, UI merge fragments, and implementation/release contracts.

## Files

```text
blueprint.md
implementation.md
acceptance.md
wireframe.html
content-contract.md
asset-contract.md
agent-handoff.md

content/
  corporate-transportation.sr.md
  corporate-transportation.en.md
  corporate-transportation.ru.md

ui-additions/
  sr.json
  en.json
  ru.json
```

Recommended docs destination:

```text
site/luksuzni-prevoz/src/docs/services/corporate-transportation/
```

Content destination:

```text
site/luksuzni-prevoz/src/content/pages/corporate-transportation/
```

UI files are merge fragments, never replacement dictionaries.

The Serbian source digest is generator-owned. After installing the production
content, run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

Do not copy a packet digest into production by hand.

The content deliberately remains `in-review` + `noindex:true` until both locked shared images resolve and all acceptance gates pass.
