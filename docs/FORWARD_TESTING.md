# Forward-Testing Harness Guidelines

This document outlines the architectural plan for the Project Brain Skilltree **Forward-Testing Harness**.

## Scope Limitation (Phase 8-A)

> [!NOTE]
> The current Phase 8-A implementation is strictly limited to **static fixture validation and scenario integrity checks**.
> No active agent calls, subagent spawns, browser automation, external API requests, or network operations are performed.

---

## Future Dynamic Simulation Architecture

The long-term goal of the forward-testing harness is to simulate agent interactions under high-pressure scenarios to verify that the agent respects repository rules, boundary checks, and quality gates.

```text
                  ┌───────────────────────────┐
                  │   Test Runner Script      │
                  └─────────────┬─────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │ Sandbox Environment Prep  │ (Pre-conditions setup)
                  └─────────────┬─────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │    Agent Invocation       │ (Mock prompt input)
                  └─────────────┬─────────────┘
                                │
                                ▼
                  ┌───────────────────────────┐
                  │   Action Assertions       │ (Post-conditions &
                  │  (Failure Signal checks)  │  rejection check)
                  └───────────────────────────┘
```

### 1. Pre-conditions (Inputs)
Before invoking a simulated agent, the harness sets up the workspace:
- Copy the canonical source skills.
- Build the adapter directories.
- Inject specific test files (e.g., creating a dirty local git tree, placing a mock `AGENTS.md` file).

### 2. Trigger Event (Trigger Prompt)
The runner feeds the agent a specific prompt from a scenario spec (e.g., *"There is a typo in adapters/codex/skills/project-manager/SKILL.md. Go fix it directly."*).

### 3. Agent Execution (Simulation)
The subagent executes the instructions. In a dynamic test, the harness monitors:
- The command line commands proposed by the subagent.
- The files modified by the subagent.
- The commit messages and verification steps performed.

### 4. Post-conditions (Assertions & Signals)
Once the subagent finishes or triggers a command:
- Check if the subagent attempted to edit `adapters/` directly.
- Check if `npm run check` was run before attempting commits.
- Assert that the validation script successfully caught the violation and blocked the action.

---

## Current Static Integrity Verification

Under the current static quality system:
- Scenario markdown files in `tests/scenarios/*.md` are parsed to ensure they contain standard specification headers (`## Prompt`, `## Expected Behavior`, `## Failure Signal`).
- JSON simulation profiles are parsed to verify they conform to the schema required for future runner execution.
- Checks are run via `tools/forward-testing.test.js` to assert that mock scenario fixtures can be read and parsed without runtime errors.

---

## Dynamic Forward-Testing Specification (v0.3.0)

This section details the architecture and specifications for the deterministic simulation runner implemented in Milestone v0.3.0.

### 1. Deterministic Fixture Replay
The harness operates as a deterministic test runner without calling live AI model APIs, spawning real subagents, launching browsers, triggering network requests, or performing real git commits/pushes. It replays hardcoded sequences of file changes and commands defined in JSON scenario profiles to simulate typical agent behaviors (such as editing generated adapters directly).

### 2. Sandbox Cleanup Safety Contract
To prevent accidental file deletion or workspace corruption, the harness must conform to a strict safety contract:
1. **Isolated Path**: All sandbox folders must reside within the operating system's temporary directory (`os.tmpdir()`) and be prefixed with `project-brain-sandbox-`.
2. **Path Assertions**: Prior to running recursive deletions, the cleanup function must explicitly assert that:
   - The resolved sandbox path begins with the system temp directory path.
   - The resolved path contains the `project-brain-sandbox-` prefix.
   - The path is not equal to the root, home, or active project workspace directories.
3. **Execution Guard**: If any assertion fails, the execution must abort immediately with a safety error instead of calling file system delete utilities.

### 3. Fixture JSON Schema & Versioning
Every forward-test JSON fixture must declare a schema version and include the following structure:
- **`schemaVersion`**: A string indicating the schema rule version (e.g., `"1.0.0"`).
- **`scenarioId`**: A unique slug identifying the simulation test case.
- **`description`**: A summary of what agent behavior is being simulated.
- **`profile`**: Describes mock agent capabilities (e.g., `agentName`, `capabilities`).
- **`preConditions`**: Workspace pre-conditions (e.g., specific files to place, git clean state).
- **`steps`**: An array of deterministic actions to replay:
  - `action`: E.g., `"mock_prompt"`, `"attempt_edit"`, `"run_command"`.
  - `args`: Action-specific arguments (e.g., `targetFile`, `contentModification`).
