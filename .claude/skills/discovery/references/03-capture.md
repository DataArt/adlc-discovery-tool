# Capture — workshop and Current State

Use the requested workshop and supplied material. Otherwise inspect the programme
and coverage in `docs/AI SDLC/02 Capture/00 Overview.md` to recommend the next session.
Existing engagement evidence can support an internal survey draft; distinguish
known facts from questions that still require a workshop.

## Capture the session

Resolve the existing folder beneath `docs/AI SDLC/02 Capture/04 Workshops/`, preserving
its workshop identity. Ask for the subject or source only when missing.

- Prepare/update `Agenda.md` using [agenda](../interfaces/agenda.md) when the session
  has not occurred.
- Process supplied transcript or written answers into `Notes.md` and `Outcomes.md`
  using [notes](../interfaces/notes.md) and [outcomes](../interfaces/outcomes.md).
  Read the agenda to map questions to actual discussion. Extract readable text from
  source documents with the available document tools as needed.
- Preserve `Transcript.md` only when requested, using
  [transcript](../interfaces/transcript.md).

For VitePress, use `[[TOKEN]]` for client identity and `[FILL_ME]` for a genuinely
pending session value; avoid double-curly placeholders in documentation.

## Update evidenced context

When the requested scope and session evidence justify it, apply
[evidence](../interfaces/evidence.md) to the affected pages under
`02 Capture/01 Current State/`. Inhouse Initiatives instead belong under
`02 Capture/02 Inhouse Initiatives/`. Cite the specific workshop/source; an agenda
alone is not observed Current State. Ask if the target or interpretation is unclear.
Capture records practice; [Diagnose](05-diagnose.md) extracts diagnostic Claims for
a specific Problem.

Refresh the programme, coverage, and session links in `02 Capture/00 Overview.md`.
Keep the established domain list and flat table style. Record preparation separately
from a session that actually ran; link only artifacts that exist.

## Complete

Apply [write-confirm](../patterns/write-confirm.md) to the coherent set of changes,
then [satellite-review](../patterns/satellite-review.md) to Current State evidence
updates. Report with [do-report-commit](../patterns/do-report-commit.md): update the
Investigate Workshops row and any affected Current State rows, citing the workshop.
Return changed artifacts, evidence, remaining questions, and readiness for Domains.
