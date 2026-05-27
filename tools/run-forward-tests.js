const fs = require("fs");
const path = require("path");
const { runScenario } = require("./forward-tester");

const repoRoot = path.resolve(__dirname, "..");
const defaultScenarioDir = path.join(repoRoot, "tests", "scenarios");

function listScenarioFiles(scenarioDir = defaultScenarioDir) {
  const resolvedScenarioDir = path.resolve(scenarioDir);
  if (!fs.existsSync(resolvedScenarioDir)) {
    throw new Error(`Scenario directory not found: ${resolvedScenarioDir}`);
  }

  return fs.readdirSync(resolvedScenarioDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".json"))
    .map(entry => path.join(resolvedScenarioDir, entry.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function runForwardTests(options = {}) {
  const scenarioDir = options.scenarioDir || defaultScenarioDir;
  const runScenarioFn = options.runScenarioFn || runScenario;
  const logger = options.logger || console;
  const scenarioFiles = listScenarioFiles(scenarioDir);

  if (scenarioFiles.length === 0) {
    throw new Error(`No forward-test JSON scenarios found in: ${path.resolve(scenarioDir)}`);
  }

  const results = [];
  logger.log(`[FORWARD SUITE] Found ${scenarioFiles.length} scenario(s).`);

  for (const scenarioFile of scenarioFiles) {
    const scenarioName = path.basename(scenarioFile);
    logger.log(`[FORWARD SUITE] Running ${scenarioName}`);

    try {
      const result = runScenarioFn(scenarioFile);
      results.push({
        scenario: scenarioName,
        file: scenarioFile,
        pass: Boolean(result.pass),
        reason: result.reason || "",
        checkExitCode: result.checkExitCode,
        staticSignals: result.staticSignals || []
      });
    } catch (err) {
      results.push({
        scenario: scenarioName,
        file: scenarioFile,
        pass: false,
        reason: err.message,
        checkExitCode: null,
        staticSignals: []
      });
    }
  }

  const failed = results.filter(result => !result.pass);
  const passed = results.length - failed.length;

  logger.log(`[FORWARD SUITE] Summary: ${passed}/${results.length} passed.`);
  for (const result of results) {
    const status = result.pass ? "PASS" : "FAIL";
    logger.log(`[FORWARD SUITE] ${status} ${result.scenario}: ${result.reason}`);
  }

  return {
    pass: failed.length === 0,
    total: results.length,
    passed,
    failed: failed.length,
    results
  };
}

function parseArgs(argv) {
  const parsed = { scenarioDir: defaultScenarioDir };
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === "--scenario-dir" || argv[i] === "-d") && argv[i + 1]) {
      parsed.scenarioDir = argv[i + 1];
      i++;
    }
  }
  return parsed;
}

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = runForwardTests(args);
    process.exit(result.pass ? 0 : 1);
  } catch (err) {
    console.error(`[FORWARD SUITE] Execution failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  defaultScenarioDir,
  listScenarioFiles,
  runForwardTests,
  parseArgs
};
