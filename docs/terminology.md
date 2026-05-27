# Bilingual Terminology Guidance

To maintain public discoverability and align public documentation with generated adapters, this document maps Korean canonical source skill names and internal operating terms to their official English public equivalents.

---

## 1. Skill Name Mappings

When referencing skills in public-facing documentation (such as `README.md`, `ROADMAP.md`, or releases), use the official English names below. The generated adapter directory names (slugs) are also listed to assist with discoverability in Codex, Antigravity, and Claude Code.

| Canonical Source Skill | Official English Name | Generated Slug / Adapter Name | Primary Role |
| :--- | :--- | :--- | :--- |
| **총괄매니저** | Project Manager (PM) | `project-manager` | Orchestrates multi-agent tasks, manages session files (`_context.md`, `_order.md`), and reviews completions. |
| **코딩가이드** | Coding Guide | `coding-guide` | A senior full-stack developer persona executing tasks, following design tokens, and handling technical escalations. |
| **암행어사** | Inspector | `inspector` | Audits code, architecture, designs, and skilltrees for logical flaws, contradictions, and code hygiene issues. |
| **출시점검** | Launch Check | `launch-check` | DevOps/QA lead that runs tests, builds, and grades the codebase before releases (GO/NO-GO gate). |
| **스킬생성기** | Skill Builder | `skill-builder` | A meta-skill for creating draft skills, updating catalogs, and editing index files. |
| **오피스아워** | Office Hours | `office-hours` | Initial strategy discovery, project feasibility checking, and Brief generation. |
| **PRD생성** | PRD Builder | `prd-builder` | Gathers requirements and generates structured Product Requirements Documents (PRDs). |
| **디자인시스템** | Design System | `design-system` | Manages global design tokens, CSS variables, and styling conventions. |
| **콘텐츠기획** | Content Planner | `content-planner` | Keywords research and monthly content calendar structuring. |
| **블로그엔진** | Blog Engine | `blog-engine` | Writes, formats, and scores SEO-optimized blog posts. |
| **인스타엔진** | Instagram Engine | `instagram-engine` | Manages Instagram campaign briefs, calendars, and DM interactions. |
| **HyperFrames** | HyperFrames PD | `hyperframes` | HTML-based motion graphics and video composition producer. |

---

## 2. Core Operating Terms

Use these terms consistently when describing Project Brain Skilltree workflows and processes:

- **Canonical Source (`source/`)**: The single human-edited directory where all canonical skill instructions and system files reside.
- **Generated Adapters (`adapters/`)**: Compiled, formatted, and agent-specific files ready for local installation. **Never edit these directly.**
- **Work Order File (`_order.md`)**: A temporary file containing a single, bounded coding or documentation task.
- **Playbook File (`_playbook.md`)**: A batch instruction file containing sequential tasks for a single multi-step phase.
- **Session Memory (`_context.md`)**: The active, rolling summary of the project state (strictly kept under 30 lines).
- **Decision Log (`DECISION_LOG.md`)**: A durable registry storing high-level architectural and business decisions.
- **Quality Gate (`npm run check`)**: The automated validation pipeline (builds adapters, verifies diffs, runs tests, checks links/secrets, and audits code hygiene).
- **Forward-Testing (`npm run test:forward`)**: Sandboxed simulation replayer that verifies agent behavior against pressure scenarios.
