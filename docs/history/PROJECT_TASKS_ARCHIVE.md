# Project Tasks Archive

This file preserves historical detail moved out of `PROJECT_TASKS.md` so the main task file can stay focused on current state, active decisions, and next work.

## Archive Policy

- `PROJECT_TASKS.md` is the live state board: current position, active milestone, current queue, operating rules, and the current handoff prompt.
- Full worker prompts live in `_order.md`; multi-step batches may use `_playbook.md`.
- Detailed historical execution logs and completed milestone evidence move here after they stop being needed for immediate recovery.
- Release-facing changes stay in `CHANGELOG.md`; generated reports stay under `reports/`.
- When archiving from `PROJECT_TASKS.md`, keep a short pointer in the main file and preserve enough detail here to reconstruct the decision trail.

## Completed Work

### 2026-05-29: #028 Project Reset and Document Operations Diet

- Paused the release-machine loop after the stable `v1.1.1` public clarity release.
- Reframed the next milestone around skill quality and document operations hygiene.
- Archived completed root order/playbook files into:
  - `docs/history/orders/`
  - `docs/history/playbooks/`
- Re-established `_order.md` and `_playbook.md` as overwrite-only current slots.
- Compacted `PROJECT_TASKS.md` back into a live state board.
- Refreshed PRD, security, release, roadmap, and forward-testing language for the v1.1.1 baseline.
- Prepared worker order `#029` for the first skill-depth refactor.

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
- Added [structural_refactor_impact.md](../structural_refactor_impact.md).
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

## Archived Completed Milestone Queues

### Milestone v0.2.0 (Post-Release & Verification - Completed)

- [x] Add GitHub repository description and topics so public visitors can discover the project.
- [x] Claude Code install verification: identify destination, dry-run, install if approved, then hash-compare against `adapters/claude-code/skills`.
- [x] Add three external-user quickstarts (PRD creation, project-manager bootstrap, and launch-check workflow) designs and documentation.

### Milestone v0.3.0 (Dynamic Testing & Creation CLI - Released)

- [x] Implement `tools/lib/sandbox.js` with directory isolation and cleanup safety checks.
- [x] Implement `tools/lib/agent-sim.js` to replay steps (edit targets, mock commands) deterministically.
- [x] Implement `tools/forward-tester.js` runner and assertion gate evaluation.
- [x] Add pressure scenario JSON fixtures with `schemaVersion` for unvalidated-claim and path-leakage.
- [x] Register `npm run test:forward` script and integrate with CI validation gates.
- [x] Build `npm run new:skill` CLI that creates a source skill, updates catalog, and adds a router/index mention.
- [x] Complete v0.3.0 release verification, commit, tag, and GitHub Release publication.

## Completed Queue (v0.1.0 Release)

- [x] Apply GitHub Actions Node24 preflight env to `validate.yml`.
- [x] Confirm GitHub Actions `validate` succeeds on the Node24 preflight commit.
- [x] Package adapter artifact archives during the release step.
- [x] Generate final release checksums during the release step.
- [x] Create and push `v0.1.0` git tag after PM approval.
- [x] Publish GitHub Release with artifacts and checksums after tag creation.

## Completed Queue (v0.3.0 Release)

