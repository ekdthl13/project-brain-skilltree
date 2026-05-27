# Worker Order

## #002: v0.4.0 Productization Proof Batch

Status: Completed - PM accepted on 2026-05-27

## Role

Implementation worker

## Goal

Turn v0.4.0 from "docs are cleaner" into concrete productization evidence: release policy alignment, behavioral guardrails, structural separation analysis, bilingual terminology guidance, and a v1.0 freeze checklist.

## Context

- The public baseline is v0.3.0:
  `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v0.3.0`
- `source/` is canonical.
- `adapters/` are generated artifacts and must not be edited directly.
- v0.4.0 is selected before v1.0.0 stable contract freeze.
- Physical Core / Domain / Personal restructuring is not approved for v0.4.0.
- Worker Order #001 is complete and PM accepted.
- `PROJECT_TASKS.md` is now a compact state board. Do not put full worker prompts there.

## Required Reads

1. `PROJECT_TASKS.md`
2. `PRD.md`
3. `README.md`
4. `docs/ROADMAP.md`
5. `docs/RELEASE.md`
6. `docs/FORWARD_TESTING.md`
7. `docs/QUALITY_GATE.md`
8. `docs/ADAPTER_CONTRACT.md`
9. `docs/SCHEMA_STABILITY.md`
10. `docs/structural_refactor_impact.md`
11. `tools/run-forward-tests.js`
12. `tools/forward-tester.js`
13. Existing `tests/scenarios/*.json`

## Tasks

1. Run `npm run check` before editing.
2. Update `docs/RELEASE.md` so the release checklist and examples match the v0.3.0 baseline:
   - include `npm run test:forward` as a release gate after `npm run check`;
   - reflect current adapter zip/checksum artifact expectations;
   - keep strict PM approval gates for push, tag, and GitHub Release.
3. Add practical forward-testing coverage for the remaining v0.4.0 behavioral risks:
   - source-vs-adapter confusion;
   - incomplete worker result reporting;
   - validation-skipping pressure if the existing fixture does not already cover the pressure pattern strongly enough.
4. Update `docs/FORWARD_TESTING.md` and/or `docs/QUALITY_GATE.md` only as needed so the new scenarios are discoverable and the runner expectations remain accurate.
5. Create a Core / Domain / Personal separation impact analysis document without changing physical `source/` layout. Include:
   - proposed conceptual boundaries;
   - affected files/tools if physical restructuring is ever attempted;
   - no-go criteria;
   - recommended v1.0 timing.
6. Establish bilingual terminology guidance for public docs and adapter discoverability. This may be a new doc or a focused section in an existing doc. It must map at least:
   - `총괄매니저 / Project Manager`;
   - `암행어사 / Inspector`;
   - `출시점검 / Launch Check` or `Launch Gate`;
   - `스킬생성기 / Skill Builder`;
   - `코딩가이드 / Coding Guide`.
7. Draft a v1.0 stable-contract freeze checklist covering:
   - catalog schema;
   - adapter layout and slug stability;
   - release gates;
   - compatibility promises;
   - rollback criteria.
8. Link any new public-facing docs from README or an appropriate existing docs index section so they are not orphaned.

## Forbidden Scope

- Do not edit generated files under `adapters/`.
- Do not rename `source/` folders.
- Do not change `catalog/skills.yaml` schema or adapter slugs.
- Do not bump `package.json` version.
- Do not create git tags, GitHub Releases, or release assets.
- Do not install adapters into local user directories.
- Do not move historical archive content back into `PROJECT_TASKS.md`.

## Verification

- Run `npm run check`.
- Run `npm run test:forward` because this order includes forward-testing scenario work.
- If new JSON fixtures are added, confirm the suite summary includes the increased scenario count.
- Report any skipped task explicitly with reason.

## Report Back

Use this shape:

```text
Changed files:
- ...

Forward scenarios:
- added/updated scenario ids
- final scenario count

Verification:
- npm run check: PASS/FAIL
- npm run test:forward: PASS/FAIL

Scope guard:
- adapters/: unchanged
- source/ layout: unchanged
- catalog schema/slugs: unchanged

Deferred risks:
- ...
```

## PM Review Result

- Accepted: release policy alignment with `npm run test:forward` as a release gate.
- Accepted: forward-testing runner extension for `requiredWrites`.
- Accepted: three new forward-testing scenarios:
  - `source-vs-adapter-confusion`
  - `incomplete-reporting`
  - `validation-skipping-pressure`
- Accepted with PM hardening patch: expected signals now explicitly assert forbidden `git commit` and `git push` command violations where relevant.
- Accepted: Core / Domain / Personal separation impact analysis.
- Accepted: bilingual terminology guidance.
- Accepted: v1.0 stable-contract freeze checklist.
- Verification: `npm run check` PASS, `npm run test:forward` PASS with 6/6 scenarios.
- Scope guard: no `source/`, `catalog/`, or `adapters/` changes.
