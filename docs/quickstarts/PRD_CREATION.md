# Quickstart 1: AI-Driven PRD Creation Workflow

This guide details how to turn a raw product idea into a highly structured, machine-readable Product Requirements Document (PRD) using the `오피스아워` (Office Hours) and `PRD생성` (PRD Generator) skills.

---

## 1. Purpose
Turn ambiguous, high-level feature or application ideas into a precise, actionable PRD that downstream AI agents or human developers can implement without losing intent.

## 2. Required Setup & Prerequisites
Before executing this workflow, you must have built and installed one of the portable skills adapters into your agent's configuration directory.
- **Prerequisites**: 
  - Install target adapter (for example, Antigravity/Gemini, Codex, or Claude Code) into your agent configuration directory using:
    ```bash
    node tools/install-adapter.js <target> <destination_path>
    ```
  - Verify that the installed adapter exposes the relevant skill folders:
    - Antigravity/Gemini: `오피스아워`, `PRD생성`
    - Codex/Claude Code: `office-hours`, `prd-generator`

## 3. Active Skills Involved
- **`오피스아워`**: Conducts a structured discovery session to extract hidden assumptions, project constraints, and user value parameters.
- **`PRD생성`**: Compiles the discovered context into a JTBD (Jobs-To-Be-Done) structured specifications document with YAML frontmatter.

---

## 4. Step-by-Step Workflow & Prompt Examples

### Step 1: Trigger Office Hours (`오피스아워`)
Start a session with your agent using the following trigger phrase:
> **Prompt**:
> "오피스아워를 시작해 줘. 1인 창업가를 위한 AI 블로그 콘텐츠 자동 기획 툴 아이디어가 있는데, 비즈니스 아이디어를 기획서 수준으로 발전시키고 싶어."

The agent will load the `오피스아워` skill, analyze the request, and ask you a series of targeted questions to resolve ambiguity (target audience, technical scope, integration limits, and core value).

### Step 2: Answer the Interview
Answer the agent's questions as thoroughly as possible.
> **Prompt**:
> "1. 대상 고객은 SEO 노출이 급한 중소기업 마케터야.
>  2. 기술 스택은 Node.js 및 Gemini 1.5 Pro API를 직접 사용하려고 해.
>  3. 가장 중요한 핵심 가치는 키워드 리서치 결과를 토대로 한 번의 클릭으로 한 달 치 블로그 콘텐츠 캘린더를 생성하는 거야."

### Step 3: Extract the Brief
Upon receiving your input, the agent will compile the session details and generate a project brief file.
- **Generated File**: `PROJECT_BRIEF.md` (saved at your local project workspace).
- **Verify**: Open `PROJECT_BRIEF.md` to ensure it captures all design decisions.

### Step 4: Generate the PRD (`PRD생성`)
Now, direct the agent to generate the formal PRD using the brief as its source of truth.
> **Prompt**:
> "PRD생성 스킬을 사용해서, 방금 만든 PROJECT_BRIEF.md를 기반으로 PRD.md를 작성해 줘. 기계가 해석할 수 있도록 YAML 메타데이터와 Mermaid 다이어그램을 꼭 포함해 줘."

- **Generated File**: `PRD.md` (saved at your local project workspace).

---

## 5. Success Criteria (Verification Gates)
The workflow is successful when:
1. `PROJECT_BRIEF.md` contains clear goals, target users, and constraints.
2. `PRD.md` is generated with correct frontmatter headers, User Stories, JTBD analysis, Out-of-Scope limits, and at least one Mermaid flow diagram.
3. Your project validation command passes cleanly. In this repository, use `npm run check`.

## 6. Next Steps
Once your `PRD.md` is ready, transition into execution by invoking **Quickstart 2: Project Manager Spine Bootstrap** to set up your project task checklist.

## 7. Important Warnings & Safety Rules
> [!WARNING]
> **Source-of-Truth Enforcement**:
> Never edit generated adapters under `adapters/` directly. 
> If you need to refine the instructions for `오피스아워` or `PRD생성`, edit their canonical source files under `source/` (for example, [source/PRD생성/SKILL.md](../../source/PRD생성/SKILL.md)), run `npm run build:adapters`, and reinstall.
