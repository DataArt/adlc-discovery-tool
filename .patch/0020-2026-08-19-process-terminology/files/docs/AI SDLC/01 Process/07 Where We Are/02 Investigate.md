---
outline: [2, 3]
---

# Where We Are — Investigate

> [!WARNING] Populated During Engagement
> This page is a placeholder until discovery starts. The `@discovery` agent keeps it current as workshops complete, findings land, and gates close.

Everything Gate 1 depends on — workshops, Current State, SDLC Domains, and any Solution Goals drafted early. See [Investigate — Orchestration](../06%20Workflows/03%20Investigate/00%20Orchestration.md) for how these connect.

```mermaid
flowchart LR
    IN["Strategic Intent"] --> WS["Workshops"] --> CS["Current State"] --> PR["Problems"] --> SG["Solution Goals"]

    classDef done fill:#10B981,stroke:#047857,color:#fff
    classDef current fill:#F59E0B,stroke:#B45309,color:#000
    classDef pending fill:#6B7280,stroke:#374151,color:#fff

    class IN,WS,CS,PR,SG pending
```

_TBD — recolor each node green once its section below is fully filled, amber for whichever is currently in progress, grey for not yet started._

## Workshop Snapshot

_TBD — one row per workshop that's actually run. Delete this placeholder row once real rows exist._

| Workshop | Date   | Covered                            |
| -------- | ------ | ---------------------------------- |
| [WS ID]  | [DATE] | [Who was in the room; what landed] |

## Not Yet Covered

_TBD — SDLC Domains, governance stakeholders, or topics no session has reached yet — the gaps a reader should know about before trusting the status below._

- [GAP — e.g. "AI governance — no session has run with Compliance, Security and Procurement present"]

## Status

**Legend**

| Symbol | Meaning                                                         |
| ------ | --------------------------------------------------------------- |
| ⏳     | Not started — not yet scheduled, captured, diagnosed, or shaped |
| 🔄     | In progress — drafted, not yet validated                        |
| ✅     | Done — confirmed                                                |

- **Strategic Intent**: ⏳ Not captured → 🔄 Captured → ✅ Confirmed (validated through Vision)
- **Solution Goals**: ⏳ Not shaped → 🔄 Shaped → ✅ Confirmed (validated with stakeholders) — can't shape until Problems is confirmed

See [Evidence Chain](../04%20Evidence%20Chain.md) for why Solution Goals depends on Problems.

### Strategic Intent

| Item                                                                 | Status          | Last Updated |
| -------------------------------------------------------------------- | --------------- | ------------ |
| [Strategic Intent](/AI%20SDLC/04%20Goals/02%20Strategic%20Intent.md) | ⏳ Not captured | —            |

### Workshops

| Workshop | Item                                                                                                                                               | Status           | Coverage           | Target Date | Last Updated |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------ | ----------- | ------------ |
| WS1      | [Upstream & Design](</AI%20SDLC/02%20Vision/WS%201%20(Upstream%20%26%20Design)%20-%20Date%20TBD/Agenda.md>) — Requirements & Stories · Design & UX | ⏳ Not scheduled | 0/2 SDLC Domains   | [DATE]      | —            |
| WS2      | [Design to Code](</AI%20SDLC/02%20Vision/WS%202%20(Design%20to%20Code)%20-%20Date%20TBD/Agenda.md>) — Technical Design · Implementation            | ⏳ Not scheduled | 0/2 SDLC Domains   | [DATE]      | —            |
| WS3      | [Delivery Mechanics](</AI%20SDLC/02%20Vision/WS%203%20(Delivery%20Mechanics)%20-%20Date%20TBD/Agenda.md>) — DevOps & Pipeline · Ceremony Overhead  | ⏳ Not scheduled | 0/2 SDLC Domains   | [DATE]      | —            |
| WS4      | [People & Context](</AI%20SDLC/02%20Vision/WS%204%20(People%20%26%20Context)%20-%20Date%20TBD/Agenda.md>) — Teams & Integration · Knowledge Base   | ⏳ Not scheduled | 0/2 SDLC Domains   | [DATE]      | —            |
| WS5      | [Baseline & Guardrails](</AI%20SDLC/02%20Vision/WS%205%20(Baseline%20%26%20Guardrails)%20-%20Date%20TBD/Agenda.md>) — Measurement · Governance     | ⏳ Not scheduled | 0/2 SDLC Domains   | [DATE]      | —            |
| WS6      | [Product & Projects](</AI%20SDLC/02%20Vision/WS%206%20(Product%20%26%20Projects)%20-%20Date%20TBD/Agenda.md>) — pilot selection synthesis          | ⏳ Not scheduled | — (synthesis only) | [DATE]      | —            |

