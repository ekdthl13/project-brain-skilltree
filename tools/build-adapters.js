const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(repoRoot, "source");
const adapterRoot = path.join(repoRoot, "adapters");
const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");

function readCatalog() {
  const raw = fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function assertInsideRepo(target) {
  const resolved = path.resolve(target);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside repo: ${resolved}`);
  }
  return resolved;
}

function resetDir(dir) {
  const resolved = assertInsideRepo(dir);
  fs.rmSync(resolved, { recursive: true, force: true });
  fs.mkdirSync(resolved, { recursive: true });
}

function ensureDir(dir) {
  fs.mkdirSync(assertInsideRepo(dir), { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, assertInsideRepo(dest));
}

function copyDir(src, dest, options = {}) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (options.skip && options.skip(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to, options);
    } else if (entry.isFile()) {
      copyFile(from, to);
    }
  }
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

function writePointer(dir, targetName) {
  fs.writeFileSync(
    path.join(dir, "CANONICAL_ROOT.md"),
    [
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
    ].join("\n"),
    "utf8"
  );
}

function copyOptionalRootDoc(fileName, target) {
  const source = path.join(sourceRoot, fileName);
  if (fs.existsSync(source)) {
    copyFile(source, path.join(target, fileName));
  }
}

function buildAntigravity(catalog) {
  const target = path.join(adapterRoot, "antigravity", "skills");
  resetDir(target);
  copyFile(path.join(sourceRoot, "CORE_PRINCIPLES.md"), path.join(target, "CORE_PRINCIPLES.md"));
  copyFile(path.join(sourceRoot, "SKILL_INDEX.md"), path.join(target, "SKILL_INDEX.md"));
  copyOptionalRootDoc("ORCHESTRATION.md", target);
  for (const skill of catalog.skills) {
    copyDir(path.join(sourceRoot, skill.source), path.join(target, skill.source));
  }
  writePointer(target, "antigravity");
}

function writeGeneratedIndex(skillsRoot, catalog, targetName) {
  const rows = catalog.skills
    .map((skill) => `| ${skill.adapterName} | ${skill.version} | ${skill.category} | [SKILL.md](${skill.adapterName}/SKILL.md) |`)
    .join("\n");
  fs.writeFileSync(
    path.join(skillsRoot, "SKILL_INDEX.md"),
    [
      `# Generated ${targetName} Skill Index`,
      "",
      "This file is generated from `catalog/skills.yaml` and `source/`.",
      "Edit the canonical source, then run `npm run build:adapters`.",
      "",
      "| Skill | Version | Category | Path |",
      "|-------|---------|----------|------|",
      rows,
      ""
    ].join("\n"),
    "utf8"
  );
}

function buildPortableAdapter(catalog, targetName) {
  const skillsRoot = path.join(adapterRoot, targetName, "skills");
  resetDir(skillsRoot);
  copyFile(path.join(sourceRoot, "CORE_PRINCIPLES.md"), path.join(skillsRoot, "CORE_PRINCIPLES.md"));
  copyOptionalRootDoc("ORCHESTRATION.md", skillsRoot);
  writeGeneratedIndex(skillsRoot, catalog, targetName);

  for (const skill of catalog.skills) {
    const srcDir = path.join(sourceRoot, skill.source);
    const destDir = path.join(skillsRoot, skill.adapterName);
    copyDir(srcDir, destDir, { skip: (name) => name === "SKILL.md" });
    const sourceSkill = fs.readFileSync(path.join(srcDir, "SKILL.md"), "utf8");
    const body = stripFrontmatter(sourceSkill);
    fs.writeFileSync(
      path.join(destDir, "SKILL.md"),
      generatedFrontmatter(skill.adapterName, skill.description) + body,
      "utf8"
    );
  }

  writePointer(skillsRoot, targetName);
}

function main() {
  const catalog = readCatalog();
  resetDir(adapterRoot);
  buildAntigravity(catalog);
  buildPortableAdapter(catalog, "codex");
  buildPortableAdapter(catalog, "claude-code");
  console.log(`Built ${catalog.skills.length} skills for antigravity, codex, and claude-code.`);
}

main();
