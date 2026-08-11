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

Anchor on the engagement's central question (see [Connect Framework → Goals](/AI%20SDLC/01%20Process/02%20Goals.md)). Set this session's goal and remind the room how findings feed the [Problem Space](/AI%20SDLC/03%20Problem%20Space/).

- Recap and validate findings from [WS 3](../WS%203%20%28Delivery%20Mechanics%29%20-%20Date%20TBD/Outcomes.md) (DevOps & Pipeline · Ceremony Overhead) before opening new topics — confirm what was captured is accurate, surface corrections, and close any carry-forwards.

---

## Topic 1 — Teams & Integration

> **Key question:** How do team structure and cross-team integration patterns shape — or constrain — the organisation's ability to adopt AI tooling?

- How squads are structured: dedicated product squads, shared platform teams, embedded roles
- Where cross-team friction creates the most delay

### Survey — Teams & Integration

1. Describe a typical squad — how many people, which roles, and how are they organised?
2. Are there roles shared across squads rather than embedded — QA, DevOps, architecture, UX? How does that sharing work, and where does it cause delays?
3. When a squad needs something from another team — an API, a platform capability, a decision — what does that process look like, and how long does it take?
4. How do teams currently communicate about breaking changes or cross-cutting decisions? Formal mechanism, or informal?
5. On a typical feature, how many teams need to be involved or informed before work can start? Which dependencies take longest to resolve?
6. If AI agents were operating across team boundaries — reading tickets, proposing designs, generating code — which integration points would need the clearest protocols?

---

## Topic 2 — Knowledge Base

> **Key question:** Who owns the organisation's internal knowledge, how is it kept current, and is it consistent enough to be trusted as AI context?

- Inventory of internal knowledge stores: where knowledge lives today
- Ownership, governance, and maintenance model

### Survey — Knowledge Base

1. Where does a new developer go first when they need to understand a service or process — and does that source reliably have the right answer?
2. Who owns the internal knowledge base? Is there a named person or team responsible for its quality?
3. How is it kept current? Is there a process that triggers an update after a release, incident, or architectural change — or does it drift?
4. How consistent is documentation across teams? Would a developer from one team navigate another team's docs without guidance?
5. If an AI agent needed to answer "what does this service do and what does it depend on," which parts of current documentation could it trust, and which would mislead it?
6. Who has the authority to set and enforce documentation standards across teams?

---

## Closing (~15 min)

Capture and record:

- Pain points surfaced — candidates for [Teams & Integration](/AI%20SDLC/03%20Problem%20Space/06%20Teams%20%26%20Integration) and [Knowledge Base](/AI%20SDLC/03%20Problem%20Space/05%20Knowledge%20Base)
- What's already working — do not disrupt
- Open questions / carry-forwards, with an owner and next step for each
