# Engineering

Engineering workflows and an integration entry point for the existing Implementation Harness.

## Skills

- `implementation-harness` – Route implementation work to the existing Artisyn Implementation Harness. Use when a governed implementation workflow is requested.
- `code-review` – Review code changes for correctness, maintainability, security and test coverage. Use for a pull request or patch review.
- `migration` – Plan incremental software modernization or migration with traceability and validation. Use for migration discovery and planning.

All skills are starter drafts; validate with representative scenarios before adoption.

## Setup and recurring jobs (v0.2.0)

Use the plugin setup action or invoke `onboarding`. `build.config.json` defines default connector requirements; `agents/` and `jobs/` contain draft specialist and recurring job definitions. These are not automatically registered. See the bundled setup skills. Generated shared skill copies must be refreshed with `tooling/manage.py sync` from the monorepo.
