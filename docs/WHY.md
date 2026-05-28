# Why Project Brain Skilltree Exists

Most AI prompt collections and custom skills are optimized for a single agent. That works at first, but it breaks down when the same developer or team uses Antigravity/Gemini, Codex, and Claude Code on the same work.

Project Brain Skilltree solves this by separating the **canonical source** from the **runtime adapter files**. Skills are treated like versioned, validated software packages instead of loose prompt copies.

---

## The Problems We Address

1. **Tool-specific skill drift**
   When you maintain separate copies of the same instruction, they slowly diverge. A fix made for Codex may be missing from Antigravity/Gemini, so the same workflow produces different results.

2. **Adapter and layout mismatch**
   Different AI tools expect different folder layouts, casing, names, or metadata shapes. Maintaining those mappings by hand is tedious and easy to get wrong.

3. **Accidental overwrites and silent loss**
   Direct folder copies can overwrite existing local skills. Without backup and restore tooling, users cannot clearly see what changed or roll back safely.

4. **Validation gaps**
   Prompt files are operational code. Private paths, broken local links, stale generated files, or missing quality gates can fail only after a user has already installed them.

---

## The Solution: A Compiled Skill Pipeline

Project Brain Skilltree uses a compiler-style pipeline for AI skills:

```text
source/                 catalog/skills.yaml        npm run check / CI        adapters/
(human-edited root)  ->  (stable contract)     ->   (proof gate)       ->   (generated output)
                                                                            |
                                                                            +-- Codex
                                                                            +-- Claude Code
                                                                            +-- Antigravity/Gemini
```

For a visual version of this pipeline, see [docs/assets/skilltree-overview.svg](assets/skilltree-overview.svg).

* **Canonical Source (`source/`)**: The only folder where humans edit skills.
* **Unified Catalog (`catalog/skills.yaml`)**: Tracks stable IDs, versions, and categories.
* **Quality Gate (`npm run check`)**: Runs adapter builds, drift detection, tests, validation, and audit checks before deployment.
* **Adapter Generation (`adapters/`)**: Machine-generated skill packages tailored for each tool.
* **Backup-aware Installer**: Backs up conflicting managed files and preserves unrelated user skills.

---

## Public Trust Signals

Before a user installs anything into a real agent folder, the project gives them four proof points:

* **Demo proof**: `npm run demo` builds and installs into a temporary sandbox, then deletes the sandbox.
* **Drift guard**: `npm run check` rebuilds generated adapters and fails if they no longer match `source/`.
* **Rollback path**: `tools/restore-adapter.js` previews and restores from installer-created backups.
* **CI matrix**: GitHub Actions validates the baseline on Ubuntu, Windows, and macOS.

---

## Who Is This For?

* **Multi-agent developers** who use different AI tools on the same projects and want them to share the same operating context.
* **Teams syncing agent context** through Git so new developers or new agent sessions can read stable project instructions.
* **Durable operators** who prefer file-based workspace memory, such as `_context.md` and `DECISION_LOG.md`, over chat-only memory.
