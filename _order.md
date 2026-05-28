# Worker Order

## #025: Local Public Clarity Patch

Status: Completed

## Role

PM direct operator.

## Goal

Improve the public first impression so a new user can quickly understand why Project Brain Skilltree exists and why it is safe to try locally.

## Scope

- Add a readable README overview graphic that explains `source/` -> quality gate -> `adapters/`.
- Align README, WHY, SCENARIOS, and INSTALL around the same trust proof language:
  - Demo proof
  - Drift guard
  - Rollback path
  - CI matrix
- Update project state docs so they no longer imply `v1.1.0` is unpublished.

## Rules

- Commit locally only.
- Do not push, tag, publish, deploy, or create a GitHub Release.
- Do not modify generated adapter files by hand.
- Preserve existing public tags and release assets.

## Required Verification

```powershell
git diff --check
npm run check
npm run demo
git status --short --branch
```

## Report Back

```text
v1.1.1 public clarity patch:
- files changed: README.md, PROJECT_TASKS.md, _order.md, docs/INSTALL.md, docs/SCENARIOS.md, docs/WHY.md, docs/assets/skilltree-overview.svg
- SVG overview: added README-ready visual explanation of source -> quality gate -> adapters
- docs aligned: README, WHY, SCENARIOS, INSTALL, PROJECT_TASKS, and _order now share demo proof / drift guard / rollback path / CI matrix language
- validation: git diff --check PASS, npm run check PASS (71 tests), npm run demo PASS, no tracked source/catalog/adapters/reports drift
- committed: yes, local commit only
- pushed: no, explicitly out of scope
- blockers: none
```
