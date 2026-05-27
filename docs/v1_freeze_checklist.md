# v1.0 Stable-Contract Freeze Checklist

This document details the checklist and exit criteria required to stabilize the Project Brain Skilltree contracts for the `v1.0.0` stable release. Hardening these areas ensures that multi-agent systems and third-party integrations can rely on a fixed, predictable interface.

---

## 1. Catalog Schema Freeze
The catalog schema defines the API contract between the source skill definitions and the adapter build system.
- [ ] **JSON Schema Validation**: Standardize `catalog/skills.yaml` to conform to a strict JSON Schema validation check inside `npm run check`.
- [ ] **Field Locking**: Freeze the core fields (`id`, `source`, `version`, `adapterName`, `description`) to prevent breaking builds.
- [ ] **Strict Typing**: Enforce constraints on versions (strictly SemVer compatible) and target tags.

---

## 2. Adapter Layout & Slug Stability
The physical layout of adapter files on disk must remain stable so that target agent runtimes can consistently locate skills and system guides.
- [ ] **Slug Preservation**: Once a skill's `adapterName` is defined (e.g. `project-manager`), it is locked. Renaming slugs requires a major version bump.
- [ ] **Folder Structure Hardening**: Freeze the directory layout of compiled adapter folders:
  - Flat directories under `adapters/<agent>/skills/<slug>/`
  - Canonical placement of `CANONICAL_ROOT.md`, `CORE_PRINCIPLES.md`, `ORCHESTRATION.md`, and `SKILL_INDEX.md` at the root of the target adapter.
- [ ] **Frontmatter Format Lock**: Ensure that the compiler output frontmatter layout (e.g. only `name` and `description` for Codex/Claude Code; preserving full keys for Antigravity) is locked and verified.

---

## 3. Release Gates
To publish a stable version, the codebase must clear a series of mandatory quality gates.
- [ ] **Local Quality Gate Pass**: `npm run check` (build, diff, tests, validate, audit) must return exit code 0.
- [ ] **Forward-Testing Scenario Pass**: `npm run test:forward` must pass all configured scenarios cleanly in isolated sandboxes.
- [ ] **Zero Drift**: No untracked files or modifications in `adapters/` relative to `source/`.
- [ ] **CI Pipeline Pass**: The GitHub Actions `validate` workflow must complete successfully on the release commit.

---

## 4. Compatibility Promises
Stable releases promise predictability for users and automated update systems.
- [ ] **No Breaking Installer Behavior**: The installer (`tools/install-adapter.js`) must preserve any custom target files and cleanly backup conflicts without data loss.
- [ ] **Forward Compatibility**: Pre-release skills (v0.x) should continue to run on the v1.0 framework.
- [ ] **SemVer Compliance**:
  - **Patch (`v1.0.x`)**: Minor phrasing updates, bug fixes in tools.
  - **Minor (`v1.x.0`)**: Addition of new skills or optional fields.
  - **Major (`v2.0.0`)**: Changes to the catalog schema structure, renaming directory layouts, or modifications to mandatory output files.

---

## 5. Rollback Criteria
If a published stable release contains critical bugs or breaks compatibility, clear guidelines define the rollback process.
- [ ] **Rollback Trigger Conditions**:
  - The installer corrupts or deletes user files in local skill directories.
  - Built adapters cause agent runtimes (Codex, Antigravity, Claude Code) to crash or fail to load.
  - A security key or private path is discovered in a published artifact.
- [ ] **Execution Steps**:
  - Immediately revert the commit on `main`.
  - Delete premature remote git tags (`git push --delete origin v1.X.X`).
  - Delete or mark the GitHub Release as "Pre-release/Draft" and remove the uploaded zip files.