- [x] Confirm GitHub Actions `validate` succeeds on commit `d9ae75e`.
- [x] Package v0.3.0 adapter artifact archives.
- [x] Generate final v0.3.0 artifact checksums.
- [x] Create and push `v0.3.0` git tag.
- [x] Publish GitHub Release with four zip artifacts and checksum file:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.3.0`.

## Completed Queue (Phase 8-A: Advanced Quality Foundation)

- [x] Add skill quality scorecard command (`tools/score-skills.js`).
- [x] Add manifest stability checks for future schema changes (`tools/schema-stability.test.js`).
- [x] Document catalog schema and update procedures (`docs/SCHEMA_STABILITY.md`).
- [x] Create forward-testing guidelines (`docs/FORWARD_TESTING.md`) and static validation fixture (`tests/scenarios/forward-test-fixture.json`).
- [x] Add unit tests for quality guards and scenario integrity (`tools/forward-testing.test.js` and `tools/score-skills.test.js`).

## Completed Queue (Phase 6: Public Polish and Examples)

- [x] Add a minimal example project bootstrap.
- [x] Add before/after showing local folder drift versus GitHub canonical root.
- [x] Add example install transcript using placeholders.
- [x] Add comparison examples against Superpowers-style, Gstack-style, and generic prompt collections.
- [x] Make README onboarding clear for a visitor who has not seen this chat.
- [x] Add direct relative Markdown links to 12 canonical source skill files in README.md.
- [x] Deferred screenshots or GIFs until visual staging assets are required.

## Completed Queue (Phase 8-B: Skill Quality Hardening to 90+)

- [x] Refined `tools/score-skills.js` to better support Korean triggers and minimum outputs.
- [x] Added `CHECKLIST.md` support files for `PRD생성`, `디자인시스템`, `암행어사`, `오피스아워`, `출시점검` skills to ensure main SKILL.md files stay well below the 500-line hard ceiling.
- [x] Updated `tools/score-skills.test.js` to resolve mock skill description property validation failure.
- [x] Ran `npm run check` and `npm run score:skills` to verify all 17 tests pass successfully with an average scorecard rating of 97.5/100.

## Archived Historical Next Session Prompt

Use this prompt to continue cleanly:

```text
C:\tmp\project-brain-skilltree 에서 계속 작업하자.
GitHub repo는 https://github.com/ekdthl13/project-brain-skilltree 이고,
source/ 가 canonical root, adapters/ 는 생성물이다.

현재 상태:
- v0.1.0은 완료/공개 릴리즈됨:
  https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.1.0
- release commit: 1418694, release status log commit: 4d30d9c.
- GitHub Actions validate는 최신 main에서 성공.
- 릴리즈 자산 7개가 업로드됨:
  adapter zip 4개, release-artifact-checksums.txt,
  release-checksums.txt, release-manifest.json.
- Codex adapter는 `%USERPROFILE%\.codex\skills`에 최신 v0.1.0으로 설치되어
  generated adapter와 hash diff 0 / missing 0.
- Antigravity/Gemini adapter는 `%USERPROFILE%\.gemini\config\skills`에 최신
  v0.1.0으로 설치되어 generated adapter와 hash diff 0 / missing 0.
- Claude Code adapter는 `%USERPROFILE%\.claude\skills`에 최신 v0.1.0으로 설치되어
  generated adapter와 37 files / missing 0 / changed 0 / extra 0.
- 최신 로컬 백업:
  `%USERPROFILE%\.codex\skills.backup-20260527T015823`
  `%USERPROFILE%\.gemini\config\skills.backup-20260527T015748`
- v0.2.0 포스트 릴리즈 정렬 및 로컬 설치 검증 완료:
  - GitHub repo metadata(설명/태그) 수립 완료 (`docs/GITHUB_METADATA.md`).
  - 외부 사용자용 상세 퀵스타트 3개 작성 완료 (`docs/quickstarts/`).
  - Claude Code 로컬 설치 및 해시 비교 완료.

