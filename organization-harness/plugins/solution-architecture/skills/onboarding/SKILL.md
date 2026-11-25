---
name: onboarding
description: 'Guide plugin setup, connector verification, optional specialist registration and recurring job configuration.'
---

# Onboarding

Read [operating principles](references/operating-principles.md) before executing.

## Intent

Establish what the installed plugin can actually execute in the current environment.

## Workflow

1. Read [plugin configuration](references/plugin-config.json). Identify the host, project, approved account and intended use cases. Treat configured requirements as defaults; the user may choose a smaller scope.
2. Follow the bundled [connector setup procedure](references/procedures/connector-setup.md) and [environment check](references/procedures/environment-check.md). Discover available tools before proposing a connection; verify each relevant project resource with a minimal read-only call.
3. Offer optional specialist registration using [agent setup](references/procedures/agent-setup.md). Do not write configuration without explicit approval. On cloud surfaces report unsupported registration and offer generic subagents or sequential assessment.
4. Offer optional scheduled workflows using [job setup](references/procedures/job-setup.md). Do not schedule anything by default.
5. Report readiness per workflow, evidence, blockers, available alternatives and next steps. Distinguish installed, authenticated, authorized and verified.

Never request secrets in chat. Do not infer authorization from tool names. Do not perform external writes or register scheduled jobs without explicit approval. Setup is repeatable and must not create duplicate jobs or overwrite local customization. The bundled procedures can be used even when sibling skill invocation is unavailable; use the matching sibling skill when supported.

Resolve all paths in bundled procedure copies relative to this onboarding skill root, not the procedures subdirectory.
