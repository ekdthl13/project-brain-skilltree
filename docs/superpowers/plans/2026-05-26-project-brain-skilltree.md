# Project Brain Skilltree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub-first canonical skilltree repo with generated Antigravity, Codex, and Claude Code adapters.

**Architecture:** Keep `source/` as the only human-edited root. Use a catalog manifest to build generated adapters. Enforce quality with Node-based validation and GitHub Actions.

**Tech Stack:** Markdown, YAML-compatible JSON, Node.js built-ins, GitHub Actions.

---

### Task 1: Canonical Repo Shell

**Files:**
- Create: `README.md`
- Create: `SECURITY.md`
- Create: `LICENSE`
- Create: `package.json`
- Create: `.gitignore`

- [x] Add public-facing project overview.
- [x] Add security policy for context supply-chain risks.
- [x] Add package scripts for build, validate, audit, and check.

### Task 2: Source Import

**Files:**
- Create: `source/CORE_PRINCIPLES.md`
- Create: `source/SKILL_INDEX.md`
- Create: `source/<skill>/SKILL.md`

- [x] Copy current Antigravity skilltree into `source/`.
- [x] Remove private absolute local paths from source-facing docs.
- [x] Keep original Korean operating model intact.

### Task 3: Adapter Builder

**Files:**
- Create: `catalog/skills.yaml`
- Create: `tools/build-adapters.js`

- [ ] Define stable skill ids and adapter slugs.
- [ ] Generate Antigravity install root.
- [ ] Generate Codex install root with `name` and `description` frontmatter only.
- [ ] Generate Claude Code install root with the same portable layout.

### Task 4: Validation Gate

**Files:**
- Create: `tools/validate-skilltree.js`
- Create: `tools/audit-skilltree.js`
- Create: `.github/workflows/validate.yml`

- [ ] Validate catalog/source parity.
- [ ] Validate frontmatter and version sync.
- [ ] Validate links and support files.
- [ ] Validate generated adapters.
- [ ] Validate security constraints.
- [ ] Write audit report.

### Task 5: Pressure Scenarios

**Files:**
- Create: `tests/scenarios/source-of-truth.md`
- Create: `tests/scenarios/validation-pressure.md`
- Create: `tests/scenarios/adapter-confusion.md`

- [ ] Document the highest-risk behavioral failure modes.
- [ ] Keep scenarios raw and independent so future subagent tests can use them.

### Task 6: Verification and Commit

**Files:**
- Modify: generated adapter files
- Modify: `reports/skilltree-audit.md`

- [ ] Run `npm run check`.
- [ ] Fix any validation failures.
- [ ] Initialize git.
- [ ] Commit the canonical repo scaffold.

