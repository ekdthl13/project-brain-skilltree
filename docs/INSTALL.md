# Install Guide

Project Brain Skilltree uses generated adapters. Build first, then install the
adapter that matches your agent environment.

## Safe Local Success Demo (First Proof Path)

Before setting up environment variables or performing any real installation into your local AI agent directories, we strongly recommend running the safe local demo:

```bash
npm run demo
```

This deterministic command will:
1. Recompile the canonical skills from `source/`.
2. Spawn an isolated, zero-impact sandbox directory inside your OS temporary layout.
3. Simulate an adapter deployment.
4. Assert that the compilation, automatic conflict backup, and unrelated skill preservation policies operate exactly as intended.
5. Print next-step recommendations and cleanly destroy the sandbox.

## Build

```bash
npm run build:adapters
```

## Dry Run

Always dry-run before replacing an existing skills directory.

```bash
node tools/install-adapter.js codex C:\path\to\codex\skills --dry-run
node tools/install-adapter.js antigravity C:\path\to\antigravity\skills --dry-run
node tools/install-adapter.js claude-code C:\path\to\claude\skills --dry-run
```

## Install With Explicit Destination

```bash
node tools/install-adapter.js codex C:\path\to\codex\skills
node tools/install-adapter.js antigravity C:\path\to\antigravity\skills
node tools/install-adapter.js claude-code C:\path\to\claude\skills
```

If generated adapter entries already exist in the destination, the installer
backs up only those conflicting managed entries to:

```text
<destination>.backup-YYYYMMDDTHHMMSS
```

Then it copies the generated adapter entries into the destination. Unrelated
existing folders, such as system skills or other manually installed skills, are
preserved.

## Install With Environment Variables

```bash
set CODEX_SKILLS_DIR=C:\path\to\codex\skills
npm run install:codex

set ANTIGRAVITY_SKILLS_DIR=C:\path\to\antigravity\skills
npm run install:antigravity

set CLAUDE_SKILLS_DIR=C:\path\to\claude\skills
npm run install:claude
```

PowerShell:

```powershell
$env:CODEX_SKILLS_DIR = "C:\path\to\codex\skills"
npm run install:codex
```

## Safety Rules

- Edit `source/` only.
- Rebuild adapters after source changes.
- Run `npm run check` before install.
- Keep generated adapter folders out of hand edits.
- Do not point the installer at a filesystem root or repository root.
- Review backups before deleting them.

## Rollback Guidance

If a real install needs to be rolled back, keep the current destination and all backups until runtime verification succeeds.

Recommended manual rollback sequences:

### 1. Complete Restore (Revert Everything)
Use this option when you want to discard the new installation entirely and return the directory to its exact pre-installation state.

#### In Windows Command Prompt (cmd):
```cmd
:: 1. Quarantine the current active installation directory
rename "C:\path\to\destination" "skills.quarantine"

:: 2. Copy the entire backup folder back to the original destination
xcopy /E /I /H "C:\path\to\destination.backup-YYYYMMDDTHHMMSS" "C:\path\to\destination"
```

#### In Windows PowerShell:
```powershell
# 1. Quarantine the current active installation directory
Rename-Item -Path "C:\path\to\destination" -NewName "skills.quarantine"

# 2. Copy the entire backup folder back to the original destination
Copy-Item -Path "C:\path\to\destination.backup-YYYYMMDDTHHMMSS" -Destination "C:\path\to\destination" -Recurse -Force
```

---

### 2. Partial Restore (Restore Conflicts Only)
Use this option when you want to restore only the conflicting files that were replaced (e.g. system files or index), while keeping other newly added files or unrelated custom files intact.

#### In Windows Command Prompt (cmd):
```cmd
:: Overwrite only the files that were backed up back into the active directory
xcopy /E /Y /H "C:\path\to\destination.backup-YYYYMMDDTHHMMSS" "C:\path\to\destination"
```

#### In Windows PowerShell:
```powershell
# Overwrite only the files that were backed up back into the active directory
Copy-Item -Path "C:\path\to\destination.backup-YYYYMMDDTHHMMSS\*" -Destination "C:\path\to\destination" -Recurse -Force
```

After copying, restart the editor/agent environment (Codex, Antigravity, or Claude Code) so it re-reads the reverted files. Use the installer-created `<destination>.backup-YYYYMMDDTHHMMSS` folder containing only conflicting files to restore just the replaced entries.

## Example Install Transcript

Below is a typical transcript showing how to build, dry-run, install, and verify the adapter on your system.

### 1. Build and Verify local tree

Ensure there is no adapter drift and the quality gate is green:

```bash
$ npm run check

> project-brain-skilltree@0.4.0 check
> npm run build:adapters && npm run diff:adapters && npm run test && npm run validate && npm run audit

Built 12 skills for antigravity, codex, and claude-code.
Adapter diff passed. Wrote reports/adapter-diff.md.
✔ installAdapter dry-run does not write destination ...
...
ℹ tests 49
ℹ pass 49
Skilltree validation passed.
Wrote reports/skilltree-audit.md
```

### 2. Dry-Run Installation

Perform a dry run to inspect what changes will be applied and where the backup will be created:

```bash
$ node tools/install-adapter.js antigravity /path/to/gemini/skills --dry-run

[DRY RUN] Target adapter: antigravity
[DRY RUN] Target destination: /path/to/gemini/skills
[DRY RUN] Will create backup: /path/to/gemini/skills.backup-20260527T093000
[DRY RUN] Conflicting files to backup:
  - CORE_PRINCIPLES.md
  - SKILL_INDEX.md
  - 총괄매니저/SKILL.md
[DRY RUN] Unrelated files to preserve:
  - custom-helper-script.js
  - my-private-skill/
```

### 3. Run Actual Installation

Deploy the compiled adapter files:

```bash
$ node tools/install-adapter.js antigravity /path/to/gemini/skills

Installing adapter: antigravity
Backup created: /path/to/gemini/skills.backup-20260527T093000
Copied 12 skills to /path/to/gemini/skills
Preserved 2 unrelated items.
Installation completed successfully.
```
