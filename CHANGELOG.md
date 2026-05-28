# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-28

### Added
- **First Stable Release / Stable Contract Freeze**: Reached production-ready v1.0.0 status, locking API contracts for multi-agent skill distributions.
- **Stable Catalog Contract**: Fully standardized YAML-compatible JSON catalog file format verified by schema-stability unit testing.
- **Adapter Layout & Frontmatter Validation**: Hardened directory-slug rules and verified output shapes for Codex, Claude Code, and Antigravity.
- **Backup-Aware Installer Safety**: Fully verified relative/mixed-slash installer paths, auto-backups for conflicting skill documents, and 100% preservation of custom directories.
- **Sandboxed Execution Demo**: Complete `npm run demo` onboarding sandbox which validates builds programmatically.
- **Hardened Sandboxed Testing**: Dynamic OS-level `mkdtempSync` sandboxes and try-finally error-proof execution lifecycles.
- **Forward-Testing Automation**: Added assertions and pressure testing scenario checking for validation-skipping, path-leakage, and direct adapter edit attempts.
- **Rollback Documentation**: Formally added robust recovery and restoration copy-paste command blocks inside installation guides.
- **Release Asset Packaging**: Formulated Windows-only release compression tools generating portable zip files and checksum manifests.

## [0.5.0] - 2026-05-28

### Added
- Safe local success demo runner `npm run demo` to verify build and deploy compilation inside a secure sandbox.
- Focused unit test suite `tools/run-demo.test.js` checking demo runtime execution, sandbox safety limits, and package configurations.
- Onboarding installation references to the local success demo path inside `README.md` and `docs/INSTALL.md`.

## [0.4.0] - 2026-05-27

### Added
- Bilingual public terminology guidance in `docs/terminology.md`.
- Core / Domain / Personal separation impact analysis in `docs/separation_impact_analysis.md`.
- v1.0 stable-contract freeze checklist in `docs/v1_freeze_checklist.md`.
- Forward-testing scenarios for source-vs-adapter confusion, incomplete worker reporting, and validation-skipping pressure.
- `requiredWrites` assertions in the forward-testing runner to verify required file write behavior before blocked commands.

### Changed
- README onboarding is now a shorter clone-to-install path for external users.
- Install and new-skill CLI docs are aligned with the v0.3.0 tooling baseline and current validation output.
- Release docs now require both `npm run check` and `npm run test:forward` before release tags.
- `PROJECT_TASKS.md` is now a compact state board with historical detail archived under `docs/history/`.
- Roadmap and PRD now position v0.4.0 operational hardening before v1.0 stable-contract preparation.
- `package.json` version is now `0.4.0`.

### Fixed
- Forward-test fixtures now explicitly assert forbidden `git commit` and `git push` command violations where relevant.

## [0.3.0] - 2026-05-27

### Added
- Public onboarding quickstarts for PRD creation, project-manager bootstrap, and pre-release launch checks.
- GitHub repository metadata recommendations in `docs/GITHUB_METADATA.md`.
- Claude Code local installation verification notes and status tracking.
- Dynamic forward-testing MVP with sandbox isolation, deterministic agent step replay, and scenario assertion evaluation.
- `npm run test:forward` suite runner for all JSON forward-test fixtures.
- GitHub Actions `validate` gate that runs `npm run check` and then `npm run test:forward`.
- JSON pressure fixtures for direct adapter edits, missing validation claims, and private path leakage.
- New-skill creation CLI (`npm run new:skill`) that writes canonical source skills, updates `catalog/skills.yaml`, and adds a router/index mention.
- New-skill CLI documentation in `docs/NEW_SKILL_CLI.md`.

### Changed
- Roadmap, PRD, README, and task docs now reflect the completed v0.2.0 alignment work and v0.3.0 dynamic testing/creation CLI milestone.
- Forward-testing docs now describe the implemented suite entry point and recursion-safe CI wiring.
- `package.json` version is now `0.3.0`.

### Fixed
- Hardened the agent simulator so simulated file edits cannot escape the active temp sandbox through absolute paths or `..` traversal.
- Added timeout and nested-check guards around forward-test scenario validation commands.

## [0.1.0] - 2026-05-27

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
