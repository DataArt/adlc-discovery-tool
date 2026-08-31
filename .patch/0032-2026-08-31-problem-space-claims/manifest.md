# Patch 0032 — problem-space-claims

## Summary

Adds a **Claims** page under Problem Space / Diagnose (`Problem | Quote | Workshop`, append-only) so multiple workshop sources can corroborate the same diagnosed Problem instead of fragmenting into near-duplicate findings. Corrects `Where Gaps Sit`, which previously claimed Problems were "drawn from" it — it's now an explicit Problem-density heatmap rolled up from Problems, which are diagnosed from SDLC Domain evidence with supporting quotes extracted into Claims: **Claims → Problems → Where Gaps Sit**.

Claims extraction lives entirely in `discovery-investigate-problem-diagnose` (it traces an SDLC Domain page's Changelog citations back to the originating Workshop `Notes.md`/`Outcomes.md` and pulls the supporting quotes from there), not in `discovery-investigate-capture-current-state` — this keeps Capture's job to faithfully record and Diagnose's job to judge what's diagnostically significant. A Claims row is born already pointed at a Problem ID and is never edited afterward; there is no placeholder/re-pointing state.

`discovery-investigate-problem-diagnose` gained two new steps (Extract Claims; Refresh the Where Gaps Sit heatmap) between drafting the Problem and the satellite review, and its Do → Report → Commit list now also touches `03 Claims.md` and `01 Where Gaps Sit.md`. `pattern-satellite-review.md`'s trigger list and its Status-ladder/Wiring checks were extended to cover Claims rows (independence of the corroborating workshop; quote actually appears in the cited Notes). The Investigate-phase process docs (`00 Orchestration.md`, `01 Capture - Current State.md`, `03 Problem - Diagnose.md`) and the `Where We Are — Investigate` tracker were updated to match — these had gone stale in an earlier pass of this same feature (Claims briefly lived in Capture before being moved to Diagnose) and are included here already corrected.

## Added

- `docs/AI SDLC/03 Problem Space/02 Diagnose/03 Claims.md`

## Updated

- `.harness/skills/discovery-investigate-capture-current-state/SKILL.md`
- `.harness/skills/discovery-investigate-problem-diagnose/SKILL.md`
- `.harness/skills/discovery/pattern-satellite-review.md`
- `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/00 Orchestration.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/01 Capture - Current State.md`
- `docs/AI SDLC/01 Process/07 Workflows/03 Investigate/03 Problem - Diagnose.md`
- `docs/AI SDLC/03 Problem Space/01 Overview.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/01 Where Gaps Sit.md`
- `docs/AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md`
- `docs/AI SDLC/03 Problem Space/index.md`

## Renamed

None.

## Deleted

None.

## Omitted (generated, do not carry in patch)

- `.agents/skills/discovery-investigate-capture-current-state/SKILL.md`
- `.agents/skills/discovery-investigate-problem-diagnose/SKILL.md`
- `.agents/skills/discovery/pattern-satellite-review.md`
- `.claude/skills/discovery-investigate-capture-current-state/SKILL.md`
- `.claude/skills/discovery-investigate-problem-diagnose/SKILL.md`
- `.claude/skills/discovery/pattern-satellite-review.md`

These are provider projections of the `.harness/skills/**` sources included above — reproducible with `yarn harness:generate`, not portable content.

> Contains canonical harness changes. After applying, regenerate provider projections with `yarn harness:generate`.
