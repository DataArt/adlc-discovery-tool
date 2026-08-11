# Patch 0005 — wiring-trace-and-naming-cleanup

## Summary

Two related content-quality passes over `docs/AI SDLC/`:

1. **Wiring trace review** — checked that the engagement flow (Vision → Problem Space →
   Process → Solution Space → Roadmap) is actually cross-linked forward and backward at every
   hop, not just correct in nav order. Found and fixed a stale `Problem Space (workdir)` label,
   and three missing forward links: Solution Space → Roadmap, Roadmap ← Solution Space, and
   Process's internal Milestones list → Roadmap. Also added an explicit description of the
   Pilot → Scale → Evolve closed-loop pattern to `01 Process/04 Solution Space.md`, matching how
   it's described in the top-level Solution Space overview.
2. **"Connect Framework" naming cleanup** — this is the brand name of the four-list facilitation
   method (Goals/Problem/Solution/Milestones) used within the Process section. It had spread
   into prose across Vision, Problem Space, Roadmap, workshop agendas, root README, the workshop
   agent, and bootstrap-client skill files. Limited it to exactly one place —
   `docs/AI SDLC/01 Process/01 Overview.md`, the framework's actual definition page — and
   replaced every other mention with the plain section name "Process".

No files added or deleted — this bundle is content edits only.

## Updated

- `.claude/agents/workshop.md`
- `.claude/skills/bootstrap-client/SKILL.md`
- `.claude/skills/bootstrap-client/report.md`
- `.claude/templates/workshops/Agenda.md`
- `README.md`
- `docs/README.md`
- `docs/AI SDLC/01 Process/04 Solution Space.md`
- `docs/AI SDLC/01 Process/05 Milestones.md`
- `docs/AI SDLC/01 Process/index.md`
- `docs/AI SDLC/02 Vision/00 Overview.md`
- `docs/AI SDLC/02 Vision/index.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/03 Problem Space/index.md`
- `docs/AI SDLC/04 Solution Space/01 Overview.md`
- `docs/AI SDLC/05 Roadmap/01 Overview.md`
- `docs/AI SDLC/05 Roadmap/index.md`

## Ordering note

Depends on patch 0003 (`ai-sdlc-folder-renumbering`) already being applied — these edits assume
the numbered `docs/AI SDLC/01 Process/` … `05 Roadmap/` paths already exist.
