# Pattern: Session Continuity

Applies to every skill in the `discovery` family — the root (`discovery`), every phase skill (`discovery-investigate`, `discovery-solution`, `discovery-roadmap`), and every stage skill beneath them (`discovery-investigate-vision-current-state`, etc.).

## On entry (top of each skill)

> 🔁 **Session continuity:** If this skill is resuming after context compaction, re-read this full SKILL.md before doing anything. The per-step protocol is non-negotiable and must be followed even if the skill that invoked you is no longer in context.

## On exit (end of each skill)

When this skill's unit of work is complete, re-read the SKILL.md of **whichever skill invoked you** and resume from there:

- A stage skill (e.g. `discovery-investigate-goals-solution-goals`) re-reads its phase skill (`discovery-investigate`).
- A phase skill re-reads the root (`discovery`).
- The root has no parent — it re-reads `docs/AI SDLC/01 Process/07 Where We Are/01 Engagement.md` to re-establish where the engagement stands.

This makes the chain self-healing after compaction, three levels deep — nobody needs to be manually re-invoked just because context was trimmed.

## Why

Discovery isn't a ticket that runs top-to-bottom once and archives — it's a standing engagement worked in short, separated sessions over weeks (one workshop, one diagnose pass, one gate review at a time). Compaction between sessions is the normal case, not the exception. Without an explicit bubble-up instruction at each of the three levels, a stage skill finishes its unit of work and stops, with nothing prompting the phase or root skill to pick the thread back up.
