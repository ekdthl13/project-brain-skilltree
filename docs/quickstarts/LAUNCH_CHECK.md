# Quickstart 3: Pre-Release Launch Check & Audit

This guide details how to perform a rigorous pre-release quality gate and code audit using the `암행어사` (Inspector) and `출시점검` (Launch Check) skills before deploying your application to production.

---

## 1. Purpose
Minimize deployment risks, find hidden security leaks (API keys, private paths), verify code hygiene, score SEO, and run runtime smoke tests to make a formal release decision.

## 2. Required Setup & Prerequisites
- Install target adapter (for example, Antigravity/Gemini, Codex, or Claude Code) into your agent configuration directory using:
  ```bash
  node tools/install-adapter.js <target> <destination_path>
  ```
- Verify that the installed adapter exposes the relevant skill folders:
  - Antigravity/Gemini: `암행어사`, `출시점검`
  - Codex/Claude Code: `inspector`, `launch-check`

## 3. Active Skills Involved
- **`암행어사`**: Actively scans for security vulnerabilities, memory leaks, secret keys, absolute paths, and logical flaws from a hostile, adversarial perspective.
- **`출시점검`**: Evaluates the codebase against a formal checklist, calculates a numeric scorecard (out of 100), and records runtime test results.

---

## 4. Step-by-Step Workflow & Prompt Examples

### Step 1: Perform Hostile Audit (`암행어사`)
Before compiling a release build, invoke the adversarial inspector to review your codebase.
> **Prompt**:
> "암행어사 스킬을 시작해 줘. 방금 구현을 마친 AI 블로그 콘텐츠 기획 툴 폴더의 취약점과 보안 리스크, 하드코딩된 API 키 유출 여부를 적대적 관점에서 날카롭게 감찰해 줘."

The agent will scan the files, find any secrets, private paths, or loose validation gates, and output an audit report.
- **Generated File**: `_audit_YYYY-MM-DD.md` (saved at your local project workspace).
- **Verify**: Read the report and patch any critical issues found (e.g., move a hardcoded API key to `.env`).

### Step 2: Trigger Release Quality Check (`출시점검`)
Once the issues from the audit are resolved, trigger the formal launch checker to evaluate compliance.
> **Prompt**:
> "출시점검 스킬을 시작해 줘. 지금 코드베이스 상태가 배포 가능한 수준인지 7대 항목(보안, 성능, SEO, 안정성 등)에 맞춰 점검하고 점수를 계산해 줘."

The agent will run through its scorecard criteria and generate the launch check sheet.
- **Generated File**: `_launch_check.md` (saved at your local project workspace).

### Step 3: Run Runtime Smoke Tests
The agent will prompt you to run a smoke test command to verify that the app actually boots up.
> **Prompt**:
> "npm run build 및 npm run start를 돌려보고, localhost:3000에 정상 접속되는지 브라우저에서 스모크 테스트 결과를 확인한 뒤 이 점검 문서에 병합해 줘."

Confirm the outcome (e.g., server boots in 120ms, returns HTTP 200). The agent updates the `_launch_check.md` file.

### Step 4: Final Score Card and Deploy Decision
The agent calculates the final score.
- **Score >= 95**: Approved for production release!
- **Score < 95**: Deferred. The agent will outline a roadmap detailing what must be fixed to cross the threshold.

---

## 5. Success Criteria (Verification Gates)
The workflow is successful when:
1. `_audit_YYYY-MM-DD.md` is created and lists resolved or acknowledged risks.
2. `_launch_check.md` is populated with a complete 7-pillar score breakdown.
3. Smoke-test commands are executed and their outcomes are recorded.
4. The final release status (Approved / Deferred) is clearly declared.

## 6. Next Steps
Once the launch check reports green (>=95), review the release procedure in [docs/RELEASE.md](../RELEASE.md) before tagging or publishing anything.

## 7. Important Warnings & Safety Rules
> [!WARNING]
> **Source-of-Truth Enforcement**:
> Never edit generated adapters under `adapters/` directly. 
> If you need to refine the instructions for `암행어사` or `출시점검`, edit the canonical source files under `source/` (for example, [source/출시점검/SKILL.md](../../source/출시점검/SKILL.md)), run `npm run build:adapters`, and reinstall.
