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
