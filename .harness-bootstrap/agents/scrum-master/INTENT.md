---
skill: agents/scrum-master
output: .claude/agents/scrum-master.md
---

## Purpose

Jira workflow agent that centralises all issue reads, transitions, assignments, and ticket creation for the dev and design lifecycles. Skills delegate all Jira operations here instead of calling MCP tools inline — keeps Jira logic in one place and makes it easy to adapt when transition IDs or project keys change.

## Substitutions

| Placeholder                       | Source                   | Notes                                                                         |
| --------------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| `{{PROJECT_KEY}}`                 | Q1 — Jira project key    | e.g. `SP`, `PROJ`. Used in issue keys, error messages, and operation examples |
| `{{JIRA_URL}}`                    | Q8 — Jira base URL       | e.g. `https://myorg.atlassian.net`                                            |
| `{{CONFLUENCE_URL}}`              | Q8 — Confluence base URL | e.g. `https://myorg.atlassian.net/wiki`                                       |
| `{{JIRA_TRANSITION_IN_PROGRESS}}` | Q9 — Jira transition IDs | Numeric ID for "In Progress" / "Work is started" in the project's workflow    |
| `{{JIRA_TRANSITION_TESTING}}`     | Q9 — Jira transition IDs | Numeric ID for "Testing" / "In Review" — used when PR is submitted            |
| `{{JIRA_TRANSITION_DONE}}`        | Q9 — Jira transition IDs | Numeric ID for "Done" / "Closed"                                              |
| `{{JIRA_TRANSITION_ON_HOLD}}`     | Q9 — Jira transition IDs | Numeric ID for "On Hold" / "Blocked"                                          |

To find transition IDs: in Jira, open any issue in the project → Transitions API: `GET /rest/api/3/issue/{key}/transitions`.

## Conditionals

- **Jira Server / Data Center** (not Cloud): replace `accountId` assignment notes with `name`/`key` field — email-based lookup fails silently on Server.
- **No Confluence**: remove the Confluence URL line and the "return Confluence page URLs" note from the Fetch operation.
- **Custom label taxonomy**: update the label table to match the project's JQL conventions.
- **Different issue types**: if the project uses `Bug`, `Epic`, or custom types instead of `Task`/`Story`, update the Create operations accordingly.

## Verify checklist

- [ ] `{{PROJECT_KEY}}` resolved — no literal placeholder in issue key examples or error messages
- [ ] `{{JIRA_URL}}` and `{{CONFLUENCE_URL}}` resolved — valid URLs with no trailing slash
- [ ] All four transition IDs filled — verify against the project's actual Jira workflow (not assumed)
- [ ] Lifecycle → Jira state table matches the project's actual workflow states
- [ ] `dev-plan/SKILL.md` Step 2 delegates to `@scrum-master` (not inline MCP calls)
- [ ] `dev-plan/SKILL.md` Step 4 delegates fetch to `@scrum-master`
- [ ] `dev-document/SKILL.md` Step 5 delegates TD creation to `@scrum-master`
- [ ] `dev-document/SKILL.md` Step 7 invokes `@scrum-master` to transition Done
- [ ] `design-frame/SKILL.md` Step 2 delegates start + fetch to `@scrum-master`
- [ ] `design-publish/SKILL.md` Step 12 delegates ticket creation to `@scrum-master`
