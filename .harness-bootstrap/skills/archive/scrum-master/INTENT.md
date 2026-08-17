# scrum-master — Bootstrap Intent

## Purpose

Jira workflow owner agent for a single project. Routes all Jira reads and writes from dev and design lifecycle skills — no skill calls Jira MCP tools directly. Enforces ticket hygiene (readiness before In Progress, remaining-estimate-zero before Done), ticket template structure (Story/Task/Bug description skeletons), and label discipline (Feature + Stream + Version on every ticket).

## Substitutions

| Placeholder                       | What to put here                                                          | Source                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{PROJECT_KEY}}`                 | Jira project key (e.g. `SP`, `ENG`, `PLAT`)                               | Q: "What is the Jira project key?"                                                                                                                             |
| `{{JIRA_URL}}`                    | Base URL of the Jira instance (e.g. `https://acme.atlassian.net`)         | Q: "What is the Jira URL?"                                                                                                                                     |
| `{{CONFLUENCE_URL}}`              | Base URL of the Confluence space (e.g. `https://acme.atlassian.net/wiki`) | Derived from `{{JIRA_URL}}` + `/wiki`, or ask if different                                                                                                     |
| `{{JIRA_TRANSITION_IN_PROGRESS}}` | Transition ID for "In Progress" state                                     | Ask: "What are the Jira workflow transition IDs? Run `jira_get_transitions` on any ticket to find them."                                                       |
| `{{JIRA_TRANSITION_TESTING}}`     | Transition ID for "Testing" / "In Review" state                           | Same lookup as above                                                                                                                                           |
| `{{JIRA_TRANSITION_DONE}}`        | Transition ID for "Done" / "Closed" state                                 | Same lookup as above                                                                                                                                           |
| `{{JIRA_TRANSITION_ON_HOLD}}`     | Transition ID for "On Hold" / "Blocked" state                             | Same lookup as above                                                                                                                                           |
| `{{FEATURE_LABELS}}`              | Backtick-separated list of project feature labels                         | Q: "What feature/module labels does this project use in Jira? (e.g. `UserProfile` · `Billing` · `Auth`)"                                                       |
| `{{BUSINESS_LINE_LABELS}}`        | Optional business-line labels (e.g. `` `B2B` · `B2C` ``)                  | Q: "Does this project distinguish business lines in Jira labels? If so, list them." — if no, replace with `_(none — project does not split by business line)_` |

## Conditionals

- **No Testing state**: if the project's workflow goes straight from In Progress to Done (no Testing/Review state), remove the Testing row from the lifecycle table and set `{{JIRA_TRANSITION_TESTING}}` to `N/A`.
- **No business lines**: if `{{BUSINESS_LINE_LABELS}}` is not applicable, replace the Business line section with a one-liner noting it is not used.
- **No version labels**: if the project does not track release versions in labels, replace the Version labels section accordingly.

## Verify checklist

After deploying this agent to a new project, confirm:

1. **Transition IDs correct** — run `Start {PROJECT_KEY}-XX` on a test ticket and verify it moves to In Progress (not an error or wrong state).
2. **Readiness check fires** — attempt to start a ticket with a missing field (e.g. no Original Estimate) and confirm the agent blocks and reports the missing field rather than transitioning.
3. **Label taxonomy matches** — confirm that the Feature and Business line labels listed in TEMPLATE.md appear in the project's Jira Labels Matrix (or update the agent body to match what's actually there).
