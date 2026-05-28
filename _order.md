# Worker Order

## #024: v1.1.0 Release Finalization

Status: In progress

## Role

PM release operator.

## Goal

Publish the locally completed post-v1 productization work as `v1.1.0`.

## Release Scope

- Real user scenario examples and clearer README first impression.
- Public "Why This Exists" page.
- GitHub Actions validation matrix for Ubuntu, Windows, and macOS.
- Install/restore CLI help, dry-run, and safety-message polish.
- Active restore CLI regression fix.
- Skill scorecard diagnostic improvements.

## Rules

- Preserve existing `v0.3.0`, `v0.4.0`, `v0.5.0`, and `v1.0.0` tags/assets.
- Do not retag existing releases.
- Run full local release gates before tagging.
- Push `main`, then create and push annotated `v1.1.0` tag.
- Publish GitHub Release only after the tag exists remotely.

## Required Verification

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

## Report Back

```text
v1.1.0 release finalization:
- release commit:
- tag:
- pushed:
- GitHub Release:
- assets:
- CI:
- blockers:
```
