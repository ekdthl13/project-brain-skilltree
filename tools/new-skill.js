const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");

const defaultRepoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      out.dryRun = true;
    } else if ((arg === "--id" || arg === "-i") && argv[i + 1]) {
      out.id = argv[++i];
    } else if ((arg === "--source" || arg === "-s") && argv[i + 1]) {
      out.source = argv[++i];
    } else if ((arg === "--category" || arg === "-c") && argv[i + 1]) {
      out.category = argv[++i];
    } else if ((arg === "--description" || arg === "-d") && argv[i + 1]) {
      out.description = argv[++i];
    } else if ((arg === "--adapter-name" || arg === "-a") && argv[i + 1]) {
      out.adapterName = argv[++i];
    } else if ((arg === "--version" || arg === "-v") && argv[i + 1]) {
      out.version = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      out.help = true;
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }
  return out;
}

function assertSlug(name, value) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${name} must be a lowercase hyphen slug: ${value}`);
  }
}

function assertSemver(version) {
  if (!/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(version)) {
    throw new Error(`version must follow SemVer format: ${version}`);
  }
}

function assertSingleDirectoryName(source) {
  if (
    !source ||
    source !== source.trim() ||
    source.includes("/") ||
    source.includes("\\") ||
    source === "." ||
    source === ".." ||
    source.includes("..") ||
    /[<>:"|?*\x00-\x1f]/.test(source)
  ) {
    throw new Error(`source must be a single directory name inside source/: ${source}`);
  }
}

function buildSkillPlan(options) {
  const plan = {
    id: (options.id || "").trim(),
    source: (options.source || "").trim(),
    category: (options.category || "utility").trim(),
    description: (options.description || "").trim(),
    adapterName: (options.adapterName || options.id || "").trim(),
    version: (options.version || "1.0.0").trim(),
    dryRun: Boolean(options.dryRun)
  };

  if (!plan.id) throw new Error("id is required");
  if (!plan.source) throw new Error("source is required");
  if (!plan.description) throw new Error("description is required");

  assertSlug("id", plan.id);
  assertSlug("adapterName", plan.adapterName);
  assertSlug("category", plan.category);
  assertSemver(plan.version);
  assertSingleDirectoryName(plan.source);

  if (!plan.description.startsWith("Use when ")) {
    throw new Error('description must start with "Use when "');
  }
  if (/[\r\n]/.test(plan.description)) {
    throw new Error("description must be a single line");
  }

  return plan;
}

function readCatalog(repoRoot) {
  const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
  return JSON.parse(fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
}

function writeCatalog(repoRoot, catalog) {
  const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
}

function assertInsideRepo(repoRoot, targetPath) {
  const resolvedRoot = path.resolve(repoRoot);
  const resolvedTarget = path.resolve(targetPath);
  const relative = path.relative(resolvedRoot, resolvedTarget);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside repo: ${resolvedTarget}`);
  }
  return resolvedTarget;
}

function assertNoCollisions(repoRoot, catalog, plan) {
  const ids = new Set(catalog.skills.map(skill => skill.id));
  const adapterNames = new Set(catalog.skills.map(skill => skill.adapterName));
  const sources = new Set(catalog.skills.map(skill => skill.source));

  if (ids.has(plan.id)) throw new Error(`Skill already exists in catalog ids: ${plan.id}`);
  if (adapterNames.has(plan.adapterName)) throw new Error(`Skill already exists in catalog adapter names: ${plan.adapterName}`);
  if (sources.has(plan.source)) throw new Error(`Skill already exists in catalog sources: ${plan.source}`);

  const sourceDir = path.join(repoRoot, "source", plan.source);
  assertInsideRepo(repoRoot, sourceDir);
  if (fs.existsSync(sourceDir)) {
    throw new Error(`Source directory already exists: ${path.relative(repoRoot, sourceDir)}`);
  }
}

function skillTemplate(plan) {
  return [
    "---",
    `name: ${plan.source}`,
    `version: "${plan.version}"`,
    `description: ${plan.description}`,
    "---",
    "",
    `# ${plan.source}`,
    "",
    "## Purpose",
    `${plan.description.replace(/^Use when /, "Use this skill when ")} It keeps the work scoped, reviewable, and aligned with Project Brain operating rules.`,
    "",
    "## Trigger",
    "Use this skill when the user asks for work that matches the description above.",
    `- \"${plan.id}\"`,
    `- \"${plan.source}\"`,
    "",
    "## Context Scan",
    "Before acting, inspect the smallest useful set of project files. Prefer existing project instructions, task files, and nearby examples over inventing a new pattern.",
    "",
    "## Workflow",
    "1. Restate the task in one sentence.",
    "2. Identify the source files or documents that define the local rules.",
    "3. Make the smallest coherent change that satisfies the request.",
    "4. Run the relevant verification command or explain why it cannot run.",
    "5. Report changed files, verification results, and any remaining risk.",
    "",
    "## Output Format",
    "Return a concise completion report with:",
    "- What changed.",
    "- Which files were touched.",
    "- Which verification command passed or failed.",
    "- The next recommended action when useful.",
    "",
    "## Minimum Output Criteria",
    "A successful run must include:",
    "- A concrete result or a clear blocker.",
    "- File paths for any created or modified artifacts.",
    "- Verification evidence, or an explicit reason verification could not run.",
    "",
    "## Hard Fails",
    "- Do not edit generated adapter files by hand.",
    "- Do not write private local user paths into public docs or source files.",
    "- Do not claim completion without verification evidence or a stated blocker.",
    "",
    "## Handoff",
    "When this skill finishes, hand off to `project-manager` for queue updates or to `inspector` for adversarial review when the change affects shared behavior.",
    "",
    "## Self Check",
    "- [ ] Frontmatter includes name, version, and description.",
    "- [ ] Description starts with `Use when `.",
    "- [ ] Minimum output criteria are present.",
    "- [ ] Hard fails are present.",
    "- [ ] Verification expectations are clear.",
    "",
    "## Parent Rule",
    "All skills follow [CORE_PRINCIPLES.md](../CORE_PRINCIPLES.md).",
    ""
  ].join("\n");
}

