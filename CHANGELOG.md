# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-rc.1] - TBD

### Added
- Canonical public repository setup with `source/` as the single source of truth.
- Multi-agent adapter generation supporting Antigravity (`adapters/antigravity`), Codex (`adapters/codex`), and Claude Code (`adapters/claude-code`).
- Quality gate validation (`npm run check`) checking schemas, link integrity, file sizes, and private local paths.
- Safe installation utility (`tools/install-adapter.js`) with conflict backup creation, dry-run modes, and custom folder preservation.
- Adapter diff reports (`tools/diff-adapters.js`) to alert the pipeline of hand-edited adapter file drift.
- Escalation protocol inside `source/코딩가이드/SKILL.md` and multi-model orchestration guidelines inside `source/ORCHESTRATION.md`.
- Automated pressure scenarios (`tools/pressure-scenarios.test.js`) to statically prevent local path leakages and enforce generated adapter edit bans.
- Minimal example project bootstrap under `examples/minimal-project/` showcasing file-based memory and workflow orchestration files.
- Conceptual explanation of local folder drift vs git canonical synchronization in `docs/EXAMPLES.md`.
- Interactive install transcripts and dry-run outputs documented in `docs/INSTALL.md`.
