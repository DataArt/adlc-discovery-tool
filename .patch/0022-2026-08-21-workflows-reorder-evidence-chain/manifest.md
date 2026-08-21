# Patch 0022 — workflows-reorder-evidence-chain

**Base ref:** `b00e6d8` · **Head ref:** `1ea5f0f` (repo of origin)

## Summary

Swaps the sibling order of `01 Process`'s two mechanics folders — `06 Workflows` / `07 Where We Are` become `07 Workflows` / `06 Where We Are` — so the persistent-state tracker (`Where We Are`) sits before the static reference mechanics (`Workflows`) in the folder listing. Every cross-reference to either folder, in both `docs/` and `.claude/`, is rewired to match (plain and `%20`-encoded link forms).

Also relocates two page-level symbol legends from mid-page to the bottom of their page (`02 Vision/01 Current State/Tool Inventory.md`'s adoption-status legend, `06 Where We Are/02 Investigate.md`'s status legend) — a page's own status/symbol tables read easier below the content that uses them rather than interrupting it.

Finally, fixes a template bug in the Problem → SDLC Domain → Workshop/Current State evidence chain: `03 Problem Space/02 Diagnose/02 Problems.md`'s three SDLC-Domain-link examples (registry-row column, per-problem `**SDLC Domain:**` field, Changelog example) pointed at the generic domains-overview anchor (`/AI SDLC/02 Vision/00 Overview.md#sdlc-domains`) instead of a specific domain page — meaning a Problem citing this template literally couldn't be traced to the domain evidence that produced it. Replaced all three with a concrete example pointing at a specific domain page (`03 SDLC Domains/01 Requirements & Stories`). The SDLC Domain page's own Changelog already correctly cited specific Workshop Outcomes + Current State pages — only the Problem-side link was generic. Tightened `.claude/skills/discovery/pattern-satellite-review.md`'s Wiring check and `discovery-investigate-problem-diagnose/SKILL.md`'s Step 2 to require the specific-page link going forward, so this doesn't regress.

**Depends on patch 0021** (`discovery-skill-family`) — apply that first if the target repo hasn't already; this bundle's skill-file diffs assume 0021's skill set already exists there.

## Added

_(none)_

## Updated

- `.claude/agents/discovery.md` — folder-reference rewire only (`06 Workflows`→`07 Workflows`, `07 Where We Are`→`06 Where We Are`)
- `.claude/skills/discovery/SKILL.md` — folder-reference rewire (4 spots)
- `.claude/skills/discovery/pattern-coverage-check.md` — folder-reference rewire
- `.claude/skills/discovery/pattern-do-report-commit.md` — folder-reference rewire (2 spots)
- `.claude/skills/discovery/pattern-satellite-review.md` — folder-reference rewire, plus Wiring check tightened to require a Problem's SDLC Domain link point at the specific domain page (not the generic overview anchor), and to name the domain-page→Workshop/Current-State hop explicitly
- `.claude/skills/discovery/pattern-session-continuity.md` — folder-reference rewire
- `.claude/skills/discovery-investigate/SKILL.md` — folder-reference rewire (3 spots)
- `.claude/skills/discovery-investigate-goals-solution-goals/SKILL.md` — folder-reference rewire
- `.claude/skills/discovery-investigate-problem-diagnose/SKILL.md` — folder-reference rewire, plus Step 2 tightened to require the SDLC Domain link(s) point at the specific domain page under `03 SDLC Domains/`, not the generic overview anchor
- `.claude/skills/discovery-investigate-problem-sdlc-domains/SKILL.md` — folder-reference rewire
- `.claude/skills/discovery-investigate-vision-current-state/SKILL.md` — folder-reference rewire
- `.claude/skills/discovery-roadmap/SKILL.md` — folder-reference rewire
- `.claude/skills/discovery-solution/SKILL.md` — folder-reference rewire
- `docs/AI SDLC/01 Process/01 Overview.md` — folder-reference rewire (multiple spots)
- `docs/AI SDLC/01 Process/02 Terminology.md` — folder-reference rewire
- `docs/AI SDLC/01 Process/03 How the Engagement Runs.md` — folder-reference rewire
- `docs/AI SDLC/01 Process/04 Evidence Chain.md` — folder-reference rewire (multiple spots)
- `docs/AI SDLC/01 Process/05 Team Collaboration.md` — folder-reference rewire
- `docs/AI SDLC/01 Process/index.md` — nav table links swapped to match the new folder order
- `docs/AI SDLC/02 Vision/01 Current State/Tool Inventory.md` — adoption-status legend moved from directly under the diagram to just above the Changelog section
- `docs/AI SDLC/03 Problem Space/01 Overview.md` — folder-reference rewire
- `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md` — SDLC Domain link examples fixed to point at a specific domain page instead of the generic domains-overview anchor (registry row, per-problem field, Changelog example)

## Renamed

Folder swap — content also changed on the 4 pages marked `*` (folder-reference rewire, in addition to the rename):

- `docs/AI SDLC/01 Process/07 Where We Are/01 Engagement.md` → `docs/AI SDLC/01 Process/06 Where We Are/01 Engagement.md`
- `docs/AI SDLC/01 Process/07 Where We Are/02 Investigate.md` → `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md` \*(also: legend moved to page bottom)
- `docs/AI SDLC/01 Process/07 Where We Are/03 Solution.md` → `docs/AI SDLC/01 Process/06 Where We Are/03 Solution.md` \*
- `docs/AI SDLC/01 Process/07 Where We Are/04 Roadmap.md` → `docs/AI SDLC/01 Process/06 Where We Are/04 Roadmap.md` \*
- `docs/AI SDLC/01 Process/07 Where We Are/05 Report Log.md` → `docs/AI SDLC/01 Process/06 Where We Are/05 Report Log.md`
- `docs/AI SDLC/01 Process/06 Workflows/01 Initiation.md` → `docs/AI SDLC/01 Process/07 Workflows/01 Initiation.md`
- `docs/AI SDLC/01 Process/06 Workflows/02 Gate Review.md` → `docs/AI SDLC/01 Process/07 Workflows/02 Gate Review.md`
- `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/00 Orchestration.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/01 Vision - Current State.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/01 Vision - Current State.md`
- `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/02 Problem - SDLC Domains.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/02 Problem - SDLC Domains.md`
- `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/03 Problem - Diagnose.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/03 Problem - Diagnose.md`
- `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/04 Goals - Solution Goals.md` → `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/04 Goals - Solution Goals.md`
- `docs/AI SDLC/01 Process/06 Workflows/04 Solution/00 Overview.md` → `docs/AI SDLC/01 Process/07 Workflows/04 Solution/00 Overview.md`
- `docs/AI SDLC/01 Process/06 Workflows/05 Roadmap/00 Overview.md` → `docs/AI SDLC/01 Process/07 Workflows/05 Roadmap/00 Overview.md` \*(also: folder-reference rewire inside the file)

## Deleted

_(none)_

## Excluded from this bundle

`.patch/**` changes in the source repo's working tree (the `0021-discovery-skill-family` bundle folder and a `.patch/REGISTRY.md` row) are patch-tooling bookkeeping from a separate `/patch-prepare` run in the source repo — not portable content, and not meant to travel inside another bundle. If the target repo wants patch 0021 too, apply it separately.
