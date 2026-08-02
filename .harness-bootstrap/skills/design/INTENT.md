---
skill: design
output: .claude/skills/design/SKILL.md
companion_templates:
  - frame-template.md
  - research-template.md
  - elaborate-template.md
  - report-template.md
  - solution-architecture-template.md
  - solution-design-template.md
  - solution-efforts-template.md
  - solution-stack-template.md
  - pattern-announce-progress.md
  - pattern-do-report-commit.md
  - pattern-write-confirm.md
  - pattern-session-continuity.md
  - pattern-satellite-review.md
  - pattern-design-architect-review.md
  - pattern-design-oq-triage.md
---

## Purpose

Orchestrator for the full Design lifecycle: Frame → Research → Elaborate → Solution → Publish. Detects resume point, delegates to each phase skill in order, and enforces the two-session Publish boundary (pre-gate ends session; post-approval resumes on next invocation).

## Substitutions

| Placeholder                          | Source                       | Notes                                      |
| ------------------------------------ | ---------------------------- | ------------------------------------------ |
| `{{PROJECT_KEY}}`                    | Q5 — ticket prefix           | Replaces `AIFD` in Jira project references |
| `{{JIRA_TRANSITION_START_PROGRESS}}` | Developer confirms from Jira | Transition ID for "Start Progress"         |
| `{{JIRA_TRANSITION_RESOLVE}}`        | Developer confirms from Jira | Transition ID for "Resolve Issue"          |
| `{{JIRA_TRANSITION_CLOSE}}`          | Developer confirms from Jira | Transition ID for "Close Issue"            |

## Conditionals

- If Q5 is "none": remove Jira transition IDs table entirely

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Resume detection uses `*{TICKET}*/**` wildcard, never `[{TICKET}]*`
- [ ] Artifact table has 5 entries matching the 5 phases (Frame through Publish gate)
- [ ] Phase tracker banner is 5-phase: Frame → Research → Elaborate → Solution → Publish
- [ ] Each phase boundary STOP emits announce-progress (`pattern-announce-progress.md`) with `✅ Done / 📋 After this phase` format
- [ ] Publish phase ends at draft MR — "Once the draft MR is open, the session ends"
- [ ] No literal `AIFD` used as project key
