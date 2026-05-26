# Project Brain Skilltree

Project Brain Skilltree is a portable skill operating system for agentic work.
It keeps one canonical source tree and builds tool-specific adapters for
Antigravity/Gemini, Codex, and Claude Code.

## Why This Exists

Most skill collections optimize for one agent. Project Brain Skilltree optimizes
for durable work across agents:

- file-based memory instead of chat-only memory
- explicit router and role boundaries
- manager, worker, inspector, and launch-gate separation
- pressure-scenario testing for skills
- generated adapters instead of hand-maintained copies
- CI gates that block drift, broken links, unsafe context, and output conflicts

## Repository Layout

```text
source/                 Canonical source. Edit this only.
adapters/               Generated install targets. Do not edit by hand.
catalog/skills.yaml     Machine-readable skill manifest.
docs/                   Architecture, adapter contract, quality gate.
tests/scenarios/        Pressure scenarios for skill behavior.
tools/                  Build, validate, and audit scripts.
```

## Core Rule

`source/` is the only human-edited root.

Run adapter generation after changing source:

```bash
npm run build:adapters
```

Run the full gate before publishing:

```bash
npm run check
```

Report generated adapter drift without changing source:

```bash
npm run diff:adapters
```

## Install Targets

After `npm run build:adapters`, use the generated folders:

- `adapters/antigravity/skills`
- `adapters/codex/skills`
- `adapters/claude-code/skills`

The adapter directories are generated artifacts. If they drift, fix `source/`
and rebuild them.

## Current Skill Layers

```text
CORE_PRINCIPLES + SKILL_INDEX
  -> 총괄매니저
  -> 코딩가이드 / PRD생성 / 디자인시스템 / 콘텐츠기획
  -> 블로그엔진 / 인스타엔진 / HyperFrames
  -> 암행어사 / 출시점검
  -> 스킬생성기
```

## Security Model

Skills are executable context. Treat every `SKILL.md`, `AGENTS.md`, and context
file as supply-chain input. This repository blocks common unsafe patterns:

- personal absolute paths
- leaked token patterns
- invisible Unicode control characters
- missing source manifest entries
- generated adapter drift
- broken local links
- ambiguous or conflicting output rules

See [SECURITY.md](SECURITY.md) and [docs/QUALITY_GATE.md](docs/QUALITY_GATE.md).

## Next Reading

- [Product Requirements](PRD.md)
- [Project Tasks](PROJECT_TASKS.md)
- [Install Guide](docs/INSTALL.md)
- [Adapter Contract](docs/ADAPTER_CONTRACT.md)
- [Quality Gate](docs/QUALITY_GATE.md)
- [Comparison](docs/COMPARISON.md)
- [Contributing](CONTRIBUTING.md)
