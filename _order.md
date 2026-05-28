# Worker Order

## #003: v0.5.0 First Success Demo

Status: Completed - PM accepted on 2026-05-28

## Role

Implementation worker

## Goal

Add a safe first-success demo so a new user can run one command, see the Project Brain Skilltree workflow succeed locally, and understand the next useful commands before any v1.0 contract freeze.

## Context

- Current public baseline is `v0.4.0`:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.4.0`
- External surface verification on 2026-05-28 found no blocking v0.4.1 issue.
- `source/` is canonical.
- `adapters/` are generated artifacts and must not be edited directly.
- v0.5.0 is selected before v1.0.0 stable-contract preparation.
- `PROJECT_TASKS.md` is the compact state board. Keep full worker prompts in `_order.md`.

## Required Reads

1. `PROJECT_TASKS.md`
2. `PRD.md`
3. `README.md`
4. `docs/ROADMAP.md`
5. `docs/INSTALL.md`
6. `docs/QUICKSTART_DESIGN.md`
7. `examples/minimal-project/README.md`
8. `examples/minimal-project/PROJECT_TASKS.md`
9. `package.json`
10. Existing `tools/*.js` and `tools/*.test.js` patterns relevant to CLI scripts

## Tasks

1. Run `npm run check` before editing.
2. Design and implement `npm run demo` as a deterministic local first-success path.
   - Prefer a small Node script such as `tools/run-demo.js` if it matches existing tool patterns.
   - Use `examples/minimal-project` or a temp sandbox as the proof fixture.
   - Do not install anything into user agent directories.
3. The demo must produce clear terminal output:
   - success/failure status;
   - what was verified;
   - the source-of-truth rule (`source/` canonical, `adapters/` generated);
   - recommended next commands such as `npm run check`, `npm run test:forward`, and adapter dry-run install.
4. Add focused automated coverage for the demo script or package script registration.
5. Update README or the most appropriate quickstart/install doc so newcomers see `npm run demo` as the first proof path.
6. Update `PROJECT_TASKS.md` only with short execution results after implementation. Keep long details out of the state board.

## Forbidden Scope

- Do not edit generated files under `adapters/` by hand.
- Do not rename `source/` folders.
- Do not change `catalog/skills.yaml` schema or adapter slugs.
- Do not freeze v1.0.0 contracts in this order.
- Do not bump `package.json` version unless PM explicitly approves.
- Do not create git tags, GitHub Releases, or release assets.
- Do not install adapters into local user directories.
- Do not require network access for the demo.

## Verification

- Run `npm run check`.
- Run `npm run demo`.
- Run `npm run test:forward` only if forward-testing fixtures, runner behavior, or behavioral scenarios change.
- Confirm `git status --short` and explicitly report any generated or modified files.

## Report Back

Use this shape:

```text
Changed files:
- ...

Demo behavior:
- command:
- what it verifies:
- writes outside repo/user directories: yes/no

Verification:
- npm run check: PASS/FAIL
- npm run demo: PASS/FAIL
- npm run test:forward: PASS/FAIL/SKIPPED with reason

Scope guard:
- adapters/: unchanged or rebuilt only by script
- source/ layout: unchanged
- catalog schema/slugs: unchanged
- release tags/assets: unchanged

Deferred risks:
- ...
```

## PM Review Result

- Accepted: `npm run demo` registered in `package.json`.
- Accepted: `tools/run-demo.js` rebuilds adapters, creates an OS-temp sandbox, runs installer safety behavior, validates conflict backup and unrelated skill preservation, and cleans the sandbox on the successful path.
- Accepted: `tools/run-demo.test.js` adds focused coverage for silent execution, invalid repo path handling, and package script registration.
- Accepted: README and `docs/INSTALL.md` now present `npm run demo` as the recommended first proof path.
- PM correction: `PROJECT_TASKS.md` wording was adjusted from minimal-project usage to deterministic sandbox fixture usage to match the implementation.
- Verification: `npm run check` PASS with 52/52 tests, validation passed, audit passed.
- Verification: `npm run demo` PASS when run standalone. A parallel PM run with `npm run check` hit a build-adapter race, so the standalone run is the accepted user path.
- Verification: `npm run test:forward` skipped because no forward-testing fixtures, runner behavior, or behavioral scenarios changed.
- Scope guard: no manual adapter edits, no source layout changes, no catalog schema/slug changes, no version bump, no release tags/assets.
