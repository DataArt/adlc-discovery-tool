# MCP Setup

_Connect Claude or Codex to Atlassian via Model Context Protocol._

No GitHub MCP connector is configured either — GitHub operations go through the `gh` CLI
directly, not a credentialed MCP server.

No AWS MCP connector is configured here: agent sessions never hold a live AWS SSO session.
Deploys happen only via CI after merge (OIDC-assumed roles, see `apps/infra/lib/ci-stack.ts`)
— see `09 Harness Security.md` for why. If you need to inspect live AWS state yourself, use
the `aws` CLI directly in your own shell, outside the agent session.

---

## Prerequisites

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) — the Atlassian MCP server runs via `uvx`:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## 1. Create your local `.env`

Copy the example file (the original is gitignored — never commit `.env`):

```bash
cp .env.example .env
```

Then fill in credentials for each tool below.

---

## Atlassian

| Variable                   | Description                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `CONFLUENCE_URL`           | Atlassian Cloud base URL, e.g. `https://your-org.atlassian.net/wiki`                                                |
| `CONFLUENCE_USERNAME`      | Your Atlassian account email                                                                                        |
| `CONFLUENCE_API_TOKEN`     | Generate at [id.atlassian.com → Security → API tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `CONFLUENCE_SPACES_FILTER` | Comma-separated space keys to expose, e.g. `TS`                                                                     |
| `JIRA_URL`                 | Atlassian Cloud base URL, e.g. `https://your-org.atlassian.net`                                                     |
| `JIRA_USERNAME`            | Your Atlassian account email                                                                                        |
| `JIRA_API_TOKEN`           | Same token as Confluence                                                                                            |
| `JIRA_PROJECTS_FILTER`     | Comma-separated project keys to expose, e.g. `SP`                                                                   |

---

## 2. Generate provider configuration

`.harness/mcp.json` is canonical. Generate `.mcp.json` for Claude and `.codex/config.toml` for Codex:

```bash
yarn harness:generate
```

## 3. Load env vars and start your coding agent

Source the file in your current shell session, then launch:

```bash
source .env && claude
# or
source .env && codex
```

Each tool picks up its generated provider-native configuration and starts the configured MCP servers.

---

## 4. Verify connections

```bash
claude mcp list
# or use the Codex MCP listing command in your installed Codex version
```

Both servers should show as connected: `github` and `mcp-atlassian` (if Atlassian vars are set).

---

→ See `01 Conventions.md` for commit format and branch naming.
→ See `04 AI Coding Tool Compatibility.md` for slash commands and MCP-powered agent roles.
