# Project Tasks

## Current Position

Project Brain Skilltree is in **v0.5.0 First Success Demo Released** state.

Public baseline:
- GitHub repo: `https://github.com/ekdthl13/project-brain-skilltree`
- Latest public release: `v0.4.0`
- Release URL: `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.4.0`
- Release commit: see git tag `v0.4.0`
- Local baseline checks: `npm run check` PASS, `npm run test:forward` PASS on 2026-05-27

Current decision:
- Completed **v0.4.0 Operational Hardening** before v1.0.0 stable-contract freeze.
- v0.4.0 was a hardening and productization milestone, not a new-skill expansion milestone.
- Physical Core / Domain / Personal restructuring is not approved for v0.4.0; impact analysis is documented for a later post-v1.0 move.
- External surface verification on 2026-05-28 found no blocking v0.4.1 issue: remote `main`, tag dereference, `package.json`, README raw formatting, release assets, and latest `validate` check are correct.
- Next milestone is **v0.5.0 First Success Demo** before v1.0.0 stable-contract preparation, so the first external-user success path is proven before contracts are frozen.

## Source Of Truth Rules

- `source/` is the canonical root.
- `adapters/` are generated artifacts and must not be edited by hand.
- Run `npm run build:adapters` after source or catalog edits.
- Run `npm run check` before claiming completion.
- Run `npm run test:forward` for forward-testing fixture, runner, or behavioral scenario changes.
- Preserve the published `v0.3.0` and `v0.4.0` tags and GitHub Release assets as public baselines.
- Keep full worker prompts in `_order.md`; keep this file focused on state, decisions, queues, and short execution summaries.
- Long historical detail is archived in `docs/history/PROJECT_TASKS_ARCHIVE.md`.

## Installed State

| Environment | Status | Notes |
|-------------|--------|-------|
| Codex | Installed + verified | Generated adapter entries are installed under `%USERPROFILE%\.codex\skills`; `.system` was preserved; latest backup `%USERPROFILE%\.codex\skills.backup-20260527T015823` |
| Antigravity/Gemini | Installed + verified | Generated adapter entries are installed under `%USERPROFILE%\.gemini\config\skills`; latest backup `%USERPROFILE%\.gemini\config\skills.backup-20260527T015748` |
| Claude Code | Installed + verified | Generated adapter entries are installed under `%USERPROFILE%\.claude\skills`; 37 files hash-match generated adapter; zero missing/changed/extra; verified on 2026-05-27 |

## Phase Summary

| Phase | Status | Goal / Evidence |
|-------|--------|-----------------|
| 0. Local audit and stabilization | Done | Drift, version mismatch, packaging conflicts, and oversized skills identified and resolved |
| 1. GitHub canonical repo | Done | Public repo, `source/`, generated adapters, validation, and CI established |
| 2. Post-release verification | Done | Codex, Antigravity/Gemini, and Claude Code installs verified |
| 3. Skill content hardening | Done | Escalation protocol and orchestration docs merged through `source/` |
| 4. Structural refactor review | Done | Keep `암행어사` and `출시점검` separate; defer physical core/plugin split |
| 5. Pressure scenario automation | Done | Static guardrails and pressure checks included in `npm run check` |
| 6. Public polish and examples | Done | Minimal examples, comparison docs, install transcript, quickstarts |
| 7. Release system | Done through v0.4.0 | Tags, changelog, artifact zips, checksums, GitHub Releases |
| 8. Advanced quality system | Foundation done | Scorecards, schema stability guard, forward-testing harness, new-skill CLI |
| 9. Operational hardening | Released | External-user onboarding, install/release UX, behavioral fixtures, v1.0 freeze readiness |
| 10. First success demo | Done locally | Deterministic `npm run demo` path gives new users a successful local experience without installing into user agent directories |

Historical detail for completed phases is archived in [docs/history/PROJECT_TASKS_ARCHIVE.md](docs/history/PROJECT_TASKS_ARCHIVE.md).

## PRD Coverage Board

| Requirement | Status | Evidence / Next Move |
|-------------|--------|----------------------|
| P0: Canonical public repo | Done | Public repo, `main`, `source/`, CI validate |
| P0: Adapter generation | Done | Antigravity, Codex, and Claude Code adapters build from catalog/source |
| P0: Quality gate | Done | `npm run check` builds, tests, validates, audits |
| P1: Safe local install | Done | Installer works; Codex, Antigravity/Gemini, and Claude Code installs verified |
| P1: Session continuity | Active | PRD, roadmap, this file, `_order.md`, and archive policy carry current state |
| P2: Automated pressure testing | Strengthened | Static guardrails plus six deterministic JSON forward-tests in CI |
| P2: Public presentation | Hardened | README quickstart, terminology guidance, separation analysis, and v1 freeze checklist exist |
| P3: Release system | v0.4.0 published | Releases, adapter zips, checksums, and release policy exist |

## Active Queue

### Milestone v0.4.0 (Operational Hardening - Released)

