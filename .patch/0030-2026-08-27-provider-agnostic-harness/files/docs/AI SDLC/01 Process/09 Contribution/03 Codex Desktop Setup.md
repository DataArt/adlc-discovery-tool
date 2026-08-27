---
aside: false
---

# Codex Desktop Setup

_Getting a non-technical team member from a cold laptop to running `$discovery` in Codex and opening a PR — no IDE or prior git experience required._

## Prerequisites

| Tool                | Account                             | Download                      |
| ------------------- | ----------------------------------- | ----------------------------- |
| Git                 | https://github.com/signup           | https://git-scm.com/downloads |
| ChatGPT desktop app | Your organization’s ChatGPT account | https://chatgpt.com/download  |

Codex runs inside the ChatGPT desktop app. OpenAI’s current desktop quickstart is: install the app, sign in, then open a folder so Codex can use its files and project context. See the [official OpenAI desktop app guide](https://learn.chatgpt.com/docs/app).

## Env setup

1. Clone the repo and move into it:

   ```bash
   git clone https://github.com/[[GITHUB_ORG]]/[[GITHUB_REPO]].git
   cd [[GITHUB_REPO]]
   ```

2. Run the setup script for your OS — it installs Node (via nvm), enables Yarn via corepack, offers to install and authenticate the GitHub CLI, and installs workspace dependencies:

   ```bash
   # macOS
   bash scripts/setup/setup-mac.sh
   ```

   ```powershell
   # Windows — open PowerShell with "Run as Administrator" first;
   # nvm-windows needs elevation to create its Node version symlink.
   powershell -ExecutionPolicy Bypass -File scripts/setup/setup-windows.ps1
   ```

3. If the engagement uses AWS, GitHub, or Atlassian tools through MCP, complete [Engineering Guide — MCP Setup](/Engineering%20Guide/06%20MCP%20Setup.md) before opening Codex.

## Tool setup

1. Open the ChatGPT desktop app and sign in.
2. Open **Codex**.
3. Choose **Open folder** and select the `[[GITHUB_REPO]]` folder cloned above.
4. Confirm the chat is running locally against that folder, then start prompting.

The repository supplies Codex with the same canonical engagement behavior as Claude through provider-native generated files:

| Generated path       | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `AGENTS.md`          | Project instructions, conventions, and workflow routing. |
| `.agents/skills/`    | Codex-native skills, including `$discovery`.             |
| `.codex/agents/`     | Codex subagent definitions in TOML.                      |
| `.codex/config.toml` | MCP server configuration.                                |

These files are already generated and committed to the repository. Contributors do not need to generate them during setup. If the harness itself changes, maintainers edit the canonical files under `.agent/` and regenerate the provider projections.

## Contribution guide

Once the project folder is open:

| Action           | Why                               | How                                                        | Example                                              |
| ---------------- | --------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `$discovery`     | Guided flow for the engagement.   | Name the skill and add the current context.                | `$discovery — we’re preparing for the Gate 1 review` |
| Free-form prompt | Anything outside a formal stage.  | Describe the outcome you need.                             | “What’s our current status?”                         |
| Preview changes  | See edits on the live site first. | Ask Codex to start the local preview and give you the URL. | “Show me the site with these changes.”               |
| Create a PR      | Lands changes for review.         | Ask Codex to create a branch, commit, push, and open a PR. | “Open a PR for this.”                                |

Codex asks for approval when an action crosses its configured permission boundary. Review the exact command and target before approving it. `git push` happens only after explicit per-action approval; guarded deployment commands are presented for a developer to run and are never executed by Codex.

## Use cases

The discovery engagement moves through Initiation → Investigate → Gate Review → Solution → Solution Approval → Roadmap → Final Sign-off, per [03 How the Engagement Runs](../03%20How%20the%20Engagement%20Runs.md).

| Situation you’re in                                   | Example prompt                                                                                 |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Kicking off the engagement                            | `$discovery — let’s run the kickoff`                                                           |
| Just finished a client workshop, have a transcript    | `$discovery — here’s today’s workshop transcript; turn it into Notes and update Current State` |
| Enough evidence gathered, need to name the root cause | `$discovery — what’s the underlying problem, and which SDLC domain does it affect?`            |
| A problem is diagnosed, need it framed as a goal      | `$discovery — turn this problem into a Solution Goal`                                          |
| Preparing for a steering meeting                      | `$discovery — prepare the agenda and recap deck for the Gate 1 review`                         |
| Checking where things stand                           | `$discovery — what’s our current status?`                                                      |
| Wrapping up the engagement                            | `$discovery — let’s run the final sign-off`                                                    |

Use `$discovery` plus a sentence of context. The orchestrator resolves the current stage; if you are unsure, ask: “Where are we in the engagement?”

→ See [Team Collaboration](./01%20Team%20Collaboration.md) for how this fits the team workflow, and [Branching Policy](./04%20Branching%20Policy.md) before starting the first change.
