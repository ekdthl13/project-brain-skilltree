const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(repoRoot, "source");
const adapterRoot = path.join(repoRoot, "adapters");
const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
const reportPath = path.join(repoRoot, "reports", "adapter-diff.md");
const targets = ["antigravity", "codex", "claude-code"];

function readCatalog() {
  const raw = fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function normalize(file) {
  return file.replace(/\\/g, "/");
}

function relative(root, file) {
  return normalize(path.relative(root, file));
}

function walkFiles(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  walk(root);
  return out.sort();
}

function stripFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return text;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) return text;
  return lines.slice(end + 1).join("\n").replace(/^\s+/, "");
}

function generatedFrontmatter(name, description) {
  const wrapped = description.replace(/\r?\n/g, " ").trim();
  return `---\nname: ${name}\ndescription: >\n  ${wrapped}\n---\n\n`;
}

function pointerText(targetName) {
  return [
    "# Canonical Root",
    "",
    "This adapter is generated from the GitHub repository source tree.",
    "",
    "- Canonical source: `source/`",
    `- Adapter target: \`${targetName}\``,
    "- Regenerate: `npm run build:adapters`",
    "",
    "Do not edit generated adapter files by hand.",
    ""
  ].join("\n");
}

function generatedIndex(catalog, targetName) {
  const rows = catalog.skills
    .map((skill) => `| ${skill.adapterName} | ${skill.version} | ${skill.category} | [SKILL.md](${skill.adapterName}/SKILL.md) |`)
    .join("\n");
  const systemDocs = ["CORE_PRINCIPLES.md", "ORCHESTRATION.md"]
    .filter((fileName) => fs.existsSync(path.join(sourceRoot, fileName)))
    .map((fileName) => `| ${fileName} | [${fileName}](${fileName}) |`)
    .join("\n");
  return [
    `# Generated ${targetName} Skill Index`,
    "",
    "This file is generated from `catalog/skills.yaml` and `source/`.",
    "Edit the canonical source, then run `npm run build:adapters`.",
    "",
    "## System Documents",
    "",
    "| Document | Path |",
    "|----------|------|",
    systemDocs,
    "",
    "| Skill | Version | Category | Path |",
    "|-------|---------|----------|------|",
    rows,
    ""
  ].join("\n");
}

function addBuffer(map, relPath, buffer) {
  map.set(normalize(relPath), Buffer.from(buffer));
}

function addText(map, relPath, text) {
  addBuffer(map, relPath, Buffer.from(text, "utf8"));
}

function addOptionalRootDoc(map, relPath, sourceFileName) {
  const file = path.join(sourceRoot, sourceFileName);
  if (fs.existsSync(file)) {
    addBuffer(map, relPath, fs.readFileSync(file));
  }
}

function addCopiedTree(map, fromRoot, toRoot, options = {}) {
  for (const file of walkFiles(fromRoot)) {
    const rel = relative(fromRoot, file);
    if (options.skip && options.skip(rel)) continue;
    addBuffer(map, path.join(toRoot, rel), fs.readFileSync(file));
  }
}

