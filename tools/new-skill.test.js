const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const {
  buildSkillPlan,
  createNewSkill,
  parseArgs
} = require("./new-skill");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");

const repoRoot = path.resolve(__dirname, "..");

function writeMinimalRepo(root) {
  fs.mkdirSync(path.join(root, "catalog"), { recursive: true });
  fs.mkdirSync(path.join(root, "source"), { recursive: true });
  fs.writeFileSync(path.join(root, "source", "CORE_PRINCIPLES.md"), "# Core\n", "utf8");
  fs.writeFileSync(path.join(root, "source", "SKILL_INDEX.md"), "# Skill Index\n", "utf8");
  fs.writeFileSync(
    path.join(root, "catalog", "skills.yaml"),
    JSON.stringify({
      version: "0.1.0",
      canonicalRoot: "source",
      skills: [
        {
          id: "existing-skill",
          source: "Existing Skill",
          version: "1.0.0",
          category: "utility",
          adapterName: "existing-skill",
          description: "Use when testing existing catalog collisions."
        }
      ]
    }, null, 2) + "\n",
    "utf8"
  );
}

test("new-skill: parseArgs reads CLI flags", () => {
  const args = parseArgs([
    "--id", "research-helper",
    "--source", "Research Helper",
    "--category", "research",
    "--description", "Use when gathering research inputs.",
    "--adapter-name", "research-helper",
    "--version", "1.2.3",
    "--dry-run"
  ]);

  assert.deepEqual(args, {
    id: "research-helper",
    source: "Research Helper",
    category: "research",
    description: "Use when gathering research inputs.",
    adapterName: "research-helper",
    version: "1.2.3",
    dryRun: true
  });
});

test("new-skill: buildSkillPlan applies defaults and validation", () => {
  const plan = buildSkillPlan({
    id: "research-helper",
    source: "Research Helper",
    description: "Use when gathering research inputs."
  });

  assert.equal(plan.category, "utility");
  assert.equal(plan.adapterName, "research-helper");
  assert.equal(plan.version, "1.0.0");
});

test("new-skill: creates source skill, catalog entry, and index mention", () => {
  const sandbox = createSandbox();
  try {
    writeMinimalRepo(sandbox);

    const result = createNewSkill({
      repoRoot: sandbox,
      id: "research-helper",
      source: "Research Helper",
      category: "research",
      description: "Use when gathering research inputs for a project."
    });

    assert.equal(result.dryRun, false);
    assert.ok(fs.existsSync(path.join(sandbox, "source", "Research Helper", "SKILL.md")));

    const skillText = fs.readFileSync(path.join(sandbox, "source", "Research Helper", "SKILL.md"), "utf8");
    assert.match(skillText, /name: Research Helper/);
    assert.match(skillText, /Minimum Output Criteria/);
    assert.match(skillText, /\.\.\/CORE_PRINCIPLES\.md/);

    const catalog = JSON.parse(fs.readFileSync(path.join(sandbox, "catalog", "skills.yaml"), "utf8"));
    const entry = catalog.skills.find(skill => skill.id === "research-helper");
    assert.equal(entry.source, "Research Helper");
    assert.equal(entry.adapterName, "research-helper");
    assert.equal(entry.category, "research");

    const index = fs.readFileSync(path.join(sandbox, "source", "SKILL_INDEX.md"), "utf8");
    assert.match(index, /\[Research Helper\]\(Research Helper\/SKILL\.md\)/);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("new-skill: dry-run reports files without writing", () => {
  const sandbox = createSandbox();
  try {
    writeMinimalRepo(sandbox);

    const result = createNewSkill({
      repoRoot: sandbox,
      id: "dry-run-skill",
      source: "Dry Run Skill",
      description: "Use when testing dry-run behavior.",
      dryRun: true
    });

    assert.equal(result.dryRun, true);
    assert.ok(result.plannedFiles.some(file => file.endsWith("source/Dry Run Skill/SKILL.md")));
    assert.equal(fs.existsSync(path.join(sandbox, "source", "Dry Run Skill")), false);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("new-skill: rejects duplicate catalog identifiers", () => {
  const sandbox = createSandbox();
  try {
    writeMinimalRepo(sandbox);

    assert.throws(() => {
      createNewSkill({
        repoRoot: sandbox,
        id: "existing-skill",
        source: "Another Skill",
        description: "Use when testing duplicate ids."
      });
    }, /already exists in catalog ids/);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("new-skill: rejects unsafe source paths and weak descriptions", () => {
  assert.throws(() => {
    buildSkillPlan({
      id: "bad-skill",
      source: "../Bad Skill",
      description: "Use when testing path traversal."
    });
  }, /source must be a single directory name/);

  assert.throws(() => {
    buildSkillPlan({
      id: "bad-skill",
      source: "Bad Skill",
      description: "This does not use the required prefix."
    });
  }, /description must start with "Use when "/);

  assert.throws(() => {
    buildSkillPlan({
      id: "bad-skill",
      source: "Bad:Skill",
      description: "Use when testing invalid Windows path characters."
    });
  }, /source must be a single directory name/);

  assert.throws(() => {
    buildSkillPlan({
      id: "bad-skill",
      source: "Bad Skill",
      category: "Not Valid",
      description: "Use when testing invalid categories."
    });
  }, /category must be a lowercase hyphen slug/);
});

test("new-skill: package script is registered", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  assert.equal(pkg.scripts["new:skill"], "node tools/new-skill.js");
});
