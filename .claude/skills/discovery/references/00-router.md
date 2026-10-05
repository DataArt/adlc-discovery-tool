# Stage reference router

Routing, resume detection, full-chain sequencing, and completion live in
[SKILL.md](../SKILL.md). Load only the reference needed for the current unit.

| Command       | Reference                              | Produces                                                                        |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| `gate {0-3}`  | [01-gate.md](01-gate.md)               | Gate agenda or session notes/outcomes, package, stakeholder decision and status |
| `investigate` | [02-investigate.md](02-investigate.md) | Session selection, ordered stage calls, coverage assessment                     |
| `capture`     | [03-capture.md](03-capture.md)         | Workshop agenda or notes/outcomes; evidenced Current State updates              |
| `domains`     | [04-domains.md](04-domains.md)         | SDLC Domain updates traced to Current State                                     |
| `diagnose`    | [05-diagnose.md](05-diagnose.md)       | Problems, append-only Claims, Where Gaps Sit heatmap                            |
| `goals`       | [06-goals.md](06-goals.md)             | Early Solution Goals grounded in confirmed Problems and Strategic Intent        |
| `solution`    | [07-solution.md](07-solution.md)       | Manual Target State/Pilot/Scale handoff; not automated completion               |
| `roadmap`     | [08-roadmap.md](08-roadmap.md)         | Manual Milestones/WBS/team/timeline handoff; not automated completion           |

Shared protocols live in [patterns/](../patterns/). Artifact contracts live in
[interfaces/](../interfaces/): [agenda](../interfaces/agenda.md),
[notes](../interfaces/notes.md), [outcomes](../interfaces/outcomes.md),
[transcript](../interfaces/transcript.md), [evidence](../interfaces/evidence.md),
and [status](../interfaces/status.md). Capture and Gate load session contracts as
needed; evidence stages load the evidence contract; reporting loads status.
These interfaces define content and invariants, not fixed document layouts.

In references, `patterns/...` is relative to `.claude/skills/discovery/`.
The root passes the remaining input as `$ARGUMENTS` and records the caller and
entry mode before invoking any nested reference.
