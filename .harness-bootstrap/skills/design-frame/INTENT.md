---
skill: design-frame
output: .claude/skills/design-frame/SKILL.md
---

## Purpose

Phase 1 of the design lifecycle. Fetches the Jira ticket, assigns it, proposes requirements (evaluation criteria) the developer didn't think of, confirms the problem/boundaries/constraints, and saves `design/00 Frame.md` as the single source of ticket context for all subsequent phases. Requirements become the evaluation criteria rows in the Requirements × Options matrix during Elaborate.

## Substitutions

| Placeholder                          | Source                       | Notes                                      |
| ------------------------------------ | ---------------------------- | ------------------------------------------ |
| `{{PROJECT_KEY}}`                    | Q5 — ticket prefix           | Replaces `AIFD` in Jira project references |
| `{{JIRA_TRANSITION_START_PROGRESS}}` | Developer confirms from Jira | Transition ID for "Start Progress"         |

## Conditionals

- If Q5 is "none": remove Jira assignment/transition step (Step 2) entirely; keep ticket summary fetch only

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Story folder glob uses `*{TICKET}*/**` wildcard, not `[{TICKET}]*`
- [ ] Fresh-start note: glob returns nothing → create folder directly
- [ ] Step 1b branch gate present before any file writes (STOP for confirmation)
- [ ] Step 3 writes file and applies write-confirm pattern before developer review
- [ ] Proposed requirements include GDPR, observability, rollback as example gap types
- [ ] Proposed requirements labelled `[proposed]` so developer can accept/reject
- [ ] Note present that requirements become evaluation criteria rows in Elaborate matrix
- [ ] NFR path reads active version from README.md (not hardcoded)
- [ ] Report.md created with 5-phase tracker on first run
- [ ] Step 6 (Do → Report → Commit) uses wait-for-confirmation pattern
- [ ] No literal `AIFD` used as project key
