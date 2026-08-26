# Patch 0014 — story-restructure

## Summary

Restructures the top-level `docs/Context/` section into `docs/The Story/` — turned from a flat folder of independent pages into one continuous narrative arc: industry-wide SDLC pattern → industry positioning (Legacy vs Fully-Automated vs AI-Assisted) → context maturity model → diagnosed challenges (ten, down from eleven) → the human mindset-shift precondition → the wired mechanics that address it all.

`index.md` is now a pure registry (title, one-line pitch, nav table) — it previously held the general narrative directly. That narrative moved to a new `00 Software Development Lifecycle.md`. A new `01 From Broken Handoffs to Governed AI.md` tells a second, concrete narrative (a ticket-buying example) with an explicit Legacy/Fully-Automated/AI-Assisted positioning table and a "Grounded in Industry Guidance" section citing Anthropic, OpenAI, Google Cloud, and NIST. The old "Mental Model Shift" challenge was extracted from Challenges into its own `04 The Mental Model Shift.md`, merged with the Engineering Guide's Engineer Role pitch. Every remaining page was renumbered/renamed to fit the new order (`01 Landscape.md` → `02 Context Landscape.md`, `02 Challenges.md` → `03 Challenges.md`, `03 Target Agentic SDLC Setup.md` → `05 Target Agentic SDLC Setup.md`), and every cross-reference across the repo (sidebar config, README, AI SDLC docs, workshop agendas) was updated to the new paths.

Three new diagram images were added to `docs/public/images/context/` to illustrate the new `00` and `01` pages. Also included: an unrelated diagram-direction tweak to Solution Space `01 Overview.md` and dead-link fixes to Solution Space `Target State.md` / `Pilot.md` / `Evolve.md` and Process `01 Overview.md` that landed in the same commit range but predate this restructuring work — bundled here because they sit in the same diff range and the developer asked to include everything except the frozen `.patch/0013/...` snapshot files.

## Added

- `docs/The Story/01 From Broken Handoffs to Governed AI.md`
- `docs/The Story/04 The Mental Model Shift.md`
- `docs/The Story/index.md`
- `docs/public/images/context/AI Factory - From Intent to Confuse.png`
- `docs/public/images/context/AI-Powered Software Lifecycle Pipeline.png`
- `docs/public/images/context/From Business Ideas to Customer Confusion.png`

## Updated

- `apps/docs-web/.vitepress/config.ts`
- `docs/README.md`
- `docs/index.md`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/02 Vision/01 Current State/Context Topology.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/04 Solution Space/01 Overview.md`
- `docs/AI SDLC/04 Solution Space/02 Target State.md`
- `docs/AI SDLC/04 Solution Space/03 Pilot.md`
- `docs/AI SDLC/04 Solution Space/05 Evolve.md`

## Renamed

- `docs/Context/00 The Story.md` → `docs/The Story/00 Software Development Lifecycle.md`
- `docs/Context/01 Landscape.md` → `docs/The Story/02 Context Landscape.md`
- `docs/Context/02 Challenges.md` → `docs/The Story/03 Challenges.md`
- `docs/Context/03 Target Agentic SDLC Setup.md` → `docs/The Story/05 Target Agentic SDLC Setup.md`

## Deleted

- `docs/Context/index.md` (content superseded by `docs/The Story/index.md`, not a straight rename — the new file is a registry, the old one held narrative prose)
