---
skill: agents/bff
output: .claude/agents/{{BFF_APP_NAME}}.md
---

## Purpose

Specialist agent for the backend-for-frontend layer. Enforces framework conventions, API documentation, service/controller separation, and p95 performance patterns. Includes satellite review protocol for non-trivial steps.

## Substitutions

| Placeholder               | Source                       | Notes                                                                              |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `{{BFF_APP_NAME}}`        | Q3 — BFF app name            | e.g. `bff`. Used in NX target commands and commit scopes                           |
| `{{BFF_APP_PATH}}`        | Q3 — BFF app path            | e.g. `apps/bff/`                                                                   |
| `{{BACKEND_FRAMEWORK}}`   | Q2 — backend framework       | e.g. `NestJS`, `Express`, `Fastify`                                                |
| `{{ORM_LIBRARY}}`         | Q2 — ORM/data-access library | e.g. `TypeORM`, `Prisma`, `Drizzle`                                                |
| `{{API_DOCS_DECORATORS}}` | Q2 — API docs library        | e.g. `@ApiOperation`, `@ApiResponse` for NestJS/Swagger; `JSDoc` for plain Express |
| `{{GUARDED_COMMANDS}}`    | Q7 — guarded commands        | e.g. `` `cdk`, `git commit`, `git push`, `yarn nx` ``                              |

## Conditionals

- If no ORM (raw SQL or query builder): adjust ORM reference to describe the data-access pattern used
- If no API docs library: replace decorator rule with "all endpoints must be documented in README or OpenAPI spec"
- If no specialist `db` agent: remove "Never write database migrations — that belongs to the `db` agent"

## Verify checklist

- [ ] Six sections present: Role, Layer scope, What to enforce, Satellite review, What never to do
- [ ] `{{BFF_APP_NAME}}` resolved — no literal placeholder remaining in NX commands or commit scopes
- [ ] `{{BFF_APP_PATH}}` resolved — no literal placeholder remaining in path references
- [ ] Satellite review section references `.claude/skills/worker-satellite-review.md`
- [ ] Satellite review section specifies that the worker invokes @architect directly (not the orchestrator)
- [ ] Guarded commands match Q7