다음 작업 (Milestone v0.3.0):
1. PROJECT_TASKS.md, PRD.md, README.md, docs/INSTALL.md, docs/RELEASE.md, docs/FORWARD_TESTING.md를 읽고 현재 위치를 복원
2. npm run check
3. Milestone v0.3.0의 두 번째 구현 과제인 `tools/lib/agent-sim.js` 구현 (JSON steps를 읽고 mock action을 재현하는 deterministic replayer)
4. agent-sim 동작을 검증하기 위한 단위 테스트 (`tools/agent-sim.test.js`) 작성
5. 구현 전에는 먼저 Antigravity Flash 3.5 작업자에게 줄 1차 오더를 작성
```

## Execution Log

### 2026-05-27: Post-v0.3.0 Direction Decision

- [x] Reviewed `PROJECT_TASKS.md`, `PRD.md`, `docs/ROADMAP.md`, `CHANGELOG.md`,
  `docs/FORWARD_TESTING.md`, `docs/NEW_SKILL_CLI.md`, and `package.json`.
- [x] Ran `npm run check`; adapter build, adapter diff, unit tests, validation,
  and audit passed.
- [x] Ran `npm run test:forward`; all three JSON scenarios passed.
- [x] Accepted external GPT review as strategic input: the repo is strong as a
  personal/multi-agent operating system, but needs lighter onboarding and
  stronger behavioral proof before stable contract freeze.
- [x] Chose **v0.4.0 Operational Hardening** before v1.0.0 stable contract
  preparation.
- [x] Created `_order.md` as the dedicated active worker order file so
  `PROJECT_TASKS.md` remains a state board instead of accumulating full prompts.

### 2026-05-27: v0.3.0 Release Published

- [x] Confirmed GitHub Actions `validate` succeeded for `d9ae75e72f613fee9951d4a52d4c3d8710ad45b1`.
- [x] Confirmed the remote `v0.3.0` tag exists.
- [x] Published GitHub Release:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.3.0`.
- [x] Uploaded release assets:
  `project-brain-skilltree-v0.3.0-adapters.zip`,
  `project-brain-skilltree-v0.3.0-antigravity-skills.zip`,
  `project-brain-skilltree-v0.3.0-codex-skills.zip`,
  `project-brain-skilltree-v0.3.0-claude-code-skills.zip`,
  and `release-artifact-checksums.txt`.
- [x] Verified release assets expose SHA-256 digests through GitHub Release metadata.

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
- Moved the operating queue to Phase 3-B runtime verification.

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

### 2026-05-27: Phase 8-A Advanced Quality System Foundation

- [x] Created `tools/score-skills.test.js` unit testing for scorecard calculations.
- [x] Wrote schema stability guidelines in `docs/SCHEMA_STABILITY.md`.
- [x] Wrote `tools/schema-stability.test.js` to strictly enforce catalog root and entries layout constraints.
- [x] Wrote `docs/FORWARD_TESTING.md` outlining dynamic subagent simulation runner specifications.
- [x] Added placeholder-only simulation fixture `tests/scenarios/forward-test-fixture.json`.
- [x] Wrote static scenario validation suite `tools/forward-testing.test.js`.
- [x] Added static scenario validation suite `tools/forward-testing.test.js`.
- [x] Run `npm run check` and verified all 17 tests passed successfully.

### 2026-05-27: Phase 8-B Skill Quality Hardening to 90+

- [x] Refined `tools/score-skills.js` to better support Korean triggers and minimum outputs.
- [x] Added `CHECKLIST.md` support files for `PRD생성`, `디자인시스템`, `암행어사`, `오피스아워`, `출시점검` skills to ensure main SKILL.md files stay well below the 500-line hard ceiling.
- [x] Updated `tools/score-skills.test.js` to resolve mock skill description property validation failure.
- [x] Ran `npm run check` and `npm run score:skills` to verify all 17 tests pass successfully with an average scorecard rating of 97.5/100.

### 2026-05-27: v0.1.0 Release Preflight

