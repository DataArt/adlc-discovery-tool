# Solution

> 🚧 **Stub.** This phase isn't built out into stage references yet — only Investigate is (`discovery investigate` and its 4 stage references). This reference exists so `/discovery`'s phase chain has somewhere to hand off to, and so the eventual build-out (future Target State, Pilot, and Scale references) has a known slot to land in.

Read `docs/AI SDLC/01 Engagement/05 Workflows/04 Solution/00 Overview.md` — it defines the three flows this phase covers, in order:

1. **Target State** — given approved Strategic Intent, confirmed Problems, prioritised Solution Goals, evidenced Current State, and any Inhouse Initiative already running, draft `05 Solution Space/02 Target State.md`. Review, wire it to what it addresses, publish.
2. **Pilot solution design** — carve out the one slice of Target State that becomes the pilot workload, then run the existing `/design` skill for it (produces `Architecture.md`/`Design.md`/`Stack.md` at the locations selected by `/design`, recorded in its report). Wire into `05 Solution Space/03 Pilot.md`'s coverage matrix.
3. **Scale design** — same pattern, one level up: given the pilot's proof points, design the extension at a high level. Wire into `05 Solution Space/04 Scale.md`.

Present this to the engagement lead and hand off — do not attempt to run the three flows autonomously. When each flow's artifact is published, update `01 Engagement/04 Where We Are/03 Solution.md`'s matching row and append a `05 Report Log.md` row by hand, following `.claude/skills/discovery/patterns/do-report-commit.md`'s shape even though no stage reference enforces it yet.

When substantive artifacts and their reviews are ready, report readiness for
`/discovery gate 2`. Gate closure still requires the actual stakeholder outcome
recorded by [the gate reference](01-gate.md). A direct invocation ends here.
