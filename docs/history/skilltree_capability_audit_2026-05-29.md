# Skilltree Capability Audit Report

- Date: 2026-05-29
- Mode: 암행어사 Mode D + capability/cost audit
- Canonical root: `source/`
- Scanned skills: 12
- Adapter targets checked: Antigravity, Codex, Claude Code
- Purpose: decide whether to refactor skills only after understanding current capability, token cost, loading burden, judgment support, and over-control risk.

## Executive Judgment

Do not start by reducing `코딩가이드`.

The current skill system is already capable. The problem is not lack of rules. The main risks are:

1. some skills carry too much detail in the always-read entry point,
2. some rules are phrased as absolute control where judgment criteria would be better,
3. version/router drift can happen even when `npm run check` passes,
4. the repo has no explicit capability/cost score, only structural quality score.

The correct next move is a capability-preserving refactor pattern, led by 총괄, not a worker-driven line-count cleanup.

## What The System Can Do Now

| Capability | Current State | Evidence |
|------------|---------------|----------|
| Source-of-truth discipline | Strong | `source/` is canonical and adapters are generated. |
| Multi-agent portability | Strong | Catalog builds Antigravity, Codex, and Claude Code adapters. |
| Operating roles | Strong | 총괄, 작업자, 감찰, 출시점검, domain engines are separated. |
| Validation discipline | Strong | `npm run check`, forward tests, demo, scorecard all exist. |
| Skill creation/update discipline | Strong but verbose | 스킬생성기 has generation, pressure scenario, index sync rules. |
| Skill audit capability | Present | 암행어사 Mode D audits canonical, router, version, trigger, output, conflict, reference, size, adapter risk. |
| Token discipline | Partial | 총괄매니저 and 블로그엔진 model selective loading; other long skills still require too much first-pass reading. |
| Judgment support | Mixed | 총괄매니저 is judgment-oriented; 코딩가이드 and 암행어사 lean heavily into mandatory rules. |

## Quantitative Snapshot

| Skill | Lines | Support Files | Capability Read |
|-------|-------|---------------|-----------------|
| 블로그엔진 | 189 | REFERENCES, CHECKLIST | Best current thin-entry pattern. Details live outside `SKILL.md`. |
| 총괄매니저 | 391 | REFERENCES, CHECKLIST, templates | Acceptable after v2.16.0, but close to the threshold. |
| 인스타엔진 | 423 | REFERENCES, CHECKLIST | Over threshold. Has support files but still carries too many engine details in entry point. |
| 암행어사 | 471 | CHECKLIST | Over threshold. Strong audit brain, but multiple modes are packed into one entry point. |
| 코딩가이드 | 488 | REFERENCES | Over threshold. Most important execution contract, but always-read burden is high. |

`npm run score:skills` reports an average score of 97.5/100. The only structural line-count candidates are `암행어사`, `인스타엔진`, and `코딩가이드`.

## Critical Findings

### 1. Router/version drift is possible despite green checks

Finding: 총괄매니저 was bumped to v2.16.0 in source/catalog, but `source/SKILL_INDEX.md` still referenced v2.15.0.

Impact:
- A future session reading the router could believe an older manager skill is current.
- This undermines the router as the first source of skill selection truth.

Action taken:
- Updated `source/SKILL_INDEX.md` to v2.0.8 and synced 총괄매니저 to v2.16.0.
- Rebuild adapters after this report.

Follow-up:
- Add or extend validation so `SKILL_INDEX.md` versions are checked against `catalog/skills.yaml`.

### 2. "Read the entire SKILL.md" is expensive for large multi-mode skills

Finding: 암행어사 requires reading the entire `SKILL.md`, while the same file is 471 lines and contains four modes.

Impact:
- The rule protects correctness, but the token cost is high.
- Long mode-specific sections compete for attention even when only one mode is needed.

Recommendation:
- Keep Mode D in `SKILL.md` as a short routing entry.
- Move detailed Mode A/B/C/D report templates and examples into `REFERENCES.md`.
- Keep the attack vectors and hard-fail checklist visible in the entry point.

### 3. 코딩가이드 is powerful but too broad for an always-read worker entry

Finding: `코딩가이드/SKILL.md` contains environment scan, framework verification, TDD rules, output bans, design tokens, error handling, debugging, sanitation, git, component rules, reporting, and skill links in one 488-line entry.

Impact:
- It prevents many real worker failures.
- It also makes every worker session pay the full cost for rules that are only relevant in certain contexts.

Recommendation:
- 총괄 should refactor this first as the pattern case.
- Do not remove rules.
- Keep the minimal execution contract in `SKILL.md`.
- Move conditional protocols to `REFERENCES.md`: framework verification details, TDD branch detail, debugging 4-step detail, sanitation detail, git/component examples.
- Add or expand `CHECKLIST.md` for final verification and hard fails.

