# Patch 0016 — goals-section-restructure

## Summary

Restructures `docs/AI SDLC/` around a new top-level **Goals** section, splitting what used to be embedded Goals/Problem Space/Solution Space subsections of `01 Process/` into their own dedicated top-level folders and renumbering the whole tree:

- New `docs/AI SDLC/04 Goals/` section (`01 Overview.md`, `02 Strategic Intent.md`, `03 Solution Goals.md`, `index.md`) — pulls goal-setting content out of `01 Process/` into its own first-class stage between Problem Space and Solution Space.
- `01 Process/02 Goals.md`, `01 Process/03 Problem Space.md`, and `01 Process/04 Solution Space.md` deleted — superseded by the new `04 Goals/` section and the renumbered `03 Problem Space/` / `05 Solution Space/` top-level folders.
- `01 Process/06 Connect Framework.md` → `01 Process/02 Connect Framework.md`, `01 Process/07 Status.md` → `01 Process/03 Report.md` — renumbered to close the gap left by the deletions.
- `01 Process/05 Milestones.md` → `06 Roadmap/02 Milestones.md` — moved out of Process into Roadmap, alongside the rest of that section.
- `04 Solution Space/*` → `05 Solution Space/*` and `05 Roadmap/*` → `06 Roadmap/*` — the whole tail of the AI SDLC folder sequence shifts up one slot to make room for `04 Goals/`.
- New `docs/AI SDLC/02 Vision/01 Current State/Tool Inventory.md` and `02 Inhouse Initiatives/Overview.md` — additional baseline-evidence pages under Vision.
- `apps/docs-web/.vitepress/config.ts` sidebar updated to match the new folder structure.
- `.claude/agents/discovery.md` and `.claude/templates/workshops/Agenda.md` updated to reference the new Goals section and renumbered paths.
- Cross-links updated throughout `01 Process/`, `02 Vision/`, `03 Problem Space/`, `docs/README.md`, `docs/The Story/index.md`, `docs/index.md`, and `docs/Engineering Guide/` (Documentation Principles, Documents Flow) to point at the new structure.

Applying this bundle to a sibling repo brings its `docs/AI SDLC/` folder numbering and Goals section in line with this one. If the sibling has its own client-specific edits inside the renamed/deleted files, review those manually before overwriting — this bundle carries full file content, not a diff.

## Added

- `docs/AI SDLC/02 Vision/01 Current State/Tool Inventory.md`
- `docs/AI SDLC/02 Vision/02 Inhouse Initiatives/Overview.md`
- `docs/AI SDLC/04 Goals/01 Overview.md`
- `docs/AI SDLC/04 Goals/02 Strategic Intent.md`
- `docs/AI SDLC/04 Goals/03 Solution Goals.md`
- `docs/AI SDLC/04 Goals/index.md`
- `docs/AI SDLC/06 Roadmap/index.md`

## Updated

- `.claude/agents/discovery.md`
- `.claude/templates/workshops/Agenda.md`
- `apps/docs-web/.vitepress/config.ts`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/index.md`
- `docs/AI SDLC/02 Vision/00 Overview.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/index.md`
- `docs/AI SDLC/03 Problem Space/Current State/index.md`
- `docs/Engineering Guide/07 Documentation Principles.md`
- `docs/Engineering Guide/Lifecycles/05 Documents Flow.md`
- `docs/README.md`
- `docs/The Story/index.md`
- `docs/index.md`

## Renamed

- `docs/AI SDLC/01 Process/06 Connect Framework.md` → `docs/AI SDLC/01 Process/02 Connect Framework.md`
- `docs/AI SDLC/01 Process/07 Status.md` → `docs/AI SDLC/01 Process/03 Report.md`
- `docs/AI SDLC/01 Process/05 Milestones.md` → `docs/AI SDLC/06 Roadmap/02 Milestones.md`
- `docs/AI SDLC/04 Solution Space/01 Overview.md` → `docs/AI SDLC/05 Solution Space/01 Overview.md`
- `docs/AI SDLC/04 Solution Space/02 Target State.md` → `docs/AI SDLC/05 Solution Space/02 Target State.md`
- `docs/AI SDLC/04 Solution Space/03 Pilot.md` → `docs/AI SDLC/05 Solution Space/03 Pilot.md`
- `docs/AI SDLC/04 Solution Space/04 Scale.md` → `docs/AI SDLC/05 Solution Space/04 Scale.md`
- `docs/AI SDLC/04 Solution Space/05 Evolve.md` → `docs/AI SDLC/05 Solution Space/05 Evolve.md`
- `docs/AI SDLC/04 Solution Space/index.md` → `docs/AI SDLC/05 Solution Space/index.md`
- `docs/AI SDLC/05 Roadmap/01 Overview.md` → `docs/AI SDLC/06 Roadmap/01 Overview.md`
- `docs/AI SDLC/05 Roadmap/02 WBS.md` → `docs/AI SDLC/06 Roadmap/03 WBS.md`
- `docs/AI SDLC/05 Roadmap/03 Timeline.md` → `docs/AI SDLC/06 Roadmap/04 Timeline.md`

## Deleted

- `docs/AI SDLC/01 Process/02 Goals.md`
- `docs/AI SDLC/01 Process/03 Problem Space.md`
- `docs/AI SDLC/01 Process/04 Solution Space.md`
- `docs/AI SDLC/05 Roadmap/index.md`
