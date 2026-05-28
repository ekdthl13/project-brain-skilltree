# Release v[VERSION] - [Release Name/Placeholder]

## What changed
Brief description of the changes introduced in this release, including new features, enhancements, or bug fixes.

## Public trust proof
- **Demo proof:** `npm run demo` passed in an isolated sandbox.
- **Drift guard:** `npm run check` confirmed generated `adapters/` match canonical `source/`.
- **Rollback path:** `tools/restore-adapter.js` dry-run was checked; active restore was verified if this release touched installer or restore behavior.
- **CI matrix:** GitHub Actions validate passed on Ubuntu, Windows, and macOS.

## Verification
Detail the verification steps run locally or in CI:
- [ ] `git diff --check`
- [ ] `npm run check` (runs build, diff, tests, validate, and audit)
- [ ] `npm run demo` (onboarding sandbox verification)
- [ ] `npm run test:forward` (scenario validation)

## Assets
Below are the expected release assets for this version:
- `project-brain-skilltree-v[VERSION]-adapters.zip` (All generated adapters)
- `project-brain-skilltree-v[VERSION]-antigravity-skills.zip` (Antigravity-specific target files)
- `project-brain-skilltree-v[VERSION]-codex-skills.zip` (Codex-specific target files)
- `project-brain-skilltree-v[VERSION]-claude-code-skills.zip` (Claude Code-specific target files)
- `release-artifact-checksums.txt` (SHA-256 checksums of the packaged zips)

## Upgrade/install path
To update to this release:
1. Rebuild the adapters:
   ```bash
   npm run build:adapters
   ```
2. Run a dry-run install to preview changes:
   ```bash
   node tools/install-adapter.js <target> <destination> --dry-run
   ```
3. Run the active install:
   ```bash
   node tools/install-adapter.js <target> <destination>
   ```

## Rollback path
If you need to revert:
1. Preview the rollback actions first:
   ```bash
   node tools/restore-adapter.js <target> <destination> --dry-run
   ```
2. Perform the rollback:
   ```bash
   node tools/restore-adapter.js <target> <destination>
   ```

## Known limits
Document any outstanding limitations, environmental constraints, or temporary issues here.
