# Security Policy

## Supported Versions

Security fixes target the current `main` branch and the latest tagged stable
release. Older tags remain public baselines but are not maintained as separate
security branches unless an explicit recovery decision is made.

## Reporting a Problem

Open a private security advisory or contact the maintainer before filing a
public issue if a report includes private prompts, credentials, internal paths,
or exploit details.

## Context Supply-Chain Rules

This repo treats agent context as executable influence. Do not merge changes
that introduce:

- credentials, API keys, tokens, private keys, or copied secrets
- local personal home-directory paths
- hidden Unicode control or tag characters
- instructions that ask agents to bypass validation
- adapter-only edits that are not generated from `source/`
- remote code execution instructions without explicit user approval gates

Run before publishing or installing into a real agent directory:

```bash
npm run check
```
