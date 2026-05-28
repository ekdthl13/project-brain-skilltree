# Worker Order

## #009: v1.0.0 Release Preparation and Publication

Status: Ready for implementation

## Role

Release worker

## Goal

Prepare, publish, and verify the official `v1.0.0` stable release for Project Brain Skilltree.

This order is authorized to bump the version, create the `v1.0.0` git tag, package release assets, publish the GitHub Release, and verify the release surface. It must not change public contracts beyond the already approved pre-v1 freeze.

## Context

- Latest public release before this order is `v0.5.0`:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.5.0`
- Pre-v1 hardening baseline is integrated into `main`:
  - commit: `4674f49b5195db03f065908ef823798539966426`
  - message: `chore: harden pre-v1 contract and sandbox gates`
  - GitHub Actions `validate`: completed successfully on `main`
- Worker Order #008 produced a PM-accepted `GO` recommendation for v1.0.0 release preparation.
- PM correction: release-gate checkboxes in `docs/v1_freeze_checklist.md` must be checked only after evidence exists on the actual v1.0.0 release candidate / release commit.
- `source/` is canonical.
- `adapters/` are generated artifacts and must not be edited directly.

## Required Reads

1. `PROJECT_TASKS.md`
2. `_order.md`
3. `package.json`
4. `CHANGELOG.md`
5. `README.md`
6. `docs/v1_freeze_checklist.md`
7. `docs/RELEASE.md`
8. `docs/ADAPTER_CONTRACT.md`
9. `docs/SCHEMA_STABILITY.md`
10. `docs/INSTALL.md`
11. `tools/pack-release.js`
12. `tools/prepare-release.js` if present

## Tasks

1. Preflight:
   - Run `git status --short` before editing.
   - Confirm current branch is `main`.
   - Confirm local `HEAD` and `origin/main` match.
   - Confirm current `package.json` version is `0.5.0`.
   - Confirm existing `v0.3.0`, `v0.4.0`, and `v0.5.0` tags/releases/assets are not modified.
2. Version and release notes:
   - Bump `package.json` from `0.5.0` to `1.0.0`.
   - Add a `## [1.0.0] - 2026-05-28` entry to `CHANGELOG.md`.
   - Summarize v1.0.0 as stable contract freeze / first stable release, not as a new skill expansion.
   - Mention the stable catalog contract, adapter layout/frontmatter validation, installer safety, sandboxed demo, forward-testing, rollback documentation, and release asset packaging.
3. Final release-candidate local gates:
   - Run `git diff --check`.
   - Run `npm run check`.
   - Run `npm run test:forward`.
   - Run `npm run demo`.
   - Run `node tools/pack-release.js`.
   - Confirm no leftover `project-brain-sandbox-*` temp folders remain.
4. Release checklist:
   - Update `docs/v1_freeze_checklist.md` only after evidence exists.
   - Check local release-gate boxes only after the v1.0.0 candidate gates pass.
   - Check CI Pipeline only after the pushed release commit or tag has successful GitHub Actions validation.
5. Commit:
   - Stage only intended release files.
   - Suggested commit message: `release: v1.0.0 stable contract freeze`
   - Commit the release preparation.
6. Push and CI:
   - Push `main` to `origin/main`.
   - Verify GitHub Actions `validate` for the pushed release commit.
   - If CI fails or cannot be verified, stop before publishing the GitHub Release and report the blocker.
7. Tag:
   - Create annotated tag `v1.0.0` pointing to the release commit.
   - Push tag `v1.0.0`.
   - Confirm `v1.0.0^{}` dereferences to the release commit.
8. Publish GitHub Release:
   - Create GitHub Release `v1.0.0`.
   - Use release notes consistent with `CHANGELOG.md`.
   - Upload the release assets produced by `node tools/pack-release.js`:
     - `project-brain-skilltree-v1.0.0-adapters.zip`
     - `project-brain-skilltree-v1.0.0-antigravity-skills.zip`
     - `project-brain-skilltree-v1.0.0-codex-skills.zip`
     - `project-brain-skilltree-v1.0.0-claude-code-skills.zip`
     - `release-artifact-checksums.txt`
9. Post-release verification:
   - Confirm remote `main` points to the release commit.
   - Confirm tag `v1.0.0` points to the release commit.
   - Confirm GitHub Release URL is reachable.
   - Confirm all 5 expected assets are present.
   - Confirm GitHub raw `main` `package.json` reports `1.0.0`.
   - Confirm local `git status --short` is clean.
10. Update `PROJECT_TASKS.md` with a short release completion summary after publication.

## Forbidden Scope

- Do not change `catalog/skills.yaml` schema, fields, or adapter slugs.
- Do not rename or move `source/` folders.
- Do not manually edit generated files under `adapters/`.
- Do not install adapters into real local user skill directories.
- Do not perform physical Core / Domain / Personal restructuring.
- Do not edit or replace existing `v0.3.0`, `v0.4.0`, or `v0.5.0` release assets.
- Do not publish the GitHub Release if CI on the release commit fails or cannot be verified.

## Verification

- `git status --short`
- `git diff --check`
- `npm run check`
- `npm run test:forward`
- `npm run demo`
- `node tools/pack-release.js`
- no leftover `project-brain-sandbox-*` temp folders
- pushed release commit SHA
- GitHub Actions `validate` result
- `v1.0.0^{}` tag dereference
- GitHub Release URL
- 5 expected release assets present
- raw/main `package.json` version is `1.0.0`

## Report Back

Use this shape:

```text
Release:
- version:
- commit SHA:
- tag:
- release URL:

Local gates:
- git diff --check:
- npm run check:
- npm run test:forward:
- npm run demo:
- node tools/pack-release.js:
- sandbox leftovers:

Remote verification:
- origin/main:
- v1.0.0 tag dereference:
- GitHub Actions validate:
- raw/main package version:

Assets:
- adapters zip:
- antigravity zip:
- codex zip:
- claude-code zip:
- checksum file:

Scope guard:
- catalog schema/slugs changed: yes/no
- source layout changed: yes/no
- adapters manually edited: yes/no
- real local user skill dirs touched: yes/no
- older release assets touched: yes/no

Deferred after v1:
- ...
```
