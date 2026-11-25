---
name: onboarding
description: Run or resume Business Analysis setup, reconnect a workplace app, configure specialist agents or recurring meeting-notes or requirements-review jobs, rerun an environment check, or explain which skill to use.
---

# Business Analysis onboarding

Use the request to choose between the full walkthrough and a single step. On first launch, “get started”, or “run full setup”, begin the walkthrough immediately. For a named step, including a rerun, go directly to its procedure and finish with that step’s result.

## Full walkthrough

Identify the host and any project the user has named. Resolve an outstanding app connection before asking for a project or space. Request one target at a time when a scoped check needs it. Walk through these stages in order, presenting one action at a time:

1. [Connect workplace apps](references/connections.md). Read the [app manifest](../../.app.json), verify available services, and guide the user through each outstanding connection in chat.
2. [Set up specialist agents](references/agents.md). Show the roles available for this project and offer installation or Skip. Check existing definitions before applying approved changes.
3. [Set up recurring jobs](references/jobs.md). Offer daily meeting notes, hourly Zoom meeting notes and the weekly requirements review for configuration or Skip. Check for an existing schedule and obtain approval for the exact task before creating or changing it.
4. [Check the environment](references/environment-check.md). Assess workflow readiness using the resulting configuration and current scoped evidence. Report unsupported capabilities, skipped steps and usable manual inputs in the [readiness report](assets/readiness-report.md).

Advance after each stage completes, is skipped, or is unavailable. During an active walkthrough, interpret Done, Retry and Skip in the context of the current action. Skip on one connector moves to the next connector. A request to skip an entire stage moves to the next stage. On pause, identify the next unfinished step. On resume, use conversation progress and current host evidence. In a new chat, recheck what can be observed and ask about prior choices only when needed.

## Direct requests and reruns

| Request                                                           | Route                                                                                                      |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| “Reconnect Teams” or “recheck Jira for this project”              | Use the connection procedure for that source only. Refresh tool state and run a fresh scoped read.         |
| “Show available agents” or “rerun agent setup”                    | Use the specialist procedure. Compare the selected roles with current definitions before offering changes. |
| “Preview, dry-run or schedule meeting notes or the weekly review” | Use the job procedure for the requested action. A preview ends with the proposal.                          |
| “Run env-check again” or “can this workflow run here?”            | Use the environment check. Refresh the relevant read-only evidence.                                        |
| “Where did setup stop?”                                           | Summarize known results, outstanding items and the next step.                                              |
| “What can this plugin do?”                                        | Answer from the [skill guide](references/skill-guide.md).                                                  |

A targeted request during a walkthrough can be completed independently. Keep the walkthrough position available for “resume setup”. A request to start over begins at stage one and checks existing connections, role files and schedules before offering changes.
