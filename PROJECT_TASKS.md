# Project Tasks

## Current Position

Project Brain Skilltree is in **Phase 2-C: Documentation/Tooling Alignment**.

Approximate overall progress: **48%**.

The public canonical repository exists, adapters build from `source/`, CI is
green, and the Codex and Antigravity adapters have both been installed locally.
The remaining Layer 1 work is to finish documentation/tooling alignment and add
the promised adapter diff report before deeper skill-content changes.

## Installed State

| Environment | Status | Notes |
|-------------|--------|-------|
| Codex | Installed | Generated adapter entries are installed under `%USERPROFILE%\.codex\skills`; `.system` was preserved |
| Antigravity/Gemini | Installed | Generated adapter entries are installed under `%USERPROFILE%\.gemini\config\skills`; installer conflict backup exists |
| Claude Code | Not installed | Adapter generation exists, but local install has not been requested |

## Workstream Ownership

| Layer | Owner | Scope | Rule |
|-------|-------|-------|------|
| Layer 1: Infrastructure | Codex | Antigravity cutover, docs alignment, adapter diff report | Finish before structural skill refactors |
| Layer 2: Skill content | Antigravity drafts, Codex validates/merges | Coding-guide escalation and multi-model orchestration docs | Merge through `source/`, then rebuild adapters and run `npm run check` |
| Structural refactors | Deferred | `암행어사`/`출시점검` boundary, core/plugin split | Decide only after Layer 1 and diff tooling are stable |

## Phase Map

| Phase | Status | PRD/Roadmap Link | Goal |
|-------|--------|------------------|------|
| 0. Local audit and stabilization | Done | PRD background | Identify drift, version mismatch, packaging conflicts, and oversized skills |
| 1. GitHub canonical repo | Done | P0 / v0.1 | Create public repo with `source/`, adapters, catalog, docs, validation, and CI |
| 2-A. Local install loop proof | Done | P1 / v0.2 | Prove installer dry-run, backup, and preservation behavior in test and Codex paths |
| 2-B. Antigravity cutover | Done | P1 / v0.2 | Apply the generated Antigravity adapter only after backup, comparison, and rollback are clear |
| 2-C. Documentation/tooling alignment | Active | P1/P2 / v0.2 | Sync status docs, clarify quality thresholds, add adapter diff report |
| 3-A. Skill content hardening | Parallel draft | P2 / v0.2 | Merge escalation protocol and multi-model orchestration docs after Layer 1 |
| 3-B. Runtime usage verification | Next after cutover | Success metrics | Confirm Antigravity/Codex actually discover and use generated adapters |
| 4. Structural refactor candidates | Deferred | P2/P3 | Re-evaluate `암행어사`/`출시점검` and core/plugin split after adapter stability |
| 5. Pressure scenario automation | Pending | P2 / v0.2 | Turn documented failure scenarios into executable checks |
| 6. Public polish and examples | Pending | P2 / v0.3 | Add examples, screenshots, clearer comparisons, and onboarding docs |
| 7. Release system | Pending | P3 / v0.3-v1.0 | Tag releases, write changelog, package artifacts, and publish checksums |
| 8. Advanced quality system | Pending | v0.3-v1.0 | Add scorecards, forward-testing harness, and skill creation CLI support |

## PRD Coverage Board

| Requirement | Status | Evidence / Next Move |
|-------------|--------|----------------------|
| P0: Canonical public repo | Done | Public repo, `main`, `source/`, CI validate |
| P0: Adapter generation | Done | Antigravity, Codex, and Claude Code adapters build from catalog/source |
| P0: Quality gate | Done | `npm run check` builds, tests, validates, audits |
| P1: Safe local install | Done | Installer works; Codex and Antigravity are installed; backups are recorded |
| P1: Session continuity | Done | PRD and task docs carry current phase, ownership, rollback, and next queues |
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

### Phase 2-B: Antigravity Cutover

- Re-read `docs/INSTALL.md` and `tools/install-adapter.js`.
- Re-ran `npm run check` before the real install.
- Re-ran Antigravity destination dry-run.
- Confirmed out-of-place backup exists:
  `C:\tmp\project-brain-install-backups\antigravity-skills-20260526T1402`.
- Listed 14 conflicting managed entries:
  `CORE_PRINCIPLES.md`, `HyperFrames`, `PRD생성`, `SKILL_INDEX.md`,
  `디자인시스템`, `블로그엔진`, `스킬생성기`, `암행어사`, `오피스아워`,
  `인스타엔진`, `총괄매니저`, `출시점검`, `코딩가이드`, `콘텐츠기획`.
- Compared current Antigravity destination against
  `adapters/antigravity/skills`; only generated changes were expected:
  `CANONICAL_ROOT.md` added, `SKILL_INDEX.md` changed, and
  `암행어사/SKILL.md` changed.
- Installed the Antigravity adapter into `%USERPROFILE%\.gemini\config\skills`.
- Installer-created conflict backup:
  `%USERPROFILE%\.gemini\config\skills.backup-20260526T070622`.
- Verified generated adapter files match the destination with zero hash diffs.
- Verified destination-only `_skilltree_audit_2026-05-26.md` was preserved.
- Smoke-tested installed Korean files by reading `SKILL_INDEX.md` and
  `암행어사/SKILL.md` with UTF-8.

## Active Queue

### Task 2-B.1: Antigravity Cutover Decision

- [x] Re-read `docs/INSTALL.md` and `tools/install-adapter.js`.
- [x] Re-run Antigravity destination dry-run.
- [x] List the 14 conflicting managed entries.
- [x] Confirm the out-of-place backup still exists.
- [x] Compare current Antigravity destination against
  `adapters/antigravity/skills`.
