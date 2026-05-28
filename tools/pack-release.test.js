const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { calculateSha256, zipFolder, buildUnixZipCommand } = require("./pack-release.js");

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-pack-test-"));
}

test("calculateSha256 computes matching checksum", () => {
  const root = tempDir();
  const filePath = path.join(root, "test.txt");
  fs.writeFileSync(filePath, "hello world", "utf8");
  
  const hash = calculateSha256(filePath);
  // Expected sha256 of "hello world"
  assert.equal(hash, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
});

test("zipFolder creates a valid zip file", () => {
  const root = tempDir();
  const srcFolder = path.join(root, "src");
  fs.mkdirSync(srcFolder);
  fs.writeFileSync(path.join(srcFolder, "file1.txt"), "hello", "utf8");
  fs.writeFileSync(path.join(srcFolder, "file2.txt"), "world", "utf8");
  
  const destZip = path.join(root, "output.zip");
  
  // Test directory compression (non-wildcard)
  zipFolder(srcFolder, destZip);
  
  assert.equal(fs.existsSync(destZip), true);
  assert.ok(fs.statSync(destZip).size > 0);
  
  // Test wildcard compression
  const wildcardSrc = path.join(srcFolder, "*");
  const wildcardDestZip = path.join(root, "wildcard-output.zip");
  
  zipFolder(wildcardSrc, wildcardDestZip);
  
  assert.equal(fs.existsSync(wildcardDestZip), true);
  assert.ok(fs.statSync(wildcardDestZip).size > 0);
});

test("buildUnixZipCommand builds correct zip parameters (wildcard)", () => {
  const src = path.join("test-dir", "adapters", "*");
  const destZip = path.join("test-dir", "output.zip");
  
  const plan = buildUnixZipCommand(src, destZip);
  
  assert.equal(plan.command, "zip");
  assert.deepEqual(plan.args, ["-q", "-r", path.resolve(destZip), "."]);
  assert.equal(plan.cwd, path.resolve(path.join("test-dir", "adapters")));
});

test("buildUnixZipCommand builds correct zip parameters (non-wildcard)", () => {
  const src = path.join("test-dir", "adapters", "antigravity");
  const destZip = path.join("test-dir", "output.zip");
  
  const plan = buildUnixZipCommand(src, destZip);
  
  assert.equal(plan.command, "zip");
  assert.deepEqual(plan.args, ["-q", "-r", path.resolve(destZip), "antigravity"]);
  assert.equal(plan.cwd, path.resolve(path.join("test-dir", "adapters")));
});
