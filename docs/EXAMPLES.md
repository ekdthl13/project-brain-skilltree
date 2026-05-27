# Examples & Concepts: Canonical Root vs Local Drift

This document illustrates the operational rationale behind Project Brain Skilltree's design, specifically focusing on the transition from ad-hoc local directories to a Git-driven canonical root.

## The Problem: Local Folder Drift

In typical agent setups, skills are stored directly in the local configuration directories of each specific agent tool:

```text
[Developer Machine A]                              [Developer Machine B]
~/.gemini/config/skills/ (Manual edits)           ~/.gemini/config/skills/ (Manual edits)
~/.codex/skills/ (Manual edits)                   ~/.codex/skills/ (Stale versions)
```

### Risk Scenario
1. **Broken References**: Developer A updates the `총괄매니저` (Project Manager) skill locally to v2.15.0, splitting helper files.
2. **Version Conflicts**: Developer B runs a different version of the same skill. When agent Codex acts on the workspace, it follows stale instructions, causing formatting conflicts and breaking local builds.
3. **Silent Loss**: The agent overwrites custom local edits during updates because there is no backup system or single source of truth.

---

## The Solution: Project Brain Skilltree Pipeline

Project Brain separates the **canonical source** from **runtime execution files**.

```text
                ┌──────────────────────────┐
                │ GitHub Canonical Root    │
                │ source/ (Korean/Rich FM) │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │ catalog/skills.yaml      │
                │ (Id/Slug translation)    │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │ tools/build-adapters.js  │
                └────────────┬─────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
      [Antigravity]       [Codex]       [Claude Code]
       (Original Names)   (hyphen slugs) (hyphen slugs)
```

### Before vs After Comparison

| Attribute | Before (Direct local edits) | After (Skilltree pipeline) |
|---|---|---|
| **Source of Truth** | Local folders (subject to silent deletion/overwrites) | Single git-managed `source/` folder |
| **Multi-Agent Alignment** | Manual copy-pasting; agents read conflicting prompts | Automatically compiled adapters tailored for each environment |
| **Validation Gate** | None; untested skills with private paths can crash agents | Executable quality gate (`npm run check`) checks links, sizes, and formats |
| **Local Backup** | Untracked changes are overwritten during updates | Installer backs up conflicting files and preserves unrelated custom skills |

---

## Operating Flow in Practice

1. **Edit Source**: Change instructions inside `source/코딩가이드/SKILL.md`.
2. **Compile**: Run `npm run build:adapters` to generate files in `adapters/`.
3. **Verify**: Run `npm run check` to ensure no broken links, oversized markdown files, or token leakage.
4. **Deploy**: Install with `node tools/install-adapter.js antigravity ~/.gemini/config/skills`.
