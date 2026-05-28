# Worker Order

## #007: Integrate Pre-v1 Hardening Baseline

Status: Ready for implementation

## Role

Implementation worker

## Goal

Integrate the PM-accepted #005 and #006 pre-v1 hardening changes into the remote main baseline, confirm CI, and leave the project ready for a separate v1.0.0 release-candidate decision.

This is not the v1.0.0 release order.

## Context

- Latest public release is `v0.5.0`:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.5.0`
- PM accepted Worker Order #005 after fresh verification:
  - `git diff --check`: PASS
  - `npm run check`: PASS, 54 tests
  - `npm run test:forward`: PASS, 6/6 scenarios
  - `npm run demo`: PASS
  - `node tools/pack-release.js`: PASS
- PM accepted Worker Order #006 after fresh verification:
  - `git diff --check`: PASS
  - `npm run check`: PASS, 55 tests
  - `npm run test:forward`: PASS, 6/6 scenarios
  - `npm run demo`: PASS
  - no leftover `project-brain-sandbox-*` temp folders found after verification
- The current working tree contains accepted pre-v1 hardening changes across docs and tools.
- `source/` is canonical.
- `adapters/` are generated artifacts and must not be edited directly.

## Required Reads

1. `PROJECT_TASKS.md`
2. `_order.md`
3. `docs/v1_freeze_checklist.md`
4. `docs/INSTALL.md`
5. `docs/RELEASE.md`
6. `tools/validate-skilltree.js`
7. `tools/install-adapter.test.js`
8. `tools/lib/sandbox.js`
9. `tools/sandbox.test.js`
10. `tools/run-demo.js`
11. `tools/forward-tester.js`
12. `tools/pack-release.js`
13. `tools/schema-stability.test.js`
14. `package.json`

## Tasks

1. Run `git status --short` before editing.
2. Confirm the current branch and remote baseline:
   - identify the current branch;
   - identify `HEAD`;
   - identify `origin/main`;
   - report whether the working tree contains only the accepted #005/#006 hardening files.
3. Scope review:
   - Expected accepted files include:
     - `PROJECT_TASKS.md`
     - `_order.md`
     - `docs/INSTALL.md`
     - `docs/RELEASE.md`
     - `docs/v1_freeze_checklist.md`
     - `tools/forward-tester.js`
     - `tools/install-adapter.test.js`
     - `tools/lib/sandbox.js`
     - `tools/pack-release.js`
     - `tools/run-demo.js`
     - `tools/sandbox.test.js`
     - `tools/schema-stability.test.js`
     - `tools/validate-skilltree.js`
   - If unrelated files appear, stop and report before staging.
4. Run final local gates before commit:
   - `git diff --check`
   - `npm run check`
   - `npm run test:forward`
   - `npm run demo`
   - `node tools/pack-release.js`
5. Update `PROJECT_TASKS.md` with a short #007 execution summary only after the gates pass.
6. Commit the accepted pre-v1 hardening baseline:
   - Suggested commit message: `chore: harden pre-v1 contract and sandbox gates`
7. Push the commit to `origin/main`.
8. Confirm GitHub Actions `validate` status for the pushed commit.
   - If network/auth blocks CI verification, report the exact blocker and do not claim CI success.
9. Recommend the next PM decision:
   - If local gates and CI pass, recommend a separate `#008` v1.0.0 release-candidate readiness order.
   - If anything fails, recommend a focused fix order instead.

## Forbidden Scope

- Do not bump `package.json` to `1.0.0`.
- Do not create git tags.
- Do not create or edit GitHub Releases.
- Do not upload release assets.
- Do not change `catalog/skills.yaml` schema, fields, or adapter slugs.
- Do not rename or move `source/` folders.
- Do not manually edit generated files under `adapters/`.
- Do not install adapters into real local user skill directories.
- Do not perform physical Core / Domain / Personal restructuring.
- Do not rewrite release packaging to full cross-platform support.

## Verification

- `git diff --check`
- `npm run check`
- `npm run test:forward`
- `npm run demo`
- `node tools/pack-release.js`
- `git status --short`
- pushed commit SHA
- GitHub Actions `validate` result for the pushed commit

## Report Back

Use this shape:

```text
Changed files integrated:
- ...

Local verification:
- git diff --check: PASS/FAIL
- npm run check: PASS/FAIL
- npm run test:forward: PASS/FAIL
- npm run demo: PASS/FAIL
- node tools/pack-release.js: PASS/FAIL

Git integration:
- branch:
- commit SHA:
- pushed to origin/main: yes/no
- GitHub Actions validate: PASS/FAIL/BLOCKED with reason

Scope guard:
- version bumped to 1.0.0: yes/no
- tag/release/assets created: yes/no
- catalog schema/slugs changed: yes/no
- source layout changed: yes/no
- adapters manually edited: yes/no
- real local user skill dirs touched: yes/no

Recommended next order:
- ...
```
