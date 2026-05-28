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
- branch/state: main...origin/main [ahead 2]
- base local commit: b09c33ad9a32c9d9f912a5583c3ae5abb06121dc
- files changed: docs/INSTALL.md, README.md, docs/RELEASE_NOTES_TEMPLATE.md, docs/PUBLIC_CLARITY_CHECKLIST.md, PROJECT_TASKS.md, _order.md
- install/restore preflight: added compact safety checklist in docs/INSTALL.md
- README five-minute route: added 4-step trial route in README.md
- release notes trust template: created docs/RELEASE_NOTES_TEMPLATE.md
- public clarity checklist: created docs/PUBLIC_CLARITY_CHECKLIST.md
- state board/order updated: checked off milestone in PROJECT_TASKS.md, updated _order.md
- validation: git diff --check PASS, npm run check PASS (71 tests), npm run demo PASS, git status reviewed
- source/catalog/adapters/reports drift: none reported by worker; PM recheck required before release order
- committed: no
- pushed: no
- blockers: none
- PM review recommendation: GO (all public clarity completion batch deliverables are verified locally and ready for review/commit)
```

## After This Order

PM will inspect the worker diff, run or verify checks, make any final corrections, and only then issue a separate release execution order for commit, push, tag, GitHub Release, and release asset publication.