### 4. 인스타엔진 has support files but still keeps too much engine detail in the entry point

Finding: `인스타엔진/SKILL.md` is 423 lines and contains several engine-specific production paths.

Impact:
- It is useful for one-shot content generation.
- It is too dense as an operating router.

Recommendation:
- Do not refactor it first.
- Use the coding-guide refactor as a pattern, then move low-frequency engine details into `REFERENCES.md`.
- Preserve mode-specific output rules; this skill's value depends on concrete deliverables.

### 5. 블로그엔진 is the best current pattern for the target architecture

Finding: `블로그엔진/SKILL.md` explicitly says detailed engine rules are read only when needed, and keeps final checks in `CHECKLIST.md`.

Impact:
- It proves the desired architecture already exists in the repo.

Recommendation:
- Use `블로그엔진` as the model for future skill refactors:
  - `SKILL.md` = routing, core loop, minimum output.
  - `REFERENCES.md` = examples, long forms, domain detail.
  - `CHECKLIST.md` = hard fails, final verification.

## Capability/Cost Scores

Scale: 1 low, 5 high.

| Skill | Capability | Token Cost | Judgment Support | Over-Control Risk | Refactor Priority |
|-------|------------|------------|------------------|-------------------|-------------------|
| 총괄매니저 | 5 | 3 | 5 | 2 | Low now |
| 코딩가이드 | 5 | 5 | 3 | 4 | Highest |
| 암행어사 | 5 | 5 | 4 | 4 | High |
| 인스타엔진 | 4 | 4 | 3 | 3 | Medium |
| 블로그엔진 | 5 | 2 | 4 | 2 | Model case |
| 스킬생성기 | 4 | 3 | 4 | 3 | Later audit |

## Refactor Principles

1. Refactor for load path, not for line count.
2. Preserve capabilities before improving aesthetics.
3. Keep the first 100-180 lines useful for 80% of invocations.
4. Put conditional protocols behind links.
5. Change "always do X" to "do X when condition Y applies" when safe.
6. Keep hard fails visible.
7. Keep examples out of `SKILL.md` unless they prevent common failure.
8. After each refactor, run:
   - `npm run build:adapters`
   - `npm run check`
   - `npm run score:skills`
   - targeted manual read-through of the skill's first screen

## Next Decision

Do not hand `코딩가이드` directly to a worker yet.

Recommended path:

1. 총괄 directly refactors `코딩가이드` as the pattern case.
2. Worker or 암행어사 then reviews whether any rule was weakened.
3. If the pattern holds, worker can apply the same structure to `암행어사` or `인스타엔진`.

## Follow-Up Applied

- 2026-05-29: 총괄 directly refactored `코딩가이드` from a 488-line all-in-one entry point into:
  - `SKILL.md`: execution loop, Hard Fail, minimum output, pressure scenarios
  - `REFERENCES.md`: detailed forms, examples, conditional protocols
  - `CHECKLIST.md`: final verification checklist
- Catalog and `SKILL_INDEX.md` were bumped to `코딩가이드` v1.7.0.
- Worker review completed with PASS. The completed order is archived at `docs/history/orders/order_030_coding_guide_refactor_review.md`.
- The pattern is safe to reuse as a candidate for `암행어사` or `인스타엔진`, but future changes must preserve capability instead of optimizing for line count alone.
- 2026-05-29: Added `source/SKILL_INDEX.md` version-row validation against `catalog/skills.yaml` so the drift found during this audit is now guarded by `npm run validate`.
- 2026-05-29: Applied the approved thin-entry pattern to `암행어사` v2.1.0:
  - `SKILL.md`: persona, trigger router, common audit loop, Hard Fail, minimum output
  - `REFERENCES.md`: Mode A/B/C/D scan details, attack vectors, report templates
  - `CHECKLIST.md`: final mode and report verification
- Worker review completed with PASS. The completed order is archived at `docs/history/orders/order_033_inspector_refactor_review.md`.

## Hygiene List

- [x] Add validation for `source/SKILL_INDEX.md` version rows against `catalog/skills.yaml`.
- [x] Replace the paused worker order with a review-only handoff after the 총괄-owned `코딩가이드` refactor.
- [x] Archive the completed #030 worker review order.
- [x] Apply the approved pattern to `암행어사` as the next high-leverage skill.
- [x] Archive the completed #033 worker review order.
- [ ] Use `블로그엔진` as the reference architecture for thin skill entry points.
- [ ] Do not create more root audit/order/playbook variants; keep reports under `docs/history/` unless they must be active.
