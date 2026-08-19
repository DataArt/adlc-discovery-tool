# Patch 0021 — Discovery Skill Family

_Prepared: 2026-08-19. Base ref: `b17ec3c`. Head ref: `b00e6d8`._

## Summary

Adds a `discovery` skill family that orchestrates the ADLC discovery engagement the same way `/dev`/`/design` orchestrate a ticket — a root skill owning gate mechanics (Initiation, Gate Review) and phase sequencing, a phase skill looping Investigate's 3 stages, and one stage skill per Investigate workflow doc (`docs/AI SDLC/01 Process/06 Workflows/03 Investigate/0N *.md`). `discovery-solution`/`discovery-roadmap` ship as stubs — Gate 2/3 phases aren't built out into stage skills yet, they just point at their Workflow doc and hand off to the developer manually.

Unlike `/dev`/`/design`, discovery has no per-ticket folder — it's a standing engagement worked in short sessions over weeks, not a ticket that completes once and archives. State lives entirely in `docs/AI SDLC/01 Process/07 Where We Are/`; idempotency is a coverage check (which SDLC Domains still lack a real hypothesis) rather than a fixed step count.

This restructuring made `@discovery` and `@workshop`'s old "flow owner" roles redundant — the skills now own the flow and the reporting. `@discovery` is narrowed to a read-only evidence-chain reviewer (tools cut to `Read, Glob, Grep`), invoked by the skills as a satellite-review checkpoint before an artifact is committed; it's also still the resolved architect/review agent for Product-track `/design` sessions. `@workshop` is retired outright — its transcript/Notes/Outcomes mechanics now live directly in `discovery-investigate-vision-current-state`, which reads the same `.claude/templates/workshops/*.md` templates `@workshop` used to own.

`CLAUDE.md` and `05 Team Collaboration.md` are updated to match: the skill/agent tables, the slash-command chain, and the PR-review line that used to name `@workshop`.

## Added

- `.claude/skills/discovery/SKILL.md` — root orchestrator: Resume Detection, Skill Hierarchy (mermaid mindmap of the whole family), Gate 0 Initiation, Phase 1 Investigate hand-off, Gate 1 Gate Review, Phase 2/Gate 2/Phase 3/Gate 3 stubs. Carries a shared loop-back note (any gate can flag an item and fall back to wherever it originated — not just Gate 1).
- `.claude/skills/discovery/pattern-session-continuity.md` — 3-level resume chain (stage → phase → root) instead of dev/design's 2-level one.
- `.claude/skills/discovery/pattern-announce-progress.md` — adapted for stage/gate/phase boundaries instead of a fixed step sequence.
- `.claude/skills/discovery/pattern-satellite-review.md` — defines `@discovery`'s narrowed review role: citation, status-ladder correctness, evidence-chain wiring, claim strength; max 2 iterations.
- `.claude/skills/discovery/pattern-write-confirm.md` — the engagement lead confirms a drafted artifact is factually correct, before satellite review or reporting.
- `.claude/skills/discovery/pattern-do-report-commit.md` — Report + Commit only (Do/Verify live in write-confirm, satellite review is its own explicit step in each stage skill); reports into whichever `07 Where We Are/` page owns that status plus an append-only `05 Report Log.md` row, not a per-ticket report file.
- `.claude/skills/discovery/pattern-coverage-check.md` — replaces a fixed step count with "every SDLC Domain past placeholder + Strategic Intent holds steady," per Investigate's actual loop-until-clear shape.
- `.claude/skills/discovery-investigate/SKILL.md` — phase skill; routes each session to the matching stage skill and chains stages within a session when evidence reaches that far.
- `.claude/skills/discovery-investigate-vision-current-state/SKILL.md` — Agenda/Notes/Outcomes/Transcript mechanics (absorbed from the retired `@workshop`) + optional Current State update.
- `.claude/skills/discovery-investigate-problem-sdlc-domains/SKILL.md` — Current State evidence → SDLC Domain page update.
- `.claude/skills/discovery-investigate-problem-diagnose/SKILL.md` — SDLC Domain evidence → Problem registry entry, forward-only status ladder (🟡→🟢→🔵, or ⚫).
- `.claude/skills/discovery-investigate-goals-solution-goals/SKILL.md` — confirmed Problem + Strategic Intent → early Solution Goals draft.
- `.claude/skills/discovery-solution/SKILL.md` — stub, points at the Solution workflow (Target State → Pilot → Scale), Pilot step already usable via the existing `/design` skill.
- `.claude/skills/discovery-roadmap/SKILL.md` — stub, points at the Roadmap workflow (Milestones → WBS → Team Composition → Timeline).

## Updated

- `.claude/agents/discovery.md` — narrowed from flow-owner ("owns all of `docs/AI SDLC/`") to read-only satellite reviewer; tools cut from `Read, Edit, Write, Glob, Grep, Bash` to `Read, Glob, Grep`. Also fixed two stale references this file carried before this patch: it pointed at `07 Report.md`, which an earlier restructure (patch 0019/0020) had already split into `07 Where We Are/*`, and it described a six-stage process model that predates the Phase/Stage/Artifact terminology (patch 0020).
- `CLAUDE.md` — added `/discovery` to the Skills table and the Orchestrators line; added the Discovery phase chain under Slash commands; removed the `@workshop` agent row; updated `@discovery`'s row to reflect its narrowed, read-only role.
- `docs/AI SDLC/01 Process/05 Team Collaboration.md` — the PR-review line named `@workshop` for `02 Vision/WS N (…)` folders; now `@discovery` reviews everything under `docs/AI SDLC/` including workshop folders, matching the retirement above.

## Deleted

- `.claude/agents/workshop.md` — retired; its mechanics (Agenda/Notes/Outcomes structure, transcript processing pipeline, `00 Overview.md` sync rules) now live directly in `discovery-investigate-vision-current-state/SKILL.md`, which reads the same `.claude/templates/workshops/*.md` templates this agent used to reference. **Note for the target repo:** if it customized `@workshop` (e.g. different workshop cadence, extra fields), fold those customizations into `discovery-investigate-vision-current-state/SKILL.md` by hand rather than deleting `workshop.md` outright — this bundle carries no diff of what was customized there.

## Depends on

Patch 0020 (`process-terminology`) — this bundle's skills reference `01 Process/02 Terminology.md`'s Phase/Stage/Artifact vocabulary and the `06 Workflows/`/`07 Where We Are/` paths that patch introduced. Apply 0020 first if the target repo hasn't already.
