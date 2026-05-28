# Public Clarity Checklist

Use this checklist before releasing or accepting a new version of Project Brain Skilltree. It ensures the public trust path is complete and external users can onboard safely.

## 1. Onboarding & Safety (The 5-Minute Path)
- [ ] **One-Sentence Clarity:** Can a newcomer explain the project in one sentence? (e.g., "Project Brain Skilltree gives AI agent skills one source of truth, compiling them safely for multiple targets with built-in sandbox validation and rollback.")
- [ ] **Physical Architecture:** Can they immediately identify the canonical root (`source/`) and the generated output (`adapters/`)?
- [ ] **No-Risk Proof:** Can they run a no-risk sandbox proof before installing anything? (`npm run demo` works out-of-the-box on a fresh checkout).
- [ ] **Dry-Run Preview:** Can they preview changes and backups before writing files? (`--dry-run` is highlighted for installation).
- [ ] **Rollback path:** Is the rollback path easily found and clearly explained? (`tools/restore-adapter.js` documented and rehearsed).

## 2. Vocabulary & Consistency
- [ ] **Trust Language Alignment:** Do `README.md`, `docs/WHY.md`, `docs/INSTALL.md`, `docs/SCENARIOS.md`, and the release notes template consistently use the same vocabulary:
  - *Demo proof* (sandbox validation)
  - *Drift guard* (quality gate checks)
  - *Rollback path* (restore utility)
  - *CI matrix* (cross-platform verification)
- [ ] **Metadata Alignment:** Are version numbers, latest release tags, and unit test count references current and correct across all docs?
