# Architecture

Project Brain Skilltree has three layers.

## 1. Canonical Source

`source/` is the only hand-edited root. It contains:

- `CORE_PRINCIPLES.md`: governing rules
- `SKILL_INDEX.md`: router and system map
- skill folders with `SKILL.md` and optional support files

The source keeps the original Antigravity-style Korean operating model intact.

## 2. Catalog

`catalog/skills.yaml` is YAML-compatible JSON. It maps each source skill folder
to stable adapter names, versions, categories, and trigger descriptions.

The catalog is the bridge between human-friendly source names and portable
agent-facing names.

## 3. Generated Adapters

`tools/build-adapters.js` creates installable targets:

- Antigravity adapter preserves the original folder names and source structure.
- Codex adapter uses stable lowercase hyphen slugs and `name`/`description`
  frontmatter only.
- Claude Code adapter follows the same portable skill package shape as Codex.

Generated adapters are deleted and rebuilt on each run.

## Data Flow

```text
source/
  + catalog/skills.yaml
  -> tools/build-adapters.js
  -> adapters/{antigravity,codex,claude-code}/skills
  -> tools/validate-skilltree.js
  -> CI pass/fail
```

