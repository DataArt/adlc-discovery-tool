# Patch 0023 — vision-to-capture-rename

## Summary

The "Vision" stage/section name never matched what it actually does — every artifact under it (workshop programme, Current State, Inhouse Initiatives) is retrospective evidence-gathering, not a forward-looking aspiration; the actual forward-looking material already lives in `04 Goals` (Strategic Intent, Solution Goals) and `05 Solution Space` (Target State). Renamed the stage/section from **Vision** to **Capture** throughout: the `docs/AI SDLC/02 Vision/` folder, the `01 Vision - Current State.md` workflow doc, the `discovery-investigate-vision-current-state` skill, and every cross-link, Mermaid diagram node/classDef, nav entry, and prose mention that referred to the old name. Four unrelated generic-English uses of the word "vision" (e.g. "product vision, OKRs", "North Star vision") were deliberately left untouched — they don't refer to this stage.

## Renamed

- `.claude/skills/discovery-investigate-vision-current-state/SKILL.md` → `.claude/skills/discovery-investigate-capture-current-state/SKILL.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/01 Vision - Current State.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/01 Capture - Current State.md`
- `docs/AI SDLC/02 Vision/00 Overview.md` → `docs/AI SDLC/02 Capture/00 Overview.md`
- `docs/AI SDLC/02 Vision/01 Current State/AI Adoption.md` → `docs/AI SDLC/02 Capture/01 Current State/AI Adoption.md`
- `docs/AI SDLC/02 Vision/01 Current State/Architecture.md` → `docs/AI SDLC/02 Capture/01 Current State/Architecture.md`
- `docs/AI SDLC/02 Vision/01 Current State/Context Topology.md` → `docs/AI SDLC/02 Capture/01 Current State/Context Topology.md`
- `docs/AI SDLC/02 Vision/01 Current State/Metrics.md` → `docs/AI SDLC/02 Capture/01 Current State/Metrics.md`
- `docs/AI SDLC/02 Vision/01 Current State/Process.md` → `docs/AI SDLC/02 Capture/01 Current State/Process.md`
- `docs/AI SDLC/02 Vision/01 Current State/Tool Inventory.md` → `docs/AI SDLC/02 Capture/01 Current State/Tool Inventory.md`
- `docs/AI SDLC/02 Vision/02 Inhouse Initiatives/Overview.md` → `docs/AI SDLC/02 Capture/02 Inhouse Initiatives/Overview.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 1 (Upstream & Design) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 2 (Design to Code) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 3 (Delivery Mechanics) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 4 (People & Context) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 5 (Baseline & Guardrails) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md` → `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Notes.md` → `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md` → `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md` → `docs/AI SDLC/02 Capture/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/index.md` → `docs/AI SDLC/02 Capture/index.md`

## Updated

- `.claude/skills/bootstrap-client/SKILL.md`
- `.claude/skills/bootstrap-client/report.md`
- `.claude/skills/discovery-investigate/SKILL.md`
- `.claude/skills/discovery/SKILL.md`
- `.claude/skills/discovery/pattern-coverage-check.md`
- `.claude/skills/discovery/pattern-satellite-review.md`
- `.claude/skills/discovery/pattern-session-continuity.md`
- `CLAUDE.md`
- `apps/docs-web/.vitepress/config.ts`
- `apps/docs-web/README.md`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/02 Terminology.md`
- `docs/AI SDLC/01 Process/03 How the Engagement Runs.md`
- `docs/AI SDLC/01 Process/04 Evidence Chain.md`
- `docs/AI SDLC/01 Process/05 Team Collaboration.md`
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md`
- `docs/AI SDLC/01 Process/07 Workflows/01 Initiation.md`
- `docs/AI SDLC/01 Process/07 Workflows/02 Gate Review.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/02 Problem - SDLC Domains.md`
- `docs/AI SDLC/01 Process/07 Workflows/04 Solution/00 Overview.md`
- `docs/AI SDLC/01 Process/08 Reference/01 Connect Framework.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Gaps Sit.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/01 Requirements & Stories.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/02 Design & UX.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/03 DevOps & Pipeline.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/04 Knowledge Base.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/05 Teams & Integration.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/06 Technical Design.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/07 Ceremony Overhead.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/08 Measurement.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/09 Governance.md`
- `docs/AI SDLC/03 Problem Space/03 SDLC Domains/10 Implementation.md`
- `docs/AI SDLC/03 Problem Space/index.md`
- `docs/AI SDLC/04 Goals/01 Overview.md`
- `docs/AI SDLC/04 Goals/02 Strategic Intent.md`
- `docs/AI SDLC/04 Goals/03 Solution Goals.md`
- `docs/AI SDLC/04 Goals/index.md`
- `docs/AI SDLC/05 Solution Space/02 Target State.md`
- `docs/AI SDLC/05 Solution Space/03 Pilot.md`
- `docs/README.md`
- `docs/The Story/index.md`
- `docs/index.md`

## Added

_None._

## Deleted

_None._

## Notes for the applying repo

- If the target repo's `docs/AI SDLC/` numbering or section names have diverged from this one (e.g. a different Goals/Problem Space layout), the cross-links inside these files assume the same structure as this repo — check `Terminology.md` and the nav config in `apps/docs-web/.vitepress/config.ts` still line up before applying blind.
- Four generic-English uses of the word "vision" were deliberately left unrenamed in this repo (not part of this bundle, but worth knowing if diffing manually): `docs/AI SDLC/02 Capture/01 Current State/Context Topology.md` and `docs/The Story/00 Software Development Lifecycle.md` ("product vision, OKRs"), `docs/AI SDLC/05 Solution Space/01 Overview.md` ("massive vision"), `docs/AI SDLC/06 Roadmap/01 Overview.md` ("North Star vision"). Don't rename these on the far side either — they aren't the stage name.
