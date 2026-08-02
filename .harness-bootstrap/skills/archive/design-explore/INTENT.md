---
skill: design-explore
output: .claude/skills/design-explore/SKILL.md
---

## Purpose

Runs the Explore phase: creates the design folder, sets up Jira, creates `00 Brief.md`, initialises `Report.md`, reads Target Architecture, validates context with developer, delegates research to `@architect`, and saves `01 Explore.md`.

## Substitutions

| Placeholder                          | Source                       | Notes                              |
| ------------------------------------ | ---------------------------- | ---------------------------------- |
| `{{PROJECT_KEY}}`                    | Q5 — ticket prefix           | Replaces `ND` in ticket references |
| `{{JIRA_TRANSITION_START_PROGRESS}}` | Developer confirms from Jira | Transition ID for "Start Progress" |

## Conditionals

- If Q5 is "none": remove Step 2 (Jira setup)

## Verify checklist

- [ ] Story folder glob uses `*<TICKET>*` wildcard, never `[<TICKET>]*`
- [ ] Step 7 explicitly says `@architect` must NOT write files — "return output only"
- [ ] Step 7 has a stop after architect returns — developer approves before writing `01 Explore.md`
- [ ] Templates are referenced by name: `brief-template.md`, `report-template.md`, `explore-template.md`
- [ ] No literal `ND` used as project key
