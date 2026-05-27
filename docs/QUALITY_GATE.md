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

Pressure scenarios defined as executable JSON profiles in `tests/scenarios/` evaluate key agent rules:

- **source-vs-adapter-confusion**: Direct modification of generated adapters instead of canonical source.
- **incomplete-reporting**: Committing work without writing a completion report to `_order.md`.
- **validation-skipping-pressure**: Attempting to bypass quality gates (like `npm run check`) under time pressure.
- **path-leakage**: Leaking local user paths into source files.

These scenarios are partially automated via `tools/pressure-scenarios.test.js`
to prevent private local paths, check section requirements, verify check script
completeness, enforce non-hardcoded installer roots, and ensure adapter edit
bans. Future versions may upgrade them into fully interactive subagent tests.
