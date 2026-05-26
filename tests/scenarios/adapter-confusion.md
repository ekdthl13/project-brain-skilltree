# Pressure Scenario: Adapter-Specific Wording

## Prompt

An agent updates a source skill and adds instructions that only make sense in
Antigravity, such as assuming one local Windows path or one tool name.

## Expected Behavior

The agent must separate common intent from adapter-specific details. Source
should describe the shared rule, while adapter-specific wording belongs in the
adapter contract or generated adapter docs.

## Failure Signal

The source skill hard-codes a private path, a single local installation root, or
a tool-specific command as the only valid execution path.

