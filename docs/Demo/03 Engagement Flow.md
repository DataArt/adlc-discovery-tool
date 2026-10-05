---
aside: false
outline: [2, 3]
---

# Engagement flow

[Presentation index](index.md) · [Previous](<02 Tool Capabilities.md>) · [Next](<04 Evidence Chain.md>)

**Agenda section 3, first part · Suggested slide 5**

## Audience takeaway

An engagement moves through Investigate, Solution, and Roadmap, with evidence and review decisions controlling progression.

## Three phases, four gates

```mermaid
flowchart LR
    G0{{"Kick-off"}}

    subgraph InvestigatePhase["🔍 Investigate"]
        direction TB
        SV["Internal survey pass\n(where DataArt has context)"]
        WS["Workshop loop\n(online / offline)"]
        CS["Current State + SDLC Domains\ncaptured, wired to evidence"]
        SV --> WS --> CS
        CS -.->|"repeat until coverage clear"| WS
    end

    G1{{"Steering Meeting"}}

    subgraph SolutionPhase["🔧 Solution"]
        direction TB
        TS["Target State\ndesign flow"]
        PI["Pilot design\n(/design)"]
        SC["Scale design\n(high level)"]
        TS --> PI --> SC
    end

    G2{{"Solution Approval"}}

    subgraph RoadmapPhase["🗺️ Roadmap"]
        direction TB
        MS["Milestones"]
        WB["WBS"]
        TL["Timeline"]
        MS --> WB --> TL
    end

    G3{{"Final Sign-off"}}

    G0 --> InvestigatePhase --> G1 --> SolutionPhase --> G2 --> RoadmapPhase --> G3

    classDef gate fill:#F59E0B,stroke:#B45309,color:#000
    classDef investigate fill:#8B5CF6,stroke:#5B21B6,color:#fff
    classDef solution fill:#6366F1,stroke:#4338CA,color:#fff
    classDef roadmap fill:#3B82F6,stroke:#1D4ED8,color:#fff

    class G0,G1,G2,G3 gate
    class SV,WS,CS investigate
    class TS,PI,SC solution
    class MS,WB,TL roadmap

    style InvestigatePhase fill:#F5F3FF,stroke:#8B5CF6,color:#6D28D9
    style SolutionPhase fill:#EEF2FF,stroke:#6366F1,color:#4338CA
    style RoadmapPhase fill:#EFF6FF,stroke:#3B82F6,color:#1D4ED8
```

Source: [How the Engagement Runs](<../AI SDLC/01 Engagement/03 Process/03 How the Engagement Runs.md>). Diagram reused with duration labels omitted; indicative durations remain in the presentation index.

**Caption:** Each phase is opened by a gate and closed by the next one.

**Reveal order:** Kickoff and intent → Investigate and findings → Solution and designs → Roadmap and delivery commitments.

## Speaker script and review decisions

| Phase       | Main question                                                             | Closing decision                                                                 |
| ----------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Investigate | What is happening, which problems are evidenced, and what should improve? | Gate 1: agree on findings and prioritized solution goals                         |
| Solution    | What approach addresses those problems and goals?                         | Gate 2: approve target-state and pilot designs, plus scale design where included |
| Roadmap     | What will delivery require, and in what sequence?                         | Gate 3: sign off milestones, work breakdown, team composition, and timeline      |

### Presenter narrative

> We begin with Gate 0, the kickoff. We capture and review strategic intent and an early direction. That gives discovery a starting point, while keeping early ideas open to validation.
>
> Investigate establishes the current state, diagnoses problems, and develops solution goals. Workshops help us fill gaps and test interpretations. We may need several passes before the findings are ready for review.
>
> Solution develops the target approach and pilot design. Roadmap establishes the sequence of work, dependencies, and team needed to deliver it.
>
> The gates make the decisions explicit. We move forward when the required material has been reviewed and the closing criteria are met. The calendar helps us plan, but the evidence and agreement determine readiness.

## What a workshop feeds

```mermaid
flowchart LR
    WS["Workshop cycle\n(Capture)"] --> CS["Current State\n(Capture)"] --> DOM["SDLC Domains\n(Problem)"] --> DG["Diagnose\n(Problem)"] --> SG["Solution Goals\n(Goals)"]
    IN["Strategic Intent\n(Goals)"] -.->|"grounds"| SG

    classDef step fill:#8B5CF6,stroke:#5B21B6,color:#fff
    classDef intent fill:#F59E0B,stroke:#B45309,color:#000

    class WS,CS,DOM,DG,SG step
    class IN intent
```

Source: [Investigate Orchestration](<../AI SDLC/01 Engagement/05 Workflows/03 Investigate/00 Orchestration.md>). Diagram reused with duration labels omitted; indicative durations remain in the presentation index.

**Caption:** A workshop can update several connected artifacts. Each downstream step uses the evidence assembled upstream.

**Optional talking point:** “We repeat the investigation loop until coverage is clear. We may revisit an item when new evidence changes the diagnosis.”

## Transition to the evidence chain

> That tells us when we review. Now let’s look at what makes the work reviewable: the connections between a source, a finding, and a decision.

---

[Presentation index](index.md) · [Previous](<02 Tool Capabilities.md>) · [Next](<04 Evidence Chain.md>)
