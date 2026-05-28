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

function stripFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return text;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) return text;
  return lines.slice(end + 1).join("\n").replace(/^\s+/, "");
}

function readCatalog() {
  try {
    return JSON.parse(readText(catalogPath));
  } catch (error) {
    fail(
      `catalog/skills.yaml is not valid YAML-compatible JSON.\n` +
      `[CONTRACT ERROR] By design for v1.0.0, this file must remain strictly YAML-compatible JSON (valid JSON syntax).\n` +
      `Do not convert it to free-form YAML. Parsing error: ${error.message}`
    );
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

  // 1. Assert root adapter files exist
  const corePrinciples = path.join(skillsRoot, "CORE_PRINCIPLES.md");
  if (!fs.existsSync(corePrinciples)) {
    fail(`missing ${targetName} adapter root file: CORE_PRINCIPLES.md`);
  } else {
    const srcCore = path.join(repoRoot, "source", "CORE_PRINCIPLES.md");
    if (readText(corePrinciples) !== readText(srcCore)) {
      fail(`${targetName} CORE_PRINCIPLES.md drift detected relative to source`);
    }
  }

  const canonicalRoot = path.join(skillsRoot, "CANONICAL_ROOT.md");
  if (!fs.existsSync(canonicalRoot)) {
    fail(`missing ${targetName} adapter root file: CANONICAL_ROOT.md`);
  } else {
    const content = readText(canonicalRoot);
    if (!content.includes(`- Adapter target: \`${targetName}\``)) {
      fail(`${targetName} CANONICAL_ROOT.md does not specify target '${targetName}'`);
    }
  }

  const srcOrch = path.join(repoRoot, "source", "ORCHESTRATION.md");
  const destOrch = path.join(skillsRoot, "ORCHESTRATION.md");
  if (fs.existsSync(srcOrch)) {
    if (!fs.existsSync(destOrch)) {
      fail(`missing ${targetName} adapter root file: ORCHESTRATION.md`);
    } else if (readText(destOrch) !== readText(srcOrch)) {
      fail(`${targetName} ORCHESTRATION.md drift detected relative to source`);
    }
  }

  // 2. Validate Generated SKILL_INDEX.md Shape and Content
  const skillIndex = path.join(skillsRoot, "SKILL_INDEX.md");
  if (!fs.existsSync(skillIndex)) {
    fail(`missing ${targetName} adapter root file: SKILL_INDEX.md`);
  } else {
    const content = readText(skillIndex);
    if (!content.startsWith(`# Generated ${targetName} Skill Index`)) {
      fail(`${targetName} SKILL_INDEX.md must start with standard header`);
    }
    if (!content.includes("## System Documents")) {
      fail(`${targetName} SKILL_INDEX.md missing '## System Documents' section`);
    }
    if (!content.includes("| CORE_PRINCIPLES.md | [CORE_PRINCIPLES.md](CORE_PRINCIPLES.md) |")) {
      fail(`${targetName} SKILL_INDEX.md system docs table missing CORE_PRINCIPLES.md`);
    }
    if (fs.existsSync(srcOrch) && !content.includes("| ORCHESTRATION.md | [ORCHESTRATION.md](ORCHESTRATION.md) |")) {
      fail(`${targetName} SKILL_INDEX.md system docs table missing ORCHESTRATION.md`);
    }

    // Assert skill table headers
    if (!content.includes("| Skill | Version | Category | Path |")) {
      fail(`${targetName} SKILL_INDEX.md missing skills table header`);
    }

    // Assert row for every skill
    for (const skill of catalog.skills) {
      const expectedRow = `| ${skill.adapterName} | ${skill.version} | ${skill.category} | [SKILL.md](${skill.adapterName}/SKILL.md) |`;
      if (!content.includes(expectedRow)) {
        fail(`${targetName} SKILL_INDEX.md missing expected skill row: ${expectedRow}`);
      }
    }
  }

  // 3. Assert skills, frontmatter structure, and body preservation
  for (const skill of catalog.skills) {
    const destDir = path.join(skillsRoot, skill.adapterName);
    const file = path.join(destDir, "SKILL.md");
    if (!fs.existsSync(file)) {
      fail(`missing ${targetName} adapter skill: ${skill.adapterName}`);
      continue;
    }

    // Verify frontmatter format strictly
    const lines = readText(file).split(/\r?\n/);
    if (lines[0] !== "---") {
      fail(`${relative(file)}: frontmatter must start with '---' on line 1`);
    }
    if (lines[1] !== `name: ${skill.adapterName}`) {
      fail(`${relative(file)}: frontmatter line 2 must be 'name: ${skill.adapterName}'`);
    }
    if (lines[2] !== "description: >") {
      fail(`${relative(file)}: frontmatter line 3 must be 'description: >'`);
    }

    const expectedDesc = skill.description.replace(/\r?\n/g, " ").trim();
    if (lines[3] !== `  ${expectedDesc}`) {
      fail(`${relative(file)}: frontmatter line 4 must contain description starting with '  Use when...'`);
    }
    if (lines[4] !== "---") {
      fail(`${relative(file)}: frontmatter must end with '---' on line 5`);
    }
    if (lines[5] !== "") {
      fail(`${relative(file)}: must have empty line after frontmatter boundary at line 6`);
    }

    // Verify body preservation
    const srcFile = path.join(repoRoot, "source", skill.source, "SKILL.md");
    const srcBody = stripFrontmatter(readText(srcFile));
    const destBody = lines.slice(6).join("\n");
    // Normalize newlines for strict comparison
    if (destBody.replace(/\r?\n/g, "\n").trim() !== srcBody.replace(/\r?\n/g, "\n").trim()) {
      fail(`${relative(file)} body does not match canonical source body exactly`);
    }

    // Verify any other support files are copied exactly
    const srcDir = path.join(repoRoot, "source", skill.source);
    for (const item of fs.readdirSync(srcDir)) {
      if (item === "SKILL.md") continue;
      const srcItem = path.join(srcDir, item);
      const destItem = path.join(destDir, item);
      if (!fs.existsSync(destItem)) {
        fail(`missing ${targetName} adapter skill support item: ${relative(destItem)}`);
      } else if (fs.statSync(srcItem).isFile()) {
        if (readText(destItem) !== readText(srcItem)) {
          fail(`${targetName} adapter file drift: ${relative(destItem)}`);
        }
      }
    }
  }
}

function assertAntigravityAdapter(catalog) {
  const skillsRoot = path.join(repoRoot, "adapters", "antigravity", "skills");
  if (!fs.existsSync(skillsRoot)) {
    fail("missing generated adapter: adapters/antigravity/skills (run npm run build:adapters)");
    return;
  }

  // 1. Assert root adapter files exist
  const corePrinciples = path.join(skillsRoot, "CORE_PRINCIPLES.md");
  if (!fs.existsSync(corePrinciples)) {
    fail("missing antigravity adapter root file: CORE_PRINCIPLES.md");
  } else {
    const srcCore = path.join(repoRoot, "source", "CORE_PRINCIPLES.md");
    if (readText(corePrinciples) !== readText(srcCore)) {
      fail("antigravity CORE_PRINCIPLES.md drift detected relative to source");
    }
  }

  const skillIndex = path.join(skillsRoot, "SKILL_INDEX.md");
  if (!fs.existsSync(skillIndex)) {
    fail("missing antigravity adapter root file: SKILL_INDEX.md");
  } else {
    const srcIndex = path.join(repoRoot, "source", "SKILL_INDEX.md");
    if (readText(skillIndex) !== readText(srcIndex)) {
      fail("antigravity SKILL_INDEX.md drift detected relative to source");
    }
  }

  const canonicalRoot = path.join(skillsRoot, "CANONICAL_ROOT.md");
  if (!fs.existsSync(canonicalRoot)) {
    fail("missing antigravity adapter root file: CANONICAL_ROOT.md");
  } else {
    const content = readText(canonicalRoot);
    if (!content.includes("- Adapter target: `antigravity`")) {
      fail("antigravity CANONICAL_ROOT.md does not specify target 'antigravity'");
    }
  }

  const srcOrch = path.join(repoRoot, "source", "ORCHESTRATION.md");
  const destOrch = path.join(skillsRoot, "ORCHESTRATION.md");
  if (fs.existsSync(srcOrch)) {
    if (!fs.existsSync(destOrch)) {
      fail("missing antigravity adapter root file: ORCHESTRATION.md");
    } else if (readText(destOrch) !== readText(srcOrch)) {
      fail("antigravity ORCHESTRATION.md drift detected relative to source");
    }
  }

  // 2. Assert skills and support files copy
  for (const skill of catalog.skills) {
    const skillFolder = path.join(skillsRoot, skill.source);
    const file = path.join(skillFolder, "SKILL.md");
    if (!fs.existsSync(file)) {
      fail(`missing antigravity adapter skill: ${skill.source}`);
      continue;
    }
    const srcFolder = path.join(repoRoot, "source", skill.source);
    for (const item of fs.readdirSync(srcFolder)) {
      const srcItem = path.join(srcFolder, item);
      const destItem = path.join(skillFolder, item);
      if (!fs.existsSync(destItem)) {
        fail(`missing antigravity adapter item: ${relative(destItem)}`);
      } else if (fs.statSync(srcItem).isFile()) {
        if (readText(destItem) !== readText(srcItem)) {
          fail(`antigravity adapter file drift: ${relative(destItem)}`);
        }
      }
    }
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
