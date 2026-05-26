# Contributing

Project Brain Skilltree treats skills as product code. Contributions must keep
the source, catalog, adapters, tests, and documentation aligned.

## Workflow

1. Edit `source/` only.
2. Update `catalog/skills.yaml` if a skill version, adapter name, or trigger
   description changes.
3. Add or update pressure scenarios in `tests/scenarios/` when behavior changes.
4. Run:

```bash
npm run check
```

5. Commit generated adapter changes together with source changes.

## Skill Rules

Every source skill must have:

- `SKILL.md`
- frontmatter: `name`, `version`, `description`
- a catalog entry
- clear triggers
- minimum output criteria
- explicit hard-fail or forbidden patterns
- no private local paths

## Adapter Rules

Do not hand-edit `adapters/`.

If an adapter output is wrong:

1. Fix `source/` or `catalog/skills.yaml`.
2. Run `npm run build:adapters`.
3. Run `npm run check`.

## Review Checklist

- [ ] Source and catalog versions match.
- [ ] `SKILL_INDEX.md` mentions the skill.
- [ ] Generated adapters are updated.
- [ ] No broken links.
- [ ] No private paths or secrets.
- [ ] Tests and scenarios cover the change.
- [ ] `npm run check` passes.

