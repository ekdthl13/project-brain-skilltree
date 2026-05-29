# Worker Order #030

Status: Active review order.

## Goal

Review the 총괄-owned `코딩가이드` v1.7.0 refactor and decide whether the
new thin-entry structure preserved the skill's execution capability.

This is a review order, not an implementation order.

## Context

The project paused worker skill edits for #029 because the next step was not
"reduce lines." The 총괄 then directly refactored `코딩가이드` as the first
pattern case:

- `SKILL.md`: thin always-read execution contract
- `REFERENCES.md`: detailed forms, examples, and conditional protocols
- `CHECKLIST.md`: final verification checklist

## Required Reads

- `docs/history/skilltree_capability_audit_2026-05-29.md`
- `source/코딩가이드/SKILL.md`
- `source/코딩가이드/REFERENCES.md`
- `source/코딩가이드/CHECKLIST.md`
- `source/SKILL_INDEX.md`
- `catalog/skills.yaml`

## Review Questions

1. Did the refactor preserve scope control, existing-pattern-first behavior,
   escalation gates, verification requirements, and `_order.md` result reporting?
2. Did any low-frequency detail move to `REFERENCES.md` in a way that makes a
   worker less likely to follow it when needed?
3. Does `CHECKLIST.md` cover the final failure modes that matter most?
4. Are `catalog/skills.yaml`, `source/SKILL_INDEX.md`, and generated adapters in sync?
5. Is this structure safe enough to reuse for `암행어사` or `인스타엔진` later?

## Forbidden Scope

- Do not refactor another skill.
- Do not edit generated `adapters/` directly.
- Do not optimize for shorter text alone.
- Do not change behavior unless a blocking defect is found and the 총괄 approves it.

## Verification

Run and report:

```powershell
npm run check
npm run test:forward
npm run score:skills
git diff --check
```

## Expected Result

Write a concise review result in the section below:

- `PASS`: safe to reuse the pattern, with any minor notes.
- `NEEDS PATCH`: list exact missing or weakened rules and recommended patch.
- `BLOCKED`: explain the missing context or verification failure.

## 작업 결과

Status: PASS

### 1. Review Questions Answer

1. **Did the refactor preserve scope control, existing-pattern-first behavior, escalation gates, verification requirements, and `_order.md` result reporting?**
   - **Yes.** `source/코딩가이드/SKILL.md` (v1.7.0) retains all core concepts. Persona, core attitudes ("지시된 범위만 한다. 스코프 크립은 실패다", "기존 파일과 패턴을 먼저 읽고 따른다"), escalation gates table, STEP 4 verification steps, and STEP 5 result reporting template are clearly defined in `SKILL.md`. Detailed forms and execution templates are cleanly extracted into `REFERENCES.md`, which is directly hyperlinked from `SKILL.md`.

2. **Did any low-frequency detail move to `REFERENCES.md` in a way that makes a worker less likely to follow it when needed?**
   - **No.** The moved details (environment scan details, escalation template formats, error handling code examples, debugging 4-step details, git commit conventions, etc.) are reference-level details that agents consult *conditionally*. Placing them in `REFERENCES.md` reduces token pollution during initial load while keeping them highly discoverable via explicit links. The checklist in `CHECKLIST.md` acts as a final gate, reminding the worker of these exact items before finalizing the order.

3. **Does `CHECKLIST.md` cover the final failure modes that matter most?**
   - **Yes.** It lists the critical failure gates (e.g. bypassing adapter source modification, checking `AGENTS.md` and `_order.md`, avoiding out-of-scope refactoring, verifying builds/tests, ensuring no `TODO` or "// 생략" patterns remain, and correctly updating the `_order.md` results section).

4. **Are `catalog/skills.yaml`, `source/SKILL_INDEX.md`, and generated adapters in sync?**
   - **Yes.**
     - `catalog/skills.yaml` registers `"id": "coding-guide"` with `"version": "1.7.0"`.
     - `source/SKILL_INDEX.md` maps `코딩가이드` to version `v1.7.0` under the Pipeline Skills table.
     - `npm run check` compiles and installs all adapters cleanly, and `npm run diff:adapters` confirms no drifts exist between source and built adapters.

5. **Is this structure safe enough to reuse for `암행어사` or `인스타엔진` later?**
   - **Absolutely.** Reusing the `SKILL.md` (router/core loops) + `REFERENCES.md` (conditional forms/examples) + `CHECKLIST.md` (verification checks) structure for other verbose skills like `암행어사` and `인스타엔진` is highly recommended. It saves significant token usage while keeping verification constraints strict.

### 2. Verification Execution Results

- `npm run check`: **Passed** (All 71 unit tests passed, adapters built, validation passed, and audit report written)
- `npm run test:forward`: **Passed** (6/6 forward tests passed, validating agent safety boundaries like bypass detection, incomplete reporting block, private path leakage check)
- `npm run score:skills`: **Passed** (Wrote scorecard, average quality score improved from `97.5/100` to `98.3/100` due to cleaner lines)
- `git diff --check`: **Passed** (No trailing whitespace or diff issues found)

