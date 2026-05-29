# Project Brain Skilltree PRD

## One-Line Summary

Project Brain Skilltree is a GitHub-first, multi-agent skill operating system
that keeps one canonical source tree and generates validated adapters for
Antigravity/Gemini, Codex, and Claude Code.

## Background

The original skilltree began as a local Antigravity/Gemini operating system for
content, product, coding, and marketing workflows. It was not a loose prompt
collection. It already had a working mental model:

- `CORE_PRINCIPLES.md` as the constitution
- `SKILL_INDEX.md` as the router
- `총괄매니저` as project manager and memory coordinator
- `코딩가이드`, `PRD생성`, `디자인시스템`, and content engines as execution skills
- `암행어사` and `출시점검` as inspection and release gates
- file-based continuity through project-local operating documents

This repository turns that local skilltree into a public, versioned, validated
framework with generated adapter packages.

## Problem

Agent skill systems often fail in four ways:

1. **Source-of-truth drift:** several local copies exist and no agent knows which
   one is authoritative.
2. **Adapter mismatch:** one tool expects one skill format, another tool expects
   a different format.
3. **Missing quality gate:** skills can accumulate broken links, stale versions,
   private paths, and conflicting output rules.
4. **Lost operating context:** new sessions know the files but not the story,
   current status, or intended next move.

After v1.1.1, a fifth risk became more important:

5. **Operational document sprawl:** release notes, task boards, playbooks, and
   checklists can grow until they distract from the original goal: better skills.

## Product Goal

Build a public skilltree operating system that can be understood, installed,
validated, and extended by future agents without needing this chat history.

The post-v1.1 goal is not broader public packaging. It is a stronger personal
and multi-agent skill system whose documentation remains useful without taking
over the project.

## Users

- The maintainer who uses Antigravity/Gemini, Codex, and Claude Code together.
- Future AI sessions that need exact project context.
- Agent builders looking for a GitHub-first skilltree architecture.
- Content and product operators who need durable file-based workflows.

## Product Principles

- `source/` is the only human-edited canonical root.
- `adapters/` are generated artifacts, not hand-edited source.
- Every skill is treated as operational product code.
- Validation must happen before completion claims, publication, and install.
- Local paths, secrets, hidden Unicode controls, and ambiguous output rules are
  supply-chain risks.
- Good skills prevent future agent mistakes, but should support judgment rather
  than smothering it.
- Operating documents should explain the project, not become the project.

## Current Architecture

```text
source/
  CORE_PRINCIPLES.md
  SKILL_INDEX.md
  ORCHESTRATION.md
  <canonical skill folders>

catalog/skills.yaml
  stable ids, versions, adapter names, trigger descriptions

tools/
  build-adapters.js
  validate-skilltree.js
  audit-skilltree.js
  install-adapter.js
  restore-adapter.js

adapters/
  antigravity/skills
  codex/skills
  claude-code/skills

tests/scenarios/
  deterministic pressure and forward-test fixtures
```

## Requirements

### P0: Canonical Public Repo

- Public GitHub repository exists.
- `main` is the default branch.
- `source/` contains the canonical skilltree.
- GitHub Actions runs the validation gate on push and pull request.

### P0: Adapter Generation

- Antigravity adapter preserves original folder names and operating model.
- Codex adapter uses portable lowercase hyphen skill names.
- Claude Code adapter uses the same portable skill package layout.
- Adapter files are generated from `source/` and `catalog/skills.yaml`.

### P0: Quality Gate

- `npm run check` builds adapters, runs tests, validates structure, and writes
  an audit report.
- Validation catches missing frontmatter, catalog drift, broken local links,
  personal paths, secret-like strings, hidden Unicode controls, and missing
  adapter outputs.

### P1: Safe Local Install

- Installer supports dry-run.
- Installer backs up conflicting managed entries before replacing them.
- Installer preserves unrelated existing skills in the destination.
- Installer refuses unsafe destinations such as filesystem root or repo root.
- Restore tooling supports dry-run rehearsal before active rollback.

### P1: Session Continuity

- Root-level PRD and task docs explain why the project exists, where it is, and
  what the next session should do.
