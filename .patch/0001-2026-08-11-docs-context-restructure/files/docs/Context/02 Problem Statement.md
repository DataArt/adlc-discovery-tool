# The Real Problem: Context

Think about onboarding a new engineer. You would give them:

- the system architecture — how the product is designed and why
- the team conventions — how things are done here, not just anywhere
- the current state — what has been built, what has diverged, what is still pending
- a scoped task — one ticket, not the whole backlog

Without that onboarding, a senior engineer will still produce output — fast, confident, and inconsistent. They will contradict decisions already made, miss conventions already established, and lose thread between sessions.

**An AI assistant has exactly the same problem.** Every session starts from zero. It has no memory of your architecture decisions, no awareness of your conventions, and no connection to your documentation. Execution is fast. Direction is absent.

The fix is the same as with a new colleague: structured onboarding, maintained context, and a shared source of truth that stays current as the project evolves.

---

## Problem 1 — The Drift

> **By the time a system is mature:** decisions live in Slack, implementation is the only thing that's current, and documentation describes a system that no longer exists.

This is not a new problem. It exists on every project, with or without AI.

```mermaid
flowchart LR
    D[Decisions<br/>and Rationale] -->|documented as| DOC[Documentation<br/>HLD and design records] -->|code follows| CODE[Implementation<br/>code and services]

    D2[scattered<br/>Slack, PRs, memory]
    DOC2[frozen<br/>describes old system]
    CODE2[growing fast<br/>only truth by default]

    D -.->|6 months| D2
    DOC -.->|6 months| DOC2
    CODE -.->|6 months| CODE2

    classDef green fill:#27AE60,stroke:#1E8449,color:#fff
    classDef red fill:#922B21,stroke:#7B241C,color:#fff
    class D,DOC,CODE green
    class D2,DOC2,CODE2 red
```

The gap between all three compounds over time. Decisions made six months ago are invisible. The documentation describes a system that no longer exists. Implementation becomes the only source of truth — by accident, not by design.

This is the environment an AI assistant inherits every session.

A human engineer at least carries some of that history in memory. An AI starts from zero — and if the context it receives is stale, partial, or contradictory, its output will be too. Fast, confident, and wrong in ways that are hard to trace back.

---

## Problem 2 — The Uneven Depth

> **Over-documented where it doesn't matter. Silent where it does.**

Meet the customer portal. Two teams. Both have docs in Confluence. Both passed Technical Design Compliance.

```mermaid
flowchart TD
    TDC["Technical Design Compliance<br/>docs exist · sections present · signed off<br/>Team A: passed     Team B: passed"]

    A["Team A — Auth and Users<br/>Over-specified<br/>schema fields, payload shapes, token expiry"]
    B["Team B — Dashboard and Orders<br/>Under-specified<br/>implement it · make it secure · best practices"]

    MID["The Missing Middle<br/>Why this architecture?<br/>Which tradeoffs were accepted?<br/>What does good look like here?"]

    TDC --> A & B
    A -->|does not cover| MID
    B -->|does not cover| MID

    classDef pass fill:#27AE60,stroke:#1E8449,color:#fff
    classDef over fill:#2471A3,stroke:#1A5276,color:#fff
    classDef under fill:#7F8C8D,stroke:#616A6B,color:#fff
    classDef missing fill:#922B21,stroke:#7B241C,color:#fff

    class TDC pass
    class A over
    class B under
    class MID missing
```

| Area               | Team A wrote                            | Team B wrote              | AI produces                                                       |
| ------------------ | --------------------------------------- | ------------------------- | ----------------------------------------------------------------- |
| **Auth**           | JWT payload fields, token expiry: 3600s | "implement secure auth"   | Invents the session strategy — contradicts undocumented decisions |
| **Error handling** | HTTP status codes per endpoint          | "handle errors properly"  | Applies generic patterns — misses any project convention          |
| **Performance**    | _(not documented)_                      | _(not documented)_        | Assumes generic targets — actual SLAs exist nowhere               |
| **Dashboard data** | _(not in scope for Team A)_             | "show relevant user info" | Invents the data model — inconsistent with Team A's schema        |

The problem is not that teams write too much or too little. It is that **TDC checked whether docs exist — not whether they are useful.** The middle layer — why decisions were made, what tradeoffs were accepted, what good looks like on this project — is absent from both teams and invisible to the compliance process.

A human engineer fills that gap from experience and asking colleagues. **An AI fills it with generic patterns** — whatever looks reasonable with no project-specific signal. The output is plausible, consistent with itself, and quietly wrong in ways that only surface later.

---

## Problem 3 — Inconsistent Topology

> **No two projects speak the same language.** Without a shared skeleton, every new contributor — human or AI — navigates by guesswork.

Every team, every project, every engagement starts from scratch — different folder structures, different naming conventions, different doc formats, different definition of "done." There is no shared skeleton.

