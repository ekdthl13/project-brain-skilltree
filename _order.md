# Worker Order

## #018-#022: Post-v1 Productization Round 2

Status: Ready

## Role

Implementation worker for the second post-v1 local productization round.

## Goal

Execute the next five post-v1 improvements as one local batch:

1. `#018` real user scenario examples
2. `#019` GitHub Actions matrix hardening
3. `#020` install/restore command UX polish, pass 2
4. `#021` skill quality score report improvements
5. `#022` public "Why This Exists" page

Do not publish, push, tag, bump versions, or create a GitHub Release. This is a local implementation batch that will receive PM review before any publication decision.

## Context

The previous local batch `#013-#017` was PM-reviewed and committed locally:

- commit: `06a7aa5` (`feat: polish post-v1 onboarding and restore tooling`)
- branch: `main`
- remote state: local `main` is ahead of `origin/main`; publication is intentionally held
- package version remains `1.0.0`

Use `_playbook_round2.md` as the task-by-task execution plan and write short results back into that playbook.

## Required Preflight

Run before editing:

```powershell
git status --short --branch
npm run check
```

Expected:

- branch is `main`
- no unrelated dirty changes before implementation starts
- `npm run check` passes before changes

If the worktree is not clean for reasons other than this order/playbook, stop and report the exact files.

## Global Rules

- `source/` is the canonical root.
- `adapters/` are generated output; do not edit generated adapter files by hand.
- Do not change stable adapter slugs.
- Do not change `catalog/skills.yaml` unless a validation failure proves the catalog is wrong.
- Do not install into real user skill directories.
- Do not push, tag, bump versions, or publish releases.
- Keep each task small and reviewable.
- Prefer existing scripts and test patterns over new abstractions.
- If a task starts requiring a schema change, stop and ask for PM review.

## Required Verification

After the full batch:

```powershell
git diff --check
npm run check
npm run test:forward
npm run demo
git status --short
git diff --name-only -- source catalog adapters reports
```

Also run targeted tests or commands added by the batch, and record them in `_playbook_round2.md`.

Run `node tools/pack-release.js` only if release packaging code, release workflow behavior, or release artifact docs are changed.

## Acceptance Criteria

- A real external user can find concrete scenario examples after the demo.
- CI validation covers the intended OS matrix without release or credential side effects.
- Install and restore commands have clearer help, dry-run, and error UX without weakening safety.
- Skill quality scoring produces a more useful report without making score thresholds a new release gate.
- Public docs explain why this project exists without inventing product promises.
- All required verification commands pass before completion is claimed.

## Report Back

Use this shape:

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
