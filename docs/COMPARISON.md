# Comparison

Project Brain Skilltree borrows useful ideas from existing agent skill systems while solving a different problem.

## Superpowers-Style Skills

Strengths:
- Strong discipline workflows.
- Active pressure against rationalization.
- Test-driven process documentation.
- Concise trigger-oriented skills.

Project Brain adds:
- A full project operating model.
- Durable file-based session memory.
- Role boundaries (Manager, Worker, Inspector, Launch-gate).
- Generated multi-agent adapters.
- Canonical source and drift prevention.

Best fit:
- High-pressure software engineering tasks requiring rigorous step-by-step validation.

Trade-offs:
- Requires developers to strictly follow a specific flow.

---

## Harness-Style Skills

Strengths:
- Domain-specific operational workflows.
- Practical assistant instructions for repeated tasks.
- Clear applied use cases.

Project Brain adds:
- Central router and system constitution.
- Adapter contracts for multiple agents.
- Explicit quality gate scripts.
- Pressure scenarios as first-class repo artifacts.
- Security checks for context supply-chain risks.

Best fit:
- Projects built around a fixed set of execution procedures and checklists.

Trade-offs:
- Can become rigid when adapted to multi-agent environments.

---

## Gstack-Style Skills

Strengths:
- Configuration-driven prompts.
- Clean templates with clear placeholders.
- Easy import and export workflow.

Project Brain adds:
- Multi-file operational session memory (`_context.md`, `_order.md`, `DECISION_LOG.md`).
- Automated multi-agent compilation/generation pipeline.
- Validation and static quality gate checking.

Best fit:
- Projects that benefit from quick modular setups where configuration files define runtime instructions.

Trade-offs:
- Less native support for multi-model session handoffs.

---

## Generic Prompt Collections

Strengths:
- Minimal learning curve.
- Extremely lightweight and simple to understand.
- Independent of any tooling or runtime dependencies.

Project Brain adds:
- Strict version control and CI pipeline integration.
- Automated code sanity checks, link verification, and secret detection.
- Unified orchestration guidelines.

Best fit:
- One-off tasks or initial drafts that do not require session-to-session continuity.

Trade-offs:
- Lack of validation, high risk of drift, and no agent-specific adaptation.

---

## Project Brain Skilltree Summary

Best fit:
- Projects requiring continuity across multiple sessions.
- Content and product operations with multiple artifacts.
- Mixed agent usage across Antigravity/Gemini, Codex, and Claude Code.
- Workflows where audits, launch checks, and decision logs must survive chat resets.

Trade-offs:
- Larger than minimal skill packs.
- Requires catalog and adapter maintenance.
- Expects users to treat skills as versioned operational assets.

## Design Principle

The goal is not to replace every other skill system. The goal is to provide a canonical operating spine that can absorb useful skills while preserving source of truth, memory, validation, and multi-agent portability.
