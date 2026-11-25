# Organization Harness – repository instructions

This repository contains provider-neutral process skills and plugin packaging. It does not contain customer projects.

- Keep each plugin self-contained; do not depend on paths outside its package at runtime.
- Keep skill descriptions specific, workflows intent-oriented and approval gates explicit.
- Update shared standards centrally and run `python3 tooling/manage.py sync` to refresh bundled copies.
- Run `python3 tooling/manage.py validate` before changes are merged.
- Add or refine evaluation cases alongside skill changes. Structural checks are not behavioral evaluations.
- Preserve the upstream Implementation Harness integration boundary.
- Do not commit customer data, secrets or personal execution artifacts.

## Shared components

Edit canonical shared skills, shared agents, domain agents, job templates and build configs. Run `python3 tooling/manage.py sync` to regenerate bundled shared skills before validation. Never edit generated shared skill directories directly. Native plugin onboarding is supported; job templates and plugin-root agents are repository conventions and require explicit setup. No automatic registration or permission escalation.
