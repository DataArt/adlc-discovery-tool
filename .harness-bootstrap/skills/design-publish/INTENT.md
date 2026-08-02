---
skill: design-publish
output: .claude/skills/design-publish/SKILL.md
---

## Purpose

Phase 5 of the design lifecycle. Two-entry-point skill: pre-gate (Steps 1–3) opens the draft MR and ends the session; post-approval (Steps 4–12) delegates HLD impact to `@architect`, applies updates, gates on architect review (max 2 passes, via `pattern-satellite-review.md`), updates Report.md, then branches on wrap-up (A: archive + tickets) vs dev-now (B: invoke /dev).

## Substitutions

| Placeholder       | Source             | Notes                                |
| ----------------- | ------------------ | ------------------------------------ |
| `{{PROJECT_KEY}}` | Q5 — ticket prefix | Used in Step 12 Jira ticket creation |

## Conditionals

- If Q5 is "none": remove Step 12 Jira ticket creation; keep archive and hand-off message only

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Step 1 skips to Step 4 if Report.md Gate already has a Draft MR URL
- [ ] Step 2 has two STOPs: one for approver name, one for PR URL — no `gh pr create` command
- [ ] Step 3 ends the session explicitly — "Do not proceed to Step 4 automatically"
- [ ] Step 4 concerns table maps each concern type to Phase N, Step M
- [ ] Step 5 `@architect` constraint: "Do not write or edit any files — return output only"
- [ ] Step 6 STOP after showing diff — developer confirms before architect review
- [ ] Step 7 applies `pattern-satellite-review.md` — max 2 architect review iterations before escalating to developer
- [ ] Step 9 A/B hand-off question has explicit STOP
- [ ] Step 10 archive runs directly (git mv auto-executed — not a user instruction)
- [ ] Step 11 commit message branches on A/B
- [ ] Step 12 option A appends `## Implementation Tickets` block to `design/Report.md`
- [ ] Step 12 option B invokes `/dev` — does not suggest returning to design-publish
- [ ] Certainty principle applied in Step 6 (no rationale or rejected options in HLD)
- [ ] No literal `AIFD` used as project key
