# Patch 0002 — ws6-pilot-selection

## Summary

Adds WS 6 (Product & Projects) to the discovery workshop programme: a capstone synthesis workshop that picks the ADLC pilot candidate, run after WS 1–5. It is deliberately **not** an 11th diagnostic Area — the programme's 10 fixed Areas (each mapping 1:1 to a Problem Space page) are unchanged; WS 6 instead synthesizes evidence already gathered across WS 1–5 into a single decision.

WS 6's `Outcomes.md` carries a Pilot Evaluation Matrix that scores each candidate project/product 1–5 on five dimensions — Impact, Confidence, Ease, Governance fit (reused verbatim from `Connect Framework/04 Solution Space.md`'s existing pilot-evaluation vocabulary, to avoid a second competing taxonomy) plus one new pilot-readiness dimension, Team AI-readiness. A "Named owner" column is also recorded per candidate for context — explicitly **not** scored and **not** a pass/fail gate (an earlier gate design was deliberately descoped to cut process overhead).

Because WS 6 now owns the "final workshop — synthesize a pilot candidate" job, WS 5's Agenda.md/Outcomes.md closing notes (which previously claimed that job conditionally) were updated to point forward to WS 6 instead. `Connect Framework/04 Solution Space.md` gained a one-line cross-reference so its four evaluation dimensions and WS 6's matrix don't drift into two different vocabularies over time.

All new/changed content uses the same placeholder-shape conventions as the rest of `docs/AI SDLC/Vision/` (bracket tokens, `[[CLIENT_NAME]]`, "Date TBD" naming, the colored key-question/answer `<div>` blocks, mermaid mindmap/flowchart blocks) — it is not engagement-specific and should apply cleanly to a sibling repo that shares this workshop-programme structure.

## Added

- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Agenda.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Notes.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/Outcomes.md`
- `docs/AI SDLC/Vision/WS 6 (Product & Projects) - Date TBD/transcript/Transcript.md`

## Updated

- `docs/AI SDLC/Connect Framework/04 Solution Space.md` — cross-reference to WS 6's use of these dimensions.
- `docs/AI SDLC/Vision/00 Overview.md` — Workshop Programme mermaid diagram (new WS6 node, distinct `synthesis` classDef color), programme table, a clarifying sentence that WS6 sits outside the Area taxonomy, and the Workshops (Agenda/Notes/Outcomes/Transcript links) table. The Areas list and Coverage tracker are untouched — still exactly 10 Areas.
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/Agenda.md` — closing note now points forward to WS6 instead of claiming the final-workshop synthesis job itself.
- `docs/AI SDLC/Vision/WS 5 (Baseline & Guardrails) - Date TBD/Outcomes.md` — same closing-note update as above.
- `docs/AI SDLC/Vision/index.md` — added WS6 row to the workshop table.

## Deleted

None.

## Apply notes

- `docs/AI SDLC/Vision/00 Overview.md`, `index.md`, and the two WS5 files are **updates to existing files** — review the diff against the target repo's current versions before overwriting, in case that repo has since diverged (e.g. real dates filled in, Areas re-grouped) from this starter-kit shape.
- The WS6 folder is a straight add; safe to copy in as-is if the target repo hasn't already got its own WS6.
