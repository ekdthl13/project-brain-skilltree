const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  findLatestBackup,
  buildRestorePlan,
  restoreAdapter,
  parseArgs
} = require("./restore-adapter.js");

// Setup isolated mock repository layout
const testSuiteTempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-restore-suite-"));
const repoRoot = testSuiteTempRoot;

// Scaffold mock adapter skills source
const mockCodexSkills = path.join(repoRoot, "adapters", "codex", "skills");
fs.mkdirSync(mockCodexSkills, { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "SKILL_INDEX.md"), "# Mock Index", "utf8");
fs.mkdirSync(path.join(mockCodexSkills, "project-manager"), { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "project-manager", "SKILL.md"), "# Mock PM Skill", "utf8");
fs.mkdirSync(path.join(mockCodexSkills, "new-skill-only"), { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "new-skill-only", "SKILL.md"), "# Mock New Skill", "utf8");

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-restore-"));
}

test("findLatestBackup selects the latest alphabetical backup folder", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  
  const backup1 = `${dest}.backup-20260527T090000`;
  const backup2 = `${dest}.backup-20260528T120000`;
  const backup3 = `${dest}.backup-20260528T153000`;
  
  fs.mkdirSync(backup1);
  fs.mkdirSync(backup2);
  fs.mkdirSync(backup3);
  
  const latest = findLatestBackup(dest);
  assert.equal(latest, backup3);
});

test("buildRestorePlan resolves paths and splits lists correctly", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  
  // Create backup containing old conflicting files
  const backup = `${dest}.backup-20260528T120000`;
  fs.mkdirSync(backup);
  fs.writeFileSync(path.join(backup, "SKILL_INDEX.md"), "old index", "utf8");
  fs.mkdirSync(path.join(backup, "project-manager"));
  fs.writeFileSync(path.join(backup, "project-manager", "SKILL.md"), "old PM skill", "utf8");
  
  // Dest has active adapter files (including new one)
  fs.writeFileSync(path.join(dest, "SKILL_INDEX.md"), "adapter index", "utf8");
  fs.mkdirSync(path.join(dest, "project-manager"), { recursive: true });
  fs.writeFileSync(path.join(dest, "project-manager", "SKILL.md"), "adapter PM skill", "utf8");
  fs.mkdirSync(path.join(dest, "new-skill-only"), { recursive: true });
  fs.writeFileSync(path.join(dest, "new-skill-only", "SKILL.md"), "adapter new skill", "utf8");
  
  // Dest has unrelated custom file
  fs.writeFileSync(path.join(dest, "custom-config.json"), "custom settings", "utf8");

  const plan = buildRestorePlan({
    target: "codex",
    destination: dest,
    backup,
    repoRoot
  });

  assert.equal(plan.target, "codex");
  assert.equal(plan.backupPath, backup);
  
  // SKILL_INDEX.md and project-manager are in backup -> should be restored
  const restoreNames = plan.restoreList.map(x => x.name);
  assert.ok(restoreNames.includes("SKILL_INDEX.md"));
  assert.ok(restoreNames.includes("project-manager"));
  
  // new-skill-only is only in dest and adapter, not in backup -> should be cleaned
  const cleanNames = plan.cleanList.map(x => x.name);
  assert.ok(cleanNames.includes("new-skill-only"));
  
  // custom-config.json is unrelated -> should be preserved
  const preserveNames = plan.preserveList.map(x => x.name);
  assert.equal(preserveNames.length, 1);
  assert.equal(preserveNames[0], "custom-config.json");
});

