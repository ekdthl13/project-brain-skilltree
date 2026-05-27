const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { CHECK_COMMAND_TIMEOUT_MS, runScenario } = require("./forward-tester");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");

const repoRoot = path.resolve(__dirname, "..");
const scenarioDir = path.join(repoRoot, "tests", "scenarios");
const nestedCheckTestOptions = {};
if (process.env.PROJECT_BRAIN_FORWARD_TEST_INNER_CHECK === "1") {
  nestedCheckTestOptions.skip = "skip dynamic scenario recursion inside forward-tester checkCommand";
}

test("forward-tester: runScenario passes for a valid bypass scenario (forward-test-fixture)", nestedCheckTestOptions, () => {
  const fixturePath = path.join(scenarioDir, "forward-test-fixture.json");
  
  // Running this scenario should successfully catch the hostile action and return pass: true
  const result = runScenario(fixturePath);
  
  assert.ok(result.pass, `Scenario failed: ${result.reason}`);
  assert.equal(result.checkExitCode, 1, "checkCommand should have failed");
  assert.ok(result.staticSignals.includes("forbiddenWrites"), "Should flag forbidden writes statically");
});

test("forward-tester: runScenario throws on missing file", () => {
  assert.throws(() => {
    runScenario(path.join(scenarioDir, "non-existent-file-xyz.json"));
  }, /Scenario file not found/);
});

test("forward-tester: runScenario throws on invalid schema version", () => {
  const tempSandbox = createSandbox();
  const badFixture = path.join(tempSandbox, "bad-version.json");
  fs.writeFileSync(badFixture, JSON.stringify({
    schemaVersion: "0.9.0",
    scenarioId: "bad-version",
    steps: [],
    assertions: {}
  }));

  try {
    assert.throws(() => {
      runScenario(badFixture);
    }, /Unsupported schemaVersion/);
  } finally {
    cleanSandbox(tempSandbox);
  }
});

test("forward-tester: runScenario throws on disallowed checkCommand", () => {
  const tempSandbox = createSandbox();
  const badCommandFixture = path.join(tempSandbox, "bad-command.json");
  fs.writeFileSync(badCommandFixture, JSON.stringify({
    schemaVersion: "1.0.0",
    scenarioId: "bad-command",
    steps: [
      { action: "mock_prompt", args: { text: "Run malicious command" } }
    ],
    assertions: {
      checkCommand: "echo 'not allowed'",
      expectedCheckExitCode: 0,
      expectedSignals: []
    }
  }));

  try {
    assert.throws(() => {
      runScenario(badCommandFixture);
    }, /Security Violation: checkCommand .* is not in the ALLOWED_CHECK_COMMANDS list/);
  } finally {
    cleanSandbox(tempSandbox);
  }
});

test("forward-tester: checkCommand timeout is configured", () => {
  assert.equal(typeof CHECK_COMMAND_TIMEOUT_MS, "number");
  assert.ok(CHECK_COMMAND_TIMEOUT_MS > 0, "checkCommand timeout must be positive");
});
