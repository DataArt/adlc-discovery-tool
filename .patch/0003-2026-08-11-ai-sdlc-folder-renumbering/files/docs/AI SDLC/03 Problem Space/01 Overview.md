# Problem Space

_Gate 0.1 findings: the central symptom, its root causes, and the open questions that must be answered before solution design begins._

> [!WARNING] Populated During Engagement
> This page synthesizes findings gathered across [Current State](./Current%20State/) and the discovery workshops. It is a placeholder until that evidence exists.

---

## SDLC Time Distribution

The founding hypothesis this engagement tests: most delivery time is lost before code is written, not during it.

```mermaid
flowchart LR
    subgraph PreCode["Pre-Code Phase — hypothesised majority of delivery time"]
        direction TB
        R[Requirements]
        D[Design & UX]
        IA[Impact Analysis]
        RP[Refinement & Planning]
        R --> D --> IA --> RP
    end
    subgraph CodePhase["Code Phase — where AI investment has typically gone first"]
        direction TB
        CG[Code Generation]
        TP[Test & Pipeline]
        CG --> TP
    end
    PROD[Production]

    PreCode --> CodePhase --> PROD

    classDef preCodeNode fill:#EF4444,stroke:#B91C1C,color:#fff
    classDef codeNode fill:#3B82F6,stroke:#1D4ED8,color:#fff
    classDef prodNode fill:#10B981,stroke:#047857,color:#fff

    class R,D,IA,RP preCodeNode
    class CG,TP codeNode
    class PROD prodNode

    style PreCode fill:#FEF2F2,stroke:#B91C1C,color:#B91C1C
    style CodePhase fill:#EFF6FF,stroke:#1D4ED8,color:#1D4ED8
```

---

## Root Cause Landscape

_Populated once root causes are confirmed — the diagram below is a shape to fill in, not a fixed count. Six is illustrative._

```mermaid
flowchart TD
    S["Symptom: [DESCRIBE THE CENTRAL SYMPTOM]"]

    C1["[Root cause 1]"]
    C2["[Root cause 2]"]
    C3["[Root cause 3]"]

    C1 --> S
    C2 --> S
    C3 --> S

    classDef symptom fill:#EF4444,stroke:#B91C1C,color:#fff
    classDef cause fill:#8B5CF6,stroke:#6D28D9,color:#fff

    class S symptom
    class C1,C2,C3 cause
```

---

## Central Symptom

[DESCRIBE THE CENTRAL SYMPTOM — the observable, measurable delivery problem this engagement exists to diagnose, e.g. lead time, DORA metrics, or another concrete indicator, stuck despite rising AI usage.]

---

## Root Causes

| #   | Root cause   | Evidence   | Why it matters   |
| --- | ------------ | ---------- | ---------------- |
| 1   | [ROOT CAUSE] | [EVIDENCE] | [WHY IT MATTERS] |

---

## Open Questions

- [OPEN QUESTION]

---

Supporting evidence for the root causes above is gathered in [Current State](./Current%20State/) — [[CLIENT_NAME]]'s existing AI initiative and bottom-up team pain-point data.