In regulated industries — healthcare, government, finance — architecture must pass an **Architecture Review Board** via a Technical Design Compliance document. The ARB does real work: it checks security posture, cost estimates, alignment with company standards. Each project having its own conventions is expected and fine at that level.

But the ARB operates at the **company level**. It does not produce a project-level skeleton. Once approved, every project is still on its own — different folder structures, different doc formats, different definition of done, different way of capturing decisions.

```mermaid
flowchart TD
    ARB["Architecture Review Board<br/>TDC template: Word doc or Confluence page<br/>submitted, approved, updated through a manual change process"]

    P1["Project Alpha<br/>────────────<br/>wiki/ — decisions.docx<br/>src/modules/auth/<br/>Jira + Confluence"]
    P2["Project Beta<br/>────────────<br/>README.md at root<br/>services/authentication/<br/>Notion + Linear"]
    P3["Project Gamma<br/>────────────<br/>docs/ — architecture.md<br/>app/auth-service/<br/>SharePoint + DevOps"]

    AI["AI or new engineer<br/>different structure every time<br/>under-instructed, making guesses<br/>inconsistency compounds"]

    ARB --> P1 & P2 & P3
    P1 & P2 & P3 --> AI

    classDef arb fill:#27AE60,stroke:#1E8449,color:#fff
    classDef proj fill:#2471A3,stroke:#1A5276,color:#fff
    classDef ai fill:#922B21,stroke:#7B241C,color:#fff

    class ARB arb
    class P1,P2,P3 proj
    class AI ai
```

|             | Project Alpha            | Project Beta               | Project Gamma       |
| ----------- | ------------------------ | -------------------------- | ------------------- |
| **Docs**    | `wiki/` — Word docs      | `README.md` at root        | `docs/` — Markdown  |
| **ADRs**    | `decisions.docx` in wiki | PR descriptions            | nothing             |
| **Code**    | `src/modules/auth/`      | `services/authentication/` | `app/auth-service/` |
| **Tests**   | alongside `src/`         | `__tests__/` at root       | no convention       |
| **Tracker** | Jira + Confluence        | Notion + Linear            | SharePoint + DevOps |

The ARB is not the problem. The gap is one level below it — at the project level, there is no shared skeleton. The harness-bootstrap fills exactly that: a consistent project-level structure generated once, so that AI always knows where things are, what conventions apply, and how to interpret context. Not replacing company governance — complementing it one layer down.

Every new engineer, every SA scoping a project, every team inheriting a legacy codebase pays the cost of that missing skeleton. There is no portable foundation — only starting over.

---

## Problem 4 — No Feedback Loop

> **Hard-won patterns die with the project. The next team starts from zero.**

Hard-won lessons stay in post-mortems, retrospectives, and the memories of people who were there. The next project inherits the same starting point — and often the same mistakes.

```mermaid
flowchart LR
    PR1["Project A<br/>delivers"]
    LRN["Learnings<br/>what worked, what broke<br/>which shortcuts cost 3 weeks"]
    PR2["Project B<br/>starts from scratch"]

    PR1 -->|"captured in"| LRN
    LRN -.->|"intended to reach"| PR2
    LRN --x|"actually reaches"| PR2

    LOST["post-mortem doc nobody reads<br/>Confluence page nobody finds<br/>senior engineer who left"]

    LRN -->|"lands in"| LOST

    classDef proj fill:#2471A3,stroke:#1A5276,color:#fff
    classDef lost fill:#922B21,stroke:#7B241C,color:#fff
    classDef lrn fill:#7F8C8D,stroke:#616A6B,color:#fff

    class PR1,PR2 proj
    class LRN lrn
    class LOST,lost lost
```

The cost is invisible because the next project never knows what it missed.

---

## Problem 5 — Session Amnesia

> **Good context at 9am. Gone by tomorrow.**

Even when an AI is given good context at the start of a session, it does not persist. The next session starts from zero. Mid-session, context degrades as the conversation grows. There is no memory of decisions made last Tuesday, no awareness of the convention established three sprints ago.

```mermaid
flowchart LR
    S1["Session 1<br/>context built up<br/>decisions made<br/>conventions agreed"]
    R1(["RESET<br/>context lost"])
    S2["Session 2<br/>starts from zero<br/>re-discovers the same ground<br/>time wasted"]
    R2(["RESET<br/>context lost"])
    S3["Session 3<br/>starts from zero<br/>misses what session 1 decided<br/>contradictions emerge"]

    S1 --> R1 --> S2 --> R2 --> S3

    classDef session fill:#2471A3,stroke:#1A5276,color:#fff
    classDef reset fill:#922B21,stroke:#7B241C,color:#fff

    class S1,S2,S3 session
    class R1,R2 reset
```

A team that runs AI without structured context management is re-onboarding a new colleague every morning.
