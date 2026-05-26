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
├── ORCHESTRATION.md
├── SKILL_INDEX.md
└── <original skill folder>/SKILL.md
```

Use this adapter when installing into Antigravity/Gemini-style environments.

## Codex Adapter

The Codex adapter uses portable package names:

```text
adapters/codex/skills/project-manager/SKILL.md
```

Root system docs such as `CORE_PRINCIPLES.md` and `ORCHESTRATION.md` are copied
into the adapter root and listed in the generated `SKILL_INDEX.md`.

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

## Structural Integrity and Slug Stability

To maintain continuity across environments:

1. **Slug Stability**:
   - The `adapterName` (e.g., `project-manager`) mapped in `catalog/skills.yaml` serves as the portable directory slug.
   - Do not change existing adapter names unless there is a breaking framework conflict, as modifying slugs breaks local tool scripts, automated discovery, and user settings.
2. **Directory Nesting Constraints**:
   - Portable adapters (Codex, Claude Code) are built with flat directory names mapped directly to their slugs under `skills/`.
   - Structural directory splitting on the source side (e.g., `source/core/` and `source/plugins/`) must not leak into the portable adapter output directories unless the target agent runtime discovery is explicitly verified to support recursive nested skill scanning.

