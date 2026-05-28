const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildInstallPlan,
  installAdapter,
  resolveTargetSource,
  parseArgs
} = require("./install-adapter.js");

// Create a completely isolated mock repository layout for the installer tests
// to prevent parallel test execution race conditions with other tests that rebuild adapters.
const testSuiteTempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-installer-suite-"));
const repoRoot = testSuiteTempRoot;

// Scaffold mock adapters
const mockCodexSkills = path.join(repoRoot, "adapters", "codex", "skills");
fs.mkdirSync(mockCodexSkills, { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "SKILL_INDEX.md"), "# Mock Index", "utf8");
fs.mkdirSync(path.join(mockCodexSkills, "project-manager"), { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "project-manager", "SKILL.md"), "# Mock Skill", "utf8");
fs.mkdirSync(path.join(mockCodexSkills, "office-hours"), { recursive: true });
fs.writeFileSync(path.join(mockCodexSkills, "office-hours", "SKILL.md"), "# Mock Office Hours", "utf8");

const mockAntigravitySkills = path.join(repoRoot, "adapters", "antigravity", "skills");
fs.mkdirSync(mockAntigravitySkills, { recursive: true });
fs.writeFileSync(path.join(mockAntigravitySkills, "SKILL_INDEX.md"), "# Mock Index", "utf8");

const mockClaudeSkills = path.join(repoRoot, "adapters", "claude-code", "skills");
fs.mkdirSync(mockClaudeSkills, { recursive: true });
fs.writeFileSync(path.join(mockClaudeSkills, "SKILL_INDEX.md"), "# Mock Index", "utf8");


function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-install-"));
}

test("resolveTargetSource rejects unknown adapter targets", () => {
  assert.throws(
    () => resolveTargetSource("unknown", repoRoot),
    /Unknown adapter target/
  );
});

test("buildInstallPlan resolves a valid source and destination", () => {
  const dest = path.join(tempDir(), "skills");
  const plan = buildInstallPlan({
    target: "codex",
    destination: dest,
    repoRoot
  });

  assert.equal(plan.target, "codex");
  assert.equal(plan.destination, path.resolve(dest));
  assert.equal(plan.source, path.join(repoRoot, "adapters", "codex", "skills"));
  assert.equal(plan.backupPath, null);
});

test("installAdapter dry-run does not write destination", () => {
  const dest = path.join(tempDir(), "skills");
  const result = installAdapter({
    target: "codex",
    destination: dest,
    repoRoot,
    dryRun: true
  });

  assert.equal(result.dryRun, true);
  assert.equal(fs.existsSync(dest), false);
});

test("installAdapter backs up conflicting managed entries before replacing them", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "SKILL_INDEX.md"), "old", "utf8");

  const result = installAdapter({
    target: "codex",
    destination: dest,
    repoRoot,
    now: () => "20260526T133000"
  });

  assert.equal(fs.existsSync(path.join(result.backupPath, "SKILL_INDEX.md")), true);
  assert.equal(fs.existsSync(path.join(dest, "SKILL_INDEX.md")), true);
  assert.equal(fs.existsSync(path.join(dest, "project-manager", "SKILL.md")), true);
});

test("installAdapter preserves unrelated existing destination entries", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  const unrelated = path.join(dest, ".system");
  fs.mkdirSync(unrelated, { recursive: true });
  fs.writeFileSync(path.join(unrelated, "keep.txt"), "keep", "utf8");

  installAdapter({
    target: "codex",
    destination: dest,
    repoRoot,
    now: () => "20260526T134500"
  });

  assert.equal(fs.existsSync(path.join(unrelated, "keep.txt")), true);
  assert.equal(fs.existsSync(path.join(dest, "project-manager", "SKILL.md")), true);
});

test("installAdapter handles relative destinations correctly", () => {
  const root = tempDir();
  const oldCwd = process.cwd();
  try {
    process.chdir(root);
    const relativeDest = "./relative-skills";
    const resolvedDest = path.resolve(relativeDest);

    const result = installAdapter({
      target: "codex",
      destination: relativeDest,
      repoRoot,
      dryRun: false
    });

    assert.equal(result.destination, resolvedDest);
    assert.equal(fs.existsSync(resolvedDest), true);
    assert.equal(fs.existsSync(path.join(resolvedDest, "project-manager", "SKILL.md")), true);
  } finally {
    process.chdir(oldCwd);
  }
});

test("installAdapter normalizes mixed slashes destinations correctly", () => {
  const root = tempDir();
  const mixedDest = root + "/mixed\\slash/destination/";
  const resolvedDest = path.resolve(mixedDest);

  const result = installAdapter({
    target: "codex",
    destination: mixedDest,
    repoRoot,
    dryRun: false
  });

  assert.equal(result.destination, resolvedDest);
  assert.equal(fs.existsSync(resolvedDest), true);
  assert.equal(fs.existsSync(path.join(resolvedDest, "project-manager", "SKILL.md")), true);
});

test("installAdapter parseArgs parses help option correctly without target/destination", () => {
  const parsed1 = parseArgs(["--help"]);
  assert.equal(parsed1.help, true);

  const parsed2 = parseArgs(["-h"]);
  assert.equal(parsed2.help, true);

  const parsed3 = parseArgs(["codex", "some-dir", "--help"]);
  assert.equal(parsed3.help, true);
});

test("installAdapter dry-run includes willWrite, willBackup, willPreserve lists at top-level granularity", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });

  // Scaffold a conflict in destination
  fs.writeFileSync(path.join(dest, "SKILL_INDEX.md"), "old index", "utf8");

  // Scaffold an unrelated item in destination
  fs.mkdirSync(path.join(dest, "unrelated-custom-folder"));
  fs.writeFileSync(path.join(dest, "unrelated-custom-folder", "custom.txt"), "hello", "utf8");

  const result = installAdapter({
    target: "codex",
    destination: dest,
    repoRoot,
    dryRun: true
  });

  assert.equal(result.dryRun, true);
  // Codex mock adapter has: SKILL_INDEX.md (conflict), project-manager/ (new), office-hours/ (new)
  assert.ok(result.willBackup.includes("SKILL_INDEX.md"));
  assert.ok(result.willWrite.includes("project-manager/"));
  assert.ok(result.willWrite.includes("office-hours/"));
  assert.ok(result.willPreserve.includes("unrelated-custom-folder/"));
});

test("installAdapter assertion throws improved safety error messages", () => {
  const rootPath = path.parse(process.cwd()).root;
  assert.throws(
    () => buildInstallPlan({ target: "codex", destination: rootPath, repoRoot }),
    /Pointing the installer at the root directory of a drive can cause accidental data loss/
  );

  assert.throws(
    () => buildInstallPlan({ target: "codex", destination: repoRoot, repoRoot }),
    /The installer must be pointed to a subdirectory dedicated to agent skills/
  );
});
