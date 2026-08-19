# Patch 0019 — process-restructure

## Summary

Restructures `docs/AI SDLC/01 Process/` from a flat 4-file section into a gate-based, navigable structure. The six-stage `01 Overview.md` is trimmed to definitions only; its former diagram sections split out into `02 How the Engagement Runs.md` (a concrete Gate 0→3 / week-range timeline template), `03 Evidence Chain.md` (kept as the original stage-dependency diagram, plus a `## Process Grain` section folded back into `01 Overview.md`), and a new `05 Workflows/` folder holding one Mermaid-`sequenceDiagram` page per operational workflow (Initiation, Gate Review, and a 4-part `03 Investigate/` sub-folder: Current State → SDLC Domains → Diagnose → Solution Goals; Solution and Roadmap each got their own single-file sub-folder for future extensibility). The former flat `03 Report.md` live tracker is replaced by `06 Where We Are/`, split into Engagement / Investigate / Solution / Roadmap / Report Log pages, each with its own status table, target-date placeholders, and a consolidated status legend. `02 Connect Framework.md` moved into a new `07 Reference/` folder (optional/background material). `04 Team Collaboration.md` is new — git/IDE conventions, Claude Desktop/Codex Desktop roles for non-technical team members, and the commit→PR flow for landing engagement content.

Also fixes a batch of dead links surfaced by a VitePress build: several bare-folder links (`./03 SDLC Domains/`, `./02 Diagnose/`, `/AI SDLC/02 Vision/01 Current State/`) that resolved to a missing `index.md` are retargeted to existing pages instead — the `## SDLC Domains` table in `02 Vision/00 Overview.md` (`#sdlc-domains` anchor), `02 Diagnose/02 Problems.md`, and `01 Current State/Process.md` respectively. This ripples into `docs/AI SDLC/03 Problem Space/` (`01 Overview.md`, `02 Diagnose/02 Problems.md`, `index.md`) even though that section wasn't otherwise part of this restructure.

**Known gap carried into this bundle on purpose:** `.claude/agents/discovery.md` was edited early in this restructure (numbering references updated once) but was then deliberately left unsynced against the final numbering — it still says `01 Process/07 Report.md` and `02 Connect Framework.md`, both stale against the final `06 Where We Are/01 Engagement.md` and `07 Reference/01 Connect Framework.md` paths. Apply this bundle, then run a dedicated discovery/workshop-agent sync pass afterward — don't treat `discovery.md`'s content here as correct.

## Added

- `docs/AI SDLC/01 Process/02 How the Engagement Runs.md`
- `docs/AI SDLC/01 Process/03 Evidence Chain.md`
- `docs/AI SDLC/01 Process/04 Team Collaboration.md`
- `docs/AI SDLC/01 Process/05 Workflows/01 Initiation.md`
- `docs/AI SDLC/01 Process/05 Workflows/02 Gate Review.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/01 Current State.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/02 SDLC Domains.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/03 Diagnose.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/04 Solution Goals.md`
- `docs/AI SDLC/01 Process/05 Workflows/04 Solution/00 Overview.md`
- `docs/AI SDLC/01 Process/05 Workflows/05 Roadmap/00 Overview.md`
- `docs/AI SDLC/01 Process/06 Where We Are/01 Engagement.md`
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md`
- `docs/AI SDLC/01 Process/06 Where We Are/03 Solution.md`
- `docs/AI SDLC/01 Process/06 Where We Are/04 Roadmap.md`
- `docs/AI SDLC/01 Process/06 Where We Are/05 Report Log.md`

## Updated

- `.claude/agents/discovery.md` — partial numbering sync only; see Known Gap above
- `apps/docs-web/.vitepress/config.ts` — Process sidebar entry simplified (no longer wraps `scanSection(...)` in an extra `{ text: 'Process', items: ... }` group)
- `docs/AI SDLC/01 Process/01 Overview.md` — trimmed to six-stage definitions + `## Process Grain`, outline frontmatter added
- `docs/AI SDLC/01 Process/index.md` — directory table rewritten for the new structure
- `docs/AI SDLC/03 Problem Space/01 Overview.md` — dead-link retargets
- `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md` — dead-link retargets
- `docs/AI SDLC/03 Problem Space/index.md` — dead-link retargets

## Renamed

- `docs/AI SDLC/01 Process/02 Connect Framework.md` → `docs/AI SDLC/01 Process/07 Reference/01 Connect Framework.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Time Is Lost.md` → `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Gaps Sit.md`

## Deleted

- `docs/AI SDLC/01 Process/03 Report.md` — superseded by `06 Where We Are/` (content split across 5 pages, not a 1:1 rename)
