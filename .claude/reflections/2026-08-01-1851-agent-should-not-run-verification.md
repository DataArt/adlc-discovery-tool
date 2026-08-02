---
date: 2026-08-01 18:51
author: Anton Merkulov
ticket: ADLC-000
task: Implementing giscus comments widget for VitePress docs site (Step 3 — SPA-navigation reactivity)
status: pending-triage
skill_candidate: yes
skill_hint: During /dev-implement, the agent should present verification commands (typecheck/lint/build/test) to the developer to run themselves rather than running them proactively via Bash — even when the plan's verification section doesn't explicitly say "developer runs this."
---

## What went well

Nothing noted.

## What went wrong

Throughout Step 2 and into Step 3 of implementing the giscus widget, the agent repeatedly ran `yarn nx run site:typecheck` / `site:lint` / `site:build` itself via Bash to verify changes, instead of asking the developer to run them. The developer had to interrupt/reject the tool call twice and explicitly say "don't run those commands, ask me to run them."

## Insight

Even when a plan step's "Verification" section reads like a checklist the agent could execute itself (commands with expected output), the developer wants to be the one running verification commands in their own terminal — likely to stay in the loop on what's actually happening, catch things live, and control the pace. This applies broadly to build/typecheck/lint/test commands during implementation, not just this one ticket. The agent should default to presenting the exact command and asking the developer to run it and paste output, rather than reaching for Bash proactively — reserve self-run Bash verification for cases where the developer has explicitly delegated that (e.g. asked the agent to "just check" something) or for read-only/inspection commands that aren't part of the plan's formal verification gate.
