# Evolve

> [!NOTE] Draft
> Ideas to test and refine as Problem Space findings mature, not commitments.

> Loop what's been learned back into the practice — governance, tooling, and scope all revisited, not just maintained.

---

## Gather Metrics

- Commit velocity, story cycle time, and PR cycle time are typically accessible data sources — an observability platform, the requirements tracker, and Git host history — not new instrumentation. See [Problem Space — Measurement](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/08%20Measurement).
- [If [[CLIENT_NAME]] already has AI-cost-allocation-per-team work in progress, name it here] — Evolve-phase metrics gathering builds on this rather than starting fresh.
- Which metrics, KPIs, and observability tooling actually get instrumented is a `/design` ticket once the gap is confirmed here — not decided on this page. See [Process → Overview, Solution phase](/AI%20SDLC/01%20Engagement/03%20Process/01%20Overview.md#-solution).

## Analyse

- Compare what Pilot and Scale actually moved against the pre-code time-loss hypothesis this engagement started with — is delivery time genuinely shifting, or did the pattern just relocate the bottleneck?
- [If a captured example exists of usage not being analysed until it became a problem — e.g. a tool-credit overrun with no attribution or warning — cite it here as the cautionary example.]

## Dashboards & Reporting

- Spend and usage visible per team and per workload, not aggregated — the leadership cost conversation this engagement flagged early needs attributable numbers, not a single total.
- A standing reporting cadence, not a one-off readout at the end of the engagement.

## Identify Problems

- AI-generated code reviewed and maintained to the same standard as hand-written code, informed directly by the PR review bottleneck findings — quality improved, throughput didn't, because the surrounding workflow wasn't restructured. See [Problem Space — Implementation](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/10%20Implementation).
- A standing governance review, re-checked against changing regulation, tooling, and risk posture — not a one-time sign-off at the end of Pilot.

## Reiterate the Solution

- Findings from this phase feed back into [Pilot](./03%20Pilot/01%20Overview.md) and [Scale](./04%20Scale.md) — a knowledge-base gap that only shows up at wider scope, a governance control that doesn't hold, a metric that reveals the wrong workload was scaled first.

## Open Questions

- Who owns the standing metrics, reporting, and governance review once the engagement itself ends — Engineering, Security, or a joint function?
- What's the earliest warning sign that a scaled workflow is drifting the way the PR review pilot did?
- What triggers a full re-run of Pilot for a new workload, versus a smaller adjustment to what's already scaled?
