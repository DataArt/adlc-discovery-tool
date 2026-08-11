# Workshop Agenda — WS 5 (Baseline & Guardrails) — Date TBD

_DataArt × [[CLIENT_NAME]] Agentic SDLC Discovery Workshop. Single session, target ≤2 hours._

**Purpose:** Cover the cross-cutting Areas — the smallest credible measurement baseline for a pilot, and the governance (data exposure, IP, and AI token/consumption controls) that lets a pilot start without stalling.

_Requires Compliance/Security and Finance attendance for the Governance topic — confirm before scheduling._

---

## Session Flow

| Time      | Block                                                 |
| --------- | ----------------------------------------------------- |
| 0:00–0:10 | Opening & framing                                     |
| 0:10–0:45 | Topic 1 — Measurement                                 |
| 0:45–0:50 | Break / transition                                    |
| 0:50–1:45 | Topic 2 — Governance (data exposure + token controls) |
| 1:45–2:00 | Closing — carry-forwards                              |

_Governance covers two related sub-topics in one block — trim survey questions if both don't fit in the time available._

---

## Opening (~10 min) — Framing

Anchor on the engagement's central question (see [Connect Framework → Goals](/AI%20SDLC/01%20Process/02%20Goals.md)). Set this session's goal and remind the room how findings feed the [Problem Space](/AI%20SDLC/03%20Problem%20Space/).

- Recap and validate findings from [WS 4](../WS%204%20%28People%20%26%20Context%29%20-%20Date%20TBD/Outcomes.md) (Teams & Integration · Knowledge Base) before opening new topics — confirm what was captured is accurate, surface corrections, and close any carry-forwards.

---

## Topic 1 — Measurement

> **Key question:** What is the smallest credible measurement baseline that can stand up before the pilot starts?

- Candidate metric set: delivery-lifecycle metrics plus stage-level cycle times (idea → story → design → build → test → release)
- What data already exists in the team's own tools today

### Survey — Measurement

1. What metrics does the team currently track, and how often are they reviewed?
2. At what granularity does cycle-time data exist today — epic, story, PR, or finer?
3. Has surfacing lower-level metrics been resisted before? What was the concern?
4. What data is available right now that could form a baseline with minimal instrumentation?
5. What would a credible "before" picture look like — what would need to move for the pilot to be declared a success?
6. Who would own the measurement baseline and reporting cadence during the pilot?

---

## Topic 2 — Governance

_Requires Compliance/Security and Finance attendance._

> **Key question:** What is the minimum viable governance — covering data exposure, IP, and token spend — that protects the organisation without stalling the pilot?

- No formal data governance outside regulated-data services is a common starting point; extending it to cover AI tooling is the gap
- Pragmatic data classification: public / internal / restricted / regulated
- Token spend and consumption controls are a subset of the same governance question — who can spend what, on what, and who's accountable

### Survey — Data Exposure & IP

1. Who currently decides what data can be sent to an external AI model — a named person, a policy document, or neither?
2. How is sensitive data classified today outside regulated-data services? Is there a documented taxonomy?
3. What do current AI vendor contracts say about data retention and model training? Has this been reviewed recently?
4. If an AI agent needed read access to source code, tickets, and internal documentation today — who would approve that, and how long would it take?
5. What is the minimum governance framework that would let a pilot start within a defined runway?
6. Who should own ongoing AI governance after the pilot starts?

### Survey — Token Controls & Consumption

1. How are AI tool costs tracked today — per seat, per team, or not at all?
2. Has usage ever been exhausted or throttled unexpectedly? Who noticed, and what was the workaround?
3. What level of cost attribution would be useful to leadership — per squad, per role, per feature, or per story?
4. What guardrails would the business need before an autonomous agent could take a consequential action (API call, ticket creation, code push) unsupervised?
5. Is there a target cost-per-outcome the business would recognise as acceptable?
6. Who should set and own token budgets during the pilot — Engineering, Finance, or a joint function?

---

## Closing (~15 min)

Capture and record:

- Pain points surfaced — candidates for [Measurement](/AI%20SDLC/03%20Problem%20Space/09%20Measurement) and [Governance](/AI%20SDLC/03%20Problem%20Space/10%20Governance)
- What's already working — do not disrupt
- Open questions / carry-forwards, with an owner and next step for each
- Pilot candidate synthesis now happens in [WS 6 — Product & Projects](../WS%206%20%28Product%20%26%20Projects%29%20-%20Date%20TBD/Agenda.md); this session's job is to leave clean, validated findings for it to draw on
