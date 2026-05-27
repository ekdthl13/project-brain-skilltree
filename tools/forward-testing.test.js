const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const scenarioDir = path.join(repoRoot, "tests", "scenarios");
const fixturePath = path.join(scenarioDir, "forward-test-fixture.json");
const docPath = path.join(repoRoot, "docs", "FORWARD_TESTING.md");

test("Forward-testing fixture structure integrity", () => {
  const jsonFiles = fs.readdirSync(scenarioDir)
    .filter(file => file.endsWith(".json"))
    .map(file => path.join(scenarioDir, file));

  assert.ok(jsonFiles.length >= 3, "At least 3 JSON fixtures should exist");

  for (const file of jsonFiles) {
    const filename = path.basename(file);
    let fixture;
    try {
      fixture = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      assert.fail(`${filename} is not valid JSON: ${err.message}`);
    }

    // Enforce fixture schema properties
    assert.equal(fixture.schemaVersion, "1.0.0", `${filename}: Fixture schemaVersion must be 1.0.0`);
    assert.ok(fixture.scenarioId, `${filename}: Fixture missing scenarioId`);
    assert.ok(fixture.description, `${filename}: Fixture missing description`);
    assert.ok(fixture.profile, `${filename}: Fixture missing profile`);
    assert.ok(Array.isArray(fixture.steps), `${filename}: Fixture steps must be an array`);
    assert.ok(fixture.assertions, `${filename}: Fixture missing assertions`);

    assert.equal(fixture.profile.agentName, "Codex", `${filename}: Fixture profile agentName must be Codex`);
    assert.ok(Array.isArray(fixture.profile.capabilities), `${filename}: Fixture profile capabilities must be array`);
    assert.ok(fixture.steps.length > 0, `${filename}: Fixture steps array must not be empty`);

    assert.ok(fixture.assertions.expectedBehavior, `${filename}: Fixture assertions missing expectedBehavior`);
    assert.ok(fixture.assertions.failureSignal, `${filename}: Fixture assertions missing failureSignal`);
    assert.equal(fixture.assertions.checkCommand, "npm run check", `${filename}: Fixture assertions checkCommand must be npm run check`);
    assert.ok(Array.isArray(fixture.assertions.expectedAllowedWrites), `${filename}: Fixture assertions expectedAllowedWrites must be array`);
    assert.ok(Array.isArray(fixture.assertions.forbiddenWrites), `${filename}: Fixture assertions forbiddenWrites must be array`);
    assert.ok(Array.isArray(fixture.assertions.requiredCommands), `${filename}: Fixture assertions requiredCommands must be array`);
    assert.ok(Array.isArray(fixture.assertions.forbiddenCommands), `${filename}: Fixture assertions forbiddenCommands must be array`);
    assert.equal(typeof fixture.assertions.expectedCheckExitCode, "number", `${filename}: Fixture assertions expectedCheckExitCode must be number`);
    assert.ok(Array.isArray(fixture.assertions.expectedSignals), `${filename}: Fixture assertions expectedSignals must be array`);
  }
});

test("Forward-testing documentation existence and sections", () => {
  assert.ok(fs.existsSync(docPath), "FORWARD_TESTING.md not found");

  const content = fs.readFileSync(docPath, "utf8");
  assert.ok(content.includes("Forward-Testing Harness Guidelines"), "FORWARD_TESTING.md missing title");
  assert.ok(content.includes("Scope Limitation"), "FORWARD_TESTING.md missing Scope Limitation section");
  assert.ok(content.includes("Future Dynamic Simulation Architecture"), "FORWARD_TESTING.md missing Future Dynamic Simulation Architecture section");
  assert.ok(content.includes("Current Static Integrity Verification"), "FORWARD_TESTING.md missing Current Static Integrity Verification section");
});
