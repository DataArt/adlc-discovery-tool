---
skill: design-research
output: .claude/skills/design-research/SKILL.md
---

## Purpose

Phase 2 of the design lifecycle. Reads `00 Frame.md`, validates context with the developer, delegates to `@architect` for a neutral 3–5 option analysis (no recommendation), classifies open questions by viability tier, persists triage results as an Assumptions block in `Report.md`, and saves `design/01 Research.md`. No judgment is made here — that is Phase 3's job.

## Substitutions

None. This skill has no project-specific values.

## Conditionals

None.

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] `@architect` explicitly told "Do not make a recommendation"
- [ ] `@architect` explicitly told "Do not write or edit any files — return output only"
- [ ] Context validation (Step 2b) has an explicit STOP before delegating to `@architect`
- [ ] Step 3b OQ triage STOP is a **distinct, separate prompt** — not bundled with option confirmation
- [ ] Step 3b references `.claude/skills/design/pattern-design-oq-triage.md`
- [ ] Step 3b persists triage result as `## Assumptions` block appended to `Report.md`
- [ ] Step 4 applies write-confirm pattern before developer confirms save
- [ ] Step 5 (Do → Report → Commit) uses wait-for-confirmation pattern
- [ ] Reiterate paths named with Phase N, Step M
