# Patch 0020 — process-terminology

## Summary

Introduces a `Phase → Stage → Artifact` vocabulary for `docs/AI SDLC/01 Process/` and wires it consistently everywhere the section previously improvised its own inconsistent language. Adds `02 Terminology.md`: it defines the three terms once (Phase = gate-bound execution window; Stage = a category of work inside a phase, grouping artifacts, not a fixed time slice; Artifact = an actual page/deliverable with a Changelog), gives a 3-layer nested Mermaid diagram (Phase subgraph → Stage subgraph → Artifact leaf nodes, colour-coded per stage, each artifact node carrying a short description), and a table mapping every Stage to the folder its Artifacts actually live in.

Fixes a real structural gap surfaced while building that table: **Target State was missing proper stage status.** It had been informally treated as a "given" that precedes the Solution phase's Pilot → Scale → Evolve loop, the same way Strategic Intent precedes Investigate's loop — but that's wrong. Target State is Solution's own **first stage** (Investigate's `06 Workflows/04 Solution/00 Overview.md` workflow already ran it first, this patch just makes the vocabulary agree). Solution is now a 4-stage phase (Target State → Pilot → Scale → Evolve), not 3. This ripples into every page that names the Solution loop: `01 Process/01 Overview.md`'s Process Grain diagram now shows Target State as the first node inside the Solution subgraph, fed by dotted "anchors"/"grounds" edges from Strategic Intent and Goals; `05 Solution Space/01 Overview.md`'s own diagram gained the same two feed edges and swapped its "is the destination checked against" dotted edge for a solid "scopes the first slice into" edge (Pilot is now framed everywhere as _the one slice of Target State chosen to prove first_, not an independently-identified workload checked against Target State after the fact); `06 Workflows/04 Solution/00 Overview.md`'s step 1 "Given" now explicitly lists Strategic Intent alongside Problems/Solution Goals/Current State. Every bare "Pilot → Scale → Evolve" mention repo-wide (`docs/README.md`, `08 Reference/01 Connect Framework.md`, `04 Evidence Chain.md`, `The Story/index.md`, and two more spots in `01 Overview.md`) is now "Target State → Pilot → Scale → Evolve".

Also renumbers the top-level `01 Process/` pages to make room for `02 Terminology.md` (everything from the old `02 How the Engagement Runs.md` onward shifts by one: `02→03`, `03→04`, `04→05`, `05 Workflows/→06 Workflows/`, `06 Where We Are/→07 Where We Are/`, `07 Reference/→08 Reference/` — file numbers _inside_ `06 Workflows/03 Investigate/` did not need to move, only their parent folder), and prefixes the four Investigate workflow files with their stage name so the folder listing reads the stage structure directly instead of bare ordinals: `01 Current State.md → 01 Vision - Current State.md`, `02 SDLC Domains.md → 02 Problem - SDLC Domains.md`, `03 Diagnose.md → 03 Problem - Diagnose.md`, `04 Solution Goals.md → 04 Goals - Solution Goals.md`. Every internal/external link, H1 title, and the `01 Process/index.md` nav table were updated to match — verified via a link-resolution script covering all 136 `.md` files under `docs/`, both `./relative` and `/AI SDLC/...` VitePress-root-relative forms.

A handful of smaller wording fixes rode along, all found while cross-checking the new vocabulary against existing prose:

- `03 How the Engagement Runs.md` — added an explicit `## The Three Phases, Gated on Both Sides` table (Opens at / Closes at / Duration per phase) plus a sentence stating every phase is gated on both sides; and reworded the Gate 2 row so Scale's optionality ("...and Scale design too where the engagement runs one") matches `06 Workflows/04 Solution/00 Overview.md`'s existing "(where run)" language instead of implying Scale is always required.
- `04 Evidence Chain.md` — the "Solution Goals must cover Strategic Intent" principle now matches what Gate Review's own steps actually do: a missing diagnosed Problem is a hard cut, a weak Strategic Intent fit only gets flagged for re-evaluation, not cut outright (the row previously implied both were equally hard gates).
- `05 Team Collaboration.md` — the PR review line named a "whoever owns the section" rule that CLAUDE.md's agent table doesn't actually resolve for every AI SDLC section; now states the concrete split (`@workshop` for a `02 Vision/WS N (…)` folder change, `@discovery` for everything else under `docs/AI SDLC/`).
- `05 Solution Space/index.md` — added a note that Early Direction (captured at Gate 0 alongside Strategic Intent) is a historical record only, never a formally re-consumed input the way Strategic Intent is — Target State's "given" list doesn't cite it, and no workflow re-opens or re-scores it.
- `06 Workflows/02 Gate Review.md` — two spots said "whichever stage originated it" where the surrounding prose already correctly said "stage or phase" (Solution and Roadmap can be reopened as whole phases, not just as a stage inside Investigate); made both consistent.

**Cross-check before applying:** confirm the target repo's `01 Process/` numbering matches this bundle's starting point (i.e. it already has bundle-0019-shaped `02 How the Engagement Runs.md` / `05 Workflows/` / `06 Where We Are/` / `07 Reference/`) before landing the Renamed entries below — if the target repo's Process section has diverged further, the renumbering will need re-deriving rather than applied as a mechanical patch.

## Added

- `docs/AI SDLC/01 Process/02 Terminology.md`

## Updated

- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/index.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/05 Solution Space/01 Overview.md`
- `docs/AI SDLC/05 Solution Space/02 Target State.md`
- `docs/AI SDLC/05 Solution Space/03 Pilot.md`
- `docs/AI SDLC/05 Solution Space/05 Evolve.md`
- `docs/AI SDLC/05 Solution Space/index.md`
- `docs/README.md`
- `docs/The Story/index.md`

## Renamed

- `docs/AI SDLC/01 Process/02 How the Engagement Runs.md` → `docs/AI SDLC/01 Process/03 How the Engagement Runs.md`
- `docs/AI SDLC/01 Process/03 Evidence Chain.md` → `docs/AI SDLC/01 Process/04 Evidence Chain.md`
- `docs/AI SDLC/01 Process/04 Team Collaboration.md` → `docs/AI SDLC/01 Process/05 Team Collaboration.md`
- `docs/AI SDLC/01 Process/05 Workflows/01 Initiation.md` → `docs/AI SDLC/01 Process/06 Workflows/01 Initiation.md`
- `docs/AI SDLC/01 Process/05 Workflows/02 Gate Review.md` → `docs/AI SDLC/01 Process/06 Workflows/02 Gate Review.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/00 Orchestration.md` → `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/01 Current State.md` → `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/01 Vision - Current State.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/02 SDLC Domains.md` → `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/02 Problem - SDLC Domains.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/03 Diagnose.md` → `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/03 Problem - Diagnose.md`
- `docs/AI SDLC/01 Process/05 Workflows/03 Investigate/04 Solution Goals.md` → `docs/AI SDLC/01 Process/06 Workflows/03 Investigate/04 Goals - Solution Goals.md`
- `docs/AI SDLC/01 Process/05 Workflows/04 Solution/00 Overview.md` → `docs/AI SDLC/01 Process/06 Workflows/04 Solution/00 Overview.md`
- `docs/AI SDLC/01 Process/05 Workflows/05 Roadmap/00 Overview.md` → `docs/AI SDLC/01 Process/06 Workflows/05 Roadmap/00 Overview.md`
- `docs/AI SDLC/01 Process/06 Where We Are/01 Engagement.md` → `docs/AI SDLC/01 Process/07 Where We Are/01 Engagement.md`
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md` → `docs/AI SDLC/01 Process/07 Where We Are/02 Investigate.md`
- `docs/AI SDLC/01 Process/06 Where We Are/03 Solution.md` → `docs/AI SDLC/01 Process/07 Where We Are/03 Solution.md`
- `docs/AI SDLC/01 Process/06 Where We Are/04 Roadmap.md` → `docs/AI SDLC/01 Process/07 Where We Are/04 Roadmap.md`
- `docs/AI SDLC/01 Process/06 Where We Are/05 Report Log.md` → `docs/AI SDLC/01 Process/07 Where We Are/05 Report Log.md`
- `docs/AI SDLC/01 Process/07 Reference/01 Connect Framework.md` → `docs/AI SDLC/01 Process/08 Reference/01 Connect Framework.md`

## Deleted

- none
