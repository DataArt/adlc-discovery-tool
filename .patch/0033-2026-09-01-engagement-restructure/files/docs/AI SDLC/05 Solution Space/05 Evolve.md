# Evolve

> [!WARNING] Populated During Engagement
> Ideas below are provisional — grounded in [Problem Space](/AI%20SDLC/03%20Problem%20Space/) findings as they mature, not commitments. This page is a starting shape, not a decision.

> Loop what's been learned back into the practice — governance, tooling, and scope all revisited, not just maintained.

---

## Gather Metrics

- Identify what's already accessible as a data source (e.g. issue tracker, VCS history, observability tooling) before instrumenting anything new. See [Problem Space — Measurement](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/08%20Measurement).
- Build on any cost-allocation-per-team work already in progress rather than starting fresh.
- Which metrics, KPIs, and observability tooling actually get instrumented is a `/design` ticket once the gap is confirmed here — not decided on this page. See [Process → Overview, Solution phase](/AI%20SDLC/01%20Engagement/03%20Process/01%20Overview.md#-solution).

## Analyse

- Compare what Pilot and Scale actually moved against the pre-code time-loss hypothesis this engagement started with — is delivery time genuinely shifting, or did the pattern just relocate the bottleneck?
- Watch for usage that isn't analysed until it's already a problem — cost or quota exhaustion with no attribution or warning is the cautionary pattern to design against.

## Dashboards & Reporting

- Spend and usage visible per team and per workload, not aggregated — the cost-attribution question this engagement will surface needs attributable numbers, not a single total.
- A standing reporting cadence, not a one-off readout at the end of the engagement.

## Identify Problems

- AI-generated output reviewed and maintained to the same standard as human-produced work — a quality gain in isolation doesn't matter if the surrounding workflow wasn't restructured. See [Problem Space — Implementation](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/10%20Implementation).
- A standing governance review, re-checked against changing regulation, tooling, and risk posture — not a one-time sign-off at the end of Pilot.

## Reiterate the Solution

- Findings from this phase feed back into [Pilot](./03%20Pilot.md) and [Scale](./04%20Scale.md) — a knowledge-base gap that only shows up at wider scope, a governance control that doesn't hold, a metric that reveals the wrong workload was scaled first.

## Open Questions

- Who owns the standing metrics, reporting, and governance review once the engagement itself ends — Engineering, Security, or a joint function?
- What's the earliest warning sign that a scaled workflow is drifting from its original intent?
- What triggers a full re-run of Pilot for a new workload, versus a smaller adjustment to what's already scaled?
