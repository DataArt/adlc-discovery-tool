---
name: agent-setup
description: 'Review and optionally register bundled specialist agents for a local Codex project.'
---

# Agent Setup

Read [operating principles](references/operating-principles.md) before executing.

## Workflow

1. Read [plugin configuration](references/plugin-config.json) and inventory `references/agents/*.toml`. Identify existing definitions in the target scope and confirm the host supports custom agents.
2. Prefer project scope `<project>/.codex/agents/`; personal scope `~/.codex/agents/` requires a separate explicit choice. Resolve the actual project and filesystem, not the installed plugin cache.
3. Preview files to add, identical files to skip, and conflicts to leave untouched. Explain that custom agents inherit the parent permissions, provider and MCP servers; role instructions are not security boundaries. Confirm the intended model settings (defaults inherit the host).
4. Only after approval copy new TOML files into the selected directory. Never overwrite a conflicting file without explicit approval of that exact change; offer a diff and backup first. Never edit unrelated config or broaden permissions.
5. Verify file contents and ask the user to start a fresh session if required. Verify agent discovery through actual available tools, and report installed versus verified separately.
6. On a cloud or unsupported host, do not simulate registration. Offer generic subagents with the supplied role instructions where supported; otherwise use sequential role-based analysis and label that fallback.
