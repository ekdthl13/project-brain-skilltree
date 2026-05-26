# Project Tasks

## Current Position

Project Brain Skilltree is in **Phase 2-B: Antigravity Cutover Preparation**.

Approximate overall progress: **42%**.

The public canonical repository exists, adapters build from `source/`, CI is
green, and the Codex adapter has been installed locally. The remaining Phase 2
work is to decide and execute the Antigravity/Gemini cutover safely, then move
into runtime usage verification.

## Installed State

| Environment | Status | Notes |
|-------------|--------|-------|
| Codex | Installed | Generated adapter entries are installed under `%USERPROFILE%\.codex\skills`; `.system` was preserved |
| Antigravity/Gemini | Pending cutover | Destination was backed up and dry-run reviewed; 14 existing managed entries conflict |
| Claude Code | Not installed | Adapter generation exists, but local install has not been requested |

## Phase Map

| Phase | Status | PRD/Roadmap Link | Goal |
|-------|--------|------------------|------|
| 0. Local audit and stabilization | Done | PRD background | Identify drift, version mismatch, packaging conflicts, and oversized skills |
| 1. GitHub canonical repo | Done | P0 / v0.1 | Create public repo with `source/`, adapters, catalog, docs, validation, and CI |
| 2-A. Local install loop proof | Done | P1 / v0.2 | Prove installer dry-run, backup, and preservation behavior in test and Codex paths |
| 2-B. Antigravity cutover | Active | P1 / v0.2 | Apply the generated Antigravity adapter only after backup, comparison, and rollback are clear |
| 3. Runtime usage verification | Next | Success metrics | Confirm Antigravity/Codex actually discover and use generated adapters |
| 4. Pressure scenario automation | Pending | P2 / v0.2 | Turn documented failure scenarios into executable checks |
| 5. Public polish and examples | Pending | P2 / v0.3 | Add examples, screenshots, clearer comparisons, and onboarding docs |
| 6. Release system | Pending | P3 / v0.3-v1.0 | Tag releases, write changelog, package artifacts, and publish checksums |
| 7. Advanced quality system | Pending | v0.3-v1.0 | Add scorecards, forward-testing, drift reports, and skill creation CLI support |

## PRD Coverage Board

| Requirement | Status | Evidence / Next Move |
|-------------|--------|----------------------|
| P0: Canonical public repo | Done | Public repo, `main`, `source/`, CI validate |
| P0: Adapter generation | Done | Antigravity, Codex, and Claude Code adapters build from catalog/source |
| P0: Quality gate | Done | `npm run check` builds, tests, validates, audits |
| P1: Safe local install | Partial | Installer works; Codex installed; Antigravity cutover still pending |
| P1: Session continuity | Partial | PRD and task docs exist; task doc now carries full roadmap queues |
| P2: Automated pressure testing | Pending | `tests/scenarios/` exists as docs; executable tests still needed |
| P2: Public presentation | Pending | Core docs exist; examples, screenshots, and before/after are missing |
| P3: Release system | Pending | No release tag, changelog, checksums, or packaged artifacts yet |

## Completed Work

### Phase 0: Local Audit and Stabilization

- Confirmed the original local skilltree had a strong document-first operating
  model.
- Identified source-of-truth drift as the biggest architectural risk.
- Resolved prior local issues before repo import:
  - Instagram packaging conflict
  - mirror drift
  - oversized manager/blog engine split
  - stale backup contamination

### Phase 1: GitHub Canonical Repo

- Created public repo: `https://github.com/ekdthl13/project-brain-skilltree`
- Imported 12 source skills.
- Added `catalog/skills.yaml`.
- Added generated adapters:
  - `adapters/antigravity/skills`
  - `adapters/codex/skills`
  - `adapters/claude-code/skills`
- Added tools:
  - `tools/build-adapters.js`
  - `tools/validate-skilltree.js`
  - `tools/audit-skilltree.js`
  - `tools/install-adapter.js`
- Added tests:
  - `tools/install-adapter.test.js`
  - `tests/scenarios/*.md`
- Added public docs:
  - `README.md`
  - `PRD.md`
  - `PROJECT_TASKS.md`
  - `SECURITY.md`
  - `CONTRIBUTING.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ADAPTER_CONTRACT.md`
  - `docs/QUALITY_GATE.md`
  - `docs/INSTALL.md`
  - `docs/COMPARISON.md`
  - `docs/ROADMAP.md`
- Verified:
  - local `npm run check` passes
  - GitHub Actions `validate` passes

### Phase 2-A: Local Install Loop Proof

