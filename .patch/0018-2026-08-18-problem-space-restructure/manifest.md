# Patch 0018 — problem-space-restructure

Restructures `docs/AI SDLC/03 Problem Space/` into a reader-facing digest over an evidence layer, moves two current-state facets into `02 Vision/01 Current State/`, applies a stable-ID registry pattern to Solution Goals, and adds an evidence-wired Changelog section to every page that carries findings.

## Why

The old Problem Space was 11 flat pages, each a research-workbook template (current state / time-loss estimate / AI opportunity / evidence needed) with no separation between what a client said, what was observed, and what was still a hypothesis. A reader outside the engagement had to read all 11 pages and synthesize the picture themselves. This patch:

- Splits Problem Space into `01 Overview.md` (status only), `02 Diagnose/` (a 2-page reader digest: Where Time Is Lost, Problems), and `03 SDLC Domains/` (the original 10 pages, renamed from "Areas" to match the tool's actual usage, serving purely as the evidence layer)
- Gives Problems a stable-ID registry (`P-01`, `P-02`, ...) with a forward-only verification status (🟡 Reported → 🟢 Confirmed → 🔵 Measured → ⚫ Retracted), so a claim's confidence is explicit and IDs stay valid across the engagement even as status changes
- Removes `Problem Space/Current State/` — it duplicated `Vision/01 Current State/`'s role; bottom-up evidence now has one home
- Adds two new Vision Current State pages — `AI Adoption.md` (where AI is actually used today, distinct from a named Inhouse Initiative) and `Metrics.md` (measurement mechanisms + key numbers already captured) — moved out of Problem Space's Diagnose layer to keep raw fact separate from diagnosis
- Applies the same stable-ID registry pattern to `Goals/03 Solution Goals.md` (`SG-01`...) with a Shaped → Confirmed → Cut status
- Adds a `## Changelog` section to every evidence-bearing page (Current State, SDLC Domains, Diagnose, Goals), each wired to the specific evidence source that justifies a change — Current State → workshop, SDLC Domains → workshop and/or Current State, Diagnose → SDLC Domains, Solution Goals → Strategic Intent + Problem IDs
- Renames "Area" → "SDLC Domain" throughout Vision, Process, and the `@discovery`/`@workshop` agent docs to match, and updates the VitePress sidebar config plus every cross-reference into the renamed/moved pages

## Added

- `docs/AI SDLC/02 Vision/01 Current State/AI Adoption.md`
- `docs/AI SDLC/02 Vision/01 Current State/Metrics.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Time Is Lost.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md`

## Renamed

- `docs/AI SDLC/03 Problem Space/02 Requirements & Stories.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/01 Requirements & Stories.md`
- `docs/AI SDLC/03 Problem Space/03 Design & UX.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/02 Design & UX.md`
- `docs/AI SDLC/03 Problem Space/04 DevOps & Pipeline.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/03 DevOps & Pipeline.md`
- `docs/AI SDLC/03 Problem Space/05 Knowledge Base.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/04 Knowledge Base.md`
- `docs/AI SDLC/03 Problem Space/06 Teams & Integration.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/05 Teams & Integration.md`
- `docs/AI SDLC/03 Problem Space/07 Technical Design.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/06 Technical Design.md`
- `docs/AI SDLC/03 Problem Space/08 Ceremony Overhead.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/07 Ceremony Overhead.md`
- `docs/AI SDLC/03 Problem Space/09 Measurement.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/08 Measurement.md`
- `docs/AI SDLC/03 Problem Space/10 Governance.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/09 Governance.md`
- `docs/AI SDLC/03 Problem Space/11 Implementation.md` → `docs/AI SDLC/03 Problem Space/03 SDLC Domains/10 Implementation.md`

## Deleted

- `docs/AI SDLC/03 Problem Space/Current State/index.md`

## Updated

- `.claude/agents/discovery.md`
- `.claude/agents/workshop.md`
- `.claude/templates/workshops/Agenda.md`
- `.claude/templates/workshops/Notes.md`
- `.claude/templates/workshops/Outcomes.md`
- `apps/docs-web/.vitepress/config.ts`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/03 Report.md`
- `docs/AI SDLC/02 Vision/00 Overview.md`
- `docs/AI SDLC/02 Vision/01 Current State/Architecture.md`
- `docs/AI SDLC/02 Vision/01 Current State/Context Topology.md`
- `docs/AI SDLC/02 Vision/01 Current State/Process.md`
- `docs/AI SDLC/02 Vision/01 Current State/Tool Inventory.md`
- `docs/AI SDLC/02 Vision/02 Inhouse Initiatives/Overview.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 1 (Upstream & Design) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 2 (Design to Code) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 3 (Delivery Mechanics) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 4 (People & Context) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/02 Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/02 Vision/index.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/03 Problem Space/index.md`
- `docs/AI SDLC/04 Goals/02 Strategic Intent.md`
- `docs/AI SDLC/04 Goals/03 Solution Goals.md`
- `docs/AI SDLC/05 Solution Space/02 Target State.md`
- `docs/AI SDLC/05 Solution Space/03 Pilot.md`
- `docs/AI SDLC/05 Solution Space/04 Scale.md`
- `docs/AI SDLC/05 Solution Space/05 Evolve.md`
- `docs/The Story/03 Challenges.md`
- `docs/The Story/04 The Mental Model Shift.md`
