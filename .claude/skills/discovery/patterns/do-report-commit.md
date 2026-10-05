# Pattern: Do → Report → Commit (Discovery)

Applies whenever a discovery stage, phase, or gate action completes. Picks up after two things the calling skill has already done as their own steps: `patterns/write-confirm.md` (draft the artifact, engagement lead confirms it's correct) and, where it applies, `patterns/satellite-review.md` (evidence-chain check). This pattern only covers what's left — Report and Commit. There is no single per-ticket report file the way `dev`/`design` have one — the report target is whichever `01 Engagement/04 Where We Are/` page already owns that status, plus an append-only row in `05 Report Log.md`.

Apply [the status interface](../interfaces/status.md) when updating the standing pages.

## Steps

1. **Report** — update, in this order:
   1. The artifact's existing `## Changelog`, citing its source. For session artifacts without one, preserve provenance in Notes/Outcomes and the Report Log; do not append commentary to a verbatim Transcript
   2. The matching row(s) in the relevant `01 Engagement/04 Where We Are/` page — see the mapping below
   3. Append one row to `05 Report Log.md`: `| {YYYY-MM-DD} | {what changed in the Where We Are pages} | {the Changelog row, workshop, or gate close that triggered it} |`
2. **Commit** — present the suggested commit message per `01 Engagement/07 Contribution/01 Team Collaboration.md`'s format (`docs(<section-or-ws-id>): <what changed>`); use existing explicit commit authorization, or request confirmation before committing
3. Commit only the reviewed files in scope. Record a pending commit accurately if authorization is absent; never imply it happened.

## Where We Are mapping

| Stage / gate action                         | Refresh this page                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Gate 0 — Initiation                         | `01 Engagement.md` (Gate 0 row) + `02 Investigate.md` (Strategic Intent row)                      |
| Any Investigate stage                       | `02 Investigate.md` (the matching section: Workshops / Current State / Problems / Solution Goals) |
| Gate 1 — Gate Review                        | `01 Engagement.md` (Gate 1 row) + `02 Investigate.md` (top status)                                |
| Any `discovery solution` stage (once built) | `03 Solution.md`                                                                                  |
| Gate 2 — Solution Approval                  | `01 Engagement.md` (Gate 2 row)                                                                   |
| Any `discovery roadmap` stage (once built)  | `04 Roadmap.md`                                                                                   |
| Gate 3 — Final Sign-off                     | `01 Engagement.md` (Gate 3 row)                                                                   |

## Invariant

**The `01 Engagement/04 Where We Are/` pages must always reflect the current state before any commit is made.** They are the recovery point every skill's resume detection reads from (`patterns/session-continuity.md`) — if they lag behind what's actually published, the next session's idempotency check reads stale state and either re-does finished work or skips work still open.