- [x] Decide whether to install now, defer, or create a separate staging path.

### Task 2-B.2: Antigravity Real Install

- [x] Run `npm run check` immediately before install.
- [x] Install Antigravity adapter only after explicit approval.
- [x] Verify conflicting entries were moved into installer backup.
- [x] Verify destination-only files were preserved.
- [x] Verify generated adapter entries exist in the Antigravity destination.
- [x] Record exact backup path with `%USERPROFILE%` placeholder, not private
  local user paths.

### Task 2-B.3: Antigravity Rollback Readiness

- [x] Document how to restore from the out-of-place backup.
- [x] Document how to restore from installer-created conflict backup.
- [x] Confirm rollback instructions avoid destructive commands by default.
- [x] Keep backup deletion out of scope until runtime verification succeeds.

### Task 2-C.1: Documentation Alignment

- [x] Update `PRD.md` current status to the latest verified commit and current
  phase.
- [x] Clarify the line-count rule: 400 lines is a split-review trigger; 500
  lines is the validation failure threshold unless the policy changes.
- [x] Resolve stale checkbox state in the historical Superpowers plan or mark
  it as a historical implementation plan.
- [x] Record the Layer 1 / Layer 2 workstream split in the task log.

### Task 2-C.2: Adapter Diff Report

- [x] Add a tool command that reports differences between generated adapters
  and their source-derived expected output.
- [x] Add package script documentation for the diff report.
- [x] Include the diff report in the relevant quality or roadmap docs.
- [x] Run `npm run check` after implementation.

## Upcoming Queues

### Phase 3-A: Skill Content Hardening

- [ ] Receive Antigravity draft for `코딩가이드` escalation protocol.
- [ ] Receive Antigravity draft for multi-model orchestration docs.
- [ ] Merge accepted drafts into `source/` only.
- [ ] Rebuild adapters after merge.
- [ ] Run `npm run check` before claiming completion.

### Phase 3-B: Runtime Usage Verification

- [ ] Start a fresh Codex session and confirm `project-manager` can trigger.
- [ ] Confirm Codex can read Korean source-derived skill content without
  encoding issues.
- [ ] Start or refresh Antigravity/Gemini and confirm `총괄매니저` can trigger
  after cutover.
- [ ] Verify `암행어사`, `코딩가이드`, and `출시점검` routing behavior in a real
  project context.
- [ ] Record any adapter wording mismatch discovered during live use.
- [ ] Update `docs/INSTALL.md` with verified local install notes if needed.

### Phase 4: Structural Refactor Candidates

- [ ] Re-evaluate whether `암행어사` and `출시점검` should be merged or only
  have clearer role boundaries.
- [ ] Re-evaluate whether `source/` should split into `core/` and plugin packs.
- [ ] Estimate catalog, adapter slug, router, installer, and docs impact before
  any structural change.
- [ ] Do not start this phase until adapter diff reporting and runtime
  verification are stable.

### Phase 5: Pressure Scenario Automation

- [ ] Inventory `tests/scenarios/*.md`.
- [ ] Define executable scenario test format.
- [ ] Add tests for "do not edit generated adapters directly".
- [ ] Add tests for "do not claim completion without validation".
- [ ] Add tests for "do not write private local user paths into public docs".
- [ ] Add tests for adapter-specific wording boundaries.
- [ ] Include pressure scenario tests in `npm run check`.

### Phase 6: Public Polish and Examples

- [ ] Add a minimal example project bootstrap.
- [ ] Add before/after showing local folder drift versus GitHub canonical root.
- [ ] Add example install transcript using placeholders.
- [ ] Add comparison examples against Superpowers-style and generic prompt
  collections.
- [ ] Add screenshots or GIFs only after the local flow is stable.
- [ ] Make README onboarding clear for a visitor who has not seen this chat.

### Phase 7: Release System

- [ ] Create `CHANGELOG.md`.
- [ ] Define versioning rules for source skills, adapter contract, and tool
  scripts.
- [ ] Prepare `v0.1.0` release checklist.
- [ ] Package adapter artifacts.
- [ ] Generate checksums for release artifacts.
- [ ] Tag and publish a GitHub Release after CI passes.

### Phase 8: Advanced Quality System

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
- Antigravity/Gemini adapter도 실제 Antigravity skills 경로에 설치되어 있다.
- Out-of-place backup과 installer conflict backup이 둘 다 보존되어 있다.
- PROJECT_TASKS.md는 Layer 1/Layer 2 운영 큐와 PRD 전체 로드맵 기준으로
  재정렬되어 있다.

다음 작업:
1. PRD.md, PROJECT_TASKS.md, docs/INSTALL.md를 읽고 현재 위치를 복원
2. npm run check
3. Phase 3-A 초안이 도착하면 source/ 기준으로 머지 여부 검토
4. 머지 후 npm run build:adapters && npm run check
5. Runtime usage verification으로 Codex/Antigravity 트리거 동작 확인
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

### 2026-05-26: Layer 1 Cutover and Alignment

- Confirmed the operating split:
  - Codex owns Layer 1: cutover, documentation alignment, adapter diff report.
  - Antigravity drafts Layer 2 skill-content changes.
  - Structural refactors stay deferred until adapter stability is proven.
- Completed the real Antigravity adapter install.
- Recorded rollback guidance in `docs/INSTALL.md`.
- Updated PRD status, task queues, roadmap wording, and quality-gate size
  thresholds.
- Added `tools/diff-adapters.js` and `npm run diff:adapters`.
- Ran `npm run check`; adapter build, adapter diff, installer tests,
  validation, and audit all passed.