function appendSkillIndexEntry(indexText, plan) {
  const marker = "## CLI Generated Skills";
  const row = `| [${plan.source}](${plan.source}/SKILL.md) | v${plan.version} | ${plan.category} | ${plan.adapterName} | ${plan.description} |`;
  if (indexText.includes(`[${plan.source}](${plan.source}/SKILL.md)`)) {
    return indexText;
  }

  if (!indexText.includes(marker)) {
    const section = [
      "",
      "---",
      "",
      marker,
      "",
      "These entries are generated by `npm run new:skill` and should be refined into the router tables when the skill graduates from draft.",
      "",
      "| Skill | Version | Category | Adapter | Description |",
      "|-------|---------|----------|---------|-------------|",
      row,
      ""
    ].join("\n");
    return indexText.replace(/\s*$/, "") + section;
  }

  const lines = indexText.split(/\r?\n/);
  const markerIndex = lines.findIndex(line => line.trim() === marker);
  const tableDividerIndex = lines.findIndex((line, index) => index > markerIndex && line.startsWith("|-------"));
  if (tableDividerIndex === -1) {
    throw new Error("CLI Generated Skills table is malformed in source/SKILL_INDEX.md");
  }
  lines.splice(tableDividerIndex + 1, 0, row);
  return lines.join("\n");
}

function createNewSkill(options) {
  const repoRoot = path.resolve(options.repoRoot || defaultRepoRoot);
  const plan = buildSkillPlan(options);
  const catalog = readCatalog(repoRoot);
  assertNoCollisions(repoRoot, catalog, plan);

  const sourceDir = assertInsideRepo(repoRoot, path.join(repoRoot, "source", plan.source));
  const skillPath = path.join(sourceDir, "SKILL.md");
  const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
  const indexPath = path.join(repoRoot, "source", "SKILL_INDEX.md");
  const plannedFiles = [skillPath, catalogPath, indexPath].map(file => path.relative(repoRoot, file).replace(/\\/g, "/"));

  if (plan.dryRun) {
    return { dryRun: true, plan, plannedFiles };
  }

  const entry = {
    id: plan.id,
    source: plan.source,
    version: plan.version,
    category: plan.category,
    adapterName: plan.adapterName,
    description: plan.description
  };

  fs.mkdirSync(sourceDir, { recursive: true });
  fs.writeFileSync(skillPath, skillTemplate(plan), "utf8");

  catalog.skills.push(entry);
  writeCatalog(repoRoot, catalog);

  const indexText = fs.readFileSync(indexPath, "utf8");
  fs.writeFileSync(indexPath, appendSkillIndexEntry(indexText, plan), "utf8");

  return { dryRun: false, plan, entry, plannedFiles };
}

async function promptForMissingArgs(args) {
  if (args.help) return args;
  const missing = ["id", "source", "description"].filter(key => !args[key]);
  if (missing.length === 0) return args;
  if (!process.stdin.isTTY) {
    throw new Error(`Missing required arguments: ${missing.join(", ")}`);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const filled = { ...args };
    if (!filled.id) filled.id = await rl.question("Skill id (lowercase slug): ");
    if (!filled.source) filled.source = await rl.question("Source folder name: ");
    if (!filled.description) filled.description = await rl.question('Description (must start with "Use when "): ');
    if (!filled.category) filled.category = await rl.question("Category [utility]: ") || "utility";
    return filled;
  } finally {
    rl.close();
  }
}

function usage() {
  return [
    "Usage:",
    "  node tools/new-skill.js --id <slug> --source <folder> --description \"Use when ...\" [options]",
    "",
    "Options:",
    "  --category <name>       Catalog category. Defaults to utility.",
    "  --adapter-name <slug>   Adapter folder slug. Defaults to --id.",
    "  --version <semver>      Initial version. Defaults to 1.0.0.",
    "  --dry-run              Print planned writes without changing files.",
    ""
  ].join("\n");
}

async function main() {
  const parsed = await promptForMissingArgs(parseArgs(process.argv.slice(2)));
  if (parsed.help) {
    console.log(usage());
    return;
  }

  const result = createNewSkill(parsed);
  const action = result.dryRun ? "Planned" : "Created";
  console.log(`${action} skill: ${result.plan.id}`);
  for (const file of result.plannedFiles) {
    console.log(`- ${file}`);
  }
  if (!result.dryRun) {
    console.log("Next: npm run build:adapters && npm run check");
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(`[new-skill] ${err.message}`);
    process.exit(1);
  });
}

module.exports = {
  appendSkillIndexEntry,
  buildSkillPlan,
  createNewSkill,
  parseArgs,
  skillTemplate
};
