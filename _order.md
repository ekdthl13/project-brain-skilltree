# Worker Order

Status: Active playbook handoff.

## Current Handoff

Execute `_playbook.md` / `Worker Playbook #034`.

The work is a batch rollout:

1. Apply current adapters to local Codex, Antigravity current, Antigravity mirrors, and Claude installations.
2. Verify installed skill versions.
3. Run repo validation again.
4. Commit and push.
5. Prepare or create the v1.1.2 maintenance release only if the established release process is available.

## Guardrails

- Do not edit generated `adapters/` directly.
- Do not skip installed-version verification.
- Do not delete installer backups.
- Stop before commit/push/release if validation fails.
- Record results in `_playbook.md`.

