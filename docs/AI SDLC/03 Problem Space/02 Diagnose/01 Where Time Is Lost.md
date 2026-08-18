# Where Time Is Lost

_The path one piece of work takes from idea to production, and where the clock runs longest._

> [!WARNING] Populated During Engagement
> This page synthesizes findings gathered across [SDLC Domains](../03%20SDLC%20Domains/) and the discovery workshops. It is a placeholder until that evidence exists.

---

## The Founding Hypothesis

Most delivery time is lost before code is written, not during it — this engagement exists to confirm or refute that, not assume it.

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

## One Task, Idea to Production

_[DESCRIBE THE REPRESENTATIVE TASK — a real, recent, mid-sized piece of work, walked stage by stage. Not an average across all tickets; one concrete example the room will recognise.]_

| Stage                   | Typical Duration | Notes                |
| ----------------------- | ---------------- | -------------------- |
| Idea → Backlog          | [DURATION]       | [NOTES / BOTTLENECK] |
| Refinement & Planning   | [DURATION]       | [NOTES / BOTTLENECK] |
| Design & UX             | [DURATION]       | [NOTES / BOTTLENECK] |
| Technical Design        | [DURATION]       | [NOTES / BOTTLENECK] |
| Build (code generation) | [DURATION]       | [NOTES / BOTTLENECK] |
| Test & Pipeline         | [DURATION]       | [NOTES / BOTTLENECK] |
| Review → Production     | [DURATION]       | [NOTES / BOTTLENECK] |

**Baseline: [TOTAL DURATION] idea to production, against a target of [TARGET DURATION].**

---

## Central Symptom

[DESCRIBE THE CENTRAL SYMPTOM — the observable, measurable delivery problem this engagement exists to diagnose, e.g. lead time, DORA metrics, or another concrete indicator, stuck despite rising AI usage.]

---

The stage-by-stage detail behind this baseline is gathered in [SDLC Domains](../03%20SDLC%20Domains/) — each stage above maps to one or more SDLC Domain pages, which hold the underlying evidence. Named problems drawn from this picture are tracked in [Problems](./02%20Problems.md).

---

## Changelog

_Every change to this page traces to the SDLC Domain page(s) whose evidence moved it — link the source, don't just describe the change._

| Date   | Change         | Evidence                                                                                                                                   |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [DATE] | [WHAT CHANGED] | [SDLC Domain page — e.g. Requirements & Stories](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/01%20Requirements%20%26%20Stories.md) |