- [x] Simplify the README top-level quickstart into a 3-minute external-user path.
- [x] Refresh `docs/INSTALL.md` and `docs/NEW_SKILL_CLI.md` examples against the v0.3.0 baseline.
- [x] Execute Worker Order #002: release policy alignment, forward-testing scenario expansion, Core / Domain / Personal impact analysis, bilingual terminology guidance, and v1.0 freeze checklist.
- [x] Prepare and publish v0.4.0 release after explicit PM/user approval.

### Milestone v0.5.0 (First Success Demo - Completed)

- [x] Create a safe `npm run demo` command that runs locally without writing to user skill directories.
- [x] Use a deterministic local sandbox fixture as the first-success proof path.
- [x] Show clear success output that teaches `source/` canonical discipline and the next useful commands.
- [x] Document the demo path in README or the appropriate quickstart/install docs.
- [x] Keep v0.5.0 focused on demo/onboarding proof; do not freeze v1.0 contracts in this milestone.

## External Review Triage

### Accepted Findings

- Public product positioning is still early: the repo is a strong personal/multi-agent operating system, not yet a polished third-party product.
- External onboarding still feels heavy for new users; README and quickstarts need a shorter first-run path.
- A first-time user still needs a concrete "I ran it and it worked" success moment; `npm run demo` should close that gap before v1.0 contract freeze.
- Korean source skill names and internal operating terms are powerful locally but need consistent English labels in public-facing docs.
- The next milestone should emphasize hardening, proof, and simplification instead of adding more skills.

### Partially Accepted Findings

- Core / Domain / Personal separation is directionally correct, but physical restructuring is deferred until adapter contracts, slug stability, installer behavior, and runtime discovery are revalidated.

### Outdated Findings

- `v0.1.0` and `v0.3.0` GitHub Releases are published.
- Release tags, checksums, and adapter artifacts exist.
- Claude Code local installation is verified.
- Codex and Antigravity/Gemini runtime verification is complete.
- Public quickstarts and GitHub metadata docs exist, and v0.4.0 simplified the first-run path.

## Definition Of Done

### Project v0.4.0 (Operational Hardening)

- The public README has a short, low-friction first-run path for external users.
- Install, new-skill, and release docs are aligned with the v0.3.0 tooling and test output.
- Forward-testing covers at least three additional operational failure scenarios.
- Core / Domain / Personal separation has an impact report and explicit no-go criteria for physical restructuring.
- Public terminology consistently pairs Korean skill identities with English role labels where useful.
- v1.0 stable-contract freeze criteria are drafted but not prematurely locked.

### Project v0.5.0 (First Success Demo)

- `npm run demo` exists and completes successfully on a fresh checkout with no user-directory install.
- The demo uses deterministic local fixtures or temporary output and cleans up or clearly scopes generated files.
- The demo output gives a newcomer a clear success signal and points to the next useful commands.
- README or quickstart docs mention the demo as the recommended first proof path.
- `npm run check` passes after the demo work.

### Project v1.0.0

- Skill manifest schema is stable.
- Adapter contract is stable.
- Full CI quality gate is required for release tags.
- Compatibility promises are documented and supported by v0.4.0 evidence.

## Current Worker Order

- Active order file: `_order.md`
- Current order: `#003` v0.5.0 First Success Demo (completed and PM accepted)
- Rule: keep full worker prompts out of this file. `PROJECT_TASKS.md` tracks state, decisions, queues, and execution summaries only.

## Archive Policy

- Keep `PROJECT_TASKS.md` as the live operating state board, ideally under 250 lines.
- Keep only the active milestone, current decision, current worker order pointer, and short recent execution summaries here.
- Move completed phase detail, old next-session prompts, and long execution logs to `docs/history/PROJECT_TASKS_ARCHIVE.md`.
- Keep public release history in `CHANGELOG.md` and generated verification evidence in `reports/`.
- When a new milestone starts, archive the previous milestone's detailed queue and leave a one-line summary here.

## Next Session Prompt

```text
C:\tmp\project-brain-skilltree 에서 계속 작업하자.
GitHub repo는 https://github.com/ekdthl13/project-brain-skilltree 이고,
source/ 가 canonical root, adapters/ 는 생성물이다.

현재 상태:
- v0.4.0 GitHub Release is published:
  https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.4.0
- Published assets:
  `project-brain-skilltree-v0.4.0-adapters.zip`,
  `project-brain-skilltree-v0.4.0-antigravity-skills.zip`,
  `project-brain-skilltree-v0.4.0-codex-skills.zip`,
  `project-brain-skilltree-v0.4.0-claude-code-skills.zip`,
  `release-artifact-checksums.txt`.
- v0.4.0 Operational Hardening is released.
- 2026-05-28 external surface verification found no blocking v0.4.1 issue.
- v0.5.0 First Success Demo is implemented locally and PM accepted; release is not yet published.
- Full worker prompts live in `_order.md`; PROJECT_TASKS.md is now a compact state board.
- Historical execution detail is archived in `docs/history/PROJECT_TASKS_ARCHIVE.md`.

Next work:
1. Prepare for v1.0.0 stable-contract freeze phase.
2. Keep physical Core / Domain / Personal restructuring out of scope until pre-v1 evaluations are locked.
3. Preserve the `v0.3.0`, `v0.4.0`, and `v0.5.0` tags and GitHub Release assets as public baselines.
```

