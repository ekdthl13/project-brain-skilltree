# Worker Order

## #027: v1.1.1 Release Execution

Status: Completed

## Role

Release operator.

## Goal

Publish the completed public clarity work as `v1.1.1`, including version metadata, local gates, release commit, push, CI confirmation, annotated tag, GitHub Release, release assets, and post-release tracking update.

## Context

- Latest published release before this order: `v1.1.0`
- Current local work includes:
  - `62f0f67 docs: improve public clarity and trust path`
  - `b09c33a chore: add public clarity completion order`
  - `9661afd docs: complete public clarity trust path`
- Current release candidate: `v1.1.1`
- This is a public clarity/productization patch, not a feature expansion.

## Playbook

Follow `_playbook_v1_1_1_release.md` exactly.

## Required Work

1. Confirm no existing `v1.1.1` tag or release.
2. Apply release metadata for `v1.1.1`.
3. Run full local release gates.
4. Package release assets.
5. Commit release prep.
6. Push `main`.
7. Wait for GitHub Actions validate matrix success.
8. Create and push annotated `v1.1.1` tag.
9. Create GitHub Release and upload 5 assets.
10. Verify release URL, assets, tag dereference, and CI.
11. Commit and push post-release tracking update.

## Hard Rules

- Preserve existing `v0.3.0`, `v0.4.0`, `v0.5.0`, `v1.0.0`, and `v1.1.0` tags and release assets.
- Do not retag, delete, or overwrite existing releases.
- Do not edit generated adapter files by hand.
- Do not change skill slugs, catalog schema, or adapter contracts.
- Stop and report if `v1.1.1` tag or GitHub Release already exists.

## Required Local Verification

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

## Required Remote Verification

```powershell
$env:GITHUB_TOKEN=$null; gh run list --workflow validate.yml --branch main --limit 3 --json databaseId,status,conclusion,headSha,displayTitle,url
$env:GITHUB_TOKEN=$null; gh run watch <databaseId> --exit-status
$env:GITHUB_TOKEN=$null; gh release view v1.1.1 --json tagName,name,url,isDraft,isPrerelease,publishedAt,assets
```

## Report Back

```text
v1.1.1 release execution:
- release prep commit: e69433d336b9fef40a6aa2e4b24a2aeadaafb90d
- post-release commit: d42c530e1ebcf0793617be34125b2eb777265be7
- tag: v1.1.1
- tag dereference: e69433d336b9fef40a6aa2e4b24a2aeadaafb90d
- pushed main: yes
- GitHub Release: https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v1.1.1
- assets uploaded: yes (5 zip/checksum assets)
- local verification: yes (npm run check, test:forward, demo, score:skills, pack-release all passed)
- remote CI: yes (validate.yml run 26563789119 succeeded)
- final git status: clean and aligned with origin/main
- blockers: none
```
