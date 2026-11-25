---
name: migration
description: 'Plan incremental software modernization or migration with traceability and validation. Use for migration discovery and planning.'
---

# Migration

## Operating principles

Read [operating principles](references/operating-principles.md) before executing. This skill is a starter draft, not an approved organizational policy.

## Required context

Source system, target objectives, dependencies and constraints.

## Workflow

1. Inventory source components, behavior and dependencies.
2. Identify migration slices, invariants and test strategy.
3. Define sequencing, coexistence, cutover and rollback considerations.
4. Record risks, validation criteria and approval points.

## Expected output

Migration plan, slice backlog, validation approach and risks.

## Quality gate

Planning only; do not migrate production or modify repositories without authorization.

## Optional specialist delegation

When supported and appropriate, delegate independent assessments to migration-specialist and test-specialist. Confirm authorization and scope first; use generic subagents with equivalent role instructions or sequential assessments if custom agents are unavailable. Consolidate evidence and conflicting findings in the main session. Do not claim parallel execution if it did not occur. Human approval remains required for consequential decisions.
