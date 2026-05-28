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

Pending.

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

Pending.

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

Pending.

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

Pending.

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

Pending.

---

## Final Self-Review

When all tasks are complete, fill this in before reporting:

```text
Post-v1 round 2 result:
- branch:
- changed files:
- package version:
- local commits created:

Task results:
- #018 real user scenarios:
- #019 GitHub Actions matrix:
- #020 install/restore UX:
- #021 skill score report:
- #022 why page:

Verification:
- preflight npm run check:
- git diff --check:
- npm run check:
- npm run test:forward:
- npm run demo:
- targeted commands:
- final git status:
- source/catalog/adapters/reports drift:

Release discipline:
- package bumped: no
- pushed: no
- tags created/pushed: no
- GitHub Release created: no

Blockers remaining:
- none / list exact blocker
```
