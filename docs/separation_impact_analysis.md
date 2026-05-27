# Core / Domain / Personal Separation Impact Analysis

This document provides a conceptual analysis of partitioning the Project Brain Skilltree repository into **Core**, **Domain**, and **Personal** layers. It outlines the boundaries of each layer, identifies dependencies and tools affected if physical restructuring is ever attempted, defines "no-go" criteria, and recommends timing relative to the v1.0 stable release.

---

## 1. Proposed Conceptual Boundaries

To maintain clean architecture and prevent coupling between infrastructure and applications, we define three conceptual layers:

| Layer | Responsibility | Included Items |
| :--- | :--- | :--- |
| **Core** | Infrastructure, control plane, orchestration protocols, code standards, and audit gates. These define the "system operating system." | - `총괄매니저 / Project Manager`<br>- `암행어사 / Inspector`<br>- `출시점검 / Launch Check`<br>- `코딩가이드 / Coding Guide`<br>- `스킬생성기 / Skill Builder`<br>- System configs: `CORE_PRINCIPLES.md`, `ORCHESTRATION.md`, `SKILL_INDEX.md` |
| **Domain** | Functional plugins, specific application/business workflows, and generator tools. These define reusable capabilities. | - `PRD생성 / PRD Builder`<br>- `디자인시스템 / Design System`<br>- `콘텐츠기획 / Content Planner`<br>- `블로그엔진 / Blog Engine`<br>- `인스타엔진 / Instagram Engine`<br>- `HyperFrames / Video Producer` |
| **Personal** | Developer-specific rules, local workspace preference files, localized writing templates, or customized checklists. | - Private writing styles (e.g., custom blogger tone guides)<br>- Local environment configurations (must not be committed)<br>- User-specific task templates |

---

## 2. Affected Components & Tools (Physical Restructuring Impact)

If we ever attempt to physically move skills into separate folders (e.g. `source/core/`, `source/domain/`, `source/personal/`), the following parts of the codebase will require modification:

### 1. Catalog Manifest (`catalog/skills.yaml`)
- The `source` paths must be updated:
  ```yaml
  # Before
  source: "총괄매니저"
  # After
  source: "core/총괄매니저"
  ```
- Any scripts parsing the catalog to locate canonical directories will need recursive or depth-aware directory resolution.

### 2. Build & Diff Utilities
- **`tools/build-adapters.js`**:
  - Currently assumes source folders are located directly under `source/`. It must be patched to resolve paths dynamically using the `source` field in `catalog/skills.yaml` or recursively search.
- **`tools/diff-adapters.js`**:
  - The map builder (`expectedAdapters`) relies on direct path matches. It must be updated to handle multi-level source directories.

### 3. Installer Utility (`tools/install-adapter.js`)
- The installer maps generated adapter files to the user's local agent skills root. If target adapter directories match the nested physical layout, the local configuration must support nested paths.
- Local backups (`skills.backup-YYYYMMDDTHHMMSS`) must be tested to ensure they copy nested trees correctly.

### 4. Indexing & Documentation Links
- **`source/SKILL_INDEX.md`**:
  - The primary router maps intents to skill markdown paths (e.g., `총괄매니저/SKILL.md`). These relative links will break and must be updated to `core/총괄매니저/SKILL.md`.
- **`README.md`**:
  - The direct links under "Skill Sources" must be updated.

### 5. Verification Scripts & Gates
- **`tools/pressure-scenarios.test.js`**:
  - Walkers scanning `source/` for rule compliance (e.g., size checks, private path checks) must be adapted to walk nested directory structures.

---

## 3. No-Go Criteria

We must **not** proceed with physical file movement if any of the following conditions are met:
1. **Agent Discovery Restrictions**: The target runtimes (specifically Codex or Claude Code) restrict the local skills root directory to a flat structure and fail to scan or register skills placed in nested subfolders.
2. **Backward Compatibility Breakage**: Existing local installs of users would break because the installer would fail to resolve changes or leave duplicate orphan folders behind, creating configuration drift.
3. **Build Script Fragility**: The build/diff automation scripts are not updated and thoroughly tested against variable directory depths.

---

## 4. Recommended v1.0 Timing

- **v0.4.0 (Current)**: Keep the separation strictly **conceptual** and documented. This prevents breaking active installations during operational hardening.
- **v1.0.0 Stable Freeze**: Establish contract stability (catalog schema, adapter layout, slug stability) based on the flat structure to ensure a solid baseline.
- **Post-v1.0.0 (e.g., v1.1.0)**: Attempt physical restructuring only after:
  1. The flat contract is stabilized and frozen.
  2. Recursive subfolder support in Codex/Antigravity/Claude Code is fully verified.
  3. A migration helper or rollback mechanism is added to the installer to cleanly delete orphaned 구버전 folders from user machines.
