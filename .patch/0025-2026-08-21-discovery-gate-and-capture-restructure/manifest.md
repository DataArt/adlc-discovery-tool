# Patch 0025 — discovery-gate-and-capture-restructure

**Base ref:** `10ad7e1` · **Head ref:** uncommitted

## Summary

Semi-automates all four discovery gates (Kick-off, Steering Meeting/Gate Review, Solution Approval, Final Sign-off) with a single gate-agnostic skill, `discovery-gate` (`/discovery-gate {0-3}`), replacing the previous inline-in-root and stub handling. Every gate now follows the same mechanic: draft/update the session Agenda (or process a completed session's transcript into Notes/Outcomes) from a generic per-gate placeholder, optionally build a recap deck from it via the `deck-design-corporate` skill, run that gate's specific closing checks, then record the stakeholder outcome. The root `discovery` orchestrator wires all four gates through this one skill.

To support this, `docs/AI SDLC/02 Capture/` is reorganized: two new numbered subfolders, `03 Gates/` (all gate session folders) and `04 Workshops/` (all workshop session folders, moved out of the bare `02 Capture/` root), sitting alongside the existing `01 Current State/` and `02 Inhouse Initiatives/`. Every session folder (gate or workshop) now carries `Agenda.md`, `Notes.md`, `Outcomes.md`, and `Transcript.md` as siblings — the `transcript/` subfolder was flattened away. Four new generic, client-agnostic gate placeholders (`Gate 0 (Kick-off) - Date TBD` … `Gate 3 (Final Sign-off) - Date TBD`) were added under `03 Gates/`, each pre-populated with real generic content (not blank) in the same style as the existing workshop placeholders.

Gate 1's colloquial name was aligned to "Steering Meeting" everywhere (folder name, skill text, and the two top-level process docs that previously called it "Findings Approval") — "Gate Review" remains the underlying workflow-doc name, same tier as "Initiation" for Gate 0.

**Not included:** the real Collinson-specific Gate 1 agenda (`02 Capture/03 Gates/Gate 1 (Steering Meeting) - 25 August 2026/Agenda.md`) and `decks/.gitignore` — both repo-specific to this engagement, not starter-kit material, consistent with patch 0024's precedent. The Collinson agenda has since been deleted from this repo entirely (not just excluded from the bundle) — its content was superseded by the generic `Gate 1 (Steering Meeting) - Date TBD` placeholder, which the bundle does carry.

## Renamed (24)

All six workshop folders' four files each, moved from `02 Capture/WS N (...) - Date TBD/` to `02 Capture/04 Workshops/WS N (...) - Date TBD/`, with `transcript/Transcript.md` flattened to `Transcript.md`. Content unchanged.

- `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 1 (Upstream & Design) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 1 (Upstream & Design) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 1 (Upstream & Design) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 2 (Design to Code) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 2 (Design to Code) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 2 (Design to Code) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 3 (Delivery Mechanics) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 3 (Delivery Mechanics) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 4 (People & Context) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 4 (People & Context) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 4 (People & Context) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 5 (Baseline & Guardrails) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/04 Workshops/WS 6 (Product & Projects) - Date TBD/Transcript.md`

## Added (21)

- `.claude/skills/discovery-gate/SKILL.md` — the new gate-agnostic skill
- `.claude/templates/gate-review/Agenda.md`
- `.claude/templates/gate-review/Notes.md`
- `.claude/templates/gate-review/Outcomes.md`
- `.claude/templates/gate-review/Transcript.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 0 (Kick-off) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 0 (Kick-off) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 0 (Kick-off) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 0 (Kick-off) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 1 (Steering Meeting) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 1 (Steering Meeting) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 1 (Steering Meeting) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 1 (Steering Meeting) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 2 (Solution Approval) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 2 (Solution Approval) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 2 (Solution Approval) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 2 (Solution Approval) - Date TBD/Transcript.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 3 (Final Sign-off) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 3 (Final Sign-off) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 3 (Final Sign-off) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Capture/03 Gates/Gate 3 (Final Sign-off) - Date TBD/Transcript.md`

## Updated (27)

- `CLAUDE.md` — added `/discovery-gate` to the skills table and the Discovery phases line
- `.claude/skills/discovery/SKILL.md` — mindmap gains a gate0/gate1/gate2/gate3 node each; Gate 0/1/2/3 sections all now delegate to `/discovery-gate {N}`
- `.claude/skills/discovery-investigate-capture-current-state/SKILL.md` — workshop Agenda/Transcript write paths updated to `04 Workshops/...`
- `docs/AI SDLC/01 Process/03 How the Engagement Runs.md` — Gate 1 renamed "Findings Approval" → "Steering Meeting" in the diagram and both tables
- `docs/AI SDLC/01 Process/05 Team Collaboration.md` — workshop folder path reference updated to `04 Workshops/`; transcript filename reference updated (no `transcript/` prefix)
- `docs/AI SDLC/01 Process/06 Where We Are/01 Engagement.md` — Gate 1 renamed "Findings Approval" → "Steering Meeting" in the diagram and gate table
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/01 Process/07 Workflows/01 Initiation.md` — new "Materials" paragraph naming `/discovery-gate 0`
- `docs/AI SDLC/01 Process/07 Workflows/02 Gate Review.md` — new "Materials" paragraph naming `/discovery-gate 1`
- `docs/AI SDLC/02 Capture/00 Overview.md` — Workshop Programme table links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/index.md` — Workshop table links updated to `04 Workshops/` (missed in the initial restructure pass, caught by a dead-link check afterward)
- `docs/AI SDLC/02 Capture/01 Current State/AI Adoption.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/01 Current State/Architecture.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/01 Current State/Context Topology.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/01 Current State/Metrics.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/01 Current State/Process.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/02 Capture/02 Inhouse Initiatives/Overview.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/01 Requirements & Stories.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/02 Design & UX.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/03 DevOps & Pipeline.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/04 Knowledge Base.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/05 Teams & Integration.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/06 Technical Design.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/07 Ceremony Overhead.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/08 Measurement.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/09 Governance.md` — workshop links updated to `04 Workshops/`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/10 Implementation.md` — workshop links updated to `04 Workshops/`

## Deleted

None — every removed path is accounted for above as a Rename.

## Not included (repo-specific — apply manually if relevant, or skip)

- `docs/AI SDLC/02 Capture/Gate 1 (Steering Meeting) - 25 August 2026/Agenda.md` — carried real Collinson stakeholder names/figures, not starter-kit material. Since deleted from this repo entirely (not merely excluded from the bundle) — a target repo has nothing to move or reconcile here.
- `decks/.gitignore` — unrelated stray file from an earlier session, already excluded from patch 0024 for the same reason.
