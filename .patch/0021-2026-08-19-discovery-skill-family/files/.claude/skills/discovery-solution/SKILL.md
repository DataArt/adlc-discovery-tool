---
name: discovery-solution
metadata:
  version: 0.0.1
description: >
  Solution phase of the discovery engagement (/discovery-solution or /discovery orchestrator). STUB — not yet built out into stage skills.
  Points at the Solution workflow and hands the three flows to the engagement lead to run manually.
---

The engagement lead wants to run a Solution-phase session. Here is their input:

---

## $ARGUMENTS

---

> 🚧 **Stub.** This phase isn't built out into stage skills yet — only Investigate is (`discovery-investigate` and its 4 stage skills). This skill exists so `/discovery`'s phase chain has somewhere to hand off to, and so the eventual build-out (`discovery-solution-target-state`, `discovery-solution-pilot`, `discovery-solution-scale`, mirroring the Investigate stage-skill pattern) has a known slot to land in.

Read `docs/AI SDLC/01 Process/06 Workflows/04 Solution/00 Overview.md` — it defines the three flows this phase covers, in order:

1. **Target State** — given approved Strategic Intent, confirmed Problems, prioritised Solution Goals, evidenced Current State, and any Inhouse Initiative already running, draft `05 Solution Space/02 Target State.md`. Review, wire it to what it addresses, publish.
2. **Pilot solution design** — carve out the one slice of Target State that becomes the pilot workload, then run the existing `/design` skill for it (produces `Architecture.md`/`Design.md`/`Stack.md` in `Target Architecture (HLD)/`). Wire into `05 Solution Space/03 Pilot.md`'s coverage matrix.
3. **Scale design** — same pattern, one level up: given the pilot's proof points, design the extension at a high level. Wire into `05 Solution Space/04 Scale.md`.

Present this to the engagement lead and hand off — do not attempt to run the three flows autonomously. When each flow's artifact is published, update `07 Where We Are/03 Solution.md`'s matching row and append a `05 Report Log.md` row by hand, following `.claude/skills/discovery/pattern-do-report-commit.md`'s shape even though no stage skill enforces it yet.

Gate 2 closes once Target State, Pilot design, and (where run) Scale design are all published and reviewed — report back to `/discovery` once that's true so it can record the gate.
