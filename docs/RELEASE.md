# Release System Guidelines

This document outlines the release procedures, versioning rules, and strict approval gates for Project Brain Skilltree.

## Strict Approval Gates

> [!CAUTION]
> **DO NOT perform any of the following actions without explicit PM (Codex) approval:**
> 1. **Git Push**: Do not push any commits directly to remote branches without a passing review and green local checks.
> 2. **Git Tag**: Do not generate or push Git release tags (e.g. `v0.3.0`) without Codex PM review and sign-off.
> 3. **GitHub Release**: Do not publish GitHub Releases or release binaries/checksums on GitHub without explicit project manager approval.

---

## Pre-Release Checklist

Before requesting release approval, ensure all of the following gates are satisfied:

1. **Clean Working Tree**: Ensure `git status` reports no untracked or modified files (other than ignored paths).
2. **Quality Gate Pass**: Run `npm run check` and verify that all adapters build, diff reports pass, unit tests succeed, schema validation is green, and the static audit has no warnings.
3. **Forward-Testing Scenario Pass**: Run `npm run test:forward` to execute the full forward-testing suite and ensure all scenarios pass successfully.
4. **Changelog Updated**: Ensure [CHANGELOG.md](../CHANGELOG.md) contains accurate and summarized entries for the target version, with the date set appropriately.
5. **Release Verification**: Run the release preparation utility (see details below) to scan built adapters and verify integrity.
6. **CI Pipeline Pass**: Confirm that the GitHub Actions `validate` workflow runs successfully on the target commit.

---

## Release Artifacts & Preparation

Release assets consist of two distinct categories: automated registry manifests and packaged zip archives.

### 1. Release Preparation Utility
To generate automated checksums and files index manifest, execute:
```bash
npm run prepare:release
```
This utility scans the built `adapters/` directory and creates the following reports in the ignored `reports/` directory:
- **`reports/release-manifest.json`**: A JSON index of all adapter files mapped to their SHA-256 hashes and size in bytes.
- **`reports/release-checksums.txt`**: A standard hash list mapping SHA-256 signatures to relative adapter file paths.

### 2. Zip Packaging (Manual/Scripted Release Archives)
Before publishing a GitHub Release, the adapter assets must be packaged into zip archives for distribution:

> [!NOTE]
> **Packaging Platform Behavior**:
> On Windows, `tools/pack-release.js` uses PowerShell's native `Compress-Archive`
> cmdlet with hardened parameters (`-NoProfile`, `-NonInteractive`,
> `-ExecutionPolicy Bypass`). On macOS/Linux, it uses the native `zip` command
> through an argv-based command plan. Verify the packaging command on the target
> release environment before publishing assets.

1. **Packaging Command**: Create zip archives of the compiled adapters. The release expects four zip files matching the baseline pattern:
   - `project-brain-skilltree-v<version>-adapters.zip` (All generated adapters)
   - `project-brain-skilltree-v<version>-antigravity-skills.zip` (Antigravity-specific target files)
   - `project-brain-skilltree-v<version>-codex-skills.zip` (Codex-specific target files)
   - `project-brain-skilltree-v<version>-claude-code-skills.zip` (Claude Code-specific target files)
2. **Zip Checksums File**: Generate a dedicated checksum file for the packaged zips under `reports/release-artifact-checksums.txt` using SHA-256.
3. **Release Upload**: Upload these zip archives and `release-artifact-checksums.txt` to the GitHub Release.

---

## Versioning Rules (Conservative SemVer)

Project Brain adheres to a conservative Semantic Versioning (SemVer) policy:

### 1. Source Skill Versions
- Defined in `SKILL.md` frontmatter and synchronized with `catalog/skills.yaml`.
- **Patch bump (e.g., v1.1.0 -> v1.1.1)**: Minor phrasing updates, formatting changes, typos, or description corrections.
- **Minor bump (e.g., v1.1.0 -> v1.2.0)**: Substantial rule changes, new checklists, template adjustments, or workflow additions.
- **Major bump (e.g., v1.1.0 -> v2.0.0)**: Breaking changes in skill operations (e.g., splitting a skill, altering mandatory output files, changing primary agent roles).

### 2. Adapter Contract Versions
- Defined in [ADAPTER_CONTRACT.md](ADAPTER_CONTRACT.md).
- Bumping the contract version is required if:
  - The generated output directory layout changes.
  - New agent targets are added or existing targets are deprecated.
  - Frontmatter formatting changes.
- Adapter contract changes do not automatically require a root-package major
  bump unless they create a breaking multi-agent API change.

### 3. Tooling / Root Package Version
- Defined in `package.json` (`version` field).
- **Patch bump**: Tooling fixes (e.g., improvements in `diff-adapters.js`), audit layout changes, or documentation updates.
- **Minor bump**: Core features in tools (e.g., installer backups, automated test runners, release manifest tools).
- **Major bump**: Structural repository refactoring (e.g., plugin system split, changing from `source/` as canonical, or changing package private status).

---

## Release Failure & Rollback Procedures

If a release fails CI, contains critical defects, or was created by mistake, execute the following rollback steps immediately:

### 1. Local Commit / Push Failure
If a commit was pushed but fails CI:
1. Revert the commit locally using `git revert <commit-hash>`.
2. Push the revert commit immediately to restore `main` to a green state.
3. Fix the issue locally, verify with `npm run check`, and open a new PR.

### 2. Git Tag Rollback
If a tag was created and pushed prematurely or contains errors:
1. Delete the local tag:
   ```bash
   git tag -d v<version>
   ```
2. Delete the remote tag on GitHub:
   ```bash
   git push --delete origin v<version>
   ```

### 3. GitHub Release Rollback
If a draft or published GitHub Release is found to be incorrect:
1. Go to the Repository Releases page on GitHub.
2. Edit the release and select **Delete release** to remove it.
3. Delete the corresponding git tag as shown above.
4. Remove any generated release checksums or reports from local files.
