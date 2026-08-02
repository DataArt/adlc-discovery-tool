# ADLC-002: VitePress — ADLC Content Structure — Report

| Field  | Value                                                      |
| ------ | ---------------------------------------------------------- |
| Ticket | ADLC-002                                                   |
| Branch | `feat/adlc-002-vitepress-setup`                            |
| PR     | —                                                          |
| Author | Anton Merkulov                                             |
| Status | ✅ Complete                                                |
| Phase  | 📋 Plan ✅ · 🔨 Implement ✅ · 🧪 Test ✅ · 📝 Document ✅ |

## Progress

| #   | Step                                              | Status  | Notes                                                                                                         | Test | Docs |
| --- | ------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- | ---- | ---- |
| 1   | Docs: Create Workshops folder and relocate Agenda | ✅ Done | Moved from Solution Space/, renamed 02→01                                                                     | ✅   | ✅   |
| 2   | Docs: Create home page and section index pages    | ✅ Done | layout:home for all; 4 feature cards; mini-hero per section; Workshops 00 Overview added                      | ✅   | ✅   |
| 3   | Web: Align VitePress config to ADLC structure     | ✅ Done | Title, nav (5 items), sidebar updated; socialLinks removed; nav label corrected to "Solution Space (AI SDLC)" | ✅   | ✅   |
| 4   | Web: Verify build                                 | ✅ Done | yarn nx run site:build passed                                                                                 | —    | —    |

<!--
Status values : ⏳ Pending · 🔄 Active · ✅ Done · ⚠️ Blocked · ⏭️ Skipped
Test / Docs   : ✅ done · — not applicable · (empty) = not yet run
-->

## Architecture Deviations

| #   | Deviation | Justification |
| --- | --------- | ------------- |

<!--
Populated by /dev-plan Step 7b if any justified deviations were approved.
Leave empty if no deviations — do not remove the section.
Each deviation must be addressed in the Document phase: Target Architecture updated or a tech debt ticket created.
-->

## Implementation Notes

### Step 1 — Docs: Create Workshops folder and relocate Workshop Agenda

Went as planned. Folder created, file moved and renamed from `02 Workshop Agenda…` to `01 Workshop Agenda…`.

### Step 4 — Web: Verify build

`yarn nx run site:build` passed clean.

### Step 3 — Web: Align VitePress config to ADLC content structure

Title and description updated; nav replaced with 5 ADLC items (label corrected to "Solution Space (AI SDLC)" during review); sidebar rewritten using `scanSection` for all 5 sections; `socialLinks` removed. Additional tweaks: `01 Problem Space.md` renamed to `01 Overview.md`, home page and section index action links pointed to first/overview docs, Workshops section index action corrected to `00 Overview`.

### Step 2 — Docs: Create home page and section index pages

`docs/index.md` created with `layout: home`, 3 hero action buttons (Problem Space, Solution Space, Workshops), and 4 feature cards (same 3 + Engineering Guide). All five section `index.md` files created with mini-hero (`layout: home`) and action buttons linking to first docs. Added `docs/AI SDLC/Workshops/00 Overview.md` with session table and purpose. Several iterative tweaks to card count and section names during developer review.

## Deviation Audit

_Date: 2026-07-15_

| #    | Finding                                                                                    | Doc                                              | Action needed                                                      |
| ---- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------ |
| DA-1 | Content namespace (`AI SDLC/` sub-sections, new `Workshops/` folder) not specified in HLD  | `HLD/v1/Containers/Web.md`                       | Add "Content structure" table listing top-level `docs/` sections   |
| DA-2 | Site title/description (`Collinson ADLC Workshops`) not recorded in HLD                    | `HLD/v1/Containers/Web.md`                       | Record as controlled values in Technology or new Configuration row |
| DA-3 | 5-item nav + `scanSection` sidebar pattern not specified in HLD                            | `HLD/v1/Containers/Web.md`                       | Add "Navigation" section describing nav/sidebar design             |
| DA-4 | `docs/index.md` home-layout and section `index.md` pattern not in HLD                      | `HLD/v1/Containers/Web.md`                       | Note landing-page pattern in Key paths or Navigation section       |
| DA-5 | `ignoreDeadLinks` removal establishes a "zero dead links" build gate — not recorded as NFR | `HLD/v1/Non-Functional Concerns/Requirements.md` | Add NFR: VitePress build must fail on dead internal links          |
| DA-6 | `docs/System Architecture (LLD)/` does not exist — no LLD for any container                | New file needed                                  | Create `docs/System Architecture (LLD)/v1/Containers/Web.md`       |

**Verdict:** All findings are extensions/absences — nothing contradicts the HLD. DA-1 through DA-5 are HLD updates; DA-6 is a new LLD doc.

## PR Review

_Date: 2026-07-15_

