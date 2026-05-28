# Project Brain Skilltree

[![Release](https://img.shields.io/github/v/release/ekdthl13/project-brain-skilltree?label=Release&color=blue)](https://github.com/ekdthl13/project-brain-skilltree/releases/tag/v1.0.0)
[![CI Status](https://github.com/ekdthl13/project-brain-skilltree/actions/workflows/validate.yml/badge.svg)](https://github.com/ekdthl13/project-brain-skilltree/actions/workflows/validate.yml)

Project Brain Skilltree is a portable skill operating system for agentic work. It keeps one canonical source tree and builds tool-specific adapters for Antigravity/Gemini, Codex, and Claude Code.

Current public baseline: latest stable release `v1.0.0`, canonical root `source/`, generated adapters `adapters/`, recommended first proof path `npm run demo`.

---

## What it is
Project Brain Skilltree is a file-based, multi-agent skill framework. Instead of maintaining separate copies of prompt instructions for different AI tools, you edit the skills in a single canonical directory. The build tool automatically compiles and formats them for each target agent runtime.

## Why This Exists
Most skill collections optimize for one agent. Project Brain Skilltree optimizes for durable work across multiple agents:
- **File-based memory** instead of chat-only memory.
- **Explicit router and role boundaries** for agents.
- **Manager, worker, inspector, and launch-gate separation**.
- **Pressure-scenario testing** for skill behaviors.
- **Generated adapters** instead of hand-maintained copies.
- **CI gates** that block drift, broken links, unsafe context, and output conflicts.

For a deeper dive into the architectural motivation, problem statement, and who this framework is for, see [docs/WHY.md](docs/WHY.md).

---

## Core Rule: Source of Truth
> [!IMPORTANT]
> **`source/` is the only human-edited canonical root.**
> The files under `adapters/` are generated artifacts. Do not edit them directly. If any drift is found, update the files in `source/` and rebuild.

---

## Quickstart (3 minutes)

### 1. Run the Safe Local Demo (Recommended First Step)
To instantly verify that the skilltree compilation and backup-aware deployment operate correctly on your system without editing any real agent directories:

```bash
# Clone and enter the repository
git clone https://github.com/ekdthl13/project-brain-skilltree.git
cd project-brain-skilltree

# Run the deterministic local success proof
npm run demo
```

This zero-install demo command builds the adapters, provisions an isolated sandbox in your OS temp folder, verifies preservation/backup logic, and lists subsequent actions.

### 2. Locate Your Agent Skills Folder & Choose Target
To use these skills in your actual workflow, locate the skills directory used by your AI agent, then deploy the matching adapter.

For a detailed setup guide and help finding these folders, see [docs/INSTALL.md](docs/INSTALL.md) (or read the [Korean Briefing / 한국어 문서](docs/briefing_ko.md) for a project overview).

### 3. Build, Dry-Run, and Deploy
Always run a `--dry-run` to preview what files will be replaced (conflicts are backed up automatically, and unrelated files are preserved).

#### Antigravity / Gemini
```bash
# Dry-run preview
node tools/install-adapter.js antigravity /path/to/gemini/skills --dry-run
# Actual install
node tools/install-adapter.js antigravity /path/to/gemini/skills
```

#### Codex
```bash
# Dry-run preview
node tools/install-adapter.js codex /path/to/codex/skills --dry-run
# Actual install
node tools/install-adapter.js codex /path/to/codex/skills
```

#### Claude Code
```bash
# Dry-run preview
node tools/install-adapter.js claude-code /path/to/claude/skills --dry-run
# Actual install
node tools/install-adapter.js claude-code /path/to/claude/skills
```

*To rollback a deployment, use `node tools/restore-adapter.js <target> <destination>`. See [docs/INSTALL.md](docs/INSTALL.md) for copy-pasteable examples.*

### Additional Commands

| Command | Purpose |
|---------|---------|
| `npm run test:forward` | Run deterministic forward-testing scenarios |
| `npm run new:skill -- --id <id> --source "<Name>" --description "Use when ..."` | Create a new skill in `source/` and register it in the catalog |
| `npm run score:skills` | Score all skills against the quality scorecard |

---

## Repository Layout
```text
source/                 Canonical source. Edit this only.
adapters/               Generated install targets. Do not edit by hand.
catalog/skills.yaml     Machine-readable skill manifest.
docs/                   Architecture, adapter contract, quality gate.
examples/               Integration examples (e.g., minimal-project).
tests/scenarios/        Pressure scenarios for skill behavior.
tools/                  Build, validate, and audit scripts.
```

---

## Skill Layers

```text
CORE_PRINCIPLES + SKILL_INDEX
  -> ORCHESTRATION
  -> 총괄매니저
  -> 코딩가이드 / PRD생성 / 디자인시스템 / 콘텐츠기획
  -> 블로그엔진 / 인스타엔진 / HyperFrames
  -> 암행어사 / 출시점검
  -> 스킬생성기
```

---

## Skill Sources
The `source/` directory is the canonical root of the skilltree. You can navigate the canonical files using the direct relative file links below:

### Constitution & Routers
- [source/CORE_PRINCIPLES.md](source/CORE_PRINCIPLES.md) - The governing principles and document priority rules.
- [source/SKILL_INDEX.md](source/SKILL_INDEX.md) - The primary router mapping intentions to skills.
- [source/ORCHESTRATION.md](source/ORCHESTRATION.md) - The multi-model orchestration guidelines.

### Canonical Skill Definitions
Each skill directory contains a `SKILL.md` file with its executable instructions:
- [source/오피스아워/SKILL.md](source/오피스아워/SKILL.md) - Office Hours (Strategy discovery and brief generator)
- [source/PRD생성/SKILL.md](source/PRD생성/SKILL.md) - PRD Generator (Durable product requirements document)
- [source/디자인시스템/SKILL.md](source/디자인시스템/SKILL.md) - Design System (UI tokens and preview helper)
- [source/총괄매니저/SKILL.md](source/총괄매니저/SKILL.md) - Project Manager (Context synchronization and order routing)
- [source/코딩가이드/SKILL.md](source/코딩가이드/SKILL.md) - Coding Guide (Code execution rules and escalation protocol)
- [source/출시점검/SKILL.md](source/출시점검/SKILL.md) - Launch Check (Pre-release gates and smoke test verifications)
- [source/암행어사/SKILL.md](source/암행어사/SKILL.md) - Inspector (Auditing code, designs, and skill trees)
- [source/스킬생성기/SKILL.md](source/스킬생성기/SKILL.md) - Skill Builder (Meta-skill for modifying or building skills)
- [source/콘텐츠기획/SKILL.md](source/콘텐츠기획/SKILL.md) - Content Planning (Keywords and content calendar structure)
- [source/블로그엔진/SKILL.md](source/블로그엔진/SKILL.md) - Blog Engine (Drafting, formatting, and SEO scoring)
- [source/인스타엔진/SKILL.md](source/인스타엔진/SKILL.md) - Instagram Engine (Short-form package and campaign briefs)
- [source/HyperFrames/SKILL.md](source/HyperFrames/SKILL.md) - HyperFrames PD (HTML-based motion and video compositions)

*Note: Support files such as checklists, references, or scripts are linked directly from within each skill's main `SKILL.md` file to keep the index clean.*

---

## Quality Gate
Every skill change must pass the automated quality checks. The gate validates:
- No personal absolute paths or secret credentials.
- All local markdown links must resolve to existing files.
- Skill files (`SKILL.md`) must be under the 500-line size limit (and triggers a split review at 400 lines).
- Generated adapters must not have any untracked drift against `source/`.
- Executable pressure scenarios are checked statically.

See [docs/QUALITY_GATE.md](docs/QUALITY_GATE.md) for more details.

---

## Where to Go Next
- [Korean Briefing / 한국어 안내](docs/briefing_ko.md) - Plain Korean guide explaining roles, terminology, and setup.
- [Product Requirements](PRD.md) - Read the product goals and success metrics.
- [Project Tasks](PROJECT_TASKS.md) - Current development roadmap and status.
- [Roadmap](docs/ROADMAP.md) - Milestone release schedules and future plans.
- [Install Guide](docs/INSTALL.md) - Detailed installer options, environment variables, and rollback steps.
- **Quickstart Guides**:
  - [PRD Creation Workflow](docs/quickstarts/PRD_CREATION.md) - Turn ideas into a PRD.
  - [Project Manager Spine Bootstrap](docs/quickstarts/PROJECT_MANAGER_BOOTSTRAP.md) - Set up workspace continuity.
  - [Pre-Release Launch Check & Audit](docs/quickstarts/LAUNCH_CHECK.md) - Quality and security verification.
  - [Real User Scenario Examples](docs/SCENARIOS.md) - Copy-pasteable test, dry-run, and restore flows.
- [Examples & Concepts](docs/EXAMPLES.md) - Before/after comparison of folder drift.
- [Minimal Example Project](examples/minimal-project/README.md) - Bootstrap templates for integrating skills.
- [Adapter Contract](docs/ADAPTER_CONTRACT.md) - Output guidelines for each target agent.
- [New Skill CLI](docs/NEW_SKILL_CLI.md) - Create draft skills through the canonical source and catalog.
- [Comparison](docs/COMPARISON.md) - Differences compared to Superpowers and other systems.
- [Core / Domain / Personal Separation Impact](docs/separation_impact_analysis.md) - Conceptual boundaries and physical restructuring impact analysis.
- [Bilingual Terminology Guidance](docs/terminology.md) - Mapping internal Korean terms to official English public documentation names.
- [v1.0 Stable-Contract Freeze Checklist](docs/v1_freeze_checklist.md) - Standards for freezing catalog schemas, layouts, compatibility, and release gates.
- [Quickstart Design Notes](docs/QUICKSTART_DESIGN.md) - Initial architecture plans for the quickstarts.
- [Contributing](CONTRIBUTING.md) - How to add new skills.
