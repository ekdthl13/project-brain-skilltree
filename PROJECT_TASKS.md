# Project Tasks

## Current Position

Project Brain Skilltree is in **Phase 7: Release System** (Phase 7-A Release system foundation complete, tag/publish gate pending).

Approximate overall progress: **85%**.

The public canonical repository exists, adapters build from `source/`, CI is
green, and the Codex and Antigravity adapters have both been installed and
runtime-smoke-verified locally. Phase 7-A established the release system foundation
by writing release guidelines, semantic versioning rules, strict approval gates,
and a standalone checksum generator. Remote pushes, tags, and publication are pending approval. The approved Phase 4 decision is to keep `암행어사` and `출시점검` separate, clarify their boundaries,
and defer physical core/plugin splitting. Phase 5 converted the pressure
scenario docs into executable static guardrail tests inside `npm run check`.

## Installed State

| Environment | Status | Notes |
|-------------|--------|-------|
| Codex | Installed + verified | Generated adapter entries are installed under `%USERPROFILE%\.codex\skills`; `.system` was preserved; latest backup `%USERPROFILE%\.codex\skills.backup-20260526T080509` |
| Antigravity/Gemini | Installed + verified | Generated adapter entries are installed under `%USERPROFILE%\.gemini\config\skills`; latest backup `%USERPROFILE%\.gemini\config\skills.backup-20260526T080421` |
| Claude Code | Not installed | Adapter generation exists, but local install has not been requested |

## Workstream Ownership

| Layer | Owner | Scope | Rule |
|-------|-------|-------|------|
| Layer 1: Infrastructure | Codex | Antigravity cutover, docs alignment, adapter diff report | Finish before structural skill refactors |
| Layer 2: Skill content | Antigravity drafts, Codex validates/merges | Coding-guide escalation and multi-model orchestration docs | Merge through `source/`, then rebuild adapters and run `npm run check` |
| Structural refactors | Decision gate | `암행어사`/`출시점검` boundary, core/plugin split | Evaluate impact first; do not rename or move skills before approval |

## Phase Map

| Phase | Status | PRD/Roadmap Link | Goal |
|-------|--------|------------------|------|
| 0. Local audit and stabilization | Done | PRD background | Identify drift, version mismatch, packaging conflicts, and oversized skills |
| 1. GitHub canonical repo | Done | P0 / v0.1 | Create public repo with `source/`, adapters, catalog, docs, validation, and CI |
| 2-A. Local install loop proof | Done | P1 / v0.2 | Prove installer dry-run, backup, and preservation behavior in test and Codex paths |
| 2-B. Antigravity cutover | Done | P1 / v0.2 | Apply the generated Antigravity adapter only after backup, comparison, and rollback are clear |
| 2-C. Documentation/tooling alignment | Done | P1/P2 / v0.2 | Sync status docs, clarify quality thresholds, add adapter diff report |
| 3-A. Skill content hardening | Done | P2 / v0.2 | Merge escalation protocol and multi-model orchestration docs after Layer 1 |
| 3-B. Runtime usage verification | Done | Success metrics | Confirm Antigravity/Codex actually discover and use generated adapters |
| 4. Structural refactor candidates | Done | P2/P3 | Re-evaluate `암행어사`/`출시점검` and core/plugin split after adapter stability |
| 5. Pressure scenario automation | Done | P2 / v0.2 | Turn documented failure scenarios into executable checks |
| 6. Public polish and examples | Done | P2 / v0.3 | Add examples, screenshots, clearer comparisons, and onboarding docs |
| 7. Release system | Active (7-A Done) | P3 / v0.3-v1.0 | Tag releases, write changelog, package artifacts, and publish checksums |
| 8. Advanced quality system | Pending | v0.3-v1.0 | Add scorecards, forward-testing harness, and skill creation CLI support |

## PRD Coverage Board

| Requirement | Status | Evidence / Next Move |
|-------------|--------|----------------------|
| P0: Canonical public repo | Done | Public repo, `main`, `source/`, CI validate |
| P0: Adapter generation | Done | Antigravity, Codex, and Claude Code adapters build from catalog/source |
| P0: Quality gate | Done | `npm run check` builds, tests, validates, audits |
| P1: Safe local install | Done | Installer works; Codex and Antigravity are installed; backups are recorded |
| P1: Session continuity | Done | PRD and task docs carry current phase, ownership, rollback, and next queues |
| P2: Automated pressure testing | Initial done | `tools/pressure-scenarios.test.js` runs static guardrail checks in `npm run check`; dynamic agent simulation remains future work |
| P2: Public presentation | Initial done | README onboarding, minimal example project, before/after drift docs, install transcript, and comparison examples exist; screenshots/GIFs are deferred |
| P3: Release system | Foundation done | Changelog, release checklist, versioning rules, and local checksum helper exist; release tag, GitHub Release, and packaged artifacts remain pending |

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

