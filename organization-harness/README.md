# Organization Harness

A draft monorepo for reusable organizational AI processes. Projects supply context; skills encode methodology; plugins distribute capabilities; agents execute within approved boundaries.

## Catalogue

| Plugin                | Skills                                                                        |
| --------------------- | ----------------------------------------------------------------------------- |
| Business analysis     | Meeting notes, requirements analysis, story generation                        |
| Solution architecture | Solution design, architecture review, effort estimation, technology selection |
| Engineering           | Implementation Harness integration, code review, migration                    |
| Project management    | Status report, risk assessment, flow check                                    |

## Layout

```text
organization-harness/
├── .agents/plugins/marketplace.json
├── .github/workflows/validate.yml
├── AGENTS.md
├── README.md
├── plugins/
│   ├── business-analysis/
│   ├── solution-architecture/
│   ├── engineering/
│   └── project-management/
├── shared/                 # authoring standards, templates, knowledge
├── evals/                  # draft behavioral scenarios
└── tooling/                # synchronization, validation and packaging
```

Each plugin contains a portable `plugin.json` and `skills/<name>/SKILL.md`. Required runtime resources live inside each skill. Shared standards are copied into skill packages so installation does not require the monorepo.

## Plugin anatomy (v0.2.0)

```text
plugins/solution-architecture/
├── plugin.json              # native portable manifest + onboarding entry point
├── build.config.json        # repository convention, not a platform manifest
├── skills/                  # domain skills + generated shared skill copies
├── agents/                  # canonical domain Codex TOML definitions
└── jobs/                    # canonical domain schedule templates
shared/
├── skills/                  # onboarding, connector-setup, environment-check,
│                            # agent-setup, job-setup
├── agents/                  # researcher, reviewer, documentation-specialist
├── standards/
├── templates/
└── knowledge/
schemas/job.schema.json       # repository-owned contract
```

Shared skills are bundled into all four plugins, together with their own configuration and relevant agent/job definitions. No extra Common plugin is required. The generated skill directories are checked in and validated against their sources so Git marketplace installations do not need to run a build. Edit canonical sources rather than generated copies.

Use native plugin setup to run onboarding or explicitly invoke `onboarding`. Connector authorization is user-managed; no MCP endpoints or secrets are preconfigured. Agent setup and job setup are optional and require approval. See [setup and execution](docs/setup-and-execution.md).

## Quick start

Requires Python 3.11+; no dependencies, Node or Nx needed initially.

```bash
python3 tooling/manage.py sync
python3 tooling/manage.py validate
python3 tooling/manage.py package
```

For local testing, open the extracted repository as a local project in the ChatGPT desktop app, add its folder as a plugin marketplace if needed, restart the app and select **Organization Harness** in the Plugins Directory. Install a domain plugin and try its skills in a new conversation. The repository-local catalogue uses relative sources.

For Git distribution, create a private repository and push the scaffold. Add its Git URL as a marketplace, select the desired branch or tag, and leave sparse paths empty initially. If using sparse checkout, include both `.agents/plugins` and `plugins` because entries refer to local plugin directories. Verify installation and skill discovery with your desktop version. No remote repository is created by this scaffold.

See [distribution](docs/distribution.md) for organization sharing, releases and optional remote source generation.

## Authoring loop

Edit a skill, update its scenarios, run the validation script, test it in an actual agent session and have a domain owner review it. When shared skills, standards, agents, jobs or build configuration change, run `python3 tooling/manage.py sync` and commit the generated copies.

## Status

Version 0.2.0 is a draft. The skills are starter workflows, not approved policies. The engineering plugin's Implementation Harness skill is only an integration entry point; it does not bundle the existing upstream harness. No real organizational connectors, credentials or MCP servers are configured. Structural validation is included; live installation and behavioral evaluation remain to be performed.
