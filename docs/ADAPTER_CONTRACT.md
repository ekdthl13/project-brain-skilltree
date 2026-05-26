# Adapter Contract

## Source Contract

Source skills may use Korean names, versions, richer frontmatter, and local
Project Brain conventions. Every source skill must have:

- `SKILL.md`
- frontmatter with `name`, `version`, and `description`
- a matching entry in `catalog/skills.yaml`
- a clear trigger and minimum output criteria
- no private local paths
- no broken relative links

## Antigravity Adapter

The Antigravity adapter preserves the current Project Brain operating shape:

```text
adapters/antigravity/skills/
├── CORE_PRINCIPLES.md
├── SKILL_INDEX.md
└── <original skill folder>/SKILL.md
```

Use this adapter when installing into Antigravity/Gemini-style environments.

## Codex Adapter

The Codex adapter uses portable package names:

```text
adapters/codex/skills/project-manager/SKILL.md
```

Each generated `SKILL.md` has frontmatter keys:

```yaml
---
name: project-manager
description: >
  Use when...
---
```

The original body is preserved after the generated frontmatter.

## Claude Code Adapter

Claude Code uses the same slugged package layout as Codex. Future versions may
add Claude-specific metadata, but the source remains unchanged.

## No Manual Adapter Edits

Adapter files are generated. Manual edits are treated as drift. Fix `source/`
or `catalog/skills.yaml`, then rebuild.

