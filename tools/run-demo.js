const fs = require("fs");
const path = require("path");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");
const { installAdapter } = require("./install-adapter");
const { execSync } = require("child_process");

/**
 * Runs the deterministic Project Brain Skilltree first-success demo workflow.
 * Compiles canonical source, spawns a temporary sandbox, simulates safe deployment,
 * and asserts all conflict-backup & preservation policies hold correct.
 * 
 * @param {Object} [options] - Configurations for the demo.
 * @param {boolean} [options.silent=false] - If true, suppresses terminal console outputs.
 * @param {string} [options.repoRoot] - Override for repository root resolution.
 * @returns {boolean} True if demo completes and passes all automated checks.
 */
function runDemo(options = {}) {
  const silent = options.silent || false;
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  
  if (!silent) {
    console.log("\n========================================================");
    console.log("    PROJECT BRAIN SKILLTREE - FIRST SUCCESS DEMO   ");
    console.log("========================================================");
    console.log("[Phase 1/4] Rebuilding adapters from canonical source...");
  }
  
  // 1. Compile adapters from source to generate fresh adapter folders.
  try {
    execSync(`node "${path.join(repoRoot, "tools", "build-adapters.js")}"`, {
      cwd: repoRoot,
      stdio: silent ? "ignore" : "inherit"
    });
  } catch (err) {
    throw new Error(`Failed to compile adapters from source: ${err.message}`);
  }

  if (!silent) {
    console.log("\n[Phase 2/4] Setting up a secure local verification sandbox...");
  }

  // 2. Spawn a sandboxed directory inside the OS temporary layout.
  let sandboxPath = null;
  try {
    sandboxPath = createSandbox({ repoRoot });
    const mockSkillsDir = path.join(sandboxPath, "mock-agent-skills");
    fs.mkdirSync(mockSkillsDir, { recursive: true });

    // 3. Set up pre-existing files to test the installer's safety rules.
    // Pre-scaffold a conflict file to demonstrate backup logic.
    const oldPrinciplesPath = path.join(mockSkillsDir, "CORE_PRINCIPLES.md");
    fs.writeFileSync(
      oldPrinciplesPath,
      "# Old Local Principles\nThis is old user content and must be backed up safely.",
      "utf8"
    );

    // Pre-scaffold an unrelated file to demonstrate preservation logic.
    const unrelatedDir = path.join(mockSkillsDir, "custom-user-skill");
    fs.mkdirSync(unrelatedDir, { recursive: true });
    fs.writeFileSync(
      path.join(unrelatedDir, "SKILL.md"),
      "# Custom User Skill\nThis is unrelated manually created content. It must not be deleted.",
      "utf8"
    );

    if (!silent) {
      console.log("\n[Phase 3/4] Running adapter installer on the sandbox target...");
    }

    // 4. Run the installer targeting the sandbox skills folder.
    const mockNow = () => "20260528T090000";
    let installResult;
    try {
      installResult = installAdapter({
        target: "antigravity",
        destination: mockSkillsDir,
        repoRoot,
        now: mockNow
      });
    } catch (err) {
      throw new Error(`Adapter installer crashed: ${err.message}`);
    }

    if (!silent) {
      console.log("\n[Phase 4/4] Conducting automated side-effect validations...");
    }

    // 5. Conduct automated checks on side-effects to prove success.
    const newPrinciplesExist = fs.existsSync(path.join(mockSkillsDir, "CORE_PRINCIPLES.md"));
    const newPrinciplesContent = fs.readFileSync(path.join(mockSkillsDir, "CORE_PRINCIPLES.md"), "utf8");
    const isUpgraded = !newPrinciplesContent.includes("This is old user content and must be backed up safely.");

    const backupDir = `${mockSkillsDir}.backup-20260528T090000`;
    const backupExists = fs.existsSync(backupDir);
    const backupPrinciplesExist = fs.existsSync(path.join(backupDir, "CORE_PRINCIPLES.md"));
    const backupPrinciplesContent = backupPrinciplesExist
      ? fs.readFileSync(path.join(backupDir, "CORE_PRINCIPLES.md"), "utf8")
      : "";
    const backupCorrect = backupPrinciplesContent.includes("This is old user content and must be backed up safely.");

    const preservationCorrect = fs.existsSync(path.join(mockSkillsDir, "custom-user-skill", "SKILL.md"));

    // Check if installation outcome matches all required specifications.
    if (!newPrinciplesExist || !isUpgraded || !backupExists || !backupCorrect || !preservationCorrect) {
      throw new Error("Demo verification failed: Installer generated incorrect side-effects inside the sandbox.");
    }
  } finally {
    if (sandboxPath) {
      // Clean up sandbox to leave zero footprints on the user's local system.
      cleanSandbox(sandboxPath, { repoRoot });
    }
  }

  if (!silent) {
    console.log("\n========================================================");
    console.log(" 🎉 SUCCESS: BRAIN SKILLTREE DEMO COMPLETED SUCCESSFULLY! 🎉");
    console.log("========================================================");
    console.log("WHAT WAS VERIFIED:");
    console.log("  ✔ Compiling canonical source tree (source/ -> adapters/)");
    console.log("  ✔ Isolating OS sandboxed target paths to avoid drift");
    console.log("  ✔ Deploying multi-agent skills adapter into target environment");
    console.log("  ✔ Backing up conflicting user documents to an isolated backup path");
    console.log("  ✔ Preserving unrelated manually created user-agent skills");
    console.log("--------------------------------------------------------");
    console.log("CORE PRINCIPLES (Source of Truth):");
    console.log("  1. HUMAN CANONICAL ROOT : 'source/' is the only place you edit.");
    console.log("  2. MACHINE ADAPTERS     : 'adapters/' are generated. Do not edit.");
    console.log("  3. SAFE QUALITY GATES   : Validation runs automatically before install.");
    console.log("--------------------------------------------------------");
    console.log("RECOMMENDED NEXT COMMANDS:");
    console.log("  * Run full quality check suite :");
    console.log("    npm run check");
    console.log("");
    console.log("  * Run behavioral pressure-scenarios :");
    console.log("    npm run test:forward");
    console.log("");
    console.log("  * Preview skill deployment without writing :");
    console.log("    node tools/install-adapter.js antigravity /your/agent/skills --dry-run");
    console.log("========================================================\n");
  }

  return true;
}

if (require.main === module) {
  try {
    runDemo();
  } catch (error) {
    console.error(`\n❌ Demo Execution Failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = { runDemo };
