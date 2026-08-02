# Workshop Agenda — WS 3 (Delivery Mechanics) — Date TBD

_DataArt × [[CLIENT_NAME]] Agentic SDLC Discovery Workshop. Single session, target ≤2 hours._

**Purpose:** Cover the delivery mechanics — the CI/CD toolchain and where it adds friction — and the process overhead that exists largely because information is missing upstream.

---

## Session Flow

| Time      | Block                       |
| --------- | --------------------------- |
| 0:00–0:10 | Opening & framing           |
| 0:10–0:55 | Topic 1 — DevOps & Pipeline |
| 0:55–1:00 | Break / transition          |
| 1:00–1:45 | Topic 2 — Ceremony Overhead |
| 1:45–2:00 | Closing — carry-forwards    |

---

## Opening (~10 min) — Framing

Anchor on the engagement's central question (see [Connect Framework → Goals](/AI%20SDLC/Connect%20Framework/02%20Goals.md)). Set this session's goal and remind the room how findings feed the [Problem Space](/AI%20SDLC/Problem%20Space/).

- Recap and validate findings from [WS 2](../WS%202%20%28Design%20to%20Code%29%20-%20Date%20TBD/Outcomes.md) (Technical Design · Implementation) before opening new topics — confirm what was captured is accurate, surface corrections, and close any carry-forwards.

---

## Topic 1 — DevOps & Pipeline

> **Key question:** What does the delivery toolchain actually look like, and where does it add friction rather than confidence?

- CI/CD stack, pipeline ownership, and current run times
- Flaky tests and pipeline failures as named delivery constraints

### Survey — DevOps & Pipeline

1. Walk me through a change from merged PR to production — what are the stages, who approves, and how long does each take on a good day?
2. What is the current CI/CD stack and who owns the pipeline configuration?
3. What proportion of pipeline failures in a typical week are flaky (intermittent) vs genuine (real defects)? How long does a developer spend investigating a failed build?
4. How are test environments provisioned — on-demand, shared, or something else? What are the common points of contention?
5. What is the current release cadence, and what is the biggest constraint preventing more frequent releases?
6. Has the team experimented with AI-assisted test generation or pipeline optimisation? What happened?

---

## Topic 2 — Ceremony Overhead

> **Key question:** If requirements and impact analysis arrived pre-drafted and trustworthy, what would refinement and planning look like?

- Which ceremonies exist because information is missing upstream — and would shrink if earlier Areas improved
- The mindset shift required: workflow redesign, not a tool overlay

### Survey — Ceremony Overhead

1. How many hours per sprint does a developer spend in refinement, planning, and backlog grooming — and what proportion feels productive?
2. Which ceremonies exist primarily because information was missing at the point of creation — and would be shorter if that information arrived earlier?
3. How often do stories get re-refined or re-estimated because the original understanding was wrong?
4. What is the biggest recurring topic that slows down a refinement session?
5. If an AI assistant could draft a refinement agenda, pre-answer common questions, and flag missing information before the session started — what would change about how the meeting runs?
6. What would a team need to believe about AI outputs before trusting them as input into a planning session?

---

## Closing (~15 min)

Capture and record:

- Pain points surfaced — candidates for [DevOps & Pipeline](/AI%20SDLC/Problem%20Space/04%20DevOps%20%26%20Pipeline) and [Ceremony Overhead](/AI%20SDLC/Problem%20Space/08%20Ceremony%20Overhead)
- What's already working — do not disrupt
- Open questions / carry-forwards, with an owner and next step for each
