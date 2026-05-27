# New Skill CLI

`npm run new:skill` creates a draft Project Brain skill in the canonical source tree and registers it in the catalog.

## Command

```bash
npm run new:skill -- --id research-helper --source "Research Helper" --category research --description "Use when gathering research inputs for a project."
```

## What It Writes

- `source/<source>/SKILL.md`
- `catalog/skills.yaml`
- `source/SKILL_INDEX.md`

The command does not edit generated adapter folders directly. After creating a skill, follow the verification flow below.

## Post-Creation Verification

After `npm run new:skill` finishes, run these steps in order:

### 1. Build adapters

Regenerate the adapter directories so they include the new skill:

```bash
npm run build:adapters
```

### 2. Run the quality gate

Verify that the new skill passes all validation, audit, and test checks:

```bash
npm run check
```

### 3. Run forward tests (conditional)

If the new skill changes any forward-testing scenario behavior—such as adding
a new JSON fixture under `tests/scenarios/` or modifying runner
expectations—run the forward-testing suite:

```bash
npm run test:forward
```

> Skip this step if the new skill does not affect forward-testing fixtures or runner logic.

## Options

| Option | Required | Notes |
|--------|----------|-------|
| `--id` | Yes | Lowercase hyphen slug, unique in the catalog. |
| `--source` | Yes | Single directory name under `source/`; path separators and Windows-unsafe filename characters are rejected. |
| `--description` | Yes | Must start with `Use when `. |
| `--category` | No | Lowercase hyphen slug. Defaults to `utility`. |
| `--adapter-name` | No | Lowercase hyphen slug. Defaults to `--id`. |
| `--version` | No | SemVer. Defaults to `1.0.0`. |
| `--dry-run` | No | Prints the planned files without writing them. |

## Guardrails

- Rejects duplicate catalog ids, adapter names, and source folders.
- Rejects source paths that could escape `source/`.
- Writes only through the canonical source and catalog files.
- Creates a template with frontmatter, triggers, workflow, minimum output criteria, hard fails, handoff, and self-check sections.
