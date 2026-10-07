---
aside: false
outline: false
---

# 4. One workspace, shared contribution

::: tip &#8203;
People bring context. AI helps structure it. The team reviews what becomes shared knowledge.
:::

The product team and architects contribute to the same repository. The web app makes reviewed material easy to read and navigate. AI helps process evidence and identify gaps; people validate interpretations and own the decisions.

| Contribution                   | Shared outcome                                          |
| ------------------------------ | ------------------------------------------------------- |
| **Workshop input**             | Source material the team can revisit.                   |
| **AI-assisted synthesis**      | Proposed notes, findings, and linked updates.           |
| **Branch, commit, and review** | Traceable changes to the engagement’s shared knowledge. |

The two collaboration cases cover joining an engagement and updating a delivery plan.

## The flow

```mermaid
flowchart LR
    subgraph Capture["Capture — outside the repo"]
        direction TB
        WS["Workshop\n(online / offline)"]
        TR["Transcript / written answers"]
        WS --> TR
    end

    subgraph Process["Process — AI-assisted, against this repo"]
        direction TB
        CD["Claude or Codex Desktop\n(product team) — discovery"]
        CC["Claude Code or Codex\n(architects) — design · dev"]
    end

    subgraph Land["Land — in the repo"]
        direction TB
        BR["Branch\ntype/short-description"]
        CM["Commit\ntype(scope): what changed"]
        PR["Pull Request\nreview"]
        BR --> CM --> PR
    end

    Capture --> Process --> Land

    classDef capture fill:#F59E0B,stroke:#B45309,color:#000
    classDef process fill:#8B5CF6,stroke:#5B21B6,color:#fff
    classDef land fill:#3B82F6,stroke:#1D4ED8,color:#fff

    class WS,TR capture
    class CD,CC process
    class BR,CM,PR land

    style Capture fill:#FFFBEB,stroke:#F59E0B,color:#B45309
    style Process fill:#F5F3FF,stroke:#8B5CF6,color:#5B21B6
    style Land fill:#EFF6FF,stroke:#3B82F6,color:#1D4ED8
```

## Related references

- [Team Collaboration](<../AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md>) — roles, contribution flow, and original diagram
- [Quick Walkthrough](<../AI SDLC/01 Engagement/07 Contribution/06 Quick Walkthrough.md>) — copyable prompts for exploring the workspace
- [Getting started case](<05 Getting Started Case.md>) — orientation for a new colleague
- [Day-to-day collaboration case](<06 Day-to-Day Collaboration Case.md>) — a plan update from repository check to a reviewed, deployed change

---

[Presentation](index.md) · [Previous](<03 Evidence Chain.md>) · [Next](<05 Getting Started Case.md>)
