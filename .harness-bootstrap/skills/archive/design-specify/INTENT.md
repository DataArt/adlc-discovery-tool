---
skill: design-specify
output: .claude/skills/design-specify/SKILL.md
---

## Purpose

Runs the Specify phase: creates `03 Specify.md` (working space), goes through each section with developer, reads HLD to build Architecture Impact table, creates `solution/` files from templates with certainty principle applied.

## Substitutions

| Placeholder       | Source             | Notes                              |
| ----------------- | ------------------ | ---------------------------------- |
| `{{PROJECT_KEY}}` | Q5 — ticket prefix | Replaces `ND` in ticket references |

## Conditionals

None.

## Verify checklist

- [ ] Story folder glob uses `*<TICKET>*` wildcard, never `[<TICKET>]*`
- [ ] Step 3 goes section-by-section with a stop after each section (not all at once)
- [ ] Step 5 certainty principle is stated: "settled, single-direction statements. Do not carry over open questions, rationale, or rejected alternatives"
- [ ] Solution templates are all four: `Architecture.md`, `Design.md`, `Stack.md`, `Efforts.md`
- [ ] Template references use `.claude/skills/design/` prefix
- [ ] No literal `ND` used as project key