- `_order.md` and `_playbook.md` are overwrite-only current slots.
- Completed orders and playbooks move to `docs/history/`.
- Future agents can continue without needing the original chat.

### P2: Automated Pressure Testing

- Documented pressure scenarios become deterministic executable tests.
- Scenarios verify source-of-truth discipline, validation discipline, and
  adapter-specific wording boundaries.
- Current forward tests do not call live agents or external APIs.

### P2: Public Presentation

- Install guide, comparison guide, contributing guide, roadmap, and examples
  make the repo understandable to outside users.
- Public docs stay trustworthy but do not expand into a full product marketing
  machine unless real usage demands it.

### P2: First Success Demo

- A new user can run one deterministic demo command on a fresh checkout.
- The demo proves the canonical source and adapter workflow without writing to
  user agent skill directories.
- The demo produces clear success output and points to the next useful command.

### P3: Release System

- Tagged releases.
- Changelog.
- Release checksums.
- Adapter artifact packaging.
- Multi-OS CI validation.

### P4: Skill Quality Hardening

- Long skills should use thin entry points with support files when that improves
  readability and agent judgment.
- Refactors should preserve strong rules, examples, and validation.
- Quality is measured by operational reliability, not only by line count.

## Non-Goals

- Do not replace every external skill system.
- Do not force all users into the Korean Antigravity operating model.
- Do not auto-install into local agent directories without explicit user action.
- Do not treat generated adapter output as source.
- Do not keep adding public templates, issue forms, or star-oriented docs while
  core skill quality is the more important bottleneck.

## Success Metrics

- `npm run check` passes locally and in GitHub Actions.
- A new session can identify `source/` as canonical without asking.
- A user can dry-run and install an adapter without overwriting unrelated skills.
- A new user can run `npm run demo` and get a successful local proof within 10 minutes.
- New skills cannot be added without catalog and router alignment.
- A public visitor can understand the system from README, PRD, and tasks alone.
- `PROJECT_TASKS.md` remains a compact state board.
- `_order.md` and `_playbook.md` remain current slots instead of accumulating
  numbered root variants.

## Current Status

- Public repo: `https://github.com/ekdthl13/project-brain-skilltree`
- Latest stable release: `v1.1.1`
- GitHub Actions `validate`: green on Ubuntu, Windows, and macOS for the
  v1.1.1 release commit.
- Local quality gate baseline: `npm run check`, `npm run test:forward`,
  `npm run demo`, `npm run score:skills`, and release packaging have been used
  as release verification gates.
- Runtime usage verification: previously passed for Antigravity/Gemini, Codex,
  and Claude Code local installs.
- Current phase: project reset and skill quality hardening after v1.1.1.

## Major Risks

| Risk | Mitigation |
|------|------------|
| Local install overwrites existing skills | Installer preserves unrelated destination entries and supports dry-run |
| Future agents edit generated adapters | README, contributing guide, installer docs, and validation emphasize `source/` only |
| Korean source skills are less discoverable in Codex/Claude | Catalog creates English hyphen adapter names and trigger descriptions |
| Public repo looks like a prompt dump | PRD, tasks, comparison, adapter contract, and quality gate frame it as an operating system |
| Validation misses behavioral failures | Static pressure checks and deterministic JSON forward-tests run locally and in CI |
| External users find the system too heavy | README, demo, scenarios, and install guide keep the first proof path short |
| Operational docs crowd out skill quality | Keep task/order/playbook files as current state only; archive completed detail |
| Long skills become over-controlling | Split into core rules, references, and examples while preserving verification strength |

## Next Milestone

Prepare a thin `v1.1.2` documentation and skill-quality reset:

1. Keep public release metadata aligned with `v1.1.1`.
2. Keep `_order.md` and `_playbook.md` overwrite-only and archive completed variants.
3. Make `PROJECT_TASKS.md` a compact live board instead of a release log.
4. Soften forward-testing wording where it could imply live agent simulation.
5. Start skill hardening with `코딩가이드`, then review `암행어사` and `인스타엔진`.
6. Do not change adapter contracts, skill slugs, or published release tags.
