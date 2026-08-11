# Patch 0003 — ai-sdlc-folder-renumbering

## Summary

Renames `docs/AI SDLC/Connect Framework/` to `docs/AI SDLC/01 Process/`, and numbers the remaining top-level AI SDLC sections to match nav order: `02 Vision/`, `03 Problem Space/`, `04 Solution Space/`, `05 Roadmap/` (renamed from `Milestones/`). Updates every cross-link across docs content, `apps/docs-web/.vitepress/config.ts` (nav/sidebar), `CLAUDE.md`, agent definitions, and skill templates that referenced the old unnumbered paths. Also wires HLD/LLD sidebar entries (previously commented out / missing) and switches the HLD sidebar to use the `HLD_VERSION` constant instead of a hardcoded `'v1'`. Apply this **before** any bundle that touches `docs/AI SDLC/**` content, since old-path files must be deleted for the rename to be clean — applying out of order against a repo with newer content at the old paths will lose that content unless reconciled by hand.

## Added

- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/02 Goals.md`
- `docs/AI SDLC/01 Process/03 Problem Space.md`
- `docs/AI SDLC/01 Process/04 Solution Space.md`
- `docs/AI SDLC/01 Process/05 Milestones.md`
- `docs/AI SDLC/01 Process/index.md`
- `docs/AI SDLC/02 Vision/00 Overview.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/02 Vision/index.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/03 Problem Space/02 Requirements & Stories.md`
- `docs/AI SDLC/03 Problem Space/03 Design & UX.md`
- `docs/AI SDLC/03 Problem Space/04 DevOps & Pipeline.md`
- `docs/AI SDLC/03 Problem Space/05 Knowledge Base.md`
- `docs/AI SDLC/03 Problem Space/06 Teams & Integration.md`
- `docs/AI SDLC/03 Problem Space/07 Technical Design.md`
- `docs/AI SDLC/03 Problem Space/08 Ceremony Overhead.md`
- `docs/AI SDLC/03 Problem Space/09 Measurement.md`
- `docs/AI SDLC/03 Problem Space/10 Governance.md`
- `docs/AI SDLC/03 Problem Space/11 Implementation.md`
- `docs/AI SDLC/03 Problem Space/Current State/index.md`
- `docs/AI SDLC/03 Problem Space/index.md`
- `docs/AI SDLC/04 Solution Space/01 Overview.md`
- `docs/AI SDLC/04 Solution Space/02 Pilot.md`
- `docs/AI SDLC/04 Solution Space/03 Scale.md`
- `docs/AI SDLC/04 Solution Space/04 Evolve.md`
- `docs/AI SDLC/04 Solution Space/index.md`
- `docs/AI SDLC/05 Roadmap/01 Overview.md`
- `docs/AI SDLC/05 Roadmap/index.md`

## Updated

- `.claude/agents/docs-writer.md`
- `.claude/agents/onboarding.md`
- `.claude/agents/workshop.md`
- `.claude/skills/bootstrap-client/SKILL.md`
- `.claude/skills/design-frame/SKILL.md`
- `.claude/skills/design-publish/SKILL.md`
- `.claude/skills/design-research/SKILL.md`
- `.claude/skills/design-review/SKILL.md`
- `.claude/skills/dev-document/SKILL.md`
- `.claude/templates/workshops/Agenda.md`
- `CLAUDE.md`
- `apps/docs-web/.vitepress/config.ts`
- `apps/docs-web/.vitepress/utils/constants.ts`
- `docs/Engineering Guide/07 Documentation Principles.md`
- `docs/Engineering Guide/Lifecycles/05 Documents Flow.md`
- `docs/README.md`
- `docs/index.md`

## Deleted

(old, pre-numbering paths — superseded by the Added list above)

- `docs/AI SDLC/Connect Framework/01 Overview.md`
- `docs/AI SDLC/Connect Framework/02 Goals.md`
- `docs/AI SDLC/Connect Framework/03 Problem Space.md`
- `docs/AI SDLC/Connect Framework/04 Solution Space.md`
- `docs/AI SDLC/Connect Framework/05 Milestones.md`
- `docs/AI SDLC/Connect Framework/index.md`
- `docs/AI SDLC/Milestones/01 Overview.md`
- `docs/AI SDLC/Milestones/index.md`
- `docs/AI SDLC/Problem Space/01 Overview.md`
- `docs/AI SDLC/Problem Space/02 Requirements & Stories.md`
- `docs/AI SDLC/Problem Space/03 Design & UX.md`
- `docs/AI SDLC/Problem Space/04 DevOps & Pipeline.md`
- `docs/AI SDLC/Problem Space/05 Knowledge Base.md`
- `docs/AI SDLC/Problem Space/06 Teams & Integration.md`
- `docs/AI SDLC/Problem Space/07 Technical Design.md`
- `docs/AI SDLC/Problem Space/08 Ceremony Overhead.md`
- `docs/AI SDLC/Problem Space/09 Measurement.md`
- `docs/AI SDLC/Problem Space/10 Governance.md`
- `docs/AI SDLC/Problem Space/11 Implementation.md`
- `docs/AI SDLC/Problem Space/Current State/index.md`
- `docs/AI SDLC/Problem Space/index.md`
- `docs/AI SDLC/Solution Space/01 Overview.md`
- `docs/AI SDLC/Solution Space/02 Pilot.md`
- `docs/AI SDLC/Solution Space/03 Scale.md`
- `docs/AI SDLC/Solution Space/04 Evolve.md`
- `docs/AI SDLC/Solution Space/index.md`
- `docs/AI SDLC/Vision/00 Overview.md`
- `docs/AI SDLC/Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 1 (Upstream & Design) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 1 (Upstream & Design) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 1 (Upstream & Design) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 2 (Design to Code) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 2 (Design to Code) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 2 (Design to Code) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 3 (Delivery Mechanics) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 3 (Delivery Mechanics) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 4 (People & Context) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 4 (People & Context) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 4 (People & Context) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md`
- `docs/AI SDLC/Vision/index.md`
