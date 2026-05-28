const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
const sourceRoot = path.join(repoRoot, "source");

function friendlyAssert(condition, message) {
  if (!condition) {
    const hint = "\n\n[HINT] If you are intentionally extending the catalog schema, please update:\n" +
                 "1. docs/SCHEMA_STABILITY.md (guidelines)\n" +
                 "2. tools/schema-stability.test.js (this test file to include new properties)\n" +
                 "3. tools/build-adapters.js (if the builder needs to package new fields)\n";
    assert.fail(message + hint);
  }
}

test("catalog/skills.yaml Schema Stability Guard", () => {
  assert.ok(fs.existsSync(catalogPath), "skills.yaml not found");

  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
  } catch (err) {
    assert.fail(
      `catalog/skills.yaml is not valid JSON.\n` +
      `[CONTRACT ERROR] By design for v1.0.0, this file must remain strictly YAML-compatible JSON (valid JSON syntax).\n` +
      `Do not convert it to free-form YAML. Parsing error: ${err.message}`
    );
  }

  // 1. Root Keys Check
  const rootKeys = Object.keys(catalog).sort();
  const expectedRootKeys = ["canonicalRoot", "skills", "version"].sort();
  friendlyAssert(
    JSON.stringify(rootKeys) === JSON.stringify(expectedRootKeys),
    `Catalog root keys mismatch. Got: [${rootKeys.join(", ")}]. Expected: [${expectedRootKeys.join(", ")}]`
  );

  assert.equal(catalog.canonicalRoot, "source", "canonicalRoot must be 'source'");
  assert.ok(Array.isArray(catalog.skills), "skills must be an array");
  assert.ok(catalog.skills.length > 0, "skills array must not be empty");

  const ids = new Set();
  const adapterNames = new Set();
  const expectedSkillKeys = ["adapterName", "category", "description", "id", "source", "version"].sort();

  for (const skill of catalog.skills) {
    const keys = Object.keys(skill).sort();

    // 2. Skill Keys Check
    friendlyAssert(
      JSON.stringify(keys) === JSON.stringify(expectedSkillKeys),
      `Skill entry keys mismatch for id '${skill.id || "unknown"}'. Got: [${keys.join(", ")}]. Expected exactly: [${expectedSkillKeys.join(", ")}]`
    );

    // 3. Types and Pattern Checks
    assert.equal(typeof skill.id, "string", `id must be string, got: ${typeof skill.id}`);
    assert.equal(typeof skill.source, "string", `source must be string, got: ${typeof skill.source}`);
    assert.equal(typeof skill.version, "string", `version must be string, got: ${typeof skill.version}`);
    assert.equal(typeof skill.category, "string", `category must be string, got: ${typeof skill.category}`);
    assert.equal(typeof skill.adapterName, "string", `adapterName must be string, got: ${typeof skill.adapterName}`);
    assert.equal(typeof skill.description, "string", `description must be string, got: ${typeof skill.description}`);

    // Check unique constraints
    friendlyAssert(!ids.has(skill.id), `Duplicate skill id found: '${skill.id}'`);
    friendlyAssert(!adapterNames.has(skill.adapterName), `Duplicate adapterName found: '${skill.adapterName}'`);
    ids.add(skill.id);
    adapterNames.add(skill.adapterName);

    // Check slug formats
    friendlyAssert(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.adapterName),
      `adapterName '${skill.adapterName}' must be a lowercase hyphen slug`
    );

    // Check SemVer format
    friendlyAssert(
      /^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(skill.version),
      `version '${skill.version}' must follow SemVer format`
    );

    // Check description rule
    friendlyAssert(
      skill.description.startsWith("Use when "),
      `description for '${skill.id}' must start with 'Use when '`
    );

    // Check source directory existence
    const sourceDir = path.join(sourceRoot, skill.source);
    friendlyAssert(
      fs.existsSync(sourceDir) && fs.statSync(sourceDir).isDirectory(),
      `Canonical source directory '${skill.source}' does not exist inside source/`
    );
  }
});
