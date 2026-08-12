# Patch 0013 — process-solution-tracker-overhaul

## Summary

A broad pass across `01 Process/`, `02 Vision/`, `04 Solution Space/`, and `05 Roadmap/` that closes several traceability gaps discovered while auditing the engagement methodology:

- **Evidence Chain**: `01 Process/01 Overview.md` gains a new "Evidence Chain" section/diagram (Workshops → Current State → Problems, Problems + Goals → Solution) and each of the five stages gets a detailed "How it runs" procedural breakdown. The Vision stage is renamed "Vision — Establish the Vision."
- **Goals sourcing fixed**: Goals previously had no evidenced source (`02 Goals.md` claimed "agreed during discovery workshops" but no workshop actually asked about goals or wrote back to them). Every WS1–5 `Agenda.md` now captures "Goal signals surfaced" in its Closing section, same mechanism as Problem Space findings; `02 Goals.md` and `02 Vision/00 Overview.md` updated to reflect this.
- **Workshop traceability tags**: every WS1–5 topic now carries a `Diagnoses` tag (which Context Challenge + Problem Space domain it validates) and a `Baseline` tag (which Current State doc it feeds).
- **Tooling questions audit**: every one of the 10 diagnostic Areas across WS1–5 now has an explicit "which specific tool" survey question (Jira/Confluence/Figma/CI stack/etc.) — needed to fill in the Target State page's Phase × Context Matrix with real system names, not generic categories.
- **Status Report**: `01 Process/07 Status.md` renamed (H1 only) to "Status Report" and gains a granular **Workshop & Evidence Tracker** table (IDs `WS1`–`WS6`, `CS`, `GO`, `PR`, `SO`, `RM`) tracking coverage/status for workshops, Current State docs, Goals (Not shaped → Shaped → Confirmed), Problems, Solution, and Roadmap. `.claude/agents/discovery.md` updated to instruct stamping this tracker row-by-row on every relevant action, not batched.
- **Solution Space restructure**: new `02 Target State.md` — the client-specific instantiation of `Context/03 Target Agentic SDLC Setup.md`, with a Phase × Context Matrix to fill in with real tooling answers and a gap-to-Current-State section. `02 Pilot.md` → `03 Pilot.md`, `03 Scale.md` → `04 Scale.md`, `04 Evolve.md` → `05 Evolve.md` (renumbered to make room); `01 Overview.md` and `index.md` updated to match, diagram gains a Target State node.
- **Roadmap stubs**: new `05 Roadmap/02 WBS.md` and `03 Timeline.md` placeholder pages (same `Populated During Engagement` pattern as the rest of the docs), referenced from `01 Process/01 Overview.md`'s Roadmap stage steps and from `05 Roadmap/01 Overview.md`'s Timelines section.

## Added

- `docs/AI SDLC/04 Solution Space/02 Target State.md`
- `docs/AI SDLC/05 Roadmap/02 WBS.md`
- `docs/AI SDLC/05 Roadmap/03 Timeline.md`

## Updated

- `.claude/agents/discovery.md`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/02 Goals.md`
- `docs/AI SDLC/01 Process/07 Status.md`
- `docs/AI SDLC/01 Process/index.md`
- `docs/AI SDLC/02 Vision/00 Overview.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/04 Solution Space/01 Overview.md`
- `docs/AI SDLC/04 Solution Space/index.md`
- `docs/AI SDLC/05 Roadmap/01 Overview.md`
- `docs/AI SDLC/05 Roadmap/index.md`

## Renamed

- `docs/AI SDLC/04 Solution Space/02 Pilot.md` → `docs/AI SDLC/04 Solution Space/03 Pilot.md`
- `docs/AI SDLC/04 Solution Space/03 Scale.md` → `docs/AI SDLC/04 Solution Space/04 Scale.md`
- `docs/AI SDLC/04 Solution Space/04 Evolve.md` → `docs/AI SDLC/04 Solution Space/05 Evolve.md`

## Deleted

_None._
