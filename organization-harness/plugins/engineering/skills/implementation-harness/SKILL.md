---
name: implementation-harness
description: 'Route implementation work to the existing Artisyn Implementation Harness. Use when a governed implementation workflow is requested.'
---

# Implementation Harness

## Operating principles

Read [operating principles](references/operating-principles.md) before executing. This skill is a starter draft, not an approved organizational policy.

## Required context

Task intent, repository context and installed Artisyn version if available.

## Workflow

1. Check whether the existing Artisyn Implementation Harness is available.
2. If available, invoke its documented entry point according to the installed version; do not guess commands or bypass its gates.
3. If unavailable, explain the dependency and point to the upstream project; do not substitute a new implementation workflow.
4. Record the handoff status and any unresolved dependency.

## Expected output

Handoff status and next action; implementation deliverables are owned by the upstream harness.

## Quality gate

This is an integration placeholder, not a copy or replacement of the existing harness.

See [upstream integration](references/upstream.md) for dependency details.
