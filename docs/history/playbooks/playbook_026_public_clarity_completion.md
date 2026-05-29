# Public Clarity Completion Playbook

## Purpose

Finish the public trust path started by the local `v1.1.1` clarity patch.

The goal is not to add features. The goal is to make a first-time external user understand:

1. why this project exists,
2. why it is safe to try locally,
3. what to check before installing into a real agent folder,
4. how to reverse an install if needed.

## Execution Model

Worker executes this playbook in one local batch, then reports back for PM review.

PM will review the result, make any final corrections, and only then issue a separate release execution order.

## Global Rules

- Do not push.
- Do not tag.
- Do not publish a GitHub Release.
- Do not package release assets.
- Do not bump `package.json`.
- Do not edit generated files under `adapters/` by hand.
- Prefer small public-facing docs changes over broad refactors.
- Keep wording practical and trust-oriented, not marketing-heavy.
- Keep `source/` as canonical root and `adapters/` as generated output.

## Current Baseline

- Latest published release: `v1.1.0`
- Current local clarity commit already exists: `62f0f67 docs: improve public clarity and trust path`
- Current local branch may be ahead of `origin/main`; do not push it.
- The first clarity pass already added `docs/assets/skilltree-overview.svg`.

## Task #026A: Install/Restore Preflight Clarity

### Goal

Make `docs/INSTALL.md` answer: "What should I verify before I point this at my real agent folder?"

### Target Files

- Modify `docs/INSTALL.md`

### Required Changes

Add a compact pre-install checklist near the top, after the recommended confidence path.

The checklist should cover:

- run `npm run demo` first,
- run `npm run check`,
- choose the correct target adapter,
- use `--dry-run` before active install,
- confirm the backup path is outside the active destination but is a sibling backup folder,
- keep backups until the agent is restarted and verified,
- use restore dry-run before active restore.

Keep it short. This should read like a safety card, not a manual.

### Do Not

- Do not duplicate the full rollback section.
- Do not add OS-specific private paths.
- Do not claim automatic restore deletes backups.

## Task #026B: README Five-Minute Safe Trial Route

### Goal

Make `README.md` show the safe user path in one short sequence:

`demo -> dry-run install -> active install -> restore rehearsal`

### Target Files

- Modify `README.md`

### Required Changes

Add or tighten a compact "5-minute safe trial" section near Quickstart.

It should include four steps:

1. `npm run demo`
2. `node tools/install-adapter.js <target> <destination> --dry-run`
3. `node tools/install-adapter.js <target> <destination>`
4. `node tools/restore-adapter.js <target> <destination> --dry-run`

Make clear that step 4 is a rehearsal before a real rollback, not a required rollback after every install.

### Do Not

- Do not turn README into a long manual.
- Do not add new feature promises.
- Do not remove the existing target-specific install examples unless they become redundant and confusing.

## Task #026C: Release Notes Trust Language Template

### Goal

Prepare release note language so future GitHub Releases use the same public trust terms as README and WHY.

### Target Files

- Create `docs/RELEASE_NOTES_TEMPLATE.md`, or update an existing release documentation file if a better local pattern already exists.

### Required Content

The template should include:

- release title placeholder,
- "What changed",
- "Public trust proof",
- "Verification",
- "Assets",
- "Upgrade/install path",
- "Rollback path",
- "Known limits".

It must use the same vocabulary:

- Demo proof
- Drift guard
- Rollback path
- CI matrix

### Do Not

- Do not write actual `v1.1.1` release notes as if published.
- Do not mention unpublished assets as already uploaded.
- Do not run `gh release`.

## Task #026D: Public Clarity Checklist

### Goal

Create a small final review checklist that PM can use before approving public releases.

### Target Files

- Create `docs/PUBLIC_CLARITY_CHECKLIST.md`, or update an existing checklist doc if a better local pattern already exists.

### Required Checks

The checklist should answer:

- Can a newcomer explain the project in one sentence?
- Can they identify the canonical root and generated output?
- Can they run a no-risk proof before installing?
- Can they preview an install before writing files?
- Can they find the rollback path?
- Do README, WHY, INSTALL, SCENARIOS, and Release notes use the same trust language?
- Are version, release, and test-count references current?

### Do Not

- Do not create a long policy document.
- Do not add process that would block small documentation patches unnecessarily.

## Task #026E: State Board and Report

### Goal

Leave project state understandable for PM review.

### Target Files

- Modify `PROJECT_TASKS.md`
- Modify `_order.md`

### Required Changes

Update the active local candidate section so it records this completion batch as pending or completed based on actual work.

The worker report in `_order.md` must include:

```text
public clarity completion batch:
- files changed:
- install/restore preflight:
- README five-minute route:
- release notes trust template:
- public clarity checklist:
- validation:
- committed:
- pushed:
- blockers:
```

`committed` should be `no` unless PM explicitly changes the rule.
`pushed` must be `no`.

## Required Verification

Run these commands after edits:

```powershell
git diff --check
npm run check
npm run demo
git diff --name-only -- source catalog adapters reports
git status --short --branch
```

If a change touches forward-testing behavior or scenario files, also run:

```powershell
npm run test:forward
```

## Acceptance Criteria

- A first-time user can see the safe path before real installation.
- Install docs clearly say what to check before touching real folders.
- Release notes have a reusable trust-language template.
- PM has a compact public clarity checklist.
- No generated adapter drift is introduced.
- No push, tag, GitHub Release, release asset packaging, or version bump occurs.

## PM Follow-Up After Worker Report

PM review should:

1. inspect the diff directly,
2. run or verify the required checks,
3. fix any clarity gaps directly if small,
4. decide whether to issue a separate release execution order.

Release execution must be a separate order after PM acceptance.
