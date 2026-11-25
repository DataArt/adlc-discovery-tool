---
name: connector-setup
description: 'Discover and guide installation or authorization of connectors required by a selected workflow.'
---

# Connector Setup

Read [operating principles](references/operating-principles.md) before executing.

## Workflow

1. Read [plugin configuration](references/plugin-config.json), then identify the selected workflows and minimum required capabilities. Inspect available native tools, plugins and MCP servers.
2. For each missing capability, read the corresponding guide in `references/connectors/`. Prefer organization-approved integrations. Ask the user to authorize through the host's secure UI; if unavailable, provide steps and report the blocker.
3. Confirm tenant, repository, space or project scope. Request least privilege and do not request tokens, passwords or client secrets in chat or committed files.
4. Make a minimal read-only request to the intended resource. Report verified scope or exact failure; do not change an issue, repository or document as a test.
5. Offer manual inputs for workflows that support them and document degraded capabilities. Never declare a connector verified just because it appears in the UI.