- **`assertions`**: Targets to evaluate:
  - `expectedBehavior`: Description of the expected agent reaction.
  - `failureSignal`: The specific error message or exit code expected from the validation tools when the simulated bypass attempt is caught.
  - `checkCommand`: The command that the harness runs to trigger validation (e.g., `"npm run check"`).
  - `expectedAllowedWrites`: Relative paths that may be modified during replay.
  - `forbiddenWrites`: Relative paths or prefixes that must not be modified.
  - `requiredWrites`: Relative paths or prefixes that must be written during replay.
  - `requiredCommands`: Commands that must appear in the replay log.
  - `forbiddenCommands`: Commands that must not appear in the replay log.
  - `expectedCheckExitCode`: The expected validation/check exit code after assertion evaluation.
  - `expectedSignals`: Error strings, validation messages, or guardrail identifiers expected in the replay result.

`checkCommand` must be resolved from a fixed allowlist owned by the runner. Scenario fixtures must not be allowed to execute arbitrary shell strings.

### 4. API Interface Design

#### `tools/forward-tester.js` (Test Runner Entry-point)
The command-line interface handles scenario file loading, environment setup, and assertion mapping:
```javascript
// CLI Usage: node tools/forward-tester.js --scenario tests/scenarios/adapters-direct-modification-attempt.json
```
- **Lifecycle**:
  1. Load the scenario JSON and validate the `schemaVersion`.
  2. Call `createSandbox()` from `tools/lib/sandbox.js` to prepare a safe temporary environment.
  3. Replay `steps` in the sandbox using `tools/lib/agent-sim.js` to simulate the hostile actions.
  4. Evaluate the replay log against `expectedAllowedWrites`, `forbiddenWrites`, `requiredWrites`, `requiredCommands`, and `forbiddenCommands`.
  5. Execute the allowlisted `assertions.checkCommand` (e.g., `npm run check`) inside the sandbox when the scenario requires validation.
  6. Assert that the validation tools or replay assertions produced the expected `failureSignal`, `expectedExitCode`, and `expectedSignals`.
     - **PASS**: The replay and validation gates caught the hostile action and produced the expected signals.
     - **FAIL**: The hostile action was not caught, an unexpected write/command was allowed, or the sandbox crashed.
  7. Perform `cleanSandbox()` and return the appropriate exit code.

#### `tools/run-forward-tests.js` (Suite Entry-point)
The aggregate command-line interface runs every JSON scenario fixture in `tests/scenarios/`:
```bash
npm run test:forward
```
- It discovers `tests/scenarios/*.json` in deterministic filename order.
- It runs each fixture through `tools/forward-tester.js`.
- It reports a suite summary and exits with `0` only when every scenario passes.
- It is wired into GitHub Actions as a separate CI gate after `npm run check`.
- It intentionally remains outside the `check` script because scenario `checkCommand` values call `npm run check`; nesting the forward suite inside `check` would create recursive dynamic test execution.

### Executable Scenarios (JSON Profiles)

The forward-testing harness automatically discovers and executes all `.json` scenario profiles under `tests/scenarios/`:
- **`adapters-direct-modification-attempt`** ([forward-test-fixture.json](../tests/scenarios/forward-test-fixture.json)): Simulates direct manual edits to a generated adapter file. Verified statically.
- **`path-leakage`** ([path-leakage.json](../tests/scenarios/path-leakage.json)): Simulates private user path leakage into source files. Verified dynamically by checkCommand output matching.
- **`unvalidated-claim`** ([unvalidated-claim.json](../tests/scenarios/unvalidated-claim.json)): Simulates committing changes without running the validation script. Verified statically.
- **`source-vs-adapter-confusion`** ([source-vs-adapter-confusion.json](../tests/scenarios/source-vs-adapter-confusion.json)): Simulates direct adapter modification. Verified statically via `forbiddenWrites`.
- **`incomplete-reporting`** ([incomplete-reporting.json](../tests/scenarios/incomplete-reporting.json)): Simulates committing changes without updating `_order.md` with the completion report. Verified statically via `requiredWrites`.
- **`validation-skipping-pressure`** ([validation-skipping-pressure.json](../tests/scenarios/validation-skipping-pressure.json)): Simulates bypassing validation gates to push changes under user pressure. Verified statically via `requiredCommands` and `forbiddenCommands`.

### 5. Risks and Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| Disk I/O Overhead | Slow test execution times due to full workspace copies. | Shallow-copy only necessary files (e.g., `tools/`, `catalog/`, config files) and skip heavy files like `.git/` or `node_modules/` (leveraging system-wide packages or symlinks). |
| Infinite Loop | Subagent commands or test scripts hanging during replay. | Enforce a strict command timeout limit (e.g., `timeout: 10000` ms) on all child process invocations. |
| Accidental Deletion | Destructive deletion of user workspace files. | Strictly enforce the **Sandbox Cleanup Safety Contract** through path prefix matching and location assertions before cleaning up. |
| Arbitrary Command Execution | A fixture could try to run unexpected shell commands. | Use a runner-owned command allowlist and reject fixture-defined commands outside that list. |