### Phase 3-B: Runtime Usage Verification

- Accepted Antigravity/Gemini runtime verification report as PASS.
- Verified the Antigravity installation shows:
  - `SKILL_INDEX.md` v2.0.7
  - root `ORCHESTRATION.md`
  - `코딩가이드` v1.6.0 with STEP 1.5 escalation protocol
  - `코딩가이드/REFERENCES.md`
  - `총괄매니저` v2.15.0
  - worker result status interpretation in `총괄매니저/REFERENCES.md`
  - UTF-8 Korean text without encoding breakage
  - preserved draft files in the Antigravity destination
- Installed the updated Codex adapter into `%USERPROFILE%\.codex\skills`.
- Installer-created Codex backup:
  `%USERPROFILE%\.codex\skills.backup-20260526T074200`.
- Verified the installed Codex adapter has zero missing files and zero hash
  diffs against `adapters/codex/skills`.
- Found and fixed a portable adapter discoverability gap: generated Codex and
  Claude Code `SKILL_INDEX.md` files now list root system docs such as
  `CORE_PRINCIPLES.md` and `ORCHESTRATION.md`.
- Re-ran `npm run check`; adapter build, adapter diff, installer tests,
  validation, and audit all passed.

### Phase 4: Structural Refactor Candidates

- Accepted the worker impact-analysis commit after PM review.
- Added [structural_refactor_impact.md](docs/structural_refactor_impact.md).
- Added structural refactoring gates to `docs/ARCHITECTURE.md`.
- Added slug stability and directory constraints to `docs/ADAPTER_CONTRACT.md`.
- Clarified the boundary between `암행어사` and `출시점검` without merging,
  moving, renaming, or splitting any skill directories.
- Decision: choose B안, boundary clarification; defer physical skill merge and
  core/plugin split.
- PM review patch: replaced local file URL links with portable
  relative links before push.
- Re-ran `npm run check`; adapter build, adapter diff, installer tests,
  validation, and audit all passed.
- Installed updated Antigravity and Codex adapters.
- Verified both installed adapters have zero missing files and zero hash diffs.

### Phase 5: Pressure Scenario Automation

