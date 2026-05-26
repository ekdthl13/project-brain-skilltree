# Project Tasks

## Current Position

Project Brain Skilltree is in **Phase 3-B: Runtime Usage Verification**.

Approximate overall progress: **55%**.

The public canonical repository exists, adapters build from `source/`, CI is
green, and the Codex and Antigravity adapters have both been installed locally.
Layer 1 cutover/documentation/tooling work is complete, and Phase 3-A skill
content hardening drafts have been merged through `source/` and adapter
generation.

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
| 2-C. Documentation/tooling alignment | Done | P1/P2 / v0.2 | Sync status docs, clarify quality thresholds, add adapter diff report |
| 3-A. Skill content hardening | Done | P2 / v0.2 | Merge escalation protocol and multi-model orchestration docs after Layer 1 |
| 3-B. Runtime usage verification | Active | Success metrics | Confirm Antigravity/Codex actually discover and use generated adapters |
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

### Phase 2-C: Documentation/Tooling Alignment

- Updated PRD, task, roadmap, and quality-gate docs to match the verified
  Antigravity cutover state.
- Clarified the skill-size rule:
  - 400 lines is a split-review trigger.
  - 500 lines is the validation failure threshold.
- Marked the historical Superpowers plan as historical implementation context
  so stale checkboxes do not imply active work.
- Added `tools/diff-adapters.js`.
- Added `npm run diff:adapters`.
- Included adapter diff reporting in `npm run check`.
- Verified `npm run check` after implementation.

### Phase 3-A: Skill Content Hardening

- Received Antigravity drafts from the installed Antigravity/Gemini skills
  root:
  - `draft_escalation_protocol.md`
  - `draft_orchestration_protocol.md`
- Merged the escalation protocol into `source/코딩가이드/SKILL.md`.
- Added detailed escalation templates in
  `source/코딩가이드/REFERENCES.md`.
- Updated `source/총괄매니저/REFERENCES.md` so manager review sessions can
  interpret worker statuses: complete, partial, returned, and impossible.
- Added `source/ORCHESTRATION.md` as the official multi-model orchestration
  protocol.
- Updated adapter build and diff tooling so `ORCHESTRATION.md` is copied into
  every generated adapter.
- Installed the updated Antigravity adapter into
  `%USERPROFILE%\.gemini\config\skills`.
- Installer-created conflict backup:
  `%USERPROFILE%\.gemini\config\skills.backup-20260526T072701`.
- Verified the installed Antigravity adapter has zero missing files and zero
  hash diffs against `adapters/antigravity/skills`.
- Verified the two local draft files remained preserved in the destination.
- Bumped:
  - `코딩가이드` to v1.6.0
  - `총괄매니저` to v2.15.0
  - `SKILL_INDEX` to v2.0.7

## Active Queue

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

## Upcoming Queues

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
- Layer 1 cutover/documentation/tooling work is complete.
- Phase 3-A Antigravity drafts were merged through source and adapters:
  코딩가이드 v1.6.0, 총괄매니저 v2.15.0, SKILL_INDEX v2.0.7,
  ORCHESTRATION.md.
- Updated Antigravity adapter was installed with backup
  `%USERPROFILE%\.gemini\config\skills.backup-20260526T072701`.

다음 작업:
1. PRD.md, PROJECT_TASKS.md, docs/INSTALL.md를 읽고 현재 위치를 복원
2. npm run check
3. Runtime usage verification으로 Codex/Antigravity 트리거 동작 확인
4. 발견되는 adapter wording mismatch를 PROJECT_TASKS.md와 관련 docs에 기록
5. Phase 4 구조 리팩터 후보는 runtime verification 이후에만 판단
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

### 2026-05-26: Phase 3-A Draft Merge

- Reviewed Antigravity's two draft files from the installed skills root.
- Accepted the escalation protocol direction, but split detailed templates into
  `source/코딩가이드/REFERENCES.md` so the main `SKILL.md` stays below the
  validation threshold.
- Accepted the orchestration protocol as a root system document instead of a
  standalone skill.
- Updated adapter build and diff tooling to treat `ORCHESTRATION.md` as an
  expected generated root document.
- Ran `npm run check`; adapter build, adapter diff, installer tests,
  validation, and audit all passed.
- Installed the updated Antigravity adapter and verified it matched generated
  output with zero missing files and zero hash diffs.
- Confirmed the two draft files in the Antigravity destination were preserved.
- Moved the operating queue to Phase 3-B runtime usage verification.
