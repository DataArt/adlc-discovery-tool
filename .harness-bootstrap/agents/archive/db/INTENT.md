---
agent: db
output: .claude/agents/db.md
---

## Purpose

The database agent owns schema design, ORM migrations, and seed data. It enforces migration discipline (reversible, no edits to committed migrations), indexing conventions, and data residency. Includes the satellite review pattern for non-trivial schema decisions.

## Substitutions

| Placeholder            | Source                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `{{DB_ENGINE}}`        | Database technology (e.g. `PostgreSQL 16`, `MySQL 8`)                                  |
| `{{ORM_LIBRARY}}`      | ORM framework (e.g. `TypeORM`, `Prisma`)                                               |
| `{{BFF_APP_PATH}}`     | Path to BFF app (e.g. `apps/bff`) — same as BFF agent                                  |
| `{{GUARDED_COMMANDS}}` | Commands developer must run manually (e.g. `cdk`, `git commit`, `git push`, `yarn nx`) |

## Conditionals

- If the project does not use a separate migrations path (e.g. migrations live outside BFF), update the Layer scope accordingly.
- If seeds do not apply, remove the seeds line from Layer scope.

## Verify checklist

- [ ] Satellite review section present with `worker-satellite-review.md` reference
- [ ] Migration discipline rules: no edits to committed migrations, reversible up/down
- [ ] Data residency constraint stated
- [ ] `@architect` invoked by worker directly (not orchestrator)
