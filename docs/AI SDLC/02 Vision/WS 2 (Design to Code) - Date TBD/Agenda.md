# Workshop Agenda — WS 2 (Design to Code) — Date TBD

_DataArt × [[CLIENT_NAME]] Agentic SDLC Discovery Workshop. Single session, target ≤2 hours._

**Purpose:** Cover how code actually gets designed and built — the architectural documentation that makes impact analysis possible, and where AI is already applied to the coding step itself.

---

## Session Flow

| Time      | Block                      |
| --------- | -------------------------- |
| 0:00–0:10 | Opening & framing          |
| 0:10–0:55 | Topic 1 — Technical Design |
| 0:55–1:00 | Break / transition         |
| 1:00–1:45 | Topic 2 — Implementation   |
| 1:45–2:00 | Closing — carry-forwards   |

---

## Opening (~10 min) — Framing

Anchor on the engagement's central question (see [Process → Goals](/AI%20SDLC/01%20Process/02%20Goals.md)). Set this session's goal and remind the room how findings feed the [Problem Space](/AI%20SDLC/03%20Problem%20Space/).

- Recap and validate findings from [WS 1](../WS%201%20%28Upstream%20%26%20Design%29%20-%20Date%20TBD/Outcomes.md) (Requirements & Stories · Design & UX) before opening new topics — confirm what was captured is accurate, surface corrections, and close any carry-forwards.

---

## Topic 1 — Technical Design

> **Key question:** What minimum documentation standard makes agentic impact analysis viable, and who maintains it?

**Diagnoses:** [Challenge — The Drift](/Context/02%20Challenges.md#the-drift) · [Challenge — The Legacy Wall](/Context/02%20Challenges.md#the-legacy-wall) · [Problem Space — Technical Design](/AI%20SDLC/03%20Problem%20Space/07%20Technical%20Design.md)

**Baseline:** [Current State — Architecture](/AI%20SDLC/02%20Vision/01%20Current%20State/Architecture.md) · [Current State — Context Topology](/AI%20SDLC/02%20Vision/01%20Current%20State/Context%20Topology.md)

- A single service can span multiple systems and tech stacks
- What AI-assisted impact analysis requires: dependency knowledge, service maps, accurate documentation

### Survey — Technical Design

1. When a developer is handed a new feature, how do they figure out which services, databases, or external systems will be affected?
2. What documentation, if it existed and was trustworthy, would cut the most time from impact analysis?
3. How are service dependencies currently recorded — architecture diagrams, runbooks, code comments, or team memory?
4. How often does an impact analysis miss a dependency that surfaces later as a bug or incident?
5. Who is responsible for keeping service maps and architectural diagrams current?
6. What is the rough split of a developer's time on a typical ticket: impact analysis vs design vs coding vs testing?
7. Which specific tool holds architecture diagrams and service maps today (Confluence, Backstage, draw.io, Lucidchart, a repo README)?

---

## Topic 2 — Implementation

> **Key question:** Where has AI already been applied to the coding step itself, and why hasn't that translated into faster overall delivery?

**Diagnoses:** [Challenge — Vendor Lock-In](/Context/02%20Challenges.md#vendor-lock-in) · [Problem Space — Implementation](/AI%20SDLC/03%20Problem%20Space/11%20Implementation.md)

**Baseline:** [Current State — Process](/AI%20SDLC/02%20Vision/01%20Current%20State/Process.md) · [Current State — Architecture](/AI%20SDLC/02%20Vision/01%20Current%20State/Architecture.md)

- Candidate hypothesis: commit or PR volume may be up since AI coding tools were introduced, while lead time hasn't moved proportionally
- Coding-step gains only show up in delivery if the rest of the pipeline absorbs the extra throughput

### Survey — Implementation

1. Which AI tools are developers using day-to-day for writing code, and how widely adopted are they across teams?
2. Has commit or PR volume changed since AI coding tools were introduced? Has lead time (idea to production) changed by a similar margin?
3. If coding got faster but delivery didn't, where does the saved time go — review, testing, deployment, or somewhere upstream?
4. What would need to be true elsewhere in the pipeline for faster coding to actually show up as faster delivery?
5. Is there a risk that AI-generated code increases downstream rework (review time, defect rate) in a way that offsets the coding-speed gain?
6. What coding standards or conventions are enforced today, and are they legible enough for an AI tool to follow without supervision?
7. If the team switched AI coding tools or vendors next year, how much of today's setup — prompts, conventions, tool integrations — would have to be rebuilt versus carried over unchanged?

---

## Closing (~15 min)

Capture and record:

- Pain points surfaced — candidates for [Technical Design](/AI%20SDLC/03%20Problem%20Space/07%20Technical%20Design) and [Implementation](/AI%20SDLC/03%20Problem%20Space/11%20Implementation)
- Goal signals surfaced — candidates for [Process → Goals](/AI%20SDLC/01%20Process/02%20Goals.md)
- What's already working — do not disrupt
- Open questions / carry-forwards, with an owner and next step for each
