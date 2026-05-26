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
- file-based continuity through `GEMINI.md`, `DECISION_LOG.md`, `_context.md`,
  `_order.md`, and `PROJECT_TASKS.md`

The problem was not lack of workflow. The problem was portability and source of
truth. A local skills folder can drift, duplicate trees can become stale, and
Codex or Claude Code may interpret the same skill differently from
Antigravity/Gemini.

This repository turns that local skilltree into a public, versioned, validated
framework.

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

## Product Goal

Build a public skilltree operating system that can be understood, installed,
validated, and extended by future agents without needing this chat history.

## Users

- The maintainer who uses Antigravity/Gemini and Codex together.
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
- Good skills prevent future agent mistakes, not just describe ideal behavior.

## Current Architecture

```text
source/
  CORE_PRINCIPLES.md
  SKILL_INDEX.md
  ORCHESTRATION.md
  <original skill folders>

catalog/skills.yaml
  stable ids, versions, adapter names, trigger descriptions

tools/
  build-adapters.js
  validate-skilltree.js
  audit-skilltree.js
  install-adapter.js

adapters/
  antigravity/skills
  codex/skills
  claude-code/skills

tests/scenarios/
  pressure scenarios for future behavior tests
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

### P1: Session Continuity

- Root-level PRD and task docs explain why the project exists, where it is, and
  what the next session should do.
- Future agents can continue without needing the original chat.

### P2: Automated Pressure Testing

- Documented pressure scenarios become executable tests.
- Scenarios verify source-of-truth discipline, validation discipline, and
  adapter-specific wording boundaries.

### P2: Public Presentation

- Install guide, comparison guide, contributing guide, roadmap, and examples
  make the repo understandable to outside users.

### P3: Release System

- Tagged releases.
- Changelog.
- Release checksums.
- Adapter artifact packaging.

## Non-Goals

- Do not replace every external skill system.
- Do not force all users into the Korean Antigravity operating model.
- Do not auto-install into local agent directories without explicit user action.
- Do not treat generated adapter output as source.

## Success Metrics

- `npm run check` passes locally and in GitHub Actions.
- A new session can identify `source/` as canonical without asking.
- A user can dry-run and install an adapter without overwriting unrelated skills.
- New skills cannot be added without catalog and router alignment.
- A public visitor can understand the system from README, PRD, and tasks alone.

## Current Status

- Public repo: `https://github.com/ekdthl13/project-brain-skilltree`
- GitHub Actions `validate`: required on `main`
- Local `npm run check`: passing
- Current phase: Phase 3-B runtime usage verification after skill-content
  hardening

## Major Risks

| Risk | Mitigation |
|------|------------|
| Local install overwrites existing skills | Installer now preserves unrelated destination entries |
| Future agents edit generated adapters | README, contributing guide, installer docs, and validation emphasize `source/` only |
| Korean source skills are less discoverable in Codex/Claude | Catalog creates English hyphen adapter names and trigger descriptions |
| Public repo looks like a prompt dump | PRD, tasks, comparison, adapter contract, and quality gate frame it as an operating system |
| Validation misses behavioral failures | Pressure scenarios exist now; executable scenario tests are next |

## Next Milestone

Close Layer 1 infrastructure alignment:

1. Keep the Antigravity cutover backup and rollback paths documented.
2. Align PRD, task, roadmap, and quality-gate docs with the current state.
3. Add adapter diff reporting so generated adapter drift is visible.
4. Run `npm run check`.
5. Move into runtime usage verification and skill-content hardening.
