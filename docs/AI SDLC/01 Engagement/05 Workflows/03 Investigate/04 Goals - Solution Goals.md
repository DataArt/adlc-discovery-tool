# Goals — Solution Goals

_A diagnosed Problem plus the matching Strategic Intent combine into an early Solution Goals draft — the same grounding filter [Gate Review](../02%20Gate%20Review.md) applies formally, run early per domain when the evidence is already solid._

```mermaid
sequenceDiagram
    participant PR as Problems
    participant IN as Strategic Intent
    participant Lead as Discovery Team
    participant SG as Solution Goals (draft)
    actor Stake as Stakeholders

    rect rgb(240, 253, 244)
    Note over Lead,SG: Once a domain's root cause holds steady
    PR-->>Lead: Confirmed Problem for this domain
    IN-->>Lead: Matching Strategic Intent entry
    Lead->>SG: Draft a Solution Goal, grounded in both
    Lead->>Stake: Review
    Stake-->>Lead: Feedback
    Lead->>SG: Publish + Changelog
    end
```

**Optional, once a root cause holds steady.** A domain doesn't have to wait for the formal [Gate Review](../02%20Gate%20Review.md) to get an early Solution Goals draft if its Problem Space evidence is already solid — same capture → review → publish pattern, same Changelog trail. Gate Review is still where the full set gets aligned, prioritised, and scored against Strategic Intent.

This is the last part of Investigate — its output feeds [Gate Review](../02%20Gate%20Review.md) directly. → [Orchestration](./00%20Orchestration.md) for how all four parts chain together.
