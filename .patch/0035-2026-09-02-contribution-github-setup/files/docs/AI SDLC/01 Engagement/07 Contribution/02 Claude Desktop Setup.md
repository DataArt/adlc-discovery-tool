---
aside: false
---

# Claude Desktop Setup

_Getting a non-technical team member from a cold laptop to running `/discovery` and opening a PR — no IDE, no prior git experience required._

## Prerequisites

| Tool           | Account                   | Download                      |
| -------------- | ------------------------- | ----------------------------- |
| Git            | https://github.com/signup | https://git-scm.com/downloads |
| Claude Desktop | https://claude.ai/login   | https://claude.ai/download    |

Once you have a GitHub account, share your username with the engagement lead or repo admin so they can grant you access to the repo — without that, cloning fails regardless of which method you use.

## Setup

1. Clone the repo — see [GitHub Repo Setup](./04%20GitHub%20Repo%20Setup.md) (Option A, GitHub Desktop) for the no-terminal walkthrough.

2. Open Claude Desktop, switch to the **Code** tab, and set the working directory to the `[[GITHUB_REPO]]` folder you just cloned.

   ![Claude Desktop — Code tab and working directory picker](/images/process/claude-desktop-code-tab.png)

   _Red arrows: switch to the **Code** tab (top), then set the working directory to the cloned repo folder (bottom bar)._

3. Ask Claude to set up the environment for you — no separate terminal needed:

   ```
   Run scripts/setup/setup.sh to set up this project.
   ```

   This one script works on both Mac and Windows — it detects the OS itself and hands off to the right platform script, so there's no guessing which one to name. Claude asks for approval before running it — approve it. It installs Node (via nvm), enables Yarn via corepack, offers to install and authenticate the GitHub CLI, and installs workspace dependencies.

4. Start prompting — see [Quick Walkthrough](./06%20Quick%20Walkthrough.md) for four prompts to try first.

This is what matters: the skills and conventions that drive the engagement (`.claude/skills/`, `CLAUDE.md`) live inside that folder. Once it's set as the working directory, Claude sees them exactly as Claude Code does.

## Contribution guide

Once the project is open:

| Action           | Why                               | How                                                                     | Example                                                |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| `/discovery`     | Guided flow for the engagement.   | Type it and follow the prompts.                                         | `/discovery` — "we're preparing for the Gate 1 review" |
| Free-form prompt | Anything outside a formal stage.  | Just describe what you want.                                            | "What's our current status?"                           |
| Preview changes  | See edits on the live site first. | Ask Claude to show you.                                                 | "Show me the site with these changes."                 |
| Create a PR      | Lands changes for review.         | Ask Claude, then click **Create PR** in the bottom bar when it appears. | "Open a PR for this."                                  |

![Claude Desktop — free-form status prompt, plus the commit and Create PR bar](/images/process/claude-desktop-status-and-pr.png)

_Red arrows: the project and session in the sidebar (left), and a free-form status prompt (right) — the bottom bar shows the commit box and Create PR button once there are changes to land._

![Claude Desktop — "show me the site with these changes" opens a live local preview next to the chat](/images/process/claude-desktop-preview-site.png)

_Red arrows: a free-form preview prompt (top), and the **Open** button that launches the live local preview next to the chat (bottom)._

![Claude Desktop — /create-pr, and the Create PR button once changes are ready](/images/process/claude-desktop-create-pr.png)

_Red arrow: once your branch has changes, click **Create PR** in the bottom bar — Claude pushes the branch and opens the PR for you, no terminal needed._

## Use cases

The discovery engagement moves through a fixed sequence — Initiation → Investigate (loop) → Gate Review → Solution → Solution Approval → Roadmap → Final Sign-off, per [03 How the Engagement Runs](../03%20Process/03%20How%20the%20Engagement%20Runs.md). Here's what each situation looks like as a prompt:

| Situation you're in                                   | Example prompt                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Kicking off the engagement                            | `/discovery` — "let's run the kickoff"                                                           |
| Just finished a client workshop, have a transcript    | `/discovery` — "here's today's workshop transcript, turn it into Notes and update Current State" |
| Enough evidence gathered, need to name the root cause | `/discovery` — "what's the underlying problem here, and which SDLC domain does it affect?"       |
| A problem is diagnosed, need it framed as a goal      | `/discovery` — "turn this problem into a Solution Goal"                                          |
| Preparing for a steering meeting                      | `/discovery` — "prepare the agenda and recap deck for the Gate 1 review"                         |
| Checking where things stand                           | `/discovery` — "what's our current status?"                                                      |
| Wrapping up the engagement                            | `/discovery` — "let's run the final sign-off"                                                    |

One command, always: `/discovery` plus a sentence of context. Claude figures out the stage — you don't need to remember anything else. If you're unsure what stage you're in, just ask: "Where are we in the engagement?"

→ See [Team Collaboration](./01%20Team%20Collaboration.md) for how this fits the rest of the team's workflow.
