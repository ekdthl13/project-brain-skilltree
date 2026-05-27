# Roadmap

## v0.1.0 (Released)

- Establish GitHub repo as canonical source.
- Import 12 canonical source skills.
- Build Antigravity, Codex, and Claude Code adapters.
- Add validation, audit, and CI.
- Add installer scripts with dry-run, backup, and preservation rules.
- Add `npm run diff:adapters` and `reports/adapter-diff.md`.
- Add static pressure scenario tests and schema stability checks.
- Add minimal example project bootstraps.
- Build release system foundation (changelog, checksum generation, zip packaging).
- Publish GitHub Release `v0.1.0` with tagged release and checksum archives.

## v0.2.0 (Post-Release & Verification - Completed)

- Align GitHub repository description and topics for public discovery.
- Perform local Claude Code installation verification and smoke-tests.
- Design and document 3 external-user quickstarts (PRD creation, project-manager bootstrap, launch check).

## v0.3.0 (Dynamic Testing & Creation CLI - Release Candidate)

- Add sandboxed deterministic forward-testing harness (`tools/forward-tester.js`).
- Add aggregate forward-test suite command (`npm run test:forward`).
- Wire forward-tests into GitHub Actions after `npm run check`.
- Add JSON pressure fixtures for adapter edits, validation-skipping, and private path leakage.
- Add `npm run new:skill` to create draft source skills, update the catalog, and add a router/index mention.
- Publish GitHub Release `v0.3.0` after final local checks and release artifacts pass.

## v1.0.0 (Stable Release)

- Stable skill manifest schema.
- Stable adapter contract.
- Full CI quality gate required for release tags.
