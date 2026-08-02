---
skill: design-gate
output: .claude/skills/design-gate/SKILL.md
---

## Purpose

Runs the Gate phase: requests approver email, instructs draft MR creation, records the MR URL in `Report.md`, and ends the session. Does not auto-advance to Publish.

## Substitutions

| Placeholder       | Source             | Notes                              |
| ----------------- | ------------------ | ---------------------------------- |
| `{{PROJECT_KEY}}` | Q5 — ticket prefix | Replaces `ND` in ticket references |

## Conditionals

None.

## Verify checklist

- [ ] Story folder glob uses `*<TICKET>*` wildcard, never `[<TICKET>]*`
- [ ] "This skill ends here. Do not proceed to Publish." is explicit
- [ ] Two stops: one for approver email, one for MR URL
- [ ] No literal `ND` used as project key
