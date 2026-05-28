const fs = require("fs");
const path = require("path");

const DEFAULT_REPO_ROOT = path.resolve(__dirname, "..");
const TARGETS = new Set(["antigravity", "codex", "claude-code"]);

function resolveTargetSource(target, repoRoot = DEFAULT_REPO_ROOT) {
  if (!TARGETS.has(target)) {
    throw new Error(`Unknown adapter target: ${target}`);
  }
  const source = path.resolve(repoRoot, "adapters", target, "skills");
  if (!fs.existsSync(source)) {
    throw new Error(`Adapter source does not exist: ${source}. Run npm run build:adapters first.`);
  }
  return source;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "T");
}

function assertSafeDestination(destination, repoRoot) {
  const resolved = path.resolve(destination);
  const repo = path.resolve(repoRoot);
  const root = path.parse(resolved).root;
  if (resolved === root) {
    throw new Error(`Refusing to install into filesystem root: ${resolved}`);
  }
  if (resolved === repo) {
    throw new Error("Refusing to overwrite repository root.");
  }
  return resolved;
}

function buildInstallPlan({ target, destination, repoRoot = DEFAULT_REPO_ROOT, now = timestamp }) {
  if (!destination) {
    throw new Error("Destination path is required.");
  }
  const source = resolveTargetSource(target, repoRoot);
  const resolvedDestination = assertSafeDestination(destination, repoRoot);
  const backupPath = fs.existsSync(resolvedDestination)
    ? `${resolvedDestination}.backup-${now()}`
    : null;
  return {
    target,
    source,
    destination: resolvedDestination,
    backupPath
  };
}

function copyDirectory(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function ensureBackupRoot(backupPath) {
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
}

function installAdapter(options) {
  const plan = buildInstallPlan(options);
  if (options.dryRun) {
    return { ...plan, dryRun: true, installed: false };
  }

  fs.mkdirSync(plan.destination, { recursive: true });
  for (const entry of fs.readdirSync(plan.source, { withFileTypes: true })) {
    const sourceEntry = path.join(plan.source, entry.name);
    const destinationEntry = path.join(plan.destination, entry.name);
    if (fs.existsSync(destinationEntry)) {
      ensureBackupRoot(plan.backupPath);
      const backupEntry = path.join(plan.backupPath, entry.name);
      if (fs.existsSync(backupEntry)) {
        throw new Error(`Backup path already exists: ${backupEntry}`);
      }
      fs.renameSync(destinationEntry, backupEntry);
    }
    if (entry.isDirectory()) {
      copyDirectory(sourceEntry, destinationEntry);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourceEntry, destinationEntry);
    }
  }

  if (plan.backupPath && fs.existsSync(plan.backupPath) && fs.readdirSync(plan.backupPath).length === 0) {
    fs.rmdirSync(plan.backupPath);
  }

  if (plan.backupPath && fs.existsSync(plan.backupPath)) {
    return { ...plan, dryRun: false, installed: true };
  }
  return { ...plan, backupPath: null, dryRun: false, installed: true };
}

function installAdapterReplaceAll(options) {
  const plan = buildInstallPlan(options);
  if (options.dryRun) {
    return { ...plan, dryRun: true, installed: false };
  }

  if (plan.backupPath) {
    if (fs.existsSync(plan.backupPath)) {
      throw new Error(`Backup path already exists: ${plan.backupPath}`);
    }
    fs.renameSync(plan.destination, plan.backupPath);
  }
  copyDirectory(plan.source, plan.destination);
  return { ...plan, dryRun: false, installed: true };
}

function parseArgs(argv) {
  const args = [...argv];
  const parsed = {
    target: null,
    destination: null,
    dryRun: false
  };
  while (args.length) {
    const arg = args.shift();
    if (arg === "--target") parsed.target = args.shift();
    else if (arg === "--dest" || arg === "--destination") parsed.destination = args.shift();
    else if (arg === "--dry-run") parsed.dryRun = true;
    else if (!parsed.target) parsed.target = arg;
    else if (!parsed.destination) parsed.destination = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!parsed.target) throw new Error("Adapter target is required.");
  if (!parsed.destination) {
    const envName = {
      antigravity: "ANTIGRAVITY_SKILLS_DIR",
      codex: "CODEX_SKILLS_DIR",
      "claude-code": "CLAUDE_SKILLS_DIR"
    }[parsed.target];
    parsed.destination = process.env[envName];
    if (!parsed.destination) {
      throw new Error(`Destination is required. Pass --dest or set ${envName}.`);
    }
  }
  return parsed;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = installAdapter(args);
  const lines = [
    `Adapter: ${result.target}`,
    `Source: ${result.source}`,
    `Destination: ${result.destination}`
  ];
  if (result.backupPath) lines.push(`Backup: ${result.backupPath}`);
  lines.push(result.dryRun ? "Dry run: no files changed" : "Install complete");
  console.log(lines.join("\n"));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildInstallPlan,
  installAdapter,
  installAdapterReplaceAll,
  resolveTargetSource,
  assertSafeDestination
};
