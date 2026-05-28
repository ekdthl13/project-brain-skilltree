const fs = require("fs");
const path = require("path");
const { assertSafeDestination, resolveTargetSource } = require("./install-adapter.js");

const DEFAULT_REPO_ROOT = path.resolve(__dirname, "..");

function findLatestBackup(destination) {
  const parentDir = path.dirname(destination);
  const baseName = path.basename(destination);
  if (!fs.existsSync(parentDir)) {
    return null;
  }
  const files = fs.readdirSync(parentDir);
  const backupPrefix = `${baseName}.backup-`;
  const backups = files
    .filter(f => f.startsWith(backupPrefix))
    .map(f => path.join(parentDir, f))
    .filter(p => fs.statSync(p).isDirectory());
  
  if (backups.length === 0) {
    return null;
  }
  // Sort alphabetically to get the latest timestamp
  backups.sort();
  return backups[backups.length - 1];
}

function buildRestorePlan({ target, destination, backup, repoRoot = DEFAULT_REPO_ROOT }) {
  if (!destination) {
    throw new Error("Destination path is required.");
  }
  const resolvedDestination = assertSafeDestination(destination, repoRoot);
  const source = resolveTargetSource(target, repoRoot);
  
  const resolvedBackup = backup ? path.resolve(backup) : findLatestBackup(resolvedDestination);
  if (!resolvedBackup) {
    throw new Error(`No backups found for destination: ${resolvedDestination}`);
  }
  if (!fs.existsSync(resolvedBackup)) {
    throw new Error(`Backup path does not exist: ${resolvedBackup}`);
  }

  // Safety checks for explicit backup path to prevent accessing arbitrary paths
  if (backup) {
    const destParent = path.dirname(resolvedDestination);
    const destBase = path.basename(resolvedDestination);
    const backupParent = path.dirname(resolvedBackup);
    const backupBase = path.basename(resolvedBackup);

    if (backupParent !== destParent) {
      throw new Error(`Safety violation: Backup directory must be a sibling of the destination directory: ${resolvedBackup}`);
    }
    if (!backupBase.startsWith(`${destBase}.backup-`)) {
      throw new Error(`Safety violation: Backup directory name must start with '${destBase}.backup-': ${backupBase}`);
    }
  }
  
  const restoreList = [];
  const cleanList = [];
  const preserveList = [];
  
  const sourceEntries = fs.readdirSync(source);
  for (const name of sourceEntries) {
    const backupEntry = path.join(resolvedBackup, name);
    const destEntry = path.join(resolvedDestination, name);
    
    if (fs.existsSync(backupEntry)) {
      restoreList.push({ name, from: backupEntry, to: destEntry });
    } else if (fs.existsSync(destEntry)) {
      cleanList.push({ name, path: destEntry });
    }
  }
  
  if (fs.existsSync(resolvedDestination)) {
    const destEntries = fs.readdirSync(resolvedDestination);
    const sourceSet = new Set(sourceEntries);
    for (const name of destEntries) {
      if (!sourceSet.has(name)) {
        preserveList.push({ name, path: path.join(resolvedDestination, name) });
      }
    }
  }
  
  return {
    target,
    source,
    destination: resolvedDestination,
    backupPath: resolvedBackup,
    restoreList,
    cleanList,
    preserveList
  };
}

function restoreAdapter(options) {
  const plan = buildRestorePlan(options);
  if (options.dryRun) {
    return { ...plan, dryRun: true, restored: false };
  }
  
  // 1. Delete newly added adapter files/folders in destination
  for (const item of plan.cleanList) {
    if (fs.existsSync(item.path)) {
      fs.rmSync(item.path, { recursive: true, force: true });
    }
  }
  
  // 2. Copy backed up files back to destination (Preserves the backup folder)
  for (const item of plan.restoreList) {
    if (fs.existsSync(item.to)) {
      fs.rmSync(item.to, { recursive: true, force: true });
    }
    fs.cpSync(item.from, item.to, { recursive: true });
  }
  
  return { ...plan, dryRun: false, restored: true };
}

function parseArgs(argv) {
  const args = [...argv];
  const parsed = {
    target: null,
    destination: null,
    backup: null,
    dryRun: false
  };
  while (args.length) {
    const arg = args.shift();
    if (arg === "--target") parsed.target = args.shift();
    else if (arg === "--dest" || arg === "--destination") parsed.destination = args.shift();
    else if (arg === "--backup") parsed.backup = args.shift();
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
  const result = restoreAdapter(args);
  
  const lines = [
    result.dryRun ? `[DRY RUN] Restore Plan for: ${result.target}` : `Restoring adapter: ${result.target}`,
    `Destination: ${result.destination}`,
    `Backup path: ${result.backupPath}`,
    `\nFiles to restore (backed up -> original destination):`,
    ...result.restoreList.map(item => `  - ${item.name} (${item.from} -> ${item.to})`),
    `\nFiles to clean (newly added files to be removed):`,
    ...result.cleanList.map(item => `  - ${item.name} (${item.path})`),
    `\nUnrelated files to preserve (untouched):`,
    ...result.preserveList.map(item => `  - ${item.name} (${item.path})`)
  ];
  
  lines.push("\n" + (result.dryRun ? "Dry run: no files changed" : "Restore completed successfully."));
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
  findLatestBackup,
  buildRestorePlan,
  restoreAdapter
};
