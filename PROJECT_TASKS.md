# Project Tasks

## Current Position

Project Brain Skilltree is in **Phase 2: Local Install Loop Transition**.

Approximate overall progress: **40%**.

The public canonical repository exists and passes CI. The next goal is to prove
that the generated adapters can be safely installed and used locally without
destroying existing agent skill directories.

## Phase Map

| Phase | Status | Goal |
|-------|--------|------|
| 0. Local audit and stabilization | Done | Identify drift, version mismatch, packaging conflicts, and oversized skills |
| 1. GitHub canonical repo | Done | Create public repo with `source/`, adapters, catalog, docs, validation, and CI |
| 2. Local install loop | Current | Safely install generated adapters into test and real local paths |
| 3. Runtime usage verification | Pending | Confirm Antigravity/Codex actually discover and use the generated adapters |
| 4. Pressure scenario automation | Pending | Turn documented failure scenarios into executable checks |
| 5. Public polish and examples | Pending | Add examples, screenshots, clearer comparisons, and onboarding docs |
| 6. Release system | Pending | Tag releases, write changelog, package artifacts, and publish checksums |
| 7. Advanced quality system | Pending | Add scorecards, forward-testing, drift reports, and skill creation CLI support |

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

## Current Task Queue

### Task 2.1: Reconfirm Repo Health

- [x] Run `npm run check`.
- [x] Confirm local git is clean or record pending docs-only edits.
- [x] Confirm latest GitHub Actions run is green.

### Task 2.2: Safe Install Test Path

- [x] Create a disposable install destination under `C:\tmp`.
- [x] Run Codex adapter install with `--dry-run`.
- [x] Run Codex adapter install into the disposable destination.
- [x] Confirm unrelated existing files are preserved.
- [x] Repeat for Antigravity adapter.

### Task 2.3: Real Destination Discovery

- [x] Identify actual Codex skills directory.
- [x] Identify actual Antigravity/Gemini skills directory.
- [x] Confirm whether each directory already contains non-Project Brain skills.
- [x] Do not install yet if the destination contains unmanaged content that has
  not been reviewed.

### Task 2.4: Real Destination Dry Run

- [x] Run dry-run for Codex destination.
- [x] Run dry-run for Antigravity destination.
- [x] Record expected backup paths.
- [x] Confirm install scope with user before real install.

### Task 2.5: Real Install

- [x] Run actual adapter install for approved destinations.
- [x] Verify backup behavior for approved destinations.
- [x] Verify generated adapter files exist in approved destinations.
- [x] Run a minimal agent-discovery smoke test if available.

## Next Session Prompt

Use this prompt to continue cleanly:

```text
C:\tmp\project-brain-skilltree 에서 계속 작업하자.
GitHub repo는 https://github.com/ekdthl13/project-brain-skilltree 이고,
source/ 가 canonical root, adapters/ 는 생성물이다.

먼저 PRD.md와 PROJECT_TASKS.md를 읽고 현재 위치를 복원해줘.
그 다음:
1. npm run check
2. install-adapter dry-run 테스트 경로 검증
3. Codex/Antigravity 실제 설치 경로 점검
4. 실제 설치 전 백업/비교 계획 제시
```

## Operating Rules For Future Sessions

- Edit `source/` only for skill content changes.
- Do not hand-edit generated adapter files.
- Run `npm run build:adapters` after source or catalog edits.
- Run `npm run check` before claiming completion.
- Treat install operations as potentially destructive until dry-run and backup
  behavior are verified.
- Keep this file updated at phase boundaries.

## Definition Of Done For Phase 2

- Test-path installs work for Codex and Antigravity adapters.
- Real destination dry-runs are reviewed.
- Real installs are completed only after explicit approval.
- Existing unrelated skills are preserved.
- A future session can install from GitHub repo without reading this chat.

## Phase 2 Execution Log

### 2026-05-26: Local install loop transition

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