- Ran `npm run check` before install work.
- Created a disposable install destination under `C:\tmp`.
- Dry-ran and installed Codex adapter into the disposable destination.
- Dry-ran and installed Antigravity adapter into the disposable destination.
- Confirmed unrelated existing files were preserved.
- Identified the real Codex skills directory.
- Identified the real Antigravity/Gemini skills directory.
- Dry-ran the real Codex destination.
- Dry-ran the real Antigravity destination.
- Installed the Codex adapter into the approved Codex destination.
- Verified generated Codex adapter files exist in the destination.
- Smoke-tested installed Codex adapter files by reading `project-manager`,
  `inspector`, and `coding-guide` with UTF-8 Korean content.
- Created and verified an out-of-place Antigravity backup before real
  Antigravity install.
- Confirmed GitHub Actions `validate` stayed green after recording the install
  loop.

## Active Queue

### Task 2-B.1: Antigravity Cutover Decision

- [ ] Re-read `docs/INSTALL.md` and `tools/install-adapter.js`.
- [ ] Re-run Antigravity destination dry-run.
- [ ] List the 14 conflicting managed entries.
- [ ] Confirm the out-of-place backup still exists.
- [ ] Compare current Antigravity destination against
  `adapters/antigravity/skills`.
- [ ] Decide whether to install now, defer, or create a separate staging path.

### Task 2-B.2: Antigravity Real Install

- [ ] Run `npm run check` immediately before install.
- [ ] Install Antigravity adapter only after explicit approval.
- [ ] Verify conflicting entries were moved into installer backup.
- [ ] Verify destination-only files were preserved.
- [ ] Verify generated adapter entries exist in the Antigravity destination.
- [ ] Record exact backup path with `%USERPROFILE%` placeholder, not private
  local user paths.

### Task 2-B.3: Antigravity Rollback Readiness

- [ ] Document how to restore from the out-of-place backup.
- [ ] Document how to restore from installer-created conflict backup.
- [ ] Confirm rollback instructions avoid destructive commands by default.
- [ ] Keep backup deletion out of scope until runtime verification succeeds.

## Upcoming Queues

### Phase 3: Runtime Usage Verification

- [ ] Start a fresh Codex session and confirm `project-manager` can trigger.
- [ ] Confirm Codex can read Korean source-derived skill content without
  encoding issues.
- [ ] Start or refresh Antigravity/Gemini and confirm `총괄매니저` can trigger
  after cutover.
- [ ] Verify `암행어사`, `코딩가이드`, and `출시점검` routing behavior in a real
  project context.
- [ ] Record any adapter wording mismatch discovered during live use.
- [ ] Update `docs/INSTALL.md` with verified local install notes if needed.

### Phase 4: Pressure Scenario Automation

- [ ] Inventory `tests/scenarios/*.md`.
- [ ] Define executable scenario test format.
- [ ] Add tests for "do not edit generated adapters directly".
- [ ] Add tests for "do not claim completion without validation".
- [ ] Add tests for "do not write private local user paths into public docs".
- [ ] Add tests for adapter-specific wording boundaries.
- [ ] Include pressure scenario tests in `npm run check`.

### Phase 5: Public Polish and Examples

- [ ] Add a minimal example project bootstrap.
- [ ] Add before/after showing local folder drift versus GitHub canonical root.
- [ ] Add example install transcript using placeholders.
- [ ] Add comparison examples against Superpowers-style and generic prompt
  collections.
- [ ] Add screenshots or GIFs only after the local flow is stable.
- [ ] Make README onboarding clear for a visitor who has not seen this chat.

### Phase 6: Release System

- [ ] Create `CHANGELOG.md`.
- [ ] Define versioning rules for source skills, adapter contract, and tool
  scripts.
- [ ] Prepare `v0.1.0` release checklist.
- [ ] Package adapter artifacts.
- [ ] Generate checksums for release artifacts.
- [ ] Tag and publish a GitHub Release after CI passes.

### Phase 7: Advanced Quality System

- [ ] Add adapter drift report command.
- [ ] Add skill quality scorecard.
- [ ] Add subagent forward-testing harness.
- [ ] Add manifest stability checks for future schema changes.
- [ ] Explore a new-skill creation CLI that updates source, catalog, and router
  files together.

## Operating Rules For Future Sessions

- Edit `source/` only for skill content changes.
- Do not hand-edit generated adapter files.
- Run `npm run build:adapters` after source or catalog edits.
- Run `npm run check` before claiming completion.
- Treat install operations as potentially destructive until dry-run and backup
  behavior are verified.
- Record local paths with placeholders such as `%USERPROFILE%`; do not write
  private local user paths into public docs.
- Keep this file focused on current state and next actions. Move long evidence
  or audit output to a dedicated report when it grows too large.

