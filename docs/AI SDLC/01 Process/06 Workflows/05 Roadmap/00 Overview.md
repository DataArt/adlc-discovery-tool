# Roadmap

_How an approved Solution turns into a phased delivery plan — the sequence Gate 3 closes on._

```mermaid
sequenceDiagram
    participant Lead as Discovery Team
    participant MS as Milestones
    participant WB as WBS
    participant TC as Team Composition
    participant TL as Timeline
    actor Stake as Stakeholders

    Note over Lead,MS: Given: approved Solution (Target State + Pilot + Scale)
    Lead->>MS: Set accountable, dated milestones
    Lead->>WB: Break each milestone into scoped, sized work items
    Lead->>TC: Define who's needed, by role, per phase
    Lead->>TL: Sequence WBS against milestones + team availability (Gantt)
    Lead->>Stake: Review the phased plan end to end
    Stake-->>Lead: Feedback
    Lead->>TL: Publish + Changelog
    Note over Lead,TL: Gate 3 closed
```

**Milestones.** The accountable, dated commitments; tracked live in [Roadmap — Milestones](/AI%20SDLC/06%20Roadmap/02%20Milestones.md).

**WBS.** Each milestone broken down into scoped, sized work items; see [Roadmap — WBS](/AI%20SDLC/06%20Roadmap/03%20WBS.md).

**Team composition.** Who's needed, by role, per phase; see [Roadmap — Overview](/AI%20SDLC/06%20Roadmap/01%20Overview.md).

**Timeline.** The WBS sequenced against milestones and team availability into a phased schedule (Gantt); see [Roadmap — Timeline](/AI%20SDLC/06%20Roadmap/04%20Timeline.md).

Roadmap is the last workflow in the arc — its output is what [[CLIENT_NAME]] staffs and funds against. From here the engagement's live state is tracked on [Where We Are](../../07%20Where%20We%20Are/01%20Engagement.md), not on this page.