test("restoreAdapter dry-run does not write or delete", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  
  const backup = `${dest}.backup-20260528T120000`;
  fs.mkdirSync(backup);
  fs.writeFileSync(path.join(backup, "SKILL_INDEX.md"), "old index", "utf8");
  
  fs.writeFileSync(path.join(dest, "SKILL_INDEX.md"), "adapter index", "utf8");
  fs.mkdirSync(path.join(dest, "new-skill-only"), { recursive: true });
  
  const result = restoreAdapter({
    target: "codex",
    destination: dest,
    backup,
    repoRoot,
    dryRun: true
  });
  
  assert.equal(result.dryRun, true);
  assert.equal(result.restored, false);
  
  // File states must remain unchanged
  assert.equal(fs.readFileSync(path.join(dest, "SKILL_INDEX.md"), "utf8"), "adapter index");
  assert.equal(fs.existsSync(path.join(dest, "new-skill-only")), true);
  assert.equal(fs.existsSync(path.join(backup, "SKILL_INDEX.md")), true);
});

test("restoreAdapter performs active rollback and preserves the backup folder and its files", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  
  const backup = `${dest}.backup-20260528T120000`;
  fs.mkdirSync(backup);
  fs.writeFileSync(path.join(backup, "SKILL_INDEX.md"), "old index", "utf8");
  
  fs.writeFileSync(path.join(dest, "SKILL_INDEX.md"), "adapter index", "utf8");
  fs.mkdirSync(path.join(dest, "new-skill-only"), { recursive: true });
  fs.writeFileSync(path.join(dest, "new-skill-only", "SKILL.md"), "adapter new skill", "utf8");
  fs.writeFileSync(path.join(dest, "my-own-script.js"), "console.log(1)", "utf8");
  
  const result = restoreAdapter({
    target: "codex",
    destination: dest,
    backup,
    repoRoot
  });
  
  assert.equal(result.restored, true);
  
  // 1. SKILL_INDEX.md restored to old index
  assert.equal(fs.readFileSync(path.join(dest, "SKILL_INDEX.md"), "utf8"), "old index");
  
  // 2. new-skill-only removed
  assert.equal(fs.existsSync(path.join(dest, "new-skill-only")), false);
  
  // 3. my-own-script.js preserved
  assert.equal(fs.readFileSync(path.join(dest, "my-own-script.js"), "utf8"), "console.log(1)");
  
  // 4. backup folder and its files are preserved (not deleted)
  assert.equal(fs.existsSync(backup), true);
  assert.equal(fs.readFileSync(path.join(backup, "SKILL_INDEX.md"), "utf8"), "old index");
});

test("buildRestorePlan explicit backup safety validation", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  
  // 1. Sibling path with correct prefix: should pass
  const validBackup = `${dest}.backup-20260528T120000`;
  fs.mkdirSync(validBackup);
  
  const plan = buildRestorePlan({
    target: "codex",
    destination: dest,
    backup: validBackup,
    repoRoot
  });
  assert.equal(plan.backupPath, validBackup);

  // 2. Non-sibling backup path: should fail
  const unrelatedDir = path.join(root, "unrelated-folder", "skills.backup-20260528T120000");
  fs.mkdirSync(path.dirname(unrelatedDir), { recursive: true });
  fs.mkdirSync(unrelatedDir);

  assert.throws(
    () => buildRestorePlan({
      target: "codex",
      destination: dest,
      backup: unrelatedDir,
      repoRoot
    }),
    /Safety violation: Backup directory must be a sibling of the destination directory.*This prevents restoring from arbitrary or unsafe paths/
  );

  // 3. Sibling directory without correct backup suffix prefix: should fail
  const badSibling = path.join(root, "skills.other-random-suffix");
  fs.mkdirSync(badSibling);

  assert.throws(
    () => buildRestorePlan({
      target: "codex",
      destination: dest,
      backup: badSibling,
      repoRoot
    }),
    /Safety violation: Backup directory name must start with.*This ensures only backups created by the installer/
  );
});

test("restoreAdapter parseArgs parses help option correctly without target/destination", () => {
  const parsed1 = parseArgs(["--help"]);
  assert.equal(parsed1.help, true);

  const parsed2 = parseArgs(["-h"]);
  assert.equal(parsed2.help, true);

  const parsed3 = parseArgs(["codex", "some-dir", "--help"]);
  assert.equal(parsed3.help, true);
});
