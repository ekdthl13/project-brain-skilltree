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

## v0.3.0 (Dynamic Testing & Creation CLI - Released)

- Add sandboxed deterministic forward-testing harness (`tools/forward-tester.js`).
- Add aggregate forward-test suite command (`npm run test:forward`).
- Wire forward-tests into GitHub Actions after `npm run check`.
- Add JSON pressure fixtures for adapter edits, validation-skipping, and private path leakage.
- Add `npm run new:skill` to create draft source skills, update the catalog, and add a router/index mention.
- Publish GitHub Release `v0.3.0` with adapter artifacts and checksums.

## v0.4.0 (Operational Hardening - Released)

- Simplify README onboarding into a 3-minute external-user path.
- Refresh install, new-skill, and release docs against the v0.3.0 baseline.
- Add practical forward-testing scenarios for common agent mistakes.
- Produce a Core / Domain / Personal separation impact analysis without changing physical `source/` layout.
- Establish bilingual terminology guidance for public docs and adapter discoverability.
- Draft v1.0.0 stable-contract freeze criteria without locking them prematurely.
- Preserve the `v0.3.0` release as the previous public baseline.
- Keep `npm run check` and `npm run test:forward` as mandatory release gates.
- Publish GitHub Release `v0.4.0` with adapter artifacts and checksums.

## v0.5.0 (First Success Demo - Released)

- Add a safe `npm run demo` command for first-time users.
- Use deterministic local sandbox fixtures to prove the operating model without installing into user agent directories.
- Show a clear success result and next-step commands after the demo completes.
- Document the demo in README or the relevant quickstart/install docs.
- Keep v1.0 contract freezing, schema locking, adapter slug changes, and physical Core / Domain / Personal restructuring out of scope.
- Publish GitHub Release `v0.5.0` after the first-success path is verified.

## v1.0.0 (Stable Release - Released)

- Freeze the stable skill manifest schema and adapter contract.
- Keep `source/` as the canonical human-edited root and `adapters/` as generated output.
- Preserve official adapter slugs and release packaging contracts.
- Require `npm run check`, `npm run test:forward`, and `npm run demo` as release baseline proof.
- Publish GitHub Release `v1.0.0` with adapter artifacts and checksums.

## v1.0.1 (Documentation Consistency)

- Align public status docs with the released `v1.0.0` baseline.
- Correct stale release references, install transcript versions, and catalog-backed adapter slugs.
- Verify post-v1 public surfaces without adding features or changing stable contracts.

## v1.1.0 (Post-v1 Productization - Released)

- Add real user scenario examples and a public "Why This Exists" page.
- Harden install and restore CLI UX, including active restore regression coverage.
- Expand validation CI across Ubuntu, Windows, and macOS.
- Improve skill quality scorecard diagnostics for PM review and future hardening.
