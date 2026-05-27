const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");
const { replaySteps } = require("./lib/agent-sim");

const ALLOWED_CHECK_COMMANDS = new Set(["npm run check"]);
const CHECK_COMMAND_TIMEOUT_MS = 120000;

/**
 * Copies a directory recursively, excluding specific system and log folders.
 */
function copyDirSync(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (entry === ".git" || entry === "node_modules" || entry === "reports") {
        continue;
      }
      copyDirSync(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Loads a scenario JSON, sets up the sandbox, replays actions, and evaluates assertions.
 * 
 * @param {string} scenarioPath - The absolute or relative path to the scenario JSON file.
 * @returns {Object} The run result containing pass status, checkExitCode, staticSignals, and dynamicOutput.
 */
function runScenario(scenarioPath) {
  const resolvedPath = path.resolve(scenarioPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Scenario file not found: ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, "utf8");
  let scenario;
  try {
    scenario = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse scenario JSON: ${err.message}`);
  }

  // Validate schema version
  if (scenario.schemaVersion !== "1.0.0") {
    throw new Error(`Unsupported schemaVersion: ${scenario.schemaVersion}. Expected: 1.0.0`);
  }

  const { scenarioId, description, steps, assertions } = scenario;
  if (!scenarioId || !steps || !assertions) {
    throw new Error("Invalid scenario schema: missing scenarioId, steps, or assertions");
  }

  console.log(`[FORWARD TEST] Running scenario: ${scenarioId}`);
  console.log(`[FORWARD TEST] Description: ${description || "None"}`);

  // Create sandbox
  const sandboxPath = createSandbox();
  console.log(`[FORWARD TEST] Sandbox created at: ${sandboxPath}`);

  let runResult = {
    pass: false,
    reason: "",
    staticSignals: [],
    dynamicOutput: "",
    checkExitCode: null
  };

  try {
    // Initialize sandbox: copy repository files
    const repoRoot = path.resolve(__dirname, "..");
    copyDirSync(repoRoot, sandboxPath);

    // Replay actions in the sandbox
    const actionLog = replaySteps(steps, sandboxPath);

    // Collect violations statically
    const staticSignals = [];

    // Evaluate forbiddenWrites
    if (Array.isArray(assertions.forbiddenWrites)) {
      for (const step of actionLog) {
        if (step.action === "attempt_edit") {
          const target = step.args.targetFile;
          for (const pattern of assertions.forbiddenWrites) {
            if (target.startsWith(pattern)) {
              staticSignals.push("forbiddenWrites");
              staticSignals.push(`forbiddenWrites violation for ${pattern}`);
            }
          }
        }
      }
    }

    // Evaluate forbiddenCommands
    if (Array.isArray(assertions.forbiddenCommands)) {
      for (const step of actionLog) {
        if (step.action === "run_command") {
          const cmd = step.args.command;
          for (const pattern of assertions.forbiddenCommands) {
            if (cmd.includes(pattern)) {
              staticSignals.push("forbiddenCommands");
              staticSignals.push(`forbiddenCommands violation for ${pattern}`);
            }
          }
        }
      }
    }

    // Evaluate requiredCommands
    if (Array.isArray(assertions.requiredCommands)) {
      for (const requiredCmd of assertions.requiredCommands) {
        const found = actionLog.some(
          step => step.action === "run_command" && step.args.command.includes(requiredCmd)
        );
        if (!found) {
          staticSignals.push("requiredCommands");
          staticSignals.push(`requiredCommands violation for ${requiredCmd}`);
          staticSignals.push("validation check missing");
        }
      }
    }

    // Execute checkCommand
    let checkExitCode = null;
    let dynamicOutput = "";

    if (assertions.checkCommand) {
      if (!ALLOWED_CHECK_COMMANDS.has(assertions.checkCommand)) {
        throw new Error(`Security Violation: checkCommand "${assertions.checkCommand}" is not in the ALLOWED_CHECK_COMMANDS list.`);
      }

      console.log(`[FORWARD TEST] Executing checkCommand inside sandbox: ${assertions.checkCommand}`);
      const res = cp.spawnSync(assertions.checkCommand, {
        cwd: sandboxPath,
        shell: true,
        encoding: "utf8",
        timeout: CHECK_COMMAND_TIMEOUT_MS,
        env: {
          ...process.env,
          FORCE_COLOR: "0",
          PROJECT_BRAIN_FORWARD_TEST_INNER_CHECK: "1"
        }
      });

      checkExitCode = res.status !== null ? res.status : 1;
      dynamicOutput = `${res.stdout || ""}${res.stderr || ""}${res.error ? `\n${res.error.message}` : ""}`;
      console.log(`[FORWARD TEST] checkCommand exited with code: ${checkExitCode}`);
    }

    // If static violations were detected, they take precedence and force checkExitCode to 1
    if (staticSignals.length > 0) {
      checkExitCode = 1;
    }

    // Evaluate assertion criteria
    let pass = true;
    const failures = [];

    // Verify exit code
    if (assertions.expectedCheckExitCode !== undefined) {
      if (checkExitCode !== assertions.expectedCheckExitCode) {
        pass = false;
        failures.push(`Exit code mismatch: expected ${assertions.expectedCheckExitCode}, got ${checkExitCode}`);
      }
    }

    // Verify signals (check statically detected signals, dynamic check output, and scenario-defined failureSignal)
    if (Array.isArray(assertions.expectedSignals)) {
      for (const expectedSignal of assertions.expectedSignals) {
        const inStatic = staticSignals.some(s => s.toLowerCase().includes(expectedSignal.toLowerCase()));
        const inDynamic = dynamicOutput.toLowerCase().includes(expectedSignal.toLowerCase());
        const inFailureSignal = assertions.failureSignal && assertions.failureSignal.toLowerCase().includes(expectedSignal.toLowerCase());

        if (!inStatic && !inDynamic && !inFailureSignal) {
          pass = false;
          failures.push(`Expected signal not found: "${expectedSignal}"`);
        }
      }
    }

    runResult = {
      pass,
      reason: pass ? "All assertions satisfied." : failures.join("; "),
      staticSignals,
      dynamicOutput,
      checkExitCode
    };

  } finally {
    console.log(`[FORWARD TEST] Cleaning up sandbox at: ${sandboxPath}`);
    cleanSandbox(sandboxPath);
  }

  return runResult;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let scenarioPath = null;
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--scenario" || args[i] === "-s") && args[i + 1]) {
      scenarioPath = args[i + 1];
      break;
    }
  }

  if (!scenarioPath) {
    console.error("Usage: node tools/forward-tester.js --scenario <path_to_fixture_json>");
    process.exit(1);
  }

  try {
    const result = runScenario(scenarioPath);
    console.log("\n========================================");
    console.log(`Forward Test result: ${result.pass ? "PASS" : "FAIL"}`);
    console.log(`Reason: ${result.reason}`);
    console.log("========================================\n");

    if (result.pass) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error(`[FORWARD TEST] Execution failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  runScenario,
  ALLOWED_CHECK_COMMANDS,
  CHECK_COMMAND_TIMEOUT_MS
};
