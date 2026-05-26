# Install Guide

Project Brain Skilltree uses generated adapters. Build first, then install the
adapter that matches your agent environment.

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
