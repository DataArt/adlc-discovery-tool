# Workshop Agenda — WS 4 (People & Context) — Date TBD

_DataArt × [[CLIENT_NAME]] Agentic SDLC Discovery Workshop. Single session, target ≤2 hours._

**Purpose:** Cover the organisational and context layer — how team structure and cross-team integration shape delivery, and whether the knowledge base is trustworthy enough to be AI context.

---

## Session Flow

| Time      | Block                         |
| --------- | ----------------------------- |
| 0:00–0:10 | Opening & framing             |
| 0:10–0:55 | Topic 1 — Teams & Integration |
| 0:55–1:00 | Break / transition            |
| 1:00–1:45 | Topic 2 — Knowledge Base      |
| 1:45–2:00 | Closing — carry-forwards      |

---

## Opening (~10 min) — Framing

Anchor on the engagement's central question (see [Goals — Strategic Intent](/AI%20SDLC/04%20Goals/02%20Strategic%20Intent.md)). Set this session's goal and remind the room how findings feed the [Problem Space](/AI%20SDLC/03%20Problem%20Space/).

- Recap and validate findings from [WS 3](../WS%203%20%28Delivery%20Mechanics%29%20-%20Date%20TBD/Outcomes.md) (DevOps & Pipeline · Ceremony Overhead) before opening new topics — confirm what was captured is accurate, surface corrections, and close any carry-forwards.

---

## Topic 1 — Teams & Integration

> **Key question:** How do team structure and cross-team integration patterns shape — or constrain — the organisation's ability to adopt AI tooling?

**Diagnoses:** [Challenge — The Fragmentation](/The%20Story/03%20Challenges.md#the-fragmentation) · [Challenge — The Mental Model Shift](/The%20Story/03%20Challenges.md#the-mental-model-shift) · [Problem Space — Teams & Integration](/AI%20SDLC/03%20Problem%20Space/06%20Teams%20%26%20Integration.md)

**Baseline:** [Current State — Process](/AI%20SDLC/02%20Vision/01%20Current%20State/Process.md) · [Current State — Context Topology](/AI%20SDLC/02%20Vision/01%20Current%20State/Context%20Topology.md)

- How squads are structured: dedicated product squads, shared platform teams, embedded roles
- Where cross-team friction creates the most delay

### Survey — Teams & Integration

1. Describe a typical squad — how many people, which roles, and how are they organised?
2. Are there roles shared across squads rather than embedded — QA, DevOps, architecture, UX? How does that sharing work, and where does it cause delays?
3. When a squad needs something from another team — an API, a platform capability, a decision — what does that process look like, and how long does it take?
4. How do teams currently communicate about breaking changes or cross-cutting decisions? Formal mechanism, or informal?
5. On a typical feature, how many teams need to be involved or informed before work can start? Which dependencies take longest to resolve?
6. If AI agents were operating across team boundaries — reading tickets, proposing designs, generating code — which integration points would need the clearest protocols?
7. Is code currently treated as the primary reviewed deliverable, with docs/context an afterthought — or is there already an expectation that context carries equal weight? How would that land if introduced?
8. What tool(s) mediate cross-team communication and dependency requests today (Slack, Teams, Jira, ServiceNow, email)?

---

## Topic 2 — Knowledge Base

> **Key question:** Who owns the organisation's internal knowledge, how is it kept current, and is it consistent enough to be trusted as AI context?

**Diagnoses:** [Challenge — The Drift](/The%20Story/03%20Challenges.md#the-drift) · [Challenge — Inconsistent Topology](/The%20Story/03%20Challenges.md#inconsistent-topology) · [Challenge — Session Amnesia](/The%20Story/03%20Challenges.md#session-amnesia) · [Problem Space — Knowledge Base](/AI%20SDLC/03%20Problem%20Space/05%20Knowledge%20Base.md)

**Baseline:** [Current State — Context Topology](/AI%20SDLC/02%20Vision/01%20Current%20State/Context%20Topology.md)

- Inventory of internal knowledge stores: where knowledge lives today
- Ownership, governance, and maintenance model

### Survey — Knowledge Base

1. Where does a new developer go first when they need to understand a service or process — and does that source reliably have the right answer?
2. Who owns the internal knowledge base? Is there a named person or team responsible for its quality?
3. How is it kept current? Is there a process that triggers an update after a release, incident, or architectural change — or does it drift?
4. How consistent is documentation across teams? Would a developer from one team navigate another team's docs without guidance?
5. If an AI agent needed to answer "what does this service do and what does it depend on," which parts of current documentation could it trust, and which would mislead it?
6. Who has the authority to set and enforce documentation standards across teams?
7. When a new session or sprint starts, does it pick up exactly where the last one left off, or does the team re-explain decisions and context that were already established?
8. Which specific tool is the primary knowledge base today (Confluence, Notion, GitHub wiki, README files) — is it the same one across every team, or does each team keep its own?

---

## Closing (~15 min)

Capture and record:

- Pain points surfaced — candidates for [Teams & Integration](/AI%20SDLC/03%20Problem%20Space/06%20Teams%20%26%20Integration) and [Knowledge Base](/AI%20SDLC/03%20Problem%20Space/05%20Knowledge%20Base)
- Strategic Intent validated — confirmations, reorders, or cuts for [Goals — Strategic Intent](/AI%20SDLC/04%20Goals/02%20Strategic%20Intent.md)
- What's already working — do not disrupt
- Open questions / carry-forwards, with an owner and next step for each
