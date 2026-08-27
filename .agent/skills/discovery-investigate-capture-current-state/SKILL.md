---
name: discovery-investigate-capture-current-state
metadata:
  version: 0.1.0
description: >
  Capture stage of Investigate (/discovery-investigate-capture-current-state or /discovery-investigate router).
  Turns a workshop cycle into Notes, Outcomes, and — once there's enough signal — an updated Current State page. Produces docs/AI SDLC/02 Capture/ artifacts.
---

The engagement lead wants to run a Capture — Current State session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🔁 **Session continuity** (`{{skills_root}}/discovery/pattern-session-continuity.md`): if resuming after context compaction, re-read this full SKILL.md before doing anything. When done, re-read `{{skills_root}}/discovery-investigate/SKILL.md` and resume from there.

This is the Capture stage of `01 Process/07 Workflows/03 Investigate/01 Capture - Current State.md`. It has two independent halves — running/processing a workshop, and (optionally, only when that workshop justifies it) updating Current State.

---

## Step 1 — Identify the workshop

Read `docs/AI SDLC/02 Capture/00 Overview.md`'s coverage tracker.

- If `$ARGUMENTS` names a workshop (e.g. "WS3"), use it.
- Otherwise, if DataArt already has context for an unrun workshop, offer the internal survey pass first: synthesize past engagement notes/artifacts into a working draft (confirmed / open / needs a workshop) before presenting it.
- Otherwise, present the next unscheduled/unrun workshop from the tracker and confirm.

---

## Step 2 — Capture

Ask what this session is processing:

> "Do you have a transcript or written answers to process into Notes, or are we drafting the Agenda for a session that hasn't run yet?"

**If Agenda** — follow `.claude/templates/workshops/Agenda.md`'s structure exactly (Header → Session Flow → Opening → per-topic Survey sections → Closing), ≤2 hours total, one SDLC Domain per topic. Skip the Opening's recap for WS1 (nothing to validate yet). Write to `04 Workshops/WS N (Title) - [Date]/Agenda.md`. Apply `{{skills_root}}/discovery/pattern-write-confirm.md`.

**If Notes/Outcomes** — process per the pipeline:

1. Extract raw text if source is `.docx` (`textutil -convert txt -stdout` on macOS, or unzip + parse `word/document.xml`)
2. If asked to preserve the raw transcript verbatim, follow `.claude/templates/workshops/Transcript.md`'s rules exactly (verbatim only — paragraph breaks and speaker headers are the only edits) and save to `04 Workshops/WS N (Title) - [Date]/Transcript.md`
3. Read `Agenda.md` for topic structure and survey questions
4. Map transcript content to topics chronologically; for each topic reached, answer each survey question with transcript evidence
5. Synthesise the key question answer per topic — don't copy-paste
6. Note unanswered survey questions as carry-forwards
7. Extract concrete numbers into a Key Numbers table; distil Key Themes
8. Write `Notes.md` following `.claude/templates/workshops/Notes.md` exactly — no names (org role only), use the workshop's actual naming ("WS 1 (Upstream & Design)", not "Workshop 1"), full-name-then-abbreviation on first use, verbatim quotes as `_"..."_`, status indicators (🟢🟡🔵⚫), update the Topic Coverage table
9. Update `Outcomes.md` incrementally per `.claude/templates/workshops/Outcomes.md` (Summary, SDLC Domains & Topics live mindmap, Findings per domain, Next Steps)

**VitePress rule**: `[[TOKEN]]` for client-identity placeholders is safe; `[FILL_ME]` for per-session values filled live; never `{{ }}` anywhere under `docs/`.

Apply `{{skills_root}}/discovery/pattern-write-confirm.md` for `Notes.md`/`Outcomes.md`.

---

## Step 3 — Update `00 Overview.md`

Update the Workshop Programme table, Coverage tracker, and Workshops table (Agenda/Notes/Outcomes/Transcript links). The SDLC Domains list itself never changes — only workshop grouping and coverage status do. No `★`, bold rows, or changelog footnotes — flat formatting.

---

## Step 4 — Current State (optional this pass)

Only proceed if this session surfaced enough signal to justify it — not every workshop moves a Current State page. Ask:

> "Does this session's evidence justify updating Current State? If so, which page(s) — Process, Architecture, Context Topology, AI Adoption, Metrics, Tool Inventory, or Inhouse Initiatives?"

If yes: draft/update the named page(s) under `docs/AI SDLC/02 Capture/01 Current State/`, wired to this workshop specifically (not a generic citation). Apply `{{skills_root}}/discovery/pattern-write-confirm.md`.

---

## Step 5 — Satellite review

Apply `{{skills_root}}/discovery/pattern-satellite-review.md` to any Current State page touched in Step 4 (skip if Step 4 didn't run — Notes/Outcomes/Agenda aren't evidence artifacts themselves, nothing to check yet).

---

## Step 6 — Do → Report → Commit

Apply `{{skills_root}}/discovery/pattern-do-report-commit.md`:

- Changelog row on whichever pages changed (Current State pages carry their own `## Changelog`)
- `06 Where We Are/02 Investigate.md`: update the Workshops row (Status, Coverage, Last Updated) and, if Step 4 ran, the Current State row(s)
- `05 Report Log.md`: one row citing this workshop
- Commit: `docs(ws{N}): <what changed>` per `09 Contribution/01 Team Collaboration.md`

**Stop and wait** for commit confirmation, then re-read `{{skills_root}}/discovery-investigate/SKILL.md` per session continuity.

→ `discovery-investigate-problem-sdlc-domains` for how this evidence turns into a diagnosed domain, if this session's evidence reaches that far.
