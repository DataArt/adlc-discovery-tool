# Engagement status interface

Use for the standing pages under `docs/AI SDLC/01 Engagement/04 Where We Are/`.
These pages are the durable report; do not create a per-ticket report or duplicate
state file. Preserve the existing gate table, phase coverage rows, and log schema.

Each changed status needs its supporting artifact or decision, actual update date,
and any blocker or next action. Record unfinished session work precisely enough to
resume the requested unit and step. Reopened items retain their historical decision
and identify downstream readiness that needs revalidation.

Append to `05 Report Log.md` with date, what changed, and the source Changelog,
workshop, or gate outcome that triggered it. Apply the page mapping and commit
sequence in `patterns/do-report-commit.md`. A prepared agenda, placeholder artifact,
or manual handoff is not phase completion or gate approval.

The next session should be able to establish what is complete, why, and what to do
next from these pages and their cited evidence without replaying the conversation.
