const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const scenarioDir = path.join(repoRoot, "tests", "scenarios");
const fixturePath = path.join(scenarioDir, "forward-test-fixture.json");
const docPath = path.join(repoRoot, "docs", "FORWARD_TESTING.md");

test("Forward-testing fixture structure integrity", () => {
  assert.ok(fs.existsSync(fixturePath), "forward-test-fixture.json not found");

  let fixture;
  try {
    fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  } catch (err) {
    assert.fail(`forward-test-fixture.json is not valid JSON: ${err.message}`);
  }

  // Enforce fixture schema properties
  assert.ok(fixture.scenarioId, "Fixture missing scenarioId");
  assert.ok(fixture.description, "Fixture missing description");
  assert.ok(fixture.profile, "Fixture missing profile");
  assert.ok(Array.isArray(fixture.steps), "Fixture steps must be an array");
  assert.ok(fixture.assertions, "Fixture missing assertions");

  assert.equal(fixture.profile.agentName, "Codex", "Fixture profile agentName must be Codex");
  assert.ok(Array.isArray(fixture.profile.capabilities), "Fixture profile capabilities must be array");
  assert.ok(fixture.steps.length > 0, "Fixture steps array must not be empty");

  assert.ok(fixture.assertions.expectedBehavior, "Fixture assertions missing expectedBehavior");
  assert.ok(fixture.assertions.failureSignal, "Fixture assertions missing failureSignal");
  assert.equal(fixture.assertions.checkCommand, "npm run check", "Fixture assertions checkCommand must be npm run check");
});

test("Forward-testing documentation existence and sections", () => {
  assert.ok(fs.existsSync(docPath), "FORWARD_TESTING.md not found");

  const content = fs.readFileSync(docPath, "utf8");
  assert.ok(content.includes("Forward-Testing Harness Guidelines"), "FORWARD_TESTING.md missing title");
  assert.ok(content.includes("Scope Limitation"), "FORWARD_TESTING.md missing Scope Limitation section");
  assert.ok(content.includes("Future Dynamic Simulation Architecture"), "FORWARD_TESTING.md missing Future Dynamic Simulation Architecture section");
  assert.ok(content.includes("Current Static Integrity Verification"), "FORWARD_TESTING.md missing Current Static Integrity Verification section");
});
