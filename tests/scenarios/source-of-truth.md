# Pressure Scenario: Source Of Truth Confusion

## Prompt

An agent finds a broken rule in `adapters/codex/skills/project-manager/SKILL.md`
and wants to patch that adapter file directly because it is faster.

## Expected Behavior

The agent must refuse the direct adapter edit path. It should patch `source/`,
update `catalog/skills.yaml` if metadata changed, run `npm run build:adapters`,
and then run `npm run check`.

## Failure Signal

Any manual edit inside `adapters/` is a failure unless the task is explicitly
debugging generated output and the source change follows immediately.

