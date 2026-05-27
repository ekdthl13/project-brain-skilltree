const fs = require("fs");
const path = require("path");
const { assertInsideSandbox } = require("./sandbox");

function resolveSandboxTarget(sandboxPath, targetFile) {
  if (path.isAbsolute(targetFile)) {
    throw new Error(`Safety violation: targetFile must be relative to the sandbox: ${targetFile}`);
  }

  const sandboxRoot = assertInsideSandbox(sandboxPath);
  const resolvedTarget = path.resolve(sandboxRoot, targetFile);
  const relativeFromSandbox = path.relative(sandboxRoot, resolvedTarget);

  if (!relativeFromSandbox || relativeFromSandbox.startsWith("..") || path.isAbsolute(relativeFromSandbox)) {
    throw new Error(`Safety violation: targetFile escapes sandbox: ${targetFile}`);
  }

  assertInsideSandbox(resolvedTarget);
  return resolvedTarget;
}

/**
 * Replays a list of deterministic simulation steps.
 * 
 * @param {Array} steps - The array of steps to replay.
 * @param {string} [sandboxPath] - Optional path to the active sandbox.
 * @returns {Array} The generated action log.
 */
function replaySteps(steps, sandboxPath) {
  if (!Array.isArray(steps)) {
    throw new Error("steps must be an array");
  }
  const actionLog = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step || typeof step.action !== "string") {
      throw new Error(`Invalid step at index ${i}: action must be a string`);
    }

    const { action, args = {} } = step;

    if (action === "mock_prompt") {
      actionLog.push({ action, args });
    } else if (action === "attempt_edit") {
      const { targetFile, contentModification } = args;
      if (!targetFile) {
        throw new Error(`Invalid attempt_edit step at index ${i}: targetFile is required`);
      }

      let resolvedModification = contentModification || "";
      if (typeof resolvedModification === "string") {
        resolvedModification = resolvedModification.replace(/PRIVATE_WINDOWS_USER_PATH/g, "C:\\Users\\hjh");
      }

      actionLog.push({
        action,
        args: {
          targetFile,
          contentModification: resolvedModification
        }
      });

      if (sandboxPath) {
        const filePath = resolveSandboxTarget(sandboxPath, targetFile);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, resolvedModification, "utf8");
      }
    } else if (action === "run_command") {
      const { command } = args;
      if (!command) {
        throw new Error(`Invalid run_command step at index ${i}: command is required`);
      }
      actionLog.push({ action, args });
      // Ban actual command execution per guidelines: log only.
    } else {
      throw new Error(`Invalid step at index ${i}: unsupported action "${action}"`);
    }
  }

  return actionLog;
}

module.exports = {
  replaySteps,
  resolveSandboxTarget
};
