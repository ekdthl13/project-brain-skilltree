# Project Tasks

## Current Position

Project Brain Skilltree is in **v1.1.2 stable** state.

Public baseline:
- GitHub repo: `https://github.com/ekdthl13/project-brain-skilltree`
- Latest published GitHub Release: `v1.1.2`
- Latest stable tag: `v1.1.2`
- Release URL: `https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v1.1.2`
- Release commit: `af66d4563c9bcbb7b343def483e55fe8cebc608b`
- Latest verified remote CI: GitHub Actions `validate` workflow runs successfully on the target commit.

Current decision:
- Pause the release-machine loop after v1.1.1.
- Keep public docs trustworthy, but stop expanding open-source packaging surface unless it protects real usage.
- Turn the next work toward skill quality, judgment support, and slimmer operating documents.
- Treat `_order.md` and `_playbook.md` as overwrite slots. Completed contents move to `docs/history/` before a new order or playbook replaces them.

## Source Of Truth Rules

- `source/` is the canonical human-edited root.
- `adapters/` are generated artifacts and must not be edited by hand.
- Run `npm run build:adapters` after source or catalog edits.
- Run `npm run check` before claiming completion.
- Run `npm run test:forward` for forward-testing fixture, runner, or behavioral scenario changes.
- Preserve the published `v0.3.0`, `v0.4.0`, `v0.5.0`, `v1.0.0`, `v1.1.0`, and `v1.1.1` tags and GitHub Release assets as public baselines.
- Do not retag any published release unless an explicit rollback/recovery decision is made.
- Keep full worker prompts in `_order.md`; keep this file focused on state, decisions, queues, and short execution summaries.
- Long historical detail is archived in `docs/history/PROJECT_TASKS_ARCHIVE.md`, `docs/history/orders/`, and `docs/history/playbooks/`.

## Installed State

| Environment | Status | Notes |
|-------------|--------|-------|
| Codex | Installed + verified | Generated adapter entries were installed under `%USERPROFILE%\.codex\skills`; `.system` preserved |
| Antigravity/Gemini | Installed + verified | Generated adapter entries were installed under `%USERPROFILE%\.gemini\config\skills` |
| Claude Code | Installed + verified | Generated adapter entries were installed under `%USERPROFILE%\.claude\skills`; generated adapter hash match previously verified |

## Phase Summary

| Phase | Status | Goal / Evidence |
|-------|--------|-----------------|
| 0-7. Repo foundation through release system | Done | Canonical repo, adapters, install safety, quality gates, release artifacts |
| 8. Advanced quality system | Foundation done | Scorecards, schema stability guard, forward-testing harness, new-skill CLI |
| 9. Operational hardening | Released | External-user onboarding, install/release UX, behavioral fixtures |
| 10. First success demo | Released | Deterministic `npm run demo` path proves the pipeline without installing into real agent directories |
| 11. Stable contract | Released | v1.0.0 stable release with adapter/package/release contract baseline |
| 12. Productization and clarity | Released | v1.1.0 and v1.1.1 public trust path improvements |
| 13. Project reset | Active | Document operations diet and shift back to core skill quality |

Historical details are archived in [docs/history/PROJECT_TASKS_ARCHIVE.md](docs/history/PROJECT_TASKS_ARCHIVE.md).

## PRD Coverage Board

| Requirement | Status | Evidence / Next Move |
|-------------|--------|----------------------|
| P0: Canonical public repo | Done | Public repo, `main`, `source/`, CI validate |
| P0: Adapter generation | Done | Antigravity, Codex, and Claude Code adapters build from catalog/source |
| P0: Quality gate | Done | `npm run check` builds, tests, validates, audits |
| P1: Safe local install | Done | Installer and restore UX support dry-runs, backup, and rollback rehearsal |
| P1: Session continuity | Active | PRD, roadmap, this file, `_order.md`, and history policy carry current state |
| P2: Automated pressure testing | Foundation done | Deterministic fixture replay and static guardrails, not live agent simulation |
| P2: Public presentation | Stable enough | README, INSTALL, WHY, SCENARIOS, and release notes template carry public trust path |
| P3: Release system | Done | Tags, changelog, adapter zips, checksums, multi-OS CI validation |
| P4: Skill quality | Active | Refactor long skills into thin entry points with support files where it improves judgment |

## Active Queue

### #028 Project Reset - Completed Locally

- [x] Archive completed root `_order.md` and `_playbook*` files under `docs/history/`.
- [x] Re-establish `_order.md` and `_playbook.md` as overwrite-only current slots.
- [x] Compact `PROJECT_TASKS.md` back into a live state board.
- [x] Refresh PRD, SECURITY, ROADMAP, FORWARD_TESTING, and RELEASE docs for the v1.1.1 baseline.
- [x] Add overwrite-slot rules to the project-manager source skill and templates.

### #029 Skill Capability Audit - Completed Locally

