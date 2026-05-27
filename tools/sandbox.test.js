const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  SANDBOX_PREFIX,
  createSandbox,
  assertInsideSandbox,
  cleanSandbox
} = require("./lib/sandbox");

test("createSandbox creates a directory inside temp with prefix", () => {
  const sb = createSandbox();
  try {
    assert.ok(fs.existsSync(sb), "Sandbox directory was not created");
    const basename = path.basename(sb);
    assert.ok(basename.startsWith(SANDBOX_PREFIX), "Sandbox path does not start with prefix");
    const tempDir = path.resolve(os.tmpdir());
    assert.ok(sb.startsWith(tempDir), "Sandbox path is not inside os.tmpdir()");
  } finally {
    if (fs.existsSync(sb)) {
      fs.rmSync(sb, { recursive: true, force: true });
    }
  }
});

test("assertInsideSandbox allows valid sandbox paths", () => {
  const sb = createSandbox();
  try {
    const resolved = assertInsideSandbox(sb);
    assert.equal(resolved, path.resolve(sb), "Resolved path does not match");
  } finally {
    if (fs.existsSync(sb)) {
      fs.rmSync(sb, { recursive: true, force: true });
    }
  }
});

test("cleanSandbox deletes files inside sandbox", () => {
  const sb = createSandbox();
  const file = path.join(sb, "test.txt");
  fs.writeFileSync(file, "hello");
  assert.ok(fs.existsSync(file), "Test file was not written");

  cleanSandbox(sb);
  assert.ok(!fs.existsSync(file), "Test file was not deleted");
  assert.ok(!fs.existsSync(sb), "Sandbox directory was not deleted");
});

test("cleanSandbox refuses workspace repo root", () => {
  const repoRoot = path.resolve(__dirname, "..");
  assert.throws(() => {
    cleanSandbox(repoRoot);
  }, /Safety violation: Refusing repository workspace root/);
});

test("cleanSandbox refuses user home", () => {
  const userHome = os.homedir();
  assert.throws(() => {
    cleanSandbox(userHome);
  }, /Safety violation: Refusing user home directory/);
});

test("cleanSandbox refuses os.tmpdir() itself", () => {
  const tempDir = os.tmpdir();
  assert.throws(() => {
    cleanSandbox(tempDir);
  }, /Safety violation: Refusing OS temporary directory itself/);
});

test("cleanSandbox refuses temp directory paths without prefix", () => {
  const noPrefix = path.join(os.tmpdir(), "some-unprefixed-folder");
  assert.throws(() => {
    cleanSandbox(noPrefix);
  }, /Safety violation: Target path is not a valid sandbox path/);
});

test("cleanSandbox refuses mocked home and repo paths", () => {
  const mockHome = path.join(os.tmpdir(), "mock-home");
  const mockRepo = path.join(os.tmpdir(), "mock-repo");
  
  const options = {
    userHome: mockHome,
    repoRoot: mockRepo
  };

  assert.throws(() => {
    assertInsideSandbox(mockHome, options);
  }, /Safety violation: Refusing user home directory/);

  assert.throws(() => {
    assertInsideSandbox(mockRepo, options);
  }, /Safety violation: Refusing repository workspace root/);

  const mockHomeChild = path.join(mockHome, "Desktop");
  assert.throws(() => {
    assertInsideSandbox(mockHomeChild, options);
  }, /Safety violation: Refusing path within user home directory/);
});

test("cleanSandbox refuses nested sandbox path under non-sandbox parent inside temp", () => {
  const nestedPath = path.join(os.tmpdir(), "not-owned-parent", SANDBOX_PREFIX + "nested");
  
  assert.throws(() => {
    assertInsideSandbox(nestedPath);
  }, /Safety violation: Target path is not a valid sandbox path/);

  assert.throws(() => {
    cleanSandbox(nestedPath);
  }, /Safety violation: Target path is not a valid sandbox path/);
});

