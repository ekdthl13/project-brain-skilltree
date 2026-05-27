const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { replaySteps } = require("./lib/agent-sim");
const { createSandbox, cleanSandbox } = require("./lib/sandbox");

test("agent-sim: mock_prompt logs the prompt action", () => {
  const steps = [
    {
      action: "mock_prompt",
      args: { text: "Solve task" }
    }
  ];

  const log = replaySteps(steps);
  assert.equal(log.length, 1);
  assert.equal(log[0].action, "mock_prompt");
  assert.equal(log[0].args.text, "Solve task");
});

test("agent-sim: attempt_edit writes file to sandbox and replaces token", () => {
  const sandbox = createSandbox();
  try {
    const steps = [
      {
        action: "attempt_edit",
        args: {
          targetFile: "subdir/test.txt",
          contentModification: "Hello, my home is PRIVATE_WINDOWS_USER_PATH!"
        }
      }
    ];

    const log = replaySteps(steps, sandbox);
    
    // Check log
    assert.equal(log.length, 1);
    assert.equal(log[0].action, "attempt_edit");
    assert.equal(log[0].args.targetFile, "subdir/test.txt");
    assert.equal(log[0].args.contentModification, "Hello, my home is C:\\Users\\hjh!");

    // Check physical file write
    const expectedFile = path.join(sandbox, "subdir", "test.txt");
    assert.ok(fs.existsSync(expectedFile), "File should be written to sandbox");
    const content = fs.readFileSync(expectedFile, "utf8");
    assert.equal(content, "Hello, my home is C:\\Users\\hjh!");
  } finally {
    cleanSandbox(sandbox);
  }
});

test("agent-sim: attempt_edit refuses paths that escape sandbox", () => {
  const sandbox = createSandbox();
  const outsideFile = path.resolve(sandbox, "..", "project-brain-agent-sim-escape-test.txt");
  try {
    if (fs.existsSync(outsideFile)) {
      fs.rmSync(outsideFile, { force: true });
    }

    assert.throws(() => {
      replaySteps([
        {
          action: "attempt_edit",
          args: {
            targetFile: "../project-brain-agent-sim-escape-test.txt",
            contentModification: "escaped"
          }
        }
      ], sandbox);
    }, /Safety violation: targetFile escapes sandbox/);

    assert.equal(fs.existsSync(outsideFile), false, "Escape target must not be written");
  } finally {
    if (fs.existsSync(outsideFile)) {
      fs.rmSync(outsideFile, { force: true });
    }
    cleanSandbox(sandbox);
  }
});

test("agent-sim: attempt_edit refuses absolute target paths", () => {
  const sandbox = createSandbox();
  try {
    assert.throws(() => {
      replaySteps([
        {
          action: "attempt_edit",
          args: {
            targetFile: path.join(sandbox, "absolute.txt"),
            contentModification: "absolute"
          }
        }
      ], sandbox);
    }, /Safety violation: targetFile must be relative/);
  } finally {
    cleanSandbox(sandbox);
  }
});

test("agent-sim: run_command is logged but not executed", () => {
  const steps = [
    {
      action: "run_command",
      args: { command: "echo 'hello'" }
    }
  ];

  // We check that it logs it. Also since actual execution is banned, we make sure it runs without executing.
  const log = replaySteps(steps);
  assert.equal(log.length, 1);
  assert.equal(log[0].action, "run_command");
  assert.equal(log[0].args.command, "echo 'hello'");
});

test("agent-sim: validation checks for invalid steps", () => {
  assert.throws(() => {
    replaySteps("not an array");
  }, /steps must be an array/);

  assert.throws(() => {
    replaySteps([{ action: null }]);
  }, /action must be a string/);

  assert.throws(() => {
    replaySteps([{ action: "attempt_edit", args: {} }]);
  }, /targetFile is required/);

  assert.throws(() => {
    replaySteps([{ action: "run_command", args: {} }]);
  }, /command is required/);

  assert.throws(() => {
    replaySteps([{ action: "unknown_action", args: {} }]);
  }, /unsupported action/);
});
