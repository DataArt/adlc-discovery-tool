# Pattern: Write-Confirm

Applies whenever a discovery stage skill writes or updates an artifact (Agenda, Notes, Outcomes, a Current State page, an SDLC Domain page, a Problem, a Solution Goal) and the engagement lead must validate it before anything downstream happens — the satellite review, the Where We Are refresh, and the commit all come after this, not instead of it.

## The loop

For each artifact:

1. Write or update the file
2. Present the change — what file, what section, what changed
3. Ask for review: "Please review `<file>` and confirm it looks correct before I move on."
4. **STOP** — do not run satellite review or Do → Report → Commit yet
5. Wait for explicit confirmation, or apply requested edits and re-present
6. Proceed only after confirmation

## Why

The engagement lead is the one with the actual workshop context, transcript, or stakeholder relationship — an artifact that reads plausibly but misrepresents what was actually said is exactly the kind of error `pattern-satellite-review.md`'s evidence-chain check won't catch (it checks citation and wiring, not whether the citation is factually accurate). This checkpoint is what catches that, before it's committed and before it becomes something a later gate has to flag and unwind.
