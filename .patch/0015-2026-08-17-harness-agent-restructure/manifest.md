# Patch 0015 — harness-agent-restructure

## Summary

A broad harness refresh touching the design lifecycle, agent roster, and skill/agent archiving conventions:

- **Design lifecycle extended**: `/design` now runs Frame → Research → Elaborate → Solution → (WAF gate: Review) → **Review Gate** → (**Address Feedback**) → Publish. Two new skills — `design-review-gate` (opens the draft MR, records the approval gate, pauses for human approval) and `design-address-feedback` (only runs if the approver raises concerns; reiterates into the traced-to phase, then waits for re-approval) — plus two new design patterns (`pattern-context-resolution.md`, `pattern-multi-decision-split.md`) referenced across the design skill set.
- **Product/Project track split**: design skills, `@onboarding`, and the bootstrap templates now distinguish a Product design track (engagement content, e.g. `docs/AI SDLC/`) from a Project design track (this repo's own architecture, e.g. `docs/Target Architecture (HLD)/`), resolved per session in Frame.
- **Satellite review protocol moved**: workers now invoke `@architect` as a satellite reviewer directly per `worker-satellite-review.md` (new file) instead of going through the orchestrator — `@infra` (and its `.harness-bootstrap` template) updated to reference the new location.
- **Agent roster changes**: new `layer` and `product-architect` agent templates added under `.harness-bootstrap/agents/`; the `bff`, `db`, and `web` agent templates (and the `scrum-master`, `writing-docs`, `story-folder-glob` skill templates) are archived — moved to `agents/archive/` and `skills/archive/` respectively (mirrored in `.claude/skills/.archive/` for the live skill). Archiving preserves history for reference without keeping them in the active roster.
- **`@architect`, `@docs-writer`, `@infra`, `@onboarding`** updated with small clarifications (evidence-comment convention for architect, doc length-budget guidance for docs-writer, cross-region guardrail for infra, opening-question and MCP setup guidance for onboarding).
- Every touched skill's `.harness-bootstrap/` template counterpart was updated in lockstep so `/bootstrap-client` on a fresh instance produces the same skill set.
- `CLAUDE.md` and `docs/Engineering Guide/Lifecycles/*` updated to reflect the extended design lifecycle phases.

## Added

- `.claude/skills/design-address-feedback/SKILL.md`
- `.claude/skills/design-review-gate/SKILL.md`
- `.claude/skills/design/pattern-context-resolution.md`
- `.claude/skills/design/pattern-multi-decision-split.md`
- `.harness-bootstrap/agents/layer/INTENT.md`
- `.harness-bootstrap/agents/layer/TEMPLATE.md`
- `.harness-bootstrap/agents/product-architect/INTENT.md`
- `.harness-bootstrap/agents/product-architect/TEMPLATE.md`
- `.harness-bootstrap/skills/design-address-feedback/INTENT.md`
- `.harness-bootstrap/skills/design-address-feedback/TEMPLATE.md`
- `.harness-bootstrap/skills/design-review-gate/INTENT.md`
- `.harness-bootstrap/skills/design-review-gate/TEMPLATE.md`
- `.harness-bootstrap/skills/design/pattern-context-resolution.md`
- `.harness-bootstrap/skills/design/pattern-multi-decision-split.md`
- `.harness-bootstrap/skills/worker-satellite-review.md`

## Updated

- `.claude/agents/architect.md`
- `.claude/agents/docs-writer.md`
- `.claude/agents/infra.md`
- `.claude/agents/onboarding.md`
- `.claude/skills/design-elaborate/SKILL.md`
- `.claude/skills/design-frame/SKILL.md`
- `.claude/skills/design-publish/SKILL.md`
- `.claude/skills/design-research/SKILL.md`
- `.claude/skills/design-review/SKILL.md`
- `.claude/skills/design-solution/SKILL.md`
- `.claude/skills/design/SKILL.md`
- `.claude/skills/design/frame-template.md`
- `.claude/skills/design/pattern-design-architect-review.md`
- `.claude/skills/design/pattern-satellite-review.md`
- `.claude/skills/design/pattern-session-continuity.md`
- `.claude/skills/design/report-template.md`
- `.claude/skills/design/research-template.md`
- `.claude/skills/design/solution-architecture-template.md`
- `.claude/skills/design/solution-design-template.md`
- `.claude/skills/design/solution-efforts-template.md`
- `.claude/skills/design/solution-stack-template.md`
- `.claude/skills/dev-document/SKILL.md`
- `.claude/skills/dev-implement/SKILL.md`
- `.claude/skills/dev-plan/SKILL.md`
- `.claude/skills/dev-test/SKILL.md`
- `.claude/skills/dev/SKILL.md`
- `.claude/skills/skill-harvest/SKILL.md`
- `.claude/skills/skill-lifecycle/SKILL.md`
- `.claude/skills/skill-new/SKILL.md`
- `.claude/skills/skill-promote/SKILL.md`
- `.claude/skills/skill-reflect/SKILL.md`
- `.claude/skills/skill-triage/SKILL.md`
- `.claude/skills/war-design/SKILL.md`
- `.claude/skills/war-implementation/SKILL.md`
- `.claude/skills/war/SKILL.md`
- `.claude/skills/where-we-are/SKILL.md`
- `.harness-bootstrap/00 Overview.md`
- `.harness-bootstrap/01 Bootstrap.md`
- `.harness-bootstrap/02 Update.md`
- `.harness-bootstrap/Engineering Guide/01 Conventions.md`
- `.harness-bootstrap/Engineering Guide/02 Doc Structure.md`
- `.harness-bootstrap/Engineering Guide/04 AI Workflow.md`
- `.harness-bootstrap/Engineering Guide/09 Documentation Principles.md`
- `.harness-bootstrap/Engineering Guide/Lifecycles/00 Overview.md`
- `.harness-bootstrap/Engineering Guide/Lifecycles/02 Design Lifecycle.md`
- `.harness-bootstrap/Engineering Guide/Lifecycles/05 Documents Flow.md`
- `.harness-bootstrap/agents/architect/TEMPLATE.md`
- `.harness-bootstrap/agents/docs-writer/INTENT.md`
- `.harness-bootstrap/agents/docs-writer/TEMPLATE.md`
- `.harness-bootstrap/agents/scrum-master/INTENT.md`
- `.harness-bootstrap/agents/scrum-master/TEMPLATE.md`
- `.harness-bootstrap/skills/archive/design-oq-triage/TEMPLATE.md`
- `.harness-bootstrap/skills/design-elaborate/INTENT.md`
- `.harness-bootstrap/skills/design-elaborate/TEMPLATE.md`
- `.harness-bootstrap/skills/design-frame/INTENT.md`
- `.harness-bootstrap/skills/design-frame/TEMPLATE.md`
- `.harness-bootstrap/skills/design-publish/INTENT.md`
- `.harness-bootstrap/skills/design-publish/TEMPLATE.md`
- `.harness-bootstrap/skills/design-research/INTENT.md`
- `.harness-bootstrap/skills/design-research/TEMPLATE.md`
- `.harness-bootstrap/skills/design-review/INTENT.md`
- `.harness-bootstrap/skills/design-review/TEMPLATE.md`
- `.harness-bootstrap/skills/design-solution/INTENT.md`
- `.harness-bootstrap/skills/design-solution/TEMPLATE.md`
- `.harness-bootstrap/skills/design/INTENT.md`
- `.harness-bootstrap/skills/design/TEMPLATE.md`
- `.harness-bootstrap/skills/design/frame-template.md`
- `.harness-bootstrap/skills/design/pattern-design-architect-review.md`
- `.harness-bootstrap/skills/design/pattern-satellite-review.md`
- `.harness-bootstrap/skills/design/pattern-session-continuity.md`
- `.harness-bootstrap/skills/design/report-template.md`
- `.harness-bootstrap/skills/design/research-template.md`
- `.harness-bootstrap/skills/design/solution-architecture-template.md`
- `.harness-bootstrap/skills/design/solution-design-template.md`
- `.harness-bootstrap/skills/design/solution-efforts-template.md`
- `.harness-bootstrap/skills/design/solution-stack-template.md`
- `.harness-bootstrap/skills/dev-document/TEMPLATE.md`
- `.harness-bootstrap/skills/dev-implement/TEMPLATE.md`
- `.harness-bootstrap/skills/dev-plan/TEMPLATE.md`
- `.harness-bootstrap/skills/dev-test/INTENT.md`
- `.harness-bootstrap/skills/dev-test/TEMPLATE.md`
- `.harness-bootstrap/skills/dev/INTENT.md`
- `.harness-bootstrap/skills/dev/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-authoring.md`
- `.harness-bootstrap/skills/skill-harvest/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-lifecycle/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-new/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-promote/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-reflect/TEMPLATE.md`
- `.harness-bootstrap/skills/skill-triage/TEMPLATE.md`
- `.harness-bootstrap/skills/war-design/TEMPLATE.md`
- `.harness-bootstrap/skills/war-implementation/TEMPLATE.md`
- `.harness-bootstrap/skills/war/TEMPLATE.md`
- `.harness-bootstrap/skills/where-we-are/TEMPLATE.md`
- `CLAUDE.md`
- `docs/Engineering Guide/Lifecycles/00 Overview.md`
- `docs/Engineering Guide/Lifecycles/02 Design Lifecycle.md`
- `docs/Engineering Guide/Lifecycles/05 Documents Flow.md`

## Renamed

- `.harness-bootstrap/skills/scrum-master/INTENT.md` → `.harness-bootstrap/skills/archive/scrum-master/INTENT.md`
- `.harness-bootstrap/skills/scrum-master/TEMPLATE.md` → `.harness-bootstrap/skills/archive/scrum-master/TEMPLATE.md`
- `.harness-bootstrap/skills/writing-docs/TEMPLATE.md` → `.harness-bootstrap/skills/archive/writing-docs/TEMPLATE.md`
- `.harness-bootstrap/skills/writing-docs/INTENT.md` → `.harness-bootstrap/skills/archive/writing-docs/INTENT.md`
- `.harness-bootstrap/skills/story-folder-glob/TEMPLATE.md` → `.harness-bootstrap/skills/archive/story-folder-glob/TEMPLATE.md`
- `.harness-bootstrap/skills/story-folder-glob/INTENT.md` → `.harness-bootstrap/skills/archive/story-folder-glob/INTENT.md`
- `.claude/skills/story-folder-glob/SKILL.md` → `.claude/skills/.archive/story-folder-glob/SKILL.md`
- `.harness-bootstrap/agents/bff/INTENT.md` → `.harness-bootstrap/agents/archive/bff/INTENT.md`
- `.harness-bootstrap/agents/bff/TEMPLATE.md` → `.harness-bootstrap/agents/archive/bff/TEMPLATE.md`
- `.harness-bootstrap/agents/db/INTENT.md` → `.harness-bootstrap/agents/archive/db/INTENT.md`
- `.harness-bootstrap/agents/db/TEMPLATE.md` → `.harness-bootstrap/agents/archive/db/TEMPLATE.md`
- `.harness-bootstrap/agents/web/INTENT.md` → `.harness-bootstrap/agents/archive/web/INTENT.md`
- `.harness-bootstrap/agents/web/TEMPLATE.md` → `.harness-bootstrap/agents/archive/web/TEMPLATE.md`

## Deleted

None.
