---
name: flow-check
description: 'Review delivery flow for blockers, stale pull requests, dependencies and emerging risks.'
---

# Flow Check

Read [operating principles](references/operating-principles.md) before executing.

## Workflow

1. Confirm project and repository scope, reporting window and team-specific stale thresholds. If thresholds are missing, state the proposed defaults (e.g. three business days without activity) rather than treating them as agreed policy.
2. Read permitted Jira issues and pull request metadata. Distinguish blocked status, inactivity and unresolved review requests; cite sources and timestamps.
3. If available, ask a delivery analyst and risk reviewer to assess independent evidence using read-only role instructions. Otherwise perform a sequential review and disclose it.
4. Consolidate blockers, dependencies, evidence, suggested next actions and missing data. Do not change issues, PRs, assignments or statuses. Do not attribute blame or infer performance from activity alone.
5. Report material findings or explicitly state no findings within verified scope. Do not claim absence of blockers when sources failed.
