# ADLC Discovery Tool

A structured, evidence-led engagement tool: a DataArt-led AI SDLC discovery engagement for [[CLIENT_NAME]], diagnosing SDLC bottlenecks and designing a path to AI-first workflow adoption across the organisation.

This repository is the working surface for the engagement: it hosts the documentation site delivered to [[CLIENT_NAME]], the design sessions that produce engagement content, and the engineering harness that structures how the team works.

## Using this starter kit for a new client

If you're seeing literal `[[CLIENT_NAME]]` placeholders anywhere in this repo, it hasn't been bootstrapped yet. Run `/bootstrap-client` inside Claude Code — it walks through a short Q&A (client name, GitHub org/repo, Giscus setup) and then applies everything deterministically via a script, not free-text generation. See `STARTER-KIT-PLAN.md` for the full personalization rationale.

## What's here

| Path                              | Purpose                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `docs/AI SDLC/`                   | Engagement deliverables — problem-space analysis and solution recommendations |
| `docs/Target Architecture (HLD)/` | Architecture design for this platform                                         |
| `docs/Engineering Guide/`         | Conventions, AI workflow, and development guide                               |
| `apps/docs-web/`                  | VitePress documentation site                                                  |
| `apps/lambda-auth/`               | Lambda@Edge basic auth handler                                                |
| `apps/infra/`                     | AWS CDK infrastructure                                                        |
| `raw-artifacts/`                  | Source documents and reference materials                                      |

## Getting started

Copy the env file, fill in your credentials, then launch Claude Code with MCP servers active:

```bash
cp .env.example .env
# edit .env
source .env && claude
```

See `docs/Engineering Guide/06 MCP Setup.md` for the full credentials guide, or run `@onboarding` inside Claude Code for a guided walkthrough.

## Primary commands

| Command                    | When to use                                                                  |
| -------------------------- | ---------------------------------------------------------------------------- |
| `/design ADLC-XXX <topic>` | Start a new design session (workshop content, recommendations, architecture) |
| `/dev ADLC-XXX <task>`     | Implement a ticket (site changes, auth, infra)                               |
| `/where-we-are`            | Delivery gap report                                                          |
