---
name: job-setup
description: 'Configure approved recurring jobs using bundled templates and the native scheduler where available.'
---

# Job Setup

Read [operating principles](references/operating-principles.md) before executing.

## Workflow

1. Read [plugin configuration](references/plugin-config.json) and list `references/jobs/*.json`. Check native scheduler availability and existing tasks; match by template ID, project and owner when available.
2. Ask for missing context and confirm cadence, timezone, destination, identity, skill availability, connector scope, local/cloud execution and notification behavior. Never guess IDs or persist secrets in task prompts.
3. Run a read-only dry run with the selected skill where feasible. Distinguish actual evidence from untested dependencies. Report limitations, including local machine availability and differences in scheduler features.
4. Present the exact proposed durable task prompt, schedule, scope, permissions and output. Obtain explicit approval before creating or changing a task. Do not overwrite unrelated tasks or create duplicates when identity cannot be verified.
5. Use the native scheduling tool only if available; otherwise provide a copyable prompt and UI instructions, and mark the job as not registered. Map unsupported options explicitly rather than inventing features.
6. Read back the task ID and settings where supported. Explain pause/update/delete, and report actual registration and verification separately. Each recurring run must re-check access and avoid external writes.
