---
name: code-review
description: 'Review code changes for correctness, maintainability, security and test coverage. Use for a pull request or patch review.'
---

# Code Review

## Operating principles

Read [operating principles](references/operating-principles.md) before executing. This skill is a starter draft, not an approved organizational policy.

## Required context

Diff, relevant repository context, task intent and test evidence.

## Workflow

1. Establish change intent and inspect the relevant diff and context.
2. Identify concrete defects, regressions and missing tests.
3. Prioritize findings by impact and cite file/line evidence.
4. Report tests performed and verification limits; avoid unsolicited code changes.

## Expected output

Actionable review findings and verification summary.

## Quality gate

Do not approve or merge a change without explicit authorization.

## Optional specialist delegation

When supported and appropriate, delegate independent assessments to code-reviewer and test-specialist. Confirm authorization and scope first; use generic subagents with equivalent role instructions or sequential assessments if custom agents are unavailable. Consolidate evidence and conflicting findings in the main session. Do not claim parallel execution if it did not occur. Human approval remains required for consequential decisions.
