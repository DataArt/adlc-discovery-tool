# Solution Architecture

Architecture design, review, technology selection and estimation.

## Skills

- `solution-design` – Develop a justified solution architecture from business and technical requirements. Use for HLD, LLD or architecture decisions.
- `architecture-review` – Review an existing or proposed architecture for gaps, risks and design quality. Use before design sign-off or modernization.
- `effort-estimation` – Create transparent engineering effort estimates and work breakdowns. Use for planning or presales estimation.
- `technology-selection` – Compare technology candidates against requirements and constraints. Use for technology evaluation or architecture decisions.

All skills are starter drafts; validate with representative scenarios before adoption.

## Setup and recurring jobs (v0.2.0)

Use the plugin setup action or invoke `onboarding`. `build.config.json` defines default connector requirements; `agents/` and `jobs/` contain draft specialist and recurring job definitions. These are not automatically registered. See the bundled setup skills. Generated shared skill copies must be refreshed with `tooling/manage.py sync` from the monorepo.
