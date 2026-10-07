---
aside: false
outline: false
---

# 3. Every recommendation has a reason

::: tip &#8203;
Trace a proposed change back to the problem, the source, and the intent it serves.
:::

Workshop records preserve what was heard. Derived pages explain what the team concludes and why. Source links and changelogs connect each goal to its diagnosed problem and strategic intent.

| Evidence                      | What it establishes                |
| ----------------------------- | ---------------------------------- |
| **Source citation**           | Where a statement came from.       |
| **Independent corroboration** | Support for a Confirmed problem.   |
| **Measured impact**           | A number backing the impact claim. |

Corrections flow into affected downstream artifacts, keeping the reasoning reviewable as understanding changes.

## The flow

```mermaid
flowchart LR
    IN["🗯️ Strategic Intent\n──────\nLeadership intent\nCaptured upfront, not yet evidenced"]

    subgraph CaptureStage["👁️ Capture — Capture the Current State"]
        direction TB
        WS["Workshops\n──────\nDiagnoses: Challenge + Problem Space\nBaseline: Current State\nValidates: Strategic Intent"]
        CS["Current State\n──────\nProcess\nArchitecture\nContext Topology\nAI Adoption\nMetrics\nTool Inventory\nInhouse Initiatives"]
        WS -->|"shapes"| CS
    end

    PR["❓ Problems\n──────\nProblem Space domains\nRoot causes, evidenced"]

    SG["🎯 Solution Goals\n──────\nGrounded, re-scoped, prioritised\nEvidenced against Problems"]

    SO["🔧 Solution\n──────\nTarget State → Pilot → Scale → Evolve\nCoverage matrix vs Solution Goals + Problems"]

    IN -->|"informs"| WS
    CS -->|"evidences"| PR
    IN -->|"grounded + re-scoped by"| SG
    PR -->|"+"| SG
    SG --> SO

    classDef ws fill:#F59E0B,stroke:#B45309,color:#000
    classDef cs fill:#6366F1,stroke:#4338CA,color:#fff
    classDef pr fill:#EF4444,stroke:#B91C1C,color:#fff
    classDef go fill:#10B981,stroke:#047857,color:#fff
    classDef so fill:#3B82F6,stroke:#1D4ED8,color:#fff

    class WS ws
    class CS cs
    class PR pr
    class IN,SG go
    class SO so

    style CaptureStage fill:#FFFBEB,stroke:#B45309,color:#B45309
```

## Related references

- [Evidence Chain](<../AI SDLC/01 Engagement/03 Process/04 Evidence Chain.md>) — traceability principles and original diagram
- [Problems registry](<../AI SDLC/03 Problem Space/02 Diagnose/02 Problems.md>) — findings, citations, and confidence
- [Solution Goals](<../AI SDLC/04 Goals/03 Solution Goals.md>) — the connection between problems and intent

---

[Presentation](index.md) · [Previous](<02 How the Engagement Runs.md>) · [Next](<04 Collaboration.md>)