## Definition Of Done

### Phase 2

- Test-path installs work for Codex and Antigravity adapters.
- Codex real install is complete and verified.
- Antigravity real install is complete only after explicit approval.
- Existing unrelated skills are preserved.
- Backup and rollback paths are recorded.
- A future session can install from the GitHub repo without reading this chat.

### Project v0.2

- Safe local install works for Codex and Antigravity.
- Adapter diff reports exist.
- Pressure scenario fixtures are executable or have an implementation plan.

### Project v0.3

- Public examples explain real project bootstraps.
- Release packaging and checksums exist.
- Forward-testing harness has an initial implementation.

### Project v1.0

- Skill manifest schema is stable.
- Adapter contract is stable.
- Full CI quality gate is required for release tags.

## Next Session Prompt

Use this prompt to continue cleanly:

```text
C:\tmp\project-brain-skilltree 에서 계속 작업하자.
GitHub repo는 https://github.com/ekdthl13/project-brain-skilltree 이고,
source/ 가 canonical root, adapters/ 는 생성물이다.

현재 상태:
- Codex adapter는 실제 Codex skills 경로에 설치되어 있다.
- Antigravity/Gemini adapter는 dry-run과 out-of-place backup까지 끝났고,
  실제 cutover는 아직 보류 중이다.
- PROJECT_TASKS.md는 PRD 전체 로드맵 기준으로 재정렬되어 있다.

다음 작업:
1. PRD.md, PROJECT_TASKS.md, docs/INSTALL.md를 읽고 현재 위치를 복원
2. npm run check
3. Antigravity cutover dry-run 재확인
4. 충돌/백업/롤백 계획을 다시 확인
5. 승인되면 Antigravity adapter 실제 설치
```

## Execution Log

### 2026-05-26: Phase 2-A Local Install Loop Proof

- Restored current state from `README.md`, `PRD.md`, `PROJECT_TASKS.md`, and
  `docs/INSTALL.md`.
- Confirmed the starting branch state was clean: `main...origin/main`.
- Ran `npm run check`; adapter build, 5 installer tests, validation, and audit
  all completed successfully.
- After adding local install notes, `npm run check` intentionally caught private
  user paths in this task log; the log now uses `%USERPROFILE%` placeholders.
- Created disposable install root:
  `C:\tmp\project-brain-install-test-phase2-20260526`.
- Dry-ran and installed the Codex adapter into the disposable destination.
- Dry-ran and installed the Antigravity adapter into the disposable destination.
- Confirmed each disposable destination contained 15 generated adapter entries
  plus one unrelated sentinel skill after install.
- Confirmed unrelated sentinel skills were preserved and no backup folders were
  created when there were no conflicting managed entries.
- Discovered real Codex destination:
  `%USERPROFILE%\.codex\skills`.
  - Existing destination-only item before install: `.system`.
  - Conflicting adapter entries before install: none.
- Discovered real Antigravity/Gemini destination:
  `%USERPROFILE%\.gemini\config\skills`.
  - Destination-only item before install: `_skilltree_audit_2026-05-26.md`.
  - Conflicting adapter entries before install: 14.
- Dry-ran the real Codex destination. The destination existed, so the dry-run
  printed a possible backup path, but there were no conflicting adapter entries.
- Installed the Codex adapter into `%USERPROFILE%\.codex\skills`.
- Verified the Codex destination now contains 15 generated adapter entries plus
  the existing `.system` directory.
- Verified no Codex backup folder was created because there were no conflicts.
- Smoke-tested installed Codex adapter files by reading `project-manager`,
  `inspector`, and `coding-guide` SKILL files with UTF-8 Korean content.
- Dry-ran the real Antigravity destination and recorded the possible backup
  path: `%USERPROFILE%\.gemini\config\skills.backup-20260526T050141`.
- Created an out-of-place Antigravity backup before any real Antigravity
  install:
  `C:\tmp\project-brain-install-backups\antigravity-skills-20260526T1402`.
- Verified the Antigravity backup matches the current destination by top-level
  item count, file count, and SHA-256 hashes.
- Held the real Antigravity install because the destination has 14 conflicting
  managed entries and should be reviewed as a larger cutover.
- Confirmed the pushed `validate` GitHub Actions workflow completed
  successfully for the Phase 2 log commit.

### 2026-05-26: Roadmap Task Document Upgrade

- Reframed this file from a Phase 2-only checklist into a PRD-wide operating
  queue.
- Split Phase 2 into completed install-loop proof and active Antigravity
  cutover work.
- Added PRD coverage, installed-state, active queue, upcoming queues, and
  milestone-specific definitions of done.
