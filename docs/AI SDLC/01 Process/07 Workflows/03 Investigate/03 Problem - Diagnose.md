# Problem — Diagnose

_SDLC Domain evidence gets synthesized into a Problem — a root cause, ranked and evidenced, added to the [Problems](/AI%20SDLC/03%20Problem%20Space/02%20Diagnose/02%20Problems.md) registry._

```mermaid
sequenceDiagram
    participant SDLC as SDLC Domain page(s)
    participant Lead as Discovery Team
    participant PR as Problems
    actor Stake as Stakeholders

    rect rgb(255, 237, 213)
    Note over Lead,PR: Once a domain's evidence points to a root cause
    SDLC-->>Lead: Evidence across one or more domains
    Lead->>PR: Draft / update a Problem — ID, impact, source, SDLC Domain link
    Lead->>Stake: Review
    Stake-->>Lead: Corroborate, quantify, or retract
    Lead->>PR: Publish + Changelog
    end
```

**Status moves forward only.** A Problem is 🟡 **Reported** the moment a single source names it, 🟢 **Confirmed** once a second, independent source corroborates it, 🔵 **Measured** once a number backs the impact claim, or ⚫ **Retracted** if it turns out to be wrong — the reason stays on record, the ID is never reused. Most problems in a discovery-scale engagement settle at 🟡 or 🟢; few reach 🔵.

**Reiterate while still green.** Keep looping draft → validate as long as each pass still changes the picture — stop once the root cause holds steady across a validation session. That's what makes the Problem eligible for [Solution Goals](./04%20Goals%20-%20Solution%20Goals.md).

→ [Goals — Solution Goals](./04%20Goals%20-%20Solution%20Goals.md) for how a confirmed Problem turns into a grounded goal. → [Problem — SDLC Domains](./02%20Problem%20-%20SDLC%20Domains.md) for where this evidence comes from.