- [x] Reviewed the GitHub Actions Node20 deprecation warning as an infrastructure warning, not a skilltree release blocker.
- [x] Added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` to `.github/workflows/validate.yml` so JavaScript actions are tested with Node24 before the first release tag.
- [x] Reorganized the active queue so the v0.1.0 release preflight tasks are visible separately from post-release dynamic testing work.

### 2026-05-27: v0.1.0 Release Candidate

- [x] Set `CHANGELOG.md` release date for `0.1.0`.
- [x] Re-ran `npm run check`; all 17 tests and validation gates passed.
- [x] Re-ran `npm run prepare:release`; generated final adapter file manifest and SHA-256 checksum report under ignored `reports/`.
- [x] Re-ran `npm run score:skills`; confirmed average scorecard remains 97.5/100.
- [x] Packaged ignored local release artifacts:
  - `reports/project-brain-skilltree-v0.1.0-adapters.zip`
  - `reports/project-brain-skilltree-v0.1.0-antigravity-skills.zip`
  - `reports/project-brain-skilltree-v0.1.0-codex-skills.zip`
  - `reports/project-brain-skilltree-v0.1.0-claude-code-skills.zip`
- [x] Generated `reports/release-artifact-checksums.txt` for the zip artifacts.

### 2026-05-27: v0.1.0 Release Published

- [x] Pushed release preparation commit `1418694`.
- [x] Confirmed GitHub Actions `validate` passed on release commit `1418694`.
- [x] Created and pushed annotated git tag `v0.1.0`.
- [x] Published GitHub Release: `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.1.0`.
- [x] Uploaded 7 release assets:
  - `project-brain-skilltree-v0.1.0-adapters.zip`
  - `project-brain-skilltree-v0.1.0-antigravity-skills.zip`
  - `project-brain-skilltree-v0.1.0-codex-skills.zip`
  - `project-brain-skilltree-v0.1.0-claude-code-skills.zip`
  - `release-artifact-checksums.txt`
  - `release-checksums.txt`
  - `release-manifest.json`

### 2026-05-27: Post-release Local Install and Handoff

- [x] Installed the latest v0.1.0 Codex adapter into `%USERPROFILE%\.codex\skills`.
- [x] Installed the latest v0.1.0 Antigravity/Gemini adapter into `%USERPROFILE%\.gemini\config\skills`.
- [x] Verified both installed adapter trees hash-match the generated adapters with zero missing files and zero differing files.
- [x] UTF-8 smoke-checked newly added `CHECKLIST.md` files in both installed trees.
- [x] Triaged external GPT/Claude feedback into accepted findings and outdated findings for the next session.
- [x] Rewrote the next-session prompt so future work starts from v0.1.0 released state, not the older Phase 7 preflight state.

### 2026-05-27: Forward-Testing Runner MVP (Task A/B/C)

- [x] Implemented `tools/lib/agent-sim.js` deterministic replayer.
- [x] Implemented `tools/forward-tester.js` runner.
- [x] Wrote unit tests `tools/agent-sim.test.js` and `tools/forward-tester.test.js`.
- [x] Added `unvalidated-claim.json` and `path-leakage.json` scenarios.
- [x] Updated `tools/forward-testing.test.js` to assert structural integrity on all JSON scenario fixtures.
- [x] Hardened `tools/lib/agent-sim.js` so `attempt_edit` rejects absolute paths and `..` traversal before writing to the sandbox.
- [x] Added regression tests for sandbox escape attempts and unsupported action names.
- [x] Re-ran `node tools/forward-tester.js --scenario tests/scenarios/unvalidated-claim.json` and verified PASS.
- [x] Re-ran `node tools/forward-tester.js --scenario tests/scenarios/path-leakage.json` and verified PASS.
- [x] Re-ran `npm run check` and verified all 36 tests passed successfully.

### 2026-05-27: Forward-Testing CI Gate (v0.3.0-B)

- [x] Added `tools/run-forward-tests.js` as the aggregate suite runner for all `tests/scenarios/*.json` fixtures.
- [x] Added `tools/run-forward-tests.test.js` for scenario discovery, aggregation, thrown-failure handling, CLI arg parsing, and script/CI registration checks.
- [x] Added `npm run test:forward` without nesting it inside `npm run check` to avoid recursive dynamic test execution.
- [x] Updated `.github/workflows/validate.yml` so CI runs `npm run check` and then `npm run test:forward`.
- [x] Added `PROJECT_BRAIN_FORWARD_TEST_INNER_CHECK=1` while executing scenario `checkCommand` values so nested `npm run check` calls skip recursive forward-tester scenario execution.
- [x] Added `CHECK_COMMAND_TIMEOUT_MS` to bound scenario validation command execution.
- [x] Re-ran `npm run test:forward` and verified all 3 JSON scenarios passed.

### 2026-05-27: New-Skill CLI MVP (v0.3.0-C)

- [x] Added `tools/new-skill.js` to create draft source skills and update `catalog/skills.yaml` plus `source/SKILL_INDEX.md`.
- [x] Added `tools/new-skill.test.js` for argument parsing, default planning, sandboxed skill creation, dry-run behavior, duplicate rejection, unsafe source path rejection, description validation, and script registration.
- [x] Registered `npm run new:skill`.
- [x] Added `docs/NEW_SKILL_CLI.md` and README usage.
- [x] Kept generated adapters out of direct write scope; follow-up command remains `npm run build:adapters && npm run check`.

