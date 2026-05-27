# Release System Guidelines

This document outlines the release procedures, versioning rules, and strict approval gates for Project Brain Skilltree.

## Strict Approval Gates

> [!CAUTION]
> **DO NOT perform any of the following actions without explicit PM (Codex) approval:**
> 1. **Git Push**: Do not push any commits directly to remote branches without a passing review and green local checks.
> 2. **Git Tag**: Do not generate or push Git release tags (e.g. `v0.1.0`) without Codex PM review and sign-off.
> 3. **GitHub Release**: Do not publish GitHub Releases or release binaries/checksums on GitHub without explicit project manager approval.

---

## Pre-Release Checklist

Before requesting release approval, ensure all of the following gates are satisfied:

1. **Clean Working Tree**: Ensure `git status` reports no untracked or modified files (other than ignored paths).
2. **Quality Gate Pass**: Run `npm run check` and verify that all adapters build, diff reports pass, unit tests succeed, schema validation is green, and the static audit has no warnings.
3. **Changelog Updated**: Ensure [CHANGELOG.md](../CHANGELOG.md) contains accurate and summarized entries for the target version, with the date set appropriately.
4. **Release Verification**: Run the release preparation utility to generate checksums:
   ```bash
   npm run prepare:release
   ```
   Confirm that reports are generated in the ignored `reports/` folder.
5. **CI Pipeline Pass**: Confirm that the GitHub Actions `validate` workflow runs successfully on the target commit.

---

## Versioning Rules (SemVer for pre-release v0.x)

Project Brain adheres to a conservative Semantic Versioning (SemVer) policy for the `v0.x` pre-release phase:

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
- During the `v0.x` phase, adapter contract changes must not trigger a major version change in the root package unless a breaking multi-agent API change occurs.

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
