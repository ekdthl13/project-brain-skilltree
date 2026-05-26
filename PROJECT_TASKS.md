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

- [ ] Run `npm run check`.
- [ ] Confirm local git is clean or record pending docs-only edits.
- [ ] Confirm latest GitHub Actions run is green.

### Task 2.2: Safe Install Test Path

- [ ] Create a disposable install destination under `C:\tmp`.
- [ ] Run Codex adapter install with `--dry-run`.
- [ ] Run Codex adapter install into the disposable destination.
- [ ] Confirm unrelated existing files are preserved.
- [ ] Repeat for Antigravity adapter.

### Task 2.3: Real Destination Discovery

- [ ] Identify actual Codex skills directory.
- [ ] Identify actual Antigravity/Gemini skills directory.
- [ ] Confirm whether each directory already contains non-Project Brain skills.
- [ ] Do not install yet if the destination contains unmanaged content that has
  not been reviewed.

### Task 2.4: Real Destination Dry Run

- [ ] Run dry-run for Codex destination.
- [ ] Run dry-run for Antigravity destination.
- [ ] Record expected backup paths.
- [ ] Confirm install scope with user before real install.

### Task 2.5: Real Install

- [ ] Run actual adapter install for approved destinations.
- [ ] Verify backups exist where conflicts were found.
- [ ] Verify generated adapter files exist in destination.
- [ ] Run a minimal agent-discovery smoke test if available.

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

