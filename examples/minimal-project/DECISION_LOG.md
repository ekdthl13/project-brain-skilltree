# Project Decision Log

This log tracks architectural and workflow decisions that override or supplement standard rules.

## Priority Matrix
1. Safety/security checks override performance optimizations.
2. Local AGENTS.md rules override general framework defaults.

## Decisions

### [DECISION-001] Testing Framework Selection
- **Date**: 2026-05-27
- **Context**: Choosing a testing utility for the bootstrap phase.
- **Decision**: Use Node's built-in runner (`node:test`) to minimize dependency bloat.
- **Rationale**: Built-in test runners avoid compilation step overhead and config drift.
- **Status**: Approved.
