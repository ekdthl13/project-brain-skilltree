# Why Project Brain Skilltree Exists

Most AI prompt collections and custom skills are optimized for a single agent. While this works initially, it breaks down when developers try to use the same workflows across multiple AI companions (such as Antigravity/Gemini, Codex, and Claude Code).

Project Brain Skilltree solves this problem by separating the **canonical source** from the **runtime execution files**, treating agent skills as versioned and validated software packages.

---

## The Problems We Address

1. **Tool-Specific Skill Drift**
   When you maintain multiple copies of the same prompt instruction for different AI tools, they eventually drift. A change made to improve Codex behavior is often missing from Antigravity/Gemini, leading to inconsistent outputs.

2. **Adapter & Layout Mismatch**
   Different AI engines require different layouts, case conventions, or folder structures. For example, Codex may require lowercase hyphenated slugs, while Antigravity/Gemini uses original capitalization. Maintaining these mappings manually is tedious and error-prone.

3. **Accidental Overwrites & Silent Loss**
   Default agent updates or direct folder copies can easily overwrite your local skill customisations. Without a backup and merge mechanism, there is no way to audit what changed or roll back safely.

4. **Supply Chain & Validation Gaps**
   Prompt files are code. If a skill includes private absolute paths, secret keys, broken local markdown links, or conflicting completing criteria, it will fail silently during execution.

---

## The Solution: A Compiled Skill Pipeline

Project Brain Skilltree introduces a compiler-style approach to AI prompt engineering:

```text
                  ┌──────────────────────────┐
                  │ Human Source of Truth    │
                  │ (source/ - Capitalized)   │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │ Unified Manifest Catalog │
                  │ (catalog/skills.yaml)    │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │   Validation & Testing   │
                  │   (npm run check / CI)   │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │   Generators & Linkers   │
                  │ (tools/build-adapters.js)│
                  └────────────┬─────────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
         [Antigravity]      [Codex]      [Claude Code]
```

*   **Canonical Source (`source/`)**: The only folder where humans edit skills.
*   **Unified Catalog (`catalog/skills.yaml`)**: Tracks stable IDs, versions, and categories.
*   **Quality Gate (`npm run check`)**: Runs automated checks for link integrity, file sizes, and Unicode anomalies before deployment.
*   **Adapter Generation (`adapters/`)**: Machine-generated and formatted skill packages tailored for each tool.
*   **Backup-Aware Installer**: An installer that backs up only conflicting managed files and preserves unrelated user skills.

---

## Who is this for?

*   **Multi-Agent Developers**: Engineers who run different AI tools (such as Gemini in the IDE, Codex in terminal sessions, and Claude Code for debugging) on the same projects and want them to share identical operating context.
*   **Team Context Syncing**: Teams that want to version-control their agent workflow guidelines in Git, enabling new developers (or new agent sessions) to instantly read the project state.
*   **Durable Operators**: Operators who prefer file-based workspace memory (`_context.md`, `DECISION_LOG.md`) over transient, ephemeral chat history.
