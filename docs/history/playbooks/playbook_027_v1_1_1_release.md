# v1.1.1 Release Execution Playbook

## Purpose

Publish the local public clarity work as `v1.1.1`.

This release is a documentation/productization patch. It should not add new features, new skills, schema changes, adapter contract changes, or source/adapters restructuring.

## Release Scope

`v1.1.1` should include:

- README overview graphic and public trust proof language.
- README five-minute safe trial route.
- Install/restore preflight safety checklist.
- WHY, SCENARIOS, and INSTALL trust-language alignment.
- Release notes trust-language template.
- Public clarity checklist.

## Hard Rules

- Preserve existing `v0.3.0`, `v0.4.0`, `v0.5.0`, `v1.0.0`, and `v1.1.0` tags and GitHub Release assets.
- Do not retag any existing release.
- Do not edit generated adapter files by hand.
- Do not change skill slugs, catalog schema, adapter layout, or installer behavior unless a validation blocker proves it is necessary.
- If `v1.1.1` tag or GitHub Release already exists, stop and report. Do not overwrite or delete without explicit PM/user approval.

## Phase 1: Preflight

Run:

```powershell
git status --short --branch
git tag --list v1.1.1
$env:GITHUB_TOKEN=$null; gh release view v1.1.1 --json tagName,name,url,isDraft,isPrerelease,assets
```

Expected:

- branch is `main`
- working tree is clean
- local branch may be ahead of `origin/main` with local clarity/order commits
- no `v1.1.1` tag
- `gh release view v1.1.1` reports release not found

If the release view command returns "release not found", continue. If it returns an existing release, stop.

## Phase 2: Release Metadata Patch

Update release-facing metadata:

- `package.json`: set `"version": "1.1.1"`.
- `README.md`:
  - release badge/link should point to `v1.1.1`.
  - current public baseline should say latest stable release `v1.1.1`.
- `CHANGELOG.md`:
  - add `## [1.1.1] - 2026-05-28`.
  - include public clarity, install safety checklist, README five-minute route, release notes template, and public clarity checklist.
- `docs/INSTALL.md`:
  - example transcript should show `project-brain-skilltree@1.1.1 check`.
- `docs/ROADMAP.md`:
  - add a short completed `v1.1.1 (Public Clarity Patch)` milestone summary.
- `PROJECT_TASKS.md`:
  - mark `v1.1.1` as release candidate / in release finalization.
- `_order.md`:
  - keep the active `#027` order and leave the report block ready for final release details.

Do not modify `source/`, `catalog/`, or `adapters/` unless validation forces it.

## Phase 3: Full Local Release Gates

Run:

```powershell
git diff --check
npm run check
npm run test:forward
npm run demo
npm run score:skills
node tools/pack-release.js
git diff --name-only -- source catalog adapters reports
git status --short --branch
```

Expected:

- `git diff --check`: pass
- `npm run check`: pass, 71 tests
- `npm run test:forward`: pass, 6/6 scenarios
- `npm run demo`: pass
- `npm run score:skills`: pass
- `node tools/pack-release.js`: creates 5 ignored release artifacts for `v1.1.1`
- `git diff --name-only -- source catalog adapters reports`: no output

## Phase 4: Release Prep Commit and Push

Stage only intended tracked files.

Recommended tracked files:

- `package.json`
- `README.md`
- `CHANGELOG.md`
- `docs/INSTALL.md`
- `docs/ROADMAP.md`
- `PROJECT_TASKS.md`
- `_order.md`

Then commit and push:

```powershell
git add package.json README.md CHANGELOG.md docs/INSTALL.md docs/ROADMAP.md PROJECT_TASKS.md _order.md
git commit -m "release: v1.1.1 public clarity"
git push origin main
```

Do not add ignored files from `reports/`.

## Phase 5: Remote CI Confirmation

Find the latest validate run for the pushed release commit:

```powershell
$env:GITHUB_TOKEN=$null; gh run list --workflow validate.yml --branch main --limit 3 --json databaseId,status,conclusion,headSha,displayTitle,url
```

Watch the run:

```powershell
$env:GITHUB_TOKEN=$null; gh run watch <databaseId> --exit-status
```

Required result:

- GitHub Actions `validate` passes on Ubuntu, Windows, and macOS.

If CI fails, inspect logs, fix only the root cause, rerun local relevant gates, commit, push, and recheck CI before tagging.

## Phase 6: Tag and Push

After CI passes, tag the exact release commit:

```powershell
git rev-parse HEAD
git tag -a v1.1.1 -m "v1.1.1 public clarity"
git push origin v1.1.1
git rev-parse "v1.1.1^{}"
```

The tag dereference must match the intended release commit.

## Phase 7: GitHub Release and Assets

Create the release with the 5 generated assets:

```powershell
$env:GITHUB_TOKEN=$null; gh release create v1.1.1 `
  "reports/project-brain-skilltree-v1.1.1-adapters.zip" `
  "reports/project-brain-skilltree-v1.1.1-antigravity-skills.zip" `
  "reports/project-brain-skilltree-v1.1.1-codex-skills.zip" `
  "reports/project-brain-skilltree-v1.1.1-claude-code-skills.zip" `
  "reports/release-artifact-checksums.txt" `
  --title "v1.1.1 Public Clarity Patch" `
  --notes "Public clarity patch for Project Brain Skilltree. Adds a README overview graphic, a five-minute safe trial route, install/restore preflight guidance, release note trust-language template, and public clarity checklist. Verified with npm run check, npm run test:forward, npm run demo, npm run score:skills, node tools/pack-release.js, and GitHub Actions validate on Ubuntu, Windows, and macOS."
```

Then verify:

```powershell
$env:GITHUB_TOKEN=$null; gh release view v1.1.1 --json tagName,name,url,isDraft,isPrerelease,publishedAt,assets
```

Required assets:

- `project-brain-skilltree-v1.1.1-adapters.zip`
- `project-brain-skilltree-v1.1.1-antigravity-skills.zip`
- `project-brain-skilltree-v1.1.1-codex-skills.zip`
- `project-brain-skilltree-v1.1.1-claude-code-skills.zip`
- `release-artifact-checksums.txt`

## Phase 8: Post-Release Tracking Commit

After the GitHub Release is verified, update:

- `PROJECT_TASKS.md`: latest published release `v1.1.1`, release URL, release commit, latest remote CI.
- `_order.md`: mark `#027` completed and fill exact release report.

Run:

```powershell
git diff --check
git status --short --branch
```

Commit and push:

```powershell
git add PROJECT_TASKS.md _order.md
git commit -m "chore: complete v1.1.1 release publication"
git push origin main
```

Do not move the `v1.1.1` tag after this post-release tracking commit.

## Required Final Report

```text
v1.1.1 release execution:
- release prep commit:
- post-release commit:
- tag:
- tag dereference:
- pushed main:
- GitHub Release:
- assets uploaded:
- local verification:
- remote CI:
- final git status:
- blockers:
```
