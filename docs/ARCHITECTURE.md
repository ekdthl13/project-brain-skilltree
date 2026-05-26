# Architecture

Project Brain Skilltree has three layers.

## 1. Canonical Source

`source/` is the only hand-edited root. It contains:

- `CORE_PRINCIPLES.md`: governing rules
- `SKILL_INDEX.md`: router and system map
- `ORCHESTRATION.md`: multi-model operating loop and handoff protocol
- skill folders with `SKILL.md` and optional support files

The source keeps the original Antigravity-style Korean operating model intact.

## 2. Catalog

`catalog/skills.yaml` is YAML-compatible JSON. It maps each source skill folder
to stable adapter names, versions, categories, and trigger descriptions.

The catalog is the bridge between human-friendly source names and portable
agent-facing names.

## 3. Generated Adapters

`tools/build-adapters.js` creates installable targets:

- Antigravity adapter preserves the original folder names and source structure.
- Codex adapter uses stable lowercase hyphen slugs and `name`/`description`
  frontmatter only.
- Claude Code adapter follows the same portable skill package shape as Codex.
- Root system docs such as `ORCHESTRATION.md` are copied into every adapter.

Generated adapters are deleted and rebuilt on each run.

## Data Flow

```text
source/
  + catalog/skills.yaml
  -> tools/build-adapters.js
  -> adapters/{antigravity,codex,claude-code}/skills
  -> tools/validate-skilltree.js
  -> CI pass/fail
```

---

## Structural Refactoring Gates

To prevent breaking agent installers, SKILL_INDEX routing, and local adapter discovery, any structural change (merging, renaming, splitting, or directory restructuring) must satisfy the following checklist before pull requests are approved:

1. **Discovery Backwards Compatibility**:
   - Verify that all target editor environments (Antigravity, Codex, Claude Code) still automatically discover and load the skills from the new directory structure.
   - Do not nest skills into subdirectories (e.g., `source/core/` or `source/plugins/`) unless it is verified that the installer and editor scan paths recursively.
2. **Catalog and Trigger Sync**:
   - Ensure the `catalog/skills.yaml` entry is updated with correct relative `source` paths.
   - All trigger descriptions in the catalog must match the new trigger definitions in `SKILL.md` frontmatter.
3. **Routing Integrity**:
   - The primary router inside `SKILL_INDEX.md` must be updated with the correct relative paths to all altered skills.
   - Run `npm run check` and verify that the validation tool does not report broken links or orphaned router listings.
4. **Preservation and Dry-Run Check**:
   - Run `tools/install-adapter.test.js` to ensure the installation logic properly backs up, updates, or preserves files without creating stray directories.

