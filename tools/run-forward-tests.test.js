const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const {
  listScenarioFiles,
  parseArgs,
  runForwardTests
} = require("./run-forward-tests");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");

const repoRoot = path.resolve(__dirname, "..");

function writeJson(filePath, value = {}) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function silentLogger() {
  return {
    log() {},
    error() {}
  };
}

test("run-forward-tests: listScenarioFiles returns sorted JSON files only", () => {
  const sandbox = createSandbox();
  try {
    writeJson(path.join(sandbox, "z-last.json"));
    writeJson(path.join(sandbox, "a-first.json"));
    fs.writeFileSync(path.join(sandbox, "notes.md"), "# not a JSON scenario");

    const files = listScenarioFiles(sandbox).map(file => path.basename(file));
    assert.deepEqual(files, ["a-first.json", "z-last.json"]);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("run-forward-tests: aggregates passes and failures without stopping", () => {
  const sandbox = createSandbox();
  try {
    writeJson(path.join(sandbox, "first.json"));
    writeJson(path.join(sandbox, "second.json"));

    const seen = [];
    const result = runForwardTests({
      scenarioDir: sandbox,
      logger: silentLogger(),
      runScenarioFn(file) {
        const scenario = path.basename(file);
        seen.push(scenario);
        return {
          pass: scenario === "first.json",
          reason: scenario === "first.json" ? "ok" : "blocked",
          checkExitCode: scenario === "first.json" ? 0 : 1,
          staticSignals: []
        };
      }
    });

    assert.deepEqual(seen, ["first.json", "second.json"]);
    assert.equal(result.pass, false);
    assert.equal(result.total, 2);
    assert.equal(result.passed, 1);
    assert.equal(result.failed, 1);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("run-forward-tests: records thrown scenarios as failures", () => {
  const sandbox = createSandbox();
  try {
    writeJson(path.join(sandbox, "broken.json"));

    const result = runForwardTests({
      scenarioDir: sandbox,
      logger: silentLogger(),
      runScenarioFn() {
        throw new Error("fixture failed to load");
      }
    });

    assert.equal(result.pass, false);
    assert.equal(result.failed, 1);
    assert.match(result.results[0].reason, /fixture failed to load/);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("run-forward-tests: parseArgs supports custom scenario directory", () => {
  assert.deepEqual(parseArgs(["--scenario-dir", "custom/path"]), {
    scenarioDir: "custom/path"
  });

  assert.deepEqual(parseArgs(["-d", "short/path"]), {
    scenarioDir: "short/path"
  });
});

test("run-forward-tests: package script and CI gate are registered without check recursion", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const workflow = fs.readFileSync(path.join(repoRoot, ".github", "workflows", "validate.yml"), "utf8");

  assert.equal(packageJson.scripts["test:forward"], "node tools/run-forward-tests.js");
  assert.ok(workflow.includes("npm run test:forward"), "validate workflow must run npm run test:forward");
  assert.ok(!packageJson.scripts.check.includes("test:forward"), "npm run check must not call test:forward recursively");
});
