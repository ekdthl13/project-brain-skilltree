# Worker Order

## #010: Publish v1.0.0 GitHub Release Assets

Status: Completed

## Role

Release worker

## Goal

Complete the missing GitHub Release publication for the already-pushed `v1.0.0` tag by creating the GitHub Release and uploading the five expected release assets.

Do not bump versions, create new tags, move the existing tag, or change public contracts.

## Context

- `v1.0.0` release commits and tag already exist.
- Current local `HEAD` / `origin/main`: `8c1fdafb376870670ce571bfac2aa5a85cbdc9df`
- Existing pushed `v1.0.0` tag dereferences to:
  `dd2f38ab856980bb29c4bf85cab8a29587fa663c`
- `package.json` at the tag reports version `1.0.0`.
- GitHub Actions `validate` succeeded for the release-related commits:
  - `b3e3a7c` release preparation commit
  - `dd2f38a` checklist lock / tag target commit
  - `8c1fdaf` task-board follow-up commit
- GitHub Release `v1.0.0` is currently missing:
  `gh release view v1.0.0 --repo ekdthl13/project-brain-skilltree` returned `release not found`.
- Local release assets already exist under `reports/`:
  - `project-brain-skilltree-v1.0.0-adapters.zip`
  - `project-brain-skilltree-v1.0.0-antigravity-skills.zip`
  - `project-brain-skilltree-v1.0.0-codex-skills.zip`
  - `project-brain-skilltree-v1.0.0-claude-code-skills.zip`
  - `release-artifact-checksums.txt`
- Previous publication attempt was blocked by local host `gh` credentials (`HTTP 401 Unauthorized`).

## Required Reads

1. `PROJECT_TASKS.md`
2. `_order.md`
3. `CHANGELOG.md`
4. `docs/RELEASE.md`
5. `reports/release-artifact-checksums.txt`
6. `package.json`

## Tasks

1. Preflight:
   - Run `git status --short`.
   - Confirm current branch is `main`.
   - Confirm local `HEAD` and `origin/main` match.
   - Confirm `v1.0.0^{}` dereferences to `dd2f38ab856980bb29c4bf85cab8a29587fa663c`.
   - Confirm `package.json` version is `1.0.0`.
   - Confirm all five expected local asset files exist under `reports/`.
   - Confirm existing `v0.3.0`, `v0.4.0`, and `v0.5.0` releases/assets are untouched.
2. Credential check:
   - Run `gh auth status` or an equivalent non-mutating auth check.
   - If credentials are still blocked, stop and report the exact blocker. Do not fabricate Release publication.
3. Create GitHub Release:
   - Create GitHub Release `v1.0.0` for the existing tag.
   - Use release notes consistent with `CHANGELOG.md`.
   - Do not create a new tag and do not retag.
4. Upload assets:
   - Upload exactly these five assets:
     - `reports/project-brain-skilltree-v1.0.0-adapters.zip`
     - `reports/project-brain-skilltree-v1.0.0-antigravity-skills.zip`
     - `reports/project-brain-skilltree-v1.0.0-codex-skills.zip`
     - `reports/project-brain-skilltree-v1.0.0-claude-code-skills.zip`
     - `reports/release-artifact-checksums.txt`
5. Verify public release surface:
   - Confirm GitHub Release URL:
     `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v1.0.0`
   - Confirm all five expected assets are present.
   - Confirm checksums listed in `release-artifact-checksums.txt` match the uploaded asset filenames.
   - Confirm raw/main `package.json` reports `1.0.0`.
6. Update `PROJECT_TASKS.md` only after the Release URL and assets are verified.
7. If a task-board update is made, commit and push it after verification.

## Forbidden Scope

- Do not bump `package.json`.
- Do not create a new release tag.
- Do not move, delete, or recreate the existing `v1.0.0` tag.
- Do not edit or replace existing `v0.3.0`, `v0.4.0`, or `v0.5.0` GitHub Releases or assets.
- Do not change `catalog/skills.yaml` schema, fields, or adapter slugs.
- Do not rename or move `source/` folders.
- Do not manually edit generated files under `adapters/`.
- Do not install adapters into real local user skill directories.

## Verification

- `git status --short`
- `gh auth status` or exact credential blocker
- `v1.0.0^{}` tag dereference
- GitHub Release URL exists
- all five expected assets present
- raw/main `package.json` version is `1.0.0`
- `git status --short` after publication/update

## Report Back

Use this shape:

```text
Release publication:
- release URL: https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v1.0.0
- tag target: dd2f38ab856980bb29c4bf85cab8a29587fa663c
- raw/main package version: 1.0.0

Assets:
- adapters zip: project-brain-skilltree-v1.0.0-adapters.zip
- antigravity zip: project-brain-skilltree-v1.0.0-antigravity-skills.zip
- codex zip: project-brain-skilltree-v1.0.0-codex-skills.zip
- claude-code zip: project-brain-skilltree-v1.0.0-claude-code-skills.zip
- checksum file: release-artifact-checksums.txt

Verification:
- git status: M _order.md
- gh auth: active keyring session (GITHUB_TOKEN env bypassed)
- release exists: yes
- assets present: yes (5 assets successfully uploaded)
- older releases untouched: yes

Scope guard:
- version bumped again: no
- tag moved/recreated: no
- older release assets touched: no
- source/catalog/adapters changed: no

If blocked:
- exact blocker: none
- user/action needed: none
```
