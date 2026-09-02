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

Once you have a GitHub account, share your username with the engagement lead or repo admin so they can grant you access to the repo — without that, cloning fails regardless of which method you use.

## Setup

1. Clone the repo — see [GitHub Repo Setup](./04%20GitHub%20Repo%20Setup.md) (Option A, GitHub Desktop) for the no-terminal walkthrough.

2. Open the ChatGPT desktop app, sign in, and set it up to work against the cloned folder:

   1. Switch the top-left app dropdown from **ChatGPT** to **Codex**.

      ![ChatGPT desktop app — switching from ChatGPT to Codex](/images/process/codex-switch-to-codex.png)

      _Red arrow: the **Codex** entry in the app switcher._

   2. In the sidebar, click **+** next to **Projects**.

      ![Codex — Projects section with the add-project button](/images/process/codex-new-project-button.png)

      _Red arrow: **+** next to **Projects** — creates a new project._

   3. In **Create project**, give it a name and add the cloned `[[GITHUB_REPO]]` folder as a source folder, then click **Create project**.

      ![Codex — empty Create project dialog](/images/process/codex-create-project-empty.png)

   4. The project now appears in the sidebar, with the folder and branch shown in the chat bar.

      ![Codex — project open, with folder and branch chips in the chat bar](/images/process/codex-project-chat-context.png)

      _Red arrows: the project/folder chip and the current branch chip in the chat bar — confirm both before prompting._

3. Ask Codex to set up the environment for you — no separate terminal needed:

   ```
   Run scripts/setup/setup.sh to set up this project.
   ```

   This one script works on both Mac and Windows — it detects the OS itself and hands off to the right platform script, so there's no guessing which one to name. Codex asks for approval before running it — approve it. It installs Node (via nvm), enables Yarn via corepack, offers to install and authenticate the GitHub CLI, and installs workspace dependencies.

4. If the engagement uses AWS, GitHub, or Atlassian tools through MCP, complete [Engineering Guide — MCP Setup](/Engineering%20Guide/06%20MCP%20Setup.md) before continuing.
5. Confirm the chat is running locally against that folder, then start prompting — see [Quick Walkthrough](./06%20Quick%20Walkthrough.md) for four prompts to try first.

The repository supplies Codex with the same canonical engagement behavior as Claude through provider-native generated files:

| Generated path       | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `AGENTS.md`          | Project instructions, conventions, and workflow routing. |
| `.agents/skills/`    | Codex-native skills, including `$discovery`.             |
| `.codex/agents/`     | Codex subagent definitions in TOML.                      |
| `.codex/config.toml` | MCP server configuration.                                |

These files are already generated and committed to the repository. Contributors do not need to generate them during setup. If the harness itself changes, maintainers edit the canonical files under `.harness/` and regenerate the provider projections.

## Contribution guide

Once the project folder is open:

| Action           | Why                               | How                                                        | Example                                              |
| ---------------- | --------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `$discovery`     | Guided flow for the engagement.   | Name the skill and add the current context.                | `$discovery — we’re preparing for the Gate 1 review` |
| Free-form prompt | Anything outside a formal stage.  | Describe the outcome you need.                             | “What’s our current status?”                         |
| Preview changes  | See edits on the live site first. | Ask Codex to start the local preview and give you the URL. | “Show me the site with these changes.”               |
| Create a PR      | Lands changes for review.         | Ask Codex to create a branch, commit, push, and open a PR. | “Open a PR for this.”                                |

![Codex — free-form status prompt and response](/images/process/codex-status-prompt.png)

_A free-form prompt ("what is the engagement status? where we are?") answered directly from the repo's current state, ending with a next-step suggestion._

![Codex — "run the site" starts a local preview, shown next to the live browser view](/images/process/codex-run-site-preview.png)

_Red arrow: Codex reports the local preview URL after running the site — opening it shows the live docs site alongside the chat._

Codex asks for approval when an action crosses its configured permission boundary. Review the exact command and target before approving it. `git push` happens only after explicit per-action approval; guarded deployment commands are presented for a developer to run and are never executed by Codex.

## Use cases

The discovery engagement moves through Initiation → Investigate → Gate Review → Solution → Solution Approval → Roadmap → Final Sign-off, per [03 How the Engagement Runs](../03%20Process/03%20How%20the%20Engagement%20Runs.md).

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

→ See [Team Collaboration](./01%20Team%20Collaboration.md) for how this fits the team workflow, and [Branching Policy](./05%20Branching%20Policy.md) before starting the first change.
