---
name: Design Frame Template
description: Template for 00 Frame.md — Phase 1 output that frames the problem, success criteria, and boundaries
type: reference
---

# <TICKET> — <title>

## Problem

<What is broken or missing — one paragraph. Why does this matter now.>

## Success

### Known ACs

<Acceptance criteria stated in the Jira ticket — cleaned up, verbatim in intent.>

- AC1: ...
- AC2: ...

### Proposed ACs

<ACs the developer didn't think of. Look for: edge cases, NFRs (performance, security, GDPR), operational concerns (observability, rollback), future-proofing constraints. Label each [proposed] so the developer can accept or reject.>

- [proposed] AC: ...
- [proposed] AC: ...

## Boundaries

**In scope:** <what this design covers>

**Out of scope:** <what is explicitly excluded>

## Constraints

<Known deadlines, linked issues, regulatory requirements, architectural constraints from the HLD that directly bound this decision.>

## Sizing _(omit if not applicable)_

| Dimension           | Estimate | Source          |
| ------------------- | -------- | --------------- |
| MAU / users         | ...      | ...             |
| Request volume      | ...      | ...             |
| Data volume         | ...      | ...             |
| Relevant NFR target | ...      | Requirements.md |

## Links

- Jira: <TICKET URL>
- Related issues: <linked Jira tickets if any>
- Confluence: <linked pages if any>
