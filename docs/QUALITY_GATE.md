# Quality Gate

The quality gate is the definition of "no obvious holes."

## Structural Checks

- Every catalog entry points to an existing source skill.
- Every source skill has a catalog entry.
- Every source skill has `SKILL.md`.
- Source frontmatter includes `name`, `version`, and `description`.
- Codex and Claude adapters include only `name` and `description` frontmatter.
- Adapter directories are generated from source.

## Link Checks

- Markdown links to local files must resolve.
- Missing templates, references, and checklists fail validation.

## Drift Checks

- Catalog version must match source `version`.
- `SKILL_INDEX.md` must mention every source skill.
- Generated adapters must be rebuilt before validation passes.
- `npm run diff:adapters` must report no missing, changed, or extra generated
  adapter files.

## Size Checks

- `SKILL.md` over 400 lines triggers split-review into support files.
- `SKILL.md` over 500 lines fails validation.
- Long examples, templates, checklists, and catalogs belong in support files.

## Security Checks

- No personal absolute paths.
- No common credential/token patterns.
- No bidirectional text controls or Unicode tag characters.
- No adapter-only hand edits.

## Behavioral Checks

Pressure scenarios in `tests/scenarios/` define expected failure modes:

- source-of-truth confusion
- skipping validation under pressure
- conflicting output packaging
- agent-specific tool wording

These scenarios are human-readable today and can be upgraded into automated
subagent tests later.
