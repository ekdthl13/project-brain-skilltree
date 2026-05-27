# External User Quickstarts - Design Document

This document outlines the Table of Contents (TOC) and structural scenarios for three essential quickstarts. These walk outside users through immediately valuable workflows using the Project Brain Skilltree.

---

## Quickstart 1: AI-Driven PRD Creation Workflow
**Goal**: Walk a user through turning a raw idea into a robust, structured Product Requirements Document (PRD) using the `오피스아워` (Office Hours) and `PRD생성` (PRD Generator) skills in sequence.

### Table of Contents
- **1. Overview & Tool Flow**: Explaining the discovery loop from raw concept to structured PRD.
- **2. Prerequisites**: Ensuring the Gemini/Codex adapter is installed and active in the agent session.
- **3. Phase 1: Discovery with `오피스아워`**
  - Triggering the agent with: *"I want to start a new project for X."*
  - The recursive interview process: Addressing key target user groups and constraints.
  - Compiling and outputting the initial `PROJECT_BRIEF.md`.
- **4. Phase 2: Generating Specification with `PRD생성`**
  - Bootstrapping the PRD: Running `PRD생성` with `PROJECT_BRIEF.md` as input.
  - Structural alignment: Ensuring JTBD (Jobs-To-Be-Done) and YAML metadata are generated.
  - Reviewing and editing the generated `PRD.md`.
- **5. Next Steps**: How to transition this PRD directly into project tasks.

---

## Quickstart 2: Project Manager Spine Bootstrap
**Goal**: Teach a user how to initialize a file-based, multi-agent project control center using the `총괄매니저` (Project Manager) skill to preserve continuity across chat sessions.

### Table of Contents
- **1. What is the Project Spine?**: Introducing the 5-file protocol (`_context.md`, `DECISION_LOG.md`, `PROJECT_TASKS.md`, `_order.md`, `GEMINI.md`).
- **2. Prerequisites**: Standardizing workspaces for multi-agent support.
- **3. Step 1: Spinal Cord Initialization**
  - Triggering the bootstrap command with the project manager skill.
  - Automatically creating blank template spines for context and tasks.
- **4. Step 2: Routing the First Task (`_order.md`)**
  - Drafting clear boundaries and hand-offs.
  - Updating the active queue in `PROJECT_TASKS.md`.
- **5. Step 3: Recording Progress & Decisions**
  - Writing code modifications.
  - Appending key architectural choices to `DECISION_LOG.md`.
- **6. Step 4: Synchronizing and Handing Over**
  - Summarizing completed works.
  - Preparing the Next Session Prompt in `PROJECT_TASKS.md` for another agent or developer.

---

## Quickstart 3: Pre-Release Launch Check & Audit
**Goal**: Guide a user on how to run a rigorous pre-flight quality check and security audit on their codebase before going live, utilizing the `출시점검` (Launch Check) and `암행어사` (Inspector) skills.

### Table of Contents
- **1. The Two-Guard Defense**: Introducing the inspector (hostile critic) and the launch checker (formal gates).
- **2. Prerequisites**: Preparing the target code tree and verifying test paths.
- **3. Step 1: Performing Hostile Audit with `암행어사`**
  - Triggering the agent to find vulnerabilities, design bugs, and performance bottlenecks.
  - Generating and analyzing the audit report (`_audit_YYYY-MM-DD.md`).
- **4. Step 2: Running the Formal Scorecard with `출시점검`**
  - Triggering the release quality evaluation.
  - Self-scoring on the 7 core pillars (Security, Code Hygiene, SEO, etc.).
- **5. Step 3: Executing Smoke Tests**
  - Running lightweight runtime checks to verify basic functions.
  - Documenting test success or failure logs.
- **6. Step 4: Final Sign-off**
  - Generating the final `_launch_check.md` report.
  - Making the deploy/no-deploy decision.
