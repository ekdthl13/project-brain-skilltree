const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const reportDir = path.join(repoRoot, "reports");
const reportPath = path.join(reportDir, "skilltree-audit.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function countLines(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/).length;
}

function main() {
  fs.mkdirSync(reportDir, { recursive: true });
  const validation = spawnSync(process.execPath, ["tools/validate-skilltree.js"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const catalog = readJson(path.join(repoRoot, "catalog", "skills.yaml"));
  const rows = catalog.skills
    .map((skill) => {
      const file = path.join(repoRoot, "source", skill.source, "SKILL.md");
      return `| ${skill.source} | ${skill.adapterName} | ${skill.version} | ${countLines(file)} |`;
    })
    .join("\n");
  const status = validation.status === 0 ? "PASS" : "FAIL";
  fs.writeFileSync(
    reportPath,
    [
      "# Skilltree Audit",
      "",
      `- Status: ${status}`,
      `- Skills: ${catalog.skills.length}`,
      `- Generated at: ${new Date().toISOString()}`,
      "",
      "## Skill Inventory",
      "",
      "| Source | Adapter | Version | SKILL.md lines |",
      "|--------|---------|---------|----------------|",
      rows,
      "",
      "## Validation Output",
      "",
      "```text",
      (validation.stdout + validation.stderr).trim(),
      "```",
      ""
    ].join("\n"),
    "utf8"
  );
  console.log(`Wrote ${path.relative(repoRoot, reportPath).replace(/\\/g, "/")}`);
  if (validation.status !== 0) process.exit(validation.status);
}

main();

