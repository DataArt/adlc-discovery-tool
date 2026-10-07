---
aside: false
outline: false
---

# 2. Progress through evidence and decisions

::: tip &#8203;
Three working phases. Four human checkpoints. A clear next decision.
:::

Investigate establishes supported problems and priorities. Solution defines the target state and pilot. Roadmap turns the approved approach into a plan the client can staff and fund.

**Four gates connect the phases:** Kick-off → Steering Meeting → Solution Approval → Final Sign-off. Each closes on evidenced criteria and recorded stakeholder decisions. The durations in the diagram are planning guidance; new evidence can reopen affected work.

::: info AI support today
`/discovery` guides investigation and gate preparation. Its Solution and Roadmap routes are manual handoffs; solution design uses `/design`.
:::

## The flow

```mermaid
flowchart LR
    G0{{"Kick-off"}}

    subgraph InvestigatePhase["🔍 Investigate — 1–3 weeks"]
        direction TB
        SV["Internal survey pass\n(where DataArt has context)"]
        WS["Workshop loop\n(online / offline)"]
        CS["Current State + SDLC Domains\ncaptured, wired to evidence"]
        SV --> WS --> CS
        CS -.->|"repeat until coverage clear"| WS
    end

    G1{{"Steering Meeting"}}

    subgraph SolutionPhase["🔧 Solution — 1–2 weeks"]
        direction TB
        TS["Target State\ndesign flow"]
        PI["Pilot design\n(/design)"]
        SC["Scale design\n(high level)"]
        TS --> PI --> SC
    end

    G2{{"Solution Approval"}}

    subgraph RoadmapPhase["🗺️ Roadmap — 1 week"]
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

## Related references

- [How the Engagement Runs](<../AI SDLC/01 Engagement/03 Process/03 How the Engagement Runs.md>) — gate criteria and original diagram
- [Where We Are](<../AI SDLC/01 Engagement/04 Where We Are/01 Engagement.md>) — recorded phase, decisions, and next actions

---

[Presentation](index.md) · [Previous](<01 What Is This Tool.md>) · [Next](<03 Evidence Chain.md>)
