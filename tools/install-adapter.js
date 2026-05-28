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
    throw new Error(`Refusing to install into filesystem root: ${resolved}. Pointing the installer at the root directory of a drive can cause accidental data loss or system instability.`);
  }
  if (resolved === repo) {
    throw new Error(`Refusing to overwrite repository root: ${resolved}. The installer must be pointed to a subdirectory dedicated to agent skills (e.g., ~/.gemini/config/skills), not the source code repository itself.`);
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

  const sourceEntries = fs.readdirSync(plan.source, { withFileTypes: true });
  const willWrite = [];
  const willBackup = [];
  const willPreserve = [];

  if (fs.existsSync(plan.destination)) {
    const destEntries = fs.readdirSync(plan.destination);
    const sourceSet = new Set(sourceEntries.map(e => e.name));
    for (const name of destEntries) {
      if (!sourceSet.has(name)) {
        // check if it is directory in destination
        const destPath = path.join(plan.destination, name);
        const stat = fs.statSync(destPath);
        willPreserve.push(stat.isDirectory() ? `${name}/` : name);
      }
    }
  }

  for (const entry of sourceEntries) {
    const nameWithSlash = entry.isDirectory() ? `${entry.name}/` : entry.name;
    const destEntry = path.join(plan.destination, entry.name);
    if (fs.existsSync(destEntry)) {
      willBackup.push(nameWithSlash);
    } else {
      willWrite.push(nameWithSlash);
    }
  }

  if (options.dryRun) {
    return {
      ...plan,
      dryRun: true,
      installed: false,
      willWrite,
      willBackup,
      willPreserve
    };
  }

  fs.mkdirSync(plan.destination, { recursive: true });
  for (const entry of sourceEntries) {
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

  const actualBackupCreated = plan.backupPath && fs.existsSync(plan.backupPath);
  return {
    ...plan,
    backupPath: actualBackupCreated ? plan.backupPath : null,
    dryRun: false,
    installed: true,
    willWrite,
    willBackup,
    willPreserve
  };
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
    dryRun: false,
    help: false
  };
  while (args.length) {
    const arg = args.shift();
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--target") {
      parsed.target = args.shift();
    } else if (arg === "--dest" || arg === "--destination") {
      parsed.destination = args.shift();
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else if (!parsed.target) {
      parsed.target = arg;
    } else if (!parsed.destination) {
      parsed.destination = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (parsed.help) {
    return parsed;
  }

  if (!parsed.target) {
    throw new Error("Adapter target is required. Pass --help or -h for usage instructions.");
  }
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

function printHelp() {
  console.log(`
Usage:
  node tools/install-adapter.js <target> <destination> [options]
  node tools/install-adapter.js --target <target> --dest <destination> [options]

Arguments:
  target         The adapter environment to deploy (antigravity, codex, claude-code).
  destination    The target directory where the skills adapter will be installed.

Options:
  --dry-run      Analyze and preview the deployment plan without changing any files.
  --help, -h     Show this help message.

Environment Variables:
  If destination is not provided via CLI, the installer will attempt to read:
    - ANTIGRAVITY_SKILLS_DIR (when target is 'antigravity')
    - CODEX_SKILLS_DIR       (when target is 'codex')
    - CLAUDE_SKILLS_DIR      (when target is 'claude-code')
  `);
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  try {
    const result = installAdapter(args);
    if (result.dryRun) {
      const lines = [
        `[DRY RUN] Target adapter: ${result.target}`,
        `[DRY RUN] Destination: ${result.destination}`
      ];
      if (result.backupPath) {
        lines.push(`[DRY RUN] Will create backup: ${result.backupPath}`);
      }
      lines.push("");
      lines.push("[DRY RUN] Files that would be written (new):");
      if (result.willWrite.length === 0) {
        lines.push("  - (none)");
      } else {
        result.willWrite.forEach(f => lines.push(`  - ${f}`));
      }

      lines.push("");
      lines.push("[DRY RUN] Files that would be backed up and replaced (conflicting):");
      if (result.willBackup.length === 0) {
        lines.push("  - (none)");
      } else {
        result.willBackup.forEach(f => lines.push(`  - ${f}`));
      }

      lines.push("");
      lines.push("[DRY RUN] Files that would be preserved (unrelated):");
      if (result.willPreserve.length === 0) {
        lines.push("  - (none)");
      } else {
        result.willPreserve.forEach(f => lines.push(`  - ${f}`));
      }

      lines.push("");
      lines.push("Dry run: no files changed");
      console.log(lines.join("\n"));
    } else {
      const lines = [
        `Installing adapter: ${result.target}`,
        `Source: ${result.source}`,
        `Destination: ${result.destination}`
      ];
      if (result.backupPath) {
        lines.push(`Backup created: ${result.backupPath}`);
      }
      lines.push(`Copied ${result.willWrite.length + result.willBackup.length} skills to ${result.destination}`);
      lines.push(`Preserved ${result.willPreserve.length} unrelated items.`);
      lines.push("Installation completed successfully.");
      console.log(lines.join("\n"));
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
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
  assertSafeDestination,
  parseArgs
};
