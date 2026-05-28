# v1.0 Stable-Contract Freeze Checklist

This document details the checklist and exit criteria required to stabilize the Project Brain Skilltree contracts for the `v1.0.0` stable release. Hardening these areas ensures that multi-agent systems and third-party integrations can rely on a fixed, predictable interface.

---

## 1. Catalog Schema Freeze
The catalog schema defines the API contract between the source skill definitions and the adapter build system.
- [x] **JSON Schema Validation**: Standardize `catalog/skills.yaml` to conform to a strict JSON Schema validation check inside `npm run check`.
- [x] **Field Locking**: Freeze the core fields (`id`, `source`, `version`, `adapterName`, `description`) to prevent breaking builds.
- [x] **Strict Typing**: Enforce constraints on versions (strictly SemVer compatible) and target tags.

---

## 2. Adapter Layout & Slug Stability
The physical layout of adapter files on disk must remain stable so that target agent runtimes can consistently locate skills and system guides.
- [x] **Slug Preservation**: Once a skill's `adapterName` is defined (e.g. `project-manager`), it is locked. Renaming slugs requires a major version bump.
- [x] **Folder Structure Hardening**: Freeze the directory layout of compiled adapter folders:
  - Flat directories under `adapters/<agent>/skills/<slug>/`
  - Canonical placement of `CANONICAL_ROOT.md`, `CORE_PRINCIPLES.md`, `ORCHESTRATION.md`, and `SKILL_INDEX.md` at the root of the target adapter.
- [x] **Frontmatter Format Lock**: Ensure that the compiler output frontmatter layout (e.g. only `name` and `description` for Codex/Claude Code; preserving full keys for Antigravity) is locked and verified.

---

## 3. Release Gates
To publish a stable version, the codebase must clear a series of mandatory quality gates.
- [ ] **Local Quality Gate Pass**: `npm run check` (build, diff, tests, validate, audit) must return exit code 0 on the v1.0.0 release candidate.
- [ ] **Forward-Testing Scenario Pass**: `npm run test:forward` must pass all configured scenarios cleanly in isolated sandboxes on the v1.0.0 release candidate.
- [ ] **Demo Pass**: `npm run demo` must pass on the v1.0.0 release candidate.
- [ ] **Zero Drift**: No untracked files or modifications in `adapters/` relative to `source/` on the v1.0.0 release candidate.
- [ ] **CI Pipeline Pass**: The GitHub Actions `validate` workflow must complete successfully on the v1.0.0 release commit.

Pre-RC evidence on commit `4674f49b5195db03f065908ef823798539966426` passed the local quality gate, forward-testing suite, demo, packaging, staging installs, and current `main` CI. The release-gate boxes above remain open because they must be checked on the actual v1.0.0 release candidate and release commit.

---

## 4. Compatibility Promises
Stable releases promise predictability for users and automated update systems.
- [x] **No Breaking Installer Behavior**: The installer (`tools/install-adapter.js`) must preserve any custom target files and cleanly backup conflicts without data loss.
- [x] **Forward Compatibility**: Pre-release skills (v0.x) should continue to run on the v1.0 framework.
- [x] **SemVer Compliance**:
  - **Patch (`v1.0.x`)**: Minor phrasing updates, bug fixes in tools.
  - **Minor (`v1.x.0`)**: Addition of new skills or optional fields.
  - **Major (`v2.0.0`)**: Changes to the catalog schema structure, renaming directory layouts, or modifications to mandatory output files.

---

## 5. Rollback Criteria
If a published stable release contains critical bugs or breaks compatibility, clear guidelines define the rollback process.
- [x] **Rollback Trigger Conditions**:
  - The installer corrupts or deletes user files in local skill directories.
  - Built adapters cause agent runtimes (Codex, Antigravity, Claude Code) to crash or fail to load.
  - A security key or private path is discovered in a published artifact.
- [x] **Execution Steps**:
  - Immediately revert the commit on `main`.
  - Delete premature remote git tags (`git push --delete origin v1.X.X`).
  - Delete or mark the GitHub Release as "Pre-release/Draft" and remove the uploaded zip files.

---

## v1.0.0 Stable Contract Audit Results (v0.5.0 Evaluation)

Before locking contracts for the production `v1.0.0` stable release, we performed a technical audit on the central catalog schema, adapter layout, installation logic, release workflow, and rollback mechanisms. This section records v0.5.0 evidence and pre-v1 recommendations; it does not mark the final v1.0.0 release checklist as complete.

