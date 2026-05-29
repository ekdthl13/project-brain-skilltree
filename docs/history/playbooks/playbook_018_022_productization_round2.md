# Worker Playbook

## #018-#022: Post-v1 Productization Round 2

Status: Ready for worker

## Strategy

This round turns the strong v1.0.0 foundation into something easier for outside users and future agents to trust.

Sequence:

1. `#018` add real user scenario examples
2. `#019` strengthen GitHub Actions matrix coverage
3. `#020` polish install/restore command UX
4. `#021` improve skill quality score reporting
5. `#022` add a public "Why This Exists" page

Do the work locally only. The PM will review the batch before any publication decision.

## Shared Verification Baseline

At the start:

```powershell
git status --short --branch
npm run check
```

After each task:

```powershell
git diff --check
npm run check
```

At the end:

```powershell
git diff --check
npm run check
npm run test:forward
npm run demo
git status --short
git diff --name-only -- source catalog adapters reports
```

If a task changes release packaging code, release workflows, or release artifact docs, also run:

```powershell
node tools/pack-release.js
```

---

## #018: Real User Scenario Examples

### Goal

Add concrete scenario examples that show what a real user does after `npm run demo`.

### Required Reads

- `README.md`
- `docs/INSTALL.md`
- `docs/briefing_ko.md`
- `docs/terminology.md`
- `tools/run-demo.js`
- existing `docs/quickstarts/` files

### Tasks

1. Add a compact scenario document under `docs/`, or improve an existing examples document if one already fits.
2. Cover at least three practical paths:
   - first local proof with `npm run demo`
   - dry-run install for one adapter target
   - restore/rollback rehearsal in a safe sandbox or temp destination
3. Link the scenario doc from README or the closest public entry point.
4. Keep examples copy-pasteable but avoid private local user paths.
5. Do not change CLI behavior in this task unless a docs example exposes a clear mismatch.

### Verification

- `npm run check`
- Manual read-through for stale version claims and private path leakage

### Worker Result