- [x] Pause the worker refactor order until the current skill system is audited.
- [x] Assess current skill capability, token cost, loading burden, judgment support, and over-control risk.
- [x] Save audit report: `docs/history/skilltree_capability_audit_2026-05-29.md`.
- [x] Use the audit result to select `코딩가이드` as the first 총괄-owned pattern refactor.
- [x] Refactor `코딩가이드` into thin `SKILL.md` + detailed `REFERENCES.md` + final `CHECKLIST.md`.
- [x] Replace the paused worker order with a review-only handoff for the 총괄 refactor.
- [x] Review the refactor for weakened rules before applying the pattern to other skills.

### #031 Skill Index Version Guard - Completed Locally

- [x] Add validation for `source/SKILL_INDEX.md` version rows against `catalog/skills.yaml`.
- [x] Allow legitimate repeated rows only when every listed version matches the catalog.
- [x] Add unit tests for matched, mismatched, repeated, missing, and extracted version rows.

### #032 Inspector Thin-Entry Refactor - Completed Locally

- [x] Select `암행어사` as the next high-leverage skill after the `코딩가이드` pattern passed review.
- [x] Refactor `암행어사` into thin `SKILL.md` + detailed `REFERENCES.md` + final `CHECKLIST.md`.
- [x] Bump `암행어사` to v2.1.0 in `catalog/skills.yaml` and `source/SKILL_INDEX.md`.
- [x] Review the refactor for weakened rules before applying the pattern to another skill.

## Current Worker Order

- Current order file: `_order.md`
- Current playbook file: `_playbook.md`
- Latest completed order: `#034` local install rollout, verification, commit, push, and v1.1.2 release decision.
- Latest direct 총괄 work: `#031` `SKILL_INDEX.md` version-row validation guard.
- Active worker order: None (Pending next strategy session).
- Rule: `_order.md` and `_playbook.md` are current slots only. Archive completed content before overwriting them.

## Archive Policy

- Keep `PROJECT_TASKS.md` as the live operating state board, ideally under 160 lines.
- Keep only current position, source rules, active queue, current worker order pointer, and short recent summaries here.
- Move completed phase detail, old worker prompts, old playbooks, and long execution logs to `docs/history/`.
- Keep public release history in `CHANGELOG.md` and generated verification evidence in `reports/`.
- When a new order or playbook is issued, overwrite `_order.md` or `_playbook.md`; do not create numbered root variants.

## Next Session Prompt

```text
C:\tmp\project-brain-skilltree 에서 계속 작업하자.
GitHub repo는 https://github.com/ekdthl13/project-brain-skilltree 이고,
source/ 가 canonical root, adapters/ 는 생성물이다.

현재 상태:
- Latest published GitHub Release: v1.1.1
- Latest stable tag: v1.1.1
- v1.1.1 release commit: e69433d336b9fef40a6aa2e4b24a2aeadaafb90d
- 루트 `_order.md`와 `_playbook.md`는 항상 현재 슬롯으로 덮어쓴다.
- 완료된 오더/플레이북은 `docs/history/orders/`, `docs/history/playbooks/`에 둔다.

Next work:
1. 작업자가 `_playbook.md` #034를 실행한다.
2. 총괄이 설치/검증/커밋/푸시/릴리즈 결과를 검수한다.
```

## Recent Execution Summary

### 2026-05-29: #028 Project Reset

- [x] Paused release expansion after v1.1.1 and shifted the operating direction toward core skill quality.
- [x] Moved completed root order/playbook files to `docs/history/`.
- [x] Rebuilt live documentation around a compact state board and overwrite-only order/playbook slots.
- [x] Prepared #029 worker order for the first skill-depth refactor.

### 2026-05-29: #029 Skill Capability Audit Started

- [x] Paused the worker refactor order.
- [x] Audited current skills for capability, token cost, loading burden, judgment support, and over-control risk.
- [x] Saved the audit report under `docs/history/` so it is available as evidence without becoming an always-read operating document.
- [x] Applied the first 총괄-owned pattern refactor to `코딩가이드`, preserving execution rules while moving detailed protocols into support files.
- [x] Worker review passed `코딩가이드` v1.7.0, and the completed #030 order was archived under `docs/history/orders/`.
- [x] Added #031 validation so future `source/SKILL_INDEX.md` version-row drift against `catalog/skills.yaml` fails during `npm run validate`.
- [x] Started #032 by applying the approved thin-entry pattern to `암행어사` v2.1.0.
- [x] Worker review passed `암행어사` v2.1.0, and the completed #033 order was archived under `docs/history/orders/`.
- [x] Executed #034 worker playbook for local install rollout, installed-version verification, final validation, commit, push, and v1.1.2 release publication.

### 2026-05-28: v1.1.1 Release Published

- [x] Published `v1.1.1` GitHub Release with release assets.
- [x] Confirmed GitHub Actions `validate` matrix passed on Ubuntu, Windows, and macOS for the release commit.
- [x] Updated release metadata to `v1.1.1`.
