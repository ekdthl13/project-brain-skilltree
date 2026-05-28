const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { runDemo } = require("./run-demo.js");

test("runDemo: silent verification execution returns true", () => {
  const result = runDemo({ silent: true });
  assert.equal(result, true);
});

test("runDemo: rejects invalid repo path gracefully", () => {
  assert.throws(() => {
    runDemo({
      silent: true,
      repoRoot: path.join(__dirname, "non-existent-directory-xyz")
    });
  }, /Failed to compile adapters from source|Adapter installer crashed/);
});

test("runDemo: package.json script registration is correct", () => {
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const raw = fs.readFileSync(packageJsonPath, "utf8");
  const pkg = JSON.parse(raw);
  
  assert.ok(pkg.scripts, "package.json should have scripts block");
  assert.ok(pkg.scripts.demo, "package.json should register 'demo' script");
  assert.equal(pkg.scripts.demo, "node tools/run-demo.js", "demo script command should be 'node tools/run-demo.js'");
});
