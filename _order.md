# Worker Order

## #026: Public Clarity Completion Batch

Status: Ready for worker

## Role

Documentation/productization worker.

## Goal

Complete the remaining public trust path after the first local `v1.1.1` clarity commit, so a new user can move from "I understand why this exists" to "I know how to try it safely in my own environment."

## Context

- Latest published release: `v1.1.0`
- Current local branch includes PM local clarity work and order-planning commits that must not be pushed yet.
- The existing local clarity patch already added the README overview SVG and aligned core trust language.
- This order continues that work locally only.

## Playbook

Follow `_playbook_public_clarity_completion.md`.

## Required Work

Complete the playbook tasks in one local batch:

1. Install/restore preflight clarity.
2. README five-minute safe trial route.
3. Release notes trust-language template.
4. Public clarity checklist.
5. State board and worker report update.

## Hard Rules

- Do not commit.
- Do not push.
- Do not tag.
- Do not publish a GitHub Release.
- Do not package release assets.
- Do not bump `package.json`.
- Do not edit generated files under `adapters/` by hand.
- Keep changes documentation-focused unless validation proves a tiny tooling correction is required.

## Required Verification

```powershell
git diff --check
npm run check
npm run demo
git diff --name-only -- source catalog adapters reports
git status --short --branch
```

If forward-testing files or behavior change, also run:

```powershell
npm run test:forward
```

## Report Back

```text
public clarity completion batch:
- branch/state:
- base local commit:
- files changed:
- install/restore preflight:
- README five-minute route:
- release notes trust template:
- public clarity checklist:
- state board/order updated:
- validation:
- source/catalog/adapters/reports drift:
- committed: no
- pushed: no
- blockers:
- PM review recommendation:
```

## After This Order

PM will inspect the worker diff, run or verify checks, make any final corrections, and only then issue a separate release execution order for commit, push, tag, GitHub Release, and release asset publication.
