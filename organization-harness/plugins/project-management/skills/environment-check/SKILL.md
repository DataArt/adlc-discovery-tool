---
name: environment-check
description: 'Verify actual workflow prerequisites, access, and execution capabilities without modifying resources.'
---

# Environment Check

Read [operating principles](references/operating-principles.md) before executing.

## Workflow

1. Read [plugin configuration](references/plugin-config.json). Identify intended workflows and distinguish required from optional capabilities for this run.
2. Inventory the active surface (Work, Codex or other), filesystem availability, connector tools, project scope, specialist delegation and scheduler capabilities. Do not assume feature parity.
3. Use approved minimal read-only probes against the intended project. Do not read unrelated private resources. Report authentication failures separately from authorization failures.
4. Return a table of each workflow, required capability, status (verified/missing/unknown), evidence and next action. Mark ready, limited or blocked per workflow. A manual-input workflow can be ready without a connector.
5. If setup changes are needed, offer the relevant procedure but do not modify configuration, external resources or schedules in this check.
