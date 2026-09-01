# Patch 0033 — engagement-restructure

**Base ref:** `7b2d263`
**Head ref:** `dc4a646`

## Summary

`01 Process` becomes `01 Engagement`. The old phase/stage content (Overview, Terminology, How the Engagement Runs, Evidence Chain) moves as-is into a new `03 Process/` subfolder, unnesting the Phase/Stage/Artifact process definition from the engagement itself. Two new top-level pages take its place: `01 Overview.md` (engagement-wide what/why — what ADLC is, why the client is running one) and `02 Terminology.md` (the evidence-chain vocabulary the whole engagement uses — Capture, Workshop, Session, Topic, SDLC Domain, Current State, Problem, Diagnose, Claims, Strategic Intent, Solution Goals, Gate, Target State, Pilot, Scale, Evolve — distinct from `03 Process`'s Phase/Stage/Artifact terminology, which describes the container structure rather than what the terms mean). `Where We Are`, `Workflows`, `Reference`, and `Contribution` renumber (`06→04`, `07→05`, `08→06`, `09→07`) to close the gap left by `03 Process`.

Every downstream reference is updated to match: the VitePress nav/sidebar config, 15 `.harness/` skill and agent sources (which also regenerate `.claude/`, `.agents/`, `.codex/` — excluded from this bundle as reproducible), the `.claude/templates/gate-review/Agenda.md` template, and cross-links across Problem Space, Goals, Solution Space, Capture's gate agendas, the docs README, and The Story.

Also included: a `patch-apply` skill behavior change (`.harness/skills/patch-apply/SKILL.md`) — Step 7 previously asked which provider projections to regenerate after applying a bundle, with a skip option. It now runs `yarn harness:generate` automatically whenever canonical `.harness/**` changes were applied, since that's deterministic derived output rather than a judgment call; a generation failure (broken toolchain, etc.) is reported without blocking the rest of the step.

**Contains canonical harness changes.** After applying, regenerate provider projections with `yarn harness:generate`. If applying via `/patch-apply` and this bundle's own `patch-apply` change has already landed there, this happens automatically per its updated Step 7.

## Renamed

- `docs/AI SDLC/01 Process/01 Overview.md` → `docs/AI SDLC/01 Engagement/03 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/02 Terminology.md` → `docs/AI SDLC/01 Engagement/03 Process/02 Terminology.md`
- `docs/AI SDLC/01 Process/03 How the Engagement Runs.md` → `docs/AI SDLC/01 Engagement/03 Process/03 How the Engagement Runs.md`
- `docs/AI SDLC/01 Process/04 Evidence Chain.md` → `docs/AI SDLC/01 Engagement/03 Process/04 Evidence Chain.md`
- `docs/AI SDLC/01 Process/06 Where We Are/01 Engagement.md` → `docs/AI SDLC/01 Engagement/04 Where We Are/01 Engagement.md`
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md` → `docs/AI SDLC/01 Engagement/04 Where We Are/02 Investigate.md`
- `docs/AI SDLC/01 Process/06 Where We Are/03 Solution.md` → `docs/AI SDLC/01 Engagement/04 Where We Are/03 Solution.md`
- `docs/AI SDLC/01 Process/06 Where We Are/04 Roadmap.md` → `docs/AI SDLC/01 Engagement/04 Where We Are/04 Roadmap.md`
- `docs/AI SDLC/01 Process/06 Where We Are/05 Report Log.md` → `docs/AI SDLC/01 Engagement/04 Where We Are/05 Report Log.md`
- `docs/AI SDLC/01 Process/07 Workflows/01 Initiation.md` → `docs/AI SDLC/01 Engagement/05 Workflows/01 Initiation.md`
- `docs/AI SDLC/01 Process/07 Workflows/02 Gate Review.md` → `docs/AI SDLC/01 Engagement/05 Workflows/02 Gate Review.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/00 Orchestration.md` → `docs/AI SDLC/01 Engagement/05 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/01 Capture - Current State.md` → `docs/AI SDLC/01 Engagement/05 Workflows/03 Investigate/01 Capture - Current State.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/02 Problem - SDLC Domains.md` → `docs/AI SDLC/01 Engagement/05 Workflows/03 Investigate/02 Problem - SDLC Domains.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/03 Problem - Diagnose.md` → `docs/AI SDLC/01 Engagement/05 Workflows/03 Investigate/03 Problem - Diagnose.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/04 Goals - Solution Goals.md` → `docs/AI SDLC/01 Engagement/05 Workflows/03 Investigate/04 Goals - Solution Goals.md`
- `docs/AI SDLC/01 Process/07 Workflows/04 Solution/00 Overview.md` → `docs/AI SDLC/01 Engagement/05 Workflows/04 Solution/00 Overview.md`
- `docs/AI SDLC/01 Process/07 Workflows/05 Roadmap/00 Overview.md` → `docs/AI SDLC/01 Engagement/05 Workflows/05 Roadmap/00 Overview.md`
- `docs/AI SDLC/01 Process/08 Reference/01 Connect Framework.md` → `docs/AI SDLC/01 Engagement/06 Reference/01 Connect Framework.md`
- `docs/AI SDLC/01 Process/09 Contribution/01 Team Collaboration.md` → `docs/AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md`
- `docs/AI SDLC/01 Process/09 Contribution/02 Claude Desktop Setup.md` → `docs/AI SDLC/01 Engagement/07 Contribution/02 Claude Desktop Setup.md`
- `docs/AI SDLC/01 Process/09 Contribution/03 Codex Desktop Setup.md` → `docs/AI SDLC/01 Engagement/07 Contribution/03 Codex Desktop Setup.md`
- `docs/AI SDLC/01 Process/09 Contribution/04 Branching Policy.md` → `docs/AI SDLC/01 Engagement/07 Contribution/04 Branching Policy.md`
- `docs/AI SDLC/01 Process/09 Contribution/05 Quick Walkthrough.md` → `docs/AI SDLC/01 Engagement/07 Contribution/05 Quick Walkthrough.md`

## Added

- `docs/AI SDLC/01 Engagement/01 Overview.md`
- `docs/AI SDLC/01 Engagement/02 Terminology.md`
- `docs/AI SDLC/01 Engagement/index.md`

## Deleted

- `docs/AI SDLC/01 Process/index.md` — superseded by `docs/AI SDLC/01 Engagement/index.md` above. Not detected as a rename (content differs too much from the old index — new structure, new table), so it's recorded as a plain delete + add rather than a pairing.

## Updated

- `.harness/agents/discovery.md`
- `.harness/skills/bootstrap-client/SKILL.md`
- `.harness/skills/discovery-gate/SKILL.md`
- `.harness/skills/discovery-investigate-capture-current-state/SKILL.md`
- `.harness/skills/discovery-investigate-goals-solution-goals/SKILL.md`
- `.harness/skills/discovery-investigate-problem-diagnose/SKILL.md`
- `.harness/skills/discovery-investigate-problem-sdlc-domains/SKILL.md`
- `.harness/skills/discovery-investigate/SKILL.md`
- `.harness/skills/discovery-roadmap/SKILL.md`
- `.harness/skills/discovery-solution/SKILL.md`
- `.harness/skills/discovery/SKILL.md`
- `.harness/skills/discovery/pattern-coverage-check.md`
- `.harness/skills/discovery/pattern-satellite-review.md`
- `.harness/skills/discovery/pattern-session-continuity.md`
- `.harness/skills/patch-apply/SKILL.md` — the auto-regenerate behavior change described above
- `.claude/templates/gate-review/Agenda.md`
- `apps/docs-web/.vitepress/config.ts`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 0 (Kick-off) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 1 (Steering Meeting) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 2 (Solution Approval) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 3 (Final Sign-off) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/index.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/03 Claims.md`
- `docs/AI SDLC/04 Goals/index.md`
- `docs/AI SDLC/05 Solution Space/02 Target State.md`
- `docs/AI SDLC/05 Solution Space/03 Pilot.md`
- `docs/AI SDLC/05 Solution Space/05 Evolve.md`
- `docs/AI SDLC/05 Solution Space/index.md`
- `docs/README.md`
- `docs/The Story/index.md`

## Excluded

- `.claude/skills/**`, `.agents/skills/**`, `.claude/agents/**`, `.codex/agents/**` — generated provider projections, reproducible with `yarn harness:generate` from the `.harness/` changes above.
- `.patch/0032-2026-08-31-problem-space-claims/**`, `.patch/REGISTRY.md` — local bookkeeping for the previously-prepared bundle; git's copy-detection matched real files against their identical copies sitting inside that bundle's `files/` tree, which is noise, not portable content.
