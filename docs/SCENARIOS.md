# Real User Scenario Examples

This guide provides step-by-step, copy-pasteable scenarios to help you verify, preview, and revert Project Brain Skilltree installations in safe local environments.

Use these scenarios as the public trust path:

| Step | Scenario | Confidence gained |
|------|----------|-------------------|
| 1 | Demo proof | The pipeline works in a sandbox before touching real agent folders |
| 2 | Dry-run install preview | You can see new files, backups, and preserved files before writing |
| 3 | Rollback rehearsal | You can reverse an install from the generated backup path |

---

## Scenario 1: Demo Proof (`npm run demo`)

If you want to verify that the compilation, backup-aware installation, and custom file preservation mechanisms work correctly on your operating system without making any changes to your real agent settings, run the built-in sandbox demo.

### 1. Execute the Demo
Run the following command in your terminal from the repository root:
```bash
npm run demo
```

### 2. What Happens Behind the Scenes
1. **Rebuilds Adapters**: Compiles the source files inside `source/` into runtime adapters inside `adapters/`.
2. **Creates Sandbox**: Spawns an isolated temporary folder under your OS temporary directory (e.g. `project-brain-sandbox-XXXXXX`).
3. **Scaffolds Files**: 
   - Pre-populates a conflicting `CORE_PRINCIPLES.md` (to test backups).
   - Pre-populates a custom folder `custom-user-skill/SKILL.md` (to test file preservation).
4. **Installs Adapter**: Automatically deploys the `antigravity` adapter into the sandbox.
5. **Verifies Safety**:
   - Asserts that the new `CORE_PRINCIPLES.md` has been successfully deployed.
   - Asserts that a backup directory (`mock-agent-skills.backup-20260528T090000`) contains the old conflicting `CORE_PRINCIPLES.md`.
   - Asserts that `custom-user-skill/SKILL.md` remains untouched.
6. **Cleans Up**: Completely deletes the temporary sandbox folder, leaving no trace on your filesystem.

---

## Scenario 2: Dry-Run Install Preview

Before pointing the installer at an active skills directory, you should perform a dry-run to preview exactly what will change.

### 1. Set Up a Test Target
Create a mock directory structure to simulate your active agent config:
```bash
# Create a temporary directory outside the repository for safety
mkdir ../temp-agent-skills
mkdir ../temp-agent-skills/custom-skill

# Populate a mock conflict file and a mock custom file
echo "# Old Content" > ../temp-agent-skills/SKILL_INDEX.md
echo "# Custom Local Skill" > ../temp-agent-skills/custom-skill/SKILL.md
```

### 2. Execute Dry-Run Installation
Run the installer with the `--dry-run` flag pointing to your test directory:
```bash
node tools/install-adapter.js antigravity ../temp-agent-skills --dry-run
```

### 3. Expected Output
The CLI will print a preview plan and terminate without writing or deleting any files:
```text
[DRY RUN] Target adapter: antigravity
[DRY RUN] Destination: C:\path\to\temp-agent-skills
[DRY RUN] Will create backup: C:\path\to\temp-agent-skills.backup-20260528T150000

[DRY RUN] Files that would be written (new):
  - CORE_PRINCIPLES.md
  - ORCHESTRATION.md
  - ... (other skills)

[DRY RUN] Files that would be backed up and replaced (conflicting):
  - SKILL_INDEX.md

[DRY RUN] Files that would be preserved (unrelated):
  - custom-skill/
```

Verify that the files in `../temp-agent-skills` are completely unchanged.

---

## Scenario 3: Rollback Rehearsal

If you need to undo an installation, you can restore files automatically using the backup folder created during the installation.

### 1. Perform a Real Installation into the Test Target
Run the installer without the dry-run flag to perform a real deployment:
```bash
node tools/install-adapter.js antigravity ../temp-agent-skills
```

This will:
- Back up `SKILL_INDEX.md` into a sibling folder (e.g. `../temp-agent-skills.backup-20260528T150000`).
- Deploy all adapter skills into `../temp-agent-skills`.
- Preserve `../temp-agent-skills/custom-skill/`.

### 2. Preview the Restore Plan (Dry-Run)
Before performing the rollback, preview the restore operations:
```bash
node tools/restore-adapter.js antigravity ../temp-agent-skills --dry-run
```

The output will outline the exact files to restore, delete, or preserve:
```text
[DRY RUN] Restore Plan for: antigravity
Destination: C:\path\to\temp-agent-skills
Backup path: C:\path\to\temp-agent-skills.backup-20260528T150000

Files to restore (backed up -> original destination):
  - SKILL_INDEX.md

Files to clean (newly added files to be removed):
  - CORE_PRINCIPLES.md
  - ORCHESTRATION.md
  - ...

Unrelated files to preserve (untouched):
  - custom-skill/

Dry run: no files changed
```

### 3. Execute the Rollback
Run the restore script to perform the active rollback:
```bash
node tools/restore-adapter.js antigravity ../temp-agent-skills
```

### 4. Verify Rollback Integrity
- Verify that `../temp-agent-skills/SKILL_INDEX.md` contains your original `# Old Content`.
- Verify that `../temp-agent-skills/custom-skill/SKILL.md` is preserved.
- Verify that the newly added skill files/folders (such as `CORE_PRINCIPLES.md`) have been deleted.
- Note: The backup directory `../temp-agent-skills.backup-20260528T150000` is preserved for safety. Once you confirm the rollback is successful, you can manually delete it.
