# Worker Order

## #012: Commit v1.0.1 Documentation Consistency Patch

Status: Completed

## Role

Release hygiene worker

## Goal

Commit the already-verified v1.0.1 documentation consistency patch as a narrow docs-only change.

This order is for committing the documentation patch only. Do not prepare the formal v1.0.1 release, do not bump versions, do not tag, and do not create release assets.

## Context

- Current branch: `main`.
- Current stable release: `v1.0.0`.
- `package.json` must remain `1.0.0` in this order.
- Worker Order #011 completed the documentation consistency review.
- PM independently re-ran:
  - `npm run check`: pass, 55 tests pass
  - `npm run test:forward`: pass, 6/6 scenarios
  - `npm run demo`: pass
  - `git diff --check`: pass
- There is no drift in `source/`, `catalog/`, `adapters/`, or `reports/`.

## Expected Changed Files

Only stage and commit these files:

- `README.md`
- `PRD.md`
- `docs/ROADMAP.md`
- `docs/INSTALL.md`
- `docs/terminology.md`
- `PROJECT_TASKS.md`
- `_order.md`

## Tasks

1. Preflight:
   - Run `git status --short`.
   - Confirm the modified file list matches the expected files above.
   - Confirm `git diff --name-only -- source catalog adapters reports` returns no files.
   - Confirm `package.json` version is still `1.0.0`.
2. Final lightweight verification:
   - Run `git diff --check`.
   - Run `npm run check`.
   - If either fails, stop and report the exact failure.
3. Commit:
   - Stage only the expected files listed above.
   - Commit with:
     `docs: align public documentation with v1.0.0 stable release`
4. Push:
   - Push `main` to `origin/main`.
   - Do not push tags.
5. Post-push verification:
   - Run `git status --short`.
   - Confirm local `HEAD` and `origin/main` match.
   - Report the commit SHA.

## Forbidden Scope

- Do not edit `source/`.
- Do not edit `catalog/skills.yaml`.
- Do not manually edit generated files under `adapters/`.
- Do not modify `reports/`.
- Do not bump `package.json`.
- Do not edit `CHANGELOG.md` in this order.
- Do not create, move, delete, or push tags.
- Do not create GitHub Releases or upload release assets.
- Do not install adapters into real local user skill directories.

## Completion Criteria

- The docs consistency patch is committed and pushed to `origin/main`.
- Commit includes only the expected files.
- `package.json` remains `1.0.0`.
- `git diff --check` passes.
- `npm run check` passes.
- Final `git status --short` is clean.
- `HEAD` equals `origin/main`.

## Report Back

Use this shape:

```text
v1.0.1 docs patch commit:
- branch: main
- commit: cb6c9a63878fcbbfc3588a322e5aeb95641de173
- pushed to origin/main: yes
- package version: 1.0.0

Committed files:
- README.md
- PRD.md
- docs/ROADMAP.md
- docs/INSTALL.md
- docs/terminology.md
- PROJECT_TASKS.md
- _order.md

Verification:
- git diff --check: pass
- npm run check: pass
- final git status: clean (other than _order.md tracking status update)
- HEAD equals origin/main: yes

Scope guard:
- package bumped: no
- changelog edited: no
- tags pushed: no
- release assets touched: no
- source/catalog/adapters/reports touched: no

Next recommendation:
- prepare formal v1.0.1 release order: yes
- exact blocker if any: none
```
