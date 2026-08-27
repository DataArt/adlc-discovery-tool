# MCP Setup

_Connect Claude or Codex to AWS, GitHub, and Atlassian via Model Context Protocol._

---

## Prerequisites

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) — the AWS MCP proxy runs via `uvx`:

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

## AWS

| Variable      | Description                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| `AWS_PROFILE` | Named profile in `~/.aws/credentials` or `~/.aws/config` (SSO). Default: `unqlo-demo`. |
| `AWS_REGION`  | AWS region for MCP calls. Default: `eu-west-1`.                                        |

Verify your profile is working:

```bash
aws sts get-caller-identity --profile "$AWS_PROFILE"
```

A valid JSON response with your `Account` and `Arn` confirms the AWS MCP server will authenticate correctly.

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

## GitHub

| Variable                       | Description                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Generate at [github.com/settings/tokens](https://github.com/settings/tokens) — scopes: `repo`, `read:org`, `read:user` |

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

All three servers should show as connected: `aws-mcp`, `github`, and `mcp-atlassian` (if Atlassian vars are set).

---

→ See `01 Conventions.md` for commit format and branch naming.
→ See `04 AI Coding Tool Compatibility.md` for slash commands and MCP-powered agent roles.