### 1. Stable Contract Classifications

Each core contract area is evaluated and mapped to one of three release-ready statuses:

| Category | Candidate Target | Classification | Diagnostic / Proposed Action |
| :--- | :--- | :--- | :--- |
| **Catalog Schema** | Schema properties & validations | **Lock now** | Core fields are validated by `schema-stability.test.js` and `validate-skilltree.js`; freeze the current required fields unless a future major version changes them. |
| **Catalog Schema** | Registry file serialization | **Lock now with documentation** | `catalog/skills.yaml` is intentionally YAML-compatible JSON and is documented that way in `docs/ARCHITECTURE.md` and `docs/SCHEMA_STABILITY.md`. Rewriting to free-form YAML would touch many tools and is not required for v1. |
| **Adapter Layout** | Directory names & slugs | **Lock now** | Portable lowercase hyphen directory slugs under `skills/` (e.g. `project-manager`) are stable and locked. |
| **Adapter Layout** | Compiled file constraints | **Lock now** | Direct validation assertions for generated root files, portable adapter index shape, and compiled frontmatter formats have been added and verified. |
| **Installer Safety** | Backup & Preservation | **Lock now after RC verification** | Backup-aware timestamp mechanism and custom skill folder preservation rules are covered by tests and demo evidence; re-run on the v1 release candidate before final lock. |
| **Installer Safety** | Path normalization evidence | **Lock now** | Explicit mixed-slash and relative-destination tests have been added to the test suite and verify correct path resolution. |
| **Installer Safety** | Backup limits | **Defer after v1** | Limiting max backups counts or providing zip-based compressed backups can be deferred to post-v1. |
| **Release Gates** | Check, Forward-test, Demo | **Lock now** | 3-stage validation (`npm run check` + `npm run test:forward` + `npm run demo`) should become the mandatory stable release gate. |
| **Release Gates** | Sandboxed execution | **Lock now** | Sandboxing has been hardened using node's native collision-resistant fs.mkdtempSync API. Tests prove uniqueness, anti-overwrite safety, and error-proof try-finally cleanup lifecycles. |
| **Windows Packaging** | PowerShell Compress-Archive | **Lock now** | `tools/pack-release.js` has been hardened with secure PowerShell invocation and single-quote escaping; Windows packaging environment is formally documented. |
| **Windows Packaging** | Cross-platform packaging | **Defer until after v1** | Full OS-independent packaging can wait if v1 clearly documents Windows release tooling as the supported packaging path. |
| **Rollback Criteria** | Revert & delete procedures | **Lock now with documentation** | Manual rollback steps are clear enough for v1 if documented in release guidance. |
| **Rollback Criteria** | Automated restoration | **Defer until after v1** | `tools/rollback-adapter.js` is useful but not a v1 blocker because installer backups already exist and manual rollback can be documented. |

---

### 2. PM-Approved Pre-v1 Stabilization Focus

The next worker order should focus on guardrails that directly support stable-contract confidence. Avoid schema rewrites or broad new utilities unless the audit evidence proves they are necessary.

#### A. Catalog format contract documentation
- **Decision**: Keep `catalog/skills.yaml` as YAML-compatible JSON for v1.
- **Action**: Ensure docs and tests explicitly describe this as an intentional contract, not a formatting accident.

#### B. Direct adapter contract assertions in `validate-skilltree.js`
- **Issue**: Validation checks many adapter properties, but v1 should make root file placement, generated index text, and portable frontmatter shape explicit.
- **Action**: Add direct content-shape assertions for compiled adapter artifacts into the validation pipeline.

#### C. Installer path normalization tests
- **Issue**: `install-adapter.js` already resolves paths, but v1 should prove mixed slashes and relative destinations behave safely.
- **Action**: Add focused tests for path normalization behavior. Only change installer code if the tests reveal a real gap.

#### D. Release packaging shell hardening
- **Issue**: `pack-release.js` depends on PowerShell `Compress-Archive` and string-built shell invocation.
- **Action**: Harden invocation with safer argument passing and document Windows as the current packaging environment. Full cross-platform packaging can be deferred.

#### E. Rollback guidance
- **Decision**: A rollback CLI is useful but not required before v1.
- **Action**: Ensure release or install docs clearly explain how to restore from installer backups. Defer `tools/rollback-adapter.js` unless user testing shows manual rollback is too error-prone.
