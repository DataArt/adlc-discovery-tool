---
skill: design-architect-review
output: .claude/skills/design-architect-review.md
---

## Purpose

A reference rule for delegating an optional `@architect` review after `solution/Architecture.md` is confirmed, before proceeding to `Design.md`. Defines scope rules (what to include and what to explicitly exclude), the prompt template, and the max-2-iteration loop. Referenced by `design-solution` (Step 2b).

## Substitutions

None. This skill has no project-specific values — the protocol is generic across all design lifecycles.

## Conditionals

None.

## Verify checklist

- [ ] Rules section present: "when to offer" (after Architecture.md confirmed, before Design.md)
- [ ] Scope rule: evaluate structural completeness, security, reliability — NOT HLD currency
- [ ] Explicit exclusion rule: tell `@architect` not to flag HLD documentation gaps
- [ ] Max 2 iterations rule present
- [ ] Prompt template included
- [ ] Why section explains both failure modes (late discovery + scope confusion)
