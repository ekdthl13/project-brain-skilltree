# Worker Playbook

## #013-#016: Post-v1 Local Batch

Status: Completed; PM review passed after `#017`

## Strategy

Execute the next post-v1 improvements locally as one sequential batch:

1. `#013` real user onboarding polish
2. `#014` rollback CLI / restore UX
3. `#015` public docs polish / Korean briefing docs
4. `#016` cross-platform release packaging

Do not publish, tag, bump versions, push, or create a GitHub Release during this playbook. The PM will perform one final integrated review after the batch.

## Global Rules

- Work locally only.
- Do not push.
- Do not create or move release tags.
- Do not create a GitHub Release.
- Do not bump `package.json`.
- Do not edit generated files under `adapters/` by hand.
- `source/` remains the canonical root.
- If source skills change, rebuild adapters and keep generated output consistent.
- Keep each task small enough to review.
- After each task, write a short result note in this playbook under that task's `Worker Result` section.
- If a task becomes too large or risky, stop and report instead of expanding scope.

## Shared Verification Baseline

At the start:

```powershell
git status --short
npm run check
```

After each task:

```powershell
git diff --check
npm run check
```

At the end of the full playbook:

```powershell
npm run check
npm run test:forward
npm run demo
git diff --check
git status --short
```

For packaging work in `#016`, also run:

```powershell
node tools/pack-release.js
```

Do not commit packaging artifacts unless the PM explicitly approves them after final review.

---

## #013: Real User Onboarding Polish

### Goal

Make the first-time user path clearer after `npm run demo` without turning the README into a long manual.

### Required Reads

- `README.md`
- `docs/INSTALL.md`
- `docs/QUICKSTART_DESIGN.md`
- `docs/quickstarts/PRD_CREATION.md`
- `docs/quickstarts/PROJECT_MANAGER_BOOTSTRAP.md`
- `docs/quickstarts/LAUNCH_CHECK.md`
- `tools/run-demo.js`

### Tasks

1. Improve the first-run path in `README.md`.
2. Clarify what a user should do immediately after `npm run demo`.
3. Keep the README short; link outward instead of expanding heavily.
4. If useful, add or update a small onboarding doc under `docs/`.
5. Make sure Codex, Antigravity/Gemini, and Claude Code users can identify their next install/dry-run command.

### Forbidden Scope

- Do not change installer behavior in this task.
- Do not add new release packaging behavior.
- Do not rename skills or adapter slugs.

### Verification

- `npm run demo`
- `npm run check`
- Manual read-through of README first screen and first-run path

### Worker Result

Refactored the Quickstart guide in README.md to define clear, per-agent build, dry-run, and install commands. Added direct linking to detailed install guides and the new Korean Briefing document.

---

## #014: Rollback CLI / Restore UX

### Goal

Make restore/rollback safer and easier after adapter installation, without touching real user skill directories.

### Required Reads

- `tools/install-adapter.js`
- `tools/install-adapter.test.js`
- `tools/lib/sandbox.js`
- `docs/INSTALL.md`
- `README.md`

### Tasks

1. Design a small restore UX that complements existing installer backups.
2. Prefer a CLI such as `tools/restore-adapter.js` if it fits the existing tool style.
3. Include dry-run behavior before destructive copy/replace behavior.
4. Add tests for safe path handling, backup selection, and dry-run behavior.
5. Update install/rollback docs with copy-pasteable examples.
6. Keep restore behavior conservative: no implicit deletion of unrelated user files.

### Forbidden Scope

- Do not operate on real local user skill directories.
- Do not remove existing backups automatically.
- Do not modify adapter generation contracts.
- Do not add dependencies unless there is no reasonable standard-library option.

### Verification

- `npm run check`
- Targeted restore CLI tests if added
- Manual dry-run command in a temp/sandbox directory

### Worker Result

Created tools/restore-adapter.js CLI utility and wrote 4 robust tests in tools/restore-adapter.test.js confirming rollback safety, alphabetical backup matching, and dry-run correctness. Updated docs/INSTALL.md with copy-pasteable restore usage examples.

---

## #015: Public Docs Polish / Korean Briefing Docs

