# Outcomes — Gate 2 (Solution Approval) · Date TBD

_Live capture during session + post-session synthesis. Added once the session has actually run — this is a placeholder shape, not real content._

---

## Summary

[3-5 sentence synthesis: what was covered, what the session established, what it did not reach.]

---

## Session Blocks

_Captured live during the session._

```mermaid
mindmap
  root(("Gate 2\nOutcomes"))
    🟢 Recap Target State
      [Sub-point]
    🟡 Present Pilot Design
      [Sub-point]
    🟡 Present Scale Design
      [Sub-point]
```

| Legend | Reception                                                    |
| ------ | ------------------------------------------------------------ |
| 🟢     | Confirmed — no pushback, straightforward approval            |
| 🟡     | Confirmed with caveats — approved, but flagged for follow-up |
| 🔴     | Not confirmed — flagged for re-evaluation                    |

| #   | Block                | Reception    |
| --- | -------------------- | ------------ |
| 1   | Recap Target State   | 🟢 / 🟡 / 🔴 |
| 2   | Present Pilot Design | 🟢 / 🟡 / 🔴 |
| 3   | Present Scale Design | 🟢 / 🟡 / 🔴 |

---

## Findings

_Post-session. One sub-section per block that produced a decision or a flag. Feeds the Target State / Pilot / Scale approval status directly — do not let a finding stop here._

### Recap Target State — [finding title]

[Narrative finding — what was confirmed, flagged, or corrected.]

### Present Pilot Design — [finding title]

[Narrative finding.]

---

## Next Steps

```mermaid
flowchart LR
    subgraph Immediate["Immediate"]
        direction TB
        A["[Action]"] --> B["[Action]"]
    end
    subgraph ShortTerm["Short-term"]
        direction TB
        C["[Action]"] --> D["[Action]"]
    end
    subgraph Decisions["Decisions needed"]
        direction TB
        E["[Decision]"]
    end

    Immediate --> ShortTerm

    classDef action fill:#10B981,stroke:#047857,color:#fff
    classDef decision fill:#F59E0B,stroke:#B45309,color:#000

    class A,B,C,D action
    class E decision

    style Immediate fill:#ECFDF5,stroke:#047857,color:#047857
    style ShortTerm fill:#EFF6FF,stroke:#1D4ED8,color:#1D4ED8
    style Decisions fill:#FFFBEB,stroke:#B45309,color:#B45309
```

| Legend   | Meaning                           |
| -------- | --------------------------------- |
| 🟢 Green | Immediate action — start now      |
| 🔵 Blue  | Short-term action                 |
| 🟡 Amber | Decision needed before proceeding |

|                  | Item          | Owner | By  |
| ---------------- | ------------- | ----- | --- |
| ✅ Action        | [description] |       |     |
| 🔵 Decision      | [description] |       |     |
| 📋 Carry-forward | [description] |       |     |

---

## Gate Outcome

**Result:** [approved / flagged: `<items>`]

[If flagged, name the item(s) and where they re-open per `03 How the Engagement Runs.md`'s loop-back note.]
