---
aside: false
---

# Claims

_The raw quotes behind every Problem — one row per claim, append-only. The evidence trail [Problems](./02%20Problems.md) draws on, and how several people pointing at the same root cause from different angles strengthens it._

> [!WARNING] Populated During Engagement
> This page fills in during Diagnose, as a Problem is drafted or updated — [discovery-investigate-problem-diagnose](/AI%20SDLC/01%20Process/07%20Workflows/03%20Investigate/03%20Problem%20-%20Diagnose.md) traces the Problem's cited SDLC Domain evidence back to the specific Workshop `Notes.md` it came from and pulls the supporting quotes from there. It is a placeholder until that evidence exists.

---

## Reading the Ledger

Every claim gets an ID the day it's first captured, kept for the life of the engagement — IDs are never reused. A row is born correct and never edited afterward: its **Problem**, **Quote**, and **Workshop** columns are all set the moment Diagnose writes it, because Diagnose only extracts a quote once it already knows which Problem it supports. There's no "not yet linked" state and nothing to re-point later.

Several claims pointing at the same Problem ID, from different workshops, is what corroborates it — that's the mechanic behind [Problems](./02%20Problems.md)' status ladder (🟡 Reported → 🟢 Confirmed → 🔵 Measured).

This ledger is append-only: new rows get added, nothing already written is edited or removed — including if the Problem it supports is later retracted. A retracted Problem's Claims rows stay as-written, pointing at an ID now marked Retracted on the registry; that's the historical record, not something to clean up.

---

## Ledger

_[POPULATE — one row per claim, in capture order (oldest first). "Problem" always links to a real entry on [Problems](./02%20Problems.md) — every row here was written by a Diagnose pass that already knew which Problem it supports.]_

| ID   | Problem                    | Quote       | Workshop              |
| ---- | -------------------------- | ----------- | --------------------- |
| C-01 | [P-01](./02%20Problems.md) | _"[QUOTE]"_ | [WS N (Title) — Date] |

---

_Add a row per quote that carries diagnostic signal, as `discovery-investigate-problem-diagnose` traces a Problem's evidence back to the Workshop `Notes.md` it came from — not a transcription of everything in Notes, just what actually supports this Problem._

---

## Changelog

_Page-level changes only — which Diagnose pass added which claims. Each claim's own row is the evidence; this table is the audit trail of when it landed._

| Date   | Change                                            | Evidence        |
| ------ | ------------------------------------------------- | --------------- |
| [DATE] | [WHAT CHANGED — e.g. "C-03, C-04 added for P-02"] | [Workshop link] |