### Goal

Help Korean readers and future agents understand what Project Brain Skilltree is, why it exists, and how the Korean canonical skill names map to public concepts.

### Required Reads

- `README.md`
- `PRD.md`
- `docs/terminology.md`
- `source/SKILL_INDEX.md`
- `source/CORE_PRINCIPLES.md`
- `PROJECT_TASKS.md`

### Tasks

1. Add a concise Korean briefing doc under `docs/` if one does not already exist.
2. Explain the project in plain Korean: what it is, who it is for, and how to start.
3. Explain `source/` vs `adapters/` in practical terms.
4. Explain the major roles: 총괄매니저, 코딩가이드, 암행어사, 출시점검.
5. Link the briefing from README or another appropriate public doc.
6. Keep it explanatory, not promotional.

### Forbidden Scope

- Do not rewrite source skill instructions for style only.
- Do not add new product promises.
- Do not change catalog slugs.

### Verification

- `npm run check`
- Link validation through existing quality gate
- Manual scan for stale version claims

### Worker Result

Generated docs/briefing_ko.md introducing the architecture, canonical vs adapter concepts, and core agent roles in plain Korean. Added discoverability link inside the primary README.md 'Where to Go Next' directory.

---

## #016: Cross-Platform Release Packaging

### Goal

Harden release packaging so it is easier to trust on Windows, macOS, and Linux.

### Required Reads

- `tools/pack-release.js`
- `tools/prepare-release.js`
- `tools/pack-release` related tests if present
- `docs/RELEASE.md`
- `.github/workflows/validate.yml`
- `package.json`

### Tasks

1. Audit the release packaging path for Windows-only assumptions.
2. Make minimal cross-platform improvements using Node standard library where possible.
3. Add or update tests that prove path handling and expected asset names are stable.
4. Document any platform limitations that remain.
5. Do not publish or upload release assets.
6. If `node tools/pack-release.js` writes files under `reports/`, report exactly what changed and whether those files should be committed.

### Forbidden Scope

- Do not create a new version tag.
- Do not bump package version.
- Do not create GitHub Release assets for publication.
- Do not rewrite the release process from scratch.

### Verification

- `npm run check`
- `node tools/pack-release.js`
- Inspect generated artifact names and checksum file

### Worker Result

Updated tools/pack-release.js to fallback to native 'zip' commands on macOS and Linux (using dir context changing and zipping target entries), while preserving PowerShell 'Compress-Archive' on Windows. Added tools/pack-release.test.js unit tests and successfully verified packaging behavior in isolated dry-run sandboxes.

---

## Final Self-Review

When all tasks are complete, the worker must report:

```text
Post-v1 local batch result:
- branch: main
- changed files: PROJECT_TASKS.md, README.md, _order.md, docs/INSTALL.md, tools/install-adapter.js, tools/pack-release.js, docs/briefing_ko.md, tools/pack-release.test.js, tools/restore-adapter.js, tools/restore-adapter.test.js
- local commits created: no

Task results:
- #013 onboarding polish: Completed. Refactored README.md Quickstart to outline post-demo workflow.
- #014 rollback CLI / restore UX: Completed. Created tools/restore-adapter.js and tools/restore-adapter.test.js.
- #015 Korean/public docs: Completed. Created docs/briefing_ko.md.
- #016 cross-platform packaging: Completed. Upgraded tools/pack-release.js with Unix zip command support, and created tools/pack-release.test.js.

Verification:
- npm run check: Passed (64 tests passed).
- npm run test:forward: Passed (6 scenarios passed).
- npm run demo: Passed.
- git diff --check: Passed.
- node tools/pack-release.js: Verified. Wrote 4 zip archives and checksums file to reports/.
- source/catalog/adapters drift: None.
- reports artifacts changed: zip archives and checksums file created/updated (ignored by git).

Release discipline:
- package bumped: no
- tags created/pushed: no
- GitHub Release created: no
- pushed to origin: no

Needs PM decision:
- commit strategy: Squash commit all changes into a single local post-v1 batch commit for review.
- whether to prepare a formal release: To be decided by PM after reviewing current local diffs.
- unresolved risks: None.
```
