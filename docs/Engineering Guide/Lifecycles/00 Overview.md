# Harness Bootstrap — Lifecycle Overview

_The four lifecycles, how they interact, and when to use each one._

---

## The four lifecycles

| Lifecycle        | Orchestrator            | Phases                                                                            |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------- |
| **Dev**          | `/dev`                  | Context Gathering → Ceremony → Plan → Implement → Test → Document                 |
| **Design**       | `/design`               | Frame → Research → Evaluate → Solution → Review Gate → Address Feedback → Publish |
| **Evolve**       | `/evolve`               | Reflect → Triage → Validate → Adopt                                               |
| **Architecture** | — (standalone commands) | `/where-we-are` · `/war design` · `/war implementation`                           |

Each orchestrator runs all phases in one session, stopping at every boundary for confirmation. Individual phase commands (`/dev plan`, `/design frame`, etc.) allow resuming mid-flow. Evolve has no orchestrator chaining its stages — each is requested explicitly, based on evidence rather than elapsed time.

---

## When to use which lifecycle

| Situation                                     | Use                                            |
| --------------------------------------------- | ---------------------------------------------- |
| Any ticket — feature, bug fix, chore          | Dev lifecycle always                           |
| Ticket is large, novel, or crosses containers | Design lifecycle first, then Dev               |
| Something surprised you during a ticket       | Evolve lifecycle (Reflect)                     |
| 2–4 pending reflections                       | Evolve lifecycle (Triage)                      |
| End of sprint / before planning               | Architecture lifecycle (`/where-we-are`)       |
| After major HLD changes                       | Architecture lifecycle (`/war design`)         |
| Before a major release                        | Architecture lifecycle (`/war implementation`) |

**Design is optional.** Small, well-understood changes within a single container that introduce no new integrations or architecture decisions — skip Design, go straight to Dev.

---

## Cross-lifecycle invariants

- The AI does not move between phases without explicit developer confirmation.
- No code is written until the plan is approved and the architecture audit passes.
- Documentation is mandatory — tickets are not complete until `/dev document` has run.
- Architecture deviations approved at plan time are tracked through to the Document phase.
- Reflections are not optional ceremony — they are how conventions accumulate.

→ See `Engineering Guide/03 Engineer Role.md` for how engineers and AI divide responsibility within these lifecycles.

---

## Lifecycle interactions

```mermaid
flowchart TB
    TICKET(["🎫 Ticket"]):::ticket

    subgraph DESIGN ["  🎨 Design lifecycle (optional)  "]
        direction LR
        D1["Frame\nproblem + ACs"]:::design --> D2["Research\noptions via {resolved architect agent}"]:::design --> D3["Evaluate\nmatrix + recommend"]:::design --> D4["Solution\ncertainty artifacts"]:::design --> D5["Review Gate\ndraft MR → approval"]:::design --> D6["Address Feedback\n(if concerns raised)"]:::design --> D7["Publish\ndocs → tickets"]:::design
    end

    subgraph DEV ["  🔨 Dev lifecycle  "]
        direction LR
        V0["Context Gathering\nintent + story folder"]:::dev --> V0b["Ceremony\nbranch checkout"]:::dev --> V1["Plan\n+ arch audit"]:::dev --> V2["Implement\nstep-by-step"]:::dev --> V3["Test\n+ PR review"]:::dev --> V4["Document\n+ deviations"]:::dev
    end

    subgraph EVOLVE ["  💡 Evolve lifecycle  "]
        direction TB
        S1["Reflect"]:::skill --> S2["Triage"]:::skill --> SV["Validate"]:::skill --> S3["Adopt"]:::skill
    end

    WAR["🏛️ WAR Audit\n/war design · /war implementation\nIs the architecture sound?"]:::war
    WWA["📊 Where We Are\n/where-we-are\nDesigned vs implemented vs documented"]:::wwa

    TICKET -->|"large / novel"| DESIGN
    DESIGN -->|"Publish creates\nimpl tickets"| DEV
    TICKET -->|"routine"| DEV
    DESIGN -->|"feeds"| WAR
    DEV -->|"feeds"| WWA
    DEV -->|"surprises"| S1
    S3 -->|"updated skills"| DEV
    TICKET2(["🎫 New tickets"]):::ticket
    WAR -.->|"gap tickets"| TICKET2
    WWA -.->|"gap tickets"| TICKET2

    classDef ticket  fill:#2C3E50,stroke:#1A252F,color:#fff
    classDef design  fill:#8E44AD,stroke:#6C3483,color:#fff
    classDef dev     fill:#1A6B3C,stroke:#14532d,color:#fff
    classDef skill   fill:#D97706,stroke:#B45309,color:#fff
    classDef war     fill:#1D4ED8,stroke:#1e3a8a,color:#fff
    classDef wwa     fill:#0E7490,stroke:#0c4a6e,color:#fff
```

---

→ `01 Dev Lifecycle.md` — Context Gathering → Ceremony → Plan → Implement → Test → Document  
→ `02 Design Lifecycle.md` — Frame → Research → Evaluate → Solution → Review Gate → Address Feedback → Publish  
→ `03 Evolve Lifecycle.md` — Reflect → Triage → Validate → Adopt  
→ `04 Architecture Lifecycle.md` — `/where-we-are` · `/war design` · `/war implementation`  
→ `05 Documents Flow.md` — how docs are born, graduate, and reach their permanent home
