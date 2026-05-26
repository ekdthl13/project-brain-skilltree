const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

// Helper: recursively find files under a directory
function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && predicate(full)) {
        out.push(full);
      }
    }
  }
  walk(dir);
  return out;
}

test("Pressure Scenarios Markdown Section Check", () => {
  const scenarioDir = path.join(repoRoot, "tests", "scenarios");
  const markdownFiles = walkFiles(scenarioDir, (file) => file.endsWith(".md"));
  
  assert.ok(markdownFiles.length > 0, "No pressure scenario markdown files found.");

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(repoRoot, file);

    assert.ok(content.includes("## Prompt"), `${relativePath} missing "## Prompt" section`);
    assert.ok(content.includes("## Expected Behavior"), `${relativePath} missing "## Expected Behavior" section`);
    assert.ok(content.includes("## Failure Signal"), `${relativePath} missing "## Failure Signal" section`);
  }
});

test("Check Script Gate Validation in package.json", () => {
  const packageJsonPath = path.join(repoRoot, "package.json");
  assert.ok(fs.existsSync(packageJsonPath), "package.json not found");

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.ok(pkg.scripts, "package.json missing scripts object");
  
  const checkScript = pkg.scripts.check;
  assert.ok(checkScript, "package.json missing 'check' script");

  // Ensure all 5 gates exist in check script
  const requiredGates = ["build:adapters", "diff:adapters", "test", "validate", "audit"];
  for (const gate of requiredGates) {
    assert.ok(
      checkScript.includes(gate),
      `The check script does not contain required gate: "${gate}"`
    );
  }
});

test("Private Local User Path Gate Check", () => {
  const targetDirs = ["docs", "source", "tools", "catalog", "tests"];
  const targetFiles = [];

  for (const dirName of targetDirs) {
    const dirPath = path.join(repoRoot, dirName);
    if (fs.existsSync(dirPath)) {
      targetFiles.push(...walkFiles(dirPath, (file) => !file.endsWith(".png") && !file.endsWith(".jpg")));
    }
  }

  // Also include root markdown files like README.md, PRD.md, PROJECT_TASKS.md
  const rootMds = fs.readdirSync(repoRoot, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
    .map(entry => path.join(repoRoot, entry.name));
  targetFiles.push(...rootMds);

  // Private path patterns representing forbidden local user path
  const prefixA = "C:" + "\\" + "Users" + "\\" + "hjh";
  const prefixB = "C:" + "/" + "Users" + "/" + "hjh";
  const prefixC = "file:///" + "C:/" + "Users" + "/" + "hjh";
  const prefixD = "file:///" + "C:/" + "Users" + "/";

  const forbiddenPatterns = [
    new RegExp(prefixA.replace(/\\/g, "\\\\"), "i"),
    new RegExp(prefixB, "i"),
    new RegExp(prefixC, "i"),
    new RegExp(prefixD, "i")
  ];

  for (const file of targetFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(repoRoot, file);

    for (const pattern of forbiddenPatterns) {
      assert.ok(
        !pattern.test(content),
        `Private local user path detected in ${relativePath} matching pattern ${pattern.toString()}`
      );
    }
  }
});

test("No Installation Root Hardcoding in Source Skills", () => {
  const sourceRoot = path.join(repoRoot, "source");
  const skillFiles = walkFiles(sourceRoot, (file) => file.endsWith("SKILL.md"));

  assert.ok(skillFiles.length > 0, "No SKILL.md files found in source/");

  // Actual local installer destinations must not be hardcoded as unique paths
  const forbiddenInstallRoots = [
    /\.codex[/\\]skills/i,
    /\.gemini[/\\]config[/\\]skills/i
  ];

  for (const file of skillFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(repoRoot, file);

    for (const pattern of forbiddenInstallRoots) {
      assert.ok(
        !pattern.test(content),
        `Hardcoded installer root folder detected in canonical source: ${relativePath} matching pattern ${pattern.toString()}`
      );
    }
  }
});

test("Adapter Generated Principle and Manual Edit Ban Verification", () => {
  // Check docs/ADAPTER_CONTRACT.md or docs/QUALITY_GATE.md for explicit mention of manual edits bans
  const contractPath = path.join(repoRoot, "docs", "ADAPTER_CONTRACT.md");
  const gatePath = path.join(repoRoot, "docs", "QUALITY_GATE.md");

  let content = "";
  if (fs.existsSync(contractPath)) {
    content += fs.readFileSync(contractPath, "utf8");
  }
  if (fs.existsSync(gatePath)) {
    content += fs.readFileSync(gatePath, "utf8");
  }

  assert.ok(content.length > 0, "Neither ADAPTER_CONTRACT.md nor QUALITY_GATE.md found.");

  // Looking for "generated", "direct", "manual", "edit", "forbidden" or "do not edit" context
  const hasPrinciples = 
    /Do not edit generated adapter files by hand/i.test(content) ||
    /Manual edits are treated as drift/i.test(content) ||
    /No Manual Adapter Edits/i.test(content) ||
    /No adapter-only hand edits/i.test(content);

  assert.ok(
    hasPrinciples,
    "No manual edit prohibition principle detected in adapter contract or quality gate docs."
  );
});
