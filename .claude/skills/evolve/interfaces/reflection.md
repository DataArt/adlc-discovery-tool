# Reflection interface

Persist frontmatter with `status: pending-triage`, `date` (`YYYY-MM-DD HH:MM`),
`author` (from `git config user.name`), and optional `ticket` (e.g. `ADLC-11`). The
body records the observation, its impact, source evidence or user attribution, and a
suggested direction only if one is known. Keep uncertainty explicit. Retain legacy
`skill_candidate`/`skill_hint` metadata when present; it is a hint, not an action
mandate.
