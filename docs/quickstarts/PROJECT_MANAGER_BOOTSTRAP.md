# Quickstart 2: Project Manager Spine Bootstrap

This guide details how to bootstrap a robust, file-based project control center (Spine) using the `총괄매니저` (Project Manager) skill to maintain session continuity across multiple agent chats.

---

## 1. Purpose
Enable a clean, context-aware handoff between different AI sessions. By maintaining a structured, local "spine" of text files, any incoming AI agent can instantly understand the history, decisions, and current queue of the project.

## 2. Required Setup & Prerequisites
- Install target adapter (for example, Antigravity/Gemini, Codex, or Claude Code) into your agent configuration directory using:
  ```bash
  node tools/install-adapter.js <target> <destination_path>
  ```
- Verify that the installed adapter exposes the project manager skill:
  - Antigravity/Gemini: `총괄매니저`
  - Codex/Claude Code: `project-manager`

## 3. Active Skills Involved
- **`총괄매니저`**: The governing context coordinator that parses task trees, logs design decisions, and prepares next-session prompts for clean handoffs.

---

## 4. Step-by-Step Workflow & Prompt Examples

### Step 1: Trigger Spine Bootstrap
Instruct the agent to initialize a new project workspace.
> **Prompt**:
> "총괄매니저 스킬을 시작해 줘. 현재 디렉토리에 새로운 AI 블로그 콘텐츠 기획 툴 개발을 위한 프로젝트 척추(Spine) 파일들을 초기화해 줘."

The agent will read its `총괄매니저` rules and initialize the following files in your workspace root:
- `GEMINI.md` / `AGENTS.md`: Project identity, operating rules, and agent-specific entry instructions.
- `_context.md`: Current state, recent work, and near-term focus.
- `PROJECT_TASKS.md`: The active TODO task queue and completed milestones.
- `DECISION_LOG.md`: Chronological log of critical design and architectural choices.
- `_order.md`: The active task sheet containing instructions for the current session.

### Step 2: Write your First Order (`_order.md`)
Open `_order.md` in your workspace and define the task you want the next agent or subagent to perform:
```markdown
# Current Order: Build database migrations

## Goal
Create Supabase SQL migrations for tables matching `posts` and `keywords`.

## Rules
- Use lowercase table names.
- Include foreign key relations.
```

### Step 3: Run Task and Record Decisions
Perform the task or let the coding agent execute it. When critical decisions are made (such as choosing UUID over serial IDs), record it in `DECISION_LOG.md`:
```markdown
### 2026-05-27: Supabase post schema primary key choice
- **Decision**: Choose UUID v4 as the primary key for the `posts` table.
- **Rationale**: Prevents ID exposure and simplifies distributed syncing in the future.
```

### Step 4: Perform Handoff (Generate Next Session Prompt)
When your session ends, ask the agent to summarize and prepare the handoff prompt.
> **Prompt**:
> "총괄매니저 정리를 시작해 줘. Supabase 테이블 생성이 완료되었으니 PROJECT_TASKS.md를 갱신하고, 다음 AI 세션이 이어서 작업할 수 있도록 Next Session Prompt를 작성해 줘."

- **Updated Files**: `PROJECT_TASKS.md` (active queue updated, Completed Queue added, Next Session Prompt generated at the bottom).

---

## 5. Success Criteria (Verification Gates)
The workflow is successful when:
1. `_context.md` is populated with correct stack details and goals.
2. `PROJECT_TASKS.md` successfully tracks outstanding tasks (`[ ]`) and completed ones (`[x]`).
3. `DECISION_LOG.md` lists at least one design decision with rationale.
4. The generated `Next Session Prompt` in `PROJECT_TASKS.md` correctly summarizes the current state and next recommended actions.

## 6. Next Steps
Move to coding phase. Once your code edits are complete, verify the quality using **Quickstart 3: Pre-Release Launch Check & Audit**.

## 7. Important Warnings & Safety Rules
> [!WARNING]
> **Source-of-Truth Enforcement**:
> Never edit generated adapters under `adapters/` directly. 
> If you need to refine the instructions for `총괄매니저`, edit the canonical source files under `source/` (for example, [source/총괄매니저/SKILL.md](../../source/총괄매니저/SKILL.md)), run `npm run build:adapters`, and reinstall.
