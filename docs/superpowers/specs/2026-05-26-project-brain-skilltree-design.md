# Project Brain Skilltree Canonical Repo Design

## Goal

Create a GitHub-first canonical repository for Project Brain Skilltree. The repo
must preserve the current Antigravity operating model while generating reliable
Codex and Claude Code adapters from the same source.

## Architecture

`source/` is the single source of truth. It stores `CORE_PRINCIPLES.md`,
`SKILL_INDEX.md`, and the original skill folders. `catalog/skills.yaml` maps
source folders to portable adapter names. `tools/build-adapters.js` creates
tool-specific install trees. `tools/validate-skilltree.js` blocks structural,
link, version, and security drift.

## Components

- Source: current Project Brain skill files.
- Catalog: stable metadata and adapter names.
- Builder: deterministic adapter generation.
- Validator: quality gate for source and generated adapters.
- Audit: report generator for human review.
- CI: GitHub Actions workflow that runs the build and validation gate.

## Data Flow

1. Edit `source/`.
2. Update `catalog/skills.yaml` when versions or skill names change.
3. Run `npm run build:adapters`.
4. Run `npm run validate`.
5. Run `npm run audit`.
6. Publish only if the full gate passes.

## Error Handling

Validation fails fast with actionable messages. Adapter build deletes and
regenerates only paths inside the repo. Security checks fail on private paths,
token-looking strings, and hidden Unicode controls.

## Testing

Use `npm run check` as the local and CI quality gate. Human-readable pressure
scenarios live in `tests/scenarios/` and define the next automation frontier.

## Scope

This design creates the canonical repo and validation system. It does not create
a remote GitHub repository or publish packages automatically.

