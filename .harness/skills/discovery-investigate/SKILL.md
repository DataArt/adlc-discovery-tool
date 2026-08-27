---
name: discovery-investigate
metadata:
  version: 0.1.0
description: >
  Investigate phase of the discovery engagement (/discovery-investigate or /discovery orchestrator).
  Loops Capture → Problem (SDLC Domains → Diagnose) → Goals per-domain until Problem Space coverage is clear, per 01 Process/07 Workflows/03 Investigate/00 Orchestration.md.
---

The engagement lead wants to run an Investigate-phase session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🔁 **Session continuity** (`{{skills_root}}/discovery/pattern-session-continuity.md`): if resuming after context compaction, re-read this full SKILL.md before doing anything. When a session is done, re-read `{{skills_root}}/discovery/SKILL.md` and resume the root orchestrator.

Investigate has no fixed step count — per `01 Process/07 Workflows/03 Investigate/00 Orchestration.md` it loops its 4 workflow parts, per SDLC Domain, until every domain clears its placeholder and Strategic Intent holds steady. This skill is invoked once per **session** (one workshop, one diagnose pass, one early Solution Goals draft) — not run once top-to-bottom.

---

## Step 1 — Read current coverage

Read `docs/AI SDLC/01 Process/06 Where We Are/02 Investigate.md` in full: the Workshops table, the Current State table, the per-domain Problems table, and the Solution Goals row. This is the coverage snapshot everything below routes off of.

---

## Step 2 — Determine what this session is

Ask, unless `$ARGUMENTS` already makes it obvious:

> "What is this session? **(a)** run/process a workshop, **(b)** update an SDLC Domain from new Current State evidence, **(c)** diagnose/update a Problem from domain evidence, **(d)** draft an early Solution Goal from a confirmed Problem, or **(e)** not sure — show me the gaps and suggest one."

**Stop and wait.** If **(e)**, list the specific gaps from Step 1 (which domains are still `⏳`, which have a Problem but no Solution Goal draft) and recommend the highest-leverage next session before asking again.

---

## Step 3 — Run the matching stage skill

| Session type                  | Stage skill                                   |
| ----------------------------- | --------------------------------------------- |
| (a) Workshop                  | `discovery-investigate-capture-current-state` |
| (b) SDLC Domain update        | `discovery-investigate-problem-sdlc-domains`  |
| (c) Diagnose/update a Problem | `discovery-investigate-problem-diagnose`      |
| (d) Early Solution Goal       | `discovery-investigate-goals-solution-goals`  |

Follow that skill exactly. Each stage skill applies its own `pattern-do-report-commit.md` (Changelog → `02 Investigate.md` row → `05 Report Log.md` row → commit) — do not duplicate that reporting here.

A single real-world session often chains stages — a workshop with enough signal to also move an SDLC Domain page. After the stage skill returns, ask:

> "Does this session's evidence also move the next stage? (e.g. does this Current State update give an SDLC Domain something to diagnose against?)"

If yes, run the next matching stage skill in the same session, in order (Capture → Problem/SDLC Domains → Problem/Diagnose → Goals) — never skip backward.

---

## Step 4 — Coverage check

Apply `{{skills_root}}/discovery/pattern-coverage-check.md`.

- **Not clear** — report the specific remaining gaps, apply `pattern-announce-progress.md`, then: "Run another session now, or stop here and resume later with `/discovery-investigate`?"
- **Clear** — report coverage complete, apply `pattern-announce-progress.md`: `"📋 After this phase: Gate Review"`, then re-read `{{skills_root}}/discovery/SKILL.md` and resume the root orchestrator at Gate 1.

---

## Reiterate paths

If a later gate flags an item that traces back to Investigate (per `07 Workflows/02 Gate Review.md`'s loop-back note), re-enter at Step 2 with the flagged item as the session subject — same stage skills, same reporting, no special "correction mode."
