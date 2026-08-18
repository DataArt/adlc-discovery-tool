# Tool Inventory (Current State)

> [!WARNING] Populated During Engagement
> This page is a placeholder until current-state tooling evidence exists. It adds no new evidence of its own — every row here should already be findable in [Process](./Process.md), [Architecture](./Architecture.md), [Context Topology](./Context%20Topology.md), [AI Adoption](./AI%20Adoption.md), [Metrics](./Metrics.md), or [Inhouse Initiatives](/AI%20SDLC/02%20Vision/02%20Inhouse%20Initiatives/Overview.md). This is a reorganization by tool identity, not new discovery.

A consolidated, tool-by-tool inventory of what [[CLIENT_NAME]] runs today — not the target stack, not recommendations. Facts here are reorganized from [Process](./Process.md), [Architecture](./Architecture.md), [Context Topology](./Context%20Topology.md), [AI Adoption](./AI%20Adoption.md), [Metrics](./Metrics.md), and [Inhouse Initiatives](/AI%20SDLC/02%20Vision/02%20Inhouse%20Initiatives/Overview.md); this page adds no new evidence, only a single index by tool identity.

_Sources: TBD — list the workshop sessions and SDLC Domains this inventory was reorganized from, once they run (e.g. "Workshop 1 Session 3 (DevOps & Pipeline), Session 4 (Knowledge Base) · Workshop 3 Session 9 (AI Governance)")._

---

## Adoption Status Across the Stack

_Populated once tool evidence exists — the categories and grouping below are a shape to fill in, not a fixed taxonomy. Drop categories that don't apply to [[CLIENT_NAME]]; add ones that do._

```mermaid
flowchart LR
    subgraph KP["Knowledge & Planning"]
        direction TB
        KP1["[Tool]\n[purpose]"]
        KP2["[Tool]\n[purpose]"]
    end
    subgraph AI["AI Tools in Active Use"]
        direction TB
        AI1["[Tool]\n[purpose]"]
        AI2["[Tool]\n[purpose]"]
    end
    subgraph INF["AI Infrastructure"]
        direction TB
        INF1["[Tool]\n[purpose]"]
        INF2["[Tool]\n[purpose]"]
    end
    subgraph INT["Integration & Contracts"]
        direction TB
        INT1["[Tool]\n[purpose]"]
    end
    subgraph OBS["Observability"]
        direction TB
        OBS1["[Tool]\n[purpose]"]
    end
    subgraph SEC["Security & Compliance"]
        direction TB
        SEC1["[Tool]\n[purpose]"]
    end
    subgraph DEL["Delivery & CI/CD"]
        direction TB
        DEL1["[Tool]\n[purpose]"]
    end

    classDef live fill:#10B981,stroke:#047857,color:#fff
    classDef flagged fill:#F59E0B,stroke:#B45309,color:#000
    classDef gap fill:#EF4444,stroke:#B91C1C,color:#fff
    classDef planned fill:#6B7280,stroke:#374151,color:#fff

    class KP1,KP2,AI1,AI2,INF1,DEL1 live
    class INF2,INT1 flagged
    class OBS1 gap
    class SEC1 planned

    style KP fill:#FFFBEB,stroke:#F59E0B,color:#B45309
    style AI fill:#EFF6FF,stroke:#3B82F6,color:#1D4ED8
    style INF fill:#F5F3FF,stroke:#8B5CF6,color:#5B21B6
    style INT fill:#F5F3FF,stroke:#8B5CF6,color:#5B21B6
    style OBS fill:#F0FDF4,stroke:#10B981,color:#047857
    style SEC fill:#F0FDF4,stroke:#10B981,color:#047857
    style DEL fill:#F0FDF4,stroke:#10B981,color:#047857
```

**Legend:** 🟢 Live/adopted · 🟠 Live but flagged — ungoverned, partial, or gated on a decision · 🔴 Explicit gap — named but unaddressed · ⚫ Planned — not yet started.

---

## Knowledge & Planning Systems

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## AI Tools in Active Use

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## AI Infrastructure

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## Integration & Contracts

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## Observability

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## Security & Compliance

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## Delivery & CI/CD

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

## Product Analytics & Experimentation

_Distinct from the engineering stack above — flag overlaps (e.g. a backend observability tool doubling as a product-metrics source) rather than listing the same tool twice with no cross-reference._

| Tool   | Category   | Purpose / Use Case | Status/Detail                   | Source                 |
| ------ | ---------- | ------------------ | ------------------------------- | ---------------------- |
| [TOOL] | [CATEGORY] | [PURPOSE]          | [Live / Gap / Planned — detail] | [Workshop/Session ref] |

---

This is raw baseline material, not synthesis. Diagnosis and root-cause analysis happen in [Problem Space](/AI%20SDLC/03%20Problem%20Space/), not here — a row flagged 🟠 or 🔴 above is a candidate for a Problem Space finding, not a conclusion in itself.

---

## Changelog

_This page adds no evidence of its own — every change traces to the Current State page it was reorganized from, not to a workshop directly._

| Date   | Change         | Evidence                                                    |
| ------ | -------------- | ----------------------------------------------------------- |
| [DATE] | [WHAT CHANGED] | [Current State page — e.g. Architecture](./Architecture.md) |