function expectedAdapters(catalog) {
  const expected = new Map();

  addText(expected, "antigravity/skills/CANONICAL_ROOT.md", pointerText("antigravity"));
  addBuffer(
    expected,
    "antigravity/skills/CORE_PRINCIPLES.md",
    fs.readFileSync(path.join(sourceRoot, "CORE_PRINCIPLES.md"))
  );
  addBuffer(
    expected,
    "antigravity/skills/SKILL_INDEX.md",
    fs.readFileSync(path.join(sourceRoot, "SKILL_INDEX.md"))
  );
  addOptionalRootDoc(expected, "antigravity/skills/ORCHESTRATION.md", "ORCHESTRATION.md");
  for (const skill of catalog.skills) {
    addCopiedTree(
      expected,
      path.join(sourceRoot, skill.source),
      path.join("antigravity", "skills", skill.source)
    );
  }

  for (const targetName of ["codex", "claude-code"]) {
    const targetRoot = path.join(targetName, "skills");
    addText(expected, path.join(targetRoot, "CANONICAL_ROOT.md"), pointerText(targetName));
    addBuffer(
      expected,
      path.join(targetRoot, "CORE_PRINCIPLES.md"),
      fs.readFileSync(path.join(sourceRoot, "CORE_PRINCIPLES.md"))
    );
    addOptionalRootDoc(expected, path.join(targetRoot, "ORCHESTRATION.md"), "ORCHESTRATION.md");
    addText(expected, path.join(targetRoot, "SKILL_INDEX.md"), generatedIndex(catalog, targetName));
    for (const skill of catalog.skills) {
      const sourceDir = path.join(sourceRoot, skill.source);
      const targetDir = path.join(targetRoot, skill.adapterName);
      addCopiedTree(expected, sourceDir, targetDir, { skip: (rel) => rel === "SKILL.md" });
      const body = stripFrontmatter(fs.readFileSync(path.join(sourceDir, "SKILL.md"), "utf8"));
      addText(
        expected,
        path.join(targetDir, "SKILL.md"),
        generatedFrontmatter(skill.adapterName, skill.description) + body
      );
    }
  }

  return expected;
}

function actualAdapters() {
  const actual = new Map();
  for (const targetName of targets) {
    const skillsRoot = path.join(adapterRoot, targetName, "skills");
    for (const file of walkFiles(skillsRoot)) {
      addBuffer(
        actual,
        path.join(targetName, "skills", relative(skillsRoot, file)),
        fs.readFileSync(file)
      );
    }
  }
  return actual;
}

function classify(expected, actual) {
  const missing = [];
  const changed = [];
  const extra = [];

  for (const [rel, expectedBuffer] of expected.entries()) {
    const actualBuffer = actual.get(rel);
    if (!actualBuffer) missing.push(rel);
    else if (!actualBuffer.equals(expectedBuffer)) changed.push(rel);
  }
  for (const rel of actual.keys()) {
    if (!expected.has(rel)) extra.push(rel);
  }

  return {
    missing: missing.sort(),
    changed: changed.sort(),
    extra: extra.sort()
  };
}

function targetCounts(diff) {
  const counts = Object.fromEntries(targets.map((target) => [target, { missing: 0, changed: 0, extra: 0 }]));
  for (const type of ["missing", "changed", "extra"]) {
    for (const rel of diff[type]) {
      const target = rel.split("/")[0];
      if (counts[target]) counts[target][type] += 1;
    }
  }
  return counts;
}

function renderList(items) {
  if (items.length === 0) return "- none";
  return items.map((item) => `- \`${item}\``).join("\n");
}

function writeReport(diff, expected, actual) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const status = diff.missing.length || diff.changed.length || diff.extra.length ? "FAIL" : "PASS";
  const counts = targetCounts(diff);
  const rows = targets
    .map((target) => `| ${target} | ${counts[target].missing} | ${counts[target].changed} | ${counts[target].extra} |`)
    .join("\n");

  fs.writeFileSync(
    reportPath,
    [
      "# Adapter Diff Report",
      "",
      `- Status: ${status}`,
      `- Expected files: ${expected.size}`,
      `- Actual files: ${actual.size}`,
      `- Generated at: ${new Date().toISOString()}`,
      "",
      "| Adapter | Missing | Changed | Extra |",
      "|---------|---------|---------|-------|",
      rows,
      "",
      "## Missing Files",
      "",
      renderList(diff.missing),
      "",
      "## Changed Files",
      "",
      renderList(diff.changed),
      "",
      "## Extra Files",
      "",
      renderList(diff.extra),
      ""
    ].join("\n"),
    "utf8"
  );
  return status;
}

function main() {
  const catalog = readCatalog();
  const expected = expectedAdapters(catalog);
  const actual = actualAdapters();
  const diff = classify(expected, actual);
  const status = writeReport(diff, expected, actual);

  if (status === "FAIL") {
    console.error(`Adapter diff failed. See ${normalize(path.relative(repoRoot, reportPath))}.`);
    process.exit(1);
  }
  console.log(`Adapter diff passed. Wrote ${normalize(path.relative(repoRoot, reportPath))}.`);
}

main();
