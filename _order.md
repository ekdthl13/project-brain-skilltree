# Worker Order

## #017: Fix Post-v1 Batch Review Blockers

Status: Completed

## Role

Safety fix worker for the post-v1 local batch

## Goal

Fix the PM review blockers found after the `#013-#016` post-v1 local batch.

This order is a narrow correction pass. Do not add new product features. Do not push, tag, bump versions, or create a GitHub Release.

## Context

The post-v1 local batch completed locally, but PM review found blockers before commit:

1. `tools/restore-adapter.js` consumes the backup by moving files out of it with `fs.renameSync`, then deletes the empty backup folder.
2. `tools/restore-adapter.js` accepts an explicit `--backup` path after only `path.resolve`, without proving it belongs to the selected destination.
3. `tools/pack-release.js` uses non-Windows shell command strings for `zip`; current tests do not prove the command builder/fallback behavior independently on Windows.
4. `PROJECT_TASKS.md` marked PM integrated review complete too early and still has a stale current-order pointer.

The already-passing verification commands are useful evidence, but do not override these review blockers.

## Required Reads

1. `tools/restore-adapter.js`
2. `tools/restore-adapter.test.js`
3. `tools/pack-release.js`
4. `tools/pack-release.test.js`
5. `docs/INSTALL.md`
6. `PROJECT_TASKS.md`
7. `_playbook.md`

## Tasks

### 1. Preserve backups during restore

- Replace backup-consuming restore behavior with copy-based restore behavior.
- Do not remove the selected backup folder after restore.
- After a successful restore, the backup should still exist and still contain the backed-up entries.
- Update tests so active restore asserts backup preservation.

### 2. Validate explicit backup paths

- Add validation that `--backup` points to a directory matching the selected destination's sibling backup pattern:
  `<destination>.backup-*`.
- Reject backups outside the destination's parent directory.
- Reject backups whose folder name does not start with the destination basename plus `.backup-`.
- Add tests for:
  - accepting a valid explicit backup path
  - rejecting an unrelated backup path
  - rejecting a non-matching sibling directory

### 3. Harden non-Windows packaging fallback

- Avoid assembling shell command strings for the Unix `zip` fallback if possible.
- Prefer `execFileSync` or `spawnSync` with explicit argv and `cwd`.
- If a small helper is needed, expose a command-plan builder and test it.
- Add tests that can run on Windows while still proving the non-Windows zip fallback command shape.
- Keep the existing Windows PowerShell behavior unless a minimal safe improvement is needed.

### 4. Correct status records

- Update `PROJECT_TASKS.md` so the post-v1 batch is not marked PM-reviewed until this order passes.
- Current worker order should point to `#017`.
- Keep `PROJECT_TASKS.md` compact.
- Do not add a long log.

## Forbidden Scope

- Do not push.
- Do not tag.
- Do not create a GitHub Release.
- Do not bump `package.json`.
- Do not edit generated files under `adapters/` by hand.
- Do not edit `catalog/skills.yaml`.
- Do not install adapters into real local user skill directories.
- Do not rewrite the installer or packaging system from scratch.
- Do not add dependencies unless absolutely necessary and approved.

## Required Verification

Run all of these after changes:

```powershell
git diff --check
npm run check
npm run test:forward
npm run demo
node tools/pack-release.js
git status --short
git diff --name-only -- source catalog adapters reports
```

Expected results:

- `npm run check` passes.
- `npm run test:forward` passes.
- `npm run demo` passes.
- `node tools/pack-release.js` passes.
- No tracked drift in `source/`, `catalog/`, `adapters/`, or `reports/`.
- `package.json` remains `1.0.0`.
- No push/tag/release happened.

## Completion Criteria

- Restore keeps backup folders intact by default.
- Explicit backup paths are destination-scoped and rejected when unrelated.
- Packaging fallback is safer and test-covered beyond the current OS branch.
- `PROJECT_TASKS.md` accurately reflects that PM review is pending until #017 is verified.
- All required verification commands pass.

## Report Back

Use this shape:

```text
Post-v1 blocker fix:
- branch:
- changed files:
- package version:

Fixes:
- backup preservation:
- explicit backup validation:
- non-Windows packaging fallback:
- PROJECT_TASKS status:

Verification:
- git diff --check:
- npm run check:
- npm run test:forward:
- npm run demo:
- node tools/pack-release.js:
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
