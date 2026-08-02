---
skill: design-solution
output: .claude/skills/design-solution/SKILL.md
---

## Purpose

Phase 4 of the design lifecycle — the clean deliverable. Runs an interactive specification session with the developer, drafts the four `solution/` files (Architecture, Design, Stack, Efforts) with write-confirm (write to disk → IDE review STOP) after each, delegates effort estimation to the developer, gates on a `/design-review` WAF pass, then updates Report.md and suggests commit. Applies the Certainty principle: no rationale, rejected options, or open questions from `02 Elaborate.md` carry over.

## Substitutions

None. This skill has no project-specific values.

## Conditionals

- If Q11 is "None" (no WAF): remove Step 7b (design review gate) and adjust Step 7 to proceed directly to Step 8

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Step 1b specification session has an explicit STOP before the first area question
- [ ] Steps 2, 3, 4 each apply write-confirm pattern: write to disk first, then "Review in your IDE — any corrections?"
- [ ] Step 5 Efforts: WBS written by AI, Estimate column left blank for developer to fill
- [ ] Step 5 Efforts: STOP asking developer to fill estimates before proceeding
- [ ] Step 5 Efforts: AI computes total after developer confirms estimates filled in
- [ ] Step 2b references `pattern-satellite-review.md` and `pattern-design-architect-review.md`
- [ ] Step 6 appendix is appended to `solution/Architecture.md` (not a separate file)
- [ ] Step 7b invokes `/design-review {TICKET} elaborate` (not the old standalone review)
- [ ] Step 7b reiterate table maps each gap type to a named Phase N, Step M
- [ ] Step 8 (Do → Report → Commit) uses wait-for-confirmation pattern
- [ ] Certainty principle callout present in the intro
