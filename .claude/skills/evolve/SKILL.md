---
name: evolve
metadata:
  version: 1.0.0
description: Improve harness skills, agents, workflows, and conventions from observed friction or a concrete improvement request. Supports reflect, triage, validate, and adopt; use for harness improvements rather than ordinary product changes.
---

# Evolve

Turn observed practice into a validated, integrated harness improvement.

Route `$ARGUMENTS` with [the stage router](references/00-router.md). Load only the
current stage, its required interfaces, and relevant source files. Bare `/evolve`
triages pending reflections; clarify the candidate when several match. Reflect is
a capture-only operation. An explicit stage runs that stage only. Triage includes
drafting and stops with inactive candidates by default. Validation and adoption
run when requested. There is no session-continuation or automatic phase-resumption
protocol.

For candidate work, apply [native task tracking](patterns/task-tracking.md). Record
decisions and evidence in the candidate report before a handoff. File presence
alone does not prove completion.

Existing user authorization governs execution. Request acceptance of the concrete
candidate before adoption unless already authorized. Preserve project-specific
instructions (this repo's `.claude/` conventions and `CLAUDE.md`) and use the paths
below consistently.

The lifecycle ends with verified local adoption.

## This project's conventions

- Reflections live at `.claude/reflections/{YYYY-MM-DD-HHMM}-{slug}.md`, moved to
  `.claude/reflections/triaged/` or `.claude/reflections/archive/` via `git mv` once
  triaged.
- Candidate work lives at `.claude/evolve/{timestamp}-{slug}/` (`Report.md`,
  `candidate/`, `Validation.md`) — working artifacts, not discoverable active skills.
- `.claude/skills/drafts/{name}.md` is the legacy pre-evolve draft location. Legacy
  drafts found there may be imported into a new `.claude/evolve/` candidate without
  deleting the original; record the import source in `Report.md`.
- Active skills deploy as `.claude/skills/{name}/SKILL.md` (with companion files
  alongside); active agents deploy as `.claude/agents/{name}.md`.
- The root instruction file is `CLAUDE.md` — its `## Skills` and `## Agents` tables
  are the discovery surface Adopt must update.
- Lifecycle docs live under `docs/Engineering Guide/Lifecycles/`; the skill lifecycle
  doc (`03 Skill Lifecycle.md`) should reflect this evolve flow rather than the
  retired reflect/triage/new/promote sequence.
- Replaces `skill-lifecycle`, `skill-reflect`, `skill-triage`, `skill-new` and
  `skill-promote`. `/patch prepare` and `/patch apply` remain the mechanism for
  syncing a skill or agent back to `.claude/skills/harness-bootstrap/canonical/`
  (the former `skill-harvest` role) — evolve does not replace that.