### Current State

| Page                                                                                  | Status         | Last Updated |
| ------------------------------------------------------------------------------------- | -------------- | ------------ |
| [Process](/AI%20SDLC/02%20Vision/01%20Current%20State/Process.md)                     | ⏳ Placeholder | —            |
| [Architecture](/AI%20SDLC/02%20Vision/01%20Current%20State/Architecture.md)           | ⏳ Placeholder | —            |
| [Context Topology](/AI%20SDLC/02%20Vision/01%20Current%20State/Context%20Topology.md) | ⏳ Placeholder | —            |
| [AI Adoption](/AI%20SDLC/02%20Vision/01%20Current%20State/AI%20Adoption.md)           | ⏳ Placeholder | —            |
| [Metrics](/AI%20SDLC/02%20Vision/01%20Current%20State/Metrics.md)                     | ⏳ Placeholder | —            |
| [Tool Inventory](/AI%20SDLC/02%20Vision/01%20Current%20State/Tool%20Inventory.md)     | ⏳ Placeholder | —            |

### Problems

Rolls up into the [Problems registry](/AI%20SDLC/03%20Problem%20Space/02%20Diagnose/02%20Problems.md) — one row per [SDLC Domain](/AI%20SDLC/02%20Vision/00%20Overview.md#sdlc-domains), each counting how many Problems have been diagnosed against it so far (can be more than one per domain).

| SDLC Domain                                                                                                     | Status           | Problems Diagnosed | Last Updated |
| --------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------ | ------------ |
| [Requirements & Stories](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/01%20Requirements%20%26%20Stories) | ⏳ Not diagnosed | 0                  | —            |
| [Design & UX](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/02%20Design%20%26%20UX)                       | ⏳ Not diagnosed | 0                  | —            |
| [DevOps & Pipeline](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/03%20DevOps%20%26%20Pipeline)           | ⏳ Not diagnosed | 0                  | —            |
| [Knowledge Base](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/04%20Knowledge%20Base)                     | ⏳ Not diagnosed | 0                  | —            |
| [Teams & Integration](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/05%20Teams%20%26%20Integration)       | ⏳ Not diagnosed | 0                  | —            |
| [Technical Design](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/06%20Technical%20Design)                 | ⏳ Not diagnosed | 0                  | —            |
| [Ceremony Overhead](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/07%20Ceremony%20Overhead)               | ⏳ Not diagnosed | 0                  | —            |
| [Measurement](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/08%20Measurement)                             | ⏳ Not diagnosed | 0                  | —            |
| [Governance](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/09%20Governance)                               | ⏳ Not diagnosed | 0                  | —            |
| [Implementation](/AI%20SDLC/03%20Problem%20Space/03%20SDLC%20Domains/10%20Implementation)                       | ⏳ Not diagnosed | 0                  | —            |

_Coverage = domains past ⏳. "Problems Diagnosed" is the registry count for that domain, not capped at 1 — e.g. a domain could show 2 once two root causes are confirmed against it._

### Solution Goals

| Item                                                             | Status        | Coverage  | Last Updated |
| ---------------------------------------------------------------- | ------------- | --------- | ------------ |
| [Solution Goals](/AI%20SDLC/04%20Goals/03%20Solution%20Goals.md) | ⏳ Not shaped | 0 drafted | —            |

Investigate closes into [Gate Review](../06%20Workflows/02%20Gate%20Review.md) once every Workshop and Current State row is filled, and every Problems row has moved past _TBD_.

→ [01 Engagement](./01%20Engagement.md) for the top-level view. → [03 Solution](./03%20Solution.md) for the next phase.