- [x] Inventory `tests/scenarios/*.md`. (Checked 3 files)
- [x] Define executable scenario test format. (Wrote static guardrails in `tools/pressure-scenarios.test.js`)
- [x] Add tests for "do not edit generated adapters directly". (Verified edit bans in docs)
- [x] Add tests for "do not claim completion without validation". (Verified scripts.check completeness)
- [x] Add tests for "do not write private local user paths into public docs". (Blocked personal path patterns)
- [x] Add tests for adapter-specific wording boundaries. (Blocked hardcoded local install paths in source skills)
- [x] Include pressure scenario tests in `npm run check`. (Ran via tools/*.test.js inside npm run test)
- Added `tools/pressure-scenarios.test.js`.
- Updated `docs/QUALITY_GATE.md` to document automated behavioral checks.
- PM review re-ran `npm run check`; adapter build, adapter diff, installer
  tests, pressure scenario tests, validation, and audit all passed.
- Limitation recorded: current pressure automation is static guardrail testing,
  not dynamic agent behavior simulation.

## Active Queue

### Phase 7: Release System

- [x] Create `CHANGELOG.md` (v0.1.0-rc.1 - TBD).
- [x] Define versioning rules for source skills, adapter contract, and tool scripts (documented in docs/RELEASE.md).
- [x] Prepare release checklist (documented in docs/RELEASE.md).
- [x] Generate checksums helper tools (`tools/prepare-release.js` and reports output).
- [ ] Tag and publish a GitHub Release after CI passes (Pending PM Approval).
- [ ] Package adapter artifacts archive (Deferred to release step).

## Completed Queue (Phase 6: Public Polish and Examples)

- [x] Add a minimal example project bootstrap.
- [x] Add before/after showing local folder drift versus GitHub canonical root.
- [x] Add example install transcript using placeholders.
- [x] Add comparison examples against Superpowers-style, Gstack-style, and generic prompt collections.
- [x] Make README onboarding clear for a visitor who has not seen this chat.
- [x] Add direct relative Markdown links to 12 canonical source skill files in README.md.
- [x] Deferred screenshots or GIFs until visual staging assets are required.

## Upcoming Queues

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
- Codex adapter는 실제 Codex skills 경로에 설치되어 있고 runtime smoke를 통과했다.
- Antigravity/Gemini adapter도 실제 Antigravity skills 경로에 설치되어 있고 runtime smoke를 통과했다.
- Out-of-place backup과 installer conflict backup이 둘 다 보존되어 있다.
- Layer 1 cutover/documentation/tooling work is complete.
- Phase 3-A Antigravity drafts were merged through source and adapters:
  코딩가이드 v1.6.0, 총괄매니저 v2.15.0, SKILL_INDEX v2.0.7,
  ORCHESTRATION.md.
- Updated Antigravity adapter was installed with backup
  `%USERPROFILE%\.gemini\config\skills.backup-20260526T080421`.
- Updated Codex adapter was installed with backup
  `%USERPROFILE%\.codex\skills.backup-20260526T080509`.
- Phase 3-B Runtime Usage Verification is complete.
- Phase 4 Structural Refactor Candidates is complete:
  B안(경계 명확화) 승인, 물리적 통합/core-plugin split 보류.
- Phase 5 Pressure Scenario Automation is complete:
  static guardrail tests are included in `npm run check`.
- Phase 6 Public Polish and Examples is complete:
  README onboarding, minimal example project, install transcript, comparison
  examples, and direct source file links are in place.

다음 작업:
1. PRD.md, PROJECT_TASKS.md, docs/INSTALL.md를 읽고 현재 위치를 복원
2. npm run check
3. Phase 7 Release System 시작
4. changelog, versioning rules, release checklist, package artifacts, checksums 설계
5. push 후 GitHub Actions validate 통과 전 release tag 보류
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

### 2026-05-26: Phase 3-B Runtime Usage Verification

- Received PASS report from Antigravity/Gemini runtime verification.
- Treated the report as sufficient evidence for Antigravity installed-root
  discovery, UTF-8 readability, protocol availability, and draft preservation.
- Reinstalled and smoke-tested the Codex adapter.
- Fixed portable generated `SKILL_INDEX.md` discoverability so Codex and Claude
  Code adapters list root system documents.
- Ran `npm run check`; all gates passed.
- Moved the operating queue to Phase 4 structural refactor candidate review.

### 2026-05-26: Phase 4 Structural Refactor Candidate Review

- Worker produced a structural refactor impact report and local commit.
- PM review approved B안: keep `암행어사` and `출시점검` separate, clarify
  boundaries, and defer source/core + source/plugins splitting.
- PM review found local file URL links in public docs and amended
  them to portable relative links before push.
- Installed updated adapters into Antigravity and Codex.
- Verified both installed adapters match generated output with zero missing
  files and zero hash diffs.
- Ran `npm run check`; all gates passed.
- Moved the operating queue to Phase 5 pressure scenario automation.

### 2026-05-26: Phase 5 Pressure Scenario Automation

- Worker implemented `tools/pressure-scenarios.test.js` using `node:test`.
- Converted the existing `tests/scenarios/*.md` expectations into executable
  static guardrails.
- Added checks for scenario markdown structure, complete `npm run check`
  gates, private local path leakage, source skill install-root hardcoding, and
  generated adapter edit-ban documentation.
- Updated `docs/QUALITY_GATE.md` to document the automated behavioral checks.
- PM review re-ran `npm run check`; all gates passed.
- Moved the operating queue to Phase 6 public polish and examples.

### 2026-05-27: Phase 6 Public Polish and Examples

- [x] Created `examples/minimal-project/` files (README, GEMINI, AGENTS, _context, _order, DECISION_LOG, PROJECT_TASKS).
- [x] Created `docs/EXAMPLES.md` explaining before/after of local folder drift vs canonical root.
- [x] Updated `docs/INSTALL.md` with step-by-step install transcripts and dry runs.
- [x] Updated `docs/COMPARISON.md` with Gstack-style and generic prompt collection comparisons.
- [x] Updated `README.md` to organize onboarding flow and added direct file links to 12 canonical skill sources.
- [x] Ran `npm run check`; all gates passed cleanly.
- [x] Completed Phase 6 and moved the queue to Phase 7: Release System.

### 2026-05-27: Phase 7-A Release System Foundation

- [x] Created `CHANGELOG.md` at root summarizing development milestones of Phase 1-6.
- [x] Created `docs/RELEASE.md` outlining versioning rules, checklists, rollback guidelines, and strict approval gates.
- [x] Implemented `tools/prepare-release.js` to scan generated adapters, compute SHA-256 hashes, and output release manifests.
- [x] Registered `prepare:release` command script in `package.json`.
- [x] Created unit tests for checksum hashing functions in `tools/prepare-release.test.js`.
- [x] Updated `docs/ROADMAP.md` to distinguish between foundation and release publication.
- [x] Ran `npm run check` and verified all tests pass.
- [x] Completed Phase 7-A. Final tag release and push are pending PM approval.
