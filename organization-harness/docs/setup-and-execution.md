# Setup and execution

## Installation and onboarding

Install a domain plugin from the marketplace. Use its setup action or invoke the bundled `onboarding` skill. The native `extensions.com.openai.onboardingSkill` field points to the packaged skill. Onboarding reads the generated plugin configuration and offers connector setup, environment checks, specialist registration and recurring jobs. Setup never creates jobs or modifies configuration without approval.

Connector requirements are illustrative defaults per workflow. Connectors must be available and authorized in the host; use approved integrations, verify project scope with read-only calls and allow manual input where useful. No connector endpoints, credentials or real organizational resources are supplied.

## Specialist agents

Domain agents are authored under `plugins/<domain>/agents/`; shared roles are authored under `shared/agents/`. The build bundles selected TOML definitions into the agent-setup and onboarding skill references. This is a repository convention, not a native plugin registration mechanism. All 15 unique roles have draft instructions. Model choice is inherited by default; `model_reasoning_effort = "high"` is an editable draft default.

Local Codex supports standalone custom agent definitions in `<project>/.codex/agents/` and `~/.codex/agents/`. Run agent-setup in a local project, preview changes and approve the scope. The skill should copy only approved files and preserve conflicts. Verify discovery in a fresh session. Cloud custom registration is not assumed; generic delegation or sequential role-based assessment is the fallback. Specialists inherit parent permissions, provider and MCP servers. Read-only role instructions do not enforce a security boundary. Configure actual access at the host level. Do not run tasks with write-capable credentials if read-only enforcement is required.

## Recurring jobs

The six templates under each domain's `jobs/` folder are examples, not active schedules. `schemas/job.schema.json` describes the repository convention. `job-setup` reads bundled templates, collects real scope, checks the scheduler and connectors, tests a read-only run where possible and requests explicit approval. It must use a native scheduler only when available. Otherwise it produces a copyable task prompt and reports that nothing was registered.

Example: in Project Management, invoke job-setup and select daily-flow-check. Confirm Jira project, GitHub repository, reporting window, destination, schedule and timezone. The proposed weekday 09:00 Europe/Madrid schedule is only a default; change it as needed. Approve the resulting task, then verify it in the native Scheduled view. Cloud/local execution and notification behavior depend on platform support; local-file tasks may need an awake computer and running application. Job templates do not enforce access restrictions; use approved read-only connectors and permissions. No job has been activated by this repository.

## Development

Use Python 3.11+ and run `python3 tooling/manage.py sync`, `validate`, and `package` (as separate commands). Generated shared skill directories are replaced during sync; never edit them directly. Agent and job templates are intentionally packaged both at the plugin root and as references in setup skills so each setup skill is self-contained. The setup procedures embedded in onboarding resolve reference paths relative to the onboarding skill root.

The validator checks generated copies, references, TOML required fields, job/skill linkage and timezone names; it is not a full JSON Schema or platform validator. Eval cases are scenarios only, not executed model tests. Live installation, custom-agent discovery, connector authorization and scheduler registration still need target-host smoke tests.

## Official references

- https://developers.openai.com/plugins/build/plugins
- https://learn.chatgpt.com/docs/agent-configuration/subagents
- https://learn.chatgpt.com/docs/automations