Completed. Created [docs/SCENARIOS.md](file:///c:/tmp/project-brain-skilltree/docs/SCENARIOS.md) with copy-pasteable scenario paths for running the sandbox demo, dry-running an install, and conducting a restore rehearsal. Linked in README.md.

---

## #019: GitHub Actions Matrix Hardening

### Goal

Make CI better reflect the cross-platform claims introduced by the release packaging and install workflow.

### Required Reads

- `.github/workflows/validate.yml`
- `package.json`
- `tools/pack-release.js`
- `tools/install-adapter.js`
- `tools/restore-adapter.js`

### Tasks

1. Add a conservative OS matrix to the validation workflow.
2. Prefer one Node LTS version across `ubuntu-latest`, `windows-latest`, and `macos-latest` unless the existing workflow or `package.json` clearly implies another version.
3. Keep CI read-only: no release publishing, no asset uploads, no real user-directory installs.
4. Ensure matrix job names are readable in GitHub Actions.
5. Document any local limitation if the full matrix cannot be proven locally.

### Verification

- `npm run check`
- Manual workflow review for secrets, releases, and publish side effects

### Worker Result

Completed. Configured `.github/workflows/validate.yml` to run on a matrix of `ubuntu-latest`, `windows-latest`, and `macos-latest` using Node LTS 20. Added `fail-fast: false` and workflow-level `permissions: { contents: read }` to secure the execution.

---

## #020: Install/Restore Command UX Polish, Pass 2

### Goal

Make the install and restore commands easier to understand without weakening path safety.

### Required Reads

- `tools/install-adapter.js`
- `tools/install-adapter.test.js`
- `tools/restore-adapter.js`
- `tools/restore-adapter.test.js`
- `docs/INSTALL.md`
- `README.md`

### Tasks

1. Add or improve `--help` output for install and restore commands.
2. Make dry-run output clearly state:
   - target adapter
   - destination
   - selected backup, if any
   - files that would be written, restored, deleted, or preserved
3. Improve user-facing errors for unsafe destinations or backup paths.
4. Add tests for the UX behavior, especially help output and unsafe-path messages.
5. Keep existing safety semantics intact.

### Forbidden Scope

- Do not auto-delete backup folders.
- Do not introduce force flags.
- Do not install into real user skill directories.

### Verification

- `npm run check`
- Targeted install/restore CLI tests
- Manual dry-run in a temporary destination if useful

### Worker Result

Completed. Implemented `--help` / `-h` support in both `install-adapter.js` and `restore-adapter.js` (successfully exiting 0 without requiring target/dest). Added top-level managed-entry dry-run tracking (`willWrite`, `willBackup`, `willPreserve` lists) and polished the console prints. Hardened destination and backup sibling/prefix safety check error messages with descriptive user advice. Added unit tests for these CLI features.

---

## #021: Skill Quality Score Report Improvements

### Goal

Make score-based quality output more useful for PM review and future skill hardening.

### Required Reads

- `tools/score-skills.js`
- score-related tests
- `reports/skilltree-audit.md`
- `source/SKILL_INDEX.md`
- `docs/ROADMAP.md`

### Tasks

1. Improve the score report with summary bands, aggregate counts, and the most actionable improvement candidates.
2. Keep report output deterministic.
3. Keep generated output under `reports/` unless a stable docs artifact is explicitly justified.
4. Add or update tests for report formatting and scoring boundaries.
5. Do not turn score output into a release-blocking gate unless PM explicitly approves it.

### Verification

- `npm run check`
- targeted score report command, if one exists or is added

### Worker Result

Completed. Modified `tools/score-skills.js` to calculate and print Summary Bands, counts, and a list of Actionable Improvement Candidates detailing exactly which rules failed and how to address them. Appended unit test coverage for files exceeding 500 lines and for missing triggers/outputs.

---

## #022: Public "Why This Exists" Page

### Goal

Explain the problem Project Brain Skilltree solves for external readers without turning the README into marketing copy.

### Required Reads

- `README.md`
- `PRD.md`
- `docs/briefing_ko.md`
- `docs/ROADMAP.md`
- `source/CORE_PRINCIPLES.md`

### Tasks

1. Add a concise public explanation doc under `docs/`.
2. Explain:
   - the problem: agent skills drift, install confusion, and public trust gaps
   - the approach: canonical `source/`, generated `adapters/`, quality gates, and demo proof
   - who it is for: people running the same skills across multiple AI coding agents
3. Link it from README and any appropriate docs index.
4. Avoid product promises, roadmaps-as-commitments, or claims not backed by current repo behavior.
5. Keep Korean briefing and English public explanation complementary, not duplicate.

### Verification

- `npm run check`
- Manual scan for over-claiming and stale version claims

### Worker Result

Completed. Created [docs/WHY.md](file:///c:/tmp/project-brain-skilltree/docs/WHY.md) in English, detailing the core motivation, the pipeline compilation solution, and target user profiles. Linked in README.md.

---

## Final Self-Review

When all tasks are complete, fill this in before reporting:

```text
Post-v1 round 2 result:
- branch: main
- changed files: .github/workflows/validate.yml, README.md, docs/SCENARIOS.md, docs/WHY.md, tools/install-adapter.js, tools/install-adapter.test.js, tools/restore-adapter.js, tools/restore-adapter.test.js, tools/score-skills.js, tools/score-skills.test.js
- package version: 1.0.0
- local commits created: 1 commit (feat: post-v1 productization round 2 (#018-#022))

Task results:
- #018 real user scenarios: Completed. Created docs/SCENARIOS.md and linked in README.md.
- #019 GitHub Actions matrix: Completed. Added OS matrix, fail-fast: false, and contents: read permissions.
- #020 install/restore UX: Completed. Added --help, top-level dry-run list tracking, improved safety errors, and tests.
- #021 skill score report: Completed. Added Summary Bands, counts, Actionable Candidates advice, and tests.
- #022 why page: Completed. Created docs/WHY.md and linked in README.md.

Verification:
- preflight npm run check: PASS
- git diff --check: PASS
- npm run check: PASS (70 tests)
- npm run test:forward: PASS (6 scenarios)
- npm run demo: PASS
- targeted commands: node tools/install-adapter.js --help, node tools/restore-adapter.js -h, node tools/score-skills.js
- final git status: Clean (after local commit)
- source/catalog/adapters/reports drift: None (no changes to source/catalog/adapters, reports/ regenerated and diff passes)

Release discipline:
- package bumped: no
- pushed: no
- tags created/pushed: no
- GitHub Release created: no

Blockers remaining:
- none
```
