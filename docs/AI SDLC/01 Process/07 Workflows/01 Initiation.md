# Initiation

_How a raw trigger becomes a published Strategic Intent and an Early Direction — the two artifacts Gate 0 closes on._

```mermaid
sequenceDiagram
    actor Sponsor as Sponsor / Leadership
    participant Lead as Discovery Team
    participant SI as Strategic Intent<br/>(Goals)
    actor Stake as Stakeholders
    participant ED as Early Direction<br/>(Solution Space)

    rect rgb(255, 251, 235)
    Note over Sponsor,Lead: Capture
    Sponsor->>Lead: Raw intent — kickoff call, RFP, sales notes
    Lead->>SI: Draft close to verbatim, not yet a scored objective
    end

    rect rgb(239, 246, 255)
    Note over Lead,Stake: Review → publish
    Lead->>Stake: Present the draft
    Stake-->>Lead: Confirm, reorder, or cut
    Lead->>SI: Publish + add a Changelog row
    end

    rect rgb(240, 253, 244)
    Note over Lead,ED: Derive Early Direction
    Lead->>ED: Draft from the same intake — likely pilot domain, known constraints, stated aspirations
    Lead->>Stake: Review
    Stake-->>Lead: Feedback
    Lead->>ED: Publish + add a Changelog row
    ED-->>SI: Changelog row cites the Strategic Intent entries it derives from
    end
```

**Capture.** Strategic Intent is captured via `/bootstrap-client` from sales conversations, an RFP, or kickoff discussions — before Capture workshops begin. [Strategic Intent](/AI%20SDLC/04%20Goals/02%20Strategic%20Intent.md)'s Illustrative Patterns are a starting prompt for that conversation, not a checklist to accept as-is.

**Review → publish.** The draft goes to whoever's sponsoring the engagement for a sanity check before it's treated as settled — this is a light pass, not a workshop; Capture does the real validation later. Publishing means editing `Strategic Intent.md` directly and adding a row to its `## Changelog`.

**Derive Early Direction.** The same intake conversation almost always signals more than raw intent — a likely pilot domain, a known constraint, a stated aspiration. That goes into [Solution Space](/AI%20SDLC/05%20Solution%20Space/index.md)'s `## Early Direction` section as an explicit, labelled hypothesis — not a confirmed finding, refined once Problem Space evidence exists. Its Changelog row cites the Strategic Intent it was derived from, so the trace holds in both directions.

Initiation runs once, at Gate 0. Strategic Intent isn't re-captured after this — it's only ever _validated_ (by [Investigate](./03%20Investigate/00%20Orchestration.md)) or _grounded and re-scoped_ (by [Gate Review](./02%20Gate%20Review.md)).
