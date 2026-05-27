const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { getFilesRecursively, calculateSha256 } = require("./prepare-release.js");

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-release-"));
}

test("getFilesRecursively lists all files in subdirectories", () => {
  const dir = tempDir();
  const sub1 = path.join(dir, "sub1");
  fs.mkdirSync(sub1, { recursive: true });

  const file1 = path.join(dir, "file1.txt");
  const file2 = path.join(sub1, "file2.txt");

  fs.writeFileSync(file1, "hello", "utf8");
  fs.writeFileSync(file2, "world", "utf8");

  const files = getFilesRecursively(dir);
  assert.equal(files.length, 2);
  assert.ok(files.includes(file1));
  assert.ok(files.includes(file2));
});

test("calculateSha256 returns correct hash for a file", () => {
  const dir = tempDir();
  const file = path.join(dir, "test.txt");
  fs.writeFileSync(file, "test-content", "utf8");

  // SHA-256 for "test-content" is 0a3666a0710c08aa6d0de92ce72beeb5b93124cce1bf3701c9d6cdeb543cb73e
  const expectedHash = "0a3666a0710c08aa6d0de92ce72beeb5b93124cce1bf3701c9d6cdeb543cb73e";
  const actualHash = calculateSha256(file);
  assert.equal(actualHash, expectedHash);
});
