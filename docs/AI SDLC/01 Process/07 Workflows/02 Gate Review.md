# Gate Review

_A manual session, online or offline — how Investigate's output gets presented, approved, and scored. The checkpoint Gate 1 closes on._

```mermaid
sequenceDiagram
    participant Lead as Discovery Team
    actor Stake as Stakeholders
    participant PR as Problems
    participant SG as Solution Goals
    participant SI as Strategic Intent

    Note over Lead,Stake: Manual — online or offline
    Lead->>Stake: Present consolidated findings — Problems + Current State + draft Solution Goals
    Stake-->>Lead: Approve, or flag concerns

    rect rgb(239, 246, 255)
    Note over Lead,SG: Align and prioritise
    Lead->>PR: Align Problems against each other, rank by impact
    Lead->>SG: Align Solution Goals against Problems, prioritise
    end

    rect rgb(255, 251, 235)
    Note over Lead,SI: Score fit
    Lead->>SI: Map each Solution Goal's fit against Strategic Intent
    SI-->>Lead: e.g. "80% fit; 3 items flagged for re-evaluation"
    end

    alt Findings hold, fit is acceptable
        Lead->>PR: Mark Confirmed + Changelog
        Lead->>SG: Mark Confirmed + Changelog
        Note over Lead,SG: Gate 1 closed — unlocks the Solution workflow
    else Items flagged
        Lead-->>Lead: Re-open the flagged item at whichever stage or phase originated it
        Note over Lead: Reprocesses forward through every layer downstream of it — justified by the evidence that raised it, not opinion
    end
```

**Present.** Manual, online or offline — a session, not an async approval. Findings come as one consolidated package, not a scatter of pages — the confirmed Problems, the Current State they're evidenced from, and any Solution Goals already drafted mid-Investigate. Stakeholders see the same evidence trail [04 Evidence Chain](../04%20Evidence%20Chain.md) describes, not a summary of it.

**Align and prioritise.** Problems get ranked by impact on delivery speed. Solution Goals get checked against the Problems that evidence them — a goal with no diagnosed problem behind it doesn't survive this step.

**Score fit.** Every surviving Solution Goal gets mapped back to the [Strategic Intent](/AI%20SDLC/04%20Goals/02%20Strategic%20Intent.md) it traces to — how much of what leadership originally asked for is actually evidenced and achievable (e.g. "80% fit; 3 items need re-evaluation"). This is where Strategic Intent formally becomes Solution Goals, per [Process Grain](../01%20Overview.md#process-grain).

> [!IMPORTANT] Any stage or phase can be revisited, not just Investigate
> Gate Review isn't a one-way door. A flagged item re-opens at whichever stage or phase actually originated it — Intent, Vision, Problem, Goals, even a prior Gate Review — and reprocesses forward through every layer downstream of it, the same evidence-driven correction [How the Engagement Runs](../03%20How%20the%20Engagement%20Runs.md) describes for any gate. What can't happen is a revision with no evidence behind it; the Changelog row is where that justification gets recorded, not just the fact that something changed.

Gate Review closing is what unlocks the [Solution workflow](./04%20Solution/00%20Overview.md) — Target State, Pilot, and Scale are all specified against the Problems and Solution Goals this gate confirms.
