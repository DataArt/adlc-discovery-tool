---
skill: design-decide
output: .claude/skills/design-decide/SKILL.md
---

## Purpose

Runs the Decide phase: reads Explore output, presents options and recommendation, resolves open questions one at a time, produces `02 Decide.md`, and updates `Report.md`.

## Substitutions

| Placeholder       | Source             | Notes                              |
| ----------------- | ------------------ | ---------------------------------- |
| `{{PROJECT_KEY}}` | Q5 — ticket prefix | Replaces `ND` in ticket references |

## Conditionals

None.

## Verify checklist

- [ ] Story folder glob uses `*<TICKET>*` wildcard, never `[<TICKET>]*`
- [ ] Step 3 stops after each option question — not batched
- [ ] Step 4 stops after each open question — not batched
- [ ] Template reference is `.claude/skills/design/decide-template.md`
- [ ] No literal `ND` used as project key