| Code        | Finding                                                                                                                         | File                                        | Severity                | Resolution                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| BUG-001     | `ignoreDeadLinks: true` suppresses all broken-link build errors site-wide — future dead links will silently pass CI             | `apps/docs-web/.vitepress/config.ts:44`     | Must fix (pre-existing) | Remove the flag or scope to an allowlist array                               |
| BUG-002     | HLD sidebar scans `v1/` subdirectory while key is the parent `/Target Architecture (HLD)/` — implicit coupling to `HLD_VERSION` | `apps/docs-web/.vitepress/config.ts:63`     | Optional                | Document intent or surface `HLD_VERSION` as a sidebar header                 |
| BUG-003     | Space characters unencoded in YAML `link:` values — VitePress handles them in practice but fragile across parsers               | `docs/index.md:13,19` + section index files | Optional                | Percent-encode spaces or leave as-is (VitePress 1.x handles both)            |
| BUG-004     | Workshops overview relative link mixes `%20` encoding for spaces but leaves em dash raw — inconsistent                          | `docs/AI SDLC/Workshops/00 Overview.md:37`  | Optional                | Use raw filename without any encoding: `./01 Workshop Agenda — 22 July 2026` |
| IMPROVE-001 | Nav has 5 items but home page has 4 feature cards — Project (HLD) has no card                                                   | `docs/index.md:21-42`                       | Optional                | Add fifth card or intentionally omit                                         |
| IMPROVE-002 | `scanSection('Engineering Guide')` recurses into `Lifecycles/` — nesting is correct but worth confirming intent                 | `apps/docs-web/.vitepress/config.ts:64`     | Optional                | No action if nesting is acceptable                                           |

**Verdict:** One must-fix (`ignoreDeadLinks: true`) but it's pre-existing from the Rainmaker config — not introduced by this ticket. All 5 nav links and sidebar keys resolve correctly. LGTM for this ticket's scope.

## Test Results

_Date: 2026-07-15_

| Project       | Build | Tests | Typecheck | Lint |
| ------------- | ----- | ----- | --------- | ---- |
| `site`        | ✅    | —     | ✅        | ✅   |
| `lambda-auth` | ✅    | —     | ✅        | ✅   |

### Notes

No test suite for `site` (VitePress static site — no unit tests). Build verified with `ignoreDeadLinks` removed; 2 dead links found and fixed in `docs/README.md`. NX reported a flaky task warning — pre-existing, not introduced by this ticket. All AC items confirmed.

## Tech Debt

| #    | Description                                                                                                                                                                     | Type    | Ticket |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ |
| TD-1 | BUG-002 — HLD sidebar scans `v1/` via `HLD_VERSION` while key is the parent path; adding `v2/` won't appear without a config change                                             | cleanup | —      |
| TD-2 | BUG-003 — Space characters unencoded in YAML `link:` values across section `index.md` files; VitePress handles fine but fragile across parsers                                  | cleanup | —      |
| TD-3 | IMPROVE-001 — Home page has 4 feature cards but nav has 5 items; Project (HLD) intentionally omitted but may want revisiting                                                    | ux      | —      |
| TD-4 | IMPROVE-002 — `scanSection('Engineering Guide')` recurses into `Lifecycles/` subdirectory; nesting is correct but depth may need tuning as content grows                        | ux      | —      |
| TD-5 | DA-6 — `docs/System Architecture (LLD)/` does not exist; Web container LLD should be created to capture nav model, scanSection pattern, home-page layout, and build constraints | cleanup | —      |

<!--
Type values: blocker · dependency · cleanup · security · performance · ux
Ticket: fill in internal ticket number (e.g. ADLC-XX), otherwise —
Rows are added here by /dev-implement (Step 3b) as debt is discovered.
-->

## Documentation

_Date: 2026-07-15_

| Item                                                                        | Action                                                                              |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `docs/Target Architecture (HLD)/v1/Containers/Web.md`                       | Updated — added site title/description, Content structure table, Navigation section |
| `docs/Target Architecture (HLD)/v1/Non-Functional Concerns/Requirements.md` | Updated — added NFR-5 (dead links build gate)                                       |
| `apps/docs-web/README.md`                                                   | Updated — replaced Rainmaker description and stale Links reference                  |
| `docs/README.md`                                                            | Updated during implementation — Workshops section added, renamed file corrected     |

### Notes

DA-6 (create Web container LLD) logged as TD-5 — `docs/System Architecture (LLD)/` does not exist yet; out of scope for this ticket. `apps/docs-web/README.md` links section updated to point to the HLD Web container doc.

## Efforts Spent

| Date       | Phase     | Human time | AI tokens | Notes                                                                                      |
| ---------- | --------- | ---------- | --------- | ------------------------------------------------------------------------------------------ |
| 2026-07-15 | Implement |            |           | Step 1 — move Workshop Agenda to Workshops/                                                |
| 2026-07-15 | Implement |            |           | Step 2 — home page, section index pages, Workshops overview                                |
| 2026-07-15 | Implement |            |           | Step 3 — VitePress config: title, nav, sidebar, remove socialLinks                         |
| 2026-07-15 | Implement |            |           | Step 4 — build verified                                                                    |
| 2026-07-15 | Test      |            |           | PR review fixes (BUG-001, BUG-004); dead links in README.md fixed; typecheck + lint passed |