## Recent Execution Summary

### 2026-05-28: Milestone v0.5.0 First Success Demo Released

- [x] Designed and implemented `tools/run-demo.js` as the local first-success demo.
- [x] Spawns a secure OS sandbox and validates build adapter, conflict backup, and user preservation scripts.
- [x] Created `tools/run-demo.test.js` to assert silent run execution, invalid paths, and package.json scripts configuration.
- [x] Registered `"demo": "node tools/run-demo.js"` inside `package.json` under scripts.
- [x] Updated `README.md` and `docs/INSTALL.md` onboarding documentations to highlight `npm run demo` as the recommended first proof path.
- [x] Re-ran full quality check suite (`npm run check`); all 52 tests, validation, and audit checks passed successfully.
- [x] Designed `tools/pack-release.js` packaging script using Node and PowerShell commands.
- [x] Bumped package version to `0.5.0` and appended changes in `CHANGELOG.md`.
- [x] Committed all changes, tagged release `v0.5.0`, and pushed commits/tags to remote GitHub repository.
- [x] Published official GitHub Release `v0.5.0` with 4 packaged adapter zips and standard checksum lists.
- [x] PM re-ran `npm run demo` standalone; demo completed successfully after avoiding parallel build races.
- [x] `npm run test:forward` was not re-run because no forward-testing fixtures, runner behavior, or behavioral scenarios changed.

### 2026-05-28: External Surface Verification and v0.5.0 Decision

- [x] Verified remote `main` at `6b2ef7f` and `v0.4.0^{}` dereferences to the same release commit.
- [x] Confirmed GitHub raw `main` and `v0.4.0` `package.json` both report version `0.4.0`.
- [x] Confirmed GitHub raw README preserves normal Markdown line breaks; the external raw-format concern was not reproduced.
- [x] Confirmed GitHub Release `v0.4.0` exposes 5 expected assets and latest `validate` on `main` succeeded.
- [x] Ran `npm run check`; 49 tests passed, validation and audit passed.
- [x] Selected v0.5.0 First Success Demo as the next milestone before v1.0.0 contract freeze.

### 2026-05-27: Worker Order #002 PM Review

- [x] Accepted release policy alignment, forward-testing runner extension, three new forward-testing scenarios, Core / Domain / Personal impact analysis, bilingual terminology guidance, and v1 freeze checklist.
- [x] PM hardening patch added missing expected signals for forbidden `git commit` and `git push` violations and documented `requiredWrites` in `docs/FORWARD_TESTING.md`.
- [x] Re-ran `npm run check`; 49 tests passed, validation and audit passed.
- [x] Re-ran `npm run test:forward`; all 6 scenarios passed.
- [x] Confirmed no `source/`, `catalog/`, or `adapters/` files were changed.

### 2026-05-27: Worker Order #001 PM Review

- [x] Accepted README quickstart simplification, `docs/INSTALL.md` v0.3.0 output alignment, and `docs/NEW_SKILL_CLI.md` post-create verification flow.
- [x] Confirmed `docs/ROADMAP.md` required no additional worker edits beyond the already-recorded v0.4.0 direction.
- [x] Re-ran `npm run check`; 49 tests passed, validation and audit passed.
- [x] Re-ran `npm run test:forward`; all 3 scenarios passed.
- [x] Confirmed no `source/`, `catalog/`, or `adapters/` files were changed.

### 2026-05-27: Worker Order #002 Created

- [x] Expanded the next order into a v0.4.0 productization proof batch.
- [x] Scope includes release policy alignment, forward-testing scenario expansion, Core / Domain / Personal impact analysis, bilingual terminology guidance, and v1.0 freeze checklist.
- [x] Scope still forbids physical `source/` restructuring, adapter edits, catalog schema changes, version bumps, tags, releases, and local installs.

### 2026-05-27: PM Cleanup - PROJECT_TASKS Diet and Archive Policy

- [x] Split full worker prompts out of `PROJECT_TASKS.md`; active worker order lives in `_order.md`.
- [x] Archived completed work detail, completed milestone queues, historical prompts, and long execution logs to `docs/history/PROJECT_TASKS_ARCHIVE.md`.
- [x] Added archive policy: `PROJECT_TASKS.md` remains the live state board, while long history moves to `docs/history/`.

### 2026-05-27: Post-v0.3.0 Direction Decision

- [x] Reviewed core project docs and accepted external GPT review as strategic input.
- [x] Chose **v0.4.0 Operational Hardening** before v1.0.0 stable contract preparation.
- [x] Created `_order.md` as the dedicated active worker order file.
