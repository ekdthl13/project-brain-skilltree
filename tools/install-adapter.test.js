const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildInstallPlan,
  installAdapter,
  resolveTargetSource
} = require("./install-adapter.js");

const repoRoot = path.resolve(__dirname, "..");

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

test("installAdapter backs up an existing destination before replacing it", () => {
  const root = tempDir();
  const dest = path.join(root, "skills");
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "old.txt"), "old", "utf8");

  const result = installAdapter({
    target: "codex",
    destination: dest,
    repoRoot,
    now: () => "20260526T133000"
  });

  assert.equal(fs.existsSync(path.join(result.backupPath, "old.txt")), true);
  assert.equal(fs.existsSync(path.join(dest, "SKILL_INDEX.md")), true);
  assert.equal(fs.existsSync(path.join(dest, "project-manager", "SKILL.md")), true);
});

