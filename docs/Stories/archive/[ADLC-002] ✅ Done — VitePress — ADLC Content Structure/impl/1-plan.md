# ADLC-002: VitePress — ADLC Content Structure

| Field   | Value                           |
| ------- | ------------------------------- |
| Ticket  | ADLC-002                        |
| Branch  | `feat/adlc-002-vitepress-setup` |
| Created | 2026-07-15                      |

## Problem

The VitePress site (`apps/docs-web`) is wired for a different project and does not reflect the ADLC content structure. The nav and sidebar need to be replaced with the five ADLC sections. The Workshop Agenda currently sits inside `Solution Space/` but belongs in a dedicated `Workshops/` folder that does not yet exist.

## Scope

**In scope:**

- Create `docs/AI SDLC/Workshops/` folder and move the Workshop Agenda file into it
- Update VitePress config: title, nav (5 items), and sidebar to match the ADLC content structure
- Remove all Rainmaker/legacy nav and sidebar entries

**Out of scope:**

- New doc content authoring
- Auth or Infrastructure changes
- CDK deploy or S3 sync

## Acceptance Criteria

- [ ] `AC-1` — `docs/AI SDLC/Workshops/01 Workshop Agenda — 22 July 2026.md` exists; old path `docs/AI SDLC/Solution Space/02 Workshop Agenda — 22 July 2026.md` is gone
- [ ] `AC-2` — `docs/index.md` exists with `layout: home` front matter and five feature cards matching the nav sections
- [ ] `AC-3` — Each nav section folder has an `index.md` describing the section's purpose
- [ ] `AC-4` — VitePress dev server renders exactly five nav items: **Problem Space (AI SDLC)**, **Solution...**, **Workshops**, **Project (HLD)**, **Engineering Guide (Harness)**
- [ ] `AC-5` — Clicking each nav item lands on its section index page without a 404
- [ ] `AC-6` — Sidebar for each nav section lists the correct documents (auto-scanned from `docs/`)
- [ ] `AC-7` — Site title shown in the browser tab reads "Collinson ADLC Workshops"
- [ ] `AC-8` — `yarn nx run site:build` completes without errors

## Steps

### Step 1 — Docs: Create Workshops folder and relocate Workshop Agenda

**Changes:**

- `docs/AI SDLC/Workshops/01 Workshop Agenda — 22 July 2026.md` — new location for the Workshop Agenda (moved from `Solution Space/`)
- `docs/AI SDLC/Solution Space/02 Workshop Agenda — 22 July 2026.md` — deleted (moved)

**Verification:**

> Run: `ls "docs/AI SDLC/Workshops/"`
> Expected: `01 Workshop Agenda — 22 July 2026.md`
>
> Run: `ls "docs/AI SDLC/Solution Space/"`
> Expected: only `01 Engagement Overview.md` — agenda file is gone

⚠️ **Stop here. Verify this step before proceeding to Step 2.**

---

### Step 2 — Docs: Create home page and section index pages

**Changes:**

- `docs/index.md` — VitePress `layout: home` landing page with hero block and five feature cards (one per nav section)
- `docs/AI SDLC/Problem Space/index.md` — section heading page describing the Problem Space
- `docs/AI SDLC/Solution Space/index.md` — section heading page describing the Solution Space
- `docs/AI SDLC/Workshops/index.md` — section heading page describing the Workshops
- `docs/Target Architecture (HLD)/index.md` — section heading page for the Project HLD
- `docs/Engineering Guide/index.md` — section heading page for the Engineering Guide

Note: `index.md` files are intentionally excluded from the sidebar auto-scan (the `scanSection` function filters them out), so they serve purely as section landing pages reached via the nav.

**Verification:**

> Run: `yarn nx run site:serve` and open `http://localhost:5173`
> Expected: home page loads with hero and five feature cards
>
> Open each section index URL (e.g. `http://localhost:5173/AI SDLC/Problem Space/`) and confirm a heading page renders with a brief description

⚠️ **Stop here. Verify this step before proceeding to Step 3.**

---

### Step 3 — Web: Align VitePress config to ADLC content structure

**Changes:**

- `apps/docs-web/.vitepress/config.ts` — replace title, nav, and sidebar:
  - Title: `Collinson ADLC Workshops`
  - Nav (5 items) — each links to its section `index` page:
    1. `Problem Space (AI SDLC)` → `/AI SDLC/Problem Space/`
    2. `Solution Space (AI SDLC)` → `/AI SDLC/Solution Space/`
    3. `Workshops` → `/AI SDLC/Workshops/`
    4. `Project (HLD)` → `/Target Architecture (HLD)/`
    5. `Engineering Guide (Harness)` → `/Engineering Guide/`
  - Sidebar keyed by path prefix for each section; auto-scanned via existing `scanSection` helper
  - Remove all legacy Rainmaker entries (Context Topology, Integration Context, Project Architecture)
  - Remove `socialLinks` (GitHub link points to wrong repo)

**Verification:**

> Run: `yarn nx run site:serve` and open `http://localhost:5173`
>
> Confirm:
>
> 1. Browser tab title reads "Collinson ADLC Workshops"
> 2. Nav bar shows exactly 5 items with the correct labels
> 3. Click each nav item — section index page loads without 404
> 4. Sidebar lists documents for each section

⚠️ **Stop here. Verify this step before proceeding to Step 4.**

---

### Step 4 — Web: Verify build

**Changes:** None — verification only.

**Verification:**

> Run: `yarn nx run site:build`
> Expected: build completes with `✓ built in` line and no errors
