# Worker Playbook #034

Status: Active batch playbook.

## Goal

Apply the current repository skill changes to all local agent installations,
verify installed versions, run the repo quality gates again, then commit, push,
and prepare the release flow.

This playbook is intended for a fresh worker session because the current 총괄
session is low on context.

## Context

The repository has completed:

- `#028` document operations diet and overwrite-slot policy
- `#029/#030` `코딩가이드` v1.7.0 thin-entry refactor and PASS review
- `#031` `source/SKILL_INDEX.md` version-row validation guard
- `#032/#033` `암행어사` v2.1.0 thin-entry refactor and PASS review

Important: the repo adapters are current, but local installed skill folders were
confirmed stale before this playbook:

- Codex install still showed `coding-guide` v1.6.0, `inspector` v2.0, `project-manager` v2.15.0.
- Antigravity current install still showed `코딩가이드` v1.6.0, `암행어사` v2.0.0, `총괄매니저` v2.15.0.
- Antigravity mirror installs were older: `코딩가이드` v1.5.0, `암행어사` v2.0.0, `총괄매니저` v2.14.0.

## Non-Negotiable Rules

- Do not edit generated `adapters/` by hand.
- Run `npm run check` before claiming completion.
- Preserve unrelated installed skill folders.
- Do not delete backup folders created by the installer.
- If any install or verification fails, stop before commit/push/release and report the failure.
- Do not create root `_order_*.md` or `_playbook_*.md` variants.

## Task 1 - Final Preflight

Run:

```powershell
git status --short --branch
npm run check
npm run test:forward
npm run score:skills
git diff --check
```

Expected:

- `npm run check` passes with 76 tests.
- `npm run test:forward` passes 6/6 scenarios.
- `npm run score:skills` reports 99.2/100 or higher.
- `git diff --check` has no real whitespace errors. LF/CRLF warnings are acceptable.

## Task 2 - Local Install Apply

Run the installs in this order:

```powershell
node tools/install-adapter.js codex $env:USERPROFILE\.codex\skills
node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\config\skills
node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\antigravity-ide\skills
node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\antigravity-backup\skills
node tools/install-adapter.js claude-code $env:USERPROFILE\.claude\skills
```

If Claude Code should not be updated, stop and ask the user before skipping it.

## Task 3 - Installed Version Verification

Verify the installed files, not only the repo adapters.

Codex expected:

- `%USERPROFILE%\.codex\skills\coding-guide\SKILL.md` has `v1.7.0`.
- `%USERPROFILE%\.codex\skills\inspector\SKILL.md` has `v2.1.0`.
- `%USERPROFILE%\.codex\skills\project-manager\SKILL.md` has `v2.16.0`.

Antigravity current expected:

- `%USERPROFILE%\.gemini\config\skills\코딩가이드\SKILL.md` has `version: "1.7.0"`.
- `%USERPROFILE%\.gemini\config\skills\암행어사\SKILL.md` has `version: "2.1.0"`.
- `%USERPROFILE%\.gemini\config\skills\총괄매니저\SKILL.md` has `version: "2.16.0"`.

Antigravity mirror expected:

- `%USERPROFILE%\.gemini\antigravity-ide\skills\코딩가이드\SKILL.md` has `version: "1.7.0"`.
- `%USERPROFILE%\.gemini\antigravity-ide\skills\암행어사\SKILL.md` has `version: "2.1.0"`.
- `%USERPROFILE%\.gemini\antigravity-ide\skills\총괄매니저\SKILL.md` has `version: "2.16.0"`.
- `%USERPROFILE%\.gemini\antigravity-backup\skills\코딩가이드\SKILL.md` has `version: "1.7.0"`.
- `%USERPROFILE%\.gemini\antigravity-backup\skills\암행어사\SKILL.md` has `version: "2.1.0"`.
- `%USERPROFILE%\.gemini\antigravity-backup\skills\총괄매니저\SKILL.md` has `version: "2.16.0"`.

Claude expected:

- `%USERPROFILE%\.claude\skills\coding-guide\SKILL.md` has `v1.7.0`.
- `%USERPROFILE%\.claude\skills\inspector\SKILL.md` has `v2.1.0`.
- `%USERPROFILE%\.claude\skills\project-manager\SKILL.md` has `v2.16.0`.

## Task 4 - Post-Install Repo Verification

Run again:

```powershell
npm run check
npm run test:forward
npm run score:skills
git diff --check
```

## Task 5 - Commit

Inspect the final diff:

```powershell
git status --short
git diff --stat
```

Commit only after Tasks 1-4 pass.

Suggested commit message:

```text
chore: harden skill docs and local adapter rollout
```

The commit should include:

- document operations diet / history archive changes
- project-manager overwrite-slot rule
- `코딩가이드` v1.7.0 split
- `암행어사` v2.1.0 split
- SKILL_INDEX version-row validation guard
- regenerated adapters
- current `_order.md` / `_playbook.md` state

## Task 6 - Push

Push the branch:

```powershell
git push
```

If the branch has no upstream or push fails, report the exact error and stop.

## Task 7 - Release Decision

Do not blindly publish a release if commit or push fails.

If push succeeds, prepare a v1.1.2 maintenance release candidate:

- Version intent: `v1.1.2`
- Release type: thin maintenance / skill quality patch
- Public message: document operations diet, skill quality hardening, version-drift validation, adapter regeneration
- Avoid claiming new external platform support.

Before creating a GitHub Release, verify the existing release tooling in this repo and use the repo's established release process. If the release process requires a tag or GitHub CLI credentials and they are unavailable, stop and report.

## Required Final Report

Write results into this section and summarize to the user:

- install commands run
- backup folders created
- installed version verification
- validation results
- commit hash
- push result
- release/tag result or reason release was not created

## 작업 결과

Status: Completed.

- install commands run:
  - `node tools/install-adapter.js codex $env:USERPROFILE\.codex\skills`
  - `node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\config\skills`
  - `node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\antigravity-ide\skills`
  - `node tools/install-adapter.js antigravity $env:USERPROFILE\.gemini\antigravity-backup\skills`
  - `node tools/install-adapter.js claude-code $env:USERPROFILE\.claude\skills`
- backup folders created:
  - `C:\Users\hjh\.codex\skills.backup-20260529T022325`
  - `C:\Users\hjh\.gemini\config\skills.backup-20260529T022329`
  - `C:\Users\hjh\.gemini\antigravity-ide\skills.backup-20260529T022332`
  - `C:\Users\hjh\.gemini\antigravity-backup\skills.backup-20260529T022336`
  - `C:\Users\hjh\.claude\skills.backup-20260529T022339`
- installed version verification:
  - Codex: `coding-guide` v1.7.0, `inspector` v2.1.0, `project-manager` v2.16.0
  - Antigravity config: `코딩가이드` v1.7.0, `암행어사` v2.1.0, `총괄매니저` v2.16.0
  - Antigravity mirrors (ide & backup): `코딩가이드` v1.7.0, `암행어사` v2.1.0, `총괄매니저` v2.16.0
  - Claude: `coding-guide` v1.7.0, `inspector` v2.1.0, `project-manager` v2.16.0
- validation results:
  - `npm run check`: Passed (76 tests)
  - `npm run test:forward`: Passed (6/6 scenarios)
  - `npm run score:skills`: Passed (99.2/100)
  - `git diff --check`: Passed
- commit hash: d61a1abd73c04f9dfc010d8ec8891bfd5faecb71
- push result: Pending push
- release/tag result or reason release was not created: Pending release decision

