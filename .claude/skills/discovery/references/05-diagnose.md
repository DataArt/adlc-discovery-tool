# Diagnose

This is the Diagnose part of `01 Engagement/05 Workflows/03 Investigate/03 Problem - Diagnose.md`. Optional — only runs once a domain's evidence points to a root cause.

---

Apply [the evidence interface](../interfaces/evidence.md) to evidence artifacts touched below.

## Step 1 — Identify the evidence and target

Read the SDLC Domain page(s) this Problem draws on (one Problem can cite more than one domain). Read `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md` — is this a new Problem, or does existing evidence update one already in the registry? If new, allocate its ID now (never reused, even if later retracted) — Step 2 needs it.

Follow each SDLC Domain page's own Changelog back to the specific Workshop `Notes.md`/`Outcomes.md` page(s) it cites (not a generic "per discovery" reference — the actual session folder). Those are the documents Step 2 pulls quotes from.

---

## Step 2 — Extract Claims

From the Workshop `Notes.md`/`Outcomes.md` page(s) traced in Step 1, pull the quotes that speak to this Problem — not a transcription of everything in Notes, just what actually supports this root cause. Append one row per quote to `docs/AI SDLC/03 Problem Space/02 Diagnose/03 Claims.md`: Problem = this Problem's ID, Quote copied verbatim (`_"..."_`, matching how it's written in Notes), Workshop = the specific session it came from.

Check the existing ledger first and reuse matching claims; rerunning a session must
not append duplicate Problem/source/quote rows. Validate new rows before appending.
Published Claims rows are never edited afterward — no placeholder pointer, no re-pointing later. A quote that turns out not to support this Problem simply isn't added; it isn't added-then-removed. Two rows citing the same Problem ID from two different workshops is what corroborates it — that's the mechanic behind the status ladder below.

Draft new Claims alongside the Problem and heatmap; confirm this coherent change
set before treating any of it as validated.

---

## Step 3 — Draft / update the Problem

Fields: ID (allocated in Step 1), impact statement — lead with the [Where Gaps Sit](/AI%20SDLC/03%20Problem%20Space/02%20Diagnose/01%20Where%20Gaps%20Sit.md) stage name(s) this slows — source(s), SDLC Domain link(s) — link the specific domain page(s) under `03 SDLC Domains/` this Problem was diagnosed from, not the generic domains-overview anchor.

**Status moves forward only:**

| Status       | Requires                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| 🟡 Reported  | A single source names it                                                                                         |
| 🟢 Confirmed | A second, independent source corroborates it — two `Claims.md` rows on this Problem ID, from different workshops |
| 🔵 Measured  | A number backs the impact claim                                                                                  |
| ⚫ Retracted | It turns out to be wrong — the reason stays on record, ID never reused                                           |

Do not move status past what the current evidence actually supports — most problems in a discovery-scale engagement settle at 🟡 or 🟢; few reach 🔵, and that's expected, not a gap to force-fill. Retracting a Problem doesn't touch its Claims rows — they stay on the ledger as-written, pointing at an ID now marked Retracted on the registry.

Engagement-lead agreement alone does not supply a second independent source.

---

## Step 4 — Refresh the Where Gaps Sit heatmap

Read `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Gaps Sit.md`'s Problem Density Heatmap. This Problem's **Impact on delivery speed** field names the stage(s) it slows — update that row (or rows, if it names more than one): add/move the Problem's ID and status dot, adjust Dominant Gap Type if this shifts it, add the Claims IDs from Step 2. If the Problem was retracted, remove its ID from every row it appeared in. Re-check the "Where it's worst" line still names the actual highest-density stage(s) after this change.

Apply `.claude/skills/discovery/patterns/write-confirm.md`.

---

## Step 5 — Satellite review

Apply `.claude/skills/discovery/patterns/satellite-review.md` — this is the checkpoint most likely to catch a premature status move (Confirmed on one source) or a Claims quote that doesn't actually match Notes.

---

## Step 6 — Do → Report → Commit

Apply `.claude/skills/discovery/patterns/do-report-commit.md`:

- Changelog row on `02 Problems.md`, on `03 Claims.md` for the new rows, and on `01 Where Gaps Sit.md` for the heatmap refresh
- `01 Engagement/04 Where We Are/02 Investigate.md`: the matching SDLC Domain row's "Problems Diagnosed" count and Last Updated
- `05 Report Log.md`: one row citing the domain evidence that triggered it
- Commit: `docs(problem-space): <what changed>`

Return to the caller after the reporting pattern completes.

---

## Further validation

When new session evidence changes the picture, update the diagnosis. A stable
validation pass is evidence of readiness for Goals; repeated assistant rewrites
are not additional sources or validation sessions.

→ `discovery goals` for how a confirmed Problem turns into a grounded goal.
