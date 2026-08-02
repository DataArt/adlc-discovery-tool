---
skill: agents/web
output: .claude/agents/{{WEB_APP_NAME}}.md
---

## Purpose

Specialist agent for the frontend layer. Enforces accessibility (WCAG 2.1 AA), component structure, BFF-only data fetching, and framework conventions. Includes satellite review protocol for non-trivial steps.

## Substitutions

| Placeholder                 | Source                     | Notes                                                    |
| --------------------------- | -------------------------- | -------------------------------------------------------- |
| `{{WEB_APP_NAME}}`          | Q3 — Web app name          | e.g. `web`. Used in NX target commands and commit scopes |
| `{{WEB_APP_PATH}}`          | Q3 — Web app path          | e.g. `apps/web/`                                         |
| `{{FRONTEND_FRAMEWORK}}`    | Q2 — frontend framework    | e.g. `React`, `Vue`, `Svelte`                            |
| `{{FRONTEND_BUILD_TOOL}}`   | Q2 — build tool            | e.g. `Vite`, `webpack`, `Turbopack`                      |
| `{{FRONTEND_BUILD_CONFIG}}` | Q2 — build config filename | e.g. `vite.config.ts`, `webpack.config.js`               |
| `{{GUARDED_COMMANDS}}`      | Q7 — guarded commands      | e.g. `` `cdk`, `git commit`, `git push`, `yarn nx` ``    |

## Conditionals

- If not TypeScript: adjust strict mode rule to the project's type system
- If no WCAG requirement: remove WCAG rule or replace with the project's accessibility target
- If no dedicated BFF: adjust data fetching rule to the project's API layer

## Verify checklist

- [ ] Six sections present: Role, Layer scope, What to enforce, Satellite review, What never to do
- [ ] `{{WEB_APP_NAME}}` resolved — no literal placeholder remaining in NX commands or commit scopes
- [ ] `{{WEB_APP_PATH}}` resolved — no literal placeholder remaining in path references
- [ ] `{{FRONTEND_BUILD_CONFIG}}` resolved — no literal `vite.config.ts` or `webpack.config.js` remaining
- [ ] Satellite review section references `.claude/skills/worker-satellite-review.md`
- [ ] Satellite review section specifies that the worker invokes @architect directly (not the orchestrator)
- [ ] Guarded commands match Q7
