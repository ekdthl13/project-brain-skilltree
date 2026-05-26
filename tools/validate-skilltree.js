const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function readCatalog() {
  try {
    return JSON.parse(readText(catalogPath));
  } catch (error) {
    fail(`catalog/skills.yaml is not valid YAML-compatible JSON: ${error.message}`);
    return { skills: [] };
  }
}

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(file) {
  const text = readText(file);
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") {
    fail(`${relative(file)} missing YAML frontmatter`);
    return { keys: [], fields: {}, text };
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) {
    fail(`${relative(file)} frontmatter is not closed`);
    return { keys: [], fields: {}, text };
  }
  const raw = lines.slice(1, end);
  const keys = [];
  const fields = {};
  for (const line of raw) {
    const match = line.match(/^([A-Za-z0-9_-]+|[가-힣_]+):\s*(.*)$/);
    if (!match) continue;
    keys.push(match[1]);
    fields[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return { keys, fields, text };
}

function relative(file) {
  return path.relative(repoRoot, file).replace(/\\/g, "/");
}

function skillDirs(sourceRoot) {
  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(sourceRoot, entry.name, "SKILL.md")))
    .map((entry) => entry.name);
}

function assertCatalogSourceParity(catalog) {
  const sourceRoot = path.join(repoRoot, "source");
  const dirs = new Set(skillDirs(sourceRoot));
  const catalogSources = new Set();
  const ids = new Set();
  const adapterNames = new Set();

  for (const skill of catalog.skills) {
    for (const key of ["id", "source", "version", "adapterName", "description"]) {
      if (!skill[key]) fail(`catalog entry missing ${key}: ${JSON.stringify(skill)}`);
    }
    if (ids.has(skill.id)) fail(`duplicate catalog id: ${skill.id}`);
    if (adapterNames.has(skill.adapterName)) fail(`duplicate adapterName: ${skill.adapterName}`);
    ids.add(skill.id);
    adapterNames.add(skill.adapterName);
    catalogSources.add(skill.source);
    if (!dirs.has(skill.source)) fail(`catalog source missing in source/: ${skill.source}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.adapterName)) {
      fail(`adapterName must be lowercase hyphen slug: ${skill.adapterName}`);
    }
    if (!skill.description.startsWith("Use when ")) {
      fail(`description must start with "Use when": ${skill.id}`);
    }
  }

  for (const dir of dirs) {
    if (!catalogSources.has(dir)) fail(`source skill missing from catalog: ${dir}`);
  }
}

function assertSourceFrontmatter(catalog) {
  const bySource = new Map(catalog.skills.map((skill) => [skill.source, skill]));
  for (const source of skillDirs(path.join(repoRoot, "source"))) {
    const file = path.join(repoRoot, "source", source, "SKILL.md");
    const { fields } = parseFrontmatter(file);
    for (const key of ["name", "version", "description"]) {
      if (!(key in fields)) fail(`${relative(file)} missing frontmatter key: ${key}`);
    }
    const expected = bySource.get(source);
    if (expected && fields.version && fields.version !== expected.version) {
      fail(`${relative(file)} version ${fields.version} does not match catalog ${expected.version}`);
    }
    const lines = readText(file).split(/\r?\n/).length;
    if (lines > 500) fail(`${relative(file)} has ${lines} lines; split support material out of SKILL.md`);
  }
}

function assertSkillIndexMentions(catalog) {
  const index = readText(path.join(repoRoot, "source", "SKILL_INDEX.md"));
  for (const skill of catalog.skills) {
    if (!index.includes(skill.source)) {
      fail(`source/SKILL_INDEX.md does not mention skill: ${skill.source}`);
    }
  }
}

function assertPortableAdapter(catalog, targetName) {
  const skillsRoot = path.join(repoRoot, "adapters", targetName, "skills");
  if (!fs.existsSync(skillsRoot)) {
    fail(`missing generated adapter: adapters/${targetName}/skills (run npm run build:adapters)`);
    return;
  }
  for (const skill of catalog.skills) {
    const file = path.join(skillsRoot, skill.adapterName, "SKILL.md");
    if (!fs.existsSync(file)) {
      fail(`missing ${targetName} adapter skill: ${skill.adapterName}`);
      continue;
    }
    const { keys, fields } = parseFrontmatter(file);
    const sortedKeys = [...keys].sort().join(",");
    if (sortedKeys !== "description,name") {
      fail(`${relative(file)} frontmatter must contain only name and description, got: ${keys.join(", ")}`);
    }
    if (fields.name !== skill.adapterName) {
      fail(`${relative(file)} name ${fields.name} does not match catalog ${skill.adapterName}`);
    }
  }
}

function assertAntigravityAdapter(catalog) {
  const skillsRoot = path.join(repoRoot, "adapters", "antigravity", "skills");
  if (!fs.existsSync(skillsRoot)) {
    fail("missing generated adapter: adapters/antigravity/skills (run npm run build:adapters)");
    return;
  }
  for (const skill of catalog.skills) {
    const file = path.join(skillsRoot, skill.source, "SKILL.md");
    if (!fs.existsSync(file)) fail(`missing antigravity adapter skill: ${skill.source}`);
  }
}

function assertLinksResolve() {
  const markdownFiles = walk(repoRoot, (file) => file.endsWith(".md"));
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const file of markdownFiles) {
    const text = readText(file);
    let match;
    while ((match = linkPattern.exec(text))) {
      let target = match[1].trim();
      if (!target || target.startsWith("#")) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      target = target.split("#")[0].split("?")[0].trim();
      if (!target) continue;
      if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
      const resolved = path.resolve(path.dirname(file), target);
      if (!fs.existsSync(resolved)) {
        fail(`${relative(file)} has broken link: ${match[1]}`);
      }
    }
  }
}

function assertSecurityClean() {
  const files = walk(repoRoot, (file) => !file.endsWith(".png") && !file.endsWith(".jpg"));
  const privatePathA = "C:" + "\\" + "Users" + "\\";
  const privatePathB = "C:" + "/" + "Users" + "/";
  const secretPatterns = [
    ["OpenAI-style key", new RegExp("sk-" + "[A-Za-z0-9_-]{20,}")],
    ["GitHub classic token", new RegExp("gh" + "p_[A-Za-z0-9_]{20,}")],
    ["GitHub fine-grained token", new RegExp("github_" + "pat_[A-Za-z0-9_]{20,}")],
    ["private key block", new RegExp("BEGIN " + "(RSA |EC |OPENSSH |)PRIVATE KEY")]
  ];
  for (const file of files) {
    const text = readText(file);
    if (text.includes(privatePathA) || text.includes(privatePathB)) {
      fail(`${relative(file)} contains a private local user path`);
    }
    for (const [label, pattern] of secretPatterns) {
      if (pattern.test(text)) fail(`${relative(file)} contains possible secret pattern: ${label}`);
    }
    for (const char of text) {
      const code = char.codePointAt(0);
      if ((code >= 0x202a && code <= 0x202e) || (code >= 0x2066 && code <= 0x2069) || (code >= 0xe0000 && code <= 0xe007f)) {
        fail(`${relative(file)} contains hidden Unicode control character U+${code.toString(16).toUpperCase()}`);
        break;
      }
    }
  }
}

function main() {
  const catalog = readCatalog();
  assertCatalogSourceParity(catalog);
  assertSourceFrontmatter(catalog);
  assertSkillIndexMentions(catalog);
  assertAntigravityAdapter(catalog);
  assertPortableAdapter(catalog, "codex");
  assertPortableAdapter(catalog, "claude-code");
  assertLinksResolve();
  assertSecurityClean();

  if (failures.length > 0) {
    console.error("Skilltree validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log("Skilltree validation passed.");
}

main();

